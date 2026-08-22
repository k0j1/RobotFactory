const fs = require('fs');

class Canvas {
  constructor() {
    this.grid = Array(32).fill(0).map(() => Array(16).fill(' '));
  }
  rect(x, y, w, h) {
    for(let i=Math.floor(y); i<Math.floor(y+h); i++) {
      for(let j=Math.floor(x); j<Math.floor(x+w); j++) {
        if(i>=0 && i<32 && j>=0 && j<16) this.grid[i][j] = 'X';
      }
    }
  }
  emptyRect(x, y, w, h) {
    for(let i=Math.floor(y); i<Math.floor(y+h); i++) {
      for(let j=Math.floor(x); j<Math.floor(x+w); j++) {
        if(i>=0 && i<32 && j>=0 && j<16) this.grid[i][j] = ' ';
      }
    }
  }
  render() {
    let res = [];
    for(let i=0; i<32; i++) {
      let left = this.grid[i].join('');
      let right = left.split('').reverse().join('');
      res.push(`    "${left}${right}"`);
    }
    return `[\n${res.join(',\n')}\n  ]`;
  }
}

function genHead(rarity, index) {
  let c = new Canvas();
  if (rarity === 1) {
    let w = 3 + (index % 3);
    let h = 4 + (index % 4);
    let y = 11 - h;
    c.rect(16 - w, y, w, h);
    if (index % 2 === 0) c.emptyRect(16 - w + 1, y+1, w-1, 2); 
    if (index % 3 === 0) { c.rect(16 - 1, y-2, 1, 2); } // small antenna
  } else if (rarity === 2) {
    let w = 4 + (index % 4);
    let h = 5 + (index % 3);
    let y = 11 - h;
    c.rect(16 - w, y, w, h);
    c.rect(16 - w - 2, y + 2, 2, 3); 
    c.emptyRect(16 - w + 1, y+2, w-1, 2); 
    if (index % 2 === 0) c.rect(16 - 2, y - 3, 2, 3);
  } else {
    let w = 5 + (index % 3);
    let h = 6 + (index % 3);
    let y = 11 - h;
    c.rect(16 - w, y, w, h);
    c.rect(16 - w - 3, y - 2, 3, 5); // v-fin or horn
    c.rect(16 - 2, y - 4, 2, 4); 
    c.emptyRect(16 - w + 2, y+2, 2, 2); 
    if (index % 2 === 0) c.emptyRect(16 - 2, y+4, 2, 2); // mouth piece
  }
  return c.render();
}

function genBody(rarity, index) {
  let c = new Canvas();
  if (rarity === 1) {
    let w = 4 + (index % 3);
    let h = 8 + (index % 3);
    c.rect(16 - w, 11, w, h);
    if (index % 2 === 0) c.emptyRect(16-w+2, 13, w-3, 2); 
    c.rect(12, 11+h, 4, 21 - (11+h)); // fill gap to y=21
  } else if (rarity === 2) {
    let w = 5 + (index % 4);
    let h = 9 + (index % 2);
    c.rect(16 - w, 11, w, h);
    c.rect(16 - w - 2, 11, 2, 4); 
    c.emptyRect(16 - 2, 14, 2, 2); 
    c.rect(10, 11+h, 6, 21 - (11+h)); 
  } else {
    let w = 6 + (index % 3);
    let h = 10;
    c.rect(16 - w, 11, w, h);
    c.rect(16 - w + 2, 9, 3, 2); 
    c.rect(16 - w - 2, 12, 2, 5); 
    c.emptyRect(16 - 3, 14, 3, 3); 
    c.rect(8, 20, 8, 2); // pelvis
  }
  return c.render();
}

function genArms(rarity, index) {
  let c = new Canvas();
  if (rarity === 1) {
    let x = 3 + (index % 3);
    let w = 2 + (index % 2);
    let h = 7 + (index % 3);
    c.rect(x, 11, w, h);
    c.rect(x + w, 12, 16 - (x+w), 2); // joint
  } else if (rarity === 2) {
    let x = 2 + (index % 3);
    let w = 3;
    let h = 8 + (index % 4);
    c.rect(x, 11, w, h);
    c.rect(x - 1, 11, w + 2, 3); 
    if (index % 2 === 0) c.rect(x, 11+h, w+1, 3); 
    c.rect(x + w, 12, 16 - (x+w), 3); // joint
  } else {
    let x = 1 + (index % 2);
    let w = 4;
    let h = 10 + (index % 3);
    c.rect(x, 11, w, h);
    c.rect(x - 1, 10, w + 2, 5); 
    c.emptyRect(x + 1, 12, w - 2, 2); 
    if (index % 2 === 0) {
      c.rect(x+1, 11+h, 2, 4); 
    } else {
      c.rect(x-1, 11+h, w+2, 3); 
    }
    c.rect(x + w, 11, 16 - (x+w), 4); // joint
  }
  return c.render();
}

function genLegs(rarity, index) {
  let c = new Canvas();
  c.rect(12, 20, 4, 2); // pelvis joint
  if (rarity === 1) {
    let w = 2 + (index % 2);
    let x = 16 - 5 - (index % 3);
    c.rect(x, 21, w, 8);
    c.rect(x-1, 29, w+2, 2); 
  } else if (rarity === 2) {
    if (index % 2 === 0) { 
      let w = 6 + (index % 3);
      c.rect(16 - w, 24, w, 6);
      c.emptyRect(16 - w + 2, 26, w - 4, 2);
      c.rect(16 - 4, 21, 4, 3); // connect to tracks
    } else {
      let w = 3;
      let x = 16 - 6 - (index % 2);
      c.rect(x, 21, w, 8);
      c.rect(x-2, 29, w+4, 3); 
    }
  } else {
    if (index % 2 === 0) { 
      let w = 7 + (index % 2);
      c.rect(16 - w, 23, w, 4);
      c.rect(16 - w + 2, 27, w - 2, 3);
      c.emptyRect(16 - w + 4, 29, 2, 1);
      c.rect(16 - 3, 21, 3, 2); // hover joint
    } else { 
      let w = 4;
      let x = 16 - 7 - (index % 2);
      c.rect(x, 21, w, 6);
      c.rect(x-1, 27, w+2, 3); 
      c.rect(x-2, 30, w+4, 2); 
    }
  }
  return c.render();
}

let heads = [];
let bodies = [];
let arms = [];
let legs = [];
for(let r=1; r<=3; r++) {
  for(let i=0; i<8; i++) {
    heads.push(genHead(r, i));
    bodies.push(genBody(r, i));
    arms.push(genArms(r, i));
    legs.push(genLegs(r, i));
  }
}
let out = `// 32x32 pixel art parts, 8 variants per rarity (24 total per part)
export const HEADS = [
${heads.join(',\n')}
];
export const BODIES = [
${bodies.join(',\n')}
];
export const ARMS = [
${arms.join(',\n')}
];
export const LEGS = [
${legs.join(',\n')}
];
`;
fs.writeFileSync('src/core/pixelArt.ts', out);
console.log("Done");
