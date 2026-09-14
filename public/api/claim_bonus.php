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

if (!$googleId) {
    http_response_code(400);
    echo json_encode(["error" => "google_id is required"]);
    exit;
}

$pdo = getDB();
try {
    $stmt = $pdo->prepare("UPDATE user_workshop_status SET received_initial_bonus = TRUE WHERE user_id = :google_id");
    $stmt->execute([':google_id' => $googleId]);

    echo json_encode([
        "success" => true,
        "message" => "Initial bonus claimed"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
