import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { ArmJointType, ArmJointCoord, HandAnchorConfig, AVAILABLE_ARM_PARTS, HandAnchorManager } from '../../core/animations/HandAnchorManager';

export interface ArmJointCalibratorPanelProps {
  currentArmPartKey?: string;
  currentPartKey?: string;
  handConfig?: HandAnchorConfig;
  config?: HandAnchorConfig;
  activeJointFilter?: 'all' | 'shoulders' | 'hands' | 'right' | 'left';
  activeFilter?: 'all' | 'shoulders' | 'hands' | 'right' | 'left';
  activeEditJoint?: ArmJointType | 'all' | null;
  onJointFilterChange?: (filter: 'all' | 'shoulders' | 'hands' | 'right' | 'left') => void;
  onFilterChange?: (filter: 'all' | 'shoulders' | 'hands' | 'right' | 'left') => void;
  onActiveEditJointChange?: (joint: ArmJointType | 'all' | null) => void;
  onUpdateCoord: (joint: ArmJointType, axis: 'x' | 'y', value: number) => void;
  onCopySinglePartJSON: () => void;
  onCopyAllJSON: () => void;
  onApplyPasteJSON: (jsonStr: string) => void;
  onCopyPartTo: (targetPartKey: string) => void;
  onCopyPartToAll: () => void;
  onResetPart: () => void;
  onClose?: () => void;
}

/**
 * 腕パーツ（肩・拳）の精密位置調整・数値入力・クリップボードJSON入出力・他パーツ貼り付け用UIパネル
 */
export const ArmJointCalibratorPanel: React.FC<ArmJointCalibratorPanelProps> = ({
  currentArmPartKey,
  currentPartKey,
  handConfig,
  config,
  activeJointFilter,
  activeFilter,
  activeEditJoint: externalActiveEditJoint,
  onJointFilterChange,
  onFilterChange,
  onActiveEditJointChange,
  onUpdateCoord,
  onCopySinglePartJSON,
  onCopyAllJSON,
  onApplyPasteJSON,
  onCopyPartTo,
  onCopyPartToAll,
  onResetPart,
  onClose,
}) => {
  // 命名互換性の安全な吸収
  const effectivePartKey = currentArmPartKey || currentPartKey || 'arm_r1_v0';
  const effectiveFilter = activeJointFilter || activeFilter || 'all';
  const handleFilterChange = (filter: 'all' | 'shoulders' | 'hands' | 'right' | 'left') => {
    if (onJointFilterChange) onJointFilterChange(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  // スクロール中の誤操作を防ぐための「アクティブ編集対象関節」管理
  // 編集状態の関節のみスライダーのドラッグ操作が可能（非アクティブ時は安全にロック）
  const [internalActiveEditJoint, setInternalActiveEditJoint] = useState<ArmJointType | 'all' | null>('leftShoulder');
  const activeEditJoint = externalActiveEditJoint !== undefined ? externalActiveEditJoint : internalActiveEditJoint;

  const handleSetEditJoint = (joint: ArmJointType | 'all' | null) => {
    setInternalActiveEditJoint(joint);
    if (onActiveEditJointChange) {
      onActiveEditJointChange(joint);
    }
  };

  // handConfig の安全なフォールバック
  const rawConfig = handConfig || config;
  const safeConfig: HandAnchorConfig = rawConfig
    ? {
        partKey: rawConfig.partKey || effectivePartKey,
        partName: rawConfig.partName || `アームパーツ (${effectivePartKey})`,
        rightShoulder: rawConfig.rightShoulder || { x: 75.0, y: 46.0 },
        leftShoulder: rawConfig.leftShoulder || { x: 25.0, y: 46.0 },
        rightHand: rawConfig.rightHand || { x: 76.0, y: 62.0 },
        leftHand: rawConfig.leftHand || { x: 24.0, y: 62.0 },
      }
    : HandAnchorManager.getInstance().getHandConfig(effectivePartKey);

  // 貼り付け先パーツの選択状態
  const [targetPartKey, setTargetPartKey] = useState<string>(
    AVAILABLE_ARM_PARTS.find((p) => p.key !== effectivePartKey)?.key || AVAILABLE_ARM_PARTS[0]?.key || 'arm_r1_v1'
  );

  // JSON手動貼り付け入力用アコーディオン・モーダル状態
  const [showPasteBox, setShowPasteBox] = useState<boolean>(false);
  const [pasteInputText, setPasteInputText] = useState<string>('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  // 現在パーツのメタ情報
  const currentPartMeta = AVAILABLE_ARM_PARTS.find((p) => p.key === effectivePartKey);

  // 関節定義リスト
  const jointSections: Array<{
    id: ArmJointType;
    label: string;
    subLabel: string;
    icon: string;
    colorBg: string;
    colorBorder: string;
    colorText: string;
    badgeBg: string;
    coord: ArmJointCoord;
  }> = [
    {
      id: 'leftShoulder',
      label: '左肩 (L-Shoulder)',
      subLabel: '腕の回転軸・付け根',
      icon: '🦾',
      colorBg: 'bg-teal-50/70',
      colorBorder: 'border-teal-300',
      colorText: 'text-teal-950',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
      coord: safeConfig.leftShoulder || { x: 25, y: 46 },
    },
    {
      id: 'rightShoulder',
      label: '右肩 (R-Shoulder)',
      subLabel: '腕の回転軸・付け根',
      icon: '🦾',
      colorBg: 'bg-orange-50/70',
      colorBorder: 'border-orange-300',
      colorText: 'text-orange-950',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      coord: safeConfig.rightShoulder || { x: 75, y: 46 },
    },
    {
      id: 'leftHand',
      label: '左拳 (L-Fist)',
      subLabel: 'パンチ・武器の起端',
      icon: '✊',
      colorBg: 'bg-cyan-50/70',
      colorBorder: 'border-cyan-300',
      colorText: 'text-cyan-950',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      coord: safeConfig.leftHand || { x: 21, y: 55 },
    },
    {
      id: 'rightHand',
      label: '右拳 (R-Fist)',
      subLabel: 'パンチ・武器の起端',
      icon: '✊',
      colorBg: 'bg-amber-50/70',
      colorBorder: 'border-amber-300',
      colorText: 'text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      coord: safeConfig.rightHand || { x: 79, y: 55 },
    },
  ];

  // フィルター処理
  const filteredJoints = jointSections.filter((j) => {
    if (effectiveFilter === 'all') return true;
    if (effectiveFilter === 'shoulders') return j.id === 'leftShoulder' || j.id === 'rightShoulder';
    if (effectiveFilter === 'hands') return j.id === 'leftHand' || j.id === 'rightHand';
    if (effectiveFilter === 'left') return j.id === 'leftShoulder' || j.id === 'leftHand';
    if (effectiveFilter === 'right') return j.id === 'rightShoulder' || j.id === 'rightHand';
    return true;
  });

  // ペースト送信処理
  const handleExecutePaste = () => {
    if (!pasteInputText.trim()) {
      setPasteError('JSONテキストを入力してください');
      return;
    }
    try {
      JSON.parse(pasteInputText);
      setPasteError(null);
      onApplyPasteJSON(pasteInputText);
      setPasteInputText('');
      setShowPasteBox(false);
    } catch {
      setPasteError('JSON形式が正しくありません。正しい構文を入力してください');
    }
  };

  return (
    <div className={`${theme.colors.surface} border-2 border-amber-500/70 ${theme.radius.lg} p-3 sm:p-4 space-y-3.5 ${theme.shadow.md} animate-fadeIn`}>
      {/* 上部ヘッダー：タイトル ＆ 現在パーツバッジ ＆ アクション */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-300 pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🦾</span>
            <span className="font-bold text-sm text-stone-900">
              肩＆拳の位置調整モード
            </span>
            <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
              キャリブレータ
            </span>
          </div>
          <p className="text-[11px] text-stone-600">
            腕パーツごとの肩回転軸（Shoulder）と拳起端（Fist）をミリ単位で調整し、他パーツへ共有・貼り付けが可能です。
          </p>
        </div>

        {/* 右側：現在パーツ表示バッジ ＆ 初期化ボタン ＆ 閉じるボタン */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 border border-stone-300 rounded px-2 py-1 text-right">
            <div className="text-[10px] text-stone-500 font-bold">調整対象パーツ</div>
            <div className="text-xs font-mono font-bold text-stone-800">
              {currentPartMeta?.name || effectivePartKey}
              <span className="text-[10px] text-stone-500 ml-1">({effectivePartKey})</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onResetPart}
            className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold border border-stone-300 rounded cursor-pointer transition-colors"
            title="このパーツの肩・拳座標を初期デフォルト値に戻します"
          >
            🔄 初期値に戻す
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 text-sm font-bold cursor-pointer transition-colors"
              title="パネルを閉じる"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ツールバー：部位フィルター ＆ JSONクリップボード操作 ＆ 他パーツ貼り付け */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-100/80 p-2 rounded-lg border border-stone-200">
        {/* 部位絞り込みタブ */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] font-bold text-stone-600 mr-1">表示:</span>
          {[
            { id: 'all', label: '全4箇所' },
            { id: 'shoulders', label: '肩のみ' },
            { id: 'hands', label: '拳のみ' },
            { id: 'left', label: '左腕' },
            { id: 'right', label: '右腕' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterChange(tab.id as any)}
              className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                effectiveFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* スクロール誤操作防止：ロック制御 ＆ クリップボードJSON操作ボタン群 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* スライダー一括ロック／全解除トグル */}
          <button
            type="button"
            onClick={() => handleSetEditJoint(activeEditJoint === 'all' ? null : 'all')}
            className={`px-2 py-1 text-xs font-bold rounded cursor-pointer border flex items-center gap-1 transition-colors ${
              activeEditJoint === 'all'
                ? 'bg-amber-700 text-white border-amber-800'
                : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
            }`}
            title="スクロール誤動作防止ロックを一括解除／有効化します"
          >
            <span>{activeEditJoint === 'all' ? '🔓 全スライダー操作中' : '🔒 誤操作防止ロック中'}</span>
          </button>

          {/* 現在パーツをJSONコピー */}
          <button
            type="button"
            onClick={onCopySinglePartJSON}
            className="px-2.5 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded cursor-pointer shadow-xs flex items-center gap-1 transition-colors"
            title="現在のパーツの肩・拳座標設定をクリップボードにJSONコピーします"
          >
            <span>📋</span>
            <span>現在パーツをコピー (JSON)</span>
          </button>

          {/* 全パーツをJSONコピー */}
          <button
            type="button"
            onClick={onCopyAllJSON}
            className="px-2 py-1 text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-700 rounded cursor-pointer border border-stone-300 flex items-center gap-1 transition-colors"
            title="登録されている全パーツの肩・拳座標をまとめてコピーします"
          >
            <span>📦</span>
            <span>全パーツコピー</span>
          </button>

          {/* クリップボードから貼り付けトグル */}
          <button
            type="button"
            onClick={() => setShowPasteBox(!showPasteBox)}
            className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer border flex items-center gap-1 transition-colors ${
              showPasteBox
                ? 'bg-cyan-700 text-white border-cyan-800'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600 shadow-xs'
            }`}
            title="JSONテキストを貼り付けて設定をインポートします"
          >
            <span>📥</span>
            <span>JSON貼り付け</span>
          </button>
        </div>
      </div>

      {/* JSON貼り付け入力エリア (トグル開閉) */}
      {showPasteBox && (
        <div className="bg-cyan-50 border-2 border-cyan-400 rounded-lg p-3 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-900 flex items-center gap-1">
              <span>📥</span> JSON設定のインポート / 貼り付け
            </span>
            <button
              type="button"
              onClick={() => setShowPasteBox(false)}
              className="text-stone-400 hover:text-stone-700 text-xs px-1"
            >
              ✕ 閉じる
            </button>
          </div>
          <p className="text-[11px] text-cyan-800">
            コピーした設定JSON（単一パーツ、または全パーツのJSON）をここに貼り付けて適用してください。
          </p>
          <textarea
            value={pasteInputText}
            onChange={(e) => setPasteInputText(e.target.value)}
            placeholder='{"partKey": "arm_r1_v0", "rightShoulder": {"x": 75, "y": 46}, ...} または全パーツJSON'
            className="w-full h-24 p-2 text-xs font-mono bg-white border border-cyan-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
          />
          {pasteError && (
            <div className="text-xs text-rose-600 font-bold bg-rose-50 p-1.5 rounded border border-rose-200">
              ⚠️ {pasteError}
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPasteBox(false)}
              className="px-3 py-1 text-xs bg-stone-200 text-stone-700 font-bold rounded hover:bg-stone-300 cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleExecutePaste}
              className="px-4 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded shadow-xs cursor-pointer"
            >
              設定をインポート適用する
            </button>
          </div>
        </div>
      )}

      {/* 他パーツへの貼り付け・複製バー */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
            <span>✨</span> 他のパーツへこの設定を直接貼り付け:
          </span>
          <select
            value={targetPartKey}
            onChange={(e) => setTargetPartKey(e.target.value)}
            className="text-xs bg-white border border-amber-300 rounded px-2.5 py-1 font-mono text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          >
            {AVAILABLE_ARM_PARTS.map((part) => (
              <option key={part.key} value={part.key} disabled={part.key === effectivePartKey}>
                {part.name} ({part.key}) {part.key === effectivePartKey ? '（現在編集中）' : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onCopyPartTo(targetPartKey)}
            disabled={targetPartKey === effectivePartKey}
            className="px-3 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded cursor-pointer shadow-xs transition-colors"
          >
            選択したパーツへ貼り付け
          </button>
        </div>

        <button
          type="button"
          onClick={onCopyPartToAll}
          className="px-2.5 py-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 rounded cursor-pointer transition-colors"
          title="現在パーツの肩・拳座標を登録されている全アームパーツに一括適用します"
        >
          🌐 全パーツに一括適用
        </button>
      </div>

      {/* 各関節の座標数値入力 ＆ スライダー ＆ ステップ調整カードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredJoints.map((joint) => {
          const isEditing = activeEditJoint === 'all' || activeEditJoint === joint.id;
          return (
            <div
              key={joint.id}
              className={`${joint.colorBg} border-2 ${
                isEditing ? `${joint.colorBorder} ring-2 ring-amber-500/30 shadow-md` : 'border-stone-200/80 opacity-90'
              } rounded-xl p-3 space-y-2.5 transition-all`}
            >
              {/* 関節ヘッダー：アイコン・ラベル・ステータストグル（ロック/調整中） */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base">{joint.icon}</span>
                  <div className="truncate">
                    <span className={`text-xs font-black ${joint.colorText} block truncate`}>{joint.label}</span>
                    <span className="text-[10px] text-stone-500 block leading-tight truncate">{joint.subLabel}</span>
                  </div>
                </div>

                {/* 編集ロック切り替えトグル ＆ 現在値バッジ */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetEditJoint(isEditing && activeEditJoint !== 'all' ? null : joint.id)}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 shadow-2xs ${
                      isEditing
                        ? 'bg-amber-600 text-white hover:bg-amber-700 ring-1 ring-amber-700'
                        : 'bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300'
                    }`}
                    title={isEditing ? 'この関節のスライダーをロックします' : 'この関節のスライダー操作を有効化します'}
                  >
                    <span>{isEditing ? '✏️ 調整中' : '🔒 ロック中'}</span>
                  </button>

                  <div className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${joint.badgeBg}`}>
                    X:{joint.coord.x.toFixed(1)} / Y:{joint.coord.y.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* X座標コントロール（数値入力 + スライダー + 微調整ボタン） */}
              <div 
                className={`space-y-1 p-2 rounded-lg border transition-all ${
                  isEditing 
                    ? 'bg-white border-amber-300/80 shadow-2xs' 
                    : 'bg-white/50 border-stone-200 cursor-pointer hover:bg-white/80'
                }`}
                onClick={() => {
                  if (!isEditing) handleSetEditJoint(joint.id);
                }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-stone-700">X座標 (左右):</span>
                    {!isEditing && (
                      <span className="text-[9px] text-stone-400 font-bold bg-stone-100 px-1 rounded">
                        タップで調整
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={joint.coord.x}
                      onFocus={() => handleSetEditJoint(joint.id)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          handleSetEditJoint(joint.id);
                          onUpdateCoord(joint.id, 'x', val);
                        }
                      }}
                      className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold text-right bg-white border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="font-mono text-xs text-stone-600">%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={!isEditing}
                    value={joint.coord.x}
                    onMouseDown={() => handleSetEditJoint(joint.id)}
                    onTouchStart={() => handleSetEditJoint(joint.id)}
                    onChange={(e) => onUpdateCoord(joint.id, 'x', parseFloat(e.target.value))}
                    className={`w-full h-2.5 rounded-lg transition-all ${
                      isEditing 
                        ? 'accent-amber-600 cursor-pointer bg-amber-100 ring-1 ring-amber-400/50' 
                        : 'opacity-35 cursor-not-allowed bg-stone-300'
                    }`}
                  />
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetEditJoint(joint.id);
                        onUpdateCoord(joint.id, 'x', joint.coord.x - 0.5);
                      }}
                      className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-stone-300 rounded hover:bg-stone-100 text-stone-700 cursor-pointer shadow-2xs"
                      title="-0.5% 減算"
                    >
                      -0.5
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetEditJoint(joint.id);
                        onUpdateCoord(joint.id, 'x', joint.coord.x + 0.5);
                      }}
                      className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-stone-300 rounded hover:bg-stone-100 text-stone-700 cursor-pointer shadow-2xs"
                      title="+0.5% 加算"
                    >
                      +0.5
                    </button>
                  </div>
                </div>
              </div>

              {/* Y座標コントロール（数値入力 + スライダー + 微調整ボタン） */}
              <div 
                className={`space-y-1 p-2 rounded-lg border transition-all ${
                  isEditing 
                    ? 'bg-white border-amber-300/80 shadow-2xs' 
                    : 'bg-white/50 border-stone-200 cursor-pointer hover:bg-white/80'
                }`}
                onClick={() => {
                  if (!isEditing) handleSetEditJoint(joint.id);
                }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-stone-700">Y座標 (上下):</span>
                    {!isEditing && (
                      <span className="text-[9px] text-stone-400 font-bold bg-stone-100 px-1 rounded">
                        タップで調整
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={joint.coord.y}
                      onFocus={() => handleSetEditJoint(joint.id)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          handleSetEditJoint(joint.id);
                          onUpdateCoord(joint.id, 'y', val);
                        }
                      }}
                      className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold text-right bg-white border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="font-mono text-xs text-stone-600">%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={!isEditing}
                    value={joint.coord.y}
                    onMouseDown={() => handleSetEditJoint(joint.id)}
                    onTouchStart={() => handleSetEditJoint(joint.id)}
                    onChange={(e) => onUpdateCoord(joint.id, 'y', parseFloat(e.target.value))}
                    className={`w-full h-2.5 rounded-lg transition-all ${
                      isEditing 
                        ? 'accent-amber-600 cursor-pointer bg-amber-100 ring-1 ring-amber-400/50' 
                        : 'opacity-35 cursor-not-allowed bg-stone-300'
                    }`}
                  />
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetEditJoint(joint.id);
                        onUpdateCoord(joint.id, 'y', joint.coord.y - 0.5);
                      }}
                      className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-stone-300 rounded hover:bg-stone-100 text-stone-700 cursor-pointer shadow-2xs"
                      title="-0.5% 減算"
                    >
                      -0.5
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetEditJoint(joint.id);
                        onUpdateCoord(joint.id, 'y', joint.coord.y + 0.5);
                      }}
                      className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-stone-300 rounded hover:bg-stone-100 text-stone-700 cursor-pointer shadow-2xs"
                      title="+0.5% 加算"
                    >
                      +0.5
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ガイド ＆ 確定完了ボタン */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
        <div className="text-[11px] text-stone-600 font-bold flex items-center gap-1">
          <span>🛡️</span>
          <span>スクロール時の誤操作防止のため、スライダーは「✏️ 調整中」の関節のみ操作可能です。</span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
          >
            <span>✔ 調整を確定して閉じる</span>
          </button>
        )}
      </div>
    </div>
  );
};
