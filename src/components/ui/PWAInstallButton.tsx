import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import * as Gi from 'react-icons/gi';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guidePlatform, setGuidePlatform] = useState<'android' | 'ios'>('android');

  // アプリとしてインストール済み（standalone起動中）の場合は非表示
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome && (isAndroid || isIOS)) {
        // プロンプトがキャンセルまたは非対応ブラウザの場合は案内モーダルを表示
        setGuidePlatform(isIOS ? 'ios' : 'android');
        setShowGuideModal(true);
      }
    } else {
      // beforeinstallprompt が発生していないブラウザ（SafariやAndroid Firefox、各種Webviewなど）
      setGuidePlatform(isIOS ? 'ios' : 'android');
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          onClick={handleInstallClick}
          title="ホーム画面に追加してアプリとして遊ぶ"
          className={`flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg px-2.5 py-1 transition-colors shadow-2xs ${className}`}
        >
          <Smartphone size={13} className="text-amber-700 shrink-0" />
          <span>ホーム画面に追加</span>
        </button>
      ) : variant === 'banner' ? (
        <div className={`flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-900/90 via-stone-900/95 to-amber-950/90 text-stone-100 rounded-xl border border-amber-500/40 shadow-md ${className}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Gi.GiRobotGolem className="text-amber-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-200">ホーム画面にアプリを追加</p>
              <p className="text-[10px] text-stone-400">全画面表示＆ワンタップで快適に起動できます</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-sm transition-transform active:scale-95 shrink-0"
          >
            <Download size={13} />
            <span>追加する</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 border border-amber-500/60 rounded-lg shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer ${className}`}
        >
          <Smartphone size={14} className="text-amber-900 shrink-0" />
          <span>ホーム画面に追加</span>
        </button>
      )}

      {/* インストール・ホーム画面追加の案内モーダル */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-stone-900 text-stone-100 rounded-2xl border-2 border-amber-500/50 shadow-2xl p-5 overflow-hidden">
            {/* 装飾グラデーションバー */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600" />
            
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
              aria-label="閉じる"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Smartphone className="text-amber-400" size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-200">ホーム画面に追加</h3>
                <p className="text-[11px] text-stone-400">アプリとしてインストールできます</p>
              </div>
            </div>

            {/* プラットフォーム切り替えタブ */}
            <div className="flex rounded-lg bg-stone-800 p-1 mb-3.5 text-xs font-bold">
              <button
                onClick={() => setGuidePlatform('android')}
                className={`flex-1 py-1 rounded-md transition ${guidePlatform === 'android' ? 'bg-amber-500 text-stone-950 font-black shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Android (Chrome等)
              </button>
              <button
                onClick={() => setGuidePlatform('ios')}
                className={`flex-1 py-1 rounded-md transition ${guidePlatform === 'ios' ? 'bg-amber-500 text-stone-950 font-black shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              >
                iPhone / iPad (Safari)
              </button>
            </div>

            {/* 手順説明 */}
            {guidePlatform === 'android' ? (
              <div className="space-y-2.5 text-xs text-stone-300 bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p className="leading-relaxed">
                    ブラウザ右上（または右下）のメニューアイコン <strong className="text-amber-300">「︙」</strong> をタップします。
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p className="leading-relaxed">
                    メニュー内の <strong className="text-amber-300">「アプリをインストール」</strong> または <strong className="text-amber-300">「ホーム画面に追加」</strong> を選択します。
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p className="leading-relaxed">
                    確認ダイアログで「追加」をタップすると、ホーム画面にポンコツ工房のアイコンが作成されます。
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-stone-300 bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p className="leading-relaxed">
                    Safari画面下部の中央にある共有アイコン（四角から上矢印 <strong className="text-sky-300">↑</strong> ）をタップします。
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p className="leading-relaxed">
                    メニューを少し下にスクロールして <strong className="text-amber-300">「ホーム画面に追加」</strong> をタップします。
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p className="leading-relaxed">
                    右上の「追加」をタップすると、ホーム画面にアプリアイコンが配置されます。
                  </p>
                </div>
              </div>
            )}

            {/* PWAインストールのメリット */}
            <div className="mt-3 pt-2.5 border-t border-stone-800/80 space-y-1 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span>ブラウザのアドレスバーなしでフルスクリーン動作</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span>次回からホーム画面のアイコンから即座に起動</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl transition"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
