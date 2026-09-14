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
    
    if ($row && !empty($row['game_data'])) {
        $gameData = json_decode($row['game_data'], true);
        echo json_encode([
            "success" => true, 
            "data" => $gameData,
            "userId" => $actualUserId
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "No saved data found for this user",
            "userId" => $actualUserId
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
