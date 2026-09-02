import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Robot } from '../../core/models';
import { RobotVisual } from '../robot/RobotVisual';
import { Button } from '../ui/core';

interface RepairAnimationModalProps {
  robot: Robot | null;
  onClose: () => void;
  initialHp?: number;
}

export const RepairAnimationModal: React.FC<RepairAnimationModalProps> = ({
  robot,
  onClose,
  initialHp = 0,
}) => {
  const [phase, setPhase] = useState<'repairing' | 'completed'>('repairing');
  const maxHp = robot?.maxHp ?? 12;

  useEffect(() => {
    if (!robot) return;
    setPhase('repairing');

    // 1.1秒後に修理完了フェーズへ移行
    const timer = setTimeout(() => {
      setPhase('completed');
    }, 1100);

    return () => clearTimeout(timer);
  }, [robot]);

  if (!robot) return null;

  const handleSkipOrClose = () => {
    if (phase === 'repairing') {
      setPhase('completed');
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs cursor-pointer"
        onClick={handleSkipOrClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-stone-900 border-2 border-emerald-500/80 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center relative overflow-hidden text-stone-100 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 背景の光彩エフェクト */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {phase === 'completed' ? (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-emerald-500/30 blur-xl"
              />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -left-20 w-80 h-80 bg-radial from-amber-500/10 to-transparent blur-lg"
              />
            )}
          </div>

          {/* ヘッダータイトル */}
          <div className="relative z-10 mb-3">
            {phase === 'repairing' ? (
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm tracking-wide font-mono"
              >
                <span>🔧</span>
                <span>ロボット緊急メンテナンス中...</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-base tracking-wide"
              >
                <span>✨</span>
                <span>修理完了！ HP完全回復！</span>
                <span>✨</span>
              </motion.div>
            )}
            <h3 className="text-lg font-bold text-white mt-1 truncate">{robot.name}</h3>
          </div>

          {/* 中央ロボットビジュアル & エフェクト */}
          <div className="relative z-10 my-4 flex items-center justify-center min-h-[150px]">
            {/* 修理中パーティクル & スパーク */}
            {phase === 'repairing' && (
              <>
                <motion.div
                  animate={{
                    rotate: [0, -25, 25, -20, 20, 0],
                    x: [-3, 3, -2, 2, 0],
                    y: [0, -4, 0, -3, 0],
                  }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                  className="absolute -top-3 -left-2 text-2xl filter drop-shadow-md z-20"
                >
                  🔧
                </motion.div>
                <motion.div
                  animate={{
                    rotate: [0, 30, -30, 20, 0],
                    x: [3, -3, 2, -2, 0],
                    y: [-4, 0, -3, 0, 0],
                  }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                  className="absolute -top-2 -right-2 text-2xl filter drop-shadow-md z-20"
                >
                  🔨
                </motion.div>
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="absolute bottom-0 right-2 text-xl text-amber-300 z-20 opacity-80"
                >
                  ⚙️
                </motion.div>
                {/* スパーク閃光 */}
                <motion.div
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.3, 0.8],
                  }}
                  transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 0.15 }}
                  className="absolute inset-0 flex items-center justify-center text-yellow-300 text-3xl font-mono pointer-events-none"
                >
                  ⚡
                </motion.div>
              </>
            )}

            {/* 完了時キラキラ・ハートパーティクル */}
            {phase === 'completed' && (
              <>
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0 }}
                  animate={{ y: -45, opacity: [0, 1, 0], scale: 1.3 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute -top-2 left-6 text-2xl z-20"
                >
                  💖
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0 }}
                  animate={{ y: -50, opacity: [0, 1, 0], scale: 1.4 }}
                  transition={{ duration: 1.4, delay: 0.3, repeat: Infinity }}
                  className="absolute -top-4 right-6 text-2xl z-20"
                >
                  ✨
                </motion.div>
                <motion.div
                  initial={{ y: 15, opacity: 0, scale: 0 }}
                  animate={{ y: -40, opacity: [0, 1, 0], scale: 1.2 }}
                  transition={{ duration: 1.1, delay: 0.6, repeat: Infinity }}
                  className="absolute top-2 left-16 text-xl z-20"
                >
                  🌟
                </motion.div>
              </>
            )}

            {/* ロボット本体 */}
            <motion.div
              animate={
                phase === 'repairing'
                  ? {
                      y: [0, -3, 0, -2, 0],
                      rotate: [-1, 1, -1, 1, 0],
                    }
                  : {
                      y: [0, -12, 0, -8, 0],
                      scale: [1, 1.06, 1, 1.03, 1],
                    }
              }
              transition={
                phase === 'repairing'
                  ? { duration: 0.3, repeat: Infinity }
                  : { duration: 0.8, repeat: Infinity, repeatDelay: 0.2 }
              }
              className="p-2 rounded-xl bg-stone-950/60 border border-stone-800"
            >
              <RobotVisual
                robot={robot}
                size={88}
                emotion={phase === 'completed' ? 'happy' : 'troubled'}
              />
            </motion.div>
          </div>

          {/* HPゲージと回復数値 */}
          <div className="relative z-10 bg-stone-950/90 p-3 rounded-xl border border-stone-800 space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-stone-300 flex items-center gap-1">
                <span>❤️ 耐久力 (HP)</span>
              </span>
              {phase === 'repairing' ? (
                <span className="text-rose-400 animate-pulse">
                  {initialHp} / {maxHp}
                </span>
              ) : (
                <motion.span
                  initial={{ scale: 0.8, color: '#f87171' }}
                  animate={{ scale: [1, 1.2, 1], color: '#34d399' }}
                  className="text-emerald-400 font-black text-sm"
                >
                  {maxHp} / {maxHp} (MAX!)
                </motion.span>
              )}
            </div>

            <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden border border-stone-700 relative">
              <motion.div
                initial={{ width: `${Math.max(0, Math.min(100, (initialHp / maxHp) * 100))}%` }}
                animate={{
                  width: phase === 'completed' ? '100%' : `${Math.max(0, Math.min(100, (initialHp / maxHp) * 100))}%`,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full transition-colors ${
                  phase === 'completed'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                    : 'bg-rose-500'
                }`}
              />
            </div>

            <div className="text-[11px] text-stone-400 font-mono">
              {phase === 'repairing' ? (
                <span>パーツの接合部を再調整・オイル注入中...</span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  ✨ 全身の装甲と稼働フレームが完全修復されました！
                </span>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="relative z-10 flex gap-2">
            <Button
              variant={phase === 'completed' ? 'success' : 'secondary'}
              className="w-full font-bold text-sm py-2 shadow-md cursor-pointer"
              onClick={handleSkipOrClose}
            >
              {phase === 'completed' ? '完了して閉じる' : 'スキップ'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
