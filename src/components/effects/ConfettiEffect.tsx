import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Gi from 'react-icons/gi';

export interface ConfettiParticle {
  id: string;
  x: number;          // 初期水平位置 (%)
  targetX: number;    // 着地水平位置 (%)
  targetY: number;    // 落下先垂直位置 (vh / px)
  color: string;      // パーティクル背景色
  shadowColor: string;// ドロップシャドウ色
  size: number;       // サイズ (px)
  shape: 'rect' | 'circle' | 'ribbon' | 'star' | 'sparkle';
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  duration: number;
  delay: number;
}

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete?: () => void;
  durationMs?: number;
  particleCount?: number;
  title?: string;
  subtitle?: string;
  playSound?: boolean;
}

/**
 * Web Audio による祝祭ファンファーレ＆キラキラSEジェネレーター
 */
class ConfettiAudio {
  public static playCelebrationFanfare(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = (window as any).globalAudioCtx || new AudioCtx();
      (window as any).globalAudioCtx = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      // 軽快な祝祭アルペジオ (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.48);
      });

      // シャイニー・スパークル高周波
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(2000, now + 0.25);
      sparkleOsc.frequency.exponentialRampToValueAtTime(4500, now + 0.6);

      sparkleGain.gain.setValueAtTime(0.12, now + 0.25);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkleOsc.start(now + 0.25);
      sparkleOsc.stop(now + 0.65);
    } catch {
      // Audio playback fails gracefully if not permitted
    }
  }
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  isActive,
  onComplete,
  durationMs = 2800,
  particleCount = 50,
  title,
  subtitle,
  playSound = true,
}) => {
  useEffect(() => {
    if (!isActive) return;

    if (playSound) {
      ConfettiAudio.playCelebrationFanfare();
    }

    const timer = setTimeout(() => {
      onComplete?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isActive, durationMs, onComplete, playSound]);

  const particles = useMemo<ConfettiParticle[]>(() => {
    if (!isActive) return [];

    const colors = [
      { bg: '#fbbf24', shadow: 'rgba(251, 191, 36, 0.8)' }, // ゴールド
      { bg: '#38bdf8', shadow: 'rgba(56, 189, 248, 0.8)' }, // スカイブルー
      { bg: '#34d399', shadow: 'rgba(52, 211, 153, 0.8)' }, // エメラルド
      { bg: '#c084fc', shadow: 'rgba(192, 132, 252, 0.8)' }, // パープル
      { bg: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.8)' },  // ローズ
      { bg: '#f97316', shadow: 'rgba(249, 115, 22, 0.8)' }, // オレンジ
      { bg: '#e2e8f0', shadow: 'rgba(226, 232, 240, 0.9)' }, // シルバー
      { bg: '#a855f7', shadow: 'rgba(168, 85, 247, 0.8)' }, // バイオレット
    ];

    const shapes: ConfettiParticle['shape'][] = ['rect', 'rect', 'circle', 'ribbon', 'star', 'sparkle'];

    return Array.from({ length: particleCount }).map((_, i) => {
      const colorObj = colors[i % colors.length];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const startX = 10 + Math.random() * 80;
      const driftX = (Math.random() - 0.5) * 40;
      
      return {
        id: `confetti_${i}_${Date.now()}`,
        x: startX,
        targetX: Math.max(2, Math.min(98, startX + driftX)),
        targetY: 110 + Math.random() * 20, // 画面外へ
        color: colorObj.bg,
        shadowColor: colorObj.shadow,
        size: shape === 'ribbon' ? 14 + Math.random() * 10 : 8 + Math.random() * 10,
        shape,
        rotateX: Math.random() * 720,
        rotateY: Math.random() * 720,
        rotateZ: (Math.random() - 0.5) * 720,
        duration: 1.8 + Math.random() * 1.2,
        delay: Math.random() * 0.45,
      };
    });
  }, [isActive, particleCount]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-100 overflow-hidden flex flex-col items-center justify-center">
      {/* 祝賀バナー（指定時） */}
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: -40 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.05, 1.0, 0.9], y: [-40, 0, 0, 20] }}
          transition={{ duration: durationMs / 1000, times: [0, 0.15, 0.8, 1] }}
          className="absolute top-20 left-1/2 -translate-x-1/2 bg-stone-900/95 border-2 border-amber-400 text-white px-6 py-3 rounded-2xl shadow-[0_0_35px_rgba(251,191,36,0.6)] backdrop-blur-md flex flex-col items-center gap-1 z-10 text-center max-w-[90vw]"
        >
          {title && (
            <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base tracking-wider">
              <Gi.GiPartyPopper className="text-xl text-amber-400 animate-bounce" />
              <span>{title}</span>
              <Gi.GiPartyPopper className="text-xl text-amber-400 animate-bounce" />
            </div>
          )}
          {subtitle && (
            <div className="text-stone-300 font-bold text-xs sm:text-sm">
              {subtitle}
            </div>
          )}
        </motion.div>
      )}

      {/* 紙吹雪パーティクル群 */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: '-5%',
              opacity: 1,
              scale: 0.2,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
            }}
            animate={{
              left: `${p.targetX}%`,
              top: `${p.targetY}%`,
              opacity: [0, 1, 1, 0.8, 0],
              scale: [0.2, 1.2, 1.0, 0.9],
              rotateX: [0, p.rotateX],
              rotateY: [0, p.rotateY],
              rotateZ: [0, p.rotateZ],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              position: 'absolute',
              filter: `drop-shadow(0 0 6px ${p.shadowColor})`,
            }}
          >
            {p.shape === 'rect' && (
              <div
                style={{
                  width: `${p.size}px`,
                  height: `${p.size * 0.65}px`,
                  backgroundColor: p.color,
                  borderRadius: '2px',
                }}
              />
            )}
            {p.shape === 'circle' && (
              <div
                style={{
                  width: `${p.size * 0.8}px`,
                  height: `${p.size * 0.8}px`,
                  backgroundColor: p.color,
                  borderRadius: '50%',
                }}
              />
            )}
            {p.shape === 'ribbon' && (
              <div
                style={{
                  width: `${p.size * 0.4}px`,
                  height: `${p.size * 1.5}px`,
                  backgroundColor: p.color,
                  borderRadius: '3px',
                }}
              />
            )}
            {p.shape === 'star' && (
              <span style={{ fontSize: `${p.size * 1.2}px`, color: p.color }} className="inline-block">
                <Gi.GiStarFormation />
              </span>
            )}
            {p.shape === 'sparkle' && (
              <span style={{ fontSize: `${p.size * 1.1}px`, color: p.color }} className="inline-block">
                <Gi.GiSparkles />
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
