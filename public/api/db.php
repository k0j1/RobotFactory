<?php
// CORS headers - 開発中のローカルホストアクセス等を許可
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// プリフライトリクエスト処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 動的生成された設定ファイルを読み込む
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} else {
    // デフォルト・環境変数からのフォールバック
    if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: '');
    if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: '');
    if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') ?: '');
}

// PDOオブジェクトの取得
function getDB() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

/**
 * 遠征地マスターテーブル（master_expeditions）の存在と初期データの登録を確実に保証する
 */
function ensureMasterExpeditions($pdo) {
    if (!$pdo) return;
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS master_expeditions (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                unlock_cost INT DEFAULT 0,
                duration_seconds INT DEFAULT 0,
                required_fame INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        $expeditions = [
            ['id' => 'loc1', 'name' => '裏山のスクラップ場', 'unlock_cost' => 0, 'duration_seconds' => 1800, 'required_fame' => 0],
            ['id' => 'loc2', 'name' => '灼熱の廃工場', 'unlock_cost' => 200, 'duration_seconds' => 3600, 'required_fame' => 10],
            ['id' => 'loc3', 'name' => '水没した都市遺跡', 'unlock_cost' => 500, 'duration_seconds' => 7200, 'required_fame' => 30],
            ['id' => 'loc4', 'name' => '風の谷の観測所', 'unlock_cost' => 1000, 'duration_seconds' => 10800, 'required_fame' => 50],
            ['id' => 'loc5', 'name' => '光の塔', 'unlock_cost' => 2000, 'duration_seconds' => 14400, 'required_fame' => 100],
            ['id' => 'loc6', 'name' => '最果てのクレーター', 'unlock_cost' => 4000, 'duration_seconds' => 18000, 'required_fame' => 200],
            ['id' => 'loc7', 'name' => '古代文明の中枢', 'unlock_cost' => 10000, 'duration_seconds' => 36000, 'required_fame' => 500],
        ];

        $stmt = $pdo->prepare("
            INSERT INTO master_expeditions (id, name, unlock_cost, duration_seconds, required_fame) 
            VALUES (:id, :name, :cost, :duration, :fame)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name), unlock_cost = VALUES(unlock_cost), 
                duration_seconds = VALUES(duration_seconds), required_fame = VALUES(required_fame)
        ");
        foreach ($expeditions as $exp) {
            $stmt->execute([
                ':id' => $exp['id'],
                ':name' => $exp['name'],
                ':cost' => $exp['unlock_cost'],
                ':duration' => $exp['duration_seconds'],
                ':fame' => $exp['required_fame']
            ]);
        }
    } catch (Exception $e) {
        error_log("ensureMasterExpeditions failed: " . $e->getMessage());
    }
}

/**
 * usersテーブルのgoogle_idを親キーとして、関連する24テーブルに外部キー制約（ON DELETE CASCADE ON UPDATE CASCADE）を設定・保証する
 */
function ensureUserForeignKeys($pdo) {
    if (!$pdo) return;

    // 対象24テーブルと外部キー制約名
    $userForeignKeyTables = [
        'user_item' => 'fk_user_item_user_id',
        'user_material' => 'fk_user_material_user_id',
        'user_minigame_status' => 'fk_user_minigame_status_user_id',
        'user_parts' => 'fk_user_parts_user_id',
        'user_robots' => 'fk_user_robots_user_id',
        'user_workshop_status' => 'fk_user_workshop_status_user_id',
        'save_data' => 'fk_save_data_user_id',
        'minigame_rankings' => 'fk_minigame_rankings_user_id',
        'daily_cleared_minigame' => 'fk_daily_cleared_minigame_user_id',
        'complete_robot_disassemblies' => 'fk_complete_robot_disassemblies_user_id',
        'complete_robot_assemblies' => 'fk_complete_robot_assemblies_user_id',
        'complete_requests' => 'fk_complete_requests_user_id',
        'complete_part_recycles' => 'fk_complete_part_recycles_user_id',
        'complete_part_crafts' => 'fk_complete_part_crafts_user_id',
        'complete_parts' => 'fk_complete_parts_user_id',
        'complete_expeditions' => 'fk_complete_expeditions_user_id',
        'complete_deliveries' => 'fk_complete_deliveries_user_id',
        'completed_robots' => 'fk_completed_robots_user_id',
        'active_robot_disassemblies' => 'fk_active_robot_disassemblies_user_id',
        'active_robot_assemblies' => 'fk_active_robot_assemblies_user_id',
        'active_requests' => 'fk_active_requests_user_id',
        'active_part_recycles' => 'fk_active_part_recycles_user_id',
        'active_part_crafts' => 'fk_active_part_crafts_user_id',
        'active_expeditions' => 'fk_active_expeditions_user_id',
    ];

    try {
        // 1. users テーブルの存在と google_id の UNIQUE / VARCHAR(255) 定義を保証
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                google_id VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255),
                name VARCHAR(255),
                picture TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // 2. 既存の外部キー制約一覧を取得
        $existingFks = [];
        try {
            $fkStmt = $pdo->query("
                SELECT TABLE_NAME, CONSTRAINT_NAME 
                FROM information_schema.TABLE_CONSTRAINTS 
                WHERE CONSTRAINT_SCHEMA = DATABASE() 
                  AND CONSTRAINT_TYPE = 'FOREIGN KEY'
            ");
            if ($fkStmt) {
                while ($row = $fkStmt->fetch(PDO::FETCH_ASSOC)) {
                    $existingFks[$row['TABLE_NAME']][$row['CONSTRAINT_NAME']] = true;
                }
            }
        } catch (Throwable $e) {}

        // 3. 各対象テーブルに対してカラム型統一・クリーンアップ・外部キー制約付与
        foreach ($userForeignKeyTables as $tableName => $fkName) {
            // テーブルが存在するか確認
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE '{$tableName}'");
                if (!$checkTable || $checkTable->rowCount() === 0) {
                    continue;
                }
            } catch (Throwable $e) {
                continue;
            }

            // user_id カラムのデータ型を VARCHAR(255) NOT NULL に統一（users.google_id と完全一致）
            try {
                $pdo->exec("ALTER TABLE `{$tableName}` MODIFY COLUMN `user_id` VARCHAR(255) NOT NULL");
            } catch (Throwable $e) {}

            // users.id（連番ID文字列）が user_id に格納されていた古い互換レコードがあれば users.google_id に更新
            try {
                $pdo->exec("
                    UPDATE `{$tableName}` t
                    JOIN users u ON t.user_id = CAST(u.id AS CHAR)
                    SET t.user_id = u.google_id
                    WHERE t.user_id NOT IN (SELECT google_id FROM users)
                ");
            } catch (Throwable $e) {}

            // users テーブルに親キーが存在しない孤立レコード（空文字・NULL・削除済等）は事前に削除して外部キー整合性を保護
            try {
                $pdo->exec("
                    DELETE FROM `{$tableName}`
                    WHERE user_id IS NULL 
                       OR user_id = '' 
                       OR user_id NOT IN (SELECT google_id FROM users)
                ");
            } catch (Throwable $e) {}

            // すでに外部キー制約が存在していればスキップ
            if (!empty($existingFks[$tableName][$fkName])) {
                continue;
            }

            // 外部キー制約の追加 (ON DELETE CASCADE ON UPDATE CASCADE)
            try {
                $pdo->exec("
                    ALTER TABLE `{$tableName}`
                    ADD CONSTRAINT `{$fkName}`
                    FOREIGN KEY (`user_id`) REFERENCES `users` (`google_id`)
                    ON DELETE CASCADE ON UPDATE CASCADE
                ");
            } catch (Throwable $e) {
                error_log("ensureUserForeignKeys failed for {$tableName} ({$fkName}): " . $e->getMessage());
            }
        }
    } catch (Throwable $e) {
        error_log("ensureUserForeignKeys fatal error: " . $e->getMessage());
    }
}
