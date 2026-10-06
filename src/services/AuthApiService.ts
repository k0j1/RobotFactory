import { VersionCheckService } from "../services/VersionCheckService";
import { PlatformService } from "../services/PlatformService";
/**
 * @file AuthApiService.ts
 * @description Googleログイン連携およびusersテーブルへのユーザー情報保存・同期を担当するサービスクラス
 * 厳格なオブジェクト指向プログラミング（OOP）原則に基づき、APIとの通信・永続化ロジックをカプセル化しています。
 */

import { GameState } from '../core/models';

export interface GoogleUserPayload {
  google_id: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface DatabaseUser {
  id: number;
  google_id: string;
  email: string;
  name: string;
  picture: string;
  received_initial_bonus: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoadUserDataResponse {
  data: GameState | null;
  received_initial_bonus: number;
  user?: DatabaseUser;
}

export interface AuthApiResponse<T = any> {
  success: boolean;
  user?: DatabaseUser;
  error?: string;
  message?: string;
  data?: T;
  rolledBack?: boolean;
}

export interface DatabaseSyncError {
  message: string;
  rolledBack: boolean;
  timestamp: number;
}

export interface ActiveCountsData {
  expeditions: Record<string, number>;
  robotAssemblies: number;
  robotDisassemblies?: number;
  requests: Record<string, number>;
  requestsByRank: Record<string, number>;
  playingUsers?: number;
}

export interface DeliverRobotTransactionParams {
  userId: string;
  robotId: string;
  partIds: string[];
  requestId: string;
  rank: string;
  rewardG: number;
  rewardFame: number;
  deadline: number;
  state: GameState;
}

export class AuthApiService {
  private static instance: AuthApiService | null = null;
  private readonly defaultBaseUrl: string;
  private errorListeners: ((error: DatabaseSyncError) => void)[] = [];

  private constructor() {
    // 環境変数があれば最優先、なければ本番CoreServerのURLを定義
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (envBaseUrl) {
      this.defaultBaseUrl = envBaseUrl.replace(/\/+$/, '');
    } else if (
      typeof window !== 'undefined' &&
      !PlatformService.getInstance().isNativeApp() &&
      window.location.hostname.includes('coreserver.jp')
    ) {
      // CoreServer上でWebブラウザからホストされている場合は同オリジン相対パス
      this.defaultBaseUrl = '';
    } else {
      // Capacitorネイティブアプリ環境・開発環境・プレビュー環境では直接CoreServerのAPIサーバーにフルURLで接続（CORS許可済み）
      this.defaultBaseUrl = 'https://robotfactory.k0j1.v2002.coreserver.jp';
    }
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AuthApiService {
    if (!AuthApiService.instance) {
      AuthApiService.instance = new AuthApiService();
    }
    return AuthApiService.instance;
  }

  /**
   * APIのベースURLを取得
   */
  public getBaseUrl(): string {
    return this.defaultBaseUrl;
  }

  /**
   * 指定したAPIパスの試行先エンドポイントリストを取得
   */
  private getAllEndpoints(path: string): string[] {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return Array.from(new Set([
      `${this.defaultBaseUrl}${cleanPath}`,
      `https://robotfactory.k0j1.v2002.coreserver.jp${cleanPath}`,
      cleanPath
    ])).filter(Boolean);
  }

  /**
   * Googleログインしたユーザー情報をMySQLのusersテーブルに保存（INSERTまたはUPDATE）
   * @param payload Googleから取得したユーザープロファイル情報
   * @returns usersテーブルから取得した保存済みユーザーレコード
   */
  public async saveUserToDatabase(payload: GoogleUserPayload): Promise<AuthApiResponse<DatabaseUser>> {
    if (!payload.google_id) {
      throw new Error('google_idが指定されていません。');
    }

    console.log('[AuthApiService] Googleログイン情報をusersテーブルへ保存中...', {
      google_id: payload.google_id,
      email: payload.email,
      name: payload.name
    });

    // 接続試行先のエンドポイントリスト（プロキシまたは直接接続）
    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/login.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/login.php',
      '/api/login.php'
    ])).filter(Boolean);

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`[AuthApiService] 通信試行先: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            google_id: payload.google_id,
            email: payload.email || '',
            name: payload.name || '',
            picture: payload.picture || ''
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
        }

        const rawText = await response.text();
        
        // PHPスクリプトが解釈されずそのまま返された場合の検証
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('サーバーでPHPが実行されていません。静的ファイルとして返却されました。');
        }

        let parsed: AuthApiResponse;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          throw new Error(`不正なJSONレスポンスを受信しました: ${rawText.substring(0, 100)}`);
        }

        if (!parsed.success || !parsed.user) {
          throw new Error(parsed.error || 'usersテーブルへの保存処理で予期しないエラーが発生しました。');
        }

        console.log('[AuthApiService] usersテーブルへの保存が正常に完了しました:', parsed.user);
        return parsed;
      } catch (err: any) {
        console.warn(`[AuthApiService] ${endpoint} への保存試行が失敗しました:`, err.message);
        lastError = err;
      }
    }

    // すべてのエンドポイントで失敗した場合
    throw lastError || new Error('usersテーブルへの接続に失敗しました。');
  }

  /**
   * 新人技師初回ボーナスの受取フラグをDB（user_workshop_statusテーブル）に記録
   */
  public async claimInitialBonus(googleId: string): Promise<AuthApiResponse> {
    if (!googleId) {
      throw new Error('google_idが指定されていません。');
    }

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/claim_bonus.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/claim_bonus.php',
      '/api/claim_bonus.php'
    ])).filter(Boolean);

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            google_id: googleId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('PHPが未実行です。');
        }

        const parsed = JSON.parse(rawText);
        if (!parsed.success) {
          throw new Error(parsed.error || 'ボーナス受取情報の記録に失敗しました。');
        }

        return parsed;
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('ボーナス受取情報の通信に失敗しました。');
  }

  /**
   * 素材入手時にuser_materialテーブルへ素材数を追加
   * @param userId usersテーブルのgoogle_idまたはid
   * @param materialId 素材ID
   * @param count 追加する素材個数
   */
  public async addMaterial(userId: string, materialId: string, count: number = 1): Promise<AuthApiResponse> {
    if (!userId || !materialId || count <= 0) {
      return { success: false, error: 'Invalid parameters' };
    }

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/add_material.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/add_material.php',
      '/api/add_material.php'
    ])).filter(Boolean);

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            material_id: materialId,
            count: count
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('PHPが未実行です。');
        }

        const parsed = JSON.parse(rawText);
        if (!parsed.success) {
          throw new Error(parsed.error || '素材追加の記録に失敗しました。');
        }

        return parsed;
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('素材追加APIへの通信に失敗しました。');
  }

  /**
   * 複数素材をまとめてuser_materialテーブルへ追加
   * @param userId usersテーブルのgoogle_idまたはid
   * @param materials 素材IDと個数のマッピング
   */
  public async addMaterials(userId: string, materials: Record<string, number>): Promise<AuthApiResponse> {
    if (!userId || !materials || Object.keys(materials).length === 0) {
      return { success: false, error: 'Invalid parameters' };
    }

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/add_material.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/add_material.php',
      '/api/add_material.php'
    ])).filter(Boolean);

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            materials: materials
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('PHPが未実行です。');
        }

        const parsed = JSON.parse(rawText);
        if (!parsed.success) {
          throw new Error(parsed.error || '素材追加の記録に失敗しました。');
        }

        return parsed;
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('素材追加APIへの通信に失敗しました。');
  }

  // クラウド同期用デバウンスタイマー
  private syncTimer: any = null;
  private pendingStateToSync: GameState | null = null;
  private isSyncing: boolean = false;

  /**
   * Googleログイン済みユーザーの全ゲーム情報（ステータス、ロボット、パーツ、遠征、製造、組立、依頼等）を
   * usersテーブルに紐づく適切な各テーブルへ確実に保存
   * @param userId usersテーブルのgoogle_idまたはid
   * @param state 現在の完全なゲームステート
   * @param immediate trueの場合はデバウンスを待たずに即時送信
   */
  public async saveAllDataToTables(userId: string, state: GameState, immediate: boolean = false): Promise<AuthApiResponse> {
    if (VersionCheckService.isMismatch()) {
      console.warn("[AuthApiService] Version mismatch detected. Saving is blocked.");
      return { success: false, error: "バージョン不一致のため保存をブロックしました" };
    }
    if (!userId) {
      throw new Error('userIdが指定されていません。');
    }

    this.pendingStateToSync = state;

    if (immediate) {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer);
        this.syncTimer = null;
      }
      return this.executeSyncToTables(userId, state);
    }

    // デバウンス（連続更新時は1.5秒待機して最新データをまとめて送信）
    return new Promise((resolve, reject) => {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer);
      }

      this.syncTimer = setTimeout(async () => {
        this.syncTimer = null;
        if (!this.pendingStateToSync) return;
        try {
          const res = await this.executeSyncToTables(userId, this.pendingStateToSync);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      }, 1500);
    });
  }

  /**
   * 実データ送信実行処理
   */
  private async executeSyncToTables(userId: string, state: GameState): Promise<AuthApiResponse> {
    if (this.isSyncing) {
      // 既に通信中であれば次回のデバウンスで送られるよう保留
      if (!this.syncTimer) {
        this.syncTimer = setTimeout(() => {
          this.syncTimer = null;
          if (this.pendingStateToSync) {
            this.executeSyncToTables(userId, this.pendingStateToSync).catch(console.error);
          }
        }, 1500);
      }
      return { success: true, message: 'Sync queued' };
    }

    this.isSyncing = true;
    console.log(`[AuthApiService] user_id: ${userId} の全データを適切なテーブルへ保存中...`);

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/save.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/save.php',
      '/api/save.php'
    ])).filter(Boolean);

    let lastError: Error | null = null;
    let lastSyncError: DatabaseSyncError | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            gameData: state
          })
        });

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('PHPが未実行です。');
        }

        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch (_) {
          if (!response.ok) {
            throw new Error(`サーバー通信エラー (HTTP ${response.status})`);
          }
        }

        if (!response.ok || (parsed && !parsed.success)) {
          const errMsg = parsed?.error || `データベース保存エラー (HTTP ${response.status})`;
          const isRolledBack = Boolean(parsed?.rolledBack);
          const syncErr: DatabaseSyncError = {
            message: errMsg,
            rolledBack: isRolledBack,
            timestamp: Date.now()
          };
          lastSyncError = syncErr;
          throw new Error(errMsg);
        }

        console.log(`[AuthApiService] 全テーブル保存成功 (${endpoint}):`, parsed);
        this.isSyncing = false;
        return parsed;
      } catch (err: any) {
        console.warn(`[AuthApiService] 保存通信失敗 (${endpoint}):`, err.message);
        lastError = err;
      }
    }

    this.isSyncing = false;
    const finalError = lastSyncError || {
      message: lastError?.message || '適切なテーブルへの保存通信に失敗しました。',
      rolledBack: lastSyncError?.rolledBack ?? false,
      timestamp: Date.now()
    };
    this.notifySyncError(finalError);
    throw lastError || new Error('適切なテーブルへの保存通信に失敗しました。');
  }

  /**
   * データベース同期エラーリスナーの登録
   * @param listener エラー受信コールバック
   * @returns リスナー解除関数
   */
  public onSyncError(listener: (error: DatabaseSyncError) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  /**
   * 登録されたエラーリスナーへエラーを通知
   */
  private notifySyncError(error: DatabaseSyncError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('[AuthApiService] エラーリスナー実行例外:', e);
      }
    });
  }

  /**
   * 納品・解体等で消費されたパーツを user_parts テーブルから確実に削除
   */
  public async deleteUserParts(userId: string, partIds: string[]): Promise<void> {
    if (!userId || !partIds || partIds.length === 0) return;
    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/save.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/save.php',
      '/api/save.php'
    ])).filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            userId,
            action: 'delete_parts',
            deletedPartIds: partIds
          })
        });
      } catch (e) {
        console.warn(`[AuthApiService] deleteUserParts warning (${endpoint}):`, e);
      }
    }
  }

  /**
   * 納品等で手放した機体を user_robots テーブルから確実に削除
   */
  public async deleteUserRobots(userId: string, robotIds: string[]): Promise<void> {
    if (!userId || !robotIds || robotIds.length === 0) return;
    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/save.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/save.php',
      '/api/save.php'
    ])).filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            userId,
            action: 'delete_robots',
            deletedRobotIds: robotIds
          })
        });
      } catch (e) {
        console.warn(`[AuthApiService] deleteUserRobots warning (${endpoint}):`, e);
      }
    }
  }

  /**
   * 依頼納品完了時の一連のDB処理（user_robots削除、user_parts削除、active_requests削除、complete_requests追加、user_workshop_status加算更新、user_save_data保存）を単一の不可分なトランザクションとして一括実行
   */
  public async deliverRobotTransaction(params: DeliverRobotTransactionParams): Promise<AuthApiResponse> {
    if (VersionCheckService.isMismatch()) {
      console.warn("[AuthApiService] Version mismatch detected. Saving is blocked.");
      return { success: false, error: "バージョン不一致のため保存をブロックしました" };
    }
    if (!params.userId) {
      throw new Error('userIdが指定されていません。');
    }

    console.log(`[AuthApiService] user_id: ${params.userId} の依頼納品単一トランザクションを実行中 (機体: ${params.robotId}, パーツ数: ${params.partIds.length})...`);

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/save.php`,
      'https://robotfactory.k0j1.v2002.coreserver.jp/api/save.php',
      '/api/save.php'
    ])).filter(Boolean);

    let lastError: Error | null = null;
    let lastSyncError: DatabaseSyncError | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            userId: params.userId,
            action: 'deliver_robot_transaction',
            deliveryTransaction: {
              robotId: params.robotId,
              partIds: params.partIds,
              requestId: params.requestId,
              rank: params.rank,
              rewardG: params.rewardG,
              rewardFame: params.rewardFame,
              deadline: params.deadline
            },
            deletedRobotIds: [params.robotId],
            deletedPartIds: params.partIds,
            gameData: params.state
          })
        });

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('PHPが未実行です。');
        }

        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch (_) {
          if (!response.ok) {
            throw new Error(`サーバー通信エラー (HTTP ${response.status})`);
          }
        }

        if (!response.ok || (parsed && !parsed.success)) {
          const errMsg = parsed?.error || `データベース納品トランザクションエラー (HTTP ${response.status})`;
          const isRolledBack = Boolean(parsed?.rolledBack);
          const syncErr: DatabaseSyncError = {
            message: errMsg,
            rolledBack: isRolledBack,
            timestamp: Date.now()
          };
          lastSyncError = syncErr;
          throw new Error(errMsg);
        }

        console.log(`[AuthApiService] 依頼納品単一トランザクション保存成功 (${endpoint}):`, parsed);
        return parsed;
      } catch (err: any) {
        console.warn(`[AuthApiService] 納品トランザクション通信失敗 (${endpoint}):`, err.message);
        lastError = err;
      }
    }

    const finalError = lastSyncError || {
      message: lastError?.message || '納品完了トランザクションの通信に失敗しました。',
      rolledBack: lastSyncError?.rolledBack ?? false,
      timestamp: Date.now()
    };
    this.notifySyncError(finalError);
    throw lastError || new Error('納品完了トランザクションの通信に失敗しました。');
  }

  /**
   * データベース（save_dataおよび各テーブル）からユーザーのセーブデータを読み込み
   * @param userId usersテーブルのgoogle_idまたはid
   */
  public async loadUserData(userId: string): Promise<LoadUserDataResponse> {
    if (!userId) {
      return { data: null, received_initial_bonus: 0 };
    }

    console.log(`[AuthApiService] user_id: ${userId} のセーブデータを読み込み中...`);

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/load.php?userId=${encodeURIComponent(userId)}`,
      `https://robotfactory.k0j1.v2002.coreserver.jp/api/load.php?userId=${encodeURIComponent(userId)}`,
      `/api/load.php?userId=${encodeURIComponent(userId)}`
    ])).filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          continue;
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          continue;
        }

        const parsed = JSON.parse(rawText);
        if (parsed.success || parsed.data || parsed.materials) {
          console.log(`[AuthApiService] ユーザーデータを正常にロードしました:`, parsed);
          const bonusVal = parsed.received_initial_bonus !== undefined && parsed.received_initial_bonus !== null
            ? Number(parsed.received_initial_bonus)
            : (parsed.user?.received_initial_bonus !== undefined && parsed.user?.received_initial_bonus !== null
                ? Number(parsed.user.received_initial_bonus)
                : 0);

          let loadedData: Partial<GameState> = { ...(parsed.data || {}) };

          // 1. 工房ステータス (user_workshop_status)
          if (parsed.workshop_status) {
            const ws = parsed.workshop_status;
            if (ws.gold !== undefined) loadedData.gold = Number(ws.gold);
            if (ws.fame !== undefined) loadedData.fame = Number(ws.fame);
            if (ws.consumed_gold !== undefined || ws.consumedGold !== undefined) {
              loadedData.consumedGold = Number(ws.consumed_gold ?? ws.consumedGold);
            }
            if (ws.delivered_count !== undefined || ws.deliveredRobotsCount !== undefined) {
              loadedData.deliveredRobotsCount = Number(ws.delivered_count ?? ws.deliveredRobotsCount);
            }
            if (ws.request_earned_gold !== undefined || ws.requestEarnedGold !== undefined) {
              loadedData.requestEarnedGold = Number(ws.request_earned_gold ?? ws.requestEarnedGold);
            }
            if (ws.storage_limit !== undefined || ws.storageSize !== undefined) {
              loadedData.storageSize = Number(ws.storage_limit ?? ws.storageSize);
            }
            if (ws.unlocked_expeditions) {
              try {
                const unExp = typeof ws.unlocked_expeditions === 'string' 
                  ? JSON.parse(ws.unlocked_expeditions) 
                  : ws.unlocked_expeditions;
                if (Array.isArray(unExp)) loadedData.unlockedLocations = unExp;
              } catch {}
            }
          }

          // 2. 所持素材 (user_material)
          if (parsed.materials) {
            const matObj: Record<string, number> = { ...(loadedData.materials || {}) };
            if (Array.isArray(parsed.materials)) {
              parsed.materials.forEach((m: any) => {
                const mId = m.material_id || m.id || String(m);
                matObj[mId] = Number(m.count ?? m.amount ?? 0);
              });
            } else if (typeof parsed.materials === 'object') {
              Object.entries(parsed.materials).forEach(([mId, count]) => {
                matObj[mId] = typeof count === 'number' ? count : Number((count as any)?.count ?? 0);
              });
            }
            loadedData.materials = matObj;
          }

          // 3. 所持パーツ (user_parts)
          if (parsed.parts && Array.isArray(parsed.parts) && parsed.parts.length > 0) {
            loadedData.parts = parsed.parts;
          }

          // 4. 所持機体 (user_robots)
          if (parsed.robots && Array.isArray(parsed.robots) && parsed.robots.length > 0) {
            loadedData.robots = parsed.robots;
          }

          // 5. バトル武装・装備・ランク (user_item / battle_item)
          if (parsed.combatEquipments && typeof parsed.combatEquipments === 'object') {
            loadedData.combatEquipments = { ...(loadedData.combatEquipments || {}), ...parsed.combatEquipments };
          }
          if (parsed.combatEquipmentRanks && typeof parsed.combatEquipmentRanks === 'object') {
            loadedData.combatEquipmentRanks = { ...(loadedData.combatEquipmentRanks || {}), ...parsed.combatEquipmentRanks };
          }
          if (parsed.activeCombatEquipments && typeof parsed.activeCombatEquipments === 'object') {
            loadedData.activeCombatEquipments = { ...(loadedData.activeCombatEquipments || {}), ...parsed.activeCombatEquipments };
          }

          // 6. リバーシ記憶・オセロ装備 (user_item / reversi_item)
          if (parsed.reversiPurchasedMemories || parsed.othelloPurchasedMemories) {
            loadedData.reversiPurchasedMemories = parsed.reversiPurchasedMemories || parsed.othelloPurchasedMemories || loadedData.reversiPurchasedMemories;
          }
          if (parsed.reversiEquippedMemories || parsed.othelloEquippedMemories) {
            loadedData.reversiEquippedMemories = parsed.reversiEquippedMemories || parsed.othelloEquippedMemories || loadedData.reversiEquippedMemories;
          }

          // 6.5 弾幕よけアイテム (user_item / danmaku_item)
          if (parsed.danmakuItems && typeof parsed.danmakuItems === 'object') {
            loadedData.danmakuItems = { ...(loadedData.danmakuItems || {}), ...parsed.danmakuItems };
          }
          if (parsed.activeDanmakuItems && typeof parsed.activeDanmakuItems === 'object') {
            loadedData.activeDanmakuItems = { ...(loadedData.activeDanmakuItems || {}), ...parsed.activeDanmakuItems };
          }

          // 7. アイテム・宝箱・エレメント (user_item)
          if (parsed.repairKits !== undefined) loadedData.repairKits = Number(parsed.repairKits);
          if (parsed.unopenedChests && typeof parsed.unopenedChests === 'object') {
            loadedData.unopenedChests = { ...(loadedData.unopenedChests || {}), ...parsed.unopenedChests };
          }
          if (parsed.battleElements !== undefined) loadedData.battleElements = Number(parsed.battleElements);

          // 8. ミニゲーム進捗 (user_minigame_status)
          if (parsed.minigameRecords && typeof parsed.minigameRecords === 'object') {
            loadedData.minigameRecords = { ...(loadedData.minigameRecords || {}), ...parsed.minigameRecords };
          }

          // 9. デイリー制限 (complete_daily_minigame)
          if (parsed.dailyBattleLimits && typeof parsed.dailyBattleLimits === 'object') {
            loadedData.dailyBattleLimits = { ...(loadedData.dailyBattleLimits || {}), ...parsed.dailyBattleLimits };
          }

          // 10. 納品履歴 (complete_requests)
          if (parsed.deliveredLogs && Array.isArray(parsed.deliveredLogs) && parsed.deliveredLogs.length > 0) {
            loadedData.deliveredLogs = parsed.deliveredLogs;
          }

          // 11. 進行中タスク (active_expeditions, active_robot_assemblies, active_part_crafts)
          if (parsed.activeQuest !== undefined) loadedData.activeQuest = parsed.activeQuest;
          if (parsed.activeRobotAssembly !== undefined) loadedData.activeRobotAssembly = parsed.activeRobotAssembly;
          if (parsed.activePartCraft !== undefined) loadedData.activePartCraft = parsed.activePartCraft;

          const userObj = parsed.user ? {
            ...parsed.user,
            received_initial_bonus: bonusVal
          } : undefined;

          return {
            data: (Object.keys(loadedData).length > 0 ? loadedData : null) as GameState | null,
            received_initial_bonus: bonusVal,
            user: userObj
          };
        }
      } catch (err: any) {
        console.warn(`[AuthApiService] ロード通信失敗 (${endpoint}):`, err.message);
      }
    }

    return { data: null, received_initial_bonus: 0 };
  }

  /**
   * user_materialテーブルから最新の素材情報を取得
   * @param userId usersテーブルのgoogle_idまたはid
   */
  public async getMaterials(userId: string): Promise<AuthApiResponse<Record<string, number>>> {
    if (!userId) {
      return { success: false, error: 'userId is required' };
    }

    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/get_materials.php?userId=${encodeURIComponent(userId)}`,
      `https://robotfactory.k0j1.v2002.coreserver.jp/api/get_materials.php?userId=${encodeURIComponent(userId)}`,
      `/api/get_materials.php?userId=${encodeURIComponent(userId)}`
    ])).filter(Boolean);

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          continue;
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          continue;
        }

        const parsed = JSON.parse(rawText);
        if (parsed.success && parsed.materials) {
          return {
            success: true,
            data: parsed.materials
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return {
      success: false,
      error: lastError ? lastError.message : '素材情報の取得に失敗しました。'
    };
  }

  /**
   * active_expeditions および active_robot_assemblies テーブルから他のユーザーのアクティブ人数を取得
   * @param userId 自身のuserId（指定した場合は自分以外のユーザーが集計される）
   */
  public async getActiveCounts(userId?: string): Promise<AuthApiResponse<ActiveCountsData>> {
    const queryParam = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    const endpoints = Array.from(new Set([
      `${this.defaultBaseUrl}/api/active_counts.php${queryParam}`,
      `https://robotfactory.k0j1.v2002.coreserver.jp/api/active_counts.php${queryParam}`,
      `/api/active_counts.php${queryParam}`
    ])).filter(Boolean);

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          continue;
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          continue;
        }

        const parsed = JSON.parse(rawText);
        if (parsed.success) {
          return {
            success: true,
            data: {
              expeditions: parsed.expeditions || {},
              robotAssemblies: Number(parsed.robotAssemblies || 0),
              robotDisassemblies: Number(parsed.robotDisassemblies || 0),
              requests: parsed.requests || {},
              requestsByRank: parsed.requestsByRank || {},
              playingUsers: Number(parsed.playingUsers || 0)
            }
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return {
      success: false,
      error: lastError ? lastError.message : 'アクティブ人数の取得に失敗しました。',
      data: {
        expeditions: {},
        robotAssemblies: 0,
        robotDisassemblies: 0,
        requests: {},
        requestsByRank: {},
        playingUsers: 0
      }
    };
  }

  /**
   * 遠征地の解放（user_workshop_statusテーブルのgold減額、consumed_gold増額、unlocked_expeditions更新）
   */
  public async unlockExpedition(userId: string, locationId: string): Promise<AuthApiResponse<{ gold: number; consumed_gold: number; unlocked_expeditions: string[] }>> {
    const endpoints = this.getAllEndpoints('/api/unlock_expedition.php');
    let lastError: any = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ userId, locationId })
        });

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) continue;

        const parsed = JSON.parse(rawText);
        if (response.ok && parsed.success) {
          return {
            success: true,
            data: {
              gold: parsed.gold,
              consumed_gold: parsed.consumed_gold,
              unlocked_expeditions: parsed.unlocked_expeditions
            }
          };
        } else {
          return {
            success: false,
            error: parsed.error || '遠征地の解放に失敗しました。'
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return {
      success: false,
      error: lastError ? lastError.message : 'サーバーとの通信に失敗しました。'
    };
  }

  /**
   * 工房名声（user_workshop_status.fame）を直接アトミックに加算
   */
  public async addFame(userId: string, amount: number, reason?: string): Promise<AuthApiResponse<{ fame: number; gained: number }>> {
    if (amount <= 0) {
      return { success: true, data: { fame: 0, gained: 0 } };
    }
    const endpoints = this.getAllEndpoints('/api/add_fame.php');
    let lastError: any = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ userId, amount, reason })
        });

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) continue;

        const parsed = JSON.parse(rawText);
        if (response.ok && parsed.success) {
          return {
            success: true,
            data: {
              fame: parsed.fame,
              gained: parsed.gained
            }
          };
        } else {
          return {
            success: false,
            error: parsed.error || '名声の加算に失敗しました。'
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return {
      success: false,
      error: lastError ? lastError.message : 'サーバーとの通信に失敗しました。'
    };
  }
}


