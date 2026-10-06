import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * @file PlatformService.ts
 * @description Web / PWA / Capacitor (Android ネイティブアプリ) の実行環境を判定・管理するシングルトンサービスクラス
 * 厳格なOOP（オブジェクト指向）原則に基づき、プラットフォーム判定・PWA Service Worker制御・ネイティブスプラッシュ画面制御を一元管理します。
 */
export class PlatformService {
  private static instance: PlatformService | null = null;

  private constructor() {}

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService();
    }
    return PlatformService.instance;
  }

  /**
   * Capacitor ネイティブアプリ（Android / iOS）上で実行されているかどうかを判定
   */
  public isNativeApp(): boolean {
    try {
      return Capacitor.isNativePlatform();
    } catch {
      return false;
    }
  }

  /**
   * 現在のプラットフォーム名を取得 ('web' | 'android' | 'ios')
   */
  public getPlatform(): string {
    try {
      return Capacitor.getPlatform();
    } catch {
      return 'web';
    }
  }

  /**
   * PWA（スタンドアロン表示モード）として起動しているかどうかを判定
   */
  public isStandalonePwa(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      return isDisplayStandalone || isIosStandalone;
    } catch {
      return false;
    }
  }

  /**
   * 既にアプリとしてインストール済み（Capacitorネイティブ または PWAスタンドアロン）かどうかを判定
   */
  public isRunningAsInstalledApp(): boolean {
    return this.isNativeApp() || this.isStandalonePwa();
  }

  /**
   * iOS Safari 端末かどうかを判定
   */
  public isIosDevice(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const ua = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(ua);
    } catch {
      return false;
    }
  }

  /**
   * Web環境でのみ PWA Service Worker を登録し、Capacitor ネイティブアプリ内では競合防止のため登録をスキップ・解除する
   */
  public async initializeServiceWorker(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Capacitor ネイティブアプリ実行時はローカルアセットが本体にバンドルされているため、
    // 古いService Workerキャッシュによる不整合を防ぐために登録をスキップ＆既存SWがあれば解除する
    if (this.isNativeApp()) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      } catch (err) {
        console.warn('[PlatformService] Native SW unregister notice:', err);
      }
      return;
    }

    // Web / PWA ブラウザ環境では vite-plugin-pwa の Service Worker を自動更新モードで登録
    try {
      const { registerSW } = await import('virtual:pwa-register');
      registerSW({
        immediate: true,
        onRegisteredSW(swUrl) {
          console.log('[PlatformService] PWA Service Worker registered:', swUrl);
        },
        onRegisterError(error) {
          console.warn('[PlatformService] PWA Service Worker registration error:', error);
        },
      });
    } catch (err) {
      console.warn('[PlatformService] virtual:pwa-register fallback notice:', err);
    }
  }

  /**
   * Capacitor Android ネイティブアプリの起動スプラッシュスクリーンをフェードアウトして閉じる
   * Web環境では何もしないため安全に呼び出し可能
   */
  public async hideNativeSplashScreen(): Promise<void> {
    if (!this.isNativeApp()) return;
    try {
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (err) {
      console.warn('[PlatformService] SplashScreen.hide notice:', err);
    }
  }
}
