import React, { useEffect, useRef } from 'react';
import { WorkshopParticleEngine } from '../../core/ParticleSystem';

interface WorkshopParticlesProps {
  active?: boolean;
  className?: string;
  particleCount?: number;
}

/**
 * 工房パーティクル描画コンポーネント (WorkshopParticles)
 * 
 * ダッシュボードおよびクラフト（製造）画面において、
 * 漂う光の微粒子（floating dust motes）や小さな光のスパーク（light sparks）を優しく描画。
 * タブが非アクティブな間はアニメーションループを自動停止し、CPU/バッテリーを節約します。
 */
export const WorkshopParticles: React.FC<WorkshopParticlesProps> = ({
  active = true,
  className = '',
  particleCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WorkshopParticleEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // エンジンの初期化
    const engine = new WorkshopParticleEngine(particleCount);
    engineRef.current = engine;
    engine.init(canvas);

    if (active) {
      engine.start();
    }

    // リサイズ監視（ResizeObserverで確実なサイズ同期）
    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      engine.resize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [particleCount]);

  // active 状態の切り替えに応じたアニメーションの起動・停止制御
  useEffect(() => {
    if (!engineRef.current) return;
    if (active) {
      engineRef.current.start();
    } else {
      engineRef.current.stop();
    }
  }, [active]);

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
