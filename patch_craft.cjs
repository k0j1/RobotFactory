const fs = require('fs');
let code = fs.readFileSync('src/screens/CraftScreen.tsx', 'utf8');

// Ensure import * as Gi
if(!code.includes("import * as Gi from 'react-icons/gi'")) {
    code = code.replace("import { MaterialIcon } from '../components/ui/MaterialIcon';", "import { MaterialIcon } from '../components/ui/MaterialIcon';\nimport * as Gi from 'react-icons/gi';");
}

// 1. Factory Theme Wrapper
// Look for `<div className="space-y-5">` around line 261 which wraps the Part Crafting section.
// No wait, the user wants the WHOLE crafting screen to look like a factory.

// The easiest way is to add a wrapper or replace Card classes.
code = code.replace(/<Card className="mb-4">/g, '<div className="mb-4 bg-stone-900 border-2 border-stone-700 shadow-2xl rounded-xl p-4 overflow-hidden relative">');
code = code.replace(/<\/Card>/g, '</div>');

code = code.replace(/<h3 className={\`\$\{theme.typography.h3\} text-stone-700\`}>工場<\/h3>/, 
  `<h3 className={\`\$\{theme.typography.h3\} text-stone-200 flex items-center gap-2 mb-2\`}>
    <Gi.GiFactory className="text-amber-500" />
    <span className="tracking-widest">第壱組み立てプラント</span>
  </h3>
  <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)]"></div>
  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)]"></div>`);

code = code.replace(/<h3 className={\`\$\{theme.typography.h3\} mb-2\`}>/g, '<h3 className={`${theme.typography.h3} text-stone-200 mb-2`}>');

// Single row status for part selection:
// Replace the block from `bg-stone-50 border-2 border-stone-200 rounded-lg p-3`
code = code.replace(
  '<div className="bg-stone-50 border-2 border-stone-200 rounded-lg p-3">',
  '<div className="bg-stone-950 border border-stone-700 rounded-lg p-2 shadow-inner">'
);
code = code.replace('<h4 className="font-bold text-xs text-stone-700">', '<h4 className="font-bold text-xs text-amber-500 mb-1 flex items-center gap-1"><Gi.GiNetworkBars /> ');

code = code.replace('<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">', '<div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-stretch">');

code = code.replace(
  /className={`relative p-2.5 rounded-lg border-2 text-left transition-all \${[\s\S]*?isSelected[\s\S]*?\? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 shadow-sm'[\s\S]*?: 'border-stone-200 bg-white hover:border-stone-300'[\s\S]*?}`}/g,
  "className={`relative p-2 rounded border text-left transition-all flex-1 min-w-[120px] shrink-0 flex flex-col justify-between ${isSelected ? 'border-amber-500 bg-stone-800 ring-1 ring-amber-400 shadow-sm' : 'border-stone-700 bg-stone-900 hover:border-stone-500 hover:bg-stone-800'}`}"
);

code = code.replace(/<span className="font-bold text-sm text-stone-800 whitespace-nowrap">/g, '<span className="font-bold text-xs text-stone-300 whitespace-nowrap flex items-center gap-1"><Gi.GiCog /> ');

code = code.replace(
  /<span className="text-\[10px\] text-stone-400 whitespace-nowrap leading-none">待機中<\/span>/g,
  '<span className="text-[9px] text-stone-500 whitespace-nowrap leading-none font-mono">IDLE</span>'
);

code = code.replace(
  /<span className="text-emerald-700 font-bold">✨ 受取可能<\/span>/g,
  '<span className="text-emerald-400 font-bold">✨ READY</span>'
);

code = code.replace(
  /<span className="text-blue-700 font-bold font-mono">/g,
  '<span className="text-blue-400 font-bold font-mono text-[9px]">'
);

// Part materials (Material selectors)
// Change headers
code = code.replace(/<h4 className="font-bold text-stone-700 text-sm">/g, '<h4 className="font-bold text-stone-300 text-sm">');
code = code.replace(/<p className="text-stone-500 col-span-full text-xs">/g, '<p className="text-stone-500 col-span-full text-xs font-mono">WARNING: INSUFFICIENT MATERIALS</p>');

fs.writeFileSync('src/screens/CraftScreen.tsx', code);
