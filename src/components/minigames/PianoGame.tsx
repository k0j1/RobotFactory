import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import Soundfont from 'soundfont-player';
import { Robot } from '../../core/models';
import { MinigameProps, PIANO_SONGS, PianoNoteData } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import { GSAPRobotCanvas } from '../robot/GSAPRobotCanvas';
import { savePianoScore, getPianoBestScore, PianoBestScore } from '../../core/pianoScoreManager';
import * as Gi from 'react-icons/gi';

interface PianoGameProps extends Omit<MinigameProps, 'activeOpponent'> {
  songId: string;
  onExit?: () => void;
}

// 40白鍵 (A1: 33 〜 E7: 100)
const TOTAL_WHITE_KEYS = 52;

// Web Audio API による高品位グランドピアノシンセサイザー（フォールバック＆即時再生用）
const playSynthesizedPiano = (
  ctx: AudioContext,
  destNode: AudioNode,
  midi: number,
  durationMs: number = 300,
  volume: number = 1.0
) => {
  try {
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const now = ctx.currentTime;
    const durSec = Math.max(0.2, durationMs / 1000);

    // 全体ゲイン (アコースティックピアノのリアルなダイナミクスと迫力ある音圧)
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    // 鋭くしっかりとしたハンマー打弦アタック (4ms) - 従来の0.38から0.95へ大幅強化
    const effectiveVol = Math.max(0.1, volume);
    const peakGain = Math.min(1.0, 0.95 * effectiveVol);
    noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.004);
    // 豊かな響板振動の初期ディケイ (80ms) - 従来の0.22から0.68へ大幅強化
    noteGain.gain.exponentialRampToValueAtTime(Math.max(0.01, 0.68 * effectiveVol), now + 0.08);
    // 自然な弦の減衰 (サステインの持続)
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durSec + 0.55);

    // アコースティックピアノのダイナミクスに応じた音色変化 (弱音ppはまろやかで甘美、強音ffは鋭く輝かしい倍音)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoffBase = freq * (2.0 + 3.0 * Math.min(1.5, Math.pow(effectiveVol, 0.75)));
    filter.frequency.setValueAtTime(Math.min(13000, cutoffBase), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(4500, freq * 1.8), now + durSec);

    // 基本波（暖かみのある三角波）
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // 基音の肉厚感を増強するサイン波
    const oscFund = ctx.createOscillator();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(freq, now);
    const oscFundGain = ctx.createGain();
    oscFundGain.gain.setValueAtTime(0.48 * Math.min(1.2, 0.6 + 0.4 * effectiveVol), now);
    oscFund.connect(oscFundGain);
    oscFundGain.connect(filter);

    // 第2倍音（オクターブ上の倍音：強打時に明瞭化）
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.32 * Math.min(1.5, Math.pow(effectiveVol, 0.9)), now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    // 第3倍音（輝きを付加するオーバートーン：ff時に華麗に共鳴）
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.20 * Math.min(1.8, Math.pow(effectiveVol, 1.3)), now);
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    osc1.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(destNode);

    osc1.start(now);
    oscFund.start(now);
    osc2.start(now);
    osc3.start(now);

    const stopTime = now + durSec + 0.6;
    osc1.stop(stopTime);
    oscFund.stop(stopTime);
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
  const [judgement, setJudgement] = useState<{ id: number; text: string; combo: number; dynamics?: string } | null>(null);
  
  // 音の強弱ステート & 表現力評価ステート
  const [activeDynamics, setActiveDynamics] = useState<string>('p');
  const [dynamicsJudgements, setDynamicsJudgements] = useState<{
    perfectTouch: number;
    greatTouch: number;
    goodTouch: number;
    roughTouch: number;
  }>({ perfectTouch: 0, greatTouch: 0, goodTouch: 0, roughTouch: 0 });
  const dynamicsScoreTotalRef = useRef(0);
  
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
  const masterGainRef = useRef<GainNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);

  // ピアノ音量ステート (初期値: 1.0 = 100%、0%〜150%で調整可能、永続化)
  const [pianoVolume, setPianoVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ponkotsu_piano_volume');
      return saved !== null ? Math.max(0, Math.min(1.5, Number(saved))) : 1.0;
    } catch {
      return 1.0;
    }
  });

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1.5, newVol));
    setPianoVolume(clamped);
    try {
      localStorage.setItem('ponkotsu_piano_volume', String(clamped));
    } catch {}
    if (audioCtxRef.current && masterGainRef.current) {
      const now = audioCtxRef.current.currentTime;
      // 基準ゲイン 1.6倍 にスケーリングして十分な音圧を供給
      masterGainRef.current.gain.setTargetAtTime(clamped * 1.6, now, 0.05);
    }
  };

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
    dynamicsScoreTotalRef.current = 0;
    isFinishedHandledRef.current = false;

    setScore(0);
    setElapsed(0);
    setProgress(0);
    setCombo(0);
    setMaxCombo(0);
    setActiveDynamics(currentNotes[0]?.dynamics || 'p');
    setJudgementsCount({ excellent: 0, good: 0, soso: 0, notGood: 0, bad: 0 });
    setDynamicsJudgements({ perfectTouch: 0, greatTouch: 0, goodTouch: 0, roughTouch: 0 });
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

      // マスターコンプレッサーの構築 (クリッピング防止 & アコースティックピアノ特有の芳醇なサステイン増幅)
      if (!compressorRef.current) {
        try {
          const comp = ctx.createDynamicsCompressor();
          comp.threshold.setValueAtTime(-14, ctx.currentTime);
          comp.knee.setValueAtTime(8, ctx.currentTime);
          comp.ratio.setValueAtTime(3.5, ctx.currentTime);
          comp.attack.setValueAtTime(0.003, ctx.currentTime);
          comp.release.setValueAtTime(0.2, ctx.currentTime);
          comp.connect(ctx.destination);
          compressorRef.current = comp;
        } catch (e) {
          console.warn('Compressor setup error:', e);
        }
      }

      // マスターゲインの構築 (実音量に合わせた高音圧設定)
      if (!masterGainRef.current) {
        try {
          const mg = ctx.createGain();
          const targetNode = compressorRef.current || ctx.destination;
          mg.gain.setValueAtTime(pianoVolume * 1.6, ctx.currentTime);
          mg.connect(targetNode);
          masterGainRef.current = mg;
        } catch (e) {
          console.warn('Master gain setup error:', e);
        }
      }
      
      // サウンドフォントの非同期読み込み (ロード完了後は最高峰のピアノ音色へ移行)
      const soundDest = masterGainRef.current || ctx.destination;
      Soundfont.instrument(ctx, 'acoustic_grand_piano', { 
        soundfont: 'MusyngKite',
        destination: soundDest 
      }).then((inst: any) => {
        setInstrument(inst);
        setIsInstrumentLoaded(true);
      }).catch((err: any) => {
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
    
    // マスターゲイン接続ノード (masterGain -> compressor -> destination)
    const destNode = masterGainRef.current || ctx.destination;

    if (instrument) {
      try {
        // Soundfont-player のサンプル音量は標準で小さめ(-12dB前後)のため、
        // ゲインを 2.4倍 して実音量相当の豊かな音圧にする (ppの繊細な静けさからffの圧倒的音圧まで表現)
        instrument.play(pitchName || midi, ctx.currentTime, {
          duration: durationMs / 1000,
          gain: Math.max(0.2, Math.min(3.6, velocity * 2.4 * pianoVolume))
        });
        return;
      } catch (e) {
        // Fallback to synth if soundfont errors
      }
    }

    playSynthesizedPiano(ctx, destNode, midi, durationMs, velocity);
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
        // Int: 楽譜理解・旋律・リズム把握 (主軸)
        // Dex: 運指の滑らかさ・繊細な打鍵タッチ・強弱コントロール (補助＆表現力主軸)
        // 難易度目標: 
        // エリーゼのために(Lv.5): INT 50
        // ノクターン 作品9-2(Lv.6): INT 60
        // トルコ行進曲(Lv.8): INT 75
        // ラ・カンパネラ(Lv.10): INT 100
        const targetInt = song.id === 'fur_elise' 
          ? 50 
          : song.id === 'chopin_nocturne' 
            ? 60 
            : song.id === 'turkish_march' 
              ? 75 
              : 100;
        const intVal = activeRobot.stats.intelligence || 10;
        const dexVal = activeRobot.stats.dexterity || 10;
        const effectiveScore = (intVal * 0.95) + (dexVal * 0.1);
        const statDelta = effectiveScore - targetInt;

        // roll値算出: 打鍵タイミング判定
        const accuracyRoll = 86 + (Math.random() * 32) + (statDelta * 1.6);

        let noteScore = 0;
        let judgeStr = '';
        let vol = 1.0;

        if (accuracyRoll >= 95) { 
          noteScore = 300; 
          judgeStr = 'EXCELLENT'; 
          vol = 1.0;
        } else if (accuracyRoll >= 85) { 
          noteScore = 150; 
          judgeStr = 'GOOD'; 
          vol = 0.95;
        } else if (accuracyRoll >= 70) { 
          noteScore = 50; 
          judgeStr = 'SOSO'; 
          vol = 0.88;
        } else if (accuracyRoll >= 45) { 
          noteScore = 10; 
          judgeStr = 'NOT GOOD'; 
          vol = 0.75;
        } else { 
          noteScore = 0; 
          judgeStr = 'BAD'; 
          vol = 0.0;
        }

        // 強弱表現力ロール (Dex 70% + Int 30%): 指先の繊細なベロシティコントロール
        const expressionEffective = (dexVal * 0.7) + (intVal * 0.3);
        const expressionDelta = expressionEffective - (targetInt * 0.85);
        const expressionRoll = 86 + (Math.random() * 30) + (expressionDelta * 1.5);

        let touchScore = 0; // 0 to 100
        let touchJudgeKey: 'perfectTouch' | 'greatTouch' | 'goodTouch' | 'roughTouch' = 'goodTouch';
        let touchFactor = 1.0;

        if (expressionRoll >= 95) {
          touchScore = 100;
          touchJudgeKey = 'perfectTouch';
          touchFactor = 1.0;
        } else if (expressionRoll >= 82) {
          touchScore = 80;
          touchJudgeKey = 'greatTouch';
          touchFactor = 0.92;
        } else if (expressionRoll >= 65) {
          touchScore = 55;
          touchJudgeKey = 'goodTouch';
          touchFactor = 0.82;
        } else {
          touchScore = 25;
          touchJudgeKey = 'roughTouch';
          touchFactor = 0.70;
        }

        dynamicsScoreTotalRef.current += touchScore;
        setDynamicsJudgements(prev => ({
          ...prev,
          [touchJudgeKey]: prev[touchJudgeKey] + 1
        }));

        if (note.dynamics) {
          setActiveDynamics(note.dynamics);
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

        // コンボボーナス ＆ 表現力ボーナス乗算
        const comboBonus = Math.min(2.0, 1.0 + Math.floor(comboRef.current / 20) * 0.1);
        const touchBonus = touchScore >= 80 ? 1.15 : 1.0; // 表現力優秀によるスコアボーナス
        const durMult = noteDuration > 200 ? Math.floor(noteDuration / 100) : 1;
        scoreGained += Math.floor(noteScore * note.lanes.length * durMult * comboBonus * touchBonus);
        
        latestJudgeText = judgeStr;
        
        // 実際の演奏ベロシティ（楽譜の指定ベロシティ × ロボットのタッチ精度 × 音量）
        const baseVelocity = note.velocity || 0.8;
        const actualVelocity = Math.max(0.25, Math.min(1.6, baseVelocity * touchFactor * vol));

        note.lanes.forEach((lane, i) => {
          const isBlack = (lane % 1) !== 0;
          activeLanes.push({ lane, isBlack, endTime: currentElapsed + noteDuration });
          // すべてEXCELLENT/GOODで弾けた場合には楽譜の強弱指定通りの豊かなダイナミクスで響き渡る
          if (noteScore > 0) {
            playTone(note.midi[i], note.pitches[i], noteDuration, actualVelocity);
          }
        });
        
        nextNoteIdx.current++;
      }

      if (scoreGained > 0) {
        scoreRef.current += scoreGained;
        setScore(scoreRef.current);
      }
      if (latestJudgeText) {
        setJudgement({ 
          id: currentElapsed, 
          text: latestJudgeText, 
          combo: comboRef.current,
          dynamics: currentNotes[nextNoteIdx.current - 1]?.dynamics 
        });
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

  // 強弱表現力スコアの計算 (%)
  const expressionPercent = totalNotes > 0
    ? Math.round((dynamicsScoreTotalRef.current / (totalNotes * 100)) * 1000) / 10
    : 0;

  // 総合演奏評価スコア (演奏精度 70% + 強弱表現力 30%)
  const totalPerformancePercent = Math.round(((accuracyPercent * 0.7) + (expressionPercent * 0.3)) * 10) / 10;

  // 総合評価ランクの算出（強弱表現も含めて判定）
  const getPerformanceRank = () => {
    if (totalPerformancePercent >= 97 && judgementsCount.bad === 0) {
      return { rank: 'SS', label: '神業マエストロ', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-400' };
    }
    if (totalPerformancePercent >= 90) {
      return { rank: 'S', label: '名演奏', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400' };
    }
    if (totalPerformancePercent >= 80) {
      return { rank: 'A', label: '優秀', color: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-400' };
    }
    if (totalPerformancePercent >= 68) {
      return { rank: 'B', label: '合格ライン', color: 'text-teal-400', badge: 'bg-teal-500/20 text-teal-300 border-teal-400' };
    }
    if (totalPerformancePercent >= 55) {
      return { rank: 'C', label: '練習中', color: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-400' };
    }
    return { rank: 'D', label: '未達', color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-400' };
  };

  const performanceRank = getPerformanceRank();

  // 全曲演奏終了時の処理：総合演奏評価（打鍵精度 70% + 強弱表現力 30%）が90%以上をクリアとする
  useEffect(() => {
    if (progress >= 100 && !isFinished && !isPaused && !isFinishedHandledRef.current) {
      isFinishedHandledRef.current = true;
      const isWin = totalPerformancePercent >= 90;
      
      // スコアとベストスコアの保存
      const saveRes = savePianoScore({
        songId: song.id,
        score: scoreRef.current,
        accuracy: totalPerformancePercent,
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
  }, [progress, isFinished, isPaused, totalPerformancePercent, song, performanceRank, activeRobot, onFinish]);

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

  // 強弱記号に応じたノーツカラーとシャドウ
  const getDynamicsColor = (dynamics?: string, isBlack?: boolean) => {
    switch (dynamics) {
      case 'pp':
        return isBlack 
          ? 'bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]' 
          : 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]';
      case 'p':
        return isBlack 
          ? 'bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]' 
          : 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]';
      case 'mp':
        return isBlack 
          ? 'bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]' 
          : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
      case 'mf':
        return isBlack 
          ? 'bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]' 
          : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
      case 'f':
        return isBlack 
          ? 'bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.9)]' 
          : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]';
      case 'ff':
        return isBlack 
          ? 'bg-rose-300 shadow-[0_0_12px_rgba(253,164,175,1.0)]' 
          : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]';
      default:
        return isBlack 
          ? 'bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]' 
          : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
    }
  };

  const getDynamicsBadge = (dynamics?: string) => {
    switch (dynamics) {
      case 'pp': return 'bg-violet-950/90 text-violet-300 border-violet-500/60';
      case 'p': return 'bg-sky-950/90 text-sky-300 border-sky-500/60';
      case 'mp': return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60';
      case 'mf': return 'bg-amber-950/90 text-amber-300 border-amber-500/60';
      case 'f': return 'bg-orange-950/90 text-orange-300 border-orange-500/60';
      case 'ff': return 'bg-rose-950/90 text-rose-300 border-rose-500/60';
      default: return 'bg-stone-800 text-stone-300 border-stone-600';
    }
  };

  const getDynamicsDesc = (dynamics?: string) => {
    switch (dynamics) {
      case 'pp': return 'ピアニッシモ（最弱音・静寂と繊細な余韻）';
      case 'p': return 'ピアノ（弱音・穏やかに歌うように）';
      case 'mp': return 'メゾピアノ（やや弱く・優美なタッチ）';
      case 'mf': return 'メゾフォルテ（やや強く・豊かな響き）';
      case 'f': return 'フォルテ（強く・情熱的な主張）';
      case 'ff': return 'フォルティッシモ（最強音・激情のクライマックス）';
      default: return '標準打鍵';
    }
  };

  // 52白鍵の生成 (A0〜C8: 88鍵フルスケール)
  const whiteKeyDefs = React.useMemo(() => {
    const notesBase = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const midiBase = [0, 2, 4, 5, 7, 9, 11]; // Cから始まる半音オフセット
    const keys: { index: number; hasBlackKey: boolean; name: string; midi: number }[] = [];
    
    // A0, B0
    keys.push({ index: 0, hasBlackKey: true, name: 'A0', midi: 21 });
    keys.push({ index: 1, hasBlackKey: false, name: 'B0', midi: 23 });

    let currentOctave = 1;
    for (let i = 2; i < TOTAL_WHITE_KEYS; i++) {
      const offset = (i - 2) % 7;
      if (offset === 0 && i > 2) currentOctave++;
      const hasBlack = [0, 1, 3, 4, 5].includes(offset) && i !== TOTAL_WHITE_KEYS - 1;
      const noteLetter = notesBase[offset];
      const midi = (currentOctave + 1) * 12 + midiBase[offset];
      keys.push({ index: i, hasBlackKey: hasBlack, name: `${noteLetter}${currentOctave}`, midi });
    }
    return keys;
  }, []);

  // 演奏結果画面（リザルト画面）: 全ての情報を綺麗に配置した専用カルテビュー
  if (isFinished) {
    const isWin = totalPerformancePercent >= 90;
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
                <span className="text-xs text-stone-400 font-mono">
                  {song.id === 'fur_elise' ? 'WoO 59 全曲演奏演習' : song.id === 'chopin_nocturne' ? 'Op. 9 No. 2 全曲強弱演奏演習' : 'K. 331 全曲演奏演習'}
                </span>
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
                    ? `総合評価（打鍵精度70% + 強弱表現力30% = ${totalPerformancePercent}%）が合格基準90.0%を達成！` 
                    : `合格基準は「総合評価90.0%以上」です（今回の総合評価: ${totalPerformancePercent}% / 精度: ${accuracyPercent}% / 表現力: ${expressionPercent}%）。`}
                </p>
              </div>
            </div>

            {/* 報酬表示 */}
            {isWin && (
              <div className="bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-400/50 flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 font-mono text-left">
                  <Gi.GiLockedChest className="text-amber-400 text-xl" />
                  <div>
                    <div className="text-[10px] text-amber-300 font-sans font-bold">クリアドロップ</div>
                    <div className="text-xs sm:text-sm font-black text-amber-200">古びた鉄の宝箱 ×1</div>
                  </div>
                </div>
                {song.rewardFame > 0 && (
                  <div className="flex items-center gap-1.5 font-mono text-left pl-2 border-l border-amber-400/30">
                    <Gi.GiTrophyCup className="text-amber-400 text-xl" />
                    <div>
                      <div className="text-[10px] text-amber-300 font-sans font-bold">工房名声</div>
                      <div className="text-xs sm:text-sm font-black text-amber-200">+{song.rewardFame}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 主要スタッツグリッド（総合評価、打鍵精度、強弱表現力、総合ランク） */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* 総合評価スコア */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-amber-500/30 text-center relative overflow-hidden">
              <div className="text-[11px] text-amber-300 font-bold mb-1 font-mono">総合演奏評価 (TOTAL)</div>
              <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${totalPerformancePercent >= 90 ? 'text-amber-400' : 'text-rose-400'}`}>
                {totalPerformancePercent}%
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                基準: <span className="text-amber-400 font-bold">90.0%</span> 以上
              </div>
            </div>

            {/* 打鍵タイミング精度 */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-center relative">
              <div className="text-[11px] text-stone-400 font-bold mb-1 font-mono">打鍵精度 (TIMING 70%)</div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-400">
                {accuracyPercent}%
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                スコア: <span className="text-stone-300 font-bold">{score.toLocaleString()}</span>
              </div>
            </div>

            {/* 強弱表現力 */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-center relative">
              <div className="text-[11px] text-stone-400 font-bold mb-1 font-mono">強弱表現力 (DYNAMICS 30%)</div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-sky-400">
                {expressionPercent}%
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                pp〜ff タッチ制御
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
                最高連続: <span className="text-stone-300 font-bold">{maxCombo} コンボ</span>
              </div>
            </div>
          </div>

          {/* 演奏精度のクリアゲージバー */}
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-stone-400">
              <span>総合演奏ゲージ（打鍵精度70% + 強弱表現力30% / クリアライン: 90%）</span>
              <span className="font-bold text-stone-200">{totalPerformancePercent}% / 100%</span>
            </div>
            <div className="relative w-full h-3 bg-stone-800 rounded-full overflow-hidden">
              {/* クリアライン位置マーカー (90%) */}
              <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-amber-400 z-10 shadow-[0_0_4px_#fbbf24]" />
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  totalPerformancePercent >= 90 
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400' 
                    : 'bg-gradient-to-r from-rose-700 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, totalPerformancePercent)}%` }}
              />
            </div>
          </div>

          {/* 強弱タッチ表現力内訳 & 打鍵判定内訳 (2グリッド) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 打鍵タイミング判定内訳 */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs text-stone-400 font-bold flex items-center justify-between font-mono">
                <span>TIMING ACCURACY（打鍵タイミング）</span>
                <span className="text-[10px] text-stone-500">Int主軸</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono">
                <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/25">
                  <div className="text-[9px] text-amber-400 font-bold">EXCELLENT</div>
                  <div className="text-sm sm:text-base font-black text-amber-300">{judgementsCount.excellent}</div>
                </div>
                <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/25">
                  <div className="text-[9px] text-emerald-400 font-bold">GOOD</div>
                  <div className="text-sm sm:text-base font-black text-emerald-300">{judgementsCount.good}</div>
                </div>
                <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/25">
                  <div className="text-[9px] text-blue-400 font-bold">SOSO</div>
                  <div className="text-sm sm:text-base font-black text-blue-300">{judgementsCount.soso}</div>
                </div>
                <div className="bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/25">
                  <div className="text-[9px] text-rose-400 font-bold">MISS</div>
                  <div className="text-sm sm:text-base font-black text-rose-300">{judgementsCount.notGood + judgementsCount.bad}</div>
                </div>
              </div>
            </div>

            {/* 音の強弱タッチ表現力内訳 */}
            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs text-sky-400 font-bold flex items-center justify-between font-mono">
                <span>DYNAMICS TOUCH（強弱表現タッチ）</span>
                <span className="text-[10px] text-sky-500">Dex主軸 (pp〜ff)</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono">
                <div className="bg-sky-500/10 p-1.5 rounded-lg border border-sky-500/25">
                  <div className="text-[9px] text-sky-300 font-bold">PERFECT</div>
                  <div className="text-sm sm:text-base font-black text-sky-200">{dynamicsJudgements.perfectTouch}</div>
                </div>
                <div className="bg-teal-500/10 p-1.5 rounded-lg border border-teal-500/25">
                  <div className="text-[9px] text-teal-300 font-bold">GREAT</div>
                  <div className="text-sm sm:text-base font-black text-teal-200">{dynamicsJudgements.greatTouch}</div>
                </div>
                <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/25">
                  <div className="text-[9px] text-indigo-300 font-bold">GOOD</div>
                  <div className="text-sm sm:text-base font-black text-indigo-200">{dynamicsJudgements.goodTouch}</div>
                </div>
                <div className="bg-stone-800/80 p-1.5 rounded-lg border border-stone-700/80">
                  <div className="text-[9px] text-stone-400 font-bold">ROUGH</div>
                  <div className="text-sm sm:text-base font-black text-stone-300">{dynamicsJudgements.roughTouch}</div>
                </div>
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
              <span>★ {song.composer}原典・完全再現達成（全音EXCELLENT打鍵） ★</span>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-stone-900 p-3.5 sm:p-4 rounded-xl shadow-inner border border-stone-800">
        <div className="flex gap-3 sm:gap-4 items-center">
          <div className="bg-stone-800 p-1.5 rounded-xl border border-stone-700 shadow-sm shrink-0">
            <RobotVisual robot={activeRobot} size={36} animateVictory={battleResult === 'win'} hideBackground={true} hideBubble={true} />
          </div>
          <div className="text-white font-mono text-sm">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Gi.GiGrandPiano className="text-amber-400 text-lg shrink-0" />
              <span className="font-bold text-stone-100">{song.title}</span>
              <span className="text-xs text-stone-400 font-sans">（{song.composer}）</span>
            </div>
            <div className="text-[11px] text-stone-400 flex gap-2 font-mono flex-wrap">
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

        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3 flex-wrap">
          {/* 現在の楽譜強弱インジケーター (DYNAMICS HUD) */}
          <div className="flex items-center gap-2 bg-stone-950/90 px-2.5 py-1 rounded-lg border border-stone-800 shadow-inner">
            <span className="text-[10px] text-stone-400 font-mono">強弱記号:</span>
            <span className={`text-xs font-black font-serif italic px-2 py-0.2 rounded border shadow-2xs ${getDynamicsBadge(activeDynamics)}`}>
              {activeDynamics || 'p'}
            </span>
            <span className="text-[10px] text-stone-300 font-sans hidden sm:inline">
              {getDynamicsDesc(activeDynamics)}
            </span>
          </div>

          {/* 音量調整コントロール (ボリュームスライダー & ミュート切替) */}
          <div className="flex items-center gap-2 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800">
            <button
              type="button"
              onClick={() => handleVolumeChange(pianoVolume > 0 ? 0 : 1.0)}
              className="text-stone-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-center p-0.5"
              title={pianoVolume === 0 ? "ミュート解除 (100%へ)" : "ミュート"}
            >
              {pianoVolume === 0 ? (
                <Gi.GiSpeakerOff className="text-base text-rose-400" />
              ) : (
                <Gi.GiSpeaker className="text-base text-amber-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={pianoVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-none"
              title={`音量: ${Math.round(pianoVolume * 100)}%`}
            />
            <span className="text-[11px] font-mono text-stone-300 w-8 text-right select-none">
              {Math.round(pianoVolume * 100)}%
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold px-2.5 py-0.5 rounded-full border inline-block mb-1 bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono">
              基準: 総合 90%
            </div>
            <div className="text-white font-mono text-sm">
              SCORE <span className="text-amber-400 text-lg font-black">{score.toLocaleString()}</span>
              <span className="text-stone-400 text-xs ml-2">
                総合 <strong className={totalPerformancePercent >= 90 ? 'text-emerald-400' : 'text-stone-300'}>{totalPerformancePercent}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* プレイエリア (演奏会場ステージ & フル鍵盤) */}
      <div className="relative w-full h-72 sm:h-80 bg-stone-950 rounded-2xl overflow-hidden border-4 border-stone-800 flex justify-center shadow-2xl">
        {/* コンサートホール・演奏会場バックグラウンド演出 */}
        <div className="absolute inset-0 bg-radial from-amber-950/30 via-stone-950/80 to-stone-950 pointer-events-none z-0" />
        
        {/* ステージ背景のカーテン＆スポットライト */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-full bg-gradient-to-b from-amber-400/10 via-amber-500/5 to-transparent blur-md pointer-events-none z-0" />
        <div className="absolute top-2 text-[10px] tracking-widest font-mono text-amber-500/30 uppercase pointer-events-none z-0 select-none">
          GRAND RECITALS CONCERT HALL
        </div>

        {/* 背景ライン (40鍵盤グリッド) */}
        <div className="absolute inset-0 flex justify-between opacity-10 pointer-events-none z-0">
          {whiteKeyDefs.map((_, i) => (
            <div key={i} className="h-full border-r border-stone-700" style={{ width: `${100 / TOTAL_WHITE_KEYS}%` }} />
          ))}
        </div>
        
        {/* 右上：演奏会場でロボットがピアノ協奏曲・超絶技巧演奏のアニメーションを小さく表示 (SEなし) */}
        {!isFinished && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none z-10">
            <div className="bg-stone-950/70 backdrop-blur-xs p-1 rounded-xl border border-stone-700/60 shadow-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] flex flex-col items-center">
              <div className="overflow-hidden rounded-lg flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
                <GSAPRobotCanvas
                  robot={activeRobot}
                  patternId="piano_performance"
                  loop={true}
                  speed={speed || 1.0}
                  isPaused={isPaused}
                  size={96}
                  hideStageDecorations={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* 落下するノーツ (時間ベースで位置を計算・ダイナミクスによる美しい光彩色彩) */}
        <div className="absolute inset-0 pt-2 pointer-events-none z-10">
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
              const colorClass = getDynamicsColor(note.dynamics, isBlack);

              return (
                <div 
                  key={`${idx}-${lIdx}`} 
                  className={`absolute rounded-xs shadow-md transition-opacity ${colorClass} ${
                    isBlack ? 'z-10' : 'z-0'
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
                className="text-3xl sm:text-4xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-widest font-mono flex items-center justify-center gap-2"
                style={{ color: getJudgementColor(judgement.text) }}
              >
                <span>{judgement.text}</span>
                {judgement.dynamics && (
                  <span className={`text-xs px-2 py-0.5 rounded font-serif italic border ${getDynamicsBadge(judgement.dynamics)}`}>
                    {judgement.dynamics}
                  </span>
                )}
              </div>
              {judgement.combo > 1 && (
                <div className="text-amber-300 text-sm font-bold tracking-wider drop-shadow-md">
                  {judgement.combo} COMBO!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 鍵盤エリア (40白鍵 ＋ 該当位置のリアル黒鍵) */}
        <div className="absolute bottom-0 w-full h-16 bg-stone-900 flex items-end pb-1 border-t-2 border-stone-700 px-0.5 select-none z-20">
          {whiteKeyDefs.map((def, i) => {
            const isWhitePressed = keysPressed.some(k => !k.isBlack && Math.round(k.lane) === i);
            const isBlackPressed = keysPressed.some(k => k.isBlack && Math.abs(k.lane - (i + 0.5)) < 0.25);
            
            return (
              <div 
                key={def.index} 
                onClick={(e) => {
                  e.stopPropagation();
                  playTone(def.midi, def.name, 350, 1.0);
                  setKeysPressed(prev => [...prev, { lane: i, isBlack: false, endTime: elapsedRef.current + 300 }]);
                }}
                className={`relative flex-1 h-14 rounded-b-xs border-r border-stone-400 transition-colors duration-75 cursor-pointer ${
                  isWhitePressed 
                    ? 'bg-amber-300 translate-y-0.5 shadow-inner' 
                    : 'bg-stone-100 hover:bg-stone-200 active:bg-amber-200'
                }`}
              >
                {/* 鍵盤先端の光彩エフェクト */}
                {isWhitePressed && (
                  <div className="absolute top-0 left-0 right-0 h-3 bg-amber-400/80 blur-xs" />
                )}

                {/* 黒鍵 */}
                {def.hasBlackKey && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      playTone(def.midi + 1, `${def.name}#`, 350, 1.0);
                      setKeysPressed(prev => [...prev, { lane: i + 0.5, isBlack: true, endTime: elapsedRef.current + 300 }]);
                    }}
                    className={`absolute top-0 -right-[40%] w-[80%] h-[62%] rounded-b-xs z-10 transition-colors duration-75 border-x border-b cursor-pointer ${
                      isBlackPressed 
                        ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]' 
                        : 'bg-stone-900 border-stone-800 shadow-md hover:bg-stone-800 active:bg-amber-400'
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
