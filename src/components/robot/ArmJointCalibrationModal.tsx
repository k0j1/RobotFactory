import React, { useState, useMemo, useEffect, useRef } from 'react';
import { theme } from '../../styles/theme';
import { Card, Button, Badge } from '../ui/core';
import { 
  HandAnchorManager, 
  HandAnchorConfig, 
  ArmJointType, 
  AVAILABLE_ARM_PARTS,
  ArmPartOption
} from '../../core/animations/HandAnchorManager';
import { ArmJointCalibratorPanel } from './ArmJointCalibratorPanel';
import { GSAPRobotCanvas } from './GSAPRobotCanvas';
import { Robot, RobotPart, AttributeColors, AttributeNames } from '../../core/models';
import { GSAPRobotAnimationRegistry, IRobotAnimationPattern } from '../../core/animations/GSAPRobotAnimator';
import * as Gi from 'react-icons/gi';

export interface ArmJointCalibrationModalProps {
  initialArmPartKey?: string;
  initialAttribute?: string;
  onClose: () => void;
}

/**
 * パーツ図鑑専用：アームパーツごとの肩＆拳位置キャリブレーションモーダル
 * アームパーツごとに左右の肩（回転中心軸）および拳（武器起端・パンチ打点）の位置を
 * キャンバス上の直感的ドラッグ＆ドロップおよび高機能数値パネルで調整・永続化・複製できます。
 */
export const ArmJointCalibrationModal: React.FC<ArmJointCalibrationModalProps> = ({
  initialArmPartKey = 'arm_r1_v0',
  initialAttribute = 'Fire',
  onClose,
}) => {
  // 選択中のアームパーツKey (例: arm_r1_v0)
  const [selectedPartKey, setSelectedPartKey] = useState<string>(initialArmPartKey);
  // 表示属性カラー
  const [selectedAttribute, setSelectedAttribute] = useState<string>(initialAttribute);
  // テスト用アニメーションパターンID (待機、パンチ、ウェーブなど)
  const [testPatternId, setTestPatternId] = useState<string>('idle_breathing');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [stageTheme, setStageTheme] = useState<'dark' | 'light' | 'grid'>('grid');
  const [zoom, setZoom] = useState<number>(1.0);
  const [showJoints, setShowJoints] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // 表示関節フィルター
  const [activeJointFilter, setActiveJointFilter] = useState<'all' | 'shoulders' | 'hands' | 'right' | 'left'>('all');
  // 現在調整中の関節（スライダー保護連動）
  const [activeEditJoint, setActiveEditJoint] = useState<ArmJointType | 'all' | null>('leftShoulder');

  // 現在のアームパーツメタ情報
  const currentPartMeta = useMemo<ArmPartOption>(() => {
    return AVAILABLE_ARM_PARTS.find(p => p.key === selectedPartKey) || AVAILABLE_ARM_PARTS[0];
  }, [selectedPartKey]);

  // 現在のアームパーツの肩・拳アンカー設定
  const [handConfig, setHandConfig] = useState<HandAnchorConfig>(() => {
    return HandAnchorManager.getInstance().getHandConfig(selectedPartKey);
  });

  // パーツ切り替え時に設定をリロード
  useEffect(() => {
    const cfg = HandAnchorManager.getInstance().getHandConfig(selectedPartKey);
    setHandConfig(cfg);
    const unsub = HandAnchorManager.getInstance().subscribe(() => {
      setHandConfig(HandAnchorManager.getInstance().getHandConfig(selectedPartKey));
    });
    return unsub;
  }, [selectedPartKey]);

  // アニメーションパターンレジストリ
  const registry = useMemo(() => GSAPRobotAnimationRegistry.getInstance(), []);
  const testPatterns = useMemo<IRobotAnimationPattern[]>(() => {
    const candidates = [
      'idle_breathing',
      'attack_melee_combo',
      'skill_rapid_punch',
      'victory_dual_wave',
      'special_spiral_tornado',
      'defense_shield_guard'
    ];
    return candidates
      .map(id => registry.getPattern(id))
      .filter((p): p is IRobotAnimationPattern => !!p);
  }, [registry]);

  const currentPattern = useMemo(() => {
    return registry.getPattern(testPatternId) || registry.getAllPatterns()[0];
  }, [registry, testPatternId]);

  // 選択アームパーツを装備したプレビュー用ロボットモデル
  const previewRobot = useMemo<Robot>(() => {
    const r = currentPartMeta.rarity;
    const v = currentPartMeta.visualIndex;
    const attr = selectedAttribute;

    const armPart: RobotPart = {
      id: `preview_arm_${selectedPartKey}`,
      type: 'arms',
      name: currentPartMeta.name,
      rarity: r as 1 | 2 | 3 | 4 | 5,
      visualIndex: v,
      attribute: attr,
      stats: { hp: 20 * r, power: 15 * r, defense: 10 * r, agility: 10 * r, dexterity: 15 * r, intelligence: 10 * r }
    };

    const headPart: RobotPart = {
      id: 'preview_head_default',
      type: 'head',
      name: 'キャリブレーション用ヘッド',
      rarity: 1,
      visualIndex: 0,
      attribute: attr,
      stats: { hp: 20, power: 5, defense: 10, agility: 5, dexterity: 10, intelligence: 10 }
    };

    const bodyPart: RobotPart = {
      id: 'preview_body_default',
      type: 'body',
      name: 'キャリブレーション用コアボディ',
      rarity: 1,
      visualIndex: 0,
      attribute: attr,
      stats: { hp: 50, power: 10, defense: 20, agility: 5, dexterity: 5, intelligence: 5 }
    };

    const legPart: RobotPart = {
      id: 'preview_leg_default',
      type: 'legs',
      name: 'キャリブレーション用レッグ',
      rarity: 1,
      visualIndex: 0,
      attribute: attr,
      stats: { hp: 30, power: 5, defense: 15, agility: 15, dexterity: 10, intelligence: 5 }
    };

    return {
      id: 'arm_calibration_rig_robot',
      name: `${currentPartMeta.name} 調整リグ`,
      parts: {
        head: headPart,
        body: bodyPart,
        arms: armPart,
        legs: legPart,
      },
      stats: { hp: 120, power: 35, defense: 55, agility: 35, dexterity: 40, intelligence: 30 },
      createdAt: Date.now(),
      value: 100
    };
  }, [selectedPartKey, currentPartMeta, selectedAttribute]);

  // 関節座標の手動微調整ハンドラー (スライダー / 数値入力 / ステップボタン)
  const handleUpdateJointCoord = (joint: ArmJointType, axis: 'x' | 'y', value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value * 10) / 10));
    const currentJointCoord = handConfig[joint] || (joint.includes('Shoulder') 
      ? { x: joint === 'leftShoulder' ? 25 : 75, y: 46 } 
      : { x: joint === 'leftHand' ? 21 : 79, y: 55 });
    const nextCoord = {
      ...currentJointCoord,
      [axis]: clamped,
    };
    const updated = HandAnchorManager.getInstance().updateJointPosition(selectedPartKey, joint, nextCoord);
    setHandConfig(updated);
  };

  // 単一パーツの肩・拳設定をJSONコピー
  const handleCopySinglePartJSON = () => {
    const jsonStr = HandAnchorManager.getInstance().exportSinglePartJSON(selectedPartKey);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr).then(() => {
        setNotification(`📋 ${selectedPartKey}（${handConfig.partName}）の設定JSONをコピーしました！`);
        setTimeout(() => setNotification(null), 4000);
      }).catch(() => {
        setNotification(`📋 設定JSONを出力しました`);
        setTimeout(() => setNotification(null), 3000);
      });
    }
  };

  // 全パーツの肩・拳設定をJSONコピー
  const handleCopyAllJSON = () => {
    const jsonStr = HandAnchorManager.getInstance().exportJSON(selectedPartKey);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr).then(() => {
        setNotification('📦 全アームパーツの設定JSONをクリップボードにコピーしました！');
        setTimeout(() => setNotification(null), 4000);
      }).catch(() => {
        setNotification('📦 全パーツ設定JSONを出力しました');
        setTimeout(() => setNotification(null), 3000);
      });
    }
  };

  // 設定のJSONペースト適用処理
  const handleApplyPasteJSON = (jsonText: string) => {
    if (!jsonText.trim()) return;
    const result = HandAnchorManager.getInstance().importJSON(jsonText);
    if (result.success) {
      setNotification(`✅ ${result.importedCount}件のパーツ関節位置設定をインポートしました！`);
      setHandConfig(HandAnchorManager.getInstance().getHandConfig(selectedPartKey));
      setTimeout(() => setNotification(null), 4000);
    } else {
      alert(`インポートに失敗しました: ${result.message}`);
    }
  };

  // 現在パーツの設定を別の指定パーツへ貼り付け
  const handleCopyPartTo = (targetPartKey: string) => {
    const result = HandAnchorManager.getInstance().copyPartConfigTo(selectedPartKey, targetPartKey);
    if (result.success) {
      setNotification(`✨ ${selectedPartKey} の設定を ${targetPartKey} へ貼り付けました！`);
      setTimeout(() => setNotification(null), 4000);
    } else {
      alert(`貼り付けに失敗しました: ${result.message}`);
    }
  };

  // 現在パーツの設定を全パーツへ一括適用
  const handleCopyPartToAll = () => {
    const confirmApply = window.confirm(
      `現在のパーツ(${selectedPartKey}: ${currentPartMeta.name})の肩・拳位置設定を、登録されているすべての腕パーツに一括適用しますか？`
    );
    if (!confirmApply) return;

    const result = HandAnchorManager.getInstance().copyPartConfigToAll(selectedPartKey);
    if (result.success) {
      setNotification(`🌐 全${result.count}件の腕パーツに肩・拳位置設定を一括適用しました！`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // 初期値リセット
  const handleResetCurrentPart = () => {
    HandAnchorManager.getInstance().resetPartToDefault(selectedPartKey);
    const reset = HandAnchorManager.getInstance().getHandConfig(selectedPartKey);
    setHandConfig(reset);
    setNotification(`🔄 ${selectedPartKey} の肩・拳位置を初期値に戻しました`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div 
      id="arm-joint-calibration-modal"
      className="fixed inset-0 z-[150] flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 pt-3 pb-24 sm:pb-6 bg-black/90 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-[#faf5ee] border-2 border-[#c29b77] rounded-2xl shadow-2xl max-w-6xl w-full my-auto max-h-[calc(100dvh-6.5rem)] sm:max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* モーダルヘッダー */}
        <div className="bg-[#292524] text-white px-4 py-3 flex items-center justify-between border-b-2 border-amber-500 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-xl text-stone-900 shadow-sm font-black text-base">
              🦾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`${theme.typography.h3} text-amber-300 font-black tracking-wide`}>
                  アームパーツ 肩＆拳 位置キャリブレーター
                </h3>
                <span className="text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  パーツ図鑑連動
                </span>
              </div>
              <p className="text-xs text-stone-300">
                アームパーツごとに肩（回転軸）と拳（打点・武器起端）の4点を独立設定・リアルタイムテスト
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={onClose}
              className="px-3.5 py-1.5 font-bold cursor-pointer text-xs flex items-center gap-1 shadow-xs"
              title="調整内容を確定してパーツ図鑑に戻ります"
            >
              <span>✔ 確定して戻る</span>
            </Button>
            <button
              id="close-arm-calibration-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
              title="キャリブレーターを閉じる"
            >
              <span>✕</span>
            </button>
          </div>
        </div>

        {/* 通知バー */}
        {notification && (
          <div className="bg-amber-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between animate-in fade-in">
            <span>{notification}</span>
            <button 
              type="button" 
              onClick={() => setNotification(null)}
              className="text-amber-200 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* コントロールツールバー (パーツ選択＆プレビュー制御) */}
        <div className="bg-stone-100 border-b border-stone-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* アームパーツ切り替えプルダウン */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
              <Gi.GiMechanicalArm className="text-amber-600" />
              対象アームパーツ:
            </span>
            <select
              id="select-arm-part"
              value={selectedPartKey}
              onChange={(e) => setSelectedPartKey(e.target.value)}
              className="bg-white border-2 border-amber-400/80 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {AVAILABLE_ARM_PARTS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>
            <Badge variant="warning" className="text-[10px]">
              ★{currentPartMeta.rarity}
            </Badge>
          </div>

          {/* 表示属性カラー切り替え */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-600">属性色:</span>
            {Object.keys(AttributeNames).map((attr) => (
              <button
                key={attr}
                type="button"
                onClick={() => setSelectedAttribute(attr)}
                className={`px-2 py-0.5 text-[11px] rounded font-bold transition-all cursor-pointer ${
                  selectedAttribute === attr
                    ? 'text-white shadow-2xs scale-105 ring-1 ring-white/80'
                    : 'text-stone-700 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: AttributeColors[attr] }}
              >
                {AttributeNames[attr]}
              </button>
            ))}
          </div>
        </div>

        {/* メインエリア：左側プレビューキャンバス (6/12) ＆ 右側調整パネル (6/12) */}
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* 左側：ロボット描画＆インタラクティブピン調整キャンバス (6 / 12) */}
            <div className="lg:col-span-6 space-y-3 flex flex-col">
              
              {/* ステージ表示設定バー */}
              <div className="flex items-center justify-between gap-2 bg-stone-200/90 p-1.5 rounded-xl border border-stone-300 text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-stone-700 ml-1">テスト動作:</span>
                  <select
                    value={testPatternId}
                    onChange={(e) => setTestPatternId(e.target.value)}
                    className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-bold text-stone-800"
                  >
                    {testPatterns.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                      isPlaying ? 'bg-amber-600 text-white' : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {isPlaying ? '一時停止' : '再生'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-stone-600 font-bold">背景:</span>
                  <button
                    type="button"
                    onClick={() => setStageTheme('grid')}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      stageTheme === 'grid' ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    方眼
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageTheme('light')}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      stageTheme === 'light' ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    白
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageTheme('dark')}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      stageTheme === 'dark' ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    黒
                  </button>
                </div>
              </div>

              {/* キャンバス本体 (ピンのドラッグ操作に対応) */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-300 shadow-md aspect-square bg-stone-900 flex items-center justify-center touch-none">
                <GSAPRobotCanvas
                  robot={previewRobot}
                  size={360}
                  patternId={testPatternId}
                  speed={speed}
                  isPaused={!isPlaying}
                  loop={true}
                  zoom={zoom}
                  stageTheme={stageTheme}
                  showJoints={false}
                  showArmJointMarkers={true}
                  isJointCalibrationActive={true}
                  activeJointFilter={activeJointFilter}
                  handConfig={handConfig}
                  onUpdateHandConfig={setHandConfig}
                  onJointCoordChange={(joint, coord) => {
                    setActiveEditJoint(joint);
                    handleUpdateJointCoord(joint, 'x', coord.x);
                    handleUpdateJointCoord(joint, 'y', coord.y);
                  }}
                />
              </div>

              {/* ズーム & 速度 制御 */}
              <div className="bg-stone-100 border border-stone-300 p-2 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-600">ズーム:</span>
                  {[0.8, 1.0, 1.2, 1.5].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZoom(z)}
                      className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                        zoom === z ? 'bg-stone-800 text-amber-300' : 'bg-white text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {z * 100}%
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-600">速度:</span>
                  {[0.5, 1.0, 1.5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                        speed === s ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                💡 <strong>直感操作ガイド:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-stone-700">
                  <li>キャンバス上のカラーピン（左肩・右肩・左拳・右拳）を直接ドラッグして位置を調整できます。</li>
                  <li>テスト動作を再生しながらドラッグすると、腕の回転中心やパンチの伸び位置がリアルタイムに反映されます。</li>
                  <li>変更内容は即座にブラウザへ自動保存されます。</li>
                </ul>
              </div>

            </div>

            {/* 右側：高機能数値調整パネル (6 / 12) */}
            <div className="lg:col-span-6 space-y-3 flex flex-col">
              <ArmJointCalibratorPanel
                currentArmPartKey={selectedPartKey}
                currentPartKey={selectedPartKey}
                handConfig={handConfig}
                config={handConfig}
                activeJointFilter={activeJointFilter}
                activeEditJoint={activeEditJoint}
                onJointFilterChange={setActiveJointFilter}
                onActiveEditJointChange={setActiveEditJoint}
                onUpdateCoord={handleUpdateJointCoord}
                onCopySinglePartJSON={handleCopySinglePartJSON}
                onCopyAllJSON={handleCopyAllJSON}
                onApplyPasteJSON={handleApplyPasteJSON}
                onCopyPartTo={handleCopyPartTo}
                onCopyPartToAll={handleCopyPartToAll}
                onResetPart={handleResetCurrentPart}
                onClose={onClose}
              />
            </div>

          </div>
        </div>

        {/* フッター (下部メニューに隠れない最前面固定フッター) */}
        <div className="bg-stone-200 border-t-2 border-stone-300 px-4 py-3 flex items-center justify-between shrink-0 sticky bottom-0 z-30 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-stone-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>設定はパーツ単位で自動保存されています</span>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={onClose}
            className="px-6 py-2 font-black cursor-pointer shadow-md text-sm flex items-center gap-1.5"
          >
            <span>✔ 調整を確定して図鑑に戻る</span>
          </Button>
        </div>

      </div>
    </div>
  );
};
