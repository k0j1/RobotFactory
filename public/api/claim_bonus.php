<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$googleId = $data['google_id'] ?? $data['user_id'] ?? $data['userId'] ?? null;

if (!$googleId) {
    http_response_code(400);
    echo json_encode(["error" => "google_id is required"]);
    exit;
}

$pdo = getDB();
try {
    // usersテーブルから該当ユーザーのgoogle_idを特定
    $uStmt = $pdo->prepare("SELECT * FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $uStmt->execute([':u1' => $googleId, ':u2' => $googleId]);
    $uRec = $uStmt->fetch();
    $targetId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $googleId;

    // user_workshop_statusテーブルにUPSERT（存在しない場合は新規作成、存在する場合は更新）
    $stmt = $pdo->prepare("
        INSERT INTO user_workshop_status (user_id, received_initial_bonus)
        VALUES (:google_id, 1)
        ON DUPLICATE KEY UPDATE received_initial_bonus = 1
    ");
    $stmt->execute([':google_id' => $targetId]);

    // 更新後のユーザーデータとステータスを結合して取得
    $uFullStmt = $pdo->prepare("
        SELECT u.*, COALESCE(s.received_initial_bonus, 1) AS received_initial_bonus 
        FROM users u 
        LEFT JOIN user_workshop_status s ON u.google_id = s.user_id 
        WHERE u.google_id = :u1 OR u.id = :u2 
        LIMIT 1
    ");
    $uFullStmt->execute([':u1' => $targetId, ':u2' => $targetId]);
    $userRecord = $uFullStmt->fetch();
    if ($userRecord) {
        $userRecord['received_initial_bonus'] = 1;
    }

    echo json_encode([
        "success" => true,
        "message" => "Initial bonus claimed",
        "user" => $userRecord
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
