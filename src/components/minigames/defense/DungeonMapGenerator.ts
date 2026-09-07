import { DungeonMap, GridTile, Point } from './types';

export class DungeonMapGenerator {
  private readonly cols: number = 16;
  private readonly rows: number = 12;
  private readonly cellSize: number = 50;

  /**
   * ステージと配備上限数に応じたダンジョンマップを生成
   * 防衛戦を開始するたびに毎回異なるルートと地形が生成されます
   */
  public generate(stageId: string, maxRobots: number, mapSeed: number = Date.now()): DungeonMap {
    // 1. タイルグリッドの初期化（全域を草地/森林/岩壁で初期化）
    const tiles: GridTile[][] = [];
    for (let y = 0; y < this.rows; y++) {
      tiles[y] = [];
      for (let x = 0; x < this.cols; x++) {
        tiles[y][x] = {
          x,
          y,
          type: 'wall',
          iconName: this.getWallIcon(x, y, mapSeed),
          variant: (x * 7 + y * 13 + (mapSeed % 17)) % 4,
        };
      }
    }

    // 2. ステージと乱数シードに応じたウェイポイント（グリッド座標）の選定
    const keyGridPoints: Point[] = this.getRandomStageRoute(stageId, mapSeed);

    // 3. ウェイポイント間を接続して通路（floor）タイルのグリッドセル列を生成
    const pathGridCells: Point[] = this.rasterizeRoute(keyGridPoints);

    for (const cell of pathGridCells) {
      if (cell.x >= 0 && cell.x < this.cols && cell.y >= 0 && cell.y < this.rows) {
        tiles[cell.y][cell.x] = {
          x: cell.x,
          y: cell.y,
          type: 'floor',
          iconName: 'GiStonePath',
          variant: 0,
        };
      }
    }

    // 4. 入口（SPAWN）と防衛拠点（BASE）のタイル設定
    const startCell = pathGridCells[0];
    const endCell = pathGridCells[pathGridCells.length - 1];

    if (startCell) {
      tiles[startCell.y][startCell.x] = {
        x: startCell.x,
        y: startCell.y,
        type: 'spawn',
        iconName: 'GiRadarDish',
        variant: 0,
      };
    }

    if (endCell) {
      tiles[endCell.y][endCell.x] = {
        x: endCell.x,
        y: endCell.y,
        type: 'base',
        iconName: 'GiCastleRuins',
        variant: 0,
      };
    }

    // 5. ロボット配備台座（TOWER_SPOT）を通路沿いの最適な位置に自動選定
    const candidateSpots: { pt: Point; score: number }[] = [];

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x = 1; x < this.cols - 1; x++) {
        if (tiles[y][x].type === 'wall') {
          // 隣接する通路マスの数を評価（射程カバー率）
          let adjacentPathCount = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < this.rows && nx >= 0 && nx < this.cols) {
                if (
                  tiles[ny][nx].type === 'floor' ||
                  tiles[ny][nx].type === 'spawn' ||
                  tiles[ny][nx].type === 'base'
                ) {
                  adjacentPathCount++;
                }
              }
            }
          }
          if (adjacentPathCount >= 2) {
            // 中央寄り（画面端で見切れない安全エリア）を好むボーナス
            const centerDist = Math.hypot(x - this.cols / 2, y - this.rows / 2);
            const centerBonus = Math.max(0, 10 - centerDist);
            candidateSpots.push({
              pt: { x, y },
              score: adjacentPathCount * 4 + centerBonus,
            });
          }
        }
      }
    }

    // スコア順にソートし、適度な間隔を空けて全域をカバーするように選出
    candidateSpots.sort((a, b) => b.score - a.score);
    const selectedSpots: Point[] = [];

    for (const cand of candidateSpots) {
      if (selectedSpots.length >= maxRobots) break;
      const tooClose = selectedSpots.some(
        s => Math.hypot(s.x - cand.pt.x, s.y - cand.pt.y) < 2.8
      );
      if (!tooClose) {
        selectedSpots.push(cand.pt);
      }
    }

    // 足りない場合は間隔を少し緩めて必ず必要機体数分を確保
    if (selectedSpots.length < maxRobots) {
      for (const cand of candidateSpots) {
        if (selectedSpots.length >= maxRobots) break;
        const tooClose = selectedSpots.some(
          s => Math.hypot(s.x - cand.pt.x, s.y - cand.pt.y) < 1.6
        );
        if (!tooClose && !selectedSpots.some(s => s.x === cand.pt.x && s.y === cand.pt.y)) {
          selectedSpots.push(cand.pt);
        }
      }
    }

    // 選定されたマスを「防衛する工房（endCell）に近い順」にソート
    // これにより、towerPositions[0] が最も工房に近く、Powerが強いロボットが自動的に工房最至近ラインに配置されます
    selectedSpots.sort((a, b) => {
      const distA = Math.hypot(a.x - endCell.x, a.y - endCell.y);
      const distB = Math.hypot(b.x - endCell.x, b.y - endCell.y);
      return distA - distB;
    });

    // 選定されたマスをタワースポットに指定
    const towerPositions: Point[] = [];
    selectedSpots.forEach((spot, idx) => {
      tiles[spot.y][spot.x] = {
        x: spot.x,
        y: spot.y,
        type: 'tower_spot',
        iconName: 'GiWatchtower',
        variant: 0,
        towerIndex: idx,
        texture: '/assets/kenney/tiles/towerDefense_tile268.png',
      };
      // ピクセル座標の中心位置
      towerPositions.push({
        x: spot.x * this.cellSize + this.cellSize / 2,
        y: spot.y * this.cellSize + this.cellSize / 2,
      });
    });

    // 6. Kenney公式タイルのテクスチャを経路接続に基いて完璧にアサイン
    this.assignKenneyTextures(tiles, pathGridCells);

    // 7. 敵が進行するピクセル座標パスの作成（入口の画面外 -12px から最初のセルへ確実に前進）
    const pathPoints: Point[] = [
      { x: -12, y: startCell.y * this.cellSize + this.cellSize / 2 },
    ];

    for (const cell of pathGridCells) {
      pathPoints.push({
        x: cell.x * this.cellSize + this.cellSize / 2,
        y: cell.y * this.cellSize + this.cellSize / 2,
      });
    }

    return {
      width: this.cols,
      height: this.rows,
      cellSize: this.cellSize,
      tiles,
      pathPoints,
      towerPositions,
    };
  }

  /**
   * ステージとシードに基づき、毎回異なる面白いルートを動的生成
   */
  private getRandomStageRoute(stageId: string, seed: number): Point[] {
    const patterns: Record<string, Point[][]> = {
      stage1: [
        // パターンA: スタンダードS字
        [
          { x: 0, y: 3 },
          { x: 5, y: 3 },
          { x: 5, y: 8 },
          { x: 10, y: 8 },
          { x: 10, y: 4 },
          { x: 15, y: 4 },
        ],
        // パターンB: 下部迂回クランク
        [
          { x: 0, y: 2 },
          { x: 7, y: 2 },
          { x: 7, y: 9 },
          { x: 12, y: 9 },
          { x: 12, y: 6 },
          { x: 15, y: 6 },
        ],
        // パターンC: 上部迂回Uターン
        [
          { x: 0, y: 8 },
          { x: 6, y: 8 },
          { x: 6, y: 2 },
          { x: 11, y: 2 },
          { x: 11, y: 7 },
          { x: 15, y: 7 },
        ],
        // パターンD: 階段状ステップ
        [
          { x: 0, y: 2 },
          { x: 4, y: 2 },
          { x: 4, y: 5 },
          { x: 9, y: 5 },
          { x: 9, y: 8 },
          { x: 15, y: 8 },
        ],
      ],
      stage2: [
        // パターンA: 3段ジグザグ
        [
          { x: 0, y: 2 },
          { x: 4, y: 2 },
          { x: 4, y: 9 },
          { x: 8, y: 9 },
          { x: 8, y: 3 },
          { x: 12, y: 3 },
          { x: 12, y: 8 },
          { x: 15, y: 8 },
        ],
        // パターンB: 外周回り込み
        [
          { x: 0, y: 9 },
          { x: 3, y: 9 },
          { x: 3, y: 2 },
          { x: 12, y: 2 },
          { x: 12, y: 6 },
          { x: 7, y: 6 },
          { x: 7, y: 10 },
          { x: 15, y: 10 },
        ],
        // パターンC: ダブルループ
        [
          { x: 0, y: 4 },
          { x: 5, y: 4 },
          { x: 5, y: 1 },
          { x: 10, y: 1 },
          { x: 10, y: 10 },
          { x: 13, y: 10 },
          { x: 13, y: 5 },
          { x: 15, y: 5 },
        ],
      ],
      stage3: [
        // パターンA: 大螺旋スパイラル
        [
          { x: 0, y: 1 },
          { x: 14, y: 1 },
          { x: 14, y: 10 },
          { x: 2, y: 10 },
          { x: 2, y: 4 },
          { x: 10, y: 4 },
          { x: 10, y: 7 },
          { x: 15, y: 7 },
        ],
        // パターンB: 迷宮二重クランク
        [
          { x: 0, y: 10 },
          { x: 4, y: 10 },
          { x: 4, y: 2 },
          { x: 8, y: 2 },
          { x: 8, y: 9 },
          { x: 12, y: 9 },
          { x: 12, y: 3 },
          { x: 15, y: 3 },
        ],
        // パターンC: S字＋外周ループ
        [
          { x: 0, y: 2 },
          { x: 12, y: 2 },
          { x: 12, y: 6 },
          { x: 3, y: 6 },
          { x: 3, y: 10 },
          { x: 9, y: 10 },
          { x: 9, y: 8 },
          { x: 15, y: 8 },
        ],
      ],
      stage4: [
        // パターンA: 4段ジグザグ・大渓谷一本道
        [
          { x: 0, y: 1 },
          { x: 13, y: 1 },
          { x: 13, y: 4 },
          { x: 2, y: 4 },
          { x: 2, y: 8 },
          { x: 14, y: 8 },
          { x: 14, y: 10 },
          { x: 15, y: 10 },
        ],
        // パターンB: 外周蛇行ロングウェイ
        [
          { x: 0, y: 10 },
          { x: 5, y: 10 },
          { x: 5, y: 3 },
          { x: 10, y: 3 },
          { x: 10, y: 9 },
          { x: 13, y: 9 },
          { x: 13, y: 5 },
          { x: 15, y: 5 },
        ],
      ],
      stage5: [
        // パターンA: 最終防衛大回廊（長距離一本道）
        [
          { x: 0, y: 2 },
          { x: 4, y: 2 },
          { x: 4, y: 9 },
          { x: 8, y: 9 },
          { x: 8, y: 2 },
          { x: 12, y: 2 },
          { x: 12, y: 9 },
          { x: 15, y: 9 },
        ],
        // パターンB: 終焉のインフィニティ一本道
        [
          { x: 0, y: 9 },
          { x: 14, y: 9 },
          { x: 14, y: 5 },
          { x: 2, y: 5 },
          { x: 2, y: 1 },
          { x: 15, y: 1 },
        ],
      ],
    };

    const stageKey = stageId in patterns ? stageId : 'stage1';
    const list = patterns[stageKey];
    const index = Math.abs(seed) % list.length;
    return list[index];
  }

  /**
   * ウェイポイント間を直線（マンハッタン距離）で補間してセルのリストを作成
   */
  private rasterizeRoute(points: Point[]): Point[] {
    const cells: Point[] = [];
    const added = new Set<string>();

    const addCell = (x: number, y: number) => {
      const key = `${x},${y}`;
      if (!added.has(key)) {
        added.add(key);
        cells.push({ x, y });
      }
    };

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      let cx = p1.x;
      let cy = p1.y;
      addCell(cx, cy);

      // x軸移動
      while (cx !== p2.x) {
        cx += p2.x > cx ? 1 : -1;
        addCell(cx, cy);
      }
      // y軸移動
      while (cy !== p2.y) {
        cy += p2.y > cy ? 1 : -1;
        addCell(cx, cy);
      }
    }

    return cells;
  }

  /**
   * Kenney公式タイルのテクスチャを厳密な幾何学接続でアサイン
   */
  private assignKenneyTextures(tiles: GridTile[][], pathCells: Point[]): void {
    // 1. まず全壁タイルに豊かな自然テクスチャを設定（Kenney公式タイル実在パス）
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const tile = tiles[y][x];
        if (tile.type === 'wall') {
          const variant = (x * 13 + y * 7) % 10;
          if (variant === 0) {
            tile.texture = '/assets/kenney/tiles/towerDefense_tile098.png'; // 砂地・荒野
          } else if (variant % 3 === 0) {
            tile.texture = '/assets/kenney/tiles/towerDefense_tile130.png'; // 深緑草地
          } else {
            tile.texture = '/assets/kenney/tiles/towerDefense_tile024.png'; // 基本草地
          }
        } else if (tile.type === 'tower_spot') {
          tile.texture = '/assets/kenney/tiles/towerDefense_tile268.png'; // コンクリート台座
        }
      }
    }

    // 2. パス上の各セルについて、進入元（prev）と退出先（next）の幾何学的方向から正確な道路タイルを割り当てる
    for (let i = 0; i < pathCells.length; i++) {
      const cur = pathCells[i];
      const prev = i > 0 ? pathCells[i - 1] : null;
      const next = i < pathCells.length - 1 ? pathCells[i + 1] : null;

      const tile = tiles[cur.y][cur.x];

      // 接続している方向のフラグ
      let hasNorth = false;
      let hasSouth = false;
      let hasEast = false;
      let hasWest = false;

      if (prev) {
        if (prev.x < cur.x) hasWest = true;
        else if (prev.x > cur.x) hasEast = true;
        else if (prev.y < cur.y) hasNorth = true;
        else if (prev.y > cur.y) hasSouth = true;
      }

      if (next) {
        if (next.x < cur.x) hasWest = true;
        else if (next.x > cur.x) hasEast = true;
        else if (next.y < cur.y) hasNorth = true;
        else if (next.y > cur.y) hasSouth = true;
      }

      // 端点（始点または終点）の場合の補完
      if (!prev && next) {
        // 始点: nextの反対側からも繋がっているとみなして綺麗な直線を維持
        if (hasEast) hasWest = true;
        else if (hasWest) hasEast = true;
        else if (hasSouth) hasNorth = true;
        else if (hasNorth) hasSouth = true;
      } else if (!next && prev) {
        // 終点: prevの反対側からも繋がっているとみなす
        if (hasEast) hasWest = true;
        else if (hasWest) hasEast = true;
        else if (hasSouth) hasNorth = true;
        else if (hasNorth) hasSouth = true;
      }

      // タイルテクスチャの決定（Kenney公式土道タイル実在パス）
      if (hasNorth && hasSouth) {
        // 垂直直線道路
        tile.texture = '/assets/kenney/tiles/towerDefense_tile093.png';
      } else if (hasEast && hasWest) {
        // 水平直線道路
        tile.texture = '/assets/kenney/tiles/towerDefense_tile093.png';
      } else if (hasNorth && hasEast) {
        // 上と右がつながるコーナー（Upper-Right）
        tile.texture = '/assets/kenney/tiles/towerDefense_tile026.png';
      } else if (hasNorth && hasWest) {
        // 上と左がつながるコーナー（Upper-Left）
        tile.texture = '/assets/kenney/tiles/towerDefense_tile027.png';
      } else if (hasSouth && hasEast) {
        // 下と右がつながるコーナー（Lower-Right）
        tile.texture = '/assets/kenney/tiles/towerDefense_tile003.png';
      } else if (hasSouth && hasWest) {
        // 下と左がつながるコーナー（Lower-Left）
        tile.texture = '/assets/kenney/tiles/towerDefense_tile004.png';
      } else {
        tile.texture = '/assets/kenney/tiles/towerDefense_tile093.png';
      }
    }
  }

  /**
   * 野外フィールド地形タイルアイコンのバリエーション選定
   */
  private getWallIcon(x: number, y: number, seed: number): string {
    const hash = (x * 17 + y * 23 + (seed % 31)) % 12;
    if (hash === 0) return 'GiPineTree';
    if (hash === 1) return 'GiForest';
    if (hash === 2) return 'GiTreeFace';
    if (hash === 3) return 'GiRock';
    if (hash === 4) return 'GiStonePile';
    if (hash === 5) return 'GiWheat';
    if (hash === 6) return 'GiWoodCabin';
    return 'GiGrass';
  }
}

