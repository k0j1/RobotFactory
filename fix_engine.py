import re

with open('src/core/GameEngine.ts', 'r') as f:
    content = f.read()

chest_methods = """
  public addChest(chestTier: string, amount: number = 1) {
    if (!this.state.unopenedChests) {
      this.state.unopenedChests = {};
    }
    this.state.unopenedChests[chestTier] = (this.state.unopenedChests[chestTier] || 0) + amount;
    this.saveState();
  }

  public removeChest(chestTier: string, amount: number = 1): boolean {
    if (!this.state.unopenedChests || (this.state.unopenedChests[chestTier] || 0) < amount) {
      return false;
    }
    this.state.unopenedChests[chestTier] -= amount;
    this.saveState();
    return true;
  }
"""

content = re.sub(r'(public addMaterial\(materialId: string, amount: number = 1\) \{)', chest_methods + r'\n  \1', content)

with open('src/core/GameEngine.ts', 'w') as f:
    f.write(content)
