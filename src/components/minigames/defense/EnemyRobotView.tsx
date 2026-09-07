import React, { useState } from 'react';
import { Enemy } from './types';
import * as Gi from 'react-icons/gi';

interface EnemyRobotViewProps {
  enemy: Enemy;
}

export const EnemyRobotView: React.FC<EnemyRobotViewProps> = React.memo(({ enemy }) => {
  const [imgError, setImgError] = useState(false);
  const hpPercent = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));

  // 歩行・走行フレーム（bobPhaseに基づくアニメーション）
  const animFrame = Math.sin((enemy.bobPhase || 0) * 12) > 0 ? 1 : 2;

  // Kenneyのロボットスプライト画像取得
  const getKenneyRobotSprite = () => {
    switch (enemy.type) {
      case 'super_giant_boss':
      case 'giant_boss':
      case 'large_boss':
      case 'boss':
        return '/assets/kenney/robots/robot_3Dred.png';
      case 'mid_boss':
        return '/assets/kenney/robots/robot_3Dyellow.png';
      case 'mini_boss':
        return '/assets/kenney/robots/robot_3Dblue.png';
      case 'golem':
        return animFrame === 1
          ? '/assets/kenney/robots/robot_redDrive1.png'
          : '/assets/kenney/robots/robot_redDrive2.png';
      case 'walker':
        return animFrame === 1
          ? '/assets/kenney/robots/robot_yellowDrive1.png'
          : '/assets/kenney/robots/robot_yellowDrive2.png';
      case 'crawler':
        return animFrame === 1
          ? '/assets/kenney/robots/robot_blueDrive1.png'
          : '/assets/kenney/robots/robot_blueDrive2.png';
      case 'sprinter':
        return animFrame === 1
          ? '/assets/kenney/robots/robot_greenDrive2.png'
          : '/assets/kenney/robots/robot_greenDrive1.png';
      case 'scout':
      default:
        return animFrame === 1
          ? '/assets/kenney/robots/robot_greenDrive1.png'
          : '/assets/kenney/robots/robot_greenDrive2.png';
    }
  };

  // フォールバック用のメカアイコン取得
  const renderFallbackIcon = () => {
    switch (enemy.type) {
      case 'super_giant_boss':
      case 'giant_boss':
      case 'large_boss':
      case 'boss':
        return <Gi.GiMegabot className="w-full h-full text-purple-400 drop-shadow-md" />;
      case 'mid_boss':
        return <Gi.GiWarBonnet className="w-full h-full text-amber-400 drop-shadow-md" />;
      case 'mini_boss':
        return <Gi.GiLaserSparks className="w-full h-full text-sky-400 drop-shadow-md" />;
      case 'golem':
        return <Gi.GiRobotGolem className="w-full h-full text-rose-500 drop-shadow-md" />;
      case 'walker':
        return <Gi.GiTrackedRobot className="w-full h-full text-amber-400 drop-shadow-md" />;
      case 'crawler':
        return <Gi.GiMonoWheelRobot className="w-full h-full text-sky-400 drop-shadow-md" />;
      case 'sprinter':
        return <Gi.GiFastArrow className="w-full h-full text-emerald-400 drop-shadow-md animate-pulse" />;
      case 'scout':
      default:
        return <Gi.GiSpiderBot className="w-full h-full text-emerald-400 drop-shadow-md" />;
    }
  };

  // 歩行の微小な上下ボブ（個体ごとに位相が異なり、重なっても個々の動きが明確）
  const bobY = Math.sin((enemy.bobPhase || 0) * 10) * 1.5;

  const isBoss = [
    'boss',
    'mini_boss',
    'mid_boss',
    'large_boss',
    'giant_boss',
    'super_giant_boss',
  ].includes(enemy.type);

  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center justify-center will-change-transform"
      style={{
        left: enemy.x,
        top: enemy.y + bobY,
        width: enemy.size,
        height: enemy.size,
        transform: `translate(-50%, -50%) ${enemy.facingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
        zIndex: Math.floor(enemy.y) + (isBoss ? 50 : 15),
      }}
    >
      {/* 影 */}
      <div
        className="absolute -bottom-1 w-4/5 h-2.5 bg-stone-950/50 rounded-full blur-[1px]"
        style={{ transform: enemy.facingLeft ? 'scaleX(-1)' : 'none' }}
      />

      {/* HPバー */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bg-stone-950/90 rounded-full p-[0.5px] border border-stone-400 shadow-sm z-30 pointer-events-none ${
          isBoss ? '-top-5 w-14 h-2' : '-top-3.5 w-9 h-1.5'
        }`}
        style={{ transform: enemy.facingLeft ? 'scaleX(-1)' : 'none' }}
      >
        <div
          className={`h-full rounded-full transition-all duration-75 ${
            isBoss
              ? 'bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400'
              : hpPercent > 50
              ? 'bg-emerald-400'
              : hpPercent > 25
              ? 'bg-amber-400'
              : 'bg-rose-500'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
        {isBoss && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black text-amber-300 bg-stone-950/90 px-1 rounded leading-none border border-amber-500/40">
            {Math.ceil(enemy.hp)}
          </div>
        )}
      </div>

      

      {/* Kenney ロボットスプライト本体（くっきりとしたドロップシャドウで他の敵と重なっても輪郭を維持） */}
      <div
        className={`w-full h-full flex items-center justify-center transition-all ${
          enemy.isHit
            ? 'brightness-200 contrast-200 filter scale-110 hue-rotate-90'
            : 'drop-shadow-[0_3px_5px_rgba(0,0,0,0.7)]'
        }`}
      >
        {!imgError ? (
          <img
            src={getKenneyRobotSprite()}
            alt={enemy.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{ minWidth: enemy.size, minHeight: enemy.size }}
          />
        ) : (
          <div className="w-full h-full p-1 bg-stone-900/90 rounded-full border border-stone-600 flex items-center justify-center shadow-lg">
            {renderFallbackIcon()}
          </div>
        )}
      </div>

      {/* ロボットのLEDアイセンサー光芒 */}
      <div
        className={`absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
          enemy.type === 'boss'
            ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]'
            : enemy.type === 'golem'
            ? 'bg-rose-400 shadow-[0_0_6px_#fb7185]'
            : enemy.type === 'walker'
            ? 'bg-amber-300 shadow-[0_0_5px_#fcd34d]'
            : enemy.type === 'crawler'
            ? 'bg-sky-300 shadow-[0_0_5px_#7dd3fc]'
            : 'bg-emerald-300 shadow-[0_0_5px_#86efac]'
        } animate-pulse pointer-events-none`}
        style={{ transform: enemy.facingLeft ? 'scaleX(-1)' : 'none' }}
      />
    </div>
  );
});



