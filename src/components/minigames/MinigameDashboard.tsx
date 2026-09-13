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
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
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
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
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
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
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
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
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
      color: 'text-purple-700',
      textColor: 'text-purple-950',
      borderColor: 'border-fuchsia-300',
      glowColor: 'rgba(217, 70, 239, 0.4)',
      bgGradient: 'from-fuchsia-100 via-purple-50 to-amber-50',
      auraClass: 'border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]',
      badgeClass: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-amber-500 text-white border-fuchsia-300 shadow-xs',
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
      color: 'text-amber-800',
      textColor: 'text-amber-950',
      borderColor: 'border-amber-300',
      glowColor: 'rgba(251, 191, 36, 0.4)',
      bgGradient: 'from-amber-100 via-yellow-50 to-orange-50',
      auraClass: 'border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
      badgeClass: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-stone-950 border-amber-200 font-black shadow-xs',
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
      color: 'text-amber-700',
      textColor: 'text-amber-950',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(234, 179, 8, 0.4)',
      bgGradient: 'from-yellow-100 via-amber-50 to-orange-50',
      auraClass: 'border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]',
      badgeClass: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-950 border-yellow-300 shadow-xs',
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
      color: 'text-rose-700',
      textColor: 'text-rose-950',
      borderColor: 'border-rose-300',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      bgGradient: 'from-rose-100 via-orange-50 to-stone-50',
      auraClass: 'border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
      badgeClass: 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-rose-200 shadow-xs',
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
      color: 'text-amber-700',
      textColor: 'text-amber-950',
      borderColor: 'border-amber-300',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      bgGradient: 'from-amber-100 via-orange-50 to-stone-50',
      auraClass: 'border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]',
      badgeClass: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-amber-200',
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
      color: 'text-emerald-700',
      textColor: 'text-emerald-950',
      borderColor: 'border-emerald-300',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      bgGradient: 'from-emerald-100 via-teal-50 to-stone-50',
      auraClass: 'border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
      badgeClass: 'bg-emerald-600 text-white border-emerald-200',
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
      color: 'text-sky-700',
      textColor: 'text-sky-950',
      borderColor: 'border-sky-300',
      glowColor: 'rgba(14, 165, 233, 0.35)',
      bgGradient: 'from-sky-100 via-blue-50 to-stone-50',
      auraClass: 'border-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.25)]',
      badgeClass: 'bg-sky-600 text-white border-sky-200',
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
      color: 'text-teal-700',
      textColor: 'text-teal-950',
      borderColor: 'border-teal-300',
      glowColor: 'rgba(20, 184, 166, 0.3)',
      bgGradient: 'from-teal-100 via-stone-50 to-stone-100',
      auraClass: 'border-teal-300',
      badgeClass: 'bg-teal-700 text-white border-teal-300',
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
      color: 'text-stone-700',
      textColor: 'text-stone-900',
      borderColor: 'border-stone-300',
      glowColor: 'rgba(168, 162, 158, 0.2)',
      bgGradient: 'from-stone-100 via-stone-50 to-amber-50/50',
      auraClass: 'border-stone-300',
      badgeClass: 'bg-stone-600 text-white border-stone-400',
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
    color: 'text-stone-600',
    textColor: 'text-stone-800',
    borderColor: 'border-[#dfcfbd]',
    glowColor: 'rgba(120, 113, 108, 0.15)',
    bgGradient: 'from-[#fdf8f0] via-[#f7efe5] to-[#f4ebe0]',
    auraClass: 'border-[#dfcfbd]',
    badgeClass: 'bg-stone-500 text-white border-stone-400',
    effectType: 'standby'
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
    /* 工房風デザイン：温かみある木製掲示板・真鍮プレートの明るい演習ログボード */
    <div className="w-full bg-[#fcf8f2] border-2 border-[#d6c4b2] rounded-2xl p-3 sm:p-4 mb-6 select-none shadow-sm relative overflow-hidden text-stone-800">
      
      {/* 四隅の真鍮リベット金具 */}
      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#7a5530] rotate-45" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#7a5530] -rotate-12" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#7a5530] rotate-12" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#7a5530] rotate-75" />
      </div>

      {/* 上部真鍮プレート銘板 ＆ 演習所稼働ランプ ＆ モード切り替えトグル */}
      <div className="flex items-center justify-between px-3 pb-2 pt-0.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded bg-gradient-to-r from-[#eedcc8] to-[#e4ceb6] border border-[#c5a786] text-[#5e3814] font-bold text-[10px] sm:text-xs tracking-wider shadow-2xs flex items-center gap-1.5">
            <span className="text-amber-700 font-black">⚙</span>
            <span>工房演習録</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-mono text-emerald-800 font-bold tracking-tighter">ONLINE</span>
          </div>
        </div>

        {/* 右側：コンパクト / 詳細モード 切り替え */}
        <div className="flex items-center gap-1.5 bg-[#ece1d3] p-1 rounded-xl border border-[#c5a786] shadow-inner flex-wrap">
          <button
            onClick={() => setIsDetailed(false)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              !isDetailed
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Gi.GiBriefcase className="text-xs" />
            <span>コンパクト</span>
          </button>
          <button
            onClick={() => setIsDetailed(true)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              isDetailed
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Gi.GiMagnifyingGlass className="text-xs" />
            <span>詳細モード</span>
          </button>
        </div>
      </div>

      {/* 工房掲示板・メインボード */}
      <div className="bg-[#faf5ee] border border-[#dfcfbd] rounded-xl overflow-hidden shadow-2xs">

        {/* ＝＝＝＝＝ 1. コンパクトモード表示 ＝＝＝＝＝ */}
        {!isDetailed && (
          <div className="p-2.5 sm:p-3 relative z-10 space-y-2.5">
            {/* 総合サマリーバー */}
            <div className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all bg-gradient-to-r ${totalRank.bgGradient} ${totalRank.borderColor} flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xs relative overflow-hidden`}>
              
              {/* 左側：総合ランク ＆ 称号 */}
              <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-xs ${totalRank.auraClass} bg-white shrink-0`}>
                  <div className={`text-2xl font-black ${totalRank.color} leading-none`}>
                    {totalRank.rank}
                  </div>
                  <div className="text-[7px] font-mono font-bold text-stone-500">RANK</div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold font-mono border ${totalRank.badgeClass}`}>
                      {totalRank.title}
                    </span>
                    
                  </div>
                  
                </div>
              </div>

              {/* 右側：総遊んだ数 ＆ 総勝利数 */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end relative z-10">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#dfcfbd] text-center min-w-[75px] shadow-2xs">
                  <div className="text-[9px] font-mono text-stone-500 flex items-center justify-center gap-0.5">
                    <Gi.GiGamepad className="text-[10px] text-stone-600" /> 遊んだ数
                  </div>
                  <div className="text-sm font-bold font-mono text-stone-800">
                    {totalRecord.plays} <span className="text-[9px] font-sans text-stone-500">回</span>
                  </div>
                </div>

                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#dfcfbd] text-center min-w-[75px] shadow-2xs">
                  <div className="text-[9px] font-mono text-amber-700 flex items-center justify-center gap-0.5 font-bold">
                    <Gi.GiTrophyCup className="text-[10px] text-amber-600" /> 勝利数
                  </div>
                  <div className="text-sm font-bold font-mono text-amber-700">
                    {totalRecord.wins} <span className="text-[9px] font-sans text-amber-800">勝</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4大カテゴリ一覧（明るい工房カードグリッド） */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {categoryStats.map(cat => (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl p-2.5 border border-[#dfcfbd] hover:border-amber-400 flex items-center justify-between gap-2 shadow-2xs transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-sm shrink-0 shadow-xs border border-white/20`}>
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-800 truncate">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {cat.stats.plays}回 / <span className="text-amber-700 font-bold">{cat.stats.wins}勝</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <span className={`text-xs font-black font-mono px-1.5 py-0.2 rounded border ${cat.rank.badgeClass}`}>
                      {cat.rank.rank}
                    </span>
                    <span className="text-[8px] font-mono text-stone-500 mt-0.5 whitespace-nowrap">
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
            {/* メイン：総合ランキングカード */}
            <div className="p-3 sm:p-4 relative z-10">
              <div className={`relative rounded-2xl p-3.5 sm:p-4 border-2 transition-all overflow-hidden ${totalRank.borderColor} bg-gradient-to-br ${totalRank.bgGradient} shadow-xs`}>
                
                {/* ランク装飾アイコン */}
                {totalRank.effectType === 'mythic' && (
                  <motion.div 
                    className="absolute top-2 right-4 text-fuchsia-400 text-xl pointer-events-none opacity-60"
                    animate={{ rotate: 360, scale: [0.9, 1.2, 0.9] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Gi.GiGalaxy />
                  </motion.div>
                )}

                {totalRank.effectType === 'supreme' && (
                  <motion.div 
                    className="absolute top-2 right-4 text-amber-500 text-xl pointer-events-none opacity-60"
                    animate={{ y: [-2, 2, -2], rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Gi.GiImperialCrown />
                  </motion.div>
                )}

                {totalRank.effectType === 'legend' && (
                  <motion.div 
                    className="absolute top-3 right-4 text-amber-500 text-lg pointer-events-none opacity-60"
                    animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Gi.GiSparkles />
                  </motion.div>
                )}

                {totalRank.effectType === 'flame' && (
                  <motion.div 
                    className="absolute top-2 right-4 text-rose-500 text-xl pointer-events-none opacity-60"
                    animate={{ y: [0, -3, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <Gi.GiFireBowl />
                  </motion.div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                  {/* 左側：総合称号＆アリーナ階級 */}
                  <div className="flex items-center gap-4">
                    {/* ランク特大バッジ */}
                    <div className="relative shrink-0">
                      <motion.div 
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-sm ${totalRank.auraClass} bg-white`}
                        animate={
                          totalRank.rank === 'SSS'
                            ? { rotate: [0, -1, 1, 0], scale: [1, 1.03, 1] }
                            : totalRank.rank === 'SS' || totalRank.rank === 'S'
                            ? { rotate: [0, -0.5, 0.5, 0] } 
                            : {}
                        }
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="text-[9px] font-mono tracking-widest text-stone-500 font-bold">RANK</div>
                        <div className={`text-3xl sm:text-4xl font-black ${totalRank.color} leading-none my-0.5`}>
                          {totalRank.rank}
                        </div>
                        <div className="text-[8px] font-mono font-bold text-stone-500">CLASS</div>
                      </motion.div>
                      
                      {totalRank.rank === 'SSS' && (
                        <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white p-1 rounded-full shadow-sm border border-fuchsia-200">
                          <Gi.GiHolyGrail size={13} />
                        </div>
                      )}
                      {(totalRank.rank === 'SS' || totalRank.rank === 'S') && (
                        <div className="absolute -top-2.5 -right-2 bg-amber-500 text-white p-1 rounded-full shadow-sm border border-amber-200">
                          <Gi.GiCrown size={12} />
                        </div>
                      )}
                      {totalRank.rank === 'A' && (
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-sm border border-rose-200">
                          <Gi.GiMedal size={11} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono border shadow-2xs ${totalRank.badgeClass}`}>
                          {totalRank.title}
                        </span>
                        
                      </div>
                      
                      <p className="text-xs text-stone-600 mt-0.5 max-w-md">
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
                  <div className="grid grid-cols-2 gap-2.5 bg-white/90 p-2.5 rounded-xl border border-[#dfcfbd] min-w-[210px] shadow-2xs">
                    <div className="text-center p-2 rounded-lg bg-[#faf5ee] border border-[#e5d5c3]">
                      <div className="text-[10px] font-mono text-stone-500 font-bold flex items-center justify-center gap-1">
                        <Gi.GiGamepad className="text-stone-500" /> PLAYS
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-stone-800 mt-0.5">
                        {totalRecord.plays}
                      </div>
                      <div className="text-[9px] text-stone-500 font-sans">総演習回数</div>
                    </div>

                    <div className="text-center p-2 rounded-lg bg-[#faf5ee] border border-[#e5d5c3]">
                      <div className="text-[10px] font-mono text-amber-700 font-bold flex items-center justify-center gap-1">
                        <Gi.GiTrophyCup className="text-amber-600" /> WINS
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-amber-700 mt-0.5">
                        {totalRecord.wins}
                      </div>
                      <div className="text-[9px] text-amber-800 font-sans font-bold">総勝利数</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* カテゴリ別成績サマリー＆個別ゲーム成績セクション */}
            <div className="px-3 pb-4 sm:px-4 relative z-10 space-y-3.5">
              
              {/* カテゴリ切り替えフィルタータブ */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#dfcfbd] pb-2.5">
                <div className="flex items-center gap-2">
                  <Gi.GiRadarSweep className="text-amber-700 text-lg" />
                  <h4 className="text-sm font-black text-amber-950 tracking-wider font-mono">
                    CATEGORY BREAKDOWN &amp; RECORDS
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-[#ece1d3] p-1 rounded-xl border border-[#cfbead]">
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeCategoryFilter === 'all'
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    すべて ({categoryStats.reduce((acc, c) => acc + c.games.length, 0)}種目)
                  </button>
                  {CATEGORY_GROUPS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                        activeCategoryFilter === cat.id
                          ? 'bg-amber-700 text-white shadow-2xs'
                          : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
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
                        className="bg-[#fdfaf5] border-2 border-[#dfcfbd] rounded-xl p-3.5 shadow-2xs relative overflow-hidden"
                      >
                        {/* カテゴリヘッダー（遊んだ数・勝利数・ランク） */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[#e8dacb]">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-base shadow-xs border border-white/20`}>
                              {cat.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-amber-950 flex items-center gap-1.5 font-mono">
                                  {cat.name}
                                </h5>
                                <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${cat.badgeBg}`}>
                                  {cat.games.length}種目
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-600 mt-0.5">
                                {cat.desc}
                              </p>
                            </div>
                          </div>

                          {/* カテゴリ総合集計バッジ（遊んだ数・勝利数・ランク） */}
                          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#dfcfbd] self-start sm:self-auto shadow-2xs">
                            <div className="text-right">
                              <div className="text-[9px] font-mono text-stone-500">遊んだ数</div>
                              <div className="text-sm font-bold font-mono text-stone-800">
                                {cat.stats.plays} <span className="text-[10px] font-sans text-stone-500">回</span>
                              </div>
                            </div>
                            <div className="w-[1px] h-5 bg-[#e8dacb]" />
                            <div className="text-right">
                              <div className="text-[9px] font-mono text-amber-700 font-bold">勝利数</div>
                              <div className="text-sm font-bold font-mono text-amber-700">
                                {cat.stats.wins} <span className="text-[10px] font-sans text-amber-800">勝</span>
                              </div>
                            </div>
                            <div className="w-[1px] h-5 bg-[#e8dacb]" />
                            <div className="flex flex-col items-center">
                              <div className="text-[8px] font-mono text-stone-500">RANK</div>
                              <span className={`text-base font-black font-mono ${cat.rank.color} leading-none`}>
                                {cat.rank.rank}
                              </span>
                            </div>
                            <div className="w-[1px] h-5 bg-[#e8dacb] hidden sm:block" />
                            <div className="hidden sm:flex flex-col items-end text-right min-w-[70px]">
                              <div className="text-[8px] font-mono text-stone-500 font-bold">{cat.rank.title}</div>
                              <div className="text-[10px] font-mono text-amber-700 font-bold">
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
                                className="bg-white rounded-xl p-3 border border-[#dfcfbd] hover:border-amber-400 transition-all flex flex-col justify-between relative overflow-hidden group shadow-2xs"
                                whileHover={{ y: -2 }}
                              >
                                <div className={`absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-15 ${gameRank.color}`}>
                                  <Gi.GiRibbonMedal className="text-2xl absolute top-1 right-1" />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-[#f0e4d5]">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base text-amber-600">{game.icon}</span>
                                      <span className="font-bold text-stone-800 text-xs sm:text-sm">{game.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${gameRank.badgeClass}`}>
                                      Rank {gameRank.rank}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-stone-500 line-clamp-1 mb-2">
                                    {game.desc}
                                  </p>
                                </div>

                                {/* 成績ステータス（遊んだ数・勝利数のみ） */}
                                <div className="bg-[#f8f2e9] rounded-lg p-1.5 border border-[#e5d6c5]">
                                  <div className="grid grid-cols-2 gap-1 text-center font-mono">
                                    <div>
                                      <div className="text-[9px] text-stone-500">遊んだ数</div>
                                      <div className="text-xs font-bold text-stone-700">{r.plays}回</div>
                                    </div>
                                    <div>
                                      <div className="text-[9px] text-amber-700 font-bold">勝利数</div>
                                      <div className="text-xs font-bold text-amber-700">{r.wins}勝</div>
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
