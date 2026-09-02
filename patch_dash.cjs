const fs = require('fs');
let code = fs.readFileSync('src/screens/Dashboard.tsx', 'utf8');

if(!code.includes("import * as Gi from 'react-icons/gi'")) {
    code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport * as Gi from 'react-icons/gi';");
}

code = code.replace(/🤖 自動探索へ派遣/g, '<Gi.GiWalkingScout className="inline mr-1" /> 自動探索へ派遣');
code = code.replace(/🔍 探索中/g, '<Gi.GiTreasureMap className="inline mr-1" /> 探索中');
code = code.replace(/📦 回収/g, '<Gi.GiCardboardBox className="inline mr-1" /> 回収');
code = code.replace(/🔧/g, '<Gi.GiSpanner className="inline mr-1" />');

code = code.replace(/span>修理して再開/g, 'span>修理して再開');

fs.writeFileSync('src/screens/Dashboard.tsx', code);
