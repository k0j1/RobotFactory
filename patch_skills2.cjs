const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/combatSkills.ts', 'utf-8');

const newSkills = `
  {
    id: 'omega_cross',
    name: '【必殺奥義】星断オメガクロス',
    desc: 'ビームサーベルの最大出力を解放し、十字の斬撃を放つ必殺の剣技。通常の2.5倍の威力を誇る。',
    shortDesc: '専用・威力2.5倍十字斬り',
    category: 'attack',
    reqInt: 15,
    reqEquipment: 'beamSaber',
    reqStat: { stat: 'power', name: 'Power', value: 15 },
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
    reqInt: 12,
    reqEquipment: 'beamShield',
    reqStat: { stat: 'defense', name: 'Defense', value: 12 },
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
`;

const insertIndex = content.indexOf('export const ALL_COMBAT_SKILLS: SkillDef[] = [') + 'export const ALL_COMBAT_SKILLS: SkillDef[] = ['.length;

content = content.slice(0, insertIndex) + newSkills + content.slice(insertIndex);

fs.writeFileSync('src/components/minigames/combat/combatSkills.ts', content);
