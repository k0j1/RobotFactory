import * as Gi from 'react-icons/gi';
import React from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import { theme } from '../../styles/theme';
import { LocationEnvironment } from './LocationEnvironment';
import { HandAnchorManager, ArmHandConfig } from '../../core/animations/HandAnchorManager';

import { motion } from 'motion/react';

import { WeatherType } from '../../core/models';

interface RobotVisualProps {
  robot: any;
  size?: number; // width/height in px for the robot itself
  containerWidth?: number | string;
  containerHeight?: number | string;
  animateCrafting?: boolean;
  animateVictory?: boolean;
  animateExploration?: boolean;
  emotion?: 'auto' | 'normal' | 'happy' | 'troubled' | 'searching' | 'skipping' | 'exploded';
  happyVariant?: 'banzai' | 'bounce' | 'auto';
  hasPendingDrops?: boolean;
  isTroubled?: boolean;
  isExplodedView?: boolean;
  isSkipping?: boolean;
  locationId?: string; // 探索地に応じた背景・天気
  weatherType?: WeatherType;
  agility?: number; // ロボットの素早さ（歩行・アニメーション速度に反映）
  hideBackground?: boolean;
  hideBubble?: boolean;
  customHandConfig?: ArmHandConfig; // 外部注入の肩＆拳設定
}

export const PartVisual: React.FC<{ part: any, size?: number }> = ({ part, size = 64 }) => {
  if (!part) return null;

  let Comp = null;
  const r = part.rarity || 1;
  if (part.type === 'head') Comp = (SVG_HEADS[r] && SVG_HEADS[r].length > 0) ? SVG_HEADS[r][part.visualIndex % SVG_HEADS[r].length] : SVG_HEADS[1][part.visualIndex % SVG_HEADS[1].length];
  else if (part.type === 'body') Comp = (SVG_BODIES[r] && SVG_BODIES[r].length > 0) ? SVG_BODIES[r][part.visualIndex % SVG_BODIES[r].length] : SVG_BODIES[1][part.visualIndex % SVG_BODIES[1].length];
  else if (part.type === 'arms') Comp = (SVG_ARMS[r] && SVG_ARMS[r].length > 0) ? SVG_ARMS[r][part.visualIndex % SVG_ARMS[r].length] : SVG_ARMS[1][part.visualIndex % SVG_ARMS[1].length];
  else if (part.type === 'legs') Comp = (SVG_LEGS[r] && SVG_LEGS[r].length > 0) ? SVG_LEGS[r][part.visualIndex % SVG_LEGS[r].length] : SVG_LEGS[1][part.visualIndex % SVG_LEGS[1].length];
  
  const color = AttributeColors[part.attribute] || '#000';
  
  const viewBox = r === 3
    ? (part.type === 'head' ? '0 0 256 256' : '0 0 256 256')
    : r === 2
    ? (part.type === 'head' ? '0 0 64 64' : part.type === 'arms' ? ((part.visualIndex % 4) === 0 ? '6 -4 52 52' : '0 0 300 300') : part.type === 'body' ? '22 28 56 52' : part.type === 'legs' ? '0 0 300 300' : '0 0 64 64')
    : (part.type === 'head' ? '20 0 60 45' :
       part.type === 'body' ? '25 32 50 48' :
       part.type === 'arms' ? '5 38 90 42' :
       '20 68 60 32');

  const bgGridSize = Math.max(8, size / 6);
  const bgStyle = {
    width: size, height: size,
    backgroundColor: '#e7e5e4',
    backgroundImage: `linear-gradient(#d6d3d1 2px, transparent 2px), linear-gradient(90deg, #d6d3d1 2px, transparent 2px)`,
    backgroundSize: `${bgGridSize}px ${bgGridSize}px`,
    backgroundPosition: 'center center',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
  };

  return (
    <div className={`isolate flex justify-center items-center ${theme.radius.md} overflow-hidden border border-stone-300`} style={bgStyle}>
      <div className="w-[80%] h-[80%] relative flex justify-center items-center">
        {Comp && <Comp color={color} viewBox={viewBox} className="w-full h-full" />}
      </div>
    </div>
  );
};

export const RobotVisual: React.FC<RobotVisualProps> = ({ 
  robot, 
  size = 120, 
  containerWidth, 
  containerHeight, 
  animateCrafting = false, 
  animateVictory = false, 
  animateExploration = false,
  emotion = 'auto',
  happyVariant = 'auto',
  hasPendingDrops = false,
  isTroubled = false,
  isExplodedView = false,
  isSkipping = false,
  locationId,
  weatherType,
  agility,
  hideBackground = false,
  hideBubble = false,
  customHandConfig
}) => {
  const parts = robot?.parts || {};
  const { head, body, arms, legs } = parts;
  
  const headR = head?.rarity || 1;
  const bodyR = body?.rarity || 1;
  const armsR = arms?.rarity || 1;
  const legsR = legs?.rarity || 1;

  const HeadComp = head ? ((SVG_HEADS[headR] && SVG_HEADS[headR].length > 0) ? SVG_HEADS[headR][head.visualIndex % SVG_HEADS[headR].length] : SVG_HEADS[1][head.visualIndex % SVG_HEADS[1].length]) : null;
  const BodyComp = body ? ((SVG_BODIES[bodyR] && SVG_BODIES[bodyR].length > 0) ? SVG_BODIES[bodyR][body.visualIndex % SVG_BODIES[bodyR].length] : SVG_BODIES[1][body.visualIndex % SVG_BODIES[1].length]) : null;
  const ArmsComp = arms ? ((SVG_ARMS[armsR] && SVG_ARMS[armsR].length > 0) ? SVG_ARMS[armsR][arms.visualIndex % SVG_ARMS[armsR].length] : SVG_ARMS[1][arms.visualIndex % SVG_ARMS[1].length]) : null;
  const LegsComp = legs ? ((SVG_LEGS[legsR] && SVG_LEGS[legsR].length > 0) ? SVG_LEGS[legsR][legs.visualIndex % SVG_LEGS[legsR].length] : SVG_LEGS[1][legs.visualIndex % SVG_LEGS[1].length]) : null;

  // Use AttributeColors based on part's attribute
  const headColor = head ? AttributeColors[head.attribute] : '#000';
  const bodyColor = body ? AttributeColors[body.attribute] : '#000';
  const armsColor = arms ? AttributeColors[arms.attribute] : '#000';
  const legsColor = legs ? AttributeColors[legs.attribute] : '#000';

  // アームパーツ識別キー (例: arm_r1_v0)
  const armPartKey = React.useMemo(() => {
    const rarity = arms?.rarity || 1;
    const visualIndex = arms?.visualIndex || 0;
    return HandAnchorManager.generatePartKey(rarity, visualIndex);
  }, [arms?.rarity, arms?.visualIndex]);

  // 肩＆拳位置設定の動的監視・同期（ユーザーが設定したカスタム座標を完全反映）
  const [handConfig, setHandConfig] = React.useState<ArmHandConfig>(() => {
    return customHandConfig || HandAnchorManager.getInstance().getHandConfig(armPartKey);
  });

  React.useEffect(() => {
    if (customHandConfig) {
      setHandConfig(customHandConfig);
      return;
    }
    setHandConfig(HandAnchorManager.getInstance().getHandConfig(armPartKey));
    const unsubscribe = HandAnchorManager.getInstance().subscribe(() => {
      setHandConfig(HandAnchorManager.getInstance().getHandConfig(armPartKey));
    });
    return unsubscribe;
  }, [armPartKey, customHandConfig]);

  // 安全な左右肩・拳の座標（ユーザーが設定した値を最優先で使用）
  const safeJoints = React.useMemo(() => {
    return {
      leftShoulder: handConfig?.leftShoulder || { x: 25.0, y: 46.0 },
      rightShoulder: handConfig?.rightShoulder || { x: 75.0, y: 46.0 },
      leftHand: handConfig?.leftHand || { x: 24.0, y: 62.0 },
      rightHand: handConfig?.rightHand || { x: 76.0, y: 62.0 },
    };
  }, [handConfig]);

  // ロボットのAgility（props.agility または robot.stats.agility）
  const robotAgility = agility ?? (robot?.stats?.agility || 0);

  // Agilityに応じた速度倍率 (基本1.0、Agility 100で1.5倍、Agility 300で2.5倍)
  const speedMultiplier = 1.0 + Math.min(2.5, (robotAgility / 100) * 0.5);

  // 歩行・探索アニメーション周期（Agilityが高いと素早くキビキビ動く）
  const walkDuration = Math.max(0.28, 0.7 / speedMultiplier);
  const headSearchDuration = Math.max(1.2, 2.8 / speedMultiplier);
  const bgScrollDuration = Math.max(0.5, 1.5 / speedMultiplier);

  // Determine current emotion state
  const currentEmotion: 'happy' | 'troubled' | 'searching' | 'skipping' | 'exploded' | 'normal' = 
    isExplodedView || emotion === 'exploded'
      ? 'exploded'
      : isSkipping || emotion === 'skipping'
      ? 'skipping'
      : emotion && emotion !== 'auto'
      ? (emotion as any)
      : animateVictory || hasPendingDrops
      ? 'happy'
      : isTroubled
      ? 'troubled'
      : animateExploration
      ? 'searching'
      : 'normal';

  // 素材発見・歓喜アニメーション（素材発見時・通常遠征完了時は確実にバンザイ！）
  const activeHappyVariant = React.useMemo<'banzai' | 'bounce'>(() => {
    if (happyVariant && happyVariant !== 'auto') return happyVariant;
    if (hasPendingDrops || animateVictory) return 'banzai';
    const str = `${robot?.id || ''}_${robot?.name || 'r'}`;
    const code = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return code % 2 === 0 ? 'banzai' : 'bounce';
  }, [happyVariant, hasPendingDrops, animateVictory, robot?.id, robot?.name]);

  const bgGridSize = Math.max(10, size / 8);
  const defaultBgStyle = {
    width: containerWidth || size, height: containerHeight || size,
    backgroundColor: '#e7e5e4',
    backgroundImage: `linear-gradient(#d6d3d1 2px, transparent 2px), linear-gradient(90deg, #d6d3d1 2px, transparent 2px)`,
    backgroundSize: `${bgGridSize}px ${bgGridSize}px`,
    backgroundPosition: 'center center',
    boxShadow: (currentEmotion === 'happy' || animateVictory) 
      ? '0 0 25px rgba(234, 179, 8, 0.4), inset 0 0 20px rgba(254, 240, 138, 0.3)' 
      : currentEmotion === 'exploded'
      ? '0 0 25px rgba(14, 165, 233, 0.45), inset 0 0 20px rgba(186, 230, 253, 0.35)'
      : currentEmotion === 'skipping'
      ? '0 0 20px rgba(245, 158, 11, 0.35), inset 0 0 15px rgba(254, 243, 199, 0.3)'
      : 'inset 0 0 20px rgba(0,0,0,0.05)'
  };

  const explorationBgStyle = {
    width: containerWidth || size, height: containerHeight || size,
    backgroundColor: '#1c1917',
    boxShadow: currentEmotion === 'happy'
      ? '0 0 25px rgba(234, 179, 8, 0.4), inset 0 0 25px rgba(0,0,0,0.7)'
      : currentEmotion === 'troubled'
      ? '0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 25px rgba(0,0,0,0.85)'
      : 'inset 0 0 25px rgba(0,0,0,0.8)'
  };

  const bgStyle = animateExploration ? explorationBgStyle : defaultBgStyle;

  const animProps = (delay: number, startY: number) => 
    animateCrafting 
      ? {
          initial: { opacity: 0, y: startY },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, type: "spring", bounce: 0.4 }
        }
      : {};

  // === ANIMATION DEFINITIONS (左右完全独立リグモーション) ===

  // 1. Body motion
  const bodyMotion = currentEmotion === 'exploded'
    ? {
        // 【パーツ分解展開図】中央でゆっくり設計図ホバー浮遊
        animate: {
          y: [0, -4, 0, -4, 0],
          scale: [1, 1.04, 1, 1.04, 1],
          rotate: [0, -0.5, 0.5, 0]
        },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'skipping'
    ? {
        // 【ご機嫌るんるんスキップ】軽快に弾んで左右にリズム良くスキップ
        animate: {
          y: [0, -7, -1, -11, 0, -5, 0],
          rotate: [-4, 4, -7, 7, -4, 4, -4],
          scale: [1, 1.05, 0.96, 1.08, 0.95, 1.04, 1]
        },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'happy'
    ? activeHappyVariant === 'banzai'
      ? {
          // 【バンザイ大歓喜】大きく天へ伸び上がって全身で喜びを爆発！
          animate: { 
            y: [0, -18, 0, -10, 0],
            scale: [1, 1.12, 0.94, 1.06, 1],
            rotate: [0, -5, 5, -3, 0]
          },
          transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
        }
      : {
          // 【ウキウキ・バウンスホップ】ポン！ポン！ピョン！とリズミカルに跳ねる
          animate: {
            y: [0, -6, 0, -8, 0, -16, 0],
            scaleY: [1, 1.05, 0.95, 1.07, 0.93, 1.12, 0.92, 1],
            scaleX: [1, 0.96, 1.04, 0.94, 1.06, 0.92, 1.08, 1],
            rotate: [0, -3, 3, -4, 4, 0, 0]
          },
          transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
        }
    : currentEmotion === 'troubled'
    ? {
        // 困ってオロオロ震えて沈み込むモーション
        animate: {
          x: [-2, 2, -2, 2, 0],
          y: [0, 3, 1, 4, 0],
          rotate: [-3, 3, -2, 2, 0]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        animate: { 
          y: [0, -3, 0, -3, 0],
          rotate: [-1.5, 1.5, -1.5, 1.5, -1.5],
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        animate: {
          y: [0, -1.5, 0],
        },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      };

  // 2. Arms motion (左腕・右腕を左右独立分割＆設定された肩位置を中心軸として駆動)
  // 左腕 (Left Arm)
  const armLeftMotion = currentEmotion === 'exploded'
    ? {
        // 【パーツ分解展開図】左外側・上方へ大きく美しく展開
        animate: { 
          x: [-2, -24, -20, -24, -2],
          y: [0, -8, -6, -8, 0],
          rotate: [0, -28, -22, -28, 0],
          scale: [1, 1.08, 1.04, 1.08, 1]
        },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'skipping'
    ? {
        // 【ご機嫌るんるんスキップ】前後に楽しそうに大きく腕振りスイング
        animate: { 
          rotate: [-32, 24, -38, 32, -24, 18, -32],
          y: [-5, 3, -7, 5, -3, 2, -5],
          scale: [1, 1.12, 1, 1.15, 1]
        },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'happy'
    ? activeHappyVariant === 'banzai'
      ? {
          // 【バンザイ大歓喜】左肩を軸に左上方へ高々と万歳！
          animate: { 
            rotate: [-25, -68, -32, -68, -25],
            y: [-3, -18, -7, -18, -3],
            x: [0, -4, -1, -4, 0],
            scaleY: [1, 1.22, 1, 1.22, 1]
          },
          transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
        }
      : {
          // 【ウキウキ・バウンスホップ】翼のように上下にパタパタ羽ばたく
          animate: { 
            rotate: [-12, -38, -14, -46, -12, -54, -12],
            y: [0, -6, 0, -8, 0, -14, 0],
            scaleX: [1, 1.1, 1, 1.15, 1, 1.2, 1]
          },
          transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
        }
    : currentEmotion === 'troubled'
    ? {
        // 胸元・お腹を抱えるようにオロオロ小刻みに震える
        animate: { 
          rotate: [14, 24, 12, 26, 14],
          x: [1, 3, 1, 3, 1],
          y: [-4, -2, -4, -2, -4]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        // 二足歩行で前後にしっかり腕振り（右腕・左脚と逆位相！）
        animate: { 
          rotate: [24, -24, 24],
          y: [0, -2, 0]
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        // 待機バイオブリージング
        animate: {
          rotate: [-4, 4, -4],
          y: [0, 1, 0]
        },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      };

  // 右腕 (Right Arm)
  const armRightMotion = currentEmotion === 'exploded'
    ? {
        // 【パーツ分解展開図】右外側・上方へ大きく美しく展開
        animate: { 
          x: [2, 24, 20, 24, 2],
          y: [0, -8, -6, -8, 0],
          rotate: [0, 28, 22, 28, 0],
          scale: [1, 1.08, 1.04, 1.08, 1]
        },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'skipping'
    ? {
        // 【ご機嫌るんるんスキップ】前後に楽しそうに大きく腕振りスイング
        animate: { 
          rotate: [24, -32, 32, -38, 18, -24, 24],
          y: [3, -5, 5, -7, 2, -3, 3],
          scale: [1, 1.12, 1, 1.15, 1]
        },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'happy'
    ? activeHappyVariant === 'banzai'
      ? {
          // 【バンザイ大歓喜】右肩を軸に右上方へ高々と万歳！
          animate: { 
            rotate: [25, 68, 32, 68, 25],
            y: [-3, -18, -7, -18, -3],
            x: [0, 4, 1, 4, 0],
            scaleY: [1, 1.22, 1, 1.22, 1]
          },
          transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
        }
      : {
          // 【ウキウキ・バウンスホップ】翼のように上下にパタパタ羽ばたく
          animate: { 
            rotate: [12, 38, 14, 46, 12, 54, 12],
            y: [0, -6, 0, -8, 0, -14, 0],
            scaleX: [1, 1.1, 1, 1.15, 1, 1.2, 1]
          },
          transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
        }
    : currentEmotion === 'troubled'
    ? {
        // 頭部を抑えるようにオロオロする
        animate: { 
          rotate: [-18, -28, -16, -30, -18],
          x: [-2, -5, -2, -5, -2],
          y: [-8, -6, -8, -6, -8]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        // 二足歩行で前後にしっかり腕振り（左腕・右脚と逆位相！）
        animate: { 
          rotate: [-24, 24, -24],
          y: [0, -2, 0]
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        // 待機バイオブリージング
        animate: {
          rotate: [4, -4, 4],
          y: [0, 1, 0]
        },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      };

  // 3. Head motion
  const headMotion = currentEmotion === 'exploded'
    ? {
        // 【パーツ分解展開図】上方に大きくフワッと浮き上がる
        animate: { 
          y: [-2, -28, -24, -28, -2],
          scale: [1, 1.1, 1.06, 1.1, 1],
          rotate: [0, -2, 2, -1, 0]
        },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'skipping'
    ? {
        // 【ご機嫌るんるんスキップ】首をピョコピョコ傾げてリズムに乗る
        animate: {
          y: [-2, -8, -1, -10, -2],
          rotate: [-10, 10, -14, 14, -10],
          scale: [1, 1.08, 0.98, 1.1, 1]
        },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'happy'
    ? activeHappyVariant === 'banzai'
      ? {
          // 【バンザイ大歓喜】頭を天に仰いで満面の笑顔で左右に歓喜
          animate: { 
            rotate: [-12, 12, -12],
            y: [-8, 2, -8],
            scale: [1, 1.12, 1]
          },
          transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
        }
      : {
          // 【ウキウキ・バウンスホップ】バウンスに合わせて頭をピョコピョコ跳ねる
          animate: {
            y: [0, -4, 0, -5, 0, -9, 0],
            rotate: [-5, 5, -6, 6, -10, 10, 0],
            scale: [1, 1.04, 1, 1.06, 1, 1.1, 1]
          },
          transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
        }
    : currentEmotion === 'troubled'
    ? {
        // 困惑して首をかしげたりオロオロ左右に振る
        animate: { 
          rotate: [-14, 14, -14, 0, -10, 10, 0],
          y: [2, 5, 2, 4, 2],
          x: [-1, 1, -1, 1, 0]
        },
        transition: { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        // 頭をキョロキョロ左右に見回して探索するモーション
        animate: { 
          rotate: [0, -14, -14, 0, 14, 14, 0, -6, 0],
          x: [0, -3, -3, 0, 3, 3, 0, -1, 0],
          y: [0, -1, -1, 0, 1, 1, 0, 0, 0]
        },
        transition: { duration: headSearchDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        animate: {
          rotate: [-1.5, 1.5, -1.5],
          y: [0, -0.8, 0]
        },
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
      };

  // 4. Legs motion (左脚・右脚を左右独立分割制御)
  // 左脚 (Left Leg)
  const legLeftMotion = currentEmotion === 'exploded'
    ? {
        // 【パーツ分解展開図】左斜め下方へ展開
        animate: {
          x: [-1, -14, -11, -14, -1],
          y: [2, 24, 20, 24, 2],
          rotate: [0, -12, -7, -12, 0],
          scale: [1, 1.05, 1.02, 1.05, 1]
        },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'skipping'
    ? {
        // 【ご機嫌るんるんスキップ】軽やかに大地を蹴るスキップステップ
        animate: {
          y: [0, -8, 2, -12, 0, -5, 0],
          rotate: [-16, 14, -20, 18, -12, 10, -16],
          skewX: [-8, 8, -10, 10, -6, 6, -8],
          scaleY: [1, 0.88, 1.04, 0.84, 1]
        },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'happy'
    ? activeHappyVariant === 'banzai'
      ? {
          // 【バンザイ大歓喜】大地を蹴ってピョンピョン歓喜ジャンプ
          animate: {
            y: [0, -10, 0, -5, 0],
            skewX: [-6, 6, -6, 6, -6],
            scaleY: [1, 0.85, 1, 0.92, 1],
            rotate: [0, -5, 0, -3, 0]
          },
          transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
        }
      : {
          // 【ウキウキ・バウンスホップ】つま先でポン！ポン！ピョン！
          animate: {
            y: [0, -5, 0, -7, 0, -12, 0],
            skewX: [-4, 4, -5, 5, -6, 6, 0],
            scaleY: [1, 0.92, 1, 0.90, 1, 0.86, 1],
            rotate: [-2, 3, -2, 4, -3, 5, 0]
          },
          transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
        }
    : currentEmotion === 'troubled'
    ? {
        // 内股気味にモジモジ立ち止まる
        animate: {
          skewX: [4, -4, 4, -4, 4],
          scaleX: [0.96, 1.04, 0.96, 1.04, 0.96],
          rotate: [3, -2, 3, -2, 3],
          y: [0, 1, 0, 1, 0]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        // 交互に大地を踏みしめる二足歩行ステップ（右脚と逆位相！）
        animate: {
          rotate: [-16, 16, -16],
          skewX: [-6, 6, -6],
          y: [0, -3, 0],
          scaleY: [0.94, 1.05, 0.94]
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        animate: {
          scaleY: [1, 0.98, 1],
          y: [0, 0.5, 0]
        },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      };

  // 右脚 (Right Leg)
  const legRightMotion = currentEmotion === 'exploded'
    ? {
        // 【パーツ分解展開図】右斜め下方へ展開
        animate: {
          x: [1, 14, 11, 14, 1],
          y: [2, 24, 20, 24, 2],
          rotate: [0, 12, 7, 12, 0],
          scale: [1, 1.05, 1.02, 1.05, 1]
        },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'skipping'
    ? {
        // 【ご機嫌るんるんスキップ】軽やかに大地を蹴るスキップステップ
        animate: {
          y: [2, -12, 0, -8, 2, -5, 2],
          rotate: [14, -16, 18, -20, 10, -12, 14],
          skewX: [8, -8, 10, -10, 6, -6, 8],
          scaleY: [1.04, 0.84, 1, 0.88, 1]
        },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'happy'
    ? activeHappyVariant === 'banzai'
      ? {
          // 【バンザイ大歓喜】大地を蹴ってピョンピョン歓喜ジャンプ
          animate: {
            y: [0, -10, 0, -5, 0],
            skewX: [6, -6, 6, -6, 6],
            scaleY: [1, 0.85, 1, 0.92, 1],
            rotate: [0, 5, 0, 3, 0]
          },
          transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
        }
      : {
          // 【ウキウキ・バウンスホップ】つま先でポン！ポン！ピョン！
          animate: {
            y: [0, -5, 0, -7, 0, -12, 0],
            skewX: [4, -4, 5, -5, 6, -6, 0],
            scaleY: [1, 0.92, 1, 0.90, 1, 0.86, 1],
            rotate: [2, -3, 2, -4, 3, -5, 0]
          },
          transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
        }
    : currentEmotion === 'troubled'
    ? {
        // 内股気味にモジモジ立ち止まる
        animate: {
          skewX: [-4, 4, -4, 4, -4],
          scaleX: [0.96, 1.04, 0.96, 1.04, 0.96],
          rotate: [-3, 2, -3, 2, -3],
          y: [0, 1, 0, 1, 0]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        // 交互に大地を踏みしめる二足歩行ステップ（左脚と逆位相！）
        animate: {
          rotate: [16, -16, 16],
          skewX: [6, -6, 6],
          y: [0, -3, 0],
          scaleY: [1.05, 0.94, 1.05]
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        animate: {
          scaleY: [1, 0.98, 1],
          y: [0, 0.5, 0]
        },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      };

  return (
    <motion.div 
      className={hideBackground ? "isolate relative flex justify-center items-center" : `isolate relative flex justify-center items-center ${theme.radius.md} ${
        currentEmotion === 'exploded' ? 'overflow-visible' : 'overflow-hidden'
      } border-2 ${
        currentEmotion === 'happy'
          ? 'border-amber-400 ring-2 ring-amber-300' 
          : currentEmotion === 'exploded'
          ? 'border-sky-400 ring-2 ring-sky-300/80 shadow-inner'
          : currentEmotion === 'skipping'
          ? 'border-amber-500 ring-2 ring-amber-300/80 shadow-inner'
          : currentEmotion === 'troubled'
          ? 'border-blue-400 ring-2 ring-blue-300/60'
          : 'border-stone-300'
      }`} 
      style={hideBackground ? { width: containerWidth || size, height: containerHeight || size } : bgStyle}
    >
      {/* エリア環境・天候背景 (自動探索中) */}
      {locationId && (
        <LocationEnvironment 
          locationId={locationId} 
          animateScroll={animateExploration}
          speedMultiplier={speedMultiplier} 
          weatherType={weatherType}
        />
      )}

      {/* 0. Exploded View (分解展開図) Particles & Hologram Overlay */}
      {currentEmotion === 'exploded' && (
        <>
          {/* 設計図風の青いグリッド・パルスガイド */}
          <div className="absolute inset-0 bg-sky-500/10 pointer-events-none z-10 border border-sky-400/40 rounded-xl" />
          <motion.div 
            className="absolute inset-2 border border-dashed border-sky-400/60 rounded-lg pointer-events-none z-10"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.98, 1.01, 0.98] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-2 left-2 text-sky-500 text-xs z-20 pointer-events-none select-none font-bold"
            animate={{ rotate: 360 }}
            transition={{ duration: 6.0, repeat: Infinity, ease: "linear" }}
          >
            <Gi.GiCog className="inline text-sky-500" />
          </motion.div>
          <motion.div 
            className="absolute bottom-2 right-2 text-sky-500 text-xs z-20 pointer-events-none select-none font-bold"
            animate={{ rotate: -360 }}
            transition={{ duration: 7.0, repeat: Infinity, ease: "linear" }}
          >
            <Gi.GiSpanner className="inline text-sky-500" />
          </motion.div>
          {!hideBubble && (
            <motion.div 
              className="absolute top-1 left-1/2 -translate-x-1/2 bg-sky-600/95 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-md z-30 pointer-events-none whitespace-nowrap border border-sky-300 flex items-center gap-1"
              animate={{ y: [-1, -3, -1], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <Gi.GiPuzzle className="text-sky-200 inline text-[11px]" />
              <span>パーツ展開図</span>
            </motion.div>
          )}
        </>
      )}

      {/* 0.5 Skipping (ご機嫌るんるんスキップ) Particles & Notes (文字表示は削除) */}
      {currentEmotion === 'skipping' && (
        <>
          <motion.div 
            className="absolute top-2 left-2 text-amber-500 text-xs sm:text-sm z-20 pointer-events-none select-none font-bold"
            animate={{ scale: [0.8, 1.3, 0.8], y: [0, -6, 0], rotate: [-15, 15, -15] }}
            transition={{ duration: 0.85, repeat: Infinity }}
          >
            <Gi.GiMusicalNotes className="inline text-amber-500" />
          </motion.div>
          <motion.div 
            className="absolute top-2 right-2 text-yellow-500 text-xs sm:text-sm z-20 pointer-events-none select-none font-bold"
            animate={{ scale: [1.2, 0.8, 1.2], y: [-4, 2, -4], rotate: [15, -15, 15] }}
            transition={{ duration: 0.95, repeat: Infinity }}
          >
            <Gi.GiSparkles className="inline text-yellow-500" />
          </motion.div>
          <motion.div 
            className="absolute bottom-2 left-3 text-rose-400 text-xs z-20 pointer-events-none select-none"
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            <Gi.GiHearts className="inline text-rose-400" />
          </motion.div>
        </>
      )}

      {/* 1. Happy Particles & Effects */}
      {currentEmotion === 'happy' && (
        <>
          <motion.div 
            className="absolute top-2 left-3 text-amber-400 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.6, 1.3, 0.8, 1.4, 0.6], opacity: [0.4, 1, 0.5, 1, 0.4], y: [-2, -8, -2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Gi.GiSparkles className="inline text-amber-400" />
          </motion.div>
          <motion.div 
            className="absolute top-2 right-3 text-yellow-400 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [1.3, 0.7, 1.4, 0.6, 1.3], opacity: [1, 0.4, 1, 0.5, 1], y: [-6, 0, -6] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Gi.GiStarFormation className="inline text-yellow-400" />
          </motion.div>
          {!hideBubble && (
            <motion.div 
              className="absolute top-1 left-1/2 -translate-x-1/2 bg-amber-500/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm z-20 pointer-events-none whitespace-nowrap border border-amber-300 flex items-center gap-1"
              animate={{ y: [-1, -4, -1], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 1.0, repeat: Infinity }}
            >
              <span className="flex items-center gap-1">
                {animateVictory ? (
                  <>
                    <Gi.GiTrophyCup className="text-amber-200 inline" />
                    <span>勝利！</span>
                  </>
                ) : hasPendingDrops ? (
                  <>
                    <Gi.GiPresent className="text-amber-200 inline" />
                    <span>{activeHappyVariant === 'banzai' ? '素材発見！バンザイ！' : '素材発見！るんるん♪'}</span>
                  </>
                ) : (
                  <>
                    <Gi.GiSparkles className="text-amber-200 inline" />
                    <span>{activeHappyVariant === 'banzai' ? 'バンザイ大歓喜！' : 'ウキウキホップ♪'}</span>
                  </>
                )}
              </span>
            </motion.div>
          )}
          <motion.div 
            className="absolute bottom-2 right-3 text-amber-500 text-[10px] sm:text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.8, 1.3, 0.7, 1.2, 0.8], opacity: [0.5, 1, 0.4, 1, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            <Gi.GiMusicalNotes className="inline text-amber-500" />
          </motion.div>
          <motion.div 
            className="absolute bottom-2 left-3 text-yellow-400 text-[10px] sm:text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [1.3, 0.8, 1.2, 0.7, 1.3], opacity: [1, 0.5, 1, 0.4, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          >
            <Gi.GiPartyPopper className="inline text-amber-500" />
          </motion.div>
        </>
      )}

      {/* 2. Troubled Particles & Effects */}
      {currentEmotion === 'troubled' && (
        <>
          <motion.div 
            className="absolute top-2 right-4 text-blue-400 text-sm sm:text-base z-10 pointer-events-none select-none font-bold"
            animate={{ y: [-2, 4, -2], opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            <Gi.GiWaterDrop className="inline text-blue-400" />
          </motion.div>
          <motion.div 
            className="absolute top-3 left-4 text-cyan-300 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ y: [-3, 2, -3], opacity: [0.4, 0.9, 0.4], rotate: [-10, 10, -10] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            <Gi.GiWaterDrop className="inline text-cyan-300" />
          </motion.div>
          {!hideBubble && (animateExploration || locationId) && (
            <motion.div 
              className="absolute top-1 left-1/2 -translate-x-1/2 bg-blue-900/90 text-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm z-20 pointer-events-none whitespace-nowrap border border-blue-400 flex items-center gap-1"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <span className="flex items-center gap-1">
                <Gi.GiSwirlRing className="inline text-blue-300" />
                <span>見つからない…</span>
              </span>
            </motion.div>
          )}
          <motion.div 
            className="absolute bottom-2 right-5 text-indigo-300 text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Gi.GiHelp className="inline text-indigo-300" />
          </motion.div>
        </>
      )}

      {/* Robot Parts with animations (アーム＆レッグ左右独立レンダリング) */}
      <motion.div style={{ width: size, height: size }} className="relative z-0" {...bodyMotion}>
        {/* レッグ (左脚 & 右脚 を左右別々に分割独立制御) */}
        {LegsComp && (
          <>
            {/* 左脚 (Left Leg) */}
            <motion.div 
              id="robot-visual-part-leg-left"
              className="absolute inset-0 w-full h-full z-[1] will-change-transform pointer-events-none"
              style={{
                transformOrigin: '38% 72%',
                clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
              }}
              {...(animateCrafting ? animProps(0, 50) : legLeftMotion)}
            >
              <LegsComp color={legsColor} className="w-full h-full block" />
            </motion.div>

            {/* 右脚 (Right Leg) */}
            <motion.div 
              id="robot-visual-part-leg-right"
              className="absolute inset-0 w-full h-full z-[1] will-change-transform pointer-events-none"
              style={{
                transformOrigin: '62% 72%',
                clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
              }}
              {...(animateCrafting ? animProps(0.1, 50) : legRightMotion)}
            >
              <LegsComp color={legsColor} className="w-full h-full block" />
            </motion.div>
          </>
        )}

        {/* 胴体 (Body) */}
        {BodyComp && (
          <motion.div 
            id="robot-visual-part-body"
            className="absolute inset-0 w-full h-full z-[2] will-change-transform pointer-events-none" 
            style={{ transformOrigin: '50% 55%' }}
            {...(animateCrafting ? animProps(0.3, -50) : {})}
          >
            <BodyComp color={bodyColor} className="w-full h-full block" />
          </motion.div>
        )}

        {/* アーム (左腕 & 右腕 を設定された肩位置をピボットとして左右別々に分割独立制御) */}
        {ArmsComp && (
          <>
            {/* 左腕 (Left Arm) - 設定された leftShoulder 座標を回転中心として使用 */}
            <motion.div 
              id="robot-visual-part-arm-left"
              className="absolute inset-0 w-full h-full z-[3] will-change-transform pointer-events-none"
              style={{
                transformOrigin: `${safeJoints.leftShoulder.x}% ${safeJoints.leftShoulder.y}%`,
                clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
              }}
              {...(animateCrafting ? animProps(0.5, -30) : armLeftMotion)}
            >
              <ArmsComp color={armsColor} className="w-full h-full block" />
            </motion.div>

            {/* 右腕 (Right Arm) - 設定された rightShoulder 座標を回転中心として使用 */}
            <motion.div 
              id="robot-visual-part-arm-right"
              className="absolute inset-0 w-full h-full z-[3] will-change-transform pointer-events-none"
              style={{
                transformOrigin: `${safeJoints.rightShoulder.x}% ${safeJoints.rightShoulder.y}%`,
                clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
              }}
              {...(animateCrafting ? animProps(0.65, -30) : armRightMotion)}
            >
              <ArmsComp color={armsColor} className="w-full h-full block" />
            </motion.div>
          </>
        )}

        {/* 頭部 (Head) */}
        {HeadComp && (
          <motion.div 
            id="robot-visual-part-head"
            className="absolute inset-0 w-full h-full z-[4] will-change-transform pointer-events-none" 
            style={{ transformOrigin: '50% 32%' }}
            {...(animateCrafting ? animProps(0.9, -80) : headMotion)}
          >
            <HeadComp color={headColor} className="w-full h-full block" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

