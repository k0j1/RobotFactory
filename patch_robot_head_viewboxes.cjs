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

// Heads Star 2
['HeadStar2SVG', 'HeadStar2_2SVG', 'HeadStar2_3SVG', 'HeadStar2_4SVG'].forEach(c => {
    replaceViewBox(c, '0 0 64 64', '-64 -3 192 192');
});

// Heads Star 3
['HeadStar3SVG', 'HeadStar3_2SVG', 'HeadStar3_3SVG'].forEach(c => {
    replaceViewBox(c, '0 0 256 256', '-122 -30 500 500');
});

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
