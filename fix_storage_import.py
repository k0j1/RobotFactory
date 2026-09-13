with open("src/screens/StorageScreen.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "import { BattleChestRewardService } from '../core/services/BattleChestRewardService';",
    "import { BattleChestRewardService } from '../components/minigames/BattleChestRewardService';"
)

with open("src/screens/StorageScreen.tsx", "w") as f:
    f.write(content)
