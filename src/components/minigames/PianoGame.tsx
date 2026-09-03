import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Robot } from '../../core/models';
import { MinigameProps, PianoDifficulty, PIANO_DIFFICULTIES, PIANO_SONGS } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import * as Gi from 'react-icons/gi';

interface PianoGameProps extends Omit<MinigameProps, 'activeOpponent'> {
  difficulty: PianoDifficulty;
  songId: string;
}

// 5オクターブ分の白鍵周波数 (C2〜B6)
const TOTAL_KEYS = 35;
const WHITE_KEY_FREQS = [
  65.41, 73.42, 82.41, 87.31, 98.00, 110.00, 123.47, // C2-B2
  130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, // C3-B3
  261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, // C4-B4
  523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77,  // C5-B5
  1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53 // C6-B6
];

export const PianoGame: React.FC<PianoGameProps> = ({ 
  activeRobot, 
  onFinish, 
  speed, 
  isPaused, 
  isFinished, 
  battleResult,
  difficulty,
  songId
}) => {
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [keysPressed, setKeysPressed] = useState<{lane: number, endTime: number}[]>([]);
  const [judgement, setJudgement] = useState<{ id: number; text: string } | null>(null);
  
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const nextNoteIdx = useRef(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const song = PIANO_SONGS.find(s => s.id === songId) || PIANO_SONGS[0];
  const diffConfig = PIANO_DIFFICULTIES.find(d => d.id === difficulty) || PIANO_DIFFICULTIES[1];

  const currentNotes = difficulty === 'hard' ? song.notesHard : difficulty === 'easy' ? song.notesEasy : song.notesNormal;
  const maxTime = currentNotes[currentNotes.length - 1].time + 1000;
  const fallTime = 1500; // ノーツが画面上部から判定ラインに到達するまでの時間(ms)

  // 目標スコアの計算とAudioContextの初期化
  useEffect(() => {
    // 楽曲ごとの最大可能スコア (全てのノーツをEXCELLENTで取った場合、長さも考慮)
    const maxPossibleScore = currentNotes.reduce((acc, note) => {
      const durMult = note.duration && note.duration > 200 ? Math.floor(note.duration / 100) : 1;
      return acc + (note.lanes.length * 300 * durMult);
    }, 0);
    // 難易度に応じたクリア必要割合
    const reqRatio = diffConfig.id === 'hard' ? 0.75 : diffConfig.id === 'normal' ? 0.55 : 0.40;
    setTargetScore(Math.floor(maxPossibleScore * reqRatio));

    elapsedRef.current = 0;
    nextNoteIdx.current = 0;
    setScore(0);
    setElapsed(0);
    setKeysPressed([]);
    setJudgement(null);

    // AudioContext initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    
    return () => {
      audioCtxRef.current?.close();
    };
  }, [songId, difficulty, song]);

  const playTone = (frequency: number, durationMs: number = 300) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();
    const masterGain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // 倍音
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);
    
    // 少しデチューンしたサイン波で厚み出し
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 1.002, ctx.currentTime);
    
    const sec = durationMs / 1000;
    
    // ピアノらしいアタックとディケイ
    const attackTime = 0.015;
    const decayTime = Math.max(0.1, sec * 0.4);
    const releaseTime = 0.4;
    
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.8, ctx.currentTime + attackTime);
    gain1.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + attackTime + decayTime);
    gain1.gain.linearRampToValueAtTime(0.001, ctx.currentTime + sec + releaseTime);
    
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.4, ctx.currentTime + attackTime * 0.8);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + attackTime + decayTime * 0.8);
    gain2.gain.linearRampToValueAtTime(0.001, ctx.currentTime + sec + releaseTime);

    gain3.gain.setValueAtTime(0, ctx.currentTime);
    gain3.gain.linearRampToValueAtTime(0.3, ctx.currentTime + attackTime);
    gain3.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + attackTime + decayTime);
    gain3.gain.linearRampToValueAtTime(0.001, ctx.currentTime + sec + releaseTime);

    // フィルタで高音の耳障りな部分を削る
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency * 3.5 + 800; // 高音ほど開く
    filter.Q.value = 0.5;

    masterGain.gain.value = 0.5; // 音量バランス

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);
    
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();
    
    const stopTime = ctx.currentTime + sec + releaseTime + 0.1;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
  };

  useEffect(() => {
    if (isFinished || isPaused) return;

    const intervalTime = 30; // ~33fps
    const tempoMultiplier = 1.0;

    const timer = setInterval(() => {
      // 経過時間の更新 (スピードバフとテンポバフ、さらに曲固有の再生速度を乗算)
      const dt = intervalTime * speed * tempoMultiplier * (song.songSpeed || 1.0);
      elapsedRef.current += dt;
      const currentElapsed = elapsedRef.current;
      setElapsed(currentElapsed);

      const p = (currentElapsed / maxTime) * 100;
      setProgress(Math.min(100, p));

      let scoreGained = 0;
      let latestJudgeText = '';
      const activeLanes: { lane: number, endTime: number }[] = [];

      // 判定ラインに到達したノーツの処理
      while (nextNoteIdx.current < currentNotes.length && currentNotes[nextNoteIdx.current].time <= currentElapsed) {
        const note = currentNotes[nextNoteIdx.current];
        const noteDuration = note.duration || 300;
        
        // Int (予測/リズム感) と Dex (指の正確さ) による補正
        let accuracyRoll = Math.random() * 100;
        const statBonus = (activeRobot.stats.dexterity * 1.5) + (activeRobot.stats.intelligence * 1.0);
        accuracyRoll += statBonus;
        
        // 難易度ペナルティ
        const diffPenalty = diffConfig.id === 'hard' ? 40 : diffConfig.id === 'normal' ? 20 : 0;
        accuracyRoll -= diffPenalty;

        let noteScore = 0;
        let judgeStr = '';

        if (accuracyRoll >= 110) { noteScore = 300; judgeStr = 'EXCELLENT'; }
        else if (accuracyRoll >= 80) { noteScore = 150; judgeStr = 'GOOD'; }
        else if (accuracyRoll >= 50) { noteScore = 50; judgeStr = 'SOSO'; }
        else if (accuracyRoll >= 20) { noteScore = 10; judgeStr = 'NOT GOOD'; }
        else { noteScore = 0; judgeStr = 'BAD'; }

        // 和音(複数同時押し)と長さ(ロングノーツ)によるスコア倍増
        const durMult = noteDuration > 200 ? Math.floor(noteDuration / 100) : 1;
        scoreGained += noteScore * note.lanes.length * durMult;
        
        latestJudgeText = judgeStr;
        
        note.lanes.forEach(lane => {
          activeLanes.push({ lane, endTime: currentElapsed + noteDuration });
        });

        if (noteScore > 0) {
          note.lanes.forEach(lane => playTone(WHITE_KEY_FREQS[lane], noteDuration));
        }
        
        nextNoteIdx.current++;
      }

      if (scoreGained > 0) {
        setScore(prev => prev + scoreGained);
      }
      if (latestJudgeText) {
        setJudgement({ id: currentElapsed, text: latestJudgeText });
      }
      if (activeLanes.length > 0) {
        setKeysPressed(prev => {
          // 古いものを削除しつつ追加
          return [...prev.filter(k => k.endTime > currentElapsed), ...activeLanes];
        });
      }

      // 時間切れのキーハイライトをクリア
      setKeysPressed(prev => prev.filter(k => k.endTime > currentElapsed));

      if (currentElapsed >= maxTime) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isFinished, isPaused, speed, difficulty, song, maxTime]);

  // ゲーム終了判定
  useEffect(() => {
    if (progress >= 100 && !isFinished && !isPaused) {
      if (score >= targetScore) {
        onFinish('win');
      } else {
        onFinish('lose');
      }
    }
  }, [progress, isFinished, isPaused, score, targetScore]);

  const getJudgementColor = (text: string) => {
    switch (text) {
      case 'EXCELLENT': return '#fbbf24';
      case 'GOOD': return '#4ade80';
      case 'SOSO': return '#60a5fa';
      case 'NOT GOOD': return '#f87171';
      default: return '#9ca3af';
    }
  };

  useEffect(() => {
    if (bgmAudioRef.current) {
      if (!isPaused && !isFinished) {
        bgmAudioRef.current.volume = 0.2;
        bgmAudioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      } else {
        bgmAudioRef.current.pause();
      }
    }
  }, [isPaused, isFinished]);

  return (
    <div className="space-y-4">
      {song.bgmUrl && (
        <audio ref={bgmAudioRef} src={song.bgmUrl} loop preload="auto" />
      )}
      {/* ヘッダーステータス */}
      <div className="flex justify-between items-center bg-stone-900 p-4 rounded-lg shadow-inner">
        <div className="flex gap-4 items-center">
          <div className="bg-white p-1 rounded-lg border border-stone-700">
             <RobotVisual robot={activeRobot} size={32} animateVictory={battleResult === 'win'} hideBackground={true} hideBubble={true} />
          </div>
          <div className="text-white font-mono text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Gi.GiMusicalKeyboard className="text-amber-400" />
              <span>{song.title}</span>
            </div>
            <div className="text-[10px] text-stone-400 flex gap-2">
              <span className="bg-stone-800 px-1.5 rounded">Int: {activeRobot.stats.intelligence}</span>
              <span className="bg-stone-800 px-1.5 rounded">Dex: {activeRobot.stats.dexterity}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-bold px-2 py-1 rounded border inline-block mb-1 ${diffConfig.badgeClass}`}>
            {diffConfig.label}
          </div>
          <div className="text-white font-mono text-sm">
            SCORE <span className="text-amber-400 text-lg">{score}</span> / {targetScore}
          </div>
        </div>
      </div>

      {/* プレイエリア */}
      <div className="relative w-full h-56 bg-stone-950 rounded-xl overflow-hidden border-4 border-stone-800 flex justify-center shadow-lg">
        {/* 背景ライン (5オクターブ・35レーン) */}
        <div className="absolute inset-0 flex justify-between opacity-10">
          {Array.from({ length: TOTAL_KEYS }).map((_, i) => (
            <div key={i} className="h-full border-r border-stone-700" style={{ width: `${100/TOTAL_KEYS}%` }} />
          ))}
        </div>
        
        {/* 落下するノーツ (時間ベースで位置を計算) */}
        <div className="absolute inset-0 pt-2">
          {currentNotes.map((note, idx) => {
            const timeUntilHit = note.time - elapsed;
            const noteDuration = note.duration || 300;
            // しっぽが通り過ぎるまで描画する (判定ラインは下から12%の位置とする)
            if (timeUntilHit + noteDuration < -100 || timeUntilHit > fallTime) return null;
            
            // 判定ラインを y=88(%) とした場合の相対位置。topだと計算しにくいので、bottomを基準にする。
            // timeUntilHit = 0 のとき先頭（一番下）が 88% の位置（つまり下から12%）に来るようにする。
            const bottomPos = 12 + (timeUntilHit / fallTime) * 88;
            const hPercent = Math.max(2, (noteDuration / fallTime) * 88);

            return note.lanes.map(lane => (
              <div 
                key={`${idx}-${lane}`} 
                className="absolute bg-amber-400 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.8)] opacity-90"
                style={{
                  bottom: `${bottomPos}%`,
                  height: `${hPercent}%`,
                  left: `calc(${lane * (100 / TOTAL_KEYS)}% + 1px)`,
                  width: `calc(${100 / TOTAL_KEYS}% - 2px)`
                }}
              />
            ));
          })}
        </div>

        {/* 判定・コンボテキスト */}
        <AnimatePresence>
          {judgement && !isFinished && (
            <motion.div
              key={judgement.id}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -30, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-30 tracking-wider"
              style={{ color: getJudgementColor(judgement.text) }}
            >
              {judgement.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 演奏ロボットアニメーション */}
        {!isFinished && (
          <div className="absolute bottom-14 left-0 right-0 h-16 pointer-events-none z-20">
            <motion.div
              className="absolute bottom-0"
              style={{ 
                width: '64px',
                marginLeft: '-32px'
              }}
              initial={{ left: '50%' }}
              animate={{ 
                left: keysPressed.length > 0 
                  ? `${((keysPressed.reduce((acc, k) => acc + k.lane, 0) / keysPressed.length) / (TOTAL_KEYS - 1)) * 100}%` 
                  : '50%',
                y: keysPressed.length > 0 ? 8 : 0,
                rotate: keysPressed.length > 0 ? [-5, 5, 0] : 0,
                scale: keysPressed.length > 0 ? 0.95 : 1
              }}
              transition={{
                left: { type: 'spring', stiffness: 200, damping: 20 },
                y: { type: 'spring', stiffness: 500, damping: 25 },
                rotate: { duration: 0.15 },
                scale: { duration: 0.1 }
              }}
            >
              <div className="relative flex justify-center drop-shadow-md">
                <RobotVisual robot={activeRobot} size={64} hideBackground={true} hideBubble={true} />
              </div>
            </motion.div>
          </div>
        )}

        {/* 鍵盤エリア (5オクターブ・35白鍵) */}
        <div className="absolute bottom-0 w-full h-14 bg-stone-800 flex justify-between items-end pb-1 border-t-2 border-stone-600 px-[2px] gap-[1px]">
          {Array.from({ length: TOTAL_KEYS }).map((_, i) => {
            const isPressed = keysPressed.some(k => k.lane === i);
            const noteInOctave = i % 7;
            const hasBlackKey = [0, 1, 3, 4, 5].includes(noteInOctave);
            
            return (
              <div 
                key={i} 
                className={`flex-1 h-12 rounded-b-sm transition-colors ${isPressed ? 'bg-amber-300 translate-y-1' : 'bg-stone-200'} border border-stone-400 relative`}
              >
                {/* 黒鍵 (右側に配置、最後の鍵盤には配置しない) */}
                {hasBlackKey && i !== (TOTAL_KEYS - 1) && (
                   <div className="absolute top-0 -right-[60%] w-[120%] h-[65%] bg-stone-900 rounded-b-sm z-10 shadow-sm border-x border-b border-stone-700" />
                )}
                {isPressed && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 blur-sm rounded-full opacity-60 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* プログレスバー (最下部) */}
        <div className="absolute bottom-0 left-0 h-1 bg-amber-500 z-20" style={{ width: `${progress}%` }} />

        {/* 結果表示 */}
        <AnimatePresence>
          {isFinished && (
            <motion.div 
              className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center"
              >
                {battleResult === 'win' ? (
                  <>
                    <div className="text-5xl mb-2"><Gi.GiPartyPopper className="inline text-amber-500" /></div>
                    <div className="text-emerald-400 text-3xl font-black drop-shadow-md tracking-wider">CLEARED!</div>
                    <div className="text-stone-200 mt-2 text-sm font-bold bg-stone-800/90 px-4 py-1.5 rounded-full border border-stone-600">
                      目標 {targetScore} / スコア {score}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-2 flex justify-center"><Gi.GiWaterDrop className="text-blue-400" /></div>
                    <div className="text-rose-500 text-3xl font-black drop-shadow-md tracking-wider">FAILED...</div>
                    <div className="text-stone-200 mt-2 text-sm font-bold bg-stone-800/90 px-4 py-1.5 rounded-full border border-stone-600">
                      目標 {targetScore} / スコア {score}
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

