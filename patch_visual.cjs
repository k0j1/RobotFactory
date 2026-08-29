const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

// Replace PartVisual Comp selection
content = content.replace(
  /let Comp = null;[\s\S]*?const color =/m,
  `let Comp = null;
  const r = part.rarity || 1;
  if (part.type === 'head') Comp = (SVG_HEADS[r] && SVG_HEADS[r].length > 0) ? SVG_HEADS[r][part.visualIndex % SVG_HEADS[r].length] : SVG_HEADS[1][part.visualIndex % SVG_HEADS[1].length];
  else if (part.type === 'body') Comp = (SVG_BODIES[r] && SVG_BODIES[r].length > 0) ? SVG_BODIES[r][part.visualIndex % SVG_BODIES[r].length] : SVG_BODIES[1][part.visualIndex % SVG_BODIES[1].length];
  else if (part.type === 'arms') Comp = (SVG_ARMS[r] && SVG_ARMS[r].length > 0) ? SVG_ARMS[r][part.visualIndex % SVG_ARMS[r].length] : SVG_ARMS[1][part.visualIndex % SVG_ARMS[1].length];
  else if (part.type === 'legs') Comp = (SVG_LEGS[r] && SVG_LEGS[r].length > 0) ? SVG_LEGS[r][part.visualIndex % SVG_LEGS[r].length] : SVG_LEGS[1][part.visualIndex % SVG_LEGS[1].length];
  
  const color =`
);

// Replace RobotVisual Comp selection
content = content.replace(
  /const HeadComp = head \? SVG_HEADS\[head\.visualIndex % SVG_HEADS\?\.length\] : null;[\s\S]*?const LegsComp = legs \? SVG_LEGS\[legs\.visualIndex % SVG_LEGS\?\.length\] : null;/m,
  `const headR = head?.rarity || 1;
  const bodyR = body?.rarity || 1;
  const armsR = arms?.rarity || 1;
  const legsR = legs?.rarity || 1;

  const HeadComp = head ? ((SVG_HEADS[headR] && SVG_HEADS[headR].length > 0) ? SVG_HEADS[headR][head.visualIndex % SVG_HEADS[headR].length] : SVG_HEADS[1][head.visualIndex % SVG_HEADS[1].length]) : null;
  const BodyComp = body ? ((SVG_BODIES[bodyR] && SVG_BODIES[bodyR].length > 0) ? SVG_BODIES[bodyR][body.visualIndex % SVG_BODIES[bodyR].length] : SVG_BODIES[1][body.visualIndex % SVG_BODIES[1].length]) : null;
  const ArmsComp = arms ? ((SVG_ARMS[armsR] && SVG_ARMS[armsR].length > 0) ? SVG_ARMS[armsR][arms.visualIndex % SVG_ARMS[armsR].length] : SVG_ARMS[1][arms.visualIndex % SVG_ARMS[1].length]) : null;
  const LegsComp = legs ? ((SVG_LEGS[legsR] && SVG_LEGS[legsR].length > 0) ? SVG_LEGS[legsR][legs.visualIndex % SVG_LEGS[legsR].length] : SVG_LEGS[1][legs.visualIndex % SVG_LEGS[1].length]) : null;`
);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', content);
