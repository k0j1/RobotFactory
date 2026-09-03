import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import Soundfont from 'soundfont-player';
import { Robot } from '../../core/models';
import { MinigameProps, PIANO_SONGS, PianoNoteData } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import { savePianoScore, getPianoBestScore, PianoBestScore } from '../../core/pianoScoreManager';
import * as Gi from 'react-icons/gi';

interface PianoGameProps extends Omit<MinigameProps, 'activeOpponent'> {
  songId: string;
  onExit?: () => void;
}

// 40白鍵 (A1: 33 〜 E7: 100)
const TOTAL_WHITE_KEYS = 40;

// Web Audio API による高品位グランドピアノシンセサイザー（フォールバック＆即時再生用）
const playSynthesizedPiano = (
  ctx: AudioContext,
  midi: number,
  durationMs: number = 300,
  volume: number = 1.0
) => {
  try {
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const now = ctx.currentTime;
    const durSec = Math.max(0.18, durationMs / 1000);

    // 全体ゲイン
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    // 鋭いハンマー打弦アタック (4ms)
    noteGain.gain.linearRampToValueAtTime(0.38 * volume, now + 0.004);
    // 初期ディケイ (80ms)
    noteGain.gain.exponentialRampToValueAtTime(0.22 * volume, now + 0.08);
    // 自然な弦の減衰
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durSec + 0.45);

    // アコースティックピアノのボディ感を再現するローパスフィルター
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(9000, freq * 4.2), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(4500, freq * 2.1), now + durSec);

    // 基本波（暖かみのある三角波＋微小サイン波）
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // 第2倍音（オクターブ上の倍音）
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.28, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    // 第3倍音（輝きを付加するオーバートーン）
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.12, now);
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    osc1.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    const stopTime = now + durSec + 0.5;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
  } catch (e) {
    console.warn('Synth piano error:', e);
  }
};

export const PianoGame: React.FC<PianoGameProps> = ({ 
  activeRobot, 
  onFinish, 
  speed, 
  isPaused, 
  isFinished, 
  battleResult,
  songId,
  onExit
}) => {
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  
  // 総合点集計用ステート
  const [judgementsCount, setJudgementsCount] = useState({
    excellent: 0,
    good: 0,
    soso: 0,
    notGood: 0,
    bad: 0
  });

  // ベストスコア記録・更新状態
  const [saveResult, setSaveResult] = useState<{
    isNewHighScore: boolean;
    isNewBestAccuracy: boolean;
    previousRecord: PianoBestScore | null;
    currentRecord: PianoBestScore | null;
  }>({
    isNewHighScore: false,
    isNewBestAccuracy: false,
    previousRecord: null,
    currentRecord: null
  });

  const [keysPressed, setKeysPressed] = useState<{
    lane: number;
    isBlack: boolean;
    endTime: number;
  }[]>([]);
  const [judgement, setJudgement] = useState<{ id: number; text: string; combo: number } | null>(null);
  
  const [instrument, setInstrument] = useState<any>(null);
  const [isInstrumentLoaded, setIsInstrumentLoaded] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const nextNoteIdx = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const scoreRef = useRef(0);
  const isFinishedHandledRef = useRef(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const song = PIANO_SONGS.find(s => s.id === songId) || PIANO_SONGS[0];
  const currentNotes: PianoNoteData[] = song.notes;
  const maxTime = currentNotes.length > 0 
    ? currentNotes[currentNotes.length - 1].time + 1500 
    : 30000;
  const fallTime = 1600; // ノーツが上部から判定ラインに到達する時間(ms)

  // 楽曲データの初期化
  useEffect(() => {
    elapsedRef.current = 0;
    nextNoteIdx.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    scoreRef.current = 0;
    isFinishedHandledRef.current = false;

    setScore(0);
    setElapsed(0);
    setProgress(0);
    setCombo(0);
    setMaxCombo(0);
    setJudgementsCount({ excellent: 0, good: 0, soso: 0, notGood: 0, bad: 0 });
    setKeysPressed([]);
    setJudgement(null);
    setSaveResult({
      isNewHighScore: false,
      isNewBestAccuracy: false,
      previousRecord: getPianoBestScore(song.id),
      currentRecord: null
    });

    // AudioContext の初期化 (即座に再生可能な環境を構築)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = (window as any).globalAudioCtx || new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      audioCtxRef.current = ctx;
      
      // サウンドフォントの非同期読み込み (ロード完了後は最高峰のピアノ音色へ移行)
      Soundfont.instrument(ctx, 'acoustic_grand_piano', { soundfont: 'MusyngKite' }).then(inst => {
        setInstrument(inst);
        setIsInstrumentLoaded(true);
      }).catch(err => {
        console.warn('Soundfont loading fallback to synth:', err);
        setIsInstrumentLoaded(true); // シンセサイザーで即座に進行可能
      });
    } else {
      setIsInstrumentLoaded(true);
    }
  }, [songId, song]);

  // 音声再生（Soundfont または 高品位Web Audio APIシンセ）
  const playTone = (midi: number, pitchName: string, durationMs: number = 300, velocity: number = 1.0) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    
    if (instrument) {
      try {
        instrument.play(pitchName || midi, ctx.currentTime, {
          duration: durationMs / 1000,
          gain: Math.max(0.2, Math.min(1.2, velocity))
        });
        return;
      } catch (e) {
        // Fallback to synth if soundfont errors
      }
    }

    playSynthesizedPiano(ctx, midi, durationMs, velocity);
  };

  // メインゲームループ (タイマー駆動)
  useEffect(() => {
    if (isFinished || isPaused) return;

    const intervalTime = 30; // ~33fps
    const tempoMultiplier = 1.0;

    const timer = setInterval(() => {
      const dt = intervalTime * speed * tempoMultiplier * (song.songSpeed || 1.0);
      elapsedRef.current += dt;
      const currentElapsed = elapsedRef.current;
      setElapsed(currentElapsed);

      const p = (currentElapsed / maxTime) * 100;
      setProgress(Math.min(100, p));

      let scoreGained = 0;
      let latestJudgeText = '';
      const activeLanes: { lane: number; isBlack: boolean; endTime: number }[] = [];

      // 判定ラインに到達したノーツを順次処理
      while (nextNoteIdx.current < currentNotes.length && currentNotes[nextNoteIdx.current].time <= currentElapsed) {
        const note = currentNotes[nextNoteIdx.current];
        const noteDuration = note.duration || 208;
        
        // ロボットの賢さ(Int)と器用さ(Dex)による判定ロール
        // Int: 楽譜理解・旋律・リズム把握
        // Dex: 運指の滑らかさ・正確な鍵盤打鍵
        let accuracyRoll = Math.random() * 100;
        const statBonus = (activeRobot.stats.dexterity * 1.5) + (activeRobot.stats.intelligence * 1.5);
        accuracyRoll += statBonus;
        
        // 楽曲難易度ペナルティ
        const diffPenalty = song.level * 4;
        accuracyRoll -= diffPenalty;

        let noteScore = 0;
        let judgeStr = '';
        let vol = 1.0;

        if (accuracyRoll >= 110) { 
          noteScore = 300; 
          judgeStr = 'EXCELLENT'; 
          vol = 1.0;
        } else if (accuracyRoll >= 80) { 
          noteScore = 150; 
          judgeStr = 'GOOD'; 
          vol = 0.82;
        } else if (accuracyRoll >= 50) { 
          noteScore = 50; 
          judgeStr = 'SOSO'; 
          vol = 0.65;
        } else if (accuracyRoll >= 20) { 
          noteScore = 10; 
          judgeStr = 'NOT GOOD'; 
          vol = 0.35;
        } else { 
          noteScore = 0; 
          judgeStr = 'BAD'; 
          vol = 0.0;
        }

        // 判定カウントの更新
        setJudgementsCount(prev => ({
          excellent: prev.excellent + (judgeStr === 'EXCELLENT' ? 1 : 0),
          good: prev.good + (judgeStr === 'GOOD' ? 1 : 0),
          soso: prev.soso + (judgeStr === 'SOSO' ? 1 : 0),
          notGood: prev.notGood + (judgeStr === 'NOT GOOD' ? 1 : 0),
          bad: prev.bad + (judgeStr === 'BAD' ? 1 : 0),
        }));

        // コンボ更新
        if (noteScore >= 150) {
          comboRef.current += 1;
          if (comboRef.current > maxComboRef.current) {
            maxComboRef.current = comboRef.current;
            setMaxCombo(comboRef.current);
          }
        } else if (noteScore < 50) {
          comboRef.current = 0;
        }
        setCombo(comboRef.current);

        // コンボボーナス乗算
        const comboBonus = Math.min(2.0, 1.0 + Math.floor(comboRef.current / 20) * 0.1);
        const durMult = noteDuration > 200 ? Math.floor(noteDuration / 100) : 1;
        scoreGained += Math.floor(noteScore * note.lanes.length * durMult * comboBonus);
        
        latestJudgeText = judgeStr;
        
        note.lanes.forEach((lane, i) => {
          const isBlack = (lane % 1) !== 0;
          activeLanes.push({ lane, isBlack, endTime: currentElapsed + noteDuration });
          // すべてEXCELLENTで弾けた場合には楽譜・音源通りの最高品質で鳴り響く
          if (noteScore > 0) {
            playTone(note.midi[i], note.pitches[i], noteDuration, vol);
          }
        });
        
        nextNoteIdx.current++;
      }

      if (scoreGained > 0) {
        scoreRef.current += scoreGained;
        setScore(scoreRef.current);
      }
      if (latestJudgeText) {
        setJudgement({ id: currentElapsed, text: latestJudgeText, combo: comboRef.current });
      }
      if (activeLanes.length > 0) {
        setKeysPressed(prev => [
          ...prev.filter(k => k.endTime > currentElapsed),
          ...activeLanes
        ]);
      }

      // 時間が切れたキーの消灯
      setKeysPressed(prev => prev.filter(k => k.endTime > currentElapsed));

      if (currentElapsed >= maxTime) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isFinished, isPaused, speed, song, maxTime, instrument]);

  // 演奏精度の計算 (%)
  const totalNotes = currentNotes.length;
  const accuracyPercent = totalNotes > 0
    ? Math.round(
        ((judgementsCount.excellent * 100 +
          judgementsCount.good * 75 +
          judgementsCount.soso * 40 +
          judgementsCount.notGood * 15) /
          (totalNotes * 100)) *
          1000
      ) / 10
    : 0;

  // 総合評価ランクの算出
  const getPerformanceRank = () => {
    if (judgementsCount.excellent === totalNotes || accuracyPercent >= 98) {
      return { rank: 'SS', label: '神業マエストロ', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-400' };
    }
    if (accuracyPercent >= 90) {
      return { rank: 'S', label: '名演奏', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400' };
    }
    if (accuracyPercent >= 80) {
      return { rank: 'A', label: '優秀', color: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-400' };
    }
    if (accuracyPercent >= 68) {
      return { rank: 'B', label: '合格ライン', color: 'text-teal-400', badge: 'bg-teal-500/20 text-teal-300 border-teal-400' };
    }
    if (accuracyPercent >= 55) {
      return { rank: 'C', label: '練習中', color: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-400' };
    }
    return { rank: 'D', label: '未達', color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-400' };
  };

  const performanceRank = getPerformanceRank();

  // 全曲演奏終了時の処理：演奏精度が80%以上をクリアとする
  useEffect(() => {
    if (progress >= 100 && !isFinished && !isPaused && !isFinishedHandledRef.current) {
      isFinishedHandledRef.current = true;
      const isWin = accuracyPercent >= 80;
      
      // スコアとベストスコアの保存
      const saveRes = savePianoScore({
        songId: song.id,
        score: scoreRef.current,
        accuracy: accuracyPercent,
        rank: performanceRank.rank,
        maxCombo: maxComboRef.current,
        cleared: isWin,
        robotName: activeRobot.name
      });

      setSaveResult({
        isNewHighScore: saveRes.isNewHighScore,
        isNewBestAccuracy: saveRes.isNewBestAccuracy,
        previousRecord: saveRes.previousRecord,
        currentRecord: saveRes.currentRecord
      });

      onFinish(isWin ? 'win' : 'lose');
    }
  }, [progress, isFinished, isPaused, accuracyPercent, song, performanceRank, activeRobot, onFinish]);

  // 判定文字の色
  const getJudgementColor = (text: string) => {
    switch (text) {
      case 'EXCELLENT': return '#fbbf24';
      case 'GOOD': return '#4ade80';
      case 'SOSO': return '#60a5fa';
      case 'NOT GOOD': return '#f87171';
      default: return '#9ca3af';
    }
  };

  // 40白鍵の生成 (A1〜E7)
  const whiteKeyDefs = React.useMemo(() => {
    const keys: { index: number; hasBlackKey: boolean; name: string }[] = [];
    for (let i = 0; i < TOTAL_WHITE_KEYS; i++) {
      let hasBlack = false;
      if (i === 0) hasBlack = true; // A1 -> A#1
      else if (i === 1) hasBlack = false; // B1 -> C2
      else {
        const offset = (i - 2) % 7; // C:0, D:1, E:2, F:3, G:4, A:5, B:6
        hasBlack = [0, 1, 3, 4, 5].includes(offset);
      }
      if (i === TOTAL_WHITE_KEYS - 1) hasBlack = false; // 最後のE7には黒鍵なし
      keys.push({ index: i, hasBlackKey: hasBlack, name: `K${i}` });
    }
    return keys;
  }, []);

  // 演奏結果画面（リザルト画面）: 全ての情報を綺麗に配置した専用カルテビュー
  if (isFinished) {
    const isWin = accuracyPercent >= 80;
    const rewardKits = Math.max(1, Math.ceil(song.level / 2));
    const prevBest = saveResult.previousRecord;

    return (
      <div className="w-full space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-xl overflow-hidden text-stone-100 p-5 sm:p-6 space-y-5"
        >
          {/* ヘッダー: 楽曲タイトル・作曲者・機体情報 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-800 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                  PERFORMANCE RESULT
                </span>
                <span className="text-xs text-stone-400 font-mono">WoO 59 全曲演奏演習</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-100 flex items-center gap-2">
                <Gi.GiGrandPiano className="text-amber-400 text-2xl" />
                <span>{song.title}</span>
                <span className="text-xs sm:text-sm text-stone-400 font-normal">（{song.composer}）</span>
              </h2>
            </div>

            {/* 出撃ロボット情報 */}
            <div className="flex items-center gap-2.5 bg-stone-950/90 px-3 py-1.5 rounded-xl border border-stone-800 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="bg-stone-800 p-1 rounded-lg border border-stone-700">
                <RobotVisual robot={activeRobot} size={36} animateVictory={isWin} hideBackground={true} hideBubble={true} />
              </div>
              <div className="text-left text-xs font-mono">
                <div className="font-bold text-stone-200">{activeRobot.name}</div>
                <div className="text-[10px] text-stone-400 flex gap-2">
                  <span>Int: <strong className="text-amber-300">{activeRobot.stats.intelligence}</strong></span>
                  <span>Dex: <strong className="text-amber-300">{activeRobot.stats.dexterity}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* クリア合否メインバナー */}
          <div className={`p-4 rounded-xl border-2 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
            isWin 
              ? 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-amber-950/80 border-emerald-500/70 text-emerald-100'
              : 'bg-stone-950 border-rose-500/50 text-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                isWin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isWin ? <Gi.GiPartyPopper /> : <Gi.GiCancel />}
              </div>
              <div>
                <div className="text-base sm:text-lg font-black tracking-wide flex items-center gap-2 justify-center sm:justify-start">
                  <span>{isWin ? '演習クリア！ MISSION CLEAR' : '演習目標未達... CLEAR FAILED'}</span>
                  {isWin && (
                    <span className="text-[10px] bg-emerald-500 text-stone-950 px-2 py-0.5 rounded-full font-black uppercase">
                      合格
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  {isWin 
                    ? `クリア基準（演奏精度80.0%以上）を達成！ 工房演習の修了が認定されました。` 
                    : `クリア条件は「演奏精度80.0%以上」です（今回の精度: ${accuracyPercent}%）。IntとDexを高めて再挑戦しよう！`}
                </p>
              </div>
            </div>

            {/* 報酬表示 */}
            {isWin && (
              <div className="bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-400/50 flex items-center gap-2 shrink-0">
                <Gi.GiSpanner className="text-amber-400 text-lg" />
                <div className="text-left font-mono">
                  <div className="text-[10px] text-amber-300 font-sans font-bold">クリア報酬獲得</div>
                  <div className="text-sm font-black text-amber-200">修理キット +{rewardKits}個</div>
                </div>
              </div>
            )}
          </div>

          {/* 主要スタッツグリッド（スコア、精度、ランク、最大コンボ） */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* 総合得点 */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-center relative overflow-hidden">
              {saveResult.isNewHighScore && (
                <span className="absolute top-1.5 right-1.5 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded font-mono animate-pulse">
                  NEW RECORD!
                </span>
              )}
              <div className="text-[11px] text-stone-400 font-bold mb-1 font-mono">総合得点 (TOTAL SCORE)</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                {score.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                自己ベスト: <span className="text-stone-300 font-bold">{(prevBest ? Math.max(prevBest.bestScore, score) : score).toLocaleString()}</span>
              </div>
            </div>

            {/* 演奏精度 */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-center relative">
              {saveResult.isNewBestAccuracy && (
                <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded font-mono animate-pulse">
                  BEST!
                </span>
              )}
              <div className="text-[11px] text-stone-400 font-bold mb-1 font-mono">演奏精度 (ACCURACY)</div>
              <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${accuracyPercent >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {accuracyPercent}%
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                クリア基準: <span className="text-amber-400 font-bold">80.0%</span> 以上
              </div>
            </div>

            {/* 総合評価ランク */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-center flex flex-col justify-center items-center">
              <div className="text-[11px] text-stone-400 font-bold mb-1 font-mono">総合評価ランク</div>
              <div className="flex items-center gap-2">
                <div className={`text-2xl sm:text-3xl font-black font-mono ${performanceRank.color}`}>
                  {performanceRank.rank}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${performanceRank.badge}`}>
                  {performanceRank.label}
                </span>
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                最高ランク: <span className="text-stone-300 font-bold">{prevBest?.bestRank || performanceRank.rank}</span>
              </div>
            </div>

            {/* 最大コンボ */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-center flex flex-col justify-center items-center">
              <div className="text-[11px] text-stone-400 font-bold mb-1 font-mono">最大連続打鍵 (MAX COMBO)</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                {maxCombo}
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                総音数: <span className="text-stone-300 font-bold">{totalNotes} ノーツ</span>
              </div>
            </div>
          </div>

          {/* 演奏精度のクリアゲージバー */}
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-stone-400">
              <span>演奏精度ゲージ（クリアライン: 80%）</span>
              <span className="font-bold text-stone-200">{accuracyPercent}% / 100%</span>
            </div>
            <div className="relative w-full h-3 bg-stone-800 rounded-full overflow-hidden">
              {/* クリアライン位置マーカー (80%) */}
              <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-amber-400 z-10 shadow-[0_0_4px_#fbbf24]" />
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  accuracyPercent >= 80 
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400' 
                    : 'bg-gradient-to-r from-rose-700 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, accuracyPercent)}%` }}
              />
            </div>
          </div>

          {/* 打鍵判定別内訳 (5カラム) */}
          <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="text-xs text-stone-400 font-bold flex items-center justify-between font-mono">
              <span>JUDGEMENT BREAKDOWN（打鍵判定内訳）</span>
              <span className="text-[11px] text-stone-400">Int・Dexの総合力による判定</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center font-mono">
              <div className="bg-amber-500/10 p-2 sm:p-2.5 rounded-xl border border-amber-500/25">
                <div className="text-[10px] sm:text-xs text-amber-400 font-bold">EXCELLENT</div>
                <div className="text-base sm:text-xl font-black text-amber-300 mt-0.5">{judgementsCount.excellent}</div>
              </div>
              <div className="bg-emerald-500/10 p-2 sm:p-2.5 rounded-xl border border-emerald-500/25">
                <div className="text-[10px] sm:text-xs text-emerald-400 font-bold">GOOD</div>
                <div className="text-base sm:text-xl font-black text-emerald-300 mt-0.5">{judgementsCount.good}</div>
              </div>
              <div className="bg-blue-500/10 p-2 sm:p-2.5 rounded-xl border border-blue-500/25">
                <div className="text-[10px] sm:text-xs text-blue-400 font-bold">SOSO</div>
                <div className="text-base sm:text-xl font-black text-blue-300 mt-0.5">{judgementsCount.soso}</div>
              </div>
              <div className="bg-rose-500/10 p-2 sm:p-2.5 rounded-xl border border-rose-500/25">
                <div className="text-[10px] sm:text-xs text-rose-400 font-bold">NOT GOOD</div>
                <div className="text-base sm:text-xl font-black text-rose-300 mt-0.5">{judgementsCount.notGood}</div>
              </div>
              <div className="bg-stone-800/80 p-2 sm:p-2.5 rounded-xl border border-stone-700/80">
                <div className="text-[10px] sm:text-xs text-stone-400 font-bold">BAD</div>
                <div className="text-base sm:text-xl font-black text-stone-300 mt-0.5">{judgementsCount.bad}</div>
              </div>
            </div>
          </div>

          {/* 特別称号（全EXCELLENT時） */}
          {judgementsCount.excellent === totalNotes && (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: [0.95, 1.02, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              className="p-3 bg-gradient-to-r from-amber-500/30 via-yellow-500/40 to-amber-500/30 rounded-xl border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <Gi.GiSparkles className="text-amber-300 text-lg" />
              <span>★ ベートーヴェン原典・完全再現達成（全音EXCELLENT打鍵） ★</span>
              <Gi.GiSparkles className="text-amber-300 text-lg" />
            </motion.div>
          )}

          {/* 操作ボタン */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end items-center border-t border-stone-800">
            <button
              onClick={() => {
                if (onExit) onExit();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Gi.GiReturnArrow className="text-base" />
              <span>演奏演習を終了して戻る</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 通常の演奏プレイ画面
  return (
    <div className="space-y-4">
      {/* ヘッダーステータス */}
      <div className="flex justify-between items-center bg-stone-900 p-4 rounded-xl shadow-inner border border-stone-800">
        <div className="flex gap-4 items-center">
          <div className="bg-stone-800 p-1.5 rounded-xl border border-stone-700 shadow-sm">
            <RobotVisual robot={activeRobot} size={36} animateVictory={battleResult === 'win'} hideBackground={true} hideBubble={true} />
          </div>
          <div className="text-white font-mono text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Gi.GiGrandPiano className="text-amber-400 text-lg" />
              <span className="font-bold text-stone-100">{song.title}</span>
              <span className="text-xs text-stone-400 font-sans">（{song.composer}）</span>
            </div>
            <div className="text-[11px] text-stone-400 flex gap-2 font-mono">
              <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700">Int: {activeRobot.stats.intelligence}</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700">Dex: {activeRobot.stats.dexterity}</span>
              {combo > 1 && (
                <span className="bg-amber-900/60 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/50 animate-pulse">
                  {combo} COMBO
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold px-2.5 py-0.5 rounded-full border inline-block mb-1 bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono">
            クリア基準: 精度 80.0% 以上
          </div>
          <div className="text-white font-mono text-sm">
            SCORE <span className="text-amber-400 text-lg font-black">{score.toLocaleString()}</span>
            <span className="text-stone-400 text-xs ml-2">精度 <strong className={accuracyPercent >= 80 ? 'text-emerald-400' : 'text-stone-300'}>{accuracyPercent}%</strong></span>
          </div>
        </div>
      </div>

      {/* プレイエリア (フル鍵盤対応) */}
      <div className="relative w-full h-64 bg-stone-950 rounded-2xl overflow-hidden border-4 border-stone-800 flex justify-center shadow-2xl">
        {/* 背景ライン (40鍵盤グリッド) */}
        <div className="absolute inset-0 flex justify-between opacity-10 pointer-events-none">
          {whiteKeyDefs.map((_, i) => (
            <div key={i} className="h-full border-r border-stone-700" style={{ width: `${100 / TOTAL_WHITE_KEYS}%` }} />
          ))}
        </div>
        
        {/* 落下するノーツ (時間ベースで位置を計算) */}
        <div className="absolute inset-0 pt-2 pointer-events-none">
          {currentNotes.map((note, idx) => {
            const timeUntilHit = note.time - elapsed;
            const noteDuration = note.duration || 208;
            if (timeUntilHit + noteDuration < -100 || timeUntilHit > fallTime) return null;
            
            // 判定ラインは鍵盤の直上（下から14%）
            const bottomPos = 14 + (timeUntilHit / fallTime) * 82;
            const hPercent = Math.max(2.5, (noteDuration / fallTime) * 82);

            return note.lanes.map((lane, lIdx) => {
              const isBlack = (lane % 1) !== 0;
              const leftPercent = (lane / (TOTAL_WHITE_KEYS - 1)) * 100;

              return (
                <div 
                  key={`${idx}-${lIdx}`} 
                  className={`absolute rounded-xs shadow-md transition-opacity ${
                    isBlack 
                      ? 'bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)] z-10' 
                      : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] z-0'
                  }`}
                  style={{
                    bottom: `${bottomPos}%`,
                    height: `${hPercent}%`,
                    left: `${leftPercent}%`,
                    width: isBlack ? '1.8%' : '2.2%',
                    transform: 'translateX(-50%)'
                  }}
                />
              );
            });
          })}
        </div>

        {/* 判定・コンボテキスト演出 */}
        <AnimatePresence>
          {judgement && !isFinished && (
            <motion.div
              key={judgement.id}
              initial={{ opacity: 1, y: 0, scale: 0.7 }}
              animate={{ opacity: 0, y: -35, scale: 1.25 }}
              transition={{ duration: 0.55 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30"
            >
              <div 
                className="text-3xl sm:text-4xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-widest font-mono"
                style={{ color: getJudgementColor(judgement.text) }}
              >
                {judgement.text}
              </div>
              {judgement.combo > 1 && (
                <div className="text-amber-300 text-sm font-bold tracking-wider drop-shadow-md">
                  {judgement.combo} COMBO!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 演奏ロボットアニメーション (アクティブな打鍵位置へ滑らかにスライド) */}
        {!isFinished && (
          <div className="absolute bottom-16 left-0 right-0 h-16 pointer-events-none z-20">
            <motion.div
              className="absolute bottom-0"
              style={{ width: '64px', marginLeft: '-32px' }}
              initial={{ left: '50%' }}
              animate={{ 
                left: keysPressed.length > 0 
                  ? `${((keysPressed.reduce((acc, k) => acc + k.lane, 0) / keysPressed.length) / (TOTAL_WHITE_KEYS - 1)) * 100}%` 
                  : '50%',
                y: keysPressed.length > 0 ? 6 : 0,
                rotate: keysPressed.length > 0 ? [-3, 3, 0] : 0,
                scale: keysPressed.length > 0 ? 0.95 : 1
              }}
              transition={{
                left: { type: 'spring', stiffness: 220, damping: 24 },
                y: { type: 'spring', stiffness: 600, damping: 20 },
                rotate: { duration: 0.12 },
                scale: { duration: 0.08 }
              }}
            >
              <div className="relative flex justify-center drop-shadow-lg">
                <RobotVisual robot={activeRobot} size={64} hideBackground={true} hideBubble={true} />
              </div>
            </motion.div>
          </div>
        )}

        {/* 鍵盤エリア (40白鍵 ＋ 該当位置のリアル黒鍵) */}
        <div className="absolute bottom-0 w-full h-16 bg-stone-900 flex items-end pb-1 border-t-2 border-stone-700 px-0.5">
          {whiteKeyDefs.map((def, i) => {
            const isWhitePressed = keysPressed.some(k => !k.isBlack && Math.round(k.lane) === i);
            const isBlackPressed = keysPressed.some(k => k.isBlack && Math.abs(k.lane - (i + 0.5)) < 0.25);
            
            return (
              <div 
                key={def.index} 
                className={`relative flex-1 h-14 rounded-b-xs border-r border-stone-400 transition-colors duration-75 ${
                  isWhitePressed 
                    ? 'bg-amber-300 translate-y-0.5 shadow-inner' 
                    : 'bg-stone-100 hover:bg-stone-200'
                }`}
              >
                {/* 鍵盤先端の光彩エフェクト */}
                {isWhitePressed && (
                  <div className="absolute top-0 left-0 right-0 h-3 bg-amber-400/80 blur-xs" />
                )}

                {/* 黒鍵 */}
                {def.hasBlackKey && (
                  <div 
                    className={`absolute top-0 -right-[40%] w-[80%] h-[62%] rounded-b-xs z-10 transition-colors duration-75 border-x border-b ${
                      isBlackPressed 
                        ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]' 
                        : 'bg-stone-900 border-stone-800 shadow-md'
                    }`}
                  >
                    {isBlackPressed && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-200" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 曲の進行状況バー */}
        <div 
          className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-300 z-30 transition-all duration-100" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};
