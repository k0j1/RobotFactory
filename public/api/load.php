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
    // usersテーブルから該当ユーザーのgoogle_idおよびidを特定
    $userStmt = $pdo->prepare("SELECT id, google_id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $uRec = $userStmt->fetch();
    $actualUserId = ($uRec && !empty($uRec['google_id'])) ? $uRec['google_id'] : $userId;
    $numericId = ($uRec && !empty($uRec['id'])) ? (string)$uRec['id'] : null;

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
            request_earned_gold INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_parts (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            master_id VARCHAR(255) NOT NULL,
            part_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS completed_robots (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            head_part_id VARCHAR(255),
            body_part_id VARCHAR(255),
            arms_part_id VARCHAR(255),
            legs_part_id VARCHAR(255),
            total_hp INT DEFAULT 0,
            total_power INT DEFAULT 0,
            total_defense INT DEFAULT 0,
            total_agility INT DEFAULT 0,
            total_dexterity INT DEFAULT 0,
            total_int INT DEFAULT 0,
            robot_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_deliveries (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            robot_id VARCHAR(255) NOT NULL,
            robot_name VARCHAR(255) NOT NULL,
            log_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_expeditions (
            user_id VARCHAR(255) PRIMARY KEY,
            location_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            dispatched_robot_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_expeditions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            location_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            dispatched_robot_id VARCHAR(255),
            reward_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_exp_user (user_id)
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

        CREATE TABLE IF NOT EXISTS complete_part_crafts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            part_type VARCHAR(50) NOT NULL,
            main_material_id VARCHAR(255) NOT NULL,
            sub_material_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_part_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_craft_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_robot_assemblies (
            user_id VARCHAR(255) PRIMARY KEY,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_robot_data JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_robot_assemblies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_robot_data JSON NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_ass_user (user_id)
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

        CREATE TABLE IF NOT EXISTS complete_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            request_id VARCHAR(255) NOT NULL,
            rank VARCHAR(50) NOT NULL,
            reward_g INT NOT NULL,
            deadline BIGINT NOT NULL,
            delivered_robot_id VARCHAR(255),
            request_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_req_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_robot_disassemblies (
            user_id VARCHAR(255) PRIMARY KEY,
            robot_id VARCHAR(255),
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_parts_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_robot_disassemblies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            robot_id VARCHAR(255),
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_parts_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_disass_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS active_part_recycles (
            user_id VARCHAR(255) PRIMARY KEY,
            part_id VARCHAR(255),
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_materials_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_part_recycles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            part_id VARCHAR(255),
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            result_materials_data JSON,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_recyc_user (user_id)
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

    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN request_earned_gold INT DEFAULT 0");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN unlocked_expeditions JSON");
    } catch (PDOException $e) {}

    // ユーザー識別子の候補リスト（google_id または users.id）
    $candidateUserIds = array_unique(array_filter([$actualUserId, $userId, $numericId]));
    $inPlaceholders = implode(',', array_fill(0, count($candidateUserIds), '?'));

    // 1. user_workshop_status テーブルから工房ステータスを取得
    $wsStmt = $pdo->prepare("
        SELECT fame, gold, storage_limit, delivered_count, received_initial_bonus, request_earned_gold, unlocked_expeditions 
        FROM user_workshop_status 
        WHERE user_id IN ($inPlaceholders) 
        ORDER BY updated_at DESC
        LIMIT 1
    ");
    $wsStmt->execute(array_values($candidateUserIds));
    $wsRow = $wsStmt->fetch();

    $goldVal = $wsRow ? (int)($wsRow['gold'] ?? 0) : 0;
    $fameVal = $wsRow ? (int)($wsRow['fame'] ?? 0) : 0;
    $storageLimitVal = ($wsRow && !empty($wsRow['storage_limit'])) ? (int)$wsRow['storage_limit'] : 5;
    $deliveredCountVal = $wsRow ? (int)($wsRow['delivered_count'] ?? 0) : 0;
    $receivedBonusVal = ($wsRow && isset($wsRow['received_initial_bonus'])) ? (int)$wsRow['received_initial_bonus'] : 0;
    $requestEarnedGoldVal = $wsRow ? (int)($wsRow['request_earned_gold'] ?? 0) : 0;
    $unlockedLocationsVal = [];
    if ($wsRow && !empty($wsRow['unlocked_expeditions'])) {
        $unlockedLocationsVal = json_decode($wsRow['unlocked_expeditions'], true) ?: [];
    }

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

    // 7. user_minigame_status テーブルからミニゲーム/バトル演習成績・エレメント数を取得
    $miniStmt = $pdo->prepare("
        SELECT minigame_id, play_count, wins, elements_count 
        FROM user_minigame_status 
        WHERE user_id IN ($inPlaceholders)
    ");
    $miniStmt->execute(array_values($candidateUserIds));
    $dbMinigameRecords = [];
    $battleElements = 0;

    while ($mRow = $miniStmt->fetch()) {
        $mId = $mRow['minigame_id'];
        $plays = (int)$mRow['play_count'];
        $wins = (int)$mRow['wins'];
        $elems = (int)$mRow['elements_count'];

        $dbMinigameRecords[$mId] = [
            'plays' => $plays,
            'wins' => $wins,
            'losses' => 0,
            'draws' => 0,
            'elements' => $elems
        ];

        if ($elems > $battleElements) {
            $battleElements = $elems;
        }
    }

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
    // robot_data カラムは削除されたため、user_robots の各パーツIDをもとに user_parts テーブルの所持パーツと結合し、
    // currentHp、maxHP、battleStats および合算 stats を持つ完全な Robot オブジェクトを復元
    $partsMap = [];
    foreach ($dbParts as $p) {
        if (!empty($p['id'])) {
            $partsMap[$p['id']] = $p;
        }
    }

    $robotsStmt = $pdo->prepare("
        SELECT id, user_id, name, head_part_id, body_part_id, arms_part_id, legs_part_id,
               currentHp, maxHP, battleStats, created_at
        FROM user_robots 
        WHERE user_id IN ($inPlaceholders)
        ORDER BY created_at ASC
    ");
    $robotsStmt->execute(array_values($candidateUserIds));
    $dbRobots = [];
    while ($rRow = $robotsStmt->fetch(PDO::FETCH_ASSOC)) {
        $rId = $rRow['id'];
        $rName = $rRow['name'] ?? '名無しのロボット';
        $headPart = (!empty($rRow['head_part_id']) && isset($partsMap[$rRow['head_part_id']])) ? $partsMap[$rRow['head_part_id']] : null;
        $bodyPart = (!empty($rRow['body_part_id']) && isset($partsMap[$rRow['body_part_id']])) ? $partsMap[$rRow['body_part_id']] : null;
        $armsPart = (!empty($rRow['arms_part_id']) && isset($partsMap[$rRow['arms_part_id']])) ? $partsMap[$rRow['arms_part_id']] : null;
        $legsPart = (!empty($rRow['legs_part_id']) && isset($partsMap[$rRow['legs_part_id']])) ? $partsMap[$rRow['legs_part_id']] : null;

        // 各パーツのステータス合算
        $calcStats = [
            'hp' => 0,
            'power' => 0,
            'defense' => 0,
            'agility' => 0,
            'dexterity' => 0,
            'intelligence' => 0,
        ];
        $totalValue = 0;
        $partsList = array_filter([$headPart, $bodyPart, $armsPart, $legsPart]);
        foreach ($partsList as $p) {
            $pStats = $p['stats'] ?? $p['baseStats'] ?? [];
            $calcStats['hp'] += (int)($pStats['hp'] ?? 0);
            $calcStats['power'] += (int)($pStats['power'] ?? 0);
            $calcStats['defense'] += (int)($pStats['defense'] ?? 0);
            $calcStats['agility'] += (int)($pStats['agility'] ?? 0);
            $calcStats['dexterity'] += (int)($pStats['dexterity'] ?? 0);
            $calcStats['intelligence'] += (int)($pStats['intelligence'] ?? $pStats['int'] ?? 0);
            $totalValue += (int)($p['value'] ?? 50);
        }

        $bStats = null;
        if (!empty($rRow['battleStats'])) {
            $bStats = is_array($rRow['battleStats']) ? $rRow['battleStats'] : json_decode($rRow['battleStats'], true);
        }

        $createdAtMs = !empty($rRow['created_at']) ? strtotime($rRow['created_at']) * 1000 : time() * 1000;

        $dbRobots[] = [
            'id' => $rId,
            'name' => $rName,
            'parts' => [
                'head' => $headPart,
                'body' => $bodyPart,
                'arms' => $armsPart,
                'legs' => $legsPart,
            ],
            'stats' => $calcStats,
            'currentHp' => isset($rRow['currentHp']) ? (int)$rRow['currentHp'] : 12,
            'maxHp' => isset($rRow['maxHP']) ? (int)$rRow['maxHP'] : max(12, $calcStats['hp']),
            'battleStats' => $bStats,
            'createdAt' => $createdAtMs,
            'value' => $totalValue
        ];
    }

    // 10. complete_deliveries テーブルから納品履歴を取得
    $deliveredStmt = $pdo->prepare("
        SELECT log_data 
        FROM complete_deliveries 
        WHERE user_id IN ($inPlaceholders)
        ORDER BY completed_at DESC
    ");
    $deliveredStmt->execute(array_values($candidateUserIds));
    $dbDeliveredLogs = [];
    while ($dRow = $deliveredStmt->fetch()) {
        if (!empty($dRow['log_data'])) {
            $dData = json_decode($dRow['log_data'], true);
            if (is_array($dData)) {
                $dbDeliveredLogs[] = $dData;
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
        unset($gameData['battleElements']);
        unset($gameData['minigameRecords']);

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
        $gameData['deliveredLogs'] = $dbDeliveredLogs;
        $gameData['gold'] = $goldVal;
        $gameData['fame'] = $fameVal;
        $gameData['storageSize'] = $storageLimitVal;
        $gameData['deliveredRobotsCount'] = $deliveredCountVal;
        $gameData['requestEarnedGold'] = $requestEarnedGoldVal;
        $gameData['unlockedLocations'] = $unlockedLocationsVal;
        $gameData['activeQuest'] = $activeQuest;
        $gameData['activePartCraft'] = $activePartCraft;
        $gameData['activeRobotAssembly'] = $activeAssembly;
        $gameData['currentRequest'] = $currentRequest;
        $gameData['battleElements'] = $battleElements;
        $gameData['minigameRecords'] = $dbMinigameRecords;

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
            "deliveredLogs" => $dbDeliveredLogs,
            "gold" => $goldVal,
            "fame" => $fameVal,
            "storageSize" => $storageLimitVal,
            "deliveredRobotsCount" => $deliveredCountVal,
            "requestEarnedGold" => $requestEarnedGoldVal,
            "unlockedLocations" => $unlockedLocationsVal,
            "activeQuest" => $activeQuest,
            "activePartCraft" => $activePartCraft,
            "activeRobotAssembly" => $activeAssembly,
            "currentRequest" => $currentRequest,
            "battleElements" => $battleElements,
            "minigameRecords" => $dbMinigameRecords
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
