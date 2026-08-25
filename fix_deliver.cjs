const fs = require('fs');
let code = fs.readFileSync('src/core/GameEngine.ts', 'utf-8');

const target = "this.state.gold += req.rewardG;";
const replacement = `
    let rewardG = req.rewardG;
    if (this.state.clientAffection) {
        this.state.clientAffection[req.rank] = Math.min(10, (this.state.clientAffection[req.rank] || 1) + 1);
        if (this.state.clientAffection[req.rank] === 10) {
            rewardG = Math.floor(rewardG * 1.5);
        }
    }
    
    if (!this.state.completedRequestDeadlines) {
        this.state.completedRequestDeadlines = {};
    }
    this.state.completedRequestDeadlines[req.rank] = req.deadline;

    this.state.gold += rewardG;
`;

code = code.replace(target, replacement);
fs.writeFileSync('src/core/GameEngine.ts', code);
