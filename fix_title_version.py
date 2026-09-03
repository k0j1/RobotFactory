import re

with open('src/screens/TitleScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'v1\.0\.(\d+)', lambda m: f"v1.0.{int(m.group(1)) + 1}", content)

with open('src/screens/TitleScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

