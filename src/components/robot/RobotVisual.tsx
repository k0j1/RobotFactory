import React from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import { theme } from '../../styles/theme';

import { motion } from 'motion/react';

interface RobotVisualProps {
  robot: any;
  size?: number; // width/height in px
  animateCrafting?: boolean;
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
    <div className={`flex justify-center items-center ${theme.radius.md} overflow-hidden border border-stone-300`} style={bgStyle}>
      <div className="w-[80%] h-[80%] relative flex justify-center items-center">
        {Comp && <Comp color={color} viewBox={viewBox} className="w-full h-full" />}
      </div>
    </div>
  );
};

export const RobotVisual: React.FC<RobotVisualProps> = ({ robot, size = 120, animateCrafting = false }) => {
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
  const bgStyle = {
    width: size, height: size,
    backgroundColor: '#e7e5e4',
    backgroundImage: `linear-gradient(#d6d3d1 2px, transparent 2px), linear-gradient(90deg, #d6d3d1 2px, transparent 2px)`,
    backgroundSize: `${bgGridSize}px ${bgGridSize}px`,
    backgroundPosition: 'center center',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
  };

  const animProps = (delay: number, startY: number) => 
    animateCrafting 
      ? {
          initial: { opacity: 0, y: startY },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, type: "spring", bounce: 0.4 }
        }
      : {};

  return (
    <div className={`relative flex justify-center items-center ${theme.radius.md} overflow-hidden border-2 border-stone-300`} style={bgStyle}>
      {LegsComp && (
        <motion.div className="absolute inset-0 w-full h-full z-10" {...animProps(0, 50)}>
          <LegsComp color={legsColor} className="w-full h-full" />
        </motion.div>
      )}
      {BodyComp && (
        <motion.div className="absolute inset-0 w-full h-full z-20" {...animProps(0.3, -50)}>
          <BodyComp color={bodyColor} className="w-full h-full" />
        </motion.div>
      )}
      {ArmsComp && (
        <motion.div className="absolute inset-0 w-full h-full z-30" {...animProps(0.6, -30)}>
          <ArmsComp color={armsColor} className="w-full h-full" />
        </motion.div>
      )}
      {HeadComp && (
        <motion.div className="absolute inset-0 w-full h-full z-40" {...animProps(0.9, -80)}>
          <HeadComp color={headColor} className="w-full h-full" />
        </motion.div>
      )}
    </div>
  );
};

