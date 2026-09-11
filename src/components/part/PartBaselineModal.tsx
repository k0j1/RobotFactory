import React, { useMemo, useState } from 'react';
import * as Gi from 'react-icons/gi';
import { RobotPart } from '../../core/models';
import { calculatePartBaseline, StatBaselineItem } from '../../utils/partBaseline';
import { PartVisual } from '../robot/RobotVisual';
import { Button } from '../ui/core';
import { theme } from '../../styles/theme';

interface PartBaselineModalProps {
  part: RobotPart | null;
  onClose: () => void;
}

const STAT_ICONS: Record<string, React.ReactNode> = {
  hp: <Gi.GiHeartPlus className="text-rose-500" />,
  power: <Gi.GiBroadsword className="text-orange-500" />,
  defense: <Gi.GiShield className="text-blue-500" />,
  agility: <Gi.GiLightningTrio className="text-amber-500" />,
  dexterity: <Gi.GiBullseye className="text-emerald-500" />,
  intelligence: <Gi.GiCrystalBall className="text-purple-500" />,
  weight: <Gi.GiWeight className="text-stone-500" />,
};

export const PartBaselineModal: React.FC<PartBaselineModalProps> = ({ part, onClose }) => {
  const [viewMode, setViewMode] = useState<'bars' | 'radar'>('bars');

  const report = useMemo(() => {
    if (!part) return null;
    return calculatePartBaseline(part);
  }, [part]);

  if (!part || !report) return null;

  // レーダーチャート用のポリゴン頂点計算
  const radarKeys: Array<'hp' | 'power' | 'defense' | 'agility' | 'dexterity' | 'intelligence'> = [
    'hp', 'power', 'defense', 'agility', 'dexterity', 'intelligence'
  ];
  
  const size = 200;
  const center = size / 2;
  const radius = 68;
  const maxVal = Math.max(
    ...radarKeys.map(k => Math.max(report.baselineStats[k], report.part.stats[k])),
    15
  );

  const getCoordinates = (val: number, index: number, total: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (Math.max(1, val) / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const baselinePoints = radarKeys.map((k, i) => {
    const pt = getCoordinates(report.baselineStats[k], i, radarKeys.length);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const actualPoints = radarKeys.map((k, i) => {
    const pt = getCoordinates(report.part.stats[k], i, radarKeys.length);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf6f0] border-2 border-stone-300 rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-50 to-stone-100 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-lg border border-stone-200 shadow-2xs shrink-0">
              <PartVisual part={part} size={42} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  {report.mainMaterial.name}基準
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  ★{part.rarity} {part.attribute}
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-stone-800 leading-tight mt-0.5">
                {part.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
            title="閉じる"
          >
            ✕
          </button>
        </div>

        {/* コンテンツ本文 */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* サマリーカード */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 font-medium">仕上がり品質評価</div>
              <div className="text-sm font-bold text-stone-800 flex items-center gap-1.5 mt-0.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  report.qualityRank === 'S' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  report.qualityRank === 'A' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  report.qualityRank === 'C' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  RANK {report.qualityRank}
                </span>
                <span>{report.qualityLabel}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-500">能力値ブレ幅合計</div>
              <div className={`text-base font-bold font-mono ${
                report.totalStatsDiff > 0 ? 'text-emerald-600' :
                report.totalStatsDiff < 0 ? 'text-rose-600' :
                'text-stone-600'
              }`}>
                {report.totalStatsDiff > 0 ? `+${report.totalStatsDiff}` : report.totalStatsDiff} pt
              </div>
            </div>
          </div>

          {/* 表示切り替えタブ */}
          <div className="flex bg-stone-200/80 p-1 rounded-lg border border-stone-300">
            <button
              onClick={() => setViewMode('bars')}
              className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'bars' 
                  ? 'bg-white text-stone-800 shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📊 差分バー表示
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'radar' 
                  ? 'bg-white text-stone-800 shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🕸️ レーダー比較
            </button>
          </div>

          {viewMode === 'bars' ? (
            /* 差分バーグラフ表示 */
            <div className="space-y-2 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-stone-500 border-b border-stone-100 pb-1 font-medium">
                <span>ステータス (基準値 → 実値)</span>
                <span>基準値からの差分</span>
              </div>
              {report.items.map((item: StatBaselineItem) => {
                const isWeight = item.key === 'weight';
                // 差分が正の場合の良し悪し（weightはマイナスが良い）
                const isPositiveGood = !item.isLowerBetter;
                const isGood = isPositiveGood ? item.diff > 0 : item.diff < 0;
                const isBad = isPositiveGood ? item.diff < 0 : item.diff > 0;

                // 差分バーの長さ (最大±5で100%程度)
                const maxBarRange = 6;
                const barPercent = Math.min(100, (Math.abs(item.diff) / maxBarRange) * 100);

                return (
                  <div key={item.key} className="space-y-1 py-1 border-b border-stone-50 last:border-0">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-stone-800">
                        {STAT_ICONS[item.key]}
                        <span>{item.shortLabel}</span>
                        <span className="text-[10px] font-normal text-stone-500">({item.label})</span>
                        <span className="font-mono text-[11px] font-normal text-stone-500 ml-1">
                          {item.base} → <strong className="text-stone-800">{item.actual}</strong>
                        </span>
                      </div>
                      <div className="font-mono text-xs font-bold flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          isGood ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          isBad ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}>
                          {item.diff > 0 ? `+${item.diff}` : item.diff}
                        </span>
                        {isWeight && (
                          <span className="text-[9px] text-stone-400">
                            {item.diff < 0 ? '(軽快)' : item.diff > 0 ? '(重厚)' : '(標準)'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 双方向差分バー (中央が0) */}
                    <div className="h-3 w-full bg-stone-100 rounded-full relative overflow-hidden flex items-center border border-stone-200">
                      {/* 中央基準線 */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-400 z-10" />

                      {/* 左側 (マイナス) */}
                      <div className="w-1/2 h-full flex justify-end">
                        {item.diff < 0 && (
                          <div
                            className={`h-full transition-all duration-300 rounded-l-full ${
                              isGood ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${barPercent}%` }}
                          />
                        )}
                      </div>

                      {/* 右側 (プラス) */}
                      <div className="w-1/2 h-full flex justify-start">
                        {item.diff > 0 && (
                          <div
                            className={`h-full transition-all duration-300 rounded-r-full ${
                              isGood ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${barPercent}%` }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* レーダーチャート比較表示 */
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex flex-col items-center">
              <div className="text-center mb-1">
                <span className="text-xs font-bold text-stone-700">基準値 vs 実測値 レーダー比較</span>
                <div className="flex items-center justify-center gap-4 text-[10px] mt-1 text-stone-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-stone-400 border-b border-dashed inline-block" /> 基準値 (設計標準)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-amber-500/30 border border-amber-600 inline-block rounded-xs" /> このパーツの実値
                  </span>
                </div>
              </div>

              <div className="relative my-2">
                <svg width={size} height={size} className="overflow-visible">
                  {/* 背景グリッド同心円 */}
                  {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
                    <polygon
                      key={idx}
                      points={radarKeys.map((_, i) => {
                        const pt = getCoordinates(maxVal * level, i, radarKeys.length);
                        return `${pt.x},${pt.y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#e7e5e4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* 軸線 */}
                  {radarKeys.map((_, i) => {
                    const pt = getCoordinates(maxVal, i, radarKeys.length);
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={pt.x}
                        y2={pt.y}
                        stroke="#e7e5e4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* 基準値ポリゴン (グレー点線) */}
                  <polygon
                    points={baselinePoints}
                    fill="none"
                    stroke="#a8a29e"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* 実測値ポリゴン (アンバー塗り) */}
                  <polygon
                    points={actualPoints}
                    fill="rgba(245, 158, 11, 0.25)"
                    stroke="#d97706"
                    strokeWidth="2"
                  />

                  {/* 頂点ラベル */}
                  {radarKeys.map((k, i) => {
                    const angle = (Math.PI * 2 / radarKeys.length) * i - Math.PI / 2;
                    const labelR = radius + 18;
                    const lx = center + labelR * Math.cos(angle);
                    const ly = center + labelR * Math.sin(angle);
                    const diff = report.part.stats[k] - report.baselineStats[k];
                    return (
                      <text
                        key={k}
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-bold font-mono fill-stone-700"
                      >
                        {k.toUpperCase().slice(0, 3)}
                        <tspan 
                          dx="2" 
                          className={diff > 0 ? 'fill-emerald-600 font-bold' : diff < 0 ? 'fill-rose-600 font-bold' : 'fill-stone-400'}
                        >
                          {diff > 0 ? `+${diff}` : diff === 0 ? '±0' : diff}
                        </tspan>
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div className="w-full bg-stone-50 p-2 rounded-lg border border-stone-200 mt-2 text-[11px] text-stone-600 flex justify-around font-mono">
                <span>総重量(WT): <strong>{report.part.weight ?? report.baselineWeight}</strong> (基準:{report.baselineWeight})</span>
                <span className={report.weightDiff < 0 ? 'text-emerald-600 font-bold' : report.weightDiff > 0 ? 'text-rose-600 font-bold' : 'text-stone-500'}>
                  差分: {report.weightDiff > 0 ? `+${report.weightDiff}` : report.weightDiff}
                </span>
              </div>
            </div>
          )}

          {/* 説明注記 */}
          <div className="text-[10px] text-stone-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80 leading-relaxed">
            💡 <strong>パーツ差分グラフについて</strong>
            <p className="mt-0.5">
              基準値は素材と部位倍率に基づく標準設計スペック（乱数中央値）です。
              製造時のブレによって性能が上振れ・下振れします。
              WT(重量)は低いほどロボット組立時のAGI(敏捷)ペナルティが軽微になります。
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end">
          <Button size="sm" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
};
