const TOTAL_WHITE_KEYS = 52;
const whiteKeyDefs = (() => {
  const notesBase = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const midiBase = [0, 2, 4, 5, 7, 9, 11]; // Cから始まる半音オフセット
  const keys = [];
  
  // A0, B0
  keys.push({ index: 0, hasBlackKey: true, name: 'A0', midi: 21 });
  keys.push({ index: 1, hasBlackKey: false, name: 'B0', midi: 23 });

  let currentOctave = 1;
  for (let i = 2; i < TOTAL_WHITE_KEYS; i++) {
    const offset = (i - 2) % 7;
    if (offset === 0 && i > 2) currentOctave++;
    const hasBlack = [0, 1, 3, 4, 5].includes(offset) && i !== TOTAL_WHITE_KEYS - 1;
    const noteLetter = notesBase[offset];
    const midi = (currentOctave + 1) * 12 + midiBase[offset];
    keys.push({ index: i, hasBlackKey: hasBlack, name: `${noteLetter}${currentOctave}`, midi });
  }
  return keys;
})();

console.log(whiteKeyDefs.slice(0, 5));
console.log(whiteKeyDefs.slice(-5));
