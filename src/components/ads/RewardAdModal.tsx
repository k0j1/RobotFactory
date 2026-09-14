import React, { useState, useEffect } from 'react';
import { adRewardService, AdRewardRequest } from '../../services/AdRewardService';
import { theme } from '../../styles/theme';
import { Card, Button, Badge } from '../ui/core';
import * as Gi from 'react-icons/gi';

export const RewardAdModal: React.FC = () => {
  const [request, setRequest] = useState<AdRewardRequest | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = adRewardService.subscribe((req) => {
      setRequest(req);
      if (req) {
        setSecondsLeft(5);
        setIsPlaying(true);
        setIsCompleted(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!request || !isPlaying || isCompleted) return;

    if (secondsLeft <= 0) {
      setIsCompleted(true);
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [request, isPlaying, secondsLeft, isCompleted]);

  if (!request) return null;

  const handleClaimReward = () => {
    if (isCompleted) {
      request.onSuccess();
    }
  };

  const handleCancel = () => {
    if (!isCompleted) {
      const confirmCancel = window.confirm("動画広告の視聴を途中で終了すると、30分短縮ボーナスは受け取れません。終了しますか？");
      if (!confirmCancel) return;
    }
    request.onCancel?.();
  };

  const progressPercent = Math.min(100, Math.round(((5 - secondsLeft) / 5) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-fade-in font-['DotGothic16',_sans-serif]">
      <Card className="w-full max-w-md bg-stone-900 border-2 border-amber-500/80 text-stone-100 shadow-2xl overflow-hidden p-0 relative">
        {/* ヘッダー */}
        <div className="bg-stone-800/95 px-4 py-3 border-b border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 text-[10px] px-2 py-0.5 rounded font-bold">
              Google AdSense オファーウォール / リワード
            </span>
            <span className="text-xs font-bold text-stone-300">スポンサー提供</span>
          </div>
          <button
            onClick={handleCancel}
            className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 rounded bg-stone-700/50 hover:bg-stone-700 transition-colors"
          >
            ✕ 中断
          </button>
        </div>

        {/* 広告動画プレイヤー風シミュレーション領域 */}
        <div className="relative bg-stone-950 aspect-video flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* 背景の幾何学・メカ装飾 */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none select-none">
            <Gi.GiGears className="text-9xl text-amber-500 animate-spin-slow" />
          </div>

          {/* 広告内容コンテンツ */}
          <div className="relative z-10 space-y-3 max-w-xs">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
              <Gi.GiRobotAntennas className="text-4xl animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-300">
                『ポンコツロボット工房』スポンサー動画
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {request.title}
              </p>
            </div>

            {/* 短縮リワード表示 */}
            <div className="bg-stone-800/90 border border-amber-500/40 rounded-lg p-2 text-xs text-amber-300 flex items-center justify-center gap-1.5 shadow-inner">
              <Gi.GiFastForwardButton className="text-amber-400 text-sm" />
              <span>報酬: <strong>{request.rewardDescription}</strong></span>
            </div>
          </div>

          {/* 右上のカウントダウンバッジ */}
          <div className="absolute top-3 right-3 z-20">
            {isCompleted ? (
              <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1">
                <Gi.GiSparkles className="inline mr-1" /> 視聴完了！
              </Badge>
            ) : (
              <span className="bg-black/80 text-amber-400 border border-amber-500/50 font-mono text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Gi.GiHourglass className="animate-spin text-amber-400" />
                あと {secondsLeft} 秒
              </span>
            )}
          </div>

          {/* シークバー */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-800">
            <div
              className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* フッターアクション */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-col gap-2">
          {isCompleted ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleClaimReward}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 animate-bounce"
            >
              <Gi.GiCheckMark /> 30分短縮を適用して完了！
            </Button>
          ) : (
            <div className="text-center py-2 text-xs text-stone-400">
              ※ 動画広告を最後まで視聴すると、30分短縮ボーナスが即時適用されます
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
