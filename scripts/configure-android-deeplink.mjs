/**
 * @file scripts/configure-android-deeplink.mjs
 * @description Capacitor Android プロジェクトの AndroidManifest.xml に
 * Google OAuth コールバック用のカスタムURLスキーム (jp.coreserver.robotfactory.app://oauth-callback)
 * を自動登録するスクリプト（冪等・何度実行しても安全）。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.log('[Android DeepLink] AndroidManifest.xml not found yet, skipping.');
  process.exit(0);
}

let content = fs.readFileSync(manifestPath, 'utf-8');

const customScheme = 'jp.coreserver.robotfactory.app';

if (content.includes(`android:scheme="${customScheme}"`)) {
  console.log('[Android DeepLink] Custom scheme already registered in AndroidManifest.xml.');
  process.exit(0);
}

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
  console.log(`[Android DeepLink] Successfully injected ${customScheme}://oauth-callback into AndroidManifest.xml.`);
} else {
  console.warn('[Android DeepLink] Could not find </activity> tag in AndroidManifest.xml.');
}
