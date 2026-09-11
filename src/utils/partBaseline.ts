import { RobotPart, PartType, Material } from '../core/models';
import { MATERIALS } from '../core/data';

export const PART_TYPE_MULTIPLIERS: Record<PartType, {
  hp: number;
  power: number;
  defense: number;
  agility: number;
  dexterity: number;
  intelligence: number;
}> = {
  head: { hp: 0.5, power: 0.2, defense: 0.5, agility: 0.5, dexterity: 0.8, intelligence: 2.0 },
  body: { hp: 2.0, power: 0.8, defense: 2.0, agility: 0.3, dexterity: 0.5, intelligence: 0.5 },
  arms: { hp: 0.8, power: 2.0, defense: 0.8, agility: 0.8, dexterity: 1.5, intelligence: 0.5 },
  legs: { hp: 1.0, power: 1.0, defense: 1.0, agility: 2.0, dexterity: 1.2, intelligence: 0.5 },
};

export interface StatBaselineItem {
  key: 'hp' | 'power' | 'defense' | 'agility' | 'dexterity' | 'intelligence' | 'weight';
  label: string;
  shortLabel: string;
  base: number;
  actual: number;
  diff: number; // actual - base
  unit?: string;
  isLowerBetter?: boolean;
}

export interface PartBaselineReport {
  part: RobotPart;
  mainMaterial: Material;
  baselineStats: {
    hp: number;
    power: number;
    defense: number;
    agility: number;
    dexterity: number;
    intelligence: number;
  };
  baselineWeight: number;
  items: StatBaselineItem[];
  totalStatsDiff: number; // HP + Pow + Def + Agi + Dex + Int diff
  weightDiff: number;
  qualityRank: 'S' | 'A' | 'B' | 'C';
  qualityLabel: string;
}

/**
 * パーツ名や属性からメイン素材を特定する
 */
export function findMainMaterialForPart(part: RobotPart): Material {
  // 1. パーツ名から直接素材名を検索
  const matchedByName = MATERIALS.find(m => part.name.startsWith(m.name) || part.name.includes(m.name));
  if (matchedByName) return matchedByName;

  // 2. 属性とレア度で検索
  const matchedByAttrAndRarity = MATERIALS.find(m => m.attribute === part.attribute && m.rarity === part.rarity);
  if (matchedByAttrAndRarity) return matchedByAttrAndRarity;

  // 3. 属性一致で検索
  const matchedByAttr = MATERIALS.find(m => m.attribute === part.attribute);
  if (matchedByAttr) return matchedByAttr;

  // 4. フォールバック
  return MATERIALS[0];
}

/**
 * パーツの基準値（標準設計値）および実測値との差分を計算する
 */
export function calculatePartBaseline(part: RobotPart): PartBaselineReport {
  const mainMat = findMainMaterialForPart(part);
  // サブ素材は同レア度・同属性の代表素材（標準は同素材）を想定
  const subMat = mainMat;

  const multi = PART_TYPE_MULTIPLIERS[part.type] || PART_TYPE_MULTIPLIERS.head;

  const matHp = mainMat.baseStats.hp + Math.floor(subMat.baseStats.hp * 0.5);
  const matPow = mainMat.baseStats.power + Math.floor(subMat.baseStats.power * 0.5);
  const matDef = mainMat.baseStats.defense + Math.floor(subMat.baseStats.defense * 0.5);
  const matAgi = mainMat.baseStats.agility + Math.floor(subMat.baseStats.agility * 0.5);
  const matDex = mainMat.baseStats.dexterity + Math.floor(subMat.baseStats.dexterity * 0.5);
  const matInt = mainMat.baseStats.intelligence + Math.floor(subMat.baseStats.intelligence * 0.5);

  // 乱数0〜4の中央値・期待値は2
  const baseHp = Math.floor(matHp * multi.hp) + 2;
  const basePow = Math.floor(matPow * multi.power) + 2;
  const baseDef = Math.floor(matDef * multi.defense) + 2;
  let baseAgi = Math.floor(matAgi * multi.agility) + 2;
  const baseDex = Math.floor(matDex * multi.dexterity) + 2;
  const baseInt = Math.floor(matInt * multi.intelligence) + 2;

  // 基準重量
  const baseWeight = Math.floor((basePow + baseDef) * 1.5) + 2;
  // 基準重量による敏捷性ペナルティ
  const baseAgilityPenalty = Math.floor(baseWeight / 5);
  baseAgi = Math.max(1, baseAgi - baseAgilityPenalty);

  const actualWeight = part.weight ?? baseWeight;

  const items: StatBaselineItem[] = [
    {
      key: 'hp',
      label: '耐久力',
      shortLabel: 'HP',
      base: baseHp,
      actual: part.stats.hp,
      diff: part.stats.hp - baseHp,
    },
    {
      key: 'power',
      label: '攻撃力',
      shortLabel: 'POW',
      base: basePow,
      actual: part.stats.power,
      diff: part.stats.power - basePow,
    },
    {
      key: 'defense',
      label: '防御力',
      shortLabel: 'DEF',
      base: baseDef,
      actual: part.stats.defense,
      diff: part.stats.defense - baseDef,
    },
    {
      key: 'agility',
      label: '速度',
      shortLabel: 'AGI',
      base: baseAgi,
      actual: part.stats.agility,
      diff: part.stats.agility - baseAgi,
    },
    {
      key: 'dexterity',
      label: '探索力',
      shortLabel: 'DEX',
      base: baseDex,
      actual: part.stats.dexterity,
      diff: part.stats.dexterity - baseDex,
    },
    {
      key: 'intelligence',
      label: '解析力',
      shortLabel: 'INT',
      base: baseInt,
      actual: part.stats.intelligence,
      diff: part.stats.intelligence - baseInt,
    },
    {
      key: 'weight',
      label: '重量',
      shortLabel: 'WT',
      base: baseWeight,
      actual: actualWeight,
      diff: actualWeight - baseWeight,
      isLowerBetter: true, // 重量は軽い方がAGIペナルティが少ない
    },
  ];

  const totalStatsDiff = items
    .filter(it => it.key !== 'weight')
    .reduce((acc, it) => acc + it.diff, 0);

  const weightDiff = actualWeight - baseWeight;

  // 評価判定（全ステータス差分ベース）
  let qualityRank: 'S' | 'A' | 'B' | 'C' = 'B';
  let qualityLabel = '標準個体 (標準的な仕上がり)';

  if (totalStatsDiff >= 6) {
    qualityRank = 'S';
    qualityLabel = '特上級・超上振れ個体！';
  } else if (totalStatsDiff >= 2) {
    qualityRank = 'A';
    qualityLabel = '優秀・上振れ個体';
  } else if (totalStatsDiff <= -3) {
    qualityRank = 'C';
    qualityLabel = 'やや低水準な個体';
  }

  return {
    part,
    mainMaterial: mainMat,
    baselineStats: {
      hp: baseHp,
      power: basePow,
      defense: baseDef,
      agility: baseAgi,
      dexterity: baseDex,
      intelligence: baseInt,
    },
    baselineWeight: baseWeight,
    items,
    totalStatsDiff,
    weightDiff,
    qualityRank,
    qualityLabel,
  };
}
