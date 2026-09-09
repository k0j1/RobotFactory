import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import {
  GSAPRobotAnimationRegistry,
  GSAPRobotAnimationController,
  IRobotAnimationPattern,
  RobotDOMRefs
} from '../../core/animations/GSAPRobotAnimator';
import { HandAnchorManager, ArmHandConfig } from '../../core/animations/HandAnchorManager';
import * as Gi from 'react-icons/gi';

export type ArmJointType = 'rightShoulder' | 'leftShoulder' | 'rightHand' | 'leftHand';

export interface GSAPRobotCanvasProps {
  robot: Robot | any;
  size?: number;
  patternId?: string;
  speed?: number;
  loop?: boolean;
  isPaused?: boolean;
  showJoints?: boolean;
  showHandMarkers?: boolean;   // 拳（ハンドアンカー）位置マーカーの表示
  showArmJointMarkers?: boolean; // 肩＆拳 位置調整モードマーカーの表示
  isJointCalibrationActive?: boolean; // キャリブレーションモード統合フラグ
  activeHand?: 'right' | 'left' | 'both'; // 調整フォーカス対象の手
  activeJointFilter?: 'all' | 'shoulders' | 'hands' | 'right' | 'left'; // 調整フォーカス対象の関節
  handConfig?: ArmHandConfig; // 直接注入される肩＆拳座標設定
  onUpdateHandConfig?: (config: ArmHandConfig) => void;
  onHandCoordChange?: (hand: 'right' | 'left', coord: { x: number; y: number }) => void;
  onJointCoordChange?: (joint: ArmJointType, coord: { x: number; y: number }) => void;
  zoom?: number;
  stageTheme?: 'dark' | 'light' | 'grid';
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
  showHandMarkers = false,
  showArmJointMarkers = false,
  isJointCalibrationActive: isJointCalibrationActiveProp,
  activeHand = 'both',
  activeJointFilter = 'all',
  handConfig: propHandConfig,
  onUpdateHandConfig,
  onHandCoordChange,
  onJointCoordChange,
  zoom = 1.0,
  stageTheme = 'dark',
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
  const fxContainerRef = useRef<HTMLDivElement>(null);

  const controllerRef = useRef<GSAPRobotAnimationController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new GSAPRobotAnimationController();
  }

  // マーカー表示の統合フラグ
  const isJointCalibrationActive = isJointCalibrationActiveProp || showArmJointMarkers || showHandMarkers;

  // パーツ情報の安全な抽出とフォールバック
  const parts = robot?.parts || {};
  const head = parts.head || { rarity: 1, visualIndex: 0, attribute: 'Water' };
  const body = parts.body || { rarity: 1, visualIndex: 0, attribute: 'Water' };
  const arms = parts.arms || { rarity: 1, visualIndex: 0, attribute: 'Water' };
  const legs = parts.legs || { rarity: 1, visualIndex: 0, attribute: 'Water' };

  // アームパーツ識別キー (例: arm_r1_v0)
  const armPartKey = useMemo(() => {
    return HandAnchorManager.generatePartKey(arms.rarity, arms.visualIndex);
  }, [arms.rarity, arms.visualIndex]);

  // 肩＆拳位置設定の監視とローカル状態
  const [localHandConfig, setLocalHandConfig] = useState<ArmHandConfig>(() => {
    return propHandConfig || HandAnchorManager.getInstance().getHandConfig(armPartKey);
  });

  // 設定マネージャーの変更通知およびprop同期
  useEffect(() => {
    if (propHandConfig) {
      setLocalHandConfig(propHandConfig);
    } else {
      setLocalHandConfig(HandAnchorManager.getInstance().getHandConfig(armPartKey));
    }
  }, [propHandConfig, armPartKey]);

  useEffect(() => {
    const unsubscribe = HandAnchorManager.getInstance().subscribe(() => {
      if (!propHandConfig) {
        setLocalHandConfig(HandAnchorManager.getInstance().getHandConfig(armPartKey));
      }
    });
    return unsubscribe;
  }, [armPartKey, propHandConfig]);

  // 安全な肩・拳座標の抽出（各プロパティ欠落や初期化遅延への完全防御的フォールバック）
  const safeHandConfig = useMemo(() => {
    const raw = propHandConfig || localHandConfig || HandAnchorManager.getInstance().getHandConfig(armPartKey);
    return {
      partKey: raw?.partKey || armPartKey,
      partName: raw?.partName || `アームパーツ (${armPartKey})`,
      leftShoulder: raw?.leftShoulder || { x: 25.0, y: 46.0 },
      rightShoulder: raw?.rightShoulder || { x: 75.0, y: 46.0 },
      leftHand: raw?.leftHand || { x: 24.0, y: 62.0 },
      rightHand: raw?.rightHand || { x: 76.0, y: 62.0 },
    };
  }, [propHandConfig, localHandConfig, armPartKey]);

  // ドラッグ操作中ステート（右肩・左肩・右拳・左拳）
  const [draggingJoint, setDraggingJoint] = useState<ArmJointType | null>(null);

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
          fxContainer: fxContainerRef.current,
          armPartKey,
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

  // 関節座標のドラッグ移動計算ハンドラー
  const updateJointFromPointer = (clientX: number, clientY: number, joint: ArmJointType) => {
    if (!robotRootRef.current) return;
    const rect = robotRootRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, Math.round(rawX * 10) / 10));
    const clampedY = Math.max(0, Math.min(100, Math.round(rawY * 10) / 10));

    const updated = HandAnchorManager.getInstance().updateJointPosition(
      armPartKey,
      joint,
      { x: clampedX, y: clampedY }
    );
    setLocalHandConfig(updated);
    if (onUpdateHandConfig) {
      onUpdateHandConfig(updated);
    }

    if (onJointCoordChange) {
      onJointCoordChange(joint, { x: clampedX, y: clampedY });
    }
    if (onHandCoordChange && (joint === 'rightHand' || joint === 'leftHand')) {
      onHandCoordChange(joint === 'rightHand' ? 'right' : 'left', { x: clampedX, y: clampedY });
    }
  };

  // ポインタードラッグイベントのグローバルリッスン
  useEffect(() => {
    if (!draggingJoint) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      updateJointFromPointer(clientX, clientY, draggingJoint);
    };

    const handlePointerUp = () => {
      setDraggingJoint(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [draggingJoint, armPartKey]);

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
        {/* 武器や手持ちアイテム・動的エフェクトを表示する前面レイヤー (z: 10) */}
        <div
          ref={fxContainerRef}
          id="gsap-rig-fx"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />
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
                transformOrigin: `${safeHandConfig.leftShoulder.x}% ${safeHandConfig.leftShoulder.y}%`,
                clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
              }}
            >
              <ArmsComp color={armsColor} className="w-full h-full block" />
              {showJoints && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black absolute shadow-[0_0_6px_#f59e0b]"
                    style={{
                      top: `${safeHandConfig.leftShoulder.y}%`,
                      left: `${safeHandConfig.leftShoulder.x}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
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
                transformOrigin: `${safeHandConfig.rightShoulder.x}% ${safeHandConfig.rightShoulder.y}%`,
                clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
              }}
            >
              <ArmsComp color={armsColor} className="w-full h-full block" />
              {showJoints && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black absolute shadow-[0_0_6px_#f59e0b]"
                    style={{
                      top: `${safeHandConfig.rightShoulder.y}%`,
                      left: `${safeHandConfig.rightShoulder.x}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
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

        {/* 肩＆拳 インタラクティブ・キャリブレーションマーカー - レイヤー z: 30 */}
        {isJointCalibrationActive && (
          <div className="absolute inset-0 w-full h-full z-[30] pointer-events-none">
            {/* SVG ボーンコネクタライン (左肩→左拳, 右肩→右拳) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {/* 左腕ボーンライン */}
              {(activeJointFilter === 'all' || activeJointFilter === 'left' || activeJointFilter === 'shoulders' || activeJointFilter === 'hands' || activeHand === 'both' || activeHand === 'left') && (
                <line
                  x1={`${safeHandConfig.leftShoulder.x}%`}
                  y1={`${safeHandConfig.leftShoulder.y}%`}
                  x2={`${safeHandConfig.leftHand.x}%`}
                  y2={`${safeHandConfig.leftHand.y}%`}
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeOpacity="0.75"
                />
              )}
              {/* 右腕ボーンライン */}
              {(activeJointFilter === 'all' || activeJointFilter === 'right' || activeJointFilter === 'shoulders' || activeJointFilter === 'hands' || activeHand === 'both' || activeHand === 'right') && (
                <line
                  x1={`${safeHandConfig.rightShoulder.x}%`}
                  y1={`${safeHandConfig.rightShoulder.y}%`}
                  x2={`${safeHandConfig.rightHand.x}%`}
                  y2={`${safeHandConfig.rightHand.y}%`}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeOpacity="0.75"
                />
              )}
            </svg>

            {/* ① 左肩マーカー (向かって左肩) */}
            {(activeJointFilter === 'all' || activeJointFilter === 'shoulders' || activeJointFilter === 'left') && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-grab active:cursor-grabbing group/leftShoulder z-20"
                style={{
                  left: `${safeHandConfig.leftShoulder.x}%`,
                  top: `${safeHandConfig.leftShoulder.y}%`,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('leftShoulder');
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('leftShoulder');
                }}
                title={`左肩アンカー (${safeHandConfig.leftShoulder.x.toFixed(1)}%, ${safeHandConfig.leftShoulder.y.toFixed(1)}%) - ドラッグで位置調整`}
              >
                <div className="absolute w-[160px] h-[1px] -left-[80px] top-1/2 -translate-y-1/2 border-t border-dashed border-teal-400/50 pointer-events-none" />
                <div className="absolute h-[160px] w-[1px] left-1/2 -translate-x-1/2 -top-[80px] border-l border-dashed border-teal-400/50 pointer-events-none" />
                <div className="absolute -inset-1 rounded-full bg-teal-400/30 animate-ping pointer-events-none" />
                
                <div className="relative w-6 h-6 rounded-full bg-teal-600 border-2 border-white text-white shadow-[0_0_10px_#0d9488] flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 group-active/leftShoulder:scale-110">
                  <span>🦾</span>
                </div>

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-stone-900/95 text-teal-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-teal-500/50 shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1">
                  <span className="font-bold text-white">L-SHLD</span>
                  <span>{safeHandConfig.leftShoulder.x.toFixed(1)}%, {safeHandConfig.leftShoulder.y.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* ② 右肩マーカー (向かって右肩) */}
            {(activeJointFilter === 'all' || activeJointFilter === 'shoulders' || activeJointFilter === 'right') && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-grab active:cursor-grabbing group/rightShoulder z-20"
                style={{
                  left: `${safeHandConfig.rightShoulder.x}%`,
                  top: `${safeHandConfig.rightShoulder.y}%`,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('rightShoulder');
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('rightShoulder');
                }}
                title={`右肩アンカー (${safeHandConfig.rightShoulder.x.toFixed(1)}%, ${safeHandConfig.rightShoulder.y.toFixed(1)}%) - ドラッグで位置調整`}
              >
                <div className="absolute w-[160px] h-[1px] -left-[80px] top-1/2 -translate-y-1/2 border-t border-dashed border-orange-400/50 pointer-events-none" />
                <div className="absolute h-[160px] w-[1px] left-1/2 -translate-x-1/2 -top-[80px] border-l border-dashed border-orange-400/50 pointer-events-none" />
                <div className="absolute -inset-1 rounded-full bg-orange-400/30 animate-ping pointer-events-none" />
                
                <div className="relative w-6 h-6 rounded-full bg-orange-600 border-2 border-white text-white shadow-[0_0_10px_#ea580c] flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 group-active/rightShoulder:scale-110">
                  <span>🦾</span>
                </div>

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-stone-900/95 text-orange-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-orange-500/50 shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1">
                  <span className="font-bold text-white">R-SHLD</span>
                  <span>{safeHandConfig.rightShoulder.x.toFixed(1)}%, {safeHandConfig.rightShoulder.y.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* ③ 左拳マーカー (向かって左側) */}
            {(activeJointFilter === 'all' || activeJointFilter === 'hands' || activeJointFilter === 'left' || activeHand === 'both' || activeHand === 'left') && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-grab active:cursor-grabbing group/leftHand z-20"
                style={{
                  left: `${safeHandConfig.leftHand.x}%`,
                  top: `${safeHandConfig.leftHand.y}%`,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('leftHand');
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('leftHand');
                }}
                title={`左手 拳アンカー (${safeHandConfig.leftHand.x.toFixed(1)}%, ${safeHandConfig.leftHand.y.toFixed(1)}%) - ドラッグで位置調整`}
              >
                {/* 縦横のクロスヘアガイドライン */}
                <div className="absolute w-[200px] h-[1px] -left-[100px] top-1/2 -translate-y-1/2 border-t border-dashed border-cyan-400/50 pointer-events-none" />
                <div className="absolute h-[200px] w-[1px] left-1/2 -translate-x-1/2 -top-[100px] border-l border-dashed border-cyan-400/50 pointer-events-none" />

                {/* パルス外輪 */}
                <div className="absolute -inset-1.5 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                
                {/* ターゲットピン本体 */}
                <div className="relative w-6 h-6 rounded-full bg-cyan-500 border-2 border-white text-white shadow-[0_0_10px_#06b6d4] flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 group-active/leftHand:scale-110">
                  <span>✊</span>
                </div>

                {/* 座標ラベルチップ */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-stone-900/95 text-cyan-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/50 shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1">
                  <span className="font-bold text-white">L-FIST</span>
                  <span>{safeHandConfig.leftHand.x.toFixed(1)}%, {safeHandConfig.leftHand.y.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* ④ 右拳マーカー (向かって右側) */}
            {(activeJointFilter === 'all' || activeJointFilter === 'hands' || activeJointFilter === 'right' || activeHand === 'both' || activeHand === 'right') && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-grab active:cursor-grabbing group/rightHand z-20"
                style={{
                  left: `${safeHandConfig.rightHand.x}%`,
                  top: `${safeHandConfig.rightHand.y}%`,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('rightHand');
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setDraggingJoint('rightHand');
                }}
                title={`右手 拳アンカー (${safeHandConfig.rightHand.x.toFixed(1)}%, ${safeHandConfig.rightHand.y.toFixed(1)}%) - ドラッグで位置調整`}
              >
                {/* 縦横のクロスヘアガイドライン */}
                <div className="absolute w-[200px] h-[1px] -left-[100px] top-1/2 -translate-y-1/2 border-t border-dashed border-amber-400/50 pointer-events-none" />
                <div className="absolute h-[200px] w-[1px] left-1/2 -translate-x-1/2 -top-[100px] border-l border-dashed border-amber-400/50 pointer-events-none" />

                {/* パルス外輪 */}
                <div className="absolute -inset-1.5 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                
                {/* ターゲットピン本体 */}
                <div className="relative w-6 h-6 rounded-full bg-amber-500 border-2 border-white text-white shadow-[0_0_10px_#f59e0b] flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 group-active/rightHand:scale-110">
                  <span>✊</span>
                </div>

                {/* 座標ラベルチップ */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-stone-900/95 text-amber-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-amber-500/50 shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1">
                  <span className="font-bold text-white">R-FIST</span>
                  <span>{safeHandConfig.rightHand.x.toFixed(1)}%, {safeHandConfig.rightHand.y.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 肩＆拳 位置調整モード中：ロボット描画を遮らない非侵入型ミニマルバッジ */}
      {isJointCalibrationActive && (
        <div className="absolute bottom-2 right-2 bg-stone-900/85 text-[10px] font-mono text-amber-300 px-2 py-1 rounded-md border border-amber-500/50 pointer-events-none z-30 backdrop-blur-xs shadow-md flex items-center gap-1.5">
          <span>🦾</span>
          <span className="font-bold text-white">調整中</span>
          <span className="text-[9px] text-stone-300">ピンをドラッグして微調整</span>
        </div>
      )}

      {/* ボーン・ジョイントHUD情報 (通常時のみ表示し、肩＆拳調整中は邪魔にならないよう非表示) */}
      {!isJointCalibrationActive && showJoints && (
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
