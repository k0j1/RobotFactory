const fs = require('fs');
let code = fs.readFileSync('src/screens/CraftScreen.tsx', 'utf8');

// Factory theme for the screen wrapper
code = code.replace(
  '<div className="space-y-6">',
  '<div className="space-y-6 bg-stone-900 min-h-full p-4 rounded-xl border border-stone-800 shadow-inner relative overflow-hidden">\n      {/* Factory background grid/stripes */}\n      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 1) 25%, rgba(255, 255, 255, 1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 1) 25%, rgba(255, 255, 255, 1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 1) 76%, transparent 77%, transparent)", backgroundSize: "40px 40px" }}></div>'
);

// Fix tab styling for dark theme
code = code.replace(
  /\${tab === 'part' \? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}/g,
  "${tab === 'part' ? 'border-amber-500 text-amber-400 bg-stone-800' : 'border-transparent text-stone-500 hover:bg-stone-800'}"
);
code = code.replace(
  /\${tab === 'robot' \? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}/g,
  "${tab === 'robot' ? 'border-amber-500 text-amber-400 bg-stone-800' : 'border-transparent text-stone-500 hover:bg-stone-800'}"
);

// Modify availableMainMats.map and availableSubMats.map
function addAttributeToMatMap(searchCode, type) {
    const regex = new RegExp(`({available${type}Mats\\.map\\(mat => {[\\s\\S]*?return \\([\\s\\S]*?)<span className={\`text-\\[10px\\] font-bold text-center leading-tight w-full truncate \\\\?\\$\\{rStyle\\.text\\}\`}>([\\s\\S]*?)<\\/span>`, 'g');
    
    return searchCode.replace(regex, (match, before, spanInner) => {
        return `${before}<span className={\`text-[10px] font-bold text-center leading-tight w-full truncate \${rStyle.text}\`}>${spanInner}</span>
                        <div className="mt-1 w-full rounded border" style={{ backgroundColor: \`\${AttributeColors[mat.attribute]}22\`, borderColor: \`\${AttributeColors[mat.attribute]}55\`, color: AttributeColors[mat.attribute] }}>
                          <span className="text-[8px] font-bold text-center block w-full truncate">{AttributeNames[mat.attribute]}</span>
                        </div>`;
    });
}
code = addAttributeToMatMap(code, "Main");
code = addAttributeToMatMap(code, "Sub");

code = code.replace(/import { AttributeEffects } from '\.\.\/components\/effects\/AttributeEffects';/g, "import { AttributeEffects } from '../components/effects/AttributeEffects';\nimport { AttributeNames, AttributeColors } from '../core/models';");

// Make tabs look better
code = code.replace(
  '<div className="flex gap-2">',
  '<div className="flex gap-2 relative z-10">'
);

fs.writeFileSync('src/screens/CraftScreen.tsx', code);
