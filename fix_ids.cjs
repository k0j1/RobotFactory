const fs = require('fs');

let dataTs = fs.readFileSync('src/core/data.ts', 'utf-8');
dataTs = dataTs.replace(/"m_([efwald])([1-3])"/g, '"m_$1$2_1"');
fs.writeFileSync('src/core/data.ts', dataTs);

let interiorsTs = fs.readFileSync('src/core/interiors.ts', 'utf-8');
interiorsTs = interiorsTs.replace(/'m_([efwald])([1-3])'/g, "'m_$1$2_1'");
fs.writeFileSync('src/core/interiors.ts', interiorsTs);
