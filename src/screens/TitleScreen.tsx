import React from 'react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/core';
import * as Gi from 'react-icons/gi';
import robotsWorkshopBg from '../assets/images/robots_workshop_bg_1788411232885.jpg';

export const TitleScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className={`min-h-screen ${theme.colors.secondary} ${theme.colors.textLight} flex flex-col items-center justify-center p-6 relative overflow-hidden font-['DotGothic16',_sans-serif]`}>
      {/* 全画面統一の工房背景画像 */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={robotsWorkshopBg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_35%] opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-stone-900/80" />
      </div>

      <div className="text-center z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-amber-500 drop-shadow-md">ポンコツ<br/>ロボット工房</h1>
        <p className={`${theme.typography.h3} mb-12 text-stone-300`}>ガラクタ集めて、夢をつくる。</p>
        
        <Button size="lg" onClick={onStart} className="text-xl px-12 py-4 animate-bounce">
          工房を開く
        </Button>

        <p className="mt-12 text-stone-400">v1.0.158</p>
      </div>
      
      {/* Decorative background elements */}
      <Gi.GiGears className="absolute top-10 left-10 opacity-20 text-6xl z-0" />
      <Gi.GiSpanner className="absolute bottom-20 right-10 opacity-20 text-6xl z-0" />
      <Gi.GiRobotGolem className="absolute top-1/4 right-1/4 opacity-10 text-8xl z-0" />
    </div>
  );
};
