const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const replaceViewBox = (componentName, newVB) => {
    const regex = new RegExp(`(export const ${componentName} = \\(\\{ color, viewBox = ")[^"]+(")(, className \\}: SVGProps\\) => \\{)`);
    if (regex.test(content)) {
        content = content.replace(regex, `$1${newVB}$2$3`);
        console.log(`Updated ${componentName} to ${newVB}`);
    } else {
        console.warn(`Could not find regex match for: ${componentName}`);
    }
};

['HeadStar2SVG', 'HeadStar2_2SVG', 'HeadStar2_3SVG', 'HeadStar2_4SVG'].forEach(c => {
    replaceViewBox(c, '-64 -24 192 192');
});

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
