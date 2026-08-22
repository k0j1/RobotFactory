import React, { useState } from 'react';
import { GameState, Material, PartType, RobotPart } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { MATERIALS } from '../core/data';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { AttributeEffects } from '../components/effects/AttributeEffects';
import { theme } from '../styles/theme';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { motion } from 'motion/react';

export const CraftScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [tab, setTab] = useState<'part' | 'robot'>('part');

  // Part Crafting State
  const [selectedMat, setSelectedMat] = useState<string | null>(null);
  const [selectedPartType, setSelectedPartType] = useState<PartType>('head');
  const [lastCraftedPart, setLastCraftedPart] = useState<RobotPart | null>(null);

  // Robot Assembly State
  const [selectedHead, setSelectedHead] = useState<string>('');
  const [selectedBody, setSelectedBody] = useState<string>('');
  const [selectedArms, setSelectedArms] = useState<string>('');
  const [selectedLegs, setSelectedLegs] = useState<string>('');
  const [lastCraftedRobot, setLastCraftedRobot] = useState<any>(null);

  // Animation State
  const [isCrafting, setIsCrafting] = useState<boolean>(false);
  const [craftingMat, setCraftingMat] = useState<Material | null>(null);

  const availableMats = MATERIALS.filter(m => (state.materials[m.id] || 0) > 0);
  
  const heads = state.parts.filter(p => p.type === 'head');
  const bodies = state.parts.filter(p => p.type === 'body');
  const arms = state.parts.filter(p => p.type === 'arms');
  const legs = state.parts.filter(p => p.type === 'legs');

  const handleCraftPart = () => {
    if (!selectedMat) {
      alert("素材を選んでください");
      return;
    }
    try {
      const part = engine.craftPart(selectedPartType, selectedMat);
      
      const mat = MATERIALS.find(m => m.id === selectedMat)!;
      setCraftingMat(mat);
      setIsCrafting(true);
      setSelectedMat(null);
      
      setTimeout(() => {
        setIsCrafting(false);
        setLastCraftedPart(part);
      }, 2000);
      
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAssemble = () => {
    if (!selectedHead || !selectedBody || !selectedArms || !selectedLegs) {
      alert("すべてのパーツを選んでください");
      return;
    }
    try {
      const robot = engine.assembleRobot(selectedHead, selectedBody, selectedArms, selectedLegs);
      setIsCrafting(true);
      
      // Clear selections
      setSelectedHead('');
      setSelectedBody('');
      setSelectedArms('');
      setSelectedLegs('');

      setTimeout(() => {
        setIsCrafting(false);
        setLastCraftedRobot(robot);
      }, 2500);
    } catch(e: any) {
      alert(e.message);
    }
  };

  const partTypes: {id: PartType, label: string}[] = [
    {id: 'head', label: 'ヘッド'},
    {id: 'body', label: 'ボディ'},
    {id: 'arms', label: 'アーム'},
    {id: 'legs', label: 'レッグ'}
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button 
          className={`flex-1 py-2 font-bold rounded-t-md border-b-4 ${tab === 'part' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('part')}
        >
          パーツ製造
        </button>
        <button 
          className={`flex-1 py-2 font-bold rounded-t-md border-b-4 ${tab === 'robot' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('robot')}
        >
          ロボット組立
        </button>
      </div>

      {isCrafting && (
        <Card className="flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden bg-stone-900 border-2 border-stone-800">
          <h3 className="text-stone-300 font-bold mb-8 animate-pulse z-10 text-xl tracking-widest">
            {tab === 'part' ? 'パーツ製造中...' : 'ロボット組立中...'}
          </h3>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {tab === 'part' && craftingMat && (
              <motion.div
                initial={{ y: 50, scale: 0, rotate: 0 }}
                animate={{ y: 0, scale: [0, 2, 2, 0], rotate: 720 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute text-5xl"
                style={{ color: '#fff' }}
              >
                <MaterialIcon materialId={craftingMat.id} size={64} />
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 0, 5, 15], opacity: [0, 0, 1, 0] }}
              transition={{ duration: tab === 'part' ? 2 : 2.5, times: [0, 0.7, 0.85, 1] }}
              className="absolute w-16 h-16 bg-white rounded-full blur-xl"
            />
          </div>
        </Card>
      )}

      {!isCrafting && tab === 'part' && lastCraftedPart && (
        <Card className="text-center bg-amber-50 border-2 border-amber-200">
          <h3 className={`${theme.typography.h3} text-amber-800 mb-4`}>パーツが完成しました！</h3>
          <div className="flex justify-center my-4">
            <PartVisual part={lastCraftedPart} size={96} />
          </div>
          <h4 className={`${theme.typography.h2} mt-4`}>{lastCraftedPart.name}</h4>
          <p className="mt-2 text-stone-600">属性: {lastCraftedPart.attribute}</p>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span>HP: {lastCraftedPart.stats.hp}</span>
            <span>Pow: {lastCraftedPart.stats.power}</span>
            <span>Def: {lastCraftedPart.stats.defense}</span>
          </div>
          <Button className="mt-4" onClick={() => setLastCraftedPart(null)}>続ける</Button>
        </Card>
      )}

      {!isCrafting && tab === 'robot' && lastCraftedRobot && (
        <Card className="text-center bg-amber-50 border-2 border-amber-200">
          <h3 className={`${theme.typography.h3} text-amber-800 mb-4`}>ロボットが完成しました！</h3>
          <RobotVisual robot={lastCraftedRobot} size={160} />
          <h4 className={`${theme.typography.h2} mt-4`}>{lastCraftedRobot.name}</h4>
          <div className="flex justify-center gap-4 mt-2 text-sm font-bold text-stone-600">
            <span>HP: {lastCraftedRobot.stats.hp}</span>
            <span>Pow: {lastCraftedRobot.stats.power}</span>
            <span>Def: {lastCraftedRobot.stats.defense}</span>
          </div>
          <Button className="mt-4" onClick={() => setLastCraftedRobot(null)}>続ける</Button>
        </Card>
      )}

      {!isCrafting && tab === 'part' && !lastCraftedPart && (
        <>
          <p className={theme.typography.body}>作成するパーツの部位と素材を1つ選んでください。</p>
          
          <div className="flex gap-2 mb-4">
            {partTypes.map(pt => (
              <button
                key={pt.id}
                onClick={() => setSelectedPartType(pt.id)}
                className={`flex-1 py-2 text-sm font-bold border-2 ${theme.radius.md} ${selectedPartType === pt.id ? 'border-amber-500 bg-amber-100 text-amber-800' : 'border-stone-200 bg-white text-stone-500'}`}
              >
                {pt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableMats.length === 0 && <p className="text-stone-500 col-span-full">素材がありません。</p>}
            
            {availableMats.map(mat => {
              const count = state.materials[mat.id] || 0;
              const isSelected = selectedMat === mat.id;
              return (
                <button 
                  key={mat.id}
                  onClick={() => setSelectedMat(mat.id)}
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
              <p className="font-bold">部位: {partTypes.find(p => p.id === selectedPartType)?.label}</p>
            </div>
            <Button size="lg" disabled={!selectedMat} onClick={handleCraftPart}>パーツ製造</Button>
          </Card>
        </>
      )}

      {!isCrafting && tab === 'robot' && !lastCraftedRobot && (
        <div className="space-y-4">
          <p className={theme.typography.body}>各部位のパーツを組み合わせてロボットを組み立てます。</p>
          
          <Card className="flex flex-col items-center justify-center p-4 bg-stone-100 border-2 border-stone-300 border-dashed relative overflow-hidden">
            <h3 className="font-bold text-stone-500 mb-2 z-10">プレビュー</h3>
            
            {/* プレビュー用エフェクト */}
            <AttributeEffects 
              attributes={Array.from(new Set([
                heads.find(p => p.id === selectedHead)?.attribute,
                bodies.find(p => p.id === selectedBody)?.attribute,
                arms.find(p => p.id === selectedArms)?.attribute,
                legs.find(p => p.id === selectedLegs)?.attribute
              ].filter(Boolean) as any))} 
            />

            <div className="z-10 relative">
              <RobotVisual 
                robot={{
                  parts: {
                    head: heads.find(p => p.id === selectedHead),
                    body: bodies.find(p => p.id === selectedBody),
                    arms: arms.find(p => p.id === selectedArms),
                    legs: legs.find(p => p.id === selectedLegs)
                  }
                }} 
                size={120} 
              />
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-stone-700">ヘッド</label>
              <select 
                className="p-2 border border-stone-300 rounded-md bg-white"
                value={selectedHead}
                onChange={e => setSelectedHead(e.target.value)}
              >
                <option value="">選択してください</option>
                {heads.map(p => <option key={p.id} value={p.id}>{p.name} (HP:{p.stats.hp} 属性:{p.attribute})</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-stone-700">ボディ</label>
              <select 
                className="p-2 border border-stone-300 rounded-md bg-white"
                value={selectedBody}
                onChange={e => setSelectedBody(e.target.value)}
              >
                <option value="">選択してください</option>
                {bodies.map(p => <option key={p.id} value={p.id}>{p.name} (HP:{p.stats.hp} 属性:{p.attribute})</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-stone-700">アーム</label>
              <select 
                className="p-2 border border-stone-300 rounded-md bg-white"
                value={selectedArms}
                onChange={e => setSelectedArms(e.target.value)}
              >
                <option value="">選択してください</option>
                {arms.map(p => <option key={p.id} value={p.id}>{p.name} (HP:{p.stats.hp} 属性:{p.attribute})</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-stone-700">レッグ</label>
              <select 
                className="p-2 border border-stone-300 rounded-md bg-white"
                value={selectedLegs}
                onChange={e => setSelectedLegs(e.target.value)}
              >
                <option value="">選択してください</option>
                {legs.map(p => <option key={p.id} value={p.id}>{p.name} (HP:{p.stats.hp} 属性:{p.attribute})</option>)}
              </select>
            </div>
          </div>

          <Card className="mt-8 flex justify-end items-center bg-stone-100">
            <Button size="lg" disabled={!selectedHead || !selectedBody || !selectedArms || !selectedLegs} onClick={handleAssemble}>組立開始</Button>
          </Card>
        </div>
      )}
    </div>
  );
};
