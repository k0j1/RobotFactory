import { GameState, Robot, ClientRequest, Attribute, RequestRank } from './models';
import { MATERIALS, LOCATIONS } from './data';
import { AttributeColors } from './models';

const INITIAL_STATE: GameState = {
  gold: 0,
  storageSize: 5,
  materials: {},
  robots: [],
  unlockedLocations: ['loc1'],
  activeQuest: null,
  currentRequest: null,
  deliveredRobotsCount: 0,
  deliveredLogs: [],
  tutorialStep: 0,
  lastRequestGeneratedAt: 0,
  availableRequests: [],
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
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
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
        if (loc.name.includes('火') && robot.attribute === 'Water') successRate = 1.0;
        else if (loc.name.includes('水') && robot.attribute === 'Earth') successRate = 1.0;
        else if (loc.name.includes('風') && robot.attribute === 'Fire') successRate = 1.0;
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
  public craftRobot(materialIds: string[]) {
    if (this.state.robots.length >= this.state.storageSize) {
      throw new Error("倉庫がいっぱいです");
    }

    // consume materials
    for (const id of materialIds) {
      if (!this.state.materials[id] || this.state.materials[id] <= 0) {
        throw new Error("素材が足りません");
      }
    }
    for (const id of materialIds) {
      this.state.materials[id] -= 1;
    }

    const mats = materialIds.map(id => MATERIALS.find(m => m.id === id)!).filter(Boolean);
    if (mats.length === 0) throw new Error("不正な素材");

    // determine stats
    let totalHp = 0, totalPow = 0, totalDef = 0, totalAgi = 0, totalDex = 0;
    let mainAttr: Attribute = mats[0].attribute; // simplified

    mats.forEach(m => {
      totalHp += m.baseStats.hp + Math.floor(Math.random() * 5);
      totalPow += m.baseStats.power + Math.floor(Math.random() * 5);
      totalDef += m.baseStats.defense + Math.floor(Math.random() * 5);
      totalAgi += m.baseStats.agility + Math.floor(Math.random() * 5);
      totalDex += m.baseStats.dexterity + Math.floor(Math.random() * 5);
    });

    const maxRarity = Math.max(...mats.map(m => m.rarity));

    const newRobot: Robot = {
      id: 'rob_' + Date.now() + Math.floor(Math.random()*1000),
      name: `ポンコツ-${Math.floor(Math.random()*9000)+1000}`,
      attribute: mainAttr,
      stats: {
        hp: totalHp, power: totalPow, defense: totalDef, agility: totalAgi, dexterity: totalDex
      },
      visuals: {
        head: Math.floor(Math.random() * (maxRarity * 8)),
        body: Math.floor(Math.random() * (maxRarity * 8)),
        arms: Math.floor(Math.random() * (maxRarity * 8)),
        legs: Math.floor(Math.random() * (maxRarity * 8)),
        color: AttributeColors[mainAttr]
      },
      createdAt: Date.now(),
      value: mats.reduce((sum, m) => sum + m.price, 0) * 2
    };

    this.state.robots.push(newRobot);
    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return newRobot;
  }

  // Requests
  public generateRequestsIfNeeded() {
    const now = Date.now();
    // Generate new requests if none or if time passed (e.g. 5 mins)
    if (this.state.availableRequests.length === 0 || now - this.state.lastRequestGeneratedAt > 300000) {
      this.state.availableRequests = [
        this.createRandomRequest('King'),
        this.createRandomRequest('Noble'),
        this.createRandomRequest('OldMan'),
      ];
      this.state.lastRequestGeneratedAt = now;
      this.saveState();
    }
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
        deadline: Date.now() + 8 * 60 * 60 * 1000 // 8 hours
      };
    } else if (rank === 'Noble') {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: '貴族',
        description: `${attrLabels[randAttr]}属性で、${statLabels[randStat]}が30以上のロボを納品せよ`,
        requirements: { attribute: randAttr, statType: randStat, minStatValue: 30 },
        rewardG: 300,
        deadline: Date.now() + 12 * 60 * 60 * 1000
      };
    } else {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: 'おじさん',
        description: `属性なんでも良いから、${statLabels[randStat]}が10以上のロボを頼む`,
        requirements: { statType: randStat, minStatValue: 10 },
        rewardG: 100,
        deadline: Date.now() + 24 * 60 * 60 * 1000
      };
    }
  }

  public acceptRequest(reqId: string) {
    const req = this.state.availableRequests.find(r => r.id === reqId);
    if (!req) return;
    this.state.currentRequest = req;
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
    if (req.requirements.attribute && robot.attribute !== req.requirements.attribute) {
      throw new Error("属性が条件を満たしていません");
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
      attribute: robot.attribute,
      deliveredAt: Date.now(),
      stats: { ...robot.stats },
      visuals: { ...robot.visuals }
    });
    this.state.robots.splice(robotIdx, 1);
    this.state.deliveredRobotsCount += 1;
    this.state.currentRequest = null;
    if (this.state.tutorialStep === 4) this.advanceTutorial();
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
}
