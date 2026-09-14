import React, { useState } from 'react';
import { adRewardService } from '../../services/AdRewardService';
import { GameEngine } from '../../core/GameEngine';
import * as Gi from 'react-icons/gi';

interface RewardAdShortenButtonProps {
  engine: GameEngine;
  taskType: 'quest' | 'partCraft' | 'robotAssembly';
  taskName: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const RewardAdShortenButton: React.FC<RewardAdShortenButtonProps> = ({
  engine,
  taskType,
  taskName,
  className = '',
  size = 'md'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchAd = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベント伝播を防止
    if (isLoading) return;

    setIsLoading(true);
    try {
      const rewarded = await adRewardService.requestRewardAd({
        title: `${taskName}の完了時間を30分短縮します`,
        rewardDescription: '完了時間 30分短縮'
      });

      if (rewarded) {
        const reducedMs = engine.reduceTaskTime(taskType, 30);
        if (reducedMs > 0) {
          const reducedMinutes = Math.round(reducedMs / 60000);
          console.log(`[RewardAd] ${taskName} shortened by ${reducedMinutes}m`);
        }
      }
    } catch (err) {
      console.error('[RewardAd] Error displaying reward ad:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleWatchAd}
      disabled={isLoading}
      className={`relative group inline-flex items-center justify-center gap-1.5 font-bold transition-all duration-200 cursor-pointer select-none rounded-lg border shadow-xs active:scale-95 disabled:opacity-50 ${
        isSmall
          ? 'px-2 py-1 text-[10px] bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 border-amber-400 font-mono'
          : 'px-3 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 border-amber-400 font-bold'
      } ${className}`}
      title="動画広告を見て完了時間を30分短縮"
    >
      <span className="flex items-center gap-1">
        <Gi.GiFilmProjector className="text-stone-900 text-sm animate-pulse" />
        <span>広告で30分短縮</span>
      </span>
      <Gi.GiFastForwardButton className="text-stone-900 text-xs" />
    </button>
  );
};
