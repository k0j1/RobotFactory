import React from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export const ShopScreen: React.FC<{ state: GameState, engine: GameEngine, onBack: () => void }> = ({ state, engine, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>商店</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>工房へ戻る</Button>
      </div>

      <div className={`p-4 ${theme.colors.surface} ${theme.radius.md} ${theme.shadow.sm} flex justify-between items-center`}>
        <span>所持金</span>
        <span className={`${theme.typography.h2} text-amber-600`}>{state.gold} G</span>
      </div>

      <h3 className={theme.typography.h3}>素材を購入</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MATERIALS.map(mat => (
          <Card key={mat.id} className="flex justify-between items-center">
            <div>
              <p className="font-bold flex items-center gap-2">
                <MaterialIcon materialId={mat.id} size={18} />
                {mat.name}
              </p>
              <p className="text-xs text-stone-500 mt-1">属性: {mat.attribute}</p>
            </div>
            <Button 
              size="sm" 
              disabled={state.gold < mat.price}
              onClick={() => engine.buyMaterial(mat.id)}
            >
              {mat.price} G
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
