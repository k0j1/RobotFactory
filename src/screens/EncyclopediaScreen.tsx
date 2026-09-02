import React, { useState, useMemo } from 'react';
import { GameState, AttributeColors, AttributeNames } from '../core/models';

import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from '../components/robot/RobotSVGs';
import { MATERIALS, getMaterialCraftableVisuals } from '../core/data';
import * as Gi from 'react-icons/gi';
import { MaterialIcon } from '../components/ui/MaterialIcon';

const SinglePart: React.FC<{ Comp: React.FC<{color: string, viewBox?: string}>, color: string, type: 'head'|'body'|'arms'|'legs', rarityLabel?: number }> = ({ Comp, color, type, rarityLabel }) => {
  const r = rarityLabel || 1;
  const viewBox = r === 3
    ? (type === 'head' ? '0 0 256 256' : '0 0 256 256')
    : r === 2
    ? (type === 'head' ? '0 -2 32 36' : type === 'arms' ? '0 2 32 28' : '0 0 32 32')
    : (type === 'head' ? '20 0 60 45' :
       type === 'body' ? '25 32 50 48' :
       type === 'arms' ? '5 38 90 42' :
       '20 68 60 32');

  return (
    <div className="bg-stone-100 rounded p-1 flex flex-col items-center border border-stone-200 overflow-hidden w-full aspect-square justify-center">
      {rarityLabel !== undefined && (
        <span className="text-[10px] flex items-center gap-0.5 mb-1 text-amber-600 font-bold">
          <Gi.GiStarFormation size={10} />{rarityLabel}
        </span>
      )}
      <div className="flex-1 w-full flex items-center justify-center p-1">
        <Comp color={color} viewBox={viewBox} />
      </div>
    </div>
  );
};

export const EncyclopediaScreen: React.FC<{ state: GameState, onBack: () => void }> = ({ state, onBack }) => {
    const [tab, setTab] = useState<'history'|'parts'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAttribute, setFilterAttribute] = useState<string>('All');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>図鑑・実績</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>戻る</Button>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={tab === 'history' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('history')}
        >
          納品履歴
        </Button>
        <Button 
          variant={tab === 'parts' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('parts')}
        >
          素材・パーツ詳細
        </Button>
      </div>

      
      <Card className="bg-stone-50 mb-4 p-3 space-y-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={tab === 'history' ? "ロボット名で検索..." : "素材名で検索..."}
            className="flex-1 p-2 border border-stone-300 rounded"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {tab === 'history' && (
            <select 
              className="p-2 border border-stone-300 rounded bg-white"
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
          <span className="text-sm font-bold text-stone-600">属性:</span>
          <Button size="sm" variant={filterAttribute === 'All' ? 'primary' : 'secondary'} onClick={() => setFilterAttribute('All')}>すべて</Button>
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

        {tab === 'parts' && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-stone-600">パーツ種別:</span>
            <Button size="sm" variant={filterPartType === 'All' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('All')}>すべて</Button>
            <Button size="sm" variant={filterPartType === 'head' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('head')}>アタマ</Button>
            <Button size="sm" variant={filterPartType === 'body' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('body')}>ボディ</Button>
            <Button size="sm" variant={filterPartType === 'arms' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('arms')}>ウデ</Button>
            <Button size="sm" variant={filterPartType === 'legs' ? 'primary' : 'secondary'} onClick={() => setFilterPartType('legs')}>アシ</Button>
          </div>
        )}
      </Card>

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

            const getPartSVG = (type: 'head' | 'body' | 'arms' | 'legs', r: number, vIdx: number) => {
              const map = type === 'head' ? SVG_HEADS : type === 'body' ? SVG_BODIES : type === 'arms' ? SVG_ARMS : SVG_LEGS;
              const list = (map[r] && map[r].length > 0) ? map[r] : map[1];
              return list[vIdx % list.length];
            };

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
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiMechaHead size={14} />アタマ</p>
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
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiMechanicalArm size={14} />ウデ</p>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {craftableVisuals.map((v, idx) => (
                          <SinglePart key={`arms-${idx}`} Comp={getPartSVG('arms', v.rarity, v.visualIndex)} color={color} type="arms" rarityLabel={v.rarity} />
                        ))}
                      </div>
                    </div>
                  )}
                  {(!filterPartType || filterPartType === 'All' || filterPartType === 'legs') && (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 flex items-center justify-center gap-1"><Gi.GiLegArmor size={14} />アシ</p>
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
