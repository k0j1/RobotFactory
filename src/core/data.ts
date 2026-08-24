import { Material, QuestLocation } from './models';

export const MATERIALS: Material[] = [
  {
    "id": "m_e1",
    "name": "さびた鉄くず",
    "attribute": "Earth",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5
    }
  },
  {
    "id": "m_e2",
    "name": "泥だらけのボルト",
    "attribute": "Earth",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 4,
      "defense": 12,
      "agility": 1,
      "dexterity": 4
    }
  },
  {
    "id": "m_e3",
    "name": "茶色の塗料",
    "attribute": "Earth",
    "rarity": 1,
    "price": 15,
    "baseStats": {
      "hp": 5,
      "power": 2,
      "defense": 15,
      "agility": 2,
      "dexterity": 8
    }
  },
  {
    "id": "m_e4",
    "name": "硬い岩石プレート",
    "attribute": "Earth",
    "rarity": 2,
    "price": 40,
    "baseStats": {
      "hp": 20,
      "power": 10,
      "defense": 25,
      "agility": 5,
      "dexterity": 5
    }
  },
  {
    "id": "m_e5",
    "name": "大地の結晶",
    "attribute": "Earth",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 25,
      "power": 15,
      "defense": 20,
      "agility": 4,
      "dexterity": 8
    }
  },
  {
    "id": "m_e6",
    "name": "強化セラミック",
    "attribute": "Earth",
    "rarity": 2,
    "price": 60,
    "baseStats": {
      "hp": 30,
      "power": 12,
      "defense": 30,
      "agility": 3,
      "dexterity": 6
    }
  },
  {
    "id": "m_e7",
    "name": "オリハルコンの欠片",
    "attribute": "Earth",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 50,
      "power": 30,
      "defense": 50,
      "agility": 10,
      "dexterity": 10
    }
  },
  {
    "id": "m_e8",
    "name": "ガイアの心臓",
    "attribute": "Earth",
    "rarity": 3,
    "price": 200,
    "baseStats": {
      "hp": 60,
      "power": 25,
      "defense": 60,
      "agility": 8,
      "dexterity": 15
    }
  },
  {
    "id": "m_f1",
    "name": "燃える歯車",
    "attribute": "Fire",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 5,
      "power": 15,
      "defense": 5,
      "agility": 5,
      "dexterity": 5
    }
  },
  {
    "id": "m_f2",
    "name": "焦げたワイヤー",
    "attribute": "Fire",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 4,
      "power": 18,
      "defense": 4,
      "agility": 6,
      "dexterity": 4
    }
  },
  {
    "id": "m_f3",
    "name": "赤い塗料",
    "attribute": "Fire",
    "rarity": 1,
    "price": 15,
    "baseStats": {
      "hp": 5,
      "power": 15,
      "defense": 2,
      "agility": 8,
      "dexterity": 8
    }
  },
  {
    "id": "m_f4",
    "name": "高熱バーナー",
    "attribute": "Fire",
    "rarity": 2,
    "price": 40,
    "baseStats": {
      "hp": 10,
      "power": 30,
      "defense": 10,
      "agility": 10,
      "dexterity": 10
    }
  },
  {
    "id": "m_f5",
    "name": "マグマバッテリー",
    "attribute": "Fire",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 15,
      "power": 35,
      "defense": 15,
      "agility": 8,
      "dexterity": 8
    }
  },
  {
    "id": "m_f6",
    "name": "真紅の装甲",
    "attribute": "Fire",
    "rarity": 2,
    "price": 60,
    "baseStats": {
      "hp": 20,
      "power": 40,
      "defense": 20,
      "agility": 5,
      "dexterity": 5
    }
  },
  {
    "id": "m_f7",
    "name": "ドラゴンの鱗",
    "attribute": "Fire",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 30,
      "power": 60,
      "defense": 30,
      "agility": 15,
      "dexterity": 15
    }
  },
  {
    "id": "m_f8",
    "name": "太陽の炉心",
    "attribute": "Fire",
    "rarity": 3,
    "price": 200,
    "baseStats": {
      "hp": 40,
      "power": 80,
      "defense": 20,
      "agility": 10,
      "dexterity": 10
    }
  },
  {
    "id": "m_w1",
    "name": "水冷チューブ",
    "attribute": "Water",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 15,
      "power": 5,
      "defense": 10,
      "agility": 5,
      "dexterity": 10
    }
  },
  {
    "id": "m_w2",
    "name": "湿ったフィルター",
    "attribute": "Water",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 18,
      "power": 4,
      "defense": 12,
      "agility": 4,
      "dexterity": 8
    }
  },
  {
    "id": "m_w3",
    "name": "青い塗料",
    "attribute": "Water",
    "rarity": 1,
    "price": 15,
    "baseStats": {
      "hp": 10,
      "power": 2,
      "defense": 8,
      "agility": 5,
      "dexterity": 15
    }
  },
  {
    "id": "m_w4",
    "name": "高圧ポンプ",
    "attribute": "Water",
    "rarity": 2,
    "price": 40,
    "baseStats": {
      "hp": 25,
      "power": 10,
      "defense": 20,
      "agility": 10,
      "dexterity": 15
    }
  },
  {
    "id": "m_w5",
    "name": "永久氷晶",
    "attribute": "Water",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 30,
      "power": 15,
      "defense": 25,
      "agility": 8,
      "dexterity": 12
    }
  },
  {
    "id": "m_w6",
    "name": "蒼海の合金",
    "attribute": "Water",
    "rarity": 2,
    "price": 60,
    "baseStats": {
      "hp": 35,
      "power": 12,
      "defense": 30,
      "agility": 6,
      "dexterity": 10
    }
  },
  {
    "id": "m_w7",
    "name": "リヴァイアサンの牙",
    "attribute": "Water",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 60,
      "power": 20,
      "defense": 50,
      "agility": 10,
      "dexterity": 20
    }
  },
  {
    "id": "m_w8",
    "name": "海神の涙",
    "attribute": "Water",
    "rarity": 3,
    "price": 200,
    "baseStats": {
      "hp": 80,
      "power": 15,
      "defense": 40,
      "agility": 15,
      "dexterity": 30
    }
  },
  {
    "id": "m_a1",
    "name": "軽いプロペラ",
    "attribute": "Wind",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 5,
      "power": 5,
      "defense": 5,
      "agility": 15,
      "dexterity": 10
    }
  },
  {
    "id": "m_a2",
    "name": "ホコリまみれの羽",
    "attribute": "Wind",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 4,
      "power": 6,
      "defense": 4,
      "agility": 18,
      "dexterity": 12
    }
  },
  {
    "id": "m_a3",
    "name": "緑の塗料",
    "attribute": "Wind",
    "rarity": 1,
    "price": 15,
    "baseStats": {
      "hp": 5,
      "power": 5,
      "defense": 5,
      "agility": 20,
      "dexterity": 8
    }
  },
  {
    "id": "m_a4",
    "name": "風切りモーター",
    "attribute": "Wind",
    "rarity": 2,
    "price": 40,
    "baseStats": {
      "hp": 10,
      "power": 10,
      "defense": 10,
      "agility": 35,
      "dexterity": 15
    }
  },
  {
    "id": "m_a5",
    "name": "エアロフレーム",
    "attribute": "Wind",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 15,
      "power": 15,
      "defense": 12,
      "agility": 40,
      "dexterity": 18
    }
  },
  {
    "id": "m_a6",
    "name": "嵐の結晶",
    "attribute": "Wind",
    "rarity": 2,
    "price": 60,
    "baseStats": {
      "hp": 12,
      "power": 20,
      "defense": 10,
      "agility": 45,
      "dexterity": 12
    }
  },
  {
    "id": "m_a7",
    "name": "シルフの吐息",
    "attribute": "Wind",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 20,
      "power": 25,
      "defense": 20,
      "agility": 70,
      "dexterity": 25
    }
  },
  {
    "id": "m_a8",
    "name": "天空のジェット",
    "attribute": "Wind",
    "rarity": 3,
    "price": 200,
    "baseStats": {
      "hp": 25,
      "power": 30,
      "defense": 25,
      "agility": 85,
      "dexterity": 30
    }
  },
  {
    "id": "m_l1",
    "name": "小さな電球",
    "attribute": "Light",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 8,
      "power": 8,
      "defense": 8,
      "agility": 8,
      "dexterity": 12
    }
  },
  {
    "id": "m_l2",
    "name": "断線したケーブル",
    "attribute": "Light",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 7,
      "power": 9,
      "defense": 7,
      "agility": 9,
      "dexterity": 14
    }
  },
  {
    "id": "m_l3",
    "name": "黄色い塗料",
    "attribute": "Light",
    "rarity": 1,
    "price": 15,
    "baseStats": {
      "hp": 5,
      "power": 5,
      "defense": 5,
      "agility": 10,
      "dexterity": 15
    }
  },
  {
    "id": "m_l4",
    "name": "発光ダイオード",
    "attribute": "Light",
    "rarity": 2,
    "price": 40,
    "baseStats": {
      "hp": 15,
      "power": 15,
      "defense": 15,
      "agility": 15,
      "dexterity": 25
    }
  },
  {
    "id": "m_l5",
    "name": "ソーラーパネル",
    "attribute": "Light",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 18,
      "defense": 20,
      "agility": 12,
      "dexterity": 30
    }
  },
  {
    "id": "m_l6",
    "name": "聖なるレンズ",
    "attribute": "Light",
    "rarity": 2,
    "price": 60,
    "baseStats": {
      "hp": 18,
      "power": 22,
      "defense": 18,
      "agility": 18,
      "dexterity": 35
    }
  },
  {
    "id": "m_l7",
    "name": "天使の光輪",
    "attribute": "Light",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 30,
      "power": 30,
      "defense": 30,
      "agility": 30,
      "dexterity": 50
    }
  },
  {
    "id": "m_l8",
    "name": "神聖なるコア",
    "attribute": "Light",
    "rarity": 3,
    "price": 200,
    "baseStats": {
      "hp": 40,
      "power": 40,
      "defense": 40,
      "agility": 40,
      "dexterity": 60
    }
  },
  {
    "id": "m_d1",
    "name": "汚染された泥",
    "attribute": "Dark",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 12,
      "power": 12,
      "defense": 8,
      "agility": 5,
      "dexterity": 5
    }
  },
  {
    "id": "m_d2",
    "name": "ノイズ基板",
    "attribute": "Dark",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 10,
      "power": 15,
      "defense": 6,
      "agility": 6,
      "dexterity": 4
    }
  },
  {
    "id": "m_d3",
    "name": "紫の塗料",
    "attribute": "Dark",
    "rarity": 1,
    "price": 15,
    "baseStats": {
      "hp": 5,
      "power": 10,
      "defense": 5,
      "agility": 5,
      "dexterity": 8
    }
  },
  {
    "id": "m_d4",
    "name": "呪われた歯車",
    "attribute": "Dark",
    "rarity": 2,
    "price": 40,
    "baseStats": {
      "hp": 25,
      "power": 25,
      "defense": 15,
      "agility": 10,
      "dexterity": 10
    }
  },
  {
    "id": "m_d5",
    "name": "謎の黒い液",
    "attribute": "Dark",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 30,
      "defense": 20,
      "agility": 12,
      "dexterity": 12
    }
  },
  {
    "id": "m_d6",
    "name": "シャドウフレーム",
    "attribute": "Dark",
    "rarity": 2,
    "price": 60,
    "baseStats": {
      "hp": 30,
      "power": 28,
      "defense": 22,
      "agility": 15,
      "dexterity": 15
    }
  },
  {
    "id": "m_d7",
    "name": "悪魔の眼球",
    "attribute": "Dark",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 50,
      "defense": 30,
      "agility": 20,
      "dexterity": 20
    }
  },
  {
    "id": "m_d8",
    "name": "虚無のリアクター",
    "attribute": "Dark",
    "rarity": 3,
    "price": 200,
    "baseStats": {
      "hp": 50,
      "power": 60,
      "defense": 40,
      "agility": 25,
      "dexterity": 25
    }
  }
];

export const LOCATIONS: QuestLocation[] = [
  {
    "id": "loc1",
    "name": "裏山のスクラップ場",
    "description": "近所のゴミ捨て場。安全だが素材はしょぼい。",
    "unlockCostG": 0,
    "baseTimeMs": 10000,
    "drops": [
      "m_e1",
      "m_e2",
      "m_e3",
      "m_f1",
      "m_w1",
      "m_a1",
      "m_l1",
      "m_d1"
    ]
  },
  {
    "id": "loc2",
    "name": "灼熱の廃工場",
    "description": "火属性の素材が出やすい危険な工場。",
    "unlockCostG": 200,
    "baseTimeMs": 60000,
    "drops": [
      "m_f1",
      "m_f2",
      "m_f3",
      "m_f4",
      "m_f5",
      "m_e2",
      "m_d2"
    ]
  },
  {
    "id": "loc3",
    "name": "水没した都市遺跡",
    "description": "水属性の素材が眠る遺跡。",
    "unlockCostG": 500,
    "baseTimeMs": 120000,
    "drops": [
      "m_w1",
      "m_w2",
      "m_w3",
      "m_w4",
      "m_w5",
      "m_l2",
      "m_a2"
    ]
  },
  {
    "id": "loc4",
    "name": "風の谷の観測所",
    "description": "風属性の素材が集まる高台。",
    "unlockCostG": 1000,
    "baseTimeMs": 180000,
    "drops": [
      "m_a1",
      "m_a2",
      "m_a3",
      "m_a4",
      "m_a5",
      "m_l3"
    ]
  },
  {
    "id": "loc5",
    "name": "光の塔",
    "description": "光り輝く神秘の塔。",
    "unlockCostG": 2000,
    "baseTimeMs": 240000,
    "drops": [
      "m_l2",
      "m_l3",
      "m_l4",
      "m_l5",
      "m_l6",
      "m_w5",
      "m_e5"
    ]
  },
  {
    "id": "loc6",
    "name": "最果てのクレーター",
    "description": "レアな闇や大地の素材が見つかるかも…",
    "unlockCostG": 4000,
    "baseTimeMs": 300000,
    "drops": [
      "m_d3",
      "m_d4",
      "m_d5",
      "m_d6",
      "m_e6",
      "m_d7",
      "m_e7",
      "m_f7"
    ]
  },
  {
    "id": "loc7",
    "name": "古代文明の中枢",
    "description": "全ての属性の最高級素材が眠る伝説の地。",
    "unlockCostG": 10000,
    "baseTimeMs": 600000,
    "drops": [
      "m_e8",
      "m_f8",
      "m_w8",
      "m_a8",
      "m_l8",
      "m_d8",
      "m_l7",
      "m_d7",
      "m_a7"
    ]
  }
];

export const MAX_STORAGE_LEVELS = [5, 10, 15, 20, 30, 50, 100];
export const STORAGE_UPGRADE_COST = [0, 500, 1500, 5000, 15000, 40000, 100000];
