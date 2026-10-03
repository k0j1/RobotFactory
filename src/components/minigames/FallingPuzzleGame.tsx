import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MinigameProps, Opponent } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import * as Gi from 'react-icons/gi';
import { Clock, Zap, Play, Pause } from 'lucide-react';
import { Button } from '../ui/core';

export interface FallingPuzzleGameProps extends MinigameProps {
  onExit?: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const MATCH_DURATION_SEC = 50; // 50秒の制限時間対戦

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface TetrominoDef {
  shape: number[][];
  color: string;
  borderColor: string;
}

const TETROMINOS: Record<TetrominoType, TetrominoDef> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-300'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-400',
    borderColor: 'border-yellow-200'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-purple-500',
    borderColor: 'border-purple-300'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-300'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-rose-500',
    borderColor: 'border-rose-300'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-blue-600',
    borderColor: 'border-blue-300'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-orange-500',
    borderColor: 'border-orange-300'
  }
};

const TETROMINO_KEYS: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Web Audio API サウンド
function playTetraSound(type: 'clear' | 'tetris' | 'win' | 'lose') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'clear') {
      [440, 660].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.06, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.12);
      });
    } else if (type === 'tetris') {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.1, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.28);
      });
    }
  } catch {}
}

function createEmptyGrid(): number[][] {
  return Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
}

function getRandomType(): TetrominoType {
  return TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
}

function rotateMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const rotated = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = matrix[r][c];
    }
  }
  return rotated;
}

function checkCollision(matrix: number[][], posX: number, posY: number, currentGrid: number[][]): boolean {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        const boardX = posX + c;
        const boardY = posY + r;
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return true;
        }
        if (boardY >= 0 && currentGrid[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

// ドロップ位置シミュレーション
function getDropY(matrix: number[][], posX: number, startY: number, grid: number[][]): number {
  let y = startY;
  while (!checkCollision(matrix, posX, y + 1, grid)) {
    y++;
  }
  return y;
}

// Pierre Dellacherie風の評価アルゴリズム
interface PlacementCandidate {
  rotation: number;
  matrix: number[][];
  x: number;
  y: number;
  evalScore: number;
  clearedLines: number;
}

function evaluateGridAfterPlacement(grid: number[][]): { evalScore: number; clearedLines: number } {
  let landingHeightSum = 0;
  let clearedLines = 0;
  let holes = 0;
  let bumpiness = 0;
  const colHeights = Array(BOARD_WIDTH).fill(0);

  // 各列の高さを算出
  for (let c = 0; c < BOARD_WIDTH; c++) {
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      if (grid[r][c] !== 0) {
        colHeights[c] = BOARD_HEIGHT - r;
        break;
      }
    }
  }

  // 消去ライン数
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    if (grid[r].every(cell => cell !== 0)) {
      clearedLines++;
    }
  }

  // 穴（ブロックの下の空きマス）
  for (let c = 0; c < BOARD_WIDTH; c++) {
    let hasBlockAbove = false;
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      if (grid[r][c] !== 0) {
        hasBlockAbove = true;
      } else if (hasBlockAbove) {
        holes++;
      }
    }
  }

  // 起伏（隣接列の高さの差）
  for (let c = 0; c < BOARD_WIDTH - 1; c++) {
    bumpiness += Math.abs(colHeights[c] - colHeights[c + 1]);
  }

  const maxHeight = Math.max(...colHeights);

  // 評価スコア算出（高いほど良い）
  const evalScore = (clearedLines * 400) - (maxHeight * 12) - (holes * 45) - (bumpiness * 6);
  return { evalScore, clearedLines };
}

// AIが最適配置を探索
function findBestPlacement(type: TetrominoType, grid: number[][], intStat: number): PlacementCandidate | null {
  const baseDef = TETROMINOS[type];
  const candidates: PlacementCandidate[] = [];

  let currentMatrix = baseDef.shape.map(r => [...r]);

  for (let rot = 0; rot < 4; rot++) {
    for (let x = -2; x < BOARD_WIDTH; x++) {
      if (!checkCollision(currentMatrix, x, 0, grid)) {
        const dropY = getDropY(currentMatrix, x, 0, grid);

        // 仮想グリッドに配置
        const testGrid = grid.map(r => [...r]);
        let validPlacement = true;
        for (let r = 0; r < currentMatrix.length; r++) {
          for (let c = 0; c < currentMatrix[r].length; c++) {
            if (currentMatrix[r][c] !== 0) {
              const by = dropY + r;
              const bx = x + c;
              if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                testGrid[by][bx] = 1;
              } else {
                validPlacement = false;
              }
            }
          }
        }

        if (validPlacement) {
          const { evalScore, clearedLines } = evaluateGridAfterPlacement(testGrid);
          candidates.push({
            rotation: rot,
            matrix: currentMatrix.map(row => [...row]),
            x,
            y: dropY,
            evalScore,
            clearedLines
          });
        }
      }
    }
    currentMatrix = rotateMatrix(currentMatrix);
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.evalScore - a.evalScore);

  // INTに応じた選択確率
  const bestProb = Math.min(0.96, 0.60 + (intStat * 0.002));
  if (Math.random() < bestProb || candidates.length === 1) {
    return candidates[0];
  }
  return candidates[Math.min(candidates.length - 1, 1)];
}

export const FallingPuzzleGame: React.FC<FallingPuzzleGameProps> = ({
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
  // プレイヤー1 (自機)
  const [grid1, setGrid1] = useState<number[][]>(() => createEmptyGrid());
  const [score1, setScore1] = useState(0);
  const [lines1, setLines1] = useState(0);
  const [isDead1, setIsDead1] = useState(false);
  const [nextPiece1, setNextPiece1] = useState<TetrominoType>(() => getRandomType());

  // プレイヤー2 (相手)
  const [grid2, setGrid2] = useState<number[][]>(() => createEmptyGrid());
  const [score2, setScore2] = useState(0);
  const [lines2, setLines2] = useState(0);
  const [isDead2, setIsDead2] = useState(false);
  const [nextPiece2, setNextPiece2] = useState<TetrominoType>(() => getRandomType());

  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION_SEC);
  const finishTriggeredRef = useRef(false);

  // 能力値
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

  // 自機AI自動ピース落下＆配置ループ
  useEffect(() => {
    if (isFinished || isPaused || battleResult || isDead1 || timeLeft <= 0) return;

    // AGIに応じた配置サイクルインターバル (例: 380ms〜700ms / speed)
    const intervalMs = Math.max(200, 620 - (p1Agi * 2.2)) / Math.max(1, speed);

    const stepTimer = setInterval(() => {
      const pieceToDrop = nextPiece1;
      setNextPiece1(getRandomType());

      setGrid1(currentGrid => {
        const best = findBestPlacement(pieceToDrop, currentGrid, p1Int);
        if (!best) {
          setIsDead1(true);
          return currentGrid;
        }

        const newGrid = currentGrid.map(r => [...r]);
        const typeId = TETROMINO_KEYS.indexOf(pieceToDrop) + 1;

        // グリッドに固定
        for (let r = 0; r < best.matrix.length; r++) {
          for (let c = 0; c < best.matrix[r].length; c++) {
            if (best.matrix[r][c] !== 0) {
              const by = best.y + r;
              const bx = best.x + c;
              if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                newGrid[by][bx] = typeId;
              }
            }
          }
        }

        // ライン消去
        const remainingRows = newGrid.filter(row => !row.every(cell => cell !== 0));
        const clearedCount = BOARD_HEIGHT - remainingRows.length;
        let finalGrid = newGrid;

        if (clearedCount > 0) {
          const emptyRows = Array(clearedCount).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
          finalGrid = [...emptyRows, ...remainingRows];

          // DEXに応じたスコア計算
          const dexMult = 1 + (p1Dex * 0.012);
          const baseScore = clearedCount === 1 ? 100 : clearedCount === 2 ? 300 : clearedCount === 3 ? 600 : 1200;
          const gained = Math.round(baseScore * dexMult);

          setScore1(s => s + gained);
          setLines1(l => l + clearedCount);

          if (clearedCount === 4) {
            playTetraSound('tetris');
          } else {
            playTetraSound('clear');
          }
        }

        // 窒息判定
        if (finalGrid[0].some(cell => cell !== 0) || finalGrid[1].some(cell => cell !== 0)) {
          setIsDead1(true);
        }

        return finalGrid;
      });
    }, intervalMs);

    return () => clearInterval(stepTimer);
  }, [isFinished, isPaused, battleResult, isDead1, timeLeft, speed, nextPiece1, p1Agi, p1Int, p1Dex]);

  // 相手AI自動ピース落下＆配置ループ
  useEffect(() => {
    if (isFinished || isPaused || battleResult || isDead2 || timeLeft <= 0) return;

    const intervalMs = Math.max(200, 620 - (p2Agi * 2.2)) / Math.max(1, speed);

    const stepTimer = setInterval(() => {
      const pieceToDrop = nextPiece2;
      setNextPiece2(getRandomType());

      setGrid2(currentGrid => {
        const best = findBestPlacement(pieceToDrop, currentGrid, p2Int);
        if (!best) {
          setIsDead2(true);
          return currentGrid;
        }

        const newGrid = currentGrid.map(r => [...r]);
        const typeId = TETROMINO_KEYS.indexOf(pieceToDrop) + 1;

        for (let r = 0; r < best.matrix.length; r++) {
          for (let c = 0; c < best.matrix[r].length; c++) {
            if (best.matrix[r][c] !== 0) {
              const by = best.y + r;
              const bx = best.x + c;
              if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                newGrid[by][bx] = typeId;
              }
            }
          }
        }

        const remainingRows = newGrid.filter(row => !row.every(cell => cell !== 0));
        const clearedCount = BOARD_HEIGHT - remainingRows.length;
        let finalGrid = newGrid;

        if (clearedCount > 0) {
          const emptyRows = Array(clearedCount).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
          finalGrid = [...emptyRows, ...remainingRows];

          const dexMult = 1 + (p2Dex * 0.012);
          const baseScore = clearedCount === 1 ? 100 : clearedCount === 2 ? 300 : clearedCount === 3 ? 600 : 1200;
          const gained = Math.round(baseScore * dexMult);

          setScore2(s => s + gained);
          setLines2(l => l + clearedCount);
        }

        if (finalGrid[0].some(cell => cell !== 0) || finalGrid[1].some(cell => cell !== 0)) {
          setIsDead2(true);
        }

        return finalGrid;
      });
    }, intervalMs);

    return () => clearInterval(stepTimer);
  }, [isFinished, isPaused, battleResult, isDead2, timeLeft, speed, nextPiece2, p2Agi, p2Int, p2Dex]);

  // 試合終了判定
  useEffect(() => {
    if (finishTriggeredRef.current || isFinished || battleResult) return;

    const isBothDead = isDead1 && isDead2;
    const isTimeUp = timeLeft <= 0;

    if (isTimeUp || isBothDead) {
      finishTriggeredRef.current = true;
      if (score1 > score2) {
        playTetraSound('win');
        onFinish('win');
      } else if (score1 < score2) {
        playTetraSound('lose');
        onFinish('lose');
      } else {
        onFinish('draw');
      }
    }
  }, [timeLeft, isDead1, isDead2, score1, score2, isFinished, battleResult, onFinish]);

  const scoreDiff = score1 - score2;

  // 10x20グリッドの描画
  const renderBoard = (grid: number[][]) => (
    <div className="bg-stone-950 p-1.5 rounded-xl border border-stone-800 shadow-inner w-full max-w-[150px] mx-auto aspect-[10/20] flex flex-col justify-between">
      {grid.map((row, r) => (
        <div key={r} className="flex h-[4.8%] w-full">
          {row.map((cell, c) => {
            const typeKey = cell > 0 ? TETROMINO_KEYS[cell - 1] : null;
            const def = typeKey ? TETROMINOS[typeKey] : null;
            return (
              <div
                key={c}
                className={`w-[10%] h-full rounded-[2px] transition-colors ${
                  cell === 0
                    ? 'border-[0.5px] border-stone-900/60 bg-stone-900/30'
                    : `${def?.color || 'bg-cyan-500'} border-[0.5px] ${def?.borderColor || 'border-cyan-300'} shadow-2xs`
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* 上部ヘッダー：VSゲージ＆タイマー */}
      <div className="bg-stone-900 border-2 border-cyan-500/80 rounded-2xl p-3 shadow-md text-white">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          {/* 自機スコア */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 font-mono">YOU</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
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
            <Clock size={14} className={timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-cyan-400'} />
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
            className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full transition-all duration-300"
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
        <div className="bg-stone-950/90 border-2 border-cyan-500/80 rounded-2xl p-3 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-cyan-500/50 flex items-center justify-center shrink-0">
                <RobotVisual robot={activeRobot} size={32} hideBubble={true} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-stone-100">{activeRobot.name}</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 py-0.2 rounded border border-cyan-500/40 font-mono">
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
              <span className="text-[10px] text-stone-400 block font-mono">消去ライン</span>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-stone-800 border border-cyan-400 text-cyan-300">
                {lines1} LINES
              </span>
            </div>
          </div>

          {/* 10x20 盤面 */}
          <div className="relative my-1">
            {renderBoard(grid1)}
            {isDead1 && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-rose-400 font-bold text-xs">
                <Gi.GiHazardSign className="text-2xl mb-1" />
                <span>窒息（スコア確定）</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-center text-[10px] text-stone-400 font-mono flex items-center justify-center gap-2">
            <Zap size={11} className="text-cyan-400 animate-pulse" />
            <span>自機思考AI: 自動落下＆配置中 [NEXT: {nextPiece1}]</span>
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
              <span className="text-[10px] text-stone-400 block font-mono">消去ライン</span>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-stone-800 border border-stone-600 text-stone-200">
                {lines2} LINES
              </span>
            </div>
          </div>

          {/* 10x20 盤面 */}
          <div className="relative my-1">
            {renderBoard(grid2)}
            {isDead2 && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-rose-400 font-bold text-xs">
                <Gi.GiHazardSign className="text-2xl mb-1" />
                <span>窒息（スコア確定）</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-center text-[10px] text-stone-400 font-mono flex items-center justify-center gap-2">
            <Zap size={11} className="text-red-400 animate-pulse" />
            <span>相手思考AI: 自動落下＆配置中 [NEXT: {nextPiece2}]</span>
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
              <Button size="sm" onClick={() => onSetSpeed(1)} className={`px-2 py-0.5 text-[10px] font-mono ${speed === 1 ? 'bg-cyan-600 text-white' : 'bg-transparent text-stone-400'}`}>1x</Button>
              <Button size="sm" onClick={() => onSetSpeed(2)} className={`px-2 py-0.5 text-[10px] font-mono ${speed === 2 ? 'bg-cyan-600 text-white' : 'bg-transparent text-stone-400'}`}>2x</Button>
              <Button size="sm" onClick={() => onSetSpeed(3)} className={`px-2 py-0.5 text-[10px] font-mono ${speed === 3 ? 'bg-cyan-600 text-white' : 'bg-transparent text-stone-400'}`}>3x</Button>
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
