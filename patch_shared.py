import re

with open('src/components/minigames/Shared.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Stage 1
content = content.replace("敵数50体の大部隊。ボス出現なし。基本戦術と配置の確認に適した初級ステージ。", "敵数100体の大部隊。ボス出現なし。基本戦術と配置の確認に適した初級ステージ。")
content = content.replace("totalEnemies: 50,", "totalEnemies: 100,")
content = content.replace("ボスなし (通常敵のみ 50体)", "ボスなし (通常敵のみ 100体)")

# Stage 2
content = content.replace("敵数100体。50体ごとに小ボス(HP50000)が出現。脚の早いスプリンターボットの急襲に警戒せよ。", "敵数200体。100体ごとに小ボス(HP50000)が出現。脚の早いスプリンターボットの急襲に警戒せよ。")
content = content.replace("totalEnemies: 100,", "totalEnemies: 200,")
content = content.replace("50体ごとに小ボス(HP50,000)出現", "100体ごとに小ボス(HP50,000)出現")

# Stage 3
content = content.replace("敵数150体。50体ごとに中ボス(HP100000)が出現し、ラストに大ボス(HP150000)が急襲！", "敵数300体。100体ごとに中ボス(HP100000)が出現し、ラストに大ボス(HP150000)が急襲！")
content = content.replace("totalEnemies: 150,", "totalEnemies: 300,")
content = content.replace("50体毎に中ボス(HP10万)、最後に大ボス(HP15万)出現", "100体毎に中ボス(HP10万)、最後に大ボス(HP15万)出現")

# Stage 4
content = content.replace("敵数200体。最後の49体は全て小ボス、そしてラストに巨大ボス(HP250000)が降臨！", "敵数400体。最後の99体は全て小ボス、そしてラストに巨大ボス(HP250000)が降臨！")
content = content.replace("totalEnemies: 200,", "totalEnemies: 400,")
content = content.replace("最後の49体は小ボス、ラストに巨大ボス(HP25万)", "最後の99体は小ボス、ラストに巨大ボス(HP25万)")

# Stage 5
content = content.replace("敵数250体。最初の100体は全て小ボス、次75体は中ボス、次50体は大ボス、25体毎に巨大ボス、最後は超巨大ボス(HP500000)！", "敵数500体。最初の200体は全て小ボス、次150体は中ボス、次100体は大ボス、50体毎に巨大ボス、最後は超巨大ボス(HP500000)！")
content = content.replace("totalEnemies: 250,", "totalEnemies: 500,")

with open('src/components/minigames/Shared.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Shared.ts patched.")
