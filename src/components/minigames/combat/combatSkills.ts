import { CombatFighter, SkillDef, SkillResult } from './combatTypes';
import { Robot } from '../../../core/models';
import { Opponent } from '../Shared';

// 通常攻撃ダメージ計算公式（ユーザー指定準拠）:
// 1回のダメージ ＝ 自分Pow値 × (80〜120) - 相手Def値 × 50
export const calcBaseDamage = (attackerPow: number, defenderDef: number, multiplier = 1.0): { damage: number; rawRoll: number } => {
  // 80〜120のランダム倍率
  const roll = 80 + Math.random() * 40;
  const rawAttack = attackerPow * roll * multiplier;
  const rawDef = defenderDef * 50;
  const finalDamage = Math.max(10, Math.floor(rawAttack - rawDef));
  return { damage: finalDamage, rawRoll: roll };
};

// 回避判定（ユーザー指定準拠）:
// Dexterity：相手とDexの差がある分だけ攻撃を避ける確率UP
export const checkDodge = (attackerDex: number, defenderDex: number, defenderDodgeBonus = 0): boolean => {
  // 基本回避率 5%
  // 差分（相手Dex - 自分Dex）がプラスなら回避率UP
  const dexDiff = defenderDex - attackerDex;
  const dodgeChance = Math.max(2, Math.min(65, 5 + dexDiff * 1.5 + defenderDodgeBonus));
  const roll = Math.random() * 100;
  return roll < dodgeChance;
};

export const ALL_COMBAT_SKILLS: SkillDef[] = [
  {
    id: 'omega_cross',
    name: '【必殺奥義】星断オメガクロス',
    desc: 'ビームサーベルの最大出力を解放し、十字の斬撃を放つ必殺の剣技。通常の2.5倍の威力を誇る。',
    shortDesc: '専用・威力2.5倍十字斬り',
    category: 'attack',
    reqInt: 8,
    reqEquipment: 'beamSaber',
    reqStat: { stat: 'power', name: 'Power', value: 10 },
    baseLearnChance: 15,
    cooldownSeconds: 12,
    iconName: 'GiBroadsword',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 2.5);
      return { damage, isDodge: false, isCritical: true, specialLog: '星を断つ光の十字が輝く！！' };
    }
  },
  {
    id: 'energy_shield',
    name: 'エネルギーシールド防御',
    desc: 'ビームシールドを過負荷状態にし、強固な光波防壁を展開。約10秒間、被ダメージを半減する。',
    shortDesc: '専用・強固な光波防壁',
    category: 'shield',
    reqInt: 8,
    reqEquipment: 'beamShield',
    reqStat: { stat: 'defense', name: 'Defense', value: 10 },
    baseLearnChance: 20,
    cooldownSeconds: 18,
    iconName: 'GiShield',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    execute: (attacker) => {
      return { 
        damage: 0, 
        isDodge: false, 
        isCritical: false,
        addBuff: {
          id: 'energy_shield_buff',
          name: '光波防壁',
          durationMs: 10000,
          damageReductionMult: 0.5,
        },
        specialLog: '強固な光波防御障壁が展開された！'
      };
    }
  },

  {
    id: 'smash',
    name: '粉砕スマッシュ',
    desc: '渾身のパワーで装甲の脆い部分を叩き割る強撃。通常の1.8倍前後の威力を誇る。',
    shortDesc: '威力1.8倍の強力打撃',
    category: 'attack',
    reqInt: 6,
    reqStat: { stat: 'power', name: 'Power', value: 10 },
    baseLearnChance: 25,
    cooldownSeconds: 6,
    iconName: 'GiHammerDrop',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.8);
      return { damage, isDodge: false, isCritical: true, specialLog: '重い一撃が装甲を軋ませた！' };
    }
  },
  {
    id: 'gatling_rush',
    name: 'ガトリング連撃',
    desc: '敏捷な関節駆動で素早い2連打を繰り出し、さらに次行動への加速（AP+250）を得る。',
    shortDesc: '2連撃＋行動値チャージ',
    category: 'rush',
    reqInt: 10,
    reqStat: { stat: 'agility', name: 'Agility', value: 10 },
    baseLearnChance: 20,
    cooldownSeconds: 8,
    iconName: 'GiRapidshareArrow',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    execute: (attacker, defender) => {
      let totalDmg = 0;
      let dodges = 0;
      for (let i = 0; i < 2; i++) {
        if (checkDodge(attacker.dexterity, defender.dexterity)) {
          dodges++;
        } else {
          const { damage } = calcBaseDamage(attacker.power, defender.defense, 0.75);
          totalDmg += damage;
        }
      }
      if (dodges === 2) {
        return { damage: 0, isDodge: true, isCritical: false, apGain: 250 };
      }
      return { 
        damage: totalDmg, 
        isDodge: false, 
        isCritical: false, 
        hitsCount: 2 - dodges, 
        apGain: 250, 
        specialLog: `電光石火の2連撃！行動値を+250即時チャージ！` 
      };
    }
  },
  {
    id: 'precision_snipe',
    name: '精密スナイプ',
    desc: '敵の急所回路を光学照準で捕捉。相手の回避行動を封じ、防御力を半減して急所を穿つ。',
    shortDesc: '必中・防御半減の急所撃ち',
    category: 'snipe',
    reqInt: 14,
    reqStat: { stat: 'dexterity', name: 'Dexterity', value: 10 },
    baseLearnChance: 20,
    cooldownSeconds: 9,
    iconName: 'GiBullseye',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    execute: (attacker, defender) => {
      // 必中（回避チェックなし）＋相手防御力を半分として計算
      const piercedDef = Math.floor(defender.defense * 0.5);
      const { damage } = calcBaseDamage(attacker.power, piercedDef, 1.4);
      return { damage, isDodge: false, isCritical: true, specialLog: '死角を捉えた必中クリティカル撃！' };
    }
  },
  {
    id: 'nano_barrier',
    name: '要塞ナノバリア',
    desc: 'エネルギー防壁を瞬時に展開。6秒間、受けるあらゆるダメージを50%軽減する。',
    shortDesc: '6秒間 被ダメージ50%カット',
    category: 'shield',
    reqInt: 8,
    reqStat: { stat: 'defense', name: 'Defense', value: 10 },
    baseLearnChance: 22,
    cooldownSeconds: 12,
    iconName: 'GiShieldReflect',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    execute: (attacker) => {
      return {
        damage: 0,
        isDodge: false,
        isCritical: false,
        selfBuff: {
          id: 'nano_barrier',
          name: 'ナノバリア',
          desc: '被ダメージ50%軽減',
          icon: 'shield',
          durationSeconds: 6,
          damageReductionMult: 0.5
        },
        specialLog: '強固なナノバリアを展開！6秒間被ダメージ半減！'
      };
    }
  },
  {
    id: 'emergency_repair',
    name: '緊急リペアプロトコル',
    desc: '内蔵された応急修復ナノマシンを活性化し、最大耐久値の20%を即時修復する。',
    shortDesc: '耐久値20%即時回復',
    category: 'repair',
    reqInt: 16,
    reqStat: { stat: 'hp', name: 'Vitality', value: 10 },
    baseLearnChance: 18,
    cooldownSeconds: 15,
    iconName: 'GiHealing',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    execute: (attacker) => {
      const heal = Math.floor(attacker.maxDurability * 0.20);
      return {
        damage: 0,
        isDodge: false,
        isCritical: false,
        healAmount: heal,
        specialLog: `緊急自己修復コード発動！耐久値を+${heal.toLocaleString()}回復！`
      };
    }
  },
  {
    id: 'emp_disruptor',
    name: 'EMPディスラプター',
    desc: '電磁衝撃波を放射してダメージを与え、さらに相手の行動値(AP)をゼロに吹き飛ばす。',
    shortDesc: 'ダメージ＋相手APリセット',
    category: 'emp',
    reqInt: 22,
    reqStat: { stat: 'power', name: 'Power', value: 20 },
    baseLearnChance: 16,
    cooldownSeconds: 12,
    iconName: 'GiLightningTrio',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.1);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        targetApReduction: 1000,
        specialLog: '強烈な電磁パルス！相手の行動回路をリセットした！'
      };
    }
  },
  {
    id: 'optimize_protocol',
    name: '戦術オプティマイズ',
    desc: '知性演算により相手の動作癖を完全看破。8秒間、自身の攻撃力+25%＆回避率+25%。',
    shortDesc: '8秒間 攻撃力+25%＆回避+25%',
    category: 'attack',
    reqInt: 28,
    baseLearnChance: 15,
    cooldownSeconds: 14,
    iconName: 'GiBrain',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    execute: (attacker, defender) => {
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.0);
      return {
        damage,
        isDodge: false,
        isCritical: false,
        selfBuff: {
          id: 'optimize_buff',
          name: 'オプティマイズ',
          desc: '攻撃力+25%、回避率+25%',
          icon: 'brain',
          durationSeconds: 8,
          powMult: 1.25,
          dodgeBonus: 25
        },
        specialLog: '戦術解析完了！機動オプティマイズで能力大幅強化！'
      };
    }
  },
  {
    id: 'overdrive',
    name: 'リミッター解除',
    desc: '出力制限を解除した猛攻モード。8秒間、攻撃力+40%および行動値蓄積速度が1.5倍に跳ね上がる。',
    shortDesc: '8秒間 攻撃力+40%＆速度1.5倍',
    category: 'overdrive',
    reqInt: 35,
    reqStat: { stat: 'power', name: 'Power', value: 25 },
    baseLearnChance: 12,
    cooldownSeconds: 18,
    iconName: 'GiFlamingSheet',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    execute: () => {
      return {
        damage: 0,
        isDodge: false,
        isCritical: true,
        selfBuff: {
          id: 'overdrive_buff',
          name: 'オーバードライブ',
          desc: '攻撃力+40%、Agi速度1.5倍',
          icon: 'flame',
          durationSeconds: 8,
          powMult: 1.4,
          agiMult: 1.5
        },
        specialLog: '★ リミッター解除！超高出力オーバードライブ始動！'
      };
    }
  },
  {
    id: 'plasma_burst',
    name: '零距離プラズマ撃',
    desc: '装甲の隙間に圧縮プラズマを全放射する工房技術の究極奥義。通常攻撃の2.6倍の超絶破壊力。',
    shortDesc: '超高威力2.6倍の究極一撃',
    category: 'attack',
    reqInt: 45,
    reqStat: { stat: 'power', name: 'Power', value: 35 },
    baseLearnChance: 10,
    cooldownSeconds: 15,
    iconName: 'GiPlasmaBlast',
    badgeColor: 'bg-amber-200 text-amber-950 border-amber-400',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 2.6);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        specialLog: '★★ 零距離プラズマバースト炸裂！圧倒的破壊力！'
      };
    }
  },
  {
    id: 'omega_cross_slash',
    name: '【必殺奥義】星断オメガクロス',
    desc: '天空を星ごと十字に断ち割る伝説の超必殺奥義。超高出力のオメガ交差十字斬撃で通常攻撃の3.2倍の壊滅的特大ダメージを与え、敵の次行動値(AP)を大幅に遅延させる。',
    shortDesc: '特大3.2倍の星断十字撃＋敵AP半減',
    category: 'attack',
    reqInt: 40,
    reqStat: { stat: 'power', name: 'Power', value: 30 },
    baseLearnChance: 12,
    cooldownSeconds: 20,
    iconName: 'GiCrossedSwords',
    badgeColor: 'bg-purple-200 text-purple-950 border-purple-400',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 3.2);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        targetApReduction: 400,
        specialLog: '★★★【必殺奥義】星断オメガクロス炸裂！星をも断つ十字光が敵機を完全両断！'
      };
    }
  },
  {
    id: 'rocket_punch',
    name: 'ロケットパンチ',
    desc: '肘のバーニアジェット噴射で鋼鉄のロケットナックルを射出！通常攻撃の1.9倍の強烈な推進打撃を叩き込み、次行動への加速（AP+200）を得る。',
    shortDesc: '威力1.9倍の射出打撃＋AP加速',
    category: 'attack',
    reqInt: 14,
    reqStat: { stat: 'power', name: 'Power', value: 16 },
    baseLearnChance: 22,
    cooldownSeconds: 8,
    iconName: 'GiPunch',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false, apGain: 100 };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.9);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        apGain: 200,
        specialLog: 'ロケットパンチ発射！爆熱ジェット推進の鋼鉄拳が敵装甲を粉砕！'
      };
    }
  },
  {
    id: 'energy_shield_defense',
    name: 'エネルギーシールド防御',
    desc: '高密度の電磁バリアフィールドを全身に全開展開！装甲を瞬時に250自己修復するとともに、8秒間防御力+50%＆被ダメージ40%カットの鉄壁バリアを形成する。',
    shortDesc: '耐久250修復＋8秒間 Def+50%＆軽減',
    category: 'shield',
    reqInt: 18,
    reqStat: { stat: 'defense', name: 'Defense', value: 16 },
    baseLearnChance: 20,
    cooldownSeconds: 12,
    iconName: 'GiShieldReflect',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    execute: () => {
      return {
        damage: 0,
        isDodge: false,
        isCritical: false,
        healAmount: 250,
        selfBuff: {
          id: 'energy_shield_buff',
          name: 'エネルギーシールド',
          desc: '防御力+50%、被ダメージ40%カット',
          icon: 'shield',
          durationSeconds: 8,
          defMult: 1.5,
          damageReductionMult: 0.6
        },
        specialLog: 'エネルギーシールド防御展開！高密度電磁バリアが機体を強固に防護！'
      };
    }
  },
  {
    id: 'flame_blade_cyclone',
    name: '炎刃・旋風回転斬り',
    desc: '灼熱のヒートブレードを両手に構え、機体を高速旋回させて放つ炎の竜巻3連撃！合計2.4倍の連続回転ダメージを叩き込む。',
    shortDesc: '炎刃の3連旋風斬り（合計2.4倍）',
    category: 'rush',
    reqInt: 22,
    reqStat: { stat: 'agility', name: 'Agility', value: 18 },
    baseLearnChance: 18,
    cooldownSeconds: 10,
    iconName: 'GiSpinningBlades',
    badgeColor: 'bg-red-100 text-red-900 border-red-400',
    execute: (attacker, defender) => {
      let totalDmg = 0;
      let dodges = 0;
      for (let i = 0; i < 3; i++) {
        if (checkDodge(attacker.dexterity, defender.dexterity)) {
          dodges++;
        } else {
          const { damage } = calcBaseDamage(attacker.power, defender.defense, 0.8);
          totalDmg += damage;
        }
      }
      if (dodges === 3) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      return {
        damage: totalDmg,
        isDodge: false,
        isCritical: true,
        hitsCount: 3 - dodges,
        specialLog: '炎刃・旋風回転斬り炸裂！燃え盛る烈火の旋風が敵機を連続両断！'
      };
    }
  }
];

// 閃き判定関数（Intelligenceと能力値を考慮）
export const tryLearnSkill = (fighter: CombatFighter): SkillDef | null => {
  const currentLearnedIds = new Set(fighter.learnedSkills.map(s => s.id));
  
  // 習得可能なスキル（未習得 かつ 必要Int・能力値を満たしているもの）
  const learnableSkills = ALL_COMBAT_SKILLS.filter(skill => {
    if (currentLearnedIds.has(skill.id)) return false;
    if (fighter.intelligence < skill.reqInt) return false;
    if (skill.reqEquipment && !fighter.equipments?.[skill.reqEquipment]) return false;
    if (skill.reqStat) {
      let currentVal = 0;
      switch (skill.reqStat.stat) {
        case 'power': currentVal = fighter.power; break;
        case 'defense': currentVal = fighter.defense; break;
        case 'agility': currentVal = fighter.agility; break;
        case 'dexterity': currentVal = fighter.dexterity; break;
        case 'hp': currentVal = fighter.vitality; break;
      }
      if (currentVal < skill.reqStat.value) return false;
    }
    return true;
  });

  if (learnableSkills.length === 0) return null;

  // Intが高いほど閃き確率がアップ（Int 1につき +0.3%）
  const intBonus = fighter.intelligence * 0.35;

  for (const skill of learnableSkills) {
    const chance = Math.min(85, skill.baseLearnChance + intBonus);
    if (Math.random() * 100 < chance) {
      return skill;
    }
  }

  return null;
};

// 一度閃いた技を戦略に組み込んで選択する関数
export const chooseStrategicSkill = (attacker: CombatFighter, defender: CombatFighter): SkillDef | null => {
  // 使用可能（クールダウンが0以下）な技
  const readySkills = attacker.learnedSkills.filter(s => 
    (attacker.cooldowns[s.id] || 0) <= 0 && 
    (!s.reqEquipment || attacker.equipments?.[s.reqEquipment])
  );
  if (readySkills.length === 0) return null;

  const hpRatio = attacker.currentDurability / attacker.maxDurability;
  const hasShield = attacker.activeBuffs.some(b => b.damageReductionMult !== undefined);

  // 戦略1: HPが35%以下でピンチの時、リペアプロトコルを最優先
  const repairSkill = readySkills.find(s => s.category === 'repair');
  if (repairSkill && hpRatio < 0.35) {
    return repairSkill;
  }

  // 戦略2: シールドが張られておらず、相手のPowが高い場合、シールドを優先
  const shieldSkill = readySkills.find(s => s.category === 'shield');
  if (shieldSkill && !hasShield && (defender.power >= attacker.defense * 0.8 || hpRatio < 0.6)) {
    return shieldSkill;
  }

  // 戦略3: 相手の行動値(AP)が700以上で間もなく攻撃してくる時、EMPで妨害
  const empSkill = readySkills.find(s => s.category === 'emp');
  if (empSkill && defender.actionPoints >= 700) {
    return empSkill;
  }

  // 戦略4: オーバードライブやオプティマイズなどの自己強化バフ
  const buffSkill = readySkills.find(s => s.category === 'overdrive' || s.id === 'optimize_protocol');
  if (buffSkill && !attacker.activeBuffs.some(b => b.id === buffSkill.id + '_buff')) {
    return buffSkill;
  }

  // 戦略5: 高火力攻撃（零距離プラズマ、粉砕スマッシュ、ガトリング、スナイプ）
  const attackSkills = readySkills.filter(s => s.category === 'attack' || s.category === 'snipe' || s.category === 'rush');
  if (attackSkills.length > 0) {
    // 高威力またはランダムで選択
    return attackSkills[Math.floor(Math.random() * attackSkills.length)];
  }

  return readySkills[0];
};

// -------------------------------------------------------------
// 戦術技とGSAPアニメーションの連携定義
// -------------------------------------------------------------
export const getGsapPatternIdForSkill = (skillId: string): string => {
  switch (skillId) {
    case 'omega_cross_slash': return 'ultimate_omega_cross_slash';
    case 'rocket_punch': return 'rocket_punch';
    case 'energy_shield_defense': return 'shield_barrier';
    case 'flame_blade_cyclone': return 'flame_blade_cyclone';
    case 'gatling_rush': return 'missile_barrage';
    case 'precision_snipe': return 'two_handed_sniper_scope_shot';
    case 'emergency_repair': return 'fast_recharge';
    case 'emp_disruptor': return 'precision_scan';
    case 'optimize_protocol': return 'calibration';
    case 'overdrive': return 'overdrive';
    case 'plasma_burst': return 'jet_dash';
    case 'smash': return 'flying_kick';
    case 'omega_cross': return 'ultimate_omega_cross_slash';
    case 'energy_shield': return 'shield_barrier';
    case 'nano_barrier': return 'shield_block_item';
    default: return 'slash_combo';
  }
};

export const getSkillAnimationLabel = (skillId: string): { label: string; tag: string } => {
  switch (skillId) {
    case 'omega_cross_slash':
    case 'omega_cross':
      return { label: '星断オメガクロス・光波十字斬撃', tag: '必殺奥義' };
    case 'rocket_punch':
      return { label: '推進ブースト・ロケットパンチ射出', tag: '強撃' };
    case 'energy_shield_defense':
    case 'energy_shield':
      return { label: '光波防壁・エネルギーシールド展開', tag: '防壁' };
    case 'flame_blade_cyclone':
      return { label: '炎刃熱線・全方位旋風回転斬り', tag: '旋風' };
    case 'gatling_rush':
      return { label: '高速関節駆動・超速ガトリング猛撃', tag: '連撃' };
    case 'precision_snipe':
      return { label: '照準ロック・両手持ち精密スコープ狙撃', tag: '狙撃' };
    case 'emergency_repair':
      return { label: 'ナノマシン緊急修復・高速リチャージ', tag: '修復' };
    case 'emp_disruptor':
      return { label: '高周波電磁パルス・精密スキャン放射', tag: '妨害' };
    case 'optimize_protocol':
      return { label: '戦術キャリブレーション・自己最適化', tag: '演算' };
    case 'overdrive':
      return { label: 'リミッター全面解除・フルバースト覚醒', tag: '強化' };
    case 'plasma_burst':
      return { label: '零距離ジェットダッシュ・プラズマ撃', tag: '強撃' };
    case 'smash':
      return { label: '重量級フライング粉砕スマッシュ', tag: '強撃' };
    case 'nano_barrier':
      return { label: '装甲要塞化・ナノバリアシールドブロック', tag: '防壁' };
    default:
      return { label: '高機動スラッシュコンボ', tag: '通常' };
  }
};

// -------------------------------------------------------------
// 機体・対戦相手の能力値プロファイルと技の解放判定
// -------------------------------------------------------------
export interface FighterStatProfile {
  name: string;
  power: number;
  defense: number;
  agility: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  rawStats?: {
    power: number;
    defense: number;
    agility: number;
    dexterity: number;
    intelligence: number;
    hp?: number;
  };
  equipments?: {
    beamSaber?: boolean;
    beamShield?: boolean;
  };
  boosts?: {
    saberPower: number;
    shieldDefense: number;
  };
}

export interface SkillRequirementCheck {
  skill: SkillDef;
  canUnleash: boolean;
  flashChance: number;
  intOk: boolean;
  reqInt: number;
  currentInt: number;
  equipmentOk: boolean;
  reqEquipment?: 'beamSaber' | 'beamShield';
  hasEquipment: boolean;
  statOk: boolean;
  reqStatName?: string;
  reqStatValue?: number;
  currentStatValue?: number;
  missingRequirements: string[];
  animationInfo: { label: string; tag: string };
}

export const evaluateSkillRequirements = (
  skill: SkillDef,
  profile: FighterStatProfile
): SkillRequirementCheck => {
  const intOk = profile.intelligence >= skill.reqInt;
  const equipmentOk = !skill.reqEquipment || Boolean(profile.equipments?.[skill.reqEquipment]);
  
  let statOk = true;
  let reqStatName: string | undefined;
  let reqStatValue: number | undefined;
  let currentStatValue: number | undefined;

  if (skill.reqStat) {
    reqStatName = skill.reqStat.name;
    reqStatValue = skill.reqStat.value;
    switch (skill.reqStat.stat) {
      case 'power': currentStatValue = profile.power; break;
      case 'defense': currentStatValue = profile.defense; break;
      case 'agility': currentStatValue = profile.agility; break;
      case 'dexterity': currentStatValue = profile.dexterity; break;
      case 'hp': currentStatValue = profile.vitality; break;
    }
    statOk = (currentStatValue ?? 0) >= skill.reqStat.value;
  }

  const canUnleash = intOk && equipmentOk && statOk;
  // Intが高いほど閃き確率がアップ（Int 1につき +0.35%）
  const flashChance = Math.min(85, Math.floor((skill.baseLearnChance + profile.intelligence * 0.35) * 10) / 10);

  const missingRequirements: string[] = [];
  if (!intOk) {
    missingRequirements.push(`知性(Int)不足: 必要 ${skill.reqInt} (現在: ${profile.intelligence})`);
  }
  if (!equipmentOk && skill.reqEquipment) {
    missingRequirements.push(`${skill.reqEquipment === 'beamSaber' ? 'ビームサーベル' : 'ビームシールド'}未装備`);
  }
  if (!statOk && skill.reqStat) {
    missingRequirements.push(`${reqStatName}不足: 必要 ${reqStatValue} (現在: ${currentStatValue})`);
  }

  return {
    skill,
    canUnleash,
    flashChance,
    intOk,
    reqInt: skill.reqInt,
    currentInt: profile.intelligence,
    equipmentOk,
    reqEquipment: skill.reqEquipment,
    hasEquipment: Boolean(skill.reqEquipment && profile.equipments?.[skill.reqEquipment]),
    statOk,
    reqStatName,
    reqStatValue,
    currentStatValue,
    missingRequirements,
    animationInfo: getSkillAnimationLabel(skill.id),
  };
};

export const evaluateAllSkillsForProfile = (profile: FighterStatProfile): {
  all: SkillRequirementCheck[];
  unleasable: SkillRequirementCheck[];
  locked: SkillRequirementCheck[];
} => {
  const all = ALL_COMBAT_SKILLS.map(skill => evaluateSkillRequirements(skill, profile));
  const unleasable = all.filter(c => c.canUnleash);
  const locked = all.filter(c => !c.canUnleash);
  return { all, unleasable, locked };
};

export const createProfileFromRobot = (
  robot: Robot,
  equipments?: { beamSaber?: boolean; beamShield?: boolean }
): FighterStatProfile => {
  const rStats = robot.stats || { power: 10, defense: 5, agility: 10, dexterity: 10, intelligence: 10, hp: 10 };
  const saberBoost = equipments?.beamSaber ? 35 : 0;
  const shieldBoost = equipments?.beamShield ? 30 : 0;
  const hpVal = robot.currentHp ?? (robot.parts ? Math.floor((robot.parts.head.stats.hp + robot.parts.body.stats.hp + robot.parts.arms.stats.hp + robot.parts.legs.stats.hp) / 4) : 10);

  return {
    name: robot.name,
    power: Math.max(1, (rStats.power || 10) + saberBoost),
    defense: Math.max(1, (rStats.defense || 5) + shieldBoost),
    agility: Math.max(1, rStats.agility || 10),
    dexterity: Math.max(1, rStats.dexterity || 10),
    intelligence: Math.max(1, rStats.intelligence || 10),
    vitality: Math.max(1, hpVal),
    rawStats: {
      power: rStats.power || 10,
      defense: rStats.defense || 5,
      agility: rStats.agility || 10,
      dexterity: rStats.dexterity || 10,
      intelligence: rStats.intelligence || 10,
      hp: hpVal,
    },
    equipments,
    boosts: {
      saberPower: saberBoost,
      shieldDefense: shieldBoost,
    },
  };
};

export const createProfileFromOpponent = (
  opponent: Opponent
): FighterStatProfile => {
  return {
    name: opponent.name,
    power: Math.max(1, opponent.power || 15),
    defense: Math.max(1, opponent.defense || 8),
    agility: Math.max(1, opponent.agi || 10),
    dexterity: Math.max(1, opponent.dex || 10),
    intelligence: Math.max(1, opponent.int || 10),
    vitality: Math.max(1, opponent.hp || 10),
    rawStats: {
      power: opponent.power || 15,
      defense: opponent.defense || 8,
      agility: opponent.agi || 10,
      dexterity: opponent.dex || 10,
      intelligence: opponent.int || 10,
      hp: opponent.hp || 10,
    },
    equipments: undefined,
    boosts: {
      saberPower: 0,
      shieldDefense: 0,
    },
  };
};

