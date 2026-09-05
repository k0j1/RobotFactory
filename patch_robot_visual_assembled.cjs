const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

const target1 = `<LegsComp 
              color={legsColor} 
              viewBox={
                legsR === 2 ? "-150 -295 600 600" : "0 0 100 100"
              } 
              className="w-full h-full" 
            />`;
const replace1 = `<LegsComp color={legsColor} className="w-full h-full" />`;
content = content.replace(target1, replace1);

const target2 = `<BodyComp color={bodyColor} viewBox={bodyR === 2 ? "-150 -130 600 600" : "0 0 100 100"} className="w-full h-full" />`;
const replace2 = `<BodyComp color={bodyColor} className="w-full h-full" />`;
content = content.replace(target2, replace2);

const target3 = `<ArmsComp color={armsColor} viewBox={armsR === 2 ? ((arms?.visualIndex || 0) > 0 ? "0 0 300 300" : "0 0 64 64") : "0 0 100 100"} className="w-full h-full" />`;
const replace3 = `<ArmsComp color={armsColor} className="w-full h-full" />`;
content = content.replace(target3, replace3);

const target4 = `<HeadComp color={headColor} viewBox={headR === 3 ? "-122 -30 500 500" : headR === 2 ? "-64 -3 192 192" : "0 0 100 100"} className="w-full h-full" />`;
const replace4 = `<HeadComp color={headColor} className="w-full h-full" />`;
content = content.replace(target4, replace4);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', content);
