import React, { useState, useEffect, useRef } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';
import { motion, AnimatePresence } from 'motion/react';

interface Bullet {
  id: number;
  x: number;
  y: number;
  type: 'player' | 'enemy' | 'item_speed' | 'item_fireRate';
}

interface SpaceShooterProps extends Omit<MinigameProps, 'activeOpponent'> {}

export const SpaceShooterGame: React.FC<SpaceShooterProps> = ({ activeRobot, onFinish, speed, isPaused, isFinished, battleResult }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [hp, setHp] = useState(5);
  const [bossHp, setBossHp] = useState(100);
  const [timeMs, setTimeMs] = useState(0);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [hitEffect, setHitEffect] = useState<string | null>(null);
  const [hitFlash, setHitFlash] = useState(false);
  const [activeBuff, setActiveBuff] = useState<'speed' | 'fireRate' | null>(null);
  const [knockback, setKnockback] = useState(0);
  
  const hpRef = useRef(hp);
  const bossHpRef = useRef(bossHp);
  const timeMsRef = useRef(timeMs);
  const bulletsRef = useRef<Bullet[]>([]);
  const activeBuffRef = useRef<'speed' | 'fireRate' | null>(activeBuff);
  const buffTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const GOAL_TIME = 10000;
  const FPS = 30;
  
  const pwr = activeRobot.stats.power || 10;
  const dex = activeRobot.stats.dexterity || 10;
  const agi = activeRobot.stats.agility || 10;

  useEffect(() => {
    if (!battleResult) {
      hpRef.current = 5;
      bossHpRef.current = 100;
      timeMsRef.current = 0;
      bulletsRef.current = [];
      activeBuffRef.current = null;
      setHp(hpRef.current);
      setBossHp(bossHpRef.current);
      setTimeMs(timeMsRef.current);
      setBullets(bulletsRef.current);
      setActiveBuff(null);
      setKnockback(0);
      setHitFlash(false);
      setHitEffect(null);
      if (buffTimerRef.current) clearTimeout(buffTimerRef.current);
    }
  }, [activeRobot, battleResult]);

  useEffect(() => {
    if (!hasStarted || isPaused || isFinished || battleResult) return;

    const interval = 1000 / FPS;
    
    const timer = setInterval(() => {
      timeMsRef.current += interval * speed;
      setTimeMs(timeMsRef.current);

      if (timeMsRef.current >= GOAL_TIME && bossHpRef.current > 0) {
        clearInterval(timer);
        onFinish('lose');
        return;
      }

      let hitPlayer = false;

      // Calculate dynamic Y positions (10% to 90%)
      const playerY = 50 + Math.sin(timeMsRef.current / 400) * 35;
      const bossY = 50 + Math.cos(timeMsRef.current / 500) * 35;

      const nextBullets = bulletsRef.current.map(b => {
        if (b.type === 'enemy') {
          b.x -= 15 * speed;
          if (b.x < 15 && b.x > 5 && Math.abs(b.y - playerY) < 15) {
            const dodgeChance = Math.min(0.8, agi / 100);
            if (Math.random() > dodgeChance) {
              hpRef.current -= 1;
              hitPlayer = true;
            }
            return { ...b, x: -100 };
          }
        } else if (b.type === 'player') {
          const bulletSpeed = activeBuffRef.current === 'speed' ? 30 : 15;
          b.x += bulletSpeed * speed;
          if (b.x > 75 && b.x < 85 && Math.abs(b.y - bossY) < 15) {
            bossHpRef.current -= (pwr * 0.5);
            if (Math.random() < 0.15) {
              const itemType = Math.random() < 0.5 ? 'item_speed' : 'item_fireRate';
              nextBullets.push({ id: Date.now() + Math.random(), x: 80, y: bossY, type: itemType });
            }
            return { ...b, x: 200 };
          }
        } else if (b.type.startsWith('item')) {
          b.x -= 10 * speed;
          if (b.x < 15 && b.x > 5 && Math.abs(b.y - playerY) < 15) {
            const buff = b.type === 'item_speed' ? 'speed' : 'fireRate';
            activeBuffRef.current = buff;
            setActiveBuff(buff);
            if (buffTimerRef.current) clearTimeout(buffTimerRef.current);
            buffTimerRef.current = setTimeout(() => {
              activeBuffRef.current = null;
              setActiveBuff(null);
            }, 3000);
            return { ...b, x: -100 };
          }
        }
        return b;
      }).filter(b => b.x > -20 && b.x < 120);

      if (hitPlayer) {
        setHitEffect('💥');
        setHitFlash(true);
        setKnockback(-20);
        setTimeout(() => {
            setHitEffect(null);
            setHitFlash(false);
            setKnockback(0);
        }, 200);
      }

      // Spawn bullets
      const baseFireRate = 0.05 + (dex / 200);
      const fireRate = activeBuffRef.current === 'fireRate' ? baseFireRate * 3 : baseFireRate;
      if (Math.random() < fireRate * speed) {
        nextBullets.push({ id: Date.now() + Math.random(), x: 15, y: playerY, type: 'player' });
      }
      
      // Boss shoots
      if (Math.random() < 0.1 * speed) {
        nextBullets.push({ id: Date.now() + Math.random(), x: 80, y: bossY, type: 'enemy' });
      }

      bulletsRef.current = nextBullets;

      setBullets(nextBullets);
      setHp(Math.max(0, hpRef.current));
      setBossHp(Math.max(0, bossHpRef.current));

      if (hpRef.current <= 0) {
        clearInterval(timer);
        onFinish('lose');
      } else if (bossHpRef.current <= 0) {
        clearInterval(timer);
        onFinish('win');
      }

    }, interval);

    return () => {
        clearInterval(timer);
        if (buffTimerRef.current) clearTimeout(buffTimerRef.current);
    };
  }, [speed, isPaused, isFinished, battleResult, onFinish, agi, dex, pwr, hasStarted]);

  const timeLeft = Math.max(0, GOAL_TIME - timeMs);
  const playerY = 50 + Math.sin(timeMs / 400) * 35;
  const bossY = 50 + Math.cos(timeMs / 500) * 35;

  if (!hasStarted) {
    return (
      <div className="bg-stone-900 p-8 rounded-xl text-center text-white shadow-xl border-4 border-stone-700">
        <h3 className="text-2xl font-black text-yellow-400 mb-4">MISSION: シューティング</h3>
        <p className="text-stone-300 mb-6 leading-relaxed">
          巨大宇宙船を撃破せよ！<br/>
          <span className="text-emerald-400 font-bold">10秒以内</span>に敵のHPを0にすれば<span className="text-yellow-400">勝利</span>。<br/>
          自分のHP(5)が0になるか、時間切れで<span className="text-red-400">敗北</span>。<br/>
          <span className="text-[10px] text-stone-400 mt-2 block">※敵に攻撃を当てるとパワーアップアイテムが出現することがあります</span>
        </p>
        <div className="flex justify-center gap-4 mb-8 text-xs sm:text-sm">
           <div className="bg-stone-800 p-2 rounded border border-stone-600">💪 力: 攻撃力↑</div>
           <div className="bg-stone-800 p-2 rounded border border-stone-600">🎯 器用: 連射↑</div>
           <div className="bg-stone-800 p-2 rounded border border-stone-600">💨 敏捷: 回避↑</div>
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
                <span>Agi:{agi}</span><span>Dex:{dex}</span><span>Pow:{pwr}</span>
                {activeBuff === 'speed' && <span className="text-cyan-400 font-bold animate-pulse">弾速UP!</span>}
                {activeBuff === 'fireRate' && <span className="text-amber-400 font-bold animate-pulse">連射UP!</span>}
            </div>
          </div>
        </div>
        
        <div className="text-center font-mono text-yellow-400 font-black text-xl">
           {(timeLeft / 1000).toFixed(2)}s
        </div>

        <div className="text-right text-white font-mono text-sm">
           <div className="text-red-400 font-bold">BOSS HP: {Math.floor(bossHp)}</div>
        </div>
      </div>

      <div className="relative h-80 bg-slate-900 border-4 border-stone-700 rounded-xl overflow-hidden shadow-xl">
        {/* Scrolling Space Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: `-${(timeMs / 10) % 50}px 0` 
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

        {/* Player Robot */}
        <div 
            className="absolute left-[10%] z-20 transition-transform duration-75"
            style={{ top: `${playerY}%`, transform: `translate(${knockback}px, -50%)` }}
        >
          <motion.div
            animate={{ rotate: battleResult === 'lose' ? 90 : 0 }}
            transition={{ duration: 1 }}
          >
            <RobotVisual robot={activeRobot} size={64} emotion={battleResult === 'lose' ? 'troubled' : battleResult === 'win' ? 'happy' : 'normal'} hideBackground={true} />
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

        {/* Boss Spaceship */}
        <div 
            className="absolute right-[10%] z-20"
            style={{ top: `${bossY}%`, transform: 'translateY(-50%)' }}
        >
          <div className={`text-7xl drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] ${bossHp <= 0 ? 'grayscale opacity-30' : ''}`}>
            🛸
          </div>
        </div>

        {/* Bullets & Items */}
        {bullets.map(b => {
          if (b.type === 'enemy') {
              return (
                <div 
                  key={b.id}
                  className="absolute w-4 h-4 rounded-full bg-red-500 shadow-[0_0_8px_red]"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
                />
              );
          } else if (b.type === 'player') {
              return (
                <div 
                  key={b.id}
                  className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
                />
              );
          } else if (b.type === 'item_speed') {
              return (
                <div 
                  key={b.id}
                  className="absolute w-6 h-6 rounded-full bg-cyan-200 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-800 shadow-[0_0_10px_cyan]"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  S
                </div>
              );
          } else if (b.type === 'item_fireRate') {
              return (
                <div 
                  key={b.id}
                  className="absolute w-6 h-6 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-800 shadow-[0_0_10px_orange]"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  F
                </div>
              );
          }
          return null;
        })}

        {battleResult === 'win' && (
           <div className="absolute inset-0 bg-white/20 flex items-center justify-center font-black text-4xl text-yellow-300 drop-shadow-md z-30">
              MISSION CLEAR
           </div>
        )}
        {battleResult === 'lose' && (
           <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center font-black text-4xl text-red-500 drop-shadow-md z-30">
              MISSION FAILED
           </div>
        )}
      </div>
    </div>
  );
};
