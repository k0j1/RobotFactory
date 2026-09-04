import { Robot } from '../../../core/models';
import { Opponent } from '../Shared';

export interface CombatBuff {
  id: string;
  name: string;
  desc: string;
  icon: string;
  durationSeconds: number;
  powMult?: number;
  defMult?: number;
  agiMult?: number;
  dodgeBonus?: number;
  damageReductionMult?: number; // 例: 0.5 で被ダメージ50%カット
}

export type SkillCategory = 'attack' | 'rush' | 'snipe' | 'shield' | 'repair' | 'emp' | 'overdrive';

export interface SkillResult {
  damage: number;
  isDodge: boolean;
  isCritical: boolean;
  hitsCount?: number;
  healAmount?: number;
  apGain?: number;
  targetApReduction?: number;
  selfBuff?: CombatBuff;
  targetDebuff?: CombatBuff;
  specialLog?: string;
}

export interface SkillDef {
  id: string;
  name: string;
  desc: string;
  shortDesc: string;
  category: SkillCategory;
  reqInt: number;
  reqStat?: {
    stat: 'power' | 'defense' | 'agility' | 'dexterity' | 'hp';
    name: string;
    value: number;
  };
  baseLearnChance: number; // 閃き基本確率 (%)
  cooldownSeconds: number; // 使用後クールダウン (秒)
  iconName: string;
  badgeColor: string;
  // 技発動関数
  execute: (attacker: CombatFighter, defender: CombatFighter) => SkillResult;
}

export interface CombatFighter {
  id: string;
  name: string;
  isPlayer: boolean;
  robotRef?: Robot;
  opponentRef?: Opponent;

  // 基本ステータス
  vitality: number; // stats.hp
  power: number;
  defense: number;
  agility: number;
  dexterity: number;
  intelligence: number;

  // 戦闘動態ステータス
  maxDurability: number; // vitality * 1000
  currentDurability: number;
  actionPoints: number; // 0〜1000
  
  // 習得済み技
  learnedSkills: SkillDef[];
  // クールダウン残り秒数
  cooldowns: Record<string, number>;
  // 付与中のバフ・デバフ
  activeBuffs: CombatBuff[];

  // 累計統計
  damageDealt: number;
  damageTaken: number;
  attacksCount: number;
  dodgesCount: number;
  skillsTriggeredCount: number;
  skillsLearnedCount: number;
}

export type CombatLogType = 'normal_attack' | 'skill_attack' | 'learn_skill' | 'dodge' | 'heal' | 'buff' | 'emp' | 'ko';

export interface CombatLogItem {
  id: string;
  timestamp: number;
  type: CombatLogType;
  actorId: string;
  actorName: string;
  isPlayer: boolean;
  targetName?: string;
  skillName?: string;
  damage?: number;
  heal?: number;
  message: string;
}

export interface CombatPopup {
  id: string;
  targetId: string;
  value: string;
  type: 'damage' | 'critical' | 'dodge' | 'heal' | 'learn' | 'buff';
  createdAt: number;
}

export interface CombatActionEvent {
  id: number;
  attackerId: string;
  defenderId: string;
  type: 'attack' | 'skill';
  skill?: SkillDef;
  skillName?: string;
  isDodge: boolean;
  damage: number;
  isCritical: boolean;
  isHeal: boolean;
  healAmount?: number;
  timestamp: number;
}

