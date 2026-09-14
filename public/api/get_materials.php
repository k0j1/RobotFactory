<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

$userId = $_GET['userId'] ?? $_GET['user_id'] ?? $_GET['google_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "userId is required"]);
    exit;
}

$pdo = getDB();
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_material (
            user_id VARCHAR(255) NOT NULL,
            material_id VARCHAR(255) NOT NULL,
            count INT NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, material_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // usersテーブルから該当ユーザーのgoogle_idおよびidを特定
    $uStmt = $pdo->prepare("SELECT id, google_id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $uStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $uRec = $uStmt->fetch();

    $actualUserId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $userId;
    $numericId = ($uRec && !empty($uRec['id'])) ? (string)$uRec['id'] : null;

    $candidateUserIds = array_unique(array_filter([$actualUserId, $userId, $numericId]));
    $inPlaceholders = implode(',', array_fill(0, count($candidateUserIds), '?'));

    // user_materialテーブルから素材情報を集計取得
    $matStmt = $pdo->prepare("
        SELECT material_id, SUM(count) AS total_count 
        FROM user_material 
        WHERE user_id IN ($inPlaceholders) 
        GROUP BY material_id
    ");
    $matStmt->execute(array_values($candidateUserIds));
    $matRows = $matStmt->fetchAll();

    $materials = [];
    foreach ($matRows as $mRow) {
        $c = (int)$mRow['total_count'];
        if ($c > 0) {
            $materials[$mRow['material_id']] = $c;
        }
    }

    echo json_encode([
        "success" => true,
        "userId" => $actualUserId,
        "materials" => $materials
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
