import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as Gi from 'react-icons/gi';
import { RobotPart, PartType } from '../../core/models';
import { PartVisual } from '../robot/RobotVisual';
import { theme } from '../../styles/theme';

interface PartSelectCarouselProps {
  title: string;
  icon: React.ReactNode;
  parts: RobotPart[];
  selectedId: string;
  onSelect: (id: string) => void;
  type: PartType;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PartSelectCarousel: React.FC<PartSelectCarouselProps> = ({
  title,
  icon,
  parts,
  selectedId,
  onSelect,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse,
}) => {
  // 外部からの制御があればそれを優先、なければ内部state
  const [internalCollapsed, setInternalCollapsed] = useState(!!selectedId);

  const isControlled = externalIsCollapsed !== undefined;
  const isCollapsed = isControlled ? externalIsCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (isControlled && externalOnToggleCollapse) {
      externalOnToggleCollapse();
    } else {
      setInternalCollapsed(prev => !prev);
    }
  };

  const selectedPart = parts.find(p => p.id === selectedId);

  const handleSelectPart = (id: string) => {
    const nextId = selectedId === id ? '' : id;
    onSelect(nextId);
    // パーツを選択した場合は自動的に折りたたむ（選択解除した場合は開いたまま）
    if (nextId) {
      if (isControlled && externalOnToggleCollapse && !isCollapsed) {
        externalOnToggleCollapse();
      } else if (!isControlled) {
        setInternalCollapsed(true);
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-white/80 border border-stone-200 rounded-xl overflow-hidden shadow-2xs transition-all">
      {/* 折りたたみヘッダーバー */}
      <div
        onClick={toggleCollapse}
        className="flex justify-between items-center px-3 py-2 bg-stone-100/90 hover:bg-stone-200/80 cursor-pointer select-none transition-colors border-b border-stone-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-700 text-sm flex items-center justify-center">
            {icon}
          </span>
          <span className="text-xs font-bold text-stone-800 tracking-wide">
            {title}
          </span>
          <span className="text-[10px] text-stone-500 bg-stone-200 px-1.5 py-0.2 rounded font-mono">
            {parts.length}個
          </span>
          {selectedPart && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded flex items-center gap-0.5">
              <Gi.GiCheckMark size={9} /> 選択済: {selectedPart.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-stone-600">
          <span className="text-[10px] font-medium text-stone-500">
            {isCollapsed ? '展開する' : '折りたたむ'}
          </span>
          {isCollapsed ? (
            <ChevronDown size={16} className="text-stone-500" />
          ) : (
            <ChevronUp size={16} className="text-stone-500" />
          )}
        </div>
      </div>

      {/* 折りたたまれている時のサマリー表示 */}
      {isCollapsed && (
        <div className="p-2 sm:p-2.5 bg-[#faf8f5] flex items-center justify-between gap-2">
          {selectedPart ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="bg-white p-1 rounded-lg border border-stone-200 shadow-2xs shrink-0">
                  <PartVisual part={selectedPart} size={36} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1 rounded truncate">
                      {'★'.repeat(selectedPart.rarity || 1)} {selectedPart.attribute}
                    </span>
                    <span className="text-xs font-bold text-stone-800 truncate">
                      {selectedPart.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-stone-600">
                    <span>HP:{selectedPart.stats.hp}</span>
                    <span>PW:{selectedPart.stats.power}</span>
                    <span>DF:{selectedPart.stats.defense}</span>
                    <span className="text-amber-700">AGI:{selectedPart.stats.agility}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollapse();
                  }}
                  className="px-2 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors cursor-pointer"
                >
                  変更
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('');
                  }}
                  className="px-1.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-md transition-colors cursor-pointer"
                  title="選択解除"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={toggleCollapse}
              className="w-full py-2 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-lg cursor-pointer hover:bg-stone-100/60 hover:text-stone-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>パーツ未選択 (タップしてパーツを選択)</span>
              <ChevronDown size={14} />
            </div>
          )}
        </div>
      )}

      {/* 展開されている時のカルーセル一覧 */}
      {!isCollapsed && (
        <div className="p-2 sm:p-2.5">
          <div
            className="flex overflow-x-auto gap-2 pb-1.5 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {parts.length === 0 ? (
              <div className="text-[10px] text-stone-400 p-4 border border-dashed border-stone-300 rounded-lg w-full text-center bg-stone-50">
                選択できるパーツがありません
              </div>
            ) : (
              parts.map((p) => {
                const isSelected = selectedId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPart(p.id)}
                    className={`snap-center shrink-0 w-32 flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-pointer shadow-2xs relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-stone-200 bg-white hover:border-blue-300 hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 text-blue-600 bg-blue-100 rounded-full p-0.5 shadow-sm z-10">
                        <Gi.GiCheckMark size={10} />
                      </div>
                    )}

                    <div className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mb-1 w-full text-center truncate">
                      {'★'.repeat(p.rarity || 1)} {p.attribute}
                    </div>

                    <div className="bg-stone-100 p-1.5 rounded-lg border border-stone-200 mb-1.5">
                      <PartVisual part={p} size={48} />
                    </div>

                    <span className="text-[10px] font-bold text-stone-800 leading-tight truncate w-full text-center">
                      {p.name}
                    </span>

                    <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 w-full mt-1.5 pt-1.5 border-t border-stone-200 text-[8px] font-mono text-stone-600">
                      <span className="truncate">HP:{p.stats.hp}</span>
                      <span className="truncate">PW:{p.stats.power}</span>
                      <span className="truncate">DF:{p.stats.defense}</span>
                      <span className="truncate text-amber-700">AG:{p.stats.agility}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
