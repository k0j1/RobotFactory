const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const replaceViewBox = (componentName, newVB) => {
    // Regex to match the export line with viewBox
    const regex = new RegExp(`(export const ${componentName} = \\(\\{ color, viewBox = ")[^"]+(")(, className \\}: SVGProps\\) => \\{)`);
    if (regex.test(content)) {
        content = content.replace(regex, `$1${newVB}$2$3`);
        console.log(`Updated ${componentName} to ${newVB}`);
    } else {
        console.warn(`Could not find regex match for: ${componentName}`);
    }
};

// Fix Bodies
replaceViewBox('BodyStar2SVG', '-100 -155 500 500');
replaceViewBox('BodyStar2_2SVG', '-100 -155 500 500');

// Fix Legs
replaceViewBox('LegsStar2SVG', '-150 -295 600 600');
replaceViewBox('LegsStar2_2SVG', '-150 -295 600 600');
replaceViewBox('LegsStar2_3SVG', '-150 -295 600 600');
replaceViewBox('LegsStar2_4SVG', '-150 -295 600 600');

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
