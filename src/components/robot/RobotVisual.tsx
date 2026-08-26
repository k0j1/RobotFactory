import React from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import { theme } from '../../styles/theme';

import { motion } from 'motion/react';

interface RobotVisualProps {
  robot: any;
  size?: number; // width/height in px for the robot itself
  containerWidth?: number | string;
  containerHeight?: number | string;
  animateCrafting?: boolean;
  animateVictory?: boolean;
  animateExploration?: boolean;
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
  animateExploration = false 
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

  const bgGridSize = Math.max(10, size / 8);
  const defaultBgStyle = {
    width: containerWidth || size, height: containerHeight || size,
    backgroundColor: '#e7e5e4',
    backgroundImage: `linear-gradient(#d6d3d1 2px, transparent 2px), linear-gradient(90deg, #d6d3d1 2px, transparent 2px)`,
    backgroundSize: `${bgGridSize}px ${bgGridSize}px`,
    backgroundPosition: 'center center',
    boxShadow: animateVictory ? '0 0 25px rgba(234, 179, 8, 0.4), inset 0 0 20px rgba(254, 240, 138, 0.3)' : 'inset 0 0 20px rgba(0,0,0,0.05)'
  };

  const caveSvgPattern = encodeURIComponent(`
    <svg width='120' height='120' xmlns='http://www.w3.org/2000/svg'>
      <rect width='120' height='120' fill='#292524'/>
      <path d='M0,0 L15,35 L30,0 L50,45 L75,0 L95,25 L120,0 Z' fill='#1c1917'/>
      <path d='M0,120 L20,80 L45,120 L65,70 L90,120 L105,90 L120,120 Z' fill='#44403c'/>
      <circle cx='25' cy='60' r='4' fill='#57534e'/>
      <circle cx='85' cy='70' r='5' fill='#57534e'/>
      <circle cx='60' cy='45' r='3' fill='#57534e'/>
    </svg>
  `.trim().replace(/\n/g, ''));

  const explorationBgStyle = {
    width: containerWidth || size, height: containerHeight || size,
    backgroundColor: '#292524',
    backgroundImage: `url("data:image/svg+xml;utf8,${caveSvgPattern}")`,
    backgroundSize: '120px 120px',
    boxShadow: 'inset 0 0 25px rgba(0,0,0,0.8)'
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

  // Victory pose animations
  const victoryBodyJump = animateVictory
    ? {
        animate: { 
          y: [0, -10, 0, -6, 0],
          scale: [1, 1.04, 1, 1.02, 1],
          rotate: [0, -2, 2, -1, 0]
        },
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
      }
    : animateExploration
    ? {
        animate: { 
          y: [0, -3, 0, -3, 0],
          rotate: [-1.5, 1.5, -1.5, 1.5, -1.5],
        },
        transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  const victoryArmPump = animateVictory
    ? {
        animate: { 
          y: [-2, -14, -4, -14, -2], 
          scaleY: [1, 1.15, 1, 1.15, 1],
          rotate: [-4, 6, -4, 6, -4]
        },
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
      }
    : animateExploration
    ? {
        animate: { 
          rotate: [-8, 8, -8, 8, -8],
          y: [0, -2, 0, -2, 0]
        },
        transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  const victoryHeadTilt = animateVictory
    ? {
        animate: { 
          rotate: [-6, 6, -6],
          y: [0, -3, 0]
        },
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
      }
    : animateExploration
    ? {
        // 頭をキョロキョロ左右に見回して洞窟を探索するモーション
        animate: { 
          rotate: [0, -14, -14, 0, 14, 14, 0, -6, 0],
          x: [0, -3, -3, 0, 3, 3, 0, -1, 0],
          y: [0, -1, -1, 0, 1, 1, 0, 0, 0]
        },
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  const explorationLegsWalk = animateExploration && !animateVictory
    ? {
        animate: {
          skewX: [-5, 5, -5, 5, -5],
          y: [0, -2, 0, -2, 0],
          scaleY: [1, 0.94, 1, 0.94, 1]
        },
        transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  const explorationBodyBob = animateExploration && !animateVictory
    ? {
        animate: {
          y: [0, -1.5, 0, -1.5, 0],
        },
        transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
      }
    : {};

  return (
    <motion.div 
      className={`isolate relative flex justify-center items-center ${theme.radius.md} overflow-hidden border-2 ${animateVictory ? 'border-amber-400 ring-2 ring-amber-300' : 'border-stone-300'}`} 
      style={bgStyle}
      animate={animateExploration ? { backgroundPosition: ["0px 0px", "-120px 0px"] } : {}}
      transition={animateExploration ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
    >
      {/* Victory sparkles effect */}
      {animateVictory && (
        <>
          <motion.div 
            className="absolute top-1 left-2 text-amber-400 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.6, 1.2, 0.8, 1.3, 0.6], opacity: [0.4, 1, 0.5, 1, 0.4], y: [-2, -6, -2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div 
            className="absolute top-1 right-2 text-yellow-500 text-xs sm:text-sm z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [1.2, 0.7, 1.3, 0.6, 1.2], opacity: [1, 0.4, 1, 0.5, 1], y: [-4, 0, -4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ⭐
          </motion.div>
          <motion.div 
            className="absolute bottom-1 right-2 text-amber-500 text-[10px] sm:text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [0.8, 1.3, 0.7, 1.2, 0.8], opacity: [0.5, 1, 0.4, 1, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div 
            className="absolute bottom-1 left-2 text-yellow-400 text-[10px] sm:text-xs z-10 pointer-events-none select-none font-bold"
            animate={{ scale: [1.3, 0.8, 1.2, 0.7, 1.3], opacity: [1, 0.5, 1, 0.4, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          >
            🎉
          </motion.div>
        </>
      )}

      {/* Robot Parts with animations */}
      <motion.div style={{ width: size, height: size }} className="relative z-0" {...victoryBodyJump}>
        {LegsComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[1]" {...(animateCrafting ? animProps(0, 50) : explorationLegsWalk)}>
            <LegsComp color={legsColor} className="w-full h-full" />
          </motion.div>
        )}
        {BodyComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[2]" {...(animateCrafting ? animProps(0.3, -50) : explorationBodyBob)}>
            <BodyComp color={bodyColor} className="w-full h-full" />
          </motion.div>
        )}
        {ArmsComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[3]" {...(animateCrafting ? animProps(0.6, -30) : victoryArmPump)}>
            <ArmsComp color={armsColor} className="w-full h-full" />
          </motion.div>
        )}
        {HeadComp && (
          <motion.div className="absolute inset-0 w-full h-full z-[4]" {...(animateCrafting ? animProps(0.9, -80) : victoryHeadTilt)}>
            <HeadComp color={headColor} className="w-full h-full" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

