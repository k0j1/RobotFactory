import re

with open('src/components/minigames/BattleChestRewardModal.tsx', 'r') as f:
    content = f.read()

# We'll just replace the JSX to show the chest but not open it.
# Actually, the user can click it to 'collect' it, which just calls onClaim()

new_handle = """
  const handleOpenChest = () => {
    ChestAudioPlayer.playItemPop(0);
    onClaim();
  };
"""

content = re.sub(r'const handleOpenChest = \(\) => \{.*?\};', new_handle, content, flags=re.DOTALL)

# And replace the text
content = content.replace('タップして支給品を開封', 'タップして倉庫へ回収する')
content = content.replace('スキップ', 'すぐに回収')
content = content.replace('アイテムを回収', '回収完了')

with open('src/components/minigames/BattleChestRewardModal.tsx', 'w') as f:
    f.write(content)
