import { GameState, Robot, ClientRequest, Attribute, RequestRank, RobotPart, PartType, AttributeNames } from './models';
import { MATERIALS, LOCATIONS, getMaterialCraftableVisuals } from './data';
import { AttributeColors } from './models';

const INITIAL_STATE: GameState = {
  gold: 0,
  storageSize: 5,
  materials: {},
  parts: [],
  robots: [],
  unlockedLocations: ['loc1'],
  activeQuest: null,
  activePartCraft: null,
  activeRobotAssembly: null,
  currentRequest: null,
  deliveredRobotsCount: 0,
  deliveredLogs: [],
  tutorialStep: 0,
  lastRequestGeneratedAt: 0,
  availableRequests: [],
  unlockedInteriors: ['default'],
  currentInterior: 'default',
  autoDispatches: [],
  seenTutorials: [],
  clientAffection: { King: 1, Noble: 1, OldMan: 1 },
  completedRequestDeadlines: {},
};

const STORAGE_KEY = 'ponkotsu_robot_save';

export class GameEngine {
  private state: GameState;
  private onStateChange: (state: GameState) => void;

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.state = this.loadState();
    this.update();
  }

  private loadState(): GameState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migrate old robots to new parts format
        if (parsed.robots) {
          parsed.robots.forEach((r: any) => {
            
            if (r.stats && r.stats.intelligence === undefined) {
              r.stats.intelligence = 1;
              if (r.parts) {
                if (r.parts.head) r.parts.head.stats.intelligence = 1;
                if (r.parts.body) r.parts.body.stats.intelligence = 1;
                if (r.parts.arms) r.parts.arms.stats.intelligence = 1;
                if (r.parts.legs) r.parts.legs.stats.intelligence = 1;
              }
            }
            if (!r.parts && r.visuals) {
              r.parts = {
                head: { id: '', type: 'head', name: '旧ヘッド', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: r.visuals.head },
                body: { id: '', type: 'body', name: '旧ボディ', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: r.visuals.body },
                arms: { id: '', type: 'arms', name: '旧アーム', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: r.visuals.arms },
                legs: { id: '', type: 'legs', name: '旧レッグ', attribute: r.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: r.visuals.legs }
              };
            }
          });
        }

        // Migrate old deliveredLogs to new parts format
        if (!parsed.seenTutorials) { parsed.seenTutorials = []; }
        if (!parsed.autoDispatches) {
          parsed.autoDispatches = [];
        }
        
        if (parsed.deliveredLogs) {
          parsed.deliveredLogs.forEach((l: any) => {
            
            if (l.stats && l.stats.intelligence === undefined) {
              l.stats.intelligence = 1;
            }
            if (!l.parts && l.visuals) {
              l.parts = {
                head: { id: '', type: 'head', name: '旧ヘッド', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: l.visuals.head },
                body: { id: '', type: 'body', name: '旧ボディ', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: l.visuals.body },
                arms: { id: '', type: 'arms', name: '旧アーム', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: l.visuals.arms },
                legs: { id: '', type: 'legs', name: '旧レッグ', attribute: l.attribute, rarity: 1, stats: {hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1}, visualIndex: l.visuals.legs }
              };
            }
          });
        }

        // Ensure parts array exists
        if (!parsed.clientAffection) { parsed.clientAffection = { King: 1, Noble: 1, OldMan: 1 }; }
        if (!parsed.completedRequestDeadlines) { parsed.completedRequestDeadlines = {}; }
        
        if (parsed.parts) {
          parsed.parts.forEach(p => {
            if (p.stats && p.stats.intelligence === undefined) {
              p.stats.intelligence = 1;
            }
          });
        }
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

  
  public isRobotAutoDispatched(robotId: string): boolean {
    return this.state.autoDispatches.some(d => d.robotId === robotId);
  }

  public startAutoDispatch(robotId: string, locationId: string) {
    if (this.isRobotAutoDispatched(robotId)) throw new Error("このロボットは既に派遣中です");
    if (this.state.activeQuest && this.state.activeQuest.dispatchedRobotId === robotId) throw new Error("このロボットは遠征中です");
    
    const robot = this.state.robots.find(r => r.id === robotId);
    if (!robot) throw new Error("ロボットが見つかりません");
    if ((robot.currentHp ?? 10) <= 1) throw new Error("HPが足りません（残り1以下のため派遣不可）");

    this.state.autoDispatches.push({
      id: Math.random().toString(36).substring(2, 9),
      robotId,
      locationId,
      dispatchedAt: Date.now(),
      lastCollectedAt: Date.now(),
      logs: [],
      pendingDrops: []
    });
    this.saveState();
  }

  public cancelAutoDispatch(dispatchId: string): { drops: string[]; robotName: string; locationName: string } | null {
    const idx = this.state.autoDispatches.findIndex(d => d.id === dispatchId);
    if (idx !== -1) {
      const d = this.state.autoDispatches[idx];
      const collectedDrops: string[] = [];
      // Collect any pending drops before leaving so items are not lost
      if (d.pendingDrops && d.pendingDrops.length > 0) {
        for (const dropId of d.pendingDrops) {
          this.state.materials[dropId] = (this.state.materials[dropId] || 0) + 1;
          collectedDrops.push(dropId);
        }
      }
      const robot = this.state.robots.find(r => r.id === d.robotId);
      const loc = LOCATIONS.find(l => l.id === d.locationId);
      this.state.autoDispatches.splice(idx, 1);
      this.saveState();
      return {
        drops: collectedDrops,
        robotName: robot?.name || 'ロボット',
        locationName: loc?.name || '探索地'
      };
    }
    return null;
  }

  public claimAutoDispatch(dispatchId: string): { drops: string[]; robotName: string; locationName: string } {
    const dispatch = this.state.autoDispatches.find(d => d.id === dispatchId);
    if (!dispatch) {
      throw new Error("自動探索が見つかりません");
    }

    if (!dispatch.pendingDrops || dispatch.pendingDrops.length === 0) {
      throw new Error("回収できる素材がありません");
    }

    const drops = [...dispatch.pendingDrops];
    for (const dropId of drops) {
      this.state.materials[dropId] = (this.state.materials[dropId] || 0) + 1;
    }

    dispatch.pendingDrops = [];
    dispatch.logs.push(`素材${drops.length}個を回収して工房の倉庫に格納しました。`);
    if (dispatch.logs.length > 5) dispatch.logs.shift();

    const robot = this.state.robots.find(r => r.id === dispatch.robotId);
    const loc = LOCATIONS.find(l => l.id === dispatch.locationId);

    this.saveState();
    return {
      drops,
      robotName: robot?.name || 'ロボット',
      locationName: loc?.name || '探索地'
    };
  }

  public claimAllAutoDispatches(): { drops: string[] } {
    const allDrops: string[] = [];
    let collectedAny = false;

    for (const dispatch of this.state.autoDispatches) {
      if (dispatch.pendingDrops && dispatch.pendingDrops.length > 0) {
        for (const dropId of dispatch.pendingDrops) {
          this.state.materials[dropId] = (this.state.materials[dropId] || 0) + 1;
          allDrops.push(dropId);
        }
        dispatch.logs.push(`素材${dispatch.pendingDrops.length}個を回収して工房の倉庫に格納しました。`);
        if (dispatch.logs.length > 5) dispatch.logs.shift();
        dispatch.pendingDrops = [];
        collectedAny = true;
      }
    }

    if (!collectedAny) {
      throw new Error("回収できる素材がありません");
    }

    this.saveState();
    return { drops: allDrops };
  }

  public getAutoDispatchIntervalMs(robotId?: string): number {
    const BASE_INTERVAL = 60 * 60 * 1000; // 3600秒 (1時間)
    if (!robotId) return BASE_INTERVAL;
    const robot = this.state.robots.find(r => r.id === robotId);
    if (!robot) return BASE_INTERVAL;
    // Agility 1につき 1秒 (1000ms) 短縮。最小下限は 60秒 (60000ms)
    const agilityReduction = (robot.stats.agility || 0) * 1000;
    return Math.max(60 * 1000, BASE_INTERVAL - agilityReduction);
  }

  public processAutoDispatches() {
    const now = Date.now();
    let changed = false;

    for (const d of this.state.autoDispatches) {
      if (!d.pendingDrops) {
        d.pendingDrops = [];
      }

      const intervalMs = this.getAutoDispatchIntervalMs(d.robotId);
      const elapsed = now - d.lastCollectedAt;
      if (elapsed >= intervalMs) {
        const collectionsCount = Math.floor(elapsed / intervalMs);
        const maxCollections = 200; // max cap to prevent huge calculations if offline for weeks
        let actualCollections = Math.min(collectionsCount, maxCollections);
        
        const loc = LOCATIONS.find(l => l.id === d.locationId);
        let canceled = false;

        if (loc) {
          const robot = this.state.robots.find(r => r.id === d.robotId);
          if (robot) {
             const currentHp = robot.currentHp ?? 10;
             // Remaining collections possible without hitting 0 HP. Stop at 1 HP.
             const maxPossibleCollections = Math.max(0, currentHp - 1);
             actualCollections = Math.min(actualCollections, maxPossibleCollections);

             const newFoundDrops: string[] = [];

             if (actualCollections > 0) {
               for (let i = 0; i < actualCollections; i++) {
                  // 素材を回収
                  const dropId = loc.drops[Math.floor(Math.random() * loc.drops.length)];
                  newFoundDrops.push(dropId);
                  d.pendingDrops.push(dropId);
               }

               // HP消費
               robot.currentHp = currentHp - actualCollections;

               const minText = Math.round((intervalMs / 60000) * 10) / 10;
               d.logs.push(`自動探索(${minText}分間隔)で素材を${newFoundDrops.length}個発見！(未回収: ${d.pendingDrops.length}個, 残りHP: ${robot.currentHp})`);
               if (d.logs.length > 5) d.logs.shift();
               changed = true;
             }

             if (robot.currentHp! <= 1) {
               d.logs.push(`⚠️ HPが残りわずか(1)のため、これ以上探索を継続できません。帰還してください。`);
               if (d.logs.length > 5) d.logs.shift();
               canceled = true; // wait for player to manually collect and cancel, or we can auto cancel
             }
          }
        }
        
        // If they had more collections left but got canceled due to HP, we shouldn't advance lastCollectedAt by full elapsed time.
        // We advance it by the actualCollections time, so they don't get free elapsed time when healed.
        d.lastCollectedAt += actualCollections * intervalMs;
        
        if (canceled) {
           // We just let the dispatch stay but it won't collect anymore because HP is 1.
           // They have to click "帰還" to collect drops and then repair.
           d.lastCollectedAt = now; // Prevent building up time while at 1 HP.
        }
      }
    }

    if (changed) {
      this.saveState();
    }
  }

  public consumeRobotHp(robotId: string, amount: number) {
    const robot = this.state.robots.find(r => r.id === robotId);
    if (!robot) throw new Error("ロボットが見つかりません");
    const currentHp = robot.currentHp ?? 12;
    if (currentHp < amount) throw new Error("HPが足りません");
    robot.currentHp = currentHp - amount;
    this.saveState();
  }

  public addRepairKits(amount: number) {
    this.state.repairKits = (this.state.repairKits || 0) + amount;
    this.saveState();
  }

  public recordBattleResult(robotId: string, result: 'win' | 'lose' | 'draw') {
    const robot = this.state.robots.find(r => r.id === robotId);
    if (robot) {
      if (!robot.battleStats) {
        robot.battleStats = { matches: 0, wins: 0, losses: 0, draws: 0 };
      }
      robot.battleStats.matches += 1;
      if (result === 'win') robot.battleStats.wins += 1;
      else if (result === 'lose') robot.battleStats.losses += 1;
      else robot.battleStats.draws += 1;
      this.saveState();
    }
  }

  public addGold(amount: number) {
    this.state.gold += amount;
    this.saveState();
  }
  
  public forceSave() {
    this.saveState();
  }

  // Tutorial
  
  public markTutorialSeen(tutorialId: string) {
    if (!this.state.seenTutorials.includes(tutorialId)) {
      this.state.seenTutorials.push(tutorialId);
      this.saveState();
    }
  }

  public advanceTutorial() {
    this.state.tutorialStep += 1;
    this.saveState();
  }

  // Quest
  public startQuest(locationId: string, robotId?: string) {
    if (this.state.activeQuest) return;
    const loc = LOCATIONS.find(l => l.id === locationId);
    if (!loc) return;

    if (robotId && this.isRobotAutoDispatched(robotId)) {
      throw new Error("このロボットは自動探索中です");
    }

    let timeReduction = 0;
    if (robotId) {
      const robot = this.state.robots.find(r => r.id === robotId);
      if (robot) {
        // Agility 1につき 1秒 (1000ms) 短縮（ベース時間の最大80%まで短縮可能）
        const agilityReduction = (robot.stats.agility || 0) * 1000;
        timeReduction = Math.min(loc.baseTimeMs * 0.8, agilityReduction);
      }
    }

    const finalDuration = Math.max(3000, loc.baseTimeMs - timeReduction);

    this.state.activeQuest = {
      locationId,
      startTime: Date.now(),
      endTime: Date.now() + Math.floor(finalDuration),
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

    const isSuccess = true; // Always 100% success
    const obtained: string[] = [];

    let dropCount = Math.floor(Math.random() * 5) + 3; // Base drop count (3 to 7)

    if (this.state.activeQuest.dispatchedRobotId) {
      const robot = this.state.robots.find(r => r.id === this.state.activeQuest!.dispatchedRobotId);
      if (robot) {
        // Dispatched robot adds extra materials
        dropCount += 4;
        
        // Power stat gives a chance for even more materials
        const extraDrops = Math.floor(robot.stats.power / 10);
        dropCount += extraDrops;
        
        // Attribute affinity
        const robotAttrs = [robot.parts.head.attribute, robot.parts.body.attribute, robot.parts.arms.attribute, robot.parts.legs.attribute];
        if (loc.name.includes('火') && robotAttrs.includes('Water')) dropCount += 1;
        else if (loc.name.includes('水') && robotAttrs.includes('Earth')) dropCount += 1;
        else if (loc.name.includes('風') && robotAttrs.includes('Fire')) dropCount += 1;
      }
    }

    for (let i = 0; i < dropCount; i++) {
      const dropId = loc.drops[Math.floor(Math.random() * loc.drops?.length)];
      const amount = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < amount; j++) obtained.push(dropId);
      this.state.materials[dropId] = (this.state.materials[dropId] || 0) + amount;
    }

    this.state.activeQuest = null;
    if (this.state.tutorialStep === 1) this.advanceTutorial();
    this.saveState();
    return { success: isSuccess, drops: obtained };
  }

  // Crafting Duration Calculations
  public getPartCraftDuration(mainMaterialId: string, subMaterialId?: string): number {
    const mainMat = MATERIALS.find(m => m.id === mainMaterialId);
    if (!mainMat) return 10000;
    
    // ベース10秒 (素材レア度によって変える)
    // メイン素材: ★1 = 10秒, ★2 = 14秒, ★3 = 18秒
    let duration = 10000;
    if (mainMat.rarity === 2) duration = 14000;
    else if (mainMat.rarity === 3) duration = 18000;

    // サブ素材による微調整 (★1: +0秒, ★2: +1秒, ★3: +2秒)
    if (subMaterialId) {
      const subMat = MATERIALS.find(m => m.id === subMaterialId);
      if (subMat) {
        if (subMat.rarity === 2) duration += 1000;
        else if (subMat.rarity === 3) duration += 2000;
      }
    }
    return duration;
  }

  public getRobotAssembleDuration(headId: string, bodyId: string, armsId: string, legsId: string): number {
    const head = this.state.parts.find(p => p.id === headId);
    const body = this.state.parts.find(p => p.id === bodyId);
    const arms = this.state.parts.find(p => p.id === armsId);
    const legs = this.state.parts.find(p => p.id === legsId);

    // ベース1分 (60秒 = 60,000ms) (パーツ性能によって変える)
    let baseDuration = 60000;

    if (head && body && arms && legs) {
      // 4パーツの合計レア度 (4〜12): レア度1増加につき +2.5秒
      const totalRarity = (head.rarity || 1) + (body.rarity || 1) + (arms.rarity || 1) + (legs.rarity || 1);
      const rarityBonus = Math.max(0, totalRarity - 4) * 2500;

      // 4パーツの合計ステータス (標準120程度からの超過分により +0〜15秒)
      const totalStats = (
        (head.stats.hp + head.stats.power + head.stats.defense + head.stats.agility + head.stats.dexterity + head.stats.intelligence) +
        (body.stats.hp + body.stats.power + body.stats.defense + body.stats.agility + body.stats.dexterity + body.stats.intelligence) +
        (arms.stats.hp + arms.stats.power + arms.stats.defense + arms.stats.agility + arms.stats.dexterity + arms.stats.intelligence) +
        (legs.stats.hp + legs.stats.power + legs.stats.defense + legs.stats.agility + legs.stats.dexterity + legs.stats.intelligence)
      );
      const statsBonus = Math.min(15000, Math.max(0, Math.floor((totalStats - 120) / 10) * 1000));

      return baseDuration + rarityBonus + statsBonus;
    }

    return baseDuration;
  }

  // Active Crafting (Parts)
  public startCraftPart(type: PartType, mainMaterialId: string, subMaterialId: string) {
    if (this.state.activePartCraft) {
      throw new Error("現在パーツを製造中です");
    }
    if (!this.state.materials[mainMaterialId] || this.state.materials[mainMaterialId] < 3) {
      throw new Error("メイン素材が足りません（3個必要）");
    }
    if (!this.state.materials[subMaterialId] || this.state.materials[subMaterialId] < 2) {
      throw new Error("サブ素材が足りません（2個必要）");
    }
    
    this.state.materials[mainMaterialId] -= 3;
    this.state.materials[subMaterialId] -= 2;
    
    const mainMat = MATERIALS.find(m => m.id === mainMaterialId);
    const subMat = MATERIALS.find(m => m.id === subMaterialId);
    if (!mainMat || !subMat) throw new Error("不明な素材");

    const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };

    const possibleCrafts = getMaterialCraftableVisuals(mainMat);
    const chosenCraft = possibleCrafts[Math.floor(Math.random() * possibleCrafts.length)];
    const craftRarity = chosenCraft.rarity;
    
    // Add star mark to name based on rarity to distinguish
    const name = `${mainMat.name}の${typeNames[type]}`;

    const newPart: RobotPart = {
      id: `part_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      name,
      attribute: mainMat.attribute, // Main material decides attribute
      rarity: craftRarity as 1 | 2 | 3,
      stats: {
        hp: mainMat.baseStats.hp + Math.floor(subMat.baseStats.hp * 0.5) + Math.floor(Math.random() * 5),
        power: mainMat.baseStats.power + Math.floor(subMat.baseStats.power * 0.5) + Math.floor(Math.random() * 5),
        defense: mainMat.baseStats.defense + Math.floor(subMat.baseStats.defense * 0.5) + Math.floor(Math.random() * 5),
        agility: mainMat.baseStats.agility + Math.floor(subMat.baseStats.agility * 0.5) + Math.floor(Math.random() * 5),
        dexterity: mainMat.baseStats.dexterity + Math.floor(subMat.baseStats.dexterity * 0.5) + Math.floor(Math.random() * 5),
        intelligence: mainMat.baseStats.intelligence + Math.floor(subMat.baseStats.intelligence * 0.5) + Math.floor(Math.random() * 5),
      },
      visualIndex: chosenCraft.visualIndex,
    };

    const durationMs = this.getPartCraftDuration(mainMaterialId, subMaterialId);
    const now = Date.now();

    this.state.activePartCraft = {
      partType: type,
      mainMaterialId,
      subMaterialId,
      startTime: now,
      endTime: now + durationMs,
      durationMs,
      resultPart: newPart
    };

    this.saveState();
    return this.state.activePartCraft;
  }

  public claimCraftedPart(): RobotPart {
    if (!this.state.activePartCraft) {
      throw new Error("製造中のパーツはありません");
    }
    if (Date.now() < this.state.activePartCraft.endTime) {
      throw new Error("パーツ製造はまだ完了していません");
    }

    const craftedPart = this.state.activePartCraft.resultPart;
    this.state.parts.push(craftedPart);
    this.state.activePartCraft = null;

    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return craftedPart;
  }

  public cancelCraftPart() {
    if (!this.state.activePartCraft) return;
    const { mainMaterialId, subMaterialId } = this.state.activePartCraft;
    this.state.materials[mainMaterialId] = (this.state.materials[mainMaterialId] || 0) + 3;
    this.state.materials[subMaterialId] = (this.state.materials[subMaterialId] || 0) + 2;
    this.state.activePartCraft = null;
    this.saveState();
  }

  // Active Crafting (Robot Assembly)
  public startAssembleRobot(headId: string, bodyId: string, armsId: string, legsId: string) {
    if (this.state.activeRobotAssembly) {
      throw new Error("現在ロボットを組立中です");
    }
    if (this.state.robots?.length >= this.state.storageSize) {
      throw new Error("倉庫がいっぱいです");
    }

    const head = this.state.parts.find(p => p.id === headId && p.type === 'head');
    const body = this.state.parts.find(p => p.id === bodyId && p.type === 'body');
    const arms = this.state.parts.find(p => p.id === armsId && p.type === 'arms');
    const legs = this.state.parts.find(p => p.id === legsId && p.type === 'legs');

    if (!head || !body || !arms || !legs) throw new Error("パーツが不足しています");

    const durationMs = this.getRobotAssembleDuration(headId, bodyId, armsId, legsId);

    // remove parts from inventory
    this.state.parts = this.state.parts.filter(p => ![headId, bodyId, armsId, legsId].includes(p.id));

    const totalHp = head.stats.hp + body.stats.hp + arms.stats.hp + legs.stats.hp;
    const totalPow = head.stats.power + body.stats.power + arms.stats.power + legs.stats.power;
    const totalDef = head.stats.defense + body.stats.defense + arms.stats.defense + legs.stats.defense;
    const totalAgi = head.stats.agility + body.stats.agility + arms.stats.agility + legs.stats.agility;
    const totalDex = head.stats.dexterity + body.stats.dexterity + arms.stats.dexterity + legs.stats.dexterity;
    const totalInt = head.stats.intelligence + body.stats.intelligence + arms.stats.intelligence + legs.stats.intelligence;

    const prefix1 = ['野生の', '古代の', '謎の', '伝説の', '鋼鉄の', '真紅の', '漆黒の', '錆びた', '光る', '怒れる', '眠れる', '小さな', '巨大な', '忘れられた', '名無しの'];
    const prefix2 = ['繊細な', '凶暴な', '勇敢な', '臆病な', '賢い', '鈍い', '素早い', '硬い', '柔らかい', '冷たい', '熱い', '美しい', '醜い', '奇妙な', '完璧な'];
    const nouns = ['ポピー', 'ゴーレム', '巨人', '兵士', '騎士', '番人', '破壊者', '守護者', '従者', '王', '悪魔', '天使', '獣', '機械', '塊'];
    const randomName = `${prefix1[Math.floor(Math.random() * prefix1.length)]}${prefix2[Math.floor(Math.random() * prefix2.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;

    const newRobot: Robot = {
      id: `rob_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: randomName,
      parts: { head, body, arms, legs },
      stats: {
        hp: totalHp, power: totalPow, defense: totalDef, agility: totalAgi, dexterity: totalDex, intelligence: totalInt
      },
      currentHp: 12,
      maxHp: 12,
      createdAt: Date.now(),
      value: (head.rarity + body.rarity + arms.rarity + legs.rarity) * 20
    };

    const now = Date.now();
    this.state.activeRobotAssembly = {
      startTime: now,
      endTime: now + durationMs,
      durationMs,
      resultRobot: newRobot
    };

    this.saveState();
    return this.state.activeRobotAssembly;
  }

  public claimAssembledRobot(): Robot {
    if (!this.state.activeRobotAssembly) {
      throw new Error("組立中のロボットはありません");
    }
    if (Date.now() < this.state.activeRobotAssembly.endTime) {
      throw new Error("ロボットの組立はまだ完了していません");
    }

    const assembledRobot = this.state.activeRobotAssembly.resultRobot;
    this.state.robots.push(assembledRobot);
    this.state.activeRobotAssembly = null;

    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return assembledRobot;
  }

  public cancelAssembleRobot() {
    if (!this.state.activeRobotAssembly) return;
    const { parts } = this.state.activeRobotAssembly.resultRobot;
    if (parts.head) this.state.parts.push(parts.head);
    if (parts.body) this.state.parts.push(parts.body);
    if (parts.arms) this.state.parts.push(parts.arms);
    if (parts.legs) this.state.parts.push(parts.legs);
    this.state.activeRobotAssembly = null;
    this.saveState();
  }

  // Legacy immediate Crafting methods for backward compatibility
  public craftPart(type: PartType, mainMaterialId: string, subMaterialId: string) {
    if (!this.state.materials[mainMaterialId] || this.state.materials[mainMaterialId] < 3) {
      throw new Error("メイン素材が足りません（3個必要）");
    }
    if (!this.state.materials[subMaterialId] || this.state.materials[subMaterialId] < 2) {
      throw new Error("サブ素材が足りません（2個必要）");
    }
    
    this.state.materials[mainMaterialId] -= 3;
    this.state.materials[subMaterialId] -= 2;
    
    const mainMat = MATERIALS.find(m => m.id === mainMaterialId);
    const subMat = MATERIALS.find(m => m.id === subMaterialId);
    if (!mainMat || !subMat) throw new Error("不明な素材");

    const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };

    const possibleCrafts = getMaterialCraftableVisuals(mainMat);
    const chosenCraft = possibleCrafts[Math.floor(Math.random() * possibleCrafts.length)];
    const craftRarity = chosenCraft.rarity;
    
    const name = `${mainMat.name}の${typeNames[type]}`;

    const newPart: RobotPart = {
      id: `part_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      name,
      attribute: mainMat.attribute, // Main material decides attribute
      rarity: craftRarity as 1 | 2 | 3,
      stats: {
        hp: mainMat.baseStats.hp + Math.floor(subMat.baseStats.hp * 0.5) + Math.floor(Math.random() * 5),
        power: mainMat.baseStats.power + Math.floor(subMat.baseStats.power * 0.5) + Math.floor(Math.random() * 5),
        defense: mainMat.baseStats.defense + Math.floor(subMat.baseStats.defense * 0.5) + Math.floor(Math.random() * 5),
        agility: mainMat.baseStats.agility + Math.floor(subMat.baseStats.agility * 0.5) + Math.floor(Math.random() * 5),
        dexterity: mainMat.baseStats.dexterity + Math.floor(subMat.baseStats.dexterity * 0.5) + Math.floor(Math.random() * 5),
        intelligence: mainMat.baseStats.intelligence + Math.floor(subMat.baseStats.intelligence * 0.5) + Math.floor(Math.random() * 5),
      },
      visualIndex: chosenCraft.visualIndex,
    };
    
    this.state.parts.push(newPart);
    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return newPart;
  }

  public assembleRobot(headId: string, bodyId: string, armsId: string, legsId: string) {
    if (this.state.robots?.length >= this.state.storageSize) {
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
    const totalInt = head.stats.intelligence + body.stats.intelligence + arms.stats.intelligence + legs.stats.intelligence;

    const prefix1 = ['野生の', '古代の', '謎の', '伝説の', '鋼鉄の', '真紅の', '漆黒の', '錆びた', '光る', '怒れる', '眠れる', '小さな', '巨大な', '忘れられた', '名無しの'];
    const prefix2 = ['繊細な', '凶暴な', '勇敢な', '臆病な', '賢い', '鈍い', '素早い', '硬い', '柔らかい', '冷たい', '熱い', '美しい', '醜い', '奇妙な', '完璧な'];
    const nouns = ['ポピー', 'ゴーレム', '巨人', '兵士', '騎士', '番人', '破壊者', '守護者', '従者', '王', '悪魔', '天使', '獣', '機械', '塊'];
    const randomName = `${prefix1[Math.floor(Math.random() * prefix1.length)]}${prefix2[Math.floor(Math.random() * prefix2.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;

    const newRobot: Robot = {
      id: `rob_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: randomName,
      parts: { head, body, arms, legs },
      stats: {
        hp: totalHp, power: totalPow, defense: totalDef, agility: totalAgi, dexterity: totalDex, intelligence: totalInt
      },
      currentHp: 12,
      maxHp: 12,
      createdAt: Date.now(),
      value: (head.rarity + body.rarity + arms.rarity + legs.rarity) * 20
    };

    this.state.robots.push(newRobot);
    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return newRobot;
  }

  public getUpdateTimes(rank: RequestRank, nowMs: number): { current: number; next: number } {
    const date = new Date(nowMs);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    let slotHours: number[] = [];
    if (rank === 'King') {
      slotHours = [9]; // 9:00 every day (24h)
    } else if (rank === 'Noble') {
      slotHours = [9, 21]; // 9:00, 21:00 every day (12h)
    } else {
      slotHours = [3, 9, 15, 21]; // 3:00, 9:00, 15:00, 21:00 every day (6h)
    }

    // Generate candidate slot boundary timestamps around the current day
    const candidateTimes: number[] = [];
    for (let dOffset = -2; dOffset <= 2; dOffset++) {
      for (const h of slotHours) {
        candidateTimes.push(new Date(year, month, day + dOffset, h, 0, 0, 0).getTime());
      }
    }
    candidateTimes.sort((a, b) => a - b);

    let current = candidateTimes[0];
    let next = candidateTimes[candidateTimes.length - 1];

    for (let i = 0; i < candidateTimes.length - 1; i++) {
      if (candidateTimes[i] <= nowMs && nowMs < candidateTimes[i + 1]) {
        current = candidateTimes[i];
        next = candidateTimes[i + 1];
        break;
      }
    }

    return { current, next };
  }

  public update() {
    this.processAutoDispatches();
    const now = Date.now();
    let changed = false;

    // Check if in-progress request expired
    if (this.state.currentRequest) {
      const curTimes = this.getUpdateTimes(this.state.currentRequest.rank, now);
      if (now >= this.state.currentRequest.deadline || now >= curTimes.next) {
        // Expired automatically
        this.state.currentRequest = null;
        changed = true;
      } else if (this.state.currentRequest.deadline !== curTimes.next) {
        // Correct deadline to align with current slot
        this.state.currentRequest.deadline = curTimes.next;
        changed = true;
      }
    }

    if (!this.state.completedRequestDeadlines) {
      this.state.completedRequestDeadlines = {};
    }
    if (!this.state.clientAffection) {
      this.state.clientAffection = { King: 1, Noble: 1, OldMan: 1 };
    }

    const ranks: RequestRank[] = ['King', 'Noble', 'OldMan'];
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      const times = this.getUpdateTimes(rank, now);

      // 1. Clean up stale completed records
      if (this.state.completedRequestDeadlines[rank]) {
        if (this.state.completedRequestDeadlines[rank]! <= now || this.state.completedRequestDeadlines[rank] !== times.next) {
          delete this.state.completedRequestDeadlines[rank];
          changed = true;
        }
      }

      // 2. If this rank is currently in progress
      if (this.state.currentRequest && this.state.currentRequest.rank === rank) {
        const dupIdx = this.state.availableRequests.findIndex(r => r.rank === rank);
        if (dupIdx !== -1) {
          this.state.availableRequests.splice(dupIdx, 1);
          changed = true;
        }
        continue;
      }

      // 3. If this rank was already completed for this current slot
      if (this.state.completedRequestDeadlines[rank] === times.next) {
        const dupIdx = this.state.availableRequests.findIndex(r => r.rank === rank);
        if (dupIdx !== -1) {
          this.state.availableRequests.splice(dupIdx, 1);
          changed = true;
        }
        continue;
      }

      // 4. Ensure an active available request exists with exact deadline = times.next
      const existingIdx = this.state.availableRequests.findIndex(r => r.rank === rank);
      if (existingIdx !== -1) {
        const existing = this.state.availableRequests[existingIdx];
        if (existing.deadline <= now || existing.deadline !== times.next) {
          this.state.availableRequests[existingIdx] = this.createRandomRequest(rank, times.next);
          changed = true;
        }
      } else {
        this.state.availableRequests.push(this.createRandomRequest(rank, times.next));
        changed = true;
      }
    }

    // Sort availableRequests consistently: King -> Noble -> OldMan
    const rankOrder: Record<RequestRank, number> = { King: 0, Noble: 1, OldMan: 2 };
    this.state.availableRequests.sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank]);

    if (changed) {
      this.saveState();
    }
  }

  // Requests
  public generateRequestsIfNeeded() {
    this.update();
  }

  private createRandomRequest(rank: RequestRank, deadline: number): ClientRequest {
    const stats = ['hp', 'power', 'defense', 'agility', 'dexterity', 'intelligence'] as const;
    const statLabels: Record<string, string> = { hp: '体力', power: 'パワー', defense: 'ディフェンス', agility: 'アジリティ', dexterity: '器用さ', intelligence: '賢さ' };
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
        deadline
      };
    } else if (rank === 'Noble') {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: '貴族',
        description: `${attrLabels[randAttr]}属性で、${statLabels[randStat]}が30以上のロボを納品せよ`,
        requirements: { attribute: randAttr, statType: randStat, minStatValue: 30 },
        rewardG: 300,
        deadline
      };
    } else {
      return {
        id: 'req_' + Date.now() + Math.random(),
        rank,
        clientName: 'おじさん',
        description: `属性なんでも良いから、${statLabels[randStat]}が10以上のロボを頼む`,
        requirements: { statType: randStat, minStatValue: 10 },
        rewardG: 100,
        deadline
      };
    }
  }

  public acceptRequest(reqId: string) {
    const req = this.state.availableRequests.find(r => r.id === reqId);
    if (!req) return;
    this.state.currentRequest = req;
    this.state.availableRequests = this.state.availableRequests.filter(r => r.id !== reqId);
    if (this.state.tutorialStep === 3) this.advanceTutorial();
    this.saveState();
  }

  public cancelRequest() {
    if (!this.state.currentRequest) return;
    const rank = this.state.currentRequest.rank;
    
    if (this.state.clientAffection) {
        this.state.clientAffection[rank] = Math.max(1, (this.state.clientAffection[rank] || 1) - 1);
    }
    
    this.state.availableRequests.push(this.state.currentRequest);
    this.state.currentRequest = null;
    
    this.generateRequestsIfNeeded();
    this.saveState();
  }

  public deliverRobot(robotId: string) {
    if (this.isRobotAutoDispatched(robotId)) throw new Error("派遣中のロボットは納品できません");
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
    
    let rewardG = req.rewardG;
    if (this.state.clientAffection) {
        this.state.clientAffection[req.rank] = Math.min(10, (this.state.clientAffection[req.rank] || 1) + 1);
        if (this.state.clientAffection[req.rank] === 10) {
            rewardG = Math.floor(rewardG * 1.5);
        }
    }
    
    if (!this.state.completedRequestDeadlines) {
        this.state.completedRequestDeadlines = {};
    }
    this.state.completedRequestDeadlines[req.rank] = req.deadline;

    this.state.gold += rewardG;

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

  public useRepairKit(robotId: string) {
    if (!this.state.repairKits || this.state.repairKits <= 0) {
      throw new Error("修理キットがありません");
    }
    const robot = this.state.robots.find(r => r.id === robotId);
    if (!robot) throw new Error("ロボットが見つかりません");
    
    if ((robot.currentHp ?? 12) >= (robot.maxHp ?? 12)) {
      throw new Error("HPは既に最大です");
    }

    this.state.repairKits -= 1;
    robot.currentHp = robot.maxHp ?? 12;
    this.saveState();
  }

  public exchangeRepairKit(materialId: string, count: number = 1) {
    const mat = MATERIALS.find(m => m.id === materialId);
    if (!mat) throw new Error("素材が見つかりません");
    if (count <= 0) throw new Error("数量が不正です");

    // レア度に応じた必要個数と獲得個数
    // ★1: 3個で1個
    // ★2: 1個で1個
    // ★3: 1個で3個
    const requiredPerKit = mat.rarity === 1 ? 3 : 1;
    const yieldPerKit = mat.rarity === 3 ? 3 : 1;

    const totalRequired = requiredPerKit * count;
    const totalYield = yieldPerKit * count;

    const currentAmount = this.state.materials[materialId] || 0;
    if (currentAmount < totalRequired) {
      throw new Error(`素材「${mat.name}」が足りません（必要数: ${totalRequired}個 / 所持数: ${currentAmount}個）`);
    }

    this.state.materials[materialId] -= totalRequired;
    this.state.repairKits = (this.state.repairKits || 0) + totalYield;
    this.saveState();
    return { materialName: mat.name, usedCount: totalRequired, gainedKits: totalYield };
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

  public disassembleRobot(robotId: string) {
    if (this.state.activeRobotDisassembly) throw new Error("既に解体中のロボットがあります");
    if (this.isRobotAutoDispatched(robotId)) throw new Error("派遣中のロボットは解体できません");
    const idx = this.state.robots.findIndex(r => r.id === robotId);
    if (idx === -1) return;
    const robot = this.state.robots[idx];
    
    const durationMs = 30000; // 30 seconds for disassembling
    const now = Date.now();

    this.state.activeRobotDisassembly = {
      robotClone: JSON.parse(JSON.stringify(robot)),
      startTime: now,
      endTime: now + durationMs,
      durationMs,
      resultParts: [
        robot.parts.head,
        robot.parts.body,
        robot.parts.arms,
        robot.parts.legs
      ]
    };

    // Remove the robot
    this.state.robots.splice(idx, 1);
    this.saveState();
  }

  public claimRobotDisassembly() {
    if (!this.state.activeRobotDisassembly) throw new Error("解体中のロボットがありません");
    if (this.state.activeRobotDisassembly.endTime > Date.now()) throw new Error("解体がまだ完了していません");

    for (const part of this.state.activeRobotDisassembly.resultParts) {
      this.state.parts.push(part);
    }
    
    this.state.activeRobotDisassembly = null;
    this.saveState();
  }

  public recyclePart(partId: string) {
    if (this.state.activePartRecycle) throw new Error("既に還元中のパーツがあります");
    const idx = this.state.parts.findIndex(p => p.id === partId);
    if (idx === -1) return;
    const part = this.state.parts[idx];
    
    // Extract the original material name from the part name (e.g. "さびた鉄くずのヘッド" -> "さびた鉄くず")
    const mat = MATERIALS.find(m => part.name.startsWith(m.name));
    const resultMaterials = mat ? [{ materialId: mat.id, count: 2 }] : [];

    const durationMs = 10000; // 10 seconds for recycling
    const now = Date.now();

    this.state.activePartRecycle = {
      partClone: JSON.parse(JSON.stringify(part)),
      startTime: now,
      endTime: now + durationMs,
      durationMs,
      resultMaterials
    };
    
    this.state.parts.splice(idx, 1);
    this.saveState();
  }

  public claimPartRecycle() {
    if (!this.state.activePartRecycle) throw new Error("還元中のパーツがありません");
    if (this.state.activePartRecycle.endTime > Date.now()) throw new Error("還元がまだ完了していません");

    for (const res of this.state.activePartRecycle.resultMaterials) {
      this.state.materials[res.materialId] = (this.state.materials[res.materialId] || 0) + res.count;
    }
    
    this.state.activePartRecycle = null;
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

