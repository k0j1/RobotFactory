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
    androidScheme: 'https',
    allowNavigation: [
      'robotfactory.k0j1.v2002.coreserver.jp',
      '*.coreserver.jp',
      'accounts.google.com',
      '*.googleusercontent.com',
    ],
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1c1917',
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
