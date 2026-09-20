<?php
/**
 * @file add_fame.php
 * @description 工房名声（user_workshop_status.fame）を直接アトミックに加算するAPI
 * バトル勝利時や依頼納品時、宝箱開封ボーナス等で即時かつ確実に名声をDBに永続化します。
 */

require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$userId = $data['userId'] ?? $data['user_id'] ?? null;
$amount = isset($data['amount']) ? (int)$data['amount'] : (isset($data['fame']) ? (int)$data['fame'] : 0);
$reason = $data['reason'] ?? '名声加算';

if (!$userId || $amount <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => "Invalid parameters. 'userId' and positive 'amount' are required."
    ]);
    exit;
}

$pdo = getDB();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database connection unavailable."]);
    exit;
}

try {
    // 1. usersテーブルから該当ユーザーのgoogle_idを特定
    $userStmt = $pdo->prepare("SELECT google_id, id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $userRecord = $userStmt->fetch();

    $actualUserId = $userId;
    if ($userRecord && !empty($userRecord['google_id'])) {
        $actualUserId = $userRecord['google_id'];
    }

    // テーブルの存在を事前に保証
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_workshop_status (
            user_id VARCHAR(255) PRIMARY KEY,
            fame INT DEFAULT 0,
            gold INT DEFAULT 0,
            consumed_gold INT DEFAULT 0,
            storage_limit INT DEFAULT 0,
            delivered_count INT DEFAULT 0,
            received_initial_bonus BOOLEAN DEFAULT FALSE,
            request_earned_gold INT DEFAULT 0,
            unlocked_expeditions JSON,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 2. user_workshop_status テーブルの fame をアトミックに加算 (UPSERT)
    // 既存レコードがない場合は amount で作成、ある場合は fame + amount で更新
    $addStmt = $pdo->prepare("
        INSERT INTO user_workshop_status (user_id, fame, storage_limit, unlocked_expeditions)
        VALUES (:user_id, :amount, 5, '[\"loc1\"]')
        ON DUPLICATE KEY UPDATE 
            fame = COALESCE(fame, 0) + :up_amount
    ");
    $addStmt->execute([
        ':user_id' => $actualUserId,
        ':amount' => $amount,
        ':up_amount' => $amount
    ]);

    // 3. 最新の fame を取得して返却
    $getStmt = $pdo->prepare("SELECT fame FROM user_workshop_status WHERE user_id = :user_id LIMIT 1");
    $getStmt->execute([':user_id' => $actualUserId]);
    $row = $getStmt->fetch(PDO::FETCH_ASSOC);
    $currentFame = $row ? (int)$row['fame'] : $amount;

    echo json_encode([
        "success" => true,
        "userId" => $actualUserId,
        "gained" => $amount,
        "fame" => $currentFame,
        "reason" => $reason
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database error: " . $e->getMessage()
    ]);
}
