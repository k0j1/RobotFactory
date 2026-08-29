import { Material, QuestLocation } from './models';

export const MATERIALS: Material[] = [
  {
    "id": "m_e1_1",
    "name": "さびた鉄くず",
    "attribute": "Earth",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5,
      "intelligence": 1
    }
  },
  {
    "id": "m_e1_2",
    "name": "泥だらけのボルト",
    "attribute": "Earth",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 6,
      "defense": 11,
      "agility": 3,
      "dexterity": 6,
      "intelligence": 1
    }
  },
  {
    "id": "m_e1_3",
    "name": "茶色の塗料",
    "attribute": "Earth",
    "rarity": 1,
    "price": 14,
    "baseStats": {
      "hp": 14,
      "power": 7,
      "defense": 12,
      "agility": 4,
      "dexterity": 7,
      "intelligence": 2
    }
  },
  {
    "id": "m_e1_4",
    "name": "欠けたレンガ",
    "attribute": "Earth",
    "rarity": 1,
    "price": 16,
    "baseStats": {
      "hp": 16,
      "power": 8,
      "defense": 13,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_e2_1",
    "name": "硬い岩石プレート",
    "attribute": "Earth",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 15,
      "defense": 20,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_e2_2",
    "name": "大地の結晶",
    "attribute": "Earth",
    "rarity": 2,
    "price": 54,
    "baseStats": {
      "hp": 24,
      "power": 17,
      "defense": 22,
      "agility": 6,
      "dexterity": 9,
      "intelligence": 2
    }
  },
  {
    "id": "m_e2_3",
    "name": "強化セラミック",
    "attribute": "Earth",
    "rarity": 2,
    "price": 58,
    "baseStats": {
      "hp": 28,
      "power": 19,
      "defense": 24,
      "agility": 7,
      "dexterity": 10,
      "intelligence": 3
    }
  },
  {
    "id": "m_e2_4",
    "name": "古代の地層石",
    "attribute": "Earth",
    "rarity": 2,
    "price": 62,
    "baseStats": {
      "hp": 32,
      "power": 21,
      "defense": 26,
      "agility": 8,
      "dexterity": 11,
      "intelligence": 3
    }
  },
  {
    "id": "m_e3_1",
    "name": "オリハルコンの欠片",
    "attribute": "Earth",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 30,
      "defense": 40,
      "agility": 10,
      "dexterity": 15,
      "intelligence": 5
    }
  },
  {
    "id": "m_e3_2",
    "name": "ガイアの心臓",
    "attribute": "Earth",
    "rarity": 3,
    "price": 156,
    "baseStats": {
      "hp": 46,
      "power": 33,
      "defense": 43,
      "agility": 11,
      "dexterity": 16,
      "intelligence": 5
    }
  },
  {
    "id": "m_e3_3",
    "name": "大樹の化石",
    "attribute": "Earth",
    "rarity": 3,
    "price": 162,
    "baseStats": {
      "hp": 52,
      "power": 36,
      "defense": 46,
      "agility": 12,
      "dexterity": 17,
      "intelligence": 6
    }
  },
  {
    "id": "m_e3_4",
    "name": "巨人の遺骨",
    "attribute": "Earth",
    "rarity": 3,
    "price": 168,
    "baseStats": {
      "hp": 58,
      "power": 39,
      "defense": 49,
      "agility": 13,
      "dexterity": 18,
      "intelligence": 6
    }
  },
  {
    "id": "m_f1_1",
    "name": "燃える歯車",
    "attribute": "Fire",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5,
      "intelligence": 1
    }
  },
  {
    "id": "m_f1_2",
    "name": "焦げたワイヤー",
    "attribute": "Fire",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 6,
      "defense": 11,
      "agility": 3,
      "dexterity": 6,
      "intelligence": 1
    }
  },
  {
    "id": "m_f1_3",
    "name": "赤い塗料",
    "attribute": "Fire",
    "rarity": 1,
    "price": 14,
    "baseStats": {
      "hp": 14,
      "power": 7,
      "defense": 12,
      "agility": 4,
      "dexterity": 7,
      "intelligence": 2
    }
  },
  {
    "id": "m_f1_4",
    "name": "灰まみれのネジ",
    "attribute": "Fire",
    "rarity": 1,
    "price": 16,
    "baseStats": {
      "hp": 16,
      "power": 8,
      "defense": 13,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_f2_1",
    "name": "高熱バーナー",
    "attribute": "Fire",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 15,
      "defense": 20,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_f2_2",
    "name": "マグマバッテリー",
    "attribute": "Fire",
    "rarity": 2,
    "price": 54,
    "baseStats": {
      "hp": 24,
      "power": 17,
      "defense": 22,
      "agility": 6,
      "dexterity": 9,
      "intelligence": 2
    }
  },
  {
    "id": "m_f2_3",
    "name": "真紅の装甲",
    "attribute": "Fire",
    "rarity": 2,
    "price": 58,
    "baseStats": {
      "hp": 28,
      "power": 19,
      "defense": 24,
      "agility": 7,
      "dexterity": 10,
      "intelligence": 3
    }
  },
  {
    "id": "m_f2_4",
    "name": "発火石",
    "attribute": "Fire",
    "rarity": 2,
    "price": 62,
    "baseStats": {
      "hp": 32,
      "power": 21,
      "defense": 26,
      "agility": 8,
      "dexterity": 11,
      "intelligence": 3
    }
  },
  {
    "id": "m_f3_1",
    "name": "ドラゴンの鱗",
    "attribute": "Fire",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 30,
      "defense": 40,
      "agility": 10,
      "dexterity": 15,
      "intelligence": 5
    }
  },
  {
    "id": "m_f3_2",
    "name": "太陽の炉心",
    "attribute": "Fire",
    "rarity": 3,
    "price": 156,
    "baseStats": {
      "hp": 46,
      "power": 33,
      "defense": 43,
      "agility": 11,
      "dexterity": 16,
      "intelligence": 5
    }
  },
  {
    "id": "m_f3_3",
    "name": "業火の結晶",
    "attribute": "Fire",
    "rarity": 3,
    "price": 162,
    "baseStats": {
      "hp": 52,
      "power": 36,
      "defense": 46,
      "agility": 12,
      "dexterity": 17,
      "intelligence": 6
    }
  },
  {
    "id": "m_f3_4",
    "name": "不死鳥の羽",
    "attribute": "Fire",
    "rarity": 3,
    "price": 168,
    "baseStats": {
      "hp": 58,
      "power": 39,
      "defense": 49,
      "agility": 13,
      "dexterity": 18,
      "intelligence": 6
    }
  },
  {
    "id": "m_w1_1",
    "name": "水冷チューブ",
    "attribute": "Water",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5,
      "intelligence": 1
    }
  },
  {
    "id": "m_w1_2",
    "name": "湿ったフィルター",
    "attribute": "Water",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 6,
      "defense": 11,
      "agility": 3,
      "dexterity": 6,
      "intelligence": 1
    }
  },
  {
    "id": "m_w1_3",
    "name": "青い塗料",
    "attribute": "Water",
    "rarity": 1,
    "price": 14,
    "baseStats": {
      "hp": 14,
      "power": 7,
      "defense": 12,
      "agility": 4,
      "dexterity": 7,
      "intelligence": 2
    }
  },
  {
    "id": "m_w1_4",
    "name": "錆びたバルブ",
    "attribute": "Water",
    "rarity": 1,
    "price": 16,
    "baseStats": {
      "hp": 16,
      "power": 8,
      "defense": 13,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_w2_1",
    "name": "高圧ポンプ",
    "attribute": "Water",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 15,
      "defense": 20,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_w2_2",
    "name": "永久氷晶",
    "attribute": "Water",
    "rarity": 2,
    "price": 54,
    "baseStats": {
      "hp": 24,
      "power": 17,
      "defense": 22,
      "agility": 6,
      "dexterity": 9,
      "intelligence": 2
    }
  },
  {
    "id": "m_w2_3",
    "name": "蒼海の合金",
    "attribute": "Water",
    "rarity": 2,
    "price": 58,
    "baseStats": {
      "hp": 28,
      "power": 19,
      "defense": 24,
      "agility": 7,
      "dexterity": 10,
      "intelligence": 3
    }
  },
  {
    "id": "m_w2_4",
    "name": "浄化フィルター",
    "attribute": "Water",
    "rarity": 2,
    "price": 62,
    "baseStats": {
      "hp": 32,
      "power": 21,
      "defense": 26,
      "agility": 8,
      "dexterity": 11,
      "intelligence": 3
    }
  },
  {
    "id": "m_w3_1",
    "name": "リヴァイアサンの牙",
    "attribute": "Water",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 30,
      "defense": 40,
      "agility": 10,
      "dexterity": 15,
      "intelligence": 5
    }
  },
  {
    "id": "m_w3_2",
    "name": "海神の涙",
    "attribute": "Water",
    "rarity": 3,
    "price": 156,
    "baseStats": {
      "hp": 46,
      "power": 33,
      "defense": 43,
      "agility": 11,
      "dexterity": 16,
      "intelligence": 5
    }
  },
  {
    "id": "m_w3_3",
    "name": "深海の秘宝",
    "attribute": "Water",
    "rarity": 3,
    "price": 162,
    "baseStats": {
      "hp": 52,
      "power": 36,
      "defense": 46,
      "agility": 12,
      "dexterity": 17,
      "intelligence": 6
    }
  },
  {
    "id": "m_w3_4",
    "name": "氷竜の逆鱗",
    "attribute": "Water",
    "rarity": 3,
    "price": 168,
    "baseStats": {
      "hp": 58,
      "power": 39,
      "defense": 49,
      "agility": 13,
      "dexterity": 18,
      "intelligence": 6
    }
  },
  {
    "id": "m_a1_1",
    "name": "軽いプロペラ",
    "attribute": "Wind",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5,
      "intelligence": 1
    }
  },
  {
    "id": "m_a1_2",
    "name": "ホコリまみれの羽",
    "attribute": "Wind",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 6,
      "defense": 11,
      "agility": 3,
      "dexterity": 6,
      "intelligence": 1
    }
  },
  {
    "id": "m_a1_3",
    "name": "緑の塗料",
    "attribute": "Wind",
    "rarity": 1,
    "price": 14,
    "baseStats": {
      "hp": 14,
      "power": 7,
      "defense": 12,
      "agility": 4,
      "dexterity": 7,
      "intelligence": 2
    }
  },
  {
    "id": "m_a1_4",
    "name": "風化した歯車",
    "attribute": "Wind",
    "rarity": 1,
    "price": 16,
    "baseStats": {
      "hp": 16,
      "power": 8,
      "defense": 13,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_a2_1",
    "name": "風切りモーター",
    "attribute": "Wind",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 15,
      "defense": 20,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_a2_2",
    "name": "エアロフレーム",
    "attribute": "Wind",
    "rarity": 2,
    "price": 54,
    "baseStats": {
      "hp": 24,
      "power": 17,
      "defense": 22,
      "agility": 6,
      "dexterity": 9,
      "intelligence": 2
    }
  },
  {
    "id": "m_a2_3",
    "name": "嵐の結晶",
    "attribute": "Wind",
    "rarity": 2,
    "price": 58,
    "baseStats": {
      "hp": 28,
      "power": 19,
      "defense": 24,
      "agility": 7,
      "dexterity": 10,
      "intelligence": 3
    }
  },
  {
    "id": "m_a2_4",
    "name": "竜巻のコア",
    "attribute": "Wind",
    "rarity": 2,
    "price": 62,
    "baseStats": {
      "hp": 32,
      "power": 21,
      "defense": 26,
      "agility": 8,
      "dexterity": 11,
      "intelligence": 3
    }
  },
  {
    "id": "m_a3_1",
    "name": "シルフの吐息",
    "attribute": "Wind",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 30,
      "defense": 40,
      "agility": 10,
      "dexterity": 15,
      "intelligence": 5
    }
  },
  {
    "id": "m_a3_2",
    "name": "天空のジェット",
    "attribute": "Wind",
    "rarity": 3,
    "price": 156,
    "baseStats": {
      "hp": 46,
      "power": 33,
      "defense": 43,
      "agility": 11,
      "dexterity": 16,
      "intelligence": 5
    }
  },
  {
    "id": "m_a3_3",
    "name": "飛竜の翼",
    "attribute": "Wind",
    "rarity": 3,
    "price": 162,
    "baseStats": {
      "hp": 52,
      "power": 36,
      "defense": 46,
      "agility": 12,
      "dexterity": 17,
      "intelligence": 6
    }
  },
  {
    "id": "m_a3_4",
    "name": "神風のエンジン",
    "attribute": "Wind",
    "rarity": 3,
    "price": 168,
    "baseStats": {
      "hp": 58,
      "power": 39,
      "defense": 49,
      "agility": 13,
      "dexterity": 18,
      "intelligence": 6
    }
  },
  {
    "id": "m_l1_1",
    "name": "小さな電球",
    "attribute": "Light",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5,
      "intelligence": 1
    }
  },
  {
    "id": "m_l1_2",
    "name": "断線したケーブル",
    "attribute": "Light",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 6,
      "defense": 11,
      "agility": 3,
      "dexterity": 6,
      "intelligence": 1
    }
  },
  {
    "id": "m_l1_3",
    "name": "黄色い塗料",
    "attribute": "Light",
    "rarity": 1,
    "price": 14,
    "baseStats": {
      "hp": 14,
      "power": 7,
      "defense": 12,
      "agility": 4,
      "dexterity": 7,
      "intelligence": 2
    }
  },
  {
    "id": "m_l1_4",
    "name": "割れたレンズ",
    "attribute": "Light",
    "rarity": 1,
    "price": 16,
    "baseStats": {
      "hp": 16,
      "power": 8,
      "defense": 13,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_l2_1",
    "name": "発光ダイオード",
    "attribute": "Light",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 15,
      "defense": 20,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_l2_2",
    "name": "ソーラーパネル",
    "attribute": "Light",
    "rarity": 2,
    "price": 54,
    "baseStats": {
      "hp": 24,
      "power": 17,
      "defense": 22,
      "agility": 6,
      "dexterity": 9,
      "intelligence": 2
    }
  },
  {
    "id": "m_l2_3",
    "name": "聖なるレンズ",
    "attribute": "Light",
    "rarity": 2,
    "price": 58,
    "baseStats": {
      "hp": 28,
      "power": 19,
      "defense": 24,
      "agility": 7,
      "dexterity": 10,
      "intelligence": 3
    }
  },
  {
    "id": "m_l2_4",
    "name": "光ファイバー",
    "attribute": "Light",
    "rarity": 2,
    "price": 62,
    "baseStats": {
      "hp": 32,
      "power": 21,
      "defense": 26,
      "agility": 8,
      "dexterity": 11,
      "intelligence": 3
    }
  },
  {
    "id": "m_l3_1",
    "name": "天使の光輪",
    "attribute": "Light",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 30,
      "defense": 40,
      "agility": 10,
      "dexterity": 15,
      "intelligence": 5
    }
  },
  {
    "id": "m_l3_2",
    "name": "神聖なるコア",
    "attribute": "Light",
    "rarity": 3,
    "price": 156,
    "baseStats": {
      "hp": 46,
      "power": 33,
      "defense": 43,
      "agility": 11,
      "dexterity": 16,
      "intelligence": 5
    }
  },
  {
    "id": "m_l3_3",
    "name": "太陽のプリズム",
    "attribute": "Light",
    "rarity": 3,
    "price": 162,
    "baseStats": {
      "hp": 52,
      "power": 36,
      "defense": 46,
      "agility": 12,
      "dexterity": 17,
      "intelligence": 6
    }
  },
  {
    "id": "m_l3_4",
    "name": "星の欠片",
    "attribute": "Light",
    "rarity": 3,
    "price": 168,
    "baseStats": {
      "hp": 58,
      "power": 39,
      "defense": 49,
      "agility": 13,
      "dexterity": 18,
      "intelligence": 6
    }
  },
  {
    "id": "m_d1_1",
    "name": "汚染された泥",
    "attribute": "Dark",
    "rarity": 1,
    "price": 10,
    "baseStats": {
      "hp": 10,
      "power": 5,
      "defense": 10,
      "agility": 2,
      "dexterity": 5,
      "intelligence": 1
    }
  },
  {
    "id": "m_d1_2",
    "name": "ノイズ基板",
    "attribute": "Dark",
    "rarity": 1,
    "price": 12,
    "baseStats": {
      "hp": 12,
      "power": 6,
      "defense": 11,
      "agility": 3,
      "dexterity": 6,
      "intelligence": 1
    }
  },
  {
    "id": "m_d1_3",
    "name": "紫の塗料",
    "attribute": "Dark",
    "rarity": 1,
    "price": 14,
    "baseStats": {
      "hp": 14,
      "power": 7,
      "defense": 12,
      "agility": 4,
      "dexterity": 7,
      "intelligence": 2
    }
  },
  {
    "id": "m_d1_4",
    "name": "呪いの呪符",
    "attribute": "Dark",
    "rarity": 1,
    "price": 16,
    "baseStats": {
      "hp": 16,
      "power": 8,
      "defense": 13,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_d2_1",
    "name": "呪われた歯車",
    "attribute": "Dark",
    "rarity": 2,
    "price": 50,
    "baseStats": {
      "hp": 20,
      "power": 15,
      "defense": 20,
      "agility": 5,
      "dexterity": 8,
      "intelligence": 2
    }
  },
  {
    "id": "m_d2_2",
    "name": "謎の黒い液",
    "attribute": "Dark",
    "rarity": 2,
    "price": 54,
    "baseStats": {
      "hp": 24,
      "power": 17,
      "defense": 22,
      "agility": 6,
      "dexterity": 9,
      "intelligence": 2
    }
  },
  {
    "id": "m_d2_3",
    "name": "シャドウフレーム",
    "attribute": "Dark",
    "rarity": 2,
    "price": 58,
    "baseStats": {
      "hp": 28,
      "power": 19,
      "defense": 24,
      "agility": 7,
      "dexterity": 10,
      "intelligence": 3
    }
  },
  {
    "id": "m_d2_4",
    "name": "闇の結晶",
    "attribute": "Dark",
    "rarity": 2,
    "price": 62,
    "baseStats": {
      "hp": 32,
      "power": 21,
      "defense": 26,
      "agility": 8,
      "dexterity": 11,
      "intelligence": 3
    }
  },
  {
    "id": "m_d3_1",
    "name": "悪魔の眼球",
    "attribute": "Dark",
    "rarity": 3,
    "price": 150,
    "baseStats": {
      "hp": 40,
      "power": 30,
      "defense": 40,
      "agility": 10,
      "dexterity": 15,
      "intelligence": 5
    }
  },
  {
    "id": "m_d3_2",
    "name": "虚無のリアクター",
    "attribute": "Dark",
    "rarity": 3,
    "price": 156,
    "baseStats": {
      "hp": 46,
      "power": 33,
      "defense": 43,
      "agility": 11,
      "dexterity": 16,
      "intelligence": 5
    }
  },
  {
    "id": "m_d3_3",
    "name": "深淵のコア",
    "attribute": "Dark",
    "rarity": 3,
    "price": 162,
    "baseStats": {
      "hp": 52,
      "power": 36,
      "defense": 46,
      "agility": 12,
      "dexterity": 17,
      "intelligence": 6
    }
  },
  {
    "id": "m_d3_4",
    "name": "冥界の鉱石",
    "attribute": "Dark",
    "rarity": 3,
    "price": 168,
    "baseStats": {
      "hp": 58,
      "power": 39,
      "defense": 49,
      "agility": 13,
      "dexterity": 18,
      "intelligence": 6
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
      "m_e1_1", "m_e1_2", "m_e1_3", "m_e1_4",
      "m_f1_1", "m_w1_1", "m_a1_1", "m_l1_1", "m_d1_1"
    ]
  },
  {
    "id": "loc2",
    "name": "灼熱の廃工場",
    "description": "火属性の素材が出やすい危険な工場。",
    "unlockCostG": 200,
    "baseTimeMs": 60000,
    "drops": [
      "m_f1_1", "m_f1_2", "m_f1_3", "m_f1_4",
      "m_f2_1", "m_f2_2", "m_f2_3", "m_f2_4",
      "m_e1_2", "m_d1_2"
    ]
  },
  {
    "id": "loc3",
    "name": "水没した都市遺跡",
    "description": "水属性の素材が眠る遺跡。",
    "unlockCostG": 500,
    "baseTimeMs": 120000,
    "drops": [
      "m_w1_1", "m_w1_2", "m_w1_3", "m_w1_4",
      "m_w2_1", "m_w2_2", "m_w2_3", "m_w2_4",
      "m_l1_2", "m_a1_2"
    ]
  },
  {
    "id": "loc4",
    "name": "風の谷の観測所",
    "description": "風属性の素材が集まる高台。",
    "unlockCostG": 1000,
    "baseTimeMs": 180000,
    "drops": [
      "m_a1_1", "m_a1_2", "m_a1_3", "m_a1_4",
      "m_a2_1", "m_a2_2", "m_a2_3", "m_a2_4",
      "m_l1_3"
    ]
  },
  {
    "id": "loc5",
    "name": "光の塔",
    "description": "光り輝く神秘の塔。",
    "unlockCostG": 2000,
    "baseTimeMs": 240000,
    "drops": [
      "m_l1_1", "m_l1_2", "m_l1_3", "m_l1_4",
      "m_l2_1", "m_l2_2", "m_l2_3", "m_l2_4",
      "m_w2_1", "m_e2_1"
    ]
  },
  {
    "id": "loc6",
    "name": "最果てのクレーター",
    "description": "レアな闇や大地の素材が見つかるかも…",
    "unlockCostG": 4000,
    "baseTimeMs": 300000,
    "drops": [
      "m_d2_1", "m_d2_2", "m_d2_3", "m_d2_4",
      "m_d3_1", "m_d3_2",
      "m_e2_3", "m_e2_4", "m_e3_1", "m_e3_2",
      "m_f3_1"
    ]
  },
  {
    "id": "loc7",
    "name": "古代文明の中枢",
    "description": "全ての属性の最高級素材が眠る伝説の地。",
    "unlockCostG": 10000,
    "baseTimeMs": 600000,
    "drops": [
      "m_e3_1", "m_e3_2", "m_e3_3", "m_e3_4",
      "m_f3_1", "m_f3_2", "m_f3_3", "m_f3_4",
      "m_w3_1", "m_w3_2", "m_w3_3", "m_w3_4",
      "m_a3_1", "m_a3_2", "m_a3_3", "m_a3_4",
      "m_l3_1", "m_l3_2", "m_l3_3", "m_l3_4",
      "m_d3_1", "m_d3_2", "m_d3_3", "m_d3_4"
    ]
  }
];

export interface CraftableVisualInfo {
  rarity: 1 | 2 | 3;
  visualIndex: number;
}

export function getMaterialCraftableVisuals(material: Material): CraftableVisualInfo[] {
  const match = material.id.match(/_([1-4])$/);
  const matIdx = match ? parseInt(match[1], 10) - 1 : 0; // 0, 1, 2, 3

  const results: CraftableVisualInfo[] = [];
  if (material.rarity === 1) {
    // 8種類固定 (部位ごとに2種類) -> 4つの素材で 2 * 4 = 8種類
    results.push({ rarity: 1, visualIndex: matIdx * 2 });
    results.push({ rarity: 1, visualIndex: matIdx * 2 + 1 });
  } else if (material.rarity === 2) {
    // ☆1が8種類固定(部位ごとに2種) + ☆2が4種類固定(部位ごとに1種)
    results.push({ rarity: 1, visualIndex: matIdx * 2 });
    results.push({ rarity: 1, visualIndex: matIdx * 2 + 1 });
    results.push({ rarity: 2, visualIndex: matIdx });
  } else if (material.rarity === 3) {
    // ☆2が8種類固定(部位ごとに2種) + ☆3が4種類固定(部位ごとに1種)
    results.push({ rarity: 2, visualIndex: matIdx * 2 });
    results.push({ rarity: 2, visualIndex: matIdx * 2 + 1 });
    results.push({ rarity: 3, visualIndex: matIdx });
  }
  return results;
}

export const MAX_STORAGE_LEVELS = [5, 10, 15, 20, 30, 50, 100];
export const STORAGE_UPGRADE_COST = [0, 500, 1500, 5000, 15000, 40000, 100000];
