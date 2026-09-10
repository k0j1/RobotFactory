import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Robot, AttributeColors, AttributeNames } from '../../core/models';
import {
  GSAPRobotAnimationRegistry,
  RobotAnimationCategory,
  ROBOT_ANIMATION_CATEGORIES,
  IRobotAnimationPattern,
} from '../../core/animations/GSAPRobotAnimator';
import {
  HandAnchorManager,
  HandAnchorConfig,
} from '../../core/animations/HandAnchorManager';
import { RobotSEAudioEngine } from '../../core/audio/RobotSEAudioEngine';
import { GSAPRobotCanvas } from './GSAPRobotCanvas';
import { theme } from '../../styles/theme';
import { Card, Button, Badge } from '../ui/core';
import * as Gi from 'react-icons/gi';

// 代表的なデモ用プリセットロボット定義
const STUDIO_PRESET_ROBOTS: Robot[] = [
  {
    id: 'preset_paladin_star3',
    name: '★3 パラディン・アサルト (水)',
    parts: {
      head: { id: 'p_h3', name: 'パラディンヘッド', type: 'head', rarity: 3, visualIndex: 0, attribute: 'Water', stats: { hp: 120, power: 80, defense: 90, agility: 70, dexterity: 60, intelligence: 85 } },
      body: { id: 'p_b3', name: 'パラディンボディ', type: 'body', rarity: 3, visualIndex: 0, attribute: 'Water', stats: { hp: 150, power: 75, defense: 110, agility: 65, dexterity: 50, intelligence: 70 } },
      arms: { id: 'p_a3', name: 'パラディンアーム', type: 'arms', rarity: 3, visualIndex: 0, attribute: 'Water', stats: { hp: 80, power: 120, defense: 60, agility: 80, dexterity: 95, intelligence: 60 } },
      legs: { id: 'p_l3', name: 'パラディンレッグ', type: 'legs', rarity: 3, visualIndex: 0, attribute: 'Water', stats: { hp: 90, power: 60, defense: 85, agility: 110, dexterity: 70, intelligence: 50 } },
    },
    stats: { hp: 440, power: 335, defense: 345, agility: 325, dexterity: 275, intelligence: 265 },
    createdAt: Date.now(),
    value: 500,
  },
  {
    id: 'preset_cyber_star2',
    name: '★2 サイバー・センチネル (火)',
    parts: {
      head: { id: 'p_h2', name: 'センサーヘッド', type: 'head', rarity: 2, visualIndex: 1, attribute: 'Fire', stats: { hp: 70, power: 50, defense: 45, agility: 50, dexterity: 60, intelligence: 60 } },
      body: { id: 'p_b2', name: 'ハイテクコアボディ', type: 'body', rarity: 2, visualIndex: 0, attribute: 'Fire', stats: { hp: 90, power: 60, defense: 70, agility: 40, dexterity: 40, intelligence: 50 } },
      arms: { id: 'p_a2', name: 'サイバーアーム', type: 'arms', rarity: 2, visualIndex: 1, attribute: 'Fire', stats: { hp: 50, power: 75, defense: 40, agility: 55, dexterity: 70, intelligence: 40 } },
      legs: { id: 'p_l2', name: 'サイバーツインレッグ', type: 'legs', rarity: 2, visualIndex: 0, attribute: 'Fire', stats: { hp: 60, power: 40, defense: 50, agility: 75, dexterity: 50, intelligence: 35 } },
    },
    stats: { hp: 270, power: 225, defense: 205, agility: 220, dexterity: 220, intelligence: 185 },
    createdAt: Date.now() - 100000,
    value: 260,
  },
  {
    id: 'preset_classic_star1',
    name: '★1 ポンコツ・クラシック (風)',
    parts: {
      head: { id: 'p_h1', name: 'ベーシックヘッド', type: 'head', rarity: 1, visualIndex: 0, attribute: 'Wind', stats: { hp: 30, power: 20, defense: 20, agility: 20, dexterity: 20, intelligence: 20 } },
      body: { id: 'p_b1', name: 'ベーシックボディ', type: 'body', rarity: 1, visualIndex: 0, attribute: 'Wind', stats: { hp: 40, power: 25, defense: 30, agility: 15, dexterity: 15, intelligence: 15 } },
      arms: { id: 'p_a1', name: 'ベーシックアーム', type: 'arms', rarity: 1, visualIndex: 0, attribute: 'Wind', stats: { hp: 20, power: 35, defense: 15, agility: 25, dexterity: 30, intelligence: 15 } },
      legs: { id: 'p_l1', name: 'ベーシックレッグ', type: 'legs', rarity: 1, visualIndex: 0, attribute: 'Wind', stats: { hp: 25, power: 15, defense: 20, agility: 35, dexterity: 20, intelligence: 10 } },
    },
    stats: { hp: 115, power: 95, defense: 85, agility: 95, dexterity: 85, intelligence: 60 },
    createdAt: Date.now() - 200000,
    value: 100,
  },
  {
    id: 'preset_golem_star3',
    name: '★3 ヘビーゴーレム・フォートレス (地)',
    parts: {
      head: { id: 'p_hg3', name: 'ゴーレムヘッド', type: 'head', rarity: 3, visualIndex: 1, attribute: 'Earth', stats: { hp: 160, power: 90, defense: 120, agility: 40, dexterity: 50, intelligence: 60 } },
      body: { id: 'p_bg3', name: 'フォートレスコア', type: 'body', rarity: 3, visualIndex: 1, attribute: 'Earth', stats: { hp: 190, power: 100, defense: 140, agility: 35, dexterity: 45, intelligence: 55 } },
      arms: { id: 'p_ag3', name: 'ヘビークラッシャー', type: 'arms', rarity: 3, visualIndex: 1, attribute: 'Earth', stats: { hp: 110, power: 140, defense: 90, agility: 50, dexterity: 60, intelligence: 50 } },
      legs: { id: 'p_lg3', name: 'クローラーレッグ', type: 'legs', rarity: 3, visualIndex: 1, attribute: 'Earth', stats: { hp: 130, power: 70, defense: 130, agility: 60, dexterity: 50, intelligence: 45 } },
    },
    stats: { hp: 590, power: 400, defense: 480, agility: 185, dexterity: 205, intelligence: 210 },
    createdAt: Date.now() - 300000,
    value: 650,
  },
  {
    id: 'preset_light_star3',
    name: '★3 プライムオメガ・ブレイズ (光)',
    parts: {
      head: { id: 'p_hl3', name: 'オメガクラウン', type: 'head', rarity: 3, visualIndex: 2, attribute: 'Light', stats: { hp: 140, power: 110, defense: 95, agility: 100, dexterity: 90, intelligence: 120 } },
      body: { id: 'p_bl3', name: 'オメガジェネレーター', type: 'body', rarity: 3, visualIndex: 2, attribute: 'Light', stats: { hp: 160, power: 105, defense: 100, agility: 95, dexterity: 85, intelligence: 110 } },
      arms: { id: 'p_al3', name: 'オメガブラスター', type: 'arms', rarity: 3, visualIndex: 2, attribute: 'Light', stats: { hp: 95, power: 150, defense: 80, agility: 115, dexterity: 120, intelligence: 90 } },
      legs: { id: 'p_ll3', name: 'オメガブースター', type: 'legs', rarity: 3, visualIndex: 2, attribute: 'Light', stats: { hp: 110, power: 85, defense: 90, agility: 145, dexterity: 95, intelligence: 80 } },
    },
    stats: { hp: 505, power: 450, defense: 365, agility: 455, dexterity: 390, intelligence: 400 },
    createdAt: Date.now() - 400000,
    value: 800,
  }
];

export interface GSAPMotionStudioModalProps {
  initialRobot?: Robot | null;
  robotsList?: Robot[];
  onClose: () => void;
}

export const GSAPMotionStudioModal: React.FC<GSAPMotionStudioModalProps> = ({
  initialRobot,
  robotsList = [],
  onClose,
}) => {
  // 利用可能な全ロボットリスト（ユーザー所持機体 + プリセット機体）
  const combinedRobotsList = useMemo(() => {
    const list: Robot[] = [];
    const seen = new Set<string>();

    // ユーザー作成機体
    robotsList.forEach(r => {
      if (r && r.id && !seen.has(r.id)) {
        seen.add(r.id);
        list.push(r);
      }
    });

    // initialRobot があれば追加
    if (initialRobot && !seen.has(initialRobot.id)) {
      seen.add(initialRobot.id);
      list.unshift(initialRobot);
    }

    // プリセット機体を追加
    STUDIO_PRESET_ROBOTS.forEach(p => {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        list.push(p);
      }
    });

    return list;
  }, [robotsList, initialRobot]);

  const defaultRobot = initialRobot || combinedRobotsList[0] || STUDIO_PRESET_ROBOTS[0];
  const [selectedRobotId, setSelectedRobotId] = useState<string>(defaultRobot.id);
  const [selectedCategory, setSelectedCategory] = useState<RobotAnimationCategory>(
    RobotAnimationCategory.COMBAT
  );
  const [selectedPatternId, setSelectedPatternId] = useState<string>('fire_slash');
  const [speed, setSpeed] = useState<number>(1.0);
  const [loop, setLoop] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [stageTheme, setStageTheme] = useState<'dark' | 'light' | 'grid'>('dark');
  const [showJoints, setShowJoints] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const lastTriggeredTimeRef = useRef<number>(-1);

  // 現在選択されているロボット
  const currentRobot = useMemo(() => {
    return combinedRobotsList.find(r => r.id === selectedRobotId) || defaultRobot;
  }, [combinedRobotsList, selectedRobotId, defaultRobot]);

  // 現在のアームパーツ識別Key (例: arm_r1_v0)
  const currentArmPartKey = useMemo(() => {
    const arms = currentRobot?.parts?.arms || { rarity: 1, visualIndex: 0 };
    return HandAnchorManager.generatePartKey(arms.rarity, arms.visualIndex);
  }, [currentRobot]);

  // 現在の腕関節アンカー設定（肩・拳：アニメーション再生に使用）
  const [handConfig, setHandConfig] = useState<HandAnchorConfig>(() => {
    return HandAnchorManager.getInstance().getHandConfig(currentArmPartKey);
  });

  // HandAnchorManager の変更をリッスンして常に同期
  useEffect(() => {
    setHandConfig(HandAnchorManager.getInstance().getHandConfig(currentArmPartKey));
    const unsub = HandAnchorManager.getInstance().subscribe(() => {
      setHandConfig(HandAnchorManager.getInstance().getHandConfig(currentArmPartKey));
    });
    return unsub;
  }, [currentArmPartKey]);

  // レジストリからパターン一覧を取得
  const registry = useMemo(() => GSAPRobotAnimationRegistry.getInstance(), []);

  const allPatterns = useMemo(() => registry.getAllPatterns(), [registry]);

  const categoryPatterns = useMemo(() => {
    return registry.getPatternsByCategory(selectedCategory);
  }, [registry, selectedCategory]);

  const currentPattern = useMemo(() => {
    return registry.getPattern(selectedPatternId) || allPatterns[0];
  }, [registry, selectedPatternId, allPatterns]);

  // 前後のロボットに切り替え
  const handlePrevRobot = () => {
    if (combinedRobotsList.length <= 1) return;
    const currentIndex = combinedRobotsList.findIndex(r => r.id === currentRobot.id);
    const prevIndex = (currentIndex - 1 + combinedRobotsList.length) % combinedRobotsList.length;
    setSelectedRobotId(combinedRobotsList[prevIndex].id);
  };

  const handleNextRobot = () => {
    if (combinedRobotsList.length <= 1) return;
    const currentIndex = combinedRobotsList.findIndex(r => r.id === currentRobot.id);
    const nextIndex = (currentIndex + 1) % combinedRobotsList.length;
    setSelectedRobotId(combinedRobotsList[nextIndex].id);
  };

  // 最高レアリティ
  const maxRarity = Math.max(
    currentRobot.parts.head?.rarity || 1,
    currentRobot.parts.body?.rarity || 1,
    currentRobot.parts.arms?.rarity || 1,
    currentRobot.parts.legs?.rarity || 1
  );

  return (
    <div 
      id="gsap-motion-studio-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 pt-16 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-[#faf5ee] border-2 border-[#c29b77] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ヘッダー */}
        <div className="bg-[#451a03] text-white px-4 py-3 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500 rounded-lg text-stone-900 shadow-sm">
              <Gi.GiFilmProjector size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`${theme.typography.h3} text-amber-300 tracking-wide font-black`}>
                  GSAP ロボットモーションスタジオ
                </h3>
                <span className="text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  Next-Gen Rig Engine
                </span>
              </div>
              <p className="text-xs text-stone-300">
                パーツ別独立可動・解剖学的ジョイント・武装エフェクトによる多彩なアクション鑑賞
              </p>
            </div>
          </div>

          <button
            id="close-gsap-studio-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="スタジオを閉じる"
          >
            ✕
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto space-y-4">
          {/* 機体セレクター＆概要バー */}
          <div className="bg-white/95 border-2 border-stone-300 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap">
              {combinedRobotsList.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevRobot}
                  className="p-1.5 rounded-lg bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
                  title="前の機体へ"
                >
                  <Gi.GiPreviousButton size={16} />
                </button>
              )}

              {/* 機体セレクトボックス */}
              <select
                className="p-1.5 border border-stone-300 rounded-lg bg-white text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[240px] truncate"
                value={currentRobot.id}
                onChange={e => setSelectedRobotId(e.target.value)}
              >
                {combinedRobotsList.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-0.5">
                  <Gi.GiStarFormation size={12} />★{maxRarity}
                </span>
                <div className="flex items-center gap-1">
                  {['head', 'body', 'arms', 'legs'].map(partType => {
                    const part = (currentRobot.parts as any)?.[partType];
                    if (!part) return null;
                    return (
                      <span
                        key={partType}
                        className="text-[9px] px-1.5 py-0.2 rounded font-bold text-white shadow-2xs"
                        style={{ backgroundColor: AttributeColors[part.attribute] || '#78716c' }}
                      >
                        {AttributeNames[part.attribute]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {combinedRobotsList.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextRobot}
                  className="p-1.5 rounded-lg bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
                  title="次の機体へ"
                >
                  <Gi.GiNextButton size={16} />
                </button>
              )}
            </div>

            {/* ステージ背景 ＆ ジョイントHUD切替 */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowJoints(!showJoints)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                  showJoints
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm ring-2 ring-cyan-400/40'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border-stone-300'
                }`}
              >
                <Gi.GiGears size={14} />
                {showJoints ? 'ボーンHUD ON' : 'ボーンHUD'}
              </button>

              <div className="flex items-center gap-1 bg-stone-200 p-0.5 rounded-lg border border-stone-300">
                <button
                  type="button"
                  onClick={() => setStageTheme('dark')}
                  className={`px-2 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                    stageTheme === 'dark'
                      ? 'bg-stone-900 text-amber-300 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  サイバー
                </button>
                <button
                  type="button"
                  onClick={() => setStageTheme('light')}
                  className={`px-2 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                    stageTheme === 'light'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  工房ライト
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* 左側：アニメーションビューポート & コントロール (6 / 12) */}
            <div className="lg:col-span-6 space-y-3 flex flex-col">
              {/* ビューポート */}
              <div
                className={`${
                  stageTheme === 'dark'
                    ? 'bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-stone-700'
                    : 'bg-stone-200/90 border-2 border-stone-300'
                } rounded-2xl h-72 sm:h-80 flex flex-col items-center justify-center p-3 relative shadow-inner overflow-visible z-10`}
              >
                {/* グリッド演出 */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    backgroundPosition: 'center center',
                  }}
                />

                {/* GSAP アニメーションキャンバス（高精細・確実なSVG表示） */}
                <GSAPRobotCanvas
                  robot={currentRobot}
                  size={220}
                  patternId={selectedPatternId}
                  speed={speed}
                  loop={loop}
                  isPaused={isPaused}
                  showJoints={showJoints}
                  zoom={zoom}
                  onProgress={p => {
                    const roundedProgress = Math.round(p * 100);
                    setAnimProgress(roundedProgress);

                    // SEマーカーの自動再生トリガー
                    const markers = currentPattern.seMarkers;
                    if (markers && markers.length > 0 && !isMuted) {
                      const currentTime = p * currentPattern.duration;
                      if (p < 0.04) {
                        lastTriggeredTimeRef.current = -0.01;
                      }
                      const lastTime = lastTriggeredTimeRef.current;
                      markers.forEach(m => {
                        if (lastTime < m.time && currentTime >= m.time) {
                          RobotSEAudioEngine.getInstance().playSE(m.type);
                        }
                      });
                      lastTriggeredTimeRef.current = currentTime;
                    }
                  }}
                />

                {/* 現在のアニメーションバナー */}
                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                  <span className="text-[11px] font-bold bg-stone-900/85 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/50 backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                    <Gi.GiPlayButton className="text-amber-400 text-xs" />
                    {currentPattern.name}
                  </span>
                </div>

                {/* ズームコントローラー */}
                <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-stone-900/80 backdrop-blur-xs px-1.5 py-1 rounded-lg border border-stone-700">
                  <button
                    type="button"
                    onClick={() => setZoom(Math.max(0.8, zoom - 0.2))}
                    className="text-stone-300 hover:text-amber-300 font-bold px-1 text-xs"
                    title="縮小"
                  >
                    -
                  </button>
                  <span className="text-[10px] font-mono text-amber-300 font-bold px-1">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom(Math.min(1.6, zoom + 0.2))}
                    className="text-stone-300 hover:text-amber-300 font-bold px-1 text-xs"
                    title="拡大"
                  >
                    +
                  </button>
                </div>

                {/* 進捗・ループ表示 */}
                <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold bg-stone-900/85 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
                    {animProgress}%
                  </span>
                  <span className="text-[10px] font-bold bg-stone-900/85 text-stone-300 px-2 py-0.5 rounded border border-stone-600">
                    {loop ? '🔁 ループ' : '▶ 単発'}
                  </span>
                </div>
              </div>

              {/* コントロールバー */}
              <div className="bg-white/95 border-2 border-stone-300 rounded-xl p-3 space-y-2.5 shadow-2xs">
                {/* タイムライン進捗バー（視覚化 ＆ SEマーカー配置） */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <span>タイムライン進行度</span>
                      {currentPattern.seMarkers && currentPattern.seMarkers.length > 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                          <span>⚔️</span>
                          <span>SEマーカー: {currentPattern.seMarkers.length}箇所</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-700">
                        {((animProgress * currentPattern.duration) / 100).toFixed(2)}s / {currentPattern.duration}s ({animProgress}%)
                      </span>
                      {/* SE 音声ミュートトグル */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = RobotSEAudioEngine.getInstance().toggleMute();
                          setIsMuted(next);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors border cursor-pointer ${
                          !isMuted
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-stone-200 text-stone-600 border-stone-300'
                        }`}
                        title={!isMuted ? 'SE効果音 ON (クリックでミュート)' : 'SE効果音 OFF (クリックで有効化)'}
                      >
                        {!isMuted ? '🔊 SE ON' : '🔇 SE OFF'}
                      </button>
                    </div>
                  </div>

                  {/* プログレスバー本体＋SEマーカーの配置 */}
                  <div className="relative w-full bg-stone-200 h-3 rounded-full border border-stone-300">
                    {/* バー背景グラデーション進行ゲージ */}
                    <div
                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-75"
                      style={{ width: `${animProgress}%` }}
                    />

                    {/* SEマーカーピンの配置 */}
                    {currentPattern.seMarkers?.map((marker, idx) => {
                      const pct = Math.min(100, Math.max(0, (marker.time / currentPattern.duration) * 100));
                      const isPassed = (animProgress / 100) * currentPattern.duration >= marker.time;
                      const markerColor =
                        marker.type === 'slash' ? 'bg-rose-500 text-white border-rose-200 ring-rose-400' :
                        marker.type === 'flame' ? 'bg-orange-500 text-white border-orange-200 ring-orange-400' :
                        marker.type === 'draw' ? 'bg-amber-500 text-white border-amber-200 ring-amber-400' :
                        marker.type === 'hit' ? 'bg-purple-600 text-white border-purple-200 ring-purple-400' :
                        marker.type === 'cutin' ? 'bg-amber-400 text-stone-900 border-amber-100 ring-amber-300 animate-pulse' :
                        marker.type === 'laser' ? 'bg-cyan-500 text-white border-cyan-100 ring-cyan-300' :
                        marker.type === 'charge' ? 'bg-emerald-500 text-white border-emerald-100 ring-emerald-300' :
                        marker.type === 'hyper' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-yellow-200 ring-red-400 font-black' :
                        'bg-cyan-600 text-white border-cyan-200 ring-cyan-400';

                      return (
                        <div
                          key={idx}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group/marker cursor-pointer"
                          style={{ left: `${pct}%` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            RobotSEAudioEngine.getInstance().playSE(marker.type);
                          }}
                          title={`${marker.label} (${marker.time}s) - クリックでSE試聴`}
                        >
                          {/* 縦のガイドライン */}
                          <div className={`w-0.5 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isPassed ? 'bg-amber-300' : 'bg-stone-400'} pointer-events-none opacity-60`} />
                          {/* マーカーピン */}
                          <div className={`w-4 h-4 rounded-full border shadow-sm flex items-center justify-center text-[9px] font-bold transition-transform group-hover/marker:scale-125 ${markerColor} ${isPassed ? 'ring-2' : 'opacity-85'}`}>
                            {marker.type === 'slash' ? '⚔️' :
                             marker.type === 'flame' ? '🔥' :
                             marker.type === 'draw' ? '🗡️' :
                             marker.type === 'hit' ? '💥' :
                             marker.type === 'cutin' ? '👁️' :
                             marker.type === 'laser' ? '💫' :
                             marker.type === 'charge' ? '⚡' :
                             marker.type === 'hyper' ? '🌟' : '⚡'}
                          </div>

                          {/* ホバーツールチップ */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/marker:flex flex-col items-center pointer-events-none z-30">
                            <div className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-amber-500/50 flex items-center gap-1">
                              <span>{marker.label}</span>
                              <span className="text-amber-400 font-mono">({marker.time}s)</span>
                              <span className="text-stone-400 text-[9px]">♪試聴</span>
                            </div>
                            <div className="w-1.5 h-1.5 bg-stone-900 rotate-45 -mt-0.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* マーカーの凡例・個別トリガーチップ一覧 */}
                  {currentPattern.seMarkers && currentPattern.seMarkers.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-stone-500 font-bold">SEタイミング:</span>
                      {currentPattern.seMarkers.map((marker, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => RobotSEAudioEngine.getInstance().playSE(marker.type)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="クリックでSEを試聴"
                        >
                          <span>
                            {marker.type === 'slash' ? '⚔️' :
                             marker.type === 'flame' ? '🔥' :
                             marker.type === 'draw' ? '🗡️' :
                             marker.type === 'hit' ? '💥' :
                             marker.type === 'cutin' ? '👁️' :
                             marker.type === 'laser' ? '💫' :
                             marker.type === 'charge' ? '⚡' :
                             marker.type === 'hyper' ? '🌟' : '✨'}
                          </span>
                          <span className="font-medium">{marker.label}</span>
                          <span className="text-stone-400 font-mono text-[9px]">{marker.time}s</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  {/* 再生 / 一時停止 */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      id="studio-play-pause-btn"
                      size="sm"
                      variant={isPaused ? 'primary' : 'secondary'}
                      onClick={() => setIsPaused(!isPaused)}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 cursor-pointer font-bold"
                    >
                      {isPaused ? <Gi.GiPlayButton size={14} /> : <Gi.GiPauseButton size={14} />}
                      {isPaused ? '再生' : '一時停止'}
                    </Button>

                    <Button
                      id="studio-loop-btn"
                      size="sm"
                      variant={loop ? 'primary' : 'secondary'}
                      onClick={() => setLoop(!loop)}
                      className="text-xs px-2.5 py-1.5 cursor-pointer"
                    >
                      {loop ? 'ループON' : 'ループOFF'}
                    </Button>
                  </div>

                  {/* 速度セレクター */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-stone-600">速度:</span>
                    {[0.5, 1.0, 1.5, 2.0].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpeed(s)}
                        className={`px-2 py-1 text-xs rounded font-bold transition-all cursor-pointer ${
                          speed === s
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 現在のモーション詳細カード */}
              <Card className="bg-amber-50/70 border border-amber-300 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {currentPattern.name}
                    </span>
                    <Badge variant="primary" className="text-[10px]">
                      {currentPattern.duration}秒
                    </Badge>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    ID: {currentPattern.id}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {currentPattern.description}
                </p>

                {/* GSAP技術ハイライト */}
                <div className="border-t border-amber-200/80 pt-2 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
                    <Gi.GiSparkles className="text-amber-500" />
                    <span>GSAP 実装ハイライト</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {currentPattern.technicalHighlights.map((tech, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-stone-600 bg-white/80 px-2 py-1 rounded border border-amber-200 flex items-start gap-1.5"
                      >
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* 右側：カテゴリー＆モーションパターン一覧 (6 / 12) */}
            <div className="lg:col-span-6 space-y-3 flex flex-col">
              {/* カテゴリータブ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-stone-200/80 p-1.5 rounded-xl border border-stone-300">
                {ROBOT_ANIMATION_CATEGORIES.map(cat => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const firstInCat = registry.getPatternsByCategory(cat.id)[0];
                        if (firstInCat) {
                          setSelectedPatternId(firstInCat.id);
                        }
                      }}
                      className={`p-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50'
                          : 'bg-white/80 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span>{cat.name.split(' ')[0]}</span>
                      <span className="text-[10px] opacity-80 font-normal">
                        ({registry.getPatternsByCategory(cat.id).length})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* カテゴリー説明 */}
              <div className="bg-amber-100/60 border border-amber-300/80 rounded-lg p-2 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  {ROBOT_ANIMATION_CATEGORIES.find(c => c.id === selectedCategory)?.description}
                </span>
                <span className="font-bold text-amber-800 whitespace-nowrap ml-2">
                  全{categoryPatterns.length}種
                </span>
              </div>

              {/* パターンリスト */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[460px] pr-1">
                {categoryPatterns.map(pattern => {
                  const isSelected = pattern.id === selectedPatternId;
                  return (
                    <div
                      key={pattern.id}
                      onClick={() => setSelectedPatternId(pattern.id)}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                          : 'bg-white border-stone-300 hover:border-amber-300 hover:bg-amber-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className={`font-bold text-xs ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
                          {pattern.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 whitespace-nowrap">
                          {pattern.duration}s
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                        {pattern.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[10px] text-stone-500">
                        <span className="flex items-center gap-1">
                          {pattern.loop ? <span className="text-emerald-600 font-bold">🔁 ループ</span> : <span className="text-amber-600 font-bold">▶ 1回</span>}
                        </span>
                        <span className={`font-bold ${isSelected ? 'text-amber-600' : 'text-stone-400'}`}>
                          {isSelected ? '● 選択中' : 'タップで再生'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="bg-stone-200/90 border-t border-stone-300 px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-600 flex items-center gap-1.5">
            <Gi.GiFilmSpool className="text-amber-600" />
            <span>登録済み GSAP モーションパターン: <strong>{allPatterns.length}種類</strong> (全カテゴリー)</span>
          </div>

          <Button
            id="close-gsap-studio-bottom-btn"
            size="sm"
            variant="secondary"
            onClick={onClose}
            className="text-xs px-4 py-1.5 cursor-pointer"
          >
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
};
