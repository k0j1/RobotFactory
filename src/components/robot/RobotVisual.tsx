import React from 'react';
import { Robot } from '../../core/models';
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

export const RobotVisual: React.FC<RobotVisualProps> = ({ robot, size = 120 }) => {
  const { head, body, arms, legs, color } = robot.visuals;
  
  const headGrid = HEADS[head % HEADS.length];
  const bodyGrid = BODIES[body % BODIES.length];
  const armsGrid = ARMS[arms % ARMS.length];
  const legsGrid = LEGS[legs % LEGS.length];

  // 8x8 grids. We stack them: Head (8), Body/Arms (8), Legs (8) -> Total height 24, width 24 (if arms spread)
  // Let's create a 24x24 canvas
  const CANVAS_SIZE = 24;
  const pixelSize = size / CANVAS_SIZE;

  return (
    <div className={`flex justify-center items-center ${theme.colors.surfaceDark} ${theme.radius.md} overflow-hidden`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Head */}
        <PixelGrid grid={headGrid} color={color} xOffset={8 * pixelSize} yOffset={0 * pixelSize} pixelSize={pixelSize} />
        {/* Arms (behind or beside body) */}
        <PixelGrid grid={armsGrid} color={color} xOffset={0 * pixelSize} yOffset={8 * pixelSize} pixelSize={pixelSize} />
        <PixelGrid grid={armsGrid} color={color} xOffset={16 * pixelSize} yOffset={8 * pixelSize} pixelSize={pixelSize} />
        {/* Body */}
        <PixelGrid grid={bodyGrid} color={color} xOffset={8 * pixelSize} yOffset={8 * pixelSize} pixelSize={pixelSize} />
        {/* Legs */}
        <PixelGrid grid={legsGrid} color={color} xOffset={8 * pixelSize} yOffset={16 * pixelSize} pixelSize={pixelSize} />
      </svg>
    </div>
  );
};
