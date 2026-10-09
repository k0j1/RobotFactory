import { VersionGuard } from "./components/ui/VersionGuard";
import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './screens/Dashboard';
import { QuestScreen } from './screens/QuestScreen';
import { CraftScreen } from './screens/CraftScreen';
import { RequestScreen } from './screens/RequestScreen';
import { StorageScreen } from './screens/StorageScreen';
import { MinigameScreen } from './screens/MinigameScreen';
import { TitleScreen } from './screens/TitleScreen';
import { ShopScreen } from './screens/ShopScreen';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { LitepaperScreen } from './screens/LitepaperScreen';
import { DeliveryHistoryScreen } from './screens/DeliveryHistoryScreen';
import { RewardAdModal } from './components/ads/RewardAdModal';
import { SyncErrorBanner } from './components/ui/SyncErrorBanner';
import { theme } from './styles/theme';
import { INTERIORS } from './core/interiors';
import { AssetCacheService } from './core/AssetCacheService';
import robotsWorkshopBg from './assets/images/robots_workshop_bg_1788411232885.jpg';
import { useAuth } from './contexts/AuthContext';
import { fetchPartsMaster } from './data/partsMaster';
import { PlatformService } from './services/PlatformService';

export default function App() {
  const { user } = useAuth();
  const { state, engine } = useGameState(user?.google_id);
  const [view, setView] = useState('title');
  const handleNavigate = React.useCallback((nextView: string) => {
    React.startTransition(() => {
      setView(nextView);
    });
  }, []);

  // アプリ起動時に背景画像をプリロード & parts-masterからmaster_parts基準値をフェッチ
  useEffect(() => {
    fetchPartsMaster().catch((err) => {
      console.warn('[App] fetchPartsMaster notice:', err);
    });
    AssetCacheService.getInstance().preloadImages([
      robotsWorkshopBg
    ]).catch((err) => {
      console.warn('[App] Background images preload notice:', err);
    }).finally(() => {
      // Capacitor Androidアプリ起動時は初期アセット準備完了後にスプラッシュスクリーンをフェードアウト
      PlatformService.getInstance().hideNativeSplashScreen().catch(() => {});
    });
  }, []);

  React.useEffect(() => {
    if (!engine) return;
    const interval = setInterval(() => {
      engine.update();
    }, 1000);
    return () => clearInterval(interval);
  }, [engine]);

  if (!state || !engine) {
    return (
      <>
        <VersionGuard />
        <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
          <p className={theme.typography.h2}>Loading...</p>
        </div>
      </>
    );
  }

  const currentInteriorData = INTERIORS.find(i => i.id === state.currentInterior);
  const interiorBg = currentInteriorData ? currentInteriorData.bgClass : undefined;

  return (
    <>
      <SyncErrorBanner engine={engine} />
      <VersionGuard />
      {view === 'title' ? (
        <TitleScreen onStart={() => handleNavigate('dashboard')} engine={engine} />
      ) : (
        <Layout activeView={view} onNavigate={handleNavigate} interiorBg={interiorBg} state={state}>
          {view === 'dashboard' && <Dashboard state={state} engine={engine} onNavigate={handleNavigate} />}
          {view === 'quest' && <QuestScreen state={state} engine={engine} onNavigate={handleNavigate} />}
          {view === 'craft' && <CraftScreen state={state} engine={engine} />}
          {view === 'requests' && <RequestScreen state={state} engine={engine} onNavigate={handleNavigate} />}
          {view === 'storage' && <StorageScreen state={state} engine={engine} />}
          {view === 'minigame' && <MinigameScreen state={state} engine={engine} />}
          {view === 'shop' && <ShopScreen state={state} engine={engine} onBack={() => handleNavigate('dashboard')} />}
          {view === 'encyclopedia' && <EncyclopediaScreen state={state} onBack={() => handleNavigate('dashboard')} />}
          {view === 'litepaper' && <LitepaperScreen onBack={() => handleNavigate('dashboard')} />}
          {view === 'delivery_history' && <DeliveryHistoryScreen state={state} onBack={() => handleNavigate('requests')} />}
          <RewardAdModal />
        </Layout>
      )}
    </>
  );
}
