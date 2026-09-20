import { RobotPart, PartType, Material } from '../core/models';
import { MATERIALS } from '../core/data';
import { findMasterPartData, findMasterPartByNameOrId } from '../data/partsMaster';

export const PART_TYPE_MULTIPLIERS: Record<PartType, {
  hp: number;
  power: number;
  defense: number;
  agility: number;
  dexterity: number;
  intelligence: number;
}> = {
  head: { hp: 0.3, power: 0.1, defense: 0.3, agility: 0.4, dexterity: 0.5, intelligence: 3.5 }, // INT特化、他低め
  body: { hp: 2.5, power: 0.3, defense: 2.5, agility: 0.1, dexterity: 0.2, intelligence: 0.2 }, // HP(Vit)/Def高、他低め
  arms: { hp: 0.4, power: 3.0, defense: 0.4, agility: 0.4, dexterity: 2.5, intelligence: 0.2 }, // Pow/Dex高、他低め
  legs: { hp: 0.6, power: 0.4, defense: 0.6, agility: 3.0, dexterity: 2.5, intelligence: 0.2 }, // Agi/Dex高、他低め
};

export interface StatBaselineItem {
  key: 'hp' | 'power' | 'defense' | 'agility' | 'dexterity' | 'intelligence';
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
  items: StatBaselineItem[];
  totalStatsDiff: number; // HP + Pow + Def + Agi + Dex + Int diff
  qualityRank: 'S' | 'A' | 'B' | 'C';
  qualityLabel: string;
}

/**
 * パーツ名や属性からメイン素材を特定する
 */
export function findMainMaterialForPart(part: RobotPart): Material {
  // 1. パーツ名から直接素材名を検索
  const partName = part?.name || '';
  const matchedByName = partName ? MATERIALS.find(m => partName.startsWith(m.name) || partName.includes(m.name)) : undefined;
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
 * パーツの基準値（m_parts_encyclopediaテーブル標準設計値）および実測値との差分を計算する
 */
export function calculatePartBaseline(part: RobotPart): PartBaselineReport {
  const mainMat = findMainMaterialForPart(part);

  // m_parts_encyclopedia のマスターデータから基準値を取得
  const masterData = findMasterPartData(part.type, part.rarity, part.visualIndex) || findMasterPartByNameOrId(part.name);

  let baseHp = 0;
  let basePow = 0;
  let baseDef = 0;
  let baseAgi = 0;
  let baseDex = 0;
  let baseInt = 0;

  if (masterData) {
    baseHp = masterData.stats.hp;
    basePow = masterData.stats.power;
    baseDef = masterData.stats.defense;
    baseAgi = masterData.stats.agility;
    baseDex = masterData.stats.dexterity;
    baseInt = masterData.stats.intelligence;
  } else {
    // フォールバック（マスターデータ未定義時）
    const subMat = mainMat;
    const multi = PART_TYPE_MULTIPLIERS[part.type] || PART_TYPE_MULTIPLIERS.head;

    const matHp = mainMat.baseStats.hp + Math.floor(subMat.baseStats.hp * 0.5);
    const matPow = mainMat.baseStats.power + Math.floor(subMat.baseStats.power * 0.5);
    const matDef = mainMat.baseStats.defense + Math.floor(subMat.baseStats.defense * 0.5);
    const matAgi = mainMat.baseStats.agility + Math.floor(subMat.baseStats.agility * 0.5);
    const matDex = mainMat.baseStats.dexterity + Math.floor(subMat.baseStats.dexterity * 0.5);
    const matInt = mainMat.baseStats.intelligence + Math.floor(subMat.baseStats.intelligence * 0.5);

    baseHp = Math.floor(matHp * multi.hp);
    basePow = Math.floor(matPow * multi.power);
    baseDef = Math.floor(matDef * multi.defense);
    baseAgi = Math.floor(matAgi * multi.agility);
    baseDex = Math.floor(matDex * multi.dexterity);
    baseInt = Math.floor(matInt * multi.intelligence);
  }

  const items: StatBaselineItem[] = [
    {
      key: 'hp',
      label: '耐久力',
      shortLabel: 'VIT',
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
  ];

  const totalStatsDiff = items.reduce((acc, it) => acc + it.diff, 0);

  // 評価判定（全ステータス差分ベース）
  let qualityRank: 'S' | 'A' | 'B' | 'C' = 'B';
  let qualityLabel = '標準個体 (標準的な仕上がり)';

  if (totalStatsDiff >= 12) {
    qualityRank = 'S';
    qualityLabel = '特上級・超上振れ個体！';
  } else if (totalStatsDiff >= 5) {
    qualityRank = 'A';
    qualityLabel = '優秀・上振れ個体';
  } else if (totalStatsDiff <= -5) {
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
    items,
    totalStatsDiff,
    qualityRank,
    qualityLabel,
  };
}

