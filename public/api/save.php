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
    ");

    try {
        $pdo->exec("ALTER TABLE active_expeditions ADD COLUMN dispatched_robot_id VARCHAR(255)");
    } catch (PDOException $e) {}

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
    unset($saveDataSnapshot['currentRequest']);         // active_requests

    // その他の個別テーブルに保存される情報も重複排除
    unset($saveDataSnapshot['robots']);                 // user_robots
    unset($saveDataSnapshot['parts']);                  // user_parts
    unset($saveDataSnapshot['materials']);              // user_material
    unset($saveDataSnapshot['gold']);                   // user_workshop_status
    unset($saveDataSnapshot['fame']);                   // user_workshop_status
    unset($saveDataSnapshot['storageSize']);            // user_workshop_status
    unset($saveDataSnapshot['deliveredRobotsCount']);   // user_workshop_status
    unset($saveDataSnapshot['battleElements']);         // user_minigame_status

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

    // 6. active_expeditions テーブルの同期
    if (!empty($gameData['activeQuest']) && !empty($gameData['activeQuest']['locationId'])) {
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

    // 7. active_part_crafts テーブルの同期
    if (!empty($gameData['activePartCraft']) && !empty($gameData['activePartCraft']['partType'])) {
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

    // 8. active_robot_assemblies テーブルの同期
    if (!empty($gameData['activeRobotAssembly']) && !empty($gameData['activeRobotAssembly']['startTime'])) {
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

    // 9. active_requests テーブルの同期
    if (!empty($gameData['currentRequest']) && !empty($gameData['currentRequest']['id'])) {
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

    // 10. user_minigame_status テーブルの同期 (バトル演習エレメント等)
    $elements = isset($gameData['battleElements']) ? (int)$gameData['battleElements'] : 0;
    $stmtMini = $pdo->prepare("
        INSERT INTO user_minigame_status (user_id, minigame_id, elements_count)
        VALUES (:user_id, 'combat_training', :elements)
        ON DUPLICATE KEY UPDATE elements_count = :elements_up
    ");
    $stmtMini->execute([
        ':user_id' => $actualUserId,
        ':elements' => $elements,
        ':elements_up' => $elements
    ]);

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
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "error" => "Database save error: " . $e->getMessage()
    ]);
}
