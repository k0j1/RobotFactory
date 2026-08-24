import React from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from './RobotSVGs';
import { theme } from '../../styles/theme';

interface RobotVisualProps {
  robot: Robot;
  size?: number; // width/height in px
}

export const PartVisual: React.FC<{ part: any, size?: number }> = ({ part, size = 64 }) => {
  if (!part) return null;

  let Comp = null;
  if (part.type === 'head') Comp = SVG_HEADS[part.visualIndex % SVG_HEADS.length];
  else if (part.type === 'body') Comp = SVG_BODIES[part.visualIndex % SVG_BODIES.length];
  else if (part.type === 'arms') Comp = SVG_ARMS[part.visualIndex % SVG_ARMS.length];
  else if (part.type === 'legs') Comp = SVG_LEGS[part.visualIndex % SVG_LEGS.length];

  const color = AttributeColors[part.attribute] || '#000';

  return (
    <div className={`flex justify-center items-center ${theme.colors.surfaceDark} ${theme.radius.md} overflow-hidden`} style={{ width: size, height: size }}>
      <div style={{ width: '80%', height: '80%', position: 'relative' }}>
        {Comp && <Comp color={color} />}
      </div>
    </div>
  );
};

export const RobotVisual: React.FC<{ robot: any, size?: number }> = ({ robot, size = 120 }) => {
  const parts = robot?.parts || {};
  const { head, body, arms, legs } = parts;
  
  const HeadComp = head ? SVG_HEADS[head.visualIndex % SVG_HEADS.length] : null;
  const BodyComp = body ? SVG_BODIES[body.visualIndex % SVG_BODIES.length] : null;
  const ArmsComp = arms ? SVG_ARMS[arms.visualIndex % SVG_ARMS.length] : null;
  const LegsComp = legs ? SVG_LEGS[legs.visualIndex % SVG_LEGS.length] : null;

  // Use AttributeColors based on part's attribute
  const headColor = head ? AttributeColors[head.attribute] : '#000';
  const bodyColor = body ? AttributeColors[body.attribute] : '#000';
  const armsColor = arms ? AttributeColors[arms.attribute] : '#000';
  const legsColor = legs ? AttributeColors[legs.attribute] : '#000';

  return (
    <div className={`relative flex justify-center items-center ${theme.colors.surfaceDark} ${theme.radius.md} overflow-hidden`} style={{ width: size, height: size }}>
      {LegsComp && (
        <div className="absolute" style={{ bottom: '5%', left: '25%', width: '50%', height: '40%', zIndex: 10 }}>
          <LegsComp color={legsColor} />
        </div>
      )}
      
      {ArmsComp && (
        <div className="absolute" style={{ top: '35%', left: '5%', width: '90%', height: '40%', zIndex: 15 }}>
          <ArmsComp color={armsColor} />
        </div>
      )}

      {BodyComp && (
        <div className="absolute" style={{ top: '30%', left: '25%', width: '50%', height: '45%', zIndex: 20 }}>
          <BodyComp color={bodyColor} />
        </div>
      )}

      {HeadComp && (
        <div className="absolute" style={{ top: '5%', left: '25%', width: '50%', height: '40%', zIndex: 30 }}>
          <HeadComp color={headColor} />
        </div>
      )}
    </div>
  );
};

