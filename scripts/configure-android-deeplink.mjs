/**
 * @file scripts/configure-android-deeplink.mjs
 * @description Capacitor Android プロジェクトに対して以下の設定を自動適用するスクリプト（冪等）:
 * 1. AndroidManifest.xml に Google OAuth 用カスタムURLスキーム (jp.coreserver.robotfactory.app://oauth-callback) を登録
 * 2. 毎回異なる署名鍵でビルドされて「上書きインストール（更新）に失敗する」問題を防ぐため、
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
const customScheme = 'jp.coreserver.robotfactory.app';

if (!content.includes(`android:scheme="${customScheme}"`)) {
  const intentFilterXml = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="${customScheme}" android:host="oauth-callback" />
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
// 2. 固定キーストアと versionCode / versionName の設定（上書きアップデート対応）
// ============================================================================
if (fs.existsSync(buildGradlePath)) {
  let gradleContent = fs.readFileSync(buildGradlePath, 'utf-8');

  // TitleScreen.tsx から現在のアプリバージョン (例: v0.1.182 -> 0.1.182, patch=182) を取得
  let appVersionName = '0.1.182';
  let basePatch = 182;
  try {
    const titlePath = path.join(rootDir, 'src', 'screens', 'TitleScreen.tsx');
    if (fs.existsSync(titlePath)) {
      const titleSrc = fs.readFileSync(titlePath, 'utf-8');
      const m = titleSrc.match(/v(\d+)\.(\d+)\.(\d+)/);
      if (m) {
        appVersionName = `${m[1]}.${m[2]}.${m[3]}`;
        basePatch = parseInt(m[3], 10) || 182;
      }
    }
  } catch {}

  // GitHub Actions の GITHUB_RUN_NUMBER があれば加算して常に単調増加する versionCode を生成
  const runNumber = parseInt(process.env.GITHUB_RUN_NUMBER || '0', 10) || 0;
  const computedVersionCode = 1000 + basePatch * 10 + runNumber;

  gradleContent = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${computedVersionCode}`);
  gradleContent = gradleContent.replace(/versionName\s+"[^"]*"/, `versionName "${appVersionName}"`);

  // 固定の署名用キーストア (ponkotsu-consistent.keystore) を参照設定
  const fixedKeystorePath = path.join(rootDir, 'assets', 'ponkotsu-consistent.keystore');
  const targetKeystoreInApp = path.join(androidAppDir, 'ponkotsu-consistent.keystore');

  if (fs.existsSync(fixedKeystorePath)) {
    fs.copyFileSync(fixedKeystorePath, targetKeystoreInApp);
  } else if (!fs.existsSync(targetKeystoreInApp)) {
    try {
      execSync(
        `keytool -genkeypair -v -keystore "${targetKeystoreInApp}" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`,
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
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    defaultConfig {`;

    gradleContent = gradleContent.replace('defaultConfig {', signingConfigBlock);
    fs.writeFileSync(buildGradlePath, gradleContent, 'utf-8');
    console.log(
      `[Android Config] Configured consistent keystore & versionCode=${computedVersionCode} (v${appVersionName}) in build.gradle.`
    );
  } else {
    fs.writeFileSync(buildGradlePath, gradleContent, 'utf-8');
    console.log(`[Android Config] Updated versionCode=${computedVersionCode} (v${appVersionName}) in build.gradle.`);
  }
}
