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
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable."]);
    exit;
}

try {
    // 1. usersテーブルから該当ユーザーの存在を確認
    // userIdとして google_id または users.id のどちらが渡されても解決できるようにする
    $userStmt = $pdo->prepare("SELECT google_id, id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $userRecord = $userStmt->fetch();

    $actualUserId = $userId;
    if ($userRecord && !empty($userRecord['google_id'])) {
        $actualUserId = $userRecord['google_id'];
    }

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
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_comp_head FOREIGN KEY (head_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_comp_body FOREIGN KEY (body_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_comp_arms FOREIGN KEY (arms_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_comp_legs FOREIGN KEY (legs_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL
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
    ");

    try {
        $pdo->exec("ALTER TABLE active_expeditions ADD COLUMN dispatched_robot_id VARCHAR(255)");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("UPDATE completed_robots SET head_part_id = NULL WHERE head_part_id IS NOT NULL AND head_part_id NOT IN (SELECT id FROM complete_parts)");
        $pdo->exec("UPDATE completed_robots SET body_part_id = NULL WHERE body_part_id IS NOT NULL AND body_part_id NOT IN (SELECT id FROM complete_parts)");
        $pdo->exec("UPDATE completed_robots SET arms_part_id = NULL WHERE arms_part_id IS NOT NULL AND arms_part_id NOT IN (SELECT id FROM complete_parts)");
        $pdo->exec("UPDATE completed_robots SET legs_part_id = NULL WHERE legs_part_id IS NOT NULL AND legs_part_id NOT IN (SELECT id FROM complete_parts)");
    } catch (PDOException $e) {}

    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_head FOREIGN KEY (head_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_body FOREIGN KEY (body_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_arms FOREIGN KEY (arms_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_legs FOREIGN KEY (legs_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE active_requests ADD COLUMN request_data JSON");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_parts ADD COLUMN part_data JSON");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN robot_data JSON");
    } catch (PDOException $e) {}

    $pdo->beginTransaction();

    // 2. save_data テーブルにゲーム全体のスナップショットを保存 (UPSERT)
    // 廃止された starterBonusClaimed などの変数は完全に除去して保存
    // 他の個別テーブルで管理・保存されるデータ（active_* テーブルや個別テーブル）は save_data テーブルには重複して追加・保存しない
    $saveDataSnapshot = $gameData;
    unset($saveDataSnapshot['starterBonusClaimed']);

    // activeが付いたテーブルに保存される情報
    unset($saveDataSnapshot['activeQuest']);            // active_expeditions
    unset($saveDataSnapshot['activePartCraft']);        // active_part_crafts
    unset($saveDataSnapshot['activeRobotAssembly']);    // active_robot_assemblies
    unset($saveDataSnapshot['activeRobotDisassembly']); // active_robot_disassemblies
    unset($saveDataSnapshot['activePartRecycle']);       // active_part_recycles
    unset($saveDataSnapshot['currentRequest']);         // active_requests

    // completeが付いたテーブルに保存される情報
    unset($saveDataSnapshot['completeQuest']);          // complete_expeditions
    unset($saveDataSnapshot['completedQuest']);
    unset($saveDataSnapshot['completePartCraft']);      // complete_part_crafts
    unset($saveDataSnapshot['completedPartCraft']);
    unset($saveDataSnapshot['completeRobotAssembly']);  // complete_robot_assemblies
    unset($saveDataSnapshot['completedRobotAssembly']);
    unset($saveDataSnapshot['completeRobotDisassembly']); // complete_robot_disassemblies
    unset($saveDataSnapshot['completedRobotDisassembly']);
    unset($saveDataSnapshot['completePartRecycle']);     // complete_part_recycles
    unset($saveDataSnapshot['completedPartRecycle']);
    unset($saveDataSnapshot['completeRequest']);        // complete_requests
    unset($saveDataSnapshot['completedRequest']);

    // その他の個別テーブルに保存される情報も重複排除
    unset($saveDataSnapshot['robots']);                 // user_robots
    unset($saveDataSnapshot['parts']);                  // user_parts
    unset($saveDataSnapshot['craftedRobots']);          // craftedRobots
    unset($saveDataSnapshot['deliveredLogs']);          // deliveredLogs
    unset($saveDataSnapshot['materials']);              // user_material
    unset($saveDataSnapshot['gold']);                   // user_workshop_status
    unset($saveDataSnapshot['fame']);                   // user_workshop_status
    unset($saveDataSnapshot['storageSize']);            // user_workshop_status
    unset($saveDataSnapshot['deliveredRobotsCount']);   // user_workshop_status
    unset($saveDataSnapshot['battleElements']);         // user_minigame_status
    unset($saveDataSnapshot['minigameRecords']);        // user_minigame_status

    $jsonGameData = json_encode($saveDataSnapshot, JSON_UNESCAPED_UNICODE);
    $stmtSave = $pdo->prepare("
        INSERT INTO save_data (user_id, game_data) 
        VALUES (:user_id, :game_data)
        ON DUPLICATE KEY UPDATE game_data = :update_data
    ");
    $stmtSave->execute([
        ':user_id' => $actualUserId,
        ':game_data' => $jsonGameData,
        ':update_data' => $jsonGameData
    ]);

    // 3. user_workshop_status テーブルに工房ステータスを保存 (UPSERT)
    $gold = isset($gameData['gold']) ? (int)$gameData['gold'] : 0;
    $fame = isset($gameData['fame']) ? (int)$gameData['fame'] : 0;
    $storageLimit = isset($gameData['storageSize']) ? (int)$gameData['storageSize'] : 0;
    $deliveredCount = isset($gameData['deliveredRobotsCount']) ? (int)$gameData['deliveredRobotsCount'] : 0;

    $stmtWorkshop = $pdo->prepare("
        INSERT INTO user_workshop_status (user_id, fame, gold, storage_limit, delivered_count)
        VALUES (:user_id, :fame, :gold, :storage_limit, :delivered_count)
        ON DUPLICATE KEY UPDATE 
            fame = :up_fame,
            gold = :up_gold,
            storage_limit = :up_storage_limit,
            delivered_count = :up_delivered_count
    ");
    $stmtWorkshop->execute([
        ':user_id' => $actualUserId,
        ':fame' => $fame,
        ':gold' => $gold,
        ':storage_limit' => $storageLimit,
        ':delivered_count' => $deliveredCount,
        ':up_fame' => $fame,
        ':up_gold' => $gold,
        ':up_storage_limit' => $storageLimit,
        ':up_delivered_count' => $deliveredCount,
    ]);

    // 4. user_parts テーブルの同期
    $delPartsStmt = $pdo->prepare("DELETE FROM user_parts WHERE user_id = :user_id");
    $delPartsStmt->execute([':user_id' => $actualUserId]);

    if (!empty($gameData['parts']) && is_array($gameData['parts'])) {
        $stmtPart = $pdo->prepare("
            INSERT INTO user_parts (id, user_id, master_part_id, is_equipped, part_data)
            VALUES (:id, :user_id, :master_id, :is_equipped, :part_data)
        ");

        // 装備中パーツのIDリストを収集
        $equippedPartIds = [];
        if (!empty($gameData['robots']) && is_array($gameData['robots'])) {
            foreach ($gameData['robots'] as $r) {
                if (!empty($r['parts'])) {
                    foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                        if (!empty($r['parts'][$pKey]['id'])) {
                            $equippedPartIds[$r['parts'][$pKey]['id']] = true;
                        }
                    }
                }
            }
        }

        foreach ($gameData['parts'] as $part) {
            if (empty($part['id'])) continue;
            // state.parts内ですでにisEquippedが設定されていればそれを優先
            $isEquipped = (!empty($part['isEquipped']) || !empty($equippedPartIds[$part['id']])) ? 1 : 0;
            $stmtPart->execute([
                ':id' => $part['id'],
                ':user_id' => $actualUserId,
                ':master_id' => $part['name'] ?? $part['id'],
                ':is_equipped' => $isEquipped,
                ':part_data' => json_encode($part, JSON_UNESCAPED_UNICODE)
            ]);
        }
    }

    // 5. user_robots テーブルの同期
    // 既存ロボットデータを一旦クリアして最新の所持ロボットを挿入
    $delRobotsStmt = $pdo->prepare("DELETE FROM user_robots WHERE user_id = :user_id");
    $delRobotsStmt->execute([':user_id' => $actualUserId]);

    if (!empty($gameData['robots']) && is_array($gameData['robots'])) {
        $stmtRobot = $pdo->prepare("
            INSERT INTO user_robots (
                id, user_id, name, head_part_id, body_part_id, arms_part_id, legs_part_id,
                total_hp, total_power, total_defense, total_agility, total_dexterity, total_int, robot_data
            ) VALUES (
                :id, :user_id, :name, :head_id, :body_id, :arms_id, :legs_id,
                :hp, :power, :defense, :agility, :dexterity, :intel, :robot_data
            )
        ");

        foreach ($gameData['robots'] as $robot) {
            if (empty($robot['id'])) continue;
            $headId = $robot['parts']['head']['id'] ?? '';
            $bodyId = $robot['parts']['body']['id'] ?? '';
            $armsId = $robot['parts']['arms']['id'] ?? '';
            $legsId = $robot['parts']['legs']['id'] ?? '';
            $stats = $robot['stats'] ?? [];
            $stmtRobot->execute([
                ':id' => $robot['id'],
                ':user_id' => $actualUserId,
                ':name' => $robot['name'] ?? '名無しのロボット',
                ':head_id' => $headId,
                ':body_id' => $bodyId,
                ':arms_id' => $armsId,
                ':legs_id' => $legsId,
                ':hp' => (int)($stats['hp'] ?? 0),
                ':power' => (int)($stats['power'] ?? 0),
                ':defense' => (int)($stats['defense'] ?? 0),
                ':agility' => (int)($stats['agility'] ?? 0),
                ':dexterity' => (int)($stats['dexterity'] ?? 0),
                ':intel' => (int)($stats['intelligence'] ?? 0),
                ':robot_data' => json_encode($robot, JSON_UNESCAPED_UNICODE)
            ]);
        }
    }

    if (!empty($gameData['deliveredLogs']) && is_array($gameData['deliveredLogs'])) {
        $stmtDeliveredRobot = $pdo->prepare("
            INSERT IGNORE INTO completed_robots (
                id, user_id, name, head_part_id, body_part_id, arms_part_id, legs_part_id,
                total_hp, total_power, total_defense, total_agility, total_dexterity, total_int, robot_data, completed_at
            ) VALUES (
                :id, :user_id, :name, :head_id, :body_id, :arms_id, :legs_id,
                :hp, :power, :defense, :agility, :dexterity, :intel, :robot_data, FROM_UNIXTIME(:completed_at)
            )
        ");
        
        $stmtCompleteParts = $pdo->prepare("
            INSERT IGNORE INTO complete_parts (
                id, user_id, master_id, part_data, completed_at
            ) VALUES (
                :id, :user_id, :master_id, :part_data, FROM_UNIXTIME(:completed_at)
            )
        ");
        
        $stmtCompleteDeliveries = $pdo->prepare("
            INSERT IGNORE INTO complete_deliveries (
                id, user_id, robot_id, robot_name, log_data, completed_at
            ) VALUES (
                :id, :user_id, :robot_id, :robot_name, :log_data, FROM_UNIXTIME(:completed_at)
            )
        ");

        foreach ($gameData['deliveredLogs'] as $log) {
            if (empty($log['id'])) continue;
            $headId = $log['parts']['head']['id'] ?? '';
            $bodyId = $log['parts']['body']['id'] ?? '';
            $armsId = $log['parts']['arms']['id'] ?? '';
            $legsId = $log['parts']['legs']['id'] ?? '';
            $stats = $log['stats'] ?? [];
            $completedAt = isset($log['deliveredAt']) ? floor($log['deliveredAt'] / 1000) : time();
            
            foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                if (!empty($log['parts'][$pKey]['id'])) {
                    $pData = $log['parts'][$pKey];
                    $stmtCompleteParts->execute([
                        ':id' => $pData['id'],
                        ':user_id' => $actualUserId,
                        ':master_id' => $pData['name'] ?? $pData['id'],
                        ':part_data' => json_encode($pData, JSON_UNESCAPED_UNICODE),
                        ':completed_at' => $completedAt
                    ]);
                }
            }

            $stmtDeliveredRobot->execute([
                ':id' => $log['id'],
                ':user_id' => $actualUserId,
                ':name' => $log['name'] ?? '名無しのロボット',
                ':head_id' => $headId,
                ':body_id' => $bodyId,
                ':arms_id' => $armsId,
                ':legs_id' => $legsId,
                ':hp' => (int)($stats['hp'] ?? 0),
                ':power' => (int)($stats['power'] ?? 0),
                ':defense' => (int)($stats['defense'] ?? 0),
                ':agility' => (int)($stats['agility'] ?? 0),
                ':dexterity' => (int)($stats['dexterity'] ?? 0),
                ':intel' => (int)($stats['intelligence'] ?? 0),
                ':robot_data' => json_encode($log, JSON_UNESCAPED_UNICODE),
                ':completed_at' => $completedAt
            ]);

            $stmtCompleteDeliveries->execute([
                ':id' => $log['id'] . '_' . $completedAt,
                ':user_id' => $actualUserId,
                ':robot_id' => $log['id'],
                ':robot_name' => $log['name'] ?? '名無しのロボット',
                ':log_data' => json_encode($log, JSON_UNESCAPED_UNICODE),
                ':completed_at' => $completedAt
            ]);
        }
    }

    // =========================================================================
    // 6. 遠征（Expeditions）: 完了時は complete_expeditions に追加後に active_expeditions から削除
    // =========================================================================
    $compQ = $gameData['completeQuest'] ?? $gameData['completedQuest'] ?? null;
    if (!empty($compQ) && !empty($compQ['locationId'])) {
        // 1. complete_expeditions テーブルに完了レコードを追加
        $stmtCompExp = $pdo->prepare("
            INSERT INTO complete_expeditions (user_id, location_id, start_time, end_time, dispatched_robot_id, reward_data)
            VALUES (:user_id, :location_id, :start_time, :end_time, :dispatched_robot_id, :reward_data)
        ");
        $stmtCompExp->execute([
            ':user_id' => $actualUserId,
            ':location_id' => $compQ['locationId'],
            ':start_time' => (int)($compQ['startTime'] ?? 0),
            ':end_time' => (int)($compQ['endTime'] ?? 0),
            ':dispatched_robot_id' => $compQ['dispatchedRobotId'] ?? null,
            ':reward_data' => json_encode($compQ['rewardData'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
        // 2. complete に追加完了後、対となる active_expeditions から確実に削除
        $delExp = $pdo->prepare("DELETE FROM active_expeditions WHERE user_id = :user_id");
        $delExp->execute([':user_id' => $actualUserId]);
    } elseif (!empty($gameData['activeQuest']) && !empty($gameData['activeQuest']['locationId'])) {
        // 進行中の場合は active_expeditions テーブルを同期
        $q = $gameData['activeQuest'];
        $stmtExp = $pdo->prepare("
            REPLACE INTO active_expeditions (user_id, location_id, start_time, end_time, dispatched_robot_id)
            VALUES (:user_id, :location_id, :start_time, :end_time, :dispatched_robot_id)
        ");
        $stmtExp->execute([
            ':user_id' => $actualUserId,
            ':location_id' => $q['locationId'],
            ':start_time' => (int)($q['startTime'] ?? 0),
            ':end_time' => (int)($q['endTime'] ?? 0),
            ':dispatched_robot_id' => $q['dispatchedRobotId'] ?? null
        ]);
    } else {
        $delExp = $pdo->prepare("DELETE FROM active_expeditions WHERE user_id = :user_id");
        $delExp->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 7. パーツ製造（Part Crafts）: 完了時は complete_part_crafts に追加後に active_part_crafts から削除
    // =========================================================================
    $compC = $gameData['completePartCraft'] ?? $gameData['completedPartCraft'] ?? null;
    if (!empty($compC) && !empty($compC['partType'])) {
        // 1. complete_part_crafts テーブルに完了レコードを追加
        $stmtCompCraft = $pdo->prepare("
            INSERT INTO complete_part_crafts (user_id, part_type, main_material_id, sub_material_id, start_time, end_time, result_part_data)
            VALUES (:user_id, :part_type, :main_id, :sub_id, :start_time, :end_time, :result_part_data)
        ");
        $stmtCompCraft->execute([
            ':user_id' => $actualUserId,
            ':part_type' => $compC['partType'],
            ':main_id' => $compC['mainMaterialId'] ?? '',
            ':sub_id' => $compC['subMaterialId'] ?? '',
            ':start_time' => (int)($compC['startTime'] ?? 0),
            ':end_time' => (int)($compC['endTime'] ?? 0),
            ':result_part_data' => json_encode($compC['resultPart'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
        // 2. complete に追加完了後、対となる active_part_crafts から確実に削除
        $delCraft = $pdo->prepare("DELETE FROM active_part_crafts WHERE user_id = :user_id");
        $delCraft->execute([':user_id' => $actualUserId]);
    } elseif (!empty($gameData['activePartCraft']) && !empty($gameData['activePartCraft']['partType'])) {
        // 進行中の場合は active_part_crafts テーブルを同期
        $c = $gameData['activePartCraft'];
        $stmtCraft = $pdo->prepare("
            REPLACE INTO active_part_crafts (user_id, part_type, main_material_id, sub_material_id, start_time, end_time)
            VALUES (:user_id, :part_type, :main_id, :sub_id, :start_time, :end_time)
        ");
        $stmtCraft->execute([
            ':user_id' => $actualUserId,
            ':part_type' => $c['partType'],
            ':main_id' => $c['mainMaterialId'] ?? '',
            ':sub_id' => $c['subMaterialId'] ?? '',
            ':start_time' => (int)($c['startTime'] ?? 0),
            ':end_time' => (int)($c['endTime'] ?? 0)
        ]);
    } else {
        $delCraft = $pdo->prepare("DELETE FROM active_part_crafts WHERE user_id = :user_id");
        $delCraft->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 8. ロボット組立（Robot Assemblies）: 完了時は complete_robot_assemblies に追加後に active_robot_assemblies から削除
    // =========================================================================
    $compA = $gameData['completeRobotAssembly'] ?? $gameData['completedRobotAssembly'] ?? null;
    if (!empty($compA) && !empty($compA['startTime'])) {
        // 1. complete_robot_assemblies テーブルに完了レコードを追加
        $stmtCompAss = $pdo->prepare("
            INSERT INTO complete_robot_assemblies (user_id, start_time, end_time, result_robot_data)
            VALUES (:user_id, :start_time, :end_time, :result_robot_data)
        ");
        $stmtCompAss->execute([
            ':user_id' => $actualUserId,
            ':start_time' => (int)($compA['startTime'] ?? 0),
            ':end_time' => (int)($compA['endTime'] ?? 0),
            ':result_robot_data' => json_encode($compA['resultRobot'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
        // 2. complete に追加完了後、対となる active_robot_assemblies から確実に削除
        $delAss = $pdo->prepare("DELETE FROM active_robot_assemblies WHERE user_id = :user_id");
        $delAss->execute([':user_id' => $actualUserId]);
    } elseif (!empty($gameData['activeRobotAssembly']) && !empty($gameData['activeRobotAssembly']['startTime'])) {
        // 進行中の場合は active_robot_assemblies テーブルを同期
        $a = $gameData['activeRobotAssembly'];
        $stmtAss = $pdo->prepare("
            REPLACE INTO active_robot_assemblies (user_id, start_time, end_time, result_robot_data)
            VALUES (:user_id, :start_time, :end_time, :result_robot_data)
        ");
        $stmtAss->execute([
            ':user_id' => $actualUserId,
            ':start_time' => (int)($a['startTime'] ?? 0),
            ':end_time' => (int)($a['endTime'] ?? 0),
            ':result_robot_data' => json_encode($a['resultRobot'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
    } else {
        $delAss = $pdo->prepare("DELETE FROM active_robot_assemblies WHERE user_id = :user_id");
        $delAss->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 9. 依頼納品（Requests）: 完了時は complete_requests に追加後に active_requests から削除
    // =========================================================================
    $compR = $gameData['completeRequest'] ?? $gameData['completedRequest'] ?? null;
    if (!empty($compR) && !empty($compR['requestId'])) {
        // 1. complete_requests テーブルに完了レコードを追加
        $stmtCompReq = $pdo->prepare("
            INSERT INTO complete_requests (user_id, request_id, rank, reward_g, deadline, delivered_robot_id, request_data)
            VALUES (:user_id, :request_id, :rank, :reward_g, :deadline, :delivered_robot_id, :request_data)
        ");
        $stmtCompReq->execute([
            ':user_id' => $actualUserId,
            ':request_id' => $compR['requestId'],
            ':rank' => $compR['rank'] ?? 'OldMan',
            ':reward_g' => (int)($compR['rewardG'] ?? 0),
            ':deadline' => (int)($compR['deadline'] ?? 0),
            ':delivered_robot_id' => $compR['deliveredRobotId'] ?? null,
            ':request_data' => json_encode($compR['requestData'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
        // 2. complete に追加完了後、対となる active_requests から確実に削除
        $delReq = $pdo->prepare("DELETE FROM active_requests WHERE user_id = :user_id");
        $delReq->execute([':user_id' => $actualUserId]);
    } elseif (!empty($gameData['currentRequest']) && !empty($gameData['currentRequest']['id'])) {
        // 進行中の場合は active_requests テーブルを同期
        $r = $gameData['currentRequest'];
        $stmtReq = $pdo->prepare("
            REPLACE INTO active_requests (user_id, request_id, rank, reward_g, deadline, request_data)
            VALUES (:user_id, :request_id, :rank, :reward_g, :deadline, :request_data)
        ");
        $stmtReq->execute([
            ':user_id' => $actualUserId,
            ':request_id' => $r['id'],
            ':rank' => $r['rank'] ?? 'OldMan',
            ':reward_g' => (int)($r['rewardG'] ?? 0),
            ':deadline' => (int)($r['deadline'] ?? 0),
            ':request_data' => json_encode($r, JSON_UNESCAPED_UNICODE)
        ]);
    } else {
        $delReq = $pdo->prepare("DELETE FROM active_requests WHERE user_id = :user_id");
        $delReq->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 10. ロボット解体（Robot Disassemblies）: 完了時は complete_robot_disassemblies に追加後に active_robot_disassemblies から削除
    // =========================================================================
    $compD = $gameData['completeRobotDisassembly'] ?? $gameData['completedRobotDisassembly'] ?? null;
    if (!empty($compD) && !empty($compD['startTime'])) {
        // 1. complete_robot_disassemblies テーブルに完了レコードを追加
        $stmtCompDis = $pdo->prepare("
            INSERT INTO complete_robot_disassemblies (user_id, robot_id, start_time, end_time, result_parts_data)
            VALUES (:user_id, :robot_id, :start_time, :end_time, :result_parts_data)
        ");
        $stmtCompDis->execute([
            ':user_id' => $actualUserId,
            ':robot_id' => $compD['robotClone']['id'] ?? '',
            ':start_time' => (int)($compD['startTime'] ?? 0),
            ':end_time' => (int)($compD['endTime'] ?? 0),
            ':result_parts_data' => json_encode($compD['resultParts'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
        // 2. complete に追加完了後、対となる active_robot_disassemblies から確実に削除
        $delDisass = $pdo->prepare("DELETE FROM active_robot_disassemblies WHERE user_id = :user_id");
        $delDisass->execute([':user_id' => $actualUserId]);
    } elseif (!empty($gameData['activeRobotDisassembly']) && !empty($gameData['activeRobotDisassembly']['startTime'])) {
        // 進行中の場合は active_robot_disassemblies テーブルを同期
        $ad = $gameData['activeRobotDisassembly'];
        $stmtDisass = $pdo->prepare("
            REPLACE INTO active_robot_disassemblies (user_id, robot_id, start_time, end_time, result_parts_data)
            VALUES (:user_id, :robot_id, :start_time, :end_time, :result_parts_data)
        ");
        $stmtDisass->execute([
            ':user_id' => $actualUserId,
            ':robot_id' => $ad['robotClone']['id'] ?? '',
            ':start_time' => (int)($ad['startTime'] ?? 0),
            ':end_time' => (int)($ad['endTime'] ?? 0),
            ':result_parts_data' => json_encode($ad['resultParts'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
    } else {
        $delDisass = $pdo->prepare("DELETE FROM active_robot_disassemblies WHERE user_id = :user_id");
        $delDisass->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 11. パーツリサイクル（Part Recycles）: 完了時は complete_part_recycles に追加後に active_part_recycles から削除
    // =========================================================================
    $compRec = $gameData['completePartRecycle'] ?? $gameData['completedPartRecycle'] ?? null;
    if (!empty($compRec) && !empty($compRec['startTime'])) {
        // 1. complete_part_recycles テーブルに完了レコードを追加
        $stmtCompRec = $pdo->prepare("
            INSERT INTO complete_part_recycles (user_id, part_id, start_time, end_time, result_materials_data)
            VALUES (:user_id, :part_id, :start_time, :end_time, :result_materials_data)
        ");
        $stmtCompRec->execute([
            ':user_id' => $actualUserId,
            ':part_id' => $compRec['partClone']['id'] ?? '',
            ':start_time' => (int)($compRec['startTime'] ?? 0),
            ':end_time' => (int)($compRec['endTime'] ?? 0),
            ':result_materials_data' => json_encode($compRec['resultMaterials'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
        // 2. complete に追加完了後、対となる active_part_recycles から確実に削除
        $delRec = $pdo->prepare("DELETE FROM active_part_recycles WHERE user_id = :user_id");
        $delRec->execute([':user_id' => $actualUserId]);
    } elseif (!empty($gameData['activePartRecycle']) && !empty($gameData['activePartRecycle']['startTime'])) {
        // 進行中の場合は active_part_recycles テーブルを同期
        $ar = $gameData['activePartRecycle'];
        $stmtRec = $pdo->prepare("
            REPLACE INTO active_part_recycles (user_id, part_id, start_time, end_time, result_materials_data)
            VALUES (:user_id, :part_id, :start_time, :end_time, :result_materials_data)
        ");
        $stmtRec->execute([
            ':user_id' => $actualUserId,
            ':part_id' => $ar['partClone']['id'] ?? '',
            ':start_time' => (int)($ar['startTime'] ?? 0),
            ':end_time' => (int)($ar['endTime'] ?? 0),
            ':result_materials_data' => json_encode($ar['resultMaterials'] ?? [], JSON_UNESCAPED_UNICODE)
        ]);
    } else {
        $delRec = $pdo->prepare("DELETE FROM active_part_recycles WHERE user_id = :user_id");
        $delRec->execute([':user_id' => $actualUserId]);
    }

    // completeテーブル群の保存上限ローテーション（ユーザー毎に最大1000件保持、1000件を超過した古いレコードから自動削除）
    $completeTables = [
        'complete_expeditions',
        'complete_part_crafts',
        'complete_robot_assemblies',
        'complete_requests',
        'complete_robot_disassemblies',
        'complete_part_recycles'
    ];

    foreach ($completeTables as $tbl) {
        // user_idごとに降順で1000件目の境界IDを取得（1000件以内ならNULL/falseが返る）
        $cutoffStmt = $pdo->prepare("
            SELECT id FROM {$tbl} 
            WHERE user_id = :user_id 
            ORDER BY id DESC 
            LIMIT 1 OFFSET 1000
        ");
        $cutoffStmt->execute([':user_id' => $actualUserId]);
        $cutoffId = $cutoffStmt->fetchColumn();

        if ($cutoffId !== false && $cutoffId !== null) {
            // 境界ID以下の古いレコードを削除（失敗時は例外発生により単一トランザクション全体がロールバック）
            $pruneStmt = $pdo->prepare("
                DELETE FROM {$tbl} 
                WHERE user_id = :user_id AND id <= :cutoff_id
            ");
            $pruneStmt->execute([
                ':user_id' => $actualUserId,
                ':cutoff_id' => $cutoffId
            ]);
        }
    }

    // completed_robots テーブルの保存上限ローテーション (id が文字列なので completed_at を使用)
    $cutoffRobotStmt = $pdo->prepare("
        SELECT completed_at FROM completed_robots
        WHERE user_id = :user_id
        ORDER BY completed_at DESC
        LIMIT 1 OFFSET 1000
    ");
    $cutoffRobotStmt->execute([':user_id' => $actualUserId]);
    $cutoffTime = $cutoffRobotStmt->fetchColumn();
    if ($cutoffTime !== false && $cutoffTime !== null) {
        // 先に削除対象のロボットに紐づくパーツIDを取得し、complete_partsから削除
        $getPrunePartsStmt = $pdo->prepare("
            SELECT head_part_id, body_part_id, arms_part_id, legs_part_id 
            FROM completed_robots 
            WHERE user_id = :user_id AND completed_at <= :cutoff_time
        ");
        $getPrunePartsStmt->execute([
            ':user_id' => $actualUserId,
            ':cutoff_time' => $cutoffTime
        ]);
        
        $partIdsToDelete = [];
        while ($row = $getPrunePartsStmt->fetch(PDO::FETCH_ASSOC)) {
            if (!empty($row['head_part_id'])) $partIdsToDelete[] = $row['head_part_id'];
            if (!empty($row['body_part_id'])) $partIdsToDelete[] = $row['body_part_id'];
            if (!empty($row['arms_part_id'])) $partIdsToDelete[] = $row['arms_part_id'];
            if (!empty($row['legs_part_id'])) $partIdsToDelete[] = $row['legs_part_id'];
        }

        if (!empty($partIdsToDelete)) {
            $inQuery = implode(',', array_fill(0, count($partIdsToDelete), '?'));
            $deletePartsStmt = $pdo->prepare("DELETE FROM complete_parts WHERE id IN ($inQuery)");
            $deletePartsStmt->execute($partIdsToDelete);
        }

        $pruneRobotStmt = $pdo->prepare("
            DELETE FROM completed_robots
            WHERE user_id = :user_id AND completed_at <= :cutoff_time
        ");
        $pruneRobotStmt->execute([
            ':user_id' => $actualUserId,
            ':cutoff_time' => $cutoffTime
        ]);
    }

    // complete_deliveries テーブルの保存上限ローテーション
    $cutoffDelivStmt = $pdo->prepare("
        SELECT completed_at FROM complete_deliveries
        WHERE user_id = :user_id
        ORDER BY completed_at DESC
        LIMIT 1 OFFSET 1000
    ");
    $cutoffDelivStmt->execute([':user_id' => $actualUserId]);
    $cutoffDelivTime = $cutoffDelivStmt->fetchColumn();
    if ($cutoffDelivTime !== false && $cutoffDelivTime !== null) {
        $pruneDelivStmt = $pdo->prepare("
            DELETE FROM complete_deliveries
            WHERE user_id = :user_id AND completed_at <= :cutoff_time
        ");
        $pruneDelivStmt->execute([
            ':user_id' => $actualUserId,
            ':cutoff_time' => $cutoffDelivTime
        ]);
    }

    // 10. user_minigame_status テーブルの同期 (ミニゲーム毎の遊んだ数、勝利数、獲得エレメント数)
    $elements = isset($gameData['battleElements']) ? (int)$gameData['battleElements'] : 0;
    $minigameRecords = (isset($gameData['minigameRecords']) && is_array($gameData['minigameRecords'])) ? $gameData['minigameRecords'] : [];

    // もし minigameRecords に combat_training または combat が無ければ初期化
    if (!isset($minigameRecords['combat_training']) && !isset($minigameRecords['combat'])) {
        $minigameRecords['combat_training'] = ['plays' => 0, 'wins' => 0, 'elements' => $elements];
    }

    $stmtMini = $pdo->prepare("
        INSERT INTO user_minigame_status (user_id, minigame_id, play_count, wins, elements_count)
        VALUES (:user_id, :minigame_id, :play_count, :wins, :elements_count)
        ON DUPLICATE KEY UPDATE 
            play_count = :play_count_up,
            wins = :wins_up,
            elements_count = :elements_count_up
    ");

    foreach ($minigameRecords as $mId => $mRec) {
        $plays = isset($mRec['plays']) ? (int)$mRec['plays'] : 0;
        $wins = isset($mRec['wins']) ? (int)$mRec['wins'] : 0;
        $elem = isset($mRec['elements']) ? (int)$mRec['elements'] : (($mId === 'combat_training' || $mId === 'combat') ? $elements : 0);

        $stmtMini->execute([
            ':user_id' => $actualUserId,
            ':minigame_id' => (string)$mId,
            ':play_count' => $plays,
            ':wins' => $wins,
            ':elements_count' => $elem,
            ':play_count_up' => $plays,
            ':wins_up' => $wins,
            ':elements_count_up' => $elem
        ]);
    }

    // 11. user_material テーブルの同期（所持素材数）
    $delMatStmt = $pdo->prepare("DELETE FROM user_material WHERE user_id = :user_id");
    $delMatStmt->execute([':user_id' => $actualUserId]);

    if (!empty($gameData['materials']) && is_array($gameData['materials'])) {
        $stmtMat = $pdo->prepare("
            INSERT INTO user_material (user_id, material_id, count)
            VALUES (:user_id, :material_id, :count)
            ON DUPLICATE KEY UPDATE count = :up_count
        ");
        foreach ($gameData['materials'] as $matId => $matCount) {
            $countVal = (int)$matCount;
            if ($countVal > 0) {
                $stmtMat->execute([
                    ':user_id' => $actualUserId,
                    ':material_id' => (string)$matId,
                    ':count' => $countVal,
                    ':up_count' => $countVal
                ]);
            }
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "All user data saved to appropriate database tables successfully.",
        "userId" => $actualUserId
    ]);
} catch (PDOException $e) {
    $wasInTransaction = false;
    if ($pdo && $pdo->inTransaction()) {
        $wasInTransaction = true;
        $pdo->rollBack();
    }
    error_log("[save.php] Database save transaction failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "rolledBack" => $wasInTransaction,
        "error" => "データベース更新に失敗したため、すべてのテーブル変更をロールバックしました: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
