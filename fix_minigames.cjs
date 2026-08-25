const fs = require('fs');

// 1. Shared.ts
let shared = fs.readFileSync('src/components/minigames/Shared.ts', 'utf8');
shared = shared.replace(
  /onFinish: \(result: 'win' \| 'lose' \| 'draw'\) => void;/g,
  "onFinish: (result: 'win' | 'lose' | 'draw') => void;\n  speed: number;\n  isPaused: boolean;\n  isFinished: boolean;"
);
fs.writeFileSync('src/components/minigames/Shared.ts', shared);

// 2. Games
const games = [
  'src/components/minigames/OthelloGame.tsx',
  'src/components/minigames/ConnectFourGame.tsx',
  'src/components/minigames/ChessGame.tsx',
  'src/components/minigames/TicTacToeGame.tsx'
];

games.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  content = content.replace(
    /\{ activeRobot, activeOpponent, onFinish \}/g,
    "{ activeRobot, activeOpponent, onFinish, speed, isPaused, isFinished }"
  );

  content = content.replace(
    /useEffect\(\(\) => \{\n\s*const timer = setTimeout\(\(\) => \{/g,
    "useEffect(() => {\n    if (isFinished || isPaused) return;\n    const timer = setTimeout(() => {"
  );

  content = content.replace(
    /\}, 800\);/g,
    "}, Math.floor(800 / speed));"
  );

  content = content.replace(
    /\}, \[board, turn\]\);/g,
    "}, [board, turn, isPaused, isFinished, speed]);"
  );

  fs.writeFileSync(f, content);
});

// 3. MinigameScreen.tsx
let screen = fs.readFileSync('src/screens/MinigameScreen.tsx', 'utf8');

screen = screen.replace(
  /const \[battleResult, setBattleResult\] = useState\<'win' \| 'lose' \| 'draw' \| null\>\(null\);/,
  "const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);\n  const [speed, setSpeed] = useState(1);\n  const [isPaused, setIsPaused] = useState(false);"
);

screen = screen.replace(
  /setIsBattleActive\(true\);\n\s*setBattleResult\(null\);/,
  "setIsBattleActive(true);\n    setBattleResult(null);\n    setIsPaused(false);\n    setSpeed(1);"
);

const gameTags = ['OthelloGame', 'ConnectFourGame', 'ChessGame', 'TicTacToeGame'];
gameTags.forEach(tag => {
  screen = screen.replace(
    new RegExp(`<${tag} activeRobot=\\{activeRobot\\} activeOpponent=\\{activeOpponent\\} onFinish=\\{handleFinish\\} />`, 'g'),
    `<${tag} activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} />`
  );
});

screen = screen.replace(
  /\{renderGame\(\)\}\n\s*<\/div>\n\s*<div className="text-center mt-6">/,
  `{renderGame()}
          </div>
          
          {isBattleActive && !battleResult && (
            <div className="flex justify-center gap-2 mt-4 mb-4">
              <Button onClick={() => setIsPaused(!isPaused)} className="w-32 text-sm">
                {isPaused ? '▶ 再開' : '⏸ 一時停止'}
              </Button>
              <Button onClick={() => setSpeed(1)} className={\`w-14 \${speed === 1 ? 'ring-2 ring-primary' : 'opacity-70 bg-stone-300 text-stone-700'}\`}>1x</Button>
              <Button onClick={() => setSpeed(2)} className={\`w-14 \${speed === 2 ? 'ring-2 ring-primary' : 'opacity-70 bg-stone-300 text-stone-700'}\`}>2x</Button>
              <Button onClick={() => setSpeed(3)} className={\`w-14 \${speed === 3 ? 'ring-2 ring-primary' : 'opacity-70 bg-stone-300 text-stone-700'}\`}>3x</Button>
            </div>
          )}

          <div className="text-center mt-6">`
);

fs.writeFileSync('src/screens/MinigameScreen.tsx', screen);

// 4. Update versions and Litepaper
['src/screens/TitleScreen.tsx', 'src/components/ui/Layout.tsx', 'src/screens/LitepaperScreen.tsx'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/v1\.0\.50/g, 'v1.0.51');
  fs.writeFileSync(f, content);
});

let lp = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf8');
lp = lp.replace(/勝利で報酬を獲得できます。<\/li>/, "勝利で報酬を獲得できます。対戦中は一時停止や倍速（2倍・3倍）進行が可能です。</li>");
fs.writeFileSync('src/screens/LitepaperScreen.tsx', lp);

console.log("Done");
