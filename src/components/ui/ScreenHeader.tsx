import React from 'react';

interface ScreenHeaderProps {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  rightElement?: React.ReactNode;
}

/**
 * 工房画面のヘッダータイトルと同じデザイン・余白・配色を各画面で一貫して提供する共通ヘッダーコンポーネント
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  icon,
  title,
  badge,
  rightElement,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 px-1 mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-stone-700 font-bold truncate">
          <span className="text-amber-800 shrink-0 flex items-center">{icon}</span>
          <span className="truncate">{title}</span>
        </div>
        {badge}
      </div>
      {rightElement && (
        <div className="flex items-center shrink-0">{rightElement}</div>
      )}
    </div>
  );
};
