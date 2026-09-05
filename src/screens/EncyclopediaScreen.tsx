import React, { useState, useMemo } from 'react';
import { GameState, AttributeColors, AttributeNames } from '../core/models';

import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from '../components/robot/RobotSVGs';
import { MATERIALS, getMaterialCraftableVisuals } from '../core/data';
import * as Gi from 'react-icons/gi';
import { MaterialIcon } from '../components/ui/MaterialIcon';

const SinglePart: React.FC<{ Comp: React.FC<{color: string, viewBox?: string, className?: string}>, color: string, type: 'head'|'body'|'arms'|'legs', rarityLabel?: number, visualIndex?: number, hideContainer?: boolean }> = ({ Comp, color, type, rarityLabel, visualIndex = 0, hideContainer }) => {
  const r = rarityLabel || 1;
  const viewBox = r === 3
    ? (type === 'head' ? '0 0 256 256' : '0 0 256 256')
    : r === 2
    ? (type === 'head' ? '0 -2 32 36' : type === 'arms' ? (visualIndex > 0 ? '0 0 300 300' : '0 2 32 28') : type === 'body' ? '0 0 300 300' : type === 'legs' ? '0 0 300 300' : '0 0 32 32')
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
  { id: 'h2_1', type: 'head', rarity: 2, visualIndex: 1, name: 'バイザーIIヘッド' },
  { id: 'h2_2', type: 'head', rarity: 2, visualIndex: 2, name: 'アンテナヘッド' },
  { id: 'h2_3', type: 'head', rarity: 2, visualIndex: 3, name: 'バトルヘッド' },
  { id: 'h3_0', type: 'head', rarity: 3, visualIndex: 0, name: 'パラディンヘッド' },
  { id: 'h3_1', type: 'head', rarity: 3, visualIndex: 1, name: 'エンジェルヘッド' },
  { id: 'h3_2', type: 'head', rarity: 3, visualIndex: 2, name: 'ドラゴンヘッド' },
  { id: 'h3_3', type: 'head', rarity: 3, visualIndex: 3, name: 'アサシンヘッド' },

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
  const [tab, setTab] = useState<'gallery'|'parts'|'history'>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAttribute, setFilterAttribute] = useState<string>('Water');
  const [filterRarity, setFilterRarity] = useState<number | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest'|'oldest'|'price_desc'|'price_asc'>('newest');
  const [filterPartType, setFilterPartType] = useState<string>('All');


  
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>図鑑・実績</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>戻る</Button>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={tab === 'gallery' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('gallery')}
        >
          パーツ図鑑
        </Button>
        <Button 
          variant={tab === 'parts' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('parts')}
        >
          素材別出現一覧
        </Button>
        <Button 
          variant={tab === 'history' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('history')}
        >
          納品履歴
        </Button>
      </div>

      
      <Card className="bg-stone-50 mb-4 p-3 space-y-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={tab === 'history' ? "ロボット名で検索..." : tab === 'gallery' ? "パーツ名で検索..." : "素材名で検索..."}
            className="flex-1 p-2 border border-stone-300 rounded text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {tab === 'history' && (
            <select 
              className="p-2 border border-stone-300 rounded bg-white text-sm"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="price_desc">価格が高い順</option>
              <option value="price_asc">価格が安い順</option>
            </select>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-stone-600">表示カラー:</span>
          {tab === 'history' && (
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

        {tab === 'gallery' && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-stone-600">レア度:</span>
            <Button size="sm" variant={filterRarity === 'All' ? 'primary' : 'secondary'} onClick={() => setFilterRarity('All')}>すべて</Button>
            <Button size="sm" variant={filterRarity === 1 ? 'primary' : 'secondary'} onClick={() => setFilterRarity(1)}>★1</Button>
            <Button size="sm" variant={filterRarity === 2 ? 'primary' : 'secondary'} onClick={() => setFilterRarity(2)}>★2</Button>
            <Button size="sm" variant={filterRarity === 3 ? 'primary' : 'secondary'} onClick={() => setFilterRarity(3)}>★3</Button>
          </div>
        )}
      </Card>

      {tab === 'gallery' && (
        <div className="space-y-4">
          <div className="bg-stone-100 p-3 rounded-md text-sm text-stone-700 flex justify-between items-center">
            <span>
              全パーツの形状カタログです。表示カラーを切り替えて各属性での色合いを確認できます。
            </span>
            <span className="font-bold text-stone-500 whitespace-nowrap ml-2">
              全 {filteredCatalogParts.length} 件
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredCatalogParts.map((item) => {
              const Comp = getPartSVG(item.type, item.rarity, item.visualIndex);
              const typeLabel = item.type === 'head' ? 'ヘッド' : item.type === 'body' ? 'ボディ' : item.type === 'arms' ? 'アーム' : 'レッグ';
              const TypeIcon = item.type === 'head' ? Gi.GiMechaHead : item.type === 'body' ? Gi.GiChestArmor : item.type === 'arms' ? Gi.GiMechanicalArm : Gi.GiLegArmor;

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

                  <p className="text-xs font-bold text-stone-800 text-center w-full truncate">
                    {item.name}
                  </p>
                </Card>
              );
            })}
          </div>
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
    </div>
  );
};
