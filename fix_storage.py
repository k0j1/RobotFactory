with open("src/screens/StorageScreen.tsx", "r") as f:
    content = f.read()

# Add import
if "import { BattleChestRewardService }" not in content:
    content = "import { BattleChestRewardService } from '../core/services/BattleChestRewardService';\n" + content

# Fix typing on unopenedChests: (state.unopenedChests![k] || 0) > 0 or (count as number) > 0
content = content.replace("state.unopenedChests![k] > 0", "(state.unopenedChests![k] || 0) > 0")
content = content.replace("filter(([_, count]) => count > 0)", "filter(([_, count]) => Number(count) > 0)")

with open("src/screens/StorageScreen.tsx", "w") as f:
    f.write(content)
print("StorageScreen fixed.")
