import { PartType } from '../core/models';

export interface PartMasterData {
  id: string;
  name: string;
  partType: PartType;
  attribute: string;
  rarity: 1 | 2 | 3;
  visualIndex: number;
  stats: {
    hp: number;
    power: number;
    defense: number;
    agility: number;
    dexterity: number;
    intelligence: number;
  };
}

/**
 * master_parts テーブルの標準マスターデータシード
 */
export const DEFAULT_PARTS_MASTER: PartMasterData[] = [
  // Head: INT特化、他低め
  { id: 'h1_0', name: 'ベーシックヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 0, stats: { hp: 15, power: 3, defense: 10, agility: 10, dexterity: 10, intelligence: 35 } },
  { id: 'h1_1', name: 'ラウンドヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 1, stats: { hp: 16, power: 2, defense: 11, agility: 11, dexterity: 10, intelligence: 38 } },
  { id: 'h1_2', name: 'バイザーヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 2, stats: { hp: 14, power: 4, defense: 9, agility: 12, dexterity: 12, intelligence: 36 } },
  { id: 'h1_3', name: 'ボックスヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 3, stats: { hp: 18, power: 3, defense: 12, agility: 9, dexterity: 8, intelligence: 40 } },
  { id: 'h1_4', name: 'クラウンヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 4, stats: { hp: 12, power: 5, defense: 8, agility: 14, dexterity: 14, intelligence: 42 } },
  { id: 'h1_5', name: 'コーンヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 5, stats: { hp: 13, power: 5, defense: 7, agility: 15, dexterity: 13, intelligence: 45 } },
  { id: 'h1_6', name: 'シリンダーヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 6, stats: { hp: 15, power: 3, defense: 10, agility: 10, dexterity: 11, intelligence: 39 } },
  { id: 'h1_7', name: 'ホーンヘッド', partType: 'head', attribute: 'neutral', rarity: 1, visualIndex: 7, stats: { hp: 14, power: 6, defense: 9, agility: 11, dexterity: 12, intelligence: 41 } },
  { id: 'h2_0', name: 'デュアルアイヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 0, stats: { hp: 25, power: 8, defense: 16, agility: 18, dexterity: 18, intelligence: 65 } },
  { id: 'h2_1', name: 'センサーヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 1, stats: { hp: 22, power: 6, defense: 14, agility: 22, dexterity: 20, intelligence: 70 } },
  { id: 'h2_2', name: 'コマンドヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 2, stats: { hp: 28, power: 10, defense: 18, agility: 17, dexterity: 19, intelligence: 75 } },
  { id: 'h2_3', name: 'バトルヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 3, stats: { hp: 26, power: 11, defense: 15, agility: 20, dexterity: 18, intelligence: 72 } },
  { id: 'h2_4', name: 'ポッドツインヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 4, stats: { hp: 24, power: 9, defense: 15, agility: 21, dexterity: 20, intelligence: 70 } },
  { id: 'h2_5', name: 'フィントライヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 5, stats: { hp: 23, power: 8, defense: 14, agility: 24, dexterity: 19, intelligence: 73 } },
  { id: 'h2_6', name: 'デルタイヤーヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 6, stats: { hp: 25, power: 9, defense: 16, agility: 19, dexterity: 18, intelligence: 71 } },
  { id: 'h2_7', name: 'ラウンドバイザーヘッド', partType: 'head', attribute: 'neutral', rarity: 2, visualIndex: 7, stats: { hp: 26, power: 8, defense: 17, agility: 18, dexterity: 20, intelligence: 74 } },
  { id: 'h3_0', name: 'パラディンヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 0, stats: { hp: 40, power: 15, defense: 28, agility: 28, dexterity: 28, intelligence: 110 } },
  { id: 'h3_1', name: 'エンジェルヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 1, stats: { hp: 38, power: 14, defense: 25, agility: 32, dexterity: 32, intelligence: 120 } },
  { id: 'h3_2', name: 'ドラゴンヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 2, stats: { hp: 42, power: 18, defense: 26, agility: 30, dexterity: 26, intelligence: 115 } },
  { id: 'h3_3', name: 'サイクロプスヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 3, stats: { hp: 41, power: 17, defense: 25, agility: 29, dexterity: 27, intelligence: 118 } },
  { id: 'h3_4', name: 'トライアングルヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 4, stats: { hp: 39, power: 16, defense: 24, agility: 33, dexterity: 29, intelligence: 116 } },
  { id: 'h3_5', name: 'デルタサイクロプスヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 5, stats: { hp: 42, power: 17, defense: 27, agility: 30, dexterity: 28, intelligence: 119 } },
  { id: 'h3_6', name: 'オーブサイクロプスヘッド', partType: 'head', attribute: 'neutral', rarity: 3, visualIndex: 6, stats: { hp: 40, power: 16, defense: 26, agility: 31, dexterity: 30, intelligence: 117 } },

  // Body: HP(Vit)/Def高、他低め
  { id: 'b1_0', name: 'ベーシックボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 0, stats: { hp: 70, power: 5, defense: 25, agility: 4, dexterity: 4, intelligence: 5 } },
  { id: 'b1_1', name: 'ラウンドボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 1, stats: { hp: 75, power: 4, defense: 28, agility: 3, dexterity: 4, intelligence: 5 } },
  { id: 'b1_2', name: 'ヘビーボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 2, stats: { hp: 85, power: 6, defense: 35, agility: 2, dexterity: 3, intelligence: 4 } },
  { id: 'b1_3', name: 'バレルボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 3, stats: { hp: 80, power: 5, defense: 32, agility: 3, dexterity: 3, intelligence: 4 } },
  { id: 'b1_4', name: 'スリムボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 4, stats: { hp: 55, power: 5, defense: 18, agility: 8, dexterity: 6, intelligence: 6 } },
  { id: 'b1_5', name: 'ファーネスボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 5, stats: { hp: 78, power: 7, defense: 30, agility: 3, dexterity: 4, intelligence: 6 } },
  { id: 'b1_6', name: 'ダイヤボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 6, stats: { hp: 72, power: 4, defense: 38, agility: 4, dexterity: 5, intelligence: 5 } },
  { id: 'b1_7', name: 'エンジンボディ', partType: 'body', attribute: 'neutral', rarity: 1, visualIndex: 7, stats: { hp: 76, power: 8, defense: 28, agility: 5, dexterity: 5, intelligence: 5 } },
  { id: 'b2_0', name: 'ハイテクコアボディ', partType: 'body', attribute: 'neutral', rarity: 2, visualIndex: 0, stats: { hp: 120, power: 10, defense: 50, agility: 8, dexterity: 9, intelligence: 10 } },
  { id: 'b2_1', name: 'バイザーコアボディ', partType: 'body', attribute: 'neutral', rarity: 2, visualIndex: 1, stats: { hp: 115, power: 9, defense: 48, agility: 10, dexterity: 10, intelligence: 11 } },
  { id: 'b3_0', name: 'トライアングルコアボディ', partType: 'body', attribute: 'neutral', rarity: 3, visualIndex: 0, stats: { hp: 190, power: 16, defense: 85, agility: 14, dexterity: 15, intelligence: 16 } },

  // Arms: Pow/Dex高、他低め
  { id: 'a1_0', name: 'ベーシックアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 0, stats: { hp: 20, power: 25, defense: 10, agility: 8, dexterity: 20, intelligence: 5 } },
  { id: 'a1_1', name: 'ラウンドアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 1, stats: { hp: 22, power: 28, defense: 11, agility: 7, dexterity: 22, intelligence: 5 } },
  { id: 'a1_2', name: 'ヘビーアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 2, stats: { hp: 28, power: 35, defense: 14, agility: 5, dexterity: 18, intelligence: 4 } },
  { id: 'a1_3', name: 'クローアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 3, stats: { hp: 21, power: 32, defense: 9, agility: 9, dexterity: 25, intelligence: 5 } },
  { id: 'a1_4', name: 'レンチアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 4, stats: { hp: 24, power: 30, defense: 12, agility: 6, dexterity: 22, intelligence: 6 } },
  { id: 'a1_5', name: 'キャノンアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 5, stats: { hp: 25, power: 38, defense: 8, agility: 4, dexterity: 28, intelligence: 7 } },
  { id: 'a1_6', name: 'ブレードアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 6, stats: { hp: 19, power: 36, defense: 9, agility: 10, dexterity: 30, intelligence: 5 } },
  { id: 'a1_7', name: 'シールドアーム', partType: 'arms', attribute: 'neutral', rarity: 1, visualIndex: 7, stats: { hp: 30, power: 22, defense: 22, agility: 4, dexterity: 16, intelligence: 5 } },
  { id: 'a2_0', name: 'ナックルアーム', partType: 'arms', attribute: 'neutral', rarity: 2, visualIndex: 0, stats: { hp: 35, power: 55, defense: 18, agility: 12, dexterity: 45, intelligence: 10 } },
  { id: 'a2_1', name: 'サイバーアーム', partType: 'arms', attribute: 'neutral', rarity: 2, visualIndex: 1, stats: { hp: 32, power: 50, defense: 16, agility: 15, dexterity: 48, intelligence: 11 } },
  { id: 'a2_2', name: 'ヘビーアーム', partType: 'arms', attribute: 'neutral', rarity: 2, visualIndex: 2, stats: { hp: 42, power: 62, defense: 24, agility: 8, dexterity: 40, intelligence: 8 } },
  { id: 'a2_3', name: 'バスターアーム', partType: 'arms', attribute: 'neutral', rarity: 2, visualIndex: 3, stats: { hp: 38, power: 70, defense: 15, agility: 10, dexterity: 55, intelligence: 12 } },

  // Legs: Agi/Dex高、他低め
  { id: 'l1_0', name: 'ベーシックレッグ', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 0, stats: { hp: 25, power: 8, defense: 12, agility: 25, dexterity: 20, intelligence: 5 } },
  { id: 'l1_1', name: 'ホイールレッグ', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 1, stats: { hp: 20, power: 6, defense: 10, agility: 32, dexterity: 22, intelligence: 5 } },
  { id: 'l1_2', name: 'ヘビーレッグ', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 2, stats: { hp: 40, power: 14, defense: 22, agility: 15, dexterity: 12, intelligence: 4 } },
  { id: 'l1_3', name: 'ホバーレッグ', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 3, stats: { hp: 18, power: 5, defense: 9, agility: 36, dexterity: 26, intelligence: 6 } },
  { id: 'l1_4', name: '一輪ホイール', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 4, stats: { hp: 22, power: 7, defense: 11, agility: 30, dexterity: 23, intelligence: 5 } },
  { id: 'l1_5', name: 'トライポッド', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 5, stats: { hp: 32, power: 10, defense: 18, agility: 22, dexterity: 18, intelligence: 5 } },
  { id: 'l1_6', name: 'スプリングレッグ', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 6, stats: { hp: 20, power: 8, defense: 10, agility: 28, dexterity: 24, intelligence: 5 } },
  { id: 'l1_7', name: 'クアッドレッグ', partType: 'legs', attribute: 'neutral', rarity: 1, visualIndex: 7, stats: { hp: 35, power: 12, defense: 20, agility: 20, dexterity: 16, intelligence: 5 } },
  { id: 'l2_0', name: 'サイバーツインレッグ', partType: 'legs', attribute: 'neutral', rarity: 2, visualIndex: 0, stats: { hp: 45, power: 18, defense: 25, agility: 45, dexterity: 40, intelligence: 10 } },
  { id: 'l2_1', name: 'サイバーレッグ', partType: 'legs', attribute: 'neutral', rarity: 2, visualIndex: 1, stats: { hp: 40, power: 16, defense: 22, agility: 52, dexterity: 44, intelligence: 11 } },
  { id: 'l2_2', name: 'スプリングガード', partType: 'legs', attribute: 'neutral', rarity: 2, visualIndex: 2, stats: { hp: 50, power: 20, defense: 30, agility: 38, dexterity: 35, intelligence: 9 } },
  { id: 'l2_3', name: 'シリンダーレッグ', partType: 'legs', attribute: 'neutral', rarity: 2, visualIndex: 3, stats: { hp: 44, power: 17, defense: 28, agility: 48, dexterity: 42, intelligence: 10 } },
];

let masterCache: PartMasterData[] = DEFAULT_PARTS_MASTER;

/**
 * APIから最新の master_parts テーブルの基準値を非同期フェッチしてキャッシュを更新
 */
export async function fetchPartsMaster(): Promise<PartMasterData[]> {
  try {
    const response = await fetch('/api/parts-master.php');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        masterCache = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          partType: item.part_type || item.type,
          attribute: item.attribute || 'neutral',
          rarity: Number(item.rarity) as 1 | 2 | 3,
          visualIndex: Number(item.visual_index ?? item.visualIndex ?? 0),
          stats: {
            hp: Number(item.base_hp ?? item.stats?.hp ?? 0),
            power: Number(item.base_power ?? item.stats?.power ?? 0),
            defense: Number(item.base_defense ?? item.stats?.defense ?? 0),
            agility: Number(item.base_agility ?? item.stats?.agility ?? 0),
            dexterity: Number(item.base_dexterity ?? item.stats?.dexterity ?? 0),
            intelligence: Number(item.base_int ?? item.stats?.intelligence ?? 0),
          }
        }));
      }
    }
  } catch (e) {
    console.warn('[partsMaster] parts-master.php fetch fallback to default master data', e);
  }
  return masterCache;
}

/**
 * 現在保持しているパーツマスターデータのリストを取得
 */
export function getPartsMasterList(): PartMasterData[] {
  return masterCache;
}

/**
 * パーツタイプ、レア度、ビジュアルインデックスに合致するマスターデータを取得
 */
export function findMasterPartData(partType: PartType, rarity: number, visualIndex: number): PartMasterData | undefined {
  const catalog = getPartsMasterList();
  
  // 1. 部位・レア度・ビジュアルインデックス完全一致
  let matched = catalog.find(p => p.partType === partType && p.rarity === rarity && p.visualIndex === visualIndex);
  if (matched) return matched;

  // 2. 部位・レア度一致 (ビジュアルインデックスが範囲外の場合フォールバック)
  matched = catalog.find(p => p.partType === partType && p.rarity === rarity);
  if (matched) return matched;

  // 3. 部位一致
  matched = catalog.find(p => p.partType === partType);
  return matched;
}

/**
 * パーツ名またはIDからマスターデータを取得
 */
export function findMasterPartByNameOrId(nameOrId: string): PartMasterData | undefined {
  const catalog = getPartsMasterList();
  
  // ID一致
  let matched = catalog.find(p => p.id === nameOrId);
  if (matched) return matched;

  // 名前完全一致
  matched = catalog.find(p => p.name === nameOrId);
  if (matched) return matched;

  // 名前の部分一致 (例: "さびた鉄くずのベーシックヘッド" -> "ベーシックヘッド")
  matched = catalog.find(p => nameOrId.includes(p.name));
  return matched;
}
