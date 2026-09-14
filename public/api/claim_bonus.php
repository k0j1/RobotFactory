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

    // user_materialテーブルの存在を確実に保証
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_material (
            user_id VARCHAR(255) NOT NULL,
            material_id VARCHAR(255) NOT NULL,
            count INT NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, material_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    // 初期ボーナス素材（計24個）を user_material テーブルに追加（UPSERT）
    $starterMaterials = [
        'm_e1_1' => 6, // さびた鉄くず (Earth, ★1)
        'm_e1_2' => 4, // 泥だらけのボルト (Earth, ★1)
        'm_f1_1' => 5, // 燃える歯車 (Fire, ★1)
        'm_w1_1' => 5, // 水冷チューブ (Water, ★1)
        'm_a1_1' => 4  // 軽いプロペラ (Wind, ★1)
    ];

    $matStmt = $pdo->prepare("
        INSERT INTO user_material (user_id, material_id, count)
        VALUES (:user_id, :material_id, :count)
        ON DUPLICATE KEY UPDATE count = count + :add_count
    ");

    foreach ($starterMaterials as $matId => $matCount) {
        $matStmt->execute([
            ':user_id' => $targetId,
            ':material_id' => $matId,
            ':count' => $matCount,
            ':add_count' => $matCount
        ]);
    }

    // save_data テーブルのJSONスナップショットも同期
    $saveStmt = $pdo->prepare("SELECT game_data FROM save_data WHERE user_id = :user_id LIMIT 1");
    $saveStmt->execute([':user_id' => $targetId]);
    $saveRow = $saveStmt->fetch();

    $gameData = [];
    if ($saveRow && !empty($saveRow['game_data'])) {
        $gameData = json_decode($saveRow['game_data'], true) ?: [];
    }

    if (!isset($gameData['materials']) || !is_array($gameData['materials'])) {
        $gameData['materials'] = [];
    }

    // user_material テーブルの最新全所持素材を取得して save_data に反映
    $allMatStmt = $pdo->prepare("SELECT material_id, count FROM user_material WHERE user_id = :user_id");
    $allMatStmt->execute([':user_id' => $targetId]);
    $allMatRows = $allMatStmt->fetchAll();

    $updatedMaterials = [];
    foreach ($allMatRows as $mr) {
        $updatedMaterials[$mr['material_id']] = (int)$mr['count'];
        $gameData['materials'][$mr['material_id']] = (int)$mr['count'];
    }

    // 廃止された starterBonusClaimed を確実に除外
    unset($gameData['starterBonusClaimed']);

    // チュートリアル進行（step 2へ）
    if (!isset($gameData['tutorialStep']) || (int)$gameData['tutorialStep'] < 2) {
        $gameData['tutorialStep'] = 2;
    }

    $jsonSave = json_encode($gameData, JSON_UNESCAPED_UNICODE);
    $upSaveStmt = $pdo->prepare("
        INSERT INTO save_data (user_id, game_data)
        VALUES (:user_id, :game_data)
        ON DUPLICATE KEY UPDATE game_data = :update_data
    ");
    $upSaveStmt->execute([
        ':user_id' => $targetId,
        ':game_data' => $jsonSave,
        ':update_data' => $jsonSave
    ]);

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
        "message" => "Initial bonus claimed and materials added to user_material table successfully",
        "user" => $userRecord,
        "materials" => $updatedMaterials
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
