import { GameState, Robot, ClientRequest, Attribute, RequestRank, RobotPart, PartType, AttributeNames } from './models';
import { MATERIALS, LOCATIONS } from './data';
import { AttributeColors } from './models';

const INITIAL_STATE: GameState = {
  gold: 0,
  storageSize: 5,
  materials: {},
  parts: [],
  robots: [],
  unlockedLocations: ['loc1'],
  activeQuest: null,
  currentRequest: null,
  deliveredRobotsCount: 0,
  deliveredLogs: [],
  tutorialStep: 0,
  lastRequestGeneratedAt: 0,
  availableRequests: [],
  unlockedInteriors: ['default'],
  currentInterior: 'default',
};

const STORAGE_KEY = 'ponkotsu_robot_save';

export class GameEngine {
  private state: GameState;
  private onStateChange: (state: GameState) => void;

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.state = this.loadState();
  }

  private loadState(): GameState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migrate old robots to new parts format
        if (parsed.robots) {
          parsed.robots.forEach((r: any) => {
            if (!r.parts && r.visuals) {
              r.parts = {
                head: { id: '', type: 'head', name: '旧ヘッド', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: r.visuals.head },
                body: { id: '', type: 'body', name: '旧ボディ', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: r.visuals.body },
                arms: { id: '', type: 'arms', name: '旧アーム', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: r.visuals.arms },
                legs: { id: '', type: 'legs', name: '旧レッグ', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: r.visuals.legs }
              };
            }
          });
        }

        // Migrate old deliveredLogs to new parts format
        if (parsed.deliveredLogs) {
          parsed.deliveredLogs.forEach((l: any) => {
            if (!l.parts && l.visuals) {
              l.parts = {
                head: { id: '', type: 'head', name: '旧ヘッド', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: l.visuals.head },
                body: { id: '', type: 'body', name: '旧ボディ', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: l.visuals.body },
                arms: { id: '', type: 'arms', name: '旧アーム', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: l.visuals.arms },
                legs: { id: '', type: 'legs', name: '旧レッグ', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0}, visualIndex: l.visuals.legs }
              };
            }
          });
        }

        // Ensure parts array exists
        if (!parsed.parts) {
          parsed.parts = [];
        }

        return { ...INITIAL_STATE, ...parsed };
      } catch (e) {
        return { ...INITIAL_STATE };
      }
    }
    return { ...INITIAL_STATE };
  }

  private saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.onStateChange(JSON.parse(JSON.stringify(this.state)));
  }

  public getState() {
    return this.state;
  }

  public forceSave() {
    this.saveState();
  }

  // Tutorial
  public advanceTutorial() {
    this.state.tutorialStep += 1;
    this.saveState();
  }

  // Quest
  public startQuest(locationId: string, robotId?: string) {
    if (this.state.activeQuest) return;
    const loc = LOCATIONS.find(l => l.id === locationId);
    if (!loc) return;

    this.state.activeQuest = {
      locationId,
      startTime: Date.now(),
      endTime: Date.now() + loc.baseTimeMs,
      dispatchedRobotId: robotId
    };
    if (this.state.tutorialStep === 0) this.advanceTutorial();
    this.saveState();
  }

  public completeQuest() {
    if (!this.state.activeQuest) return null;
    if (Date.now() < this.state.activeQuest.endTime) return null;

    const loc = LOCATIONS.find(l => l.id === this.state.activeQuest!.locationId);
    if (!loc) return null;

    // Check success rate based on dispatched robot
    let successRate = 0.5; // Base 50% without robot
    if (this.state.activeQuest.dispatchedRobotId) {
      const robot = this.state.robots.find(r => r.id === this.state.activeQuest!.dispatchedRobotId);
      if (robot) {
        successRate = 0.8; // 80% with any robot
        // Attribute affinity
        const robotAttrs = [robot.parts.head.attribute, robot.parts.body.attribute, robot.parts.arms.attribute, robot.parts.legs.attribute];
        if (loc.name.includes('火') && robotAttrs.includes('Water')) successRate = 1.0;
        else if (loc.name.includes('水') && robotAttrs.includes('Earth')) successRate = 1.0;
        else if (loc.name.includes('風') && robotAttrs.includes('Fire')) successRate = 1.0;
        // Simple heuristic for now
        if (robot.stats.power > 30 || robot.stats.agility > 30) successRate += 0.1;
      }
    }

    const isSuccess = Math.random() < successRate;
    const obtained: string[] = [];

    if (isSuccess) {
      const dropCount = Math.floor(Math.random() * 3) + 1 + (this.state.activeQuest.dispatchedRobotId ? 1 : 0);
      for (let i = 0; i < dropCount; i++) {
        const dropId = loc.drops[Math.floor(Math.random() * loc.drops.length)];
        obtained.push(dropId);
        this.state.materials[dropId] = (this.state.materials[dropId] || 0) + 1;
      }
    }

    this.state.activeQuest = null;
    if (this.state.tutorialStep === 1) this.advanceTutorial();
    this.saveState();
    return { success: isSuccess, drops: obtained };
  }

  // Crafting
  public craftPart(type: PartType, materialId: string) {
    if (!this.state.materials[materialId] || this.state.materials[materialId] <= 0) {
      throw new Error("素材が足りません");
    }
    
    this.state.materials[materialId] -= 1;
    
    const mat = MATERIALS.find(m => m.id === materialId);
    if (!mat) throw new Error("不明な素材");

    const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };
    const name = `${mat.name}の${typeNames[type]}`;

    const newPart: RobotPart = {
      id: `part_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      type,
      name,
      attribute: mat.attribute,
      rarity: mat.rarity,
      stats: {
        hp: mat.baseStats.hp + Math.floor(Math.random() * 5),
        power: mat.baseStats.power + Math.floor(Math.random() * 5),
        defense: mat.baseStats.defense + Math.floor(Math.random() * 5),
        agility: mat.baseStats.agility + Math.floor(Math.random() * 5),
        dexterity: mat.baseStats.dexterity + Math.floor(Math.random() * 5),
      },
      visualIndex: Math.floor(Math.random() * 24),
    };
    
    this.state.parts.push(newPart);
    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return newPart;
  }

  public assembleRobot(headId: string, bodyId: string, armsId: string, legsId: string) {
    if (this.state.robots.length >= this.state.storageSize) {
      throw new Error("倉庫がいっぱいです");
    }

    const head = this.state.parts.find(p => p.id === headId && p.type === 'head');
    const body = this.state.parts.find(p => p.id === bodyId && p.type === 'body');
    const arms = this.state.parts.find(p => p.id === armsId && p.type === 'arms');
    const legs = this.state.parts.find(p => p.id === legsId && p.type === 'legs');

    if (!head || !body || !arms || !legs) throw new Error("パーツが不足しています");

    // remove parts from inventory
    this.state.parts = this.state.parts.filter(p => ![headId, bodyId, armsId, legsId].includes(p.id));

    const totalHp = head.stats.hp + body.stats.hp + arms.stats.hp + legs.stats.hp;
    const totalPow = head.stats.power + body.stats.power + arms.stats.power + legs.stats.power;
    const totalDef = head.stats.defense + body.stats.defense + arms.stats.defense + legs.stats.defense;
    const totalAgi = head.stats.agility + body.stats.agility + arms.stats.agility + legs.stats.agility;
    const totalDex = head.stats.dexterity + body.stats.dexterity + arms.stats.dexterity + legs.stats.dexterity;

    const prefix1 = ['野生の', '古代の', '謎の', '伝説の', '鋼鉄の', '真紅の', '漆黒の', '錆びた', '光る', '怒れる', '眠れる', '小さな', '巨大な', '忘れられた', '名無しの'];
    const prefix2 = ['繊細な', '凶暴な', '勇敢な', '臆病な', '賢い', '鈍い', '素早い', '硬い', '柔らかい', '冷たい', '熱い', '美しい', '醜い', '奇妙な', '完璧な'];
    const nouns = ['ポピー', 'ゴーレム', '巨人', '兵士', '騎士', '番人', '破壊者', '守護者', '従者', '王', '悪魔', '天使', '獣', '機械', '塊'];
    const randomName = `${prefix1[Math.floor(Math.random() * prefix1.length)]}${prefix2[Math.floor(Math.random() * prefix2.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;

    const newRobot: Robot = {
      id: 'rob_' + Date.now() + Math.floor(Math.random()*1000),
      name: randomName,
      parts: { head, body, arms, legs },
      stats: {
        hp: totalHp, power: totalPow, defense: totalDef, agility: totalAgi, dexterity: totalDex
      },
      createdAt: Date.now(),
      value: (head.rarity + body.rarity + arms.rarity + legs.rarity) * 20
    };

    this.state.robots.push(newRobot);
    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return newRobot;
  }

  public update() {
    const now = Date.now();
    let changed = false;

    // Check available requests expiration (switch board every 1 day)
    if (this.state.availableRequests.length > 0 && now - this.state.lastRequestGeneratedAt > 24 * 60 * 60 * 1000) {
      this.state.availableRequests = [];
      changed = true;
    }

    // Check active request time limit
    if (this.state.currentRequest && now > this.state.currentRequest.deadline) {
      this.state.currentRequest = null;
      changed = true;
    }

    if (this.state.availableRequests.length === 0 && !this.state.currentRequest) {
      this.state.availableRequests = [
        this.createRandomRequest('King'),
        this.createRandomRequest('Noble'),
        this.createRandomRequest('OldMan'),
      ];
      this.state.lastRequestGeneratedAt = now;
      changed = true;
    }

    if (changed) {
      this.saveState();
    }
  }

  // Requests
  public generateRequestsIfNeeded() {
    this.update();
  }

  private createRandomRequest(rank: RequestRank): ClientRequest {
    const stats = ['hp', 'power', 'defense', 'agility', 'dexterity'] as const;
    const statLabels: Record<string, string> = { hp: '体力', power: 'パワー', defense: 'ディフェンス', agility: 'アジリティ', dexterity: '器用さ' };
    const randStat = stats[Math.floor(Math.random() * stats.length)];
    const attrs: Attribute[] = ['Fire', 'Water', 'Wind', 'Earth', 'Light', 'Dark'];
    const attrLabels: Record<string, string> = { Fire: '火', Water: '水', Wind: '風', Earth: '土', Light: '光', Dark: '闇' };
    const randAttr = attrs[Math.floor(Math.random() * attrs.length)];

    if (rank === 'King') {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: '王様',
        description: `${attrLabels[randAttr]}属性で、${statLabels[randStat]}が50以上のロボを納品せよ`,
        requirements: { attribute: randAttr, statType: randStat, minStatValue: 50 },
        rewardG: 500,
        deadline: Date.now() + 24 * 60 * 60 * 1000 // 1 day
      };
    } else if (rank === 'Noble') {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: '貴族',
        description: `${attrLabels[randAttr]}属性で、${statLabels[randStat]}が30以上のロボを納品せよ`,
        requirements: { attribute: randAttr, statType: randStat, minStatValue: 30 },
        rewardG: 300,
        deadline: Date.now() + 24 * 60 * 60 * 1000 // 1 day
      };
    } else {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: 'おじさん',
        description: `属性なんでも良いから、${statLabels[randStat]}が10以上のロボを頼む`,
        requirements: { statType: randStat, minStatValue: 10 },
        rewardG: 100,
        deadline: Date.now() + 24 * 60 * 60 * 1000 // 1 day
      };
    }
  }

  public acceptRequest(reqId: string) {
    const req = this.state.availableRequests.find(r => r.id === reqId);
    if (!req) return;
    this.state.currentRequest = req;
    // Set time limit for accepted request (1~3 days)
    const days = Math.floor(Math.random() * 3) + 1;
    this.state.currentRequest.deadline = Date.now() + days * 24 * 60 * 60 * 1000;
    this.state.availableRequests = []; // Clear others
    if (this.state.tutorialStep === 3) this.advanceTutorial();
    this.saveState();
  }

  public cancelRequest() {
    this.state.currentRequest = null;
    this.generateRequestsIfNeeded();
    this.saveState();
  }

  public deliverRobot(robotId: string) {
    if (!this.state.currentRequest) throw new Error("依頼を受けていません");
    const req = this.state.currentRequest;
    const robotIdx = this.state.robots.findIndex(r => r.id === robotId);
    if (robotIdx === -1) throw new Error("ロボットが見つかりません");
    const robot = this.state.robots[robotIdx];

    // Validate
    if (req.requirements.attribute) {
      const robotAttrs = [robot.parts.head.attribute, robot.parts.body.attribute, robot.parts.arms.attribute, robot.parts.legs.attribute];
      if (!robotAttrs.includes(req.requirements.attribute)) {
        throw new Error(`属性が${AttributeNames[req.requirements.attribute]}のパーツを含める必要があります`);
      }
    }
    if (req.requirements.statType && req.requirements.minStatValue) {
      if (robot.stats[req.requirements.statType] < req.requirements.minStatValue) {
        throw new Error("ステータスが条件を満たしていません");
      }
    }

    // Success
    this.state.gold += req.rewardG;
    this.state.deliveredLogs.push({
      id: robot.id,
      name: robot.name,
      deliveredAt: Date.now(),
      stats: { ...robot.stats },
      parts: { ...robot.parts }
    });
    this.state.robots.splice(robotIdx, 1);
    this.state.deliveredRobotsCount += 1;
    this.state.currentRequest = null;
    if (this.state.tutorialStep === 4) this.advanceTutorial();
    this.generateRequestsIfNeeded(); // Instantly replenish the board
    this.saveState();
  }

  // Shop
  public buyMaterial(materialId: string) {
    const mat = MATERIALS.find(m => m.id === materialId);
    if (!mat) return;
    if (this.state.gold < mat.price) throw new Error("Gが足りません");
    
    this.state.gold -= mat.price;
    this.state.materials[materialId] = (this.state.materials[materialId] || 0) + 1;
    this.saveState();
  }

  public unlockLocation(locationId: string) {
    const loc = LOCATIONS.find(l => l.id === locationId);
    if (!loc) return;
    if (this.state.unlockedLocations.includes(locationId)) return;
    if (this.state.gold < loc.unlockCostG) throw new Error("Gが足りません");

    this.state.gold -= loc.unlockCostG;
    this.state.unlockedLocations.push(locationId);
    this.saveState();
  }

  public upgradeStorage(cost: number, newSize: number) {
    if (this.state.gold < cost) throw new Error("Gが足りません");
    this.state.gold -= cost;
    this.state.storageSize = newSize;
    this.saveState();
  }

  public sellRobot(robotId: string) {
    const idx = this.state.robots.findIndex(r => r.id === robotId);
    if (idx === -1) return;
    const robot = this.state.robots[idx];
    this.state.gold += robot.value;
    this.state.robots.splice(idx, 1);
    this.saveState();
  }

  public scrapRobot(robotId: string) {
    const idx = this.state.robots.findIndex(r => r.id === robotId);
    if (idx === -1) return;
    const drops = ['m1', 'm2', 'm3'];
    const count = Math.floor(Math.random() * 2) + 1;
    for(let i=0; i<count; i++){
       const d = drops[Math.floor(Math.random() * drops.length)];
       this.state.materials[d] = (this.state.materials[d] || 0) + 1;
    }
    this.state.robots.splice(idx, 1);
    this.saveState();
  }

  public buyInterior(interior: import('./interiors').Interior) {
    if (this.state.unlockedInteriors.includes(interior.id)) return;
    
    // Check cost
    for (const costItem of interior.cost) {
      const currentAmount = this.state.materials[costItem.materialId] || 0;
      if (currentAmount < costItem.amount) {
        throw new Error("素材が足りません");
      }
    }

    // Deduct cost
    for (const costItem of interior.cost) {
      this.state.materials[costItem.materialId] -= costItem.amount;
    }

    this.state.unlockedInteriors.push(interior.id);
    this.state.currentInterior = interior.id;
    this.saveState();
  }

  public setInterior(interiorId: string) {
    if (this.state.unlockedInteriors.includes(interiorId)) {
      this.state.currentInterior = interiorId;
      this.saveState();
    }
  }
}

