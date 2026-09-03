import re

with open('src/screens/LitepaperScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update the piano explanation
content = re.sub(
    r"<li><strong>音楽（ピアノ演奏）:.*?任意で選択するテンポ（簡単/普通/難しい）に応じて、ピアノの演奏を行います。.*?</li>",
    "<li><strong>音楽（ピアノ演奏）:</strong> 楽曲ごとに設定された難易度レベル(Lv.1〜Lv.10)に応じて、ピアノの演奏を行います。難易度選択は撤廃され、ロボットの<strong>「敏捷 (Agi)」</strong>と<strong>「器用さ (Dex)」</strong>の値が高いほど、正確な鍵盤の押下とタイミング調整が行われ、より高い評価（EXCELLENTなど）を獲得しやすくなり、結果として高スコアを狙うことができます。</li>",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"<li><strong>フリーBGMの名曲採用:.*?綺麗なメロディが完成します。</li>",
    "<li><strong>クラシックやフリーBGMなど全10曲を収録:</strong> ベートーヴェンの「歓喜の歌」「月光」やモーツァルトの「トルコ行進曲」、ショパンの「幻想即興曲」「革命のエチュード」などのクラシック名曲に加え、甘茶の音楽工房の楽曲を含む全10曲を収録しました。レベル1の初心者向けからレベル10の超絶技巧曲まで幅広く楽しめます。</li>",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"<li><strong>難易度と複雑さの変化:.*?限界を超えたピアノ演奏体験を提供します。</li>",
    "<li><strong>完全再現のEXCELLENT演奏:</strong> 各楽曲はオリジナル音源と同等以上のリッチな和音やアルペジオを伴うフルアレンジの譜面（Notes）を持っています。すべてのノーツを「EXCELLENT」で完璧に弾き切った場合のみ、元の音源と遜色のない極めてクオリティの高いプロフェッショナルなピアノ演奏を完全に再現することができます。</li>",
    content,
    flags=re.DOTALL
)

with open('src/screens/LitepaperScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LitepaperScreen.tsx")
