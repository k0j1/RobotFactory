/**
 * ロボットアームの肩＆拳（アームジョイントアンカー）位置管理マネージャー (OOP / Singleton)
 * 各アームパーツごとの左右の肩（Shoulder）および拳（Fist/Hand）のアンカー座標 (X%, Y%) を管理・永続化し、
 * インタラクティブ調整、数値直接入力、JSONエクスポート/コピー、他のパーツへの貼り付けを完全サポートします。
 */

export interface JointCoordinate {
  x: number; // 0〜100 (%)
  y: number; // 0〜100 (%)
}

// 後方互換性および型エイリアス
export type HandCoordinate = JointCoordinate;
export type ArmJointCoord = JointCoordinate;
export type ArmJointType = 'rightShoulder' | 'leftShoulder' | 'rightHand' | 'leftHand';

export interface ArmHandConfig {
  partKey: string;             // 例: "arm_r1_v0" (レアリティ + ビジュアルインデックス)
  partName?: string;           // 例: "標準アイアンアーム (Common #0)"
  rightShoulder: JointCoordinate; // 右肩ピボット・位置
  leftShoulder: JointCoordinate;  // 左肩ピボット・位置
  rightHand: JointCoordinate;     // 右拳位置
  leftHand: JointCoordinate;      // 左拳位置
  updatedAt?: number;
}

export type HandAnchorConfig = ArmHandConfig;

export type ArmHandConfigMap = Record<string, ArmHandConfig>;

export interface HandAnchorExportPayload {
  version: 1;
  exportedAt: string;
  source: 'GSAP_MOTION_STUDIO_ARM_CALIBRATOR';
  currentPart?: ArmHandConfig;
  allParts: ArmHandConfigMap;
}

export interface SinglePartExportPayload {
  version: 1;
  type: 'arm_joint_config';
  exportedAt: string;
  partKey: string;
  partName?: string;
  rightShoulder: JointCoordinate;
  leftShoulder: JointCoordinate;
  rightHand: JointCoordinate;
  leftHand: JointCoordinate;
}

const STORAGE_KEY = 'robot_arm_joint_anchor_configs_v3';
const LEGACY_STORAGE_KEY = 'robot_arm_joint_anchor_configs_v2';

/**
 * 登録されているアームパーツ一覧（貼り付け先選択用）
 */
export interface ArmPartOption {
  key: string;
  name: string;
  rarity: number;
  visualIndex: number;
}

export const AVAILABLE_ARM_PARTS: ArmPartOption[] = [
  // ★1 (Common) - 8種類
  { key: 'arm_r1_v0', name: '標準アイアンアーム (Common #0)', rarity: 1, visualIndex: 0 },
  { key: 'arm_r1_v1', name: 'スリムアーム (Common #1)', rarity: 1, visualIndex: 1 },
  { key: 'arm_r1_v2', name: 'ヘビーナックルアーム (Common #2)', rarity: 1, visualIndex: 2 },
  { key: 'arm_r1_v3', name: 'クローハンドアーム (Common #3)', rarity: 1, visualIndex: 3 },
  { key: 'arm_r1_v4', name: '★1 ブレードアーム (#4)', rarity: 1, visualIndex: 4 },
  { key: 'arm_r1_v5', name: '★1 ウィップアーム (#5)', rarity: 1, visualIndex: 5 },
  { key: 'arm_r1_v6', name: '★1 シールドアーム (#6)', rarity: 1, visualIndex: 6 },
  { key: 'arm_r1_v7', name: '★1 マルチウェポンアーム (#7)', rarity: 1, visualIndex: 7 },
  // ★2 (Uncommon) - 4種類
  { key: 'arm_r2_v0', name: '強化アーム (Uncommon #0)', rarity: 2, visualIndex: 0 },
  { key: 'arm_r2_v1', name: 'シールドアーム (Uncommon #1)', rarity: 2, visualIndex: 1 },
  { key: 'arm_r2_v2', name: 'アームパーツ (arm_r2_v2)', rarity: 2, visualIndex: 2 },
  { key: 'arm_r2_v3', name: '★2 ナノブレードアーム (#3)', rarity: 2, visualIndex: 3 },
  // 高レアリティパーツ
  { key: 'arm_r3_v0', name: 'バトルアーム (Rare #0)', rarity: 3, visualIndex: 0 },
  { key: 'arm_r4_v0', name: '重装兵装アーム (Epic #0)', rarity: 4, visualIndex: 0 },
  { key: 'arm_r5_v0', name: '神威ゴッドハンド (Legendary #0)', rarity: 5, visualIndex: 0 },
];

// デフォルトの肩・拳座標（パーツ別プリセット・ユーザー指定値）
const DEFAULT_ARM_JOINT_CONFIGS: ArmHandConfigMap = {
  'arm_r1_v0': {
    partKey: 'arm_r1_v0',
    partName: '標準アイアンアーム (Common #0)',
    rightShoulder: { x: 68.5, y: 44 },
    leftShoulder: { x: 32, y: 44 },
    rightHand: { x: 82, y: 64 },
    leftHand: { x: 18, y: 64 },
  },
  'arm_r1_v1': {
    partKey: 'arm_r1_v1',
    partName: 'スリムアーム (Common #1)',
    rightShoulder: { x: 69, y: 45 },
    leftShoulder: { x: 31, y: 45 },
    rightHand: { x: 80, y: 75 },
    leftHand: { x: 20, y: 75 },
  },
  'arm_r1_v2': {
    partKey: 'arm_r1_v2',
    partName: 'ヘビーナックルアーム (Common #2)',
    rightShoulder: { x: 77.5, y: 47 },
    leftShoulder: { x: 22.5, y: 47 },
    rightHand: { x: 85, y: 74 },
    leftHand: { x: 15, y: 74 },
  },
  'arm_r1_v3': {
    partKey: 'arm_r1_v3',
    partName: 'クローハンドアーム (Common #3)',
    rightShoulder: { x: 69, y: 46 },
    leftShoulder: { x: 31, y: 46 },
    rightHand: { x: 71.5, y: 78.5 },
    leftHand: { x: 28.5, y: 78.5 },
  },
  'arm_r1_v4': {
    partKey: 'arm_r1_v4',
    partName: '★1 ブレードアーム (#4)',
    rightShoulder: { x: 69, y: 44 },
    leftShoulder: { x: 31, y: 44 },
    rightHand: { x: 83, y: 72 },
    leftHand: { x: 17, y: 72 },
  },
  'arm_r1_v5': {
    partKey: 'arm_r1_v5',
    partName: '★1 ウィップアーム (#5)',
    rightShoulder: { x: 70, y: 44.5 },
    leftShoulder: { x: 30, y: 44.5 },
    rightHand: { x: 77, y: 77.5 },
    leftHand: { x: 23, y: 77.5 },
  },
  'arm_r1_v6': {
    partKey: 'arm_r1_v6',
    partName: '★1 シールドアーム (#6)',
    rightShoulder: { x: 72, y: 43 },
    leftShoulder: { x: 28, y: 43 },
    rightHand: { x: 72, y: 74 },
    leftHand: { x: 28, y: 74 },
  },
  'arm_r1_v7': {
    partKey: 'arm_r1_v7',
    partName: '★1 マルチウェポンアーム (#7)',
    rightShoulder: { x: 70, y: 44 },
    leftShoulder: { x: 30, y: 44 },
    rightHand: { x: 87, y: 62 },
    leftHand: { x: 13, y: 62 },
  },
  'arm_r2_v0': {
    partKey: 'arm_r2_v0',
    partName: '強化アーム (Uncommon #0)',
    rightShoulder: { x: 69.5, y: 44 },
    leftShoulder: { x: 30.5, y: 44 },
    rightHand: { x: 69.5, y: 65 },
    leftHand: { x: 30.5, y: 65 },
  },
  'arm_r2_v1': {
    partKey: 'arm_r2_v1',
    partName: 'シールドアーム (Uncommon #1)',
    rightShoulder: { x: 69.5, y: 44 },
    leftShoulder: { x: 29, y: 44 },
    rightHand: { x: 60.5, y: 77 },
    leftHand: { x: 38, y: 77 },
  },
  'arm_r2_v2': {
    partKey: 'arm_r2_v2',
    partName: 'アームパーツ (arm_r2_v2)',
    rightShoulder: { x: 70, y: 41.5 },
    leftShoulder: { x: 30, y: 41.5 },
    rightHand: { x: 59.5, y: 62 },
    leftHand: { x: 40.5, y: 62 },
  },
  'arm_r2_v3': {
    partKey: 'arm_r2_v3',
    partName: '★2 ナノブレードアーム (#3)',
    rightShoulder: { x: 69, y: 41.5 },
    leftShoulder: { x: 31, y: 41.5 },
    rightHand: { x: 61.5, y: 65 },
    leftHand: { x: 38.5, y: 65 },
  },
  'arm_r3_v0': {
    partKey: 'arm_r3_v0',
    partName: 'バトルアーム (Rare #0)',
    rightShoulder: { x: 75, y: 46 },
    leftShoulder: { x: 25, y: 46 },
    rightHand: { x: 76.5, y: 62 },
    leftHand: { x: 23.5, y: 62 },
  },
  'arm_r4_v0': {
    partKey: 'arm_r4_v0',
    partName: '重装兵装アーム (Epic #0)',
    rightShoulder: { x: 76, y: 46.5 },
    leftShoulder: { x: 24, y: 46.5 },
    rightHand: { x: 77.5, y: 64 },
    leftHand: { x: 22.5, y: 64 },
  },
  'arm_r5_v0': {
    partKey: 'arm_r5_v0',
    partName: '神威ゴッドハンド (Legendary #0)',
    rightShoulder: { x: 75, y: 46 },
    leftShoulder: { x: 25, y: 46 },
    rightHand: { x: 77, y: 63 },
    leftHand: { x: 23, y: 63 },
  },
};

export class HandAnchorManager {
  private static instance: HandAnchorManager | null = null;
  private configs: ArmHandConfigMap = {};
  private listeners: Array<() => void> = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): HandAnchorManager {
    if (!HandAnchorManager.instance) {
      HandAnchorManager.instance = new HandAnchorManager();
    }
    return HandAnchorManager.instance;
  }

  /**
   * パーツキーを生成 (例: 'arm_r1_v0')
   */
  public static generatePartKey(rarity: number = 1, visualIndex: number = 0): string {
    return `arm_r${rarity}_v${visualIndex}`;
  }

  /**
   * ローカルストレージから設定を復元（旧バージョン互換性対応）
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.configs = { ...DEFAULT_ARM_JOINT_CONFIGS };
      return;
    }

    try {
      // v2ストレージ確認
      const rawV2 = localStorage.getItem(STORAGE_KEY);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        if (typeof parsed === 'object' && parsed !== null) {
          this.configs = this.mergeWithDefaults(parsed);
          return;
        }
      }

      // 旧ストレージ(v1)からのマイグレーション
      const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (rawV1) {
        const parsedV1 = JSON.parse(rawV1);
        if (typeof parsedV1 === 'object' && parsedV1 !== null) {
          this.configs = this.mergeWithDefaults(parsedV1);
          this.saveToStorage();
          return;
        }
      }
    } catch (e) {
      console.warn('[HandAnchorManager] Failed to load arm joint anchor configs from localStorage:', e);
    }

    this.configs = { ...DEFAULT_ARM_JOINT_CONFIGS };
  }

  private mergeWithDefaults(saved: Record<string, Partial<ArmHandConfig>>): ArmHandConfigMap {
    const result: ArmHandConfigMap = { ...DEFAULT_ARM_JOINT_CONFIGS };
    for (const [key, val] of Object.entries(saved)) {
      if (!val) continue;
      const def = DEFAULT_ARM_JOINT_CONFIGS[key] || {
        partKey: key,
        partName: `アームパーツ (${key})`,
        rightShoulder: { x: 75.0, y: 46.0 },
        leftShoulder: { x: 25.0, y: 46.0 },
        rightHand: { x: 76.0, y: 62.0 },
        leftHand: { x: 24.0, y: 62.0 },
      };

      result[key] = {
        partKey: key,
        partName: val.partName || def.partName,
        rightShoulder: {
          x: typeof val.rightShoulder?.x === 'number' ? val.rightShoulder.x : def.rightShoulder.x,
          y: typeof val.rightShoulder?.y === 'number' ? val.rightShoulder.y : def.rightShoulder.y,
        },
        leftShoulder: {
          x: typeof val.leftShoulder?.x === 'number' ? val.leftShoulder.x : def.leftShoulder.x,
          y: typeof val.leftShoulder?.y === 'number' ? val.leftShoulder.y : def.leftShoulder.y,
        },
        rightHand: {
          x: typeof val.rightHand?.x === 'number' ? val.rightHand.x : def.rightHand.x,
          y: typeof val.rightHand?.y === 'number' ? val.rightHand.y : def.rightHand.y,
        },
        leftHand: {
          x: typeof val.leftHand?.x === 'number' ? val.leftHand.x : def.leftHand.x,
          y: typeof val.leftHand?.y === 'number' ? val.leftHand.y : def.leftHand.y,
        },
        updatedAt: val.updatedAt || Date.now(),
      };
    }
    return result;
  }

  /**
   * ローカルストレージに設定を保存
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.configs));
    } catch (e) {
      console.warn('[HandAnchorManager] Failed to save configs to localStorage:', e);
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('[HandAnchorManager] Listener error:', err);
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 指定パーツキーの肩＆拳設定を取得（古いlocalStorageデータ等によるundefinedを完全に防御）
   */
  public getHandConfig(partKey: string): ArmHandConfig {
    const raw = this.configs[partKey] || DEFAULT_ARM_JOINT_CONFIGS[partKey];
    const def = DEFAULT_ARM_JOINT_CONFIGS[partKey] || {
      partKey,
      partName: `アームパーツ (${partKey})`,
      rightShoulder: { x: 75.0, y: 46.0 },
      leftShoulder: { x: 25.0, y: 46.0 },
      rightHand: { x: 76.0, y: 62.0 },
      leftHand: { x: 24.0, y: 62.0 },
    };

    if (raw) {
      return {
        partKey: raw.partKey || partKey,
        partName: raw.partName || def.partName,
        rightShoulder: {
          x: typeof raw.rightShoulder?.x === 'number' ? raw.rightShoulder.x : (def.rightShoulder?.x ?? 75.0),
          y: typeof raw.rightShoulder?.y === 'number' ? raw.rightShoulder.y : (def.rightShoulder?.y ?? 46.0),
        },
        leftShoulder: {
          x: typeof raw.leftShoulder?.x === 'number' ? raw.leftShoulder.x : (def.leftShoulder?.x ?? 25.0),
          y: typeof raw.leftShoulder?.y === 'number' ? raw.leftShoulder.y : (def.leftShoulder?.y ?? 46.0),
        },
        rightHand: {
          x: typeof raw.rightHand?.x === 'number' ? raw.rightHand.x : (def.rightHand?.x ?? 76.0),
          y: typeof raw.rightHand?.y === 'number' ? raw.rightHand.y : (def.rightHand?.y ?? 62.0),
        },
        leftHand: {
          x: typeof raw.leftHand?.x === 'number' ? raw.leftHand.x : (def.leftHand?.x ?? 24.0),
          y: typeof raw.leftHand?.y === 'number' ? raw.leftHand.y : (def.leftHand?.y ?? 62.0),
        },
        updatedAt: raw.updatedAt,
      };
    }
    // 未知パーツの場合は標準位置を返却
    return {
      partKey,
      partName: `アームパーツ (${partKey})`,
      rightShoulder: { x: 75.0, y: 46.0 },
      leftShoulder: { x: 25.0, y: 46.0 },
      rightHand: { x: 76.0, y: 62.0 },
      leftHand: { x: 24.0, y: 62.0 },
    };
  }

  /**
   * 拳の座標を更新（後方互換性）
   */
  public updateHandPosition(
    partKey: string,
    hand: 'right' | 'left',
    coord: Partial<JointCoordinate>,
    partName?: string
  ): ArmHandConfig {
    return this.updateJointPosition(
      partKey,
      hand === 'right' ? 'rightHand' : 'leftHand',
      coord,
      partName
    );
  }

  /**
   * 肩の座標を更新
   */
  public updateShoulderPosition(
    partKey: string,
    shoulder: 'right' | 'left',
    coord: Partial<JointCoordinate>,
    partName?: string
  ): ArmHandConfig {
    return this.updateJointPosition(
      partKey,
      shoulder === 'right' ? 'rightShoulder' : 'leftShoulder',
      coord,
      partName
    );
  }

  /**
   * 指定関節（右肩・左肩・右拳・左拳）の座標を更新
   */
  public updateJointPosition(
    partKey: string,
    joint: 'rightShoulder' | 'leftShoulder' | 'rightHand' | 'leftHand',
    coord: Partial<JointCoordinate>,
    partName?: string
  ): ArmHandConfig {
    const current = this.getHandConfig(partKey);
    const targetCoord = current[joint] || { x: 50, y: 50 };

    const newX = typeof coord.x === 'number' && !isNaN(coord.x)
      ? Math.max(0, Math.min(100, Math.round(coord.x * 10) / 10))
      : targetCoord.x;
    const newY = typeof coord.y === 'number' && !isNaN(coord.y)
      ? Math.max(0, Math.min(100, Math.round(coord.y * 10) / 10))
      : targetCoord.y;

    const updated: ArmHandConfig = {
      ...current,
      partName: partName || current.partName,
      [joint]: { x: newX, y: newY },
      updatedAt: Date.now(),
    };

    this.configs[partKey] = updated;
    this.saveToStorage();
    this.notify();
    return updated;
  }

  /**
   * 設定を一括または単一で更新
   */
  public setHandConfig(config: ArmHandConfig): void {
    if (!config || !config.partKey) return;
    this.configs[config.partKey] = {
      ...config,
      updatedAt: Date.now(),
    };
    this.saveToStorage();
    this.notify();
  }

  /**
   * すべての設定辞書を取得
   */
  public getAllConfigs(): ArmHandConfigMap {
    return { ...this.configs };
  }

  /**
   * 現在の単一パーツ設定をJSON文字列として出力（クリップボード用）
   */
  public exportSinglePartJSON(partKey: string): string {
    const conf = this.getHandConfig(partKey);
    const payload: SinglePartExportPayload = {
      version: 1,
      type: 'arm_joint_config',
      exportedAt: new Date().toISOString(),
      partKey: conf.partKey,
      partName: conf.partName,
      rightShoulder: conf.rightShoulder,
      leftShoulder: conf.leftShoulder,
      rightHand: conf.rightHand,
      leftHand: conf.leftHand,
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * 全設定＋現在パーツのエクスポート用JSON文字列を出力
   */
  public exportJSON(currentPartKey?: string): string {
    const payload: HandAnchorExportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      source: 'GSAP_MOTION_STUDIO_ARM_CALIBRATOR',
      currentPart: currentPartKey ? this.getHandConfig(currentPartKey) : undefined,
      allParts: this.configs,
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * あるパーツの設定を別のパーツへ直接コピー・適用
   */
  public copyPartConfigTo(sourcePartKey: string, targetPartKey: string): { success: boolean; targetConfig: ArmHandConfig; message?: string } {
    try {
      const source = this.getHandConfig(sourcePartKey);
      const targetOld = this.getHandConfig(targetPartKey);

      const updated: ArmHandConfig = {
        ...source,
        partKey: targetPartKey,
        partName: targetOld.partName || `アームパーツ (${targetPartKey})`,
        updatedAt: Date.now(),
      };

      this.configs[targetPartKey] = updated;
      this.saveToStorage();
      this.notify();
      return { success: true, targetConfig: updated, message: `${targetPartKey} へ設定をコピーしました` };
    } catch (err: unknown) {
      return { success: false, targetConfig: this.getHandConfig(targetPartKey), message: String(err) };
    }
  }

  /**
   * あるパーツの設定を登録されている全パーツへ一括コピー
   */
  public copyPartConfigToAll(sourcePartKey: string): { success: boolean; count: number } {
    const source = this.getHandConfig(sourcePartKey);
    let count = 0;

    for (const option of AVAILABLE_ARM_PARTS) {
      if (option.key === sourcePartKey) continue;
      this.configs[option.key] = {
        ...source,
        partKey: option.key,
        partName: option.name,
        updatedAt: Date.now(),
      };
      count++;
    }

    this.saveToStorage();
    this.notify();
    return { success: true, count };
  }

  /**
   * ペーストされたJSON文字列をインポート＆適用
   * (単一パーツ形式、全パーツ形式、ペイロード形式に対応し、指定パーツ上書きも可能)
   */
  public importJSON(
    jsonText: string,
    targetPartKeyOverride?: string
  ): { success: boolean; importedCount: number; message: string } {
    if (!jsonText || typeof jsonText !== 'string') {
      return { success: false, importedCount: 0, message: 'JSONテキストが入力されていません。' };
    }

    try {
      const parsed = JSON.parse(jsonText.trim());
      let count = 0;

      // パターン1: 単一パーツ形式 (SinglePartExportPayload) または currentPart のみ
      const singleCandidate = parsed.currentPart || (parsed.type === 'arm_joint_config' ? parsed : (parsed.rightHand && parsed.leftHand ? parsed : null));

      if (singleCandidate && singleCandidate.rightHand && singleCandidate.leftHand) {
        const destKey = targetPartKeyOverride || singleCandidate.partKey || 'arm_r1_v0';
        const currentDest = this.getHandConfig(destKey);

        this.configs[destKey] = {
          partKey: destKey,
          partName: currentDest.partName || singleCandidate.partName,
          rightShoulder: {
            x: Number(singleCandidate.rightShoulder?.x) || currentDest.rightShoulder?.x || 75.0,
            y: Number(singleCandidate.rightShoulder?.y) || currentDest.rightShoulder?.y || 46.0,
          },
          leftShoulder: {
            x: Number(singleCandidate.leftShoulder?.x) || currentDest.leftShoulder?.x || 25.0,
            y: Number(singleCandidate.leftShoulder?.y) || currentDest.leftShoulder?.y || 46.0,
          },
          rightHand: {
            x: Number(singleCandidate.rightHand.x) || currentDest.rightHand.x,
            y: Number(singleCandidate.rightHand.y) || currentDest.rightHand.y,
          },
          leftHand: {
            x: Number(singleCandidate.leftHand.x) || currentDest.leftHand.x,
            y: Number(singleCandidate.leftHand.y) || currentDest.leftHand.y,
          },
          updatedAt: Date.now(),
        };
        count = 1;
      }
      // パターン2: HandAnchorExportPayload (allParts プロパティ)
      else if (parsed && typeof parsed.allParts === 'object') {
        const partsMap = parsed.allParts as ArmHandConfigMap;
        for (const [key, conf] of Object.entries(partsMap)) {
          if (conf && conf.rightHand && conf.leftHand) {
            const def = this.getHandConfig(key);
            this.configs[key] = {
              partKey: key,
              partName: conf.partName || def.partName,
              rightShoulder: {
                x: Number(conf.rightShoulder?.x) || def.rightShoulder.x,
                y: Number(conf.rightShoulder?.y) || def.rightShoulder.y,
              },
              leftShoulder: {
                x: Number(conf.leftShoulder?.x) || def.leftShoulder.x,
                y: Number(conf.leftShoulder?.y) || def.leftShoulder.y,
              },
              rightHand: {
                x: Number(conf.rightHand.x) || def.rightHand.x,
                y: Number(conf.rightHand.y) || def.rightHand.y,
              },
              leftHand: {
                x: Number(conf.leftHand.x) || def.leftHand.x,
                y: Number(conf.leftHand.y) || def.leftHand.y,
              },
              updatedAt: Date.now(),
            };
            count++;
          }
        }
      }
      // パターン3: 直接のパーツ辞書 { [partKey]: { rightHand, leftHand } }
      else if (typeof parsed === 'object' && parsed !== null) {
        for (const [key, val] of Object.entries(parsed)) {
          if (typeof val === 'object' && val !== null) {
            const conf = val as Partial<ArmHandConfig>;
            if (conf.rightHand && conf.leftHand) {
              const def = this.getHandConfig(key);
              this.configs[key] = {
                partKey: key,
                partName: conf.partName || def.partName,
                rightShoulder: {
                  x: Number(conf.rightShoulder?.x) || def.rightShoulder.x,
                  y: Number(conf.rightShoulder?.y) || def.rightShoulder.y,
                },
                leftShoulder: {
                  x: Number(conf.leftShoulder?.x) || def.leftShoulder.x,
                  y: Number(conf.leftShoulder?.y) || def.leftShoulder.y,
                },
                rightHand: {
                  x: Number(conf.rightHand.x) || def.rightHand.x,
                  y: Number(conf.rightHand.y) || def.rightHand.y,
                },
                leftHand: {
                  x: Number(conf.leftHand.x) || def.leftHand.x,
                  y: Number(conf.leftHand.y) || def.leftHand.y,
                },
                updatedAt: Date.now(),
              };
              count++;
            }
          }
        }
      }

      if (count === 0) {
        return {
          success: false,
          importedCount: 0,
          message: '有効なアーム座標データが見つかりませんでした。',
        };
      }

      this.saveToStorage();
      this.notify();
      return {
        success: true,
        importedCount: count,
        message: `${count}件のパーツ座標設定を正常にインポートしました！`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        importedCount: 0,
        message: `JSONパースエラー: ${errorMsg}`,
      };
    }
  }

  /**
   * 指定パーツをデフォルト座標にリセット
   */
  public resetPartToDefault(partKey: string): void {
    if (DEFAULT_ARM_JOINT_CONFIGS[partKey]) {
      this.configs[partKey] = { ...DEFAULT_ARM_JOINT_CONFIGS[partKey] };
    } else {
      this.configs[partKey] = {
        partKey,
        rightShoulder: { x: 75.0, y: 46.0 },
        leftShoulder: { x: 25.0, y: 46.0 },
        rightHand: { x: 76.0, y: 62.0 },
        leftHand: { x: 24.0, y: 62.0 },
      };
    }
    this.saveToStorage();
    this.notify();
  }

  public resetToDefault(partKey: string): ArmHandConfig {
    this.resetPartToDefault(partKey);
    return this.getHandConfig(partKey);
  }

  /**
   * 全パーツをデフォルトに初期化
   */
  public resetAllToDefaults(): void {
    this.configs = { ...DEFAULT_ARM_JOINT_CONFIGS };
    this.saveToStorage();
    this.notify();
  }
}
