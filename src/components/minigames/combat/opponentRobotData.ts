import { Robot, RobotPart, Attribute } from '../../../core/models';
import { Opponent } from '../Shared';

/**
 * 対戦相手（Opponent）のデータから、RobotVisualで描画可能なRobotモデルを生成する
 */
export function getOpponentRobotModel(opponent: Opponent): Robot {
  const createPart = (type: 'head' | 'body' | 'arms' | 'legs', name: string, attribute: Attribute, rarity: number, visualIndex: number): RobotPart => ({
    id: `opp_part_${opponent.id}_${type}`,
    type,
    name,
    attribute,
    rarity,
    stats: {
      hp: Math.floor(opponent.hp / 4),
      power: Math.floor(opponent.power / 4),
      defense: Math.floor(opponent.defense / 4),
      agility: Math.floor(opponent.agi / 4),
      dexterity: Math.floor(opponent.dex / 4),
      intelligence: Math.floor(opponent.int / 4),
    },
    visualIndex,
  });

  // 対戦相手に応じた固有パーツ・属性・外見インデックスの定義
  switch (opponent.id) {
    case 'op1': // ポンコツ試作機（町の発明家）: Earth属性、★1パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '試作アイユニット', 'Earth', 1, 0),
          body: createPart('body', 'ジャンクフレーム', 'Earth', 1, 1),
          arms: createPart('arms', 'ワイヤーアーム', 'Earth', 1, 0),
          legs: createPart('legs', '鉄くずローラー', 'Earth', 1, 1),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 100,
      };

    case 'op3': // 汎用作業ボット（アポロ重工）: Fire属性、★2重装パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '重工作業バイザー', 'Fire', 2, 1),
          body: createPart('body', '高炉アーマー', 'Fire', 2, 2),
          arms: createPart('arms', '油圧クローアーム', 'Fire', 2, 1),
          legs: createPart('legs', '高出力キャタピラ', 'Fire', 2, 0),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 200,
      };

    case 'op2': // ジャンク・スカベンジャー（廃品回収ギルド）: Earth/Wind、★1パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', 'リサイクルスコープ', 'Wind', 1, 2),
          body: createPart('body', '軽量鉄板パイプボディ', 'Earth', 1, 0),
          arms: createPart('arms', '回収用マジックハンド', 'Earth', 1, 2),
          legs: createPart('legs', 'バネ仕掛けジャンプ脚', 'Wind', 1, 0),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 150,
      };

    case 'op4': // 警邏パトロールボット（シティ警察機構）: Water属性、★2パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '警備センサーバイザー', 'Water', 2, 0),
          body: createPart('body', '防護強化装甲フレーム', 'Water', 2, 1),
          arms: createPart('arms', 'スタンロッド・ナックル', 'Water', 2, 0),
          legs: createPart('legs', '高速二足ホイール脚', 'Water', 2, 1),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 300,
      };

    case 'op5': // 戦術演算ユニット（ゼニス社）: Wind属性/Water属性、★2近未来パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '戦術センサーアイ', 'Wind', 2, 3),
          body: createPart('body', '軽量チタンコア', 'Wind', 2, 0),
          arms: createPart('arms', 'レーザーブレード', 'Water', 2, 2),
          legs: createPart('legs', '高機動バーニア脚', 'Wind', 2, 3),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 400,
      };

    case 'op6': // 重装機甲ストライカー（ネオ・ミリタリー）: Fire/Earth、★2重装パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', 'ミリタリーヘルメット', 'Fire', 2, 2),
          body: createPart('body', '爆発反応装甲シェル', 'Earth', 2, 3),
          arms: createPart('arms', 'ガトリングバレルアーム', 'Fire', 2, 3),
          legs: createPart('legs', '多脚ヘビースタビライザー', 'Earth', 2, 2),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 500,
      };

    case 'op7': // 高機動ファントム（シャドウ・ラボラトリー）: Dark/Wind、★3ステルスパーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', 'ファントムマスク', 'Dark', 3, 1),
          body: createPart('body', '光学迷彩ステルスフレーム', 'Dark', 3, 2),
          arms: createPart('arms', 'シャドウスライサー', 'Wind', 3, 1),
          legs: createPart('legs', '電磁浮遊シャドウステップ', 'Dark', 3, 2),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 650,
      };

    case 'op8': // 要塞ガーディアン（古代防衛システム）: Earth/Light、★3古代城塞パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '古代防壁クレスト', 'Light', 3, 2),
          body: createPart('body', '神殿大理石コア', 'Earth', 3, 0),
          arms: createPart('arms', '要塞バリアシールドアーム', 'Light', 3, 3),
          legs: createPart('legs', '城壁礎石ベース', 'Earth', 3, 1),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 800,
      };

    case 'op9': // サイバネティクス・カイザー（帝国兵器工廠）: Dark/Fire、★3漆黒皇帝パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '帝国皇帝クラウンマスク', 'Dark', 3, 3),
          body: createPart('body', 'ダークマター炉心ボディ', 'Dark', 3, 3),
          arms: createPart('arms', '深紅の破滅サーベルアーム', 'Fire', 3, 2),
          legs: createPart('legs', '覇王の大推力スラスター', 'Fire', 3, 3),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 1200,
      };

    case 'op10': // オメガ・マスター（世界AI協会）: Light/Dark属性、★3最高峰パーツ
    default:
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '神核オメガクラウン', 'Light', 3, 0),
          body: createPart('body', '光子リアクターチェスト', 'Light', 3, 1),
          arms: createPart('arms', '量子崩壊キャノンアーム', 'Dark', 3, 0),
          legs: createPart('legs', '次元浮遊グラビティレッグ', 'Light', 3, 0),
        },
        stats: {
          hp: opponent.hp,
          power: opponent.power,
          defense: opponent.defense,
          agility: opponent.agi,
          dexterity: opponent.dex,
          intelligence: opponent.int,
        },
        currentHp: opponent.hp,
        maxHp: opponent.hp,
        createdAt: 0,
        value: 2000,
      };
  }
}

/**
 * 各対戦相手のデフォルト遠征ステージ
 */
export const OPPONENT_DEFAULT_STAGES: Record<string, { locId: string; name: string }> = {
  op1: { locId: 'loc1', name: '裏山のスクラップ場' },
  op2: { locId: 'loc2', name: '廃棄された工場区画' },
  op3: { locId: 'loc3', name: '灼熱の火山' },
  op4: { locId: 'loc5', name: '霧深き湖畔' },
  op5: { locId: 'loc4', name: '風の谷' },
  op6: { locId: 'loc3', name: '高熱採掘プラント' },
  op7: { locId: 'loc6', name: '極夜の凍原' },
  op8: { locId: 'loc7', name: '古代文明の中枢' },
  op9: { locId: 'loc8', name: '星屑の観測所' },
  op10: { locId: 'loc7', name: 'オメガ・コア' },
};
