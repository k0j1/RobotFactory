import React from 'react';
import { motion } from 'motion/react';
import * as Gi from 'react-icons/gi';

interface RecordData {
  plays: number;
  wins: number;
  losses: number;
  draws: number;
}

interface MinigameDashboardProps {
  records: Record<string, RecordData> | undefined;
}

const GAME_NAMES: Record<string, { name: string; icon: React.ReactNode }> = {
  combat: { name: 'バトル演習', icon: <Gi.GiSwordsPower /> },
  othello: { name: 'リバーシ', icon: <Gi.GiInvertedDice3 /> },
  chess: { name: 'チェス', icon: <Gi.GiChessRook /> },
  danmaku: { name: '弾幕サバイバル', icon: <Gi.GiMissileSwarm /> },
  piano: { name: 'ピアノ演奏', icon: <Gi.GiMusicalKeyboard /> },
  defense: { name: '拠点防衛戦', icon: <Gi.GiShieldReflect /> },
};

const getRank = (wins: number, plays: number) => {
  if (plays === 0) return { rank: 'G', color: 'text-stone-400', desc: '未プレイ' };
  const winRate = wins / plays;
  if (wins >= 50 && winRate >= 0.8) return { rank: 'S', color: 'text-yellow-400', desc: '伝説' };
  if (wins >= 30 && winRate >= 0.7) return { rank: 'A', color: 'text-rose-500', desc: '達人' };
  if (wins >= 15 && winRate >= 0.6) return { rank: 'B', color: 'text-orange-500', desc: '熟練' };
  if (wins >= 10 && winRate >= 0.5) return { rank: 'C', color: 'text-emerald-500', desc: '一人前' };
  if (wins >= 5 && winRate >= 0.3) return { rank: 'D', color: 'text-blue-500', desc: '中堅' };
  if (wins >= 1) return { rank: 'E', color: 'text-teal-500', desc: '見習い' };
  return { rank: 'F', color: 'text-stone-500', desc: '初心者' };
};

export const MinigameDashboard: React.FC<MinigameDashboardProps> = ({ records = {} }) => {
  const gamesList = Object.keys(GAME_NAMES);
  
  const totalRecord: RecordData = { plays: 0, wins: 0, losses: 0, draws: 0 };
  gamesList.forEach(key => {
    const r = records[key];
    if (r) {
      totalRecord.plays += r.plays;
      totalRecord.wins += r.wins;
      totalRecord.losses += r.losses;
      totalRecord.draws += r.draws;
    }
  });

  const totalRank = getRank(totalRecord.wins, totalRecord.plays);

  return (
    <div className="w-full bg-stone-900 border-b-4 border-stone-950 p-4 rounded-b-xl shadow-lg mb-6 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Gi.GiTrophyCup className="text-9xl text-white" />
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Gi.GiGamepad className="text-2xl text-amber-400" />
        <h2 className="text-xl font-black text-stone-100 tracking-wider">GAME DASHBOARD</h2>
      </div>

      {/* 総合評価 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
        <div className="bg-stone-800 rounded-lg p-4 flex-1 border-2 border-stone-700 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/50">
              <Gi.GiTrophyCup className="text-3xl text-amber-400" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-bold tracking-widest">TOTAL RECORD</div>
              <div className="text-xl font-black text-white">総合戦績</div>
            </div>
          </div>
          <div className="flex gap-6 items-end">
            <div className="text-right">
              <div className="text-[10px] text-stone-400 mb-1">PLAYS</div>
              <div className="text-2xl font-mono font-bold text-stone-200">{totalRecord.plays}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 mb-1">WINS</div>
              <div className="text-2xl font-mono font-bold text-amber-400">{totalRecord.wins}</div>
            </div>
            <div className="text-center ml-2 border-l border-stone-700 pl-6">
              <div className="text-[10px] text-stone-400 mb-1">RANK</div>
              <div className="flex flex-col items-center leading-none">
                <div className={`text-4xl font-black ${totalRank.color} drop-shadow-md`}>{totalRank.rank}</div>
                <div className={`text-xs font-bold ${totalRank.color} opacity-80 mt-1`}>{totalRank.desc}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 各ゲームの成績リスト */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        {gamesList.map((gameKey) => {
          const r = records[gameKey] || { plays: 0, wins: 0, losses: 0, draws: 0 };
          const rankInfo = getRank(r.wins, r.plays);
          const meta = GAME_NAMES[gameKey];

          return (
            <motion.div
              key={gameKey}
              className="bg-stone-800 rounded-lg p-3 border border-stone-700 hover:border-amber-500/50 hover:bg-stone-750 transition-colors flex flex-col"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-700/50">
                <div className="text-amber-400 text-lg">{meta.icon}</div>
                <div className="text-xs font-bold text-stone-200 truncate">{meta.name}</div>
              </div>
              
              <div className="flex justify-between items-end mt-auto">
                <div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Gi.GiPlayButton className="text-[8px]" /> {r.plays} Plays
                  </div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Gi.GiCheckMark className="text-[8px] text-amber-500" /> {r.wins} Wins
                  </div>
                </div>
                <div className="flex flex-col items-center leading-none">
                  <span className={`text-2xl font-black ${rankInfo.color}`}>{rankInfo.rank}</span>
                  <span className={`text-[8px] font-bold ${rankInfo.color} opacity-80 mt-0.5`}>{rankInfo.desc}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
