import React, { useState, useEffect } from 'react';
import { adRewardService, AdRewardRequest } from '../../services/AdRewardService';
import { Card, Button, Badge } from '../ui/core';
import * as Gi from 'react-icons/gi';

export const RewardAdModal: React.FC = () => {
  const [request, setRequest] = useState<AdRewardRequest | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [confirmingCancel, setConfirmingCancel] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = adRewardService.subscribe((req) => {
      setRequest(req);
      if (req) {
        setSecondsLeft(5);
        setIsPlaying(true);
        setIsCompleted(false);
        setConfirmingCancel(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!request) return;

    // アプリ内iframeの reward-page.html からの完了通知（postMessage / localStorage）を受信
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'REWARD_AD_COMPLETED' && event.data.closeModal) {
        request.onSuccess();
      } else if (event.data.type === 'ROBOTFACTORY_REWARD_GRANTED') {
        if (event.data.closeModal) {
          request.onSuccess();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'robotfactory_reward_granted' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed && parsed.closeModal) {
            request.onSuccess();
          }
        } catch {}
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [request]);

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
    request.onSuccess();
  };

  const handleCancelClick = () => {
    if (isCompleted) {
      request.onSuccess();
      return;
    }
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    request.onCancel?.();
  };

  const progressWidthClass =
    secondsLeft >= 5
      ? 'w-0'
      : secondsLeft === 4
      ? 'w-1/5'
      : secondsLeft === 3
      ? 'w-2/5'
      : secondsLeft === 2
      ? 'w-3/5'
      : secondsLeft === 1
      ? 'w-4/5'
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
                <Gi.GiSparkles className="inline mr-1" /> 視聴完了
              </Badge>
            ) : (
              <span className="bg-black/80 text-amber-400 border border-amber-500/50 font-mono text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Gi.GiHourglass className="animate-spin text-amber-400" />
                あと {secondsLeft} 秒
              </span>
            )}
            <button
              type="button"
              onClick={handleCancelClick}
              className="text-stone-300 hover:text-white text-xs px-2.5 py-1 rounded bg-stone-700/70 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              {isCompleted ? '✕ 閉じる' : confirmingCancel ? '本当に中断する' : '✕ 中断'}
            </button>
          </div>
        </div>

        {/* 中断確認バー */}
        {confirmingCancel && !isCompleted && (
          <div className="bg-rose-950/90 border-b border-rose-700 px-3 py-2 flex items-center justify-between gap-2 text-xs text-rose-200 shrink-0">
            <span>途中で閉じると30分短縮ボーナスは適用されません。</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmingCancel(false)}
                className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 text-[11px] cursor-pointer"
              >
                視聴を続ける
              </button>
              <button
                type="button"
                onClick={() => request.onCancel?.()}
                className="px-2 py-0.5 rounded bg-rose-700 text-white hover:bg-rose-600 font-bold text-[11px] cursor-pointer"
              >
                終了する
              </button>
            </div>
          </div>
        )}

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
              ※ページ内の「元の画面に戻る」でも適用されます
            </span>
          </div>

          {isCompleted ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleClaimReward}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <Gi.GiCheckMark /> 30分短縮を適用して元の画面に戻る
            </Button>
          ) : (
            <div className="text-center py-1.5 text-xs text-stone-400 bg-stone-800/60 rounded border border-stone-700/60">
              広告画面を表示中です（あと {secondsLeft} 秒で完了ボタンが有効になります）
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
