const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');
content = content.replace(/fill=\{pal\.accent\}/g, 'fill={pal.solidAccent}');
fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
