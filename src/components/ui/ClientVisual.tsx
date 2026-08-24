import React from 'react';
import { RequestRank } from '../../core/models';

const colorMap: Record<string, string> = {
  ' ': 'transparent',
  'G': '#fbbf24', // Gold
  'R': '#ef4444', // Red
  'F': '#fde68a', // Fair Skin
  'K': '#1e293b', // Black / Dark Gray
  'W': '#f8fafc', // White
  'P': '#7e22ce', // Purple
  'A': '#94a3b8', // Gray
};

const ART_KING = [
  "      GGGG      ",
  "     G GR G     ",
  "    G GGG G G   ",
  "   GGGGGGGGGGG  ",
  "   FFFFFFFFFFF  ",
  "   FF K F K FF  ",
  "   FFFFFFFFFFF  ",
  "    WWWWWWWWW   ",
  "   WWWWWWWWWWW  ",
  "   WWWWWWWWWWW  ",
  "    WWWWWWWWW   ",
  "     WWWWWWW    ",
  "      RRRRR     ",
  "     RRRRRRR    ",
  "    RRRRRRRRR   ",
  "   RRRRRRRRRRR  "
];

const ART_NOBLE = [
  "      KKKKK     ",
  "     KKKKKKK    ",
  "     KKKKKKK    ",
  "    KKKKKKKKK   ",
  "     FFFFFFF    ",
  "    FF K F G FF ", // Gold monocle?
  "    FFFFFFFFFFF ",
  "     FFFFFFF    ",
  "      FFFFF     ",
  "     PPPPPPP    ",
  "    PPP P PPP   ",
  "   PP PP PP PP  ",
  "  PPPP P P PPPP ",
  "  PPPPP P PPPPP ",
  "  PPPPPPPPPPPPP ",
  "  PPPPPPPPPPPPP "
];

const ART_OLDMAN = [
  "                ",
  "                ",
  "      WWWWW     ",
  "     WWFFFWW    ",
  "    WWFK F KFW  ",
  "    WFFFFFFFFW  ",
  "     WFFFFFFW   ",
  "      WWWWW     ",
  "     WW   WW    ",
  "     AAAAAAAA   ",
  "    AAAAAAAAAA  ",
  "   AAAAAAAAAAAA ",
  "   AAAAAAAAAAAA ",
  "   AAAAAAAAAAAA ",
  "   AAAAAAAAAAAA ",
  "   AAAAAAAAAAAA "
];

interface ClientVisualProps {
  rank: RequestRank;
  size?: number;
}

export const ClientVisual: React.FC<ClientVisualProps> = ({ rank, size = 64 }) => {
  let grid = ART_OLDMAN;
  if (rank === 'King') grid = ART_KING;
  else if (rank === 'Noble') grid = ART_NOBLE;

  const gridSize = 16;
  const pixelSize = size / gridSize;

  const elements = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char !== ' ') {
        elements.push(
          <rect
            key={`${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={colorMap[char] || '#000'}
          />
        );
      }
    }
  }

  return (
    <div 
      className="flex justify-center items-center bg-stone-200 rounded-md overflow-hidden shrink-0 border border-stone-300"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {elements}
      </svg>
    </div>
  );
};
