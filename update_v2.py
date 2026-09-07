with open('src/screens/LitepaperScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "全ての難易度の敵数を従来の1/10へ大幅圧縮し、代わりに全敵機の耐久力(HP)を10倍に強化。少数精鋭による重厚感ある攻防へリニューアルしました。レベル4の最後には大量の小ボスラッシュが追加され、大迫力のクライマックスが楽しめます。"
replacement = "全ての難易度の敵数および敵機の耐久力(HP)を調整（半減）し、防衛戦のプレイ時間の最適化および軽量化を実施しました。ボスの余計なエフェクトも削除され、より快適な動作で大迫力のクライマックスが楽しめます。"

content = content.replace(target, replacement)
content = content.replace("v1.0.228", "v1.0.229")

with open('src/screens/LitepaperScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/screens/TitleScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("v1.0.228", "v1.0.229")

with open('src/screens/TitleScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Versions and Litepaper updated")
