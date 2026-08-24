import React, { useState } from 'react';
import { GameState, AttributeNames } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { LOCATIONS, MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { motion, AnimatePresence } from 'motion/react';


const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const Dashboard: React.FC<{ state: GameState, engine: GameEngine, onNavigate: (v: string) => void }> = ({ state, engine, onNavigate }) => {
    const [questResult, setQuestResult] = useState<{success: boolean, drops: string[]} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCompleteQuest = () => {
    const result = engine.completeQuest();
    if (result) {
      setQuestResult(result);
    }
  };

  const handleCloseModal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setQuestResult(null);
    }, 2000);
  };

  const activeQuestLoc = state.activeQuest ? LOCATIONS.find(l => l.id === state.activeQuest?.locationId) : null;
  const timeRemaining = state.activeQuest ? state.activeQuest.endTime - Date.now() : 0;
  const questDone = timeRemaining <= 0;

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className={`flex gap-4 p-4 ${theme.colors.surface} ${theme.radius.md} ${theme.shadow.sm}`}>
        <div className="flex-1">
          <p className={theme.typography.small}>所持金</p>
          <p className={`${theme.typography.h2} text-amber-600`}>{state.gold} G</p>
        </div>
        <div className="flex-1">
          <p className={theme.typography.small}>ロボット倉庫</p>
          <p className={theme.typography.h2}>{state.robots.length} / {state.storageSize}</p>
        </div>
        <div className="flex-1">
          <p className={theme.typography.small}>納品実績</p>
          <p className={theme.typography.h2}>{state.deliveredRobotsCount}体</p>
        </div>
      </div>

      {/* Tutorial Banner */}
      {state.tutorialStep < 5 && (
        <Card className="bg-blue-100 border-2 border-blue-400 text-blue-900">
          <h3 className={`${theme.typography.h3} text-blue-800`}>チュートリアル進行中！</h3>
          <p className="mt-2 font-bold font-sans">
            {state.tutorialStep === 0 && 'まずは下のメニューから「遠征」に行き、素材を集めてこよう。'}
            {state.tutorialStep === 1 && '遠征から帰還するのを待って、素材を受け取ろう。'}
            {state.tutorialStep === 2 && '素材が集まったら「製造」メニューでロボットを作ってみよう！'}
            {state.tutorialStep === 3 && 'ロボットが完成！「依頼板」を見て、納品できそうな依頼を受けよう。'}
            {state.tutorialStep === 4 && '依頼を受けたら、依頼詳細からロボットを「納品」しよう。'}
          </p>
        </Card>
      )}

      {/* Navigation Buttons for Shop, Encyclopedia, Litepaper */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Button variant="secondary" onClick={() => onNavigate('shop')} className="py-6 flex flex-col gap-2 px-1">
          <span className="text-2xl">🏪</span>
          <span className="text-xs sm:text-base">商店</span>
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('encyclopedia')} className="py-6 flex flex-col gap-2 px-1">
          <span className="text-2xl">📖</span>
          <span className="text-xs sm:text-base">図鑑・実績</span>
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('litepaper')} className="py-6 flex flex-col gap-2 px-1">
          <span className="text-2xl">📜</span>
          <span className="text-xs sm:text-base">仕様書</span>
        </Button>
      </div>

      {/* Active Quest */}
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>現在の状況</h2>
      
      {state.activeQuest ? (
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className={theme.typography.h3}>遠征中: {activeQuestLoc?.name}</h3>
            {questDone ? (
              <Badge className="bg-emerald-100 text-emerald-800">帰還完了</Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800">探索中...</Badge>
            )}
          </div>
          {!questDone && <p className="text-2xl text-center my-4 font-mono">{formatTime(timeRemaining)}</p>}
          <Button 
            className="w-full mt-4" 
            variant={questDone ? 'success' : 'secondary'} 
            disabled={!questDone}
            onClick={handleCompleteQuest}
          >
            {questDone ? '素材を回収する' : '探索を待つ'}
          </Button>
        </Card>
      ) : (
        <Card className="text-center p-8 bg-stone-100 border-dashed border-2 border-stone-300">
          <p className="mb-4 text-stone-500">現在、遠征中のチームはありません。</p>
          <Button onClick={() => onNavigate('quest')}>遠征へ向かう</Button>
        </Card>
      )}

      {/* Current Request */}
      {state.currentRequest && (
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className={theme.typography.h3}>受諾中の依頼</h3>
            <Badge className="bg-blue-100 text-blue-800">{state.currentRequest.clientName}</Badge>
          </div>
          <p className="mb-4">{state.currentRequest.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-600">報酬: {state.currentRequest.rewardG} G</span>
            <span className={theme.typography.small}>
              期限: {formatTime(state.currentRequest.deadline - Date.now())}
            </span>
          </div>
          <Button className="w-full mt-4" onClick={() => onNavigate('requests')}>納品へ進む</Button>
        </Card>
      )}

      {/* Quest Result Modal */}
      {questResult && !isAnimating && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-stone-50 text-center shadow-2xl">
            <h2 className={`${theme.typography.h2} mb-4 text-emerald-600`}>
              遠征成功！
            </h2>
            <p className="mb-4 font-bold">以下の素材を獲得しました！</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6 max-h-64 overflow-y-auto p-2">
              {questResult.drops.map((dropId, i) => {
                const mat = MATERIALS.find(m => m.id === dropId);
                return (
                  <Badge key={i} className="bg-amber-100 text-amber-900 border border-amber-300 p-2 text-sm flex items-center gap-1">
                    <MaterialIcon materialId={mat?.id || ''} />
                    {mat?.name}
                  </Badge>
                );
              })}
            </div>
            <Button onClick={handleCloseModal} className="w-full" size="lg" variant="primary">倉庫へ送る</Button>
          </Card>
        </div>
      )}
      
      {/* Particle Animation */}
      <AnimatePresence>
        {isAnimating && questResult && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {questResult.drops.map((dropId, i) => {
              const mat = MATERIALS.find(m => m.id === dropId);
              const angle = Math.random() * Math.PI * 2;
              const radius = Math.random() * 80 + 20;
              const initialX = Math.cos(angle) * radius;
              const initialY = Math.sin(angle) * radius - 50;
              
              // Target coordinates (storage button is approx bottom right, constrained by max-w-4xl)
              // max-w-4xl is 896px.
              const targetX = window.innerWidth / 2 + Math.min(window.innerWidth / 2, 448) * 0.8;
              const targetY = window.innerHeight - 30;

              return (
                <motion.div
                  key={i}
                  initial={{ x: window.innerWidth / 2 + initialX, y: window.innerHeight / 2 + initialY, scale: 0, opacity: 0 }}
                  animate={{ 
                    x: [window.innerWidth / 2 + initialX, window.innerWidth / 2 + initialX + (Math.random() * 100 - 50), targetX], 
                    y: [window.innerHeight / 2 + initialY, window.innerHeight / 2 + initialY - (Math.random() * 100 + 50), targetY],
                    scale: [0, 1.2, 0.5],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2 + Math.random() * 0.5, 
                    delay: i * 0.03, // Slight stagger
                    ease: "easeInOut",
                    times: [0, 0.4, 1]
                  }}
                  className="absolute shadow-lg bg-amber-100 rounded-full p-2 border-2 border-amber-400 flex items-center justify-center"
                  style={{ width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
                >
                  <MaterialIcon materialId={mat?.id || ''} size={20} />
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
