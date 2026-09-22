export type OthelloMemoryId = 
  | 'max_flips'   // 一番石が多く取れるところ優先
  | 'min_flips'   // 一番石が少なく取れるところ優先
  | 'corner'      // 角を取ること優先
  | 'edge'        // 端を取ること優先
  | 'inner'       // 内側とること優先
  | 'upper_half'  // 上半分に置くことを優先
  | 'lower_half'  // 下半分に置くことを優先
  | 'right_half'  // 右半分に置くことを優先
  | 'left_half';  // 左半分に置くことを優先

export interface OthelloMemoryDef {
  id: OthelloMemoryId;
  name: string;
  shortLabel: string;
  cost: number; // エレメント価格
  desc: string;
  badgeColor: string;
}

export const OTHELLO_MEMORIES: Record<OthelloMemoryId, OthelloMemoryDef> = {
  max_flips: {
    id: 'max_flips',
    name: '一番石が多く取れるところ優先',
    shortLabel: '最多反転',
    cost: 30,
    desc: '相手の石を最も多くひっくり返せるマスを優先して選択します。',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  min_flips: {
    id: 'min_flips',
    name: '一番石が少なく取れるところ優先',
    shortLabel: '最少反転',
    cost: 30,
    desc: 'ひっくり返す石の枚数が最も少ないマスを優先（序盤の開放度を抑制）。',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300'
  },
  corner: {
    id: 'corner',
    name: '角を取ること優先',
    shortLabel: '角優先',
    cost: 50,
    desc: '反転されない四隅の角マス（四隅）に着手可能な場合、最優先で確保します。',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  edge: {
    id: 'edge',
    name: '端を取ること優先',
    shortLabel: '端優先',
    cost: 40,
    desc: '盤面の最外周（1行目・8行目・A列・H列）のマスへの着手を優先します。',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  inner: {
    id: 'inner',
    name: '内側とること優先',
    shortLabel: '内側優先',
    cost: 30,
    desc: '盤面の中央4×4エリアに着手することを優先し、外周を開放しません。',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  upper_half: {
    id: 'upper_half',
    name: '上半分に置くことを優先',
    shortLabel: '上半分優先',
    cost: 20,
    desc: '盤面の上半分（1〜4行目）に位置するマスへの着手を優先します。',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  },
  lower_half: {
    id: 'lower_half',
    name: '下半分に置くことを優先',
    shortLabel: '下半分優先',
    cost: 20,
    desc: '盤面の下半分（5〜8行目）に位置するマスへの着手を優先します。',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  right_half: {
    id: 'right_half',
    name: '右半分に置くことを優先',
    shortLabel: '右半分優先',
    cost: 20,
    desc: '盤面の右半分（E〜H列 / 列4〜7）への着手を優先します。',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
  },
  left_half: {
    id: 'left_half',
    name: '左半分に置くことを優先',
    shortLabel: '左半分優先',
    cost: 20,
    desc: '盤面の左半分（A〜D列 / 列0〜3）への着手を優先します。',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300'
  }
};

export const OTHELLO_MEMORY_LIST: OthelloMemoryDef[] = [
  OTHELLO_MEMORIES.max_flips,
  OTHELLO_MEMORIES.min_flips,
  OTHELLO_MEMORIES.corner,
  OTHELLO_MEMORIES.edge,
  OTHELLO_MEMORIES.inner,
  OTHELLO_MEMORIES.upper_half,
  OTHELLO_MEMORIES.lower_half,
  OTHELLO_MEMORIES.right_half,
  OTHELLO_MEMORIES.left_half,
];

export interface OthelloMoveCandidate {
  r: number;
  c: number;
  flipsCount?: number;
}

/**
 * 戦略メモリ条件による着手候補の絞り込み
 */
export function filterMovesByMemory(
  moves: OthelloMoveCandidate[],
  memoryId: string,
  getFlipsCount: (r: number, c: number) => number
): { filtered: OthelloMoveCandidate[]; triggered: boolean } {
  if (moves.length <= 1) return { filtered: moves, triggered: false };

  switch (memoryId) {
    case 'max_flips': {
      let maxFlips = -1;
      for (const m of moves) {
        const cnt = m.flipsCount ?? getFlipsCount(m.r, m.c);
        m.flipsCount = cnt;
        if (cnt > maxFlips) maxFlips = cnt;
      }
      const matched = moves.filter(m => (m.flipsCount ?? getFlipsCount(m.r, m.c)) === maxFlips);
      return { filtered: matched.length > 0 ? matched : moves, triggered: matched.length > 0 && matched.length < moves.length };
    }
    case 'min_flips': {
      let minFlips = Infinity;
      for (const m of moves) {
        const cnt = m.flipsCount ?? getFlipsCount(m.r, m.c);
        m.flipsCount = cnt;
        if (cnt < minFlips) minFlips = cnt;
      }
      const matched = moves.filter(m => (m.flipsCount ?? getFlipsCount(m.r, m.c)) === minFlips);
      return { filtered: matched.length > 0 ? matched : moves, triggered: matched.length > 0 && matched.length < moves.length };
    }
    case 'corner': {
      const corners = moves.filter(m => 
        (m.r === 0 || m.r === 7) && (m.c === 0 || m.c === 7)
      );
      return { filtered: corners.length > 0 ? corners : moves, triggered: corners.length > 0 };
    }
    case 'edge': {
      const edges = moves.filter(m => 
        m.r === 0 || m.r === 7 || m.c === 0 || m.c === 7
      );
      return { filtered: edges.length > 0 ? edges : moves, triggered: edges.length > 0 && edges.length < moves.length };
    }
    case 'inner': {
      const inners = moves.filter(m => 
        m.r >= 2 && m.r <= 5 && m.c >= 2 && m.c <= 5
      );
      return { filtered: inners.length > 0 ? inners : moves, triggered: inners.length > 0 && inners.length < moves.length };
    }
    case 'upper_half': {
      const upper = moves.filter(m => m.r < 4);
      return { filtered: upper.length > 0 ? upper : moves, triggered: upper.length > 0 && upper.length < moves.length };
    }
    case 'lower_half': {
      const lower = moves.filter(m => m.r >= 4);
      return { filtered: lower.length > 0 ? lower : moves, triggered: lower.length > 0 && lower.length < moves.length };
    }
    case 'right_half': {
      const right = moves.filter(m => m.c >= 4);
      return { filtered: right.length > 0 ? right : moves, triggered: right.length > 0 && right.length < moves.length };
    }
    case 'left_half': {
      const left = moves.filter(m => m.c < 4);
      return { filtered: left.length > 0 ? left : moves, triggered: left.length > 0 && left.length < moves.length };
    }
    default:
      return { filtered: moves, triggered: false };
  }
}

/**
 * マス(r, c)が幾何学的・位置指定メモリの対象エリアに含まれるかを判定
 */
export function isCellInSpatialMemoryZone(r: number, c: number, memoryId: string): boolean {
  switch (memoryId) {
    case 'corner':
      return (r === 0 || r === 7) && (c === 0 || c === 7);
    case 'edge':
      return r === 0 || r === 7 || c === 0 || c === 7;
    case 'inner':
      return r >= 2 && r <= 5 && c >= 2 && c <= 5;
    case 'upper_half':
      return r < 4;
    case 'lower_half':
      return r >= 4;
    case 'left_half':
      return c < 4;
    case 'right_half':
      return c >= 4;
    default:
      return false;
  }
}

export interface PipelineStep {
  slotIndex: number; // 0, 1, 2
  memoryId: string;
  memoryDef: OthelloMemoryDef;
  inputMoves: OthelloMoveCandidate[];
  outputMoves: OthelloMoveCandidate[];
  triggered: boolean;
  reasonText: string;
}

export interface MemoryPipelineAnalysis {
  initialMoves: OthelloMoveCandidate[];
  steps: PipelineStep[];
  finalCandidateMoves: OthelloMoveCandidate[];
  // マスごとの合致スロット（どのスロットにマッチしているか）
  cellMatchedSlots: Record<string, number[]>; // key: `${r},${c}`, value: [0, 1, 2]
}

/**
 * 装備メモリの思考ルーチンによる絞り込みパイプラインを完全解析
 */
export function analyzeMemoryPipeline(
  moves: OthelloMoveCandidate[],
  equippedMemories: string[],
  getFlipsCount: (r: number, c: number) => number
): MemoryPipelineAnalysis {
  const steps: PipelineStep[] = [];
  let currentCandidates: OthelloMoveCandidate[] = moves.map(m => ({
    r: m.r,
    c: m.c,
    flipsCount: m.flipsCount ?? getFlipsCount(m.r, m.c)
  }));

  const initialMoves = [...currentCandidates];
  const cellMatchedSlots: Record<string, number[]> = {};

  for (const m of initialMoves) {
    cellMatchedSlots[`${m.r},${m.c}`] = [];
  }

  // 各スロットについて判定
  equippedMemories.forEach((memId, slotIdx) => {
    if (!memId) return;
    const def = OTHELLO_MEMORIES[memId as keyof typeof OTHELLO_MEMORIES];
    if (!def) return;

    // 現在の合法手の中でこのメモリの条件にマッチするものを記録
    for (const m of initialMoves) {
      const flips = m.flipsCount ?? getFlipsCount(m.r, m.c);
      let isMatch = false;

      if (memId === 'max_flips') {
        const maxF = Math.max(...initialMoves.map(im => im.flipsCount ?? getFlipsCount(im.r, im.c)));
        isMatch = flips === maxF;
      } else if (memId === 'min_flips') {
        const minF = Math.min(...initialMoves.map(im => im.flipsCount ?? getFlipsCount(im.r, im.c)));
        isMatch = flips === minF;
      } else {
        isMatch = isCellInSpatialMemoryZone(m.r, m.c, memId);
      }

      if (isMatch) {
        const key = `${m.r},${m.c}`;
        if (!cellMatchedSlots[key]) cellMatchedSlots[key] = [];
        if (!cellMatchedSlots[key].includes(slotIdx)) {
          cellMatchedSlots[key].push(slotIdx);
        }
      }
    }

    const prevCount = currentCandidates.length;
    const filterRes = filterMovesByMemory(currentCandidates, memId, getFlipsCount);
    const nextCandidates = filterRes.filtered;
    const triggered = filterRes.triggered;

    let reasonText = '';
    if (prevCount <= 1) {
      reasonText = '候補がすでに1手以下のためスキップ';
    } else if (triggered) {
      reasonText = `${prevCount}手から${nextCandidates.length}手へ絞り込み成功`;
    } else {
      reasonText = '該当なし、または候補全体が同条件のため維持';
    }

    steps.push({
      slotIndex: slotIdx,
      memoryId: memId,
      memoryDef: def,
      inputMoves: currentCandidates,
      outputMoves: nextCandidates,
      triggered,
      reasonText
    });

    currentCandidates = nextCandidates;
  });

  return {
    initialMoves,
    steps,
    finalCandidateMoves: currentCandidates,
    cellMatchedSlots
  };
}

