export type CombatEquipmentType = 'beamSaber' | 'beamShield';
export type CombatEquipmentRank = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface CombatEquipmentRankDef {
  rank: CombatEquipmentRank;
  label: string;
  cost: number; // このランクにランクアップ・解放するために必要なエレメント数
  saberPowerBonus: number;
  shieldDefenseBonus: number;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  glowClass: string;
  desc: string;
}

export const COMBAT_EQUIPMENT_RANKS: Record<CombatEquipmentRank, CombatEquipmentRankDef> = {
  common: {
    rank: 'common',
    label: 'Common',
    cost: 100,
    saberPowerBonus: 35,
    shieldDefenseBonus: 30,
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
    borderClass: 'border-stone-300',
    bgClass: 'bg-stone-50',
    textClass: 'text-stone-700',
    glowClass: '',
    desc: '標準的な光波武装。初期状態の基本性能を発揮します。',
  },
  uncommon: {
    rank: 'uncommon',
    label: 'Uncommon',
    cost: 500,
    saberPowerBonus: 70,
    shieldDefenseBonus: 60,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderClass: 'border-emerald-300',
    bgClass: 'bg-emerald-50/50',
    textClass: 'text-emerald-700',
    glowClass: 'shadow-emerald-200/50',
    desc: 'エネルギー集束率が向上し、通常以上の出力を安定供給します。',
  },
  rare: {
    rank: 'rare',
    label: 'Rare',
    cost: 1000,
    saberPowerBonus: 120,
    shieldDefenseBonus: 100,
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300 font-bold',
    borderClass: 'border-sky-300',
    bgClass: 'bg-sky-50/50',
    textClass: 'text-sky-700',
    glowClass: 'shadow-sky-200/50',
    desc: '高純度エレメント結晶により、高出力の光刃・光波防壁を展開可能。',
  },
  epic: {
    rank: 'epic',
    label: 'Epic',
    cost: 5000,
    saberPowerBonus: 200,
    shieldDefenseBonus: 170,
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    borderClass: 'border-purple-300',
    bgClass: 'bg-purple-50/50',
    textClass: 'text-purple-700',
    glowClass: 'shadow-purple-200/50',
    desc: '極限まで高められたエネルギー粒子が空間を圧搾する超高出力装備。',
  },
  legendary: {
    rank: 'legendary',
    label: 'Legendary',
    cost: 10000,
    saberPowerBonus: 320,
    shieldDefenseBonus: 270,
    badgeClass: 'bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-200 text-amber-950 border-amber-400 font-black shadow-xs',
    borderClass: 'border-amber-400',
    bgClass: 'bg-amber-50/70',
    textClass: 'text-amber-800',
    glowClass: 'shadow-amber-300/60 ring-2 ring-amber-300/40',
    desc: '神話級の粒子収束技術が生み出した至高の武装。圧倒的攻防力を誇る。',
  },
};

export const RANK_ORDER: CombatEquipmentRank[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

/**
 * 次のランクを取得（未所持の場合は common、最高ランクの場合は null）
 */
export function getNextEquipmentRank(currentRank?: CombatEquipmentRank | null): CombatEquipmentRank | null {
  if (!currentRank) return 'common';
  const idx = RANK_ORDER.indexOf(currentRank);
  if (idx === -1) return 'common';
  if (idx + 1 < RANK_ORDER.length) {
    return RANK_ORDER[idx + 1];
  }
  return null;
}

/**
 * 装備ごとのボーナスステータス値を取得
 */
export function getEquipmentBonus(equipment: CombatEquipmentType, rank?: CombatEquipmentRank | null): number {
  if (!rank) return 0;
  const def = COMBAT_EQUIPMENT_RANKS[rank];
  if (!def) return 0;
  return equipment === 'beamSaber' ? def.saberPowerBonus : def.shieldDefenseBonus;
}
