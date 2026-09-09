export type Attribute = 'Fire' | 'Water' | 'Wind' | 'Earth' | 'Light' | 'Dark';

export type WeatherType = 'CLEAR' | 'ACID_RAIN' | 'MAGNETIC_STORM' | 'HEAT_WAVE';

export interface WeatherInfo {
  type: WeatherType;
  name: string;
  description: string;
  timeMultiplier: number;
  bonusAttribute?: Attribute;
}

export const AttributeNames: Record<Attribute, string> = {
  Fire: '火', Water: '水', Wind: '風', Earth: '土', Light: '光', Dark: '闇'
};
export const AttributeColors: Record<Attribute, string> = {
  Fire: '#ef4444', Water: '#3b82f6', Wind: '#10b981', Earth: '#d97706', Light: '#eab308', Dark: '#8b5cf6'
};

export type PartType = 'head' | 'body' | 'arms' | 'legs';

export interface RobotPart {
  id: string;
  type: PartType;
  name: string;
  attribute: Attribute;
  rarity: number;
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; intelligence: number; };
  battleStats?: {
    matches: number;
    wins: number;
    losses: number;
    draws: number;
  };
  visualIndex: number;
}

export interface Material {
  id: string;
  name: string;
  attribute: Attribute;
  rarity: 1 | 2 | 3;
  price: number;
  baseStats: { hp: number; power: number; defense: number; agility: number; dexterity: number; intelligence: number; };
}

export interface DefenseRegenEffect {
  activatedAt: number;     // 付与日時 (タイムスタンプ ms)
  expiresAt: number;       // 効果終了日時 (タイムスタンプ ms)
  lastHealedAt: number;    // 前回HP回復日時 (タイムスタンプ ms)
}

export interface Robot {
  id: string;
  name: string;
  parts: { head: RobotPart; body: RobotPart; arms: RobotPart; legs: RobotPart; };
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; intelligence: number; };
  currentHp?: number;
  maxHp?: number;
  battleStats?: {
    matches: number;
    wins: number;
    losses: number;
    draws: number;
  };
  defenseRegen?: DefenseRegenEffect; // 防衛戦勝利によるリジェネ効果 (12時間・1時間毎HP+1)
  createdAt: number;
  value: number;
}

export interface QuestLocation {
  id: string;
  name: string;
  description: string;
  unlockCostG: number;
  baseTimeMs: number;
  drops: string[];
}

export interface ActiveQuest {
  locationId: string;
  startTime: number;
  endTime: number;
  dispatchedRobotId?: string;
}

export type RequestRank = 'King' | 'Noble' | 'OldMan';
export interface ClientRequest {
  id: string;
  rank: RequestRank;
  clientName: string;
  description: string;
  requirements: {
    attribute?: Attribute;
    statType?: 'hp' | 'power' | 'defense' | 'agility' | 'dexterity' | 'intelligence';
    minStatValue?: number;
  };
  rewardG: number;
  deadline: number;
}

export interface DeliveredLog {
  id: string;
  name: string;
  deliveredAt: number;
  parts: { head: RobotPart; body: RobotPart; arms: RobotPart; legs: RobotPart; };
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; intelligence: number; };
  battleStats?: {
    matches: number;
    wins: number;
    losses: number;
    draws: number;
  };
}

export interface AutoDispatch {
  id: string;
  robotId: string;
  locationId: string;
  dispatchedAt: number;
  lastCollectedAt: number;
  logs: string[];
  pendingDrops?: string[];
}

export interface ActivePartCraft {
  partType: PartType;
  mainMaterialId: string;
  subMaterialId: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  resultPart: RobotPart;
}

export interface ActiveRobotAssembly {
  startTime: number;
  endTime: number;
  durationMs: number;
  resultRobot: Robot;
}

export interface ActiveRobotDisassembly {
  robotClone: Robot;
  startTime: number;
  endTime: number;
  durationMs: number;
  resultParts: RobotPart[];
}

export interface ActivePartRecycle {
  partClone: RobotPart;
  startTime: number;
  endTime: number;
  durationMs: number;
  resultMaterials: { materialId: string, count: number }[];
}

export interface GameState {
  gold: number;
  fame?: number; // 工房の名声値 (依頼達成や高難度バトル勝利で増加)
  storageSize: number;
  materials: Record<string, number>;
  parts: RobotPart[];
  robots: Robot[];
  unlockedLocations: string[];
  activeQuest: ActiveQuest | null;
  activePartCraft?: ActivePartCraft | null;
  activeRobotAssembly?: ActiveRobotAssembly | null;
  activeRobotDisassembly?: ActiveRobotDisassembly | null;
  activePartRecycle?: ActivePartRecycle | null;
  currentRequest: ClientRequest | null;
  deliveredRobotsCount: number;
  deliveredLogs: DeliveredLog[];
  tutorialStep: number;
  lastRequestGeneratedAt: number;
  availableRequests: ClientRequest[];
  unlockedInteriors: string[];
  currentInterior: string;
  autoDispatches: AutoDispatch[];
  seenTutorials: string[];
  clientAffection?: { King: number; Noble: number; OldMan: number };
  completedRequestDeadlines?: { King?: number; Noble?: number; OldMan?: number };
  repairKits?: number;
  craftedRobots?: Robot[];
  lastDefenseVictoryTime?: number; // 拠点防衛戦の前回防衛成功時刻（ミリ秒）
  battleElements?: number; // バトル演習報酬・エレメント所持数
  combatEquipments?: { beamSaber?: boolean; beamShield?: boolean }; // 交換済み戦闘専用装備
  activeCombatEquipments?: { beamSaber?: boolean; beamShield?: boolean }; // 戦闘出撃時に有効化する装備
  minigameRecords?: Record<string, { plays: number; wins: number; losses: number; draws: number }>;
}

export interface FameRankInfo {
  level: number;
  title: string;
  minFame: number;
  nextFame: number | null;
  desc: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
}

export const FAME_RANKS: FameRankInfo[] = [
  { level: 1, title: '路地裏の無名工房', minFame: 0, nextFame: 50, desc: '町外れでひっそりと営業する小さな修理小屋。', badgeBg: 'bg-stone-100', badgeBorder: 'border-stone-300', textColor: 'text-stone-700' },
  { level: 2, title: '街の評判工房', minFame: 50, nextFame: 150, desc: '近隣住民から信頼され、日常的な依頼が集まる。', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-300', textColor: 'text-emerald-800' },
  { level: 3, title: '地方の有名工房', minFame: 150, nextFame: 350, desc: '近隣の街や旅人たちにも名が知られた実力派工房。', badgeBg: 'bg-sky-50', badgeBorder: 'border-sky-300', textColor: 'text-sky-800' },
  { level: 4, title: '名門メカニック工房', minFame: 350, nextFame: 700, desc: '貴族や名士たちが特注機を求めて訪れる一流工房。', badgeBg: 'bg-purple-50', badgeBorder: 'border-purple-300', textColor: 'text-purple-800' },
  { level: 5, title: '王国御用達工房', minFame: 700, nextFame: 1200, desc: '王室直々の特命依頼を受ける最高峰の工房。', badgeBg: 'bg-amber-100', badgeBorder: 'border-amber-400', textColor: 'text-amber-900' },
  { level: 6, title: '伝説の神話工房', minFame: 1200, nextFame: null, desc: '歴史に名を刻む至高のポンコツロボット工房！', badgeBg: 'bg-gradient-to-r from-amber-100 via-rose-100 to-purple-100', badgeBorder: 'border-amber-500', textColor: 'text-amber-950' },
];

export function getFameRank(fame: number = 0): FameRankInfo {
  let currentRank = FAME_RANKS[0];
  for (const rank of FAME_RANKS) {
    if (fame >= rank.minFame) {
      currentRank = rank;
    }
  }
  return currentRank;
}

