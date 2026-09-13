import { MATERIALS } from '../../core/data';
import { Material } from '../../core/models';

/**
 * 宝箱から獲得可能な報酬アイテムの個別情報
 */
export interface BattleRewardItem {
  id: string;
  type: 'repairKit' | 'gold' | 'element' | 'material' | 'fame';
  name: string;
  count: number;
  iconType: 'kit' | 'gold' | 'element' | 'material' | 'fame';
  rarity?: number;
  material?: Material;
  desc?: string;
}

/**
 * 宝箱開封ドロップ結果オブジェクト
 */
export interface BattleChestDropResult {
  gameMode: 'combat' | 'defense' | 'danmaku' | 'piano' | 'other';
  stageLevel: number;
  stageName: string;
  chestTier: 'bronze' | 'silver' | 'gold' | 'mythic';
  chestTitle: string;
  repairKits: number;
  gold: number;
  elements: number;
  materials: { material: Material; count: number }[];
  fame: number;
  items: BattleRewardItem[];
}

/**
 * ランダムヘルパー
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkRate(percentage: number): boolean {
  return Math.random() * 100 < percentage;
}

function pickRandomMaterial(rarity: 1 | 2 | 3): Material | null {
  const candidates = MATERIALS.filter(m => m.rarity === rarity);
  if (candidates.length === 0) return null;
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

/**
 * バトル勝利宝箱 報酬生成サービスクラス (OOP原則)
 */
export class BattleChestRewardService {
  /**
   * バトル演習 (1on1 Combat) の勝利宝箱抽選
   */
  public static rollCombatChest(level: number, stageName: string, baseFame: number): BattleChestDropResult {
    let repairKits = 0;
    let gold = 0;
    let elements = 0;
    const materials: { material: Material; count: number }[] = [];
    const items: BattleRewardItem[] = [];

    // レベル別の宝箱グレード決定
    let chestTier: 'bronze' | 'silver' | 'gold' | 'mythic' = 'bronze';
    let chestTitle = '古びた鉄の宝箱';

    if (level <= 2) {
      chestTier = 'bronze';
      chestTitle = '古びた鉄の宝箱';
    } else if (level <= 4) {
      chestTier = 'silver';
      chestTitle = '堅牢な銀の宝箱';
    } else if (level <= 8) {
      chestTier = 'gold';
      chestTitle = '燦然たる黄金の宝箱';
    } else {
      chestTier = 'mythic';
      chestTitle = '神話のプリズム宝箱';
    }

    // 仕様通りの確率ドロップ抽選（Lv.4以下はいずれか1つの報酬が必ず出現）
    switch (level) {
      case 1: {
        // 修理キット1個10%、☆1素材80%、1〜5G10%（いずれか1つの報酬が必ず出現）
        const roll1 = Math.random() * 100;
        if (roll1 < 10) {
          
        } else if (roll1 < 90) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            
          }
        } else {
          gold += randomInt(1, 5);
        }
        break;
      }

      case 2: {
        // 修理キット1個30%、☆1素材70%、2〜7G10%（重み比率 30:70:10 でいずれか1つの報酬が必ず出現）
        const roll2 = Math.random() * (30 + 70 + 10);
        if (roll2 < 30) {
          
        } else if (roll2 < 30 + 70) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            
          }
        } else {
          gold += randomInt(2, 7);
        }
        break;
      }

      case 3: {
        // 修理キット1個50%、☆1素材40%、3〜9G10%（いずれか1つの報酬が必ず出現）
        const roll3 = Math.random() * 100;
        if (roll3 < 50) {
          
        } else if (roll3 < 90) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            
          }
        } else {
          gold += randomInt(3, 9);
        }
        break;
      }

      case 4: {
        // 修理キット1個75%、☆1素材20%、4〜11G10%（重み比率 75:20:10 でいずれか1つの報酬が必ず出現）
        const roll4 = Math.random() * (75 + 20 + 10);
        if (roll4 < 75) {
          
        } else if (roll4 < 75 + 20) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            
          }
        } else {
          gold += randomInt(4, 11);
        }
        break;
      }

      case 5:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材50%、☆2素材10%、エレメント1〜5個50%、5〜13G10%
        
        if (checkRate(50)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(10)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(1, 5);
        if (checkRate(10)) gold += randomInt(5, 13);
        break;

      case 6:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材75%、☆2素材25%、エレメント5〜10個50%、6〜15G10%
        
        if (checkRate(75)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(25)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(5, 10);
        if (checkRate(10)) gold += randomInt(6, 15);
        break;

      case 7:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材75%、☆2素材40%、☆3素材10%、エレメント10〜15個50%、7〜18G10%
        
        if (checkRate(75)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(40)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(10)) {
          const mat3 = pickRandomMaterial(3);
          if (mat3) materials.push({ material: mat3, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(10, 15);
        if (checkRate(10)) gold += randomInt(7, 18);
        break;

      case 8:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材75%、☆2素材75%、☆3素材30%、エレメント15〜30個50%、8〜21G10%
        
        if (checkRate(75)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(75)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(30)) {
          const mat3 = pickRandomMaterial(3);
          if (mat3) materials.push({ material: mat3, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(15, 30);
        if (checkRate(10)) gold += randomInt(8, 21);
        break;

      case 9:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材75%、☆2素材75%、☆3素材50%、エレメント30〜60個50%、9〜25G10%
        
        if (checkRate(75)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(75)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(50)) {
          const mat3 = pickRandomMaterial(3);
          if (mat3) materials.push({ material: mat3, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(30, 60);
        if (checkRate(10)) gold += randomInt(9, 25);
        break;

      case 10:
      default:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材75%、☆2素材75%、☆3素材75%、エレメント60〜120個50%、10〜30G10%
        
        if (checkRate(75)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(75)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(75)) {
          const mat3 = pickRandomMaterial(3);
          if (mat3) materials.push({ material: mat3, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(60, 120);
        if (checkRate(10)) gold += randomInt(10, 30);
        break;
    }

    // レベル4以下で万が一報酬が0個だった場合の最低保証ガード（いずれか1つの報酬を確実に保証）
    if (level <= 4 && gold === 0 && materials.length === 0) { gold = randomInt(5, 10); }

    // items 配列の構築
    if (repairKits > 0) {
      items.push({
        id: 'kit',
        type: 'repairKit',
        name: '修理キット',
        count: repairKits,
        iconType: 'kit',
        desc: '破損したロボットパーツの修理に使用'
      });
    }

    if (gold > 0) {
      items.push({
        id: 'gold',
        type: 'gold',
        name: 'ゴールド (G)',
        count: gold,
        iconType: 'gold',
        desc: '工房の運転資金'
      });
    }

    if (elements > 0) {
      items.push({
        id: 'element',
        type: 'element',
        name: 'バトルエレメント',
        count: elements,
        iconType: 'element',
        desc: '戦闘装備交換に使用する高密度エネルギー結晶'
      });
    }

    for (let i = 0; i < materials.length; i++) {
      const entry = materials[i];
      items.push({
        id: `mat_${entry.material.id}_${i}`,
        type: 'material',
        name: entry.material.name,
        count: entry.count,
        iconType: 'material',
        material: entry.material,
        rarity: entry.material.rarity,
        desc: `☆${entry.material.rarity} ${entry.material.attribute}属性 クラフト素材`
      });
    }

    // 名声の獲得（今のまま）
    if (baseFame > 0) {
      items.push({
        id: 'fame',
        type: 'fame',
        name: '工房名声',
        count: baseFame,
        iconType: 'fame',
        desc: '工房の知名度・ランク向上に貢献'
      });
    }

    return {
      gameMode: 'combat',
      stageLevel: level,
      stageName,
      chestTier,
      chestTitle,
      repairKits,
      gold,
      elements,
      materials,
      fame: baseFame,
      items
    };
  }

  /**
   * 拠点防衛戦 (Defense) の勝利宝箱抽選
   */
  public static rollDefenseChest(level: number, stageName: string): BattleChestDropResult {
    let repairKits = 0; // 全レベル修理キット1個100%確定
    let gold = 0;
    let elements = 0;
    const materials: { material: Material; count: number }[] = [];
    const items: BattleRewardItem[] = [];

    // 防衛戦の名声: レベル3で+5、レベル4で+10、レベル5で+15 (Lv1,2は0)
    let fame = 0;
    if (level === 3) fame = 5;
    else if (level === 4) fame = 10;
    else if (level >= 5) fame = 15;

    let chestTier: 'bronze' | 'silver' | 'gold' | 'mythic' = 'silver';
    let chestTitle = '防衛補給コンテナ';

    switch (level) {
      case 1:
        // レベル1:修理キット1個100%
        chestTier = 'bronze';
        chestTitle = '防衛戦 初級補給コンテナ';
        break;

      case 2:
        // レベル2:修理キット1個100%、プラス次のものが確率で出現、修理キット1個50%、5〜10G10%
        chestTier = 'silver';
        chestTitle = '前線警戒 補給コンテナ';
        if (checkRate(50)) 
        if (checkRate(10)) gold += randomInt(5, 10);
        break;

      case 3:
        // レベル3:修理キット1個100%、プラス次のものが確率で出現、修理キット1〜2個50%、エレメント1〜10個50%、10〜15G10%
        chestTier = 'silver';
        chestTitle = '要衝防衛 作戦資材コンテナ';
        if (checkRate(50)) 
        if (checkRate(50)) elements += randomInt(1, 10);
        if (checkRate(10)) gold += randomInt(10, 15);
        break;

      case 4:
        // レベル4:修理キット1個100%、プラス次のものが確率で出現、修理キット1〜3個50%、エレメント10〜30個50%、15〜30G10%
        chestTier = 'gold';
        chestTitle = '激戦ライン 司令官補給箱';
        if (checkRate(50)) 
        if (checkRate(50)) elements += randomInt(10, 30);
        if (checkRate(10)) gold += randomInt(15, 30);
        break;

      case 5:
      default:
        // レベル5:修理キット1個100%、プラス次のものが確率で出現、修理キット1〜4個50%、エレメント30〜120個50%、30〜120G10%
        chestTier = 'mythic';
        chestTitle = '終焉防壁 至高の軍需コンテナ';
        if (checkRate(50)) 
        if (checkRate(50)) elements += randomInt(30, 120);
        if (checkRate(10)) gold += randomInt(30, 120);
        break;
    }

    if (repairKits > 0) {
      items.push({
        id: 'kit',
        type: 'repairKit',
        name: '修理キット',
        count: repairKits,
        iconType: 'kit',
        desc: '破損したロボットパーツの修理に使用'
      });
    }

    if (gold > 0) {
      items.push({
        id: 'gold',
        type: 'gold',
        name: 'ゴールド (G)',
        count: gold,
        iconType: 'gold',
        desc: '防衛報奨金'
      });
    }

    if (elements > 0) {
      items.push({
        id: 'element',
        type: 'element',
        name: 'バトルエレメント',
        count: elements,
        iconType: 'element',
        desc: '戦闘装備交換に使用する高密度エネルギー結晶'
      });
    }

    if (fame > 0) {
      items.push({
        id: 'fame',
        type: 'fame',
        name: '工房名声',
        count: fame,
        iconType: 'fame',
        desc: '防衛功績による工房知名度向上'
      });
    }

    return {
      gameMode: 'defense',
      stageLevel: level,
      stageName,
      chestTier,
      chestTitle,
      repairKits,
      gold,
      elements,
      materials,
      fame,
      items
    };
  }

  /**
   * 弾幕サバイバル (Danmaku Survival) のクリア宝箱抽選
   * （名声は獲得なし・難易度に応じた修理キット、ゴールド、素材、エレメント等の宝箱ドロップ）
   */
  public static rollDanmakuChest(
    difficulty: 'easy' | 'normal' | 'hard',
    difficultyName: string
  ): BattleChestDropResult {
    let repairKits = 0;
    let gold = 0;
    let elements = 0;
    const materials: { material: Material; count: number }[] = [];
    const items: BattleRewardItem[] = [];

    let level = 1;
    let chestTier: 'bronze' | 'silver' | 'gold' = 'bronze';
    let chestTitle = '弾幕サバイバル 初級コンテナ';

    switch (difficulty) {
      case 'easy':
        level = 1;
        chestTier = 'bronze';
        chestTitle = '回避訓練 初級コンテナ';
        // 修理キット1個100%、1〜5G (50%)、☆1素材 (40%)
        repairKits = 0;
        if (checkRate(50)) gold += randomInt(1, 5);
        if (checkRate(40)) {
          const mat = pickRandomMaterial(1);
          if (mat) materials.push({ material: mat, count: 1 });
        }
        break;

      case 'normal':
        level = 2;
        chestTier = 'silver';
        chestTitle = '弾幕突破 中級コンテナ';
        // 修理キット1個100%、プラス修理キット1個 (30%)、3〜8G (60%)、☆1素材 (70%)、☆2素材 (30%)
        repairKits = 0;
        if (checkRate(30)) 
        if (checkRate(60)) gold += randomInt(3, 8);
        if (checkRate(70)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(30)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        break;

      case 'hard':
      default:
        level = 3;
        chestTier = 'gold';
        chestTitle = '極限弾幕 上級プレミアムコンテナ';
        // 修理キット2個100%、プラス修理キット1〜2個 (50%)、10〜25G (70%)、☆2素材 (75%)、☆3素材 (35%)、エレメント10〜20個 (50%)
        repairKits = 0;
        if (checkRate(50)) 
        if (checkRate(70)) gold += randomInt(10, 25);
        if (checkRate(75)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(35)) {
          const mat3 = pickRandomMaterial(3);
          if (mat3) materials.push({ material: mat3, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(10, 20);
        break;
    }

    if (repairKits > 0) {
      items.push({
        id: 'kit',
        type: 'repairKit',
        name: '修理キット',
        count: repairKits,
        iconType: 'kit',
        desc: '破損したロボットパーツの修理に使用'
      });
    }

    if (gold > 0) {
      items.push({
        id: 'gold',
        type: 'gold',
        name: 'ゴールド (G)',
        count: gold,
        iconType: 'gold',
        desc: '弾幕サバイバル報奨金'
      });
    }

    if (elements > 0) {
      items.push({
        id: 'element',
        type: 'element',
        name: 'バトルエレメント',
        count: elements,
        iconType: 'element',
        desc: '戦闘装備交換に使用する高密度エネルギー結晶'
      });
    }

    for (let i = 0; i < materials.length; i++) {
      const entry = materials[i];
      items.push({
        id: `mat_${entry.material.id}_${i}`,
        type: 'material',
        name: entry.material.name,
        count: entry.count,
        iconType: 'material',
        material: entry.material,
        rarity: entry.material.rarity,
        desc: `☆${entry.material.rarity} ${entry.material.attribute}属性 クラフト素材`
      });
    }

    return {
      gameMode: 'danmaku',
      stageLevel: level,
      stageName: `弾幕よけ (${difficultyName})`,
      chestTier,
      chestTitle,
      repairKits,
      gold,
      elements,
      materials,
      fame: 0, // 弾幕よけは名声獲得なし
      items
    };
  }

  /**
   * 弾幕サバイバルやピアノなど他ミニゲーム用宝箱
   */
  public static rollGenericChest(
    mode: 'danmaku' | 'piano' | 'other',
    level: number,
    stageName: string,
    repairKits: number,
    fame: number
  ): BattleChestDropResult {
    const items: BattleRewardItem[] = [];

    if (repairKits > 0) {
      items.push({
        id: 'kit',
        type: 'repairKit',
        name: '修理キット',
        count: repairKits,
        iconType: 'kit',
        desc: '破損したロボットパーツの修理に使用'
      });
    }

    if (fame > 0) {
      items.push({
        id: 'fame',
        type: 'fame',
        name: '工房名声',
        count: fame,
        iconType: 'fame',
        desc: '演習達成による工房知名度向上'
      });
    }

    return {
      gameMode: mode,
      stageLevel: level,
      stageName,
      chestTier: level >= 3 ? 'gold' : level >= 2 ? 'silver' : 'bronze',
      chestTitle: `${stageName} クリア宝箱`,
      repairKits,
      gold: 0,
      elements: 0,
      materials: [],
      fame,
      items
    };
  }
}
