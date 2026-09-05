import React, { useState } from 'react';
import { CombatFighter, CombatPopup, SkillDef } from './combatTypes';
import { RobotVisual } from '../../robot/RobotVisual';
import { theme } from '../../../styles/theme';
import * as Gi from 'react-icons/gi';
import { motion, AnimatePresence } from 'motion/react';

interface CombatFighterCardProps {
  fighter: CombatFighter;
  popups: CombatPopup[];
  isAttacking: boolean;
  isHit: boolean;
  onSelectSkill?: (skill: SkillDef) => void;
  onOpenSkillModal?: () => void;
}

export const CombatFighterCard: React.FC<CombatFighterCardProps> = ({
  fighter,
  popups,
  isAttacking,
  isHit,
  onSelectSkill,
  onOpenSkillModal,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const hpPercent = Math.max(0, Math.min(100, (fighter.currentDurability / fighter.maxDurability) * 100));
  const apPercent = Math.max(0, Math.min(100, (fighter.actionPoints / 1000) * 100));

  const getHpColor = () => {
    if (hpPercent > 50) return 'bg-emerald-500';
    if (hpPercent > 20) return 'bg-amber-500';
    return 'bg-red-500 animate-pulse';
  };

  const getPopupColor = (type: CombatPopup['type']) => {
    switch (type) {
      case 'damage': return 'text-red-600 font-black text-lg drop-shadow-sm';
      case 'critical': return 'text-amber-600 font-black text-xl drop-shadow-md';
      case 'dodge': return 'text-sky-600 font-black text-base drop-shadow-sm';
      case 'heal': return 'text-emerald-600 font-black text-lg drop-shadow-sm';
      case 'learn': return 'text-purple-700 font-black text-lg bg-yellow-100 border border-yellow-400 px-2 py-0.5 rounded-md shadow-md';
      case 'buff': return 'text-indigo-600 font-bold text-sm';
      default: return 'text-stone-800 font-bold';
    }
  };

  return (
    <div className={`relative p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-150 ${
      fighter.isPlayer 
        ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
        : 'bg-stone-50 border-stone-300 shadow-sm'
    }`}>
      {/* 被弾・攻撃アニメーションラッパー */}
      <div className={`transition-transform duration-150 ${
        isAttacking ? (fighter.isPlayer ? 'translate-x-3 sm:translate-x-5' : '-translate-x-3 sm:-translate-x-5') : ''
      } ${isHit ? 'animate-shake' : ''}`}>
        {/* ヘッダー・名前・属性・タグ */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-200">
          <div className="flex items-center gap-1.5 min-w-0">
            {fighter.isPlayer ? (
              <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                自機
              </span>
            ) : (
              <span className="bg-stone-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                相手AI
              </span>
            )}
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
              {fighter.name}
            </h3>
          </div>

          <div className="text-[10px] text-stone-500 font-mono shrink-0">
            {fighter.isPlayer ? 'プレイヤー機' : (fighter.opponentRef?.org || 'ライバルAI')}
          </div>
        </div>

        {/* ロボットビジュアルと主要ゲージ */}
        <div className="flex items-center gap-3">
          {/* 機体グラフィック */}
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 rounded-xl border border-stone-300 flex items-center justify-center p-1 shadow-2xs overflow-hidden">
            {fighter.robotRef ? (
              <RobotVisual robot={fighter.robotRef} size={56} hideBackground={true} hideBubble={true} />
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-600">
                <Gi.GiBattleMech className="text-3xl sm:text-4xl text-stone-700" />
                <span className="text-[9px] font-bold mt-0.5">{fighter.name.slice(0, 4)}</span>
              </div>
            )}

            {/* 戦闘不能オーバーレイ */}
            {fighter.currentDurability <= 0 && (
              <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                <span className="text-white font-black text-xs sm:text-sm tracking-widest bg-red-700 px-1.5 py-0.5 rounded">
                  K.O.
                </span>
              </div>
            )}
          </div>

          {/* ゲージ群 */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* 耐久値（Vitality x 1000）バー */}
            <div>
              <div className="flex justify-between items-center text-[10px] sm:text-xs mb-0.5">
                <span className="font-bold text-stone-700 flex items-center gap-1">
                  <Gi.GiHeartShield className="text-rose-600" /> 耐久値 (HP)
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {fighter.currentDurability.toLocaleString()} / {fighter.maxDurability.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-300 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-150 ${getHpColor()}`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* 行動値（AP: 0〜1000、Agilityで蓄積）バー */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-0.5">
                <span className="font-bold text-stone-600 flex items-center gap-1">
                  <Gi.GiSpeedometer className="text-amber-600" /> 行動値 (AP)
                </span>
                <span className="font-mono text-stone-600 text-[10px]">
                  {Math.floor(fighter.actionPoints)} / 1000
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden border border-stone-300">
                <div 
                  className="h-full bg-linear-to-r from-amber-400 to-amber-600 transition-all duration-75 rounded-full"
                  style={{ width: `${apPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 能力値チップ（Pow, Def, Agi, Dex, Int） */}
        <div className="grid grid-cols-5 gap-1 mt-2.5 pt-2 border-t border-stone-200 text-center font-mono">
          <div className="bg-white/80 p-1 rounded border border-stone-200" title="Power: 攻撃力">
            <div className="text-[9px] text-stone-500 font-sans">Pow</div>
            <div className="text-[11px] font-bold text-red-700">{fighter.power}</div>
          </div>
          <div className="bg-white/80 p-1 rounded border border-stone-200" title="Defense: 防御力">
            <div className="text-[9px] text-stone-500 font-sans">Def</div>
            <div className="text-[11px] font-bold text-blue-700">{fighter.defense}</div>
          </div>
          <div className="bg-white/80 p-1 rounded border border-stone-200" title="Agility: 行動蓄積速度">
            <div className="text-[9px] text-stone-500 font-sans">Agi</div>
            <div className="text-[11px] font-bold text-amber-700">{fighter.agility}</div>
          </div>
          <div className="bg-white/80 p-1 rounded border border-stone-200" title="Dexterity: 回避力">
            <div className="text-[9px] text-stone-500 font-sans">Dex</div>
            <div className="text-[11px] font-bold text-emerald-700">{fighter.dexterity}</div>
          </div>
          <div className="bg-white/80 p-1 rounded border border-stone-200" title="Intelligence: 繰り出す技・戦術">
            <div className="text-[9px] text-stone-500 font-sans">Int</div>
            <div className="text-[11px] font-bold text-purple-700">{fighter.intelligence}</div>
          </div>
        </div>

        {/* 繰り出した技スロット */}
        <div className="mt-2 pt-1.5 border-t border-stone-200/80">
          <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
            <span className="font-bold flex items-center gap-1 text-stone-700">
              <Gi.GiInspiration className="text-amber-500" /> 繰り出した技 ({fighter.learnedSkills.length}):
            </span>
            {fighter.learnedSkills.length === 0 ? (
              <span className="text-[10px] text-stone-400">
                行動時に知性で発動
                {onOpenSkillModal && (
                  <button
                    onClick={onOpenSkillModal}
                    className="ml-1 text-amber-700 underline font-bold hover:text-amber-900 cursor-pointer"
                  >
                    技一覧
                  </button>
                )}
              </span>
            ) : (
              <span className="text-[9px] text-stone-400">
                タップで説明表示
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 min-h-[22px]">
            {fighter.learnedSkills.map(s => {
              const cd = fighter.cooldowns[s.id] || 0;
              const isSelected = selectedSkillId === s.id;
              return (
                <button
                  type="button"
                  key={s.id} 
                  onClick={() => {
                    setSelectedSkillId(prev => prev === s.id ? null : s.id);
                    if (onSelectSkill) {
                      onSelectSkill(s);
                    }
                  }}
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-all flex items-center gap-0.5 cursor-pointer shadow-2xs ${
                    isSelected 
                      ? 'ring-2 ring-amber-400 font-black scale-105' 
                      : 'hover:brightness-95 active:scale-95'
                  } ${
                    cd > 0 ? 'bg-stone-200 text-stone-500 border-stone-300' : s.badgeColor
                  }`}
                  title={`${s.name}: ${s.desc}`}
                >
                  <span>{s.name}</span>
                  {cd > 0 ? (
                    <span className="font-mono text-[8px] opacity-80">({Math.ceil(cd)}s)</span>
                  ) : (
                    <span className="text-[8px] text-amber-600 font-mono">⚡</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 選択された技のインライン説明ボックス */}
          <AnimatePresence>
            {selectedSkillId && fighter.learnedSkills.some(s => s.id === selectedSkillId) && (
              (() => {
                const s = fighter.learnedSkills.find(item => item.id === selectedSkillId)!;
                const cd = fighter.cooldowns[s.id] || 0;
                return (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 bg-stone-900 text-stone-100 p-2 rounded-lg text-xs space-y-1 shadow-md border border-stone-700"
                  >
                    <div className="flex items-center justify-between border-b border-stone-700 pb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-amber-400">【{s.name}】</span>
                        <span className="text-[10px] text-stone-300 font-normal">({s.shortDesc})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {onOpenSkillModal && (
                          <button
                            onClick={onOpenSkillModal}
                            className="text-[10px] text-amber-300 hover:underline cursor-pointer"
                          >
                            全体図鑑 ↗
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedSkillId(null)}
                          className="text-stone-400 hover:text-white text-xs px-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-stone-300 leading-snug">
                      {s.desc}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5 border-t border-stone-800">
                      <span>必要知性: Int {s.reqInt}以上</span>
                      <span>再使用CD: {s.cooldownSeconds}秒 {cd > 0 ? `(待機: ${Math.ceil(cd)}s)` : '（即時発動可）'}</span>
                    </div>
                  </motion.div>
                );
              })()
            )}
          </AnimatePresence>
        </div>

        {/* アクティブバフ表示 */}
        {fighter.activeBuffs.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {fighter.activeBuffs.map(b => (
              <span key={b.id} className="text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-300 px-1.5 py-0.2 rounded font-bold">
                🛡️ {b.name} ({Math.ceil(b.durationSeconds)}s)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* フローティングポップアップ（ダメージ、DODGE、HEAL、閃き） */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
        <AnimatePresence>
          {popups.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1.1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className={getPopupColor(p.type)}
            >
              {p.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
