import re

content = open("src/components/minigames/Shared.ts", "r").read()

# Replace PianoSong interface
content = re.sub(
    r"export interface PianoSong \{.*?notes: PianoNoteData\[\];\n\}",
    """export interface PianoSong {
  id: string;
  title: string;
  composer: string;
  baseDifficulty: number; // 0-100 (higher means harder)
  songSpeed: number; // 楽曲固有の再生速度 (例: 0.6=ゆっくり, 1.0=普通, 1.5=速い, 2.0=とても速い)
  bgmUrl?: string; // 任意で背景に流すBGM
  desc: string;
  notesEasy: PianoNoteData[];
  notesNormal: PianoNoteData[];
  notesHard: PianoNoteData[];
}""",
    content,
    flags=re.DOTALL
)

# Replace PIANO_DIFFICULTIES
content = re.sub(
    r"export const PIANO_DIFFICULTIES: PianoDifficultyConfig\[\] = \[.*?\];",
    """export const PIANO_DIFFICULTIES: PianoDifficultyConfig[] = [
  {
    id: 'easy',
    name: '簡単',
    label: '簡単 (EASY)',
    subLabel: '主旋律のみ',
    desc: 'シンプルな単音メロディを中心に演奏します。初心者向けです。',
    multiplier: 1.0,
    rewardKits: 1,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'normal',
    name: '普通',
    label: '普通 (NORMAL)',
    subLabel: '主旋律＋伴奏',
    desc: '主旋律に簡単な和音やベースラインが加わります。標準的な難易度です。',
    multiplier: 1.0,
    rewardKits: 1,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'hard',
    name: '難しい',
    label: '難しい (HARD)',
    subLabel: '複雑な伴奏と和音',
    desc: 'アルペジオや複雑な和音、細かい連符が追加された本格的な演奏です。高い能力が求められます。',
    multiplier: 1.0,
    rewardKits: 2,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
  },
];""",
    content,
    flags=re.DOTALL
)

# Replace song definitions
songs_content = """
const elegyEasy = [
  t(0, [12]), t(1000, [9]), t(2000, [7]), t(3000, [9]),
  t(4000, [10]), t(5000, [12]), t(6000, [10]), t(7000, [8]),
  t(8000, [11]), t(9000, [13]), t(10000, [15]), t(11000, [13]),
  t(12000, [14]), t(13000, [11]), t(14000, [9]), t(15000, [11])
];
const elegyNormal = [
  t(0, [5, 12]), t(1000, [9]), t(2000, [7]), t(3000, [9]),
  t(4000, [8, 10]), t(5000, [12]), t(6000, [10]), t(7000, [8]),
  t(8000, [4, 11]), t(9000, [13]), t(10000, [15]), t(11000, [13]),
  t(12000, [7, 14]), t(13000, [11]), t(14000, [9]), t(15000, [11])
];
const elegyHard = [
  t(0, [5, 12, 16]), t(500, [15]), t(1000, [15, 12]), t(1500, [14]), 
  t(2000, [14, 9]), t(2500, [12]), t(3000, [13, 10]), t(3500, [11]),
  t(4000, [12, 7, 16]), t(4500, [15]), t(5000, [13, 10]), t(5500, [12]),
  t(6000, [14, 9, 17]), t(6500, [16]), t(7000, [16, 12]), t(7500, [15]),
  t(8000, [5, 12, 17]), t(8500, [16]), t(9000, [16, 13]), t(9500, [15]),
  t(10000, [15, 10, 19]), t(10500, [18]), t(11000, [14, 11]), t(11500, [13]),
  t(12000, [13, 8, 17]), t(12500, [16]), t(13000, [14, 11]), t(13500, [13]),
  t(14000, [12, 5, 16]), t(14500, [15]), t(15000, [9, 12, 16]), t(15500, [14])
];

const yumeEasy = [
  t(0, [14]), t(1000, [12]), t(2000, [11]), t(3000, [12]),
  t(4000, [9]), t(5000, [7]), t(6000, [9]), t(7000, [11]),
  t(8000, [14]), t(9000, [16]), t(10000, [15]), t(11000, [14]),
  t(12000, [12]), t(13000, [11]), t(14000, [9]), t(15000, [11])
];
const yumeNormal = [
  t(0, [7, 14]), t(1000, [12]), t(2000, [4, 11]), t(3000, [12]),
  t(4000, [2, 9]), t(5000, [7]), t(6000, [4, 9]), t(7000, [11]),
  t(8000, [7, 14]), t(9000, [16]), t(10000, [11, 15]), t(11000, [14]),
  t(12000, [9, 12]), t(13000, [11]), t(14000, [4, 9]), t(15000, [11])
];
const yumeHard = [
  t(0, [7, 14, 18]), t(250, [11]), t(500, [14]), t(750, [11]), t(1000, [12, 16]), t(1250, [9]), t(1500, [12]), t(1750, [9]),
  t(2000, [4, 11, 15]), t(2250, [7]), t(2500, [11]), t(2750, [7]), t(3000, [12, 16]), t(3250, [9]), t(3500, [12]), t(3750, [9]),
  t(4000, [2, 9, 13]), t(4250, [5]), t(4500, [9]), t(4750, [5]), t(5000, [7, 11]), t(5250, [4]), t(5500, [7]), t(5750, [4]),
  t(6000, [4, 9, 13]), t(6250, [7]), t(6500, [9]), t(6750, [7]), t(7000, [11, 14]), t(7250, [7]), t(7500, [11]), t(7750, [7]),
  t(8000, [7, 14, 18]), t(8250, [11]), t(8500, [14]), t(8750, [11]), t(9000, [16, 19]), t(9250, [13]), t(9500, [16]), t(9750, [13]),
  t(10000, [11, 15, 18]), t(10250, [14]), t(10500, [15]), t(10750, [14]), t(11000, [14, 17]), t(11250, [11]), t(11500, [14]), t(11750, [11]),
  t(12000, [9, 12, 16]), t(12250, [5]), t(12500, [9]), t(12750, [5]), t(13000, [11, 14]), t(13250, [7]), t(13500, [11]), t(13750, [7]),
  t(14000, [4, 9, 13]), t(14250, [7]), t(14500, [9]), t(14750, [7]), t(15000, [11, 15]), t(15250, [7]), t(15500, [11]), t(15750, [7])
];

const kiriEasy = [
  t(0, [16]), t(1000, [15]), t(2000, [14]), t(3000, [15]),
  t(4000, [13]), t(5000, [12]), t(6000, [11]), t(7000, [12]),
  t(8000, [9]), t(9000, [11]), t(10000, [12]), t(11000, [14]),
  t(12000, [16]), t(13000, [15]), t(14000, [14]), t(15000, [12])
];
const kiriNormal = [
  t(0, [9, 16]), t(1000, [15]), t(2000, [7, 14]), t(3000, [15]),
  t(4000, [6, 13]), t(5000, [12]), t(6000, [4, 11]), t(7000, [12]),
  t(8000, [2, 9]), t(9000, [11]), t(10000, [5, 12]), t(11000, [14]),
  t(12000, [9, 16]), t(13000, [15]), t(14000, [7, 14]), t(15000, [12])
];
const kiriHard = [
  t(0, [9, 16, 20]), t(200, [13]), t(400, [16]), t(600, [13]), t(800, [16]), t(1000, [15, 19]), t(1200, [12]), t(1400, [15]), t(1600, [12]), t(1800, [15]),
  t(2000, [7, 14, 18]), t(2200, [11]), t(2400, [14]), t(2600, [11]), t(2800, [14]), t(3000, [15, 19]), t(3200, [12]), t(3400, [15]), t(3600, [12]), t(3800, [15]),
  t(4000, [6, 13, 17]), t(4200, [10]), t(4400, [13]), t(4600, [10]), t(4800, [13]), t(5000, [12, 16]), t(5200, [9]), t(5400, [12]), t(5600, [9]), t(5800, [12]),
  t(6000, [4, 11, 15]), t(6200, [8]), t(6400, [11]), t(6600, [8]), t(6800, [11]), t(7000, [12, 16]), t(7200, [9]), t(7400, [12]), t(7600, [9]), t(7800, [12]),
  t(8000, [2, 9, 13]), t(8200, [6]), t(8400, [9]), t(8600, [6]), t(8800, [9]), t(9000, [11, 15]), t(9200, [8]), t(9400, [11]), t(9600, [8]), t(9800, [11]),
  t(10000, [5, 12, 16]), t(10200, [9]), t(10400, [12]), t(10600, [9]), t(10800, [12]), t(11000, [14, 18]), t(11200, [11]), t(11400, [14]), t(11600, [11]), t(11800, [14]),
  t(12000, [9, 16, 20]), t(12200, [13]), t(12400, [16]), t(12600, [13]), t(12800, [16]), t(13000, [15, 19]), t(13200, [12]), t(13400, [15]), t(13600, [12]), t(13800, [15]),
  t(14000, [7, 14, 18]), t(14200, [11]), t(14400, [14]), t(14600, [11]), t(14800, [14]), t(15000, [12, 16]), t(15200, [9]), t(15400, [12]), t(15600, [9]), t(15800, [12])
];

export const PIANO_SONGS: PianoSong[] = [
  { 
    id: 'elegy', title: 'エレジー', composer: '甘茶の音楽工房', baseDifficulty: 40, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/elegy.mp3',
    desc: '悲哀に満ちた美しいピアノ曲。', 
    notesEasy: generateLoop(elegyEasy, 30000),
    notesNormal: generateLoop(elegyNormal, 30000),
    notesHard: generateLoop(elegyHard, 30000)
  },
  { 
    id: 'yume', title: '夢', composer: '甘茶の音楽工房', baseDifficulty: 60, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/yume.mp3',
    desc: '穏やかで幻想的なピアノ曲。', 
    notesEasy: generateLoop(yumeEasy, 30000),
    notesNormal: generateLoop(yumeNormal, 30000),
    notesHard: generateLoop(yumeHard, 30000)
  },
  { 
    id: 'natsunokiri', title: '夏の霧', composer: '甘茶の音楽工房', baseDifficulty: 80, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/natsunokiri.mp3',
    desc: '静かで少しテンポの速い、霧のように繊細なピアノ曲。', 
    notesEasy: generateLoop(kiriEasy, 30000),
    notesNormal: generateLoop(kiriNormal, 30000),
    notesHard: generateLoop(kiriHard, 30000)
  }
];
"""

content = re.sub(
    r"const elegyBase.*?];\n\nexport const PIANO_SONGS: PianoSong\[\] = \[.*?\];",
    songs_content,
    content,
    flags=re.DOTALL
)

with open("src/components/minigames/Shared.ts", "w") as f:
    f.write(content)

