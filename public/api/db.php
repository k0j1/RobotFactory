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
