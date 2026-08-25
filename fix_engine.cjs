const fs = require('fs');
let code = fs.readFileSync('src/core/GameEngine.ts', 'utf-8');

const getUpdateTimesMethod = `
  private getUpdateTimes(rank: RequestRank, nowMs: number): { current: number, next: number } {
    const d = new Date(nowMs);
    d.setMinutes(0, 0, 0, 0);
    const h = d.getHours();
    
    const current = new Date(d.getTime());
    const next = new Date(d.getTime());
    
    if (rank === 'King') {
        if (h < 9) { current.setDate(current.getDate() - 1); }
        current.setHours(9);
        next.setTime(current.getTime());
        next.setDate(next.getDate() + 1);
    } else if (rank === 'Noble') {
        if (h < 9) { current.setDate(current.getDate() - 1); current.setHours(21); }
        else if (h < 21) { current.setHours(9); }
        else { current.setHours(21); }
        
        if (current.getHours() === 9) { next.setHours(21); }
        else { next.setDate(next.getDate() + 1); next.setHours(9); }
    } else if (rank === 'OldMan') {
        if (h < 3) { current.setDate(current.getDate() - 1); current.setHours(21); }
        else if (h < 9) { current.setHours(3); }
        else if (h < 15) { current.setHours(9); }
        else if (h < 21) { current.setHours(15); }
        else { current.setHours(21); }
        
        if (current.getHours() === 3) { next.setHours(9); }
        else if (current.getHours() === 9) { next.setHours(15); }
        else if (current.getHours() === 15) { next.setHours(21); }
        else { next.setDate(next.getDate() + 1); next.setHours(3); }
    }
    
    return { current: current.getTime(), next: next.getTime() };
  }
`;

const updateRegex = /public update\(\) \{[\s\S]*?\n  \}\n/m;
const newUpdateMethod = `public update() {
    this.processAutoDispatches();
    const now = Date.now();
    let changed = false;

    if (this.state.currentRequest && now >= this.state.currentRequest.deadline) {
      this.state.currentRequest = null;
      changed = true;
    }

    const ranks = ['King', 'Noble', 'OldMan'];
    for (let i = 0; i < ranks.length; i++) {
       const rank = ranks[i] as RequestRank;
       const times = this.getUpdateTimes(rank, now);
       
       if (this.state.currentRequest && this.state.currentRequest.rank === rank) {
           const idx = this.state.availableRequests.findIndex(r => r.rank === rank);
           if (idx !== -1) {
               this.state.availableRequests.splice(idx, 1);
               changed = true;
           }
           continue;
       }
       
       if (this.state.completedRequestDeadlines && this.state.completedRequestDeadlines[rank] === times.next) {
           const idx = this.state.availableRequests.findIndex(r => r.rank === rank);
           if (idx !== -1) {
               this.state.availableRequests.splice(idx, 1);
               changed = true;
           }
           continue;
       }

       const existingIdx = this.state.availableRequests.findIndex(r => r.rank === rank);
       if (existingIdx !== -1) {
           const existing = this.state.availableRequests[existingIdx];
           if (existing.deadline <= now) { 
               this.state.availableRequests[existingIdx] = this.createRandomRequest(rank, times.next);
               changed = true;
           }
       } else {
           this.state.availableRequests.push(this.createRandomRequest(rank, times.next));
           changed = true;
       }
    }

    if (changed) {
      this.saveState();
    }
  }
`;

code = code.replace(updateRegex, newUpdateMethod);
if (!code.includes('getUpdateTimes(')) {
   code = code.replace('public generateRequestsIfNeeded()', getUpdateTimesMethod + '\n  public generateRequestsIfNeeded()');
}

code = code.replace(/private createRandomRequest\(rank: RequestRank\): ClientRequest \{/g, "private createRandomRequest(rank: RequestRank, deadline: number): ClientRequest {");
code = code.replace(/deadline: Date.now\(\) \+ 24 \* 60 \* 60 \* 1000 \/\/ 1 day/g, "deadline");
code = code.replace(/deadline: Date.now\(\) \+ 12 \* 60 \* 60 \* 1000 \/\/ 12 hours/g, "deadline");
code = code.replace(/deadline: Date.now\(\) \+ 6 \* 60 \* 60 \* 1000 \/\/ 6 hours/g, "deadline");

const acceptRegex = /public acceptRequest\(reqId: string\) \{[\s\S]*?this\.saveState\(\);\n  \}/m;
const newAcceptMethod = `public acceptRequest(reqId: string) {
    const req = this.state.availableRequests.find(r => r.id === reqId);
    if (!req) return;
    this.state.currentRequest = req;
    this.state.availableRequests = this.state.availableRequests.filter(r => r.id !== reqId);
    if (this.state.tutorialStep === 3) this.advanceTutorial();
    this.saveState();
  }`;
code = code.replace(acceptRegex, newAcceptMethod);

const cancelRegex = /public cancelRequest\(\) \{[\s\S]*?this\.saveState\(\);\n  \}/m;
const newCancelMethod = `public cancelRequest() {
    if (!this.state.currentRequest) return;
    const rank = this.state.currentRequest.rank;
    
    if (this.state.clientAffection) {
        this.state.clientAffection[rank] = Math.max(1, (this.state.clientAffection[rank] || 1) - 1);
    }
    
    this.state.availableRequests.push(this.state.currentRequest);
    this.state.currentRequest = null;
    
    this.generateRequestsIfNeeded();
    this.saveState();
  }`;
code = code.replace(cancelRegex, newCancelMethod);

fs.writeFileSync('src/core/GameEngine.ts', code);
