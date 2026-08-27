import React, { useState, useMemo } from 'react';
import { GameState, AttributeColors, AttributeNames } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';
import { MATERIALS, STORAGE_UPGRADE_COST, MAX_STORAGE_LEVELS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export const StorageScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [tab, setTab] = useState<'robots'|'parts'|'materials'>('robots');
  const [confirmRobotId, setConfirmRobotId] = useState<string | null>(null);
  const [confirmPartId, setConfirmPartId] = useState<string | null>(null);
  
  // Materials tab filtering
  const [matRarityFilter, setMatRarityFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [matAttributeFilter, setMatAttributeFilter] = useState<string>('All');
  const [matSearchQuery, setMatSearchQuery] = useState('');

  const currentSizeIndex = MAX_STORAGE_LEVELS.indexOf(state.storageSize);
  const nextSize = MAX_STORAGE_LEVELS[currentSizeIndex + 1];
  const upgradeCost = STORAGE_UPGRADE_COST[currentSizeIndex + 1];

  const handleShare = (robotName: string) => {
    const text = `私が作ったポンコツロボット「${robotName}」を見てくれ！ #ポンコツロボット工房`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const ownedMaterialsList = useMemo(() => {
    return MATERIALS.filter(mat => {
      const count = state.materials[mat.id] || 0;
      if (count === 0) return false;
      if (matRarityFilter !== 'all' && mat.rarity !== matRarityFilter) return false;
      if (matAttributeFilter !== 'All' && mat.attribute !== matAttributeFilter) return false;
      if (matSearchQuery && !mat.name.toLowerCase().includes(matSearchQuery.toLowerCase())) return false;
      return true;
    });
  }, [state.materials, matRarityFilter, matAttributeFilter, matSearchQuery]);

  const totalMaterialsCount = useMemo(() => {
    return Object.values(state.materials || {}).reduce<number>((sum, count) => sum + (Number(count) || 0), 0);
  }, [state.materials]);

  const totalDistinctMaterials = useMemo(() => {
    return Object.values(state.materials || {}).filter(count => (Number(count) || 0) > 0).length;
  }, [state.materials]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>倉庫</h2>
        {tab === 'robots' && (
          <span className="font-bold text-stone-500">容量: {state.robots?.length} / {state.storageSize}</span>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant={tab === 'robots' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('robots')}
        >
          ロボット
        </Button>
        <Button 
          variant={tab === 'parts' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('parts')}
        >
          パーツ
        </Button>
        <Button 
          variant={tab === 'materials' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('materials')}
        >
          素材
        </Button>
      </div>

      {tab === 'robots' && (
        <>
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="font-bold text-stone-600">所有ロボット</span>
            <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded border border-green-300 shadow-sm text-sm">
              🔧 修理キット: {state.repairKits || 0} 個
            </span>
          </div>

          {nextSize && (
            <Card className="flex justify-between items-center bg-stone-100">
              <div>
                <p className="font-bold">倉庫を拡張する</p>
                <p className="text-sm text-stone-600">最大容量: {nextSize}</p>
              </div>
              <Button 
                size="sm" 
                disabled={state.gold < upgradeCost}
                onClick={() => {
                  try { engine.upgradeStorage(upgradeCost, nextSize); } 
                  catch(e: any) { alert(e.message); }
                }}
              >
                {upgradeCost} G
              </Button>
            </Card>
          )}
          
          {state.robots?.length === 0 ? (
            <p className="text-center text-stone-500 py-8">ロボットがいません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.robots.map((r, idx) => {
                const isAutoDispatched = state.autoDispatches?.some(d => d.robotId === r.id);
                const isQuesting = state.activeQuest?.dispatchedRobotId === r.id;

                return (
                  <Card key={`${r.id}-${idx}`} className="relative p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className={theme.typography.h3}>{r.name}</h3>
                          {isQuesting && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                              遠征中
                            </span>
                          )}
                          {isAutoDispatched && (
                            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                              自動探索中
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-stone-700">残HP: {r.currentHp ?? 12}/{r.maxHp ?? 12}</span>
                            {state.repairKits && state.repairKits > 0 ? (
                              <button
                                onClick={() => engine.useRepairKit(r.id)}
                                disabled={(r.currentHp ?? 12) >= (r.maxHp ?? 12)}
                                className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-300 font-bold hover:bg-green-200 disabled:opacity-50"
                              >
                                🔧 修理キット使用
                              </button>
                            ) : null}
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all" 
                              style={{ width: `${Math.max(0, Math.min(100, ((r.currentHp ?? 12) / (r.maxHp ?? 12)) * 100))}%` }} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2 text-xs text-stone-600 font-mono">
                          <span>Vit: {r.stats.hp}</span>
                          <span>Pow: {r.stats.power}</span>
                          <span>Def: {r.stats.defense}</span>
                          <span>Agi: {r.stats.agility}</span>
                          <span>Dex: {r.stats.dexterity}</span>
                          <span>Int: {r.stats.intelligence}</span>
                        </div>
                        {r.battleStats && r.battleStats.matches > 0 && (
                          <div className="mt-2 text-[10px] font-bold text-stone-600 bg-stone-100 p-1.5 rounded border border-stone-200">
                            戦績: {r.battleStats.matches}戦 {r.battleStats.wins}勝 {r.battleStats.losses}敗 {r.battleStats.draws}分 
                            (勝率: {Math.round(r.battleStats.wins / r.battleStats.matches * 100)}%)
                          </div>
                        )}

                        {/* 左側のスペースに配置したシェアボタン */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleShare(r.name)}
                            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded border border-stone-300 transition"
                          >
                            <span>𝕏</span>
                            <span>シェア</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-shrink-0 bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                        <RobotVisual robot={r} size={84} />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200 flex justify-end items-center">
                      {confirmRobotId === r.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => setConfirmRobotId(null)}>キャンセル</Button>
                          <Button size="sm" variant="danger" onClick={() => { engine.disassembleRobot(r.id); setConfirmRobotId(null); }}>解体実行</Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="danger" 
                          disabled={isQuesting || isAutoDispatched}
                          onClick={() => setConfirmRobotId(r.id)}
                        >
                          {isQuesting || isAutoDispatched ? '出撃中のため解体不可' : '解体する'}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'parts' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {state.parts?.length === 0 ? (
            <p className="text-stone-500 col-span-full">パーツがありません</p>
          ) : (
            state.parts.map((p, idx) => (
              <Card key={`${p.id}-${idx}`} className="p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-[10px] text-stone-500">属性: {p.attribute}</p>
                    <div className="mt-1 text-[10px] text-stone-600">
                      <p>HP: {p.stats.hp}</p>
                      <p>Pow: {p.stats.power}</p>
                      <p>Def: {p.stats.defense}</p>
                    </div>
                  </div>
                  <div className="bg-stone-100 rounded-md p-1 border border-stone-200">
                    <PartVisual part={p} size={48} />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  {confirmPartId === p.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setConfirmPartId(null)}>やめる</Button>
                      <Button size="sm" variant="danger" onClick={() => { engine.recyclePart(p.id); setConfirmPartId(null); }}>還元する</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="danger" onClick={() => setConfirmPartId(p.id)}>素材に戻す</Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'materials' && (
        <div className="space-y-4">
          {/* Summary & Filters Header */}
          <div className="bg-stone-100 p-3 rounded-lg border border-stone-300 space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-bold text-xs sm:text-sm text-stone-700">
                所持素材: <strong className="text-amber-700">{totalMaterialsCount}</strong> 個 ({totalDistinctMaterials} 種類)
              </span>
              
              {/* Rarity filter tabs */}
              <div className="flex gap-1 items-center">
                <span className="text-xs text-stone-500 font-bold mr-1">レア度:</span>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 'all' ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter('all')}
                  className="px-2 py-1 text-xs"
                >
                  すべて
                </Button>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 1 ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter(1)}
                  className="px-2 py-1 text-xs"
                >
                  ★1
                </Button>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 2 ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter(2)}
                  className="px-2 py-1 text-xs"
                >
                  ★2
                </Button>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 3 ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter(3)}
                  className="px-2 py-1 text-xs"
                >
                  ★3
                </Button>
              </div>
            </div>

            {/* Attribute & Search */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pt-2 border-t border-stone-200">
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-xs text-stone-500 font-bold mr-1">属性:</span>
                <button
                  onClick={() => setMatAttributeFilter('All')}
                  className={`px-2 py-0.5 text-xs rounded border ${matAttributeFilter === 'All' ? 'bg-stone-800 text-white border-stone-800 font-bold' : 'bg-white text-stone-700 border-stone-300'}`}
                >
                  すべて
                </button>
                {Object.keys(AttributeNames).map(attr => {
                  const isSelected = matAttributeFilter === attr;
                  return (
                    <button
                      key={attr}
                      onClick={() => setMatAttributeFilter(attr)}
                      className={`px-2 py-0.5 text-xs rounded border transition-colors ${isSelected ? 'font-bold text-white shadow-xs' : 'bg-white text-stone-700 border-stone-300'}`}
                      style={isSelected ? { backgroundColor: AttributeColors[attr as keyof typeof AttributeColors], borderColor: AttributeColors[attr as keyof typeof AttributeColors] } : {}}
                    >
                      {AttributeNames[attr as keyof typeof AttributeNames]}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="素材名で絞り込み..."
                value={matSearchQuery}
                onChange={e => setMatSearchQuery(e.target.value)}
                className="p-1.5 text-xs border border-stone-300 rounded bg-white w-full sm:w-44"
              />
            </div>
          </div>

          {/* Materials Grid */}
          {ownedMaterialsList.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-lg border border-stone-200 text-stone-500">
              <p className="font-bold text-sm">該当する所持素材がありません</p>
              <p className="text-xs mt-1 text-stone-400">「遠征」や「自動探索」で素材を集めましょう！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {ownedMaterialsList.map(mat => {
                const count = state.materials[mat.id] || 0;
                const rarityStyle = theme.rarity[mat.rarity];
                const attrColor = AttributeColors[mat.attribute];
                const attrName = AttributeNames[mat.attribute];

                return (
                  <div 
                    key={mat.id} 
                    className={`p-3 rounded-lg border-2 ${rarityStyle.border} ${rarityStyle.bg} ${rarityStyle.ring} flex flex-col justify-between transition-shadow hover:shadow-md relative overflow-hidden`}
                  >
                    {/* Top row: Name, Attribute badge & Quantity badge */}
                    <div className="flex justify-between items-start gap-1 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="p-1 rounded-md text-white flex items-center justify-center shadow-2xs"
                            style={{ backgroundColor: attrColor }}
                          >
                            <MaterialIcon materialId={mat.id} size={14} />
                          </span>
                          <span className={`font-bold text-sm ${rarityStyle.text}`}>
                            {mat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span 
                            className="text-[10px] px-1.5 py-0.2 rounded font-bold text-white shadow-2xs"
                            style={{ backgroundColor: attrColor }}
                          >
                            {attrName}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${rarityStyle.badge}`}>
                            {rarityStyle.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-stone-900 text-white font-bold text-xs px-2 py-0.5 shadow-xs">
                          x{count}
                        </Badge>
                        <span className="text-[10px] text-stone-500 font-mono">
                          単価 {mat.price} G
                        </span>
                      </div>
                    </div>

                    {/* Stats preview */}
                    <div className="mt-2 pt-2 border-t border-stone-200/80 grid grid-cols-3 gap-x-2 gap-y-0.5 text-[10px] text-stone-600 font-mono">
                      <span>HP: +{mat.baseStats.hp}</span>
                      <span>Pow: +{mat.baseStats.power}</span>
                      <span>Def: +{mat.baseStats.defense}</span>
                      <span>Agi: +{mat.baseStats.agility}</span>
                      <span>Dex: +{mat.baseStats.dexterity}</span>
                      <span>Int: +{mat.baseStats.intelligence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
