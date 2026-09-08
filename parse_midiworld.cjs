const fs = require('fs');
const { Midi } = require('@tonejs/midi');

const midiData = fs.readFileSync('/tmp/campanella_midiworld.mid');
const midi = new Midi(midiData);

console.log("Name:", midi.name);
const notes = [];
midi.tracks.forEach((t, i) => {
  console.log(`Track ${i} notes: ${t.notes.length}`);
  t.notes.forEach(n => {
    notes.push({
      time: Math.round(n.time * 1000),
      midi: n.midi,
      duration: Math.round(n.duration * 1000)
    });
  });
});
console.log("First few notes:", notes.slice(0, 10));
