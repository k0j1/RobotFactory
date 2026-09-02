const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Layout.tsx', 'utf8');

code = code.replace("import { GameState } from '../../core/models';", "import { GameState } from '../../core/models';\nimport * as Gi from 'react-icons/gi';");

code = code.replace("const navItems = [", `const navItems = [
    { 
      id: 'dashboard', 
      label: '工房',
      icon: <Gi.GiFactory size={22} />,
      badge: (isQuestDone || totalPendingAutoDrops > 0 || isCraftDone || isStorageTaskDone) 
        ? (totalPendingAutoDrops > 0 ? (totalPendingAutoDrops > 99 ? '99+' : \`\${totalPendingAutoDrops}\`) : '!') 
        : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { 
      id: 'quest', 
      label: '遠征',
      icon: <Gi.GiWalkingScout size={22} />,
      badge: isQuestDone ? '完了' : undefined,
      badgeColor: 'bg-amber-500 text-white animate-bounce'
    },
    { 
      id: 'craft', 
      label: '製造',
      icon: <Gi.GiAnvil size={22} />,
      badge: isCraftDone ? '完了' : (state?.activePartCraft || state?.activeRobotAssembly ? '作成中' : undefined),
      badgeColor: isCraftDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'requests', label: '依頼', icon: <Gi.GiScrollUnfurled size={22} /> },
    { 
      id: 'storage', 
      label: '倉庫',
      icon: <Gi.GiCardboardBox size={22} />,
      badge: isStorageTaskDone ? '完了' : (isStorageTaskActive ? '解体中' : undefined),
      badgeColor: isStorageTaskDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'minigame', label: 'バトル', icon: <Gi.GiCrossedSwords size={22} /> },
  ]; // CUT`);

// cut the old navItems block
code = code.replace(/const navItems = \[[\s\S]*?\];\s*\/\/\s*CUT/, "const navItems_placeholder");
code = code.replace(/const navItems = \[[\s\S]*?\];/, ""); // old one
code = code.replace("const navItems_placeholder", `const navItems = [
    { 
      id: 'dashboard', 
      label: '工房',
      icon: <Gi.GiFactory size={22} />,
      badge: (isQuestDone || totalPendingAutoDrops > 0 || isCraftDone || isStorageTaskDone) 
        ? (totalPendingAutoDrops > 0 ? (totalPendingAutoDrops > 99 ? '99+' : \`\${totalPendingAutoDrops}\`) : '!') 
        : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { 
      id: 'quest', 
      label: '遠征',
      icon: <Gi.GiWalkingScout size={22} />,
      badge: isQuestDone ? '完了' : undefined,
      badgeColor: 'bg-amber-500 text-white animate-bounce'
    },
    { 
      id: 'craft', 
      label: '製造',
      icon: <Gi.GiAnvil size={22} />,
      badge: isCraftDone ? '完了' : (state?.activePartCraft || state?.activeRobotAssembly ? '作成中' : undefined),
      badgeColor: isCraftDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'requests', label: '依頼', icon: <Gi.GiScrollUnfurled size={22} /> },
    { 
      id: 'storage', 
      label: '倉庫',
      icon: <Gi.GiCardboardBox size={22} />,
      badge: isStorageTaskDone ? '完了' : (isStorageTaskActive ? '解体中' : undefined),
      badgeColor: isStorageTaskDone ? 'bg-amber-500 text-white animate-bounce' : 'bg-blue-500 text-white'
    },
    { id: 'minigame', label: 'バトル', icon: <Gi.GiCrossedSwords size={22} /> },
  ];`);

code = code.replace('<span className="text-amber-400 text-sm">💰</span>', '<Gi.GiCoins className="text-amber-400" size={16} />');

code = code.replace(
  `<nav className={\`\${theme.colors.surface} \${theme.shadow.lg} border-t \${theme.colors.border} fixed bottom-0 w-full \${theme.zIndex.nav}\`}>`,
  `<nav className={\`\${theme.colors.surface} \${theme.shadow.lg} border-t \${theme.colors.border} fixed bottom-0 w-full \${theme.zIndex.nav} pb-safe\`}>`
);

code = code.replace(
  `<div className="max-w-4xl mx-auto flex justify-around p-2 gap-1">`,
  `<div className="max-w-4xl mx-auto flex justify-around p-1.5 gap-1">`
);

code = code.replace(
  /className={`relative flex-1 py-3 text-center transition-colors \${theme.radius.md} \${activeView === item.id \? theme.colors.primary : 'hover:bg-stone-200'}`}/g,
  "className={`relative flex-1 py-1.5 flex flex-col items-center justify-center transition-colors ${theme.radius.md} ${activeView === item.id ? theme.colors.primary : 'hover:bg-stone-200'}`}"
);

code = code.replace(
  /<span className={`font-bold whitespace-nowrap \${activeView === item.id \? 'text-white' : theme.colors.textMuted}`}>{item.label}<\/span>/g,
  `<div className={activeView === item.id ? 'text-white' : theme.colors.textMuted}>{item.icon}</div>
              <span className={\`font-bold text-[10px] mt-0.5 whitespace-nowrap \${activeView === item.id ? 'text-white' : theme.colors.textMuted}\`}>{item.label}</span>`
);

code = code.replace(
  /absolute -top-1 right-1 h-4.5 min-w-\[1.25rem\] px-1 inline-flex items-center justify-center text-\[9px\]/g,
  "absolute top-0.5 right-1 h-4 min-w-[1rem] px-1 inline-flex items-center justify-center text-[8px]"
);

fs.writeFileSync('src/components/ui/Layout.tsx', code);
