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
  isEquipped?: boolean;
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; intelligence: number; };
  battleStats?: {
    matches: number;
    wins: number;
    losses: number;
    draws: number;
  };
  visualIndex: number;
  mainMaterialId?: string; // master_parts のマスターパーツID
  subMaterialId?: string;  // サブ素材に対応する master_parts のマスターパーツID
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
  othelloEquippedMemories?: string[]; // リバーシ（オセロ）専用装備戦略メモリ (最大3個)
  reversiEquippedMemories?: string[]; // リバーシ戦術メモリ (最大3個)
  createdAt: number;
  value: number;
}

export interface QuestLocation {
  id: string;
  name: string;
  description: string;
  unlockCostG: number;
  baseTimeMs: number;
  requiredFame?: number;
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

// activeテーブルと対となるcompleteテーブル用インターフェース
export interface CompleteQuest {
  locationId: string;
  startTime: number;
  endTime: number;
  dispatchedRobotId?: string;
  completedAt?: number;
  rewardData?: any;
}
export type CompletedQuest = CompleteQuest;

export interface CompletePartCraft {
  partType: PartType;
  mainMaterialId: string;
  subMaterialId: string;
  startTime: number;
  endTime: number;
  durationMs?: number;
  resultPart: RobotPart;
  completedAt?: number;
}
export type CompletedPartCraft = CompletePartCraft;

export interface CompleteRobotAssembly {
  startTime: number;
  endTime: number;
  durationMs?: number;
  resultRobot: Robot;
  completedAt?: number;
}
export type CompletedRobotAssembly = CompleteRobotAssembly;

export interface CompleteRobotDisassembly {
  robotClone: Robot;
  startTime: number;
  endTime: number;
  durationMs?: number;
  resultParts: RobotPart[];
  completedAt?: number;
}
export type CompletedRobotDisassembly = CompleteRobotDisassembly;

export interface CompletePartRecycle {
  partClone: RobotPart;
  startTime: number;
  endTime: number;
  durationMs?: number;
  resultMaterials: { materialId: string, count: number }[];
  completedAt?: number;
}
export type CompletedPartRecycle = CompletePartRecycle;

export interface CompleteClientRequest {
  requestId: string;
  rank: string;
  rewardG: number;
  rewardFame?: number;
  deadline: number;
  deliveredRobotId?: string;
  completedAt?: number;
  requestData?: ClientRequest;
}
export type CompletedClientRequest = CompleteClientRequest;

export interface GameState {
  gold: number;
  fame?: number; // 工房の名声値 (依頼達成や高難度バトル勝利で増加)
  storageSize: number;
  materials: Record<string, number>;
  unopenedChests?: Record<string, number>;
  parts: RobotPart[];
  robots: Robot[];
  unlockedLocations: string[];
  activeQuest: ActiveQuest | null;
  activePartCraft?: ActivePartCraft | null;
  activeRobotAssembly?: ActiveRobotAssembly | null;
  activeRobotDisassembly?: ActiveRobotDisassembly | null;
  activePartRecycle?: ActivePartRecycle | null;

  // activeテーブルと対となるcompleteテーブル（作業完了時に移行）
  completeQuest?: CompleteQuest | null;
  completePartCraft?: CompletePartCraft | null;
  completeRobotAssembly?: CompleteRobotAssembly | null;
  completeRobotDisassembly?: CompleteRobotDisassembly | null;
  completePartRecycle?: CompletePartRecycle | null;
  completeRequest?: CompleteClientRequest | null;

  // 互換性のためのcompleted_*表記
  completedQuest?: CompletedQuest | null;
  completedPartCraft?: CompletedPartCraft | null;
  completedPartCrafts?: CompletePartCraft[];
  completedRobotAssembly?: CompletedRobotAssembly | null;
  completedRobotDisassembly?: CompletedRobotDisassembly | null;
  completedPartRecycle?: CompletedPartRecycle | null;
  completedRequest?: CompletedClientRequest | null;

  currentRequest: ClientRequest | null;
  deliveredRobotsCount: number;
  consumedGold?: number; // 遠征地解放などで消費した累計G
  requestEarnedGold?: number; // 依頼完了で獲得した累計G
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
  combatEquipmentRanks?: { beamSaber?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; beamShield?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' }; // 各戦闘専用装備のランク (Common -> Uncommon -> Rare -> Epic -> Legendary)
  activeCombatEquipments?: { beamSaber?: boolean; beamShield?: boolean }; // 戦闘出撃時に有効化する装備
  minigameRecords?: Record<string, { plays: number; wins: number; losses: number; draws: number; elements?: number; chests?: number }>;
  dailyBattleLimits?: Record<string, any>; // { [date]: string[] } または { [robotId]: { [categoryId]: { [level]: boolean } } }
  minigameDashboardMode?: 'detailed' | 'compact'; // ミニゲーム演習録ダッシュボードの表示モード
  othelloPurchasedMemories?: string[]; // 購入済みのリバーシ（オセロ）戦略メモリID一覧
  othelloEquippedMemories?: string[]; // 装備中のリバーシ（オセロ）戦略メモリID一覧 (最大3個)
  reversiPurchasedMemories?: string[]; // 購入済みのリバーシ戦術メモリID一覧 (user_item.reversi_item 同期)
  reversiEquippedMemories?: string[]; // 装備中のリバーシ戦術メモリID一覧 (user_item.reversi_item 同期)
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
  { level: 2, title: '街の駆け出し工房', minFame: 50, nextFame: 120, desc: '近所の頼まれごとを引き受け始めた見習い工房。', badgeBg: 'bg-lime-50', badgeBorder: 'border-lime-300', textColor: 'text-lime-800' },
  { level: 3, title: '街の評判工房', minFame: 120, nextFame: 220, desc: '近隣住民から信頼され、日常的な依頼が集まる。', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-300', textColor: 'text-emerald-800' },
  { level: 4, title: '街道の新進工房', minFame: 220, nextFame: 350, desc: '隊商や行商人たちの間でも噂が広まりつつある新鋭。', badgeBg: 'bg-teal-50', badgeBorder: 'border-teal-300', textColor: 'text-teal-800' },
  { level: 5, title: '地方の有名工房', minFame: 350, nextFame: 520, desc: '近隣の街や旅人たちにも名が知られた実力派工房。', badgeBg: 'bg-cyan-50', badgeBorder: 'border-cyan-300', textColor: 'text-cyan-800' },
  { level: 6, title: '都市の公認工房', minFame: 520, nextFame: 750, desc: '都市ギルドから確かな技術を公認された中堅工房。', badgeBg: 'bg-sky-50', badgeBorder: 'border-sky-300', textColor: 'text-sky-800' },
  { level: 7, title: '名門メカニック工房', minFame: 750, nextFame: 1050, desc: '貴族や名士たちが特注機を求めて訪れる一流工房。', badgeBg: 'bg-blue-50', badgeBorder: 'border-blue-300', textColor: 'text-blue-800' },
  { level: 8, title: '王国屈指の特級工房', minFame: 1050, nextFame: 1450, desc: '国中の凄腕技師たちが一目置く、確固たる権威。', badgeBg: 'bg-indigo-50', badgeBorder: 'border-indigo-300', textColor: 'text-indigo-800' },
  { level: 9, title: '王国御用達工房', minFame: 1450, nextFame: 1950, desc: '王室直々の特命依頼を受ける最高峰の工房。', badgeBg: 'bg-purple-50', badgeBorder: 'border-purple-300', textColor: 'text-purple-800' },
  { level: 10, title: '宮廷筆頭マイスター工房', minFame: 1950, nextFame: 2600, desc: '国家防衛の要となるロボット開発を担う最高名誉。', badgeBg: 'bg-fuchsia-50', badgeBorder: 'border-fuchsia-300', textColor: 'text-fuchsia-900' },
  { level: 11, title: '大陸随一の巨匠工房', minFame: 2600, nextFame: 3400, desc: '国境を越え、大陸全土にその名が轟く至高の工房。', badgeBg: 'bg-rose-50', badgeBorder: 'border-rose-300', textColor: 'text-rose-900' },
  { level: 12, title: '古代叡智を継ぐ神工匠', minFame: 3400, nextFame: 4400, desc: '失われた超古代文明の機巧テクノロジーを再現する境地。', badgeBg: 'bg-gradient-to-r from-amber-100 to-emerald-100', badgeBorder: 'border-teal-400', textColor: 'text-teal-950' },
  { level: 13, title: '星辰を創る奇跡の工房', minFame: 4400, nextFame: 5800, desc: '鋼鉄に魂を吹き込み、奇跡を紡ぐ伝説の領域。', badgeBg: 'bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100', badgeBorder: 'border-purple-400', textColor: 'text-purple-950' },
  { level: 14, title: '伝説の神話工房', minFame: 5800, nextFame: null, desc: '歴史に名を刻む至高のポンコツロボット工房！', badgeBg: 'bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200', badgeBorder: 'border-amber-500', textColor: 'text-amber-950' },
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

