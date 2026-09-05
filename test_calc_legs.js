const calcLegs = (leftX, rightX, topY) => {
  const dist = rightX - leftX;
  const vw = dist / 0.2;
  const vx = leftX - 0.4 * vw;
  const vy = topY - 0.70 * vw;
  return `${vx} ${vy} ${vw} ${vw}`;
};

// LegsStar2: left=94, right=206, top=28
console.log("LegsStar2:", calcLegs(94, 206, 28));

// Let's check LegsStar2PixelSVG just in case
// LegsStar2PixelSVG is 32x32.
