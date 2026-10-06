export type DanmakuItemId =
  | 'barrier_1'
  | 'barrier_2'
  | 'barrier_3'
  | 'life_1'
  | 'life_2'
  | 'life_3';

export type DanmakuItemCategory = 'barrier' | 'life';

export interface DanmakuItemDef {
  id: DanmakuItemId;
  category: DanmakuItemCategory;
  rank: 1 | 2 | 3;
  name: string;
  shortLabel: string;
  cost: number; // エレメント価格
  effectValue: number; // バリア回数(1〜3) または 追加ライフ数(1〜3)
  desc: string;
  badgeColor: string;
  badgeClass: string;
  cardBorder: string;
  cardBg: string;
}

export const DANMAKU_ITEMS: Record<DanmakuItemId, DanmakuItemDef> = {
  barrier_1: {
    id: 'barrier_1',
    category: 'barrier',
    rank: 1,
    name: 'エネルギーバリア I',
    shortLabel: 'バリアI (1回防御)',
    cost: 15,
    effectValue: 1,
    desc: '弾幕よけ出撃時に展開。敵弾に当たっても1回だけダメージを完全に無効化しライフが減りません（1回の出撃につき1個消費）。',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    cardBorder: 'border-sky-300',
    cardBg: 'bg-sky-50/60',
  },
  barrier_2: {
    id: 'barrier_2',
    category: 'barrier',
    rank: 2,
    name: '高密度フォースバリア II',
    shortLabel: 'バリアII (2回防御)',
    cost: 35,
    effectValue: 2,
    desc: '弾幕よけ出撃時に展開。敵弾に当たっても2回までダメージを完全に無効化しライフが減りません（1回の出撃につき1個消費）。',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-400',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-400',
    cardBorder: 'border-cyan-400',
    cardBg: 'bg-cyan-50/70',
  },
  barrier_3: {
    id: 'barrier_3',
    category: 'barrier',
    rank: 3,
    name: 'イージス絶対防壁 III',
    shortLabel: 'バリアIII (3回防御)',
    cost: 70,
    effectValue: 3,
    desc: '弾幕よけ出撃時に展開。敵弾に当たっても3回までダメージを完全に無効化しライフが減りません（1回の出撃につき1個消費）。',
    badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-400',
    badgeClass: 'bg-indigo-100 text-indigo-950 border-indigo-400',
    cardBorder: 'border-indigo-400',
    cardBg: 'bg-indigo-50/70',
  },
  life_1: {
    id: 'life_1',
    category: 'life',
    rank: 1,
    name: '予備装甲プレート +1',
    shortLabel: 'ライフ+1 (HP6)',
    cost: 15,
    effectValue: 1,
    desc: '弾幕よけ出撃時に自機の初期ライフ（装甲HP）を +1 増加（HP 5 → 6）させます（1回の出撃につき1個消費）。',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cardBorder: 'border-emerald-300',
    cardBg: 'bg-emerald-50/60',
  },
  life_2: {
    id: 'life_2',
    category: 'life',
    rank: 2,
    name: '増加リアクティブ装甲 +2',
    shortLabel: 'ライフ+2 (HP7)',
    cost: 35,
    effectValue: 2,
    desc: '弾幕よけ出撃時に自機の初期ライフ（装甲HP）を +2 増加（HP 5 → 7）させます（1回の出撃につき1個消費）。',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-400',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-400',
    cardBorder: 'border-teal-400',
    cardBg: 'bg-teal-50/70',
  },
  life_3: {
    id: 'life_3',
    category: 'life',
    rank: 3,
    name: 'オリハルコン重装コア +3',
    shortLabel: 'ライフ+3 (HP8)',
    cost: 70,
    effectValue: 3,
    desc: '弾幕よけ出撃時に自機の初期ライフ（装甲HP）を +3 増加（HP 5 → 8）させます（1回の出撃につき1個消費）。',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-400',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-400',
    cardBorder: 'border-amber-400',
    cardBg: 'bg-amber-50/70',
  },
};

export const DANMAKU_ITEM_LIST: DanmakuItemDef[] = [
  DANMAKU_ITEMS.barrier_1,
  DANMAKU_ITEMS.barrier_2,
  DANMAKU_ITEMS.barrier_3,
  DANMAKU_ITEMS.life_1,
  DANMAKU_ITEMS.life_2,
  DANMAKU_ITEMS.life_3,
];

export const DANMAKU_BARRIER_ITEMS: DanmakuItemDef[] = [
  DANMAKU_ITEMS.barrier_1,
  DANMAKU_ITEMS.barrier_2,
  DANMAKU_ITEMS.barrier_3,
];

export const DANMAKU_LIFE_ITEMS: DanmakuItemDef[] = [
  DANMAKU_ITEMS.life_1,
  DANMAKU_ITEMS.life_2,
  DANMAKU_ITEMS.life_3,
];
