<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$userId = $_GET['user_id'] ?? $_GET['userId'] ?? null;
if (!$userId && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    if ($rawInput) {
        $data = json_decode($rawInput, true);
        $userId = $data['user_id'] ?? $data['userId'] ?? null;
    }
}

$pdo = getDB();

try {
    // テーブルが存在しない場合に備えて初期テーブル定義を実行
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS active_expeditions (
            user_id VARCHAR(255) PRIMARY KEY,
            location_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            dispatched_robot_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_robot_assemblies (
            user_id VARCHAR(255) PRIMARY KEY,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            duration_ms BIGINT DEFAULT 0,
            robot_id VARCHAR(255) NOT NULL,
            robot_name VARCHAR(255) NOT NULL,
            head_part_id VARCHAR(255),
            body_part_id VARCHAR(255),
            arms_part_id VARCHAR(255),
            legs_part_id VARCHAR(255),
            current_hp INT DEFAULT 12,
            max_hp INT DEFAULT 12,
            value INT DEFAULT 0,
            robot_created_at BIGINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_act_ass_head FOREIGN KEY (head_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_act_ass_body FOREIGN KEY (body_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_act_ass_arms FOREIGN KEY (arms_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_act_ass_legs FOREIGN KEY (legs_part_id) REFERENCES user_parts(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_requests (
            user_id VARCHAR(255) PRIMARY KEY,
            request_id VARCHAR(255) NOT NULL,
            rank VARCHAR(50) NOT NULL,
            reward_g INT NOT NULL,
            deadline BIGINT NOT NULL,
            request_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 1. active_expeditions テーブルから場所別の人数を集計
    // （ほかのユーザーが登録されている場合は user_id != :user_id）
    $expeditions = [];
    if (!empty($userId)) {
        $stmtExp = $pdo->prepare("
            SELECT location_id, COUNT(DISTINCT user_id) as cnt 
            FROM active_expeditions 
            WHERE user_id != :user_id 
            GROUP BY location_id
        ");
        $stmtExp->execute([':user_id' => (string)$userId]);
    } else {
        $stmtExp = $pdo->query("
            SELECT location_id, COUNT(DISTINCT user_id) as cnt 
            FROM active_expeditions 
            GROUP BY location_id
        ");
    }
    $expRows = $stmtExp ? $stmtExp->fetchAll() : [];
    foreach ($expRows as $row) {
        $locId = $row['location_id'];
        $count = (int)$row['cnt'];
        $expeditions[$locId] = $count;
    }

    // 2. active_robot_assemblies テーブルからロボット組立中の人数を集計
    // （ほかのユーザーが登録されている場合は user_id != :user_id）
    $robotAssemblies = 0;
    if (!empty($userId)) {
        $stmtAss = $pdo->prepare("
            SELECT COUNT(DISTINCT user_id) as cnt 
            FROM active_robot_assemblies 
            WHERE user_id != :user_id
        ");
        $stmtAss->execute([':user_id' => (string)$userId]);
    } else {
        $stmtAss = $pdo->query("
            SELECT COUNT(DISTINCT user_id) as cnt 
            FROM active_robot_assemblies
        ");
    }
    if ($stmtAss) {
        $robotAssemblies = (int)($stmtAss->fetchColumn() ?: 0);
    }

    // 3. active_requests テーブルから依頼受注中の人数を集計
    // （ほかのユーザーが登録されている場合は user_id != :user_id）
    $requests = [];
    $requestsByRank = [];
    if (!empty($userId)) {
        $stmtReq = $pdo->prepare("
            SELECT request_id, rank, COUNT(DISTINCT user_id) as cnt 
            FROM active_requests 
            WHERE user_id != :user_id 
            GROUP BY request_id, rank
        ");
        $stmtReq->execute([':user_id' => (string)$userId]);
    } else {
        $stmtReq = $pdo->query("
            SELECT request_id, rank, COUNT(DISTINCT user_id) as cnt 
            FROM active_requests 
            GROUP BY request_id, rank
        ");
    }
    $reqRows = $stmtReq ? $stmtReq->fetchAll() : [];
    foreach ($reqRows as $row) {
        $reqId = $row['request_id'];
        $rank = $row['rank'];
        $count = (int)$row['cnt'];
        $requests[$reqId] = $count;
        $requestsByRank[$rank] = ($requestsByRank[$rank] ?? 0) + $count;
    }

    echo json_encode([
        'success' => true,
        'userId' => $userId,
        'expeditions' => $expeditions,
        'robotAssemblies' => $robotAssemblies,
        'requests' => $requests,
        'requestsByRank' => $requestsByRank
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    error_log("[active_counts.php] Database query error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'expeditions' => [],
        'robotAssemblies' => 0,
        'requests' => [],
        'requestsByRank' => []
    ], JSON_UNESCAPED_UNICODE);
}
