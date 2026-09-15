<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDB();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM m_parts_encyclopedia ORDER BY rarity ASC, part_type ASC, id ASC");
    $parts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "parts" => $parts
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
