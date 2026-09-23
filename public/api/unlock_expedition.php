<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/db.php';

$pdo = getDB();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$userId = isset($data['userId']) ? trim((string)$data['userId']) : '';
$locationId = isset($data['locationId']) ? trim((string)$data['locationId']) : '';

if (empty($userId) || empty($locationId)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "userId and locationId are required"]);
    exit;
}

try {
    ensureMasterExpeditions($pdo);

    // ユーザー情報の解決
    $uStmt = $pdo->prepare("SELECT google_id, id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $uStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $uRec = $uStmt->fetch();
    $actualUserId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $userId;
    if (!$uRec) {
        try {
            $insU = $pdo->prepare("INSERT IGNORE INTO users (google_id) VALUES (:gid)");
            $insU->execute([':gid' => $actualUserId]);
        } catch (Throwable $e) {}
    }

    // 遠征地マスター情報の取得
    $locStmt = $pdo->prepare("SELECT * FROM master_expeditions WHERE id = :id LIMIT 1");
    $locStmt->execute([':id' => $locationId]);
    $locData = $locStmt->fetch();
    if (!$locData) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Expedition location not found in master"]);
        exit;
    }

    $unlockCost = (int)$locData['unlock_cost'];
    $requiredFame = (int)$locData['required_fame'];

    // ユーザーの工房ステータスを取得
    $wsStmt = $pdo->prepare("SELECT * FROM user_workshop_status WHERE user_id = :uid FOR UPDATE");
    $pdo->beginTransaction();
    $wsStmt->execute([':uid' => $actualUserId]);
    $wsRow = $wsStmt->fetch();

    $currentGold = $wsRow ? (int)$wsRow['gold'] : 0;
    $currentFame = $wsRow ? (int)$wsRow['fame'] : 0;
    $currentConsumed = $wsRow ? (int)$wsRow['consumed_gold'] : 0;
    $unlocked = ['loc1'];
    if ($wsRow && !empty($wsRow['unlocked_expeditions'])) {
        $p = json_decode($wsRow['unlocked_expeditions'], true);
        if (is_array($p)) {
            $unlocked = array_values(array_unique(array_merge(['loc1'], $p)));
        }
    }

    // 既に解放済みかチェック
    if (in_array($locationId, $unlocked)) {
        $pdo->commit();
        echo json_encode([
            "success" => true,
            "message" => "Already unlocked",
            "gold" => $currentGold,
            "consumed_gold" => $currentConsumed,
            "unlocked_expeditions" => $unlocked
        ]);
        exit;
    }

    // 名声値チェック
    if ($currentFame < $requiredFame) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "名声が足りません (必要: {$requiredFame}, 現在: {$currentFame})"]);
        exit;
    }

    // ゴールドチェック
    if ($currentGold < $unlockCost) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ゴールドが足りません (必要: {$unlockCost}G, 現在: {$currentGold}G)"]);
        exit;
    }

    // 解放処理: gold を減らし、consumed_gold を増やし、unlocked_expeditions に追加
    $newGold = $currentGold - $unlockCost;
    $newConsumed = $currentConsumed + $unlockCost;
    $unlocked[] = $locationId;
    $unlockedJson = json_encode(array_values(array_unique($unlocked)), JSON_UNESCAPED_UNICODE);

    $updStmt = $pdo->prepare("
        INSERT INTO user_workshop_status (user_id, gold, consumed_gold, unlocked_expeditions)
        VALUES (:uid, :gold, :consumed, :unlocked)
        ON DUPLICATE KEY UPDATE
            gold = :up_gold,
            consumed_gold = :up_consumed,
            unlocked_expeditions = :up_unlocked
    ");
    $updStmt->execute([
        ':uid' => $actualUserId,
        ':gold' => $newGold,
        ':consumed' => $newConsumed,
        ':unlocked' => $unlockedJson,
        ':up_gold' => $newGold,
        ':up_consumed' => $newConsumed,
        ':up_unlocked' => $unlockedJson,
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "location_id" => $locationId,
        "gold" => $newGold,
        "consumed_gold" => $newConsumed,
        "unlocked_expeditions" => $unlocked
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
