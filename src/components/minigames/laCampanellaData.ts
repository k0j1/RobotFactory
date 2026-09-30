// Franz Liszt: Grandes études de Paganini, S. 141 No. 3 'La Campanella' in G-sharp Minor
// Authentic complete concert score directly adhering to pianoclassics.net (ID 110) / MuseScore 4426976
// Full authentic concert score of all 140 measures across all 10 pages
// Dedicated dual-hand dynamics (RH vs LH independent velocities, stereo acoustic balance & voicing)
// Right hand sparkling high bell leaps (leggiero & marcatissimo) vs Left hand deep bass octave chords & singing melody

export interface RawPianoNote {
  time: number;
  midi: number[];
  duration: number;
  dynamics?: string;
  velocity?: number;
  hands?: string[];
  velocities?: number[];
  rhDynamics?: string;
  lhDynamics?: string;
}

const PART_1: RawPianoNote[] = [
  {
    "time": 0,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 319,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 638,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 957,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 1277,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 1596,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 1915,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 2234,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 2553,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 2872,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 3191,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 3511,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 3830,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 4149,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 4468,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 4787,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 5106,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 5426,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 5745,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 6064,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 6383,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.92,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 6702,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7021,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7181,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7340,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7660,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 7979,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 8138,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 8298,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 8457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 8617,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 8777,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 8936,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 9096,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 9255,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 9415,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 9574,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "p",
    "velocity": 0.64,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58,
      0.58,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 9734,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 9894,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 10053,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 10213,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 10372,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 10532,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 10691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 10851,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11011,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11170,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11489,
    "midi": [
      51,
      56,
      59,
      71
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.59,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.63,
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11649,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11808,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 11968,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 12128,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 12287,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 12447,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 12606,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 12766,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 12926,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 13085,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 13245,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 13404,
    "midi": [
      51,
      55,
      58,
      61,
      70
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.59,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.63,
      0.58,
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 13564,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 13723,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 13883,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 14043,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 14202,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 14362,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 14521,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 14681,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 14840,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15000,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15160,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15319,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15479,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15638,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15798,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 15957,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 16117,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 16277,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 16436,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 16596,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 16755,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 16915,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 17074,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 17234,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "p",
    "velocity": 0.64,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58,
      0.58,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 17394,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 17553,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 17713,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 17872,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18032,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18191,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18351,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18511,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18670,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18830,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 18989,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 19149,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 19468,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 19628,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 19787,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 19947,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 20106,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 20426,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 20585,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 20745,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 20904,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 21064,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 1729,
    "dynamics": "p",
    "velocity": 0.58,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 21223,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 21383,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 21543,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 21702,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 21862,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 22021,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 22340,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 22500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 22660,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 22819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.98,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 22979,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "cresc",
    "velocity": 0.72,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.64,
      0.64,
      0.64,
      0.97
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 23138,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 23298,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 23457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 23617,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 23777,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 23936,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 24096,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 24255,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 24415,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 24574,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 24734,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 24894,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "cresc",
    "velocity": 0.75,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.68,
      0.68,
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 25053,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 25213,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 25372,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 25532,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 25691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 25851,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 26011,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 26170,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 26330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 26489,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 26649,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 26808,
    "midi": [
      51,
      56,
      59,
      71
    ],
    "duration": 1888,
    "dynamics": "cresc",
    "velocity": 0.73,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.77,
      0.72,
      0.72,
      0.72
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 26968,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 27128,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.72,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 27287,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 27447,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.72,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 27606,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 27766,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.72,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 27925,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 28085,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.72,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 28245,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 28404,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.72,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 28564,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 28723,
    "midi": [
      51,
      55,
      58,
      61,
      70
    ],
    "duration": 1888,
    "dynamics": "cresc",
    "velocity": 0.77,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.81,
      0.76,
      0.76,
      0.76,
      0.76
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 28883,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 29043,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 29202,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 29362,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 29521,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 29681,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 29840,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 30000,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 30160,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 30319,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 30479,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 30638,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "f",
    "velocity": 0.97,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.9,
      0.9,
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 30798,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 30957,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 31117,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 31277,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 31436,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 31596,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 31755,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 31915,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 32074,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 32234,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 32394,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 32553,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "f",
    "velocity": 0.96,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.9,
      0.9,
      0.9,
      0.9,
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 32713,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 32872,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33032,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33191,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33351,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33511,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33670,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33830,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 33989,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 34149,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.9,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 34308,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 34468,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 34787,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 34947,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 35106,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 35266,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 35425,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 35745,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 35904,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 36064,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 36223,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 36383,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 1250,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.58,
      0.58,
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 36543,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 36702,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 36862,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 37021,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 37181,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 37340,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 37979,
    "midi": [
      73
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38058,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38138,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38218,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.58,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.58
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38298,
    "midi": [
      54,
      59,
      63,
      66
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38457,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38617,
    "midi": [
      66
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38777,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 38936,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39016,
    "midi": [
      73
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39096,
    "midi": [
      72
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39175,
    "midi": [
      73
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39255,
    "midi": [
      54,
      58,
      64,
      66
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39415,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39574,
    "midi": [
      66
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39734,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39894,
    "midi": [
      76
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 39973,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40053,
    "midi": [
      74
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40133,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40213,
    "midi": [
      54,
      59,
      63,
      71
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40372,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40532,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40691,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40851,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 40931,
    "midi": [
      78
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41011,
    "midi": [
      77
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41090,
    "midi": [
      78
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41170,
    "midi": [
      54,
      58,
      63,
      75
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41330,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41489,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41649,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41808,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41888,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 41968,
    "midi": [
      79
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42048,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42128,
    "midi": [
      53,
      58,
      62,
      77
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42287,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42447,
    "midi": [
      77
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42606,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42766,
    "midi": [
      83
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42846,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 42925,
    "midi": [
      81
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43005,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43085,
    "midi": [
      54,
      58,
      63,
      78
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43245,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43404,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43564,
    "midi": [
      82,
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43723,
    "midi": [
      81,
      84
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 43883,
    "midi": [
      80,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44042,
    "midi": [
      54,
      58,
      61,
      78,
      82
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.7,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44202,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44362,
    "midi": [
      78
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44521,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44681,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44761,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44840,
    "midi": [
      79
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 44920,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45000,
    "midi": [
      53,
      56,
      61,
      77
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45160,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45319,
    "midi": [
      77
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45479,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45638,
    "midi": [
      83
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45718,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45798,
    "midi": [
      81
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45878,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 45957,
    "midi": [
      54,
      58,
      61,
      78
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 46117,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 46277,
    "midi": [
      78
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 46436,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 46596,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 46755,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 46915,
    "midi": [
      54,
      59,
      63,
      83
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 47074,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 47234,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 47394,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 47553,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 47713,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 47872,
    "midi": [
      54,
      58,
      61,
      82
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48032,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48191,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48351,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48511,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48670,
    "midi": [
      78
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48830,
    "midi": [
      53,
      56,
      59,
      61,
      80
    ],
    "duration": 612,
    "dynamics": "p",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 48989,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 49149,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 49308,
    "midi": [
      77
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 49468,
    "midi": [
      54,
      58,
      61,
      78
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 49628,
    "midi": [
      102
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 49787,
    "midi": [
      52,
      56,
      59,
      68
    ],
    "duration": 1489,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.6,
      0.6,
      0.6,
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 50106,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 50425,
    "midi": [
      64
    ],
    "duration": 293,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 50745,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 51064,
    "midi": [
      68
    ],
    "duration": 213,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 51303,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 51383,
    "midi": [
      47,
      59,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.7,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.65,
      0.6,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 51622,
    "midi": [
      76
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 51702,
    "midi": [
      40,
      52,
      88
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.72,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.65,
      0.6,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 52021,
    "midi": [
      51,
      55,
      58,
      67
    ],
    "duration": 1489,
    "dynamics": "p",
    "velocity": 0.61,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.65,
      0.6,
      0.6,
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 52340,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 52660,
    "midi": [
      63
    ],
    "duration": 293,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 52979,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 53298,
    "midi": [
      67
    ],
    "duration": 213,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 53537,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.6,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.6
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 53617,
    "midi": [
      46,
      58,
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.7,
      0.65,
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 53856,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "cresc",
    "velocity": 0.94,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.94
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 53936,
    "midi": [
      39,
      51,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.79,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.7,
      0.7,
      0.98
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 54255,
    "midi": [
      52,
      56,
      59,
      68
    ],
    "duration": 1489,
    "dynamics": "cresc",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.65,
      0.65,
      0.65,
      0.65
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 54574,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "cresc",
    "velocity": 0.65,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.65
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 54894,
    "midi": [
      64
    ],
    "duration": 293,
    "dynamics": "cresc",
    "velocity": 0.65,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.65
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 55213,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "cresc",
    "velocity": 0.65,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.65
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 55532,
    "midi": [
      68
    ],
    "duration": 213,
    "dynamics": "cresc",
    "velocity": 0.69,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.69
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 55771,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "cresc",
    "velocity": 0.69,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.69
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 55851,
    "midi": [
      47,
      59,
      83
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.81,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.74,
      0.69,
      0.99
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 56090,
    "midi": [
      76
    ],
    "duration": 60,
    "dynamics": "cresc",
    "velocity": 0.99,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.99
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 56170,
    "midi": [
      40,
      52,
      88
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.82,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.74,
      0.69,
      1.03
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 56489,
    "midi": [
      51,
      55,
      58,
      67
    ],
    "duration": 1489,
    "dynamics": "cresc",
    "velocity": 0.7,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.74,
      0.69,
      0.69,
      0.69
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 56808,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "cresc",
    "velocity": 0.69,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.69
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 57128,
    "midi": [
      63
    ],
    "duration": 293,
    "dynamics": "cresc",
    "velocity": 0.69,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.69
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 57447,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "cresc",
    "velocity": 0.73,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.73
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 57766,
    "midi": [
      67
    ],
    "duration": 213,
    "dynamics": "cresc",
    "velocity": 0.73,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.73
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 58005,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "cresc",
    "velocity": 0.73,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.73
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 58085,
    "midi": [
      46,
      58,
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.79,
      0.73,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 58324,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 58404,
    "midi": [
      39,
      51,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.89,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.79,
      0.79,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 58723,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.06,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.04,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 59042,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.06,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.04,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 59362,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.12,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 59681,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.16,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.14,
      1.18
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 60000,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.16,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.14,
      1.18
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 60319,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.16,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.14,
      1.18
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 60638,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.12,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 60957,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.12,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 61277,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.2,
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 61596,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 61915,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 62234,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 62553,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.2,
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 62872,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 63191,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 63511,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.2,
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  }
];

const PART_2: RawPianoNote[] = [
  {
    "time": 63830,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 64149,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 64468,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.2,
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 64787,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.24,
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 65106,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.88,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 65425,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 65745,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 65904,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 66064,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 66223,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 66383,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "dim",
    "velocity": 0.62,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 66542,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 66702,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 66862,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67021,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67181,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67340,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67659,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 67979,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 68138,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 68298,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "dim",
    "velocity": 0.61,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 68457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 68617,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 68777,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 68936,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 69096,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 69255,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 69415,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 69574,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 69734,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 69894,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 70053,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 70213,
    "midi": [
      51,
      56,
      59,
      71
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.73,
      0.68,
      0.68,
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 70372,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 70532,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 70691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 70851,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71011,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71170,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71489,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71649,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71808,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 71968,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 72128,
    "midi": [
      51,
      55,
      58,
      61,
      70
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.73,
      0.68,
      0.68,
      0.68,
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 72287,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 72447,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 72606,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 72766,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 72925,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 73085,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 73245,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 73404,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 73564,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 73723,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 73883,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 74042,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "p",
    "velocity": 0.75,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 74202,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 74362,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 74521,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 74681,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 74840,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75000,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75159,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75319,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75479,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75638,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75798,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 75957,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 76117,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 76276,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 76436,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 76596,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 76755,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 76915,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 77074,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 77234,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 77394,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 77553,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 77713,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 77872,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 78191,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 78351,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 78511,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 78670,
    "midi": [
      95
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 78830,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.68,
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 79149,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 79308,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 79468,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 79628,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 79787,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 771,
    "dynamics": "p",
    "velocity": 0.68,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.68
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 79947,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 80106,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 80266,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 80425,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 80585,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 80745,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 81064,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 81223,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 81383,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.96,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 81542,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 81702,
    "midi": [
      63,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 81862,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82021,
    "midi": [
      68,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82181,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82340,
    "midi": [
      68,
      71,
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82659,
    "midi": [
      63,
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 82979,
    "midi": [
      68,
      71,
      79
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 83138,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 83298,
    "midi": [
      68,
      71,
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 83457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 83617,
    "midi": [
      63,
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 83776,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 83936,
    "midi": [
      67,
      70,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.77,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.68,
      0.68,
      0.96
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 84096,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 84255,
    "midi": [
      67,
      70,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.76,
      0.76,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 84415,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 84574,
    "midi": [
      63,
      76
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.9,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.76,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 84734,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 84894,
    "midi": [
      67,
      70,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.76,
      0.76,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 85053,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 85213,
    "midi": [
      67,
      70,
      73
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.76,
      0.76,
      0.76
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 85372,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 85532,
    "midi": [
      51,
      71
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.79,
    "hands": [
      "LH",
      "LH"
    ],
    "velocities": [
      0.81,
      0.76
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 85691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 85851,
    "midi": [
      56,
      59,
      71
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.76,
      0.76,
      0.76
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86011,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86170,
    "midi": [
      56,
      59,
      70
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.81,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.81,
      0.81,
      0.81
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86489,
    "midi": [
      51,
      68
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.83,
    "hands": [
      "LH",
      "LH"
    ],
    "velocities": [
      0.86,
      0.81
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86649,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86808,
    "midi": [
      56,
      59,
      67
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.81,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.81,
      0.81,
      0.81
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 86968,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 87128,
    "midi": [
      56,
      59,
      68
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.81,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.81,
      0.81,
      0.81
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 87287,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 87447,
    "midi": [
      51,
      70
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.83,
    "hands": [
      "LH",
      "LH"
    ],
    "velocities": [
      0.86,
      0.81
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 87606,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.14,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.14
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 87766,
    "midi": [
      55,
      58,
      61,
      63
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.81,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.81,
      0.81,
      0.81,
      0.81
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 87925,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 88085,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 88245,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 88404,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 88564,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 88723,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 88883,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 89042,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 89202,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 89362,
    "midi": [
      63,
      83
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.01,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.86,
      1.16
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 89521,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 89681,
    "midi": [
      68,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.86,
      1.16
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 89840,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90000,
    "midi": [
      68,
      71,
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90159,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90319,
    "midi": [
      63,
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.07,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90479,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90638,
    "midi": [
      68,
      71,
      79
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90798,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 90957,
    "midi": [
      68,
      71,
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 91117,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 91276,
    "midi": [
      63,
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.07,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 91436,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 91596,
    "midi": [
      67,
      70,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 91755,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 91915,
    "midi": [
      67,
      70,
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.03,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 92074,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 92234,
    "midi": [
      63,
      76
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.08,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.94,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 92393,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 92553,
    "midi": [
      67,
      70,
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.03,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 92713,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 92872,
    "midi": [
      67,
      70,
      73
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.94,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 93032,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 93191,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 0.94,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 93511,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 93670,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 93830,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 93989,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 94149,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 0.94,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94,
      0.94
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 94468,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 94628,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 94787,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 94947,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 95106,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 0.94,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 95266,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 95425,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 95585,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 95745,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 95904,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 96064,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 96383,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 96702,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 97021,
    "midi": [
      32,
      44,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.11,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.99,
      0.99,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 97340,
    "midi": [
      56,
      59,
      63,
      68,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94,
      0.94,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 97659,
    "midi": [
      56,
      59,
      63,
      68,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94,
      0.94,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 97979,
    "midi": [
      35,
      47,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.11,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.99,
      0.99,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 98298,
    "midi": [
      56,
      59,
      63,
      68,
      79,
      91
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94,
      0.94,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 98617,
    "midi": [
      56,
      59,
      63,
      68,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94,
      0.94,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 98936,
    "midi": [
      27,
      39,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.11,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.99,
      0.99,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 99255,
    "midi": [
      58,
      61,
      63,
      67,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.94,
      0.94,
      0.94,
      1.22,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 99574,
    "midi": [
      58,
      61,
      63,
      67,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 99893,
    "midi": [
      31,
      43,
      82,
      88
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.71,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 99973,
    "midi": [
      90
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.84,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 100053,
    "midi": [
      88
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.84,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 100213,
    "midi": [
      58,
      61,
      63,
      67,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 100532,
    "midi": [
      58,
      61,
      63,
      67,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 100851,
    "midi": [
      32,
      44,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 101170,
    "midi": [
      51,
      56,
      59,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.62,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.56,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 101489,
    "midi": [
      51,
      56,
      59,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.62,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.56,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 101808,
    "midi": [
      26,
      38,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 102128,
    "midi": [
      53,
      56,
      58,
      65,
      67,
      79
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 102447,
    "midi": [
      53,
      56,
      58,
      65,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 102766,
    "midi": [
      27,
      39,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 103085,
    "midi": [
      51,
      55,
      58,
      61,
      63
    ],
    "duration": 612,
    "dynamics": "dim",
    "velocity": 0.57,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.56,
      0.56,
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 103245,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 103404,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 103564,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.84,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 103723,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.84,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 103883,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.88,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.88
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 104042,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.86,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.84,
      0.88
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 104362,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 104681,
    "midi": [
      32,
      44,
      84,
      90,
      92,
      96
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.76,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.8,
      0.84,
      0.84,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 105000,
    "midi": [
      63,
      66,
      68,
      72,
      84,
      90,
      92,
      96
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.69,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8,
      0.84,
      0.84,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 105319,
    "midi": [
      63,
      66,
      68,
      72,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 105638,
    "midi": [
      36,
      48,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.71,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 105957,
    "midi": [
      63,
      66,
      68,
      72,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 106276,
    "midi": [
      63,
      66,
      68,
      72,
      78,
      90
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 106356,
    "midi": [
      37
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.61,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.61
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 106436,
    "midi": [
      44
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.61,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.61
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 106516,
    "midi": [
      52
    ],
    "duration": 60,
    "dynamics": "dim",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 106596,
    "midi": [
      76,
      88
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.82,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.8,
      0.84
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 106915,
    "midi": [
      56,
      61,
      64,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "dim",
    "velocity": 0.61,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56,
      0.8
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 107234,
    "midi": [
      61,
      64,
      68,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.5,
      0.5,
      0.5,
      0.72,
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 107553,
    "midi": [
      64,
      68,
      73,
      76,
      88
    ],
    "duration": 771,
    "dynamics": "pp",
    "velocity": 0.6,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.5,
      0.5,
      0.5,
      0.72,
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 107872,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.74,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.72,
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108191,
    "midi": [
      74,
      86
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.72,
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108351,
    "midi": [
      51
    ],
    "duration": 60,
    "dynamics": "pp",
    "velocity": 0.55,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.55
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108431,
    "midi": [
      58
    ],
    "duration": 60,
    "dynamics": "pp",
    "velocity": 0.5,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.5
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108510,
    "midi": [
      67,
      75
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.61,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.5,
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108670,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108830,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 108989,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109149,
    "midi": [
      77
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109308,
    "midi": [
      44,
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.66,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.55,
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109388,
    "midi": [
      51
    ],
    "duration": 60,
    "dynamics": "pp",
    "velocity": 0.55,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.55
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109468,
    "midi": [
      59,
      78
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.61,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.5,
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109628,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109787,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 109947,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110106,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110266,
    "midi": [
      39,
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.66,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.55,
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110346,
    "midi": [
      46
    ],
    "duration": 60,
    "dynamics": "pp",
    "velocity": 0.55,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.55
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110425,
    "midi": [
      55,
      81
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.61,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.5,
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110585,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110745,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 110904,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 111064,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 111223,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 111383,
    "midi": [
      32,
      47,
      84
    ],
    "duration": 2207,
    "dynamics": "pp",
    "velocity": 0.61,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.55,
      0.55,
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 111542,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 111702,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 111862,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112021,
    "midi": [
      86
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.72,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.72
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112181,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112340,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112659,
    "midi": [
      88
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 112979,
    "midi": [
      89
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 113138,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 113298,
    "midi": [
      90
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 113457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 113617,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 113776,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 113936,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 114096,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 114255,
    "midi": [
      93
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 114415,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 114574,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.76,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.76
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 114734,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "pp",
    "velocity": 0.8,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.8
    ],
    "rhDynamics": "pp",
    "lhDynamics": "pp"
  },
  {
    "time": 114893,
    "midi": [
      95
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 115053,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 115213,
    "midi": [
      96
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 115372,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 115532,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 115691,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 115851,
    "midi": [
      98
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116010,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116170,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116330,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116489,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116649,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116808,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 116968,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 117127,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 117287,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 117447,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 117606,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 117766,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 117925,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 118085,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 118245,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 118404,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 118564,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 118723,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 118883,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 119042,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 119202,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 119362,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 119521,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 119681,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 119840,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120000,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120159,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120319,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120479,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120638,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120798,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 120957,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 121117,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 121276,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 121436,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 121596,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 121755,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 121915,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 122074,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 122234,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 122393,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 122553,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 122713,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 122872,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123032,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123191,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123351,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123510,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123670,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123830,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 123989,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 124149,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.74,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 124308,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 124468,
    "midi": [
      51,
      63,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 124627,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 124787,
    "midi": [
      51,
      63,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 124947,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 125106,
    "midi": [
      49,
      61,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 125266,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 125425,
    "midi": [
      47,
      59,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 125585,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  }
];

const PART_3: RawPianoNote[] = [
  {
    "time": 125745,
    "midi": [
      47,
      59,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 125904,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 126064,
    "midi": [
      46,
      58,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 126223,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 126383,
    "midi": [
      44,
      56,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 126542,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 126702,
    "midi": [
      43,
      55,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 126862,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127021,
    "midi": [
      44,
      56,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127181,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127340,
    "midi": [
      46,
      58,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127500,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127659,
    "midi": [
      39,
      51,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127819,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 127979,
    "midi": [
      39,
      51,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 128138,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 128298,
    "midi": [
      40,
      52,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.02,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.1,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 128457,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 128617,
    "midi": [
      39,
      51,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 128776,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 128936,
    "midi": [
      37,
      49,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 129096,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 129255,
    "midi": [
      35,
      47,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 129415,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 129574,
    "midi": [
      35,
      47,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.04,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 129734,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 129893,
    "midi": [
      34,
      46,
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      0.74
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 130053,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.78,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.78
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 130213,
    "midi": [
      32,
      44,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.21,
      1.21,
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 130372,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 130532,
    "midi": [
      31,
      43,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.21,
      1.21,
      0.81
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 130691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 130851,
    "midi": [
      32,
      44,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.21,
      1.21,
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 131010,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 131170,
    "midi": [
      34,
      46,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.08,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.21,
      1.21,
      0.81
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 131330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.85,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.85
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 131489,
    "midi": [
      27,
      39,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.21,
      1.21,
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 131808,
    "midi": [
      106
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.89,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.89
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 132127,
    "midi": [
      105
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 132287,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 132447,
    "midi": [
      103
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 132606,
    "midi": [
      102
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 132766,
    "midi": [
      101
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 132925,
    "midi": [
      100
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 133085,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 133404,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 133723,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.93,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.93
    ],
    "rhDynamics": "p",
    "lhDynamics": "mf"
  },
  {
    "time": 134042,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 134362,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 134681,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 135000,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 135319,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 135638,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.97,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 135957,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 136276,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 136596,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 136915,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 137234,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 137553,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.02,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 137872,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 138191,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 138510,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 138830,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 139149,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 139468,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 139787,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 140106,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 140425,
    "midi": [
      97,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 140744,
    "midi": [
      95,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 141064,
    "midi": [
      95,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 141383,
    "midi": [
      94,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 141702,
    "midi": [
      92,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 142021,
    "midi": [
      91,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 142340,
    "midi": [
      92,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 142659,
    "midi": [
      94,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 142979,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 143298,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 143617,
    "midi": [
      88,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 143936,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.15,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.26,
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 144255,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 144574,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 144734,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 144893,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 145053,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 145213,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 145372,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "mf",
    "lhDynamics": "f"
  },
  {
    "time": 145532,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 145691,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 145851,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146010,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146170,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146330,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146489,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146649,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146808,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 146968,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 147127,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 147287,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.01,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.01
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 147447,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 147606,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 147766,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 147925,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 148085,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.0,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 148244,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 148404,
    "midi": [
      92,
      95
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.0,
      1.0
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 148564,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 148723,
    "midi": [
      92,
      95
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.0,
      1.0
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 148883,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 149042,
    "midi": [
      90,
      94
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.0,
      1.0
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 149202,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.04,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.04
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 149361,
    "midi": [
      88,
      92
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.02,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 149521,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 149681,
    "midi": [
      88,
      92
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.02,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 149840,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150000,
    "midi": [
      90,
      94
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.02,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150159,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150319,
    "midi": [
      87,
      91
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.02,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150479,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150638,
    "midi": [
      87,
      91
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.02,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150798,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 150957,
    "midi": [
      88,
      92
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.02,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 151117,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 151276,
    "midi": [
      87,
      91
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.05,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.05,
      1.05
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 151436,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 151596,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 151755,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 151915,
    "midi": [
      97
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.05,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.05
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 152074,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 152234,
    "midi": [
      92,
      95
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.05,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.05,
      1.05
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 152393,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 152553,
    "midi": [
      92,
      95
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.05,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.05,
      1.05
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 152713,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 152872,
    "midi": [
      90,
      94
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.05,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.05,
      1.05
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153032,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153191,
    "midi": [
      88,
      92
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.08,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.08,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153351,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153510,
    "midi": [
      88,
      92
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.08,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.08,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153670,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153830,
    "midi": [
      90,
      94
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.08,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.08,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 153989,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 154149,
    "midi": [
      87,
      91
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.08,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.08,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 154308,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 154468,
    "midi": [
      87,
      91
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.08,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.08,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 154627,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 154787,
    "midi": [
      88,
      92
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.08,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.08,
      1.08
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 154947,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 155106,
    "midi": [
      87,
      91
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.1,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 155266,
    "midi": [
      107
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.15,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.15
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 155425,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.1,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 155585,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.15,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.15
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 155744,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 155904,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.15,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.15
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 156064,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "animato",
    "velocity": 0.85,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.78,
      0.78,
      0.78,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 156223,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.15,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.15
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 156383,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 156542,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.15,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.15
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 156702,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.06,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 156861,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.15,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.15
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157021,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157181,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.17,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.17
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157340,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.17,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.17
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157659,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.17,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.17
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 157979,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1090,
    "dynamics": "animato",
    "velocity": 0.86,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.8,
      0.8,
      0.8,
      0.8,
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 158138,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.17,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.17
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 158298,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 158457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.17,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.17
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 158617,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.09,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.09
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 158776,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.13,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.13
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 158936,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 159096,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 159255,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.12,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.12
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 159415,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 159574,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 0.82,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 159734,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 159893,
    "midi": [
      51,
      56,
      59,
      71
    ],
    "duration": 1888,
    "dynamics": "animato",
    "velocity": 0.83,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.87,
      0.82,
      0.82,
      0.82
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 160053,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 160213,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 0.82,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 160372,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 160532,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 0.82,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 160691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "animato",
    "velocity": 1.16,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.16
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 160851,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.92,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161010,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161170,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.92,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161489,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.92,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161649,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161808,
    "midi": [
      51,
      55,
      58,
      61,
      70
    ],
    "duration": 1888,
    "dynamics": "f",
    "velocity": 0.93,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.97,
      0.92,
      0.92,
      0.92,
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 161968,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 162127,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.92,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 162287,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 162447,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 162606,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 162766,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 162925,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 163085,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 163244,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 163404,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 163564,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 163723,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 1888,
    "dynamics": "f",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      0.92,
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 163883,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 164042,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 164202,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 164361,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 164521,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 164681,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 164840,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165000,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165159,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165319,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165478,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165638,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "f",
    "velocity": 0.98,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.92,
      0.92,
      0.92,
      0.92,
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165798,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 165957,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 166117,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 166276,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 166436,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 166596,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 166755,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 166915,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 167074,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 167234,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.92,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 167393,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 167553,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 0.92,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.92,
      0.92,
      0.92
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 167872,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 168032,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 168191,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 168351,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 168510,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.1,
      1.1,
      1.1,
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 168830,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 168989,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 169149,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 169308,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 169468,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 1729,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.1,
      1.1,
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 169627,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 169787,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 169947,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 170106,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 170266,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 170425,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 170744,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 170904,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171064,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171223,
    "midi": [
      56,
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.26,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171303,
    "midi": [
      63
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171383,
    "midi": [
      71,
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.22,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171542,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171702,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 171861,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172021,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172181,
    "midi": [
      59,
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.26,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172260,
    "midi": [
      68
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172340,
    "midi": [
      75,
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.34,
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172500,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172659,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172819,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 172978,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173138,
    "midi": [
      63,
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.26,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173218,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173298,
    "midi": [
      79,
      82
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.34,
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173457,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173617,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173776,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 173936,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 174096,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 174255,
    "midi": [
      67,
      70,
      76
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.18,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.1,
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 174415,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 174574,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 174734,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 174893,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175053,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175213,
    "midi": [
      68,
      71
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH"
    ],
    "velocities": [
      1.1,
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175372,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175532,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175691,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175851,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 175931,
    "midi": [
      55
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 176010,
    "midi": [
      59,
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.24,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.1,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 176090,
    "midi": [
      62
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.1,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.1
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 176170,
    "midi": [
      65,
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH",
      "LH"
    ],
    "velocities": [
      0.56,
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 176330,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 176489,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 176649,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 176808,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 176968,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 177127,
    "midi": [
      46,
      52,
      55,
      61,
      70
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.57,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.56,
      0.56,
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 177287,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 177447,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 177606,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 177766,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 177925,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178085,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178244,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178404,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178564,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178723,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178883,
    "midi": [
      56,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.73,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 178963,
    "midi": [
      63
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179042,
    "midi": [
      71,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179202,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179361,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179521,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179681,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179840,
    "midi": [
      59,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.73,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 179920,
    "midi": [
      68
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180000,
    "midi": [
      75,
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180159,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180319,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180478,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180638,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180798,
    "midi": [
      63,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.73,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180877,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 180957,
    "midi": [
      79,
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 181117,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 181276,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 181436,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 181595,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 181755,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 181915,
    "midi": [
      67,
      70,
      76
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 182074,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 182234,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 182393,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 182553,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 182713,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 182872,
    "midi": [
      68,
      71
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH",
      "LH"
    ],
    "velocities": [
      0.56,
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 183191,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 183351,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 183510,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 183670,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 183830,
    "midi": [
      61,
      67,
      70
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 184149,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 184308,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 184468,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 184627,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 184787,
    "midi": [
      56,
      59,
      63,
      68
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.56,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.56,
      0.56
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 184947,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 185106,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.82,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 185266,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 185425,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.86,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 185585,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 185744,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.9,
    "hands": [
      "RH"
    ],
    "velocities": [
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 186064,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.88,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 186223,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.88,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.86,
      0.9
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 186383,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 186542,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 186702,
    "midi": [
      44,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 186861,
    "midi": [
      83,
      95
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 187021,
    "midi": [
      51,
      56,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.71,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 187181,
    "midi": [
      83,
      95
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  }
];

const PART_4: RawPianoNote[] = [
  {
    "time": 187340,
    "midi": [
      51,
      56,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.71,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 187500,
    "midi": [
      82,
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 187659,
    "midi": [
      47,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 187819,
    "midi": [
      80,
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 187978,
    "midi": [
      56,
      59,
      79,
      91
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.7,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 188138,
    "midi": [
      79,
      91
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 188298,
    "midi": [
      56,
      59,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.7,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.56,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 188457,
    "midi": [
      80,
      92
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 188617,
    "midi": [
      39,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 188776,
    "midi": [
      82,
      94
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 188936,
    "midi": [
      46,
      51,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.72,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 189095,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 189255,
    "midi": [
      46,
      51,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.72,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 189415,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 189574,
    "midi": [
      39,
      76,
      88
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 189734,
    "midi": [
      76,
      88
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 189893,
    "midi": [
      46,
      51,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.72,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 190053,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.84,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.86
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 190213,
    "midi": [
      46,
      51,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.65,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.61,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 190372,
    "midi": [
      73,
      85
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 190532,
    "midi": [
      44,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.66,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 190691,
    "midi": [
      71,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 190851,
    "midi": [
      51,
      56,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.64,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 191010,
    "midi": [
      71,
      83
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 191170,
    "midi": [
      51,
      56,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.64,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.61,
      0.56,
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 191330,
    "midi": [
      70,
      82
    ],
    "duration": 133,
    "dynamics": "p",
    "velocity": 0.69,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.56,
      0.82
    ],
    "rhDynamics": "p",
    "lhDynamics": "pp"
  },
  {
    "time": 191489,
    "midi": [
      50,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.73,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.67,
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 191649,
    "midi": [
      68,
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 191808,
    "midi": [
      56,
      58,
      62,
      67,
      79
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.67,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.62,
      0.62,
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 191968,
    "midi": [
      67,
      79
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 192127,
    "midi": [
      56,
      58,
      62,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.67,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.62,
      0.62,
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 192287,
    "midi": [
      68,
      80
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 192447,
    "midi": [
      51,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.73,
    "hands": [
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.67,
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 192606,
    "midi": [
      70,
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 192766,
    "midi": [
      55,
      58,
      61,
      63,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.67,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.62,
      0.62,
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 192925,
    "midi": [
      63,
      75
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.89
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 193085,
    "midi": [
      55,
      58,
      61,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.74,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.62,
      0.62,
      0.62,
      0.89,
      0.93
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 193244,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.91,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.89,
      0.93
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 193404,
    "midi": [
      55,
      58,
      61,
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.79,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.65,
      0.65,
      0.65,
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 193564,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 193723,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 193883,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 194042,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 194202,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 194361,
    "midi": [
      44,
      84,
      96
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.87,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.7,
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 194521,
    "midi": [
      84,
      96
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 194681,
    "midi": [
      51,
      56,
      84,
      96
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.82,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.7,
      0.65,
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 194840,
    "midi": [
      84,
      96
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195000,
    "midi": [
      51,
      56,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.82,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.7,
      0.65,
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195159,
    "midi": [
      82,
      94
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.94,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195319,
    "midi": [
      48,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.91,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.74,
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195478,
    "midi": [
      80,
      92
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195638,
    "midi": [
      56,
      60,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.84,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.69,
      0.69,
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195798,
    "midi": [
      80,
      92
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 195957,
    "midi": [
      56,
      60,
      78,
      90
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.84,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.69,
      0.69,
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 196117,
    "midi": [
      78,
      90
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 196276,
    "midi": [
      49,
      76,
      88
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.91,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.74,
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 196436,
    "midi": [
      76,
      88
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 196595,
    "midi": [
      56,
      61,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.76,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.69,
      0.69,
      0.69,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 196755,
    "midi": [
      73,
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.83,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.69,
      0.98
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 196915,
    "midi": [
      56,
      61,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.84,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.69,
      0.69,
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 197074,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.0,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      0.98,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 197234,
    "midi": [
      49,
      76,
      88
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.95,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.78,
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 197393,
    "midi": [
      76,
      88
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 197553,
    "midi": [
      56,
      61,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.89,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.73,
      0.73,
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 197712,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 197872,
    "midi": [
      56,
      61,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.8,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.73,
      0.73,
      0.73,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198032,
    "midi": [
      73,
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.88,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      0.73,
      1.02
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198191,
    "midi": [
      51,
      58,
      63,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.86,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.78,
      0.73,
      0.73,
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198351,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198510,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198670,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198830,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 198989,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.04,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.06
    ],
    "rhDynamics": "mf",
    "lhDynamics": "p"
  },
  {
    "time": 199149,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 199308,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 199468,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 199627,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 199787,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 199947,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 200106,
    "midi": [
      51,
      58,
      63,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.91,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.82,
      0.77,
      0.77,
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 200266,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 200425,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 200585,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 200744,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 200904,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.09,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.07,
      1.11
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 201064,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 201223,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 201383,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 201542,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 201702,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 201861,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202021,
    "midi": [
      51,
      58,
      63,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.94,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.85,
      0.8,
      0.8,
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202181,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202340,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202500,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202659,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202819,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.13,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.11,
      1.15
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 202978,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 203138,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 203298,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 203457,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 203617,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 203776,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 203936,
    "midi": [
      51,
      58,
      63,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 0.99,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      0.89,
      0.84,
      0.84,
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 204095,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 204255,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 204415,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 204574,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 204734,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.18,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.16,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 204893,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.22,
    "hands": [
      "RH",
      "RH"
    ],
    "velocities": [
      1.2,
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 205212,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 205372,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 205532,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 205691,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 205851,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 931,
    "dynamics": "cresc",
    "velocity": 0.96,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.88,
      0.88,
      0.88,
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206010,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206170,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206330,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206489,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206649,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "cresc",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206808,
    "midi": [
      63,
      68,
      71,
      80
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.95,
      0.95,
      0.95,
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 206968,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 207127,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 207287,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 207447,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 207606,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 207766,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "f",
    "velocity": 1.0,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      0.95,
      0.95,
      0.95,
      0.95,
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 207925,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 208085,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 208244,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 208404,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.18,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 208564,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 208723,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 208883,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 209042,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.2,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.2
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 209202,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 209361,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.97,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 209521,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 209681,
    "midi": [
      51,
      56,
      59,
      71
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 0.98,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.02,
      0.97,
      0.97,
      0.97
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 209840,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210000,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.97,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210159,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210319,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 0.97,
    "hands": [
      "LH"
    ],
    "velocities": [
      0.97
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210478,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210638,
    "midi": [
      51,
      56,
      59,
      68
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.05,
      1.0,
      1.0,
      1.0
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210798,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 210957,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.0,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 211117,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 211276,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.0,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 211436,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 211595,
    "midi": [
      51,
      55,
      58,
      61,
      70
    ],
    "duration": 1888,
    "dynamics": "f",
    "velocity": 1.01,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.05,
      1.0,
      1.0,
      1.0,
      1.0
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 211755,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 211915,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.0,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.0
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 212074,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 212234,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.22,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.22
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 212393,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 212553,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 212712,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 212872,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213032,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213191,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213351,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213510,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 1.07,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.02,
      1.02,
      1.02,
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213670,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213829,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 213989,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 214149,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.24,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.24
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 214308,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 214468,
    "midi": [
      63,
      68,
      71,
      80
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.05,
      1.05,
      1.05,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 214627,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 214787,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 214947,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 215106,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 215266,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 215425,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "f",
    "velocity": 1.09,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.05,
      1.05,
      1.05,
      1.05,
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 215585,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 215744,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 215904,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 216064,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.26,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.26
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 216223,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 216383,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 216542,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 216702,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 216861,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 217021,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.08,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.08
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 217181,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 217340,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 1.08,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.08,
      1.08,
      1.08
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 217659,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 217819,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.28,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.28
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 217978,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 218138,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 218298,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "f",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.1,
      1.1,
      1.1,
      1.1
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 218617,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 218776,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 218936,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 219095,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 219255,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 1729,
    "dynamics": "f",
    "velocity": 1.1,
    "hands": [
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.1,
      1.1,
      1.1
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 219415,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 219574,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.3,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.3
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 219734,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 219893,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 220053,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "f",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "f",
    "lhDynamics": "mf"
  },
  {
    "time": 220212,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 220532,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.36
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 220691,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 220851,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221010,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221170,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.18,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.13,
      1.13,
      1.13,
      1.32
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221329,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221489,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221649,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221808,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.32,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 221968,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 222127,
    "midi": [
      63,
      68,
      71,
      80
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.2,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      1.15,
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 222287,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 222447,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 222606,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 222766,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 222925,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 223085,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "ff",
    "velocity": 1.19,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH"
    ],
    "velocities": [
      1.15,
      1.15,
      1.15,
      1.15,
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 223244,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 223404,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 223564,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 223723,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.34,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.34
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 223883,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 224042,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.36
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 224202,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 224361,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.36
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 224521,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 224681,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.18,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 224840,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225000,
    "midi": [
      51,
      56,
      59,
      71
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.19,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH"
    ],
    "velocities": [
      1.23,
      1.18,
      1.18,
      1.18
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225159,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225319,
    "midi": [
      71
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.18,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225478,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225638,
    "midi": [
      70
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.18,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.18
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225798,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.4,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.4
    ],
    "rhDynamics": "ff",
    "lhDynamics": "f"
  },
  {
    "time": 225957,
    "midi": [
      51,
      56,
      59,
      68
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.37,
      1.32,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 226117,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 226276,
    "midi": [
      67
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.32,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 226436,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 226595,
    "midi": [
      68
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 226755,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 226915,
    "midi": [
      51,
      55,
      58,
      61,
      70
    ],
    "duration": 1888,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.37,
      1.32,
      1.38,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 227074,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 227234,
    "midi": [
      63
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.32,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.32
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 227393,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 227553,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 227712,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 227872,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228032,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228191,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228351,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228510,
    "midi": [
      85
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228670,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228829,
    "midi": [
      63,
      68,
      71,
      83
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.32,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 228989,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 229149,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 229308,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 229468,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 229627,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 229787,
    "midi": [
      63,
      68,
      71,
      80
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.32,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 229946,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 230106,
    "midi": [
      79
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 230266,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 230425,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 230585,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 230744,
    "midi": [
      63,
      67,
      70,
      73,
      82
    ],
    "duration": 1569,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.32,
      1.38,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 230904,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 231064,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 231223,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 231383,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 231542,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 231702,
    "midi": [
      76
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 231861,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 232021,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 232181,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 232340,
    "midi": [
      73
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 232500,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 232659,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 232978,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 233138,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 233298,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 233457,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 233617,
    "midi": [
      63,
      67,
      70,
      73
    ],
    "duration": 931,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.32,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 233936,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 234095,
    "midi": [
      91
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 234255,
    "midi": [
      94
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 234415,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 234574,
    "midi": [
      63,
      68,
      71
    ],
    "duration": 1250,
    "dynamics": "ff",
    "velocity": 1.36,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 234734,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 234893,
    "midi": [
      83
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 235053,
    "midi": [
      87
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 235212,
    "midi": [
      92
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.42,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 235372,
    "midi": [
      99
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 235532,
    "midi": [
      104
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.46,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236170,
    "midi": [
      73
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236250,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236329,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236409,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236489,
    "midi": [
      54,
      66
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236649,
    "midi": [
      59,
      63,
      90
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236808,
    "midi": [
      54,
      66
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 236968,
    "midi": [
      59,
      63,
      90
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237127,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237207,
    "midi": [
      73
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237287,
    "midi": [
      72
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237367,
    "midi": [
      73
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237446,
    "midi": [
      54,
      66
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237606,
    "midi": [
      58,
      64,
      90
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237766,
    "midi": [
      54,
      66
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 237925,
    "midi": [
      58,
      64,
      90
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238085,
    "midi": [
      76
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238165,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238244,
    "midi": [
      74
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238324,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238404,
    "midi": [
      54,
      71
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238564,
    "midi": [
      59,
      63,
      90
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238723,
    "midi": [
      54,
      71
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 238883,
    "midi": [
      59,
      63,
      90
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239042,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239122,
    "midi": [
      78
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239202,
    "midi": [
      77
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239282,
    "midi": [
      78
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239361,
    "midi": [
      51,
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.37,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239521,
    "midi": [
      54,
      58,
      94
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239681,
    "midi": [
      51,
      75
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.37,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 239840,
    "midi": [
      54,
      58,
      94
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240000,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240079,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240159,
    "midi": [
      79
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240239,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240319,
    "midi": [
      52,
      77
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240478,
    "midi": [
      55,
      58,
      94
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240638,
    "midi": [
      53,
      77
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.35,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240798,
    "midi": [
      56,
      58,
      94
    ],
    "duration": 133,
    "dynamics": "ff",
    "velocity": 1.37,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.32,
      1.38,
      1.42
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 240957,
    "midi": [
      83
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 241037,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 241117,
    "midi": [
      81
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 241196,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "ff",
    "velocity": 1.38,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.38
    ],
    "rhDynamics": "ff",
    "lhDynamics": "ff"
  },
  {
    "time": 241276,
    "midi": [
      51,
      78
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 241436,
    "midi": [
      54,
      58,
      94
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 241595,
    "midi": [
      51,
      94
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 241755,
    "midi": [
      54,
      58,
      82,
      85
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 241915,
    "midi": [
      81,
      84
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 242074,
    "midi": [
      80,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 242234,
    "midi": [
      54,
      78,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 242393,
    "midi": [
      58,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 242553,
    "midi": [
      54,
      78
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  }
];

const PART_5: RawPianoNote[] = [
  {
    "time": 242712,
    "midi": [
      58,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 242872,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 242952,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243032,
    "midi": [
      79
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243111,
    "midi": [
      80
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243191,
    "midi": [
      53,
      77
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243351,
    "midi": [
      59,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243510,
    "midi": [
      53,
      77
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243670,
    "midi": [
      59,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243829,
    "midi": [
      83
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243909,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 243989,
    "midi": [
      81
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244069,
    "midi": [
      82
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244149,
    "midi": [
      54,
      78
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244308,
    "midi": [
      58,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244468,
    "midi": [
      54,
      78
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244627,
    "midi": [
      58,
      62,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244787,
    "midi": [
      54,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 244946,
    "midi": [
      58,
      62,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 245106,
    "midi": [
      54,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 245266,
    "midi": [
      59,
      63,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.56
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 245425,
    "midi": [
      54,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.56
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 245585,
    "midi": [
      59,
      63,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.56
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 245744,
    "midi": [
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 245904,
    "midi": [
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 246063,
    "midi": [
      54,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 246223,
    "midi": [
      58,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 246383,
    "midi": [
      58,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 246542,
    "midi": [
      58,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 246702,
    "midi": [
      58,
      61,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 246861,
    "midi": [
      58,
      61,
      78
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247021,
    "midi": [
      53,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247181,
    "midi": [
      59,
      61,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247340,
    "midi": [
      75
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247500,
    "midi": [
      77
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247579,
    "midi": [
      42
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.47,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.47
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247659,
    "midi": [
      49,
      78
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247739,
    "midi": [
      58
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247819,
    "midi": [
      102
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.56,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.56
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 247978,
    "midi": [
      52,
      56,
      59,
      68
    ],
    "duration": 1489,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 248298,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 248617,
    "midi": [
      64
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 248936,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 249255,
    "midi": [
      68
    ],
    "duration": 213,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 249494,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 249574,
    "midi": [
      47,
      59,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 249813,
    "midi": [
      76
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 249893,
    "midi": [
      40,
      52,
      88
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 250212,
    "midi": [
      51,
      55,
      58,
      67
    ],
    "duration": 1489,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 250532,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 250851,
    "midi": [
      63
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 251170,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 251489,
    "midi": [
      67
    ],
    "duration": 213,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 251728,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 251808,
    "midi": [
      46,
      58,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 252048,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 252127,
    "midi": [
      39,
      51,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 252446,
    "midi": [
      52,
      56,
      59,
      68
    ],
    "duration": 1489,
    "dynamics": "fff",
    "velocity": 1.45,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.42,
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 252766,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 253085,
    "midi": [
      64
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 253404,
    "midi": [
      66
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 253723,
    "midi": [
      68
    ],
    "duration": 213,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 253962,
    "midi": [
      71
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 254042,
    "midi": [
      47,
      59,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 254282,
    "midi": [
      76
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 254361,
    "midi": [
      40,
      52,
      88
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.52
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 254681,
    "midi": [
      51,
      55,
      58,
      67
    ],
    "duration": 1489,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.42,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 255000,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 255319,
    "midi": [
      63
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 255638,
    "midi": [
      65
    ],
    "duration": 293,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 255957,
    "midi": [
      67
    ],
    "duration": 213,
    "dynamics": "fff",
    "velocity": 1.42,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.42
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 256196,
    "midi": [
      70
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 256276,
    "midi": [
      46,
      58,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.47,
      1.48,
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 256516,
    "midi": [
      75
    ],
    "duration": 60,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.48
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 256595,
    "midi": [
      39,
      51,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 256915,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 257234,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 257553,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 257872,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 258191,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 258510,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 258829,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 259149,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 259468,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 259787,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 260106,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 260425,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 260744,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 261063,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 261383,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 261702,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 262021,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 262340,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 262659,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 262978,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 263298,
    "midi": [
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 263617,
    "midi": [
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 263936,
    "midi": [
      87,
      99
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264042,
    "midi": [
      91
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264149,
    "midi": [
      92
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264255,
    "midi": [
      85,
      97
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264361,
    "midi": [
      91
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264468,
    "midi": [
      92
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264574,
    "midi": [
      32,
      44,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264680,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264787,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 264893,
    "midi": [
      63,
      68,
      71,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265000,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265106,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265212,
    "midi": [
      63,
      68,
      71,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265319,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265425,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265532,
    "midi": [
      23,
      35,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265638,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265744,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265851,
    "midi": [
      63,
      68,
      71,
      79,
      91
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 265957,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266063,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266170,
    "midi": [
      63,
      68,
      71,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266276,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266383,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266489,
    "midi": [
      27,
      39,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266595,
    "midi": [
      86
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266702,
    "midi": [
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266808,
    "midi": [
      58,
      61,
      63,
      67,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 266915,
    "midi": [
      79
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267021,
    "midi": [
      80,
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267127,
    "midi": [
      58,
      61,
      63,
      67,
      75
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267234,
    "midi": [
      79
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267340,
    "midi": [
      80
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267446,
    "midi": [
      27,
      39,
      76,
      88
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267553,
    "midi": [
      79
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267659,
    "midi": [
      80
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267766,
    "midi": [
      58,
      61,
      63,
      67,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267872,
    "midi": [
      79
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 267978,
    "midi": [
      80
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268085,
    "midi": [
      58,
      61,
      63,
      67,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268191,
    "midi": [
      79
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268298,
    "midi": [
      80
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268404,
    "midi": [
      32,
      44,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268510,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268617,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268723,
    "midi": [
      56,
      59,
      63,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268829,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 268936,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269042,
    "midi": [
      56,
      59,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269149,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269255,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269361,
    "midi": [
      22,
      34,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269468,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269574,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269680,
    "midi": [
      53,
      56,
      58,
      65,
      67,
      79
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269787,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 269893,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270000,
    "midi": [
      53,
      56,
      58,
      65,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270106,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270212,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270319,
    "midi": [
      39,
      46,
      54,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270425,
    "midi": [
      74
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270532,
    "midi": [
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270638,
    "midi": [
      63,
      75
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270744,
    "midi": [
      67
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.46,
    "hands": [
      "LH"
    ],
    "velocities": [
      1.46
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270851,
    "midi": [
      68
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 270957,
    "midi": [
      75,
      87
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271063,
    "midi": [
      79
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271170,
    "midi": [
      80
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271276,
    "midi": [
      87,
      99
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271383,
    "midi": [
      91
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271489,
    "midi": [
      92
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271595,
    "midi": [
      87,
      99
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271702,
    "midi": [
      91
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271808,
    "midi": [
      92
    ],
    "duration": 80,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "RH"
    ],
    "velocities": [
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 271915,
    "midi": [
      85,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 272234,
    "midi": [
      32,
      44,
      84,
      90,
      92,
      96
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.46,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 272553,
    "midi": [
      63,
      66,
      68,
      72,
      84,
      90,
      92,
      96
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.46,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 272872,
    "midi": [
      63,
      66,
      68,
      72,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 273191,
    "midi": [
      36,
      48,
      80,
      84,
      90,
      92
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.46,
      1.5,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 273510,
    "midi": [
      63,
      66,
      68,
      72,
      80,
      84,
      90,
      92
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 273829,
    "midi": [
      63,
      66,
      68,
      72,
      78,
      90
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 274149,
    "midi": [
      37,
      49,
      76,
      80,
      85,
      88
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 274468,
    "midi": [
      61,
      64,
      73,
      80,
      85
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 274787,
    "midi": [
      61,
      64,
      68,
      75,
      80,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 275106,
    "midi": [
      61,
      64,
      68,
      70,
      76,
      80,
      88
    ],
    "duration": 931,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 275425,
    "midi": [
      75,
      80,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 275744,
    "midi": [
      73,
      80,
      85
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 276063,
    "midi": [
      51,
      63,
      75,
      87
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 276223,
    "midi": [
      50,
      62,
      76,
      88
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 276383,
    "midi": [
      49,
      61,
      77,
      89
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 276542,
    "midi": [
      48,
      60,
      78,
      90
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 276702,
    "midi": [
      47,
      59,
      79,
      91
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 276861,
    "midi": [
      46,
      58,
      80,
      92
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277021,
    "midi": [
      45,
      57,
      81,
      93
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277180,
    "midi": [
      44,
      56,
      82,
      94
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277340,
    "midi": [
      43,
      55,
      83,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277500,
    "midi": [
      42,
      54,
      84,
      96
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277659,
    "midi": [
      41,
      53,
      85,
      97
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277819,
    "midi": [
      40,
      52,
      86,
      98
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 277978,
    "midi": [
      39,
      51,
      87,
      99
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 278138,
    "midi": [
      38,
      50,
      88,
      100
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 278297,
    "midi": [
      37,
      49,
      89,
      101
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 278457,
    "midi": [
      36,
      48,
      90,
      102
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 278617,
    "midi": [
      35,
      47,
      91,
      103
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 278776,
    "midi": [
      34,
      46,
      92,
      104
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 278936,
    "midi": [
      33,
      45,
      93,
      105
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 279095,
    "midi": [
      32,
      44,
      94,
      106
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 279255,
    "midi": [
      31,
      43,
      95,
      107
    ],
    "duration": 2207,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.54,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 281489,
    "midi": [
      32,
      44,
      71,
      83
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 281808,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 281968,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 282127,
    "midi": [
      51,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 282287,
    "midi": [
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 282446,
    "midi": [
      32,
      44,
      73,
      85
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 282766,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 282925,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 283085,
    "midi": [
      51,
      63,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 283244,
    "midi": [
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 283404,
    "midi": [
      32,
      44,
      71,
      83
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 283723,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 283883,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 284042,
    "midi": [
      51,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 284202,
    "midi": [
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 284361,
    "midi": [
      32,
      44,
      70,
      82
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 284680,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 284840,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 285000,
    "midi": [
      51,
      63
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 285319,
    "midi": [
      32,
      44,
      71,
      83
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 285638,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 285797,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 285957,
    "midi": [
      51,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 286117,
    "midi": [
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 286276,
    "midi": [
      32,
      44,
      73,
      85
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 286595,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 286755,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 286915,
    "midi": [
      51,
      63,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 287074,
    "midi": [
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 287234,
    "midi": [
      32,
      44,
      71,
      83
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 287553,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 287712,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 287872,
    "midi": [
      51,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 288032,
    "midi": [
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 288191,
    "midi": [
      32,
      44,
      70,
      82
    ],
    "duration": 612,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 288510,
    "midi": [
      39,
      51
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 288670,
    "midi": [
      44,
      56
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 288829,
    "midi": [
      51,
      63,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 288989,
    "midi": [
      67,
      79
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 289149,
    "midi": [
      32,
      44,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 289468,
    "midi": [
      56,
      61,
      64,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 289627,
    "midi": [
      56,
      61,
      64,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 289787,
    "midi": [
      56,
      61,
      64,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 290106,
    "midi": [
      56,
      61,
      64,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 290266,
    "midi": [
      56,
      61,
      64,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 290425,
    "midi": [
      56,
      59,
      63,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 290585,
    "midi": [
      56,
      59,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 290744,
    "midi": [
      56,
      59,
      63,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 291063,
    "midi": [
      32,
      44
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 291383,
    "midi": [
      56,
      61,
      64,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 291542,
    "midi": [
      56,
      61,
      64,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 291702,
    "midi": [
      56,
      61,
      64,
      73,
      85
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 292021,
    "midi": [
      56,
      61,
      64,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 292180,
    "midi": [
      56,
      61,
      64,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 292340,
    "midi": [
      56,
      59,
      63,
      71,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 292500,
    "midi": [
      56,
      59,
      63,
      70,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 292659,
    "midi": [
      56,
      59,
      63,
      68,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.48,
    "hands": [
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 292978,
    "midi": [
      32,
      44
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 293297,
    "midi": [
      51,
      56,
      59,
      71,
      75,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 293457,
    "midi": [
      70,
      73,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 293617,
    "midi": [
      51,
      56,
      59,
      68,
      71,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 293936,
    "midi": [
      32,
      44
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 294255,
    "midi": [
      51,
      56,
      59,
      71,
      75,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 294414,
    "midi": [
      70,
      73,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 294574,
    "midi": [
      51,
      56,
      59,
      68,
      71,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 294893,
    "midi": [
      32,
      44
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 295212,
    "midi": [
      51,
      56,
      59,
      71,
      75,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 295372,
    "midi": [
      70,
      73,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 295532,
    "midi": [
      51,
      56,
      59,
      68,
      71,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 295851,
    "midi": [
      32,
      44
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 296170,
    "midi": [
      51,
      56,
      59,
      71,
      75,
      83
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 296329,
    "midi": [
      70,
      73,
      82
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 296489,
    "midi": [
      51,
      56,
      59,
      68,
      71,
      80
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.49,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.46,
      1.46,
      1.5,
      1.5,
      1.5
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 296808,
    "midi": [
      32,
      39,
      44,
      83,
      87,
      92,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.52,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.51,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 297127,
    "midi": [
      44,
      51,
      56,
      83,
      87,
      92,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.46,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 297446,
    "midi": [
      56,
      63,
      68,
      83,
      87,
      92,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 297766,
    "midi": [
      68,
      75,
      80,
      83,
      87,
      92,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 298085,
    "midi": [
      56,
      63,
      68,
      83,
      87,
      92,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.5,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.46,
      1.46,
      1.46,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 298404,
    "midi": [
      44,
      51,
      56,
      83,
      87,
      92,
      95
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.46,
      1.5,
      1.54,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 298723,
    "midi": [
      32,
      35,
      39,
      44,
      95,
      99,
      104,
      107
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.51,
      1.51,
      1.54,
      1.58,
      1.58,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 299680,
    "midi": [
      32,
      35,
      39,
      44,
      95,
      99,
      104,
      107
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.54,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.51,
      1.51,
      1.54,
      1.58,
      1.58,
      1.58
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  },
  {
    "time": 300638,
    "midi": [
      32,
      35,
      39,
      44,
      80,
      83,
      87,
      92
    ],
    "duration": 133,
    "dynamics": "fff",
    "velocity": 1.51,
    "hands": [
      "LH",
      "LH",
      "LH",
      "LH",
      "RH",
      "RH",
      "RH",
      "RH"
    ],
    "velocities": [
      1.51,
      1.51,
      1.51,
      1.51,
      1.5,
      1.5,
      1.54,
      1.54
    ],
    "rhDynamics": "fff",
    "lhDynamics": "fff"
  }
];

export const LA_CAMPANELLA_RAW_NOTES: RawPianoNote[] = [
  ...PART_1, ...PART_2, ...PART_3, ...PART_4, ...PART_5
];
