import React, { useState, useMemo } from 'react';
import { GameState, AttributeColors, AttributeNames, Robot } from '../core/models';

import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { RobotGalleryCard } from '../components/robot/RobotGalleryCard';
import { GSAPMotionStudioModal } from '../components/robot/GSAPMotionStudioModal';
import { ArmJointCalibrationModal } from '../components/robot/ArmJointCalibrationModal';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from '../components/robot/RobotSVGs';
import { HandAnchorManager } from '../core/animations/HandAnchorManager';
import { MATERIALS, getMaterialCraftableVisuals } from '../core/data';
import { calculatePartBaseline } from '../utils/partBaseline';
import * as Gi from 'react-icons/gi';
import { MaterialIcon } from '../components/ui/MaterialIcon';

const SinglePart: React.FC<{ Comp: React.FC<{color: string, viewBox?: string, className?: string}>, color: string, type: 'head'|'body'|'arms'|'legs', rarityLabel?: number, visualIndex?: number, hideContainer?: boolean }> = ({ Comp, color, type, rarityLabel, visualIndex = 0, hideContainer }) => {
  const r = rarityLabel || 1;
  const viewBox = r === 3
    ? (type === 'head' ? (visualIndex >= 3 ? '0 0 300 300' : '0 0 256 256') : type === 'body' ? '0 0 360 360' : '0 0 256 256')
    : r === 2
    ? (type === 'head' ? (visualIndex >= 4 ? '0 0 300 300' : '-10 -5 80 80') : type === 'arms' ? (visualIndex > 0 ? '0 0 300 300' : '6 -4 52 52') : type === 'body' ? '22 28 56 52' : type === 'legs' ? '0 0 300 300' : '0 0 32 32')
    : (type === 'head' ? '20 0 60 45' :
       type === 'body' ? '25 32 50 48' :
       type === 'arms' ? '5 38 90 42' :
       '20 68 60 32');

  if (hideContainer) {
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <Comp color={color} viewBox={viewBox} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="bg-stone-100 rounded p-1 flex flex-col items-center border border-stone-200 overflow-hidden w-full aspect-square justify-center">
      {rarityLabel !== undefined && (
        <span className="text-[10px] flex items-center gap-0.5 mb-1 text-amber-600 font-bold">
          <Gi.GiStarFormation size={10} />{rarityLabel}
        </span>
      )}
      <div className="flex-1 w-full flex items-center justify-center p-1">
        <Comp color={color} viewBox={viewBox} className="w-full h-full" />
      </div>
    </div>
  );
};

export const getPartSVG = (type: 'head' | 'body' | 'arms' | 'legs', r: number, vIdx: number) => {
  const map = type === 'head' ? SVG_HEADS : type === 'body' ? SVG_BODIES : type === 'arms' ? SVG_ARMS : SVG_LEGS;
  const list = (map[r] && map[r].length > 0) ? map[r] : map[1];
  return list[vIdx % list.length];
};

interface CatalogPartItem {
  id: string;
  type: 'head' | 'body' | 'arms' | 'legs';
  rarity: 1 | 2 | 3;
  visualIndex: number;
  name: string;
  isNew?: boolean;
}

const getBaselineStatsForCatalogItem = (item: CatalogPartItem, attribute: string) => {
  const dummyPart: any = {
    id: item.id,
    type: item.type,
    name: item.name,
    attribute: attribute,
    rarity: item.rarity,
    visualIndex: item.visualIndex,
    stats: { hp: 0, power: 0, defense: 0, agility: 0, dexterity: 0, intelligence: 0 }
  };
  const result = calculatePartBaseline(dummyPart);
  return { stats: result.baselineStats, weight: result.baselineWeight };
};

const ALL_PARTS_CATALOG: CatalogPartItem[] = [
  // Head
  { id: 'h1_0', type: 'head', rarity: 1, visualIndex: 0, name: 'ベーシックヘッド' },
  { id: 'h1_1', type: 'head', rarity: 1, visualIndex: 1, name: 'ラウンドヘッド' },
  { id: 'h1_2', type: 'head', rarity: 1, visualIndex: 2, name: 'バイザーヘッド' },
  { id: 'h1_3', type: 'head', rarity: 1, visualIndex: 3, name: 'ボックスヘッド' },
  { id: 'h1_4', type: 'head', rarity: 1, visualIndex: 4, name: 'クラウンヘッド' },
  { id: 'h1_5', type: 'head', rarity: 1, visualIndex: 5, name: 'コーンヘッド' },
  { id: 'h1_6', type: 'head', rarity: 1, visualIndex: 6, name: 'シリンダーヘッド' },
  { id: 'h1_7', type: 'head', rarity: 1, visualIndex: 7, name: 'ホーンヘッド' },
  { id: 'h2_0', type: 'head', rarity: 2, visualIndex: 0, name: 'デュアルアイヘッド' },
  { id: 'h2_1', type: 'head', rarity: 2, visualIndex: 1, name: 'センサーヘッド', isNew: true },
  { id: 'h2_2', type: 'head', rarity: 2, visualIndex: 2, name: 'コマンドヘッド', isNew: true },
  { id: 'h2_3', type: 'head', rarity: 2, visualIndex: 3, name: 'バトルヘッド', isNew: true },
  { id: 'h2_4', type: 'head', rarity: 2, visualIndex: 4, name: 'ポッドツインヘッド', isNew: true },
  { id: 'h2_5', type: 'head', rarity: 2, visualIndex: 5, name: 'フィントライヘッド', isNew: true },
  { id: 'h2_6', type: 'head', rarity: 2, visualIndex: 6, name: 'デルタイヤーヘッド', isNew: true },
  { id: 'h2_7', type: 'head', rarity: 2, visualIndex: 7, name: 'ラウンドバイザーヘッド', isNew: true },
  { id: 'h3_0', type: 'head', rarity: 3, visualIndex: 0, name: 'パラディンヘッド' },
  { id: 'h3_1', type: 'head', rarity: 3, visualIndex: 1, name: 'エンジェルヘッド' },
  { id: 'h3_2', type: 'head', rarity: 3, visualIndex: 2, name: 'ドラゴンヘッド' },
  { id: 'h3_3', type: 'head', rarity: 3, visualIndex: 3, name: 'サイクロプスヘッド', isNew: true },
  { id: 'h3_4', type: 'head', rarity: 3, visualIndex: 4, name: 'トライアングルヘッド', isNew: true },
  { id: 'h3_5', type: 'head', rarity: 3, visualIndex: 5, name: 'デルタサイクロプスヘッド', isNew: true },
  { id: 'h3_6', type: 'head', rarity: 3, visualIndex: 6, name: 'オーブサイクロプスヘッド', isNew: true },

  // Body
  { id: 'b1_0', type: 'body', rarity: 1, visualIndex: 0, name: 'ベーシックボディ' },
  { id: 'b1_1', type: 'body', rarity: 1, visualIndex: 1, name: 'ラウンドボディ' },
  { id: 'b1_2', type: 'body', rarity: 1, visualIndex: 2, name: 'ヘビーボディ' },
  { id: 'b1_3', type: 'body', rarity: 1, visualIndex: 3, name: 'バレルボディ' },
  { id: 'b1_4', type: 'body', rarity: 1, visualIndex: 4, name: 'スリムボディ' },
  { id: 'b1_5', type: 'body', rarity: 1, visualIndex: 5, name: 'ファーネスボディ' },
  { id: 'b1_6', type: 'body', rarity: 1, visualIndex: 6, name: 'ダイヤボディ' },
  { id: 'b1_7', type: 'body', rarity: 1, visualIndex: 7, name: 'エンジンボディ' },
  { id: 'b2_0', type: 'body', rarity: 2, visualIndex: 0, name: 'ハイテクコアボディ' },
  { id: 'b2_1', type: 'body', rarity: 2, visualIndex: 1, name: 'バイザーコアボディ', isNew: true },
  { id: 'b3_0', type: 'body', rarity: 3, visualIndex: 0, name: 'トライアングルコアボディ', isNew: true },

  // Arms
  { id: 'a1_0', type: 'arms', rarity: 1, visualIndex: 0, name: 'ベーシックアーム' },
  { id: 'a1_1', type: 'arms', rarity: 1, visualIndex: 1, name: 'ラウンドアーム' },
  { id: 'a1_2', type: 'arms', rarity: 1, visualIndex: 2, name: 'ヘビーアーム' },
  { id: 'a1_3', type: 'arms', rarity: 1, visualIndex: 3, name: 'クローアーム' },
  { id: 'a1_4', type: 'arms', rarity: 1, visualIndex: 4, name: 'レンチアーム' },
  { id: 'a1_5', type: 'arms', rarity: 1, visualIndex: 5, name: 'キャノンアーム' },
  { id: 'a1_6', type: 'arms', rarity: 1, visualIndex: 6, name: 'ブレードアーム' },
  { id: 'a1_7', type: 'arms', rarity: 1, visualIndex: 7, name: 'シールドアーム' },
  { id: 'a2_0', type: 'arms', rarity: 2, visualIndex: 0, name: 'ナックルアーム' },
  { id: 'a2_1', type: 'arms', rarity: 2, visualIndex: 1, name: 'サイバーアーム', isNew: true },
  { id: 'a2_2', type: 'arms', rarity: 2, visualIndex: 2, name: 'ヘビーアーム', isNew: true },
  { id: 'a2_3', type: 'arms', rarity: 2, visualIndex: 3, name: 'バスターアーム', isNew: true },

  // Legs
  { id: 'l1_0', type: 'legs', rarity: 1, visualIndex: 0, name: 'ベーシックレッグ' },
  { id: 'l1_1', type: 'legs', rarity: 1, visualIndex: 1, name: 'ホイールレッグ' },
  { id: 'l1_2', type: 'legs', rarity: 1, visualIndex: 2, name: 'ヘビーレッグ' },
  { id: 'l1_3', type: 'legs', rarity: 1, visualIndex: 3, name: 'ホバーレッグ' },
  { id: 'l1_4', type: 'legs', rarity: 1, visualIndex: 4, name: '一輪ホイール' },
  { id: 'l1_5', type: 'legs', rarity: 1, visualIndex: 5, name: 'トライポッド' },
  { id: 'l1_6', type: 'legs', rarity: 1, visualIndex: 6, name: 'スプリングレッグ' },
  { id: 'l1_7', type: 'legs', rarity: 1, visualIndex: 7, name: 'クアッドレッグ' },
  { id: 'l2_0', type: 'legs', rarity: 2, visualIndex: 0, name: 'サイバーツインレッグ' },
  { id: 'l2_1', type: 'legs', rarity: 2, visualIndex: 1, name: 'サイバーレッグ' },
  { id: 'l2_2', type: 'legs', rarity: 2, visualIndex: 2, name: 'スプリングガード' },
  { id: 'l2_3', type: 'legs', rarity: 2, visualIndex: 3, name: 'シリンダーレッグ', isNew: true },
];

export const EncyclopediaScreen: React.FC<{ state: GameState, onBack: () => void }> = ({ state, onBack }) => {
  const [tab, setTab] = useState<'robots'|'gallery'|'parts'|'history'>('robots');
  const [galleryViewMode, setGalleryViewMode] = useState<'card' | 'table'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAttribute, setFilterAttribute] = useState<string>('All');
  const [filterRarity, setFilterRarity] = useState<number | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest'|'oldest'|'price_desc'|'price_asc'>('newest');
  const [filterPartType, setFilterPartType] = useState<string>('All');

  // GSAP モーションスタジオのモーダル状態
  const [isMotionStudioOpen, setIsMotionStudioOpen] = useState<boolean>(false);
  const [motionStudioRobot, setMotionStudioRobot] = useState<Robot | null>(null);

  // 肩＆拳位置調整モーダルの状態
  const [calibrationArmPart, setCalibrationArmPart] = useState<CatalogPartItem | null>(null);

  // ロボットギャラリー：クラフトされたユニークロボット一覧
  const uniqueCraftedRobots = useMemo(() => {
    const allList: Robot[] = [];
    const seenIds = new Set<string>();

    const addIfValid = (r: Robot) => {
      if (!r || !r.parts || !r.parts.head || !r.parts.body || !r.parts.arms || !r.parts.legs) return;
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id);
        allList.push(r);
      }
    };

    if (state.craftedRobots && Array.isArray(state.craftedRobots)) {
      state.craftedRobots.forEach(addIfValid);
    }
    if (state.robots && Array.isArray(state.robots)) {
      state.robots.forEach(addIfValid);
    }
    if (state.deliveredLogs && Array.isArray(state.deliveredLogs)) {
      state.deliveredLogs.forEach(l => {
        if (l && l.parts) {
          addIfValid({
            id: l.id,
            name: l.name,
            parts: l.parts,
            stats: l.stats,
            createdAt: l.deliveredAt || Date.now(),
            value: (l.parts.head?.rarity || 1) + (l.parts.body?.rarity || 1) + (l.parts.arms?.rarity || 1) + (l.parts.legs?.rarity || 1) * 20
          });
        }
      });
    }

    let list = allList.slice();

    // 検索（ロボット名 または パーツ名）
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => {
        const matchName = r.name.toLowerCase().includes(q);
        const matchParts = Object.values(r.parts).some(p => p && p.name && p.name.toLowerCase().includes(q));
        return matchName || matchParts;
      });
    }

    // 属性フィルタ
    if (filterAttribute !== 'All') {
      list = list.filter(r => {
        const parts = [r.parts.head, r.parts.body, r.parts.arms, r.parts.legs];
        return parts.some(p => p && p.attribute === filterAttribute);
      });
    }

    // レアリティフィルタ
    if (filterRarity !== 'All') {
      list = list.filter(r => {
        const maxR = Math.max(
          r.parts.head?.rarity || 1,
          r.parts.body?.rarity || 1,
          r.parts.arms?.rarity || 1,
          r.parts.legs?.rarity || 1
        );
        return maxR === filterRarity;
      });
    }

    // ソート
    list.sort((a, b) => {
      if (sortOrder === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortOrder === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      const totalScoreA = (a.stats.hp + a.stats.power + a.stats.defense + a.stats.agility + a.stats.dexterity + (a.stats.intelligence || 1));
      const totalScoreB = (b.stats.hp + b.stats.power + b.stats.defense + b.stats.agility + b.stats.dexterity + (b.stats.intelligence || 1));
      if (sortOrder === 'price_desc') return totalScoreB - totalScoreA;
      if (sortOrder === 'price_asc') return totalScoreA - totalScoreB;
      return 0;
    });

    return list;
  }, [state.craftedRobots, state.robots, state.deliveredLogs, searchQuery, filterAttribute, filterRarity, sortOrder]);

  const filteredHistory = useMemo(() => {
    let list = state.deliveredLogs.slice();
    
    // Search
    if (searchQuery) {
      list = list.filter(log => log.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Attribute
    if (filterAttribute !== 'All') {
      list = list.filter(log => {
        const parts = [log.parts.head, log.parts.body, log.parts.arms, log.parts.legs];
        return parts.some(p => p && p.attribute === filterAttribute);
      });
    }
    
    // Sort
    list.sort((a, b) => {
      if (sortOrder === 'newest') return b.deliveredAt - a.deliveredAt;
      if (sortOrder === 'oldest') return a.deliveredAt - b.deliveredAt;
      const priceA = a.stats ? a.stats.hp : 0; // Using hp as base for price roughly, actually the total stats
      const priceB = b.stats ? b.stats.hp : 0;
      if (sortOrder === 'price_desc') return priceB - priceA;
      if (sortOrder === 'price_asc') return priceA - priceB;
      return 0;
    });
    
    return list;
  }, [state.deliveredLogs, searchQuery, filterAttribute, sortOrder]);

  
  const filteredMaterials = useMemo(() => {
    let list = MATERIALS.slice();
    if (searchQuery) {
      list = list.filter(mat => mat.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterAttribute !== 'All') {
      list = list.filter(mat => mat.attribute === filterAttribute);
    }
    return list;
  }, [searchQuery, filterAttribute]);

  const filteredCatalogParts = useMemo(() => {
    let list = ALL_PARTS_CATALOG.slice();
    if (filterPartType !== 'All') {
      list = list.filter(p => p.type === filterPartType);
    }
    if (filterRarity !== 'All') {
      list = list.filter(p => p.rarity === filterRarity);
    }
    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [filterPartType, filterRarity, searchQuery]);

  const activeColor = filterAttribute === 'All' ? AttributeColors['Water'] : (AttributeColors[filterAttribute] || AttributeColors['Water']);
  const activeAttr = filterAttribute === 'All' ? 'Earth' : filterAttribute;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>図鑑・実績</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>戻る</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button 
          id="tab-btn-robots"
          variant={tab === 'robots' ? 'primary' : 'secondary'} 
          className="flex items-center justify-center gap-1.5 py-2" 
          onClick={() => setTab('robots')}
        >
          <Gi.GiRobotAntennas size={16} />
          ロボット図鑑
        </Button>
        <Button 
          id="tab-btn-gallery"
          variant={tab === 'gallery' ? 'primary' : 'secondary'} 
          className="flex items-center justify-center gap-1.5 py-2" 
          onClick={() => setTab('gallery')}
        >
          <Gi.GiCog size={16} />
          パーツ図鑑
        </Button>
        <Button 
          id="tab-btn-parts"
          variant={tab === 'parts' ? 'primary' : 'secondary'} 
          className="flex items-center justify-center gap-1.5 py-2" 
          onClick={() => setTab('parts')}
        >
          <Gi.GiAnvilImpact size={16} />
          素材別出現一覧
        </Button>
        <Button 
          id="tab-btn-history"
          variant={tab === 'history' ? 'primary' : 'secondary'} 
          className="flex items-center justify-center gap-1.5 py-2" 
          onClick={() => setTab('history')}
        >
          <Gi.GiCardPickup size={16} />
          納品履歴
        </Button>
      </div>

      
      <Card className="bg-stone-50 mb-4 p-3 space-y-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={
              tab === 'robots' ? "ロボット名・パーツ名で検索..." :
              tab === 'history' ? "ロボット名で検索..." : 
              tab === 'gallery' ? "パーツ名で検索..." : "素材名で検索..."
            }
            className="flex-1 p-2 border border-stone-300 rounded text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {(tab === 'history' || tab === 'robots') && (
            <select 
              className="p-2 border border-stone-300 rounded bg-white text-sm"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="price_desc">総合性能が高い順</option>
              <option value="price_asc">総合性能が低い順</option>
            </select>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-stone-600">属性:</span>
          {(tab === 'history' || tab === 'robots' || tab === 'parts' || tab === 'gallery') && (
            <Button size="sm" variant={filterAttribute === 'All' ? 'primary' : 'secondary'} onClick={() => setFilterAttribute('All')}>すべて</Button>
          )}
          {Object.keys(AttributeNames).map(attr => (
            <Button 
              key={attr} 
              size="sm" 
              variant={filterAttribute === attr ? 'primary' : 'secondary'} 
              onClick={() => setFilterAttribute(attr)}
              style={filterAttribute === attr ? { backgroundColor: AttributeColors[attr], borderColor: AttributeColors[attr], color: '#fff' } : {}}
            >
              {AttributeNames[attr]}
            </Button>
          ))}
        </div>

        {(tab === 'parts' || tab === 'gallery') && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-stone-600">部位:</span>
            <Button size="sm" variant={filterPartType === 'All' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('All')}>すべて</Button>
            <Button size="sm" variant={filterPartType === 'head' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('head')}>ヘッド</Button>
            <Button size="sm" variant={filterPartType === 'body' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('body')}>ボディ</Button>
            <Button size="sm" variant={filterPartType === 'arms' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('arms')}>アーム</Button>
            <Button size="sm" variant={filterPartType === 'legs' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('legs')}>レッグ</Button>
          </div>
        )}

        {(tab === 'gallery' || tab === 'robots') && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-stone-600">レア度:</span>
            <Button size="sm" variant={filterRarity === 'All' ? 'primary' : 'secondary'} onClick={() => setFilterRarity('All')}>すべて</Button>
            <Button size="sm" variant={filterRarity === 1 ? 'primary' : 'secondary'} onClick={() => setFilterRarity(1)}>★1</Button>
            <Button size="sm" variant={filterRarity === 2 ? 'primary' : 'secondary'} onClick={() => setFilterRarity(2)}>★2</Button>
            <Button size="sm" variant={filterRarity === 3 ? 'primary' : 'secondary'} onClick={() => setFilterRarity(3)}>★3</Button>
          </div>
        )}
      </Card>

      {tab === 'robots' && (
        <div className="space-y-4">
          <div className="bg-amber-50/90 border border-amber-300 p-3 rounded-xl text-sm text-stone-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <Gi.GiRobotAntennas size={24} />
              </div>
              <div>
                <span className="font-bold text-stone-800 text-sm block">ロボットギャラリー (Robot Gallery)</span>
                <span className="text-xs text-stone-600">
                  これまでに製造したユニークロボットの図鑑です。「構成パーツ詳細」や「GSAP モーションスタジオ」でアニメーションとステータスを確認できます。
                </span>
              </div>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs text-xs font-bold text-amber-900 whitespace-nowrap self-end sm:self-auto">
              登録機体数: <span className="text-sm font-black text-amber-600">{uniqueCraftedRobots.length}</span> 機
            </div>
          </div>

          {uniqueCraftedRobots.length === 0 ? (
            <Card className="text-center py-12 space-y-3 bg-stone-50 border-2 border-dashed border-stone-300">
              <div className="flex justify-center text-stone-400">
                <Gi.GiRobotAntennas size={48} />
              </div>
              <h3 className={`${theme.typography.h3} text-stone-700`}>
                クラフトされたロボットがまだありません
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                「工房」で素材からパーツを製造し、4つの部位（ヘッド・ボディ・アーム・レッグ）を組み立ててロボットを完成させると、ここにステータス詳細やGSAPアニメーション演習付きで登録されます！
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {uniqueCraftedRobots.map(robot => {
                const isOwned = state.robots.some(r => r.id === robot.id);
                const isDelivered = state.deliveredLogs.some(l => l.id === robot.id);
                const statusLabel = isOwned ? 'owned' : isDelivered ? 'delivered' : 'archived';

                return (
                  <RobotGalleryCard
                    key={robot.id}
                    robot={robot}
                    statusLabel={statusLabel}
                    onOpenMotionStudio={(r) => {
                      setMotionStudioRobot(r);
                      setIsMotionStudioOpen(true);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'gallery' && (
        <div className="space-y-4">
          <div className="bg-stone-100 p-3 rounded-md text-sm text-stone-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>
              全パーツの形状カタログです。表示カラーを切り替えて各属性での色合いを確認できます。
            </span>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <span className="font-bold text-stone-500 whitespace-nowrap">
                全 {filteredCatalogParts.length} 件
              </span>
              <div className="flex bg-stone-200 p-0.5 rounded-md">
                <button
                  type="button"
                  onClick={() => setGalleryViewMode('card')}
                  title="カード表示"
                  className={`p-1.5 rounded-sm flex items-center justify-center transition-colors ${galleryViewMode === 'card' ? 'bg-white shadow-sm text-amber-600' : 'text-stone-500 hover:bg-stone-300'}`}
                >
                  <Gi.GiCardPick size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryViewMode('table')}
                  title="テーブル表示"
                  className={`p-1.5 rounded-sm flex items-center justify-center transition-colors ${galleryViewMode === 'table' ? 'bg-white shadow-sm text-amber-600' : 'text-stone-500 hover:bg-stone-300'}`}
                >
                  <Gi.GiHamburgerMenu size={16} />
                </button>
              </div>
            </div>
          </div>

          {galleryViewMode === 'table' ? (
            <Card className="overflow-x-auto p-0 border border-stone-200">
              <table className="w-full text-xs text-left min-w-[750px]">
                <thead className="bg-stone-100 text-stone-600 uppercase border-b border-stone-200">
                  <tr>
                    <th className="px-3 py-2.5 w-14 text-center">外観</th>
                    <th className="px-3 py-2.5">パーツ名</th>
                    <th className="px-3 py-2.5">部位</th>
                    <th className="px-2 py-2.5 text-center">レア度</th>
                    <th className="px-2 py-2.5 text-right" title="耐久力">HP</th>
                    <th className="px-2 py-2.5 text-right" title="攻撃力">POW</th>
                    <th className="px-2 py-2.5 text-right" title="防御力">DEF</th>
                    <th className="px-2 py-2.5 text-right" title="速度">AGI</th>
                    <th className="px-2 py-2.5 text-right" title="探索力">DEX</th>
                    <th className="px-2 py-2.5 text-right" title="解析力">INT</th>
                    <th className="px-2 py-2.5 text-right" title="重量">WT</th>
                    <th className="px-3 py-2.5 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogParts.map((item) => {
                    const Comp = getPartSVG(item.type, item.rarity, item.visualIndex);
                    const typeLabel = item.type === 'head' ? 'ヘッド' : item.type === 'body' ? 'ボディ' : item.type === 'arms' ? 'アーム' : 'レッグ';
                    const TypeIcon = item.type === 'head' ? Gi.GiMechaHead : item.type === 'body' ? Gi.GiChestArmor : item.type === 'arms' ? Gi.GiMechanicalArm : Gi.GiLegArmor;
                    const baselineData = getBaselineStatsForCatalogItem(item, activeAttr);
                    const baselineStats = baselineData.stats;
                    
                    return (
                      <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="px-2 py-1.5 text-center">
                          <div className="w-9 h-9 bg-stone-100 rounded border border-stone-200 mx-auto">
                            <SinglePart Comp={Comp} color={activeColor} type={item.type} rarityLabel={item.rarity} visualIndex={item.visualIndex} hideContainer={true} />
                          </div>
                        </td>
                        <td className="px-3 py-1.5 font-bold text-stone-800">
                          {item.name}
                          {item.isNew && (
                            <span className="ml-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">NEW</span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-stone-600 font-medium whitespace-nowrap">
                          <span className="flex items-center gap-1"><TypeIcon size={14} />{typeLabel}</span>
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <span className="inline-flex items-center justify-center gap-0.5 font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            <Gi.GiStarFormation size={11} />{item.rarity}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-700 bg-stone-50/50">{baselineStats.hp}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-700">{baselineStats.power}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-700 bg-stone-50/50">{baselineStats.defense}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-700">{baselineStats.agility}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-700 bg-stone-50/50">{baselineStats.dexterity}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-700">{baselineStats.intelligence}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-bold text-stone-500 bg-stone-50/50">{baselineData.weight}</td>
                        <td className="px-3 py-1.5 text-center">
                          {item.type === 'arms' ? (
                            <button
                              type="button"
                              onClick={() => setCalibrationArmPart(item)}
                              className="text-[10px] bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded-sm font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                            >
                              <Gi.GiMechanicalArm size={12} />
                              調整
                            </button>
                          ) : (
                            <span className="text-stone-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredCatalogParts.map((item) => {
              const Comp = getPartSVG(item.type, item.rarity, item.visualIndex);
              const typeLabel = item.type === 'head' ? 'ヘッド' : item.type === 'body' ? 'ボディ' : item.type === 'arms' ? 'アーム' : 'レッグ';
              const TypeIcon = item.type === 'head' ? Gi.GiMechaHead : item.type === 'body' ? Gi.GiChestArmor : item.type === 'arms' ? Gi.GiMechanicalArm : Gi.GiLegArmor;
              const baselineData = getBaselineStatsForCatalogItem(item, activeAttr);
              const baselineStats = baselineData.stats;

              return (
                <Card key={item.id} className="p-2.5 flex flex-col items-center bg-white border border-stone-200 relative group hover:shadow-md transition-shadow">
                  {item.isNew && (
                    <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm animate-pulse">
                      NEW
                    </span>
                  )}
                  <div className="w-full flex justify-between items-center text-xs mb-1.5 px-0.5">
                    <span className="flex items-center gap-1 font-bold text-stone-600">
                      <TypeIcon size={14} className="text-stone-500" />
                      {typeLabel}
                    </span>
                    <span className="flex items-center gap-0.5 font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Gi.GiStarFormation size={11} />
                      {item.rarity}
                    </span>
                  </div>

                  <div className="w-full aspect-square bg-stone-50 rounded border border-stone-100 p-2 flex items-center justify-center overflow-hidden mb-2">
                    <SinglePart Comp={Comp} color={activeColor} type={item.type} rarityLabel={item.rarity} visualIndex={item.visualIndex} hideContainer={true} />
                  </div>

                  <p className="text-xs font-bold text-stone-800 text-center w-full truncate mb-1">
                    {item.name}
                  </p>
                  
                  <div className="w-full grid grid-cols-2 gap-1 text-[9px] mb-1">
                    <div className="flex justify-between bg-stone-100 px-1 py-0.5 rounded">
                      <span className="text-stone-500">HP</span>
                      <span className="font-bold text-stone-700">{baselineStats.hp}</span>
                    </div>
                    <div className="flex justify-between bg-stone-100 px-1 py-0.5 rounded">
                      <span className="text-stone-500">POW</span>
                      <span className="font-bold text-stone-700">{baselineStats.power}</span>
                    </div>
                    <div className="flex justify-between bg-stone-100 px-1 py-0.5 rounded">
                      <span className="text-stone-500">DEF</span>
                      <span className="font-bold text-stone-700">{baselineStats.defense}</span>
                    </div>
                    <div className="flex justify-between bg-stone-100 px-1 py-0.5 rounded">
                      <span className="text-stone-500">AGI</span>
                      <span className="font-bold text-stone-700">{baselineStats.agility}</span>
                    </div>
                    <div className="flex justify-between bg-stone-100 px-1 py-0.5 rounded">
                      <span className="text-stone-500">DEX</span>
                      <span className="font-bold text-stone-700">{baselineStats.dexterity}</span>
                    </div>
                    <div className="flex justify-between bg-stone-100 px-1 py-0.5 rounded">
                      <span className="text-stone-500">INT</span>
                      <span className="font-bold text-stone-700">{baselineStats.intelligence}</span>
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-between bg-stone-100 px-1 py-0.5 rounded text-[9px] mb-1">
                    <span className="text-stone-500">WT</span>
                    <span className="font-bold text-stone-700">{baselineData.weight}</span>
                  </div>

                  {item.type === 'arms' && (
                    <button
                      type="button"
                      onClick={() => setCalibrationArmPart(item)}
                      className="mt-2 w-full text-[10px] bg-amber-600 hover:bg-amber-500 text-white py-1 rounded-sm font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Gi.GiMechanicalArm size={12} />
                      肩＆拳 位置調整
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <p className="text-xs text-stone-500">総納品数</p>
              <p className={`${theme.typography.h2} text-amber-600`}>{state.deliveredRobotsCount}</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs text-stone-500">獲得総額推計</p>
              <p className={`${theme.typography.h2} text-amber-600`}>{state.deliveredLogs.reduce((acc, log) => acc + log.stats.hp, 0)} G</p> 
            </Card>
          </div>

          <h3 className={theme.typography.h3}>納品済みロボット履歴</h3>
          {state.deliveredLogs?.length === 0 ? (
            <p className="text-stone-500 text-center py-8">まだ納品されたロボットはありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredHistory.map(log => (
                <Card key={`${log.id}-${log.deliveredAt}`} className="flex items-center gap-4">
                  <div className="bg-stone-100 rounded p-2">
                    <RobotVisual robot={{ parts: log.parts } as any} size={64} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{log.name}</p>
                    <p className="text-xs text-stone-500">
                      {new Date(log.deliveredAt).toLocaleDateString()} に納品
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'parts' && (
        <div className="space-y-4">
          <p className="text-sm text-stone-600 mb-4 bg-stone-100 p-4 rounded-md">
            クラフトに使用した素材の<strong>レア度（★）</strong>と<strong>属性</strong>によって、完成するパーツの見た目が変化します。高レアな素材を使うほど、珍しいパーツが選ばれる可能性が高くなります。
          </p>

          {filteredMaterials.map(mat => {
            const color = AttributeColors[mat.attribute];
            const visibleTypesCount = filterPartType === 'All' ? 4 : 1;
            const gridColsClass = visibleTypesCount === 4 ? 'grid-cols-4' : 'grid-cols-1';
            const craftableVisuals = getMaterialCraftableVisuals(mat);

            return (
              <Card key={mat.id} className="border-2" style={{ borderColor: color + '40' }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <MaterialIcon materialId={mat.id} size={20} color={color} />
                    {mat.name}
                  </h4>
                  <div className="flex gap-2">
                    <Badge style={{ backgroundColor: color, color: '#fff' }}>{mat.attribute}</Badge>
                    <Badge className="bg-stone-800 text-stone-100 flex items-center gap-1">
                      <Gi.GiStarFormation size={12} color="#fbbf24" /> {mat.rarity}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-stone-500 mb-3 border-b border-stone-200 pb-2">
                  この素材を使うと、以下の形状パーツが出現する可能性があります。
                </p>
                
                <div className={`grid ${gridColsClass} gap-2 text-center text-xs font-bold text-stone-600`}>
                  {(!filterPartType || filterPartType === 'All' || filterPartType === 'head') && (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiMechaHead size={14} />ヘッド</p>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {craftableVisuals.map((v, idx) => (
                          <SinglePart key={`head-${idx}`} Comp={getPartSVG('head', v.rarity, v.visualIndex)} color={color} type="head" rarityLabel={v.rarity} />
                        ))}
                      </div>
                    </div>
                  )}
                  {(!filterPartType || filterPartType === 'All' || filterPartType === 'body') && (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiChestArmor size={14} />ボディ</p>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {craftableVisuals.map((v, idx) => (
                          <SinglePart key={`body-${idx}`} Comp={getPartSVG('body', v.rarity, v.visualIndex)} color={color} type="body" rarityLabel={v.rarity} />
                        ))}
                      </div>
                    </div>
                  )}
                  {(!filterPartType || filterPartType === 'All' || filterPartType === 'arms') && (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiMechanicalArm size={14} />アーム</p>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {craftableVisuals.map((v, idx) => (
                          <SinglePart key={`arms-${idx}`} Comp={getPartSVG('arms', v.rarity, v.visualIndex)} color={color} type="arms" rarityLabel={v.rarity} />
                        ))}
                      </div>
                    </div>
                  )}
                  {(!filterPartType || filterPartType === 'All' || filterPartType === 'legs') && (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiLegArmor size={14} />レッグ</p>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {craftableVisuals.map((v, idx) => (
                          <SinglePart key={`legs-${idx}`} Comp={getPartSVG('legs', v.rarity, v.visualIndex)} color={color} type="legs" rarityLabel={v.rarity} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* GSAP ロボットモーションスタジオ モーダル */}
      {isMotionStudioOpen && (
        <GSAPMotionStudioModal
          initialRobot={motionStudioRobot}
          robotsList={uniqueCraftedRobots}
          onClose={() => {
            setIsMotionStudioOpen(false);
            setMotionStudioRobot(null);
          }}
        />
      )}

      {/* アームパーツ 肩＆拳 位置調整モーダル */}
      {calibrationArmPart && (
        <ArmJointCalibrationModal
          initialArmPartKey={HandAnchorManager.generatePartKey(calibrationArmPart.rarity, calibrationArmPart.visualIndex)}
          initialAttribute={activeColor === AttributeColors.Fire ? 'Fire' : 
                            activeColor === AttributeColors.Water ? 'Water' : 
                            activeColor === AttributeColors.Earth ? 'Earth' : 
                            activeColor === AttributeColors.Wind ? 'Wind' : 
                            activeColor === AttributeColors.Light ? 'Light' : 'Dark'}
          onClose={() => setCalibrationArmPart(null)}
        />
      )}
    </div>
  );
};
