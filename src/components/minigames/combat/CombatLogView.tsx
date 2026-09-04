import React from 'react';
import { CombatLogItem } from './combatTypes';
import * as Gi from 'react-icons/gi';

interface CombatLogViewProps {
  logs: CombatLogItem[];
}

export const CombatLogView: React.FC<CombatLogViewProps> = ({ logs }) => {
  const getLogIcon = (type: CombatLogItem['type']) => {
    switch (type) {
      case 'learn_skill': return <Gi.GiInspiration className="text-amber-500 shrink-0" />;
      case 'skill_attack': return <Gi.GiLightningTrio className="text-purple-600 shrink-0" />;
      case 'dodge': return <Gi.GiSprint className="text-sky-600 shrink-0" />;
      case 'heal': return <Gi.GiHealing className="text-emerald-600 shrink-0" />;
      case 'buff': return <Gi.GiShieldReflect className="text-blue-600 shrink-0" />;
      case 'emp': return <Gi.GiHazardSign className="text-amber-600 shrink-0" />;
      case 'ko': return <Gi.GiTrophy className="text-amber-500 shrink-0" />;
      default: return <Gi.GiBroadsword className="text-stone-500 shrink-0" />;
    }
  };

  const getLogBg = (item: CombatLogItem) => {
    if (item.type === 'learn_skill') return 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold';
    if (item.type === 'ko') return 'bg-yellow-100 border-yellow-400 text-stone-900 font-bold';
    if (item.type === 'dodge') return 'bg-sky-50/80 border-sky-200 text-sky-900';
    if (item.type === 'heal') return 'bg-emerald-50/80 border-emerald-200 text-emerald-900';
    if (item.type === 'skill_attack') return 'bg-purple-50/80 border-purple-200 text-purple-900';
    if (item.isPlayer) return 'bg-white border-stone-200 text-stone-800';
    return 'bg-stone-50 border-stone-200 text-stone-700';
  };

  return (
    <div className="bg-stone-900/95 text-stone-100 p-3 rounded-xl border-2 border-stone-700 shadow-inner flex flex-col h-52">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-700 text-xs text-stone-300">
        <span className="font-bold flex items-center gap-1">
          <Gi.GiScrollUnfurled className="text-amber-400 text-sm" /> 戦闘解析ログ
        </span>
        <span className="text-[10px] text-stone-400 font-mono">
          最新 {logs.length} 件
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs font-sans">
        {logs.length === 0 ? (
          <div className="text-center text-stone-500 text-xs py-8">
            行動待機中...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className={`p-1.5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-1.5 transition-all ${getLogBg(log)} ${
                index === 0 ? 'ring-1 ring-amber-400 shadow-xs' : ''
              }`}
            >
              <div className="mt-0.5 text-xs">{getLogIcon(log.type)}</div>
              <div className="flex-1 min-w-0">
                <span>{log.message}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
