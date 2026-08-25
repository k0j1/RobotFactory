import React, { useState } from 'react';
import { GameState } from '../core/models';
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

  const currentSizeIndex = MAX_STORAGE_LEVELS.indexOf(state.storageSize);
  const nextSize = MAX_STORAGE_LEVELS[currentSizeIndex + 1];
  const upgradeCost = STORAGE_UPGRADE_COST[currentSizeIndex + 1];

  const handleShare = (robotName: string) => {
    const text = `私が作ったポンコツロボット「${robotName}」を見てくれ！ #ポンコツロボット工房`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

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

                        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1 text-xs text-stone-600 font-mono">
                          <span>HP: {r.stats.hp}</span>
                          <span>Pow: {r.stats.power}</span>
                          <span>Def: {r.stats.defense}</span>
                          <span>Agi: {r.stats.agility}</span>
                          <span>Dex: {r.stats.dexterity}</span>
                          <span>Int: {r.stats.intelligence}</span>
                        </div>

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MATERIALS.map(mat => {
            const count = state.materials[mat.id] || 0;
            if (count === 0) return null;
            return (
              <Card key={mat.id} className="flex justify-between items-center p-3">
                <div>
                  <p className="font-bold text-sm flex items-center gap-1">
                    <MaterialIcon materialId={mat.id} />
                    {mat.name}
                  </p>
                  <p className="text-xs text-stone-500">属性: {mat.attribute}</p>
                </div>
                <Badge>x{count}</Badge>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
