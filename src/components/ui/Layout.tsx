import React from 'react';
import { theme } from '../../styles/theme';
import { GameState } from '../../core/models';
import * as Gi from 'react-icons/gi';

export const Layout: React.FC<{ 
  children: React.ReactNode; 
  onNavigate: (view: string) => void; 
  activeView: string; 
  interiorBg?: string;
  state?: GameState;
}> = ({ children, onNavigate, activeView, interiorBg, state }) => {
  // Notification calculations
  const isQuestDone = state?.activeQuest ? (state.activeQuest.endTime - Date.now() <= 0) : false;
  const isCraftPartDone = state?.activePartCraft ? (state.activePartCraft.endTime - Date.now() <= 0) : false;
  const isCraftRobotDone = state?.activeRobotAssembly ? (state.activeRobotAssembly.endTime - Date.now() <= 0) : false;
  const isCraftDone = isCraftPartDone || isCraftRobotDone;
  
  const isDisassemblyDone = state?.activeRobotDisassembly ? (state.activeRobotDisassembly.endTime - Date.now() <= 0) : false;
  const isRecycleDone = state?.activePartRecycle ? (state.activePartRecycle.endTime - Date.now() <= 0) : false;
  const isStorageTaskDone = isDisassemblyDone || isRecycleDone;
  const isStorageTaskActive = state?.activeRobotDisassembly || state?.activePartRecycle;

  const totalPendingAutoDrops = state?.autoDispatches?.reduce((acc, d) => acc + (d.pendingDrops?.length || 0), 0) || 0;

  const navItems = [
    { 
      id: 'dashboard', 
      label: '工房',
      icon: <Gi.GiFactory size={22} />,
      badge: (isQuestDone || totalPendingAutoDrops > 0 || isCraftDone || isStorageTaskDone) 
        ? (totalPendingAutoDrops > 0 ? (totalPendingAutoDrops > 99 ? '99+' : `${totalPendingAutoDrops}`) : '!') 
        : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { 
      id: 'quest', 
      label: '遠征',
      icon: <Gi.GiWalkingScout size={22} />,
      badge: isQuestDone ? '完了' : undefined,
      badgeColor: 'bg-amber-500 text-white animate-bounce'
    },
    { 
      id: 'craft', 
      label: '製造',
      icon: <Gi.GiAnvil size={22} />,
      badge: isCraftDone ? '完了' : (state?.activePartCraft || state?.activeRobotAssembly ? '作成中' : undefined),
      badgeColor: isCraftDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'requests', label: '依頼', icon: <Gi.GiScrollUnfurled size={22} /> },
    { 
      id: 'storage', 
      label: '倉庫',
      icon: <Gi.GiCardboardBox size={22} />,
      badge: isStorageTaskDone ? '完了' : (isStorageTaskActive ? '解体中' : undefined),
      badgeColor: isStorageTaskDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'minigame', label: 'バトル', icon: <Gi.GiCrossedSwords size={22} /> },
  ];

  return (
    <div className={`min-h-screen ${interiorBg || theme.colors.background} ${theme.colors.text} flex flex-col font-['DotGothic16',_sans-serif] transition-colors duration-500`}>
      <header className={`${theme.colors.secondary} ${theme.colors.textLight} ${theme.spacing.sm} sticky top-0 ${theme.zIndex.header} ${theme.shadow.sm}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className={theme.typography.h2}>ポンコツロボット工房</h1>
          <div className="flex items-center gap-1.5 bg-stone-900/80 border border-amber-500/50 px-2.5 py-1 rounded-full shadow-xs">
            <Gi.GiCoins className="text-amber-400" size={16} />
            <span className="font-mono font-bold text-amber-300 text-sm tracking-wide">
              {state?.gold ?? 0}
            </span>
            <span className="text-[11px] font-bold text-amber-500">G</span>
          </div>
        </div>
      </header>

      <main className={`flex-1 max-w-4xl w-full mx-auto ${theme.spacing.sm} pb-24`}>
        {children}
      </main>

      <nav className={`${theme.colors.surface} ${theme.shadow.lg} border-t ${theme.colors.border} fixed bottom-0 w-full ${theme.zIndex.nav} pb-safe`}>
        <div className="max-w-4xl mx-auto flex justify-around p-1.5 gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex-1 py-1.5 flex flex-col items-center justify-center transition-colors ${theme.radius.md} ${activeView === item.id ? theme.colors.primary : 'hover:bg-stone-200'}`}
            >
              <div className={activeView === item.id ? 'text-white' : theme.colors.textMuted}>{item.icon}</div>
              <span className={`font-bold text-[10px] mt-0.5 whitespace-nowrap ${activeView === item.id ? 'text-white' : theme.colors.textMuted}`}>{item.label}</span>
              {item.badge && (
                <span className={`absolute top-0.5 right-1 h-4 min-w-[1rem] px-1 inline-flex items-center justify-center text-[8px] font-bold rounded-full shadow-md border border-white whitespace-nowrap leading-none tracking-tight shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
