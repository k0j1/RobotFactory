import React from 'react';
import { Users, Compass, Wrench } from 'lucide-react';
import { theme } from '../../styles/theme';

interface ActiveUserCountBadgeProps {
  type: 'expedition' | 'assembly';
  count: number;
  className?: string;
  label?: string;
}

/**
 * 遠征またはロボット組立でactiveテーブルに登録されている他ユーザー人数を表示するバッジ
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
  const badgeStyle = isExpedition
    ? theme.activeCountBadge.expedition
    : theme.activeCountBadge.assembly;

  const dotStyle = isExpedition
    ? theme.activeCountBadge.pulseDotSky
    : theme.activeCountBadge.pulseDotAmber;

  const defaultText = isExpedition
    ? `${count}人遠征中`
    : `${count}人組立中`;

  const displayText = label || defaultText;

  return (
    <span
      className={`${badgeStyle} ${className}`}
      title={isExpedition ? `現在${count}人のプレイヤーがこの場所へ遠征中` : `現在${count}人のプレイヤーがロボット組立中`}
    >
      <span className={dotStyle} />
      {isExpedition ? <Compass size={12} className="shrink-0 text-sky-300" /> : <Wrench size={12} className="shrink-0 text-amber-300" />}
      <Users size={11} className="shrink-0 opacity-80" />
      <span>{displayText}</span>
    </span>
  );
};
