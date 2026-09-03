// ピアノ演奏ミニゲームのスコア記録・ベストスコア管理

export interface PianoBestScore {
  songId: string;
  bestScore: number;
  bestAccuracy: number;
  bestRank: string;
  maxCombo: number;
  cleared: boolean;
  clearDate?: string;
  robotName?: string;
}

const STORAGE_KEY = 'craft_robot_piano_best_scores_v1';

/**
 * 全演奏曲のベストスコア記録を取得
 */
export const getPianoBestScores = (): Record<string, PianoBestScore> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load piano best scores from localStorage:', e);
    return {};
  }
};

/**
 * 特定の楽曲のベストスコアを取得
 */
export const getPianoBestScore = (songId: string): PianoBestScore | null => {
  const scores = getPianoBestScores();
  return scores[songId] || null;
};

/**
 * 演奏結果を保存し、新記録かどうかを判定
 */
export const savePianoScore = (result: {
  songId: string;
  score: number;
  accuracy: number;
  rank: string;
  maxCombo: number;
  cleared: boolean;
  robotName?: string;
}): {
  isNewHighScore: boolean;
  isNewBestAccuracy: boolean;
  previousRecord: PianoBestScore | null;
  currentRecord: PianoBestScore;
} => {
  const allScores = getPianoBestScores();
  const previousRecord = allScores[result.songId] || null;

  const isNewHighScore = !previousRecord || result.score > previousRecord.bestScore;
  const isNewBestAccuracy = !previousRecord || result.accuracy > previousRecord.bestAccuracy;

  const updatedRecord: PianoBestScore = {
    songId: result.songId,
    bestScore: previousRecord ? Math.max(previousRecord.bestScore, result.score) : result.score,
    bestAccuracy: previousRecord ? Math.max(previousRecord.bestAccuracy, result.accuracy) : result.accuracy,
    bestRank: isNewBestAccuracy || !previousRecord ? result.rank : previousRecord.bestRank,
    maxCombo: previousRecord ? Math.max(previousRecord.maxCombo, result.maxCombo) : result.maxCombo,
    cleared: (previousRecord?.cleared || result.cleared),
    clearDate: result.cleared ? new Date().toISOString() : previousRecord?.clearDate,
    robotName: isNewHighScore ? result.robotName : previousRecord?.robotName
  };

  allScores[result.songId] = updatedRecord;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allScores));
  } catch (e) {
    console.warn('Failed to save piano score to localStorage:', e);
  }

  return {
    isNewHighScore,
    isNewBestAccuracy,
    previousRecord,
    currentRecord: updatedRecord
  };
};
