const fs = require('fs');
let code = fs.readFileSync('src/screens/RequestScreen.tsx', 'utf-8');

// Display affection in availableRequests
code = code.replace(
    /<Badge className=\{req.rank === 'King' \? 'bg-amber-200 text-amber-800' : req.rank === 'Noble' \? 'bg-purple-200 text-purple-800' : 'bg-stone-200'\}>\s*\{req.clientName\}\s*<\/Badge>/m,
    `$& <span className="text-xs text-rose-500 font-bold ml-2">好感度: {state.clientAffection?.[req.rank] || 1}/10</span>`
);

// Display affection in currentRequest
code = code.replace(
    /<Badge className=\{state.currentRequest.rank === 'King' \? 'bg-amber-200 text-amber-800' : state.currentRequest.rank === 'Noble' \? 'bg-purple-200 text-purple-800' : 'bg-stone-200'\}>\s*\{state.currentRequest.clientName\}\s*<\/Badge>/m,
    `$& <span className="text-xs text-rose-500 font-bold ml-2">好感度: {state.clientAffection?.[state.currentRequest.rank] || 1}/10</span>`
);

// Display message if no requests
code = code.replace(
    /\{state\.availableRequests\.map/m,
    `{state.availableRequests.length === 0 && <p className="text-stone-500 text-center py-4">現在受注できる依頼はありません。更新をお待ちください。</p>}\n            {state.availableRequests.map`
);

fs.writeFileSync('src/screens/RequestScreen.tsx', code);
