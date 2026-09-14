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
try {
    $stmt = $pdo->prepare("SELECT game_data FROM save_data WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $userId]);
    $row = $stmt->fetch();
    
    if ($row) {
        echo json_encode([
            "success" => true, 
            "data" => json_decode($row['game_data'], true)
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "No data found for this user"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
