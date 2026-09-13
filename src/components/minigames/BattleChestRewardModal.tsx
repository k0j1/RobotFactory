import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Gi from 'react-icons/gi';
import { theme } from '../../styles/theme';
import { BattleChestDropResult, BattleRewardItem } from './BattleChestRewardService';
import { AttributeColors, AttributeNames } from '../../core/models';

interface BattleChestRewardModalProps {
  dropResult: BattleChestDropResult;
  isOpen?: boolean;
  onClaim: () => void;
  defenseRegenHours?: number;
}

/**
 * Web Audio による宝箱専用SEジェネレーター
 */
class ChestAudioPlayer {
  private static getAudioContext(): AudioContext | null {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if ((window as any).globalAudioCtx) {
        return (window as any).globalAudioCtx;
      }
      const ctx = new AudioCtx();
      (window as any).globalAudioCtx = ctx;
      return ctx;
    } catch {
      return null;
    }
  }

  // 宝箱が揺れる時のガタガタ音
  public static playRattle(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // カギが開く音
  public static playUnlock(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    // 高音の金属クリック
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1800, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // 0.05s後に重いロック解除
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(450, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.12);
    gain2.gain.setValueAtTime(0.35, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.12);
  }

  // 宝箱がオープンしたときの解放音＆ファンファーレ
  public static playChestOpen(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    // 重厚な光の爆発音
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    // キラキラコード (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const noteOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const noteTime = now + 0.1 + idx * 0.07;
      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(freq, noteTime);
      noteGain.gain.setValueAtTime(0.2, noteTime);
      noteGain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3);

      noteOsc.connect(noteGain);
      noteGain.connect(ctx.destination);
      noteOsc.start(noteTime);
      noteOsc.stop(noteTime + 0.3);
    });
  }

  // アイテム出現時のピロリン音
  public static playItemPop(idx: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const baseFreq = 587.33; // D5
    const freq = baseFreq * Math.pow(1.08, idx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

export const BattleChestRewardModal: React.FC<BattleChestRewardModalProps> = ({
  dropResult,
  isOpen = true,
  onClaim,
  defenseRegenHours,
}) => {
  const [chestState, setChestState] = useState<'closed' | 'opening' | 'opened'>('closed');
  const [visibleItemsCount, setVisibleItemsCount] = useState<number>(0);
  const items = dropResult.items;

  // モーダル表示時に状態を初期化
  useEffect(() => {
    if (isOpen) {
      setChestState('closed');
      setVisibleItemsCount(0);
    }
  }, [isOpen, dropResult]);

  // 宝箱クリック時の開封処理
  
  const handleOpenChest = () => {
    ChestAudioPlayer.playItemPop(0);
    onClaim();
  };


  // 即時すぐに回収で全アイテムを表示
  const handleInstantOpen = () => {
    if (chestState === 'closed') {
      ChestAudioPlayer.playUnlock();
      ChestAudioPlayer.playChestOpen();
    }
    setChestState('opened');
    setVisibleItemsCount(items.length);
  };

  // 宝箱のティアごとのスタイル定義
  const getTierStyles = () => {
    switch (dropResult.chestTier) {
      case 'mythic':
        return {
          glow: 'from-fuchsia-500/40 via-purple-500/25 to-amber-400/30',
          chestBorder: 'border-fuchsia-400',
          chestBg: 'from-[#3b1233] via-[#210927] to-[#120718]',
          accentText: 'text-fuchsia-300',
          badge: 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white border-fuchsia-300',
          iconColor: 'text-fuchsia-400',
        };
      case 'gold':
        return {
          glow: 'from-amber-400/40 via-yellow-500/25 to-amber-600/20',
          chestBorder: 'border-amber-400',
          chestBg: 'from-[#33220f] via-[#241709] to-[#140e06]',
          accentText: 'text-amber-300',
          badge: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black border-yellow-200',
          iconColor: 'text-amber-400',
        };
      case 'silver':
        return {
          glow: 'from-sky-400/30 via-slate-300/20 to-blue-500/20',
          chestBorder: 'border-sky-300',
          chestBg: 'from-[#172535] via-[#101b27] to-[#0a111a]',
          accentText: 'text-sky-300',
          badge: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-200',
          iconColor: 'text-sky-300',
        };
      case 'bronze':
      default:
        return {
          glow: 'from-amber-700/30 via-orange-800/20 to-stone-800/30',
          chestBorder: 'border-amber-700',
          chestBg: 'from-[#2b1911] via-[#1e120c] to-[#130b08]',
          accentText: 'text-amber-400',
          badge: 'bg-amber-800 text-amber-100 border-amber-600',
          iconColor: 'text-amber-600',
        };
    }
  };

  if (!isOpen) return null;

  const tierStyle = getTierStyles();
  const allItemsShown = visibleItemsCount >= items.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg my-auto relative">
        <div className={`relative rounded-2xl border-2 ${tierStyle.chestBorder} bg-gradient-to-b ${tierStyle.chestBg} p-4 sm:p-6 shadow-2xl overflow-hidden text-center max-h-[92vh] flex flex-col`}>
          
          {/* 背景の光彩オーラエフェクト */}
          <div className={`absolute inset-0 bg-radial ${tierStyle.glow} opacity-60 pointer-events-none`} />

          {/* 開封時の光線エフェクト */}
          {chestState === 'opened' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
              animate={{ opacity: [0.6, 0.9, 0.5], scale: [1, 1.15, 1], rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_30deg,rgba(251,191,36,0.18)_45deg,transparent_60deg_120deg,rgba(244,114,182,0.18)_135deg,transparent_150deg_240deg,rgba(56,189,248,0.18)_255deg,transparent_270deg)] pointer-events-none"
            />
          )}

          {/* ヘッダー情報 */}
          <div className="relative z-10 mb-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black border shadow-xs ${tierStyle.badge}`}>
                {dropResult.chestTier.toUpperCase()} CHEST
              </span>
              <span className="text-xs text-stone-300 font-mono font-bold truncate max-w-[200px] sm:max-w-xs">
                {dropResult.stageName} 勝利報酬
              </span>
            </div>

            {chestState !== 'opened' ? (
              <button
                onClick={handleInstantOpen}
                className="text-xs font-mono font-bold text-amber-300 hover:text-amber-100 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md border border-white/20 cursor-pointer"
              >
                すぐに回収 ▶
              </button>
            ) : null}
          </div>

          {/* ＝＝＝＝＝ 宝箱ビジュアル本体 ＝＝＝＝＝ */}
          <div className="relative z-10 py-1 sm:py-2 flex flex-col items-center justify-center overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {chestState === 'closed' && (
              <motion.div
                key="closed-chest"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.04, 1], 
                  y: [-3, 3, -3],
                  rotate: [-0.5, 0.5, -0.5],
                  opacity: 1,
                  transition: { 
                    opacity: { duration: 0.3 },
                    scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }
                }}
                exit={{ 
                  scale: 1.1, 
                  opacity: 0,
                  transition: { duration: 0.2 }
                }}
                onClick={handleOpenChest}
                className="cursor-pointer group flex flex-col items-center"
              >
                {/* 宝箱アイコン */}
                <div className="relative">
                  {/* クリック誘引サークルパルス */}
                  <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/40 transition-all duration-300" />

                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#402a1d] to-[#1c120c] border-2 border-amber-400/70 shadow-2xl flex flex-col items-center justify-center group-hover:scale-105 group-hover:border-amber-300 transition-all">
                    <Gi.GiLockedChest className={`text-6xl sm:text-7xl ${tierStyle.iconColor} drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]`} />
                    <div className="absolute bottom-2 flex items-center gap-1 text-[10px] font-bold text-amber-200 bg-black/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                      <Gi.GiSparkles className="text-amber-400 animate-spin" />
                      <span>TAP TO COLLECT</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-amber-200 tracking-wide drop-shadow-sm">
                    {dropResult.chestTitle}
                  </h3>
                  <p className="text-xs text-stone-300 font-bold flex items-center justify-center gap-1">
                    <span>宝箱をタップして倉庫へ回収する</span>
                  </p>
                </div>
              </motion.div>
            )}

            {chestState === 'opening' && (
              <motion.div
                key="opening-chest"
                animate={{
                  x: [-6, 6, -5, 5, -3, 3, 0],
                  y: [-2, 2, -1, 1, 0],
                  rotate: [-2, 2, -1.5, 1.5, 0],
                  scale: [1, 1.08, 1.05, 1.1]
                }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-amber-600 to-[#2b170c] border-2 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.6)] flex items-center justify-center">
                  <Gi.GiLockedChest className="text-6xl sm:text-7xl text-yellow-200 animate-pulse" />
                </div>
                <div className="mt-3 text-sm font-bold text-amber-200 animate-pulse">
                  鍵が外れている...！
                </div>
              </motion.div>
            )}

            {chestState === 'opened' && (
              <motion.div
                key="opened-chest"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full flex flex-col items-center"
              >
                {/* 開いた宝箱のミニヘッダーアイコン */}
                <motion.div 
                  className="relative flex items-center gap-2 mb-3 px-3 py-1 bg-black/40 rounded-full border border-amber-500/40"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gi.GiOpenTreasureChest className={`text-2xl ${tierStyle.iconColor}`} />
                  <span className="text-xs font-bold text-amber-200 font-mono">
                    CHEST UNLOCKED // 宝箱開封！
                  </span>
                  <Gi.GiSparkles className="text-amber-300 text-sm animate-pulse" />
                </motion.div>

                {/* ＝＝＝＝＝ 獲得アイテム一覧グリッド ＝＝＝＝＝ */}
                <div className="w-full space-y-2 mb-2">
                  <div className="text-[11px] font-mono text-stone-300 flex items-center justify-between px-1">
                    <span>REWARD ITEMS ({visibleItemsCount}/{items.length})</span>
                    <span className="text-amber-300 font-bold">自動で工房インベントリへ格納</span>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-400 text-xs">
                      宝箱は空でした
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((item, idx) => {
                        const isVisible = idx < visibleItemsCount;
                        if (!isVisible) return null;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ scale: 0.5, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-left shadow-md transition-all ${
                              item.type === 'material'
                                ? item.rarity === 3
                                  ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                                  : item.rarity === 2
                                  ? 'bg-sky-950/80 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                                  : 'bg-stone-900/90 border-stone-600'
                                : item.type === 'repairKit'
                                ? 'bg-amber-950/80 border-amber-500/80'
                                : item.type === 'gold'
                                ? 'bg-yellow-950/80 border-yellow-500/80'
                                : item.type === 'element'
                                ? 'bg-blue-950/80 border-blue-400'
                                : 'bg-purple-950/80 border-purple-400'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* アイテムアイコン */}
                              <div className="w-10 h-10 rounded-lg bg-black/50 border border-stone-700 flex items-center justify-center shrink-0">
                                {item.type === 'repairKit' && (
                                  <Gi.GiSpanner className="text-xl text-amber-400" />
                                )}
                                {item.type === 'gold' && (
                                  <Gi.GiGoldBar className="text-xl text-yellow-300" />
                                )}
                                {item.type === 'element' && (
                                  <Gi.GiCrystalBars className="text-xl text-blue-400 animate-pulse" />
                                )}
                                {item.type === 'fame' && (
                                  <Gi.GiTrophyCup className="text-xl text-amber-400" />
                                )}
                                {item.type === 'material' && item.material && (
                                  <span 
                                    className="text-base font-bold"
                                    style={{ color: AttributeColors[item.material.attribute] }}
                                  >
                                    ●
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {item.rarity && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                      item.rarity === 3
                                        ? 'bg-amber-400 text-stone-950'
                                        : item.rarity === 2
                                        ? 'bg-sky-400 text-stone-950'
                                        : 'bg-stone-600 text-stone-200'
                                    }`}>
                                      {'★'.repeat(item.rarity)}
                                    </span>
                                  )}
                                  {item.material && (
                                    <span 
                                      className="text-[10px] font-bold px-1 rounded"
                                      style={{ 
                                        backgroundColor: `${AttributeColors[item.material.attribute]}25`,
                                        color: AttributeColors[item.material.attribute]
                                      }}
                                    >
                                      {AttributeNames[item.material.attribute]}
                                    </span>
                                  )}
                                  <span className="text-xs font-bold text-stone-100 truncate">
                                    {item.name}
                                  </span>
                                </div>
                                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                                  {item.desc}
                                </div>
                              </div>
                            </div>

                            <div className="ml-2 text-right shrink-0">
                              <span className="text-sm font-black font-mono text-amber-300">
                                +{item.count}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 拠点防衛リジェネボーナス表示 */}
                {defenseRegenHours && (
                  <div className="w-full my-2 flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/60 py-2 px-3 rounded-xl shadow-xs">
                    <Gi.GiHealing className="text-emerald-400 animate-pulse text-base shrink-0" />
                    <span>拠点防衛ボーナス: 出撃機体全員に【{defenseRegenHours}時間】の防衛リジェネ（1時間毎にHP1自動回復）付与！</span>
                  </div>
                )}

                {/* 完了ボタン */}
                {allItemsShown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mt-3 flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0"
                  >
                    <button
                      onClick={onClaim}
                      className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-sm rounded-xl shadow-lg border border-amber-300 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Gi.GiCheckMark className="text-base" />
                      <span>報酬を受け取って完了</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  </div>
);
};
