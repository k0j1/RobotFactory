<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$userId = $_GET['userId'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

$pdo = getDB();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable."]);
    exit;
}

try {
    // usersテーブルから該当ユーザーのgoogle_idを特定
    $userStmt = $pdo->prepare("SELECT google_id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $uRec = $userStmt->fetch();
    $actualUserId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $userId;

    $stmt = $pdo->prepare("SELECT game_data FROM save_data WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $actualUserId]);
    $row = $stmt->fetch();

    // user_workshop_statusテーブルから最新のボーナス受取状況を取得
    $wsStmt = $pdo->prepare("SELECT received_initial_bonus FROM user_workshop_status WHERE user_id = :user_id LIMIT 1");
    $wsStmt->execute([':user_id' => $actualUserId]);
    $wsRow = $wsStmt->fetch();
    
    $receivedBonusVal = ($wsRow !== false && isset($wsRow['received_initial_bonus'])) 
        ? (int)$wsRow['received_initial_bonus'] 
        : 0;

    // usersテーブルからも最新のユーザー情報を取得
    $uFullStmt = $pdo->prepare("
        SELECT u.*, COALESCE(s.received_initial_bonus, 0) AS received_initial_bonus 
        FROM users u 
        LEFT JOIN user_workshop_status s ON u.google_id = s.user_id 
        WHERE u.google_id = :u1 OR u.id = :u2 
        LIMIT 1
    ");
    $uFullStmt->execute([':u1' => $actualUserId, ':u2' => $actualUserId]);
    $userRecord = $uFullStmt->fetch();
    if ($userRecord) {
        $userRecord['received_initial_bonus'] = (int)$userRecord['received_initial_bonus'];
    }
    
    if ($row && !empty($row['game_data'])) {
        $gameData = json_decode($row['game_data'], true);
        if (!is_array($gameData)) {
            $gameData = [];
        }

        // 廃止された starterBonusClaimed 変数は返却データからも完全に除外
        unset($gameData['starterBonusClaimed']);

        echo json_encode([
            "success" => true, 
            "data" => $gameData,
            "received_initial_bonus" => $receivedBonusVal,
            "user" => $userRecord,
            "userId" => $actualUserId
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "No saved data found for this user",
            "received_initial_bonus" => $receivedBonusVal,
            "user" => $userRecord,
            "userId" => $actualUserId
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
