import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './screens/Dashboard';
import { QuestScreen } from './screens/QuestScreen';
import { CraftScreen } from './screens/CraftScreen';
import { RequestScreen } from './screens/RequestScreen';
import { StorageScreen } from './screens/StorageScreen';
import { TitleScreen } from './screens/TitleScreen';
import { ShopScreen } from './screens/ShopScreen';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { LitepaperScreen } from './screens/LitepaperScreen';
import { theme } from './styles/theme';

export default function App() {
  const { state, engine } = useGameState();
  const [view, setView] = useState('title');

  if (!state || !engine) {
    return <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}><p className={theme.typography.h2}>Loading...</p></div>;
  }

  if (view === 'title') {
    return <TitleScreen onStart={() => setView('dashboard')} />;
  }

  return (
    <Layout activeView={view} onNavigate={setView}>
      {view === 'dashboard' && <Dashboard state={state} engine={engine} onNavigate={setView} />}
      {view === 'quest' && <QuestScreen state={state} engine={engine} />}
      {view === 'craft' && <CraftScreen state={state} engine={engine} />}
      {view === 'requests' && <RequestScreen state={state} engine={engine} />}
      {view === 'storage' && <StorageScreen state={state} engine={engine} />}
      {view === 'shop' && <ShopScreen state={state} engine={engine} onBack={() => setView('dashboard')} />}
      {view === 'encyclopedia' && <EncyclopediaScreen state={state} onBack={() => setView('dashboard')} />}
      {view === 'litepaper' && <LitepaperScreen onBack={() => setView('dashboard')} />}
    </Layout>
  );
}
