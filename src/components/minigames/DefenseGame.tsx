import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Robot } from '../../core/models';
import { DefenseStage } from './Shared';
import { Button, Card } from '../ui/core';
import * as Gi from 'react-icons/gi';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { theme } from '../../styles/theme';
import { DungeonMapGenerator } from './defense/DungeonMapGenerator';
import { DungeonTileView } from './defense/DungeonTileView';
import { EnemyRobotView } from './defense/EnemyRobotView';
import { DefenseTowerView } from './defense/DefenseTowerView';
import { DungeonMap, Enemy, Tower, Projectile, HitParticle, Point, EnemyType } from './defense/types';

interface DefenseGameProps {
  robots: Robot[];
  stage: DefenseStage;
  onFinish: (result: 'win' | 'lose') => void;
  speed: number;
  isPaused: boolean;
  isFinished: boolean;
  battleResult: 'win' | 'lose' | 'draw' | null;
  onExit: () => void;
}

export const DefenseGame: React.FC<DefenseGameProps> = ({
  robots,
  stage,
  onFinish,
  speed,
  isPaused,
  isFinished,
  battleResult,
  onExit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  // ズーム・パン状態
  const [zoom, setZoom] = useState<number>(1.0); // 1.0x 〜 2.5x
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialPanX: number;
    initialPanY: number;
    hasMoved: boolean;
  } | null>(null);

  const pinchRef = useRef<{
    initialDist: number;
    initialZoom: number;
  } | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [baseHp, setBaseHp] = useState(stage.baseHp);
  const [spawnedCount, setSpawnedCount] = useState(0);
  const [defeatedCount, setDefeatedCount] = useState(0);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);

  // スマホ画面やウィンドウリサイズに応じたリアルタイムコンテナ寸法監視
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 基本フィットスケール（800x600のマップをコンテナに合わせて最大限大きく迫力あるサイズにスケーリング）
  const baseFitScale = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return 1.0;
    const scaleX = containerSize.width / 800;
    const scaleY = containerSize.height / 600;
    // 画面に収まる最大倍率（キャップを解除し、大画面でもダイナミックに最大表示）
    return Math.max(0.48, Math.min(scaleX, scaleY));
  }, [containerSize.width, containerSize.height]);

  const effectiveScale = baseFitScale * zoom;

  // パンオフセットの範囲制約（マップが画面外へ飛び出さないようクランプ）
  const clampPan = useCallback(
    (x: number, y: number, currentZoom: number) => {
      const curEffectiveScale = baseFitScale * currentZoom;
      const displayW = 800 * curEffectiveScale;
      const displayH = 600 * curEffectiveScale;

      const maxPanX = Math.max(0, (displayW - containerSize.width) / 2);
      const maxPanY = Math.max(0, (displayH - containerSize.height) / 2);

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, y)),
      };
    },
    [baseFitScale, containerSize.width, containerSize.height]
  );

  // ズーム変更時のパン調整
  const handleSetZoom = useCallback(
    (newZoomOrUpdater: number | ((prev: number) => number)) => {
      setZoom(prevZoom => {
        const rawNewZoom =
          typeof newZoomOrUpdater === 'function' ? newZoomOrUpdater(prevZoom) : newZoomOrUpdater;
        const clampedZoom = Math.max(1.0, Math.min(2.5, rawNewZoom));
        setPanOffset(prevPan => clampPan(prevPan.x, prevPan.y, clampedZoom));
        return clampedZoom;
      });
    },
    [clampPan]
  );

  // ズームリセット（1.0倍・中央配置）
  const handleResetView = useCallback(() => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // タッチ操作（ピンチイン・アウト ＆ 1本指スワイプパン）
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      dragRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        initialPanX: panOffset.x,
        initialPanY: panOffset.y,
        hasMoved: false,
      };
      setIsPanning(true);
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchRef.current = {
        initialDist: dist,
        initialZoom: zoom,
      };
      dragRef.current = null;
      setIsPanning(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && dragRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - dragRef.current.startX;
      const dy = t.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > 6) {
        dragRef.current.hasMoved = true;
      }

      if (zoom > 1.0 || dragRef.current.hasMoved) {
        const newPan = clampPan(
          dragRef.current.initialPanX + dx,
          dragRef.current.initialPanY + dy,
          zoom
        );
        setPanOffset(newPan);
      }
    } else if (e.touches.length === 2 && pinchRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const newDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (pinchRef.current.initialDist > 0) {
        const ratio = newDist / pinchRef.current.initialDist;
        const targetZoom = pinchRef.current.initialZoom * ratio;
        handleSetZoom(targetZoom);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) {
      dragRef.current = null;
      pinchRef.current = null;
      setIsPanning(false);
    } else if (e.touches.length === 1) {
      // 1本指に戻った場合
      const t = e.touches[0];
      dragRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        initialPanX: panOffset.x,
        initialPanY: panOffset.y,
        hasMoved: false,
      };
      pinchRef.current = null;
    }
  };

  // マウスドラッグ操作（パン）
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 左クリックのみ
    if (e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: panOffset.x,
      initialPanY: panOffset.y,
      hasMoved: false,
    };
    setIsPanning(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.hypot(dx, dy) > 6) {
      dragRef.current.hasMoved = true;
    }

    if (zoom > 1.0 || dragRef.current.hasMoved) {
      const newPan = clampPan(
        dragRef.current.initialPanX + dx,
        dragRef.current.initialPanY + dy,
        zoom
      );
      setPanOffset(newPan);
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    setIsPanning(false);
  };

  // マウスホイールによるズーム
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    handleSetZoom(z => z + delta);
  };

  // マップ生成シード（出撃ごとに毎回異なるマップが自動生成されます）
  const [mapSeed, setMapSeed] = useState<number>(() => Date.now());

  // ステージごとのダンジョンマップ自動生成（Kenney公式タイル＆動的ルート）
  const dungeonMap: DungeonMap = useMemo(() => {
    const generator = new DungeonMapGenerator();
    return generator.generate(stage.id, stage.maxRobots, mapSeed);
  }, [stage.id, stage.maxRobots, mapSeed]);

  // レンダリング用ステート（React DOMで表示する敵リスト・タワーリスト）
  const [renderEnemies, setRenderEnemies] = useState<Enemy[]>([]);
  const [renderTowers, setRenderTowers] = useState<Tower[]>([]);

  // requestAnimationFrame 用ゲーム内部参照
  const gameState = useRef({
    enemies: [] as Enemy[],
    towers: [] as Tower[],
    projectiles: [] as Projectile[],
    particles: [] as HitParticle[],
    baseHp: stage.baseHp,
    spawnedCount: 0,
    defeatedCount: 0,
    timeSinceLastSpawn: 0,
    enemyIdCounter: 0,
    projectileIdCounter: 0,
    particleIdCounter: 0,
    lastTime: 0,
  });

  // ロボットタワーとゲーム状態の初期化
  const robotIdsKey = robots.map(r => r.id).join(',');

  useEffect(() => {
    // 既に戦闘が始まっている場合は再初期化しない（敵や撃破カウントが消滅するのを防止）
    if (hasStarted) return;

    // Powerが高い順にソートし、防衛拠点（工房）に近いタワースポットへ優先配置
    const sortedRobots = [...robots].sort(
      (a, b) => (b.stats.power || 0) - (a.stats.power || 0)
    );

    const towers: Tower[] = sortedRobots.slice(0, stage.maxRobots).map((robot, idx) => {
      const pos = dungeonMap.towerPositions[idx] || { x: 400, y: 300 };
      const pow = robot.stats.power || 10;
      const agi = robot.stats.agility || 10;
      const int = robot.stats.intelligence || 10;
      const dex = robot.stats.dexterity || 10;

      // Intelligence & Dexterity及び他能力値による攻撃パターン・技の決定
      let skillName = 'アサルト弾';
      let skillType: Tower['skillType'] = 'bullet';
      let skillMultiplier = 1.5;
      let splashRadius = 26;
      let bulletSpeed = 540;
      let bulletColor = '#f97316';
      let range = 120 + int * 1.5;

      if (int >= 35 && dex >= 30) {
        // 超絶技: ディメンションノヴァ
        skillName = '極滅ノヴァ';
        skillType = 'nova';
        skillMultiplier = 4.2;
        splashRadius = 60;
        bulletSpeed = 520;
        bulletColor = '#c084fc';
        range = 160 + int * 1.2;
      } else if (int >= 28 && pow >= 25) {
        // 強力技: メガ粒子レールガン
        skillName = '粒子砲';
        skillType = 'laser';
        skillMultiplier = 3.2;
        splashRadius = 35;
        bulletSpeed = 760;
        bulletColor = '#38bdf8';
        range = 175 + int * 1.0;
      } else if (agi >= 28 && dex >= 20) {
        // 連射技: ガトリングラッシュ
        skillName = '乱舞弾';
        skillType = 'gatling';
        skillMultiplier = 1.8;
        splashRadius = 20;
        bulletSpeed = 620;
        bulletColor = '#fbbf24';
        range = 130 + int * 1.0;
      } else if (int >= 20 && dex >= 15) {
        // 榴弾技: プラズマバースト
        skillName = '爆装弾';
        skillType = 'plasma';
        skillMultiplier = 2.4;
        splashRadius = 46;
        bulletSpeed = 480;
        bulletColor = '#34d399';
        range = 140 + int * 1.2;
      }

      // Agility: 行動値。この値が高いほど攻撃までのインターバル（クールダウン）が短縮
      let baseCooldown = Math.max(0.14, 1.6 / (1 + agi * 0.045));
      if (skillType === 'gatling') {
        baseCooldown *= 0.55; // ガトリング連射ボーナス
      }

      // Power: 1回の攻撃で与えられるダメージ量（技倍率との掛け算）
      const damage = Math.round(pow * 24 * skillMultiplier);

      return {
        id: robot.id,
        robot,
        x: pos.x,
        y: pos.y,
        gridX: Math.floor(pos.x / dungeonMap.cellSize),
        gridY: Math.floor(pos.y / dungeonMap.cellSize),
        range,
        damage,
        cooldown: 0,
        maxCooldown: baseCooldown,
        attackAnim: 0,
        targetPos: null,
        totalKills: 0,
        skillName,
        skillType,
        skillMultiplier,
        splashRadius,
        bulletSpeed,
        bulletColor,
      };
    });

    gameState.current.towers = towers;
    gameState.current.baseHp = stage.baseHp;
    gameState.current.spawnedCount = 0;
    gameState.current.defeatedCount = 0;
    gameState.current.enemies = [];
    gameState.current.projectiles = [];
    gameState.current.particles = [];

    setRenderTowers(towers);
    setRenderEnemies([]);
    setBaseHp(stage.baseHp);
    setSpawnedCount(0);
    setDefeatedCount(0);
  }, [robotIdsKey, stage.id, stage.maxRobots, stage.baseHp, dungeonMap, hasStarted]);

  // 効果音再生ユーティリティ
  const playSound = (type: 'laser' | 'hit' | 'explosion' | 'alarm') => {
    try {
      const ctx = (window as any).globalAudioCtx;
      if (!ctx || ctx.state !== 'running') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'explosion') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'alarm') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio errors safely ignored
    }
  };

  // メインゲームループ
  useEffect(() => {
    if (!hasStarted || isPaused || isFinished) return;

    let animationFrameId: number;
    gameState.current.lastTime = performance.now();
    let syncThrottle = 0;

    const loop = (time: number) => {
      const dt = Math.min((time - gameState.current.lastTime) / 1000, 0.1) * speed;
      gameState.current.lastTime = time;

      updateGame(dt);
      drawProjectilesAndParticles();

      // UI同期（フレームごとに同期するとスムーズ、60fps）
      syncThrottle += dt;
      if (syncThrottle >= 0.03) {
        syncThrottle = 0;
        // マップ内（および直近境界）に存在する敵のみを描画（ビューポートカリングで超軽量化）
        const sortedEnemies = gameState.current.enemies
          .filter(e => e.x >= -30 && e.x <= 830 && e.y >= -30 && e.y <= 630)
          .map(e => ({ ...e }))
          .sort((a, b) => a.y - b.y);
        setRenderEnemies(sortedEnemies);
        setRenderTowers(gameState.current.towers.map(t => ({ ...t })));
        setDefeatedCount(gameState.current.defeatedCount);
        setSpawnedCount(gameState.current.spawnedCount);
        setBaseHp(Math.max(0, gameState.current.baseHp));
      }

      if (!isFinished) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, isPaused, isFinished, speed]);

  // ゲーム状態更新
  const updateGame = (dt: number) => {
    const state = gameState.current;

    // 1. 敵のスポーン（マップ上の敵数制限なく、入口から大軍勢が怒涛の勢いで次々と出撃）
    if (state.spawnedCount < stage.totalEnemies) {
      state.timeSinceLastSpawn += dt;
      const spawnInterval = 1 / stage.spawnRate;

      while (
        state.timeSinceLastSpawn >= spawnInterval &&
        state.spawnedCount < stage.totalEnemies
      ) {
        state.timeSinceLastSpawn -= spawnInterval;

        // 1回で1〜3体の小隊として同時に出撃（入口から出る敵の数を増加）
        const remaining = stage.totalEnemies - state.spawnedCount;
        const spawnBatch = Math.min(
          Math.floor(1 + Math.random() * 2.5),
          remaining
        );

        for (let b = 0; b < spawnBatch; b++) {
          if (state.spawnedCount >= stage.totalEnemies) break;

          const currentSpawnIndex = state.spawnedCount + 1;
          let type: EnemyType = 'scout';
          let name = '偵察スカウト';
          let iconName = 'GiSpiderBot';
          let sprite = '/assets/kenney/robots/robot_greenDrive1.png';
          let colorClass = 'text-emerald-400';
          let hp = 1200;
          let eSpeed = 80;
          let size = 36;

          // 通常敵の決定ヘルパー（耐久値1000〜5000、脚が早いスプリンターボットを含む）
          const assignNormalEnemy = () => {
            const rand = Math.random();
            if (rand < 0.25) {
              // 脚が早い敵: 高速疾走スプリンターボット
              type = 'sprinter';
              name = '高速スプリンターボット';
              iconName = 'GiFastArrow';
              sprite = '/assets/kenney/robots/robot_greenDrive2.png';
              colorClass = 'text-emerald-400';
              hp = 1200 + Math.floor(Math.random() * 600); // 1200〜1800
              eSpeed = 135; // 脚が通常の約2〜3倍速い！
              size = 34;
            } else if (rand < 0.45) {
              // 偵察スカウト
              type = 'scout';
              name = '偵察スカウトボット';
              iconName = 'GiSpiderBot';
              sprite = '/assets/kenney/robots/robot_greenDrive1.png';
              colorClass = 'text-teal-400';
              hp = 1000 + Math.floor(Math.random() * 500); // 1000〜1500
              eSpeed = 80;
              size = 36;
            } else if (rand < 0.68) {
              // 機動クローラー
              type = 'crawler';
              name = '機動クローラーボット';
              iconName = 'GiMonoWheelRobot';
              sprite = '/assets/kenney/robots/robot_blueDrive1.png';
              colorClass = 'text-sky-400';
              hp = 2000 + Math.floor(Math.random() * 800); // 2000〜2800
              eSpeed = 65;
              size = 38;
            } else if (rand < 0.85) {
              // 重歩行ウォーカー
              type = 'walker';
              name = '重歩行ウォーカーボット';
              iconName = 'GiTrackedRobot';
              sprite = '/assets/kenney/robots/robot_yellowDrive1.png';
              colorClass = 'text-amber-400';
              hp = 3000 + Math.floor(Math.random() * 800); // 3000〜3800
              eSpeed = 48;
              size = 42;
            } else {
              // 重装甲ゴーレム
              type = 'golem';
              name = '重装甲アイアンゴーレム';
              iconName = 'GiRobotGolem';
              sprite = '/assets/kenney/robots/robot_redDrive1.png';
              colorClass = 'text-rose-500';
              hp = 4200 + Math.floor(Math.random() * 800); // 4200〜5000
              eSpeed = 32;
              size = 46;
            }
          };

          // 難易度ステージに応じた厳密な敵・ボス生成
          if (stage.id === 'stage5') {
            // レベル5: 敵数5000
            // 最初の2000は小ボス(10000)、次1500は中ボス(20000)、次1000は大ボス(30000)、そこから500毎に巨大ボス(50000)、最後は超巨大ボス(100000)
            if (currentSpawnIndex >= 5000) {
              type = 'super_giant_boss';
              name = '超巨大ボス: アポカリプスΩ';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-fuchsia-400';
              hp = 100000;
              eSpeed = 22;
              size = 72;
            } else if (currentSpawnIndex >= 4500 && currentSpawnIndex % 500 === 0) {
              type = 'giant_boss';
              name = '巨大ボス: ギガフォートレス零式';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dgrey.png';
              colorClass = 'text-red-500';
              hp = 50000;
              eSpeed = 28;
              size = 62;
            } else if (currentSpawnIndex <= 2000) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 10000;
              eSpeed = 45;
              size = 46;
            } else if (currentSpawnIndex <= 3500) {
              type = 'mid_boss';
              name = '中ボス: シージデストロイヤー';
              iconName = 'GiWarBonnet';
              sprite = '/assets/kenney/robots/robot_3Dyellow.png';
              colorClass = 'text-amber-400';
              hp = 20000;
              eSpeed = 40;
              size = 50;
            } else if (currentSpawnIndex <= 4500) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 30000;
              eSpeed = 34;
              size = 56;
            } else {
              assignNormalEnemy();
            }
          } else if (stage.id === 'stage4') {
            // レベル4: 敵数4000、1000毎に大ボス(30000)、最後に巨大ボス(50000)
            if (currentSpawnIndex >= 4000) {
              type = 'giant_boss';
              name = '巨大ボス: ギガフォートレス零式';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dgrey.png';
              colorClass = 'text-red-500';
              hp = 50000;
              eSpeed = 28;
              size = 62;
            } else if (currentSpawnIndex % 1000 === 0) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 30000;
              eSpeed = 34;
              size = 56;
            } else {
              assignNormalEnemy();
            }
          } else if (stage.id === 'stage3') {
            // レベル3: 敵数3000、1000毎に中ボス(20000)、最後に大ボス(30000)
            if (currentSpawnIndex >= 3000) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 30000;
              eSpeed = 34;
              size = 56;
            } else if (currentSpawnIndex % 1000 === 0) {
              type = 'mid_boss';
              name = '中ボス: シージデストロイヤー';
              iconName = 'GiWarBonnet';
              sprite = '/assets/kenney/robots/robot_3Dyellow.png';
              colorClass = 'text-amber-400';
              hp = 20000;
              eSpeed = 40;
              size = 50;
            } else {
              assignNormalEnemy();
            }
          } else if (stage.id === 'stage2') {
            // レベル2: 敵数2000、1000毎に小ボス(10000)
            if (currentSpawnIndex % 1000 === 0) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 10000;
              eSpeed = 45;
              size = 46;
            } else {
              assignNormalEnemy();
            }
          } else {
            // レベル1: ボスなし、すべて通常敵 (1000〜5000)
            assignNormalEnemy();
          }

          // 道幅50pxの中での横方向オフセット（-6px 〜 +6px に抑制し、タイルからのはみ出しを完全防止）
          const laneOffset = (Math.random() - 0.5) * 12;
          const bobPhase = Math.random() * Math.PI * 2;
          // 速度に微小な個体差をつけて自然な行軍
          const individualSpeed = eSpeed * (0.94 + Math.random() * 0.12);

          const startPt = dungeonMap.pathPoints[0];
          const nextPt = dungeonMap.pathPoints[1] || startPt;
          const segDx = nextPt.x - startPt.x;
          const segDy = nextPt.y - startPt.y;
          const segLen = Math.hypot(segDx, segDy) || 1;
          const nx = -segDy / segLen;
          const ny = segDx / segLen;

          state.enemies.push({
            id: ++state.enemyIdCounter,
            type,
            name,
            iconName,
            sprite,
            colorClass,
            hp,
            maxHp: hp,
            speed: individualSpeed,
            size,
            pathIndex: 0,
            laneOffset,
            bobPhase,
            x: startPt.x + nx * laneOffset - (b * 14),
            y: startPt.y + ny * laneOffset,
            isHit: false,
            facingLeft: false,
            stuckTimer: 0,
          });

          state.spawnedCount++;
        }
        setSpawnedCount(state.spawnedCount);
      }
    }

    // 2. 敵の移動（ウェイポイント追従 + ルート逸脱完全防止 + スタック防止）
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const e = state.enemies[i];
      e.isHit = false; // フラッシュリセット

      // 基地セル到達チェック
      if (e.pathIndex >= dungeonMap.pathPoints.length - 1) {
        const damageToBase =
          e.type === 'super_giant_boss'
            ? 30
            : e.type === 'giant_boss'
            ? 20
            : e.type === 'large_boss'
            ? 15
            : e.type === 'mid_boss'
            ? 10
            : e.type === 'mini_boss'
            ? 6
            : e.type === 'golem'
            ? 4
            : e.type === 'walker'
            ? 2
            : 1;

        state.baseHp -= damageToBase;
        state.enemies.splice(i, 1);
        setBaseHp(Math.max(0, state.baseHp));
        playSound('alarm');

        if (state.baseHp <= 0 && !isFinished) {
          onFinish('lose');
        }
        continue;
      }

      const currPt = dungeonMap.pathPoints[e.pathIndex];
      const targetPt = dungeonMap.pathPoints[e.pathIndex + 1];
      if (!targetPt) {
        e.pathIndex++;
        continue;
      }

      const segDx = targetPt.x - (currPt ? currPt.x : e.x);
      const segDy = targetPt.y - (currPt ? currPt.y : e.y);
      const segLen = Math.hypot(segDx, segDy) || 1;
      const nx = -segDy / segLen;
      const ny = segDx / segLen;

      // 曲がり角（目標点または現在点の16px以内）ではレーンオフセットをゼロに収束させてショートカット防止
      const distToCorner = Math.hypot(targetPt.x - e.x, targetPt.y - e.y);
      const effectiveOffset = distToCorner < 16 ? 0 : e.laneOffset;

      const goalX = targetPt.x + nx * effectiveOffset;
      const goalY = targetPt.y + ny * effectiveOffset;

      const dx = goalX - e.x;
      const dy = goalY - e.y;
      const dist = Math.hypot(dx, dy);
      const move = e.speed * dt;

      // 進行方向（左右反転判定）
      if (Math.abs(segDx) > 0.5) {
        e.facingLeft = segDx < 0;
      }

      // 到達判定
      if (dist <= move || dist < 12) {
        e.x = goalX;
        e.y = goalY;
        e.pathIndex++;
        e.stuckTimer = 0;
      } else {
        e.x += (dx / dist) * move;
        e.y += (dy / dist) * move;

        // スタック防止セーフティ
        e.stuckTimer = (e.stuckTimer || 0) + dt;
        if (e.stuckTimer >= 0.45) {
          e.stuckTimer = 0;
          e.pathIndex++;
        }
      }
    }

    // 2.5 敵同士のソフト分散（道タイル幅50pxから外れないよう、最大偏位±8pxに厳密クランプ）
    const enemyCount = state.enemies.length;
    const maxChecks = Math.min(enemyCount, 70);
    for (let a = 0; a < maxChecks; a++) {
      const ea = state.enemies[a];
      ea.bobPhase += dt * (ea.speed / 10);
      if (ea.pathIndex <= 1) continue;

      for (let b = a + 1; b < maxChecks; b++) {
        const eb = state.enemies[b];
        if (eb.pathIndex <= 1) continue;

        const ddx = eb.x - ea.x;
        const ddy = eb.y - ea.y;
        const d = Math.hypot(ddx, ddy);
        const minSpacing = (ea.size + eb.size) * 0.32;
        if (d < minSpacing && d > 0.001) {
          const overlap = (minSpacing - d) * 0.2;
          const pushX = (ddx / d) * overlap * 0.12;
          const pushY = (ddy / d) * overlap * 0.12;
          ea.x -= pushX;
          ea.y -= pushY;
          eb.x += pushX;
          eb.y += pushY;
        }
      }

      // セグメント中央線からの逸脱防止クランプ
      const curPt = dungeonMap.pathPoints[ea.pathIndex];
      const tgtPt = dungeonMap.pathPoints[ea.pathIndex + 1];
      if (curPt && tgtPt) {
        const vx = tgtPt.x - curPt.x;
        const vy = tgtPt.y - curPt.y;
        const len = Math.hypot(vx, vy);
        if (len > 0) {
          const u = Math.max(0, Math.min(1, ((ea.x - curPt.x) * vx + (ea.y - curPt.y) * vy) / (len * len)));
          const projX = curPt.x + u * vx;
          const projY = curPt.y + u * vy;
          const distToLine = Math.hypot(ea.x - projX, ea.y - projY);
          if (distToLine > 8) {
            ea.x = projX + ((ea.x - projX) / distToLine) * 8;
            ea.y = projY + ((ea.y - projY) / distToLine) * 8;
          }
        }
      }
    }

    // 3. 味方ロボットタワーの索敵＆迎撃
    for (const t of state.towers) {
      if (t.cooldown > 0) t.cooldown -= dt;
      if (t.attackAnim > 0) t.attackAnim -= dt;

      if (t.cooldown <= 0) {
        // 射程内の敵を探す（最も基地に近い進軍度の高い敵を優先）
        let bestTarget: Enemy | null = null;
        let maxProgress = -1;

        for (const e of state.enemies) {
          const dist = Math.hypot(e.x - t.x, e.y - t.y);
          if (dist <= t.range) {
            const nextPt = dungeonMap.pathPoints[e.pathIndex + 1];
            const distToNext = nextPt ? Math.hypot(nextPt.x - e.x, nextPt.y - e.y) : 0;
            const progress = e.pathIndex * 1000 + (1000 - distToNext);

            if (progress > maxProgress) {
              maxProgress = progress;
              bestTarget = e;
            }
          }
        }

        if (bestTarget) {
          t.cooldown = t.maxCooldown;
          t.attackAnim = 0.15; // アニメーションタイマー
          t.targetPos = { x: bestTarget.x, y: bestTarget.y };

          // 弾丸／ビームを発射
          state.projectiles.push({
            id: ++state.projectileIdCounter,
            towerId: t.id,
            x: t.x,
            y: t.y - 15,
            targetX: bestTarget.x,
            targetY: bestTarget.y,
            targetId: bestTarget.id,
            damage: t.damage,
            speed: t.bulletSpeed || 580,
            color: t.bulletColor || '#38bdf8',
            splashRadius: t.splashRadius || 32,
          });

          playSound('laser');
        }
      }
    }

    // 4. 弾丸の移動＆着弾判定（技ごとのスプラッシュ爆発による爽快な大軍勢殲滅）
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
      const p = state.projectiles[i];
      const target = state.enemies.find(e => e.id === p.targetId);

      // ターゲットが既に撃破されている場合は最後の目標座標へ
      const tx = target ? target.x : p.targetX;
      const ty = target ? target.y : p.targetY;

      const dx = tx - p.x;
      const dy = ty - p.y;
      const dist = Math.hypot(dx, dy);
      const move = p.speed * dt;

      if (dist <= move || dist < 14) {
        // 着弾
        state.projectiles.splice(i, 1);

        if (target) {
          target.hp -= p.damage;
          target.isHit = true;
          playSound('hit');

          // スプラッシュダメージ（技に応じたスプラッシュ範囲）
          const splashRadius = p.splashRadius || 32;
          for (const other of state.enemies) {
            if (other.id !== target.id) {
              const od = Math.hypot(other.x - tx, other.y - ty);
              if (od <= splashRadius) {
                other.hp -= p.damage * 0.5;
                other.isHit = true;
              }
            }
          }

          // 火花・光球パーティクルの生成
          const particleCount = splashRadius > 45 ? 8 : 4;
          for (let k = 0; k < particleCount; k++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 90;
            state.particles.push({
              id: ++state.particleIdCounter,
              x: tx,
              y: ty,
              color: p.color || '#f59e0b',
              size: 2.5 + Math.random() * 2.5,
              alpha: 1,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
            });
          }

          // 撃破チェック（直撃およびスプラッシュでHPが0になった敵をまとめて撃破）
          for (let eIdx = state.enemies.length - 1; eIdx >= 0; eIdx--) {
            const em = state.enemies[eIdx];
            if (em.hp <= 0) {
              state.enemies.splice(eIdx, 1);
              state.defeatedCount++;
              setDefeatedCount(state.defeatedCount);

              if (p.towerId) {
                const originTower = state.towers.find(tw => tw.id === p.towerId);
                if (originTower) {
                  originTower.totalKills++;
                }
              }

              playSound('explosion');

              // 撃破爆発パーティクル
              for (let k = 0; k < 6; k++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 50 + Math.random() * 110;
                state.particles.push({
                  id: ++state.particleIdCounter,
                  x: em.x,
                  y: em.y,
                  color: em.type === 'boss' ? '#c084fc' : '#ef4444',
                  size: 3 + Math.random() * 3,
                  alpha: 1,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                });
              }
            }
          }
        }
      } else {
        p.x += (dx / dist) * move;
        p.y += (dy / dist) * move;
      }
    }

    // 5. パーティクルの減衰と移動
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const pt = state.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.alpha -= dt * 2.5;
      if (pt.alpha <= 0) {
        state.particles.splice(i, 1);
      }
    }

    // 6. 勝利判定（全1000体の出撃が完了し、マップ上の敵が全滅かつ基地HP残存）
    if (
      state.spawnedCount >= stage.totalEnemies &&
      state.enemies.length === 0 &&
      state.baseHp > 0 &&
      !isFinished
    ) {
      onFinish('win');
    }
  };

  // Canvas上に弾丸とパーティクルを描画
  const drawProjectilesAndParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const state = gameState.current;

    // 弾丸の軌跡と本体
    for (const p of state.projectiles) {
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#38bdf8';
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ヒット・爆発パーティクル
    for (const pt of state.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.alpha);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  return (
    <div
      className={`relative w-full aspect-[4/3] min-h-[440px] sm:min-h-[560px] md:min-h-[660px] max-h-[88vh] max-w-5xl mx-auto bg-stone-950 overflow-hidden flex items-center justify-center select-none ${theme.radius.lg} border-2 border-stone-400/80 shadow-2xl ${
        zoom > 1.0 ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      {/* 1. 開始前ブリーフィングオーバーレイ */}
      {!hasStarted && !isFinished && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm z-40 p-3 sm:p-4 overflow-y-auto">
          <Card className="p-4 sm:p-6 max-w-md w-full text-center bg-white/95 border-2 border-amber-500 shadow-2xl text-stone-900 my-auto">
            <div className="flex justify-center mb-2 sm:mb-3">
              <div className="p-2.5 sm:p-3 bg-amber-100 rounded-full border border-amber-400">
                <Gi.GiCastleRuins className="text-2xl sm:text-3xl text-amber-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-700 mb-1">
              拠点防衛戦: {stage.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 mb-3 sm:mb-4 font-bold">
              野外フィールド防衛 / 総敵機数: {stage.totalEnemies}体 / 配備機体: {robots.length}機
            </p>
            <div className="bg-stone-50 rounded-xl p-2.5 sm:p-3.5 border border-stone-200 text-left text-[11px] sm:text-xs text-stone-700 space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <Gi.GiStonePath className="text-amber-600 shrink-0 text-base" />
                <span>野外の進軍ルートに沿って敵ロボット軍団が侵攻してきます。</span>
              </div>
              <div className="flex items-center gap-2">
                <Gi.GiWatchtower className="text-sky-600 shrink-0 text-base" />
                <span>組み立てた自慢のロボットたちが防衛台座に立ち、迎撃を開始します。</span>
              </div>
              <div className="flex items-center gap-2">
                <Gi.GiHazardSign className="text-rose-600 shrink-0 text-base" />
                <span>敵が防衛拠点（BASE）に到達すると拠点HPが減少します。</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-300">
                <Gi.GiHealing className="text-emerald-600 shrink-0 text-base animate-pulse" />
                <span>防衛勝利ボーナス: 出撃機体全員に12時間のリジェネ効果（1時間毎HP+1回復）が付与されます！</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-300">
                <Move className="text-amber-600 shrink-0 text-sm" />
                <span>操作ヒント: ピンチイン・アウトでズーム、スワイプやドラッグで視点を自在に移動できます。</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMapSeed(Date.now() + Math.floor(Math.random() * 10000))}
                className="w-1/3 py-2.5 sm:py-3 text-xs sm:text-sm border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-1"
                title="地形ルートを再生成"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>マップ変更</span>
              </Button>
              <Button
                onClick={() => {
                  // AudioContextのアンロック
                  const AudioContextClass =
                    window.AudioContext || (window as any).webkitAudioContext;
                  if (AudioContextClass) {
                    if (!(window as any).globalAudioCtx) {
                      (window as any).globalAudioCtx = new AudioContextClass();
                    } else if ((window as any).globalAudioCtx.state === 'suspended') {
                      (window as any).globalAudioCtx.resume();
                    }
                  }
                  setHasStarted(true);
                }}
                className="flex-1 font-bold py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-500 text-white shadow-lg text-sm sm:text-base"
              >
                防衛システム起動！
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 2. ヘッダーUI（拠点HP、進捗バー、撃破数ステータス） */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-3.5 flex justify-between items-center gap-2 z-30 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 拠点HPバッジ */}
          <div className="bg-white/95 backdrop-blur-md text-stone-900 px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-xl border border-stone-300 shadow-md flex items-center gap-2">
            <Gi.GiCastleRuins className="text-amber-600 text-lg sm:text-2xl" />
            <div>
              <div className="text-[9px] sm:text-[10px] text-stone-500 font-bold leading-none mb-0.5">
                BASE INTEGRITY
              </div>
              <div className="flex items-baseline gap-1 leading-none font-mono">
                <span
                  className={`text-base sm:text-xl font-black ${
                    baseHp <= stage.baseHp * 0.3
                      ? 'text-rose-600 animate-pulse'
                      : 'text-emerald-600'
                  }`}
                >
                  {Math.ceil(baseHp)}
                </span>
                <span className="text-[10px] sm:text-xs text-stone-400 font-bold">
                  / {stage.baseHp}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 中央: 1000体殲滅プログレスバー */}
        <div className="flex-1 max-w-[200px] sm:max-w-xs bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-stone-300 shadow-md">
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-stone-600 mb-1">
            <span>撃破進捗</span>
            <span className="text-amber-600 font-mono font-black">
              {Math.min(100, Math.floor((defeatedCount / stage.totalEnemies) * 100))}%
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 sm:h-2 rounded-full overflow-hidden border border-stone-300/80">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (defeatedCount / stage.totalEnemies) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 撃破数・進捗ゲージ */}
        <div className="bg-white/95 backdrop-blur-md text-stone-900 px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-xl border border-stone-300 shadow-md text-right flex items-center gap-2 sm:gap-3 shrink-0">
          <div>
            <div className="text-[9px] sm:text-[10px] text-stone-500 font-bold mb-0.5">
              ENEMIES DEFEATED
            </div>
            <div className="font-mono font-black text-amber-700 text-base sm:text-lg leading-none">
              {defeatedCount}{' '}
              <span className="text-stone-400 text-[10px] sm:text-xs font-bold">
                / {stage.totalEnemies}
              </span>
            </div>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-amber-400 bg-amber-100 flex items-center justify-center">
            <Gi.GiCrossedSwords className="text-amber-700 text-xs sm:text-base" />
          </div>
        </div>
      </div>

      {/* 3. マップ全体のスケーリング＆パンコンテナ (800x600固定論理座標) */}
      <div
        className="relative overflow-hidden bg-emerald-50/90 border border-emerald-300 shadow-md shrink-0 will-change-transform"
        style={{
          width: 800,
          height: 600,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${effectiveScale})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* レイヤーA: Game-icons.net による野外フィールドタイル背景 */}
        <div className="absolute inset-0 z-0">
          {dungeonMap.tiles.map(row =>
            row.map(tile => (
              <DungeonTileView
                key={`${tile.x}-${tile.y}`}
                tile={tile}
                cellSize={dungeonMap.cellSize}
              />
            ))
          )}
        </div>

        {/* レイヤーB: Canvas (弾丸軌跡＆ヒットパーティクル描画) */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* レイヤーC: 敵ロボット (Kenney公式スプライト + アイコンフォールバック) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {renderEnemies.map(enemy => (
            <EnemyRobotView key={enemy.id} enemy={enemy} />
          ))}
        </div>

        {/* レイヤーD: 組み立てられたロボットたち（RobotVisualの全身姿で防衛台座に配置） */}
        <div className="absolute inset-0 z-30">
          {renderTowers.map(tower => (
            <DefenseTowerView
              key={tower.id}
              tower={tower}
              isSelected={selectedTowerId === tower.id}
              onSelect={() => {
                // ドラッグ移動中以外のみ選択可能
                if (!dragRef.current?.hasMoved) {
                  setSelectedTowerId(selectedTowerId === tower.id ? null : tower.id);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. ズーム＆パン操作用フローティングUI（画面右下） */}
      {hasStarted && !isFinished && (
        <div className="absolute bottom-2.5 right-2.5 z-30 flex flex-col items-center gap-1.5 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-xl border border-stone-700 shadow-xl pointer-events-auto select-none">
          <button
            type="button"
            onClick={() => handleSetZoom(z => z + 0.25)}
            disabled={zoom >= 2.5}
            aria-label="Zoom in"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 flex items-center justify-center active:scale-95 transition-all"
          >
            <ZoomIn className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          
          <button
            type="button"
            onClick={() => handleSetZoom(z => z - 0.25)}
            disabled={zoom <= 1.0}
            aria-label="Zoom out"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 flex items-center justify-center active:scale-95 transition-all"
          >
            <ZoomOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <button
            type="button"
            onClick={handleResetView}
            aria-label="Reset zoom and pan"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${
              zoom > 1.0 || panOffset.x !== 0 || panOffset.y !== 0
                ? 'bg-amber-600/90 text-white hover:bg-amber-500'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            } flex items-center justify-center active:scale-95 transition-all`}
            title="全体表示リセット"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="text-[9px] font-mono font-bold text-amber-300/90 px-1 py-0.5 text-center leading-none">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      )}

      {/* 5. 拡大中のスワイプ視点移動ガイド（控えめに表示） */}
      {hasStarted && !isFinished && zoom > 1.05 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30 flex items-center gap-1.5 pointer-events-none z-30 shadow-md">
          <Move className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>スワイプ / ドラッグで視点移動</span>
        </div>
      )}

      {/* 4. 戦闘結果モーダル（勝利 / 拠点陥落） */}
      {isFinished && battleResult && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-amber-500 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl text-stone-900"
          >
            <div className="flex justify-center mb-3">
              {battleResult === 'win' ? (
                <div className="p-3.5 bg-emerald-100 rounded-full border border-emerald-400">
                  <Gi.GiPartyPopper className="text-4xl text-emerald-600" />
                </div>
              ) : (
                <div className="p-3.5 bg-rose-100 rounded-full border border-rose-400">
                  <Gi.GiCrossedBones className="text-4xl text-rose-600" />
                </div>
              )}
            </div>

            <h2
              className={`text-2xl sm:text-3xl font-black mb-1.5 ${
                battleResult === 'win' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {battleResult === 'win' ? 'DEFENSE CLEARED！' : 'BASE COMPROMISED'}
            </h2>
            <p className="text-sm text-stone-600 font-bold mb-5">
              {battleResult === 'win'
                ? '全敵機の殲滅を完了し、拠点を防衛しました！'
                : '拠点が大破しました...作戦失敗です。'}
            </p>

            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-bold">撃破数</span>
                <span className="font-mono font-black text-amber-700 text-sm">
                  {defeatedCount} / {stage.totalEnemies}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-bold">拠点残存HP</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  {Math.ceil(baseHp)} / {stage.baseHp}
                </span>
              </div>
              {battleResult === 'win' && (
                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-700 font-bold">獲得修理キット</span>
                    <span className="font-mono font-black text-amber-600 text-base">
                      +{stage.rewardKits}個
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-400 rounded-lg p-2 text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Gi.GiHealing className="text-emerald-600 text-base animate-pulse" />
                      <span>防衛リジェネ効果付与！</span>
                    </div>
                    <span className="font-bold text-[11px] text-emerald-700">{stage.rewardRegenHours || 12}時間 (1h毎HP+1)</span>
                  </div>
                  <div className="text-[11px] text-stone-700 bg-stone-100 rounded-lg p-2 border border-stone-300 text-center leading-snug">
                    <span className="font-bold text-stone-900">本日の防衛任務達成！</span>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      次回の拠点防衛戦は<strong>翌朝 09:00</strong> にリセットされます。
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={onExit}
              className="w-full font-bold py-3 bg-amber-600 hover:bg-amber-500 text-white shadow-lg text-base"
            >
              演習メニューへ戻る
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
