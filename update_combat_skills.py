import re

with open('src/components/minigames/combat/combatSkills.ts', 'r') as f:
    content = f.read()

# Replace smash, gatling_rush, precision_snipe, plasma_burst with flame_blade_thrust, dual_saber_mirage, beam_saber_judgement, missile_barrage

# 1. smash -> flame_blade_thrust
flame_thrust_skill = """  {
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
  },"""

content = re.sub(r'\{\s*id:\s*[\'"]smash[\'"][\s\S]*?specialLog:\s*[\'"]重い一撃が装甲を軋ませた！[\'"]\s*\};\s*\}\s*\},', flame_thrust_skill, content)

# 2. gatling_rush -> dual_saber_mirage
dual_saber_skill = """  {
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
  },"""

content = re.sub(r'\{\s*id:\s*[\'"]gatling_rush[\'"][\s\S]*?specialLog:\s*`電光石火の2連撃！行動値を\+250即時チャージ！`\s*\}\s*;\s*\}\s*\},', dual_saber_skill, content)

# 3. precision_snipe -> beam_saber_judgement
beam_saber_skill = """  {
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
  },"""

content = re.sub(r'\{\s*id:\s*[\'"]precision_snipe[\'"][\s\S]*?specialLog:\s*[\'"]死角を捉えた必中クリティカル撃！[\'"]\s*\};\s*\}\s*\},', beam_saber_skill, content)

# 4. plasma_burst -> missile_barrage
missile_skill = """  {
    id: 'missile_barrage',
    name: 'フルバースト・ミサイル',
    desc: '背部ウェポンコンテナから8発のスマートミサイルを一斉射出！通常攻撃の2.5倍の広域絨毯爆撃を浴びせる。',
    shortDesc: 'Lv.7〜 背部8連ミサイル・2.5倍爆撃',
    category: 'attack',
    reqInt: 100,
    reqStat: { stat: 'power', name: 'Power', value: 90 },
    baseLearnChance: 15,
    cooldownSeconds: 11,
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
  },"""

content = re.sub(r'\{\s*id:\s*[\'"]plasma_burst[\'"][\s\S]*?specialLog:\s*[\'"]零距離プラズマキャノン直撃！臨界エネルギーが敵装甲を蒸発させた！[\'"]\s*\};\s*\}\s*\},', missile_skill, content)

# 5. Update getGsapPatternIdForSkill
gsap_mapping_replacement = """export const getGsapPatternIdForSkill = (skillId: string): string => {
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
      return { label: 'リミッター解除・フルバースト覚醒', tag: '覚醒' };
    default:
      return { label: '通常格闘・デュアルスラッシュ', tag: '格闘' };
  }
};"""

content = re.sub(r'export const getGsapPatternIdForSkill[\s\S]*?default:\s*return\s*\{\s*label:\s*[\'"]通常格闘・デュアルスラッシュ[\'"],\s*tag:\s*[\'"]格闘[\'"]\s*\};\s*\}\s*\};', gsap_mapping_replacement, content)

with open('src/components/minigames/combat/combatSkills.ts', 'w') as f:
    f.write(content)

print("Updated combatSkills.ts successfully.")
