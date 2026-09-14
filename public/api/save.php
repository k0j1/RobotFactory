<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// リクエストボディ(JSON)の取得
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$userId = $data['userId'] ?? null;
$gameData = $data['gameData'] ?? null;

if (!$userId || !$gameData) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data. 'userId' and 'gameData' are required."]);
    exit;
}

$pdo = getDB();
try {
    // 既存データがあれば更新、なければ新規作成 (UPSERT)
    $stmt = $pdo->prepare("
        INSERT INTO save_data (user_id, game_data) 
        VALUES (:user_id, :game_data)
        ON DUPLICATE KEY UPDATE game_data = :update_data
    ");
    
    $jsonGameData = json_encode($gameData);
    
    $stmt->execute([
        ':user_id' => $userId,
        ':game_data' => $jsonGameData,
        ':update_data' => $jsonGameData
    ]);
    
    echo json_encode(["success" => true, "message" => "Data saved successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
