import { CombatFighter, SkillDef, SkillResult } from './combatTypes';
import { Robot } from '../../../core/models';
import { Opponent } from '../Shared';
import { CombatEquipmentRank, getEquipmentBonus } from '../../../core/combatEquipmentData';

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
  // -------------------------------------------------------------
  // 武装専用奥義（ビームサーベル / ビームシールド 装備で解放）
  // -------------------------------------------------------------
  {
    id: 'omega_cross',
    name: '【必殺奥義】星断オメガクロス',
    desc: 'ビームサーベルの最大出力を解放し、天空を星ごと十字に断ち割る必殺の剣技。通常の2.8倍の破壊力に加え、相手の行動値(AP)を-300遅延させる。',
    shortDesc: '専用・威力2.8倍十字斬り＋敵AP遅延',
    category: 'attack',
    reqInt: 15,
    reqEquipment: 'beamSaber',
    reqStat: { stat: 'power', name: 'Power', value: 15 },
    baseLearnChance: 18,
    cooldownSeconds: 12,
    iconName: 'GiBroadsword',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 2.8);
      return { 
        damage, 
        isDodge: false, 
        isCritical: true, 
        targetApReduction: 300,
        specialLog: '★★★【必殺奥義】星断オメガクロス！光波十字の斬撃が敵機を完全両断！' 
      };
    }
  },
  {
    id: 'energy_shield',
    name: 'エネルギーシールド防御',
    desc: 'ビームシールドを過負荷状態にして光波防壁を展開。装甲を250自己修復し、8秒間被ダメージを50%カット＆防御力+40%。',
    shortDesc: '専用・耐久250修復＋8秒間 軽減50%',
    category: 'shield',
    reqInt: 15,
    reqEquipment: 'beamShield',
    reqStat: { stat: 'defense', name: 'Defense', value: 15 },
    baseLearnChance: 20,
    cooldownSeconds: 14,
    iconName: 'GiShield',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    execute: () => {
      return { 
        damage: 0, 
        isDodge: false, 
        isCritical: false,
        healAmount: 250,
        selfBuff: {
          id: 'energy_shield_buff',
          name: '光波防壁',
          desc: '被ダメージ50%カット、防御力+40%',
          icon: 'shield',
          durationSeconds: 8,
          defMult: 1.4,
          damageReductionMult: 0.5,
        },
        specialLog: '強固な光波防御障壁を展開！耐久修復とともに鉄壁の防護を形成！'
      };
    }
  },

  // -------------------------------------------------------------
  // Tier 1: 初級基本技（Lv.1〜2帯・初心者機体目安）
  // -------------------------------------------------------------
    {
    id: 'flame_blade_thrust',
    name: '紅蓮・突進突き',
    desc: '腕を前方に真っ直ぐ伸ばし、ブースト推進力で敵の装甲を貫通する紅蓮の直線刺突撃。通常の1.7倍の貫通ダメージ。',
    shortDesc: 'Lv.1〜 威力1.7倍の直線強襲突き',
    category: 'attack',
    reqInt: 12,
    reqStat: { stat: 'power', name: 'Power', value: 15 },
    baseLearnChance: 25,
    cooldownSeconds: 6,
    iconName: 'GiBroadsword',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.7);
      return { damage, isDodge: false, isCritical: true, specialLog: '腕を伸ばした鋭い紅蓮突きが敵装甲を貫通した！' };
    }
  },
  {
    id: 'nano_barrier',
    name: '要塞ナノバリア',
    desc: 'エネルギー防壁を瞬時に展開。6秒間、受けるあらゆるダメージを40%軽減する。',
    shortDesc: 'Lv.1〜 6秒間 被ダメージ40%カット',
    category: 'shield',
    reqInt: 14,
    reqStat: { stat: 'defense', name: 'Defense', value: 12 },
    baseLearnChance: 22,
    cooldownSeconds: 10,
    iconName: 'GiShieldReflect',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    execute: () => {
      return {
        damage: 0,
        isDodge: false,
        isCritical: false,
        selfBuff: {
          id: 'nano_barrier',
          name: 'ナノバリア',
          desc: '被ダメージ40%軽減',
          icon: 'shield',
          durationSeconds: 6,
          damageReductionMult: 0.6
        },
        specialLog: '強固なナノバリアを展開！6秒間被ダメージ40%カット！'
      };
    }
  },
  {
    id: 'rocket_punch',
    name: 'ロケットパンチ',
    desc: '肘のバーニアジェット噴射で鋼鉄のロケットナックルを射出！通常攻撃の1.8倍の推進打撃を叩き込み、次行動への加速（AP+200）を得る。',
    shortDesc: 'Lv.2〜 威力1.8倍の射出打撃＋AP加速',
    category: 'attack',
    reqInt: 20,
    reqStat: { stat: 'power', name: 'Power', value: 25 },
    baseLearnChance: 22,
    cooldownSeconds: 8,
    iconName: 'GiPunch',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false, apGain: 100 };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.8);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        apGain: 200,
        specialLog: 'ロケットパンチ発射！爆熱ジェット推進の鋼鉄拳が敵装甲を粉砕！'
      };
    }
  },

  // -------------------------------------------------------------
  // Tier 2: 中級戦術技（Lv.3〜4帯・中堅機体目安）
  // -------------------------------------------------------------
    {
    id: 'dual_saber_mirage',
    name: '双剣・幻影乱舞',
    desc: '左右の腕にサーベルを構え、神速の4連撃からX字クロスフィニッシュを叩き込む。行動値(AP+250)を獲得。',
    shortDesc: 'Lv.3〜 4連撃＋行動値チャージ',
    category: 'rush',
    reqInt: 30,
    reqStat: { stat: 'agility', name: 'Agility', value: 25 },
    baseLearnChance: 20,
    cooldownSeconds: 8,
    iconName: 'GiTwinSwords',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    execute: (attacker, defender) => {
      let totalDmg = 0;
      let dodges = 0;
      for (let i = 0; i < 4; i++) {
        if (checkDodge(attacker.dexterity, defender.dexterity)) {
          dodges++;
        } else {
          const { damage } = calcBaseDamage(attacker.power, defender.defense, 0.45);
          totalDmg += damage;
        }
      }
      if (dodges === 4) {
        return { damage: 0, isDodge: true, isCritical: false, apGain: 250 };
      }
      return { 
        damage: totalDmg, 
        isDodge: false, 
        isCritical: true, 
        hitsCount: 4 - dodges, 
        apGain: 250, 
        specialLog: `双剣の幻影乱舞が炸裂！神速4連斬撃とX字クロスフィニッシュで圧倒！` 
      };
    }
  },
    {
    id: 'beam_saber_judgement',
    name: 'ビームサーベル・断空斬',
    desc: '腕を正面に伸ばし、プラズマブレードで正面空間を一刀両断に切り裂く。相手の防御力を半減して急所を穿つ。',
    shortDesc: 'Lv.4〜 防御半減・正面一刀両断',
    category: 'snipe',
    reqInt: 40,
    reqStat: { stat: 'dexterity', name: 'Dexterity', value: 35 },
    baseLearnChance: 20,
    cooldownSeconds: 9,
    iconName: 'GiBroadsword',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    execute: (attacker, defender) => {
      const piercedDef = Math.floor(defender.defense * 0.5);
      const { damage } = calcBaseDamage(attacker.power, piercedDef, 1.8);
      return { damage, isDodge: false, isCritical: true, specialLog: '腕を伸ばした正面一刀両断！断空斬が敵機を切り裂く！' };
    }
  },
  {
    id: 'emergency_repair',
    name: '緊急リペアプロトコル',
    desc: '内蔵された応急修復ナノマシンを活性化し、最大耐久値の20%を即時修復する。',
    shortDesc: 'Lv.4〜 耐久値20%即時修復',
    category: 'repair',
    reqInt: 44,
    reqStat: { stat: 'hp', name: 'Vitality', value: 30 },
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

  // -------------------------------------------------------------
  // Tier 3: 上級戦術技（Lv.5〜6帯・精鋭機体目安）
  // -------------------------------------------------------------
  {
    id: 'emp_disruptor',
    name: 'EMPディスラプター',
    desc: '電磁衝撃波を放射してダメージを与え、さらに相手の行動値(AP)をゼロに吹き飛ばす。',
    shortDesc: 'Lv.5〜 ダメージ＋相手AP完全リセット',
    category: 'emp',
    reqInt: 52,
    reqStat: { stat: 'power', name: 'Power', value: 50 },
    baseLearnChance: 16,
    cooldownSeconds: 12,
    iconName: 'GiLightningTrio',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 1.2);
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
    id: 'flame_blade_cyclone',
    name: '炎刃・旋風回転斬り',
    desc: '灼熱のヒートブレードを両手に構え、機体を高速旋回させて放つ炎の竜巻3連撃！合計2.4倍の連続回転ダメージを叩き込む。',
    shortDesc: 'Lv.6〜 炎刃の3連旋風斬り（合計2.4倍）',
    category: 'rush',
    reqInt: 65,
    reqStat: { stat: 'agility', name: 'Agility', value: 50 },
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
  },

  // -------------------------------------------------------------
  // Tier 4: 達人技（Lv.7〜8帯・熟練カスタム機目安）
  // -------------------------------------------------------------
  {
    id: 'optimize_protocol',
    name: '戦術オプティマイズ',
    desc: '知性演算により相手の動作癖を完全看破。8秒間、自身の攻撃力+30%＆回避率+30%。',
    shortDesc: 'Lv.7〜 8秒間 攻撃力+30%＆回避+30%',
    category: 'attack',
    reqInt: 85,
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
          desc: '攻撃力+30%、回避率+30%',
          icon: 'brain',
          durationSeconds: 8,
          powMult: 1.3,
          dodgeBonus: 30
        },
        specialLog: '戦術解析完了！機動オプティマイズで能力大幅強化！'
      };
    }
  },
  {
    id: 'missile_barrage',
    name: 'フルバースト・ミサイル',
    desc: '背部ウェポンコンテナから8発のスマートミサイルを一斉射出！通常攻撃の2.5倍の広域絨毯爆撃を浴びせる。',
    shortDesc: 'Lv.8〜 背部8連ミサイル・2.5倍爆撃',
    category: 'attack',
    reqInt: 120,
    reqStat: { stat: 'power', name: 'Power', value: 150 },
    baseLearnChance: 12,
    cooldownSeconds: 15,
    iconName: 'GiMissileSwarm',
    badgeColor: 'bg-red-100 text-red-950 border-red-400',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 2.5);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        specialLog: '背部ハッチ全開！8発のスマート誘導ミサイルが一斉着弾爆発！'
      };
    }
  },

  // -------------------------------------------------------------
  // Tier 5: 頂点・オメガ級究極奥義（Lv.9〜10帯・極限機体目安）
  // -------------------------------------------------------------
  {
    id: 'overdrive',
    name: 'リミッター全面解除',
    desc: '出力制限を全面解除した猛攻モード。8秒間、攻撃力+50%および行動値蓄積速度が1.8倍に跳ね上がる。',
    shortDesc: 'Lv.9〜 8秒間 攻撃力+50%＆速度1.8倍',
    category: 'overdrive',
    reqInt: 170,
    reqStat: { stat: 'power', name: 'Power', value: 200 },
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
          desc: '攻撃力+50%、Agi速度1.8倍',
          icon: 'flame',
          durationSeconds: 8,
          powMult: 1.5,
          agiMult: 1.8
        },
        specialLog: '★ リミッター全面解除！超高出力オーバードライブ始動！'
      };
    }
  },
  {
    id: 'apocalypse_omega_strike',
    name: '【終焉奥義】アポカリプス・オメガバースト',
    desc: '全出力ジェネレーターを臨界まで解放し、すべてを塵に帰すオメガプラズマ奔流を放射する究極奥義。通常攻撃の3.5倍の超壊滅的特大ダメージを与え、相手の行動値(AP)を完全リセット(-1000)する。',
    shortDesc: 'Lv.10〜 壊滅3.5倍の終焉奥義＋敵APリセット',
    category: 'attack',
    reqInt: 230,
    reqStat: { stat: 'power', name: 'Power', value: 300 },
    baseLearnChance: 15,
    cooldownSeconds: 22,
    iconName: 'GiSuperMushroom',
    badgeColor: 'bg-purple-200 text-purple-950 border-purple-400',
    execute: (attacker, defender) => {
      if (checkDodge(attacker.dexterity, defender.dexterity)) {
        return { damage: 0, isDodge: true, isCritical: false };
      }
      const { damage } = calcBaseDamage(attacker.power, defender.defense, 3.5);
      return {
        damage,
        isDodge: false,
        isCritical: true,
        targetApReduction: 1000,
        specialLog: '★★★★【終焉奥義】アポカリプス・オメガバースト炸裂！臨界プラズマ奔流が大地ごと蒸発させた！'
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

  // 戦略5: 高火力攻撃（フルバーストミサイル、紅蓮突進突き、双剣幻影乱舞、断空斬）
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
    case 'apocalypse_omega_strike': return 'apocalypse_omega_strike';
    case 'omega_cross_slash':
    case 'omega_cross': return 'ultimate_omega_cross_slash';
    case 'rocket_punch': return 'rocket_punch';
    case 'energy_shield_defense':
    case 'energy_shield': return 'shield_barrier';
    case 'nano_barrier': return 'shield_block_item';
    case 'flame_blade_thrust': return 'flame_blade_thrust';
    case 'flame_blade_cyclone': return 'flame_blade_cyclone';
    case 'dual_saber_mirage': return 'dual_saber_mirage_dance';
    case 'beam_saber_judgement': return 'beam_saber_judgement';
    case 'missile_barrage': return 'missile_barrage';
    case 'emergency_repair': return 'fast_recharge';
    case 'emp_disruptor': return 'emp_disruptor';
    case 'optimize_protocol': return 'calibration';
    case 'overdrive': return 'overdrive';
    default: return 'dual_slash';
  }
};

export const getSkillAnimationLabel = (skillId: string): { label: string; tag: string } => {
  switch (skillId) {
    case 'apocalypse_omega_strike':
      return { label: '【終焉奥義】アポカリプス・オメガバースト', tag: '終焉奥義' };
    case 'omega_cross_slash':
    case 'omega_cross':
      return { label: '星断オメガクロス・光波十字斬撃', tag: '必殺奥義' };
    case 'rocket_punch':
      return { label: '推進ブースト・ロケットパンチ射出', tag: '強撃' };
    case 'energy_shield_defense':
    case 'energy_shield':
      return { label: '光波防壁・エネルギーシールド展開', tag: '防壁' };
    case 'nano_barrier':
      return { label: '要塞ナノバリア・幾何学力場防御', tag: '防壁' };
    case 'flame_blade_thrust':
      return { label: '腕伸張強襲・紅蓮突進突き', tag: '刺突' };
    case 'flame_blade_cyclone':
      return { label: '炎刃熱線・全方位旋風回転斬り', tag: '旋風' };
    case 'dual_saber_mirage':
      return { label: '神速4連撃・双剣幻影乱舞', tag: '乱舞' };
    case 'beam_saber_judgement':
      return { label: '腕伸張正面一刀両断・断空斬', tag: '一閃' };
    case 'missile_barrage':
      return { label: '背部8連射出・フルバーストミサイル', tag: '爆撃' };
    case 'emergency_repair':
      return { label: 'ナノマシン緊急修復・高速リチャージ', tag: '修復' };
    case 'emp_disruptor':
      return { label: '高周波電磁パルス・精密スキャン放射', tag: '妨害' };
    case 'optimize_protocol':
      return { label: '戦術キャリブレーション・自己最適化', tag: '演算' };
    case 'overdrive':
      return { label: 'リミッター全面解除・フルバースト覚醒', tag: '強化' };
    default:
      return { label: '通常格闘・デュアルスラッシュ', tag: '通常' };
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
  equipmentRanks?: {
    beamSaber?: CombatEquipmentRank;
    beamShield?: CombatEquipmentRank;
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
  equipments?: { beamSaber?: boolean; beamShield?: boolean },
  equipmentRanks?: { beamSaber?: CombatEquipmentRank; beamShield?: CombatEquipmentRank }
): FighterStatProfile => {
  const rStats = robot.stats || { power: 10, defense: 5, agility: 10, dexterity: 10, intelligence: 10, hp: 10 };
  const saberRank = equipmentRanks?.beamSaber || 'common';
  const shieldRank = equipmentRanks?.beamShield || 'common';
  const saberBoost = equipments?.beamSaber ? getEquipmentBonus('beamSaber', saberRank) : 0;
  const shieldBoost = equipments?.beamShield ? getEquipmentBonus('beamShield', shieldRank) : 0;
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
    equipmentRanks,
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

