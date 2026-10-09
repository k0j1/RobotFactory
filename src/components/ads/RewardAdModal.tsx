import React, { useState, useEffect } from 'react';
import { adRewardService, AdRewardRequest } from '../../services/AdRewardService';
import { Card, Button, Badge } from '../ui/core';
import * as Gi from 'react-icons/gi';

const REWARD_DISPLAY_SECONDS = 10;

export const RewardAdModal: React.FC = () => {
  const [request, setRequest] = useState<AdRewardRequest | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(REWARD_DISPLAY_SECONDS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = adRewardService.subscribe((req) => {
      setRequest(req);
      if (req) {
        setSecondsLeft(REWARD_DISPLAY_SECONDS);
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

  const handleCloseAndClaim = () => {
    if (!isCompleted) return;
    request.onSuccess();
  };

  const progressWidthClass =
    secondsLeft >= 10
      ? 'w-0'
      : secondsLeft === 9
      ? 'w-[10%]'
      : secondsLeft === 8
      ? 'w-1/5'
      : secondsLeft === 7
      ? 'w-[30%]'
      : secondsLeft === 6
      ? 'w-2/5'
      : secondsLeft === 5
      ? 'w-1/2'
      : secondsLeft === 4
      ? 'w-3/5'
      : secondsLeft === 3
      ? 'w-[70%]'
      : secondsLeft === 2
      ? 'w-4/5'
      : secondsLeft === 1
      ? 'w-[90%]'
      : 'w-full';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4 animate-fade-in font-['DotGothic16',_sans-serif]">
      <Card className="w-full max-w-lg max-h-[94vh] flex flex-col bg-stone-900 border-2 border-amber-500/80 text-stone-100 shadow-2xl overflow-hidden p-0 relative">
        {/* ヘッダー */}
        <div className="bg-stone-800/95 px-3 sm:px-4 py-2.5 border-b border-stone-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 text-[10px] px-2 py-0.5 rounded font-bold shrink-0">
              アプリ内リワード画面
            </span>
            <span className="text-xs font-bold text-stone-200 truncate">{request.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCompleted ? (
              <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5">
                <Gi.GiSparkles className="inline mr-1" /> 10秒経過・受取可能
              </Badge>
            ) : (
              <span className="bg-black/80 text-amber-400 border border-amber-500/50 font-mono text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Gi.GiHourglass className="animate-spin text-amber-400" />
                あと {secondsLeft} 秒
              </span>
            )}
            <button
              type="button"
              disabled={!isCompleted}
              onClick={handleCloseAndClaim}
              className={`text-xs px-2.5 py-1 rounded font-bold transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs'
                  : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
              }`}
            >
              {isCompleted ? '✕ 閉じる' : `閉じる (${secondsLeft}秒)`}
            </button>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="h-1.5 bg-stone-800 w-full shrink-0 overflow-hidden">
          <div
            className={`h-full bg-amber-500 transition-all duration-700 ease-linear ${progressWidthClass}`}
          />
        </div>

        {/* アプリ内埋め込み reward-page.html (iframe) */}
        <div className="relative bg-stone-950 flex-1 min-h-[380px] sm:min-h-[440px] flex flex-col overflow-hidden">
          <iframe
            src={request.rewardPageUrl}
            title="リワード獲得 - 広告表示画面"
            className="w-full flex-1 min-h-[380px] sm:min-h-[440px] border-0 bg-white"
            allow="autoplay; encrypted-media; fullscreen"
          />
        </div>

        {/* フッターアクション */}
        <div className="p-3 bg-stone-900 border-t border-stone-800 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-stone-400 flex items-center gap-1">
              <Gi.GiFastForwardButton className="text-amber-400" />
              報酬: <strong className="text-amber-300">{request.rewardDescription}</strong>
            </span>
            <span className="text-[11px] text-stone-400">
              {isCompleted ? '閉じるボタンで30分短縮が適用されます' : '10秒間表示後に閉じるボタンが押せます'}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={!isCompleted}
            onClick={handleCloseAndClaim}
            className={`w-full py-2.5 font-bold text-sm shadow-lg flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
            }`}
          >
            {isCompleted ? (
              <>
                <Gi.GiCheckMark /> 30分短縮を適用して閉じる
              </>
            ) : (
              <>
                <Gi.GiHourglass className="animate-spin text-amber-400" />
                広告を表示中...（あと {secondsLeft} 秒で閉じられます）
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
