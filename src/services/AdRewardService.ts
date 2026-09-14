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
   * Google AdSense H5 Game Ads API (window.adBreak) を通じたリワード広告の再生を試みる
   */
  public requestRewardAd(options: {
    title: string;
    rewardDescription: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const { title, rewardDescription } = options;

      // 1. Google AdSense H5 Game Ads API (window.adBreak) の存在チェック
      const win = window as any;
      const hasAdBreak = typeof win.adBreak === 'function';

      if (hasAdBreak) {
        let rewarded = false;
        try {
          win.adBreak({
            type: 'reward',
            name: 'shorten_task_duration',
            beforeAd: () => {
              console.log('[AdRewardService] AdSense adBreak started');
            },
            afterAd: () => {
              console.log('[AdRewardService] AdSense adBreak finished');
            },
            beforeReward: (showAdFn: () => void) => {
              // 広告再生の準備
              if (typeof showAdFn === 'function') {
                showAdFn();
              }
            },
            adViewed: () => {
              console.log('[AdRewardService] AdSense reward viewed successfully');
              rewarded = true;
              resolve(true);
            },
            adDismissed: () => {
              console.log('[AdRewardService] AdSense ad dismissed');
              if (!rewarded) {
                resolve(false);
              }
            },
            adBreakDone: (placementInfo: any) => {
              console.log('[AdRewardService] adBreakDone:', placementInfo);
              if (!rewarded) {
                // 広告枠の取得失敗や未承認・ブロック時はフォールバックのシミュレーション広告UIへ
                console.log('[AdRewardService] Fallback to in-app simulation modal');
                this.openSimulationModal(title, rewardDescription, resolve);
              }
            }
          });
          return;
        } catch (adError) {
          console.warn('[AdRewardService] adBreak invocation failed, fallback to simulation:', adError);
          // エラー時もフォールバックへ
        }
      }

      // 2. adBreak が無い環境（ローカル開発、審査中、広告ブロックなど）のフォールバック
      this.openSimulationModal(title, rewardDescription, resolve);
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
