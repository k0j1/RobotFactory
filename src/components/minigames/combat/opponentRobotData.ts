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

    case 'op2': // 汎用作業ボット（アポロ工業）: Fire属性、★2重装パーツ
      return {
        id: opponent.id,
        name: opponent.name,
        parts: {
          head: createPart('head', '工業用バイザー', 'Fire', 2, 1),
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

    case 'op3': // 戦術演算ユニット（ゼニス社）: Wind属性/Water属性、★2近未来パーツ
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

    case 'op4': // オメガ・マスター（世界AI協会）: Light/Dark属性、★3最高峰パーツ
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
        value: 1000,
      };
  }
}

/**
 * 各対戦相手のデフォルト遠征ステージ
 */
export const OPPONENT_DEFAULT_STAGES: Record<string, { locId: string; name: string }> = {
  op1: { locId: 'loc1', name: '裏山のスクラップ場' },
  op2: { locId: 'loc3', name: '灼熱の火山' },
  op3: { locId: 'loc4', name: '風の谷' },
  op4: { locId: 'loc7', name: '古代文明の中枢' },
};
