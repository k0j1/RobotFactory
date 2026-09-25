import * as Gi from 'react-icons/gi';
import React, { useState, useEffect, useMemo } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import { 
  OTHELLO_MEMORIES, 
  filterMovesByMemory, 
  OthelloMoveCandidate,
  analyzeMemoryPipeline,
  isCellInSpatialMemoryZone
} from '../../core/othelloStrategyData';
import { OthelloStrategyDebugPanel, DebugViewMode } from './othello/OthelloStrategyDebugPanel';

const SIZE = 8;
type Player = 1 | 2;
type BoardState = number[][];

const INITIAL_BOARD: BoardState = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
INITIAL_BOARD[3][3] = 2; INITIAL_BOARD[3][4] = 1;
INITIAL_BOARD[4][3] = 1; INITIAL_BOARD[4][4] = 2;

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

const WEIGHTS = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
];

export const OthelloGame: React.FC<MinigameProps> = ({ 
  activeRobot, 
  activeOpponent, 
  onFinish, 
  speed, 
  isPaused, 
  isFinished, 
  battleResult,
  othelloEquippedMemories = []
}) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1);
  const [lastMove, setLastMove] = useState<{r: number, c: number} | null>(null);
  const [strategyNotice, setStrategyNotice] = useState<string | null>(null);
  // 戦術メモリ適用デバッグ表示モード
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);
  const [debugViewMode, setDebugViewMode] = useState<DebugViewMode>('all');

  // ロボット個別装備メモリまたはプロップスから装備メモリ（最大3個）を取得
  const equippedMemories = (activeRobot.othelloEquippedMemories && activeRobot.othelloEquippedMemories.length > 0)
    ? activeRobot.othelloEquippedMemories
    : othelloEquippedMemories;

  const isValidPos = (r: number, c: number) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  const getFlippable = (b: BoardState, r: number, c: number, p: Player) => {
    if (b[r][c] !== 0) return [];
    let flippable: {r: number, c: number}[] = [];
    const opp = p === 1 ? 2 : 1;
    for (const [dr, dc] of DIRECTIONS) {
      let cr = r + dr, cc = c + dc, temp = [];
      while (isValidPos(cr, cc) && b[cr][cc] === opp) {
        temp.push({r: cr, c: cc});
        cr += dr; cc += dc;
      }
      if (temp.length > 0 && isValidPos(cr, cc) && b[cr][cc] === p) flippable.push(...temp);
    }
    return flippable;
  };

  const getValidMoves = (b: BoardState, p: Player): {r: number, c: number}[] => {
    let moves = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (getFlippable(b, i, j, p).length > 0) moves.push({r: i, c: j});
      }
    }
    return moves;
  };

  const applyMove = (b: BoardState, r: number, c: number, p: Player) => {
    const flips = getFlippable(b, r, c, p);
    const nb = b.map(row => [...row]);
    nb[r][c] = p;
    for (const f of flips) nb[f.r][f.c] = p;
    return nb;
  };

  // 自機（プレイヤー）目線での戦術メモリ適用パイプライン解析（リアルタイム算出）
  const currentPipelineAnalysis = useMemo(() => {
    if (equippedMemories.length === 0) return null;
    const pMoves = getValidMoves(board, 1).map(m => ({
      r: m.r,
      c: m.c,
      flipsCount: getFlippable(board, m.r, m.c, 1).length
    }));
    if (pMoves.length === 0) return null;
    return analyzeMemoryPipeline(pMoves, equippedMemories, (r, c) => getFlippable(board, r, c, 1).length);
  }, [board, equippedMemories]);

  const getScore = (b: BoardState) => {
    let s1 = 0, s2 = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === 1) s1++;
        if (b[i][j] === 2) s2++;
      }
    }
    return { 1: s1, 2: s2 };
  };

  const evaluate = (b: BoardState, p: Player) => {
    let s = 0; const opp = p === 1 ? 2 : 1;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === p) s += WEIGHTS[i][j];
        else if (b[i][j] === opp) s -= WEIGHTS[i][j];
      }
    }
    return s + getValidMoves(b, p).length * 5 - getValidMoves(b, opp).length * 5;
  };

  const chooseMove = (b: BoardState, p: Player, int: number): { move: {r: number, c: number} | null; triggeredMemoryName?: string } => {
    const moves = getValidMoves(b, p);
    if (moves.length === 0) return { move: null };

    // プレイヤー側（p === 1）かつ戦略メモリが装備されている場合、スロット順（優先度順）に候補を絞り込む
    let triggeredName: string | undefined = undefined;
    let candidateMoves: OthelloMoveCandidate[] = [...moves];

    if (p === 1 && equippedMemories.length > 0) {
      for (const memId of equippedMemories) {
        if (!memId) continue;
        const res = filterMovesByMemory(
          candidateMoves, 
          memId, 
          (r, c) => getFlippable(b, r, c, p).length
        );
        if (res.triggered) {
          candidateMoves = res.filtered;
          if (!triggeredName && OTHELLO_MEMORIES[memId as keyof typeof OTHELLO_MEMORIES]) {
            triggeredName = OTHELLO_MEMORIES[memId as keyof typeof OTHELLO_MEMORIES].name;
          }
          if (candidateMoves.length === 1) break;
        }
      }
    }

    if (candidateMoves.length === 1) {
      return { move: candidateMoves[0], triggeredMemoryName: triggeredName };
    }

    // 候補が複数残っている場合、知性(int)に応じた評価値と微小な思考ゆらぎ・ソフトマックス選択により、
    // 同じ能力・同じ相手でも毎回異なる手順・展開を生み出す
    if (int < 8) {
      return { 
        move: candidateMoves[Math.floor(Math.random() * candidateMoves.length)],
        triggeredMemoryName: triggeredName
      };
    }

    // 各候補手についての評価値スコアを計算
    const scoredMoves = candidateMoves.map(m => {
      const nb = applyMove(b, m.r, m.c, p);
      let ev = 0;
      if (int < 30) {
        ev = getFlippable(b, m.r, m.c, p).length;
      } else {
        ev = evaluate(nb, p);
      }
      // 思考の個性・状況に応じたわずかなゆらぎ（同一盤面での完全固定化を防止し、自然な手の変化を生む）
      // 知性による確固たる判断を保ちつつ、同点や僅差の手（0〜2点差）で異なる着手を選ぶ契機とする
      const jitter = (Math.random() - 0.5) * 2.0;
      return { move: m, score: ev + jitter };
    });

    // 最大評価値
    const maxScore = Math.max(...scoredMoves.map(sm => sm.score));

    // 温度パラメータ (Temperature):
    // 知性が高いほど最善手を強く優先するが、互角の良手（同点など）がある場合は柔軟に分散させる
    const temperature = Math.max(1.2, 7.0 - (int * 0.055));

    // 最善手から大きく劣る悪手を排除するため、知性に応じた閾値内の上位候補を抽出
    const dropMargin = Math.max(8, 25 - (int * 0.15));
    const viableMoves = scoredMoves.filter(sm => sm.score >= maxScore - dropMargin);
    const candidatePool = viableMoves.length > 0 ? viableMoves : scoredMoves;

    // ソフトマックス（Boltzmann分布）による重み付け確率計算
    const weightedMoves = candidatePool.map(sm => {
      const diff = (sm.score - maxScore) / temperature;
      return {
        move: sm.move,
        weight: Math.exp(Math.max(-15, diff))
      };
    });

    const totalWeight = weightedMoves.reduce((sum, wm) => sum + wm.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = weightedMoves[0].move;
    for (const wm of weightedMoves) {
      rand -= wm.weight;
      if (rand <= 0) {
        chosen = wm.move;
        break;
      }
    }

    return { move: chosen, triggeredMemoryName: triggeredName };
  };

  useEffect(() => {
    if (isFinished || isPaused) return;
    const timer = setTimeout(() => {
      const moves = getValidMoves(board, turn);
      if (moves.length === 0) {
        const oppMoves = getValidMoves(board, turn === 1 ? 2 : 1);
        if (oppMoves.length === 0) {
          const scores = getScore(board);
          if (scores[1] > scores[2]) onFinish('win');
          else if (scores[1] < scores[2]) onFinish('lose');
          else onFinish('draw');
        } else setTurn(turn === 1 ? 2 : 1);
        return;
      }
      const currentInt = turn === 1 ? activeRobot.stats.intelligence : activeOpponent.int;
      const { move, triggeredMemoryName } = chooseMove(board, turn, currentInt);
      if (move) {
        setBoard(applyMove(board, move.r, move.c, turn));
        setLastMove(move);
        if (turn === 1 && triggeredMemoryName) {
          setStrategyNotice(`🧠 戦略作動: ${triggeredMemoryName}`);
        } else if (turn === 1) {
          setStrategyNotice(null);
        }
        setTurn(turn === 1 ? 2 : 1);
      }
    }, Math.floor(800 / speed));
    return () => clearTimeout(timer);
  }, [board, turn, isPaused, isFinished, speed]);

  const scores = getScore(board);
  return (
    <div>
      {/* 戦略メモリ作動通知バナー */}
      {strategyNotice && (
        <div className="mb-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 rounded-lg text-amber-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
          <Gi.GiBrain className="text-amber-600 text-sm" />
          <span>{strategyNotice}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-5 gap-2">
        <div className={`text-center p-3 rounded-xl border-2 transition-all flex-1 ${
          turn === 1 
            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-300 shadow-xs' 
            : 'bg-stone-50 border-stone-300'
        } ${battleResult === 'win' ? 'border-amber-400 bg-amber-100/60' : ''}`}>
          <div className="flex justify-center mb-1.5">
            <RobotVisual robot={activeRobot} size={48} animateVictory={battleResult === 'win'} hideBackground={true} hideBubble={true} />
          </div>
          <div className="font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-center gap-1 truncate">
            <span>{activeRobot.name}</span>
            {battleResult === 'win' && <span className="text-amber-500 text-xs"><Gi.GiCrown className="inline text-yellow-500" /></span>}
          </div>
          <div className="text-[10px] text-stone-500 font-mono">Int: {activeRobot.stats.intelligence}</div>

          {/* 装備中戦略メモリ（最大3個）のミニバッジ */}
          {equippedMemories.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-1.5">
              {equippedMemories.map((memId, idx) => {
                const mem = OTHELLO_MEMORIES[memId as keyof typeof OTHELLO_MEMORIES];
                if (!mem) return null;
                return (
                  <span 
                    key={memId} 
                    className={`text-[9px] px-1.5 py-0.5 rounded border font-medium flex items-center gap-0.5 ${mem.badgeColor}`}
                    title={`優先度${idx + 1}: ${mem.name}`}
                  >
                    <span className="font-mono font-bold text-[8px] opacity-70">#{idx + 1}</span>
                    <span>{mem.shortLabel}</span>
                  </span>
                );
              })}
            </div>
          )}

          <div className="mt-1.5 text-lg font-mono font-bold bg-stone-900 text-white rounded-lg px-2.5 py-0.5 w-fit mx-auto shadow-xs">
            {scores[1]}
          </div>
        </div>

        <div className="px-2 sm:px-4 font-black text-xl sm:text-2xl text-stone-400 tracking-wider font-mono">
          VS
        </div>

        <div className={`text-center p-3 rounded-xl border-2 transition-all flex-1 ${
          turn === 2 
            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-300 shadow-xs' 
            : 'bg-stone-50 border-stone-300'
        }`}>
          <div className="flex justify-center mb-1.5 h-12 items-center text-3xl">
            <Gi.GiRobotAntennas className="text-stone-700" />
          </div>
          <div className="font-bold text-xs sm:text-sm text-stone-900 truncate">
            {activeOpponent.name}
          </div>
          <div className="text-[10px] text-stone-500 font-mono">AI: {activeOpponent.int}</div>
          <div className="mt-1.5 text-lg font-mono font-bold bg-white text-stone-900 border border-stone-400 rounded-lg px-2.5 py-0.5 w-fit mx-auto shadow-xs">
            {scores[2]}
          </div>
        </div>
      </div>

      <div className="mx-auto w-fit p-2.5 sm:p-3 bg-stone-800 rounded-2xl shadow-md border-4 border-stone-700">
        <div className="grid grid-cols-8 gap-0.5 bg-emerald-950 p-1 rounded-lg border-2 border-emerald-900">
          {board.map((row, r) => row.map((cell, c) => {
            // デバッグ表示用情報の計算
            let isLegalForPlayer = false;
            let flipsCount = 0;
            let matchedSlots: number[] = [];
            let isFinalChoice = false;
            let isInTargetZone = false;

            if (isDebugOpen) {
              const moveCandidate = currentPipelineAnalysis?.initialMoves.find(m => m.r === r && m.c === c);
              if (moveCandidate) {
                isLegalForPlayer = true;
                flipsCount = moveCandidate.flipsCount ?? 0;
                matchedSlots = currentPipelineAnalysis?.cellMatchedSlots[`${r},${c}`] || [];
                isFinalChoice = !!currentPipelineAnalysis?.finalCandidateMoves.some(m => m.r === r && m.c === c);
              }

              // スロット単体表示時の幾何学的ゾーン判定
              if (debugViewMode.startsWith('slot_')) {
                const slotIdx = parseInt(debugViewMode.replace('slot_', ''), 10);
                const targetMemId = equippedMemories[slotIdx];
                if (targetMemId) {
                  isInTargetZone = isCellInSpatialMemoryZone(r, c, targetMemId);
                }
              }
            }

            // セルの背景クラス決定
            let cellBgClass = 'bg-emerald-700';
            if (isDebugOpen && isInTargetZone) {
              cellBgClass = 'bg-emerald-600/95 border border-dashed border-amber-300/80 shadow-xs';
            } else if (isDebugOpen && isFinalChoice) {
              cellBgClass = 'bg-emerald-600 ring-2 ring-amber-400 ring-inset';
            }

            return (
              <div 
                key={`${r}-${c}`} 
                className={`${isDebugOpen ? 'w-9 h-9 sm:w-11 sm:h-11' : 'w-8 h-8 sm:w-10 sm:h-10'} ${cellBgClass} flex items-center justify-center relative rounded-xs shadow-inner transition-colors`}
              >
                {cell === 1 && <div className={`${isDebugOpen ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-6 h-6 sm:w-8 sm:h-8'} rounded-full bg-stone-950 border border-stone-700 shadow-md`}></div>}
                {cell === 2 && <div className={`${isDebugOpen ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-6 h-6 sm:w-8 sm:h-8'} rounded-full bg-stone-100 border border-stone-300 shadow-md`}></div>}
                {lastMove?.r === r && lastMove?.c === c && <div className="absolute w-2 h-2 bg-amber-400 rounded-full ring-2 ring-amber-200 z-10"></div>}

                {/* デバッグモード：自機合法手＆メモリ適用インジケーター */}
                {isDebugOpen && cell === 0 && isLegalForPlayer && (
                  <>
                    {/* 反転獲得石数バッジ（左上） */}
                    <span 
                      className="absolute top-0.5 left-0.5 text-[8px] font-mono font-bold text-emerald-200 bg-stone-950/85 px-0.5 py-0 rounded leading-none border border-emerald-600/50 shadow-2xs z-10"
                      title={`反転可能石数: +${flipsCount}`}
                    >
                      +{flipsCount}
                    </span>

                    {/* スロット合致インジケーター（右上） */}
                    {matchedSlots.length > 0 && (
                      <div className="absolute top-0.5 right-0.5 flex gap-0.5 z-10">
                        {matchedSlots.map(s => {
                          const isHighlighted = debugViewMode === 'all' || debugViewMode === `slot_${s}`;
                          return (
                            <span 
                              key={s} 
                              className={`text-[7px] font-mono font-black px-0.5 py-0 rounded leading-none shadow-2xs ${
                                isHighlighted
                                  ? 'bg-amber-400 text-stone-950 border border-yellow-200' 
                                  : 'bg-stone-800 text-stone-400 border border-stone-700 opacity-50'
                              }`}
                              title={`スロット #${s + 1} のメモリ条件に合致`}
                            >
                              #{s + 1}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* 最終決定手アイコン / 候補手マーカー */}
                    {isFinalChoice ? (
                      <div 
                        className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-400 text-stone-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-md animate-pulse border border-yellow-100 z-10"
                        title="AI思考ルーチン最終決定ターゲット"
                      >
                        ★
                      </div>
                    ) : (
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-300/60 rounded-full shadow-2xs"></div>
                    )}
                  </>
                )}

                {/* スロット単体表示時かつ石のない対象ゾーンマスへの淡いマーク */}
                {isDebugOpen && cell === 0 && !isLegalForPlayer && isInTargetZone && (
                  <span className="text-[7px] text-amber-200/50 font-mono select-none">
                    ZONE
                  </span>
                )}
              </div>
            );
          }))}
        </div>
      </div>

      {/* 戦術メモリ思考デバッグ解析パネル */}
      <OthelloStrategyDebugPanel
        isOpen={isDebugOpen}
        onToggleOpen={() => setIsDebugOpen(prev => !prev)}
        viewMode={debugViewMode}
        onSelectViewMode={(mode) => setDebugViewMode(mode)}
        equippedMemories={equippedMemories}
        pipelineAnalysis={currentPipelineAnalysis}
        currentTurn={turn}
        robotName={activeRobot.name}
      />
    </div>
  );
};
