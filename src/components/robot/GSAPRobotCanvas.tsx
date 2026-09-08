import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import {
  GSAPRobotAnimationRegistry,
  GSAPRobotAnimationController,
  IRobotAnimationPattern,
  RobotDOMRefs
} from '../../core/animations/GSAPRobotAnimator';
import * as Gi from 'react-icons/gi';

export interface GSAPRobotCanvasProps {
  robot: Robot | any;
  size?: number;
  patternId?: string;
  speed?: number;
  loop?: boolean;
  isPaused?: boolean;
  showJoints?: boolean;
  zoom?: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
  hideStageDecorations?: boolean;
}

/**
 * GSAP ロボットキャンバス（Next-Gen Layered Rig Engine）
 * 各パーツのSVGを独立した高精度レイヤーとして保持し、GSAP Timelineで物理的かつ滑らかに変形・駆動
 */
export const GSAPRobotCanvas: React.FC<GSAPRobotCanvasProps> = ({
  robot,
  size = 200,
  patternId = 'bio_breathing',
  speed = 1.0,
  loop = true,
  isPaused = false,
  showJoints = false,
  zoom = 1.0,
  onProgress,
  onComplete,
  className = '',
  hideStageDecorations = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const robotRootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const armsRef = useRef<HTMLDivElement>(null);
  const legsRef = useRef<HTMLDivElement>(null);

  // 左右独立リム用 refs
  const armLeftRef = useRef<HTMLDivElement>(null);
  const armRightRef = useRef<HTMLDivElement>(null);
  const legLeftRef = useRef<HTMLDivElement>(null);
  const legRightRef = useRef<HTMLDivElement>(null);

  const shadowRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const auraOverlayRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  const controllerRef = useRef<GSAPRobotAnimationController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new GSAPRobotAnimationController();
  }

  // パーツ情報の安全な抽出とフォールバック
  const parts = robot?.parts || {};
  const head = parts.head || { rarity: 1, visualIndex: 0, attribute: 'Water' };
  const body = parts.body || { rarity: 1, visualIndex: 0, attribute: 'Water' };
  const arms = parts.arms || { rarity: 1, visualIndex: 0, attribute: 'Water' };
  const legs = parts.legs || { rarity: 1, visualIndex: 0, attribute: 'Water' };

  const headR = (head.rarity && head.rarity in SVG_HEADS) ? head.rarity : 1;
  const bodyR = (body.rarity && body.rarity in SVG_BODIES) ? body.rarity : 1;
  const armsR = (arms.rarity && arms.rarity in SVG_ARMS) ? arms.rarity : 1;
  const legsR = (legs.rarity && legs.rarity in SVG_LEGS) ? legs.rarity : 1;

  const headList = (SVG_HEADS[headR] && SVG_HEADS[headR].length > 0) ? SVG_HEADS[headR] : SVG_HEADS[1];
  const bodyList = (SVG_BODIES[bodyR] && SVG_BODIES[bodyR].length > 0) ? SVG_BODIES[bodyR] : SVG_BODIES[1];
  const armsList = (SVG_ARMS[armsR] && SVG_ARMS[armsR].length > 0) ? SVG_ARMS[armsR] : SVG_ARMS[1];
  const legsList = (SVG_LEGS[legsR] && SVG_LEGS[legsR].length > 0) ? SVG_LEGS[legsR] : SVG_LEGS[1];

  const HeadComp = headList[(head.visualIndex || 0) % headList.length] || SVG_HEADS[1][0];
  const BodyComp = bodyList[(body.visualIndex || 0) % bodyList.length] || SVG_BODIES[1][0];
  const ArmsComp = armsList[(arms.visualIndex || 0) % armsList.length] || SVG_ARMS[1][0];
  const LegsComp = legsList[(legs.visualIndex || 0) % legsList.length] || SVG_LEGS[1][0];

  const headColor = AttributeColors[head.attribute] || '#1d61d1';
  const bodyColor = AttributeColors[body.attribute] || '#1d61d1';
  const armsColor = AttributeColors[arms.attribute] || '#1d61d1';
  const legsColor = AttributeColors[legs.attribute] || '#1d61d1';

  // アニメーションのバインドと実行
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    try {
      const registry = GSAPRobotAnimationRegistry.getInstance();
      const pattern = registry.getPattern(patternId) || registry.getPattern('bio_breathing');

      if (pattern && robotRootRef.current) {
        const domRefs: RobotDOMRefs = {
          container: robotRootRef.current,
          head: headRef.current,
          body: bodyRef.current,
          arms: armsRef.current,
          legs: legsRef.current,
          armLeft: armLeftRef.current,
          armRight: armRightRef.current,
          legLeft: legLeftRef.current,
          legRight: legRightRef.current,
          scanLine: scanLineRef.current,
          auraOverlay: auraOverlayRef.current,
          sparkles: sparklesRef.current,
        };

        controller.playPattern(pattern, domRefs, {
          timeScale: speed,
          loop,
          onProgress,
          onComplete,
        });

        if (isPaused) {
          controller.pause();
        }
      }
    } catch (err) {
      console.error('[GSAPRobotCanvas] Animation mount error:', err);
    }

    return () => {
      if (controller) {
        controller.kill();
      }
    };
  }, [patternId, robot?.id]);

  // 速度変更
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setTimeScale(speed);
    }
  }, [speed]);

  // ループ設定変更
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setLoop(loop);
    }
  }, [loop]);

  // 一時停止・再開
  useEffect(() => {
    if (controllerRef.current) {
      if (isPaused) {
        controllerRef.current.pause();
      } else {
        controllerRef.current.resume();
      }
    }
  }, [isPaused]);

  // 外部からのシーク制御用
  const seekTo = (p: number) => {
    if (controllerRef.current) {
      controllerRef.current.seek(p);
    }
  };

  const canvasWidth = size;
  const canvasHeight = size;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none overflow-hidden isolate ${className}`}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        minWidth: canvasWidth,
        minHeight: canvasHeight,
      }}
    >
      {/* ステージ背景グリッド・サークル */}
      {!hideStageDecorations && (
        <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center z-0">
          <div className="w-full h-[1px] bg-amber-500/60 absolute" />
          <div className="h-full w-[1px] bg-amber-500/60 absolute" />
          <div className="w-[88%] h-[88%] rounded-full border border-dashed border-amber-500/40 absolute" />
          <div className="w-[60%] h-[60%] rounded-full border border-amber-500/20 absolute" />
        </div>
      )}

      {/* エフェクトレイヤー 1: スキャン走査ライン */}
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] pointer-events-none z-30 opacity-0"
        style={{ top: '50%' }}
      />

      {/* エフェクトレイヤー 2: エネルギーオーラ */}
      <div
        ref={auraOverlayRef}
        className="absolute inset-3 rounded-full pointer-events-none z-0 opacity-0 bg-radial from-amber-400/40 via-yellow-500/15 to-transparent blur-lg"
      />

      {/* エフェクトレイヤー 3: スパーク・星パーティクル */}
      <div
        ref={sparklesRef}
        className="absolute inset-0 pointer-events-none z-30 opacity-0 flex items-center justify-center"
      >
        <Gi.GiSparkles className="absolute top-3 left-4 text-amber-300 text-xl animate-pulse" />
        <Gi.GiStarFormation className="absolute top-4 right-4 text-yellow-200 text-xl animate-pulse" />
        <Gi.GiMusicalNotes className="absolute bottom-4 right-5 text-amber-400 text-lg" />
        <Gi.GiLightningShield className="absolute bottom-4 left-5 text-cyan-300 text-lg" />
      </div>

      {/* 接地影（ドロップシャドウ） */}
      <div
        ref={shadowRef}
        className="absolute bottom-3 w-32 h-5 rounded-[50%] bg-stone-900/45 blur-[4px] pointer-events-none z-0 transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      />

      {/* ロボット本体（各部位を独立したレイヤーとして保持） */}
      <div
        ref={robotRootRef}
        className="relative z-10 will-change-transform flex items-center justify-center"
        style={{
          width: canvasWidth * 0.9,
          height: canvasHeight * 0.9,
          transform: `scale(${zoom})`,
          transformOrigin: '50% 80%',
        }}
      >
        {/* 脚部 (Legs) - 左脚 & 右脚 を独立分割制御 */}
        {LegsComp && (
          <>
            {/* 左脚 (Left Leg) - z: 1 */}
            <div
              ref={legLeftRef}
              id="gsap-rig-leg-left"
              className="absolute inset-0 w-full h-full z-[1] will-change-transform flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: '38% 72%',
                clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
              }}
            >
              <LegsComp color={legsColor} className="w-full h-full block" />
              {showJoints && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-400 border border-black absolute shadow-[0_0_6px_#34d399]"
                    style={{ top: '72%', left: '38%', transform: 'translate(-50%, -50%)' }}
                  />
                </div>
              )}
            </div>

            {/* 右脚 (Right Leg) - z: 1 */}
            <div
              ref={legRightRef}
              id="gsap-rig-leg-right"
              className="absolute inset-0 w-full h-full z-[1] will-change-transform flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: '62% 72%',
                clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
              }}
            >
              <LegsComp color={legsColor} className="w-full h-full block" />
              {showJoints && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-400 border border-black absolute shadow-[0_0_6px_#34d399]"
                    style={{ top: '72%', left: '62%', transform: 'translate(-50%, -50%)' }}
                  />
                </div>
              )}
            </div>

            {/* 後方互換性用 legs コンテナ（非表示） */}
            <div ref={legsRef} className="hidden" aria-hidden="true" />
          </>
        )}

        {/* 胴体 (Body) - レイヤー z: 2 */}
        {BodyComp && (
          <div
            ref={bodyRef}
            id="gsap-rig-body"
            className="absolute inset-0 w-full h-full z-[2] will-change-transform flex items-center justify-center pointer-events-none"
            style={{ transformOrigin: '50% 55%' }}
          >
            <BodyComp color={bodyColor} className="w-full h-full block" />
            {showJoints && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <span
                  className="w-3 h-3 rounded-full bg-cyan-400 border border-black absolute shadow-[0_0_8px_#22d3ee] flex items-center justify-center"
                  style={{ top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <span className="w-1 h-1 bg-white rounded-full" />
                </span>
              </div>
            )}
          </div>
        )}

        {/* 腕部 (Arms) - 左腕 & 右腕 を独立分割制御 */}
        {ArmsComp && (
          <>
            {/* 左腕 (Left Arm) - z: 3 */}
            <div
              ref={armLeftRef}
              id="gsap-rig-arm-left"
              className="absolute inset-0 w-full h-full z-[3] will-change-transform flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: '25% 46%',
                clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
              }}
            >
              <ArmsComp color={armsColor} className="w-full h-full block" />
              {showJoints && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black absolute shadow-[0_0_6px_#f59e0b]"
                    style={{ top: '46%', left: '25%', transform: 'translate(-50%, -50%)' }}
                  />
                </div>
              )}
            </div>

            {/* 右腕 (Right Arm) - z: 3 */}
            <div
              ref={armRightRef}
              id="gsap-rig-arm-right"
              className="absolute inset-0 w-full h-full z-[3] will-change-transform flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: '75% 46%',
                clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
              }}
            >
              <ArmsComp color={armsColor} className="w-full h-full block" />
              {showJoints && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black absolute shadow-[0_0_6px_#f59e0b]"
                    style={{ top: '46%', left: '75%', transform: 'translate(-50%, -50%)' }}
                  />
                </div>
              )}
            </div>

            {/* 後方互換性用 arms コンテナ（非表示） */}
            <div ref={armsRef} className="hidden" aria-hidden="true" />
          </>
        )}

        {/* 頭部 (Head) - レイヤー z: 4 */}
        {HeadComp && (
          <div
            ref={headRef}
            id="gsap-rig-head"
            className="absolute inset-0 w-full h-full z-[4] will-change-transform flex items-center justify-center pointer-events-none"
            style={{ transformOrigin: '50% 32%' }}
          >
            <HeadComp color={headColor} className="w-full h-full block" />
            {showJoints && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-black absolute shadow-[0_0_6px_#f43f5e]"
                  style={{ top: '32%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ボーン・ジョイントHUD情報 */}
      {showJoints && (
        <div className="absolute top-2 right-2 bg-stone-900/90 text-[9px] font-mono text-cyan-300 px-2 py-1 rounded border border-cyan-500/40 pointer-events-none z-40 backdrop-blur-xs space-y-0.5 shadow-lg">
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />HEAD: 50% 32%</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />CORE: 50% 55%</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />L-ARM: 25% 46%</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />R-ARM: 75% 46%</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />L-LEG: 38% 72%</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />R-LEG: 62% 72%</div>
        </div>
      )}
    </div>
  );
};
