import React from 'react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/core';

export const TitleScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className={`min-h-screen ${theme.colors.secondary} ${theme.colors.textLight} flex flex-col items-center justify-center p-6 relative overflow-hidden font-['DotGothic16',_sans-serif]`}>
      <div className="text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-amber-500 drop-shadow-md">ポンコツ<br/>ロボット工房</h1>
        <p className={`${theme.typography.h3} mb-12 text-stone-300`}>ガラクタ集めて、夢をつくる。</p>
        
        <Button size="lg" onClick={onStart} className="text-xl px-12 py-4 animate-bounce">
          工房を開く
        </Button>

        <p className="mt-12 text-stone-400">v1.0.60</p>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 opacity-20 text-6xl">⚙️</div>
      <div className="absolute bottom-20 right-10 opacity-20 text-6xl">🔧</div>
      <div className="absolute top-1/4 right-1/4 opacity-10 text-8xl">🤖</div>
    </div>
  );
};
