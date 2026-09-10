import React, { useState, useMemo, useEffect } from 'react';
import * as Gi from 'react-icons/gi';
import { motion, AnimatePresence } from 'motion/react';
import { Robot } from '../../../core/models';
import { Opponent } from '../Shared';
import {
  ALL_COMBAT_SKILLS,
  createProfileFromRobot,
  createProfileFromOpponent,
  evaluateAllSkillsForProfile,
  SkillRequirementCheck,
  FighterStatProfile,
} from './combatSkills';
import { RobotVisual } from '../../robot/RobotVisual';
import { theme } from '../../../styles/theme';

interface CombatRobotSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  robot: Robot | undefined;
  opponent: Opponent | undefined;
  equipments?: {
    beamSaber?: boolean;
    beamShield?: boolean;
  };
  initialSkillId?: string;
  initialTarget?: 'player' | 'opponent';
}

export const CombatRobotSkillsModal: React.FC<CombatRobotSkillsModalProps> = ({
  isOpen,
  onClose,
  robot,
  opponent,
  equipments,
  initialSkillId,
  initialTarget = 'player',
}) => {
  const [target, setTarget] = useState<'player' | 'opponent'>(initialTarget);
  const [filter, setFilter] = useState<'all' | 'unleasable' | 'locked'>('unleasable');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(initialSkillId || null);

  // モーダルが開かれたときにターゲットと初期選択を同期
  useEffect(() => {
    if (isOpen) {
      setTarget(initialTarget);
      if (initialSkillId) {
        setSelectedSkillId(initialSkillId);
      }
    }
  }, [isOpen, initialTarget, initialSkillId]);

  // プロファイルの構築
  const playerProfile: FighterStatProfile | null = useMemo(() => {
    if (!robot) return null;
    return createProfileFromRobot(robot, equipments);
  }, [robot, equipments]);

  const opponentProfile: FighterStatProfile | null = useMemo(() => {
    if (!opponent) return null;
    return createProfileFromOpponent(opponent);
  }, [opponent]);

  // 現在選択中のプロファイル
  const currentProfile = target === 'player' ? playerProfile : opponentProfile;

  // 技の判定結果
  const evaluations = useMemo(() => {
    if (!currentProfile) {
      return { all: [], unleasable: [], locked: [] };
    }
    return evaluateAllSkillsForProfile(currentProfile);
  }, [currentProfile]);

  // 絞り込み後の技リスト
  const displayedSkills = useMemo(() => {
    switch (filter) {
      case 'unleasable':
        return evaluations.unleasable;
      case 'locked':
        return evaluations.locked;
      case 'all':
      default:
        return evaluations.all;
    }
  }, [evaluations, filter]);

  // 選択中の技（無ければリストの先頭）
  const activeSelectedCheck: SkillRequirementCheck | undefined = useMemo(() => {
    if (selectedSkillId) {
      const found = evaluations.all.find(c => c.skill.id === selectedSkillId);
      if (found) return found;
    }
    return displayedSkills[0] || evaluations.all[0];
  }, [selectedSkillId, displayedSkills, evaluations.all]);

  // ESCキーでのクローズ対応
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentProfile) return null;

  // カテゴリラベルとアイコン
  const getCategoryMeta = (category: string) => {
    switch (category) {
      case 'attack':
        return { label: '強撃攻撃', icon: <Gi.GiBroadsword className="text-red-500" />, badge: 'bg-red-950/80 text-red-300 border-red-800/80' };
      case 'rush':
        return { label: '連撃チャージ', icon: <Gi.GiRapidshareArrow className="text-amber-500" />, badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80' };
      case 'snipe':
        return { label: '精密狙撃', icon: <Gi.GiBullseye className="text-emerald-500" />, badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80' };
      case 'shield':
        return { label: '防壁バリア', icon: <Gi.GiShieldReflect className="text-blue-500" />, badge: 'bg-blue-950/80 text-blue-300 border-blue-800/80' };
      case 'repair':
        return { label: '自己修復', icon: <Gi.GiHealing className="text-teal-500" />, badge: 'bg-teal-950/80 text-teal-300 border-teal-800/80' };
      case 'emp':
        return { label: '電磁妨害', icon: <Gi.GiLightningTrio className="text-purple-500" />, badge: 'bg-purple-950/80 text-purple-300 border-purple-800/80' };
      case 'overdrive':
        return { label: 'リミッター解除', icon: <Gi.GiFlamingSheet className="text-rose-500" />, badge: 'bg-rose-950/80 text-rose-300 border-rose-800/80' };
      default:
        return { label: '戦術技', icon: <Gi.GiInspiration className="text-indigo-500" />, badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' };
    }
  };

  const selectedCat = activeSelectedCheck ? getCategoryMeta(activeSelectedCheck.skill.category) : null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-stone-900 border-2 border-stone-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* ヘッダー */}
          <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg shadow-2xs">
                <Gi.GiInspiration />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>戦術技・繰り出し判定図鑑</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono">
                    GSAPモーション連動
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  知性(Int)や機体能力値、装備によってバトル中に自律発動できる戦術技の確認
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="閉じる"
            >
              <span className="text-lg leading-none font-bold">✕</span>
            </button>
          </div>

          {/* 機体切り替えタブ（自機 VS 対戦相手） */}
          <div className="bg-stone-950/80 px-4 pt-2.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2 text-xs">
              {robot && playerProfile && (
                <button
                  onClick={() => {
                    setTarget('player');
                    setSelectedSkillId(null);
                  }}
                  className={`pb-2 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    target === 'player'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Gi.GiBattleMech className="text-sm" />
                  <span>自機: {robot.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    target === 'player' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-stone-800 text-stone-400'
                  }`}>
                    繰出可能 {evaluateAllSkillsForProfile(playerProfile).unleasable.length}種
                  </span>
                </button>
              )}

              {opponent && opponentProfile && (
                <button
                  onClick={() => {
                    setTarget('opponent');
                    setSelectedSkillId(null);
                  }}
                  className={`pb-2 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    target === 'opponent'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Gi.GiRobotGolem className="text-sm" />
                  <span>敵機: {opponent.name} (Lv.{opponent.level})</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    target === 'opponent' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-stone-800 text-stone-400'
                  }`}>
                    繰出可能 {evaluateAllSkillsForProfile(opponentProfile).unleasable.length}種
                  </span>
                </button>
              )}
            </div>

            {/* 対象の有効ステータスバー */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 text-[10px] font-mono">
              <span className="text-stone-400">実効能力値:</span>
              <span className="bg-stone-800 text-red-300 px-1.5 py-0.5 rounded border border-red-900/60 font-bold">
                Pow:{currentProfile.power}
                {currentProfile.boosts?.saberPower ? <span className="text-amber-400 text-[9px]">(+{currentProfile.boosts.saberPower})</span> : null}
              </span>
              <span className="bg-stone-800 text-blue-300 px-1.5 py-0.5 rounded border border-blue-900/60 font-bold">
                Def:{currentProfile.defense}
                {currentProfile.boosts?.shieldDefense ? <span className="text-cyan-400 text-[9px]">(+{currentProfile.boosts.shieldDefense})</span> : null}
              </span>
              <span className="bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded border border-amber-900/60 font-bold">
                Agi:{currentProfile.agility}
              </span>
              <span className="bg-stone-800 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-900/60 font-bold">
                Dex:{currentProfile.dexterity}
              </span>
              <span className="bg-purple-950/80 text-purple-200 px-1.5 py-0.5 rounded border border-purple-700/80 font-bold">
                Int:{currentProfile.intelligence}
              </span>
              <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded border border-stone-700 font-bold">
                耐久:{(currentProfile.vitality || 10) * 1000}
              </span>
            </div>
          </div>

          {/* フィルタータブ */}
          <div className="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilter('unleasable')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filter === 'unleasable'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Gi.GiCheckMark className="text-xs" />
                <span>繰り出せる技 ({evaluations.unleasable.length})</span>
              </button>

              <button
                onClick={() => setFilter('locked')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filter === 'locked'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Gi.GiPadlock className="text-xs" />
                <span>条件未達の技 ({evaluations.locked.length})</span>
              </button>

              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filter === 'all'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Gi.GiBookmarklet className="text-xs" />
                <span>全戦術技 ({evaluations.all.length})</span>
              </button>
            </div>

            <span className="text-[10px] text-stone-400 hidden sm:inline">
              知性が高いほど発動確率UP (Int 1毎に+0.35%)
            </span>
          </div>

          {/* メインエリア（左: 技リスト / 右: 詳細カード） */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-3.5">
            {/* 左側: 技リスト */}
            <div className="md:col-span-5 flex flex-col overflow-hidden">
              <div className="text-[11px] font-bold text-stone-400 mb-1.5 flex items-center justify-between">
                <span>技を選択:</span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {displayedSkills.length} 件表示中
                </span>
              </div>

              {displayedSkills.length === 0 ? (
                <div className="bg-stone-950/60 rounded-xl p-4 text-center border border-stone-800 text-stone-400 text-xs">
                  {filter === 'unleasable' ? (
                    <>
                      <Gi.GiBrain className="text-stone-500 text-3xl mx-auto mb-1.5 opacity-60" />
                      <p className="font-bold text-stone-300">繰り出せる技がまだありません</p>
                      <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                        知性(Int)を上げたり、ビームサーベルやシールドを装備すると技が解放されます。
                      </p>
                    </>
                  ) : (
                    <p>該当する技はありません</p>
                  )}
                </div>
              ) : (
                <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 custom-scrollbar">
                  {displayedSkills.map(check => {
                    const isSelected = activeSelectedCheck?.skill.id === check.skill.id;
                    const cat = getCategoryMeta(check.skill.category);
                    return (
                      <button
                        key={check.skill.id}
                        onClick={() => setSelectedSkillId(check.skill.id)}
                        className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs ${cat.badge}`}>
                            {cat.icon}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-stone-100 truncate flex items-center gap-1">
                              <span>{check.skill.name.replace(/【.*?】/, '')}</span>
                            </div>
                            <div className="text-[10px] text-stone-400 truncate">
                              {check.skill.shortDesc}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-0.5">
                          {check.canUnleash ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 flex items-center gap-0.5">
                              <Gi.GiCheckMark className="text-[8px]" />
                              <span>繰出可</span>
                              <span className="font-mono text-emerald-200">({check.flashChance}%)</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-400 border border-stone-700 flex items-center gap-0.5">
                              <Gi.GiPadlock className="text-[8px]" />
                              <span>未達成</span>
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-stone-500">
                            CD: {check.skill.cooldownSeconds}s
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 右側: 選択中の技の詳細カード */}
            <div className="md:col-span-7 flex flex-col overflow-y-auto custom-scrollbar">
              {activeSelectedCheck ? (
                <div className="bg-stone-950/90 rounded-xl border border-stone-800 p-3.5 sm:p-4 space-y-3.5 flex-1 shadow-inner">
                  {/* タイトルとカテゴリ */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-white">
                          {activeSelectedCheck.skill.name}
                        </span>
                        {selectedCat && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${selectedCat.badge}`}>
                            {selectedCat.icon}
                            <span>{selectedCat.label}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-300 font-bold mt-0.5">
                        {activeSelectedCheck.skill.shortDesc}
                      </p>
                    </div>

                    <div className="text-right font-mono text-[11px] text-stone-400">
                      <div>再使用待機: <strong className="text-amber-400">{activeSelectedCheck.skill.cooldownSeconds}秒</strong></div>
                    </div>
                  </div>

                  {/* 繰り出し可否ステータスバナー */}
                  <div className={`p-2.5 rounded-xl border flex flex-col gap-1.5 ${
                    activeSelectedCheck.canUnleash
                      ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                        {activeSelectedCheck.canUnleash ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-xs">
                              ✓
                            </div>
                            <span className="text-emerald-300">
                              【{currentProfile.name}】はこの技を繰り出せます！
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs">
                              !
                            </div>
                            <span className="text-amber-300">
                              【{currentProfile.name}】はまだ解放条件を満たしていません
                            </span>
                          </>
                        )}
                      </div>

                      {activeSelectedCheck.canUnleash && (
                        <div className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/60">
                          閃き発動率: {activeSelectedCheck.flashChance}%
                        </div>
                      )}
                    </div>

                    {!activeSelectedCheck.canUnleash && (
                      <div className="mt-1 pt-1.5 border-t border-amber-800/40 text-[11px] space-y-1">
                        <div className="text-amber-400 font-bold flex items-center gap-1">
                          <Gi.GiCrossMark className="text-red-400 text-xs" /> 不足している必要条件:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-stone-300 pl-1">
                          {activeSelectedCheck.missingRequirements.map((req, idx) => (
                            <li key={idx} className="text-rose-300 font-medium">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* 技の詳細解説 */}
                  <div>
                    <div className="text-[11px] font-bold text-stone-400 mb-1 flex items-center gap-1">
                      <Gi.GiBookmarklet className="text-amber-400 text-xs" /> 技の効果詳細:
                    </div>
                    <div className="bg-stone-900/90 rounded-lg p-2.5 border border-stone-800 text-xs text-stone-200 leading-relaxed">
                      {activeSelectedCheck.skill.desc}
                    </div>
                  </div>

                  {/* GSAPモーション演出連携 */}
                  <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-purple-900/60 text-purple-300 border border-purple-700/60 flex items-center justify-center text-xs">
                        🎬
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400">バトル演習GSAPアニメーション</div>
                        <div className="text-xs font-bold text-purple-200">
                          {activeSelectedCheck.animationInfo.label}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-bold">
                      {activeSelectedCheck.animationInfo.tag}
                    </span>
                  </div>

                  {/* 解放・発動条件グリッド */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {/* 必要知性 */}
                    <div className={`p-2 rounded-lg border ${
                      activeSelectedCheck.intOk
                        ? 'bg-stone-900/90 border-stone-800 text-stone-200'
                        : 'bg-red-950/40 border-red-800/80 text-red-200'
                    }`}>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Gi.GiBrain className={activeSelectedCheck.intOk ? 'text-purple-400' : 'text-red-400'} />
                        必要知性 (Int)
                      </div>
                      <div className="text-sm font-black font-mono mt-0.5 flex items-center justify-between">
                        <span>{activeSelectedCheck.reqInt} 以上</span>
                        <span className={`text-[10px] font-bold ${activeSelectedCheck.intOk ? 'text-emerald-400' : 'text-red-400'}`}>
                          {activeSelectedCheck.intOk ? '✓ 達成' : `不足 (${activeSelectedCheck.currentInt})`}
                        </span>
                      </div>
                    </div>

                    {/* 必要能力値 */}
                    <div className={`p-2 rounded-lg border ${
                      activeSelectedCheck.statOk
                        ? 'bg-stone-900/90 border-stone-800 text-stone-200'
                        : 'bg-red-950/40 border-red-800/80 text-red-200'
                    }`}>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Gi.GiMuscleUp className={activeSelectedCheck.statOk ? 'text-amber-400' : 'text-red-400'} />
                        必要能力値
                      </div>
                      <div className="text-xs font-bold mt-0.5">
                        {activeSelectedCheck.reqStatName ? (
                          <div className="flex items-center justify-between">
                            <span>{activeSelectedCheck.reqStatName} {activeSelectedCheck.reqStatValue}+</span>
                            <span className={`text-[10px] font-mono ${activeSelectedCheck.statOk ? 'text-emerald-400' : 'text-red-400'}`}>
                              {activeSelectedCheck.statOk ? '✓' : `(${activeSelectedCheck.currentStatValue})`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 font-mono">能力指定なし</span>
                        )}
                      </div>
                    </div>

                    {/* 必要装備 */}
                    <div className={`p-2 rounded-lg border col-span-2 sm:col-span-1 ${
                      activeSelectedCheck.equipmentOk
                        ? 'bg-stone-900/90 border-stone-800 text-stone-200'
                        : 'bg-red-950/40 border-red-800/80 text-red-200'
                    }`}>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Gi.GiBroadsword className={activeSelectedCheck.equipmentOk ? 'text-cyan-400' : 'text-red-400'} />
                        専用装備条件
                      </div>
                      <div className="text-xs font-bold mt-0.5">
                        {activeSelectedCheck.reqEquipment === 'beamSaber' ? (
                          <div className="flex items-center justify-between text-rose-300">
                            <span>Bサーベル</span>
                            <span className="text-[10px] font-mono">{activeSelectedCheck.hasEquipment ? '✓ 装備中' : '未装備'}</span>
                          </div>
                        ) : activeSelectedCheck.reqEquipment === 'beamShield' ? (
                          <div className="flex items-center justify-between text-cyan-300">
                            <span>Bシールド</span>
                            <span className="text-[10px] font-mono">{activeSelectedCheck.hasEquipment ? '✓ 装備中' : '未装備'}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400 font-mono">通常装備で可</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 解放のアドバイス */}
                  {!activeSelectedCheck.canUnleash && (
                    <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800 text-[11px] text-stone-300">
                      <strong className="text-amber-400 block mb-0.5">💡 解放のアドバイス:</strong>
                      {activeSelectedCheck.reqEquipment && !activeSelectedCheck.hasEquipment ? (
                        <span>セットアップ画面の上部から「{activeSelectedCheck.reqEquipment === 'beamSaber' ? 'ビームサーベル' : 'ビームシールド'}」を装備すると即座に解放されます。</span>
                      ) : !activeSelectedCheck.intOk ? (
                        <span>知性(Int)の高いパーツ（★2・★3の頭部や腕部など）をクラフトして機体をカスタマイズすると技を閃くようになります。</span>
                      ) : (
                        <span>対応する能力値（{activeSelectedCheck.reqStatName}）を素材厳選や高レアパーツで強化しましょう。</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 text-stone-500 text-xs">
                  技を選択してください
                </div>
              )}
            </div>
          </div>

          {/* フッター */}
          <div className="bg-stone-950 px-4 py-2.5 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[10px] text-stone-500">
              ※ 戦闘中に攻撃を行う際、機体の知性演算によって自律的に閃き・発動します
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer border border-stone-700"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
