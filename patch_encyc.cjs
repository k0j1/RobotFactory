const fs = require('fs');
let code = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf8');

code = code.replace("import { FaRobot, FaBox, FaWrench, FaShoePrints, FaStar } from 'react-icons/fa';", "import * as Gi from 'react-icons/gi';");
code = code.replace(/<FaStar/g, '<Gi.GiStarFormation');
code = code.replace(/<FaRobot/g, '<Gi.GiMechaHead');
code = code.replace(/<FaBox/g, '<Gi.GiChestArmor');
code = code.replace(/<FaWrench/g, '<Gi.GiMechanicalArm');
code = code.replace(/<FaShoePrints/g, '<Gi.GiLegArmor');

fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', code);
