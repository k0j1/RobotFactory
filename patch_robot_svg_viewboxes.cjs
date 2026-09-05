const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const replaceViewBox = (componentName, oldVB, newVB) => {
    const searchStr = `export const ${componentName} = ({ color, viewBox = "${oldVB}", className }: SVGProps) => {`;
    const replaceStr = `export const ${componentName} = ({ color, viewBox = "${newVB}", className }: SVGProps) => {`;
    if (content.includes(searchStr)) {
        content = content.replace(searchStr, replaceStr);
    } else {
        console.warn(`Could not find: ${searchStr}`);
    }
};

// Arms
replaceViewBox('ArmsStar2SVG', '0 0 64 64', '-18 -34 100 100');
replaceViewBox('ArmsStar2_2SVG', '0 0 300 300', '-75 -134 457 457');
replaceViewBox('ArmsStar2_3SVG', '0 0 300 300', '-137 -159 575 575');
replaceViewBox('ArmsStar2_4SVG', '0 0 300 300', '-187 -208 675 675');

// Body
replaceViewBox('BodyStar2SVG', '0 0 300 300', '-25 -98 350 350');
replaceViewBox('BodyStar2_2SVG', '0 0 300 300', '-12.5 -91.5 325 325');

// Legs
replaceViewBox('LegsStar2SVG', '0 0 300 300', '-130 -364 560 560');
replaceViewBox('LegsStar2_2SVG', '0 0 300 300', '-150 -385 600 600');
replaceViewBox('LegsStar2_3SVG', '0 0 300 300', '-290 -675 1000 1000');
replaceViewBox('LegsStar2_4SVG', '0 0 300 300', '-290 -678 1000 1000');

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
