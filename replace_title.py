import re

with open('src/screens/TitleScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace version
content = content.replace("v1.0.224", "v1.0.225")

with open('src/screens/TitleScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
