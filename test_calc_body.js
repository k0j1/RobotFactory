const calcBody = (leftX, rightX, topY) => {
  const dist = rightX - leftX;
  const vw = dist / 0.4;
  const vx = leftX - 0.3 * vw;
  const vy = topY - 0.38 * vw;
  return `${vx} ${vy} ${vw} ${vw}`;
};

// BodyStar2: left=80, right=220, top=35
console.log("BodyStar2:", calcBody(80, 220, 35));

// BodyStar2_2: left=85, right=215, top=32
console.log("BodyStar2_2:", calcBody(85, 215, 32));
