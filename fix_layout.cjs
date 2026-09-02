const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Layout.tsx', 'utf8');

const correctNavItems = `const navItems = [
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
  ];`;

// Just find the block starting with "const navItems =" up to the "];" and any trailing bad objects before "return ("
const cleanCode = code.replace(/const navItems = \[[\s\S]*?\];([\s\S]*?)return \(/, `${correctNavItems}\n\n  return (`);

fs.writeFileSync('src/components/ui/Layout.tsx', cleanCode);
