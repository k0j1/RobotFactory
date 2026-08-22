import React, { useState } from 'react';
import { GameState, Material } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { MATERIALS } from '../core/data';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export const CraftScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [selectedMats, setSelectedMats] = useState<string[]>([]);
  const [lastCrafted, setLastCrafted] = useState<any>(null);

  const availableMats = MATERIALS.filter(m => (state.materials[m.id] || 0) > 0);

  const toggleMat = (id: string) => {
    // allow max 3 mats for simplicity, or just unlimited. Let's say exactly 2 for a robot.
    if (selectedMats.includes(id)) {
      setSelectedMats(selectedMats.filter(m => m !== id));
    } else {
      if (selectedMats.length < 2) {
        setSelectedMats([...selectedMats, id]);
      }
    }
  };

  const handleCraft = () => {
    if (selectedMats.length < 2) {
      alert("素材を2つ選んでください");
      return;
    }
    try {
      const robot = engine.craftRobot(selectedMats);
      setLastCrafted(robot);
      setSelectedMats([]);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>ロボット製造</h2>
      
      {lastCrafted && (
        <Card className="text-center bg-amber-50 border-2 border-amber-200">
          <h3 className={`${theme.typography.h3} text-amber-800 mb-4`}>完成しました！</h3>
          <RobotVisual robot={lastCrafted} size={160} />
          <h4 className={`${theme.typography.h2} mt-4`}>{lastCrafted.name}</h4>
          <p className="mt-2 text-stone-600">属性: {lastCrafted.attribute}</p>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span>HP: {lastCrafted.stats.hp}</span>
            <span>Pow: {lastCrafted.stats.power}</span>
            <span>Def: {lastCrafted.stats.defense}</span>
          </div>
          <Button className="mt-4" onClick={() => setLastCrafted(null)}>続ける</Button>
        </Card>
      )}

      {!lastCrafted && (
        <>
          <p className={theme.typography.body}>所持している素材から2つ選んで組み合わせよう。</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableMats.length === 0 && <p className="text-stone-500 col-span-full">素材がありません。遠征に行って集めましょう。</p>}
            
            {availableMats.map(mat => {
              const count = state.materials[mat.id] || 0;
              const isSelected = selectedMats.includes(mat.id);
              return (
                <button 
                  key={mat.id}
                  onClick={() => toggleMat(mat.id)}
                  className={`text-left p-3 border-2 ${theme.radius.md} transition-all ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-stone-300 bg-white hover:border-stone-400'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm flex items-center gap-1">
                      <MaterialIcon materialId={mat.id} />
                      {mat.name}
                    </span>
                    <Badge className="bg-stone-200">x{count}</Badge>
                  </div>
                  <p className="text-xs text-stone-500">属性: {mat.attribute}</p>
                </button>
              );
            })}
          </div>

          <Card className="mt-8 flex justify-between items-center bg-stone-100">
            <div>
              <p className="font-bold">選択中: {selectedMats.length} / 2</p>
            </div>
            <Button size="lg" disabled={selectedMats.length !== 2} onClick={handleCraft}>製造開始</Button>
          </Card>
        </>
      )}
    </div>
  );
};
