import React, { useState } from 'react';
import { GridTile } from './types';
import * as Gi from 'react-icons/gi';

interface DungeonTileViewProps {
  tile: GridTile;
  cellSize: number;
}

export const DungeonTileView: React.FC<DungeonTileViewProps> = React.memo(({ tile, cellSize }) => {
  const [imgError, setImgError] = useState(false);

  // Kenneyテクスチャパスの取得（実在するtowerDefense_tile024.pngをデフォルト草地とする）
  const defaultTexture = tile.type === 'path' || tile.type === 'spawn' || tile.type === 'base'
    ? '/assets/kenney/tiles/towerDefense_tile093.png'
    : '/assets/kenney/tiles/towerDefense_tile024.png';
  const textureSrc = tile.texture || defaultTexture;

  // アイコン装飾（草地や岩、拠点マークの重ね合わせ）
  const renderTileOverlay = () => {
    if (tile.type === 'tower_spot') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/assets/kenney/tiles/towerDefense_tile268.png"
            alt="deck-platform"
            referrerPolicy="no-referrer"
            className="w-4/5 h-4/5 object-contain drop-shadow-md"
          />
        </div>
      );
    }

    if (tile.type === 'spawn') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-rose-500/30 border-2 border-rose-500 animate-ping absolute" />
          <Gi.GiRadarDish className="w-7 h-7 text-rose-600 drop-shadow-md z-10" />
        </div>
      );
    }

    if (tile.type === 'base') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/assets/kenney/tiles/towerDefense_tile271.png"
            alt="base-fortress"
            referrerPolicy="no-referrer"
            className="w-4/5 h-4/5 object-contain drop-shadow-md"
          />
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500 animate-pulse absolute" />
          <Gi.GiCastleRuins className="w-6 h-6 text-amber-900 drop-shadow-md z-10" />
        </div>
      );
    }

    // 壁（野外の木・岩・小麦のアクセント）
    if (tile.type === 'wall' && tile.variant % 2 === 0) {
      // Kenney公式の木タイルを使用
      if (tile.variant % 4 === 0) {
        const treeIdx = 131 + (tile.x + tile.y) % 4; // 131〜134
        return (
          <img
            src={`/assets/kenney/tiles/towerDefense_tile${treeIdx}.png`}
            alt="tree"
            referrerPolicy="no-referrer"
            className="w-3/4 h-3/4 object-contain drop-shadow-sm pointer-events-none"
          />
        );
      }

      switch (tile.iconName) {
        case 'GiPineTree':
          return <Gi.GiPineTree className="w-5 h-5 text-emerald-800/80 drop-shadow-sm pointer-events-none" />;
        case 'GiForest':
          return <Gi.GiForest className="w-5 h-5 text-emerald-900/80 drop-shadow-sm pointer-events-none" />;
        case 'GiRock':
          return <Gi.GiRock className="w-4 h-4 text-stone-700/70 drop-shadow-sm pointer-events-none" />;
        case 'GiWheat':
          return <Gi.GiWheat className="w-4 h-4 text-amber-700/70 drop-shadow-sm pointer-events-none" />;
        case 'GiWoodCabin':
          return <Gi.GiWoodCabin className="w-5 h-5 text-amber-900/80 drop-shadow-sm pointer-events-none" />;
        default:
          return null;
      }
    }

    return null;
  };

  // 背景カラー（万が一の画像ロード待機時・フォールバック時にも綺麗な緑・土色を保証）
  const fallbackBgClass = tile.type === 'path' || tile.type === 'spawn' || tile.type === 'base'
    ? 'bg-[#bb8044]'
    : tile.texture?.includes('098')
    ? 'bg-[#ecdcb8]'
    : 'bg-[#2dca70]';

  return (
    <div
      className={`absolute flex items-center justify-center overflow-hidden select-none ${fallbackBgClass}`}
      style={{
        left: tile.x * cellSize,
        top: tile.y * cellSize,
        width: cellSize,
        height: cellSize,
      }}
    >
      {/* Kenney公式グラフィックタイル画像 */}
      {!imgError && (
        <img
          src={textureSrc}
          alt=""
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover pointer-events-none"
          style={{
            transform: tile.rotation ? `rotate(${tile.rotation}deg)` : undefined,
          }}
        />
      )}

      {/* オーバーレイ装飾＆アイコン */}
      {renderTileOverlay()}
      
      {/* スポーンと拠点のテキスト補助バッジ */}
      {tile.type === 'spawn' && (
        <span className="absolute bottom-0 text-[8px] font-black text-white bg-rose-600 border border-rose-400 px-1 rounded-t shadow-md z-10">
          SPAWN
        </span>
      )}
      {tile.type === 'base' && (
        <span className="absolute bottom-0 text-[8px] font-black text-white bg-amber-600 border border-amber-400 px-1 rounded-t shadow-md z-10">
          BASE
        </span>
      )}
      {tile.type === 'tower_spot' && (
        <span className="absolute bottom-0 text-[7px] font-black text-sky-900 bg-sky-200/90 border border-sky-400 px-0.5 rounded-t shadow-sm z-10">
          DECK
        </span>
      )}
    </div>
  );
});

