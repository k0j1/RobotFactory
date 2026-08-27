import React from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import { theme } from '../../styles/theme';
import { LocationEnvironment } from './LocationEnvironment';

import { motion } from 'motion/react';

interface RobotVisualProps {
  robot: any;
  size?: number; // width/height in px for the robot itself
  containerWidth?: number | string;
  containerHeight?: number | string;
  animateCrafting?: boolean;
  animateVictory?: boolean;
  animateExploration?: boolean;
  emotion?: 'auto' | 'normal' | 'happy' | 'troubled' | 'searching';
  hasPendingDrops?: boolean;
  isTroubled?: boolean;
  locationId?: string; // 探索地に応じた背景・天気
  agility?: number; // ロボットの素早さ（歩行・アニメーション速度に反映）
}

export const PartVisual: React.FC<{ part: any, size?: number }> = ({ part, size = 64 }) => {
  if (!part) return null;

  let Comp = null;
  if (part.type === 'head') Comp = SVG_HEADS[part.visualIndex % SVG_HEADS?.length];
  else if (part.type === 'body') Comp = SVG_BODIES[part.visualIndex % SVG_BODIES?.length];
  else if (part.type === 'arms') Comp = SVG_ARMS[part.visualIndex % SVG_ARMS?.length];
  else if (part.type === 'legs') Comp = SVG_LEGS[part.visualIndex % SVG_LEGS?.length];

  const color = AttributeColors[part.attribute] || '#000';
  
  const viewBox = part.type === 'head' ? '20 0 60 45' :
                  part.type === 'body' ? '25 32 50 48' :
                  part.type === 'arms' ? '5 38 90 42' :
                  '20 68 60 32';

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
  hasPendingDrops = false,
  isTroubled = false,
  locationId,
  agility
}) => {
  const parts = robot?.parts || {};
  const { head, body, arms, legs } = parts;
  
  const HeadComp = head ? SVG_HEADS[head.visualIndex % SVG_HEADS?.length] : null;
  const BodyComp = body ? SVG_BODIES[body.visualIndex % SVG_BODIES?.length] : null;
  const ArmsComp = arms ? SVG_ARMS[arms.visualIndex % SVG_ARMS?.length] : null;
  const LegsComp = legs ? SVG_LEGS[legs.visualIndex % SVG_LEGS?.length] : null;

  // Use AttributeColors based on part's attribute
  const headColor = head ? AttributeColors[head.attribute] : '#000';
  const bodyColor = body ? AttributeColors[body.attribute] : '#000';
  const armsColor = arms ? AttributeColors[arms.attribute] : '#000';
  const legsColor = legs ? AttributeColors[legs.attribute] : '#000';

  // ロボットのAgility（props.agility または robot.stats.agility）
  const robotAgility = agility ?? (robot?.stats?.agility || 0);

  // Agilityに応じた速度倍率 (基本1.0、Agility 100で1.5倍、Agility 300で2.5倍)
  const speedMultiplier = 1.0 + Math.min(2.5, (robotAgility / 100) * 0.5);

  // 歩行・探索アニメーション周期（Agilityが高いと素早くキビキビ動く）
  const walkDuration = Math.max(0.28, 0.7 / speedMultiplier);
  const headSearchDuration = Math.max(1.2, 2.8 / speedMultiplier);
  const bgScrollDuration = Math.max(0.5, 1.5 / speedMultiplier);

  // Determine current emotion state
  const currentEmotion: 'happy' | 'troubled' | 'searching' | 'normal' = 
    emotion && emotion !== 'auto'
      ? (emotion as 'happy' | 'troubled' | 'searching' | 'normal')
      : animateVictory || hasPendingDrops
      ? 'happy'
      : isTroubled
      ? 'troubled'
      : animateExploration
      ? 'searching'
      : 'normal';

  const bgGridSize = Math.max(10, size / 8);
  const defaultBgStyle = {
    width: containerWidth || size, height: containerHeight || size,
    backgroundColor: '#e7e5e4',
    backgroundImage: `linear-gradient(#d6d3d1 2px, transparent 2px), linear-gradient(90deg, #d6d3d1 2px, transparent 2px)`,
    backgroundSize: `${bgGridSize}px ${bgGridSize}px`,
    backgroundPosition: 'center center',
    boxShadow: (currentEmotion === 'happy' || animateVictory) ? '0 0 25px rgba(234, 179, 8, 0.4), inset 0 0 20px rgba(254, 240, 138, 0.3)' : 'inset 0 0 20px rgba(0,0,0,0.05)'
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

  // === ANIMATION DEFINITIONS ===

  // 1. Body motion
  const bodyMotion = currentEmotion === 'happy'
    ? {
        animate: { 
          y: [0, -12, 0, -7, 0],
          scale: [1, 1.06, 0.97, 1.03, 1],
          rotate: [0, -3, 3, -1.5, 0]
        },
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
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
    : {};

  // 2. Arms motion
  const armsMotion = currentEmotion === 'happy'
    ? {
        // 両手を高く上げて「やったー！」とバンザイ＆ガッツポーズ
        animate: { 
          y: [-4, -16, -6, -16, -4], 
          scaleY: [1, 1.18, 1, 1.18, 1],
          rotate: [-20, 20, -20, 20, -20]
        },
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'troubled'
    ? {
        // 頭を抱えてオロオロする動き
        animate: { 
          y: [-12, -8, -12, -8, -12],
          rotate: [-15, 15, -15, 15, -15],
          scaleX: [0.95, 1.05, 0.95, 1.05, 0.95]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        animate: { 
          rotate: [-8, 8, -8, 8, -8],
          y: [0, -2, 0, -2, 0]
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  // 3. Head motion
  const headMotion = currentEmotion === 'happy'
    ? {
        // 嬉しそうに頷く＆笑顔で左右に傾げる
        animate: { 
          rotate: [-8, 8, -8],
          y: [-3, 1, -3],
          scale: [1, 1.05, 1]
        },
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
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
    : {};

  // 4. Legs motion
  const legsMotion = currentEmotion === 'happy'
    ? {
        // ぴょんぴょん跳ねる＆足踏み
        animate: {
          y: [0, -5, 0, -3, 0],
          skewX: [-4, 4, -4, 4, -4],
          scaleY: [1, 0.92, 1, 0.95, 1]
        },
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'troubled'
    ? {
        // モジモジ立ち止まる
        animate: {
          skewX: [4, -4, 4, -4, 4],
          scaleX: [0.96, 1.04, 0.96, 1.04, 0.96],
          y: [0, 1, 0, 1, 0]
        },
        transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
    : currentEmotion === 'searching'
    ? {
        animate: {
          skewX: [-6, 6, -6, 6, -6],
          y: [0, -2, 0, -2, 0],
          scaleY: [1, 0.93, 1, 0.93, 1]
        },
        transition: { duration: walkDuration, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  return (
    <motion.div 
      className={`isolate relative flex justify-center items-center ${theme.radius.md} overflow-hidden border-2 ${
        currentEmotion === 'happy'
          ? 'border-amber-400 ring-2 ring-amber-300' 
          : currentEmotion === 'troubled'
          ? 'border-blue-400 ring-2 ring-blue-300/60'
          : 'border-stone-300'
      }`} 
      style={bgStyle}
    >
      {/* エリア環境・天候背景 (自動探索中) */}
      {animateExploration && (
        <LocationEnvironment 
          locationId={locationId} 
          speedMultiplier={speedMultiplier} 
        />
      )}
      {/* 1. Happy Particles & Effects */}
      {currentEmotion === 'happy' && (
        <>
          <motion.div 
            className="absolute top-2 left-3 text-amber-400 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.6, 1.3, 0.8, 1.4, 0.6], opacity: [0.4, 1, 0.5, 1, 0.4], y: [-2, -8, -2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div 
            className="absolute top-2 right-3 text-yellow-400 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [1.3, 0.7, 1.4, 0.6, 1.3], opacity: [1, 0.4, 1, 0.5, 1], y: [-6, 0, -6] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ⭐
          </motion.div>
          <motion.div 
            className="absolute top-1 left-1/2 -translate-x-1/2 bg-amber-500/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm z-20 pointer-events-none whitespace-nowrap border border-amber-300 flex items-center gap-1"
            animate={{ y: [-1, -4, -1], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.0, repeat: Infinity }}
          >
            <span>{animateVictory ? '🏆 勝利！' : '🎁 素材発見！'}</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-2 right-3 text-amber-500 text-[10px] sm:text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.8, 1.3, 0.7, 1.2, 0.8], opacity: [0.5, 1, 0.4, 1, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            ♪
          </motion.div>
          <motion.div 
            className="absolute bottom-2 left-3 text-yellow-400 text-[10px] sm:text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [1.3, 0.8, 1.2, 0.7, 1.3], opacity: [1, 0.5, 1, 0.4, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          >
            🎉
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
            💦
          </motion.div>
          <motion.div 
            className="absolute top-3 left-4 text-cyan-300 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ y: [-3, 2, -3], opacity: [0.4, 0.9, 0.4], rotate: [-10, 10, -10] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            💧
          </motion.div>
          <motion.div 
            className="absolute top-1 left-1/2 -translate-x-1/2 bg-blue-900/90 text-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm z-20 pointer-events-none whitespace-nowrap border border-blue-400 flex items-center gap-1"
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <span>🌀 見つからない…</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-2 right-5 text-indigo-300 text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ❓
          </motion.div>
        </>
      )}

      {/* Robot Parts with animations */}
      <motion.div style={{ width: size, height: size }} className="relative z-0" {...bodyMotion}>
        {LegsComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[1]" {...(animateCrafting ? animProps(0, 50) : legsMotion)}>
            <LegsComp color={legsColor} className="w-full h-full" />
          </motion.div>
        )}
        {BodyComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[2]" {...(animateCrafting ? animProps(0.3, -50) : {})}>
            <BodyComp color={bodyColor} className="w-full h-full" />
          </motion.div>
        )}
        {ArmsComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[3]" {...(animateCrafting ? animProps(0.6, -30) : armsMotion)}>
            <ArmsComp color={armsColor} className="w-full h-full" />
          </motion.div>
        )}
        {HeadComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[4]" {...(animateCrafting ? animProps(0.9, -80) : headMotion)}>
            <HeadComp color={headColor} className="w-full h-full" />
            
            {/* Dynamic Facial Emotion Overlay on Head */}
            {currentEmotion === 'happy' && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ top: '-18%' }}
                animate={{ scale: [0.95, 1.1, 0.95] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <div className="bg-amber-400 text-stone-900 font-extrabold text-[9px] sm:text-[10px] px-1 py-0.5 rounded shadow-sm flex items-center gap-0.5 border border-amber-300">
                  <span>^ ▽ ^</span>
                </div>
              </motion.div>
            )}

            {currentEmotion === 'troubled' && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ top: '-18%' }}
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                <div className="bg-blue-600 text-white font-extrabold text-[9px] sm:text-[10px] px-1 py-0.5 rounded shadow-sm flex items-center gap-0.5 border border-blue-400">
                  <span>&gt; _ &lt;</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

