import React, { useState } from 'react';
import { Card, Button, Badge } from '../../ui/core';
import { theme } from '../../../styles/theme';
import * as Gi from 'react-icons/gi';
import { Robot, GameState } from '../../../core/models';
import { 
  OTHELLO_MEMORIES, 
  OTHELLO_MEMORY_LIST, 
  OthelloMemoryId, 
  OthelloMemoryDef 
} from '../../../core/othelloStrategyData';

interface OthelloStrategyMemoryCardProps {
  state: GameState;
  activeRobot: Robot | undefined;
  onBuyMemory: (memoryId: OthelloMemoryId) => void;
  onEquipMemory: (memoryId: OthelloMemoryId, slotIndex?: number) => void;
  onUnequipMemory: (memoryId: OthelloMemoryId) => void;
  onSwapSlots: (fromIndex: number, toIndex: number) => void;
}

export const OthelloStrategyMemoryCard: React.FC<OthelloStrategyMemoryCardProps> = ({
  state,
  activeRobot,
  onBuyMemory,
  onEquipMemory,
  onUnequipMemory,
  onSwapSlots,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [selectedSlotForEquip, setSelectedSlotForEquip] = useState<number | null>(null);
  const elements = state.battleElements || 0;
  const purchasedMemories = state.othelloPurchasedMemories || [];

  // ロボット個別装備メモリまたはグローバル装備メモリ
  const equippedMemories: OthelloMemoryId[] = (activeRobot?.othelloEquippedMemories && activeRobot.othelloEquippedMemories.length > 0)
    ? (activeRobot.othelloEquippedMemories as OthelloMemoryId[])
    : ((state.othelloEquippedMemories || []) as OthelloMemoryId[]);

  const handleEquipClick = (memId: OthelloMemoryId) => {
    if (selectedSlotForEquip !== null) {
      onEquipMemory(memId, selectedSlotForEquip);
      setSelectedSlotForEquip(null);
    } else {
      onEquipMemory(memId);
    }
  };

  return (
    <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm">
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between cursor-pointer select-none flex-wrap gap-2 pb-2 border-b border-stone-200"
      >
        <div className="flex items-center gap-2">
          <Gi.GiBrain className="text-amber-600 text-xl" />
          <h3 className={`${theme.typography.h3} text-stone-800`}>リバーシ戦術メモリ（思考ルーチン制御）</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* 折りたたみ状態でもスロット状況がわかるサマリー */}
          <div className="flex items-center gap-1 bg-stone-200/80 px-2 py-0.5 rounded-lg border border-stone-300 text-[11px]">
            <span className="font-bold text-stone-600 font-mono">スロット:</span>
            {[0, 1, 2].map((slotIdx) => {
              const memId = equippedMemories[slotIdx];
              const memDef = memId ? OTHELLO_MEMORIES[memId] : null;
              return (
                <span 
                  key={slotIdx}
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    memDef 
                      ? 'bg-amber-600 text-white shadow-2xs' 
                      : 'bg-stone-300 text-stone-600'
                  }`}
                  title={`#${slotIdx + 1}: ${memDef ? memDef.name : '空き'}`}
                >
                  #{slotIdx + 1} {memDef ? memDef.shortLabel : '空き'}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg text-indigo-900 font-mono text-xs font-bold">
            <Gi.GiAtom className="text-indigo-600 text-sm" />
            <span>{elements} E</span>
          </div>

          <button
            type="button"
            className="text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-2 py-1 rounded border border-stone-300 flex items-center gap-1"
          >
            {isCollapsed ? '展開 ▼' : '折りたたむ ▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-stone-600 leading-relaxed">
            エレメントを消費して思考メモリを購入・最大3つまで装備可能。<br className="hidden sm:inline" />
            ロボットが石を打つ際、<span className="font-bold text-stone-800">スロット1から順に優先条件で候補手をフィルタリング</span>します。
          </p>

      {/* 装備スロット（最大3枠） */}
      <div className="mb-4 bg-stone-100/80 p-3 rounded-xl border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
            <Gi.GiMicrochip className="text-stone-600" />
            <span>装備中の戦術メモリスロット (最大3枠)</span>
          </span>
          <span className="text-[11px] font-mono text-stone-500 font-bold">
            {equippedMemories.length} / 3 装備中
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[0, 1, 2].map((slotIdx) => {
            const memId = equippedMemories[slotIdx];
            const memDef = memId ? OTHELLO_MEMORIES[memId] : null;
            const isTargeted = selectedSlotForEquip === slotIdx;

            return (
              <div 
                key={slotIdx}
                className={`p-2.5 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                  memDef 
                    ? 'bg-white border-amber-400 shadow-xs' 
                    : isTargeted
                    ? 'bg-amber-50 border-dashed border-amber-500 ring-2 ring-amber-300'
                    : 'bg-stone-50/70 border-dashed border-stone-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">
                      優先度 #{slotIdx + 1}
                    </span>
                    {memDef && (
                      <button
                        onClick={() => onUnequipMemory(memId)}
                        className="text-[10px] text-stone-400 hover:text-rose-600 font-bold cursor-pointer transition-colors"
                        title="装備解除"
                      >
                        外す ✕
                      </button>
                    )}
                  </div>

                  {memDef ? (
                    <div>
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-1 mt-0.5">
                        <span className={`text-[10px] px-1 py-0.2 rounded border ${memDef.badgeColor}`}>
                          {memDef.shortLabel}
                        </span>
                        <span className="truncate">{memDef.name}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-tight">
                        {memDef.desc}
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setSelectedSlotForEquip(isTargeted ? null : slotIdx)}
                      className="py-2.5 text-center cursor-pointer text-stone-400 hover:text-stone-600"
                    >
                      <div className="text-xs font-bold text-stone-500">
                        {isTargeted ? '選択中：下から選んで装備' : '空きスロット'}
                      </div>
                      <div className="text-[9px] text-stone-400 mt-0.5">クリックして指定</div>
                    </div>
                  )}
                </div>

                {/* スロット順序並び替えボタン */}
                {memDef && (
                  <div className="flex justify-end gap-1 mt-2 pt-1 border-t border-stone-100">
                    <button
                      disabled={slotIdx === 0}
                      onClick={() => onSwapSlots(slotIdx, slotIdx - 1)}
                      className={`text-[9px] px-1.5 py-0.5 rounded border ${
                        slotIdx === 0 
                          ? 'opacity-30 cursor-not-allowed bg-stone-100 text-stone-400 border-stone-200' 
                          : 'bg-stone-50 hover:bg-stone-200 text-stone-700 border-stone-300 cursor-pointer'
                      }`}
                      title="優先度を上げる"
                    >
                      ▲ 優先度UP
                    </button>
                    <button
                      disabled={slotIdx >= equippedMemories.length - 1}
                      onClick={() => onSwapSlots(slotIdx, slotIdx + 1)}
                      className={`text-[9px] px-1.5 py-0.5 rounded border ${
                        slotIdx >= equippedMemories.length - 1 
                          ? 'opacity-30 cursor-not-allowed bg-stone-100 text-stone-400 border-stone-200' 
                          : 'bg-stone-50 hover:bg-stone-200 text-stone-700 border-stone-300 cursor-pointer'
                      }`}
                      title="優先度を下げる"
                    >
                      ▼ 優先度DOWN
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 戦術メモリ購入・一覧カード */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700">メモリ一覧・研究購入</span>
          <span className="text-[11px] text-stone-500">
            全{OTHELLO_MEMORY_LIST.length}種中 {purchasedMemories.length}種 所有
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {OTHELLO_MEMORY_LIST.map((mem) => {
            const isPurchased = purchasedMemories.includes(mem.id);
            const isEquipped = equippedMemories.includes(mem.id);
            const equipSlotIdx = equippedMemories.indexOf(mem.id);
            const canAfford = elements >= mem.cost;

            return (
              <div 
                key={mem.id}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-300'
                    : isPurchased
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${mem.badgeColor}`}>
                        {mem.shortLabel}
                      </span>
                      <span className="font-bold text-xs text-stone-900">{mem.name}</span>
                    </div>
                    {isEquipped && (
                      <span className="text-[9px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded font-mono shrink-0 shadow-2xs">
                        装備中 #{equipSlotIdx + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 mb-2 leading-snug">
                    {mem.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  {!isPurchased ? (
                    <>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-700">
                        <Gi.GiAtom className="text-indigo-600" />
                        <span>{mem.cost} E</span>
                      </div>
                      <Button
                        variant={canAfford ? 'primary' : 'secondary'}
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => onBuyMemory(mem.id)}
                        className={`text-xs py-1 px-3 ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {canAfford ? '購入する' : 'エレメント不足'}
                      </Button>
                    </>
                  ) : isEquipped ? (
                    <div className="w-full flex justify-between items-center">
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <Gi.GiCheckMark className="text-emerald-600" /> 装備中
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onUnequipMemory(mem.id)}
                        className="text-xs py-0.5 px-2.5 text-stone-600 hover:text-rose-600 hover:border-rose-300"
                      >
                        外す
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full flex justify-between items-center">
                      <span className="text-[10px] text-stone-500 font-medium">所持済み</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEquipClick(mem.id)}
                        className="text-xs py-0.5 px-3 border-amber-500 text-amber-900 bg-amber-50/50 hover:bg-amber-100 cursor-pointer"
                      >
                        {selectedSlotForEquip !== null 
                          ? `スロット${selectedSlotForEquip + 1}に装備` 
                          : equippedMemories.length >= 3 
                          ? 'スロット3と交換' 
                          : 'スロットに装備'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}
</Card>
  );
};
