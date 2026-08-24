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
          <span className="font-bold text-stone-500">容量: {state.robots.length} / {state.storageSize}</span>
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
          
          {state.robots.length === 0 ? (
            <p className="text-center text-stone-500 py-8">ロボットがいません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.robots.map((r, idx) => (
                <Card key={`${r.id}-${idx}`} className="relative pt-6">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => handleShare(r.name)}>Share</Button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={theme.typography.h3}>{r.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-stone-600">
                        <span>HP: {r.stats.hp}</span>
                        <span>Pow: {r.stats.power}</span>
                        <span>Def: {r.stats.defense}</span>
                        <span>Agi: {r.stats.agility}</span>
                        <span>Dex: {r.stats.dexterity}</span>
                      </div>
                      <p className="mt-2 font-bold text-amber-700">価値: {r.value} G</p>
                    </div>
                    <RobotVisual robot={r} size={80} />
                  </div>
                  <div className="mt-4 flex justify-end">
                    {confirmRobotId === r.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setConfirmRobotId(null)}>キャンセル</Button>
                        <Button size="sm" variant="danger" onClick={() => { engine.disassembleRobot(r.id); setConfirmRobotId(null); }}>解体実行</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="danger" onClick={() => setConfirmRobotId(r.id)}>解体する</Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'parts' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {state.parts.length === 0 ? (
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
