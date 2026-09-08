const { LA_CAMPANELLA_RAW_NOTES } = require('./src/components/minigames/laCampanellaData.ts');
let min = 127;
let max = 0;
LA_CAMPANELLA_RAW_NOTES.forEach(g => {
  g.midi.forEach(m => {
    if (m < min) min = m;
    if (m > max) max = m;
  });
});
console.log("Min MIDI:", min, "Max MIDI:", max);
