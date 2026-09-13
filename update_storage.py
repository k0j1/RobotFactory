import re

with open('src/screens/StorageScreen.tsx', 'r') as f:
    content = f.read()

# Add states for chest opening modal
states_addition = """
  const [openingChest, setOpeningChest] = useState<string | null>(null);
  const [openedChestResult, setOpenedChestResult] = useState<any | null>(null);

  const handleOpenChest = (chestTier: string) => {
    if (engine.removeChest(chestTier, 1)) {
      setOpeningChest(chestTier);
      // Simulate opening delay
      setTimeout(() => {
        let result;
        // Depending on chestTier, roll something generic or combat
        // For simplicity, we just use rollCombatChest with different levels
        const level = chestTier === 'bronze' ? 2 : chestTier === 'silver' ? 4 : chestTier === 'gold' ? 6 : 8;
        result = BattleChestRewardService.rollCombatChest(level, '宝箱開封', 0);
        
        // Add items to engine
        if (result.gold > 0) engine.addGold(result.gold);
        if (result.elements > 0) engine.addBattleElements(result.elements);
        for (const mat of result.materials) {
          engine.addMaterial(mat.material.id, mat.count);
        }
        
        setOpeningChest(null);
        setOpenedChestResult(result);
      }, 1500);
    }
  };
"""

content = re.sub(r'(const \[now, setNow\] = useState\(Date.now\(\)\);)', r'\1' + '\n' + states_addition, content)

# Add import for BattleChestRewardService
if 'BattleChestRewardService' not in content:
    content = re.sub(r'(import { GameEngine } from \'\.\./core/GameEngine\';)', r'\1\nimport { BattleChestRewardService } from \'../components/minigames/BattleChestRewardService\';', content)

with open('src/screens/StorageScreen.tsx', 'w') as f:
    f.write(content)
