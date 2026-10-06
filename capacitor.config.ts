import type { CapacitorConfig } from '@capacitor/cli';

/**
 * @file capacitor.config.ts
 * @description ポンコツロボット工房 Android ネイティブアプリ (Capacitor) 設定ファイル
 * Web / PWA ビルド成果物 (dist/) をそのまま Android ネイティブアプリへバンドルします。
 */
const config: CapacitorConfig = {
  appId: 'jp.coreserver.robotfactory.app',
  appName: 'ポンコツロボット工房',
  webDir: 'dist',
  server: {
    // Google OAuth の「承認済みの JavaScript 生成元」と一致させ、オリジン不一致エラーを防ぐ設定
    hostname: 'robotfactory.k0j1.v2002.coreserver.jp',
    androidScheme: 'https',
    allowNavigation: [
      'robotfactory.k0j1.v2002.coreserver.jp',
      '*.coreserver.jp',
      'accounts.google.com',
      '*.google.com',
      '*.googleusercontent.com',
    ],
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1c1917',
    // Android WebView のデフォルトUAに含まれる "; wv" による Google OAuth (403 disallowed_useragent) ブロックを回避
    overrideUserAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#1c1917',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#f59e0b',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
