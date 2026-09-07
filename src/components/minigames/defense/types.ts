import { Robot } from '../../../core/models';

export type TileType = 'wall' | 'floor' | 'spawn' | 'base' | 'tower_spot';

export interface GridTile {
  x: number; // grid x (0 to 15)
  y: number; // grid y (0 to 11)
  type: TileType;
  iconName: string;
  variant: number;
  towerIndex?: number;
  texture?: string;
  rotation?: number; // deg (0, 90, 180, 270)
}

export interface Point {
  x: number;
  y: number;
}

export interface DungeonMap {
  width: number;       // columns (16)
  height: number;      // rows (12)
  cellSize: number;    // px (50)
  tiles: GridTile[][];
  pathPoints: Point[]; // pixel coordinates for enemies to walk
  towerPositions: Point[]; // pixel coordinates for towers
}

export type EnemyType = 
  | 'scout' 
  | 'sprinter' 
  | 'crawler' 
  | 'walker' 
  | 'golem' 
  | 'mini_boss' 
  | 'mid_boss' 
  | 'large_boss' 
  | 'giant_boss' 
  | 'super_giant_boss';

export interface Enemy {
  id: number;
  type: EnemyType;
  name: string;
  iconName: string;
  sprite?: string;
  colorClass: string;
  hp: number;
  maxHp: number;
  speed: number; // px / sec
  size: number;
  pathIndex: number;
  x: number;
  y: number;
  laneOffset: number;
  bobPhase: number;
  isHit: boolean;
  facingLeft: boolean;
  stuckTimer?: number;
}

export interface Tower {
  id: string;
  robot: Robot;
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  range: number;
  damage: number;
  cooldown: number;
  maxCooldown: number;
  attackAnim: number; // timer for recoil/muzzle effect
  targetPos: Point | null;
  totalKills: number;
  // IntとDex及び他能力値によって決定される技
  skillName: string;
  skillType: 'bullet' | 'plasma' | 'gatling' | 'multilock' | 'laser' | 'nova';
  skillMultiplier: number;
  splashRadius: number;
  bulletSpeed: number;
  bulletColor: string;
}

export interface Projectile {
  id: number;
  towerId?: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetId: number;
  damage: number;
  speed: number;
  color: string;
  splashRadius: number;
  type?: 'bullet' | 'plasma' | 'laser' | 'nova';
}

export interface HitParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
}
