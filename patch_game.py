with open('src/components/minigames/DefenseGame.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix spawnBatch logic
old_batch = """        // 1回で1〜3体の小隊として同時に出撃（入口から出る敵の数を増加）
        const remaining = stage.totalEnemies - state.spawnedCount;
        const spawnBatch = Math.min(
          Math.floor(1 + Math.random() * 2.5),
          remaining
        );"""
new_batch = """        // 同時に出現する敵数を半減（1回に1体のみ出撃させることで、マップ上の敵数を半分に抑える）
        const remaining = stage.totalEnemies - state.spawnedCount;
        const spawnBatch = Math.min(
          1,
          remaining
        );"""
content = content.replace(old_batch, new_batch)

# Fix boss logic Stage 5
old_stage5 = """            // レベル5: 敵数500
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
            }"""
new_stage5 = """            // レベル5: 敵数500
            // 最初の200は小ボス(HP10万→5万)、次150は中ボス(HP20万→10万)、次100は大ボス(HP30万→15万)、50毎に巨大ボス(HP50万→25万)、最後は超巨大ボス(HP100万→50万)
            if (currentSpawnIndex >= 500) {
              type = 'super_giant_boss';
              name = '超巨大ボス: アポカリプスΩ';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-fuchsia-400';
              hp = 500000;
              eSpeed = 22;
              size = 72;
            } else if (currentSpawnIndex >= 450 && currentSpawnIndex % 50 === 0) {
              type = 'giant_boss';
              name = '巨大ボス: ギガフォートレス零式';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dgrey.png';
              colorClass = 'text-red-500';
              hp = 250000;
              eSpeed = 28;
              size = 62;
            } else if (currentSpawnIndex <= 200) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 50000;
              eSpeed = 45;
              size = 46;
            } else if (currentSpawnIndex <= 350) {
              type = 'mid_boss';
              name = '中ボス: シージデストロイヤー';
              iconName = 'GiWarBonnet';
              sprite = '/assets/kenney/robots/robot_3Dyellow.png';
              colorClass = 'text-amber-400';
              hp = 100000;
              eSpeed = 40;
              size = 50;
            } else if (currentSpawnIndex <= 450) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 150000;
              eSpeed = 34;
              size = 56;
            } else {
              assignNormalEnemy();
            }"""
content = content.replace(old_stage5, new_stage5)

# Fix boss logic Stage 4
old_stage4 = """          } else if (stage.id === 'stage4') {
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
            } else if (currentSpawnIndex >= 301) {
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
            }"""
new_stage4 = """          } else if (stage.id === 'stage4') {
            // レベル4: 敵数400、最後の99体は全て小ボス(50000)、ラストに巨大ボス(250000)
            if (currentSpawnIndex >= 400) {
              type = 'giant_boss';
              name = '巨大ボス: ギガフォートレス零式';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dgrey.png';
              colorClass = 'text-red-500';
              hp = 250000;
              eSpeed = 28;
              size = 62;
            } else if (currentSpawnIndex >= 301) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 50000;
              eSpeed = 45;
              size = 46;
            } else {
              assignNormalEnemy();
            }"""
content = content.replace(old_stage4, new_stage4)

# Fix boss logic Stage 3
old_stage3 = """          } else if (stage.id === 'stage3') {
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
            }"""
new_stage3 = """          } else if (stage.id === 'stage3') {
            // レベル3: 敵数300、100毎に中ボス(100000)、最後に大ボス(150000)
            if (currentSpawnIndex >= 300) {
              type = 'large_boss';
              name = '大ボス: ドレッドノートタイタン';
              iconName = 'GiMegabot';
              sprite = '/assets/kenney/robots/robot_3Dred.png';
              colorClass = 'text-rose-500';
              hp = 150000;
              eSpeed = 34;
              size = 56;
            } else if (currentSpawnIndex % 100 === 0) {
              type = 'mid_boss';
              name = '中ボス: シージデストロイヤー';
              iconName = 'GiWarBonnet';
              sprite = '/assets/kenney/robots/robot_3Dyellow.png';
              colorClass = 'text-amber-400';
              hp = 100000;
              eSpeed = 40;
              size = 50;
            } else {
              assignNormalEnemy();
            }"""
content = content.replace(old_stage3, new_stage3)

# Fix boss logic Stage 2
old_stage2 = """          } else if (stage.id === 'stage2') {
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
            }"""
new_stage2 = """          } else if (stage.id === 'stage2') {
            // レベル2: 敵数200、100毎に小ボス(50000)
            if (currentSpawnIndex % 100 === 0) {
              type = 'mini_boss';
              name = '小ボス: ストライクコマンドー';
              iconName = 'GiLaserSparks';
              sprite = '/assets/kenney/robots/robot_3Dblue.png';
              colorClass = 'text-purple-400';
              hp = 50000;
              eSpeed = 45;
              size = 46;
            } else {
              assignNormalEnemy();
            }"""
content = content.replace(old_stage2, new_stage2)

# Fix assignNormalEnemy inside DefenseGame.tsx to halve HP
old_assign = """          // 通常敵の決定ヘルパー（耐久値10000〜50000、脚が早いスプリンターボットを含む）
          const assignNormalEnemy = () => {
            const rand = Math.random();
            if (rand < 0.25) {
              // 脚が早い敵: 高速疾走スプリンターボット
              type = 'sprinter';
              name = '高速スプリンターボット';
              iconName = 'GiFastArrow';
              sprite = '/assets/kenney/robots/robot_greenDrive2.png';
              colorClass = 'text-emerald-400';
              hp = 12000 + Math.floor(Math.random() * 6000); // 12000〜18000
              eSpeed = 135; // 脚が通常の約2〜3倍速い！
              size = 34;
            } else if (rand < 0.45) {
              // 偵察スカウト
              type = 'scout';
              name = '偵察スカウトボット';
              iconName = 'GiSpiderBot';
              sprite = '/assets/kenney/robots/robot_greenDrive1.png';
              colorClass = 'text-teal-400';
              hp = 10000 + Math.floor(Math.random() * 5000); // 10000〜15000
              eSpeed = 80;
              size = 36;
            } else if (rand < 0.68) {
              // 機動クローラー
              type = 'crawler';
              name = '機動クローラーボット';
              iconName = 'GiMonoWheelRobot';
              sprite = '/assets/kenney/robots/robot_blueDrive1.png';
              colorClass = 'text-sky-400';
              hp = 20000 + Math.floor(Math.random() * 8000); // 20000〜28000
              eSpeed = 65;
              size = 38;
            } else if (rand < 0.85) {
              // 重歩行ウォーカー
              type = 'walker';
              name = '重歩行ウォーカーボット';
              iconName = 'GiTrackedRobot';
              sprite = '/assets/kenney/robots/robot_yellowDrive1.png';
              colorClass = 'text-amber-400';
              hp = 30000 + Math.floor(Math.random() * 8000); // 30000〜38000
              eSpeed = 48;
              size = 42;
            } else {
              // 重装甲ゴーレム
              type = 'golem';
              name = '重装甲アイアンゴーレム';
              iconName = 'GiRobotGolem';
              sprite = '/assets/kenney/robots/robot_redDrive1.png';
              colorClass = 'text-rose-500';
              hp = 42000 + Math.floor(Math.random() * 8000); // 42000〜50000
              eSpeed = 32;
              size = 46;
            }
          };"""
new_assign = """          // 通常敵の決定ヘルパー（耐久値は以前の半分の5000〜25000、脚が早いスプリンターボットを含む）
          const assignNormalEnemy = () => {
            const rand = Math.random();
            if (rand < 0.25) {
              // 脚が早い敵: 高速疾走スプリンターボット
              type = 'sprinter';
              name = '高速スプリンターボット';
              iconName = 'GiFastArrow';
              sprite = '/assets/kenney/robots/robot_greenDrive2.png';
              colorClass = 'text-emerald-400';
              hp = 6000 + Math.floor(Math.random() * 3000); // 6000〜9000
              eSpeed = 135;
              size = 34;
            } else if (rand < 0.45) {
              // 偵察スカウト
              type = 'scout';
              name = '偵察スカウトボット';
              iconName = 'GiSpiderBot';
              sprite = '/assets/kenney/robots/robot_greenDrive1.png';
              colorClass = 'text-teal-400';
              hp = 5000 + Math.floor(Math.random() * 2500); // 5000〜7500
              eSpeed = 80;
              size = 36;
            } else if (rand < 0.68) {
              // 機動クローラー
              type = 'crawler';
              name = '機動クローラーボット';
              iconName = 'GiMonoWheelRobot';
              sprite = '/assets/kenney/robots/robot_blueDrive1.png';
              colorClass = 'text-sky-400';
              hp = 10000 + Math.floor(Math.random() * 4000); // 10000〜14000
              eSpeed = 65;
              size = 38;
            } else if (rand < 0.85) {
              // 重歩行ウォーカー
              type = 'walker';
              name = '重歩行ウォーカーボット';
              iconName = 'GiTrackedRobot';
              sprite = '/assets/kenney/robots/robot_yellowDrive1.png';
              colorClass = 'text-amber-400';
              hp = 15000 + Math.floor(Math.random() * 4000); // 15000〜19000
              eSpeed = 48;
              size = 42;
            } else {
              // 重装甲ゴーレム
              type = 'golem';
              name = '重装甲アイアンゴーレム';
              iconName = 'GiRobotGolem';
              sprite = '/assets/kenney/robots/robot_redDrive1.png';
              colorClass = 'text-rose-500';
              hp = 21000 + Math.floor(Math.random() * 4000); // 21000〜25000
              eSpeed = 32;
              size = 46;
            }
          };"""
content = content.replace(old_assign, new_assign)

with open('src/components/minigames/DefenseGame.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("DefenseGame.tsx patched.")
