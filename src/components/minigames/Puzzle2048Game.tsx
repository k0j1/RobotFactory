import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MinigameProps, Opponent } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import * as Gi from 'react-icons/gi';
import { Trophy, Zap, Play, Pause, FastForward, Clock } from 'lucide-react';
import { Button } from '../ui/core';

export interface Puzzle2048GameProps extends MinigameProps {
  onExit?: () => void;
}

const GRID_SIZE = 4;
const MATCH_DURATION_SEC = 45; // 45秒の制限時間対戦

type Board = number[][];

interface CoreTheme {
  name: string;
  bg: string;
  text: string;
  border: string;
  glow: string;
}

const CORE_THEMES: Record<number, CoreTheme> = {
  2: { name: '鉄', bg: 'bg-stone-700', text: 'text-stone-200', border: 'border-stone-500', glow: '' },
  4: { name: '銅', bg: 'bg-amber-800', text: 'text-amber-100', border: 'border-amber-600', glow: '' },
  8: { name: '銀', bg: 'bg-slate-600', text: 'text-slate-100', border: 'border-slate-400', glow: 'shadow-[0_0_8px_rgba(203,213,225,0.4)]' },
  16: { name: '金', bg: 'bg-amber-600', text: 'text-yellow-100', border: 'border-yellow-400', glow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]' },
  32: { name: '水晶', bg: 'bg-cyan-700', text: 'text-cyan-100', border: 'border-cyan-400', glow: 'shadow-[0_0_12px_rgba(34,211,238,0.6)]' },
  64: { name: '紅玉', bg: 'bg-rose-700', text: 'text-rose-100', border: 'border-rose-400', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]' },
  128: { name: '蒼玉', bg: 'bg-blue-700', text: 'text-blue-100', border: 'border-blue-400', glow: 'shadow-[0_0_14px_rgba(96,165,250,0.7)]' },
  256: { name: '翠玉', bg: 'bg-emerald-700', text: 'text-emerald-100', border: 'border-emerald-400', glow: 'shadow-[0_0_14px_rgba(52,211,153,0.7)]' },
  512: { name: '電漿', bg: 'bg-purple-700', text: 'text-purple-100', border: 'border-purple-400', glow: 'shadow-[0_0_16px_rgba(192,132,252,0.8)]' },
  1024: { name: '反物質', bg: 'bg-violet-900', text: 'text-violet-100', border: 'border-fuchsia-400', glow: 'shadow-[0_0_18px_rgba(217,70,239,0.8)]' },
  2048: { name: 'Ω極光', bg: 'bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600', text: 'text-white font-black', border: 'border-yellow-300', glow: 'shadow-[0_0_22px_rgba(251,191,36,0.9)] animate-pulse' },
  4096: { name: '特異点', bg: 'bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-600', text: 'text-white font-black', border: 'border-pink-300', glow: 'shadow-[0_0_25px_rgba(236,72,153,0.9)] animate-pulse' },
  8192: { name: '超次元', bg: 'bg-gradient-to-r from-red-600 via-yellow-400 to-teal-400', text: 'text-stone-950 font-black', border: 'border-white', glow: 'shadow-[0_0_30px_rgba(255,255,255,1)] animate-bounce' }
};

// Web Audio API による合成効果音
function playSound(type: 'slide' | 'merge' | 'whistle' | 'win' | 'lose') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'slide') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } else if (type === 'merge') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.27);
      });
    }
  } catch {}
}

// 4x4盤面の生成
function createInitialBoard(): Board {
  const b: Board = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  spawnRandomTile(b);
  spawnRandomTile(b);
  return b;
}

// ランダムにタイルを配置 (90%で2, 10%で4)
function spawnRandomTile(b: Board): boolean {
  const emptyCells: { r: number; c: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (b[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  if (emptyCells.length === 0) return false;
  const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  b[choice.r][choice.c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

// 行スライド処理
function slideRow(row: number[], dexMult: number = 1.0): { row: number[]; gainedScore: number; merged: boolean } {
  const nonZero = row.filter(v => v !== 0);
  const result: number[] = [];
  let gainedScore = 0;
  let merged = false;
  let i = 0;
  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const mergedVal = nonZero[i] * 2;
      result.push(mergedVal);
      gainedScore += Math.round(mergedVal * dexMult);
      merged = true;
      i += 2;
    } else {
      result.push(nonZero[i]);
      i++;
    }
  }
  while (result.length < GRID_SIZE) {
    result.push(0);
  }
  return { row: result, gainedScore, merged };
}

// 4方向へのスライドシミュレーション
function simulateMove(board: Board, direction: 'left' | 'right' | 'up' | 'down', dexMult: number = 1.0): { newBoard: Board; gainedScore: number; moved: boolean } {
  const newBoard: Board = board.map(r => [...r]);
  let totalGained = 0;
  let moved = false;

  if (direction === 'left') {
    for (let r = 0; r < GRID_SIZE; r++) {
      const { row, gainedScore } = slideRow(newBoard[r], dexMult);
      totalGained += gainedScore;
      if (row.some((val, c) => val !== newBoard[r][c])) moved = true;
      newBoard[r] = row;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < GRID_SIZE; r++) {
      const reversed = [...newBoard[r]].reverse();
      const { row, gainedScore } = slideRow(reversed, dexMult);
      const restored = row.reverse();
      totalGained += gainedScore;
      if (restored.some((val, c) => val !== newBoard[r][c])) moved = true;
      newBoard[r] = restored;
    }
  } else if (direction === 'up') {
    for (let c = 0; c < GRID_SIZE; c++) {
      const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
      const { row, gainedScore } = slideRow(col, dexMult);
      totalGained += gainedScore;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newBoard[r][c] !== row[r]) moved = true;
        newBoard[r][c] = row[r];
      }
    }
  } else if (direction === 'down') {
    for (let c = 0; c < GRID_SIZE; c++) {
      const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
      const { row, gainedScore } = slideRow(col, dexMult);
      totalGained += gainedScore;
      const restored = row.reverse();
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newBoard[r][c] !== restored[r]) moved = true;
        newBoard[r][c] = restored[r];
      }
    }
  }

  return { newBoard, gainedScore: totalGained, moved };
}

// ゲームオーバー判定
function checkGameOver(b: Board): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (b[r][c] === 0) return false;
      if (c + 1 < GRID_SIZE && b[r][c] === b[r][c + 1]) return false;
      if (r + 1 < GRID_SIZE && b[r][c] === b[r + 1][c]) return false;
    }
  }
  return true;
}

// AI評価関数（2048ヒューリスティック評価）
function evaluateBoard(b: Board): number {
  let emptyCells = 0;
  let maxVal = 0;
  let maxR = 0;
  let maxC = 0;
  let smoothness = 0;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const val = b[r][c];
      if (val === 0) {
        emptyCells++;
      } else {
        if (val > maxVal) {
          maxVal = val;
          maxR = r;
          maxC = c;
        }
        // 隣接との差分
        if (c + 1 < GRID_SIZE && b[r][c + 1] !== 0) {
          smoothness -= Math.abs(Math.log2(val) - Math.log2(b[r][c + 1]));
        }
        if (r + 1 < GRID_SIZE && b[r + 1][c] !== 0) {
          smoothness -= Math.abs(Math.log2(val) - Math.log2(b[r + 1][c]));
        }
      }
    }
  }

  // 四隅（特に左上か右上）に最大タイルがあるボーナス
  const isCorner = (maxR === 0 || maxR === GRID_SIZE - 1) && (maxC === 0 || maxC === GRID_SIZE - 1);
  const cornerBonus = isCorner ? 1000 : -500;

  // 単調性（Monotonicity: 端に向かって降順に並んでいるか）
  let monotonicity = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      if (b[r][c] >= b[r][c + 1]) monotonicity += 10;
    }
  }

  return (emptyCells * 250) + cornerBonus + (monotonicity * 15) + (smoothness * 20);
}

// AI思考で次の一手を決定
function decideNextMove(b: Board, intStat: number): 'left' | 'right' | 'up' | 'down' | null {
  const directions: ('left' | 'right' | 'up' | 'down')[] = ['left', 'right', 'up', 'down'];
  const validMoves: { dir: 'left' | 'right' | 'up' | 'down'; score: number; gained: number }[] = [];

  for (const dir of directions) {
    const { newBoard, gainedScore, moved } = simulateMove(b, dir);
    if (moved) {
      const evalScore = evaluateBoard(newBoard) + (gainedScore * 3);
      validMoves.push({ dir, score: evalScore, gained: gainedScore });
    }
  }

  if (validMoves.length === 0) return null;

  // スコア順にソート
  validMoves.sort((a, b) => b.score - a.score);

  // 知力(INT)に応じたベスト選択確率
  // INT 10 -> 65%, INT 100 -> 90%, INT 200+ -> 98%
  const bestChoiceProb = Math.min(0.98, 0.60 + (intStat * 0.002));
  if (Math.random() < bestChoiceProb || validMoves.length === 1) {
    return validMoves[0].dir;
  }
  // 次点の手を選択
  return validMoves[Math.min(validMoves.length - 1, 1)].dir;
}

export const Puzzle2048Game: React.FC<Puzzle2048GameProps> = ({
  activeRobot,
  activeOpponent,
  onFinish,
  speed = 1,
  isPaused = false,
  isFinished = false,
  battleResult,
  onTogglePause,
  onSetSpeed,
  onExit
}) => {
  // プレイヤー1 (自機ロボット)
  const [board1, setBoard1] = useState<Board>(() => createInitialBoard());
  const [score1, setScore1] = useState(0);
  const [maxTile1, setMaxTile1] = useState(2);
  const [isDead1, setIsDead1] = useState(false);
  const [lastMove1, setLastMove1] = useState<string | null>(null);

  // プレイヤー2 (ライバル対戦相手)
  const [board2, setBoard2] = useState<Board>(() => createInitialBoard());
  const [score2, setScore2] = useState(0);
  const [maxTile2, setMaxTile2] = useState(2);
  const [isDead2, setIsDead2] = useState(false);
  const [lastMove2, setLastMove2] = useState<string | null>(null);

  // 制限時間（秒）
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION_SEC);
  const finishTriggeredRef = useRef(false);

  // 能力値の取得
  const p1Int = activeRobot?.stats?.intelligence || 15;
  const p1Dex = activeRobot?.stats?.dexterity || 15;
  const p1Agi = activeRobot?.stats?.agility || 15;

  const opponentObj: Opponent = activeOpponent || {
    id: 'op_default',
    name: 'ライバルAI',
    org: '演習アカデミー',
    level: 3,
    int: 35,
    agi: 30,
    dex: 30,
    hp: 50,
    power: 30,
    defense: 30,
    rewardKits: 1,
    rewardElements: 1,
    rewardFame: 1
  };

  const p2Int = opponentObj.int || 25;
  const p2Dex = opponentObj.dex || 25;
  const p2Agi = opponentObj.agi || 25;

  // タイマー進行
  useEffect(() => {
    if (isFinished || isPaused || battleResult || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000 / Math.max(1, speed));

    return () => clearInterval(timer);
  }, [isFinished, isPaused, battleResult, timeLeft, speed]);

  // 自機AI自動スライドループ
  useEffect(() => {
    if (isFinished || isPaused || battleResult || isDead1 || timeLeft <= 0) return;

    // AGIに応じた着手インターバル (例: 350ms〜650ms / speed)
    const intervalMs = Math.max(160, 520 - (p1Agi * 1.8)) / Math.max(1, speed);

    const stepTimer = setInterval(() => {
      setBoard1(current => {
        if (checkGameOver(current)) {
          setIsDead1(true);
          return current;
        }

        const nextDir = decideNextMove(current, p1Int);
        if (!nextDir) {
          setIsDead1(true);
          return current;
        }

        const dexMult = 1 + (p1Dex * 0.008);
        const { newBoard, gainedScore, moved } = simulateMove(current, nextDir, dexMult);
        if (moved) {
          spawnRandomTile(newBoard);
          setLastMove1(nextDir);
          if (gainedScore > 0) {
            setScore1(s => s + gainedScore);
            playSound('merge');
          } else {
            playSound('slide');
          }

          // 最大タイルの更新
          let maxVal = 2;
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (newBoard[r][c] > maxVal) maxVal = newBoard[r][c];
            }
          }
          setMaxTile1(maxVal);

          if (checkGameOver(newBoard)) {
            setIsDead1(true);
          }
          return newBoard;
        }
        return current;
      });
    }, intervalMs);

    return () => clearInterval(stepTimer);
  }, [isFinished, isPaused, battleResult, isDead1, timeLeft, speed, p1Agi, p1Int, p1Dex]);

  // 相手AI自動スライドループ
  useEffect(() => {
    if (isFinished || isPaused || battleResult || isDead2 || timeLeft <= 0) return;

    // 相手AGIに応じた着手インターバル
    const intervalMs = Math.max(160, 520 - (p2Agi * 1.8)) / Math.max(1, speed);

    const stepTimer = setInterval(() => {
      setBoard2(current => {
        if (checkGameOver(current)) {
          setIsDead2(true);
          return current;
        }

        const nextDir = decideNextMove(current, p2Int);
        if (!nextDir) {
          setIsDead2(true);
          return current;
        }

        const dexMult = 1 + (p2Dex * 0.008);
        const { newBoard, gainedScore, moved } = simulateMove(current, nextDir, dexMult);
        if (moved) {
          spawnRandomTile(newBoard);
          setLastMove2(nextDir);
          if (gainedScore > 0) {
            setScore2(s => s + gainedScore);
          }

          let maxVal = 2;
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (newBoard[r][c] > maxVal) maxVal = newBoard[r][c];
            }
          }
          setMaxTile2(maxVal);

          if (checkGameOver(newBoard)) {
            setIsDead2(true);
          }
          return newBoard;
        }
        return current;
      });
    }, intervalMs);

    return () => clearInterval(stepTimer);
  }, [isFinished, isPaused, battleResult, isDead2, timeLeft, speed, p2Agi, p2Int, p2Dex]);

  // 試合終了判定（時間切れ、または両者ゲームオーバー）
  useEffect(() => {
    if (finishTriggeredRef.current || isFinished || battleResult) return;

    const isBothDead = isDead1 && isDead2;
    const isTimeUp = timeLeft <= 0;

    if (isTimeUp || isBothDead) {
      finishTriggeredRef.current = true;
      if (score1 > score2) {
        playSound('win');
        onFinish('win');
      } else if (score1 < score2) {
        playSound('lose');
        onFinish('lose');
      } else {
        onFinish('draw');
      }
    }
  }, [timeLeft, isDead1, isDead2, score1, score2, isFinished, battleResult, onFinish]);

  const scoreDiff = score1 - score2;

  // 4x4盤面のレンダリング
  const renderGrid = (board: Board, isPlayer1: boolean) => (
    <div className="grid grid-cols-4 gap-1.5 p-2 bg-stone-900/95 rounded-xl border border-stone-700 shadow-inner aspect-square w-full max-w-[240px] mx-auto">
      {board.map((row, r) =>
        row.map((val, c) => {
          const theme = CORE_THEMES[val];
          return (
            <div
              key={`${r}-${c}`}
              className={`rounded-lg flex flex-col items-center justify-center font-mono font-bold transition-all duration-150 select-none ${
                val === 0
                  ? 'bg-stone-800/60 border border-stone-700/50'
                  : `${theme?.bg || 'bg-stone-700'} ${theme?.text || 'text-white'} ${theme?.border || 'border-stone-500'} border ${theme?.glow || ''}`
              }`}
            >
              {val > 0 && (
                <>
                  <span className="text-xs sm:text-sm leading-none font-black">{val}</span>
                  <span className="text-[8px] opacity-75 font-sans leading-none mt-0.5">{theme?.name || ''}</span>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* 上部ヘッダー：VSゲージ＆タイマーバー */}
      <div className="bg-stone-900 border-2 border-amber-500/80 rounded-2xl p-3 shadow-md text-white">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          {/* 自機スコア */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 font-mono">YOU</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
              {score1.toLocaleString()}
            </span>
            {scoreDiff > 0 && (
              <span className="text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">
                +{scoreDiff.toLocaleString()} LEAD!
              </span>
            )}
          </div>

          {/* タイマー中央表示 */}
          <div className="flex items-center gap-1.5 bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
            <Clock size={14} className={timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-amber-400'} />
            <span className={`font-mono font-bold text-sm sm:text-base ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-stone-200'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>

          {/* 相手スコア */}
          <div className="flex items-center gap-2">
            {scoreDiff < 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">
                {scoreDiff.toLocaleString()}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-black font-mono text-stone-200">
              {score2.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-red-400 font-mono">OPPONENT</span>
          </div>
        </div>

        {/* スコア比率プログレスバー */}
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden flex border border-stone-700">
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
            style={{ width: `${score1 + score2 === 0 ? 50 : Math.max(5, Math.min(95, (score1 / (score1 + score2)) * 100))}%` }}
          />
          <div 
            className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-300 flex-1"
          />
        </div>
      </div>

      {/* 2画面並列（自機 VS ライバル） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 左側：自機ロボット盤面 */}
        <div className="bg-stone-950/90 border-2 border-amber-500/80 rounded-2xl p-3 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-amber-500/50 flex items-center justify-center shrink-0">
                <RobotVisual robot={activeRobot} size={32} hideBubble={true} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-stone-100">{activeRobot.name}</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/40 font-mono">
                    YOU
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 font-mono flex items-center gap-2 mt-0.5">
                  <span>Int {p1Int}</span>
                  <span>Dex {p1Dex}</span>
                  <span>Agi {p1Agi}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 block font-mono">最大コア</span>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-stone-800 border border-amber-400 text-amber-300">
                {maxTile1} ({CORE_THEMES[maxTile1]?.name || ''})
              </span>
            </div>
          </div>

          {/* 4x4 グリッド */}
          <div className="relative">
            {renderGrid(board1, true)}
            {isDead1 && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-rose-400 font-bold text-sm">
                <Gi.GiHazardSign className="text-2xl mb-1" />
                <span>手詰まり（スコア確定）</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-center text-[10px] text-stone-400 font-mono flex items-center justify-center gap-2">
            <Zap size={11} className="text-amber-400 animate-pulse" />
            <span>自機思考AI: 自動スライド演算中 {lastMove1 ? `[${lastMove1.toUpperCase()}]` : ''}</span>
          </div>
        </div>

        {/* 右側：ライバル対戦相手盤面 */}
        <div className="bg-stone-950/90 border-2 border-stone-700 rounded-2xl p-3 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-red-400 text-lg">
                <Gi.GiRobotAntennas />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-stone-100">{opponentObj.name}</span>
                  <span className="text-[9px] bg-red-950 text-red-300 px-1 py-0.2 rounded border border-red-800 font-mono">
                    Lv.{opponentObj.level}
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 font-mono flex items-center gap-2 mt-0.5">
                  <span>Int {p2Int}</span>
                  <span>Dex {p2Dex}</span>
                  <span>Agi {p2Agi}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 block font-mono">最大コア</span>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-stone-800 border border-stone-600 text-stone-200">
                {maxTile2} ({CORE_THEMES[maxTile2]?.name || ''})
              </span>
            </div>
          </div>

          {/* 4x4 グリッド */}
          <div className="relative">
            {renderGrid(board2, false)}
            {isDead2 && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-rose-400 font-bold text-sm">
                <Gi.GiHazardSign className="text-2xl mb-1" />
                <span>手詰まり（スコア確定）</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-center text-[10px] text-stone-400 font-mono flex items-center justify-center gap-2">
            <Zap size={11} className="text-red-400 animate-pulse" />
            <span>相手思考AI: 自動スライド演算中 {lastMove2 ? `[${lastMove2.toUpperCase()}]` : ''}</span>
          </div>
        </div>
      </div>

      {/* 観戦コントロールバー */}
      <div className="flex justify-between items-center bg-stone-900 border border-stone-800 p-2 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          {onTogglePause && (
            <Button size="sm" onClick={onTogglePause} variant="secondary" className="px-3 py-1 font-bold text-xs flex items-center gap-1">
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? '再開' : '一時停止'}</span>
            </Button>
          )}
          {onSetSpeed && (
            <div className="flex items-center gap-1 bg-stone-800 p-1 rounded border border-stone-700">
              <Button size="sm" onClick={() => onSetSpeed(1)} className={`px-2 py-0.5 text-[10px] font-mono ${speed === 1 ? 'bg-amber-600 text-white' : 'bg-transparent text-stone-400'}`}>1x</Button>
              <Button size="sm" onClick={() => onSetSpeed(2)} className={`px-2 py-0.5 text-[10px] font-mono ${speed === 2 ? 'bg-amber-600 text-white' : 'bg-transparent text-stone-400'}`}>2x</Button>
              <Button size="sm" onClick={() => onSetSpeed(3)} className={`px-2 py-0.5 text-[10px] font-mono ${speed === 3 ? 'bg-amber-600 text-white' : 'bg-transparent text-stone-400'}`}>3x</Button>
            </div>
          )}
        </div>

        {onExit && (
          <Button size="sm" onClick={onExit} variant="secondary" className="px-3 py-1 text-xs text-stone-400 hover:text-stone-200">
            演習を中断
          </Button>
        )}
      </div>
    </div>
  );
};
