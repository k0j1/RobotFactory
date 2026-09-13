import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '../../ui/core';
import { theme } from '../../../styles/theme';
import * as Gi from 'react-icons/gi';
import { Robot, GameState } from '../../../core/models';
import { RobotVisual } from '../../robot/RobotVisual';
import { OPPONENTS, Opponent } from '../Shared';
import {
  createProfileFromRobot,
  createProfileFromOpponent,
  evaluateAllSkillsForProfile,
} from './combatSkills';
import { CombatRobotSkillsModal } from './CombatRobotSkillsModal';
import {
  CombatEquipmentType,
  CombatEquipmentRank,
  COMBAT_EQUIPMENT_RANKS,
  getNextEquipmentRank,
  getEquipmentBonus,
} from '../../../core/combatEquipmentData';

interface CombatSetupCardProps {
  state: GameState;
  activeRobot: Robot | undefined;
  selectedRobotId: string;
  setSelectedRobotId: (id: string) => void;
  activeOpponent: Opponent | undefined;
  selectedOpponentId: string;
  setSelectedOpponentId: (id: string) => void;
  onExchangeEquipment?: (equipment: CombatEquipmentType) => void;
  onUpgradeEquipment?: (equipment: CombatEquipmentType) => void;
  onToggleEquipment: (equipment: CombatEquipmentType, enabled: boolean) => void;
  isOpponentCleared?: (opponentLevel: number) => boolean;
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
  onUpgradeEquipment,
  onToggleEquipment,
  isOpponentCleared,
}) => {
  const elements = state.battleElements || 0;
  const eq = state.combatEquipments || {};
  const eqRanks = state.combatEquipmentRanks || {};
  const activeEq = state.activeCombatEquipments || {};

  const handleUpgrade = onUpgradeEquipment || onExchangeEquipment;

  // スキル確認モーダルの状態管理
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skillsModalTarget, setSkillsModalTarget] = useState<'player' | 'opponent'>('player');
  const [modalInitialSkillId, setModalInitialSkillId] = useState<string | undefined>(undefined);

  // 現在の各装備のランク・ボーナス値
  const saberRank: CombatEquipmentRank | null = eq.beamSaber ? (eqRanks.beamSaber || 'common') : null;
  const shieldRank: CombatEquipmentRank | null = eq.beamShield ? (eqRanks.beamShield || 'common') : null;

  const saberBonus = saberRank ? getEquipmentBonus('beamSaber', saberRank) : 35;
  const shieldBonus = shieldRank ? getEquipmentBonus('beamShield', shieldRank) : 30;

  const nextSaberRank = getNextEquipmentRank(saberRank);
  const nextShieldRank = getNextEquipmentRank(shieldRank);

  const nextSaberDef = nextSaberRank ? COMBAT_EQUIPMENT_RANKS[nextSaberRank] : null;
  const nextShieldDef = nextShieldRank ? COMBAT_EQUIPMENT_RANKS[nextShieldRank] : null;

  // 選択中ロボットの技解放判定
  const playerSkillEval = useMemo(() => {
    if (!activeRobot) return null;
    const profile = createProfileFromRobot(activeRobot, activeEq, eqRanks);
    return {
      profile,
      ...evaluateAllSkillsForProfile(profile),
    };
  }, [activeRobot, activeEq, eqRanks]);

  // 選択中対戦相手の技解放判定
  const opponentSkillEval = useMemo(() => {
    if (!activeOpponent) return null;
    const profile = createProfileFromOpponent(activeOpponent);
    return {
      profile,
      ...evaluateAllSkillsForProfile(profile),
    };
  }, [activeOpponent]);

  const handleOpenSkillsModal = (target: 'player' | 'opponent', skillId?: string) => {
    setSkillsModalTarget(target);
    setModalInitialSkillId(skillId);
    setIsSkillsModalOpen(true);
  };

  return (
    <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm flex flex-col gap-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <Gi.GiCrossedSwords className="text-stone-700 text-lg" />
          <h3 className={`${theme.typography.h3} text-stone-800`}>バトル演習セットアップ</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-300 shadow-2xs flex items-center gap-1.5">
            <Gi.GiCrystalBars className="text-blue-600 text-sm" />
            <span>所持エレメント:</span>
            <span className="text-blue-700 font-mono font-black text-xs">{elements.toLocaleString()} E</span>
          </span>
        </div>
      </div>

      {/* 装備解放 & ランクアップセクション */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* ビームサーベル カード */}
          <div className={`bg-white border rounded-xl p-3 shadow-2xs flex flex-col justify-between gap-2.5 transition-all ${
            saberRank === 'legendary' 
              ? 'border-amber-400 bg-linear-to-br from-amber-50/70 via-white to-orange-50/50 shadow-amber-200/50' 
              : saberRank === 'epic'
              ? 'border-purple-300 bg-purple-50/30'
              : saberRank === 'rare'
              ? 'border-sky-300 bg-sky-50/30'
              : saberRank === 'uncommon'
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-stone-200'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-xl border shrink-0 ${
                  saberRank ? 'bg-amber-100 text-amber-600 border-amber-300' : 'bg-stone-100 text-stone-400 border-stone-200'
                }`}>
                  <Gi.GiBroadsword className="text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">ビームサーベル</span>
                    {saberRank ? (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${COMBAT_EQUIPMENT_RANKS[saberRank].badgeClass}`}>
                        {COMBAT_EQUIPMENT_RANKS[saberRank].label}
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded border bg-stone-100 text-stone-500 border-stone-200 font-bold">
                        未解放
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono mt-0.5">
                    {saberRank ? (
                      <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200 flex items-center gap-1 w-fit">
                        <Gi.GiBroadsword className="text-xs" />
                        <span>攻撃力 +{saberBonus}</span>
                      </span>
                    ) : (
                      <span className="text-stone-500 flex items-center gap-1">
                        <Gi.GiBroadsword className="text-stone-400 text-xs" />
                        <span>未解放</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 装備ON/OFFトグル */}
              {eq.beamSaber && (
                <button 
                  onClick={() => onToggleEquipment('beamSaber', !activeEq.beamSaber)}
                  className={`text-[10px] px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer shrink-0 border ${
                    activeEq.beamSaber 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs hover:bg-amber-600' 
                      : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {activeEq.beamSaber ? '✓ 装備中' : '装備する'}
                </button>
              )}
            </div>

            {/* ランクアップ / 解放ボタン */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
              {nextSaberRank && nextSaberDef ? (
                <>
                  <div className="text-[10px] text-stone-600 flex items-center gap-1">
                    <span className="text-stone-500">次:</span>
                    <strong className="text-stone-800">{nextSaberDef.label}</strong>
                    <span className="text-emerald-700 font-bold ml-0.5">(攻 +{nextSaberDef.saberPowerBonus})</span>
                  </div>
                  <button
                    onClick={() => handleUpgrade && handleUpgrade('beamSaber')}
                    disabled={elements < nextSaberDef.cost}
                    className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                      elements >= nextSaberDef.cost
                        ? 'bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                    }`}
                  >
                    <Gi.GiCrystalBars className="text-xs" />
                    <span>
                      {saberRank ? `${nextSaberDef.cost.toLocaleString()} E で強化` : `${nextSaberDef.cost} E で解放`}
                    </span>
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-0.5">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 flex items-center justify-center gap-1 shadow-2xs">
                    <Gi.GiCrown className="text-amber-600" /> 最高ランク (伝説★5)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ビームシールド カード */}
          <div className={`bg-white border rounded-xl p-3 shadow-2xs flex flex-col justify-between gap-2.5 transition-all ${
            shieldRank === 'legendary' 
              ? 'border-amber-400 bg-linear-to-br from-amber-50/70 via-white to-yellow-50/50 shadow-amber-200/50' 
              : shieldRank === 'epic'
              ? 'border-purple-300 bg-purple-50/30'
              : shieldRank === 'rare'
              ? 'border-sky-300 bg-sky-50/30'
              : shieldRank === 'uncommon'
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-stone-200'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-xl border shrink-0 ${
                  shieldRank ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-stone-100 text-stone-400 border-stone-200'
                }`}>
                  <Gi.GiShield className="text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">ビームシールド</span>
                    {shieldRank ? (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${COMBAT_EQUIPMENT_RANKS[shieldRank].badgeClass}`}>
                        {COMBAT_EQUIPMENT_RANKS[shieldRank].label}
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded border bg-stone-100 text-stone-500 border-stone-200 font-bold">
                        未解放
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono mt-0.5">
                    {shieldRank ? (
                      <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1 w-fit">
                        <Gi.GiShield className="text-xs" />
                        <span>防御力 +{shieldBonus}</span>
                      </span>
                    ) : (
                      <span className="text-stone-500 flex items-center gap-1">
                        <Gi.GiShield className="text-stone-400 text-xs" />
                        <span>未解放</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 装備ON/OFFトグル */}
              {eq.beamShield && (
                <button 
                  onClick={() => onToggleEquipment('beamShield', !activeEq.beamShield)}
                  className={`text-[10px] px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer shrink-0 border ${
                    activeEq.beamShield 
                      ? 'bg-blue-500 text-white border-blue-600 shadow-xs hover:bg-blue-600' 
                      : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {activeEq.beamShield ? '✓ 装備中' : '装備する'}
                </button>
              )}
            </div>

            {/* ランクアップ / 解放ボタン */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
              {nextShieldRank && nextShieldDef ? (
                <>
                  <div className="text-[10px] text-stone-600 flex items-center gap-1">
                    <span className="text-stone-500">次:</span>
                    <strong className="text-stone-800">{nextShieldDef.label}</strong>
                    
                  </div>
                  <button
                    onClick={() => handleUpgrade && handleUpgrade('beamShield')}
                    disabled={elements < nextShieldDef.cost}
                    className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                      elements >= nextShieldDef.cost
                        ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-700 shadow-xs'
                        : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                    }`}
                  >
                    <Gi.GiCrystalBars className="text-xs" />
                    <span>
                      {shieldRank ? `${nextShieldDef.cost.toLocaleString()} E で強化` : `${nextShieldDef.cost} E で解放`}
                    </span>
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-0.5">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 flex items-center justify-center gap-1 shadow-2xs">
                    <Gi.GiCrown className="text-amber-600" /> 最高ランク (伝説★5)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
        {/* 自機選択 */}
        <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-stone-200 pb-1">
            <span className="font-bold text-xs sm:text-sm text-stone-800">出撃ロボット（自機）</span>
            <span className="text-[10px] text-stone-500 font-mono">{state.robots.length} 体保有</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pt-2.5 pb-2 px-1 custom-scrollbar">
            {state.robots.map(r => {
              const isSelected = selectedRobotId === r.id;
              const hp = r.currentHp ?? 12;
              const isHpLow = hp < 1;
              // Check if this specific robot cleared the opponent today
              const isRobotCleared = activeOpponent ? (state.dailyBattleLimits?.[Object.keys(state.dailyBattleLimits || {})[0]] || []).includes(`${r.id}_combat_${activeOpponent.level}`) : false;

              return (
                <button
                  key={r.id}
                  onClick={() => !isHpLow && setSelectedRobotId(r.id)}
                  disabled={isHpLow}
                  className={`shrink-0 relative rounded-xl border-2 transition-all p-1 bg-white overflow-visible cursor-pointer ${
                    isSelected 
                      ? 'border-amber-500 ring-2 ring-amber-300 shadow-xs z-10' 
                      : isRobotCleared
                      ? 'border-emerald-400 bg-emerald-50/40 hover:border-emerald-500'
                      : 'border-stone-300 hover:border-amber-400'
                  } ${isHpLow ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RobotVisual robot={r} size={48} hideBackground={true} hideBubble={true} />
                  {isRobotCleared && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded shadow-md flex items-center gap-0.5 font-mono whitespace-nowrap border border-emerald-400">
                      <Gi.GiCheckMark className="text-[7px]" /> 済
                    </span>
                  )}
                  {isSelected && (
                    <Badge className="absolute -bottom-2 -left-1 z-20 bg-amber-600 text-white text-[9px] px-1.5 py-0 shadow-md whitespace-nowrap font-bold">
                      選択中
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
          {activeRobot && (
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                <div className="font-bold text-[13px] text-stone-900">{activeRobot.name}</div>
                
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="font-bold text-red-700 bg-red-50/90 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1 shadow-2xs" title="攻撃力">
                    <Gi.GiBroadsword className="text-red-600 text-xs" />
                    <span>攻 {activeRobot.stats.power}</span>
                    {activeEq.beamSaber && <span className="text-amber-600 font-bold">(+{saberBonus})</span>}
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50/90 px-2 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1 shadow-2xs" title="防御力">
                    <Gi.GiShield className="text-blue-600 text-xs" />
                    <span>防 {activeRobot.stats.defense}</span>
                    {activeEq.beamShield && <span className="text-cyan-600 font-bold">(+{shieldBonus})</span>}
                  </span>
                  <span className="font-bold text-amber-700 bg-amber-50/90 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs" title="速度・行動力">
                    <Gi.GiSpeedometer className="text-amber-500 text-xs" />
                    <span>速 {activeRobot.stats.agility}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="font-bold text-emerald-700 bg-emerald-50/90 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 shadow-2xs" title="回避力">
                    <Gi.GiSprint className="text-emerald-600 text-xs" />
                    <span>避 {activeRobot.stats.dexterity}</span>
                  </span>
                  <span className="font-bold text-purple-700 bg-purple-50/90 px-2 py-0.5 rounded-lg border border-purple-200 flex items-center gap-1 shadow-2xs" title="知性・戦術">
                    <Gi.GiInspiration className="text-purple-600 text-xs" />
                    <span>知 {activeRobot.stats.intelligence}</span>
                  </span>
                  <span className="font-bold text-rose-700 bg-rose-50/90 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1 shadow-2xs" title="機体耐久値">
                    <Gi.GiHeartShield className="text-rose-500 text-xs" />
                    <span>耐 {activeRobot.currentHp ?? 12}/{activeRobot.maxHp ?? 12}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 対戦相手選択 */}
        <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-stone-200 pb-1">
            <span className="font-bold text-xs sm:text-sm text-stone-800">対戦相手</span>
            <span className="text-[10px] text-stone-500 font-mono">強さLv 1〜10</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pt-2.5 pb-2 px-1 custom-scrollbar">
            {OPPONENTS.map(o => {
              const isSelected = selectedOpponentId === o.id;
              const isCleared = isOpponentCleared ? isOpponentCleared(o.level) : false;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpponentId(o.id)}
                  className={`shrink-0 w-[58px] h-[58px] relative rounded-xl border-2 transition-all p-1 bg-white flex flex-col items-center justify-center overflow-visible cursor-pointer ${
                    isSelected 
                      ? 'border-amber-500 ring-2 ring-amber-300 shadow-xs z-10' 
                      : isCleared
                      ? 'border-emerald-500 bg-emerald-50/70 hover:border-emerald-600 text-emerald-900'
                      : 'border-stone-300 hover:border-amber-400'
                  }`}
                >
                  <div className={`font-black text-xl font-mono ${isCleared ? 'text-emerald-700' : 'text-stone-700'}`}>Lv{o.level}</div>
                  {isCleared && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md flex items-center gap-0.5 font-mono whitespace-nowrap border border-emerald-400">
                      <Gi.GiCheckMark className="text-[8px]" /> 済
                    </span>
                  )}
                  {isSelected && (
                    <Badge className="absolute -bottom-2 -right-1 z-20 bg-amber-600 text-white text-[9px] px-1.5 py-0 shadow-md whitespace-nowrap font-bold">
                      選択中
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
          {activeOpponent && (
            <div className={`p-3 rounded-xl border-2 shadow-2xs space-y-2.5 ${
              isOpponentCleared && isOpponentCleared(activeOpponent.level)
                ? 'bg-emerald-50/80 border-emerald-400'
                : 'bg-white border-stone-200'
            }`}>
              {isOpponentCleared && isOpponentCleared(activeOpponent.level) && (
                <div className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold shadow-xs">
                  <span className="flex items-center gap-1.5">
                    <Gi.GiCheckMark className="text-emerald-200 text-sm" /> 本日この機体でクリア済みです
                  </span>
                  <span className="text-emerald-100 font-mono text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded">朝9:00リセット</span>
                </div>
              )}
              <div className="flex justify-between items-start border-b border-stone-200 pb-1.5">
                <div>
                  <div className="font-bold text-[14px] text-stone-900 flex items-center gap-1.5">
                    <span>{activeOpponent.name}</span>
                    {isOpponentCleared && isOpponentCleared(activeOpponent.level) && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Gi.GiCheckMark className="text-[8px]" /> 本日完了
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500">{activeOpponent.org}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold bg-amber-50/90 p-1.5 rounded-lg border border-amber-300 flex flex-col gap-1 items-end shadow-2xs">
                    <span className="text-amber-950 flex items-center gap-1 font-bold">
                      <Gi.GiLockedChest className="text-amber-600 text-sm" />
                      <span>勝利報酬: 宝箱</span>
                    </span>
                    <span className="text-[9px] text-stone-600 flex items-center gap-1">
                      <span>🧰 修理</span>
                      <span>•</span>
                      <span>⚙️ 素材</span>
                      <span>•</span>
                      <span>🪙 G</span>
                      <span>•</span>
                      <span>💎 E</span>
                    </span>
                    {activeOpponent.rewardFame > 0 && (
                      <span className="text-amber-900 text-[10px] flex items-center gap-1 font-bold">
                        <Gi.GiTrophyCup className="text-amber-600 text-xs" /> 名声 +{activeOpponent.rewardFame}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="font-bold text-red-700 bg-red-50/90 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1 shadow-2xs" title="攻撃力">
                    <Gi.GiBroadsword className="text-red-600 text-xs" />
                    <span>攻 {activeOpponent.power}</span>
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50/90 px-2 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1 shadow-2xs" title="防御力">
                    <Gi.GiShield className="text-blue-600 text-xs" />
                    <span>防 {activeOpponent.defense}</span>
                  </span>
                  <span className="font-bold text-amber-700 bg-amber-50/90 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1 shadow-2xs" title="速度・行動力">
                    <Gi.GiSpeedometer className="text-amber-500 text-xs" />
                    <span>速 {activeOpponent.agi}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="font-bold text-emerald-700 bg-emerald-50/90 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 shadow-2xs" title="回避力">
                    <Gi.GiSprint className="text-emerald-600 text-xs" />
                    <span>避 {activeOpponent.dex}</span>
                  </span>
                  <span className="font-bold text-purple-700 bg-purple-50/90 px-2 py-0.5 rounded-lg border border-purple-200 flex items-center gap-1 shadow-2xs" title="知性・戦術">
                    <Gi.GiInspiration className="text-purple-600 text-xs" />
                    <span>知 {activeOpponent.int}</span>
                  </span>
                  <span className="font-bold text-rose-700 bg-rose-50/90 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1 shadow-2xs" title="実耐久値">
                    <Gi.GiHeartShield className="text-rose-500 text-xs" />
                    <span>耐 {(activeOpponent.hp || 10) * 1000}</span>
                  </span>
                </div>
              </div>

              {/* 敵機の技確認リンク */}
              {opponentSkillEval && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <span className="text-stone-600 font-bold flex items-center gap-1">
                    <Gi.GiRobotGolem className="text-stone-500" />
                    敵機繰出可能技: <strong className="text-amber-700 font-mono">{opponentSkillEval.unleasable.length}</strong>種
                  </span>
                  <button
                    onClick={() => handleOpenSkillsModal('opponent')}
                    className="text-stone-700 hover:text-amber-800 font-bold underline cursor-pointer"
                  >
                    敵機の戦術技を確認 ↗
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* スキル詳細モーダル */}
      {isSkillsModalOpen && (
        <CombatRobotSkillsModal
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          robot={activeRobot}
          opponent={activeOpponent}
          equipments={activeEq}
          initialSkillId={modalInitialSkillId}
          initialTarget={skillsModalTarget}
        />
      )}
    </Card>
  );
};
