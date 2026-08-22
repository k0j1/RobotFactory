import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';
import { MATERIALS, STORAGE_UPGRADE_COST, MAX_STORAGE_LEVELS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export const StorageScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [tab, setTab] = useState<'robots'|'materials'>('robots');
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
                <h3 className="font-bold text-sm">倉庫を拡張する</h3>
                <p className="text-xs text-stone-500">容量を {nextSize} に増やします</p>
              </div>
              <Button 
                size="sm" 
                disabled={state.gold < upgradeCost}
                onClick={() => engine.upgradeStorage(upgradeCost, nextSize)}
              >
                {upgradeCost} G で拡張
              </Button>
            </Card>
          )}

          {state.robots.length === 0 ? (
            <p className="text-center text-stone-500 py-12">倉庫は空っぽです。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.robots.map(r => (
                <Card key={r.id} className="flex flex-col">
                  <div className="flex justify-center mb-4 bg-stone-100 rounded-lg p-4">
                    <RobotVisual robot={r} size={100} />
                  </div>
                  <h3 className="font-bold text-lg text-center mb-2">{r.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-stone-50 p-2 rounded">
                    <span className="text-stone-500">属性: <b className="text-stone-800">{r.attribute}</b></span>
                    <span className="text-stone-500">体力: <b className="text-stone-800">{r.stats.hp}</b></span>
                    <span className="text-stone-500">パワー: <b className="text-stone-800">{r.stats.power}</b></span>
                    <span className="text-stone-500">防御: <b className="text-stone-800">{r.stats.defense}</b></span>
                    <span className="text-stone-500">敏捷: <b className="text-stone-800">{r.stats.agility}</b></span>
                    <span className="text-stone-500">器用: <b className="text-stone-800">{r.stats.dexterity}</b></span>
                  </div>
                  <div className="flex gap-2 mt-auto flex-wrap">
                    <Button className="flex-1 min-w-[80px]" variant="success" size="sm" onClick={() => engine.sellRobot(r.id)}>
                      売却 ({r.value}G)
                    </Button>
                    <Button className="flex-1 min-w-[80px]" variant="danger" size="sm" onClick={() => engine.scrapRobot(r.id)}>
                      解体 (素材化)
                    </Button>
                    <Button className="w-full" variant="secondary" size="sm" onClick={() => handleShare(r.name)}>
                      Xでシェア
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'materials' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MATERIALS.filter(m => (state.materials[m.id] || 0) > 0).length === 0 ? (
            <p className="col-span-full text-center text-stone-500 py-12">所持している素材はありません。</p>
          ) : (
            MATERIALS.filter(m => (state.materials[m.id] || 0) > 0).map(m => (
              <Card key={m.id} className="text-center flex flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                  <p className="font-bold text-sm mb-1 flex items-center justify-center gap-1">
                    <MaterialIcon materialId={m.id} size={18} />
                    {m.name}
                  </p>
                  <p className="text-xs text-stone-500 mb-3">属性: {m.attribute}</p>
                </div>
                <Badge className="bg-stone-200 text-stone-700 font-bold text-lg px-4 py-1 mt-auto">
                  x {state.materials[m.id]}
                </Badge>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
