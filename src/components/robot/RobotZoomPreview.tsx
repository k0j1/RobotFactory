import React, { useState } from 'react';
import { Robot, RobotPart, Attribute } from '../../core/models';
import { RobotVisual } from './RobotVisual';
import { AttributeEffects } from '../effects/AttributeEffects';
import { theme } from '../../styles/theme';
import * as Gi from 'react-icons/gi';

export interface RobotZoomPreviewProps {
  robot?: Robot | { parts: { head?: RobotPart; body?: RobotPart; arms?: RobotPart; legs?: RobotPart } } | null;
  baseSize?: number;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  animateCrafting?: boolean;
  className?: string;
  viewportHeightClass?: string;
  showControls?: boolean;
  showPresets?: boolean;
  attributes?: Attribute[];
  label?: string;
}

/**
 * ロボット合成・完成画面用のズームスライダー付きプレビューコンポーネント
 * コンパクトな高さ設計と横1行のスリムな操作バーで画面スペースを圧迫せずに細部を点検可能
 */
export const RobotZoomPreview: React.FC<RobotZoomPreviewProps> = ({
  robot,
  baseSize = 110,
  minZoom = 0.6,
  maxZoom = 2.2,
  defaultZoom = 1.0,
  animateCrafting = false,
  className = '',
  viewportHeightClass = 'h-36 sm:h-40',
  showControls = true,
  attributes,
  label = 'ズーム'
}) => {
  const [zoom, setZoom] = useState<number>(defaultZoom);

  // 安全なズーム更新処理（クランプ処理）
  const updateZoom = (nextZoom: number) => {
    try {
      const clamped = Math.min(maxZoom, Math.max(minZoom, Number(nextZoom.toFixed(2))));
      setZoom(clamped);
    } catch (err) {
      console.error('Failed to update zoom value:', err);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = Number(e.target.value);
    updateZoom(rawVal / 100);
  };

  const handleZoomIn = () => {
    updateZoom(zoom + 0.15);
  };

  const handleZoomOut = () => {
    updateZoom(zoom - 0.15);
  };

  const percentZoom = Math.round(zoom * 100);

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* プレビュービューポート */}
      <div 
        className={`w-full ${viewportHeightClass} relative rounded-xl overflow-hidden border-2 border-stone-300 bg-stone-100 shadow-inner flex items-center justify-center`}
      >
        {/* 工房グリッド背景 */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-35"
          style={{
            backgroundImage: `linear-gradient(#d6d3d1 1px, transparent 1px), linear-gradient(90deg, #d6d3d1 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            backgroundPosition: 'center center'
          }}
        />

        {/* 照準・センタークロスライン */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-full h-[1px] bg-amber-600" />
          <div className="h-full w-[1px] bg-amber-600 absolute" />
          <div className="w-20 h-20 rounded-full border border-dashed border-amber-600 absolute" />
        </div>

        {/* 四隅のメカニカルコーナーブラケット */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-stone-400 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-stone-400 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-stone-400 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-stone-400 pointer-events-none" />

        {/* 属性エフェクト（指定がある場合） */}
        {attributes && attributes.length > 0 && (
          <AttributeEffects attributes={attributes} />
        )}

        {/* 拡大縮小されるロボット本体 */}
        <div 
          className="relative z-10 flex items-center justify-center transition-transform duration-150 ease-out will-change-transform"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <RobotVisual 
            robot={robot as any} 
            size={baseSize} 
            animateCrafting={animateCrafting}
            hideBackground={true}
          />
        </div>

        {/* 現在倍率オーバーレイタグ */}
        <div className="absolute top-1.5 right-1.5 z-20 pointer-events-none">
          <span className="font-mono font-bold text-[10px] bg-stone-900/80 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/50 shadow-xs flex items-center gap-1 backdrop-blur-xs">
            <Gi.GiMagnifyingGlass className="text-amber-400 text-[10px]" />
            {percentZoom}%
          </span>
        </div>
      </div>

      {/* コンパクトなズームコントロールバー（横1行で高さ圧迫なし） */}
      {showControls && (
        <div className="w-full max-w-sm mt-1.5 bg-stone-50 border border-stone-200 rounded-lg py-1 px-2 shadow-2xs flex items-center gap-1.5 text-xs">
          <span className="flex items-center gap-0.5 text-stone-600 font-bold text-[11px] shrink-0">
            <Gi.GiMagnifyingGlass className="text-amber-700 text-xs inline" />
            {label}
          </span>

          {/* 縮小ボタン */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= minZoom}
            aria-label="縮小"
            className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 active:bg-stone-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-stone-700 shadow-2xs shrink-0 transition-colors"
          >
            <Gi.GiContract className="text-stone-700 text-[11px]" />
          </button>

          {/* スライダー */}
          <div className="flex-1 relative flex items-center min-w-[60px]">
            <input
              type="range"
              min={Math.round(minZoom * 100)}
              max={Math.round(maxZoom * 100)}
              step={5}
              value={percentZoom}
              onChange={handleSliderChange}
              aria-label="ロボット表示ズームスライダー"
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* 拡大ボタン */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= maxZoom}
            aria-label="拡大"
            className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 active:bg-stone-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-stone-700 shadow-2xs shrink-0 transition-colors"
          >
            <Gi.GiExpand className="text-stone-700 text-[11px]" />
          </button>
        </div>
      )}
    </div>
  );
};
