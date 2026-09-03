import re
import sys

def replace_emojis(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dictionary of emoji replacements using game-icons (react-icons/gi)
    replacements = {
        '🎉': '<Gi.GiPartyPopper className="inline mr-1" />',
        '💰': '<Gi.GiCoins className="inline mr-1 text-yellow-500" />',
        '🏆': '<Gi.GiTrophy className="inline mr-1 text-yellow-500" />',
        '📦': '<Gi.GiCardboardBox className="inline mr-1 text-stone-500" />',
        '🎒': '<Gi.GiKnapsack className="inline mr-1 text-amber-700" />',
        '📍': '<Gi.GiPushpin className="inline mr-1 text-red-500" />',
        '🎁': '<Gi.GiPresent className="inline mr-1 text-pink-500" />',
        '💦': '<Gi.GiWaterDrop className="inline mr-1 text-blue-400" />',
        '⚠️': '<Gi.GiHazardSign className="inline mr-1 text-yellow-500" />',
        '⚠': '<Gi.GiHazardSign className="inline mr-1 text-yellow-500" />',
        '⚡': '<Gi.GiLightningFlashes className="inline mr-1 text-yellow-400" />',
        '💔': '<Gi.GiBrokenHeart className="inline mr-1 text-red-500" />',
        '💡': '<Gi.GiLightBulb className="inline mr-1 text-yellow-400" />',
        '⚙️': '<Gi.GiCog className="inline" />',
        '⚙': '<Gi.GiCog className="inline" />',
        '📋': '<Gi.GiClipboard className="inline mr-1" />',
        '🏪': '<Gi.GiShop className="inline mr-1 text-amber-600" />',
        '📖': '<Gi.GiBookCover className="inline mr-1 text-stone-600" />',
        '📜': '<Gi.GiScrollUnfurled className="inline mr-1 text-amber-800" />',
        '🔧': '<Gi.GiSpanner className="inline mr-1" />',
        '★': '<Gi.GiStarFormation className="inline text-yellow-500" />'
    }

    # Manual targeted replacements for CraftScreen
    if "CraftScreen.tsx" in filename:
        content = content.replace('⚙️', '<Gi.GiCog className="inline" />')
        content = content.replace('🔧', '<Gi.GiSpanner className="inline mr-1" />')
        content = content.replace('🎉', '<Gi.GiPartyPopper className="inline mr-1" />')
        content = content.replace("{'★'.repeat(MATERIALS", "{'★'.repeat(MATERIALS") # leave stars alone for rarity
        # Actually it's better to just do specific ones to avoid breaking code like repeat('★')

    # General simple replacements
    for emoji, tag in replacements.items():
        if emoji != '★': # leave stars for rarity
            content = content.replace(emoji, tag)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

replace_emojis('src/screens/Dashboard.tsx')
replace_emojis('src/screens/CraftScreen.tsx')
