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
}

export class AuthApiService {
  private static instance: AuthApiService | null = null;
  private readonly defaultBaseUrl: string;

  private constructor() {
    // 環境変数があれば最優先、なければ本番CoreServerのURLを定義
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (envBaseUrl) {
      this.defaultBaseUrl = envBaseUrl.replace(/\/+$/, '');
    } else if (typeof window !== 'undefined' && window.location.hostname.includes('coreserver.jp')) {
      // CoreServer上でホストされている場合は同オリジン相対パス
      this.defaultBaseUrl = '';
    } else {
      // 開発環境、プレビュー環境等では直接CoreServerのAPIサーバーに接続（CORS許可済み）
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

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const rawText = await response.text();
        if (rawText.trim().startsWith('<?php')) {
          throw new Error('PHPが未実行です。');
        }

        const parsed = JSON.parse(rawText);
        if (!parsed.success) {
          throw new Error(parsed.error || 'テーブルへの保存に失敗しました。');
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
    throw lastError || new Error('適切なテーブルへの保存通信に失敗しました。');
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
            : 0;

          let loadedData: Partial<GameState> = parsed.data || {};
          // user_materialテーブル由来の素材データを最優先反映
          if (parsed.materials && typeof parsed.materials === 'object') {
            loadedData.materials = {
              ...(loadedData.materials || {}),
              ...parsed.materials
            };
          }

          return {
            data: (Object.keys(loadedData).length > 0 ? loadedData : null) as GameState | null,
            received_initial_bonus: bonusVal,
            user: parsed.user
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
}
