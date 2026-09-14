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
        // 更新後のデータを取得
        $stmt->execute([':google_id' => $googleId]);
        $user = $stmt->fetch();
    } else {
        // 新規ユーザー作成
        $insertStmt = $pdo->prepare("INSERT INTO users (google_id, email, name, picture) VALUES (:google_id, :email, :name, :picture)");
        $insertStmt->execute([
            ':google_id' => $googleId,
            ':email' => $email,
            ':name' => $name,
            ':picture' => $picture
        ]);
        
        $stmt->execute([':google_id' => $googleId]);
        $user = $stmt->fetch();
    }

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
