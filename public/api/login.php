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

$googleId = $data['google_id'] ?? null;
$email = $data['email'] ?? null;
$name = $data['name'] ?? null;
$picture = $data['picture'] ?? null;

if (!$googleId) {
    http_response_code(400);
    echo json_encode(["error" => "google_id is required"]);
    exit;
}

$pdo = getDB();
try {
    // ユーザーが存在するか確認
    $stmt = $pdo->prepare("SELECT * FROM users WHERE google_id = :google_id");
    $stmt->execute([':google_id' => $googleId]);
    $user = $stmt->fetch();

    if ($user) {
        // 既存ユーザーの場合は情報を更新
        $updateStmt = $pdo->prepare("UPDATE users SET email = :email, name = :name, picture = :picture WHERE google_id = :google_id");
        $updateStmt->execute([
            ':email' => $email,
            ':name' => $name,
            ':picture' => $picture,
            ':google_id' => $googleId
        ]);
    } else {
        // 新規ユーザー作成
        $insertStmt = $pdo->prepare("INSERT INTO users (google_id, email, name, picture) VALUES (:google_id, :email, :name, :picture)");
        $insertStmt->execute([
            ':google_id' => $googleId,
            ':email' => $email,
            ':name' => $name,
            ':picture' => $picture
        ]);
        
        // 新規ユーザーの場合は初期ステータスも作成（初回倉庫上限は5、裏山のスクラップ場 loc1 は最初から解放）
        $insertStatusStmt = $pdo->prepare("
            INSERT IGNORE INTO user_workshop_status (user_id, storage_limit, unlocked_expeditions) 
            VALUES (:google_id, 5, '[\"loc1\"]')
        ");
        $insertStatusStmt->execute([':google_id' => $googleId]);
    }
    
    // 遠征地マスターテーブルと初期データの存在を保証
    ensureMasterExpeditions($pdo);

    // 既存ユーザーで unlocked_expeditions が空の場合は loc1 を補完
    try {
        $checkLocStmt = $pdo->prepare("
            UPDATE user_workshop_status 
            SET unlocked_expeditions = '[\"loc1\"]' 
            WHERE user_id = :google_id AND (unlocked_expeditions IS NULL OR unlocked_expeditions = '' OR unlocked_expeditions = '[]')
        ");
        $checkLocStmt->execute([':google_id' => $googleId]);
    } catch (PDOException $e) {}
    
    // 更新後のユーザーデータとステータスを結合して取得
    $stmt = $pdo->prepare("
        SELECT u.*, COALESCE(s.received_initial_bonus, 0) AS received_initial_bonus 
        FROM users u 
        LEFT JOIN user_workshop_status s ON (u.google_id = s.user_id OR u.id = s.user_id)
        WHERE u.google_id = :google_id OR u.id = :uid 
        ORDER BY s.received_initial_bonus DESC 
        LIMIT 1
    ");
    $stmt->execute([':google_id' => $googleId, ':uid' => $googleId]);
    $user = $stmt->fetch();
    if ($user) {
        $user['received_initial_bonus'] = (int)$user['received_initial_bonus'];
    }

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
