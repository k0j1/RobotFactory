import { MATERIALS } from '../../core/data';
import { Material } from '../../core/models';
import { DANMAKU_ITEMS, DanmakuItemId, DanmakuItemDef } from '../../core/danmakuItemData';

/**
 * 宝箱から獲得可能な報酬アイテムの個別情報
 */
export interface BattleRewardItem {
  id: string;
  type: 'repairKit' | 'element' | 'material' | 'fame' | 'danmakuItem';
  name: string;
  count: number;
  iconType: 'kit' | 'element' | 'material' | 'fame' | 'danmakuBarrier' | 'danmakuLife';
  rarity?: number;
  material?: Material;
  danmakuItem?: DanmakuItemDef;
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
  gold: number; // 互換性維持のためフィールド残存（常に0）
  elements: number;
  materials: { material: Material; count: number }[];
  danmakuItems: { item: DanmakuItemDef; count: number }[];
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
 * レベルに応じた弾幕よけアイテム（バリアI〜III / ライフ増加+1〜+3）を抽選
 * ※高ランクの出現率を控えめに設定
 */
function pickRandomDanmakuItemByLevel(level: number): DanmakuItemDef {
  let pool: DanmakuItemId[] = ['barrier_1', 'life_1'];
  if (level <= 2) {
    pool = ['barrier_1', 'life_1'];
  } else if (level <= 4) {
    // ランク1が85%、ランク2が15%
    pool = checkRate(85) ? ['barrier_1', 'life_1'] : ['barrier_2', 'life_2'];
  } else if (level <= 7) {
    // ランク1が60%、ランク2が35%、ランク3が5%
    const r = Math.random() * 100;
    if (r < 60) pool = ['barrier_1', 'life_1'];
    else if (r < 95) pool = ['barrier_2', 'life_2'];
    else pool = ['barrier_3', 'life_3'];
  } else {
    // Lv.8〜10: ランク1が30%、ランク2が50%、ランク3が20%
    const r = Math.random() * 100;
    if (r < 30) pool = ['barrier_1', 'life_1'];
    else if (r < 80) pool = ['barrier_2', 'life_2'];
    else pool = ['barrier_3', 'life_3'];
  }
  const chosenId = pool[Math.floor(Math.random() * pool.length)];
  return DANMAKU_ITEMS[chosenId];
}

function addDanmakuDrop(list: { item: DanmakuItemDef; count: number }[], itemDef: DanmakuItemDef, count: number = 1) {
  const existing = list.find(d => d.item.id === itemDef.id);
  if (existing) {
    existing.count += count;
  } else {
    list.push({ item: itemDef, count });
  }
}

/**
 * バトル勝利宝箱 報酬生成サービスクラス (OOP原則)
 */
export class BattleChestRewardService {
  /**
   * バトル演習 (1on1 Combat) 等の勝利宝箱抽選
   * ※宝箱からはゴールドは一切出現せず、代わりに弾幕よけ専用アイテム（バリア・ライフ増加）が低確率で出現します
   */
  public static rollCombatChest(level: number, stageName: string, baseFame: number): BattleChestDropResult {
    let repairKits = 0;
    const gold = 0;
    let elements = 0;
    const materials: { material: Material; count: number }[] = [];
    const danmakuItems: { item: DanmakuItemDef; count: number }[] = [];
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

    // 仕様通りの確率ドロップ抽選（ゴールドの代わりに弾幕よけ専用アイテムが低確率で出現）
    switch (level) {
      case 1: {
        // 修理キット1個10%、☆1素材85%、弾幕よけアイテム5%（いずれか1つの報酬が必ず出現）
        const roll1 = Math.random() * 100;
        if (roll1 < 10) {
          repairKits += 1;
        } else if (roll1 < 95) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(1), 1);
          }
        } else {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(1), 1);
        }
        break;
      }

      case 2: {
        // 修理キット1個30%、☆1素材65%、弾幕よけアイテム5%
        const roll2 = Math.random() * 100;
        if (roll2 < 30) {
          repairKits += 1;
        } else if (roll2 < 95) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(2), 1);
          }
        } else {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(2), 1);
        }
        break;
      }

      case 3: {
        // 修理キット1個50%、☆1素材42%、弾幕よけアイテム8%
        const roll3 = Math.random() * 100;
        if (roll3 < 50) {
          repairKits += 1;
        } else if (roll3 < 92) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(3), 1);
          }
        } else {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(3), 1);
        }
        break;
      }

      case 4: {
        // 修理キット1個65%、☆1素材27%、弾幕よけアイテム8%
        const roll4 = Math.random() * 100;
        if (roll4 < 65) {
          repairKits += 1;
        } else if (roll4 < 92) {
          const mat = pickRandomMaterial(1);
          if (mat) {
            materials.push({ material: mat, count: 1 });
          } else {
            addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(4), 1);
          }
        } else {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(4), 1);
        }
        break;
      }

      case 5:
        // 修理キット1個は必ず出現、プラス次のものが確率で出現、☆1素材50%、☆2素材10%、エレメント1〜5個50%、弾幕よけアイテム10%
        repairKits += 1;
        if (checkRate(50)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(10)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(1, 5);
        if (checkRate(10)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(5), 1);
        break;

      case 6:
        // 修理キット1個は必ず出現、プラス☆1素材75%、☆2素材25%、エレメント5〜10個50%、弾幕よけアイテム12%
        repairKits += 1;
        if (checkRate(75)) {
          const mat1 = pickRandomMaterial(1);
          if (mat1) materials.push({ material: mat1, count: 1 });
        }
        if (checkRate(25)) {
          const mat2 = pickRandomMaterial(2);
          if (mat2) materials.push({ material: mat2, count: 1 });
        }
        if (checkRate(50)) elements += randomInt(5, 10);
        if (checkRate(12)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(6), 1);
        break;

      case 7:
        // 修理キット1個は必ず出現、プラス☆1素材75%、☆2素材40%、☆3素材10%、エレメント10〜15個50%、弾幕よけアイテム15%
        repairKits += 1;
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
        if (checkRate(15)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(7), 1);
        break;

      case 8:
        // 修理キット1個は必ず出現、プラス☆1素材75%、☆2素材75%、☆3素材30%、エレメント15〜30個50%、弾幕よけアイテム18%
        repairKits += 1;
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
        if (checkRate(18)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(8), 1);
        break;

      case 9:
        // 修理キット1個は必ず出現、プラス☆1素材75%、☆2素材75%、☆3素材50%、エレメント30〜60個50%、弾幕よけアイテム20%
        repairKits += 1;
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
        if (checkRate(20)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(9), 1);
        break;

      case 10:
      default:
        // 修理キット1個は必ず出現、プラス☆1素材75%、☆2素材75%、☆3素材75%、エレメント60〜120個50%、弾幕よけアイテム25%
        repairKits += 1;
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
        if (checkRate(25)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(10), 1);
        break;
    }

    // レベル4以下で万が一報酬が0個だった場合の最低保証ガード（☆1素材または修理キットを優先保証）
    if (level <= 4 && repairKits === 0 && materials.length === 0 && danmakuItems.length === 0) {
      const mat = pickRandomMaterial(1);
      if (mat) {
        materials.push({ material: mat, count: 1 });
      } else {
        repairKits += 1;
      }
    }

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

    if (elements > 0) {
      items.push({
        id: 'element',
        type: 'element',
        name: 'バトルエレメント',
        count: elements,
        iconType: 'element',
        desc: '戦闘装備や弾幕よけアイテム交換に使用する高密度エネルギー結晶'
      });
    }

    for (let i = 0; i < danmakuItems.length; i++) {
      const entry = danmakuItems[i];
      if (!entry || !entry.item) continue;
      items.push({
        id: `danmaku_${entry.item.id}_${i}`,
        type: 'danmakuItem',
        name: entry.item.name,
        count: entry.count,
        iconType: entry.item.category === 'barrier' ? 'danmakuBarrier' : 'danmakuLife',
        rarity: entry.item.rank,
        danmakuItem: entry.item,
        desc: entry.item.desc
      });
    }

    for (let i = 0; i < materials.length; i++) {
      const entry = materials[i];
      if (!entry || !entry.material) continue;
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

    // 名声の獲得
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
      danmakuItems,
      fame: baseFame,
      items
    };
  }

  /**
   * 拠点防衛戦 (Defense) の勝利宝箱抽選
   * ※ゴールドは出現せず、代わりに弾幕よけ専用アイテムが出現します
   */
  public static rollDefenseChest(level: number, stageName: string): BattleChestDropResult {
    let repairKits = 0; // 全レベル修理キット1個100%確定
    const gold = 0;
    let elements = 0;
    const materials: { material: Material; count: number }[] = [];
    const danmakuItems: { item: DanmakuItemDef; count: number }[] = [];
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
        // レベル1: 修理キット1個100%、弾幕よけアイテム8%
        chestTier = 'bronze';
        chestTitle = '防衛戦 初級補給コンテナ';
        repairKits = 1;
        if (checkRate(8)) {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(2), 1);
        }
        break;

      case 2:
        // レベル2: 修理キット1個100%、プラス修理キット1個50%、弾幕よけアイテム12%
        chestTier = 'silver';
        chestTitle = '前線警戒 補給コンテナ';
        repairKits = 1;
        if (checkRate(50)) {
          repairKits += 1;
        }
        if (checkRate(12)) {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(4), 1);
        }
        break;

      case 3:
        // レベル3: 修理キット1個100%、プラス修理キット1〜2個50%、エレメント1〜10個50%、弾幕よけアイテム15%
        chestTier = 'silver';
        chestTitle = '要衝防衛 作戦資材コンテナ';
        repairKits = 1;
        if (checkRate(50)) {
          repairKits += randomInt(1, 2);
        }
        if (checkRate(50)) {
          elements += randomInt(1, 10);
        }
        if (checkRate(15)) {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(6), 1);
        }
        break;

      case 4:
        // レベル4: 修理キット1個100%、プラス修理キット1〜3個50%、エレメント10〜30個50%、弾幕よけアイテム20%
        chestTier = 'gold';
        chestTitle = '激戦ライン 司令官補給箱';
        repairKits = 1;
        if (checkRate(50)) {
          repairKits += randomInt(1, 3);
        }
        if (checkRate(50)) {
          elements += randomInt(10, 30);
        }
        if (checkRate(20)) {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(8), 1);
        }
        break;

      case 5:
      default:
        // レベル5: 修理キット1個100%、プラス修理キット1〜4個50%、エレメント30〜120個50%、弾幕よけアイテム25%
        chestTier = 'mythic';
        chestTitle = '終焉防壁 至高の軍需コンテナ';
        repairKits = 1;
        if (checkRate(50)) {
          repairKits += randomInt(1, 4);
        }
        if (checkRate(50)) {
          elements += randomInt(30, 120);
        }
        if (checkRate(25)) {
          addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(10), 1);
        }
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

    if (elements > 0) {
      items.push({
        id: 'element',
        type: 'element',
        name: 'バトルエレメント',
        count: elements,
        iconType: 'element',
        desc: '戦闘装備や弾幕よけアイテム交換に使用する高密度エネルギー結晶'
      });
    }

    for (let i = 0; i < danmakuItems.length; i++) {
      const entry = danmakuItems[i];
      if (!entry || !entry.item) continue;
      items.push({
        id: `danmaku_${entry.item.id}_${i}`,
        type: 'danmakuItem',
        name: entry.item.name,
        count: entry.count,
        iconType: entry.item.category === 'barrier' ? 'danmakuBarrier' : 'danmakuLife',
        rarity: entry.item.rank,
        danmakuItem: entry.item,
        desc: entry.item.desc
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
      danmakuItems,
      fame,
      items
    };
  }

  /**
   * 弾幕サバイバル (Danmaku Survival) のクリア宝箱抽選
   * ※ゴールドは出現せず、代わりに弾幕よけ専用アイテムが出現します
   */
  public static rollDanmakuChest(
    difficulty: 'easy' | 'normal' | 'hard',
    difficultyName: string
  ): BattleChestDropResult {
    let repairKits = 0;
    const gold = 0;
    let elements = 0;
    const materials: { material: Material; count: number }[] = [];
    const danmakuItems: { item: DanmakuItemDef; count: number }[] = [];
    const items: BattleRewardItem[] = [];

    let level = 1;
    let chestTier: 'bronze' | 'silver' | 'gold' = 'bronze';
    let chestTitle = '弾幕サバイバル 初級コンテナ';

    switch (difficulty) {
      case 'easy':
        level = 1;
        chestTier = 'bronze';
        chestTitle = '回避訓練 初級コンテナ';
        // 修理キット1個100%、弾幕よけアイテム (10%)、☆1素材 (40%)
        repairKits = 1;
        if (checkRate(10)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(2), 1);
        if (checkRate(40)) {
          const mat = pickRandomMaterial(1);
          if (mat) materials.push({ material: mat, count: 1 });
        }
        break;

      case 'normal':
        level = 2;
        chestTier = 'silver';
        chestTitle = '弾幕突破 中級コンテナ';
        // 修理キット1個100%、プラス修理キット1個 (30%)、弾幕よけアイテム (18%)、☆1素材 (70%)、☆2素材 (30%)
        repairKits = 1;
        if (checkRate(30)) {
          repairKits += 1;
        }
        if (checkRate(18)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(5), 1);
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
        // 修理キット2個100%、プラス修理キット1〜2個 (50%)、弾幕よけアイテム (25%)、☆2素材 (75%)、☆3素材 (35%)、エレメント10〜20個 (50%)
        repairKits = 2;
        if (checkRate(50)) {
          repairKits += randomInt(1, 2);
        }
        if (checkRate(25)) addDanmakuDrop(danmakuItems, pickRandomDanmakuItemByLevel(9), 1);
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

    if (elements > 0) {
      items.push({
        id: 'element',
        type: 'element',
        name: 'バトルエレメント',
        count: elements,
        iconType: 'element',
        desc: '戦闘装備や弾幕よけアイテム交換に使用する高密度エネルギー結晶'
      });
    }

    for (let i = 0; i < danmakuItems.length; i++) {
      const entry = danmakuItems[i];
      if (!entry || !entry.item) continue;
      items.push({
        id: `danmaku_${entry.item.id}_${i}`,
        type: 'danmakuItem',
        name: entry.item.name,
        count: entry.count,
        iconType: entry.item.category === 'barrier' ? 'danmakuBarrier' : 'danmakuLife',
        rarity: entry.item.rank,
        danmakuItem: entry.item,
        desc: entry.item.desc
      });
    }

    for (let i = 0; i < materials.length; i++) {
      const entry = materials[i];
      if (!entry || !entry.material) continue;
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
      danmakuItems,
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
      danmakuItems: [],
      fame,
      items
    };
  }
}
