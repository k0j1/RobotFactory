import React, { useState } from 'react';
import { GameState } from '../core/models';
import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { RobotVisual } from '../components/robot/RobotVisual';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import * as Gi from 'react-icons/gi';

export const DeliveryHistoryScreen: React.FC<{ state: GameState; onBack: () => void }> = ({ state, onBack }) => {
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'highestScore'>('recent');

  const history = [...(state.deliveredLogs || [])];
  
  if (filterType === 'recent') {
    history.sort((a, b) => Number(b.deliveredAt || 0) - Number(a.deliveredAt || 0));
  } else if (filterType === 'highestScore') {
    history.sort((a, b) => {
      const scoreA = Object.values(a.stats || {}).reduce((acc: number, val: any) => acc + (typeof val === 'number' ? val : 0), 0) as number;
      const scoreB = Object.values(b.stats || {}).reduce((acc: number, val: any) => acc + (typeof val === 'number' ? val : 0), 0) as number;
      return scoreB - scoreA;
    });
  }

  const formatDateTime = (timestamp: number) => {
    const d = new Date(timestamp);
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${m}/${day} ${hh}:${mm}`;
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        icon={<Gi.GiArchiveResearch size={16} />}
        title="納品履歴"
        rightElement={
          <Button size="sm" variant="secondary" onClick={onBack}>
            <Gi.GiReturnArrow className="inline mr-1" /> 戻る
          </Button>
        }
      />

      <Card className="bg-stone-50 border border-stone-200 p-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-stone-700 text-sm">
          総納品数: {state.deliveredRobotsCount || state.deliveredLogs?.length || 0} 機
        </span>
        <div className="flex bg-stone-200/50 p-1 rounded gap-1">
          <button
            onClick={() => setFilterType('recent')}
            className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded transition ${filterType === 'recent' ? 'bg-white shadow text-blue-700' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            新しい順
          </button>
          <button
            onClick={() => setFilterType('highestScore')}
            className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded transition ${filterType === 'highestScore' ? 'bg-white shadow text-blue-700' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            能力値順
          </button>
        </div>
      </Card>

      {history.length === 0 ? (
        <Card className="bg-white p-8 text-center border-dashed">
          <Gi.GiRobber size={48} className="mx-auto text-stone-300 mb-2" />
          <p className="text-stone-500 text-sm">納品履歴はまだありません。</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {history.map((log, idx) => {
            const totalStats = Object.values(log.stats || {}).reduce((acc: number, val: any) => acc + (typeof val === 'number' ? val : 0), 0);
            
            return (
              <Card key={`${log.id}-${log.deliveredAt ?? idx}-${idx}`} className="border border-stone-200 bg-white hover:border-blue-300 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-shrink-0 w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center p-1 border border-stone-200 relative">
                    <RobotVisual robot={log as any} size={64} />
                    {log.battleStats && log.battleStats.wins > 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-amber-300 flex items-center gap-0.5">
                        <Gi.GiBroadsword /> {log.battleStats.wins}勝
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className={`${theme.typography.h4} text-stone-900 truncate pr-2`}>
                        {log.name || '名無しのロボット'}
                      </h3>
                      <Badge className="bg-stone-100 text-stone-600 font-mono text-[10px] shrink-0">
                        {formatDateTime(log.deliveredAt)} 納品
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-stone-600 bg-stone-50 p-2 rounded border border-stone-100">
                      <div className="flex justify-between border-b border-stone-200 pb-0.5">
                        <span>HP:</span><span className="font-bold text-rose-600">{log.stats?.hp || 0}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-0.5">
                        <span>Power:</span><span className="font-bold text-amber-600">{log.stats?.power || 0}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-0.5">
                        <span>Defense:</span><span className="font-bold text-blue-600">{log.stats?.defense || 0}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-0.5">
                        <span>Agility:</span><span className="font-bold text-emerald-600">{log.stats?.agility || 0}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-0.5">
                        <span>Dex:</span><span className="font-bold text-purple-600">{log.stats?.dexterity || 0}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-0.5">
                        <span>Total:</span><span className="font-bold text-stone-800">{totalStats}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge className="bg-stone-100 text-stone-500 text-[10px]">
                        頭: {log.parts?.head?.name || '?'}
                      </Badge>
                      <Badge className="bg-stone-100 text-stone-500 text-[10px]">
                        体: {log.parts?.body?.name || '?'}
                      </Badge>
                      <Badge className="bg-stone-100 text-stone-500 text-[10px]">
                        腕: {log.parts?.arms?.name || '?'}
                      </Badge>
                      <Badge className="bg-stone-100 text-stone-500 text-[10px]">
                        脚: {log.parts?.legs?.name || '?'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
