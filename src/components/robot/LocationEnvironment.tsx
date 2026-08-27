import React from 'react';
import { motion } from 'motion/react';

interface LocationEnvironmentProps {
  locationId?: string;
  speedMultiplier?: number; // Agilityによる速度倍率
  animateScroll?: boolean; // 背景の横スクロールアニメーション
}

export const LocationEnvironment: React.FC<LocationEnvironmentProps> = ({ 
  locationId = 'default',
  speedMultiplier = 1.0,
  animateScroll = true
}) => {
  // スピード倍率に応じたアニメーション時間調整（Agilityが高いほど早く流れる）
  const dur = (baseDuration: number) => Math.max(0.2, baseDuration / speedMultiplier);
  const scrollDuration = dur(1.5); // 背景の横スクロール周期

  switch (locationId) {
    case 'loc1': {
      // 裏山のスクラップ場: 砂埃・鉄くずの微風・薄暗いスクラップの山
      const scrapSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
          <rect width="140" height="140" fill="#2d2a26"/>
          <!-- スクラップの山と歯車 -->
          <circle cx="35" cy="45" r="14" fill="none" stroke="#48423b" stroke-width="3" stroke-dasharray="4 3"/>
          <circle cx="35" cy="45" r="5" fill="#3d3731"/>
          <path d="M0 120 L25 90 L50 110 L85 85 L115 115 L140 95 L140 140 L0 140 Z" fill="#22201d"/>
          <path d="M20 130 L45 105 L70 125 L105 100 L135 130 L140 120 L140 140 L20 140 Z" fill="#1b1a17"/>
          <rect x="90" y="30" width="16" height="8" rx="2" fill="#3a342d" transform="rotate(25 90 30)"/>
          <circle cx="115" cy="55" r="3" fill="#524b43"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${scrapSvg}")`,
            backgroundSize: '140px 140px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-140px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 砂埃・砂塵パーティクル (横風) */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute rounded-full bg-amber-700/40"
              style={{
                width: 3 + (i % 4) * 2,
                height: 2 + (i % 3),
                top: `${15 + (i * 11) % 75}%`,
                left: '-10%'
              }}
              animate={{
                x: ['0%', '1200%'],
                y: [0, (i % 2 === 0 ? 8 : -8), 0],
                opacity: [0, 0.7, 0.7, 0]
              }}
              transition={{
                duration: dur(2.5 + (i % 3) * 0.8),
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'linear'
              }}
            />
          ))}

          {/* 小さな金属の火花 */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1 h-1 bg-amber-300 rounded-full"
              style={{
                top: `${40 + (i * 15) % 50}%`,
                left: `${20 + (i * 22) % 65}%`
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                y: [0, -6]
              }}
              transition={{
                duration: dur(1.0),
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      );
    }

    case 'loc2': {
      // 灼熱の廃工場: 赤熱パイプ・溶岩炉・メラメラと立ち昇る火の粉と熱気
      const foundrySvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
          <rect width="120" height="120" fill="#260f0f"/>
          <!-- 工場の煙突と配管 -->
          <rect x="15" y="10" width="12" height="70" fill="#3b1616"/>
          <rect x="75" y="20" width="16" height="60" fill="#3b1616"/>
          <path d="M0 60 Q30 75 60 60 T120 60" fill="none" stroke="#661e1e" stroke-width="4"/>
          <!-- 下部の溶岩だまり -->
          <path d="M0 100 Q30 92 60 100 T120 100 L120 120 L0 120 Z" fill="#7a1a08"/>
          <path d="M0 108 Q30 102 60 108 T120 108 L120 120 L0 120 Z" fill="#c2410c"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${foundrySvg}")`,
            backgroundSize: '120px 120px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-120px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 熱気の赤熱グロー */}
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-red-600/30 via-orange-500/15 to-transparent"
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: dur(1.5), repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 立ち昇る火の粉 (Embers) */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              className="absolute rounded-full shadow-sm"
              style={{
                width: 2 + (i % 3) * 1.5,
                height: 2 + (i % 3) * 1.5,
                backgroundColor: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#fb923c' : '#ef4444',
                boxShadow: '0 0 6px rgba(251, 146, 60, 0.8)',
                bottom: '5%',
                left: `${5 + (i * 8.5) % 90}%`
              }}
              animate={{
                y: ['0%', '-600%'],
                x: [0, (i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? -10 : 10)],
                opacity: [0, 1, 0.8, 0],
                scale: [1, 1.3, 0.4]
              }}
              transition={{
                duration: dur(1.8 + (i % 4) * 0.4),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      );
    }

    case 'loc3': {
      // 水没した都市遺跡: 降り注ぐ雨・浮遊する水泡・青緑の水底
      const ruinsSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
          <rect width="130" height="130" fill="#081c24"/>
          <!-- 水没ビルと柱 -->
          <rect x="10" y="40" width="22" height="90" fill="#0e2d3a"/>
          <rect x="14" y="48" width="4" height="6" fill="#1b495c"/>
          <rect x="22" y="48" width="4" height="6" fill="#1b495c"/>
          <rect x="14" y="62" width="4" height="6" fill="#1b495c"/>
          <rect x="22" y="62" width="4" height="6" fill="#1b495c"/>
          <rect x="65" y="25" width="28" height="105" fill="#0b242e"/>
          <path d="M100 130 L110 70 L125 130 Z" fill="#0a1f27"/>
          <path d="M0 115 Q30 110 65 118 T130 115 L130 130 L0 130 Z" fill="#06151c"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${ruinsSvg}")`,
            backgroundSize: '130px 130px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-130px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 水中ライトコースティクス */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-blue-900/30 to-teal-950/40" />

          {/* 斜めに降り注ぐ雨 (Rain Streaks) */}
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="absolute bg-gradient-to-b from-cyan-300/40 via-blue-200/80 to-transparent"
              style={{
                width: '1.5px',
                height: 18 + (i % 3) * 8,
                top: '-20%',
                left: `${(i * 7.5) % 105}%`,
                transform: 'rotate(15deg)'
              }}
              animate={{
                y: ['0%', '700%'],
                x: [0, 40],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: dur(0.6 + (i % 3) * 0.2),
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'linear'
              }}
            />
          ))}

          {/* 下から浮かぶ水泡 (Bubbles) */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full border border-cyan-300/60 bg-cyan-400/20"
              style={{
                width: 4 + (i % 3) * 3,
                height: 4 + (i % 3) * 3,
                bottom: '2%',
                left: `${12 + (i * 16) % 80}%`
              }}
              animate={{
                y: ['0%', '-500%'],
                x: [0, (i % 2 === 0 ? 8 : -8), (i % 2 === 0 ? -4 : 4), 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: dur(2.2 + (i % 3) * 0.6),
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      );
    }

    case 'loc4': {
      // 風の谷の観測所: 険しい山並み・激しい突風の筋・舞い散る木の葉
      const windSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
          <rect width="150" height="150" fill="#172b38"/>
          <!-- 山脈と風車 -->
          <path d="M0 150 L40 70 L80 150 Z" fill="#1d3849"/>
          <path d="M50 150 L100 50 L150 150 Z" fill="#13232d"/>
          <!-- 風車の塔 -->
          <rect x="88" y="70" width="4" height="40" fill="#2d5269"/>
          <circle cx="90" cy="70" r="3" fill="#4a7996"/>
          <line x1="90" y1="70" x2="75" y2="60" stroke="#4a7996" stroke-width="1.5"/>
          <line x1="90" y1="70" x2="105" y2="60" stroke="#4a7996" stroke-width="1.5"/>
          <line x1="90" y1="70" x2="90" y2="85" stroke="#4a7996" stroke-width="1.5"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${windSvg}")`,
            backgroundSize: '150px 150px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-150px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 高速で吹き抜ける風の筋 (Wind Gust Trails) */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`wind-${i}`}
              className="absolute h-0.5 rounded-full bg-gradient-to-r from-transparent via-teal-200/70 to-transparent"
              style={{
                width: 50 + (i % 3) * 35,
                top: `${10 + (i * 12) % 80}%`,
                left: '-30%'
              }}
              animate={{
                x: ['0%', '500%'],
                opacity: [0, 0.9, 0.9, 0]
              }}
              transition={{
                duration: dur(0.8 + (i % 3) * 0.3),
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'linear'
              }}
            />
          ))}

          {/* 舞い散る木の葉 (Swirling Leaves) */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute w-2 h-1.5 bg-emerald-400 rounded-tr-full rounded-bl-full shadow-sm"
              style={{
                top: `${15 + (i * 14) % 70}%`,
                left: '-10%'
              }}
              animate={{
                x: ['0%', '1300%'],
                y: [0, (i % 2 === 0 ? 16 : -16), 0],
                rotate: [0, 360 * (i % 2 === 0 ? 2 : -2)],
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: dur(1.6 + (i % 2) * 0.4),
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      );
    }

    case 'loc5': {
      // 光の塔: クリスタルの尖塔・降雪・ダイヤモンドダスト・輝く光粒子
      const lightSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
          <rect width="130" height="130" fill="#131e2b"/>
          <!-- 光の塔とクリスタル -->
          <polygon points="65,10 50,130 80,130" fill="#203348"/>
          <polygon points="65,10 65,130 80,130" fill="#283e57"/>
          <polygon points="65,5 58,25 72,25" fill="#93c5fd"/>
          <circle cx="65" cy="5" r="4" fill="#dbeafe"/>
          <polygon points="20,70 12,130 28,130" fill="#182737"/>
          <polygon points="110,60 102,130 118,130" fill="#182737"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${lightSvg}")`,
            backgroundSize: '130px 130px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-130px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* オーロラ光グラデーション */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-indigo-500/15 to-amber-200/10"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: dur(3.0), repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 舞い散るダイヤモンドダスト・雪粒子 (Snow & Diamond Dust) */}
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={`snow-${i}`}
              className="absolute rounded-full bg-white shadow-sm"
              style={{
                width: 2 + (i % 3) * 1.5,
                height: 2 + (i % 3) * 1.5,
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.9)',
                top: '-10%',
                left: `${(i * 7.7) % 100}%`
              }}
              animate={{
                y: ['0%', '1100%'],
                x: [0, (i % 2 === 0 ? 12 : -12), (i % 2 === 0 ? -8 : 8), 0],
                opacity: [0, 1, 0.8, 0]
              }}
              transition={{
                duration: dur(2.2 + (i % 4) * 0.5),
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'linear'
              }}
            />
          ))}

          {/* キラキラ瞬く光の十字星 */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute text-yellow-200 text-xs font-bold select-none"
              style={{
                top: `${15 + (i * 18) % 65}%`,
                left: `${10 + (i * 21) % 80}%`
              }}
              animate={{
                scale: [0, 1.4, 0],
                rotate: [0, 90, 180],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: dur(1.5),
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut'
              }}
            >
              ✦
            </motion.div>
          ))}
        </motion.div>
      );
    }

    case 'loc6': {
      // 最果てのクレーター: 漆黒の宇宙・紫色の星雲ガス・ダークエネルギー胞子・流星
      const craterSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
          <rect width="140" height="140" fill="#100718"/>
          <!-- クレーターと月面岩 -->
          <ellipse cx="70" cy="115" rx="55" ry="16" fill="#1c0e29" stroke="#311747" stroke-width="2"/>
          <ellipse cx="25" cy="85" rx="20" ry="7" fill="#170c22"/>
          <ellipse cx="120" cy="75" rx="18" ry="6" fill="#170c22"/>
          <!-- 遠くの紫色惑星 -->
          <circle cx="110" cy="30" r="12" fill="#2c1442"/>
          <circle cx="110" cy="30" r="14" fill="none" stroke="#48226b" stroke-width="1.5"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${craterSvg}")`,
            backgroundSize: '140px 140px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-140px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 紫色の星雲ミスト */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-fuchsia-950/20 to-indigo-950/30"
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: dur(2.5), repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 浮遊するダークエネルギー胞子 (Dark Motes) */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`mote-${i}`}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 3) * 1.5,
                height: 3 + (i % 3) * 1.5,
                backgroundColor: i % 2 === 0 ? '#c084fc' : '#e879f9',
                boxShadow: '0 0 8px rgba(192, 132, 252, 0.8)',
                bottom: '10%',
                left: `${8 + (i * 9.5) % 85}%`
              }}
              animate={{
                y: ['0%', '-500%'],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0, 0.9, 0],
                scale: [0.6, 1.2, 0.4]
              }}
              transition={{
                duration: dur(2.4 + (i % 3) * 0.6),
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* 流れ星 (Meteor Streak) */}
          <motion.div
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-white rounded-full"
            style={{
              width: 45,
              top: '20%',
              left: '-20%',
              transform: 'rotate(-25deg)'
            }}
            animate={{
              x: ['0%', '800%'],
              y: ['0%', '400%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: dur(0.9),
              repeat: Infinity,
              repeatDelay: 2.2,
              ease: 'easeOut'
            }}
          />
        </motion.div>
      );
    }

    case 'loc7': {
      // 古代文明の中枢: サイバー回路基板・黄金の古代グリッド・データストリーム粒子
      const cyberSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
          <rect width="120" height="120" fill="#08181c"/>
          <!-- 回路基板と古代ルーン -->
          <path d="M10 0 L10 40 L40 70 L40 120" fill="none" stroke="#13434d" stroke-width="2"/>
          <path d="M110 0 L110 30 L80 60 L80 120" fill="none" stroke="#13434d" stroke-width="2"/>
          <circle cx="40" cy="70" r="3" fill="#1b606e"/>
          <circle cx="80" cy="60" r="3" fill="#1b606e"/>
          <polygon points="60,35 75,60 60,85 45,60" fill="none" stroke="#854d0e" stroke-width="1.5"/>
          <circle cx="60" cy="60" r="4" fill="#eab308"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${cyberSvg}")`,
            backgroundSize: '120px 120px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-120px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 金色とシアンのパルスグラデーション */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-teal-900/25 via-emerald-950/15 to-amber-950/20"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: dur(2.0), repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* デジタルコード粒子 (Cyber Matrix Bits) */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`cyber-${i}`}
              className="absolute rounded-sm font-mono text-[9px] font-bold select-none"
              style={{
                color: i % 2 === 0 ? '#22d3ee' : '#fbbf24',
                textShadow: '0 0 6px rgba(34, 211, 238, 0.8)',
                top: '-15%',
                left: `${(i * 8.5) % 95}%`
              }}
              animate={{
                y: ['0%', '800%'],
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: dur(1.2 + (i % 3) * 0.4),
                repeat: Infinity,
                delay: i * 0.12,
                ease: 'linear'
              }}
            >
              {i % 2 === 0 ? '01' : '◈'}
            </motion.div>
          ))}

          {/* 黄金エネルギーパルス */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`pulse-${i}`}
              className="absolute w-2 h-2 bg-amber-400 rotate-45"
              style={{
                top: `${25 + (i * 15) % 60}%`,
                left: `${15 + (i * 19) % 75}%`,
                boxShadow: '0 0 8px #facc15'
              }}
              animate={{
                scale: [0, 1.3, 0],
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: dur(1.6),
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      );
    }

    default: {
      // 汎用・洞窟パターン
      const caveSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
          <rect width="120" height="120" fill="#201c1a"/>
          <path d="M0 0 L30 20 L70 10 L120 25 L120 0 Z" fill="#141211"/>
          <path d="M0 120 L40 100 L80 115 L120 95 L120 120 Z" fill="#141211"/>
          <polygon points="25,20 30,50 35,20" fill="#2b2624"/>
          <polygon points="75,10 80,45 85,10" fill="#2b2624"/>
          <polygon points="50,110 55,80 60,110" fill="#2b2624"/>
        </svg>
      `);

      return (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${caveSvg}")`,
            backgroundSize: '120px 120px'
          }}
          animate={animateScroll ? { backgroundPosition: ["0px 0px", "-120px 0px"] } : {}}
          transition={animateScroll ? { duration: scrollDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* 小石の落下・環境光粒子 */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`pebble-${i}`}
              className="absolute w-1 h-1 bg-stone-400 rounded-full"
              style={{
                top: '-5%',
                left: `${10 + (i * 15) % 80}%`
              }}
              animate={{
                y: ['0%', '900%'],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: dur(1.5 + (i % 2) * 0.5),
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeIn'
              }}
            />
          ))}
        </motion.div>
      );
    }
  }
};
