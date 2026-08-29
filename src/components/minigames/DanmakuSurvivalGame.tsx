import React, { useState, useEffect, useRef } from 'react';
import { MinigameProps, DanmakuDifficulty, DANMAKU_DIFFICULTIES } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import { motion, AnimatePresence } from 'motion/react';

interface DanmakuBullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color?: 'magenta' | 'cyan' | 'amber' | 'emerald';
  size?: number;
}

interface DanmakuProps extends Omit<MinigameProps, 'activeOpponent'> {
  difficulty?: DanmakuDifficulty;
}

export const DanmakuSurvivalGame: React.FC<DanmakuProps> = ({ 
  activeRobot, 
  onFinish, 
  speed, 
  isPaused, 
  isFinished, 
  battleResult,
  difficulty = 'normal'
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [hp, setHp] = useState(5);
  const [timeMs, setTimeMs] = useState(0);
  const [bullets, setBullets] = useState<DanmakuBullet[]>([]);
  const [hitEffect, setHitEffect] = useState<string | null>(null);
  const [hitFlash, setHitFlash] = useState(false);
  const [robotBlink, setRobotBlink] = useState(false);
  const [screenShake, setScreenShake] = useState<'hit' | 'graze' | null>(null);
  const [knockback, setKnockback] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  const [grazeCount, setGrazeCount] = useState(0);
  
  const hpRef = useRef(hp);
  const timeMsRef = useRef(timeMs);
  const bulletsRef = useRef<DanmakuBullet[]>([]);
  const playerPosRef = useRef({ x: 50, y: 80 });
  const bulletIdCounterRef = useRef(1);
  const frameCountRef = useRef(0);
  const patternSequenceRef = useRef<number[]>([0, 1, 2]);
  const gameSeedRef = useRef(Math.random());

  const currentDiffConfig = DANMAKU_DIFFICULTIES.find(d => d.id === difficulty) || DANMAKU_DIFFICULTIES[1];
  
  const GOAL_TIME = 10000;
  const FPS = 30;
  
  // Agility scales dodge rate & move speed, Dexterity scales collision grace & graze, Int expands perception
  const agi = activeRobot.stats.agility || 10;
  const dex = activeRobot.stats.dexterity || 10;
  const int = activeRobot.stats.intelligence || 10;

  // Generate random pattern sequence when starting
  useEffect(() => {
    if (hasStarted && !isPaused && !isFinished && !battleResult) {
      patternSequenceRef.current = [0, 1, 2].sort(() => Math.random() - 0.5);
      gameSeedRef.current = Math.random();
    }
  }, [hasStarted]);

  useEffect(() => {
    if (!battleResult) {
      hpRef.current = 5;
      timeMsRef.current = 0;
      bulletsRef.current = [];
      playerPosRef.current = { x: 50, y: 80 };
      bulletIdCounterRef.current = 1;
      frameCountRef.current = 0;
      setHp(hpRef.current);
      setTimeMs(timeMsRef.current);
      setBullets(bulletsRef.current);
      setPlayerPos(playerPosRef.current);
      setKnockback(0);
      setHitFlash(false);
      setHitEffect(null);
      setGrazeCount(0);
    }
  }, [activeRobot, battleResult]);

  useEffect(() => {
    if (!hasStarted || isPaused || isFinished || battleResult) return;

    const interval = 1000 / FPS;
    
    const timer = setInterval(() => {
      timeMsRef.current += interval * speed;
      frameCountRef.current += 1;
      setTimeMs(timeMsRef.current);

      if (timeMsRef.current >= GOAL_TIME && hpRef.current > 0) {
        clearInterval(timer);
        onFinish('win');
        return;
      }

      let hitPlayer = false;
      let grazePlayer = false;
      const currentAgi = agi;
      const currentDex = dex;
      const currentInt = int;

      // Calculate Boss X position (synchronized with boss visual oscillation)
      const bossX = 50 + Math.sin((timeMsRef.current / 3000) * Math.PI * 2) * 20;
      const bossY = 14;

      const nextBullets: DanmakuBullet[] = [];

      // Exact Geometric Hitbox based on Robot Visual Bounds (Width ~3.8%, Height ~4.8%)
      // Hitbox is purely visual and physically accurate, unaffected by stats.
      const rx = 3.8;
      const ry = 4.8;
      const grazeRx = 6.2;
      const grazeRy = 7.2;

      // Update existing bullets and handle strict geometric collisions
      bulletsRef.current.forEach(b => {
        b.x += b.vx * speed;
        b.y += b.vy * speed;
        
        // Exact normalized elliptical distance to robot visual center
        const nx = (b.x - playerPosRef.current.x) / rx;
        const ny = (b.y - playerPosRef.current.y) / ry;
        const normalizedDistSq = nx * nx + ny * ny;

        // 1. Exact Hitbox Collision (100% physically triggered when overlapping robot shape)
        if (normalizedDistSq <= 1.0) {
          hpRef.current -= 1;
          hitPlayer = true;
          // Consume collided bullet
          return;
        }

        // 2. Graze Detection (Just outside the physical body)
        const gnx = (b.x - playerPosRef.current.x) / grazeRx;
        const gny = (b.y - playerPosRef.current.y) / grazeRy;
        if (gnx * gnx + gny * gny <= 1.0 && normalizedDistSq > 1.0) {
          setGrazeCount(prev => prev + 1);
          grazePlayer = true;
        }

        // Keep bullets within active playfield
        if (b.y < 115 && b.x > -15 && b.x < 115 && b.y > -10) {
          nextBullets.push(b);
        }
      });

      // --- Guaranteed Safe-Route Navigation & Evasion AI ---
      // Evaluates candidate movement directions against projected future bullet trajectories
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      
      // Agi determines actual physical speed limit per frame (Agi=0 -> 0.3, Agi=100 -> 1.8)
      const maxMoveSpeed = (0.3 + (currentAgi / 100) * 1.5) * speed;
      
      // The AI always plans for an "ideal" safe destination (fixed planning radius)
      // This represents the "correct route" regardless of physical speed
      const planRadius = 1.8 * speed;

      // Candidate moves: stay + 16 radial directions
      const candidateAngles = Array.from({ length: 16 }, (_, i) => (i * Math.PI * 2) / 16);
      const candidates = [
        { x: px, y: py, weight: 0 },
        ...candidateAngles.map(ang => ({
          x: px + Math.cos(ang) * planRadius,
          y: py + Math.sin(ang) * planRadius,
          weight: 0
        }))
      ];

      // Screen boundary constraints & strategic drift towards bottom-center sweet spot
      const targetHomeX = 50;
      const targetHomeY = 78;

      candidates.forEach(cand => {
        // Penalty for going out of bounds
        if (cand.x < 10 || cand.x > 90 || cand.y < 20 || cand.y > 90) {
          cand.weight += 10000;
        }

        // Slight preference to stay in comfortable maneuverable zone (Y: 70-85, X: 35-65)
        const distToHome = Math.hypot(cand.x - targetHomeX, cand.y - targetHomeY);
        cand.weight += distToHome * 0.05;

        // Predictive collision check for next 1 to 14 frames
        const lookAheadFrames = Math.min(14, 6 + Math.floor((currentInt / 100) * 8));
        for (let frame = 1; frame <= lookAheadFrames; frame++) {
          const timeWeight = (lookAheadFrames - frame + 1) / lookAheadFrames;
          
          for (let i = 0; i < nextBullets.length; i++) {
            const b = nextBullets[i];
            const futureBx = b.x + b.vx * speed * frame;
            const futureBy = b.y + b.vy * speed * frame;

            const futureDistX = Math.abs(futureBx - cand.x);
            const futureDistY = Math.abs(futureBy - cand.y);

            // If bullet enters dangerous proximity during prediction window
            if (futureDistX < 6.5 && futureDistY < 7.5) {
              const dangerDistSq = (futureDistX * futureDistX) + (futureDistY * futureDistY);
              // Heavy penalty for paths that intersect with bullets
              cand.weight += (150 / Math.max(0.1, dangerDistSq)) * timeWeight;
            }
          }
        }
      });

      // Find the safest optimal route with lowest threat score
      let bestCandidate = candidates[0];
      for (let i = 1; i < candidates.length; i++) {
        if (candidates[i].weight < bestCandidate.weight) {
          bestCandidate = candidates[i];
        }
      }

      // Calculate intended optimal movement vector towards the safe spot
      let dx = bestCandidate.x - px;
      let dy = bestCandidate.y - py;
      const idealMag = Math.hypot(dx, dy);

      // Limit the movement by actual Agi-based physical speed
      if (idealMag > maxMoveSpeed) {
        dx = (dx / idealMag) * maxMoveSpeed;
        dy = (dy / idealMag) * maxMoveSpeed;
      }

      // Dex affects tracing accuracy of the safe route.
      // Dex=100 -> 0 tracing error. Dex=0 -> High drift/deviation from optimal path.
      const tracingError = 1.0 - (currentDex / 100);
      
      let actualDx = dx;
      let actualDy = dy;
      
      if (tracingError > 0 && (dx !== 0 || dy !== 0)) {
        // Create an oscillating drift angle to simulate physical control instability
        const driftAngle = (frameCountRef.current / 15) * Math.PI * 2 + Math.random();
        
        // Drift magnitude is proportional to actual speed and tracing error
        const driftMag = maxMoveSpeed * tracingError * 0.9; 
        
        actualDx += Math.cos(driftAngle) * driftMag;
        actualDy += Math.sin(driftAngle) * driftMag;
        
        // Limit total velocity slightly above normal move step to allow for wild swerving
        const actualMag = Math.hypot(actualDx, actualDy);
        if (actualMag > maxMoveSpeed * 1.3) {
          actualDx = (actualDx / actualMag) * maxMoveSpeed * 1.3;
          actualDy = (actualDy / actualMag) * maxMoveSpeed * 1.3;
        }
      }

      // Smoothly update player position along the route (with Dex-based tracing error applied)
      playerPosRef.current.x = Math.max(8, Math.min(92, px + actualDx));
      playerPosRef.current.y = Math.max(18, Math.min(92, py + actualDy));

      if (hitPlayer) {
        setHitEffect('💥');
        setHitFlash(true);
        setRobotBlink(true);
        setKnockback(14);
        setScreenShake('hit');
        setTimeout(() => {
            setHitEffect(null);
            setHitFlash(false);
            setKnockback(0);
        }, 160);
        setTimeout(() => {
            setRobotBlink(false);
            setScreenShake(null);
        }, 220);
      } else if (grazePlayer) {
        // Only trigger graze visual if we aren't currently shaking from a hit
        setScreenShake(prev => prev === 'hit' ? 'hit' : 'graze');
        setTimeout(() => {
          setScreenShake(prev => prev === 'graze' ? null : prev);
        }, 100);
      }

      // ========================================================
      // 🚀 CONTINUOUS GAPLESS BULLET GENERATION (隙間なき弾幕放射 & 安全ルート保証)
      // ========================================================
      const t = timeMsRef.current;
      const curFrame = frameCountRef.current;
      
      const seed = gameSeedRef.current;
      const spinDir = seed > 0.5 ? 1 : -1;
      const phaseOffset = seed * 1000;
      const speedMult = currentDiffConfig.bulletSpeedMult;

      // 1. 【常時ベースストリーム】リズミカルに絶え間なく放たれる回転ツインスパイラル（2フレーム毎に交互生成）
      if (curFrame % 2 === 0) {
        const baseAngle1 = (t / 450) * Math.PI * 2 * spinDir + (seed * Math.PI);
        const baseSpeed = 1.3 * speedMult;
        nextBullets.push({
          id: bulletIdCounterRef.current++,
          x: bossX,
          y: bossY,
          vx: Math.cos(baseAngle1) * baseSpeed,
          vy: Math.sin(baseAngle1) * baseSpeed * 0.85 + 0.35 * speedMult,
          color: 'magenta',
          size: 3
        });
      } else {
        const baseAngle2 = (t / 450) * Math.PI * 2 * spinDir + (seed * Math.PI) + Math.PI;
        const baseSpeed = 1.3 * speedMult;
        nextBullets.push({
          id: bulletIdCounterRef.current++,
          x: bossX,
          y: bossY,
          vx: Math.cos(baseAngle2) * baseSpeed,
          vy: Math.sin(baseAngle2) * baseSpeed * 0.85 + 0.35 * speedMult,
          color: 'magenta',
          size: 3
        });
      }

      // 2. 【高密度ウェーブストリーム】常に左右に連続スイープする弾幕カーテン（2フレーム毎）
      if (curFrame % 2 === 0) {
        const sweepAngle = (Math.PI / 2) + Math.sin((t + phaseOffset) / 320) * (Math.PI * 0.38);
        const sweepSpeed = 1.5 * speedMult;
        nextBullets.push({
          id: bulletIdCounterRef.current++,
          x: bossX,
          y: bossY,
          vx: Math.cos(sweepAngle) * sweepSpeed,
          vy: Math.sin(sweepAngle) * sweepSpeed,
          color: 'cyan',
          size: 3
        });
      }

      // 3. 【フェーズ別特殊ストリーム（隙間なくシームレスにブレンド）】
      // パターンが切り替わる間も発射周期が途切れることなく連続生成（必ず安全な抜け道スリットが存在）
      const phaseIdx = Math.floor(t / 3300) % patternSequenceRef.current.length;
      const phase = patternSequenceRef.current[phaseIdx];

      if (phase === 0) {
        // パターンA: 拡散スパイラル（難易度別に角度・WAY数を最適化）
        if (curFrame % 3 === 0) {
          const spreadOffset = Math.sin((t + phaseOffset) / 250) * 0.25 * spinDir;
          const offsets = difficulty === 'hard' 
            ? [-0.45, -0.15, 0.15, 0.45] 
            : difficulty === 'easy'
            ? [-0.32, 0.32]
            : [-0.38, 0, 0.38];

          offsets.forEach((offsetAngle, idx) => {
            const angle = (Math.PI / 2) + offsetAngle + spreadOffset;
            const spd = (1.4 + idx * 0.08) * speedMult;
            nextBullets.push({
              id: bulletIdCounterRef.current++,
              x: bossX,
              y: bossY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: 'amber',
              size: 3
            });
          });
        }
      } else if (phase === 1) {
        // パターンB: 全方位リングバースト（難易度別にリング弾数を変更）
        if (curFrame % 6 === 0) {
          const ringCount = currentDiffConfig.ringCount;
          const ringRot = (t / 600);
          for (let i = 0; i < ringCount; i++) {
            const angle = (Math.PI * 2 * i) / ringCount + ringRot;
            const spd = 1.25 * speedMult;
            nextBullets.push({
              id: bulletIdCounterRef.current++,
              x: bossX,
              y: bossY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd * 0.85 + 0.25 * speedMult,
              color: 'emerald',
              size: 3.5
            });
          }
        }
      } else if (phase === 2) {
        // パターンC: クロス交差ストリーム（3フレーム毎・左右交差の合間に安全ルート）
        if (curFrame % 3 === 0) {
          const crossAngleL = (Math.PI / 3) + Math.cos((t + phaseOffset) / 280) * 0.25;
          const crossAngleR = (2 * Math.PI / 3) - Math.cos((t + phaseOffset) / 280) * 0.25;
          const crossSpeed = 1.6 * speedMult;
          nextBullets.push({
            id: bulletIdCounterRef.current++,
            x: bossX - 5,
            y: bossY,
            vx: Math.cos(crossAngleL) * crossSpeed,
            vy: Math.sin(crossAngleL) * crossSpeed,
            color: 'cyan',
            size: 3
          });
          nextBullets.push({
            id: bulletIdCounterRef.current++,
            x: bossX + 5,
            y: bossY,
            vx: Math.cos(crossAngleR) * crossSpeed,
            vy: Math.sin(crossAngleR) * crossSpeed,
            color: 'amber',
            size: 3
          });
        }
      }

      bulletsRef.current = nextBullets;

      setBullets(nextBullets);
      setPlayerPos({ ...playerPosRef.current });
      setHp(Math.max(0, hpRef.current));

      if (hpRef.current <= 0) {
        clearInterval(timer);
        onFinish('lose');
      }

    }, interval);

    return () => clearInterval(timer);
  }, [speed, isPaused, isFinished, battleResult, onFinish, agi, dex, int, hasStarted, currentDiffConfig, difficulty]);

  const timeLeft = Math.max(0, GOAL_TIME - timeMs);

  if (!hasStarted) {
    return (
      <div className="bg-stone-900 p-8 rounded-xl text-center text-white shadow-xl border-4 border-stone-700">
        <div className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold border bg-stone-800 text-yellow-300 border-yellow-500/50">
          難易度: {currentDiffConfig.label}
        </div>
        <h3 className="text-2xl font-black text-yellow-400 mb-2">MISSION: 弾幕よけ</h3>
        <p className="text-xs text-stone-400 mb-4">{currentDiffConfig.desc}</p>
        <p className="text-stone-300 mb-6 leading-relaxed text-sm">
          隙間なく降り注ぐ敵の連続弾幕を回避せよ！<br/>
          <span className="text-emerald-400 font-bold">10秒間</span>生き残れば<span className="text-yellow-400">勝利</span>。<br/>
          自機の<span className="text-cyan-300 font-bold">装甲耐久度(HP: 5)</span>が0になると<span className="text-red-400">敗北</span>。
        </p>
        <div className="flex justify-center gap-3 mb-8 text-xs sm:text-sm flex-wrap">
           <div className="bg-stone-800 p-2 rounded border border-stone-600">💨 敏捷: 移動速度↑</div>
           <div className="bg-stone-800 p-2 rounded border border-stone-600">🎯 器用: 回避ルート精度↑</div>
           <div className="bg-stone-800 p-2 rounded border border-stone-600">🧠 賢さ: 弾幕予測範囲↑</div>
        </div>
        <button 
          onClick={() => setHasStarted(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 text-lg"
        >
          ミッション開始！
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-stone-900 p-4 rounded-lg shadow-inner">
        <div className="flex gap-4 items-center">
          <div className="bg-white p-1 rounded">
             <RobotVisual robot={activeRobot} size={32} animateVictory={battleResult === 'win'} />
          </div>
          <div className="text-white font-mono text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-300">🛡️ 装甲HP</span>
              <span className={`text-xs font-black px-1.5 py-0.2 rounded ${
                hp <= 1 ? "bg-red-500/30 text-red-400 border border-red-500/50 animate-pulse" : 
                hp <= 2 ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : 
                "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
              }`}>
                {hp} / 5
              </span>
            </div>
            {/* Mechanized Armor HP Segments */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-2 rounded-xs border transition-all duration-75 ${
                    i < hp
                      ? hp <= 1
                        ? "bg-red-500 border-red-300 shadow-[0_0_6px_rgba(239,68,68,0.8)] animate-pulse"
                        : hp <= 2
                        ? "bg-amber-400 border-amber-200 shadow-[0_0_6px_rgba(251,191,36,0.7)]"
                        : "bg-emerald-400 border-emerald-200 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                      : "bg-stone-900/80 border-stone-700/60 opacity-30"
                  }`}
                />
              ))}
            </div>
            <div className="text-stone-400 text-[10px] leading-tight mt-1.5 flex gap-2">
                <span>Agi:{agi}</span><span>Dex:{dex}</span><span>Int:{int}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center font-mono">
           <div className="text-xs text-stone-400">SURVIVAL TIME</div>
           <div className="text-yellow-400 font-black text-2xl">{(timeLeft / 1000).toFixed(2)}s</div>
        </div>
        <div className="text-right text-white font-mono text-xs sm:text-sm">
           <div className="text-purple-400 font-bold">DODGE BARRAGE</div>
           <div className="text-[10px] text-amber-300 font-bold">{currentDiffConfig.label}</div>
           {grazeCount > 0 && (
             <div className="text-[10px] text-cyan-300">GRAZE: {grazeCount}</div>
           )}
        </div>
      </div>

      <motion.div 
        className="relative h-80 bg-slate-950 border-4 border-stone-700 rounded-xl overflow-hidden shadow-2xl"
        animate={
          screenShake === 'hit' 
            ? { x: [-8, 8, -6, 6, -4, 4, 0], y: [-4, 4, -4, 4, 0] }
            : screenShake === 'graze' 
            ? { x: [-2, 2, -1, 1, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: screenShake === 'hit' ? 0.25 : 0.1 }}
      >
        {/* Vertical Scrolling Space Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: `0 ${timeMs / 4 % 40}px` 
          }}
        />

        {/* Dynamic Glow Aura in Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-blue-950/30 pointer-events-none" />

        {/* Hit Flash */}
        <AnimatePresence>
            {hitFlash && (
                <motion.div 
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-600 z-10 pointer-events-none"
                />
            )}
        </AnimatePresence>

        {/* Boss Spaceship (Top Center, Oscillating) */}
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl drop-shadow-[0_0_20px_rgba(255,0,255,0.7)]"
          >
            👾
          </motion.div>
        </div>

        {/* Player Robot */}
        <div 
            className="absolute z-20 transition-transform duration-75"
            style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: `translate(-50%, -50%) translateY(${knockback}px)` }}
        >
          <motion.div
            animate={{ 
              rotate: battleResult === 'lose' ? 90 : 0,
              opacity: robotBlink ? [1, 0.2, 1, 0.3, 1] : 1,
              scale: robotBlink ? [1, 0.92, 1.08, 1] : 1,
              filter: robotBlink 
                ? ['brightness(1) contrast(1)', 'brightness(2.2) drop-shadow(0 0 10px rgba(239,68,68,0.9))', 'brightness(1) contrast(1)'] 
                : 'brightness(1) contrast(1)'
            }}
            transition={{ 
              duration: robotBlink ? 0.2 : 0.5,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <RobotVisual robot={activeRobot} size={46} emotion={battleResult === 'lose' ? 'troubled' : battleResult === 'win' ? 'happy' : 'normal'} hideBackground={true} />
            <AnimatePresence>
              {hitEffect && (
                <motion.div 
                  initial={{ opacity: 1, scale: 0.5, y: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-4 -right-4 text-3xl font-bold z-50 drop-shadow-md pointer-events-none select-none"
                >
                  {hitEffect}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Danmaku Bullets (Continuous Vivid Bullet Rendering) */}
        {bullets.map(b => {
          let bulletStyle = "bg-fuchsia-500 shadow-[0_0_8px_magenta]";
          if (b.color === 'cyan') bulletStyle = "bg-cyan-400 shadow-[0_0_8px_cyan]";
          if (b.color === 'amber') bulletStyle = "bg-amber-400 shadow-[0_0_8px_orange]";
          if (b.color === 'emerald') bulletStyle = "bg-emerald-400 shadow-[0_0_8px_#34d399]";

          return (
            <div 
              key={b.id}
              className={`absolute rounded-full pointer-events-none ${bulletStyle}`}
              style={{ 
                left: `${b.x}%`, 
                top: `${b.y}%`, 
                width: `${(b.size || 3) * 3.5}px`,
                height: `${(b.size || 3) * 3.5}px`,
                transform: 'translate(-50%, -50%)' 
              }}
            />
          );
        })}

        {battleResult === 'win' && (
           <div className="absolute inset-0 bg-emerald-900/50 backdrop-blur-xs flex items-center justify-center font-black text-4xl text-emerald-300 drop-shadow-md z-30 animate-pulse">
              SURVIVED！
           </div>
        )}
        {battleResult === 'lose' && (
           <div className="absolute inset-0 bg-red-900/50 backdrop-blur-xs flex items-center justify-center font-black text-4xl text-red-400 drop-shadow-md z-30">
              DESTROYED...
           </div>
        )}
      </motion.div>
    </div>
  );
};
