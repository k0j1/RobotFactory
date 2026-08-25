const fs = require('fs');
let data = fs.readFileSync('src/core/GameEngine.ts', 'utf8');

if (!data.includes('public addGold(')) {
  data = data.replace('public forceSave() {', `public addGold(amount: number) {
    this.state.gold += amount;
    this.saveState();
  }
  
  public forceSave() {`);
  fs.writeFileSync('src/core/GameEngine.ts', data);
}
