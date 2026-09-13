import re

with open('src/components/minigames/BattleChestRewardModal.tsx', 'r') as f:
    content = f.read()

# Change chestState to be collected instead of opened
content = content.replace("setChestState('opening');", "setChestState('collected');")
content = content.replace("setChestState('opened');", "setChestState('collected');")

# We just remove the items.forEach logic and item displaying logic, but we can do it more cleanly by 
# replacing the opened logic with collected logic.
# Wait, replacing the state name might break typescript.

