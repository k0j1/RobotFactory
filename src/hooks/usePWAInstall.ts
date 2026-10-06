import { useEffect, useState, useCallback } from 'react';
import { PlatformService } from '../services/PlatformService';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * @file usePWAInstall.ts
 * @description PWAインストールプロンプトおよびオンライン接続状態のカスタムフック
 * Capacitorネイティブアプリ実行時は自動的にインストール済み扱いとしてインストールボタンを非表示にします。
 */
export function usePWAInstall() {
  const platformService = PlatformService.getInstance();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() =>
    platformService.isRunningAsInstalledApp()
  );
  const [isIOS, setIsIOS] = useState<boolean>(() => platformService.isIosDevice());
  const [isNative, setIsNative] = useState<boolean>(() => platformService.isNativeApp());

  useEffect(() => {
    const checkStatus = () => {
      setIsInstalled(platformService.isRunningAsInstalledApp());
      setIsIOS(platformService.isIosDevice());
      setIsNative(platformService.isNativeApp());
    };
    checkStatus();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (!platformService.isNativeApp()) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [platformService]);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !isNative && !!deferredPrompt,
    isInstalled,
    isIOS: !isNative && isIOS,
    isNative,
    install,
  };
}

/**
 * オンライン・オフライン接続状態を監視するカスタムフック
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
