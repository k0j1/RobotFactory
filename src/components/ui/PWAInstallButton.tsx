import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';
import { theme } from '../../styles/theme';
import { Button } from './core';

interface PWAInstallButtonProps {
  variant?: 'header' | 'title';
}

/**
 * @file PWAInstallButton.tsx
 * @description アプリ内からワンタップでPWAインストール（ホーム画面追加）を行うコンポーネント
 * - Android / デスクトップ Chrome・Edge: beforeinstallprompt によるネイティブインストールダイアログを起動
 * - iOS Safari: ホーム画面への追加手順ガイドモーダルを表示
 * - 既にPWAスタンドアロン起動中 または Capacitor Android アプリとして起動中は自動非表示
 */
export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isNative, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Capacitorネイティブアプリとして起動している場合はタイトル画面でのみネイティブバッジを表示
  if (isNative) {
    if (variant === 'title') {
      return (
        <div className={theme.pwa.nativeBadge}>
          <Smartphone size={12} />
          <span>Android App Mode</span>
        </div>
      );
    }
    return null;
  }

  // 既にPWAとしてインストール済み（standalone起動）の場合はボタンを非表示
  if (isInstalled) {
    return null;
  }

  const buttonClass = variant === 'title' ? theme.pwa.installBtnTitle : theme.pwa.installBtnHeader;

  // Chromium / Android / Desktop フロー
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={buttonClass}
        title="ホーム画面にアプリとしてインストール"
      >
        <Download size={variant === 'title' ? 14 : 13} />
        <span>{variant === 'title' ? 'アプリをインストール (PWA)' : 'アプリ化'}</span>
      </button>
    );
  }

  // iOS Safari フロー（beforeinstallprompt非対応のため手順ガイドを表示）
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={buttonClass}
          title="iPhone / iPad のホーム画面に追加"
        >
          <Smartphone size={variant === 'title' ? 14 : 13} />
          <span>{variant === 'title' ? 'ホーム画面に追加 (iOS)' : 'アプリ化'}</span>
        </button>

        {showIOSGuide && (
          <div className={theme.pwa.modalBackdrop} onClick={() => setShowIOSGuide(false)}>
            <div className={theme.pwa.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-stone-300 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="text-amber-700" size={18} />
                  <h3 className={theme.typography.h3}>ホーム画面にアプリを追加</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-500 hover:text-stone-800 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <p>
                  iPhone / iPad の Safari から「ポンコツロボット工房」をフルスクリーンアプリとしてホーム画面に追加できます。
                </p>
                <div className="bg-white rounded-xl border border-stone-300 p-3 space-y-2.5">
                  <div className="flex items-center">
                    <span className={theme.pwa.stepBadge}>1</span>
                    <span>
                      ブラウザ下部の共有ボタン <Share className="inline text-sky-600 mx-0.5" size={14} /> をタップします。
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={theme.pwa.stepBadge}>2</span>
                    <span>
                      メニューから <strong>「ホーム画面に追加」</strong> <PlusSquare className="inline text-stone-700 mx-0.5" size={14} /> を選択します。
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full"
                >
                  閉じる
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

/**
 * オフライン接続時に画面下部へ控えめに通知するインジケーター
 */
export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className={theme.pwa.offlineBanner}>
      <WifiOff size={14} className="animate-pulse" />
      <span>オフラインモード — キャッシュデータで動作中</span>
    </div>
  );
};
