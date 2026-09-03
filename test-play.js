import Soundfont from 'soundfont-player';
import { AudioContext } from 'standardized-audio-context-mock';

const ac = new AudioContext();
Soundfont.instrument(ac, 'acoustic_grand_piano').then(inst => {
  console.log(inst.play.toString());
});
