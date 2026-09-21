import React from 'react';
import { Users, Compass, Wrench, FileText, Activity } from 'lucide-react';
import { theme } from '../../styles/theme';

interface ActiveUserCountBadgeProps {
  type: 'expedition' | 'assembly' | 'request' | 'playing';
  count: number;
  className?: string;
  label?: string;
}

/**
 * 遠征、ロボット組立、依頼受注、または工房全体のプレイ中人数を表示するバッジ
 */
export const ActiveUserCountBadge: React.FC<ActiveUserCountBadgeProps> = ({
  type,
  count,
  className = '',
  label
}) => {
  // 0人以下の場合は表示しない（他のユーザーがactiveテーブルに登録されている場合のみ表示）
  if (!count || count <= 0) {
    return null;
  }

  const isExpedition = type === 'expedition';
  const isAssembly = type === 'assembly';
  const isRequest = type === 'request';
  const isPlaying = type === 'playing';

  const badgeStyle = isExpedition
    ? theme.activeCountBadge.expedition
    : isAssembly
    ? theme.activeCountBadge.assembly
    : isRequest
    ? theme.activeCountBadge.request
    : theme.activeCountBadge.playing;

  const dotStyle = isExpedition
    ? theme.activeCountBadge.pulseDotSky
    : isAssembly
    ? theme.activeCountBadge.pulseDotAmber
    : isRequest
    ? theme.activeCountBadge.pulseDotIndigo
    : theme.activeCountBadge.pulseDotEmerald;

  const defaultText = isExpedition
    ? `他の工房で${count}人遠征中`
    : isAssembly
    ? `他の工房で${count}人組立中`
    : isRequest
    ? `他の工房で${count}人依頼中`
    : `現在${count}人プレイ中`;

  const displayText = label || defaultText;

  const defaultTitle = isExpedition
    ? `現在他の工房で${count}人のプレイヤーがこの場所へ遠征中`
    : isAssembly
    ? `現在他の工房で${count}人のプレイヤーがロボット組立中`
    : isRequest
    ? `現在他の工房で${count}人のプレイヤーがこの依頼を進行中`
    : `現在${count}人のプレイヤーが作業・プレイ中`;

  return (
    <span
      className={`${badgeStyle} ${className}`}
      title={defaultTitle}
    >
      <span className={dotStyle} />
      {isExpedition && <Compass size={12} className="shrink-0 text-sky-300" />}
      {isAssembly && <Wrench size={12} className="shrink-0 text-amber-300" />}
      {isRequest && <FileText size={12} className="shrink-0 text-indigo-300" />}
      {isPlaying && <Activity size={12} className="shrink-0 text-emerald-300" />}
      <Users size={11} className="shrink-0 opacity-80" />
      <span>{displayText}</span>
    </span>
  );
};
