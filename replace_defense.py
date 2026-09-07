import re

with open('src/components/minigames/DefenseGame.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace hp = 1200 (initial)
content = content.replace("let hp = 1200;", "let hp = 12000;")
content = content.replace("耐久値1000〜5000", "耐久値10000〜50000")

# 2. Replace assignNormalEnemy hp logic
content = content.replace("hp = 1200 + Math.floor(Math.random() * 600); // 1200〜1800", "hp = 12000 + Math.floor(Math.random() * 6000); // 12000〜18000")
content = content.replace("hp = 1000 + Math.floor(Math.random() * 500); // 1000〜1500", "hp = 10000 + Math.floor(Math.random() * 5000); // 10000〜15000")
content = content.replace("hp = 2000 + Math.floor(Math.random() * 800); // 2000〜2800", "hp = 20000 + Math.floor(Math.random() * 8000); // 20000〜28000")
content = content.replace("hp = 3000 + Math.floor(Math.random() * 800); // 3000〜3800", "hp = 30000 + Math.floor(Math.random() * 8000); // 30000〜38000")
content = content.replace("hp = 4200 + Math.floor(Math.random() * 800); // 4200〜5000", "hp = 42000 + Math.floor(Math.random() * 8000); // 42000〜50000")

# 3. Replace stage5 logic block
stage5_old = """          if (stage.id === 'stage5') {
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
          } else if (stage.id === 'stage4') {"""

stage5_new = """          if (stage.id === 'stage5') {
            // レベル5: 敵数500
            // 最初の200は小ボス(100000)、次150は中ボス(200000)、次100は大ボス(300000)、そこから50毎に巨大ボス(500000)、最後は超巨大ボス(1000000)
            if (currentSpawnIndex >= 500) {
              type = 'super_giant_boss';
              name = '超巨大ボス: アポカリプスΩ';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-fuchsia-400';
              hp = 1000000;
              eSpeed = 22;
              size = 72;
            } else if (currentSpawnIndex >= 450 && currentSpawnIndex % 50 === 0) {
              type = 'giant_boss';
              name = '巨大ボス: ギガフォートレス零式';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dgrey.png';
              colorClass = 'text-red-500';
              hp = 500000;
              eSpeed = 28;
              size = 62;
            } else if (currentSpawnIndex <= 200) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 100000;
              eSpeed = 45;
              size = 46;
            } else if (currentSpawnIndex <= 350) {
              type = 'mid_boss';
              name = '中ボス: シージデストロイヤー';
              iconName = 'GiWarBonnet';
              sprite = '/assets/kenney/robots/robot_3Dyellow.png';
              colorClass = 'text-amber-400';
              hp = 200000;
              eSpeed = 40;
              size = 50;
            } else if (currentSpawnIndex <= 450) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 300000;
              eSpeed = 34;
              size = 56;
            } else {
              assignNormalEnemy();
            }
          } else if (stage.id === 'stage4') {"""

content = content.replace(stage5_old, stage5_new)

# 4. Replace stage4, 3, 2, 1 logic
stage4321_old = """          } else if (stage.id === 'stage4') {
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
          }"""

stage4321_new = """          } else if (stage.id === 'stage4') {
            // レベル4: 敵数400、最後の99体は全て小ボス(100000)、ラストに巨大ボス(500000)
            if (currentSpawnIndex >= 400) {
              type = 'giant_boss';
              name = '巨大ボス: ギガフォートレス零式';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dgrey.png';
              colorClass = 'text-red-500';
              hp = 500000;
              eSpeed = 28;
              size = 62;
            } else if (currentSpawnIndex >= 302) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 100000;
              eSpeed = 45;
              size = 46;
            } else {
              assignNormalEnemy();
            }
          } else if (stage.id === 'stage3') {
            // レベル3: 敵数300、100毎に中ボス(200000)、最後に大ボス(300000)
            if (currentSpawnIndex >= 300) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 300000;
              eSpeed = 34;
              size = 56;
            } else if (currentSpawnIndex % 100 === 0) {
              type = 'mid_boss';
              name = '中ボス: シージデストロイヤー';
              iconName = 'GiWarBonnet';
              sprite = '/assets/kenney/robots/robot_3Dyellow.png';
              colorClass = 'text-amber-400';
              hp = 200000;
              eSpeed = 40;
              size = 50;
            } else {
              assignNormalEnemy();
            }
          } else if (stage.id === 'stage2') {
            // レベル2: 敵数200、100毎に小ボス(100000)
            if (currentSpawnIndex % 100 === 0) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 100000;
              eSpeed = 45;
              size = 46;
            } else {
              assignNormalEnemy();
            }
          } else {
            // レベル1: ボスなし、すべて通常敵 (10000〜50000)
            assignNormalEnemy();
          }"""

content = content.replace(stage4321_old, stage4321_new)

# 5. Update Base Damage logic
damage_old = """        const damageToBase =
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
            : 1;"""

damage_new = """        const damageToBase =
          e.type === 'super_giant_boss'
            ? 200
            : e.type === 'giant_boss'
            ? 100
            : e.type === 'large_boss'
            ? 60
            : e.type === 'mid_boss'
            ? 30
            : e.type === 'mini_boss'
            ? 10
            : e.type === 'golem'
            ? 4
            : e.type === 'walker'
            ? 2
            : 1;"""

content = content.replace(damage_old, damage_new)

with open('src/components/minigames/DefenseGame.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
