import React from 'react';
import { Robot, AttributeColors } from '../../core/models';
import { HEADS, BODIES, ARMS, LEGS } from '../../core/pixelArt';
import { theme } from '../../styles/theme';

interface RobotVisualProps {
  robot: Robot;
  size?: number; // width/height in px
}

export const PixelGrid: React.FC<{ grid: string[], color: string, xOffset: number, yOffset: number, pixelSize: number }> = ({ grid, color, xOffset, yOffset, pixelSize }) => {
  const elements = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'X') {
        elements.push(
          <rect
            key={`${x}-${y}`}
            x={xOffset + x * pixelSize}
            y={yOffset + y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={color}
          />
        );
      }
    }
  }
  return <>{elements}</>;
};

export const PartVisual: React.FC<{ part: any, size?: number }> = ({ part, size = 64 }) => {
  if (!part) return null;

  let grid = null;
  if (part.type === 'head') grid = HEADS[part.visualIndex % HEADS.length];
  else if (part.type === 'body') grid = BODIES[part.visualIndex % BODIES.length];
  else if (part.type === 'arms') grid = ARMS[part.visualIndex % ARMS.length];
  else if (part.type === 'legs') grid = LEGS[part.visualIndex % LEGS.length];

  const color = AttributeColors[part.attribute] || '#000';
  const pixelSize = size / 32;

  return (
    <div className={`flex justify-center items-center ${theme.colors.surfaceDark} ${theme.radius.md} overflow-hidden`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {grid && <PixelGrid grid={grid} color={color} xOffset={0} yOffset={0} pixelSize={pixelSize} />}
      </svg>
    </div>
  );
};

export const RobotVisual: React.FC<{ robot: any, size?: number }> = ({ robot, size = 120 }) => {
  const parts = robot?.parts || {};
  const { head, body, arms, legs } = parts;
  
  const headGrid = head ? HEADS[head.visualIndex % HEADS.length] : null;
  const bodyGrid = body ? BODIES[body.visualIndex % BODIES.length] : null;
  const armsGrid = arms ? ARMS[arms.visualIndex % ARMS.length] : null;
  const legsGrid = legs ? LEGS[legs.visualIndex % LEGS.length] : null;

  const CANVAS_SIZE = 32;
  const pixelSize = size / CANVAS_SIZE;
  
  // Use AttributeColors based on part's attribute
  const headColor = head ? AttributeColors[head.attribute] : '#000';
  const bodyColor = body ? AttributeColors[body.attribute] : '#000';
  const armsColor = arms ? AttributeColors[arms.attribute] : '#000';
  const legsColor = legs ? AttributeColors[legs.attribute] : '#000';

  return (
    <div className={`flex justify-center items-center ${theme.colors.surfaceDark} ${theme.radius.md} overflow-hidden`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {armsGrid && <PixelGrid grid={armsGrid} color={armsColor} xOffset={0} yOffset={0} pixelSize={pixelSize} />}
        {legsGrid && <PixelGrid grid={legsGrid} color={legsColor} xOffset={0} yOffset={0} pixelSize={pixelSize} />}
        {bodyGrid && <PixelGrid grid={bodyGrid} color={bodyColor} xOffset={0} yOffset={0} pixelSize={pixelSize} />}
        {headGrid && <PixelGrid grid={headGrid} color={headColor} xOffset={0} yOffset={0} pixelSize={pixelSize} />}
      </svg>
    </div>
  );
};
