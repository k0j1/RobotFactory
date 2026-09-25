import * as Gi from 'react-icons/gi';
import React, { useState, useEffect } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';

const ROWS = 8;
const COLS = 8;
type Player = 1 | 2;
type BoardState = string[][];

const INITIAL_BOARD: BoardState = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
];

// 駒の基本価値（センチポーン換算）
const PIECE_VALUES: Record<string, number> = {
  'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
  'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000,
  '.': 0
};

// ピース・スクエア・テーブル（位置評価ボーナス：単位センチポーン）
// 白は下（r=6,7）から上（r=0,1）に向かって進む
const PST_PAWN = [
  [ 0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [ 5,  5, 10, 25, 25, 10,  5,  5],
  [ 0,  0,  0, 20, 20,  0,  0,  0],
  [ 5, -5,-10,  0,  0,-10, -5,  5],
  [ 5, 10, 10,-20,-20, 10, 10,  5],
  [ 0,  0,  0,  0,  0,  0,  0,  0]
];

const PST_KNIGHT = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const PST_BISHOP = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const PST_ROOK = [
  [  0,  0,  0,  0,  0,  0,  0,  0],
  [  5, 10, 10, 10, 10, 10, 10,  5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [  0,  0,  0,  5,  5,  0,  0,  0]
];

const PST_QUEEN = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [ -5,  0,  5,  5,  5,  5,  0, -5],
  [  0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

const PST_KING = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [ 20, 20,  0,  0,  0,  0, 20, 20],
  [ 20, 30, 10,  0,  0, 10, 30, 20]
];

const EMOJIS: Record<string, string> = {
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
};

const isWhite = (p: string) => p !== '.' && p === p.toUpperCase();
const isBlack = (p: string) => p !== '.' && p === p.toLowerCase();
const isOpponent = (p1: string, p2: string) => (isWhite(p1) && isBlack(p2)) || (isBlack(p1) && isWhite(p2));
const isOwn = (p1: string, p2: string) => (isWhite(p1) && isWhite(p2)) || (isBlack(p1) && isBlack(p2));

export const ChessGame: React.FC<MinigameProps> = ({ activeRobot, activeOpponent, onFinish, speed, isPaused, isFinished, battleResult }) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1); // 1 = White, 2 = Black
  const [lastMove, setLastMove] = useState<{fr: number, fc: number, tr: number, tc: number} | null>(null);
  const [moveCount, setMoveCount] = useState<number>(0);

  const isValid = (r: number, c: number) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

  const getMovesForPiece = (b: BoardState, r: number, c: number) => {
    const p = b[r][c];
    const moves: {r: number, c: number}[] = [];
    if (p === '.') return moves;
    
    const type = p.toLowerCase();
    const dir = isWhite(p) ? -1 : 1;

    if (type === 'p') {
      if (isValid(r + dir, c) && b[r + dir][c] === '.') {
        moves.push({r: r + dir, c});
        if ((isWhite(p) && r === 6) || (isBlack(p) && r === 1)) {
          if (b[r + dir * 2][c] === '.') moves.push({r: r + dir * 2, c});
        }
      }
      if (isValid(r + dir, c - 1) && isOpponent(p, b[r + dir][c - 1])) moves.push({r: r + dir, c: c - 1});
      if (isValid(r + dir, c + 1) && isOpponent(p, b[r + dir][c + 1])) moves.push({r: r + dir, c: c + 1});
    }
    else if (type === 'n') {
      const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of jumps) {
        if (isValid(r+dr, c+dc) && !isOwn(p, b[r+dr][c+dc])) moves.push({r: r+dr, c: c+dc});
      }
    }
    else if (type === 'k') {
      const steps = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      for (const [dr, dc] of steps) {
        if (isValid(r+dr, c+dc) && !isOwn(p, b[r+dr][c+dc])) moves.push({r: r+dr, c: c+dc});
      }
    }
    else {
      const dirs = [];
      if (type === 'b' || type === 'q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
      if (type === 'r' || type === 'q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
      
      for (const [dr, dc] of dirs) {
        let cr = r + dr, cc = c + dc;
        while (isValid(cr, cc)) {
          if (b[cr][cc] === '.') moves.push({r: cr, c: cc});
          else {
            if (isOpponent(p, b[cr][cc])) moves.push({r: cr, c: cc});
            break;
          }
          cr += dr; cc += dc;
        }
      }
    }
    return moves;
  };

  const getAllMoves = (b: BoardState, player: Player) => {
    const moves: {fr: number, fc: number, tr: number, tc: number}[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const p = b[r][c];
        if ((player === 1 && isWhite(p)) || (player === 2 && isBlack(p))) {
          const pieceMoves = getMovesForPiece(b, r, c);
          for (const m of pieceMoves) {
            moves.push({fr: r, fc: c, tr: m.r, tc: m.c});
          }
        }
      }
    }
    return moves;
  };

  const applyMove = (b: BoardState, move: {fr: number, fc: number, tr: number, tc: number}) => {
    const nb = b.map(row => [...row]);
    let p = nb[move.fr][move.fc];
    nb[move.fr][move.fc] = '.';
    if (p === 'P' && move.tr === 0) p = 'Q';
    if (p === 'p' && move.tr === 7) p = 'q';
    nb[move.tr][move.tc] = p;
    return nb;
  };

  // ピース・スクエア・テーブルから位置評価ボーナスを取得
  const getPiecePst = (p: string, r: number, c: number): number => {
    const isW = isWhite(p);
    const row = isW ? r : 7 - r;
    const col = c;
    const type = p.toUpperCase();
    let val = 0;
    if (type === 'P') val = PST_PAWN[row][col];
    else if (type === 'N') val = PST_KNIGHT[row][col];
    else if (type === 'B') val = PST_BISHOP[row][col];
    else if (type === 'R') val = PST_ROOK[row][col];
    else if (type === 'Q') val = PST_QUEEN[row][col];
    else if (type === 'K') val = PST_KING[row][col];
    return isW ? val : -val;
  };

  const evaluate = (b: BoardState) => {
    let score = 0;
    let whiteKing = false, blackKing = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const p = b[r][c];
        if (p === '.') continue;
        score += PIECE_VALUES[p] || 0;
        score += getPiecePst(p, r, c);
        if (p === 'K') whiteKing = true;
        if (p === 'k') blackKing = true;
      }
    }
    if (!whiteKing) return -20000;
    if (!blackKing) return 20000;
    return score;
  };

  const checkWin = (b: BoardState) => {
    let whiteKing = false, blackKing = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (b[r][c] === 'K') whiteKing = true;
        if (b[r][c] === 'k') blackKing = true;
      }
    }
    if (!whiteKing) return 2;
    if (!blackKing) return 1;
    return 0;
  };

  const chooseMove = (b: BoardState, p: Player, int: number) => {
    const moves = getAllMoves(b, p);
    if (moves.length === 0) return null;

    // 知性が極端に低い場合はランダム
    if (int < 5) return moves[Math.floor(Math.random() * moves.length)];

    // 各合法手の評価値を計算
    const scoredMoves = moves.map(m => {
      const nb = applyMove(b, m);
      const rawEv = evaluate(nb);
      // 自分視点でのスコア（白: p=1ならプラスが良い、黒: p=2ならマイナスが良いので反転）
      let povScore = p === 1 ? rawEv : -rawEv;

      // 相手の駒を取る手には積極性ボーナス（駒の価値に応じた加点）
      const captured = b[m.tr][m.tc];
      if (captured !== '.') {
        const capVal = Math.abs(PIECE_VALUES[captured] || 0);
        povScore += Math.floor(capVal * 0.15);
      }

      // 同一評価値や僅差の手で毎回同じ手順にならないよう、思考の個性・状況に応じた自然なゆらぎを付与
      const jitter = (Math.random() - 0.5) * 12.0;
      return { move: m, score: povScore + jitter };
    });

    // 最大評価値
    const maxScore = Math.max(...scoredMoves.map(sm => sm.score));

    // 温度パラメータ (Temperature):
    // 知性が高いほど最善手を強く好むが、同点や僅差の手（オープニングの手数や互角の手）は柔軟に分散選択する
    const temperature = Math.max(8.0, 50.0 - (int * 0.42));

    // 明らかな悪手（タダで駒を取られる手等）を排除し、知性に応じた有力候補手を抽出
    const dropMargin = Math.max(40, 160 - (int * 1.2));
    const viableMoves = scoredMoves.filter(sm => sm.score >= maxScore - dropMargin);
    const candidatePool = viableMoves.length > 0 ? viableMoves : scoredMoves;

    // ソフトマックス（Boltzmann分布）による重み付け確率計算
    const weightedMoves = candidatePool.map(sm => {
      const diff = (sm.score - maxScore) / temperature;
      return {
        move: sm.move,
        weight: Math.exp(Math.max(-12, diff))
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

    return chosen;
  };

  useEffect(() => {
    if (isFinished || isPaused) return;
    const timer = setTimeout(() => {
      const winner = checkWin(board);
      if (winner !== 0) {
        onFinish(winner === 1 ? 'win' : 'lose');
        return;
      }

      // 最大手数セーフティガード（泥沼の千日手を防止し、100手以上で評価値判定）
      if (moveCount >= 100) {
        const ev = evaluate(board);
        if (ev > 50) onFinish('win');
        else if (ev < -50) onFinish('lose');
        else onFinish('draw');
        return;
      }

      const currentInt = turn === 1 ? activeRobot.stats.intelligence : activeOpponent.int;
      const move = chooseMove(board, turn, currentInt);
      if (move) {
        setBoard(applyMove(board, move));
        setLastMove(move);
        setMoveCount(prev => prev + 1);
        setTurn(turn === 1 ? 2 : 1);
      } else {
        onFinish('draw');
      }
    }, Math.floor(800 / speed));
    return () => clearTimeout(timer);
  }, [board, turn, isPaused, isFinished, speed, moveCount]);

  return (
    <div>
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
          <div className="mt-1.5 text-base font-bold bg-stone-900 text-white rounded-lg px-2.5 py-0.5 w-fit mx-auto shadow-xs">
            ♔ 白
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
          <div className="mt-1.5 text-base font-bold bg-white text-stone-900 border border-stone-400 rounded-lg px-2.5 py-0.5 w-fit mx-auto shadow-xs">
            ♚ 黒
          </div>
        </div>
      </div>

      <div className="mx-auto w-fit p-3 bg-stone-800 rounded-2xl shadow-md border-4 border-stone-700">
        <div className="grid grid-cols-8 border-2 border-stone-900 rounded-lg overflow-hidden">
          {board.map((row, r) => row.map((cell, c) => {
            const isLight = (r + c) % 2 === 0;
            const isHighlight = lastMove && ((lastMove.fr === r && lastMove.fc === c) || (lastMove.tr === r && lastMove.tc === c));
            return (
              <div 
                key={`${r}-${c}`} 
                className={`w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center text-2xl sm:text-3xl select-none ${
                  isLight ? 'bg-amber-100/95 text-stone-900' : 'bg-amber-800 text-amber-50'
                } ${isHighlight ? 'ring-2 ring-amber-300 ring-inset bg-amber-300/80 font-bold' : ''}`}
              >
                {EMOJIS[cell] || ''}
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};
