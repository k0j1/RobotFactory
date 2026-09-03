import re

with open('src/screens/LitepaperScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update version
content = re.sub(r'v1\.0\.(\d+)', lambda m: f"v1.0.{int(m.group(1)) + 1}", content)

# Add patch notes to the top of the history list if it exists.
# We will insert a new list item for v1.0.149 (or whatever the next is).
# The new features are:
# - ダッシュボードのハンマーアニメーションが隠れていたため削除
# - 工房内UI等で使用されていた絵文字アイコンを全て素材と同じゲームアイコン(react-icons/gi)に統一

new_history = """
          <ul className="list-disc pl-5 space-y-1 text-stone-600 text-sm mt-4">
            <li><strong>v1.0.149:</strong> ダッシュボードのハンマーアニメーションを削除し、UI内の絵文字をゲームアイコン(react-icons/gi)に完全統一</li>
"""
content = re.sub(r'<ul className="list-disc pl-5 space-y-1 text-stone-600 text-sm mt-4">\s*', new_history, content)

with open('src/screens/LitepaperScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

