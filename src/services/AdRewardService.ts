/**
 * Google AdSense / H5 Game Ads リワード動画広告管理サービス
 * オブジェクト指向原則に基づき、広告リクエストとフォールバックシミュレーションをカプセル化
 */

export interface AdRewardRequest {
  id: string;
  title: string;
  rewardDescription: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export type AdRewardListener = (request: AdRewardRequest | null) => void;

export const REWARD_PAGE_URL = 'https://takahara-books.com/game/robotfactory/reward-page.html';

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
   * ポップアップ全画面でリワード広告ページを開き、視聴完了後にリワードを付与する
   */
  public requestRewardAd(options: {
    title: string;
    rewardDescription: string;
    taskType?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const { title, rewardDescription, taskType = 'shorten_30m' } = options;

      // 画面の利用可能サイズを取得して全画面ポップアップを設定
      const screenWidth = typeof window !== 'undefined' ? (window.screen.availWidth || window.screen.width || window.innerWidth || 1024) : 1024;
      const screenHeight = typeof window !== 'undefined' ? (window.screen.availHeight || window.screen.height || window.innerHeight || 768) : 768;
      const windowFeatures = `width=${screenWidth},height=${screenHeight},left=0,top=0,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;

      const targetUrl = `${REWARD_PAGE_URL}?type=${encodeURIComponent(taskType)}&t=${Date.now()}`;
      
      let popup: Window | null = null;
      try {
        popup = window.open(targetUrl, 'RobotFactoryRewardAd', windowFeatures);
        if (popup) {
          popup.focus();
        }
      } catch (e) {
        console.warn('[AdRewardService] Failed to open popup directly:', e);
      }

      let isResolved = false;
      let checkTimer: ReturnType<typeof setInterval> | null = null;

      const cleanup = () => {
        if (checkTimer) {
          clearInterval(checkTimer);
          checkTimer = null;
        }
        window.removeEventListener('message', handleMessage);
        window.removeEventListener('storage', handleStorage);
      };

      const finish = (rewarded: boolean) => {
        if (isResolved) return;
        isResolved = true;
        cleanup();
        resolve(rewarded);
      };

      // 1. postMessage による完了通知を受信
      const handleMessage = (event: MessageEvent) => {
        if (event.data && (event.data.type === 'ROBOTFACTORY_REWARD_GRANTED' || event.data.type === 'REWARD_AD_COMPLETED')) {
          console.log('[AdRewardService] Received reward grant message from popup');
          finish(true);
        }
      };
      window.addEventListener('message', handleMessage);

      // 2. localStorage による完了通知を受信
      const handleStorage = (event: StorageEvent) => {
        if (event.key === 'robotfactory_reward_granted') {
          console.log('[AdRewardService] Received reward grant via localStorage');
          finish(true);
        }
      };
      window.addEventListener('storage', handleStorage);

      // 3. ポップアップが閉じられたかをポーリング監視
      if (popup) {
        checkTimer = setInterval(() => {
          try {
            if (popup.closed) {
              console.log('[AdRewardService] Reward popup was closed by user');
              // ポップアップが閉じられたらリワード付与完了とする
              finish(true);
            }
          } catch (e) {
            // cross-origin restrictions might throw on access, ignore
          }
        }, 500);
      } else {
        // ポップアップブロッカー等で開けなかった場合のフォールバック（別タブで開く試行、またはゲーム内シミュレーション）
        console.warn('[AdRewardService] Popup blocked or failed to open. Trying new tab or in-app modal.');
        try {
          const fallbackTab = window.open(targetUrl, '_blank');
          if (fallbackTab) {
            fallbackTab.focus();
            checkTimer = setInterval(() => {
              try {
                if (fallbackTab.closed) {
                  finish(true);
                }
              } catch (e) {}
            }, 500);
            return;
          }
        } catch (e) {}

        this.openSimulationModal(title, rewardDescription, finish);
      }
    });
  }

  /**
   * フォールバック用シミュレーション広告モーダルを開く
   */
  private openSimulationModal(
    title: string,
    rewardDescription: string,
    resolve: (rewarded: boolean) => void
  ): void {
    const requestId = `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.currentRequest = {
      id: requestId,
      title,
      rewardDescription,
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
