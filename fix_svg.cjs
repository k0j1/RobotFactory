const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

// Replace viewBox={viewBox} with viewBox="0 0 32 32" for HeadStar2SVG
content = content.replace(
  /export const HeadStar2SVG[\s\S]*?<svg[^>]+>/m,
  `export const HeadStar2SVG = ({ color, className }: SVGProps) => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 32 36" className={className} shapeRendering="crispEdges">`
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
