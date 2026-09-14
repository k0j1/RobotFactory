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

$userId = $data['user_id'] ?? $data['google_id'] ?? $data['userId'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

$pdo = getDB();
try {
    // usersテーブルから該当ユーザーのgoogle_idを特定
    $uStmt = $pdo->prepare("SELECT google_id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $uStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $uRec = $uStmt->fetch();
    $actualUserId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $userId;

    $itemsToAdd = [];
    if (!empty($data['material_id'])) {
        $matId = (string)$data['material_id'];
        $count = isset($data['count']) ? (int)$data['count'] : 1;
        if ($count > 0) {
            $itemsToAdd[$matId] = $count;
        }
    } elseif (!empty($data['materials']) && is_array($data['materials'])) {
        foreach ($data['materials'] as $mId => $cnt) {
            $c = (int)$cnt;
            if ($c > 0) {
                $itemsToAdd[(string)$mId] = $c;
            }
        }
    }

    if (empty($itemsToAdd)) {
        http_response_code(400);
        echo json_encode(["error" => "No valid materials provided"]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO user_material (user_id, material_id, count)
        VALUES (:user_id, :material_id, :count)
        ON DUPLICATE KEY UPDATE count = count + :add_count
    ");

    foreach ($itemsToAdd as $matId => $addCount) {
        $stmt->execute([
            ':user_id' => $actualUserId,
            ':material_id' => $matId,
            ':count' => $addCount,
            ':add_count' => $addCount
        ]);
    }

    // 更新後の全素材一覧を取得して返却
    $getStmt = $pdo->prepare("SELECT material_id, count FROM user_material WHERE user_id = :user_id");
    $getStmt->execute([':user_id' => $actualUserId]);
    $rows = $getStmt->fetchAll();

    $currentMaterials = [];
    foreach ($rows as $r) {
        $currentMaterials[$r['material_id']] = (int)$r['count'];
    }

    echo json_encode([
        "success" => true,
        "message" => "Materials added to user_material table successfully",
        "userId" => $actualUserId,
        "materials" => $currentMaterials
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
