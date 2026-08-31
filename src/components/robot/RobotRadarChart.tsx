import React, { useMemo } from 'react';
import { Robot } from '../../core/models';
import { motion } from 'motion/react';

export interface RobotStatsData {
  hp: number;
  power: number;
  defense: number;
  agility: number;
  dexterity: number;
  intelligence: number;
}

export interface StatKeyConfig {
  key: keyof RobotStatsData;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  description: string;
}

export const STAT_CONFIGS: StatKeyConfig[] = [
  { key: 'hp', label: '耐久力', shortLabel: 'HP', icon: '❤️', color: '#ef4444', description: 'ロボットの生命力・タフネス' },
  { key: 'power', label: '攻撃力', shortLabel: 'POW', icon: '⚔️', color: '#f97316', description: '遠征・自動探索での素材ドロップ枠を増加' },
  { key: 'defense', label: '防御力', shortLabel: 'DEF', icon: '🛡️', color: '#3b82f6', description: 'バトルや探索中のダメージを軽減' },
  { key: 'agility', label: '速度', shortLabel: 'AGI', icon: '⚡', color: '#eab308', description: '遠征および自動探索の所要時間を大幅短縮' },
  { key: 'dexterity', label: '探索力', shortLabel: 'DEX', icon: '🎯', color: '#10b981', description: 'レア素材の発見率・手先の器用さ向上' },
  { key: 'intelligence', label: '解析力', shortLabel: 'INT', icon: '🔮', color: '#8b5cf6', description: '属性効果の最大化や特殊発見率の上昇' },
];

interface RobotRadarChartProps {
  stats?: RobotStatsData;
  robot?: Robot;
  compareStats?: RobotStatsData;
  compareRobot?: Robot;
  size?: number;
  themeStyle?: 'cyber' | 'workshop' | 'light';
  showLabels?: boolean;
  showValues?: boolean;
  maxVal?: number;
  className?: string;
  animate?: boolean;
}

export const RobotRadarChart: React.FC<RobotRadarChartProps> = ({
  stats,
  robot,
  compareStats,
  compareRobot,
  size = 180,
  themeStyle = 'cyber',
  showLabels = true,
  showValues = true,
  maxVal,
  className = '',
  animate = true,
}) => {
  const currentStats: RobotStatsData = useMemo(() => {
    if (stats) return stats;
    if (robot) return robot.stats;
    return { hp: 10, power: 10, defense: 10, agility: 10, dexterity: 10, intelligence: 10 };
  }, [stats, robot]);

  const targetCompareStats: RobotStatsData | null = useMemo(() => {
    if (compareStats) return compareStats;
    if (compareRobot) return compareRobot.stats;
    return null;
  }, [compareStats, compareRobot]);

  // 動的な最大値計算（見やすいスケールになるように設定）
  const chartMax = useMemo(() => {
    if (maxVal) return maxVal;
    const values = [
      currentStats.hp,
      currentStats.power,
      currentStats.defense,
      currentStats.agility,
      currentStats.dexterity,
      currentStats.intelligence,
    ];
    if (targetCompareStats) {
      values.push(
        targetCompareStats.hp,
        targetCompareStats.power,
        targetCompareStats.defense,
        targetCompareStats.agility,
        targetCompareStats.dexterity,
        targetCompareStats.intelligence
      );
    }
    const max = Math.max(...values);
    // 最低でも30、または最大値+5刻み
    return Math.max(30, Math.ceil(max * 1.15 / 10) * 10);
  }, [currentStats, targetCompareStats, maxVal]);

  const center = size / 2;
  const radius = (size / 2) - (showLabels ? 30 : 10);
  const angleStep = (Math.PI * 2) / STAT_CONFIGS.length;

  // 各軸の座標計算
  const getCoordinates = (index: number, value: number, max: number) => {
    const ratio = Math.min(1, Math.max(0.05, value / max));
    const angle = index * angleStep - Math.PI / 2;
    const x = center + Math.cos(angle) * (radius * ratio);
    const y = center + Math.sin(angle) * (radius * ratio);
    return { x, y, angle };
  };

  // 背景の同心グリッド（20%, 40%, 60%, 80%, 100%）
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const gridPolygons = useMemo(() => {
    return gridLevels.map(level => {
      const points = STAT_CONFIGS.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius * level);
        const y = center + Math.sin(angle) * (radius * level);
        return `${x},${y}`;
      }).join(' ');
      return { level, points };
    });
  }, [center, radius, angleStep]);

  // 現在のロボットのポリゴンポイント
  const currentPoints = useMemo(() => {
    return STAT_CONFIGS.map((stat, i) => {
      const val = currentStats[stat.key] || 0;
      const { x, y } = getCoordinates(i, val, chartMax);
      return `${x},${y}`;
    }).join(' ');
  }, [currentStats, chartMax, center, radius]);

  // 比較ロボットのポリゴンポイント
  const comparePoints = useMemo(() => {
    if (!targetCompareStats) return null;
    return STAT_CONFIGS.map((stat, i) => {
      const val = targetCompareStats[stat.key] || 0;
      const { x, y } = getCoordinates(i, val, chartMax);
      return `${x},${y}`;
    }).join(' ');
  }, [targetCompareStats, chartMax, center, radius]);

  const isCyber = themeStyle === 'cyber';
  const isDark = themeStyle === 'cyber' || themeStyle === 'workshop';

  // カラー設定
  const strokeColor = isCyber ? '#10b981' : '#f59e0b';
  const fillColor = isCyber ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
  const axisStroke = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.18)';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* 背景グリッド同心多角形 */}
        {gridPolygons.map(({ level, points }) => (
          <polygon
            key={level}
            points={points}
            fill={level === 1.0 && isCyber ? 'rgba(6, 78, 59, 0.1)' : 'none'}
            stroke={gridStroke}
            strokeWidth={level === 1.0 ? '1.5' : '1'}
            strokeDasharray={level < 1.0 ? '2,2' : undefined}
          />
        ))}

        {/* 各軸の放射線 */}
        {STAT_CONFIGS.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + Math.cos(angle) * radius;
          const y2 = center + Math.sin(angle) * radius;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={axisStroke}
              strokeWidth="1"
            />
          );
        })}

        {/* 比較対象ロボットのポリゴン (背面に青紫系で表示) */}
        {comparePoints && (
          <g>
            <polygon
              points={comparePoints}
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            />
            {STAT_CONFIGS.map((stat, i) => {
              if (!targetCompareStats) return null;
              const val = targetCompareStats[stat.key] || 0;
              const { x, y } = getCoordinates(i, val, chartMax);
              return (
                <circle
                  key={`compare-dot-${i}`}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="#3b82f6"
                />
              );
            })}
          </g>
        )}

        {/* 現在のロボットのポリゴン (メイン) */}
        <polygon
          points={currentPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          className="transition-all duration-300 ease-out"
        />

        {/* 各頂点のドット */}
        {STAT_CONFIGS.map((stat, i) => {
          const val = currentStats[stat.key] || 0;
          const { x, y } = getCoordinates(i, val, chartMax);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="3.5"
              fill={strokeColor}
              stroke={isDark ? '#09090b' : '#ffffff'}
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
          );
        })}

        {/* ラベル & 数値表示 */}
        {showLabels && STAT_CONFIGS.map((stat, i) => {
          const angle = i * angleStep - Math.PI / 2;
          // ラベル用のオフセット位置
          const labelDist = radius + (showValues ? 22 : 14);
          const lx = center + Math.cos(angle) * labelDist;
          const ly = center + Math.sin(angle) * labelDist;
          
          const val = currentStats[stat.key] || 0;
          const compVal = targetCompareStats ? targetCompareStats[stat.key] || 0 : null;
          const diff = compVal !== null ? val - compVal : null;

          return (
            <g key={`label-${stat.key}`} transform={`translate(${lx}, ${ly})`}>
              {/* アイコン + 短縮名 */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[9px] font-mono font-bold ${isDark ? 'fill-stone-300' : 'fill-stone-700'}`}
                y={showValues ? -6 : 0}
              >
                {stat.shortLabel}
              </text>
              
              {/* 数値 */}
              {showValues && (
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[10px] font-mono font-black ${
                    isCyber ? 'fill-emerald-400' : 'fill-amber-600'
                  }`}
                  y={6}
                >
                  {val}
                  {diff !== null && diff !== 0 && (
                    <tspan
                      className={`text-[8px] ${diff > 0 ? 'fill-emerald-400' : 'fill-rose-400'}`}
                      dx="2"
                    >
                      {diff > 0 ? `+${diff}` : `${diff}`}
                    </tspan>
                  )}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 比較時の凡例 */}
      {targetCompareStats && (
        <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: strokeColor }} />
            <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>
              {robot?.name || '選択中'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-blue-500" />
            <span className={isDark ? 'text-stone-400' : 'text-stone-500'}>
              {compareRobot?.name || '比較対象'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
