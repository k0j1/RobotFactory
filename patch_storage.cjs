const fs = require('fs');
let code = fs.readFileSync('src/screens/StorageScreen.tsx', 'utf8');

if(!code.includes("import * as Gi from 'react-icons/gi'")) {
    code = code.replace("import { RepairAnimationModal } from '../components/effects/RepairAnimationModal';", "import { RepairAnimationModal } from '../components/effects/RepairAnimationModal';\nimport * as Gi from 'react-icons/gi';");
}

code = code.replace(/🤖 ロボット/g, '<Gi.GiRobotGolem className="inline mr-1" size={16} /> ロボット');
code = code.replace(/🛠️ パーツ/g, '<Gi.GiCog className="inline mr-1" size={16} /> パーツ');
code = code.replace(/💎 素材/g, '<Gi.GiOre className="inline mr-1" size={16} /> 素材');

// There's also 📊 レーダー
code = code.replace(/📊 レーダー/g, '<Gi.GiRadarDish className="inline mr-1" size={16} /> レーダー');

fs.writeFileSync('src/screens/StorageScreen.tsx', code);
