import re
import os
import glob

# dictionary of replacements
reps = {
    '⚔': '<Gi.GiSwords className="inline text-red-500" />',
    '🛡': '<Gi.GiShield className="inline text-blue-500" />',
    '⚡': '<Gi.GiLightningFlashes className="inline text-yellow-500" />',
    '🎯': '<Gi.GiBullseye className="inline text-green-500" />',
    '🔮': '<Gi.GiCrystalBall className="inline text-purple-500" />',
    '💨': '<Gi.GiDash className="inline text-stone-400" />',
    '📊': '<Gi.GiChart className="inline text-stone-500" />',
    '📡': '<Gi.GiRadarDish className="inline text-stone-500" />',
    '♻': '<Gi.GiRecycle className="inline text-emerald-500" />',
    '⚙': '<Gi.GiCog className="inline text-stone-500" />',
    '🔧': '<Gi.GiSpanner className="inline text-stone-500" />',
    '🔍': '<Gi.GiMagnifyingGlass className="inline text-stone-500" />',
    '👑': '<Gi.GiCrown className="inline text-yellow-500" />',
    '🍷': '<Gi.GiWineGlass className="inline text-red-500" />',
    '📋': '<Gi.GiClipboard className="inline text-stone-500" />',
    '🔨': '<Gi.GiHammer className="inline text-stone-500" />',
    '🌟': '<Gi.GiStarFormation className="inline text-yellow-400" />',
    '💖': '<Gi.GiHeartPlus className="inline text-pink-500" />',
    '💡': '<Gi.GiLightBulb className="inline text-yellow-500" />',
    '⚠': '<Gi.GiHazardSign className="inline text-yellow-500" />',
    '💀': '<Gi.GiSkull className="inline text-stone-500" />',
    '🎉': '<Gi.GiPartyPopper className="inline text-amber-500" />',
    '🎵': '<Gi.GiMusicalNotes className="inline text-blue-400" />',
    '🎹': '<Gi.GiPianoKeys className="inline text-stone-700" />',
    '👾': '<Gi.GiAlienStare className="inline text-purple-500" />',
    '🛡': '<Gi.GiShield className="inline text-blue-500" />',
    '🚀': '<Gi.GiRocketFlight className="inline text-red-500" />',
    '💥': '<Gi.GiExplosion className="inline text-orange-500" />',
    '♟': '<Gi.GiChessPawn className="inline text-stone-600" />'
}

files = glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Special handling to ensure Gi is imported if we add Gi components
    needs_gi = False
    
    # We only replace emojis if they are not in a string where it might break things,
    # but JSX is pretty forgiving.
    # Actually, we can just replace them directly.
    new_content = content
    for emoji, tag in reps.items():
        if emoji in new_content:
            new_content = new_content.replace(emoji, tag)
            needs_gi = True

    if needs_gi and "import * as Gi from" not in new_content:
        # Add import at the top
        new_content = "import * as Gi from 'react-icons/gi';\n" + new_content

    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
