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

  // スキル確認モーダルの状態管理
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skillsModalTarget, setSkillsModalTarget] = useState<'player' | 'opponent'>('player');
  const [modalInitialSkillId, setModalInitialSkillId] = useState<string | undefined>(undefined);

  // 選択中ロボットの技解放判定
  const playerSkillEval = useMemo(() => {
    if (!activeRobot) return null;
    const profile = createProfileFromRobot(activeRobot, activeEq);
    return {
      profile,
      ...evaluateAllSkillsForProfile(profile),
    };
  }, [activeRobot, activeEq]);

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
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                <div className="font-bold text-[13px] text-stone-900">{activeRobot.name}</div>
                {playerSkillEval && (
                  <button
                    onClick={() => handleOpenSkillsModal('player')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Gi.GiInspiration className="text-amber-600" />
                    <span>繰出可能技: <strong className="font-mono text-amber-800">{playerSkillEval.unleasable.length}</strong>種</span>
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-600 font-mono">
                  <span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    Pow:{activeRobot.stats.power}
                    {activeEq.beamSaber && <span className="text-amber-600 font-bold ml-0.5">(+35)</span>}
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    Def:{activeRobot.stats.defense}
                    {activeEq.beamShield && <span className="text-cyan-600 font-bold ml-0.5">(+30)</span>}
                  </span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Agi:{activeRobot.stats.agility}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-600 font-mono">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Dex:{activeRobot.stats.dexterity}
                  </span>
                  <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                    Int:{activeRobot.stats.intelligence}
                  </span>
                  <span className="font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                    HP:{activeRobot.currentHp ?? 12}/{activeRobot.maxHp ?? 12}
                  </span>
                </div>
              </div>

              {/* 繰り出せる技のクイック一覧セクション */}
              {playerSkillEval && (
                <div className="pt-2 border-t border-stone-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                    <span className="flex items-center gap-1">
                      <Gi.GiInspiration className="text-amber-600" />
                      繰り出せる戦術技 ({playerSkillEval.unleasable.length}/{playerSkillEval.all.length})
                    </span>
                    <button
                      onClick={() => handleOpenSkillsModal('player')}
                      className="text-[10px] text-amber-700 hover:text-amber-900 font-bold cursor-pointer underline"
                    >
                      詳細・図鑑 ↗
                    </button>
                  </div>

                  {playerSkillEval.unleasable.length === 0 ? (
                    <div className="text-[10px] text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-200">
                      知性やステータスが不足しているため、繰り出せる技がありません。知性UPやパーツ強化、装備を試してみましょう。
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {playerSkillEval.unleasable.map(check => (
                        <button
                          key={check.skill.id}
                          onClick={() => handleOpenSkillsModal('player', check.skill.id)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 border border-stone-300 hover:border-amber-400 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="クリックして技の詳細を確認"
                        >
                          <span>{check.skill.name.replace(/【.*?】/, '')}</span>
                          <span className="text-[8px] text-amber-700 font-mono">({check.flashChance}%)</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 装備により解放できる技のヒント */}
                  {!activeEq.beamSaber && (
                    <div className="text-[9px] text-stone-500 bg-amber-50/70 p-1.5 rounded border border-amber-200/80 flex items-center gap-1">
                      <Gi.GiBroadsword className="text-amber-600 shrink-0" />
                      <span>ビームサーベルを装備すると専用奥義<strong>【星断オメガクロス】</strong>が解放されます</span>
                    </div>
                  )}

                  {/* モーダル表示ボタン */}
                  <button
                    onClick={() => handleOpenSkillsModal('player')}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-50 to-amber-100/80 hover:from-amber-100 hover:to-amber-200 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Gi.GiBookmarklet className="text-amber-700 text-sm" />
                    <span>繰り出せる技の解説・解放条件を確認</span>
                  </button>
                </div>
              )}
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
                  <div className="text-[11px] font-bold bg-amber-50/90 p-1.5 rounded-lg border border-amber-300 flex flex-col gap-1 items-end shadow-2xs">
                    <span className="text-amber-950 flex items-center gap-1 font-mono font-bold">
                      <Gi.GiLockedChest className="text-amber-600 text-sm" /> 勝利報酬: 宝箱ドロップ
                    </span>
                    <span className="text-[9px] text-stone-600 font-mono">
                      修理キット / 素材 / G / E
                    </span>
                    {activeOpponent.rewardFame > 0 && (
                      <span className="text-amber-900 text-[10px] flex items-center gap-1">
                        <Gi.GiTrophyCup className="text-amber-600" /> 名声: +{activeOpponent.rewardFame}
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

      {/* 戦術技確認モーダル */}
      <CombatRobotSkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        robot={activeRobot}
        opponent={activeOpponent}
        equipments={activeEq}
        initialTarget={skillsModalTarget}
        initialSkillId={modalInitialSkillId}
      />
    </Card>
  );
};
