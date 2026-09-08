const fs = require('fs');
const { Midi } = require('@tonejs/midi');

const midiData = fs.readFileSync('/tmp/campanella_midiworld.mid');
const midi = new Midi(midiData);

const notes = [];
midi.tracks.forEach(t => {
  t.notes.forEach(n => {
    notes.push({
      time: Math.round(n.time * 1000),
      midi: n.midi,
      duration: Math.round(n.duration * 1000)
    });
  });
});

notes.sort((a, b) => a.time - b.time);

const groupedNotes = [];
if (notes.length > 0) {
  let currentGroup = { time: notes[0].time, midi: [notes[0].midi], duration: notes[0].duration };
  
  for (let i = 1; i < notes.length; i++) {
    const n = notes[i];
    // Group notes within 40ms of each other
    if (Math.abs(n.time - currentGroup.time) < 40) {
      if (!currentGroup.midi.includes(n.midi)) {
        currentGroup.midi.push(n.midi);
      }
      currentGroup.duration = Math.max(currentGroup.duration, n.duration);
    } else {
      groupedNotes.push(currentGroup);
      currentGroup = { time: n.time, midi: [n.midi], duration: n.duration };
    }
  }
  groupedNotes.push(currentGroup);
}

// Adjust the first note to start at time 0
const startTime = groupedNotes[0].time;
groupedNotes.forEach(g => {
  g.time -= startTime;
});

// Since the file is 3000 notes, we need to limit the output formatting 
// so the TS compiler doesn't choke, though standard TS array is fine.
const output = `// Liszt: La Campanella (Paganini Etude No. 3)
// Full 10-page piece transcribed from standard MIDI

export interface RawPianoNote {
  time: number;
  midi: number[];
  duration: number;
}

export const LA_CAMPANELLA_RAW_NOTES: RawPianoNote[] = ${JSON.stringify(groupedNotes, null, 0)};
`;

fs.writeFileSync('src/components/minigames/laCampanellaData.ts', output);
console.log("Total unique grouped notes:", groupedNotes.length);
console.log("Last note time:", groupedNotes[groupedNotes.length-1].time);
