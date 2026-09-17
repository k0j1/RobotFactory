import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  // CoreServerのドメイン直下に展開されるため、baseは'/'に設定します
  const base = '/';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      // GitHub Actionsビルド時に src/admin/ が.gitignoreで除外されていてもビルドエラーを防ぐプラグイン
      {
        name: 'admin-fallback-resolver',
        resolveId(source) {
          if (source.includes('AdminDatabaseModal') || source.includes('adminApi') || source.includes('adminEnv')) {
            const adminDir = path.resolve(__dirname, 'src/admin');
            if (!fs.existsSync(adminDir)) {
              return '\0virtual:admin-stub';
            }
          }
          return null;
        },
        load(id) {
          if (id === '\0virtual:admin-stub') {
            return 'export const AdminDatabaseModal = () => null; export const isAiStudioEnvironment = () => false; export class AdminDatabaseApi {} export default {};';
          }
          return null;
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'https://robotfactory.k0j1.v2002.coreserver.jp',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
