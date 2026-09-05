const calc = (leftX, rightX, y) => {
  const dist = rightX - leftX;
  const vw = dist / 0.4;
  const vx = leftX - 0.3 * vw;
  const vy = y - 0.42 * vw;
  return `${vx} ${vy} ${vw} ${vw}`;
};
// Star2_2: left shoulder 75, right 285 (before trans). Let's say we remove trans.
console.log("Star2_2:", calc(75, 285, 48));

// Star2_3: left center 65, right center 295
console.log("Star2_3:", calc(65, 295, 48));

// Star2_4: left shoulder 75, right shoulder 345
console.log("Star2_4:", calc(75, 345, 45));

