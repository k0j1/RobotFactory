const fs = require('fs');

const attributeNames = {
  Earth: [
    ['さびた鉄くず', '泥だらけのボルト', '茶色の塗料', '欠けたレンガ'], // 1
    ['硬い岩石プレート', '大地の結晶', '強化セラミック', '古代の地層石'], // 2
    ['オリハルコンの欠片', 'ガイアの心臓', '大樹の化石', '巨人の遺骨'] // 3
  ],
  Fire: [
    ['燃える歯車', '焦げたワイヤー', '赤い塗料', '灰まみれのネジ'],
    ['高熱バーナー', 'マグマバッテリー', '真紅の装甲', '発火石'],
    ['ドラゴンの鱗', '太陽の炉心', '業火の結晶', '不死鳥の羽']
  ],
  Water: [
    ['水冷チューブ', '湿ったフィルター', '青い塗料', '錆びたバルブ'],
    ['高圧ポンプ', '永久氷晶', '蒼海の合金', '浄化フィルター'],
    ['リヴァイアサンの牙', '海神の涙', '深海の秘宝', '氷竜の逆鱗']
  ],
  Wind: [
    ['軽いプロペラ', 'ホコリまみれの羽', '緑の塗料', '風化した歯車'],
    ['風切りモーター', 'エアロフレーム', '嵐の結晶', '竜巻のコア'],
    ['シルフの吐息', '天空のジェット', '飛竜の翼', '神風のエンジン']
  ],
  Light: [
    ['小さな電球', '断線したケーブル', '黄色い塗料', '割れたレンズ'],
    ['発光ダイオード', 'ソーラーパネル', '聖なるレンズ', '光ファイバー'],
    ['天使の光輪', '神聖なるコア', '太陽のプリズム', '星の欠片']
  ],
  Dark: [
    ['汚染された泥', 'ノイズ基板', '紫の塗料', '呪いの呪符'],
    ['呪われた歯車', '謎の黒い液', 'シャドウフレーム', '闇の結晶'],
    ['悪魔の眼球', '虚無のリアクター', '深淵のコア', '冥界の鉱石']
  ]
};

const shortAttr = { Earth: 'e', Fire: 'f', Water: 'w', Wind: 'a', Light: 'l', Dark: 'd' };

const baseStatsScale = {
  1: { hp: 10, power: 5, defense: 10, agility: 2, dexterity: 5, intelligence: 1 },
  2: { hp: 20, power: 15, defense: 20, agility: 5, dexterity: 8, intelligence: 2 },
  3: { hp: 40, power: 30, defense: 40, agility: 10, dexterity: 15, intelligence: 5 }
};

const priceScale = { 1: 10, 2: 50, 3: 150 };

let materials = [];
for (const [attr, tiers] of Object.entries(attributeNames)) {
  for (let rarity = 1; rarity <= 3; rarity++) {
    const names = tiers[rarity - 1];
    for (let i = 0; i < 4; i++) {
      const id = `m_${shortAttr[attr]}${rarity}_${i+1}`;
      materials.push({
        id,
        name: names[i],
        attribute: attr,
        rarity,
        price: priceScale[rarity] + i * (rarity * 2), // slightly vary price
        baseStats: {
          hp: baseStatsScale[rarity].hp + i * rarity * 2,
          power: baseStatsScale[rarity].power + i * rarity,
          defense: baseStatsScale[rarity].defense + i * rarity,
          agility: baseStatsScale[rarity].agility + i,
          dexterity: baseStatsScale[rarity].dexterity + i,
          intelligence: baseStatsScale[rarity].intelligence + Math.floor(i / 2)
        }
      });
    }
  }
}

let content = fs.readFileSync('src/core/data.ts', 'utf-8');
content = content.replace(/export const MATERIALS: Material\[\] = \[[\s\S]*?\];/m, `export const MATERIALS: Material[] = ${JSON.stringify(materials, null, 2)};`);
fs.writeFileSync('src/core/data.ts', content);
