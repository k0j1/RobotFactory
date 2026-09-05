import React, { useState } from 'react';
import { Robot, RobotPart, AttributeColors, AttributeNames } from '../../core/models';
import { theme } from '../../styles/theme';
import { Card, Button, Badge } from '../ui/core';
import { RobotVisual, PartVisual } from './RobotVisual';
import * as Gi from 'react-icons/gi';

interface RobotGalleryCardProps {
  robot: Robot;
  statusLabel?: 'owned' | 'delivered' | 'archived';
}

const STAT_CONFIG: { key: keyof RobotPart['stats']; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'hp', label: 'HP', icon: <Gi.GiHeartPlus size={13} />, color: 'text-rose-600' },
  { key: 'power', label: '攻撃', icon: <Gi.GiBroadsword size={13} />, color: 'text-amber-600' },
  { key: 'defense', label: '防御', icon: <Gi.GiShield size={13} />, color: 'text-blue-600' },
  { key: 'agility', label: '素早さ', icon: <Gi.GiSprint size={13} />, color: 'text-emerald-600' },
  { key: 'dexterity', label: '器用', icon: <Gi.GiCrosshair size={13} />, color: 'text-purple-600' },
  { key: 'intelligence', label: '知力', icon: <Gi.GiBrain size={13} />, color: 'text-cyan-600' },
];

const PART_TYPE_CONFIG: { type: 'head' | 'body' | 'arms' | 'legs'; label: string; icon: React.ReactNode }[] = [
  { type: 'head', label: 'ヘッド', icon: <Gi.GiMechaHead size={14} /> },
  { type: 'body', label: 'ボディ', icon: <Gi.GiChestArmor size={14} /> },
  { type: 'arms', label: 'アーム', icon: <Gi.GiMechanicalArm size={14} /> },
  { type: 'legs', label: 'レッグ', icon: <Gi.GiLegArmor size={14} /> },
];

export const RobotGalleryCard: React.FC<RobotGalleryCardProps> = ({ robot, statusLabel = 'archived' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 総合戦闘力スコア
  const totalScore = robot.stats.hp + robot.stats.power + robot.stats.defense + 
                     robot.stats.agility + robot.stats.dexterity + (robot.stats.intelligence || 1);

  // 最高レアリティ
  const maxRarity = Math.max(
    robot.parts.head?.rarity || 1,
    robot.parts.body?.rarity || 1,
    robot.parts.arms?.rarity || 1,
    robot.parts.legs?.rarity || 1
  );

  const formattedDate = new Date(robot.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card 
      id={`robot-gallery-card-${robot.id}`}
      className={`${theme.workshop.mainCard} transition-all duration-200 hover:border-amber-500 hover:shadow-lg`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* ロボット外観 */}
        <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
          <div className="relative p-2 bg-stone-100 rounded-xl border border-stone-300 shadow-inner flex items-center justify-center">
            <RobotVisual robot={robot} size={110} />
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
              <Gi.GiStarFormation size={11} />
              <span>★{maxRarity}</span>
            </div>
          </div>
        </div>

        {/* ロボット基本情報 & ステータス */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-1.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`${theme.typography.h3} text-stone-800 tracking-wide`}>
                  {robot.name}
                </h3>
                {statusLabel === 'owned' && (
                  <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2">
                    所持中
                  </Badge>
                )}
                {statusLabel === 'delivered' && (
                  <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2">
                    納品済
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                <Gi.GiClockwork size={12} />
                クラフト日: {formattedDate}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-500 font-bold block">総合性能値</span>
              <span className="text-lg font-black text-amber-700 flex items-center justify-end gap-0.5">
                <Gi.GiLaurelsTrophy size={16} className="text-amber-500" />
                {totalScore}
              </span>
            </div>
          </div>

          {/* 属性バッジ一覧 */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 flex-wrap">
            <span className="text-[11px] font-bold text-stone-500">構成属性:</span>
            {PART_TYPE_CONFIG.map(({ type, label }) => {
              const part = robot.parts[type];
              if (!part) return null;
              const attr = part.attribute;
              const color = AttributeColors[attr] || '#78716c';
              return (
                <span
                  key={`${robot.id}-${type}-attr`}
                  className="text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 text-white"
                  style={{ backgroundColor: color }}
                  title={`${label}: ${AttributeNames[attr]}属性`}
                >
                  {label.slice(0, 1)}:{AttributeNames[attr]}
                </span>
              );
            })}
          </div>

          {/* 総合ステータスグリッド */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-stone-100/80 p-2 rounded-lg border border-stone-200">
            {STAT_CONFIG.map(({ key, label, icon, color }) => (
              <div key={key} className="flex flex-col items-center justify-center p-1 bg-white rounded border border-stone-200/80">
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${color}`}>
                  {icon}
                  {label}
                </span>
                <span className="text-xs font-black text-stone-800">
                  {robot.stats[key] || 0}
                </span>
              </div>
            ))}
          </div>

          {/* アコーディオン開閉ボタン */}
          <div className="flex justify-end pt-1">
            <Button
              id={`toggle-components-btn-${robot.id}`}
              size="sm"
              variant={isExpanded ? 'secondary' : 'primary'}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs flex items-center gap-1 py-1 px-3"
            >
              <Gi.GiGears size={14} />
              {isExpanded ? 'パーツステータスを閉じる' : '構成パーツ詳細 (Component Stats)'}
              <span className="text-[10px] ml-0.5">{isExpanded ? '▲' : '▼'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 展開時：各構成パーツの個別ステータス詳細 (Component Stats) */}
      {isExpanded && (
        <div 
          id={`robot-component-stats-${robot.id}`}
          className="mt-4 pt-3 border-t-2 border-amber-200/80 space-y-3 bg-amber-50/40 p-3 rounded-xl border border-amber-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Gi.GiCpu size={15} className="text-amber-600" />
              構成パーツ別ステータス (Component Stats)
            </h4>
            <span className="text-[10px] text-stone-500">
              各パーツの個別能力とレアリティ詳細
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {PART_TYPE_CONFIG.map(({ type, label, icon }) => {
              const part = robot.parts[type];
              if (!part) return null;
              const attrColor = AttributeColors[part.attribute] || '#78716c';

              return (
                <div 
                  key={`${robot.id}-detail-${type}`}
                  className="bg-white p-2.5 rounded-lg border border-stone-300 shadow-2xs flex gap-3 items-center"
                >
                  {/* パーツグラフィック */}
                  <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    <PartVisual part={part} size={48} />
                  </div>

                  {/* パーツ情報 & ステータス */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-stone-500 shrink-0">{icon}</span>
                        <span className="text-xs font-bold text-stone-800 truncate" title={part.name}>
                          {part.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span 
                          className="text-[9px] px-1 py-0.2 rounded font-bold text-white"
                          style={{ backgroundColor: attrColor }}
                        >
                          {AttributeNames[part.attribute]}
                        </span>
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 py-0.2 rounded border border-amber-300">
                          ★{part.rarity}
                        </span>
                      </div>
                    </div>

                    {/* 個別ステータス */}
                    <div className="grid grid-cols-6 gap-1 text-center bg-stone-50 p-1 rounded border border-stone-100">
                      {STAT_CONFIG.map(({ key, label, color }) => (
                        <div key={`${type}-${key}`} className="flex flex-col">
                          <span className={`text-[8px] font-bold ${color}`}>{label}</span>
                          <span className="text-[10px] font-bold text-stone-700">
                            {part.stats ? part.stats[key] : 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
