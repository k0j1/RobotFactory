/**
 * @file scripts/configure-android-deeplink.mjs
 * @description Capacitor Android プロジェクトに対して以下の設定を自動適用するスクリプト（冪等）:
 * 1. AndroidManifest.xml に Google OAuth 用カスタムURLスキーム (com.takaharabooks.robotfactory://oauth-callback) を登録
 * 2. 毎回異なる署名鍵でビルドされて「上書きインストール（更新）に失敗する」問題を防ぎ、
 *    かつアプリ公開用の署名鍵（SHA-1 / SHA-256 / 公開鍵）を固定するため、
 *    固定の署名キーストア (ponkotsu-consistent.keystore) と build.gradle の versionCode / versionName 自動更新を設定
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const androidAppDir = path.join(rootDir, 'android', 'app');
const manifestPath = path.join(androidAppDir, 'src', 'main', 'AndroidManifest.xml');
const buildGradlePath = path.join(androidAppDir, 'build.gradle');

if (!fs.existsSync(manifestPath)) {
  console.log('[Android Config] AndroidManifest.xml not found yet, skipping.');
  process.exit(0);
}

// ============================================================================
// 1. AndroidManifest.xml にカスタムURLスキーム (Deep Link) を追加
// ============================================================================
let content = fs.readFileSync(manifestPath, 'utf-8');
const customScheme = 'com.takaharabooks.robotfactory';
const legacyScheme = 'jp.coreserver.robotfactory.app';

if (!content.includes(`android:scheme="${customScheme}"`)) {
  const intentFilterXml = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="${customScheme}" android:host="oauth-callback" />
                <data android:scheme="${legacyScheme}" android:host="oauth-callback" />
            </intent-filter>
        </activity>`;

  if (content.includes('</activity>')) {
    content = content.replace('</activity>', intentFilterXml);
    fs.writeFileSync(manifestPath, content, 'utf-8');
    console.log(`[Android Config] Injected ${customScheme}://oauth-callback into AndroidManifest.xml.`);
  }
} else {
  console.log('[Android Config] Custom scheme already registered in AndroidManifest.xml.');
}

// ============================================================================
// 2. 固定キーストアと versionCode / versionName の設定（上書きアップデート＆リリース署名対応）
// ============================================================================
if (fs.existsSync(buildGradlePath)) {
  let gradleContent = fs.readFileSync(buildGradlePath, 'utf-8');

  // TitleScreen.tsx から現在のアプリバージョン (例: v0.1.187 -> 0.1.187, patch=187) を取得
  let appVersionName = '0.1.187';
  let basePatch = 187;
  try {
    const titlePath = path.join(rootDir, 'src', 'screens', 'TitleScreen.tsx');
    if (fs.existsSync(titlePath)) {
      const titleSrc = fs.readFileSync(titlePath, 'utf-8');
      const m = titleSrc.match(/v(\d+)\.(\d+)\.(\d+)/);
      if (m) {
        appVersionName = `${m[1]}.${m[2]}.${m[3]}`;
        basePatch = parseInt(m[3], 10) || 187;
      }
    }
  } catch {}

  // GitHub Actions の GITHUB_RUN_NUMBER があれば加算して常に単調増加する versionCode を生成
  const runNumber = parseInt(process.env.GITHUB_RUN_NUMBER || '0', 10) || 0;
  const computedVersionCode = 1000 + basePatch * 10 + runNumber;

  gradleContent = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${computedVersionCode}`);
  gradleContent = gradleContent.replace(/versionName\s+"[^"]*"/, `versionName "${appVersionName}"`);

  // GitHub Secrets（環境変数）からキーストアと認証情報を読み込んで署名設定（未設定時はローカル開発用フォールバック）
  const fixedKeystorePath = path.join(rootDir, 'assets', 'ponkotsu-consistent.keystore');
  const targetKeystoreInApp = path.join(androidAppDir, 'ponkotsu-consistent.keystore');
  const storePassword = process.env.ANDROID_KEYSTORE_PASSWORD || 'android';
  const keyAlias = process.env.ANDROID_KEY_ALIAS || 'androiddebugkey';
  const keyPassword = process.env.ANDROID_KEY_PASSWORD || storePassword;

  if (fs.existsSync(fixedKeystorePath)) {
    fs.copyFileSync(fixedKeystorePath, targetKeystoreInApp);
  } else if (!fs.existsSync(targetKeystoreInApp)) {
    try {
      execSync(
        `keytool -genkeypair -v -keystore "${targetKeystoreInApp}" -storepass "${storePassword}" -alias "${keyAlias}" -keypass "${keyPassword}" -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Ponkotsu Robot Factory,OU=Mobile,O=TakaharaBooks,L=Tokyo,ST=Tokyo,C=JP"`,
        { stdio: 'ignore' }
      );
    } catch (e) {
      console.warn('[Android Config] keytool generation warning:', e.message);
    }
  }

  if (fs.existsSync(targetKeystoreInApp) && !gradleContent.includes('ponkotsu-consistent.keystore')) {
    const signingConfigBlock = `
    signingConfigs {
        debug {
            storeFile file('ponkotsu-consistent.keystore')
            storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD') ?: '${storePassword}'
            keyAlias System.getenv('ANDROID_KEY_ALIAS') ?: '${keyAlias}'
            keyPassword System.getenv('ANDROID_KEY_PASSWORD') ?: '${keyPassword}'
        }
        release {
            storeFile file('ponkotsu-consistent.keystore')
            storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD') ?: '${storePassword}'
            keyAlias System.getenv('ANDROID_KEY_ALIAS') ?: '${keyAlias}'
            keyPassword System.getenv('ANDROID_KEY_PASSWORD') ?: '${keyPassword}'
        }
    }
    defaultConfig {`;

    gradleContent = gradleContent.replace('defaultConfig {', signingConfigBlock);
    gradleContent = gradleContent.replace(
      /buildTypes\s*\{\s*release\s*\{/,
      `buildTypes {\n        release {\n            signingConfig signingConfigs.release`
    );
    fs.writeFileSync(buildGradlePath, gradleContent, 'utf-8');
    console.log(
      `[Android Config] Configured GitHub Secrets keystore (debug & release) & versionCode=${computedVersionCode} (v${appVersionName}) in build.gradle.`
    );
  } else {
    fs.writeFileSync(buildGradlePath, gradleContent, 'utf-8');
    console.log(`[Android Config] Updated versionCode=${computedVersionCode} (v${appVersionName}) in build.gradle.`);
  }
}
