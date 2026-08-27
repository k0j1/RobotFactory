import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { LOCATIONS } from '../core/data';
import { theme } from '../styles/theme';
import { TutorialPopup } from '../components/ui/TutorialPopup';

export const QuestScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  const handleStartQuest = (locId: string) => {
    try {
      engine.startQuest(locId, selectedRobotId || undefined);
    } catch (e: any) {
      alert(e.message || '遠征の開始に失敗しました');
    }
  };

  const selectedRobot = state.robots.find(r => r.id === selectedRobotId);

  return (
    <div className="space-y-6">

      <TutorialPopup 
        tutorialId="quest_first_visit" 
        state={state} 
        engine={engine} 
        title="遠征（探索）について" 
        description={"ここではロボットを連れて行って素材を集めることができます。\n・好きな場所を選んで「ここへ遠征する」を押すと、一定時間後に素材を持ち帰ります。\n・ロボットを連れて行くとアイテムドロップ枠が増え、さらに素早さ(Agi)に応じて遠征時間が短縮されます！"} 
      />
  
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>遠征先を選ぶ</h2>
      <p className={theme.typography.body}>場所を指定して素材を集めます。時間経過で帰還します。</p>

      {state.activeQuest && (
        <Card className="bg-red-100 border-2 border-red-400 text-red-900 font-bold mb-6">
          すでに遠征中です。「工房」タブで状況を確認してください。
        </Card>
      )}

      {/* Robot Selection */}
      <div className={`p-4 bg-stone-100 ${theme.radius.md} border border-stone-300`}>
        <h3 className="font-bold mb-1 text-stone-800">連れて行くロボット（任意）</h3>
        <p className="text-xs text-stone-600 mb-3">
          ロボットを連れて行くと素材量が増えたり、素早さ(Agi)に応じて遠征時間が短縮されます。
        </p>
        
        <select 
          className="w-full p-2 border border-stone-300 rounded bg-white font-sans text-sm" 
          value={selectedRobotId || ''} 
          onChange={e => setSelectedRobotId(e.target.value || null)}
        >
          <option value="">ロボットなし (基本素材のみ)</option>
          {state.robots.map((r, idx) => {
            const isAutoDispatched = state.autoDispatches?.some(d => d.robotId === r.id);
            return (
              <option 
                key={`${r.id}-${idx}`} 
                value={r.id}
                disabled={isAutoDispatched}
              >
                {r.name} (Pow: {r.stats.power} Agi: {r.stats.agility}) {isAutoDispatched ? '【自動探索中のため不可】' : ''}
              </option>
            );
          })}
        </select>

        {/* Selected Robot Visual & Stats */}
        {selectedRobot && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-stone-300 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-stone-800">{selectedRobot.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  同行設定中
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1.5 text-xs text-stone-600 font-mono">
                <span>HP: {selectedRobot.stats.hp}</span>
                <span>Pow: {selectedRobot.stats.power}</span>
                <span>Def: {selectedRobot.stats.defense}</span>
                <span>Agi: {selectedRobot.stats.agility}</span>
                <span>Dex: {selectedRobot.stats.dexterity}</span>
                <span>Int: {selectedRobot.stats.intelligence}</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-stone-50 p-1 rounded-md border border-stone-200">
              <RobotVisual robot={selectedRobot} size={64} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map(loc => {
          const isUnlocked = state.unlockedLocations.includes(loc.id);
          const canUnlock = !isUnlocked && state.gold >= loc.unlockCostG;

          // Agilityによる短縮計算
          const baseSec = loc.baseTimeMs / 1000;
          const agiReductionSec = selectedRobot ? Math.min(baseSec * 0.8, selectedRobot.stats.agility) : 0;
          const finalSec = Math.max(3, Math.round(baseSec - agiReductionSec));

          // 気候・天候タグの取得
          const weatherTag = 
            loc.id === 'loc1' ? '🏜️ 砂塵・熱風' :
            loc.id === 'loc2' ? '🌋 灼熱・火の粉' :
            loc.id === 'loc3' ? '🌧️ 鉱毒雨・水滴' :
            loc.id === 'loc4' ? '🌀 磁気嵐・突風' :
            loc.id === 'loc5' ? '❄️ 極寒・猛吹雪' :
            loc.id === 'loc6' ? '✨ 星雲・宇宙線' :
            '⚡ デジタル粒子';

          return (
            <Card key={loc.id} className={!isUnlocked ? 'opacity-75 bg-stone-200' : ''}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={theme.typography.h3}>{loc.name}</h3>
                <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium border border-stone-200">
                  {weatherTag}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <p className={`${theme.typography.small} text-stone-500`}>
                  所要時間: <span className={selectedRobot && agiReductionSec > 0 ? "line-through text-stone-400" : "font-mono font-bold text-stone-700"}>{baseSec}秒</span>
                </p>
                {selectedRobot && agiReductionSec > 0 && (
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    ➔ {finalSec}秒 (-{Math.round(agiReductionSec)}秒短縮⚡)
                  </span>
                )}
              </div>

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

