import React, { useState, useEffect, useRef } from 'react';
import { GameState, Robot } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { theme } from '../styles/theme';
import { Card, Button } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';

// Board size
const SIZE = 8;
type Player = 1 | 2; // 1: Black(Player), 2: White(Opponent)
type BoardState = number[][];

const INITIAL_BOARD: BoardState = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
INITIAL_BOARD[3][3] = 2;
INITIAL_BOARD[3][4] = 1;
INITIAL_BOARD[4][3] = 1;
INITIAL_BOARD[4][4] = 2;

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

interface Opponent {
  id: string;
  name: string;
  org: string;
  int: number;
  reward: number;
}

const OPPONENTS: Opponent[] = [
  { id: 'op1', name: 'ポンコツ試作機', org: '町の発明家', int: 1, reward: 50 },
  { id: 'op2', name: '汎用作業ボット', org: 'アポロ工業', int: 10, reward: 150 },
  { id: 'op3', name: '戦術演算ユニット', org: 'ゼニス・コーポレーション', int: 30, reward: 500 },
  { id: 'op4', name: 'オメガ・マスター', org: '世界AI協会', int: 60, reward: 2000 },
];

interface MinigameScreenProps {
  state: GameState;
  engine: GameEngine;
}

export const MinigameScreen: React.FC<MinigameScreenProps> = ({ state, engine }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [lastMove, setLastMove] = useState<{r: number, c: number} | null>(null);

  const activeRobot = state.robots.find(r => r.id === selectedRobotId);
  const activeOpponent = OPPONENTS.find(o => o.id === selectedOpponentId);

  const isValidPos = (r: number, c: number) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  const getFlippable = (b: BoardState, r: number, c: number, p: Player): {r: number, c: number}[] => {
    if (b[r][c] !== 0) return [];
    let flippable: {r: number, c: number}[] = [];
    const opponent = p === 1 ? 2 : 1;

    for (const [dr, dc] of DIRECTIONS) {
      let cr = r + dr;
      let cc = c + dc;
      let temp: {r: number, c: number}[] = [];

      while (isValidPos(cr, cc) && b[cr][cc] === opponent) {
        temp.push({r: cr, c: cc});
        cr += dr;
        cc += dc;
      }
      if (temp.length > 0 && isValidPos(cr, cc) && b[cr][cc] === p) {
        flippable.push(...temp);
      }
    }
    return flippable;
  };

  const getValidMoves = (b: BoardState, p: Player): {r: number, c: number}[] => {
    let moves = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (getFlippable(b, i, j, p).length > 0) {
          moves.push({r: i, c: j});
        }
      }
    }
    return moves;
  };

  const cloneBoard = (b: BoardState): BoardState => b.map(row => [...row]);

  const applyMove = (b: BoardState, r: number, c: number, p: Player): BoardState => {
    const flips = getFlippable(b, r, c, p);
    if (flips.length === 0) return b; // Invalid move
    const newBoard = cloneBoard(b);
    newBoard[r][c] = p;
    for (const f of flips) {
      newBoard[f.r][f.c] = p;
    }
    return newBoard;
  };

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

  // Static evaluation weights for Othello
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

  const evaluateBoard = (b: BoardState, p: Player) => {
    let score = 0;
    const opponent = p === 1 ? 2 : 1;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === p) score += WEIGHTS[i][j];
        else if (b[i][j] === opponent) score -= WEIGHTS[i][j];
      }
    }
    // Also factor in mobility (number of valid moves)
    score += getValidMoves(b, p).length * 5;
    score -= getValidMoves(b, opponent).length * 5;
    return score;
  };

  const chooseMove = (b: BoardState, p: Player, intelligence: number): {r: number, c: number} | null => {
    const moves = getValidMoves(b, p);
    if (moves.length === 0) return null;

    // Based on intelligence, pick move
    if (intelligence < 10) {
      // Level 1: Random
      return moves[Math.floor(Math.random() * moves.length)];
    } else if (intelligence < 30) {
      // Level 2: Greedy (most pieces flipped)
      let bestMove = moves[0];
      let maxFlips = -1;
      for (const m of moves) {
        const flips = getFlippable(b, m.r, m.c, p).length;
        if (flips > maxFlips) {
          maxFlips = flips;
          bestMove = m;
        }
      }
      return bestMove;
    } else {
      // Level 3: 1-ply static evaluation
      let bestMove = moves[0];
      let maxEval = -Infinity;
      for (const m of moves) {
        const nb = applyMove(b, m.r, m.c, p);
        const ev = evaluateBoard(nb, p);
        if (ev > maxEval) {
          maxEval = ev;
          bestMove = m;
        }
      }
      return bestMove;
    }
  };

  const processTurn = () => {
    if (!isBattleActive || battleResult) return;

    const currentPlayerMoves = getValidMoves(board, turn);
    
    if (currentPlayerMoves.length === 0) {
      // Pass
      const opponent = turn === 1 ? 2 : 1;
      const opponentMoves = getValidMoves(board, opponent);
      if (opponentMoves.length === 0) {
        // Game Over
        finishGame();
        return;
      }
      setTurn(opponent);
      return;
    }

    const currentInt = turn === 1 ? (activeRobot?.stats.intelligence || 1) : (activeOpponent?.int || 1);
    const move = chooseMove(board, turn, currentInt);

    if (move) {
      const newBoard = applyMove(board, move.r, move.c, turn);
      setBoard(newBoard);
      setLastMove(move);
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  const finishGame = () => {
    setIsBattleActive(false);
    const scores = getScore(board);
    if (scores[1] > scores[2]) {
      setBattleResult('win');
      if (activeOpponent) {
        // Reward
        const currentG = engine.getState().gold;
        // Hacky way to add gold without modifying GameEngine explicitly for this screen if we don't have a method, 
        // but it's better to add a method. Since we don't, we can simulate by completing a dummy request or just using a global method if we add one.
        // Wait, we can't directly mutate state without triggering save. Let's add an explicit reward method or just use `unlockLocation` internally? No.
        // We will call a custom script to inject an addGold method to GameEngine.
      }
    } else if (scores[1] < scores[2]) {
      setBattleResult('lose');
    } else {
      setBattleResult('draw');
    }
  };

  useEffect(() => {
    if (isBattleActive && !battleResult) {
      const timer = setTimeout(() => {
        processTurn();
      }, 800); // 0.8s per move
      return () => clearTimeout(timer);
    }
  }, [isBattleActive, board, turn, battleResult]);

  useEffect(() => {
    if (battleResult === 'win' && activeOpponent) {
      // Call addGold
      (engine as any).addGold(activeOpponent.reward);
    }
  }, [battleResult]);

  const handleStartBattle = () => {
    if (!activeRobot || !activeOpponent) return;
    setBoard(cloneBoard(INITIAL_BOARD));
    setTurn(1);
    setIsBattleActive(true);
    setBattleResult(null);
    setLastMove(null);
  };

  const renderBoard = () => {
    return (
      <div className="mx-auto w-fit p-2 bg-emerald-700 rounded-lg shadow-inner">
        <div className="grid grid-cols-8 gap-0.5 bg-emerald-900 border-2 border-emerald-900">
          {board.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 flex items-center justify-center relative">
              {cell === 1 && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-900 shadow-md"></div>}
              {cell === 2 && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-md"></div>}
              {lastMove?.r === r && lastMove?.c === c && <div className="absolute w-2 h-2 bg-red-500 rounded-full"></div>}
            </div>
          )))}
        </div>
      </div>
    );
  };

  const scores = getScore(board);

  return (
    <div className="p-4 pb-24 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className={theme.typography.h2}>ロボット・バトル (オセロ)</h2>
        <p className="text-stone-600 text-sm">自慢のロボットを派遣して、企業のAIとオートバトル！<br/>賢さ(Int)が高いほど、ロボットはより良い手を選びます。</p>
      </div>

      {!isBattleActive && !battleResult ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white">
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>1. 参戦ロボットを選ぶ</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.robots.length === 0 ? (
                <p className="text-stone-500 text-sm">ロボットがいません。製造してください。</p>
              ) : (
                state.robots.map(r => {
                  const isDispatched = engine.isRobotAutoDispatched(r.id) || state.activeQuest?.dispatchedRobotId === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => !isDispatched && setSelectedRobotId(r.id)}
                      disabled={isDispatched}
                      className={`w-full text-left p-3 rounded border transition-colors ${selectedRobotId === r.id ? 'border-primary bg-primary/10' : 'border-stone-200'} ${isDispatched ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{r.name}</span>
                        <div className="flex gap-3 text-xs text-stone-600">
                          <span>Int: {r.stats.intelligence}</span>
                        </div>
                      </div>
                      {isDispatched && <span className="text-[10px] text-red-500">※出撃中</span>}
                    </button>
                  )
                })
              )}
            </div>
          </Card>

          <Card className="bg-white">
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>2. 対戦相手を選ぶ</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {OPPONENTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpponentId(o.id)}
                  className={`w-full text-left p-3 rounded border transition-colors flex justify-between items-center ${selectedOpponentId === o.id ? 'border-primary bg-primary/10' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <div>
                    <div className="font-bold">{o.name}</div>
                    <div className="text-xs text-stone-500">{o.org} / AIレベル: {o.int}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-700 font-bold block">報酬: {o.reward} G</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="md:col-span-2 mt-4 text-center">
            <Button
              onClick={handleStartBattle}
              disabled={!selectedRobotId || !selectedOpponentId}
              className="w-full md:w-1/2 py-4 text-lg"
            >
              バトル開始！
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-stone-50 border-2 border-stone-200">
          <div className="flex justify-between items-center mb-6">
            <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}`}>
              <div className="flex justify-center mb-2">
                {activeRobot && <RobotVisual robot={activeRobot} size={48} />}
              </div>
              <div className="font-bold">{activeRobot?.name}</div>
              <div className="text-xs text-stone-600">Int: {activeRobot?.stats.intelligence}</div>
              <div className="mt-2 text-xl font-bold bg-stone-900 text-white rounded w-12 mx-auto">{scores[1]}</div>
            </div>
            
            <div className="px-4 font-black text-3xl text-stone-300">VS</div>

            <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
              <div className="flex justify-center mb-2 h-12 items-center text-4xl">
                🤖
              </div>
              <div className="font-bold">{activeOpponent?.name}</div>
              <div className="text-xs text-stone-600">AIレベル: {activeOpponent?.int}</div>
              <div className="mt-2 text-xl font-bold bg-white text-stone-900 border border-stone-300 rounded w-12 mx-auto">{scores[2]}</div>
            </div>
          </div>

          <div className="mb-6">
            {renderBoard()}
          </div>

          <div className="text-center">
            {!battleResult ? (
              <p className="text-lg font-bold text-stone-700 animate-pulse">
                {turn === 1 ? '⬛ 自機ロボットの思考中...' : '⬜ 相手の思考中...'}
              </p>
            ) : (
              <div className="space-y-4">
                <div className="text-3xl font-black">
                  {battleResult === 'win' && <span className="text-emerald-500">🎉 勝利！</span>}
                  {battleResult === 'lose' && <span className="text-red-500">💀 敗北...</span>}
                  {battleResult === 'draw' && <span className="text-stone-500">🤝 引き分け</span>}
                </div>
                {battleResult === 'win' && (
                  <p className="text-amber-700 font-bold text-lg">報酬: {activeOpponent?.reward} G を獲得しました！</p>
                )}
                <Button onClick={() => { setIsBattleActive(false); setBattleResult(null); }}>
                  戻る
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
