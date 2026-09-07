import re

with open('src/screens/LitepaperScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace text
content = content.replace("演奏精度80.0%以上", "演奏精度90.0%以上")

# Note: The version bump requested requires bumping to 1.0.225
content = content.replace("v1.0.224", "v1.0.225")

with open('src/screens/LitepaperScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
