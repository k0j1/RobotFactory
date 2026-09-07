import React, { useState } from 'react';
import { Tower } from './types';
import { RobotVisual } from '../../robot/RobotVisual';
import * as Gi from 'react-icons/gi';
import { AttributeColors } from '../../../core/models';

interface DefenseTowerViewProps {
  tower: Tower;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const DefenseTowerView: React.FC<DefenseTowerViewProps> = React.memo(({
  tower,
  isSelected = false,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const robot = tower.robot;

  // 主属性カラーの取得（胴体パーツまたは全パーツから取得）
  const primaryAttribute = robot.parts?.body?.attribute || robot.parts?.head?.attribute || 'none';
  const attrColor = AttributeColors[primaryAttribute] || '#f59e0b';

  return (
    <div
      className="absolute flex flex-col items-center justify-center cursor-pointer z-20"
      style={{
        left: tower.x,
        top: tower.y,
        transform: 'translate(-50%, -65%)', // ロボットの足元を台座中心に合わせる
      }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 攻撃範囲（射程）サークル：ホバー時または選択時、あるいは常時薄く表示 */}
      <div
        className={`absolute rounded-full border pointer-events-none transition-all duration-200 ${
          isSelected || isHovered
            ? 'border-amber-400/80 bg-amber-400/10 shadow-lg'
            : 'border-stone-500/20 bg-stone-500/5'
        }`}
        style={{
          width: tower.range * 2,
          height: tower.range * 2,
          left: '50%',
          top: '65%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 機体名 & 発動技ラベル */}
      <div className="mb-0.5 flex flex-col items-center gap-0.5 select-none pointer-events-none whitespace-nowrap z-30">
        <div className="bg-stone-900/95 border border-stone-600/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-stone-200 shadow-sm flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: attrColor }}
          />
          <span className="truncate max-w-[75px]">{robot.name}</span>
          <span className="text-[9px] font-mono font-bold text-red-400">P:{robot.stats.power}</span>
          <span className="text-[9px] font-mono font-bold text-amber-400">A:{robot.stats.agility}</span>
          {tower.totalKills > 0 && (
            <span className="text-[8px] text-amber-300 font-mono">
              ⚔{tower.totalKills}
            </span>
          )}
        </div>
        {/* Int & Dexによって繰り出される技名バッジ */}
        {tower.skillName && (
          <div 
            className="text-[8px] font-bold px-1.5 py-0.2 rounded-full border shadow-xs leading-tight font-mono"
            style={{
              backgroundColor: 'rgba(28, 25, 23, 0.92)',
              borderColor: tower.bulletColor || '#f59e0b',
              color: tower.bulletColor || '#fef08a',
            }}
          >
            {tower.skillName}
          </div>
        )}
      </div>

      {/* 組み立てられたロボット本体（RobotVisual） */}
      <div
        className={`relative transition-transform duration-100 flex items-center justify-center ${
          tower.attackAnim > 0 ? 'scale-105 -translate-y-1' : ''
        }`}
      >
        {/* 攻撃時のマズルフラッシュ・エネルギー放射エフェクト */}
        {tower.attackAnim > 0 && (
          <div
            className="absolute -top-1 w-6 h-6 rounded-full animate-ping pointer-events-none opacity-80"
            style={{ backgroundColor: attrColor }}
          />
        )}

        <RobotVisual
          robot={robot}
          size={58}
          hideBackground={true}
          hideBubble={true}
          emotion={tower.attackAnim > 0 ? 'happy' : 'normal'}
        />
      </div>

      {/* 防衛台座（ポディウム）と影 */}
      <div className="relative -mt-2.5 flex flex-col items-center pointer-events-none">
        {/* 影 */}
        <div className="w-12 h-3 bg-stone-950/70 rounded-full blur-xs" />
        
        {/* 台座のルーンサークル */}
        <div
          className="w-10 h-2.5 rounded-full border border-amber-500/80 bg-stone-800/90 flex items-center justify-center shadow-inner"
          style={{ borderColor: attrColor }}
        >
          <div
            className="w-4 h-1 rounded-full opacity-70"
            style={{ backgroundColor: attrColor }}
          />
        </div>
      </div>
    </div>
  );
});
