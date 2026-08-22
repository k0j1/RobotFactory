import { Material, QuestLocation } from './models';

export const MATERIALS: Material[] = [
  { id: 'm1', name: 'さびた鉄くず', attribute: 'Earth', rarity: 1, price: 10, baseStats: { hp: 10, power: 5, defense: 10, agility: 2, dexterity: 5 } },
  { id: 'm2', name: '燃える歯車', attribute: 'Fire', rarity: 1, price: 20, baseStats: { hp: 5, power: 15, defense: 5, agility: 5, dexterity: 5 } },
  { id: 'm3', name: '水冷チューブ', attribute: 'Water', rarity: 1, price: 20, baseStats: { hp: 15, power: 5, defense: 10, agility: 5, dexterity: 10 } },
  { id: 'm4', name: '風切りモーター', attribute: 'Wind', rarity: 2, price: 50, baseStats: { hp: 10, power: 10, defense: 5, agility: 20, dexterity: 10 } },
  { id: 'm5', name: '発光ダイオード', attribute: 'Light', rarity: 2, price: 50, baseStats: { hp: 10, power: 10, defense: 10, agility: 10, dexterity: 20 } },
  { id: 'm6', name: '謎の黒い液', attribute: 'Dark', rarity: 3, price: 100, baseStats: { hp: 20, power: 20, defense: 15, agility: 15, dexterity: 15 } },
];

export const LOCATIONS: QuestLocation[] = [
  { id: 'loc1', name: '裏山のスクラップ場', description: '近所のゴミ捨て場。安全だが素材はしょぼい。', unlockCostG: 0, baseTimeMs: 10000, drops: ['m1', 'm2', 'm3'] },
  { id: 'loc2', name: '灼熱の廃工場', description: '火属性の素材が出やすい危険な工場。', unlockCostG: 200, baseTimeMs: 60000, drops: ['m1', 'm2', 'm4'] },
  { id: 'loc3', name: '水没した都市遺跡', description: '水属性の素材が眠る遺跡。', unlockCostG: 500, baseTimeMs: 120000, drops: ['m3', 'm5'] },
  { id: 'loc4', name: '最果てのクレーター', description: 'レアな闇の素材が見つかるかも…', unlockCostG: 1500, baseTimeMs: 300000, drops: ['m5', 'm6'] },
];

export const MAX_STORAGE_LEVELS = [5, 10, 15, 20];
export const STORAGE_UPGRADE_COST = [0, 500, 1500, 5000];
