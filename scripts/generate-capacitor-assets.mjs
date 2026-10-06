/**
 * @file scripts/generate-capacitor-assets.mjs
 * @description Capacitor Androidアプリ用の高解像度アイコン（Adaptive Icon対応）と
 * スプラッシュスクリーン原画（assets/ 配下）を SVG から自動生成するスクリプト。
 *
 * 生成ファイル一覧:
 * - assets/icon-only.png          (1024x1024) : 通常のランチャーアイコン
 * - assets/icon-foreground.png    (1024x1024) : Android Adaptive Icon 前景レイヤー（透過背景・中央セーフゾーン66%内）
 * - assets/icon-background.png    (1024x1024) : Android Adaptive Icon 背景レイヤー（ダーク工房メタルグラデーション）
 * - assets/splash.png             (2732x2732) : ライトモード起動時スプラッシュスクリーン
 * - assets/splash-dark.png        (2732x2732) : ダークモード起動時スプラッシュスクリーン
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. icon-only.svg (1024x1024) - フルアイコン（背景＋ロボット）
const iconOnlySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#292524" />
      <stop offset="50%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </linearGradient>
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78716c" />
      <stop offset="50%" stop-color="#57534e" />
      <stop offset="100%" stop-color="#44403c" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad)" />
  <rect x="16" y="16" width="480" height="480" rx="80" fill="none" stroke="#d97706" stroke-width="6" stroke-opacity="0.45" />
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <g transform="translate(256, 275)" opacity="0.22">
      <circle r="140" fill="none" stroke="#f59e0b" stroke-width="24" stroke-dasharray="24 16" />
      <circle r="110" fill="none" stroke="#f59e0b" stroke-width="4" />
    </g>
    <rect x="246" y="80" width="20" height="50" rx="6" fill="#a8a29e" stroke="#292524" stroke-width="3" />
    <circle cx="256" cy="70" r="22" fill="#fbbf24" stroke="#d97706" stroke-width="4" />
    <circle cx="250" cy="64" r="6" fill="#ffffff" opacity="0.85" />
    <rect x="80" y="210" width="36" height="50" rx="8" fill="#d97706" stroke="#78350f" stroke-width="4" />
    <circle cx="98" cy="235" r="10" fill="#fef3c7" />
    <rect x="396" y="210" width="36" height="50" rx="8" fill="#d97706" stroke="#78350f" stroke-width="4" />
    <circle cx="414" cy="235" r="10" fill="#fef3c7" />
    <rect x="106" y="120" width="300" height="230" rx="36" fill="url(#headGrad)" stroke="#292524" stroke-width="6" />
    <circle cx="132" cy="146" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="380" cy="146" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="132" cy="324" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="380" cy="324" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <rect x="136" y="160" width="240" height="110" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="4" />
    <circle cx="196" cy="215" r="28" fill="#38bdf8" />
    <circle cx="196" cy="215" r="18" fill="#0284c7" />
    <circle cx="188" cy="207" r="7" fill="#ffffff" />
    <circle cx="316" cy="215" r="28" fill="#38bdf8" />
    <circle cx="316" cy="215" r="18" fill="#0284c7" />
    <circle cx="308" cy="207" r="7" fill="#ffffff" />
    <g transform="translate(196, 290)">
      <rect x="0" y="0" width="120" height="34" rx="10" fill="#292524" stroke="#44403c" stroke-width="2" />
      <rect x="14" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="38" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="62" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="86" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="110" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
    </g>
    <rect x="226" y="350" width="60" height="24" rx="4" fill="#a8a29e" stroke="#292524" stroke-width="3" />
    <path d="M120 450 L160 374 L352 374 L392 450 Z" fill="url(#metalGrad)" stroke="#78350f" stroke-width="5" />
    <circle cx="256" cy="418" r="28" fill="#1c1917" stroke="#fbbf24" stroke-width="3" />
    <path d="M246 410 L266 430 M266 410 L246 430" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />
  </g>
</svg>
`;

// 2. icon-foreground.svg (1024x1024) - Android Adaptive Icon 透過前景（中央62%セーフゾーン収容）
const iconForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78716c" />
      <stop offset="50%" stop-color="#57534e" />
      <stop offset="100%" stop-color="#44403c" />
    </linearGradient>
  </defs>
  <!-- Android Adaptive Icon セーフゾーン（中央62%）に収まるようスケーリング -->
  <g transform="translate(97.28, 97.28) scale(0.62)">
    <rect x="246" y="80" width="20" height="50" rx="6" fill="#a8a29e" stroke="#292524" stroke-width="3" />
    <circle cx="256" cy="70" r="22" fill="#fbbf24" stroke="#d97706" stroke-width="4" />
    <circle cx="250" cy="64" r="6" fill="#ffffff" opacity="0.85" />
    <rect x="80" y="210" width="36" height="50" rx="8" fill="#d97706" stroke="#78350f" stroke-width="4" />
    <circle cx="98" cy="235" r="10" fill="#fef3c7" />
    <rect x="396" y="210" width="36" height="50" rx="8" fill="#d97706" stroke="#78350f" stroke-width="4" />
    <circle cx="414" cy="235" r="10" fill="#fef3c7" />
    <rect x="106" y="120" width="300" height="230" rx="36" fill="url(#headGrad)" stroke="#292524" stroke-width="6" />
    <circle cx="132" cy="146" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="380" cy="146" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="132" cy="324" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="380" cy="324" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <rect x="136" y="160" width="240" height="110" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="4" />
    <circle cx="196" cy="215" r="28" fill="#38bdf8" />
    <circle cx="196" cy="215" r="18" fill="#0284c7" />
    <circle cx="188" cy="207" r="7" fill="#ffffff" />
    <circle cx="316" cy="215" r="28" fill="#38bdf8" />
    <circle cx="316" cy="215" r="18" fill="#0284c7" />
    <circle cx="308" cy="207" r="7" fill="#ffffff" />
    <g transform="translate(196, 290)">
      <rect x="0" y="0" width="120" height="34" rx="10" fill="#292524" stroke="#44403c" stroke-width="2" />
      <rect x="14" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="38" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="62" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="86" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="110" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
    </g>
    <rect x="226" y="350" width="60" height="24" rx="4" fill="#a8a29e" stroke="#292524" stroke-width="3" />
    <path d="M120 450 L160 374 L352 374 L392 450 Z" fill="url(#metalGrad)" stroke="#78350f" stroke-width="5" />
    <circle cx="256" cy="418" r="28" fill="#1c1917" stroke="#fbbf24" stroke-width="3" />
    <path d="M246 410 L266 430 M266 410 L246 430" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />
  </g>
</svg>
`;

// 3. icon-background.svg (1024x1024) - Android Adaptive Icon 背景レイヤー
const iconBackgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#292524" />
      <stop offset="50%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad)" />
  <g transform="translate(256, 256)" opacity="0.16">
    <circle r="150" fill="none" stroke="#f59e0b" stroke-width="20" stroke-dasharray="22 14" />
    <circle r="118" fill="none" stroke="#f59e0b" stroke-width="4" />
  </g>
</svg>
`;

// 4. splash.svg (2732x2732) - スプラッシュスクリーン（縦横どちらの画面回転でも中央ロゴが切れない2732px正方形）
const createSplashSvg = (bgStart, bgMid, bgEnd) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732" width="2732" height="2732">
  <defs>
    <radialGradient id="splashBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${bgStart}" />
      <stop offset="55%" stop-color="${bgMid}" />
      <stop offset="100%" stop-color="${bgEnd}" />
    </radialGradient>
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78716c" />
      <stop offset="50%" stop-color="#57534e" />
      <stop offset="100%" stop-color="#44403c" />
    </linearGradient>
  </defs>

  <!-- Full-bleed Splash Background -->
  <rect width="2732" height="2732" fill="url(#splashBg)" />

  <!-- Decorative Outer Gear Rings in Center Safe Zone -->
  <g transform="translate(1366, 1366)" opacity="0.12">
    <circle r="480" fill="none" stroke="#f59e0b" stroke-width="32" stroke-dasharray="48 32" />
    <circle r="390" fill="none" stroke="#fbbf24" stroke-width="6" />
    <circle r="310" fill="none" stroke="#d97706" stroke-width="4" stroke-dasharray="16 16" />
  </g>

  <!-- Central Robot Emblem (Scaled inside 760x760 center safe area) -->
  <g transform="translate(982, 950) scale(1.5)">
    <rect x="246" y="80" width="20" height="50" rx="6" fill="#a8a29e" stroke="#292524" stroke-width="3" />
    <circle cx="256" cy="70" r="22" fill="#fbbf24" stroke="#d97706" stroke-width="4" />
    <circle cx="250" cy="64" r="6" fill="#ffffff" opacity="0.85" />
    <rect x="80" y="210" width="36" height="50" rx="8" fill="#d97706" stroke="#78350f" stroke-width="4" />
    <circle cx="98" cy="235" r="10" fill="#fef3c7" />
    <rect x="396" y="210" width="36" height="50" rx="8" fill="#d97706" stroke="#78350f" stroke-width="4" />
    <circle cx="414" cy="235" r="10" fill="#fef3c7" />
    <rect x="106" y="120" width="300" height="230" rx="36" fill="url(#headGrad)" stroke="#292524" stroke-width="6" />
    <circle cx="132" cy="146" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="380" cy="146" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="132" cy="324" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <circle cx="380" cy="324" r="6" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
    <rect x="136" y="160" width="240" height="110" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="4" />
    <circle cx="196" cy="215" r="28" fill="#38bdf8" />
    <circle cx="196" cy="215" r="18" fill="#0284c7" />
    <circle cx="188" cy="207" r="7" fill="#ffffff" />
    <circle cx="316" cy="215" r="28" fill="#38bdf8" />
    <circle cx="316" cy="215" r="18" fill="#0284c7" />
    <circle cx="308" cy="207" r="7" fill="#ffffff" />
    <g transform="translate(196, 290)">
      <rect x="0" y="0" width="120" height="34" rx="10" fill="#292524" stroke="#44403c" stroke-width="2" />
      <rect x="14" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="38" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="62" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="86" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
      <rect x="110" y="6" width="12" height="22" rx="3" fill="#fbbf24" />
    </g>
    <rect x="226" y="350" width="60" height="24" rx="4" fill="#a8a29e" stroke="#292524" stroke-width="3" />
    <path d="M120 450 L160 374 L352 374 L392 450 Z" fill="url(#metalGrad)" stroke="#78350f" stroke-width="5" />
    <circle cx="256" cy="418" r="28" fill="#1c1917" stroke="#fbbf24" stroke-width="3" />
    <path d="M246 410 L266 430 M266 410 L246 430" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />
  </g>

  <!-- Accent Progress Bar Decoration Underneath -->
  <rect x="1166" y="1700" width="400" height="14" rx="7" fill="#292524" stroke="#78350f" stroke-width="3" />
  <rect x="1172" y="1703" width="260" height="8" rx="4" fill="#f59e0b" />
</svg>
`;

function renderSvgToPng(svgString, outputPath, width) {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`[Capacitor Assets] Generated: ${path.relative(rootDir, outputPath)} (${width}x${width}px)`);
}

renderSvgToPng(iconOnlySvg, path.join(assetsDir, 'icon-only.png'), 1024);
renderSvgToPng(iconForegroundSvg, path.join(assetsDir, 'icon-foreground.png'), 1024);
renderSvgToPng(iconBackgroundSvg, path.join(assetsDir, 'icon-background.png'), 1024);
renderSvgToPng(createSplashSvg('#292524', '#1c1917', '#0c0a09'), path.join(assetsDir, 'splash.png'), 2732);
renderSvgToPng(createSplashSvg('#1c1917', '#0c0a09', '#050404'), path.join(assetsDir, 'splash-dark.png'), 2732);
