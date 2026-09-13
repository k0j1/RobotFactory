import re

with open('src/components/minigames/combat/CombatSetupCard.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'<span className="text-red-700 font-bold ml-0\.5">\(\+攻 \{nextSaberAtk\.saberAttackBonus\}\)</span>', '', content)
content = re.sub(r'<span className="text-emerald-700 font-bold ml-0\.5">\(防 \+\{nextShieldDef\.shieldDefenseBonus\}\)</span>', '', content)

with open('src/components/minigames/combat/CombatSetupCard.tsx', 'w') as f:
    f.write(content)
