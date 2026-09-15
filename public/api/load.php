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
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable."]);
    exit;
}

try {
    // usersテーブルから該当ユーザーのgoogle_idを特定
    $userStmt = $pdo->prepare("SELECT google_id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $uRec = $userStmt->fetch();
    $actualUserId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $userId;

    $stmt = $pdo->prepare("SELECT game_data FROM save_data WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $actualUserId]);
    $row = $stmt->fetch();

    // テーブルの存在を事前に保証
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_material (
            user_id VARCHAR(255) NOT NULL,
            material_id VARCHAR(255) NOT NULL,
            count INT NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, material_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS save_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL UNIQUE,
            game_data JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS user_workshop_status (
            user_id VARCHAR(255) PRIMARY KEY,
            fame INT DEFAULT 0,
            gold INT DEFAULT 0,
            consumed_gold INT DEFAULT 0,
            storage_limit INT DEFAULT 0,
            delivered_count INT DEFAULT 0,
            received_initial_bonus BOOLEAN DEFAULT FALSE,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_expeditions (
            user_id VARCHAR(255) PRIMARY KEY,
            location_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            dispatched_robot_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_part_crafts (
            user_id VARCHAR(255) PRIMARY KEY,
            part_type VARCHAR(50) NOT NULL,
            main_material_id VARCHAR(255) NOT NULL,
            sub_material_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_robot_assemblies (
            user_id VARCHAR(255) PRIMARY KEY,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_robot_data JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

        CREATE TABLE IF NOT EXISTS user_minigame_status (
            user_id VARCHAR(255),
            minigame_id VARCHAR(255),
            play_count INT DEFAULT 0,
            wins INT DEFAULT 0,
            elements_count INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, minigame_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    try {
        $pdo->exec("ALTER TABLE active_expeditions ADD COLUMN dispatched_robot_id VARCHAR(255)");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE active_requests ADD COLUMN request_data JSON");
    } catch (PDOException $e) {}

    // ユーザー識別子の候補リスト（google_id または users.id）
    $candidateUserIds = array_unique(array_filter([$actualUserId, $userId, $userRecord['id'] ?? null, $userRecord['google_id'] ?? null]));
    $inPlaceholders = implode(',', array_fill(0, count($candidateUserIds), '?'));

    // 1. user_workshop_status テーブルから工房ステータスを取得
    $wsStmt = $pdo->prepare("
        SELECT fame, gold, storage_limit, delivered_count, received_initial_bonus 
        FROM user_workshop_status 
        WHERE user_id IN ($inPlaceholders) 
        ORDER BY updated_at DESC
        LIMIT 1
    ");
    $wsStmt->execute(array_values($candidateUserIds));
    $wsRow = $wsStmt->fetch();

    $goldVal = $wsRow ? (int)($wsRow['gold'] ?? 0) : 0;
    $fameVal = $wsRow ? (int)($wsRow['fame'] ?? 0) : 0;
    $storageLimitVal = ($wsRow && !empty($wsRow['storage_limit'])) ? (int)$wsRow['storage_limit'] : 20;
    $deliveredCountVal = $wsRow ? (int)($wsRow['delivered_count'] ?? 0) : 0;
    $receivedBonusVal = ($wsRow && isset($wsRow['received_initial_bonus'])) ? (int)$wsRow['received_initial_bonus'] : 0;

    // 2. user_material テーブルから最新の素材情報を取得
    $matStmt = $pdo->prepare("
        SELECT material_id, SUM(count) AS total_count 
        FROM user_material 
        WHERE user_id IN ($inPlaceholders) 
        GROUP BY material_id
    ");
    $matStmt->execute(array_values($candidateUserIds));
    $matRows = $matStmt->fetchAll();
    $dbMaterials = [];
    foreach ($matRows as $mRow) {
        $c = (int)$mRow['total_count'];
        if ($c > 0) {
            $dbMaterials[$mRow['material_id']] = $c;
        }
    }

    // 3. active_expeditions テーブルから遠征進行状態を取得
    $expStmt = $pdo->prepare("
        SELECT location_id, start_time, end_time, dispatched_robot_id 
        FROM active_expeditions 
        WHERE user_id IN ($inPlaceholders) 
        LIMIT 1
    ");
    $expStmt->execute(array_values($candidateUserIds));
    $expRow = $expStmt->fetch();
    $activeQuest = null;
    if ($expRow && !empty($expRow['location_id'])) {
        $activeQuest = [
            'locationId' => $expRow['location_id'],
            'startTime' => (int)$expRow['start_time'],
            'endTime' => (int)$expRow['end_time'],
            'dispatchedRobotId' => !empty($expRow['dispatched_robot_id']) ? $expRow['dispatched_robot_id'] : null
        ];
    }

    // 4. active_part_crafts テーブルからパーツ製造進行状態を取得
    $craftStmt = $pdo->prepare("
        SELECT part_type, main_material_id, sub_material_id, start_time, end_time 
        FROM active_part_crafts 
        WHERE user_id IN ($inPlaceholders) 
        LIMIT 1
    ");
    $craftStmt->execute(array_values($candidateUserIds));
    $craftRow = $craftStmt->fetch();
    $activePartCraft = null;
    if ($craftRow && !empty($craftRow['part_type'])) {
        $activePartCraft = [
            'partType' => $craftRow['part_type'],
            'mainMaterialId' => $craftRow['main_material_id'],
            'subMaterialId' => !empty($craftRow['sub_material_id']) ? $craftRow['sub_material_id'] : null,
            'startTime' => (int)$craftRow['start_time'],
            'endTime' => (int)$craftRow['end_time']
        ];
    }

    // 5. active_robot_assemblies テーブルから最新のロボット組立進行状態を取得
    $assStmt = $pdo->prepare("
        SELECT start_time, end_time, result_robot_data 
        FROM active_robot_assemblies 
        WHERE user_id IN ($inPlaceholders) 
        LIMIT 1
    ");
    $assStmt->execute(array_values($candidateUserIds));
    $assRow = $assStmt->fetch();
    $activeAssembly = null;
    if ($assRow) {
        $resultRobot = json_decode($assRow['result_robot_data'], true);
        $activeAssembly = [
            'startTime' => (int)$assRow['start_time'],
            'endTime' => (int)$assRow['end_time'],
            'resultRobot' => is_array($resultRobot) ? $resultRobot : null
        ];
    }

    // 6. active_requests テーブルから受注依頼状態を取得
    $reqStmt = $pdo->prepare("
        SELECT request_id, rank, reward_g, deadline, request_data 
        FROM active_requests 
        WHERE user_id IN ($inPlaceholders) 
        LIMIT 1
    ");
    $reqStmt->execute(array_values($candidateUserIds));
    $reqRow = $reqStmt->fetch();
    $currentRequest = null;
    if ($reqRow && !empty($reqRow['request_id'])) {
        if (!empty($reqRow['request_data'])) {
            $rData = json_decode($reqRow['request_data'], true);
            if (is_array($rData)) {
                $currentRequest = $rData;
            }
        }
        if (!$currentRequest) {
            $currentRequest = [
                'id' => $reqRow['request_id'],
                'rank' => $reqRow['rank'],
                'rewardG' => (int)$reqRow['reward_g'],
                'deadline' => (int)$reqRow['deadline']
            ];
        }
    }

    // 7. user_minigame_status テーブルからミニゲーム/バトル演習エレメント数を取得
    $miniStmt = $pdo->prepare("
        SELECT elements_count 
        FROM user_minigame_status 
        WHERE user_id IN ($inPlaceholders) AND minigame_id = 'combat_training' 
        LIMIT 1
    ");
    $miniStmt->execute(array_values($candidateUserIds));
    $miniRow = $miniStmt->fetch();
    $battleElements = $miniRow ? (int)$miniRow['elements_count'] : 0;

    // 8. user_parts テーブルから所持パーツ一覧を取得
    $partsStmt = $pdo->prepare("
        SELECT part_data, is_equipped 
        FROM user_parts 
        WHERE user_id IN ($inPlaceholders)
    ");
    $partsStmt->execute(array_values($candidateUserIds));
    $dbParts = [];
    while ($pRow = $partsStmt->fetch()) {
        if (!empty($pRow['part_data'])) {
            $pData = json_decode($pRow['part_data'], true);
            if (is_array($pData)) {
                $pData['isEquipped'] = !empty($pRow['is_equipped']);
                $dbParts[] = $pData;
            }
        }
    }

    // 9. user_robots テーブルから所持ロボット一覧を取得
    $robotsStmt = $pdo->prepare("
        SELECT robot_data 
        FROM user_robots 
        WHERE user_id IN ($inPlaceholders)
    ");
    $robotsStmt->execute(array_values($candidateUserIds));
    $dbRobots = [];
    while ($rRow = $robotsStmt->fetch()) {
        if (!empty($rRow['robot_data'])) {
            $rData = json_decode($rRow['robot_data'], true);
            if (is_array($rData)) {
                $dbRobots[] = $rData;
            }
        }
    }

    if ($row && !empty($row['game_data'])) {
        $gameData = json_decode($row['game_data'], true);
        if (!is_array($gameData)) {
            $gameData = [];
        }

        // 廃止された starterBonusClaimed 変数は返却データからも完全に除外
        unset($gameData['starterBonusClaimed']);
        unset($gameData['parts']);
        unset($gameData['robots']);
        unset($gameData['craftedRobots']);
        unset($gameData['deliveredLogs']);
        unset($gameData['materials']);
        unset($gameData['gold']);
        unset($gameData['fame']);
        unset($gameData['storageSize']);
        unset($gameData['deliveredRobotsCount']);

        // user_robots 内のパーツが user_parts に無い場合は復元する
        $existingPartIds = array_column($dbParts, 'id');
        foreach ($dbRobots as $robot) {
            $robotParts = [$robot['parts']['head'] ?? null, $robot['parts']['body'] ?? null, $robot['parts']['arms'] ?? null, $robot['parts']['legs'] ?? null];
            foreach ($robotParts as $rp) {
                if ($rp && isset($rp['id']) && !in_array($rp['id'], $existingPartIds)) {
                    $dbParts[] = $rp;
                    $existingPartIds[] = $rp['id'];
                }
            }
        }

        // 各個別テーブルで管理されている最新データを gameData へ統合
        $gameData['materials'] = $dbMaterials;
        $gameData['parts'] = $dbParts;
        $gameData['robots'] = $dbRobots;
        $gameData['gold'] = $goldVal;
        $gameData['fame'] = $fameVal;
        $gameData['storageSize'] = $storageLimitVal;
        $gameData['deliveredRobotsCount'] = $deliveredCountVal;
        $gameData['activeQuest'] = $activeQuest;
        $gameData['activePartCraft'] = $activePartCraft;
        $gameData['activeRobotAssembly'] = $activeAssembly;
        $gameData['currentRequest'] = $currentRequest;
        $gameData['battleElements'] = $battleElements;

        echo json_encode([
            "success" => true, 
            "data" => $gameData,
            "received_initial_bonus" => $receivedBonusVal,
            "materials" => $dbMaterials,
            "user" => $userRecord,
            "userId" => $actualUserId
        ]);
    } else {
        $gameData = [
            "materials" => $dbMaterials,
            "parts" => $dbParts,
            "robots" => $dbRobots,
            "gold" => $goldVal,
            "fame" => $fameVal,
            "storageSize" => $storageLimitVal,
            "deliveredRobotsCount" => $deliveredCountVal,
            "activeQuest" => $activeQuest,
            "activePartCraft" => $activePartCraft,
            "activeRobotAssembly" => $activeAssembly,
            "currentRequest" => $currentRequest,
            "battleElements" => $battleElements
        ];
        echo json_encode([
            "success" => true, 
            "message" => "Initial user state with materials",
            "data" => $gameData,
            "received_initial_bonus" => $receivedBonusVal,
            "materials" => $dbMaterials,
            "user" => $userRecord,
            "userId" => $actualUserId
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
