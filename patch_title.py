with open('src/screens/TitleScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("v1.0.231", "v1.0.232")
with open('src/screens/TitleScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/screens/LitepaperScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("v1.0.231", "v1.0.232")
# Add La Campanella to Litepaper if needed
import re
if "ピアノ演奏" in content:
    content = content.replace("・エリーゼのために", "・ラ・カンパネラ\n                  ・エリーゼのために")
with open('src/screens/LitepaperScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
