export const APP_DB_VERSION = 'v0.1.29';

export class VersionCheckService {
  private static versionMismatch = false;
  private static errorMessage: string | null = null;
  private static isChecking = false;
  private static listeners: Array<(mismatch: boolean, msg: string | null) => void> = [];

  public static async checkVersion(): Promise<boolean> {
    if (this.versionMismatch) return false; // すでに不一致が判明している場合は何もしない
    if (this.isChecking) return !this.versionMismatch;

    this.isChecking = true;
    try {
      const serverUrl = localStorage.getItem('admin_target_server_url') || 'https://robotfactory.k0j1.v2002.coreserver.jp';
      
      const res = await fetch(`${serverUrl}/api/version.php`, {
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.version && data.version !== APP_DB_VERSION) {
          this.versionMismatch = true;
          this.errorMessage = `データベース(API)のバージョンが異なります。\nフロントエンド: ${APP_DB_VERSION}\nバックエンド: ${data.version}`;
          this.notifyListeners();
          return false;
        }
      } else {
        if (res.status === 404) {
          this.versionMismatch = true;
          this.errorMessage = `データベース(API)のバージョン確認ファイルが見つかりません。最新のバックエンド環境に更新してください。(想定: ${APP_DB_VERSION})`;
          this.notifyListeners();
          return false;
        }
      }
    } catch (e) {
      console.warn('Version check failed:', e);
      // ネットワークエラー等の場合は前回の状態を維持するか、とりあえずスルーする
      this.isChecking = false;
      return !this.versionMismatch;
    } finally {
      this.isChecking = false;
    }
    
    // 正常にバージョン一致を確認できた場合
    this.versionMismatch = false;
    this.errorMessage = null;
    this.notifyListeners();
    return true;
  }

  public static isMismatch(): boolean {
    return this.versionMismatch;
  }

  public static getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public static subscribe(listener: (mismatch: boolean, msg: string | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(l => l(this.versionMismatch, this.errorMessage));
  }
}
