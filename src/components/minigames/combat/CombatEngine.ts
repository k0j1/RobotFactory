import { Robot } from '../../../core/models';
import { Opponent } from '../Shared';
import { 
  CombatFighter, 
  CombatLogItem, 
  CombatPopup, 
  CombatActionEvent,
  SkillDef 
} from './combatTypes';
import { 
  calcBaseDamage, 
  checkDodge, 
  tryLearnSkill, 
  chooseStrategicSkill 
} from './combatSkills';

export interface CombatEngineSnapshot {
  player: CombatFighter;
  opponent: CombatFighter;
  elapsedSeconds: number;
  isFinished: boolean;
  winner: 'player' | 'opponent' | 'draw' | null;
  logs: CombatLogItem[];
  popups: CombatPopup[];
  lastLearnedSkill: { fighterId: string; fighterName: string; skill: SkillDef } | null;
  lastActionEvent: CombatActionEvent | null;
}

export class CombatEngine {
  private player: CombatFighter;
  private opponent: CombatFighter;
  private elapsedSeconds = 0;
  private isFinished = false;
  private winner: 'player' | 'opponent' | 'draw' | null = null;
  private logs: CombatLogItem[] = [];
  private popups: CombatPopup[] = [];
  private logIdCounter = 0;
  private popupIdCounter = 0;
  private actionEventIdCounter = 0;
  private lastLearnedSkill: { fighterId: string; fighterName: string; skill: SkillDef } | null = null;
  private lastActionEvent: CombatActionEvent | null = null;

  constructor(robot: Robot, opponent: Opponent) {
    // プレイヤー側ファイター生成
    const rStats = robot.stats;
    const playerVitality = Math.max(1, rStats.hp || 10);
    this.player = {
      id: 'player',
      name: robot.name || '自機ロボット',
      isPlayer: true,
      robotRef: robot,
      vitality: playerVitality,
      power: Math.max(1, rStats.power || 10),
      defense: Math.max(1, rStats.defense || 5),
      agility: Math.max(1, rStats.agility || 10),
      dexterity: Math.max(1, rStats.dexterity || 10),
      intelligence: Math.max(1, rStats.intelligence || 10),
      maxDurability: playerVitality * 1000,
      currentDurability: playerVitality * 1000,
      actionPoints: 0,
      learnedSkills: [],
      cooldowns: {},
      activeBuffs: [],
      damageDealt: 0,
      damageTaken: 0,
      attacksCount: 0,
      dodgesCount: 0,
      skillsTriggeredCount: 0,
      skillsLearnedCount: 0,
    };

    // 対戦相手側ファイター生成
    const oppVitality = Math.max(1, opponent.hp || 15);
    this.opponent = {
      id: 'opponent',
      name: opponent.name,
      isPlayer: false,
      opponentRef: opponent,
      vitality: oppVitality,
      power: Math.max(1, opponent.power || 15),
      defense: Math.max(1, opponent.defense || 8),
      agility: Math.max(1, opponent.agi || 10),
      dexterity: Math.max(1, opponent.dex || 10),
      intelligence: Math.max(1, opponent.int || 10),
      maxDurability: oppVitality * 1000,
      currentDurability: oppVitality * 1000,
      actionPoints: 0,
      learnedSkills: [],
      cooldowns: {},
      activeBuffs: [],
      damageDealt: 0,
      damageTaken: 0,
      attacksCount: 0,
      dodgesCount: 0,
      skillsTriggeredCount: 0,
      skillsLearnedCount: 0,
    };

    // 初期開始ログ
    this.addLog({
      type: 'normal_attack',
      actorId: 'system',
      actorName: '演習システム',
      isPlayer: false,
      message: `バトル演習開始！ [${this.player.name}] (耐久:${this.player.maxDurability.toLocaleString()}) VS [${this.opponent.name}] (耐久:${this.opponent.maxDurability.toLocaleString()})`
    });
  }

  // 0.1秒単位等のTick更新処理
  public update(deltaSeconds: number): void {
    if (this.isFinished) return;

    this.elapsedSeconds += deltaSeconds;

    // クールダウンとバフ持続時間の更新
    this.updateFighterTimers(this.player, deltaSeconds);
    this.updateFighterTimers(this.opponent, deltaSeconds);

    // 古いポップアップのクリーンアップ（1.5秒経過）
    const now = Date.now();
    this.popups = this.popups.filter(p => now - p.createdAt < 1500);

    // Agilityに基づく行動値(AP)の蓄積（ユーザー指示：0.1秒ごとにたまる行動値、1000を超えると攻撃）
    // 0.1秒あたりの加算量 ＝ fighter.agility * バフ倍率
    const playerAgiRate = this.player.agility * this.getBuffAgiMult(this.player);
    const opponentAgiRate = this.opponent.agility * this.getBuffAgiMult(this.opponent);

    this.player.actionPoints += playerAgiRate * (deltaSeconds / 0.1);
    this.opponent.actionPoints += opponentAgiRate * (deltaSeconds / 0.1);

    // プレイヤーの攻撃判定（1000を超えた場合）
    if (this.player.actionPoints >= 1000 && !this.isFinished) {
      this.executeAction(this.player, this.opponent);
    }

    // 相手の攻撃判定（1000を超えた場合）
    if (this.opponent.actionPoints >= 1000 && !this.isFinished) {
      this.executeAction(this.opponent, this.player);
    }

    // 決着判定
    this.checkVictoryConditions();
  }

  private updateFighterTimers(fighter: CombatFighter, deltaSeconds: number): void {
    // クールダウン減少
    for (const skillId of Object.keys(fighter.cooldowns)) {
      fighter.cooldowns[skillId] = Math.max(0, fighter.cooldowns[skillId] - deltaSeconds);
    }

    // バフ持続時間減少
    fighter.activeBuffs = fighter.activeBuffs
      .map(buff => ({ ...buff, durationSeconds: buff.durationSeconds - deltaSeconds }))
      .filter(buff => buff.durationSeconds > 0);
  }

  private getBuffAgiMult(fighter: CombatFighter): number {
    return fighter.activeBuffs.reduce((acc, b) => acc * (b.agiMult ?? 1.0), 1.0);
  }

  private getBuffPowMult(fighter: CombatFighter): number {
    return fighter.activeBuffs.reduce((acc, b) => acc * (b.powMult ?? 1.0), 1.0);
  }

  private getBuffDodgeBonus(fighter: CombatFighter): number {
    return fighter.activeBuffs.reduce((acc, b) => acc + (b.dodgeBonus ?? 0), 0);
  }

  private getBuffDamageReduction(fighter: CombatFighter): number {
    return fighter.activeBuffs.reduce((acc, b) => acc * (b.damageReductionMult ?? 1.0), 1.0);
  }

  // 1回の行動（攻撃または技）の実行
  private executeAction(attacker: CombatFighter, defender: CombatFighter): void {
    attacker.attacksCount++;

    // 1. 技の閃き（Inspiration）チェック
    // Intelligenceおよび他能力値を考慮し、未習得の技をひらめく
    const newlyLearned = tryLearnSkill(attacker);
    let chosenSkill: SkillDef | null = null;

    if (newlyLearned) {
      // 💡 技を閃いた！
      attacker.learnedSkills.push(newlyLearned);
      attacker.skillsLearnedCount++;
      chosenSkill = newlyLearned;
      this.lastLearnedSkill = {
        fighterId: attacker.id,
        fighterName: attacker.name,
        skill: newlyLearned
      };

      // 閃きポップアップ & ログ
      this.addPopup(attacker.id, `💡 閃き！【${newlyLearned.name}】`, 'learn');
      this.addLog({
        type: 'learn_skill',
        actorId: attacker.id,
        actorName: attacker.name,
        isPlayer: attacker.isPlayer,
        skillName: newlyLearned.name,
        message: `💡 ${attacker.name}は知性演算により新技【${newlyLearned.name}】を閃いた！（${newlyLearned.shortDesc}）`
      });
    } else {
      // 2. すでに閃いて習得済みの技があれば、戦略に組み込みながら選択
      chosenSkill = chooseStrategicSkill(attacker, defender);
    }

    // 技の実行 または 通常攻撃の実行
    if (chosenSkill) {
      this.executeSkill(attacker, defender, chosenSkill);
    } else {
      this.executeNormalAttack(attacker, defender);
    }

    // 行動値のリセット（ユーザー指示：1000を超えると攻撃してゼロにリセット）
    attacker.actionPoints = 0;
  }

  // 通常攻撃の実行
  private executeNormalAttack(attacker: CombatFighter, defender: CombatFighter): void {
    // 回避判定（Dexterity：相手とDexの差がある分だけ攻撃を避ける確率UP）
    const defenderDodgeBonus = this.getBuffDodgeBonus(defender);
    const isDodged = checkDodge(attacker.dexterity, defender.dexterity, defenderDodgeBonus);

    if (isDodged) {
      defender.dodgesCount++;
      this.lastActionEvent = {
        id: ++this.actionEventIdCounter,
        attackerId: attacker.id,
        defenderId: defender.id,
        type: 'attack',
        isDodge: true,
        damage: 0,
        isCritical: false,
        isHeal: false,
        timestamp: Date.now()
      };
      this.addPopup(defender.id, 'DODGE!', 'dodge');
      this.addLog({
        type: 'dodge',
        actorId: defender.id,
        actorName: defender.name,
        isPlayer: defender.isPlayer,
        message: `${defender.name}は素早い身のこなし（Dex差）で${attacker.name}の通常攻撃を回避した！`
      });
      return;
    }

    // ダメージ計算（ユーザー指示：自分Pow値x80~120 - 相手Def値x50）
    const effectivePow = attacker.power * this.getBuffPowMult(attacker);
    const { damage, rawRoll } = calcBaseDamage(effectivePow, defender.defense, 1.0);
    
    // 防御バフの適用
    const reduction = this.getBuffDamageReduction(defender);
    const finalDamage = Math.max(10, Math.floor(damage * reduction));

    defender.currentDurability = Math.max(0, defender.currentDurability - finalDamage);
    attacker.damageDealt += finalDamage;
    defender.damageTaken += finalDamage;

    this.lastActionEvent = {
      id: ++this.actionEventIdCounter,
      attackerId: attacker.id,
      defenderId: defender.id,
      type: 'attack',
      isDodge: false,
      damage: finalDamage,
      isCritical: false,
      isHeal: false,
      timestamp: Date.now()
    };

    this.addPopup(defender.id, `-${finalDamage.toLocaleString()}`, 'damage');
    this.addLog({
      type: 'normal_attack',
      actorId: attacker.id,
      actorName: attacker.name,
      isPlayer: attacker.isPlayer,
      targetName: defender.name,
      damage: finalDamage,
      message: `${attacker.name}の通常攻撃！ (Pow倍率${Math.round(rawRoll)}%) → ${defender.name}に ${finalDamage.toLocaleString()} のダメージ！`
    });
  }

  // 技の実行
  private executeSkill(attacker: CombatFighter, defender: CombatFighter, skill: SkillDef): void {
    attacker.skillsTriggeredCount++;
    // クールダウン設定
    attacker.cooldowns[skill.id] = skill.cooldownSeconds;

    // 技の実行
    const result = skill.execute(attacker, defender);

    // ログプレフィックス
    this.addLog({
      type: 'skill_attack',
      actorId: attacker.id,
      actorName: attacker.name,
      isPlayer: attacker.isPlayer,
      skillName: skill.name,
      message: `⚡ ${attacker.name}の戦術技【${skill.name}】が発動！`
    });

    // 回避された場合
    if (result.isDodge) {
      defender.dodgesCount++;
      this.lastActionEvent = {
        id: ++this.actionEventIdCounter,
        attackerId: attacker.id,
        defenderId: defender.id,
        type: 'skill',
        skill,
        skillName: skill.name,
        isDodge: true,
        damage: 0,
        isCritical: false,
        isHeal: false,
        timestamp: Date.now()
      };
      this.addPopup(defender.id, 'DODGE!', 'dodge');
      this.addLog({
        type: 'dodge',
        actorId: defender.id,
        actorName: defender.name,
        isPlayer: defender.isPlayer,
        message: `${defender.name}は【${skill.name}】の死角を見切って華麗に回避した！`
      });
      return;
    }

    let finalDamage = 0;
    // ダメージ処理
    if (result.damage > 0) {
      const reduction = this.getBuffDamageReduction(defender);
      finalDamage = Math.max(10, Math.floor(result.damage * reduction));

      defender.currentDurability = Math.max(0, defender.currentDurability - finalDamage);
      attacker.damageDealt += finalDamage;
      defender.damageTaken += finalDamage;

      this.addPopup(
        defender.id, 
        `-${finalDamage.toLocaleString()}${result.isCritical ? ' CRIT!' : ''}`, 
        result.isCritical ? 'critical' : 'damage'
      );
      this.addLog({
        type: 'skill_attack',
        actorId: attacker.id,
        actorName: attacker.name,
        isPlayer: attacker.isPlayer,
        targetName: defender.name,
        damage: finalDamage,
        message: `💥 ${defender.name}に ${finalDamage.toLocaleString()} の${result.isCritical ? 'クリティカル' : ''}ダメージ！`
      });
    }

    let actualHealed = 0;
    // 回復処理（リペアプロトコル等）
    if (result.healAmount && result.healAmount > 0) {
      const before = attacker.currentDurability;
      attacker.currentDurability = Math.min(attacker.maxDurability, attacker.currentDurability + result.healAmount);
      actualHealed = attacker.currentDurability - before;

      this.addPopup(attacker.id, `+${actualHealed.toLocaleString()}`, 'heal');
      this.addLog({
        type: 'heal',
        actorId: attacker.id,
        actorName: attacker.name,
        isPlayer: attacker.isPlayer,
        heal: actualHealed,
        message: `✨ ${attacker.name}の耐久値が +${actualHealed.toLocaleString()} 回復した！（現在: ${attacker.currentDurability.toLocaleString()}）`
      });
    }

    this.lastActionEvent = {
      id: ++this.actionEventIdCounter,
      attackerId: attacker.id,
      defenderId: defender.id,
      type: 'skill',
      skill,
      skillName: skill.name,
      isDodge: false,
      damage: finalDamage,
      isCritical: !!result.isCritical,
      isHeal: actualHealed > 0,
      healAmount: actualHealed,
      timestamp: Date.now()
    };

    // APチャージ処理（ガトリング等）
    if (result.apGain && result.apGain > 0) {
      attacker.actionPoints = Math.min(1000, attacker.actionPoints + result.apGain);
    }

    // 相手AP減少（EMP等）
    if (result.targetApReduction && result.targetApReduction > 0) {
      defender.actionPoints = Math.max(0, defender.actionPoints - result.targetApReduction);
      this.addPopup(defender.id, 'AP RESET!', 'buff');
      this.addLog({
        type: 'emp',
        actorId: attacker.id,
        actorName: attacker.name,
        isPlayer: attacker.isPlayer,
        targetName: defender.name,
        message: `⚡ EMP電磁パルスにより、${defender.name}の行動値がゼロにリセットされた！`
      });
    }

    // 自己バフ付与
    if (result.selfBuff) {
      // 既存の同一バフは更新
      attacker.activeBuffs = attacker.activeBuffs.filter(b => b.id !== result.selfBuff!.id);
      attacker.activeBuffs.push(result.selfBuff);
      this.addPopup(attacker.id, `UP: ${result.selfBuff.name}`, 'buff');
      this.addLog({
        type: 'buff',
        actorId: attacker.id,
        actorName: attacker.name,
        isPlayer: attacker.isPlayer,
        message: `🛡️ ${attacker.name}に【${result.selfBuff.name}】（${result.selfBuff.desc}）が付与された！`
      });
    }

    // 特殊ログがある場合
    if (result.specialLog) {
      this.addLog({
        type: 'skill_attack',
        actorId: attacker.id,
        actorName: attacker.name,
        isPlayer: attacker.isPlayer,
        message: result.specialLog
      });
    }
  }

  // 決着判定
  private checkVictoryConditions(): void {
    if (this.isFinished) return;

    if (this.player.currentDurability <= 0 && this.opponent.currentDurability <= 0) {
      this.isFinished = true;
      this.winner = 'draw';
      this.addLog({
        type: 'ko',
        actorId: 'system',
        actorName: '演習システム',
        isPlayer: false,
        message: '相打ち！両機とも同時に戦闘不能となりました（引き分け）'
      });
    } else if (this.opponent.currentDurability <= 0) {
      this.isFinished = true;
      this.winner = 'player';
      this.addLog({
        type: 'ko',
        actorId: 'system',
        actorName: '演習システム',
        isPlayer: true,
        message: `🏆 決着！${this.player.name}が${this.opponent.name}を完全撃破！バトル演習クリア！`
      });
    } else if (this.player.currentDurability <= 0) {
      this.isFinished = true;
      this.winner = 'opponent';
      this.addLog({
        type: 'ko',
        actorId: 'system',
        actorName: '演習システム',
        isPlayer: false,
        message: `⚠️ 決着！${this.player.name}の耐久限界！バトル演習失敗。`
      });
    }
  }

  private addLog(item: Omit<CombatLogItem, 'id' | 'timestamp'>): void {
    this.logs.unshift({
      ...item,
      id: `log_${++this.logIdCounter}`,
      timestamp: Date.now()
    });
    // ログは最大60件保持
    if (this.logs.length > 60) {
      this.logs.pop();
    }
  }

  private addPopup(targetId: string, value: string, type: CombatPopup['type']): void {
    this.popups.push({
      id: `popup_${++this.popupIdCounter}`,
      targetId,
      value,
      type,
      createdAt: Date.now()
    });
  }

  public clearLastLearnedSkill(): void {
    this.lastLearnedSkill = null;
  }

  public clearLastActionEvent(): void {
    this.lastActionEvent = null;
  }

  // スナップショットの取得
  public getSnapshot(): CombatEngineSnapshot {
    return {
      player: {
        ...this.player,
        learnedSkills: [...this.player.learnedSkills],
        cooldowns: { ...this.player.cooldowns },
        activeBuffs: [...this.player.activeBuffs]
      },
      opponent: {
        ...this.opponent,
        learnedSkills: [...this.opponent.learnedSkills],
        cooldowns: { ...this.opponent.cooldowns },
        activeBuffs: [...this.opponent.activeBuffs]
      },
      elapsedSeconds: this.elapsedSeconds,
      isFinished: this.isFinished,
      winner: this.winner,
      logs: [...this.logs],
      popups: [...this.popups],
      lastLearnedSkill: this.lastLearnedSkill,
      lastActionEvent: this.lastActionEvent
    };
  }
}
