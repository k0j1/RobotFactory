import re

content = open("src/components/effects/GarageAmbience.tsx", "r").read()

content = re.sub(
    r"\{\/\* 右上: 稼働するハンマーと金床 & 火花 \(Anvil & Pounding Hammer\) \*\/}.*?\{\/\* 右側中央: ゆっくり噛み合って回転するギア \(Rotating Gears\) \*\/\}",
    "{/* 右側中央: ゆっくり噛み合って回転するギア (Rotating Gears) */}",
    content,
    flags=re.DOTALL
)

with open("src/components/effects/GarageAmbience.tsx", "w") as f:
    f.write(content)

