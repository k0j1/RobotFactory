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
 * 完成したロボットや合成中のパーツ構成を、スライダー操作でスムーズに拡大・縮小して細部まで点検可能
 */
export const RobotZoomPreview: React.FC<RobotZoomPreviewProps> = ({
  robot,
  baseSize = 140,
  minZoom = 0.6,
  maxZoom = 2.2,
  defaultZoom = 1.0,
  animateCrafting = false,
  className = '',
  viewportHeightClass = 'h-56 sm:h-64',
  showControls = true,
  showPresets = true,
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

  const handleResetZoom = () => {
    updateZoom(1.0);
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
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(#d6d3d1 1.5px, transparent 1.5px), linear-gradient(90deg, #d6d3d1 1.5px, transparent 1.5px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center'
          }}
        />

        {/* 照準・センタークロスライン（微細なインダストリアルデザイン装飾） */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
          <div className="w-full h-[1px] bg-amber-500" />
          <div className="h-full w-[1px] bg-amber-500 absolute" />
          <div className="w-24 h-24 rounded-full border border-dashed border-amber-500 absolute" />
        </div>

        {/* 四隅のメカニカルコーナーブラケット */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-stone-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-stone-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-stone-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-stone-400 pointer-events-none" />

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
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span className="font-mono font-bold text-[11px] bg-stone-900/80 text-amber-400 px-2 py-0.5 rounded border border-amber-500/50 shadow-xs flex items-center gap-1 backdrop-blur-xs">
            <Gi.GiMagnifyingGlass className="text-amber-400 text-xs" />
            {percentZoom}%
          </span>
        </div>
      </div>

      {/* ズームスライダーコントロール領域 */}
      {showControls && (
        <div className="w-full max-w-sm mt-3 bg-stone-50 border border-stone-200 rounded-xl p-2.5 shadow-xs">
          {/* コントロールヘッダー */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 px-1 font-bold">
            <span className="flex items-center gap-1 text-stone-700">
              <Gi.GiMagnifyingGlass className="text-amber-600 text-sm inline" />
              {label}
            </span>
            <button
              type="button"
              onClick={handleResetZoom}
              className="text-[11px] text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer flex items-center gap-0.5"
              title="標準倍率(100%)に戻す"
            >
              100%にリセット
            </button>
          </div>

          {/* スライダー本体 & マイナス/プラスボタン */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= minZoom}
              aria-label="縮小"
              className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-stone-800 text-base shadow-xs shrink-0 transition-colors"
            >
              <Gi.GiContract className="text-stone-700 text-sm" />
            </button>

            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min={Math.round(minZoom * 100)}
                max={Math.round(maxZoom * 100)}
                step={5}
                value={percentZoom}
                onChange={handleSliderChange}
                aria-label="ロボット表示ズームスライダー"
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= maxZoom}
              aria-label="拡大"
              className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-stone-800 text-base shadow-xs shrink-0 transition-colors"
            >
              <Gi.GiExpand className="text-stone-700 text-sm" />
            </button>
          </div>

          {/* クイック倍率プリセットボタン */}
          {showPresets && (
            <div className="grid grid-cols-4 gap-1.5 mt-2 pt-2 border-t border-stone-200 text-[11px]">
              {[
                { label: '70% 全体', val: 0.7 },
                { label: '100% 標準', val: 1.0 },
                { label: '140% 詳細', val: 1.4 },
                { label: '200% 最大', val: 2.0 },
              ].map(preset => {
                const isSelected = Math.abs(zoom - preset.val) < 0.04;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateZoom(preset.val)}
                    className={`py-1 px-1 rounded-md text-center font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
