export type Attribute = 'Fire' | 'Water' | 'Wind' | 'Earth' | 'Light' | 'Dark';
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
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; };
  visualIndex: number;
}

export interface Material {
  id: string;
  name: string;
  attribute: Attribute;
  rarity: 1 | 2 | 3;
  price: number;
  baseStats: { hp: number; power: number; defense: number; agility: number; dexterity: number; };
}

export interface Robot {
  id: string;
  name: string;
  parts: { head: RobotPart; body: RobotPart; arms: RobotPart; legs: RobotPart; };
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; };
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
    statType?: 'hp' | 'power' | 'defense' | 'agility' | 'dexterity';
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
  stats: { hp: number; power: number; defense: number; agility: number; dexterity: number; };
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

export interface GameState {
  gold: number;
  storageSize: number;
  materials: Record<string, number>;
  parts: RobotPart[];
  robots: Robot[];
  unlockedLocations: string[];
  activeQuest: ActiveQuest | null;
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
}
