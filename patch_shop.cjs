const fs = require('fs');
let code = fs.readFileSync('src/screens/ShopScreen.tsx', 'utf8');

if(!code.includes("import * as Gi from 'react-icons/gi'")) {
    code = code.replace("import { INTERIORS } from '../core/interiors';", "import { INTERIORS } from '../core/interiors';\nimport * as Gi from 'react-icons/gi';");
}

code = code.replace(/<span>💰<\/span>/g, '<span><Gi.GiCoins size={12}/></span>');
code = code.replace(/<span>➡️<\/span>/g, '<span><Gi.GiAnticlockwiseRotation size={10}/></span>'); 

fs.writeFileSync('src/screens/ShopScreen.tsx', code);
