import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { AuthApiService, DatabaseSyncError } from '../../services/AuthApiService';
import { GameEngine } from '../../core/GameEngine';
import { theme } from '../../styles/theme';

interface SyncErrorBannerProps {
  engine?: GameEngine;
}

export const SyncErrorBanner: React.FC<SyncErrorBannerProps> = ({ engine }) => {
  const [syncError, setSyncError] = useState<DatabaseSyncError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const apiService = AuthApiService.getInstance();
    const unsubscribe = apiService.onSyncError((err) => {
      setSyncError(err);
      setShowDetail(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = useCallback(async () => {
    if (!engine || isRetrying) return;
    setIsRetrying(true);
    try {
      await engine.syncToDatabaseNow();
      setSyncError(null);
    } catch (err: any) {
      console.warn('[SyncErrorBanner] 再試行失敗:', err);
    } finally {
      setIsRetrying(false);
    }
  }, [engine, isRetrying]);

  const handleDismiss = useCallback(() => {
    setSyncError(null);
  }, []);

  return (
    <AnimatePresence>
      {syncError && (
        <motion.div
          id="sync-error-banner"
          initial={{ opacity: 0, y: -40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed top-2 inset-x-2 sm:inset-x-auto sm:right-4 sm:max-w-md ${theme.zIndex.toast} pointer-events-auto`}
        >
          <div
            className={`bg-stone-900 text-stone-100 border-2 border-red-500/90 ${theme.radius.lg} ${theme.shadow.lg} p-3.5 flex flex-col gap-2.5 backdrop-blur-md`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-500/80 flex items-center justify-center shrink-0 text-red-400">
                  {syncError.rolledBack ? (
                    <ShieldAlert size={18} className="animate-pulse" />
                  ) : (
                    <AlertTriangle size={18} className="animate-pulse" />
                  )}
                </div>
                <div>
                  <h4 className={`${theme.typography.h4} text-red-300 text-sm leading-tight flex items-center gap-1.5`}>
                    <span>データベース保存エラー</span>
                    {syncError.rolledBack && (
                      <span className="text-[10px] bg-red-900/80 text-red-200 border border-red-700 font-mono px-1.5 py-0.5 rounded">
                        ロールバック済
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5 leading-snug">
                    {syncError.rolledBack
                      ? '更新処理に失敗したため、関連テーブルの変更はすべて安全にロールバック（取消）されました。'
                      : 'データベースへの同期通信に失敗しました。'}
                  </p>
                </div>
              </div>
              <button
                id="sync-error-dismiss-button"
                onClick={handleDismiss}
                className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
                title="閉じる"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {/* エラー詳細の折りたたみ表示 */}
            <div className="bg-black/50 border border-stone-800 rounded-md p-2 text-[11px] font-mono text-stone-400 overflow-x-auto max-h-24">
              <div className="flex justify-between items-center mb-1">
                <span className="text-stone-500">詳細ログ:</span>
                <button
                  type="button"
                  onClick={() => setShowDetail(!showDetail)}
                  className="text-amber-400 hover:text-amber-300 text-[10px] underline"
                >
                  {showDetail ? '省略' : '全文表示'}
                </button>
              </div>
              <p className={showDetail ? 'break-all whitespace-pre-wrap' : 'truncate'}>
                {syncError.message}
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-800">
              <button
                id="sync-error-retry-button"
                type="button"
                onClick={handleRetry}
                disabled={isRetrying || !engine}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 ${theme.radius.md} ${theme.colors.primary} ${theme.colors.primaryHover} transition-all disabled:opacity-50`}
              >
                <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
                <span>{isRetrying ? '再試行中...' : '今すぐ再同期'}</span>
              </button>
              <button
                id="sync-error-close-button"
                type="button"
                onClick={handleDismiss}
                className={`text-xs px-2.5 py-1.5 ${theme.radius.md} bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors`}
              >
                閉じる
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
