import React from 'react';
import { theme } from '../../styles/theme';

export const Layout: React.FC<{ children: React.ReactNode; onNavigate: (view: string) => void, activeView: string, interiorBg?: string }> = ({ children, onNavigate, activeView, interiorBg }) => {
  const navItems = [
    { id: 'dashboard', label: '工房' },
    { id: 'quest', label: '遠征' },
    { id: 'craft', label: '製造' },
    { id: 'requests', label: '依頼板' },
    { id: 'storage', label: '倉庫' },
  ];

  return (
    <div className={`min-h-screen ${interiorBg || theme.colors.background} ${theme.colors.text} flex flex-col font-['DotGothic16',_sans-serif] transition-colors duration-500`}>
      <header className={`${theme.colors.secondary} ${theme.colors.textLight} ${theme.spacing.sm} sticky top-0 z-10 ${theme.shadow.sm}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className={theme.typography.h2}>ポンコツロボット工房</h1>
          <div className="text-sm">v1.0.30</div>
        </div>
      </header>

      <main className={`flex-1 max-w-4xl w-full mx-auto ${theme.spacing.sm} pb-24`}>
        {children}
      </main>

      <nav className={`${theme.colors.surface} ${theme.shadow.lg} border-t ${theme.colors.border} fixed bottom-0 w-full`}>
        <div className="max-w-4xl mx-auto flex justify-around p-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 py-3 text-center transition-colors ${theme.radius.md} ${activeView === item.id ? theme.colors.primary : 'hover:bg-stone-200'}`}
            >
              <span className={`font-bold ${activeView === item.id ? 'text-white' : theme.colors.textMuted}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
