/**
 * @file AuthApiService.ts
 * @description Googleログイン連携およびusersテーブルへのユーザー情報保存・同期を担当するサービスクラス
 * 厳格なオブジェクト指向プログラミング（OOP）原則に基づき、APIとの通信・永続化ロジックをカプセル化しています。
 */

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
}
