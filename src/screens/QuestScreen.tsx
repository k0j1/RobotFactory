import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button } from '../components/ui/core';
import { LOCATIONS } from '../core/data';
import { theme } from '../styles/theme';

export const QuestScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  const handleStartQuest = (locId: string) => {
    engine.startQuest(locId, selectedRobotId || undefined);
  };

  return (
    <div className="space-y-6">
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>遠征先を選ぶ</h2>
      <p className={theme.typography.body}>場所を指定して素材を集めます。時間経過で帰還します。</p>

      {state.activeQuest && (
        <Card className="bg-red-100 border-2 border-red-400 text-red-900 font-bold mb-6">
          すでに遠征中です。「工房」タブで状況を確認してください。
        </Card>
      )}

      {/* Robot Selection */}
      <div className={`p-4 bg-stone-100 ${theme.radius.md}`}>
        <h3 className="font-bold mb-2">派遣するロボット（任意）</h3>
        <p className="text-xs text-stone-500 mb-2">ロボットを派遣すると素材量が増えたり、素早さ(Agi)に応じて遠征時間が短縮されます。</p>
        <select 
          className="w-full p-2 border border-stone-300 rounded" 
          value={selectedRobotId || ''} 
          onChange={e => setSelectedRobotId(e.target.value || null)}
        >
          <option value="">ロボットなし (基本素材のみ)</option>
          {state.robots.map((r, idx) => (
            <option key={`${r.id}-${idx}`} value={r.id}>{r.name} (Pow: {r.stats.power} Agi: {r.stats.agility})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map(loc => {
          const isUnlocked = state.unlockedLocations.includes(loc.id);
          const canUnlock = !isUnlocked && state.gold >= loc.unlockCostG;

          return (
            <Card key={loc.id} className={!isUnlocked ? 'opacity-75 bg-stone-200' : ''}>
              <h3 className={theme.typography.h3}>{loc.name}</h3>
              <p className={`${theme.typography.small} text-stone-500 mb-2`}>所要時間: {loc.baseTimeMs / 1000}秒</p>
              <p className="mb-4 text-sm">{loc.description}</p>

              {isUnlocked ? (
                <Button 
                  className="w-full" 
                  disabled={!!state.activeQuest}
                  onClick={() => handleStartQuest(loc.id)}
                >
                  ここへ遠征する
                </Button>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600">解放費用: {loc.unlockCostG} G</span>
                  <Button 
                    variant="secondary" 
                    disabled={!canUnlock}
                    onClick={() => engine.unlockLocation(loc.id)}
                  >
                    解放する
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

