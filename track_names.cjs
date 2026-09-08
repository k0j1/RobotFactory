const fs = require('fs');
const { Midi } = require('@tonejs/midi');

const midiData = fs.readFileSync('/tmp/campanella.mid');
const midi = new Midi(midiData);
console.log(midi.name);
midi.tracks.forEach(t => {
  console.log(t.name);
});
