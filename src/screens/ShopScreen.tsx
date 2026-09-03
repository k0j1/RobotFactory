import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button } from '../components/ui/core';
import { theme } from '../styles/theme';
import { MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { INTERIORS } from '../core/interiors';
import * as Gi from 'react-icons/gi';

export const ShopScreen: React.FC<{ state: GameState, engine: GameEngine, onBack: () => void }> = ({ state, engine, onBack }) => {
  const [tab, setTab] = useState<'materials' | 'repairKits' | 'interiors'>('materials');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExchange = (materialId: string) => {
    try {
      const res = engine.exchangeRepairKit(materialId);
      setSuccessMessage(`素材「${res.materialName}」を${res.usedCount}個消費して、修理キットを${res.gainedKits}個獲得しました！`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e: any) {
      alert(e.message || '交換に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>商店</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>工房へ戻る</Button>
      </div>

      <div className="flex gap-2">
        <button 
          className={`flex-1 py-2 font-bold rounded-t-md border-b-4 ${tab === 'materials' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('materials')}
        >
          素材購入
        </button>
        <button 
          className={`flex-1 py-2 font-bold rounded-t-md border-b-4 ${tab === 'repairKits' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('repairKits')}
        >
          修理キット交換
        </button>
        <button 
          className={`flex-1 py-2 font-bold rounded-t-md border-b-4 ${tab === 'interiors' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('interiors')}
        >
          内装カスタマイズ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 ${theme.colors.surface} ${theme.radius.md} ${theme.shadow.sm} flex justify-between items-center`}>
          <span className="font-bold text-stone-700">所持金</span>
          <span className={`${theme.typography.h2} text-amber-600`}>{state.gold} G</span>
        </div>
        <div className={`p-4 ${theme.colors.surface} ${theme.radius.md} ${theme.shadow.sm} flex justify-between items-center`}>
          <span className="font-bold text-stone-700">所持修理キット</span>
          <span className={`${theme.typography.h2} text-green-600 flex items-center gap-1`}>
            <span><Gi.GiSpanner className="inline text-stone-500" /></span>
            <span>{state.repairKits || 0} 個</span>
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm font-bold animate-fadeIn">
          {successMessage}
        </div>
      )}

      {tab === 'materials' && (
        <>
          <h3 className={theme.typography.h3}>素材を購入</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {MATERIALS.map(mat => {
              const rStyle = theme.rarity[mat.rarity];
              const canBuy = state.gold >= mat.price;
              return (
                <button 
                  key={mat.id} 
                  disabled={!canBuy}
                  onClick={() => {
                    try {
                      engine.buyMaterial(mat.id);
                    } catch (e: any) {
                      alert(e.message || '購入に失敗しました');
                    }
                  }}
                  className={`relative flex flex-col items-center justify-between p-2 rounded-lg border-2 ${rStyle.border} ${rStyle.bg} transition-all overflow-hidden ${canBuy ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : 'opacity-60 cursor-not-allowed grayscale-[30%]'}`}
                >
                  <div className="absolute top-1.5 left-1.5 text-[9px] leading-none drop-shadow-sm">{rStyle.stars}</div>
                  
                  <div className={`mt-3 mb-1 drop-shadow-md ${rStyle.text}`}>
                    <MaterialIcon materialId={mat.id} size={36} />
                  </div>
                  
                  <span className={`text-[10px] font-bold text-center leading-tight w-full truncate ${rStyle.text}`}>
                    {mat.name}
                  </span>
                  
                  <div className={`mt-1.5 w-full flex items-center justify-center gap-1 text-[10px] font-bold py-0.5 rounded shadow-xs ${canBuy ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-stone-200 text-stone-500 border border-stone-300'}`}>
                    <span><Gi.GiCoins size={12}/></span>
                    <span>{mat.price} G</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {tab === 'repairKits' && (
        <>
          <div className="space-y-2">
            <h3 className={theme.typography.h3}>素材を修理キットに交換</h3>
            <p className="text-sm text-stone-600">
              余った素材を分解・再構成して、ロボットの体力を全回復する【修理キット】と交換できます。
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-stone-600 bg-stone-100 p-2.5 rounded-md border border-stone-200">
              <span>【交換レート】</span>
              <span className="font-bold text-stone-700">★1: 3個 → 1個</span>
              <span>/</span>
              <span className="font-bold text-sky-700">★2: 1個 → 1個</span>
              <span>/</span>
              <span className="font-bold text-amber-700">★3: 1個 → 3個</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {MATERIALS.map(mat => {
              const rStyle = theme.rarity[mat.rarity];
              const ownedCount = state.materials[mat.id] || 0;
              const requiredCount = mat.rarity === 1 ? 3 : 1;
              const yieldCount = mat.rarity === 3 ? 3 : 1;
              const canExchange = ownedCount >= requiredCount;

              return (
                <button 
                  key={mat.id} 
                  disabled={!canExchange}
                  onClick={() => handleExchange(mat.id)}
                  className={`relative flex flex-col items-center justify-between p-2 rounded-lg border-2 ${rStyle.border} ${rStyle.bg} transition-all overflow-hidden ${canExchange ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer ring-2 ring-transparent hover:ring-emerald-400' : 'opacity-60 cursor-not-allowed grayscale-[30%]'}`}
                >
                  <div className="absolute top-1.5 left-1.5 text-[9px] leading-none drop-shadow-sm">{rStyle.stars}</div>
                  
                  <div className={`mt-3 mb-1 drop-shadow-md ${rStyle.text}`}>
                    <MaterialIcon materialId={mat.id} size={36} />
                  </div>
                  
                  <span className={`text-[10px] font-bold text-center leading-tight w-full truncate ${rStyle.text}`}>
                    {mat.name}
                  </span>
                  
                  <div className="mt-1 flex flex-col items-center w-full gap-0.5">
                    <span className="text-[9px] font-bold text-stone-500 bg-white/50 px-1 rounded w-full text-center truncate">所持: {ownedCount}</span>
                    <div className={`flex items-center justify-center gap-1 w-full text-[9px] font-bold py-0.5 rounded shadow-xs border ${canExchange ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-stone-200 text-stone-500 border-stone-300'}`}>
                      <span>-{requiredCount}</span>
                      <span><Gi.GiAnticlockwiseRotation size={10}/></span>
                      <span>+{yieldCount}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {tab === 'interiors' && (
        <>
          <h3 className={theme.typography.h3}>背景・内装の変更</h3>
          <p className="text-sm text-stone-600 mb-4">集めた素材を使って、工房の見た目を変更できます。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INTERIORS.map(interior => {
              const isUnlocked = state.unlockedInteriors.includes(interior.id);
              const isCurrent = state.currentInterior === interior.id;
              const canAfford = !isUnlocked && interior.cost.every(c => (state.materials[c.materialId] || 0) >= c.amount);

              return (
                <Card key={interior.id} className={`flex flex-col justify-between ${interior.bgClass}`}>
                  <div className="mb-4">
                    <p className="font-bold text-lg">{interior.name}</p>
                    <p className="text-xs mt-1 opacity-80">{interior.description}</p>
                  </div>
                  
                  {!isUnlocked ? (
                    <div className="mt-4 bg-white/80 p-3 rounded-md">
                      <p className="text-xs font-bold mb-2 text-stone-800">必要素材:</p>
                      <div className="space-y-1 mb-3">
                        {interior.cost.map(c => {
                          const mat = MATERIALS.find(m => m.id === c.materialId);
                          const have = state.materials[c.materialId] || 0;
                          return (
                            <div key={c.materialId} className="flex justify-between text-xs items-center text-stone-800">
                              <span className="flex items-center gap-1">
                                <MaterialIcon materialId={c.materialId} size={14} />
                                {mat?.name}
                              </span>
                              <span className={have >= c.amount ? 'text-green-600 font-bold' : 'text-red-500'}>
                                {have} / {c.amount}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={!canAfford}
                        onClick={() => {
                          try {
                            engine.buyInterior(interior);
                          } catch (e: any) {
                            alert(e.message);
                          }
                        }}
                      >
                        アンロック
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between bg-white/80 p-3 rounded-md">
                      <span className="text-sm font-bold text-stone-800">解放済み</span>
                      <Button 
                        size="sm" 
                        variant={isCurrent ? 'secondary' : 'primary'}
                        disabled={isCurrent}
                        onClick={() => engine.setInterior(interior.id)}
                      >
                        {isCurrent ? '使用中' : '適用する'}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
