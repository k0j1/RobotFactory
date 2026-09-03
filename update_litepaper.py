import re

content = open("src/screens/LitepaperScreen.tsx", "r").read()

content = re.sub(
    r"v1\.0\.147",
    "v1.0.148",
    content
)

content = re.sub(
    r"<li><strong>専用楽曲「エレジー」の採用:</strong>.*?味わえます。</li>\s*<li><strong>倍速モード設定:</strong>.*?なりました。</li>",
    """<li><strong>フリーBGMの名曲採用:</strong> 甘茶の音楽工房より、フリーBGMの名曲「エレジー」「夢」「夏の霧」の3曲を収録しました。プレイ中は実際のMP3音源が背景に控えめな音量で流れ、ノーツに合わせて生成される美しいピアノシンセサイザーの音が主旋律として重なります。ロボットが上手に演奏できると綺麗なメロディが完成します。</li>
                  <li><strong>難易度と複雑さの変化:</strong> 難易度設定は単なるスピードアップではなく、「簡単（主旋律のみ）」「普通（主旋律＋伴奏）」「難しい（複雑な伴奏と和音・アルペジオ）」のように譜面の複雑さと音数が劇的に変化する本格的なピアノ演奏体験へと進化しました。</li>""",
    content,
    flags=re.DOTALL
)

with open("src/screens/LitepaperScreen.tsx", "w") as f:
    f.write(content)

