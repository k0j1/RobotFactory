const fs = require('fs');
let code = fs.readFileSync('src/screens/TitleScreen.tsx', 'utf8');

if(!code.includes("import * as Gi from 'react-icons/gi'")) {
    code = code.replace("import { Button } from '../components/ui/core';", "import { Button } from '../components/ui/core';\nimport * as Gi from 'react-icons/gi';");
}

code = code.replace('v1.0.123', 'v1.0.124');

code = code.replace('<div className="absolute top-10 left-10 opacity-20 text-6xl">⚙️</div>', '<Gi.GiGears className="absolute top-10 left-10 opacity-20 text-6xl" />');
code = code.replace('<div className="absolute bottom-20 right-10 opacity-20 text-6xl">🔧</div>', '<Gi.GiSpanner className="absolute bottom-20 right-10 opacity-20 text-6xl" />');
code = code.replace('<div className="absolute top-1/4 right-1/4 opacity-10 text-8xl">🤖</div>', '<Gi.GiRobotGolem className="absolute top-1/4 right-1/4 opacity-10 text-8xl" />');

fs.writeFileSync('src/screens/TitleScreen.tsx', code);
