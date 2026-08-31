import React from 'react';
import { theme } from '../../styles/theme';
import { GameState } from '../../core/models';

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
      badge: (isQuestDone || totalPendingAutoDrops > 0 || isCraftDone || isStorageTaskDone) 
        ? (totalPendingAutoDrops > 0 ? (totalPendingAutoDrops > 99 ? '99+' : `${totalPendingAutoDrops}`) : '!') 
        : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { 
      id: 'quest', 
      label: '遠征',
      badge: isQuestDone ? '完了' : undefined,
      badgeColor: 'bg-amber-500 text-white animate-bounce'
    },
    { 
      id: 'craft', 
      label: '製造',
      badge: isCraftDone ? '完了' : (state?.activePartCraft || state?.activeRobotAssembly ? '作成中' : undefined),
      badgeColor: isCraftDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'requests', label: '依頼板' },
    { 
      id: 'storage', 
      label: '倉庫',
      badge: isStorageTaskDone ? '完了' : (isStorageTaskActive ? '解体中' : undefined),
      badgeColor: isStorageTaskDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'minigame', label: 'バトル' },
  ];

  return (
    <div className={`min-h-screen ${interiorBg || theme.colors.background} ${theme.colors.text} flex flex-col font-['DotGothic16',_sans-serif] transition-colors duration-500`}>
      <header className={`${theme.colors.secondary} ${theme.colors.textLight} ${theme.spacing.sm} sticky top-0 ${theme.zIndex.header} ${theme.shadow.sm}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className={theme.typography.h2}>ポンコツロボット工房</h1>
          <div className="text-sm">v1.0.111</div>
        </div>
      </header>

      <main className={`flex-1 max-w-4xl w-full mx-auto ${theme.spacing.sm} pb-24`}>
        {children}
      </main>

      <nav className={`${theme.colors.surface} ${theme.shadow.lg} border-t ${theme.colors.border} fixed bottom-0 w-full ${theme.zIndex.nav}`}>
        <div className="max-w-4xl mx-auto flex justify-around p-2 gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex-1 py-3 text-center transition-colors ${theme.radius.md} ${activeView === item.id ? theme.colors.primary : 'hover:bg-stone-200'}`}
            >
              <span className={`font-bold whitespace-nowrap ${activeView === item.id ? 'text-white' : theme.colors.textMuted}`}>{item.label}</span>
              {item.badge && (
                <span className={`absolute -top-1 right-1 h-4.5 min-w-[1.25rem] px-1 inline-flex items-center justify-center text-[9px] font-bold rounded-full shadow-md border border-white whitespace-nowrap leading-none tracking-tight shrink-0 ${item.badgeColor}`}>
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
