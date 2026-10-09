/**
 * Google AdSense / H5 Game Ads リワード動画広告管理サービス
 * オブジェクト指向原則に基づき、広告リクエストとフォールバックシミュレーションをカプセル化
 */

export interface AdRewardRequest {
  id: string;
  title: string;
  rewardDescription: string;
  taskType: string;
  rewardPageUrl: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export type AdRewardListener = (request: AdRewardRequest | null) => void;

export const REWARD_PAGE_URL = 'https://takahara-books.com/game/robotfactory/reward-page.html';
export const LOCAL_REWARD_PAGE_PATH = '/reward-page.html';

class AdRewardService {
  private static instance: AdRewardService;
  private currentRequest: AdRewardRequest | null = null;
  private listeners: AdRewardListener[] = [];

  private constructor() {
    // シングルトン
  }

  public static getInstance(): AdRewardService {
    if (!AdRewardService.instance) {
      AdRewardService.instance = new AdRewardService();
    }
    return AdRewardService.instance;
  }

  /**
   * リワード広告視聴モーダルの状態リスナーを登録
   */
  public subscribe(listener: AdRewardListener): () => void {
    this.listeners.push(listener);
    // 初期状態を即時通知
    listener(this.currentRequest);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentRequest);
      } catch (err) {
        console.error('[AdRewardService] Listener error:', err);
      }
    });
  }

  /**
   * 実行環境に最適な reward-page.html のURLを取得する
   * （外部ブラウザは起動せず、アプリ内モーダルのWebViewフレームに表示する）
   */
  public resolveRewardPageUrl(taskType: string = 'shorten_30m'): string {
    const query = `?type=${encodeURIComponent(taskType)}&inapp=1&t=${Date.now()}`;
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '';
      // takahara-books.com 上で稼働している場合は同一オリジンのパスを参照
      if (host.includes('takahara-books.com')) {
        return `${REWARD_PAGE_URL}${query}`;
      }
    }
    // Capacitor Androidアプリまたは他環境ではアプリ内バンドル済みの /reward-page.html を優先表示
    return `${LOCAL_REWARD_PAGE_PATH}${query}`;
  }

  /**
   * 外部ブラウザを起動せず、アプリ内の全画面リワード広告モーダルで reward-page.html を表示し、
   * 視聴完了後にリワードを付与する
   */
  public requestRewardAd(options: {
    title: string;
    rewardDescription: string;
    taskType?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const { title, rewardDescription, taskType = 'shorten_30m' } = options;
      const rewardPageUrl = this.resolveRewardPageUrl(taskType);

      let isResolved = false;
      const finish = (rewarded: boolean) => {
        if (isResolved) return;
        isResolved = true;
        resolve(rewarded);
      };

      this.openInAppRewardModal(title, rewardDescription, taskType, rewardPageUrl, finish);
    });
  }

  /**
   * アプリ内リワード広告モーダルを開く
   */
  private openInAppRewardModal(
    title: string,
    rewardDescription: string,
    taskType: string,
    rewardPageUrl: string,
    resolve: (rewarded: boolean) => void
  ): void {
    const requestId = `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.currentRequest = {
      id: requestId,
      title,
      rewardDescription,
      taskType,
      rewardPageUrl,
      onSuccess: () => {
        this.currentRequest = null;
        this.notifyListeners();
        resolve(true);
      },
      onCancel: () => {
        this.currentRequest = null;
        this.notifyListeners();
        resolve(false);
      }
    };
    this.notifyListeners();
  }

  /**
   * 現在の広告視聴リクエストを取得
   */
  public getCurrentRequest(): AdRewardRequest | null {
    return this.currentRequest;
  }
}

export const adRewardService = AdRewardService.getInstance();
