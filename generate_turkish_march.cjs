const fs = require('fs');
const notes = [];
let time = 0;
const bpm = 120;
const beat = 60000 / bpm; // 500ms
const sixteenth = beat / 4; // 125ms
const eighth = beat / 2; // 250ms
const quarter = beat; // 500ms

function addNote(midiArr, duration, delayAfter = duration) {
  notes.push({ time: Math.round(time), midi: midiArr, duration: Math.round(duration) });
  time += delayAfter;
}

// Turkish March Theme (Rondo Alla Turca) - A minor / C major
// Anacrusis
addNote([71], sixteenth); // B4
addNote([69], sixteenth); // A4
addNote([72], eighth);    // G#4
addNote([71], eighth);    // A4
addNote([72], quarter);   // C5
addNote([74], sixteenth); // D5
addNote([72], sixteenth); // C5
addNote([71], eighth);    // B4
addNote([69], eighth);    // A4
addNote([71], quarter);   // E5
addNote([76], sixteenth); // E5
addNote([74], sixteenth); // D5
addNote([72], eighth);    // C5
addNote([71], eighth);    // B4
addNote([69], quarter);   // A4

time = 0;
notes.length = 0;

function addSequence(seq) {
    for(let note of seq) {
        if(note.delay !== undefined) {
             addNote(note.midi, note.dur, note.delay);
        } else {
             addNote(note.midi, note.dur);
        }
    }
}

// Part A: A minor
const partA = [
    {midi: [71], dur: sixteenth}, {midi: [69], dur: sixteenth},
    {midi: [68, 57], dur: eighth}, {midi: [69], dur: eighth},
    {midi: [72, 60], dur: quarter, delay: quarter},
    
    {midi: [74], dur: sixteenth}, {midi: [72], dur: sixteenth},
    {midi: [71, 59], dur: eighth}, {midi: [72], dur: eighth},
    {midi: [76, 64], dur: quarter, delay: quarter},
    
    {midi: [81], dur: sixteenth}, {midi: [79], dur: sixteenth},
    {midi: [77, 69], dur: eighth}, {midi: [76], dur: eighth},
    {midi: [74, 62], dur: eighth}, {midi: [72], dur: eighth},
    {midi: [71, 59], dur: eighth}, {midi: [69], dur: eighth},
    {midi: [69, 57], dur: quarter, delay: quarter}
];
// Repeat Part A
addSequence(partA);
addSequence(partA);

// Part B: C major
const partB = [
    {midi: [76], dur: sixteenth}, {midi: [74], dur: sixteenth},
    {midi: [72, 60], dur: eighth}, {midi: [74], dur: eighth},
    {midi: [76, 64], dur: quarter, delay: quarter},
    
    {midi: [79], dur: sixteenth}, {midi: [77], dur: sixteenth},
    {midi: [76, 60], dur: eighth}, {midi: [77], dur: eighth},
    {midi: [79, 67], dur: quarter, delay: quarter},
    
    {midi: [81], dur: sixteenth}, {midi: [79], dur: sixteenth},
    {midi: [77, 69], dur: eighth}, {midi: [76], dur: eighth},
    {midi: [74, 62], dur: eighth}, {midi: [72], dur: eighth},
    {midi: [71, 59], dur: eighth}, {midi: [69], dur: eighth},
    {midi: [69, 57], dur: quarter, delay: quarter}
];
addSequence(partB);
addSequence(partB);

// Part C: A major (The famous loud part)
const partC = [];
for (let rep = 0; rep < 2; rep++) {
    // Bar 1
    partC.push(
        {midi: [81, 77, 73, 69], dur: eighth, delay: eighth}, // A major chord
        {midi: [69, 57], dur: eighth},
        {midi: [81, 77, 73, 69], dur: eighth, delay: eighth},
        {midi: [69, 57], dur: eighth},
        
        {midi: [81, 77, 73, 69], dur: eighth, delay: eighth},
        {midi: [69, 57], dur: eighth},
        {midi: [79, 76, 71, 67], dur: eighth, delay: eighth},
        {midi: [67, 55], dur: eighth}
    );
    // Bar 2
    partC.push(
        {midi: [78, 74, 71, 66], dur: eighth, delay: eighth},
        {midi: [66, 54], dur: eighth},
        {midi: [78, 74, 71, 66], dur: eighth, delay: eighth},
        {midi: [66, 54], dur: eighth},
        
        {midi: [78, 74, 71, 66], dur: eighth, delay: eighth},
        {midi: [66, 54], dur: eighth},
        {midi: [76, 73, 69, 64], dur: eighth, delay: eighth},
        {midi: [64, 52], dur: eighth}
    );
    // Bar 3
    partC.push(
        {midi: [81, 77, 73, 69], dur: eighth, delay: eighth},
        {midi: [69, 57], dur: eighth},
        {midi: [81, 77, 73, 69], dur: eighth, delay: eighth},
        {midi: [69, 57], dur: eighth},
        
        {midi: [81, 77, 73, 69], dur: eighth, delay: eighth},
        {midi: [69, 57], dur: eighth},
        {midi: [79, 76, 71, 67], dur: eighth, delay: eighth},
        {midi: [67, 55], dur: eighth}
    );
    // Bar 4
    partC.push(
        {midi: [78, 74, 71, 66], dur: eighth, delay: eighth},
        {midi: [66, 54], dur: eighth},
        {midi: [78, 74, 71, 66], dur: eighth, delay: eighth},
        {midi: [66, 54], dur: eighth},
        
        {midi: [78, 74, 71, 66], dur: quarter, delay: quarter},
        {midi: [69, 57], dur: quarter, delay: quarter} // A major chord end
    );
}
addSequence(partC);

fs.writeFileSync('src/components/minigames/turkishMarchData.ts', 
  `export interface RawPianoNote { time: number; midi: number[]; duration: number; }
export const TURKISH_MARCH_RAW_NOTES: RawPianoNote[] = ${JSON.stringify(notes, null, 2)};`
);
