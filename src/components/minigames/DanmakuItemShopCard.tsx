import React, { useState } from 'react';
import { Card, Button, Badge } from '../ui/core';
import { theme } from '../../styles/theme';
import * as Gi from 'react-icons/gi';
import { GameState } from '../../core/models';
import {
  DANMAKU_ITEMS,
  DANMAKU_BARRIER_ITEMS,
  DANMAKU_LIFE_ITEMS,
  DanmakuItemId,
  DanmakuItemDef,
} from '../../core/danmakuItemData';

interface DanmakuItemShopCardProps {
  state: GameState;
  onBuyItem: (itemId: DanmakuItemId, count?: number) => boolean;
  onToggleActiveItem: (category: 'barrier' | 'life', itemId: DanmakuItemId | null) => void;
}

export const DanmakuItemShopCard: React.FC<DanmakuItemShopCardProps> = ({
  state,
  onBuyItem,
  onToggleActiveItem,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const elements = state.battleElements || 0;
  const danmakuItems = state.danmakuItems || {};
  const activeBarrierId = state.activeDanmakuItems?.barrier || null;
  const activeLifeId = state.activeDanmakuItems?.life || null;

  const activeBarrierDef = activeBarrierId ? DANMAKU_ITEMS[activeBarrierId] : null;
  const activeLifeDef = activeLifeId ? DANMAKU_ITEMS[activeLifeId] : null;

  const renderItemCard = (item: DanmakuItemDef) => {
    const ownedCount = danmakuItems[item.id] || 0;
    const isEquipped =
      (item.category === 'barrier' && activeBarrierId === item.id) ||
      (item.category === 'life' && activeLifeId === item.id);
    const canAfford = elements >= item.cost;

    return (
      <div
        key={item.id}
        className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
          isEquipped
            ? 'border-amber-500 bg-amber-50/90 shadow-xs ring-2 ring-amber-300'
            : ownedCount > 0
            ? `${item.cardBorder} ${item.cardBg}`
            : 'border-stone-200 bg-white hover:border-stone-300'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border ${
                  item.category === 'barrier'
                    ? 'bg-cyan-100 text-cyan-700 border-cyan-300'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                }`}
              >
                {item.category === 'barrier' ? <Gi.GiShieldEchoes /> : <Gi.GiHeartPlus />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono ${item.badgeColor}`}>
                    {item.shortLabel}
                  </span>
                  {isEquipped && (
                    <span className="text-[9px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded font-mono shrink-0 shadow-2xs">
                      出撃使用ON
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs text-stone-900 mt-0.5 truncate">{item.name}</div>
              </div>
            </div>
            <Badge
              className={`text-[10px] font-mono font-bold shrink-0 ${
                ownedCount > 0
                  ? 'bg-stone-800 text-amber-300 border border-stone-700'
                  : 'bg-stone-100 text-stone-400 border border-stone-200'
              }`}
            >
              所持: {ownedCount}個
            </Badge>
          </div>

          <p className="text-[11px] text-stone-600 mb-2.5 leading-snug">{item.desc}</p>
        </div>

        <div className="flex items-center gap-1.5 pt-2 border-t border-stone-200/80">
          {/* 出撃時使用トグルボタン */}
          <Button
            size="sm"
            variant={isEquipped ? 'primary' : 'secondary'}
            disabled={ownedCount <= 0}
            onClick={() => onToggleActiveItem(item.category, item.id)}
            className={`flex-1 text-[11px] font-bold py-1.5 ${
              isEquipped
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : ownedCount > 0
                ? 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            {isEquipped ? '✓ 使用セット中' : ownedCount > 0 ? '出撃時に使う' : '在庫なし'}
          </Button>

          {/* エレメント購入ボタン */}
          <Button
            size="sm"
            variant={canAfford ? 'success' : 'secondary'}
            disabled={!canAfford}
            onClick={() => onBuyItem(item.id, 1)}
            className={`text-[11px] font-bold py-1.5 px-2.5 font-mono shrink-0 flex items-center gap-1 ${
              canAfford ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Gi.GiAtom className="text-xs" />
            <span>{item.cost}E 購入</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm">
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between cursor-pointer select-none flex-wrap gap-2 pb-2 border-b border-stone-200"
      >
        <div className="flex items-center gap-2">
          <Gi.GiShieldEchoes className="text-cyan-600 text-xl" />
          <h3 className={`${theme.typography.h3} text-stone-800`}>
            弾幕よけ専用サポートアイテム（バリア ＆ 増加ライフ）
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* 現在セット中のアイテムサマリー */}
          <div className="flex items-center gap-1.5 bg-stone-200/80 px-2.5 py-0.5 rounded-lg border border-stone-300 text-[11px]">
            <span className="font-bold text-stone-600 font-mono">出撃装備:</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                activeBarrierDef && (danmakuItems[activeBarrierDef.id] || 0) > 0
                  ? 'bg-cyan-600 text-white shadow-2xs'
                  : 'bg-stone-300 text-stone-600'
              }`}
            >
              🛡️ {activeBarrierDef && (danmakuItems[activeBarrierDef.id] || 0) > 0 ? activeBarrierDef.shortLabel : 'バリアなし'}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                activeLifeDef && (danmakuItems[activeLifeDef.id] || 0) > 0
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-300 text-stone-600'
              }`}
            >
              ❤️ {activeLifeDef && (danmakuItems[activeLifeDef.id] || 0) > 0 ? activeLifeDef.shortLabel : '追加ライフなし'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg text-indigo-900 font-mono text-xs font-bold">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-stone-100/90 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-700">
            <div>
              エレメントを消費して<strong>弾幕バリア（1〜3回被弾無効）</strong>や<strong>増加ライフ（+1〜+3 HP）</strong>を購入・出撃時に使用できます。また、<strong>各宝箱からもドロップ</strong>します！
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded border border-amber-300 shrink-0">
              ※ミッション開始時に選択中のアイテムを1個消費
            </span>
          </div>

          {/* 1. バリア系アイテム (3種類: 1〜3回防げる) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                <Gi.GiShieldEchoes className="text-cyan-600 text-base" />
                <span>対弾幕エネルギーバリア（被弾してもライフが減らない・3種類）</span>
              </span>
              {activeBarrierId && (
                <button
                  onClick={() => onToggleActiveItem('barrier', null)}
                  className="text-[10px] text-stone-500 hover:text-rose-600 font-bold underline cursor-pointer"
                >
                  バリア使用を解除
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DANMAKU_BARRIER_ITEMS.map(renderItemCard)}
            </div>
          </div>

          {/* 2. ライフ増加系アイテム (3種類: +1〜+3ライフ) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Gi.GiHeartPlus className="text-emerald-600 text-base" />
                <span>増加アーマー・ライフ強化（初期ライフを+1〜+3増やす・3種類）</span>
              </span>
              {activeLifeId && (
                <button
                  onClick={() => onToggleActiveItem('life', null)}
                  className="text-[10px] text-stone-500 hover:text-rose-600 font-bold underline cursor-pointer"
                >
                  ライフ増加使用を解除
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DANMAKU_LIFE_ITEMS.map(renderItemCard)}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
