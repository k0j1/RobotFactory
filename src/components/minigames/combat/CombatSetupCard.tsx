import React, { useState } from 'react';
import { Card, Button, Badge } from '../../ui/core';
import { theme } from '../../../styles/theme';
import * as Gi from 'react-icons/gi';
import { Robot, GameState } from '../../../core/models';
import { RobotVisual } from '../../robot/RobotVisual';
import { OPPONENTS, Opponent } from '../Shared';

interface CombatSetupCardProps {
  state: GameState;
  activeRobot: Robot | undefined;
  selectedRobotId: string;
  setSelectedRobotId: (id: string) => void;
  activeOpponent: Opponent | undefined;
  selectedOpponentId: string;
  setSelectedOpponentId: (id: string) => void;
  onExchangeEquipment: (equipment: 'beamSaber' | 'beamShield') => void;
  onToggleEquipment: (equipment: 'beamSaber' | 'beamShield', enabled: boolean) => void;
}

export const CombatSetupCard: React.FC<CombatSetupCardProps> = ({
  state,
  activeRobot,
  selectedRobotId,
  setSelectedRobotId,
  activeOpponent,
  selectedOpponentId,
  setSelectedOpponentId,
  onExchangeEquipment,
  onToggleEquipment,
}) => {
  const elements = state.battleElements || 0;
  const eq = state.combatEquipments || {};
  const activeEq = state.activeCombatEquipments || {};

  return (
    <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <Gi.GiCrossedSwords className="text-stone-700 text-lg" />
          <h3 className={`${theme.typography.h3} text-stone-800`}>バトル演習セットアップ</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200">
            <Gi.GiCrystalBars className="inline text-blue-500 mr-1" />
            エレメント: <span className="text-blue-700 font-mono">{elements}</span>
          </span>
        </div>
      </div>

      {/* 装備交換セクション */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px] bg-white border border-stone-200 rounded-xl p-2 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gi.GiBroadsword className="text-amber-500 text-lg" />
            <div>
              <div className="font-bold text-[11px] text-stone-800">ビームサーベル</div>
              <div className="text-[9px] text-stone-500">攻撃力+35</div>
            </div>
          </div>
          {eq.beamSaber ? (
            <button 
              onClick={() => onToggleEquipment('beamSaber', !activeEq.beamSaber)}
              className={`text-[10px] px-2 py-1 font-bold rounded transition-all ${activeEq.beamSaber ? 'bg-amber-500 text-white shadow-xs' : 'bg-stone-200 text-stone-500'}`}
            >
              {activeEq.beamSaber ? '装備中' : '装備する'}
            </button>
          ) : (
            <button 
              onClick={() => onExchangeEquipment('beamSaber')}
              disabled={elements < 100}
              className={`text-[10px] px-2 py-1 font-bold rounded transition-all ${elements >= 100 ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
            >
              100 E で交換
            </button>
          )}
        </div>
        <div className="flex-1 min-w-[200px] bg-white border border-stone-200 rounded-xl p-2 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gi.GiShield className="text-blue-500 text-lg" />
            <div>
              <div className="font-bold text-[11px] text-stone-800">ビームシールド</div>
              <div className="text-[9px] text-stone-500">防御力+30</div>
            </div>
          </div>
          {eq.beamShield ? (
            <button 
              onClick={() => onToggleEquipment('beamShield', !activeEq.beamShield)}
              className={`text-[10px] px-2 py-1 font-bold rounded transition-all ${activeEq.beamShield ? 'bg-blue-500 text-white shadow-xs' : 'bg-stone-200 text-stone-500'}`}
            >
              {activeEq.beamShield ? '装備中' : '装備する'}
            </button>
          ) : (
            <button 
              onClick={() => onExchangeEquipment('beamShield')}
              disabled={elements < 100}
              className={`text-[10px] px-2 py-1 font-bold rounded transition-all ${elements >= 100 ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
            >
              100 E で交換
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* 自機選択 */}
        <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-stone-200 pb-1">
            <span className="font-bold text-xs sm:text-sm text-stone-800">出撃ロボット（自機）</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {state.robots.map(r => {
              const isSelected = selectedRobotId === r.id;
              const hp = r.currentHp ?? 12;
              const isHpLow = hp < 1;
              return (
                <button
                  key={r.id}
                  onClick={() => !isHpLow && setSelectedRobotId(r.id)}
                  disabled={isHpLow}
                  className={`shrink-0 relative rounded-xl border-2 transition-all p-1 bg-white ${
                    isSelected 
                      ? 'border-amber-500 ring-2 ring-amber-300 shadow-xs' 
                      : 'border-stone-300 hover:border-amber-400'
                  } ${isHpLow ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RobotVisual robot={r} size={48} hideBackground={true} hideBubble={true} />
                  {isSelected && (
                    <Badge className="absolute -bottom-2 -left-2 bg-amber-600 text-white text-[9px] px-1 py-0 shadow-2xs">
                      選択中
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
          {activeRobot && (
            <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-2xs">
              <div className="font-bold text-[12px] text-stone-900 mb-1">{activeRobot.name}</div>
              <div className="space-y-1">
                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                  <span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">Pow:{activeRobot.stats.power}</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Def:{activeRobot.stats.defense}</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Agi:{activeRobot.stats.agility}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Dex:{activeRobot.stats.dexterity}</span>
                  <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Int:{activeRobot.stats.intelligence}</span>
                  <span className="font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">HP:{activeRobot.currentHp}/{activeRobot.maxHp}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 対戦相手選択 */}
        <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-stone-200 pb-1">
            <span className="font-bold text-xs sm:text-sm text-stone-800">対戦相手</span>
            <span className="text-[10px] text-stone-500">強さLv 1〜10</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {OPPONENTS.map(o => {
              const isSelected = selectedOpponentId === o.id;
              // 簡易表示としてレベルバッジを使う
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpponentId(o.id)}
                  className={`shrink-0 w-[56px] h-[56px] relative rounded-xl border-2 transition-all p-1 bg-white flex items-center justify-center ${
                    isSelected 
                      ? 'border-amber-500 ring-2 ring-amber-300 shadow-xs' 
                      : 'border-stone-300 hover:border-amber-400'
                  }`}
                >
                  <div className="font-black text-stone-400 text-xl font-mono">Lv{o.level}</div>
                  {isSelected && (
                    <Badge className="absolute -bottom-2 -right-2 bg-amber-600 text-white text-[9px] px-1 py-0 shadow-2xs">
                      選択中
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
          {activeOpponent && (
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-start border-b border-stone-100 pb-1.5">
                <div>
                  <div className="font-bold text-[13px] text-stone-900">{activeOpponent.name}</div>
                  <div className="text-[10px] text-stone-500">{activeOpponent.org}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold bg-blue-50/80 p-1.5 rounded-lg border border-blue-200 flex flex-col gap-1 items-end">
                    <span className="text-stone-700 flex items-center gap-1">
                      <Gi.GiSpanner className="text-amber-600" /> 修理キット ×{activeOpponent.rewardKits}
                    </span>
                    {activeOpponent.rewardElements > 0 && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Gi.GiEnergyArrow className="text-emerald-600" /> エレメント: +{activeOpponent.rewardElements}個
                      </span>
                    )}
                    {activeOpponent.rewardFame > 0 && (
                      <span className="text-amber-900 flex items-center gap-1">
                        <Gi.GiTrophyCup className="text-amber-600" /> 工房名声: +{activeOpponent.rewardFame}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                  <span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">Pow:{activeOpponent.power}</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Def:{activeOpponent.defense}</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Agi:{activeOpponent.agi}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Dex:{activeOpponent.dex}</span>
                  <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Int:{activeOpponent.int}</span>
                  <span className="font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">耐久:{(activeOpponent.hp || 10) * 1000}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
