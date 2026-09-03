import re

content = open("src/components/effects/GarageAmbience.tsx", "r").read()

content = re.sub(
    r"\{\/\* 右上: 稼働するハンマーと金床 & 火花 \(Anvil & Pounding Hammer\) \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>",
    "</div></div></div>",
    content,
    flags=re.DOTALL
)

with open("src/components/effects/GarageAmbience.tsx", "w") as f:
    f.write(content)

