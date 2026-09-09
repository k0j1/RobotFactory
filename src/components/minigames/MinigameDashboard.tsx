import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Gi from 'react-icons/gi';
import { theme } from '../../styles/theme';

export interface RecordData {
  plays: number;
  wins: number;
  losses: number;
  draws: number;
}

interface MinigameDashboardProps {
  records: Record<string, RecordData> | undefined;
}

export interface CategoryGroup {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  badgeBg: string;
  games: {
    id: string;
    name: string;
    icon: React.ReactNode;
    desc: string;
  }[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'battle',
    name: '戦闘・対戦',
    desc: '閃き・リアルタイム攻撃と拠点防衛',
    icon: <Gi.GiCrossedSwords />,
    color: 'from-red-600 to-rose-700',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    games: [
      { id: 'combat', name: 'バトル演習', icon: <Gi.GiSwordsPower />, desc: '閃きと戦術を競うリアルタイムバトル' },
      { id: 'defense', name: '拠点防衛戦', icon: <Gi.GiShieldReflect />, desc: '迫り来る敵群から拠点を防衛' }
    ]
  },
  {
    id: 'puzzle',
    name: 'パズル・頭脳戦',
    desc: '思考力と先読みのボードゲーム',
    icon: <Gi.GiChessKing />,
    color: 'from-amber-600 to-yellow-700',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    games: [
      { id: 'othello', name: 'オセロ演習', icon: <Gi.GiInvertedDice3 />, desc: '挟んで裏返す定番リバーシ' },
      { id: 'chess', name: 'チェス演習', icon: <Gi.GiChessRook />, desc: '王手を狙う本格頭脳勝負' }
    ]
  },
  {
    id: 'shooting',
    name: '射撃・機動演習',
    desc: '瞬発力と回避の極限テスト',
    icon: <Gi.GiLightningTrio />,
    color: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    games: [
      { id: 'danmaku', name: '弾幕サバイバル', icon: <Gi.GiMissileSwarm />, desc: '高密度弾幕を潜り抜けるサバイバル' }
    ]
  },
  {
    id: 'music',
    name: '音楽・演奏会',
    desc: '正確なリズムと旋律の調和',
    icon: <Gi.GiMusicalNotes />,
    color: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    games: [
      { id: 'piano', name: 'ピアノ演奏', icon: <Gi.GiMusicalKeyboard />, desc: '名曲をロボットが奏でるリサイタル' }
    ]
  }
];

export interface RankInfo {
  rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  title: string;
  color: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
  auraClass: string;
  badgeClass: string;
  effectType: 'legend' | 'flame' | 'lightning' | 'crystal' | 'cyber' | 'mild' | 'scanline' | 'standby';
}

export const getRankInfo = (wins: number, plays: number): RankInfo => {
  if (plays === 0) {
    return {
      rank: 'G',
      title: '未プレイ',
      color: 'text-stone-400',
      textColor: 'text-stone-300',
      borderColor: 'border-stone-700',
      glowColor: 'rgba(120, 113, 108, 0.2)',
      bgGradient: 'from-stone-900 via-stone-850 to-stone-900',
      auraClass: 'border-stone-700/60',
      badgeClass: 'bg-stone-800 text-stone-400 border-stone-600',
      effectType: 'standby'
    };
  }

  if (wins >= 50) {
    return {
      rank: 'S',
      title: '伝説 (LEGEND)',
      color: 'text-yellow-300',
      textColor: 'text-yellow-100',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(234, 179, 8, 0.65)',
      bgGradient: 'from-amber-950/80 via-yellow-900/50 to-stone-900',
      auraClass: 'border-yellow-400/80 shadow-[0_0_25px_rgba(234,179,8,0.5)]',
      badgeClass: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-stone-950 border-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.7)]',
      effectType: 'legend'
    };
  }
  if (wins >= 30) {
    return {
      rank: 'A',
      title: '達人 (MASTER)',
      color: 'text-rose-400',
      textColor: 'text-rose-100',
      borderColor: 'border-rose-500',
      glowColor: 'rgba(244, 63, 94, 0.55)',
      bgGradient: 'from-rose-950/80 via-red-900/40 to-stone-900',
      auraClass: 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.45)]',
      badgeClass: 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.6)]',
      effectType: 'flame'
    };
  }
  if (wins >= 15) {
    return {
      rank: 'B',
      title: '熟練 (EXPERT)',
      color: 'text-amber-400',
      textColor: 'text-amber-100',
      borderColor: 'border-amber-500',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      bgGradient: 'from-amber-950/60 via-orange-950/30 to-stone-900',
      auraClass: 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      badgeClass: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-amber-300',
      effectType: 'lightning'
    };
  }
  if (wins >= 10) {
    return {
      rank: 'C',
      title: '一人前 (VETERAN)',
      color: 'text-emerald-400',
      textColor: 'text-emerald-100',
      borderColor: 'border-emerald-500',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      bgGradient: 'from-emerald-950/60 via-teal-950/30 to-stone-900',
      auraClass: 'border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      badgeClass: 'bg-emerald-600 text-white border-emerald-300',
      effectType: 'crystal'
    };
  }
  if (wins >= 5) {
    return {
      rank: 'D',
      title: '中堅 (ADEPT)',
      color: 'text-sky-400',
      textColor: 'text-sky-100',
      borderColor: 'border-sky-500',
      glowColor: 'rgba(14, 165, 233, 0.4)',
      bgGradient: 'from-sky-950/50 via-cyan-950/20 to-stone-900',
      auraClass: 'border-sky-500/60 shadow-[0_0_10px_rgba(14,165,233,0.3)]',
      badgeClass: 'bg-sky-600 text-white border-sky-300',
      effectType: 'cyber'
    };
  }
  if (wins >= 1) {
    return {
      rank: 'E',
      title: '見習い (NOVICE)',
      color: 'text-teal-400',
      textColor: 'text-teal-100',
      borderColor: 'border-teal-600',
      glowColor: 'rgba(20, 184, 166, 0.35)',
      bgGradient: 'from-teal-950/40 to-stone-900',
      auraClass: 'border-teal-600/50',
      badgeClass: 'bg-teal-700 text-teal-100 border-teal-400',
      effectType: 'mild'
    };
  }
  return {
    rank: 'F',
    title: '挑戦中 (CHALLENGER)',
    color: 'text-stone-400',
    textColor: 'text-stone-300',
    borderColor: 'border-stone-600',
    glowColor: 'rgba(120, 113, 108, 0.25)',
    bgGradient: 'from-stone-850 to-stone-900',
    auraClass: 'border-stone-600/50',
    badgeClass: 'bg-stone-700 text-stone-300 border-stone-500',
    effectType: 'scanline'
  };
};

export const MinigameDashboard: React.FC<MinigameDashboardProps> = ({ records = {} }) => {
  // 初期状態はコンパクトモード
  const [isDetailed, setIsDetailed] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // 全体集計
  const totalRecord: RecordData = { plays: 0, wins: 0, losses: 0, draws: 0 };
  Object.keys(records).forEach(key => {
    const r = records[key];
    if (r) {
      totalRecord.plays += r.plays;
      totalRecord.wins += r.wins;
      totalRecord.losses += r.losses;
      totalRecord.draws += r.draws;
    }
  });

  const totalRank = getRankInfo(totalRecord.wins, totalRecord.plays);

  // カテゴリ別集計データの作成
  const categoryStats = CATEGORY_GROUPS.map(cat => {
    const stats: RecordData = { plays: 0, wins: 0, losses: 0, draws: 0 };
    cat.games.forEach(g => {
      const r = records[g.id];
      if (r) {
        stats.plays += r.plays;
        stats.wins += r.wins;
        stats.losses += r.losses;
        stats.draws += r.draws;
      }
    });
    const rank = getRankInfo(stats.wins, stats.plays);

    return {
      ...cat,
      stats,
      rank
    };
  });

  // 表示するカテゴリ
  const filteredCategories = activeCategoryFilter === 'all'
    ? categoryStats
    : categoryStats.filter(c => c.id === activeCategoryFilter);

  return (
    /* 1. ポンコツロボット世界観：レトロモニター外装ベゼル（鋳鉄・真鍮調の厚みある枠組み） */
    <div className={`w-full ${theme.retroMonitor.outerBezel} mb-6 select-none`}>
      
      {/* 2. 四隅のレトロマイナスネジ・ボルト */}
      <div className="absolute top-2.5 left-2.5">
        <div className={theme.retroMonitor.screw}>
          <div className={`${theme.retroMonitor.screwSlot} rotate-45`} />
        </div>
      </div>
      <div className="absolute top-2.5 right-2.5">
        <div className={theme.retroMonitor.screw}>
          <div className={`${theme.retroMonitor.screwSlot} -rotate-12`} />
        </div>
      </div>
      <div className="absolute bottom-2.5 left-2.5">
        <div className={theme.retroMonitor.screw}>
          <div className={`${theme.retroMonitor.screwSlot} rotate-12`} />
        </div>
      </div>
      <div className="absolute bottom-2.5 right-2.5">
        <div className={theme.retroMonitor.screw}>
          <div className={`${theme.retroMonitor.screwSlot} rotate-75`} />
        </div>
      </div>

      {/* 3. モニター上部：レトロ銘板プレート ＆ 状態LEDランプ ＆ 放熱スリット */}
      <div className="flex items-center justify-between px-6 pb-2.5 pt-0.5 text-stone-300">
        <div className="flex items-center gap-2">
          <div className={theme.retroMonitor.labelPlate}>
            <span className="text-[#e2a85c] font-black mr-1">◆</span>
            <span>PONKOTSU-CRT // MODEL-70</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <div className={theme.retroMonitor.ledGreen} />
            <span className="text-[9px] font-mono text-emerald-400/90 tracking-tighter">PWR ON</span>
          </div>
        </div>

        {/* 放熱スリット風装飾 */}
        <div className="flex items-center gap-1 opacity-40">
          <div className="w-4 h-1 bg-[#140e0a] rounded-xs" />
          <div className="w-4 h-1 bg-[#140e0a] rounded-xs" />
          <div className="w-4 h-1 bg-[#140e0a] rounded-xs" />
        </div>
      </div>

      {/* 4. CRTモニター画面本体（ブラウン管内包・走査線・インナーシャドウ） */}
      <div className={`${theme.retroMonitor.innerBezel} crt-curve-vignette ${theme.retroMonitor.screenGlow} text-stone-100 animate-crt-flicker`}>
        
        {/* 4.1 走査線（スキャンライン）背景パターン */}
        <div className="absolute inset-0 pointer-events-none crt-scanlines-pattern z-20 opacity-30" />

        {/* 4.2 上から下へゆっくり移動するスキャンライン光バー */}
        <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent pointer-events-none animate-scanline-bar z-20" />

        {/* 4.3 レトロモニター背景グリッド */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(#d97706 1px, transparent 1px), linear-gradient(90deg, #d97706 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* 4.4 モニターヘッダー部（タイトル ＆ モード切り替えトグル） */}
        <div className="p-2.5 sm:p-3 relative z-10 border-b border-[#3d332a] bg-gradient-to-r from-[#1e1915]/95 via-[#181411]/80 to-[#14110f] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-yellow-700 flex items-center justify-center text-stone-950 text-base shadow-[0_0_12px_rgba(217,119,6,0.6)] border border-amber-300 shrink-0">
              <Gi.GiTrophyCup />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-wider text-amber-100 flex items-center gap-1.5 font-mono">
                  <span>ARENA MONITOR</span>
                  <span className="text-[9px] text-amber-300 px-1.5 py-0.2 rounded bg-amber-950/90 border border-amber-600/60 font-sans shadow-xs">
                    総合演習ログ
                  </span>
                </h2>
              </div>
              <p className="text-[10px] text-[#a89582] font-mono">
                [SYS_LOG: ARENA_SUMMARY // CRT SCAN 60Hz]
              </p>
            </div>
          </div>

          {/* 右側：コンパクト / 詳細モード 切り替えトグルボタン */}
          <div className="flex items-center gap-1.5 bg-[#1f1a16] p-1 rounded-xl border border-[#4d3e31] shadow-inner">
            <button
              onClick={() => setIsDetailed(false)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                !isDetailed
                  ? 'bg-amber-600 text-white shadow-[0_0_8px_rgba(217,119,6,0.6)] border border-amber-400/40'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Gi.GiBriefcase className="text-xs" />
              <span>コンパクト</span>
            </button>
            <button
              onClick={() => setIsDetailed(true)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                isDetailed
                  ? 'bg-amber-600 text-white shadow-[0_0_8px_rgba(217,119,6,0.6)] border border-amber-400/40'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Gi.GiMagnifyingGlass className="text-xs" />
              <span>詳細モード</span>
            </button>
          </div>
        </div>

        {/* ＝＝＝＝＝ 1. コンパクトモード表示 ＝＝＝＝＝ */}
        {!isDetailed && (
          <div className="p-2.5 sm:p-3 relative z-10 space-y-2.5">
            {/* 総合サマリーバー（薄型・レトロ端末風） */}
            <div className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all bg-gradient-to-r ${totalRank.bgGradient} ${totalRank.borderColor} flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md relative overflow-hidden`}>
              
              {/* ランクに応じた光エフェクト */}
              {totalRank.effectType === 'legend' && (
                <motion.div 
                  className="absolute inset-0 bg-radial from-yellow-400/20 via-transparent to-transparent pointer-events-none"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}
              {totalRank.effectType === 'flame' && (
                <motion.div 
                  className="absolute inset-0 bg-radial from-rose-500/20 via-transparent to-transparent pointer-events-none"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* 左側：総合ランク ＆ 称号 */}
              <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-md ${totalRank.auraClass} bg-[#18130f] shrink-0`}>
                  <div className={`text-2xl font-black ${totalRank.color} leading-none`}>
                    {totalRank.rank}
                  </div>
                  <div className="text-[7px] font-mono font-bold text-stone-400">RANK</div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold font-mono border ${totalRank.badgeClass}`}>
                      {totalRank.title}
                    </span>
                    <span className="text-[10px] text-amber-300/80 font-mono">総合演習階級</span>
                  </div>
                  <div className="text-xs font-bold text-stone-200 mt-0.5 font-mono">
                    全競技マスターステータス
                  </div>
                </div>
              </div>

              {/* 右側：総遊んだ数 ＆ 総勝利数 */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end relative z-10">
                <div className="bg-[#120f0d]/90 px-3 py-1.5 rounded-lg border border-[#3d332a] text-center min-w-[75px] shadow-inner">
                  <div className="text-[9px] font-mono text-stone-400 flex items-center justify-center gap-0.5">
                    <Gi.GiGamepad className="text-[10px]" /> 遊んだ数
                  </div>
                  <div className="text-sm font-bold font-mono text-stone-100">
                    {totalRecord.plays} <span className="text-[9px] font-sans text-stone-400">回</span>
                  </div>
                </div>

                <div className="bg-[#120f0d]/90 px-3 py-1.5 rounded-lg border border-[#3d332a] text-center min-w-[75px] shadow-inner">
                  <div className="text-[9px] font-mono text-amber-400 flex items-center justify-center gap-0.5">
                    <Gi.GiTrophyCup className="text-[10px]" /> 勝利数
                  </div>
                  <div className="text-sm font-bold font-mono text-amber-300">
                    {totalRecord.wins} <span className="text-[9px] font-sans text-amber-400/80">勝</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4大カテゴリ一覧（コンパクトなレトロ端末グリッド） */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {categoryStats.map(cat => (
                <div
                  key={cat.id}
                  className="bg-[#1a1512]/90 rounded-xl p-2.5 border border-[#3d332a] flex items-center justify-between gap-2 shadow-inner"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-sm shrink-0 shadow-xs border border-white/20`}>
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-200 truncate">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-[#b09e8c] font-mono">
                        {cat.stats.plays}回 / <span className="text-amber-400 font-bold">{cat.stats.wins}勝</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <span className={`text-xs font-black font-mono px-1.5 py-0.2 rounded border ${cat.rank.badgeClass}`}>
                      {cat.rank.rank}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ＝＝＝＝＝ 2. 詳細モード表示 ＝＝＝＝＝ */}
        {isDetailed && (
          <div>
            {/* メイン：総合ランキングカード（ランクに応じた豪華エフェクト） */}
            <div className="p-3 sm:p-4 relative z-10">
              <div className={`relative rounded-2xl p-3.5 sm:p-4 border-2 transition-all overflow-hidden ${totalRank.borderColor} bg-gradient-to-br ${totalRank.bgGradient} shadow-xl`}>
                
                {/* Sランク・伝説のゴールドオーラ＆キラキラパーティクル */}
                {totalRank.effectType === 'legend' && (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-radial from-yellow-400/20 via-amber-500/5 to-transparent pointer-events-none"
                      animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.98, 1.02, 0.98] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div 
                      className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute top-3 left-4 text-yellow-300 text-lg pointer-events-none"
                      animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <Gi.GiSparkles />
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-3 right-4 text-amber-300 text-lg pointer-events-none"
                      animate={{ rotate: -360, scale: [1.2, 0.8, 1.2] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Gi.GiLaurelCrown />
                    </motion.div>
                  </>
                )}

                {/* Aランク・達人の紅蓮炎エフェクト */}
                {totalRank.effectType === 'flame' && (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-radial from-rose-500/20 via-red-600/5 to-transparent pointer-events-none"
                      animate={{ opacity: [0.5, 0.85, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute top-2 right-4 text-rose-400 text-xl pointer-events-none"
                      animate={{ y: [0, -4, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <Gi.GiFireBowl />
                    </motion.div>
                  </>
                )}

                {/* Bランク・熟練の琥珀稲妻エフェクト */}
                {totalRank.effectType === 'lightning' && (
                  <motion.div 
                    className="absolute top-2 right-4 text-amber-400 text-xl pointer-events-none"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Gi.GiLightningTrio />
                  </motion.div>
                )}

                {/* Cランク・一人前のエメラルドクリスタル */}
                {totalRank.effectType === 'crystal' && (
                  <motion.div 
                    className="absolute top-2 right-4 text-emerald-400 text-xl pointer-events-none"
                    animate={{ rotate: [0, 10, -10, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Gi.GiCrystalBars />
                  </motion.div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                  {/* 左側：総合称号＆アリーナ階級 */}
                  <div className="flex items-center gap-4">
                    {/* ランク特大バッジ */}
                    <div className="relative shrink-0">
                      <motion.div 
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl ${totalRank.auraClass} bg-[#18130f]`}
                        animate={
                          totalRank.rank === 'S' 
                            ? { rotate: [0, -1, 1, 0], scale: [1, 1.03, 1] } 
                            : totalRank.rank === 'A'
                            ? { y: [0, -2, 0] }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="text-[9px] font-mono tracking-widest text-stone-400 font-bold">RANK</div>
                        <div className={`text-3xl sm:text-4xl font-black ${totalRank.color} drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none my-0.5`}>
                          {totalRank.rank}
                        </div>
                        <div className="text-[8px] font-mono font-bold text-stone-400">CLASS</div>
                      </motion.div>
                      
                      {totalRank.rank === 'S' && (
                        <motion.div 
                          className="absolute -top-2.5 -right-2 bg-yellow-400 text-stone-950 p-1 rounded-full shadow-lg border border-yellow-100"
                          animate={{ y: [-2, 2, -2], rotate: [0, 8, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Gi.GiCrown size={12} />
                        </motion.div>
                      )}
                      {totalRank.rank === 'A' && (
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg border border-rose-200">
                          <Gi.GiMedal size={11} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono border shadow-sm ${totalRank.badgeClass}`}>
                          {totalRank.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#c4b3a2]">
                          OVERALL EVALUATION
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-amber-100 tracking-wide font-mono">
                        総合演習戦績マスター
                      </h3>
                      <p className="text-xs text-stone-300 mt-0.5 max-w-md">
                        {totalRank.rank === 'S' && '全競技を極めし伝説のロボット工房！卓越した性能と戦術の証。'}
                        {totalRank.rank === 'A' && '多数の演習で輝かしい戦績を誇る達人工房！頂点まであと少し。'}
                        {totalRank.rank === 'B' && '各演習で安定した実力を発揮する熟練工房！'}
                        {totalRank.rank === 'C' && '基本戦術をマスターした一人前の工房。更なる高みを目指せ！'}
                        {totalRank.rank === 'D' && '演習のコツを掴み始めた中堅工房。勝利数を重ねよう！'}
                        {totalRank.rank === 'E' && '初勝利を記録！得意な演習を見つけて腕を磨こう。'}
                        {totalRank.rank === 'F' && '演習に挑戦中！ロボットの強化や相性を見直してみよう。'}
                        {totalRank.rank === 'G' && 'まだ演習が行われていません。ロボットを出撃させてみよう！'}
                      </p>
                    </div>
                  </div>

                  {/* 右側：総演習回数 ＆ 総勝利数 */}
                  <div className="grid grid-cols-2 gap-2.5 bg-[#120e0c]/80 p-2.5 rounded-xl border border-[#3d332a] min-w-[210px] shadow-inner">
                    <div className="text-center p-2 rounded-lg bg-[#1c1714] border border-[#362c24]">
                      <div className="text-[10px] font-mono text-stone-400 font-bold flex items-center justify-center gap-1">
                        <Gi.GiGamepad className="text-stone-400" /> PLAYS
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-stone-100 mt-0.5">
                        {totalRecord.plays}
                      </div>
                      <div className="text-[9px] text-stone-500 font-sans">総演習回数</div>
                    </div>

                    <div className="text-center p-2 rounded-lg bg-[#1c1714] border border-[#362c24]">
                      <div className="text-[10px] font-mono text-amber-400 font-bold flex items-center justify-center gap-1">
                        <Gi.GiTrophyCup className="text-amber-400" /> WINS
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-amber-300 mt-0.5">
                        {totalRecord.wins}
                      </div>
                      <div className="text-[9px] text-amber-400/80 font-sans">総勝利数</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* カテゴリ別成績サマリー＆個別ゲーム成績セクション */}
            <div className="px-3 pb-4 sm:px-4 relative z-10 space-y-3.5">
              
              {/* カテゴリ切り替えフィルタータブ */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#3d332a] pb-2.5">
                <div className="flex items-center gap-2">
                  <Gi.GiRadarSweep className="text-amber-400 text-lg" />
                  <h4 className="text-sm font-black text-amber-100 tracking-wider font-mono">
                    CATEGORY BREAKDOWN &amp; RECORDS
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-[#1f1a16] p-1 rounded-xl border border-[#4d3e31]">
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeCategoryFilter === 'all'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    すべて ({categoryStats.reduce((acc, c) => acc + c.games.length, 0)}種目)
                  </button>
                  {CATEGORY_GROUPS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        activeCategoryFilter === cat.id
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* カテゴリごとのグループカード */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {filteredCategories.map(cat => {
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#1a1512]/90 border-2 border-[#3d332a] rounded-xl p-3.5 shadow-md relative overflow-hidden"
                      >
                        {/* カテゴリヘッダー（遊んだ数・勝利数・ランク） */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[#362c24]">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-base shadow-sm border border-white/20`}>
                              {cat.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-amber-100 flex items-center gap-1.5 font-mono">
                                  {cat.name}
                                </h5>
                                <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${cat.badgeBg}`}>
                                  {cat.games.length}種目
                                </span>
                              </div>
                              <p className="text-[11px] text-[#a89582] mt-0.5">
                                {cat.desc}
                              </p>
                            </div>
                          </div>

                          {/* カテゴリ総合集計バッジ（遊んだ数・勝利数・ランク） */}
                          <div className="flex items-center gap-3 bg-[#120e0c]/80 px-3 py-1.5 rounded-xl border border-[#3d332a] self-start sm:self-auto shadow-inner">
                            <div className="text-right">
                              <div className="text-[9px] font-mono text-stone-400">遊んだ数</div>
                              <div className="text-sm font-bold font-mono text-stone-200">
                                {cat.stats.plays} <span className="text-[10px] font-sans text-stone-500">回</span>
                              </div>
                            </div>
                            <div className="w-[1px] h-5 bg-[#362c24]" />
                            <div className="text-right">
                              <div className="text-[9px] font-mono text-amber-400">勝利数</div>
                              <div className="text-sm font-bold font-mono text-amber-300">
                                {cat.stats.wins} <span className="text-[10px] font-sans text-amber-500/80">勝</span>
                              </div>
                            </div>
                            <div className="w-[1px] h-5 bg-[#362c24]" />
                            <div className="flex flex-col items-center">
                              <div className="text-[8px] font-mono text-stone-400">RANK</div>
                              <span className={`text-base font-black font-mono ${cat.rank.color} leading-none`}>
                                {cat.rank.rank}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 種目別カードグリッド */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5">
                          {cat.games.map(game => {
                            const r = records[game.id] || { plays: 0, wins: 0, losses: 0, draws: 0 };
                            const gameRank = getRankInfo(r.wins, r.plays);

                            return (
                              <motion.div
                                key={game.id}
                                className="bg-[#120f0d]/90 rounded-xl p-3 border border-[#362c24] hover:border-amber-500/60 transition-all flex flex-col justify-between relative overflow-hidden group shadow-inner"
                                whileHover={{ y: -2 }}
                              >
                                <div className={`absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 ${gameRank.color}`}>
                                  <Gi.GiRibbonMedal className="text-2xl absolute top-1 right-1" />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-[#2c231c]">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base text-amber-400">{game.icon}</span>
                                      <span className="font-bold text-stone-200 text-xs sm:text-sm">{game.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${gameRank.badgeClass}`}>
                                      Rank {gameRank.rank}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-[#a89582] line-clamp-1 mb-2">
                                    {game.desc}
                                  </p>
                                </div>

                                {/* 成績ステータス（遊んだ数・勝利数のみ） */}
                                <div className="bg-[#1a1512] rounded-lg p-1.5 border border-[#312720]">
                                  <div className="grid grid-cols-2 gap-1 text-center font-mono">
                                    <div>
                                      <div className="text-[9px] text-stone-500">遊んだ数</div>
                                      <div className="text-xs font-bold text-stone-300">{r.plays}回</div>
                                    </div>
                                    <div>
                                      <div className="text-[9px] text-amber-500/80">勝利数</div>
                                      <div className="text-xs font-bold text-amber-400">{r.wins}勝</div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
