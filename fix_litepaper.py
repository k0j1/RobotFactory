import re

with open('src/screens/LitepaperScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "結果として高スコアを狙うことができます。</li>\n                  <li><strong>ロングノーツ",
    "結果として高スコアを狙うことができます。\n                <ul className=\"list-disc list-inside space-y-1 ml-4 mt-1\">\n                  <li><strong>ロングノーツ"
)

with open('src/screens/LitepaperScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed LitepaperScreen.tsx tags")
