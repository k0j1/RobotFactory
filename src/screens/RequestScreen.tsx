import React, { useState } from 'react';
import { GameState, ClientRequest } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';

export const RequestScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');

  const formatTime = (ms: number) => {
    if (ms <= 0) return '期限切れ';
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}時間${m}分`;
  };

  const handleDeliver = () => {
    if (!selectedRobotId) return;
    try {
      engine.deliverRobot(selectedRobotId);
      alert("納品完了！報酬を獲得しました。");
      setSelectedRobotId('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>依頼掲示板</h2>
      
      {state.currentRequest ? (
        <Card className="border-2 border-blue-300 bg-blue-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${theme.typography.h3} text-blue-900`}>進行中の依頼</h3>
            <Button variant="danger" size="sm" onClick={() => engine.cancelRequest()}>破棄する</Button>
          </div>
          
          <div className="mb-4">
            <p className="font-bold mb-2">依頼主: {state.currentRequest.clientName}</p>
            <p className="p-3 bg-white rounded-md text-stone-700">「{state.currentRequest.description}」</p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-amber-600 text-lg">報酬: {state.currentRequest.rewardG} G</span>
            <span className="text-red-600 font-bold">残り: {formatTime(state.currentRequest.deadline - Date.now())}</span>
          </div>

          <h4 className="font-bold mb-2">納品するロボットを選ぶ</h4>
          {state.robots.length === 0 ? (
            <p className="text-stone-500">倉庫にロボットがいません。</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {state.robots.map(r => (
                <button 
                  key={r.id} 
                  onClick={() => setSelectedRobotId(r.id)}
                  className={`p-2 border-2 ${theme.radius.md} ${selectedRobotId === r.id ? 'border-amber-500 bg-amber-100' : 'border-stone-200 bg-white'}`}
                >
                  <RobotVisual robot={r} size={60} />
                  <p className="text-xs font-bold mt-2 truncate">{r.name}</p>
                </button>
              ))}
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedRobotId}
            onClick={handleDeliver}
          >
            このロボットを納品する
          </Button>
        </Card>
      ) : (
        <>
          <p className="text-stone-600">現在出ている依頼です。1つだけ受けることができます。</p>
          <div className="grid gap-4">
            {state.availableRequests.map(req => (
              <Card key={req.id}>
                <div className="flex justify-between items-center mb-2">
                  <Badge className={req.rank === 'King' ? 'bg-amber-200 text-amber-800' : req.rank === 'Noble' ? 'bg-purple-200 text-purple-800' : 'bg-stone-200'}>
                    {req.clientName}
                  </Badge>
                  <span className="font-bold text-amber-600">{req.rewardG} G</span>
                </div>
                <p className="mb-4 text-sm">{req.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500">制限時間: {Math.floor((req.deadline - Date.now())/(1000*60*60))}時間</span>
                  <Button onClick={() => engine.acceptRequest(req.id)}>この依頼を受ける</Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
