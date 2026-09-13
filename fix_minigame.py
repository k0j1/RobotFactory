import re

with open('src/screens/MinigameScreen.tsx', 'r') as f:
    content = f.read()

# Replace the part where it gives items to just give chest
give_items_combat = """        if (chestDrop.repairKits > 0) {
          (engine as any).addRepairKits(chestDrop.repairKits);
        }
        if (chestDrop.gold > 0) {
          (engine as any).addGold(chestDrop.gold);
        }
        if (chestDrop.elements > 0) {
          (engine as any).addBattleElements(chestDrop.elements);
        }
        for (const mat of chestDrop.materials) {
          (engine as any).addMaterial(mat.material.id, mat.count);
        }
        if (chestDrop.fame > 0) {
          (engine as any).addFame(chestDrop.fame, `${selectedGame === 'othello' ? 'オセロ' : selectedGame === 'chess' ? 'チェス' : '演習'}勝利: ${activeOpponent.name}`);
        }"""

give_chest_combat = """        (engine as any).addChest(chestDrop.chestTier, 1);
        if (chestDrop.fame > 0) {
          (engine as any).addFame(chestDrop.fame, `${selectedGame === 'othello' ? 'オセロ' : selectedGame === 'chess' ? 'チェス' : '演習'}勝利: ${activeOpponent.name}`);
        }"""

content = content.replace(give_items_combat, give_chest_combat)

give_items_defense = """        if (chestDrop.repairKits > 0) {
          (engine as any).addRepairKits(chestDrop.repairKits);
        }
        if (chestDrop.gold > 0) {
          (engine as any).addGold(chestDrop.gold);
        }
        if (chestDrop.elements > 0) {
          (engine as any).addBattleElements(chestDrop.elements);
        }
        for (const mat of chestDrop.materials) {
          (engine as any).addMaterial(mat.material.id, mat.count);
        }
        if (chestDrop.fame > 0) {
          (engine as any).addFame(chestDrop.fame, `防衛成功: ${activeDefenseStage.name}`);
        }"""

give_chest_defense = """        (engine as any).addChest(chestDrop.chestTier, 1);
        if (chestDrop.fame > 0) {
          (engine as any).addFame(chestDrop.fame, `防衛成功: ${activeDefenseStage.name}`);
        }"""

content = content.replace(give_items_defense, give_chest_defense)

give_items_danmaku = """        if (chestDrop.repairKits > 0) {
          (engine as any).addRepairKits(chestDrop.repairKits);
        }
        if (chestDrop.gold > 0) {
          (engine as any).addGold(chestDrop.gold);
        }
        if (chestDrop.elements > 0) {
          (engine as any).addBattleElements(chestDrop.elements);
        }
        for (const mat of chestDrop.materials) {
          (engine as any).addMaterial(mat.material.id, mat.count);
        }"""

give_chest_danmaku = """        (engine as any).addChest(chestDrop.chestTier, 1);"""

content = content.replace(give_items_danmaku, give_chest_danmaku)

with open('src/screens/MinigameScreen.tsx', 'w') as f:
    f.write(content)
