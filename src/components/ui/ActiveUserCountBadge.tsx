import React from 'react';
import { Users, Compass, Wrench, FileText } from 'lucide-react';
import { theme } from '../../styles/theme';

interface ActiveUserCountBadgeProps {
  type: 'expedition' | 'assembly' | 'request';
  count: number;
  className?: string;
  label?: string;
}

/**
 * 遠征、ロボット組立、または依頼受注でactiveテーブルに登録されている他ユーザー人数を表示するバッジ
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

  const badgeStyle = isExpedition
    ? theme.activeCountBadge.expedition
    : isAssembly
    ? theme.activeCountBadge.assembly
    : theme.activeCountBadge.request;

  const dotStyle = isExpedition
    ? theme.activeCountBadge.pulseDotSky
    : isAssembly
    ? theme.activeCountBadge.pulseDotAmber
    : theme.activeCountBadge.pulseDotIndigo;

  const defaultText = isExpedition
    ? `${count}人遠征中`
    : isAssembly
    ? `${count}人組立中`
    : `${count}人受注中`;

  const displayText = label || defaultText;

  const defaultTitle = isExpedition
    ? `現在${count}人のプレイヤーがこの場所へ遠征中`
    : isAssembly
    ? `現在${count}人のプレイヤーがロボット組立中`
    : `現在${count}人のプレイヤーがこの依頼を受注中`;

  return (
    <span
      className={`${badgeStyle} ${className}`}
      title={defaultTitle}
    >
      <span className={dotStyle} />
      {isExpedition && <Compass size={12} className="shrink-0 text-sky-300" />}
      {isAssembly && <Wrench size={12} className="shrink-0 text-amber-300" />}
      {isRequest && <FileText size={12} className="shrink-0 text-indigo-300" />}
      <Users size={11} className="shrink-0 opacity-80" />
      <span>{displayText}</span>
    </span>
  );
};
