import React, { useState, useEffect, useRef } from 'react';
import { MinigameProps, Opponent } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import * as Gi from 'react-icons/gi';
import { Clock, Zap, Play, Pause } from 'lucide-react';
import { Button } from '../ui/core';
import { motion, AnimatePresence } from 'motion/react';

export interface FallingPuzzleGameProps extends MinigameProps {
  onExit?: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const MATCH_DURATION_SEC = 30; // 30秒の制限時間対戦

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface TetrominoDef {
  shape: number[][];
  color: string;
  borderColor: string;
  ghostBorder: string;
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
    borderColor: 'border-cyan-300',
    ghostBorder: 'border-cyan-400/50 bg-cyan-500/15'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-400',
    borderColor: 'border-yellow-200',
    ghostBorder: 'border-yellow-300/50 bg-yellow-400/15'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-purple-500',
    borderColor: 'border-purple-300',
    ghostBorder: 'border-purple-400/50 bg-purple-500/15'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-300',
    ghostBorder: 'border-emerald-400/50 bg-emerald-500/15'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-rose-500',
    borderColor: 'border-rose-300',
    ghostBorder: 'border-rose-400/50 bg-rose-500/15'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-blue-600',
    borderColor: 'border-blue-300',
    ghostBorder: 'border-blue-400/50 bg-blue-500/15'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-orange-500',
    borderColor: 'border-orange-300',
    ghostBorder: 'border-orange-400/50 bg-orange-500/15'
  }
};

const TETROMINO_KEYS: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Web Audio API サウンド
function playTetraSound(type: 'clear' | 'tetris' | 'win' | 'lose' | 'drop') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = (window as any).globalAudioCtx || new AudioContextClass();
    if (!(window as any).globalAudioCtx) {
      (window as any).globalAudioCtx = ctx;
    }
    const now = ctx.currentTime;

    if (type === 'drop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'clear') {
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

/**
 * 落下中ピース・ライン消去アニメーションを含む各プレイヤーのボード状態
 */
interface ActiveFallingPiece {
  type: TetrominoType;
  matrix: number[][];
  x: number;
  y: number;
  targetRotation: number;
  currentRotation: number;
  targetX: number;
  targetY: number;
  phase: 'spawn' | 'aligning' | 'falling';
}

interface ScorePopupItem {
  id: number;
  score: number;
  lines: number;
}

interface PlayerPuzzleState {
  grid: number[][];
  score: number;
  lines: number;
  isDead: boolean;
  nextPiece: TetrominoType;
  activePiece: ActiveFallingPiece | null;
  clearingRows: number[];
  scorePopups: ScorePopupItem[];
}

function createInitialPlayerState(): PlayerPuzzleState {
  return {
    grid: createEmptyGrid(),
    score: 0,
    lines: 0,
    isDead: false,
    nextPiece: getRandomType(),
    activePiece: null,
    clearingRows: [],
    scorePopups: []
  };
}

/**
 * 1ステップごとにピース出現(落ちる前) → 回転・横移動位置合わせ → 落下アニメーション → 着地＆ライン消去フラッシュ → スコアポップアップ を進める純粋関数
 */
function advancePlayerStep(
  prev: PlayerPuzzleState,
  intStat: number,
  dexStat: number,
  popupIdCounter: React.MutableRefObject<number>,
  isPlayer1: boolean
): PlayerPuzzleState {
  if (prev.isDead) return prev;

  // 1. ライン消去フラッシュアニメーション中 → 消去を確定して上のブロックを落とす
  if (prev.clearingRows.length > 0) {
    const clearedSet = new Set(prev.clearingRows);
    const remainingRows = prev.grid.filter((_, rIdx) => !clearedSet.has(rIdx));
    const clearedCount = BOARD_HEIGHT - remainingRows.length;
    const emptyRows = Array(clearedCount).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
    const finalGrid = [...emptyRows, ...remainingRows];

    const isDeadNow = finalGrid[0].some(c => c !== 0) || finalGrid[1].some(c => c !== 0);

    return {
      ...prev,
      grid: finalGrid,
      clearingRows: [],
      isDead: isDeadNow
    };
  }

  // 2. アクティブな落下中ピースがない場合 → 新しいピースを上部にスポーン（「落ちる前の状態」を表示）
  if (!prev.activePiece) {
    const currentType = prev.nextPiece;
    const upcomingType = getRandomType();
    const best = findBestPlacement(currentType, prev.grid, intStat);

    if (!best) {
      return {
        ...prev,
        isDead: true
      };
    }

    const initialMatrix = TETROMINOS[currentType].shape.map(r => [...r]);
    const spawnX = Math.floor((BOARD_WIDTH - initialMatrix[0].length) / 2);

    return {
      ...prev,
      nextPiece: upcomingType,
      activePiece: {
        type: currentType,
        matrix: initialMatrix,
        x: spawnX,
        y: 0,
        targetRotation: best.rotation,
        currentRotation: 0,
        targetX: best.x,
        targetY: best.y,
        phase: 'spawn'
      }
    };
  }

  const piece = prev.activePiece;

  // 3. スポーン直後の状態から、目標の回転・X座標へ移動するフェーズ（落ちる前の位置合わせアニメーション）
  if (piece.phase === 'spawn' || piece.phase === 'aligning') {
    let nextMatrix = piece.matrix;
    let nextRot = piece.currentRotation;

    if (nextRot < piece.targetRotation) {
      nextMatrix = rotateMatrix(nextMatrix);
      nextRot += 1;
    }

    let nextX = piece.x;
    if (nextX < piece.targetX) {
      nextX = Math.min(piece.targetX, nextX + 2);
    } else if (nextX > piece.targetX) {
      nextX = Math.max(piece.targetX, nextX - 2);
    }

    const doneAligning = nextRot >= piece.targetRotation && nextX === piece.targetX;

    return {
      ...prev,
      activePiece: {
        ...piece,
        matrix: doneAligning ? piece.matrix.length === nextMatrix.length ? nextMatrix : piece.matrix : nextMatrix,
        currentRotation: nextRot,
        x: nextX,
        y: doneAligning ? Math.min(piece.targetY, 1) : 0,
        phase: doneAligning ? 'falling' : 'aligning'
      }
    };
  }

  // 4. 落下中フェーズ（上から目標Y座標まで高速で落ちていくアニメーション）
  const dropStepRows = Math.max(2, Math.ceil((piece.targetY - piece.y) * 0.45));
  const nextY = piece.y + dropStepRows;

  if (nextY < piece.targetY) {
    return {
      ...prev,
      activePiece: {
        ...piece,
        y: nextY
      }
    };
  }

  // 5. 着地完了 → 盤面にブロックを固定し、揃った列があれば消去フラッシュ演出＆獲得スコアアニメーションを発動
  const newGrid = prev.grid.map(r => [...r]);
  const typeId = TETROMINO_KEYS.indexOf(piece.type) + 1;

  for (let r = 0; r < piece.matrix.length; r++) {
    for (let c = 0; c < piece.matrix[r].length; c++) {
      if (piece.matrix[r][c] !== 0) {
        const by = piece.targetY + r;
        const bx = piece.targetX + c;
        if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
          newGrid[by][bx] = typeId;
        }
      }
    }
  }

  // 揃ったラインの検出
  const fullRowIndices: number[] = [];
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    if (newGrid[r].every(cell => cell !== 0)) {
      fullRowIndices.push(r);
    }
  }

  if (fullRowIndices.length > 0) {
    const clearedCount = fullRowIndices.length;
    const dexMult = 1 + (dexStat * 0.012);
    const baseScore = clearedCount === 1 ? 100 : clearedCount === 2 ? 300 : clearedCount === 3 ? 600 : 1200;
    const gained = Math.round(baseScore * dexMult);

    if (clearedCount >= 4) {
      playTetraSound('tetris');
    } else {
      playTetraSound('clear');
    }

    const newPopup: ScorePopupItem = {
      id: ++popupIdCounter.current,
      score: gained,
      lines: clearedCount
    };

    return {
      ...prev,
      grid: newGrid,
      activePiece: null,
      clearingRows: fullRowIndices,
      score: prev.score + gained,
      lines: prev.lines + clearedCount,
      scorePopups: [...prev.scorePopups.slice(-2), newPopup]
    };
  }

  if (isPlayer1) {
    playTetraSound('drop');
  }

  // ライン消去がない場合は即座に窒息判定
  const isDeadNow = newGrid[0].some(c => c !== 0) || newGrid[1].some(c => c !== 0);

  return {
    ...prev,
    grid: newGrid,
    activePiece: null,
    isDead: isDeadNow
  };
}

/**
 * NEXTピースのミニプレビュー描画コンポーネント
 */
const NextPiecePreview: React.FC<{ type: TetrominoType; accentColor?: 'cyan' | 'red' }> = ({
  type,
  accentColor = 'cyan'
}) => {
  const def = TETROMINOS[type];
  const shape = def.shape;

  return (
    <div
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border bg-stone-900/95 shadow-inner ${
        accentColor === 'cyan' ? 'border-cyan-500/40' : 'border-rose-500/40'
      }`}
      title={`次のブロック: ${type}`}
    >
      <span
        className={`text-[8px] sm:text-[9px] font-mono font-black tracking-tighter ${
          accentColor === 'cyan' ? 'text-cyan-300' : 'text-rose-300'
        }`}
      >
        NEXT
      </span>
      <div className="w-6 h-5 sm:w-7 sm:h-6 flex flex-col items-center justify-center bg-stone-950/90 rounded p-0.5 border border-stone-800">
        {shape.map((row, rIdx) => {
          // 完全に空の行（Iミノの4行目など）は詰めて見やすく表示
          if (shape.length === 4 && (rIdx === 0 || rIdx === 3) && row.every(v => v === 0)) {
            return null;
          }
          return (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-[1px] m-[0.5px] ${
                    cell !== 0
                      ? `${def.color} border-[0.5px] ${def.borderColor}`
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
  const [p1State, setP1State] = useState<PlayerPuzzleState>(() => createInitialPlayerState());
  const [p2State, setP2State] = useState<PlayerPuzzleState>(() => createInitialPlayerState());

  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION_SEC);
  const finishTriggeredRef = useRef(false);
  const popupIdCounterRef = useRef(1);

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

  // 自機AIアニメーション＆落下ステップループ
  useEffect(() => {
    if (isFinished || isPaused || battleResult || p1State.isDead || timeLeft <= 0) return;

    // 1ピースあたり約4〜5サブステップで「出現→回転・移動→落下→着地/消去」を描画するため、インターバルを細かく設定
    const baseStepMs = Math.max(55, 145 - (p1Agi * 0.5)) / Math.max(1, speed);
    const stepMs = p1State.clearingRows.length > 0 ? baseStepMs * 1.6 : baseStepMs;

    const timer = setTimeout(() => {
      setP1State(prev => advancePlayerStep(prev, p1Int, p1Dex, popupIdCounterRef, true));
    }, stepMs);

    return () => clearTimeout(timer);
  }, [isFinished, isPaused, battleResult, p1State, timeLeft, speed, p1Agi, p1Int, p1Dex]);

  // 相手AIアニメーション＆落下ステップループ
  useEffect(() => {
    if (isFinished || isPaused || battleResult || p2State.isDead || timeLeft <= 0) return;

    const baseStepMs = Math.max(55, 145 - (p2Agi * 0.5)) / Math.max(1, speed);
    const stepMs = p2State.clearingRows.length > 0 ? baseStepMs * 1.6 : baseStepMs;

    const timer = setTimeout(() => {
      setP2State(prev => advancePlayerStep(prev, p2Int, p2Dex, popupIdCounterRef, false));
    }, stepMs);

    return () => clearTimeout(timer);
  }, [isFinished, isPaused, battleResult, p2State, timeLeft, speed, p2Agi, p2Int, p2Dex]);

  // 試合終了判定
  useEffect(() => {
    if (finishTriggeredRef.current || isFinished || battleResult) return;

    const isBothDead = p1State.isDead && p2State.isDead;
    const isTimeUp = timeLeft <= 0;

    if (isTimeUp || isBothDead) {
      finishTriggeredRef.current = true;
      if (p1State.score > p2State.score) {
        playTetraSound('win');
        onFinish('win');
      } else if (p1State.score < p2State.score) {
        playTetraSound('lose');
        onFinish('lose');
      } else {
        onFinish('draw');
      }
    }
  }, [timeLeft, p1State.isDead, p2State.isDead, p1State.score, p2State.score, isFinished, battleResult, onFinish]);

  const scoreDiff = p1State.score - p2State.score;

  // 10x20グリッドの描画（落下前・落下中ピース、ゴースト予測位置、ライン消去フラッシュ、獲得スコアポップアップを含む）
  const renderBoard = (state: PlayerPuzzleState, isPlayer1: boolean) => {
    const { grid, activePiece, clearingRows, scorePopups } = state;
    const clearingSet = new Set(clearingRows);

    // アクティブピースとゴースト（着地予測位置）の座標マップを作成
    const activeCellMap = new Map<string, TetrominoType>();
    const ghostCellMap = new Map<string, TetrominoType>();

    if (activePiece) {
      for (let r = 0; r < activePiece.matrix.length; r++) {
        for (let c = 0; c < activePiece.matrix[r].length; c++) {
          if (activePiece.matrix[r][c] !== 0) {
            // 現在の落下位置
            const curY = activePiece.y + r;
            const curX = activePiece.x + c;
            if (curY >= 0 && curY < BOARD_HEIGHT && curX >= 0 && curX < BOARD_WIDTH) {
              activeCellMap.set(`${curY},${curX}`, activePiece.type);
            }
            // 着地予測ゴースト位置
            const ghostY = activePiece.targetY + r;
            const ghostX = activePiece.targetX + c;
            if (ghostY >= 0 && ghostY < BOARD_HEIGHT && ghostX >= 0 && ghostX < BOARD_WIDTH) {
              ghostCellMap.set(`${ghostY},${ghostX}`, activePiece.type);
            }
          }
        }
      }
    }

    const latestPopup = scorePopups.length > 0 ? scorePopups[scorePopups.length - 1] : null;

    return (
      <div className="relative bg-stone-950 p-1 sm:p-1.5 rounded-xl border border-stone-800 shadow-inner w-full max-w-[128px] sm:max-w-[152px] mx-auto aspect-[10/20] flex flex-col justify-between overflow-hidden">
        {grid.map((row, r) => {
          const isRowClearing = clearingSet.has(r);
          return (
            <div
              key={r}
              className={`flex h-[4.8%] w-full transition-all duration-150 ${
                isRowClearing
                  ? 'bg-white scale-y-110 shadow-[0_0_12px_rgba(255,255,255,0.95)] z-20'
                  : ''
              }`}
            >
              {row.map((cell, c) => {
                const key = `${r},${c}`;
                const activeType = activeCellMap.get(key);
                const ghostType = !activeType && cell === 0 ? ghostCellMap.get(key) : undefined;
                const lockedType = cell > 0 ? TETROMINO_KEYS[cell - 1] : null;

                if (isRowClearing) {
                  return (
                    <div
                      key={c}
                      className="w-[10%] h-full rounded-[2px] bg-gradient-to-r from-amber-200 via-white to-cyan-200 border-[0.5px] border-white animate-pulse"
                    />
                  );
                }

                if (activeType) {
                  const def = TETROMINOS[activeType];
                  return (
                    <div
                      key={c}
                      className={`w-[10%] h-full rounded-[2px] ${def.color} border ${def.borderColor} shadow-[0_0_6px_rgba(255,255,255,0.45)] z-10 transition-transform duration-75`}
                    />
                  );
                }

                if (lockedType) {
                  const def = TETROMINOS[lockedType];
                  return (
                    <div
                      key={c}
                      className={`w-[10%] h-full rounded-[2px] ${def.color} border-[0.5px] ${def.borderColor} shadow-2xs`}
                    />
                  );
                }

                if (ghostType) {
                  const def = TETROMINOS[ghostType];
                  return (
                    <div
                      key={c}
                      className={`w-[10%] h-full rounded-[2px] border border-dashed ${def.ghostBorder}`}
                    />
                  );
                }

                return (
                  <div
                    key={c}
                    className="w-[10%] h-full rounded-[2px] border-[0.5px] border-stone-900/60 bg-stone-900/30"
                  />
                );
              })}
            </div>
          );
        })}

        {/* ライン消去＆獲得スコアのフロートポップアップアニメーション */}
        <AnimatePresence>
          {latestPopup && (
            <motion.div
              key={latestPopup.id}
              initial={{ opacity: 0, scale: 0.6, y: 12 }}
              animate={{ opacity: 1, scale: 1.05, y: -14 }}
              exit={{ opacity: 0, scale: 0.85, y: -32 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="absolute inset-x-1 top-1/3 z-30 pointer-events-none flex flex-col items-center justify-center"
            >
              <div
                className={`px-2 py-1 rounded-lg border shadow-lg text-center backdrop-blur-xs ${
                  latestPopup.lines >= 4
                    ? 'bg-amber-500/95 border-yellow-200 text-stone-950 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                    : isPlayer1
                    ? 'bg-cyan-950/95 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                    : 'bg-rose-950/95 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                }`}
              >
                <div className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase leading-none">
                  {latestPopup.lines >= 4
                    ? '★ TETRA CLEAR! ★'
                    : `${latestPopup.lines} LINE${latestPopup.lines > 1 ? 'S' : ''} CLEAR!`}
                </div>
                <div className="text-xs sm:text-sm font-black font-mono leading-tight mt-0.5">
                  +{latestPopup.score.toLocaleString()} PTS
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 max-w-4xl mx-auto">
      {/* 上部ヘッダー：VSゲージ＆タイマー */}
      <div className="bg-stone-900 border-2 border-cyan-500/80 rounded-2xl p-2.5 sm:p-3 shadow-md text-white">
        <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2">
          {/* 自機スコア */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-cyan-400 font-mono shrink-0">YOU</span>
            <motion.span
              key={p1State.score}
              initial={{ scale: 1.25, color: '#fde047' }}
              animate={{ scale: 1, color: '#67e8f9' }}
              transition={{ duration: 0.25 }}
              className="text-base sm:text-2xl font-black font-mono text-cyan-300 truncate"
            >
              {p1State.score.toLocaleString()}
            </motion.span>
            {scoreDiff > 0 && (
              <span className="hidden sm:inline-block text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">
                +{scoreDiff.toLocaleString()} LEAD!
              </span>
            )}
          </div>

          {/* タイマー中央表示 */}
          <div className="flex items-center gap-1 bg-stone-800 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-stone-700 shrink-0">
            <Clock size={13} className={timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-cyan-400'} />
            <span className={`font-mono font-bold text-xs sm:text-base ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-stone-200'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>

          {/* 相手スコア */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 justify-end">
            {scoreDiff < 0 && (
              <span className="hidden sm:inline-block text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">
                {scoreDiff.toLocaleString()}
              </span>
            )}
            <motion.span
              key={p2State.score}
              initial={{ scale: 1.25, color: '#fda4af' }}
              animate={{ scale: 1, color: '#e7e5e4' }}
              transition={{ duration: 0.25 }}
              className="text-base sm:text-2xl font-black font-mono text-stone-200 truncate"
            >
              {p2State.score.toLocaleString()}
            </motion.span>
            <span className="text-[10px] sm:text-xs font-bold text-red-400 font-mono shrink-0">RIVAL</span>
          </div>
        </div>

        {/* スコア比率プログレスバー */}
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden flex border border-stone-700">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full transition-all duration-300"
            style={{ width: `${p1State.score + p2State.score === 0 ? 50 : Math.max(5, Math.min(95, (p1State.score / (p1State.score + p2State.score)) * 100))}%` }}
          />
          <div 
            className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-300 flex-1"
          />
        </div>
      </div>

      {/* 2画面並列（スマホ縦画面でも常に左右2画面で横並び） */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
        {/* 左側：自機ロボット盤面 */}
        <div className="bg-stone-950/90 border-2 border-cyan-500/80 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-sm relative overflow-hidden flex flex-col justify-between min-w-0">
          <div className="flex flex-col gap-1 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-stone-800">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800 border border-cyan-500/50 flex items-center justify-center shrink-0">
                  <RobotVisual robot={activeRobot} size={22} hideBubble={true} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[11px] sm:text-sm text-stone-100 truncate">{activeRobot.name}</span>
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-stone-400 font-mono flex items-center gap-1 sm:gap-1.5">
                    <span>I:{p1Int}</span>
                    <span>D:{p1Dex}</span>
                    <span>A:{p1Agi}</span>
                  </div>
                </div>
              </div>

              {/* 自機のNEXTブロックビジュアル表示 */}
              <NextPiecePreview type={p1State.nextPiece} accentColor="cyan" />
            </div>

            <div className="flex items-center justify-between bg-stone-900/80 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono">
              <span className="text-stone-400">消去ライン</span>
              <span className="font-black text-cyan-300">{p1State.lines} LINES</span>
            </div>
          </div>

          {/* 10x20 盤面 */}
          <div className="relative my-0.5 sm:my-1">
            {renderBoard(p1State, true)}
            {p1State.isDead && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-rose-400 font-bold text-xs z-30">
                <Gi.GiHazardSign className="text-xl sm:text-2xl mb-1" />
                <span>窒息</span>
              </div>
            )}
          </div>

          <div className="mt-1.5 sm:mt-2 text-center text-[9px] sm:text-[10px] text-stone-400 font-mono flex items-center justify-center gap-1 truncate">
            <Zap size={10} className="text-cyan-400 animate-pulse shrink-0" />
            <span className="truncate">
              {p1State.clearingRows.length > 0
                ? 'ライン消去中！'
                : p1State.activePiece?.phase === 'spawn' || p1State.activePiece?.phase === 'aligning'
                ? `落下位置調整中 [${p1State.activePiece.type}]`
                : `ブロック落下中 [${p1State.activePiece?.type || p1State.nextPiece}]`}
            </span>
          </div>
        </div>

        {/* 右側：ライバル対戦相手盤面 */}
        <div className="bg-stone-950/90 border-2 border-stone-700 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-sm relative overflow-hidden flex flex-col justify-between min-w-0">
          <div className="flex flex-col gap-1 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-stone-800">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-red-400 text-sm sm:text-base">
                  <Gi.GiRobotAntennas />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[11px] sm:text-sm text-stone-100 truncate">{opponentObj.name}</span>
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-stone-400 font-mono flex items-center gap-1 sm:gap-1.5">
                    <span>I:{p2Int}</span>
                    <span>D:{p2Dex}</span>
                    <span>A:{p2Agi}</span>
                  </div>
                </div>
              </div>

              {/* 相手のNEXTブロックビジュアル表示 */}
              <NextPiecePreview type={p2State.nextPiece} accentColor="red" />
            </div>

            <div className="flex items-center justify-between bg-stone-900/80 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono">
              <span className="text-stone-400">消去ライン</span>
              <span className="font-black text-stone-200">{p2State.lines} LINES</span>
            </div>
          </div>

          {/* 10x20 盤面 */}
          <div className="relative my-0.5 sm:my-1">
            {renderBoard(p2State, false)}
            {p2State.isDead && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-rose-400 font-bold text-xs z-30">
                <Gi.GiHazardSign className="text-xl sm:text-2xl mb-1" />
                <span>窒息</span>
              </div>
            )}
          </div>

          <div className="mt-1.5 sm:mt-2 text-center text-[9px] sm:text-[10px] text-stone-400 font-mono flex items-center justify-center gap-1 truncate">
            <Zap size={10} className="text-red-400 animate-pulse shrink-0" />
            <span className="truncate">
              {p2State.clearingRows.length > 0
                ? 'ライン消去中！'
                : p2State.activePiece?.phase === 'spawn' || p2State.activePiece?.phase === 'aligning'
                ? `落下位置調整中 [${p2State.activePiece.type}]`
                : `ブロック落下中 [${p2State.activePiece?.type || p2State.nextPiece}]`}
            </span>
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
