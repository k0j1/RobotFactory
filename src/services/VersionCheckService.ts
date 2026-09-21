export const APP_DB_VERSION = 'v0.13';

/**
 * バージョン文字列の表記揺れ（V0.2 / Ver.0.2 / v0.2 等）を正規化して比較する
 */
const normalizeVersion = (ver: string): string => {
  return ver.trim().toLowerCase().replace(/^ver\.?/, '').replace(/^v/, '');
};

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
        if (data && data.version && normalizeVersion(data.version) !== normalizeVersion(APP_DB_VERSION)) {
          this.versionMismatch = true;
          this.errorMessage = `アプリの更新があります。\n現在のバージョン: ${APP_DB_VERSION}\n最新バージョン: ${data.version}`;
          this.notifyListeners();
          return false;
        }
      } else {
        if (res.status === 404) {
          this.versionMismatch = true;
          this.errorMessage = `アプリの更新があります。最新の環境に更新してください。(想定: ${APP_DB_VERSION})`;
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
