import React, { useState } from 'react';
import * as Gi from 'react-icons/gi';
import { motion, AnimatePresence } from 'motion/react';
import { SkillDef, CombatFighter } from './combatTypes';
import { ALL_COMBAT_SKILLS } from './combatSkills';

interface CombatSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: CombatFighter;
  opponent: CombatFighter;
  initialSkill?: SkillDef | null;
}

export const CombatSkillModal: React.FC<CombatSkillModalProps> = ({
  isOpen,
  onClose,
  player,
  opponent,
  initialSkill = null,
}) => {
  const [activeTab, setActiveTab] = useState<'battle' | 'all'>('battle');
  const [inspectSkill, setInspectSkill] = useState<SkillDef | null>(initialSkill);

  // 初回表示時やinitialSkill変更時に同期
  React.useEffect(() => {
    if (initialSkill) {
      setInspectSkill(initialSkill);
    }
  }, [initialSkill]);

  if (!isOpen) return null;

  // 今回の戦闘で繰り出された技（プレイヤー＋相手）
  const playerSkills = player.learnedSkills;
  const opponentSkills = opponent.learnedSkills;
  const allBattleSkillsMap = new Map<string, { skill: SkillDef; byPlayer: boolean; byOpponent: boolean }>();

  playerSkills.forEach(s => {
    allBattleSkillsMap.set(s.id, { skill: s, byPlayer: true, byOpponent: false });
  });
  opponentSkills.forEach(s => {
    const existing = allBattleSkillsMap.get(s.id);
    if (existing) {
      existing.byOpponent = true;
    } else {
      allBattleSkillsMap.set(s.id, { skill: s, byPlayer: false, byOpponent: true });
    }
  });

  const battleSkillsList = Array.from(allBattleSkillsMap.values());

  // デフォルトで表示する技の選定
  const activeInspectSkill = inspectSkill || (battleSkillsList.length > 0 ? battleSkillsList[0].skill : ALL_COMBAT_SKILLS[0]);

  // カテゴリ名とアイコン
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'attack': return { label: '強撃攻撃', icon: <Gi.GiBroadsword className="text-red-600" /> };
      case 'rush': return { label: '連撃チャージ', icon: <Gi.GiRapidshareArrow className="text-amber-600" /> };
      case 'snipe': return { label: '精密狙撃', icon: <Gi.GiBullseye className="text-emerald-600" /> };
      case 'shield': return { label: '防壁バリア', icon: <Gi.GiShieldReflect className="text-blue-600" /> };
      case 'repair': return { label: '自己修復', icon: <Gi.GiHealing className="text-teal-600" /> };
      case 'emp': return { label: '電磁妨害', icon: <Gi.GiLightningTrio className="text-purple-600" /> };
      case 'overdrive': return { label: 'リミッター解除', icon: <Gi.GiFlamingSheet className="text-rose-600" /> };
      default: return { label: '戦術技', icon: <Gi.GiInspiration className="text-indigo-600" /> };
    }
  };

  const selectedCat = getCategoryLabel(activeInspectSkill.category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-stone-900 border border-stone-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* ヘッダー */}
          <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Gi.GiInspiration className="text-amber-400 text-lg" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>繰り出した技の解説・図鑑</span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  戦闘中に知性演算によって発動する戦術技の詳細効果
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

          {/* タブ切り替え */}
          <div className="flex border-b border-stone-800 bg-stone-950/60 px-4 pt-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('battle')}
              className={`pb-2 px-2.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'battle'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Gi.GiCrossedSwords className="text-sm" />
              <span>戦闘で繰り出した技 ({battleSkillsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-2.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Gi.GiBookmarklet className="text-sm" />
              <span>全戦術技一覧 ({ALL_COMBAT_SKILLS.length})</span>
            </button>
          </div>

          {/* コンテンツエリア */}
          <div className="p-3 sm:p-4 overflow-y-auto space-y-3.5 flex-1">
            {/* 上部: 技リストバッジ */}
            <div>
              <div className="text-[11px] font-bold text-stone-400 mb-1.5 flex items-center justify-between">
                <span>選択して詳細を表示:</span>
                <span className="text-[10px] text-stone-500">
                  {activeTab === 'battle' ? 'この戦闘で発動確認された技' : '解放可能なすべての技'}
                </span>
              </div>

              {activeTab === 'battle' && battleSkillsList.length === 0 ? (
                <div className="bg-stone-800/60 rounded-xl p-4 text-center border border-stone-700/60">
                  <Gi.GiBrain className="text-stone-500 text-3xl mx-auto mb-1 opacity-70 animate-pulse" />
                  <p className="text-xs text-stone-300 font-bold">まだ技が繰り出されていません</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    ロボットが攻撃する際、知性(Int)演算によって自律的に技を繰り出します。「全戦術技一覧」タブから解放可能な技一覧を確認できます。
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(activeTab === 'battle' ? battleSkillsList.map(b => b.skill) : ALL_COMBAT_SKILLS).map(s => {
                    const isSelected = activeInspectSkill.id === s.id;
                    const battleInfo = allBattleSkillsMap.get(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => setInspectSkill(s)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md ring-2 ring-amber-300/40 scale-102'
                            : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                        }`}
                      >
                        <span>{s.name}</span>
                        {battleInfo && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                            isSelected ? 'bg-stone-900 text-amber-300' : 'bg-stone-700 text-stone-300'
                          }`}>
                            {battleInfo.byPlayer && battleInfo.byOpponent ? '両者' : battleInfo.byPlayer ? '自機' : '敵機'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 選択された技の詳細カード */}
            {activeInspectSkill && (
              <div className="bg-stone-800/90 rounded-xl border border-stone-700 p-3.5 sm:p-4 space-y-3 shadow-inner">
                {/* 技名とカテゴリ */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-white">
                        【{activeInspectSkill.name}】
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${activeInspectSkill.badgeColor}`}>
                        {selectedCat.icon}
                        <span>{selectedCat.label}</span>
                      </span>
                    </div>
                    <p className="text-xs text-amber-300 font-bold mt-0.5">
                      {activeInspectSkill.shortDesc}
                    </p>
                  </div>

                  <div className="text-right font-mono text-[11px] text-stone-400">
                    <div>再使用CD: <strong className="text-amber-400">{activeInspectSkill.cooldownSeconds}秒</strong></div>
                  </div>
                </div>

                {/* 詳細説明文 */}
                <div>
                  <div className="text-[11px] font-bold text-stone-400 mb-1">技の効果説明:</div>
                  <div className="bg-stone-950/80 rounded-lg p-2.5 border border-stone-800 text-xs text-stone-200 leading-relaxed">
                    {activeInspectSkill.desc}
                  </div>
                </div>

                {/* 発動・解放条件 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-stone-900/90 p-2 rounded-lg border border-stone-800">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Gi.GiBrain className="text-purple-400" /> 必要知性 (Int)
                    </div>
                    <div className="text-sm font-black text-purple-300 font-mono mt-0.5">
                      {activeInspectSkill.reqInt} 以上
                    </div>
                  </div>

                  <div className="bg-stone-900/90 p-2 rounded-lg border border-stone-800">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Gi.GiMuscleUp className="text-amber-400" /> 必要ステータス
                    </div>
                    <div className="text-xs font-bold text-amber-200 mt-0.5">
                      {activeInspectSkill.reqStat ? (
                        <span>{activeInspectSkill.reqStat.name} {activeInspectSkill.reqStat.value}+</span>
                      ) : (
                        <span className="text-stone-400">知性のみで解放</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-900/90 p-2 rounded-lg border border-stone-800 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Gi.GiInspiration className="text-yellow-400" /> 発動基本確率
                    </div>
                    <div className="text-sm font-black text-yellow-300 font-mono mt-0.5">
                      {activeInspectSkill.baseLearnChance}%
                    </div>
                  </div>
                </div>

                {/* 現在の演習での状況 */}
                <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80 text-[11px] text-stone-300 space-y-1">
                  <div className="font-bold text-stone-400 text-[10px] flex items-center gap-1">
                    <Gi.GiRobotAntennas className="text-amber-400" /> 今回の戦闘での状態:
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      自機 ({player.name}):{' '}
                      {player.learnedSkills.some(s => s.id === activeInspectSkill.id) ? (
                        <span className="text-emerald-400 font-bold">
                          ✓ 繰り出し済み {player.cooldowns[activeInspectSkill.id] ? `(待機中: ${Math.ceil(player.cooldowns[activeInspectSkill.id])}s)` : '(即時発動可)'}
                        </span>
                      ) : (
                        <span className="text-stone-500">未繰り出し</span>
                      )}
                    </div>
                    <div>
                      相手 ({opponent.name}):{' '}
                      {opponent.learnedSkills.some(s => s.id === activeInspectSkill.id) ? (
                        <span className="text-amber-400 font-bold">
                          ✓ 繰り出し済み {opponent.cooldowns[activeInspectSkill.id] ? `(待機中: ${Math.ceil(opponent.cooldowns[activeInspectSkill.id])}s)` : '(即時発動可)'}
                        </span>
                      ) : (
                        <span className="text-stone-500">未繰り出し</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="bg-stone-950 px-4 py-2.5 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[10px] text-stone-500">
              ※ 知性が高いほど強力な技を状況に合わせて繰り出します
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
