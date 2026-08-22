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

  const CANVAS_SIZE = 32;
  const pixelSize = size / CANVAS_SIZE;

  return (
    <div className={`flex justify-center items-center ${theme.colors.surfaceDark} ${theme.radius.md} overflow-hidden`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Render all parts with 0 offset since they are all 32x32 grids now */}
        <PixelGrid grid={armsGrid} color={color} xOffset={0} yOffset={0} pixelSize={pixelSize} />
        <PixelGrid grid={legsGrid} color={color} xOffset={0} yOffset={0} pixelSize={pixelSize} />
        <PixelGrid grid={bodyGrid} color={color} xOffset={0} yOffset={0} pixelSize={pixelSize} />
        <PixelGrid grid={headGrid} color={color} xOffset={0} yOffset={0} pixelSize={pixelSize} />
      </svg>
    </div>
  );
};
