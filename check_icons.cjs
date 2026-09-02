const gi = require('react-icons/gi');
const check = (name) => {
  if (gi[name]) console.log(`[OK] ${name}`);
  else console.log(`[MISSING] ${name}`);
}
['GiAnvil', 'GiFactory', 'GiSpanner', 'GiTreasureMap', 'GiWalkingScout', 'GiGears', 'GiAutomation', 'GiScrollUnfurled', 'GiCardboardBox', 'GiBackpack', 'GiCrossedSwords'].forEach(check);
