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

const PIECE_VALUES: Record<string, number> = {
  'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 1000,
  'p': -1, 'n': -3, 'b': -3, 'r': -5, 'q': -9, 'k': -1000,
  '.': 0
};

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

  const evaluate = (b: BoardState) => {
    let score = 0;
    let whiteKing = false, blackKing = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        score += PIECE_VALUES[b[r][c]] || 0;
        if (b[r][c] === 'K') whiteKing = true;
        if (b[r][c] === 'k') blackKing = true;
      }
    }
    if (!whiteKing) return -10000;
    if (!blackKing) return 10000;
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
    if (int < 10) return moves[Math.floor(Math.random() * moves.length)];
    
    moves.sort(() => Math.random() - 0.5);

    let bestMove = moves[0];
    let maxEval = p === 1 ? -Infinity : Infinity;

    for (const m of moves) {
      const nb = applyMove(b, m);
      const ev = evaluate(nb);
      if (p === 1) {
        if (ev > maxEval) { maxEval = ev; bestMove = m; }
      } else {
        if (ev < maxEval) { maxEval = ev; bestMove = m; }
      }
    }
    return bestMove;
  };

  useEffect(() => {
    if (isFinished || isPaused) return;
    const timer = setTimeout(() => {
      const winner = checkWin(board);
      if (winner !== 0) {
        onFinish(winner === 1 ? 'win' : 'lose');
        return;
      }

      const currentInt = turn === 1 ? activeRobot.stats.intelligence : activeOpponent.int;
      const move = chooseMove(board, turn, currentInt);
      if (move) {
        setBoard(applyMove(board, move));
        setLastMove(move);
        setTurn(turn === 1 ? 2 : 1);
      } else {
        onFinish('draw');
      }
    }, Math.floor(800 / speed));
    return () => clearTimeout(timer);
  }, [board, turn, isPaused, isFinished, speed]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''} ${battleResult === 'win' ? 'ring-2 ring-amber-400 bg-amber-50' : ''}`}>
          <div className="flex justify-center mb-2">
            <RobotVisual robot={activeRobot} size={48} animateVictory={battleResult === 'win'} />
          </div>
          <div className="font-bold flex items-center justify-center gap-1">
            {activeRobot.name}
            {battleResult === 'win' && <span className="text-amber-500 text-xs">👑</span>}
          </div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold bg-white text-stone-900 border border-stone-300 rounded w-12 mx-auto">♔</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AI: {activeOpponent.int}</div>
          <div className="mt-2 text-xl font-bold bg-stone-900 text-white rounded w-12 mx-auto">♚</div>
        </div>
      </div>
      <div className="mx-auto w-fit border-4 border-stone-800 rounded-sm">
        <div className="grid grid-cols-8">
          {board.map((row, r) => row.map((cell, c) => {
            const isLight = (r + c) % 2 === 0;
            const isHighlight = lastMove && ((lastMove.fr === r && lastMove.fc === c) || (lastMove.tr === r && lastMove.tc === c));
            return (
              <div key={`${r}-${c}`} className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-4xl ${isLight ? 'bg-amber-100' : 'bg-amber-700'} ${isHighlight ? 'bg-yellow-300 opacity-80' : ''}`}>
                {EMOJIS[cell] || ''}
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};
