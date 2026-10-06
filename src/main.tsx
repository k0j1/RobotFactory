import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { PlatformService } from './services/PlatformService';

// Web/PWA時はService Workerを登録し、Capacitorネイティブアプリ時は競合防止のため登録をスキップ
PlatformService.getInstance().initializeServiceWorker().catch((err) => {
  console.warn('[main] Service Worker init notice:', err);
});

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
