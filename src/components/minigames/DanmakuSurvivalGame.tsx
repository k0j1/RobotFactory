import React, { useState, useEffect, useRef } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import { motion, AnimatePresence } from 'motion/react';

interface DanmakuBullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface DanmakuProps extends Omit<MinigameProps, 'activeOpponent'> {}

export const DanmakuSurvivalGame: React.FC<DanmakuProps> = ({ activeRobot, onFinish, speed, isPaused, isFinished, battleResult }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [hp, setHp] = useState(5);
  const [timeMs, setTimeMs] = useState(0);
  const [bullets, setBullets] = useState<DanmakuBullet[]>([]);
  const [hitEffect, setHitEffect] = useState<string | null>(null);
  const [hitFlash, setHitFlash] = useState(false);
  const [knockback, setKnockback] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  
  const hpRef = useRef(hp);
  const timeMsRef = useRef(timeMs);
  const bulletsRef = useRef<DanmakuBullet[]>([]);
  const playerPosRef = useRef({ x: 50, y: 80 });
  
  const GOAL_TIME = 10000;
  const FPS = 30;
  
  // Agility scales dodge rate, Dexterity scales hitbox (conceptually by dodging more), Int predicts
  const agi = activeRobot.stats.agility || 10;
  const dex = activeRobot.stats.dexterity || 10;
  const int = activeRobot.stats.intelligence || 10;

  useEffect(() => {
    if (!battleResult) {
      hpRef.current = 5;
      timeMsRef.current = 0;
      bulletsRef.current = [];
      playerPosRef.current = { x: 50, y: 80 };
      setHp(hpRef.current);
      setTimeMs(timeMsRef.current);
      setBullets(bulletsRef.current);
      setPlayerPos(playerPosRef.current);
      setKnockback(0);
      setHitFlash(false);
      setHitEffect(null);
    }
  }, [activeRobot, battleResult]);

  useEffect(() => {
    if (!hasStarted || isPaused || isFinished || battleResult) return;

    const interval = 1000 / FPS;
    
    const timer = setInterval(() => {
      timeMsRef.current += interval * speed;
      setTimeMs(timeMsRef.current);

      if (timeMsRef.current >= GOAL_TIME && hpRef.current > 0) {
        clearInterval(timer);
        onFinish('win');
        return;
      }

      let hitPlayer = false;

      const nextBullets = bulletsRef.current.map(b => {
        b.x += b.vx * speed;
        b.y += b.vy * speed;
        
        // Collision with player
        if (Math.abs(b.x - playerPosRef.current.x) < 4 && Math.abs(b.y - playerPosRef.current.y) < 4) {
            const dodgeChance = Math.min(0.85, (agi + dex) / 200); // Int is used for pathing
            if (Math.random() > dodgeChance) {
              hpRef.current -= 1;
              hitPlayer = true;
            }
            return { ...b, y: 200 }; // mark for removal
        }
        return b;
      }).filter(b => b.y < 120 && b.x > -20 && b.x < 120);

      // --- AI Player Movement (Dodging) ---
      let dx = 0, dy = 0;
      let danger = false;
      const visionRange = 15 + (int / 100) * 20; // 15% to 35% of screen depending on Int

      nextBullets.forEach(b => {
          const dist = Math.hypot(b.x - playerPosRef.current.x, b.y - playerPosRef.current.y);
          if (dist < visionRange) {
              danger = true;
              const weight = 1 / Math.max(0.1, dist);
              dx -= (b.x - playerPosRef.current.x) * weight;
              dy -= (b.y - playerPosRef.current.y) * weight;
          }
      });

      if (!danger) {
          // Slowly drift back to bottom-center when safe
          dx += (50 - playerPosRef.current.x) * 0.02;
          dy += (80 - playerPosRef.current.y) * 0.02;
      } else {
          // Edge repulsion to avoid getting stuck in corners
          if (playerPosRef.current.x < 15) dx += 2 / Math.max(0.1, playerPosRef.current.x);
          if (playerPosRef.current.x > 85) dx -= 2 / Math.max(0.1, 100 - playerPosRef.current.x);
          if (playerPosRef.current.y < 15) dy += 2 / Math.max(0.1, playerPosRef.current.y);
          if (playerPosRef.current.y > 85) dy -= 2 / Math.max(0.1, 100 - playerPosRef.current.y);
      }

      const mag = Math.hypot(dx, dy);
      if (mag > 0.01) {
          const moveSpeed = 0.5 + (agi / 100) * 0.5; // Base move speed scaled by Agi
          playerPosRef.current.x += (dx / mag) * moveSpeed * speed;
          playerPosRef.current.y += (dy / mag) * moveSpeed * speed;
      }

      // Clamp to screen
      playerPosRef.current.x = Math.max(5, Math.min(95, playerPosRef.current.x));
      playerPosRef.current.y = Math.max(5, Math.min(95, playerPosRef.current.y));

      if (hitPlayer) {
        setHitEffect('💥');
        setHitFlash(true);
        setKnockback(20);
        setTimeout(() => {
            setHitEffect(null);
            setHitFlash(false);
            setKnockback(0);
        }, 200);
      }

      // Spawn bullets (Boss at top center x:50, y:15)
      const patternPhase = Math.floor(timeMsRef.current / 2500) % 3;
      
      if (patternPhase === 0) {
          // Pattern 0: Random Spread
          if (Math.random() < 0.2 * speed) {
              const count = Math.floor(Math.random() * 3) + 3;
              for(let i=0; i<count; i++) {
                const angle = (Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 0.8; 
                const bspeed = 1.5 + Math.random() * 1.5;
                nextBullets.push({ 
                  id: Date.now() + Math.random(), x: 50, y: 15, 
                  vx: Math.cos(angle) * bspeed, vy: Math.sin(angle) * bspeed
                });
              }
          }
      } else if (patternPhase === 1) {
          // Pattern 1: Circular / Radial burst
          if (Math.random() < 0.08 * speed) {
              const count = 10;
              for(let i=0; i<count; i++) {
                const angle = (Math.PI * 2 * i) / count + (timeMsRef.current / 1000); // rotating circle
                const bspeed = 1.2;
                nextBullets.push({ 
                  id: Date.now() + Math.random(), x: 50, y: 15, 
                  vx: Math.cos(angle) * bspeed, vy: Math.sin(angle) * bspeed
                });
              }
          }
      } else if (patternPhase === 2) {
          // Pattern 2: Sweeping Wave
          if (Math.random() < 0.4 * speed) {
              const sweep = Math.sin(timeMsRef.current / 300);
              const angle = (Math.PI / 2) + sweep * Math.PI * 0.5;
              const bspeed = 2.0;
              nextBullets.push({ 
                id: Date.now() + Math.random(), x: 50, y: 15, 
                vx: Math.cos(angle) * bspeed, vy: Math.sin(angle) * bspeed
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
  }, [speed, isPaused, isFinished, battleResult, onFinish, agi, dex, int, hasStarted]);

  const timeLeft = Math.max(0, GOAL_TIME - timeMs);

  if (!hasStarted) {
    return (
      <div className="bg-stone-900 p-8 rounded-xl text-center text-white shadow-xl border-4 border-stone-700">
        <h3 className="text-2xl font-black text-yellow-400 mb-4">MISSION: 弾幕よけ</h3>
        <p className="text-stone-300 mb-6 leading-relaxed">
          敵の激しい攻撃を回避せよ！<br/>
          <span className="text-emerald-400 font-bold">10秒間</span>生き残れば<span className="text-yellow-400">勝利</span>。<br/>
          自分のHP(5)が0になると<span className="text-red-400">敗北</span>。
        </p>
        <div className="flex justify-center gap-4 mb-8 text-xs sm:text-sm">
           <div className="bg-stone-800 p-2 rounded border border-stone-600">💨 敏捷: 回避↑</div>
           <div className="bg-stone-800 p-2 rounded border border-stone-600">🎯 器用: 回避↑</div>
           <div className="bg-stone-800 p-2 rounded border border-stone-600">🧠 賢さ: 回避↑</div>
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
            <div>HP: <span className={hp <= 2 ? "text-red-500" : "text-emerald-400"}>{'♥'.repeat(hp)}{'♡'.repeat(5 - hp)}</span></div>
            <div className="text-stone-400 text-[10px] leading-tight mt-1 flex gap-2">
                <span>Agi:{agi}</span><span>Dex:{dex}</span><span>Int:{int}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center font-mono">
           <div className="text-xs text-stone-400">SURVIVAL TIME</div>
           <div className="text-yellow-400 font-black text-2xl">{(timeLeft / 1000).toFixed(2)}s</div>
        </div>
        <div className="text-right text-white font-mono text-sm">
           <div className="text-purple-400 font-bold">DODGE MODE</div>
        </div>
      </div>

      <div className="relative h-80 bg-slate-900 border-4 border-stone-700 rounded-xl overflow-hidden shadow-xl">
        {/* Vertical Scrolling Space Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: `0 ${timeMs / 5 % 50}px` 
          }}
        />

        {/* Hit Flash */}
        <AnimatePresence>
            {hitFlash && (
                <motion.div 
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-600 z-10 pointer-events-none"
                />
            )}
        </AnimatePresence>

        {/* Boss Spaceship (Top Center) */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl drop-shadow-[0_0_20px_rgba(255,0,255,0.6)]"
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
              rotate: battleResult === 'lose' ? 90 : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <RobotVisual robot={activeRobot} size={48} emotion={battleResult === 'lose' ? 'troubled' : battleResult === 'win' ? 'happy' : 'normal'} hideBackground={true} />
            <AnimatePresence>
              {hitEffect && (
                <motion.div 
                  initial={{ opacity: 1, scale: 0.5, y: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-4 -right-4 text-3xl font-bold z-50 drop-shadow-md"
                >
                  {hitEffect}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Danmaku Bullets */}
        {bullets.map(b => (
          <div 
            key={b.id}
            className="absolute w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_8px_magenta]"
            style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
          />
        ))}

        {battleResult === 'win' && (
           <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center font-black text-4xl text-emerald-400 drop-shadow-md z-30">
              SURVIVED
           </div>
        )}
        {battleResult === 'lose' && (
           <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center font-black text-4xl text-red-500 drop-shadow-md z-30">
              DESTROYED
           </div>
        )}
      </div>
    </div>
  );
};
