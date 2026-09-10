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

export type BattleRank = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface RankInfo {
  rank: BattleRank;
  title: string;
  conditionText: string;
  nextThreshold?: number;
  remainingWins?: number;
  color: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
  auraClass: string;
  badgeClass: string;
  effectType: 'mythic' | 'supreme' | 'legend' | 'flame' | 'lightning' | 'crystal' | 'cyber' | 'mild' | 'scanline' | 'standby';
}

export const BATTLE_RANK_TIERS: {
  rank: BattleRank;
  conditionText: string;
  rangeText: string;
  title: string;
  badgeClass: string;
  color: string;
}[] = [
  { rank: 'SSS', conditionText: '4000勝以上', rangeText: '4000勝〜', title: '神話超越 (MYTHIC)', badgeClass: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-amber-400 text-white border-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.8)]', color: 'text-fuchsia-300' },
  { rank: 'SS', conditionText: '4000勝以下', rangeText: '2001〜4000勝', title: '覇王至高 (SUPREME)', badgeClass: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-stone-950 border-amber-100 font-black shadow-[0_0_12px_rgba(251,191,36,0.8)]', color: 'text-amber-200' },
  { rank: 'S', conditionText: '2000勝以下', rangeText: '1001〜2000勝', title: '伝説 (LEGEND)', badgeClass: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-stone-950 border-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.6)]', color: 'text-yellow-300' },
  { rank: 'A', conditionText: '1000勝以下', rangeText: '501〜1000勝', title: '達人 (MASTER)', badgeClass: 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.5)]', color: 'text-rose-400' },
  { rank: 'B', conditionText: '500勝以下', rangeText: '251〜500勝', title: '熟練 (EXPERT)', badgeClass: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-amber-300', color: 'text-amber-400' },
  { rank: 'C', conditionText: '250勝以下', rangeText: '101〜250勝', title: '一人前 (VETERAN)', badgeClass: 'bg-emerald-600 text-white border-emerald-300', color: 'text-emerald-400' },
  { rank: 'D', conditionText: '100勝以下', rangeText: '51〜100勝', title: '中堅 (ADEPT)', badgeClass: 'bg-sky-600 text-white border-sky-300', color: 'text-sky-400' },
  { rank: 'E', conditionText: '50勝以下', rangeText: '31〜50勝', title: '見習い (NOVICE)', badgeClass: 'bg-teal-700 text-teal-100 border-teal-400', color: 'text-teal-400' },
  { rank: 'F', conditionText: '30勝以下', rangeText: '11〜30勝', title: '初心 (CHALLENGER)', badgeClass: 'bg-stone-700 text-stone-200 border-stone-500', color: 'text-stone-300' },
  { rank: 'G', conditionText: '10勝以下', rangeText: '0〜10勝', title: '駆け出し (BEGINNER)', badgeClass: 'bg-stone-800 text-stone-400 border-stone-600', color: 'text-stone-400' },
];

export const getRankInfo = (wins: number, plays: number): RankInfo => {
  // 4000勝以上 -> SSS
  if (wins >= 4000) {
    return {
      rank: 'SSS',
      title: '神話超越 (MYTHIC)',
      conditionText: '4000勝以上',
      color: 'text-fuchsia-300',
      textColor: 'text-fuchsia-100',
      borderColor: 'border-fuchsia-400',
      glowColor: 'rgba(217, 70, 239, 0.75)',
      bgGradient: 'from-purple-950/90 via-fuchsia-950/60 to-stone-900',
      auraClass: 'border-fuchsia-400/90 shadow-[0_0_30px_rgba(217,70,239,0.7)]',
      badgeClass: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-amber-400 text-white border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.8)]',
      effectType: 'mythic'
    };
  }

  // 4000勝以下 (2001〜4000勝) -> SS
  if (wins > 2000) {
    return {
      rank: 'SS',
      title: '覇王至高 (SUPREME)',
      conditionText: '4000勝以下',
      nextThreshold: 4000,
      remainingWins: Math.max(1, 4000 - wins),
      color: 'text-amber-200',
      textColor: 'text-amber-50',
      borderColor: 'border-amber-300',
      glowColor: 'rgba(251, 191, 36, 0.7)',
      bgGradient: 'from-amber-950/90 via-yellow-900/60 to-stone-900',
      auraClass: 'border-amber-300/90 shadow-[0_0_25px_rgba(251,191,36,0.6)]',
      badgeClass: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-stone-950 border-amber-100 font-black shadow-[0_0_12px_rgba(251,191,36,0.8)]',
      effectType: 'supreme'
    };
  }

  // 2000勝以下 (1001〜2000勝) -> S
  if (wins > 1000) {
    return {
      rank: 'S',
      title: '伝説 (LEGEND)',
      conditionText: '2000勝以下',
      nextThreshold: 2000,
      remainingWins: Math.max(1, 2001 - wins),
      color: 'text-yellow-300',
      textColor: 'text-yellow-100',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(234, 179, 8, 0.65)',
      bgGradient: 'from-amber-950/80 via-yellow-900/50 to-stone-900',
      auraClass: 'border-yellow-400/80 shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      badgeClass: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-stone-950 border-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.6)]',
      effectType: 'legend'
    };
  }

  // 1000勝以下 (501〜1000勝) -> A
  if (wins > 500) {
    return {
      rank: 'A',
      title: '達人 (MASTER)',
      conditionText: '1000勝以下',
      nextThreshold: 1000,
      remainingWins: Math.max(1, 1001 - wins),
      color: 'text-rose-400',
      textColor: 'text-rose-100',
      borderColor: 'border-rose-500',
      glowColor: 'rgba(244, 63, 94, 0.55)',
      bgGradient: 'from-rose-950/80 via-red-900/40 to-stone-900',
      auraClass: 'border-rose-500/80 shadow-[0_0_18px_rgba(244,63,94,0.45)]',
      badgeClass: 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      effectType: 'flame'
    };
  }

  // 500勝以下 (251〜500勝) -> B
  if (wins > 250) {
    return {
      rank: 'B',
      title: '熟練 (EXPERT)',
      conditionText: '500勝以下',
      nextThreshold: 500,
      remainingWins: Math.max(1, 501 - wins),
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

  // 250勝以下 (101〜250勝) -> C
  if (wins > 100) {
    return {
      rank: 'C',
      title: '一人前 (VETERAN)',
      conditionText: '250勝以下',
      nextThreshold: 250,
      remainingWins: Math.max(1, 251 - wins),
      color: 'text-emerald-400',
      textColor: 'text-emerald-100',
      borderColor: 'border-emerald-500',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      bgGradient: 'from-emerald-950/60 via-teal-950/30 to-stone-900',
      auraClass: 'border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      badgeClass: 'bg-emerald-600 text-white border-emerald-300',
      effectType: 'crystal'
    };
  }

  // 100勝以下 (51〜100勝) -> D
  if (wins > 50) {
    return {
      rank: 'D',
      title: '中堅 (ADEPT)',
      conditionText: '100勝以下',
      nextThreshold: 100,
      remainingWins: Math.max(1, 101 - wins),
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

  // 50勝以下 (31〜50勝) -> E
  if (wins > 30) {
    return {
      rank: 'E',
      title: '見習い (NOVICE)',
      conditionText: '50勝以下',
      nextThreshold: 50,
      remainingWins: Math.max(1, 51 - wins),
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

  // 30勝以下 (11〜30勝) -> F
  if (wins > 10) {
    return {
      rank: 'F',
      title: '初心 (CHALLENGER)',
      conditionText: '30勝以下',
      nextThreshold: 30,
      remainingWins: Math.max(1, 31 - wins),
      color: 'text-stone-300',
      textColor: 'text-stone-200',
      borderColor: 'border-stone-600',
      glowColor: 'rgba(168, 162, 158, 0.3)',
      bgGradient: 'from-stone-850 to-stone-900',
      auraClass: 'border-stone-600/60',
      badgeClass: 'bg-stone-700 text-stone-200 border-stone-500',
      effectType: 'scanline'
    };
  }

  // 10勝以下 (0〜10勝) -> G
  return {
    rank: 'G',
    title: plays === 0 ? '未プレイ (STANDBY)' : '駆け出し (BEGINNER)',
    conditionText: '10勝以下',
    nextThreshold: 10,
    remainingWins: Math.max(1, 11 - wins),
    color: 'text-stone-400',
    textColor: 'text-stone-300',
    borderColor: 'border-stone-700',
    glowColor: 'rgba(120, 113, 108, 0.2)',
    bgGradient: 'from-stone-900 via-stone-850 to-stone-900',
    auraClass: 'border-stone-700/60',
    badgeClass: 'bg-stone-800 text-stone-400 border-stone-600',
    effectType: 'standby'
  };
};

export const MinigameDashboard: React.FC<MinigameDashboardProps> = ({ records = {} }) => {
  // 初期状態はコンパクトモード
  const [isDetailed, setIsDetailed] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showRankGuide, setShowRankGuide] = useState<boolean>(false);

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

          {/* 右側：コンパクト / 詳細モード 切り替え ＆ 階級一覧トグルボタン */}
          <div className="flex items-center gap-1.5 bg-[#1f1a16] p-1 rounded-xl border border-[#4d3e31] shadow-inner flex-wrap">
            <button
              onClick={() => setShowRankGuide(!showRankGuide)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                showRankGuide
                  ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)] border border-purple-400/50'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
              title="バトル勝利数に応じた階級一覧ガイド"
            >
              <Gi.GiRank3 className="text-xs" />
              <span>階級基準</span>
            </button>
            <div className="w-[1px] h-4 bg-[#3d332a]" />
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

        {/* 4.5 展開式：バトル勝利数・階級基準ガイド（G〜SSS） */}
        <AnimatePresence>
          {showRankGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-b border-[#3d332a] bg-[#16120f]/95 relative z-10"
            >
              <div className="p-3 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gi.GiStarsStack className="text-amber-400 text-sm" />
                    <h3 className="text-xs sm:text-sm font-bold font-mono text-amber-200">
                      ARENA RANK TIERS GUIDE // 勝利数別階級基準
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    各カテゴリーの勝利数に応じて判定
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {BATTLE_RANK_TIERS.map(tier => {
                    const isTotalActive = totalRank.rank === tier.rank;
                    return (
                      <div
                        key={tier.rank}
                        className={`p-2 rounded-lg border text-center transition-all relative ${
                          isTotalActive
                            ? 'bg-amber-950/60 border-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                            : 'bg-[#1e1814] border-[#382d24]'
                        }`}
                      >
                        {isTotalActive && (
                          <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 text-[8px] font-black px-1 rounded-full shadow-xs">
                            現在
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className={`px-1.5 py-0.2 rounded text-xs font-black font-mono border ${tier.badgeClass}`}>
                            {tier.rank}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-stone-200 font-mono">
                          {tier.conditionText}
                        </div>
                        <div className="text-[9px] text-stone-400 font-mono mt-0.5">
                          {tier.rangeText}
                        </div>
                        <div className="text-[9px] text-stone-500 truncate mt-0.5">
                          {tier.title.split(' ')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <span className="text-[8px] font-mono text-[#b09e8c] mt-0.5 whitespace-nowrap">
                      {cat.rank.rank === 'SSS' ? 'MAX' : `あと${cat.rank.remainingWins}勝`}
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
                
                {/* SSSランク・神話超越のコズミックプリズムオーラ＆スター */}
                {totalRank.effectType === 'mythic' && (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-radial from-fuchsia-500/25 via-purple-600/10 to-transparent pointer-events-none"
                      animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.97, 1.03, 0.97] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div 
                      className="absolute -top-12 -right-12 w-48 h-48 bg-fuchsia-500/25 rounded-full blur-3xl pointer-events-none"
                      animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.85, 0.4] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute top-2 left-4 text-fuchsia-300 text-xl pointer-events-none"
                      animate={{ rotate: 360, scale: [0.9, 1.3, 0.9] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Gi.GiGalaxy />
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-2 right-4 text-amber-300 text-xl pointer-events-none"
                      animate={{ rotate: -360, scale: [1.2, 0.85, 1.2] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <Gi.GiHolyGrail />
                    </motion.div>
                  </>
                )}

                {/* SSランク・覇王至高のプレステージゴールドオーラ */}
                {totalRank.effectType === 'supreme' && (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-radial from-amber-400/25 via-yellow-500/10 to-transparent pointer-events-none"
                      animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.98, 1.02, 0.98] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div 
                      className="absolute -top-10 -right-10 w-44 h-44 bg-yellow-400/25 rounded-full blur-2xl pointer-events-none"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute top-2 right-4 text-amber-200 text-xl pointer-events-none"
                      animate={{ y: [-2, 2, -2], rotate: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Gi.GiImperialCrown />
                    </motion.div>
                  </>
                )}

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
                          totalRank.rank === 'SSS'
                            ? { rotate: [0, -1.5, 1.5, 0], scale: [1, 1.05, 1] }
                            : totalRank.rank === 'SS' || totalRank.rank === 'S'
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
                      
                      {totalRank.rank === 'SSS' && (
                        <motion.div 
                          className="absolute -top-2.5 -right-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white p-1 rounded-full shadow-lg border border-fuchsia-200"
                          animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        >
                          <Gi.GiHolyGrail size={13} />
                        </motion.div>
                      )}
                      {totalRank.rank === 'SS' && (
                        <motion.div 
                          className="absolute -top-2.5 -right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-950 p-1 rounded-full shadow-lg border border-yellow-100"
                          animate={{ y: [-2, 2, -2], rotate: [0, 8, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Gi.GiCrown size={12} />
                        </motion.div>
                      )}
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
                        {totalRank.rank === 'SSS' && '神話を超越した究極のロボット工房！幾千の激闘を制覇した無敗の頂点。'}
                        {totalRank.rank === 'SS' && '全カテゴリーを制覇する覇王工房！至高の領域へ到達した証。'}
                        {totalRank.rank === 'S' && '全競技を極めし伝説のロボット工房！卓越した性能と戦術の証。'}
                        {totalRank.rank === 'A' && '多数の演習で輝かしい戦績を誇る達人工房！頂点まであと少し。'}
                        {totalRank.rank === 'B' && '各演習で安定した実力を発揮する熟練工房！'}
                        {totalRank.rank === 'C' && '基本戦術をマスターした一人前の工房。更なる高みを目指せ！'}
                        {totalRank.rank === 'D' && '演習のコツを掴み始めた中堅工房。勝利数を重ねよう！'}
                        {totalRank.rank === 'E' && '見習いから中堅へのステップ！得意な演習を見つけて腕を磨こう。'}
                        {totalRank.rank === 'F' && '演習の手応えを掴み始めた初心工房！ロボットの強化を進めよう。'}
                        {totalRank.rank === 'G' && '駆け出しの工房。10勝を目指してロボットを出撃させてみよう！'}
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
                            <div className="w-[1px] h-5 bg-[#362c24] hidden sm:block" />
                            <div className="hidden sm:flex flex-col items-end text-right min-w-[70px]">
                              <div className="text-[8px] font-mono text-stone-400">{cat.rank.title}</div>
                              <div className="text-[10px] font-mono text-amber-300 font-bold">
                                {cat.rank.rank === 'SSS' ? 'MAX' : `あと${cat.rank.remainingWins}勝`}
                              </div>
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
