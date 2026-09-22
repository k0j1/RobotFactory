import React from 'react';
import * as Gi from 'react-icons/gi';
import { Card, Badge, Button } from '../../ui/core';
import { 
  OTHELLO_MEMORIES, 
  MemoryPipelineAnalysis, 
  PipelineStep 
} from '../../../core/othelloStrategyData';

export type DebugViewMode = 'all' | 'slot_0' | 'slot_1' | 'slot_2';

interface OthelloStrategyDebugPanelProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  viewMode: DebugViewMode;
  onSelectViewMode: (mode: DebugViewMode) => void;
  equippedMemories: string[];
  pipelineAnalysis: MemoryPipelineAnalysis | null;
  currentTurn: 1 | 2;
  robotName: string;
}

export const OthelloStrategyDebugPanel: React.FC<OthelloStrategyDebugPanelProps> = ({
  isOpen,
  onToggleOpen,
  viewMode,
  onSelectViewMode,
  equippedMemories,
  pipelineAnalysis,
  currentTurn,
  robotName,
}) => {
  if (equippedMemories.length === 0) {
    return (
      <div className="mt-3 text-center">
        <button
          onClick={onToggleOpen}
          className="text-xs text-stone-500 hover:text-stone-700 underline font-mono flex items-center justify-center gap-1 mx-auto cursor-pointer"
        >
          <Gi.GiBrain className="text-stone-400" />
          <span>戦術メモリ未装備（装備すると思考デバッグ表示が可能）</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 w-full max-w-xl mx-auto space-y-2">
      {/* デバッグモード開閉トグルボタン */}
      <div className="flex items-center justify-between bg-stone-900/90 text-stone-200 px-3 py-2 rounded-xl border border-stone-700 shadow-md">
        <div className="flex items-center gap-2">
          <Gi.GiBrain className={`text-base ${isOpen ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
          <span className="text-xs font-bold text-stone-200">
            戦術メモリ思考デバッグモード
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600/50">
            {equippedMemories.length}個装備中
          </span>
        </div>

        <button
          onClick={onToggleOpen}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            isOpen 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-600'
          }`}
        >
          {isOpen ? 'デバッグ非表示 ▲' : '盤面解析を表示 ▼'}
        </button>
      </div>

      {/* デバッグパネル本体 */}
      {isOpen && (
        <Card className="bg-stone-900 border-2 border-stone-700 p-3 sm:p-4 text-stone-100 shadow-xl rounded-xl space-y-3">
          {/* 視覚化スコープ切り替えタブ */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-800 pb-2.5">
            <span className="text-[11px] text-stone-400 font-bold mr-1">表示対象:</span>
            <button
              onClick={() => onSelectViewMode('all')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'all'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
              }`}
            >
              <span>🎯 総合思考ルート</span>
            </button>

            {equippedMemories.map((memId, idx) => {
              const def = OTHELLO_MEMORIES[memId as keyof typeof OTHELLO_MEMORIES];
              if (!def) return null;
              const modeKey = `slot_${idx}` as DebugViewMode;
              const isSelected = viewMode === modeKey;
              return (
                <button
                  key={memId}
                  onClick={() => onSelectViewMode(modeKey)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                  }`}
                >
                  <span className="font-mono font-bold text-[10px] opacity-75">#{idx + 1}</span>
                  <span>{def.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* 盤面凡例 (Legend) */}
          <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800 text-[11px] space-y-1.5 font-mono">
            <div className="text-stone-400 font-bold flex items-center justify-between text-[10px]">
              <span>【盤面オーバーレイ凡例】</span>
              <span className={currentTurn === 1 ? 'text-amber-400' : 'text-stone-500'}>
                {currentTurn === 1 ? `● 自機(${robotName})手番・解析中` : '○ 相手手番'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-yellow-200 flex items-center justify-center text-[8px] font-black text-stone-950">
                  ★
                </span>
                <span className="text-stone-300">最終決定候補</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1 py-0.2 rounded bg-indigo-900 border border-indigo-500 text-indigo-200 text-[9px] font-bold">
                  #1
                </span>
                <span className="text-stone-300">スロット合致</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-[8px] font-bold text-stone-950 flex items-center justify-center">
                  +3
                </span>
                <span className="text-stone-300">反転獲得石数</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded border border-dashed border-amber-400/70 bg-amber-500/10"></span>
                <span className="text-stone-300">メモリ対象ゾーン</span>
              </div>
            </div>
          </div>

          {/* 思考パイプライン・ステップ表示 */}
          {pipelineAnalysis && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Gi.GiGears className="text-amber-400" />
                <span>思考絞り込みパイプライン（優先度順）</span>
              </div>

              <div className="space-y-1.5">
                {/* 初期合法手 */}
                <div className="bg-stone-950/60 p-2 rounded-lg border border-stone-800 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-400">STEP 0</span>
                    <span className="text-stone-200 font-bold">全着手可能マス（合法手）</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    {pipelineAnalysis.initialMoves.length} 候補
                  </span>
                </div>

                {/* 各スロットのステップ */}
                {pipelineAnalysis.steps.map((step, idx) => (
                  <div 
                    key={step.slotIndex}
                    className={`p-2 rounded-lg border text-[11px] space-y-1 transition-all ${
                      step.triggered 
                        ? 'bg-amber-950/40 border-amber-600/70 text-amber-100' 
                        : 'bg-stone-950/40 border-stone-800 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                          #{step.slotIndex + 1}
                        </span>
                        <span className={step.triggered ? 'text-amber-300' : 'text-stone-300'}>
                          {step.memoryDef.name}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-[10px] flex items-center gap-1">
                        <span className="text-stone-400">{step.inputMoves.length}手</span>
                        <span>→</span>
                        <span className={step.triggered ? 'text-emerald-400' : 'text-stone-300'}>
                          {step.outputMoves.length}手
                        </span>
                        {step.triggered && (
                          <span className="ml-1 text-[9px] bg-emerald-900/80 text-emerald-300 border border-emerald-600 px-1 rounded">
                            作動
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] text-stone-400 pl-6 leading-tight">
                      {step.reasonText}
                    </div>
                  </div>
                ))}

                {/* 最終決定手 */}
                <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-700/60 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">FINAL</span>
                    <span className="text-emerald-200 font-bold">AI思考着手決定</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-300">
                    {pipelineAnalysis.finalCandidateMoves.length === 1 ? (
                      <span>
                        ({pipelineAnalysis.finalCandidateMoves[0].r}, {pipelineAnalysis.finalCandidateMoves[0].c}) に決定！
                      </span>
                    ) : (
                      <span>
                        残{pipelineAnalysis.finalCandidateMoves.length}手から知性評価で選択
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
