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
    // ⚠️ 重要: hostname を本番の coreserver.jp と同じにすると、Android WebView の WebViewAssetLoader が
    // https://robotfactory.k0j1.v2002.coreserver.jp/api/*.php への通信までアプリ内の静的 dist/api/*.php から返してしまい、
    // PHPが実行されずソースコードがそのまま返却されるため、ローカルホスト（app.localhost）に分離します。
    hostname: 'localhost',
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
