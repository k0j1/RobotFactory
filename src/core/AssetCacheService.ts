/**
 * アセットキャッシュ管理サービス (AssetCacheService)
 * 厳格なOOP原則に基づくシングルトンクラス。
 * 起動時に工房ダッシュボードや遠征画面などの背景画像アセットをプリロードし、
 * インメモリにキャッシュを保持することで、画面切り替え時の再読み込みや表示遅延を完全に防ぎます。
 */

export class AssetCacheService {
  private static instance: AssetCacheService | null = null;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private loadPromises: Map<string, Promise<HTMLImageElement>> = new Map();
  private loadedStatus: Map<string, boolean> = new Map();

  private constructor() {
    // シングルトンのため外部からの直接インスタンス化を禁止
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AssetCacheService {
    if (!AssetCacheService.instance) {
      AssetCacheService.instance = new AssetCacheService();
    }
    return AssetCacheService.instance;
  }

  /**
   * 画像URLをプリロードしてインメモリキャッシュに永続化
   * @param src 画像のURLまたはインポートされたパス
   * @returns プリロード完了のPromise
   */
  public preloadImage(src: string): Promise<HTMLImageElement> {
    if (!src) {
      return Promise.reject(new Error('Image src is empty or undefined'));
    }

    // 既にキャッシュおよび読み込みPromiseが存在する場合はそれを返す
    if (this.loadPromises.has(src)) {
      return this.loadPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      try {
        const img = new Image();
        img.src = src;

        // 既にブラウザ側で完了している場合（同期キャッシュヒット）
        if (img.complete) {
          this.imageCache.set(src, img);
          this.loadedStatus.set(src, true);
          resolve(img);
          return;
        }

        img.onload = () => {
          this.imageCache.set(src, img);
          this.loadedStatus.set(src, true);
          resolve(img);
        };

        img.onerror = (err) => {
          console.warn(`[AssetCacheService] Failed to load image: ${src}`, err);
          this.loadedStatus.set(src, false);
          // エラー時もアプリ全体のクラッシュを防ぐためキャッシュマップには登録しつつreject
          reject(err);
        };
      } catch (error) {
        console.error(`[AssetCacheService] Unexpected error during preload: ${src}`, error);
        reject(error);
      }
    });

    this.loadPromises.set(src, promise);
    return promise;
  }

  /**
   * 複数の画像をまとめてプリロード
   * @param srcs 画像URLリスト
   */
  public preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map((src) => this.preloadImage(src).catch((err) => {
      console.warn(`[AssetCacheService] Continue despite single image load error:`, err);
      // 一部の画像ロードが失敗しても他の画像を妨げないようフォールバック
      return this.imageCache.get(src) || new Image();
    })));
  }

  /**
   * 画像がロード完了しているか判定
   */
  public isLoaded(src: string): boolean {
    return this.loadedStatus.get(src) === true;
  }

  /**
   * キャッシュされた Image 要素を取得
   */
  public getImage(src: string): HTMLImageElement | undefined {
    return this.imageCache.get(src);
  }

  /**
   * キャッシュをクリア（必要時）
   */
  public clear(): void {
    this.imageCache.clear();
    this.loadPromises.clear();
    this.loadedStatus.clear();
  }
}
