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

// 既存テーブルの自動名称変更マイグレーション
try {
    $existingTables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $existingLower = array_map('strtolower', $existingTables);
    if (in_array('daily_cleared_minigame', $existingLower, true) && !in_array('completed_daily_minigame', $existingLower, true)) {
        $pdo->exec("RENAME TABLE daily_cleared_minigame TO completed_daily_minigame");
    }
    if (in_array('minigame_rankings', $existingLower, true) && !in_array('stats_minigame_rankings', $existingLower, true)) {
        $pdo->exec("RENAME TABLE minigame_rankings TO stats_minigame_rankings");
    }
    if (in_array('save_data', $existingLower, true) && !in_array('user_save_data', $existingLower, true)) {
        $pdo->exec("RENAME TABLE save_data TO user_save_data");
    }
} catch (Throwable $e) {}

try {
    // 1. usersテーブルから該当ユーザーの存在を確認
    // userIdとして google_id または users.id のどちらが渡されても解決できるようにする
    $userStmt = $pdo->prepare("SELECT google_id, id FROM users WHERE google_id = :u1 OR id = :u2 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId]);
    $userRecord = $userStmt->fetch();

    $actualUserId = $userId;
    if ($userRecord && !empty($userRecord['google_id'])) {
        $actualUserId = $userRecord['google_id'];
    } else {
        try {
            $insU = $pdo->prepare("INSERT IGNORE INTO users (google_id) VALUES (:gid)");
            $insU->execute([':gid' => $userId]);
        } catch (Throwable $e) {}
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

        CREATE TABLE IF NOT EXISTS user_save_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL UNIQUE,
            game_data JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
            part_type VARCHAR(50) NOT NULL DEFAULT 'head',
            main_material_id VARCHAR(255) NOT NULL DEFAULT '',
            sub_material_id VARCHAR(255) NULL DEFAULT '',
            start_time BIGINT NOT NULL DEFAULT 0,
            end_time BIGINT NOT NULL DEFAULT 0,
            result_part_data JSON NULL,
            duration_ms BIGINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS complete_part_crafts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            part_type VARCHAR(50) NOT NULL DEFAULT 'head',
            main_material_id VARCHAR(255) NOT NULL DEFAULT '',
            sub_material_id VARCHAR(255) NULL DEFAULT '',
            start_time BIGINT NOT NULL DEFAULT 0,
            end_time BIGINT NOT NULL DEFAULT 0,
            result_part_data JSON NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_comp_craft_user (user_id)
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
            head_part_id VARCHAR(255),
            body_part_id VARCHAR(255),
            arms_part_id VARCHAR(255),
            legs_part_id VARCHAR(255),
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_act_disass_head FOREIGN KEY (head_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_act_disass_body FOREIGN KEY (body_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_act_disass_arms FOREIGN KEY (arms_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
            CONSTRAINT fk_act_disass_legs FOREIGN KEY (legs_part_id) REFERENCES user_parts(id) ON DELETE SET NULL
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

        CREATE TABLE IF NOT EXISTS user_item (
            user_id VARCHAR(255) PRIMARY KEY,
            repair_kit INT DEFAULT 0,
            bronze_chest INT DEFAULT 0,
            silver_chest INT DEFAULT 0,
            gold_chest INT DEFAULT 0,
            mythic_chest INT DEFAULT 0,
            element INT DEFAULT 0,
            battle_item JSON NULL,
            reversi_item JSON NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS user_minigame_status (
            user_id VARCHAR(255),
            minigame_id VARCHAR(255),
            play_count INT DEFAULT 0,
            wins INT DEFAULT 0,
            elements_count INT DEFAULT 0,
            chests_count INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, minigame_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS completed_daily_minigame (
            id INT AUTO_INCREMENT PRIMARY KEY,
            minigame_id VARCHAR(32) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            robot_id VARCHAR(64) NOT NULL,
            level VARCHAR(32) NOT NULL DEFAULT '1',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_daily_clear (user_id, robot_id, minigame_id, level),
            INDEX idx_user_robot (user_id, robot_id),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    try {
        $pdo->exec("DROP TABLE IF EXISTS m_parts_encyclopedia");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE completed_daily_minigame MODIFY COLUMN user_id VARCHAR(255) NOT NULL");
        $pdo->exec("ALTER TABLE completed_daily_minigame MODIFY COLUMN robot_id VARCHAR(64) NOT NULL");
        $pdo->exec("ALTER TABLE completed_daily_minigame MODIFY COLUMN minigame_id VARCHAR(32) NOT NULL");
        $pdo->exec("ALTER TABLE completed_daily_minigame MODIFY COLUMN level VARCHAR(32) NOT NULL DEFAULT '1'");
    } catch (PDOException $e) {}

    // 毎朝9:00基準の期限切れデイリークリアレコードの削除
    try {
        $nowJst = new DateTime('now', new DateTimeZone('Asia/Tokyo'));
        $cutoffJst = clone $nowJst;
        if ((int)$nowJst->format('H') >= 9) {
            $cutoffJst->setTime(9, 0, 0);
        } else {
            $cutoffJst->modify('-1 day')->setTime(9, 0, 0);
        }
        $cutoffStr = $cutoffJst->setTimezone(new DateTimeZone(date_default_timezone_get()))->format('Y-m-d H:i:s');
        $delDailyStmt = $pdo->prepare("DELETE FROM completed_daily_minigame WHERE created_at < :cutoff");
        $delDailyStmt->execute([':cutoff' => $cutoffStr]);
    } catch (Throwable $e) {}

    try {
        $pdo->exec("ALTER TABLE user_item ADD COLUMN battle_item JSON NULL AFTER element");
    } catch (PDOException $e) {}
    try {
        $pdo->exec("ALTER TABLE user_item ADD COLUMN reversi_item JSON NULL AFTER battle_item");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_minigame_status ADD COLUMN chests_count INT DEFAULT 0");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE active_expeditions ADD COLUMN dispatched_robot_id VARCHAR(255)");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE active_requests ADD COLUMN request_data JSON");
    } catch (PDOException $e) {}

    // active_part_crafts テーブルのカラム拡張・互換マイグレーション
    try { $pdo->exec("ALTER TABLE active_part_crafts ADD COLUMN result_part_data JSON NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE active_part_crafts ADD COLUMN duration_ms BIGINT DEFAULT 0"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE active_part_crafts MODIFY COLUMN sub_material_id VARCHAR(255) NULL DEFAULT ''"); } catch (PDOException $e) {}

    // complete_part_crafts テーブルのカラム拡張・互換マイグレーション
    try { $pdo->exec("ALTER TABLE complete_part_crafts ADD COLUMN part_type VARCHAR(50) NOT NULL DEFAULT 'head'"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE complete_part_crafts ADD COLUMN main_material_id VARCHAR(255) NOT NULL DEFAULT ''"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE complete_part_crafts ADD COLUMN sub_material_id VARCHAR(255) NULL DEFAULT ''"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE complete_part_crafts ADD COLUMN start_time BIGINT NOT NULL DEFAULT 0"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE complete_part_crafts ADD COLUMN end_time BIGINT NOT NULL DEFAULT 0"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE complete_part_crafts ADD COLUMN result_part_data JSON NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE complete_part_crafts MODIFY COLUMN sub_material_id VARCHAR(255) NULL DEFAULT ''"); } catch (PDOException $e) {}

    $partColsSave = [
        "ADD COLUMN IF NOT EXISTS part_type VARCHAR(50) NOT NULL DEFAULT 'head'",
        "ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT ''",
        "ADD COLUMN IF NOT EXISTS attribute VARCHAR(50) NOT NULL DEFAULT 'Fire'",
        "ADD COLUMN IF NOT EXISTS rarity INT NOT NULL DEFAULT 1",
        "ADD COLUMN IF NOT EXISTS visual_index INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS vitality INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS power INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS defense INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS agility INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS dexterity INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS intelligence INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS main_material_id VARCHAR(100) NULL",
        "ADD COLUMN IF NOT EXISTS sub_material_id VARCHAR(100) NULL"
    ];
    foreach ($partColsSave as $colDef) {
        try {
            $cleanDef = str_replace('IF NOT EXISTS ', '', $colDef);
            $pdo->exec("ALTER TABLE user_parts " . $cleanDef);
        } catch (PDOException $e) {}
    }

    foreach (['battle_matches', 'battle_wins', 'battle_losses', 'battle_draws'] as $delCol) {
        try {
            $checkDelCol = $pdo->query("SHOW COLUMNS FROM user_parts LIKE '{$delCol}'");
            if ($checkDelCol && $checkDelCol->fetch()) {
                $pdo->exec("ALTER TABLE user_parts DROP COLUMN `{$delCol}`");
            }
        } catch (PDOException $e) {}
    }

    try {
        $checkHpCol = $pdo->query("SHOW COLUMNS FROM user_parts LIKE 'hp'");
        if ($checkHpCol && $checkHpCol->fetch()) {
            $pdo->exec("ALTER TABLE user_parts CHANGE COLUMN hp vitality INT NOT NULL DEFAULT 0");
        }
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN currentHp INT DEFAULT 12");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN maxHP INT DEFAULT 12");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN battleStats JSON");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN request_earned_gold INT DEFAULT 0");
    } catch (PDOException $e) {}

    // active_robot_disassemblies テーブルのカラムマイグレーション
    try {
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD COLUMN head_part_id VARCHAR(255) NULL");
    } catch (PDOException $e) {}
    try {
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD COLUMN body_part_id VARCHAR(255) NULL");
    } catch (PDOException $e) {}
    try {
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD COLUMN arms_part_id VARCHAR(255) NULL");
    } catch (PDOException $e) {}
    try {
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD COLUMN legs_part_id VARCHAR(255) NULL");
    } catch (PDOException $e) {}
    try {
        $checkCol = $pdo->query("SHOW COLUMNS FROM active_robot_disassemblies LIKE 'result_parts_data'");
        if ($checkCol && $checkCol->fetch()) {
            $pdo->exec("ALTER TABLE active_robot_disassemblies DROP COLUMN result_parts_data");
        }
    } catch (PDOException $e) {}

    // 遠征地マスターテーブルと初期データの存在を保証
    ensureMasterExpeditions($pdo);

    // 24テーブルに対するusers(google_id)の外部キー制約を適用・保証
    ensureUserForeignKeys($pdo);

    $pdo->beginTransaction();

    // 2. save_data テーブルにゲーム全体のスナップショットを保存 (UPSERT)
    // 廃止された starterBonusClaimed などの変数は完全に除去して保存
    // 他の個別テーブルで管理・保存されるデータ（active_* / complete_* テーブルや個別テーブル）は save_data テーブルには一切含めず完全排除
    $saveDataSnapshot = $gameData;
    unset($saveDataSnapshot['starterBonusClaimed']);

    // activeが付いたテーブルに保存される情報
    unset($saveDataSnapshot['activeQuest']);            // active_expeditions
    unset($saveDataSnapshot['activeExpedition']);
    unset($saveDataSnapshot['activeExpeditions']);
    unset($saveDataSnapshot['activePartCraft']);        // active_part_crafts
    unset($saveDataSnapshot['activePartCrafts']);
    unset($saveDataSnapshot['activeRobotAssembly']);    // active_robot_assemblies
    unset($saveDataSnapshot['activeRobotAssemblies']);
    unset($saveDataSnapshot['activeRobotDisassembly']); // active_robot_disassemblies
    unset($saveDataSnapshot['activeRobotDisassemblies']);
    unset($saveDataSnapshot['activePartRecycle']);       // active_part_recycles
    unset($saveDataSnapshot['activePartRecycles']);
    unset($saveDataSnapshot['currentRequest']);         // active_requests
    unset($saveDataSnapshot['activeRequest']);
    unset($saveDataSnapshot['activeRequests']);

    // completeが付いたテーブルに保存される情報（製造完了したパーツ情報等はsave_dataには含めずcomplete_part_crafts/user_partsにのみ保存）
    unset($saveDataSnapshot['completeQuest']);          // complete_expeditions
    unset($saveDataSnapshot['completedQuest']);
    unset($saveDataSnapshot['completeExpedition']);
    unset($saveDataSnapshot['completedExpedition']);
    unset($saveDataSnapshot['completeExpeditions']);
    unset($saveDataSnapshot['completedExpeditions']);
    unset($saveDataSnapshot['completePartCraft']);      // complete_part_crafts
    unset($saveDataSnapshot['completedPartCraft']);     // complete_part_crafts
    unset($saveDataSnapshot['completePartCrafts']);     // complete_part_crafts
    unset($saveDataSnapshot['completedPartCrafts']);    // complete_part_crafts
    unset($saveDataSnapshot['completePart']);           // complete_part_crafts
    unset($saveDataSnapshot['completedPart']);          // complete_part_crafts
    unset($saveDataSnapshot['completeParts']);          // complete_part_crafts
    unset($saveDataSnapshot['completedParts']);         // complete_part_crafts
    unset($saveDataSnapshot['completeRobotAssembly']);  // complete_robot_assemblies
    unset($saveDataSnapshot['completedRobotAssembly']);
    unset($saveDataSnapshot['completeRobotAssemblies']);
    unset($saveDataSnapshot['completedRobotAssemblies']);
    unset($saveDataSnapshot['completeRobotDisassembly']); // complete_robot_disassemblies
    unset($saveDataSnapshot['completedRobotDisassembly']);
    unset($saveDataSnapshot['completeRobotDisassemblies']);
    unset($saveDataSnapshot['completedRobotDisassemblies']);
    unset($saveDataSnapshot['completePartRecycle']);     // complete_part_recycles
    unset($saveDataSnapshot['completedPartRecycle']);
    unset($saveDataSnapshot['completePartRecycles']);
    unset($saveDataSnapshot['completedPartRecycles']);
    unset($saveDataSnapshot['completeRequest']);        // complete_requests
    unset($saveDataSnapshot['completedRequest']);
    unset($saveDataSnapshot['completeRequests']);
    unset($saveDataSnapshot['completedRequests']);
    unset($saveDataSnapshot['completeDeliveries']);
    unset($saveDataSnapshot['completedDeliveries']);

    // その他の個別テーブルに保存される情報も重複排除（fameはフェイルセーフのためsave_dataにもバックアップ保持）
    unset($saveDataSnapshot['robots']);                 // user_robots
    unset($saveDataSnapshot['parts']);                  // user_parts
    unset($saveDataSnapshot['craftedParts']);           // user_parts
    unset($saveDataSnapshot['craftedRobots']);          // craftedRobots
    unset($saveDataSnapshot['deliveredLogs']);          // deliveredLogs
    unset($saveDataSnapshot['materials']);              // user_material
    unset($saveDataSnapshot['gold']);                   // user_workshop_status
    // unset($saveDataSnapshot['fame']);               // user_workshop_status (バックアップとして保持)
    unset($saveDataSnapshot['storageSize']);            // user_workshop_status
    unset($saveDataSnapshot['deliveredRobotsCount']);   // user_workshop_status
    unset($saveDataSnapshot['requestEarnedGold']);       // user_workshop_status
    unset($saveDataSnapshot['unlockedLocations']);      // user_workshop_status
    unset($saveDataSnapshot['battleElements']);         // user_item
    unset($saveDataSnapshot['minigameRecords']);        // user_minigame_status
    unset($saveDataSnapshot['repairKits']);             // user_item
    unset($saveDataSnapshot['unopenedChests']);         // user_item
    unset($saveDataSnapshot['combatEquipments']);       // user_item (battle_item)
    unset($saveDataSnapshot['combatEquipmentRanks']);   // user_item (battle_item)
    unset($saveDataSnapshot['activeCombatEquipments']); // user_item (battle_item)
    unset($saveDataSnapshot['othelloPurchasedMemories']); // user_item (reversi_item)
    unset($saveDataSnapshot['othelloEquippedMemories']);  // user_item (reversi_item)
    unset($saveDataSnapshot['reversiPurchasedMemories']); // user_item (reversi_item)
    unset($saveDataSnapshot['reversiEquippedMemories']);  // user_item (reversi_item)
    unset($saveDataSnapshot['dailyBattleLimits']);        // completed_daily_minigame

    $jsonGameData = json_encode($saveDataSnapshot, JSON_UNESCAPED_UNICODE);
    $stmtSave = $pdo->prepare("
        INSERT INTO user_save_data (user_id, game_data) 
        VALUES (:user_id, :game_data)
        ON DUPLICATE KEY UPDATE game_data = :update_data
    ");
    $stmtSave->execute([
        ':user_id' => $actualUserId,
        ':game_data' => $jsonGameData,
        ':update_data' => $jsonGameData
    ]);

    // 3. user_workshop_status テーブルに工房ステータスを保存 (UPSERT)

    $numericId = ($userRecord && !empty($userRecord['id'])) ? (string)$userRecord['id'] : null;
    $candidateUserIds = array_unique(array_filter([$actualUserId, $userId, $numericId]));
    $inPlaceholders = implode(',', array_fill(0, count($candidateUserIds), '?'));

    $stmtCurrent = $pdo->prepare("
        SELECT user_id, gold, fame, storage_limit, delivered_count, consumed_gold, unlocked_expeditions, received_initial_bonus, request_earned_gold 
        FROM user_workshop_status 
        WHERE user_id IN ($inPlaceholders) 
        ORDER BY gold DESC, fame DESC, updated_at DESC
    ");
    $stmtCurrent->execute(array_values($candidateUserIds));
    $existingRows = $stmtCurrent->fetchAll(PDO::FETCH_ASSOC);
    $currentRow = !empty($existingRows) ? $existingRows[0] : null;

    $currentLocations = ['loc1'];
    $currentConsumedGold = 0;
    $currentDbGold = 0;
    $currentDbFame = 0;
    $currentStorage = 5;
    $currentDelivered = 0;
    $currentReceivedBonus = 0;
    foreach ($existingRows as $er) {
        if (!empty($er['received_initial_bonus'])) {
            $currentReceivedBonus = 1;
        }
    }
    if ($currentRow) {
        if (!empty($currentRow['unlocked_expeditions'])) {
            $parsedLocs = json_decode($currentRow['unlocked_expeditions'], true);
            if (is_array($parsedLocs)) {
                $currentLocations = array_values(array_unique(array_merge(['loc1'], $parsedLocs)));
            }
        }
        $currentConsumedGold = (int)($currentRow['consumed_gold'] ?? 0);
        $currentDbGold = (int)($currentRow['gold'] ?? 0);
        $currentDbFame = (int)($currentRow['fame'] ?? 0);
        $currentStorage = (int)($currentRow['storage_limit'] ?? 5);
        $currentDelivered = (int)($currentRow['delivered_count'] ?? 0);
        if (!empty($currentRow['received_initial_bonus'])) {
            $currentReceivedBonus = 1;
        }
    }

    $rawClientGold = isset($gameData['gold']) ? (int)$gameData['gold'] : null;
    $rawClientFame = isset($gameData['fame']) ? (int)$gameData['fame'] : null;
    $storageLimit = !empty($gameData['storageSize']) ? (int)$gameData['storageSize'] : $currentStorage;
    $deliveredCount = isset($gameData['deliveredRobotsCount']) ? (int)$gameData['deliveredRobotsCount'] : $currentDelivered;

    // 名声(fame)は蓄積値（減少しない実績値）のため、DB上の既存名声とクライアント名声の最大値を採用し、
    // クライアントの初期化前空ステート等によって0にリセットされるのを確実に防止！
    $clientFameVal = $rawClientFame !== null ? $rawClientFame : 0;
    $fame = max($currentDbFame, $clientFameVal);

    $newLocations = isset($gameData['unlockedLocations']) && is_array($gameData['unlockedLocations']) ? $gameData['unlockedLocations'] : ['loc1'];
    // 「裏山のスクラップ場」（loc1）は最初から解放状態で設定
    if (!in_array('loc1', $newLocations)) {
        array_unshift($newLocations, 'loc1');
    }
    $newLocations = array_values(array_unique($newLocations));

    // 新たに解放された遠征地の差分を算出
    $diff = array_diff($newLocations, $currentLocations);
    $additionalConsumed = 0;
    if (!empty($diff)) {
        $in = str_repeat('?,', count($diff) - 1) . '?';
        $stmtCosts = $pdo->prepare("SELECT unlock_cost FROM master_expeditions WHERE id IN ($in)");
        $stmtCosts->execute(array_values($diff));
        while ($c = $stmtCosts->fetch(PDO::FETCH_ASSOC)) {
            $additionalConsumed += (int)$c['unlock_cost'];
        }
    }
    
    $consumedGold = $currentConsumedGold + $additionalConsumed;

    // gold / fame の決定とゼロ上書き防止ロジック:
    // 原因調査: クライアントが初期ロード完了前（未ロード）に初期ステート(gold: 0, fame: 0)を送信してしまい、
    // DBの既存の数値をゼロクリアしてしまうレースコンディションを完全に防止する。
    $isSuspectedUnloadedState = (
        empty($gameData['materials']) &&
        empty($gameData['parts']) &&
        empty($gameData['robots']) &&
        empty($gameData['deliveredLogs']) &&
        ($rawClientFame === null || $rawClientFame === 0) &&
        (($rawClientGold === 0 && $currentDbGold > 0) || ($rawClientFame === 0 && $currentDbFame > 0))
    );

    if ($isSuspectedUnloadedState) {
        // ロード前の空データと判定される場合は既存のgold/fameを死守
        $gold = $currentDbGold;
        $fame = $currentDbFame;
    } else if ($rawClientGold !== null) {
        // クライアントからgoldが明示されている場合
        $gold = $rawClientGold;
        // もし遠征地が新たに解放され、かつクライアントのgoldがまだ減算前の値（= $currentDbGold 以上）だった場合は確実に解放費用を減額
        if ($additionalConsumed > 0 && $gold >= $currentDbGold && $currentDbGold > 0) {
            $gold = max(0, $currentDbGold - $additionalConsumed);
        }
    } else {
        // クライアントからの指定がない場合は既存のgoldから解放費用を差し引く
        $gold = max(0, $currentDbGold - $additionalConsumed);
    }

    $allLocations = array_values(array_unique(array_merge($currentLocations, $newLocations)));
    $unlockedExpeditionsJson = json_encode($allLocations, JSON_UNESCAPED_UNICODE);

    $stmtWorkshop = $pdo->prepare("
        INSERT INTO user_workshop_status (user_id, fame, gold, storage_limit, delivered_count, consumed_gold, unlocked_expeditions, received_initial_bonus)
        VALUES (:user_id, :fame, :gold, :storage_limit, :delivered_count, :consumed_gold, :unlocked, :bonus)
        ON DUPLICATE KEY UPDATE 
            fame = GREATEST(COALESCE(fame, 0), :up_fame),
            gold = :up_gold,
            storage_limit = :up_storage_limit,
            delivered_count = :up_delivered_count,
            consumed_gold = :up_consumed_gold,
            unlocked_expeditions = :up_unlocked,
            received_initial_bonus = :up_bonus
    ");
    $stmtWorkshop->execute([
        ':user_id' => $actualUserId,
        ':fame' => $fame,
        ':gold' => $gold,
        ':storage_limit' => $storageLimit,
        ':delivered_count' => $deliveredCount,
        ':consumed_gold' => $consumedGold,
        ':unlocked' => $unlockedExpeditionsJson,
        ':bonus' => $currentReceivedBonus,
        ':up_fame' => $fame,
        ':up_gold' => $gold,
        ':up_storage_limit' => $storageLimit,
        ':up_delivered_count' => $deliveredCount,
        ':up_consumed_gold' => $consumedGold,
        ':up_unlocked' => $unlockedExpeditionsJson,
        ':up_bonus' => $currentReceivedBonus,
    ]);

    // 重複していた別IDレコードがあれば削除して actualUserId に一元化
    if (count($existingRows) > 1 && !empty($actualUserId)) {
        try {
            $cleanStmt = $pdo->prepare("DELETE FROM user_workshop_status WHERE user_id IN ($inPlaceholders) AND user_id != ?");
            $params = array_values($candidateUserIds);
            $params[] = $actualUserId;
            $cleanStmt->execute($params);
        } catch (Exception $e) {}
    }

    // 4. user_parts テーブルの同期（個別カラム形式で保持、既存レコードの created_at は保護し余計な一括削除を行わない）
    // ※ 過去に実行されていた DELETE FROM user_parts は未装備パーツ(is_equipped=0)の消失および全パーツの created_at 更新を引き起こしていたため完全撤廃
    $stmtPart = $pdo->prepare("
        INSERT INTO user_parts (
            id, user_id, master_part_id, part_type, name, attribute, rarity, visual_index,
            is_equipped, vitality, power, defense, agility, dexterity, intelligence,
            main_material_id, sub_material_id
        ) VALUES (
            :id, :user_id, :master_id, :part_type, :name, :attribute, :rarity, :visual_index,
            :is_equipped, :vitality, :power, :defense, :agility, :dexterity, :intelligence,
            :main_material_id, :sub_material_id
        )
        ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            master_part_id = VALUES(master_part_id),
            part_type = VALUES(part_type),
            name = VALUES(name),
            attribute = VALUES(attribute),
            rarity = VALUES(rarity),
            visual_index = VALUES(visual_index),
            is_equipped = VALUES(is_equipped),
            vitality = VALUES(vitality),
            power = VALUES(power),
            defense = VALUES(defense),
            agility = VALUES(agility),
            dexterity = VALUES(dexterity),
            intelligence = VALUES(intelligence),
            main_material_id = VALUES(main_material_id),
            sub_material_id = VALUES(sub_material_id)
    ");

    $extractPartParams = function($part, $userId, $isEquipped) {
        $stats = $part['stats'] ?? [];
        $pType = $part['type'] ?? $part['part_type'] ?? 'head';
        $rarity = isset($part['rarity']) ? (int)$part['rarity'] : 1;
        $visualIndex = isset($part['visualIndex']) ? (int)$part['visualIndex'] : (isset($part['visual_index']) ? (int)$part['visual_index'] : 0);

        // master_parts の ID (例: h1_0, b2_1) を解決する
        $resolveEncyclopediaId = function($matId, $pType, $rarity, $visualIndex) {
            if (empty($matId)) return null;
            if (preg_match('/^[hbal][1-3]_\d+$/i', $matId)) {
                return $matId;
            }
            $prefix = ['head' => 'h', 'body' => 'b', 'arms' => 'a', 'legs' => 'l'][$pType] ?? 'h';
            $r = $rarity ?: 1;
            $v = $visualIndex !== null ? (int)$visualIndex : 0;
            return "{$prefix}{$r}_{$v}";
        };

        $rawMainMat = $part['mainMaterialId'] ?? $part['main_material_id'] ?? null;
        $rawSubMat = $part['subMaterialId'] ?? $part['sub_material_id'] ?? null;

        $partId = !empty($part['id']) ? (string)$part['id'] : ('part_' . floor(microtime(true) * 1000) . '_' . substr(md5(uniqid()), 0, 7));

        return [
            ':id' => $partId,
            ':user_id' => $userId,
            ':master_id' => $part['name'] ?? $part['id'],
            ':part_type' => $pType,
            ':name' => $part['name'] ?? $part['id'] ?? 'パーツ',
            ':attribute' => $part['attribute'] ?? 'Fire',
            ':rarity' => $rarity,
            ':visual_index' => $visualIndex,
            ':is_equipped' => $isEquipped ? 1 : 0,
            ':vitality' => isset($stats['hp']) ? (int)$stats['hp'] : (isset($part['vitality']) ? (int)$part['vitality'] : (isset($part['hp']) ? (int)$part['hp'] : 0)),
            ':power' => isset($stats['power']) ? (int)$stats['power'] : (isset($part['power']) ? (int)$part['power'] : 0),
            ':defense' => isset($stats['defense']) ? (int)$stats['defense'] : (isset($part['defense']) ? (int)$part['defense'] : 0),
            ':agility' => isset($stats['agility']) ? (int)$stats['agility'] : (isset($part['agility']) ? (int)$part['agility'] : 0),
            ':dexterity' => isset($stats['dexterity']) ? (int)$stats['dexterity'] : (isset($part['dexterity']) ? (int)$part['dexterity'] : 0),
            ':intelligence' => isset($stats['intelligence']) ? (int)$stats['intelligence'] : (isset($stats['int']) ? (int)$stats['int'] : (isset($part['intelligence']) ? (int)$part['intelligence'] : 0)),
            ':main_material_id' => $resolveEncyclopediaId($rawMainMat, $pType, $rarity, $visualIndex),
            ':sub_material_id' => $resolveEncyclopediaId($rawSubMat, $pType, $rarity, $visualIndex),
        ];
    };

    if (!empty($gameData['parts']) && is_array($gameData['parts'])) {
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
            $params = $extractPartParams($part, $actualUserId, $isEquipped);
            $stmtPart->execute($params);
        }
    }

    // 5. user_robots テーブルの同期
    // 既存ロボットデータを一旦クリアして最新の所持ロボットを挿入
    $delRobotsStmt = $pdo->prepare("DELETE FROM user_robots WHERE user_id = :user_id");
    $delRobotsStmt->execute([':user_id' => $actualUserId]);

    if (!empty($gameData['robots']) && is_array($gameData['robots'])) {
        // ロボットが装備しているパーツも確実に user_parts に個別カラムで存在させる
        foreach ($gameData['robots'] as $robot) {
            if (!empty($robot['parts'])) {
                foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                    if (!empty($robot['parts'][$pKey]['id'])) {
                        $p = $robot['parts'][$pKey];
                        $params = $extractPartParams($p, $actualUserId, 1);
                        $stmtPart->execute($params);
                    }
                }
            }
        }

        $stmtRobot = $pdo->prepare("
            INSERT INTO user_robots (
                id, user_id, name, head_part_id, body_part_id, arms_part_id, legs_part_id,
                currentHp, maxHP, battleStats
            ) VALUES (
                :id, :user_id, :name, :head_id, :body_id, :arms_id, :legs_id,
                :current_hp, :max_hp, :battle_stats
            )
        ");

        foreach ($gameData['robots'] as $robot) {
            if (empty($robot['id'])) continue;
            $headId = !empty($robot['parts']['head']['id']) ? $robot['parts']['head']['id'] : null;
            $bodyId = !empty($robot['parts']['body']['id']) ? $robot['parts']['body']['id'] : null;
            $armsId = !empty($robot['parts']['arms']['id']) ? $robot['parts']['arms']['id'] : null;
            $legsId = !empty($robot['parts']['legs']['id']) ? $robot['parts']['legs']['id'] : null;
            $stats = $robot['stats'] ?? [];
            $currentHp = isset($robot['currentHp']) ? (int)$robot['currentHp'] : 12;
            $maxHp = isset($robot['maxHp']) ? (int)$robot['maxHp'] : (int)($stats['hp'] ?? 12);
            $battleStats = !empty($robot['battleStats']) && is_array($robot['battleStats'])
                ? json_encode($robot['battleStats'], JSON_UNESCAPED_UNICODE)
                : null;
            $stmtRobot->execute([
                ':id' => $robot['id'],
                ':user_id' => $actualUserId,
                ':name' => $robot['name'] ?? '名無しのロボット',
                ':head_id' => $headId,
                ':body_id' => $bodyId,
                ':arms_id' => $armsId,
                ':legs_id' => $legsId,
                ':current_hp' => $currentHp,
                ':max_hp' => $maxHp,
                ':battle_stats' => $battleStats
            ]);
        }
    }

    // =========================================================================
    // 5.1 user_material テーブルの同期（所持素材数）: user_parts / user_robots と同一のトランザクション基本ブロック内で確実に処理
    // =========================================================================
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

    // =========================================================================
    // 5.2 user_item テーブルの同期（修理キット、宝箱、アイテム）
    // =========================================================================
    $repairKitCount = isset($gameData['repairKits']) ? (int)$gameData['repairKits'] : 0;
    $rawChests = (isset($gameData['unopenedChests']) && is_array($gameData['unopenedChests'])) ? $gameData['unopenedChests'] : [];
    $bronzeChestCount = isset($rawChests['bronze']) ? (int)$rawChests['bronze'] : 0;
    $silverChestCount = isset($rawChests['silver']) ? (int)$rawChests['silver'] : 0;
    $goldChestCount = isset($rawChests['gold']) ? (int)$rawChests['gold'] : 0;
    $mythicChestCount = isset($rawChests['mythic']) ? (int)$rawChests['mythic'] : 0;
    $elementCount = isset($gameData['battleElements']) ? (int)$gameData['battleElements'] : 0;

    $existingItemStmt = $pdo->prepare("SELECT battle_item, reversi_item FROM user_item WHERE user_id = :uid LIMIT 1");
    $existingItemStmt->execute([':uid' => $actualUserId]);
    $existingItemRow = $existingItemStmt->fetch(PDO::FETCH_ASSOC);

    $hasBattleInput = isset($gameData['combatEquipments']) || isset($gameData['combatEquipmentRanks']) || isset($gameData['activeCombatEquipments']);
    $hasReversiInput = isset($gameData['reversiPurchasedMemories']) || isset($gameData['othelloPurchasedMemories']) || isset($gameData['reversiEquippedMemories']) || isset($gameData['othelloEquippedMemories']);

    $battleItemJson = null;
    if ($hasBattleInput) {
        $battleItem = [
            'beamSaber' => !empty($gameData['combatEquipments']['beamSaber']),
            'beamShield' => !empty($gameData['combatEquipments']['beamShield']),
            'combatEquipments' => $gameData['combatEquipments'] ?? [],
            'combatEquipmentRanks' => $gameData['combatEquipmentRanks'] ?? [],
            'activeCombatEquipments' => $gameData['activeCombatEquipments'] ?? []
        ];
        $battleItemJson = json_encode($battleItem, JSON_UNESCAPED_UNICODE);
    } elseif ($existingItemRow && !empty($existingItemRow['battle_item'])) {
        $battleItemJson = $existingItemRow['battle_item'];
    }

    $reversiItemJson = null;
    if ($hasReversiInput) {
        $reversiItem = [
            'purchasedMemories' => $gameData['reversiPurchasedMemories'] ?? $gameData['othelloPurchasedMemories'] ?? [],
            'equippedMemories' => $gameData['reversiEquippedMemories'] ?? $gameData['othelloEquippedMemories'] ?? []
        ];
        $reversiItemJson = json_encode($reversiItem, JSON_UNESCAPED_UNICODE);
    } elseif ($existingItemRow && !empty($existingItemRow['reversi_item'])) {
        $reversiItemJson = $existingItemRow['reversi_item'];
    }

    $stmtItem = $pdo->prepare("
        INSERT INTO user_item (user_id, repair_kit, bronze_chest, silver_chest, gold_chest, mythic_chest, element, battle_item, reversi_item)
        VALUES (:user_id, :repair_kit, :bronze_chest, :silver_chest, :gold_chest, :mythic_chest, :element, :battle_item, :reversi_item)
        ON DUPLICATE KEY UPDATE
            repair_kit = :repair_kit_up,
            bronze_chest = :bronze_chest_up,
            silver_chest = :silver_chest_up,
            gold_chest = :gold_chest_up,
            mythic_chest = :mythic_chest_up,
            element = :element_up,
            battle_item = COALESCE(:battle_item_up, user_item.battle_item),
            reversi_item = COALESCE(:reversi_item_up, user_item.reversi_item)
    ");
    $stmtItem->execute([
        ':user_id' => $actualUserId,
        ':repair_kit' => $repairKitCount,
        ':bronze_chest' => $bronzeChestCount,
        ':silver_chest' => $silverChestCount,
        ':gold_chest' => $goldChestCount,
        ':mythic_chest' => $mythicChestCount,
        ':element' => $elementCount,
        ':battle_item' => $battleItemJson,
        ':reversi_item' => $reversiItemJson,
        ':repair_kit_up' => $repairKitCount,
        ':bronze_chest_up' => $bronzeChestCount,
        ':silver_chest_up' => $silverChestCount,
        ':gold_chest_up' => $goldChestCount,
        ':mythic_chest_up' => $mythicChestCount,
        ':element_up' => $elementCount,
        ':battle_item_up' => $battleItemJson,
        ':reversi_item_up' => $reversiItemJson
    ]);

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
        
        $stmtCompleteDeliveries = $pdo->prepare("
            INSERT IGNORE INTO complete_deliveries (
                id, user_id, robot_id, robot_name, log_data, completed_at
            ) VALUES (
                :id, :user_id, :robot_id, :robot_name, :log_data, FROM_UNIXTIME(:completed_at)
            )
        ");

        foreach ($gameData['deliveredLogs'] as $log) {
            if (empty($log['id'])) continue;
            $headId = !empty($log['parts']['head']['id']) ? $log['parts']['head']['id'] : null;
            $bodyId = !empty($log['parts']['body']['id']) ? $log['parts']['body']['id'] : null;
            $armsId = !empty($log['parts']['arms']['id']) ? $log['parts']['arms']['id'] : null;
            $legsId = !empty($log['parts']['legs']['id']) ? $log['parts']['legs']['id'] : null;
            $stats = $log['stats'] ?? [];
            $completedAt = isset($log['deliveredAt']) ? floor($log['deliveredAt'] / 1000) : time();

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
    // 6. 遠征（Expeditions）: 完了時は complete_expeditions に追加、進行中は active_expeditions に同期
    // =========================================================================
    $compQ = $gameData['completeQuest'] ?? $gameData['completedQuest'] ?? null;
    if (!empty($compQ) && !empty($compQ['locationId'])) {
        // 1. complete_expeditions テーブルに完了レコードを追加
        $stmtCompExp = $pdo->prepare("
            INSERT INTO complete_expeditions (user_id, location_id, start_time, end_time, dispatched_robot_id, reward_data)
            SELECT :user_id, :location_id, :start_time, :end_time, :dispatched_robot_id, :reward_data
            WHERE NOT EXISTS (
                SELECT 1 FROM complete_expeditions
                WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompExp->execute([
            ':user_id' => $actualUserId,
            ':location_id' => $compQ['locationId'],
            ':start_time' => (int)($compQ['startTime'] ?? 0),
            ':end_time' => (int)($compQ['endTime'] ?? 0),
            ':dispatched_robot_id' => $compQ['dispatchedRobotId'] ?? null,
            ':reward_data' => json_encode($compQ['rewardData'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($compQ['startTime'] ?? 0),
            ':chk_end_time' => (int)($compQ['endTime'] ?? 0)
        ]);
    }

    if (!empty($gameData['activeQuest']) && !empty($gameData['activeQuest']['locationId'])) {
        // 2. 進行中の場合は active_expeditions テーブルを同期
        $q = $gameData['activeQuest'];
        $stmtExp = $pdo->prepare("
            INSERT INTO active_expeditions (user_id, location_id, start_time, end_time, dispatched_robot_id)
            VALUES (:user_id, :location_id, :start_time, :end_time, :dispatched_robot_id)
            ON DUPLICATE KEY UPDATE
                location_id = VALUES(location_id),
                start_time = VALUES(start_time),
                end_time = VALUES(end_time),
                dispatched_robot_id = VALUES(dispatched_robot_id)
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
    // 7. パーツ製造（Part Crafts）: 完了時は complete_part_crafts に追加、user_partsへも同期、active_part_crafts は削除/更新
    //    ※これらすべての操作は同一トランザクション内で実行され、失敗時は全ロールバックされます
    // =========================================================================
    $compCraftsList = [];
    if (!empty($gameData['completePartCraft'])) {
        $compCraftsList[] = $gameData['completePartCraft'];
    }
    if (!empty($gameData['completedPartCraft'])) {
        $compCraftsList[] = $gameData['completedPartCraft'];
    }
    if (!empty($gameData['completedPartCrafts']) && is_array($gameData['completedPartCrafts'])) {
        foreach ($gameData['completedPartCrafts'] as $cp) {
            if (is_array($cp)) {
                $compCraftsList[] = $cp;
            }
        }
    }

    if (!empty($compCraftsList)) {
        // complete_part_crafts テーブルに完了レコードを確実に重複排除して追加
        $stmtCompCraft = $pdo->prepare("
            INSERT INTO complete_part_crafts (user_id, part_type, main_material_id, sub_material_id, start_time, end_time, result_part_data, completed_at)
            SELECT :ins_user_id, :ins_part_type, :ins_main_id, :ins_sub_id, :ins_start_time, :ins_end_time, :ins_result_part_data, FROM_UNIXTIME(:ins_completed_at)
            WHERE NOT EXISTS (
                SELECT 1 FROM complete_part_crafts
                WHERE user_id = :chk_user_id
                  AND (
                    (:chk_part_id != '' AND result_part_data LIKE :chk_part_id_like)
                    OR (:chk_start_time_gt > 0 AND :chk_end_time_gt > 0 AND start_time = :chk_start_time_eq AND end_time = :chk_end_time_eq)
                  )
            )
        ");

        $processedCraftKeys = [];
        foreach ($compCraftsList as $compC) {
            $pType = $compC['partType'] ?? ($compC['type'] ?? ($compC['resultPart']['type'] ?? 'head'));
            $mainMatId = $compC['mainMaterialId'] ?? ($compC['resultPart']['mainMaterialId'] ?? '');
            $subMatId = $compC['subMaterialId'] ?? ($compC['resultPart']['subMaterialId'] ?? '');
            $sTime = (int)($compC['startTime'] ?? 0);
            $eTime = (int)($compC['endTime'] ?? 0);
            $compAtMs = (int)($compC['completedAt'] ?? ($eTime > 0 ? $eTime : (time() * 1000)));
            $compAtSec = (int)floor($compAtMs / 1000);

            // 1. 製造パーツ情報（resultPart）の抽出・復元
            $resultPart = $compC['resultPart'] ?? null;
            if (empty($resultPart) && !empty($compC['result_part_data'])) {
                $resultPart = is_string($compC['result_part_data']) ? json_decode($compC['result_part_data'], true) : $compC['result_part_data'];
            }

            // resultPart が空の場合、gameData['parts'] から該当パーツを検索して補完
            if (empty($resultPart) && !empty($gameData['parts']) && is_array($gameData['parts'])) {
                foreach (array_reverse($gameData['parts']) as $gp) {
                    $gpType = $gp['type'] ?? $gp['part_type'] ?? '';
                    if ($gpType === $pType) {
                        $resultPart = $gp;
                        break;
                    }
                }
            }

            // それでも空の場合は最低限のパーツ情報を自己構築
            if (empty($resultPart)) {
                $resultPart = [
                    'id' => 'part_' . ($compAtMs > 0 ? $compAtMs : time() * 1000) . '_' . substr(md5(uniqid()), 0, 7),
                    'type' => $pType,
                    'name' => '完成パーツ (' . $pType . ')',
                    'attribute' => 'Fire',
                    'rarity' => 1,
                    'visualIndex' => 0,
                    'stats' => ['hp' => 10, 'power' => 5, 'defense' => 5, 'agility' => 5, 'dexterity' => 5, 'intelligence' => 5],
                    'mainMaterialId' => $mainMatId,
                    'subMaterialId' => $subMatId
                ];
            }

            $partId = !empty($resultPart['id']) ? (string)$resultPart['id'] : '';

            if ($sTime === 0 && $eTime === 0) {
                $sTime = $compAtMs > 0 ? ($compAtMs - 30000) : (time() * 1000 - 30000);
                $eTime = $compAtMs > 0 ? $compAtMs : (time() * 1000);
            }

            $dedupKey = !empty($partId) ? $partId : "{$sTime}_{$eTime}_{$pType}";
            if (isset($processedCraftKeys[$dedupKey])) continue;
            $processedCraftKeys[$dedupKey] = true;

            // 2. complete_part_crafts 追加と同時に user_parts テーブルにも確実にパーツを同期・追加（同一トランザクション内）
            if (!empty($resultPart) && is_array($resultPart)) {
                try {
                    $partParams = $extractPartParams($resultPart, $actualUserId, 0);
                    $stmtPart->execute($partParams);
                } catch (Exception $e) {
                    error_log("[save.php] user_parts sync from craft result failed: " . $e->getMessage());
                    throw $e; // トランザクションロールバックを誘発
                }
            }

            // 3. complete_part_crafts テーブルへレコード追加
            $stmtCompCraft->execute([
                ':ins_user_id' => $actualUserId,
                ':ins_part_type' => $pType,
                ':ins_main_id' => $mainMatId,
                ':ins_sub_id' => $subMatId,
                ':ins_start_time' => $sTime,
                ':ins_end_time' => $eTime,
                ':ins_result_part_data' => !empty($resultPart) ? json_encode($resultPart, JSON_UNESCAPED_UNICODE) : null,
                ':ins_completed_at' => $compAtSec > 0 ? $compAtSec : time(),
                ':chk_user_id' => $actualUserId,
                ':chk_part_id' => $partId,
                ':chk_part_id_like' => '%' . $partId . '%',
                ':chk_start_time_gt' => $sTime,
                ':chk_end_time_gt' => $eTime,
                ':chk_start_time_eq' => $sTime,
                ':chk_end_time_eq' => $eTime
            ]);
        }
    }

    // 4. active_part_crafts テーブルの同期または削除（同一トランザクション内）
    if (!empty($gameData['activePartCraft']) && (!empty($gameData['activePartCraft']['partType']) || !empty($gameData['activePartCraft']['type']))) {
        // 進行中の場合は active_part_crafts テーブルを同期
        $c = $gameData['activePartCraft'];
        $pType = $c['partType'] ?? ($c['type'] ?? 'head');
        $sTime = (int)($c['startTime'] ?? 0);
        $eTime = (int)($c['endTime'] ?? 0);
        $durationMs = isset($c['durationMs']) ? (int)$c['durationMs'] : ($eTime - $sTime);
        $resPart = $c['resultPart'] ?? null;

        $stmtCraft = $pdo->prepare("
            INSERT INTO active_part_crafts (user_id, part_type, main_material_id, sub_material_id, start_time, end_time, result_part_data, duration_ms)
            VALUES (:user_id, :part_type, :main_id, :sub_id, :start_time, :end_time, :result_part_data, :duration_ms)
            ON DUPLICATE KEY UPDATE
                part_type = VALUES(part_type),
                main_material_id = VALUES(main_material_id),
                sub_material_id = VALUES(sub_material_id),
                start_time = VALUES(start_time),
                end_time = VALUES(end_time),
                result_part_data = VALUES(result_part_data),
                duration_ms = VALUES(duration_ms)
        ");
        $stmtCraft->execute([
            ':user_id' => $actualUserId,
            ':part_type' => $pType,
            ':main_id' => $c['mainMaterialId'] ?? '',
            ':sub_id' => $c['subMaterialId'] ?? '',
            ':start_time' => $sTime,
            ':end_time' => $eTime,
            ':result_part_data' => !empty($resPart) ? json_encode($resPart, JSON_UNESCAPED_UNICODE) : null,
            ':duration_ms' => $durationMs > 0 ? $durationMs : 30000
        ]);
    } else {
        // 製造完了・受取済みの場合は active_part_crafts から確実に削除
        $delCraft = $pdo->prepare("DELETE FROM active_part_crafts WHERE user_id IN ($inPlaceholders)");
        $delCraft->execute(array_values($candidateUserIds));
    }

    // =========================================================================
    // 8. ロボット組立（Robot Assemblies）: 完了時は complete_robot_assemblies に追加、進行中は active_robot_assemblies に同期
    // =========================================================================
    $compA = $gameData['completeRobotAssembly'] ?? $gameData['completedRobotAssembly'] ?? null;
    if (!empty($compA) && !empty($compA['startTime'])) {
        // 1. complete_robot_assemblies テーブルに完了レコードを追加
        $robotId = !empty($compA['resultRobot']['id']) ? (string)$compA['resultRobot']['id'] : '';
        $stmtCompAss = $pdo->prepare("
            INSERT INTO complete_robot_assemblies (user_id, start_time, end_time, result_robot_data)
            SELECT :ins_user_id, :ins_start_time, :ins_end_time, :ins_result_robot_data
            WHERE NOT EXISTS (
                SELECT 1 FROM complete_robot_assemblies
                WHERE user_id = :chk_user_id
                  AND (
                    (:chk_robot_id != '' AND result_robot_data LIKE :chk_robot_id_like)
                    OR (:chk_start_time_gt > 0 AND :chk_end_time_gt > 0 AND start_time = :chk_start_time_eq AND end_time = :chk_end_time_eq)
                  )
            )
        ");
        $stmtCompAss->execute([
            ':ins_user_id' => $actualUserId,
            ':ins_start_time' => (int)($compA['startTime'] ?? 0),
            ':ins_end_time' => (int)($compA['endTime'] ?? 0),
            ':ins_result_robot_data' => json_encode($compA['resultRobot'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_robot_id' => $robotId,
            ':chk_robot_id_like' => '%' . $robotId . '%',
            ':chk_start_time_gt' => (int)($compA['startTime'] ?? 0),
            ':chk_end_time_gt' => (int)($compA['endTime'] ?? 0),
            ':chk_start_time_eq' => (int)($compA['startTime'] ?? 0),
            ':chk_end_time_eq' => (int)($compA['endTime'] ?? 0)
        ]);
    }

    if (!empty($gameData['activeRobotAssembly']) && !empty($gameData['activeRobotAssembly']['startTime'])) {
        // 進行中の場合は active_robot_assemblies テーブルを同期（全データを個別列化・パーツIDを外部キー保存）
        $a = $gameData['activeRobotAssembly'];
        $robot = $a['resultRobot'] ?? [];
        $parts = $robot['parts'] ?? [];

        // 組立予定ロボットの各パーツが user_parts に個別カラムで存在することを保証して外部キー制約を満たす
        foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
            if (!empty($parts[$pKey]['id']) && isset($extractPartParams) && isset($stmtPart)) {
                $p = $parts[$pKey];
                $params = $extractPartParams($p, $actualUserId, 1);
                $stmtPart->execute($params);
            }
        }

        $headId = !empty($parts['head']['id']) ? $parts['head']['id'] : null;
        $bodyId = !empty($parts['body']['id']) ? $parts['body']['id'] : null;
        $armsId = !empty($parts['arms']['id']) ? $parts['arms']['id'] : null;
        $legsId = !empty($parts['legs']['id']) ? $parts['legs']['id'] : null;

        $currentHp = isset($robot['currentHp']) ? (int)$robot['currentHp'] : 12;
        $maxHp = isset($robot['maxHp']) ? (int)$robot['maxHp'] : 12;
        $value = isset($robot['value']) ? (int)$robot['value'] : 0;
        $robotCreatedAt = isset($robot['createdAt']) ? (int)$robot['createdAt'] : (int)($a['startTime'] ?? 0);
        $durationMs = isset($a['durationMs']) ? (int)$a['durationMs'] : ((int)($a['endTime'] ?? 0) - (int)($a['startTime'] ?? 0));
        $robotId = !empty($robot['id']) ? $robot['id'] : ('rob_' . (int)($a['startTime'] ?? time()));
        $robotName = !empty($robot['name']) ? $robot['name'] : '組立中ロボット';

        $stmtAss = $pdo->prepare("
            INSERT INTO active_robot_assemblies (
                user_id, start_time, end_time, duration_ms,
                robot_id, robot_name,
                head_part_id, body_part_id, arms_part_id, legs_part_id,
                current_hp, max_hp, value, robot_created_at
            ) VALUES (
                :user_id, :start_time, :end_time, :duration_ms,
                :robot_id, :robot_name,
                :head_part_id, :body_part_id, :arms_part_id, :legs_part_id,
                :current_hp, :max_hp, :value, :robot_created_at
            ) ON DUPLICATE KEY UPDATE
                start_time = VALUES(start_time),
                end_time = VALUES(end_time),
                duration_ms = VALUES(duration_ms),
                robot_id = VALUES(robot_id),
                robot_name = VALUES(robot_name),
                head_part_id = VALUES(head_part_id),
                body_part_id = VALUES(body_part_id),
                arms_part_id = VALUES(arms_part_id),
                legs_part_id = VALUES(legs_part_id),
                current_hp = VALUES(current_hp),
                max_hp = VALUES(max_hp),
                value = VALUES(value),
                robot_created_at = VALUES(robot_created_at)
        ");
        $stmtAss->execute([
            ':user_id' => $actualUserId,
            ':start_time' => (int)($a['startTime'] ?? 0),
            ':end_time' => (int)($a['endTime'] ?? 0),
            ':duration_ms' => $durationMs,
            ':robot_id' => $robotId,
            ':robot_name' => $robotName,
            ':head_part_id' => $headId,
            ':body_part_id' => $bodyId,
            ':arms_part_id' => $armsId,
            ':legs_part_id' => $legsId,
            ':current_hp' => $currentHp,
            ':max_hp' => $maxHp,
            ':value' => $value,
            ':robot_created_at' => $robotCreatedAt
        ]);
    } else {
        $delAss = $pdo->prepare("DELETE FROM active_robot_assemblies WHERE user_id = :user_id");
        $delAss->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 9. 依頼納品（Requests）: 完了時は complete_requests に追加、進行中は active_requests に同期
    // =========================================================================
    $compR = $gameData['completeRequest'] ?? $gameData['completedRequest'] ?? null;
    if (!empty($compR) && !empty($compR['requestId'])) {
        $rewardG = (int)($compR['rewardG'] ?? 0);
        // 1. complete_requests テーブルに完了レコードを追加
        $stmtCompReq = $pdo->prepare("
            INSERT INTO complete_requests (user_id, request_id, rank, reward_g, deadline, delivered_robot_id, request_data)
            SELECT :user_id, :request_id, :rank, :reward_g, :deadline, :delivered_robot_id, :request_data
            WHERE NOT EXISTS (
                SELECT 1 FROM complete_requests
                WHERE user_id = :chk_user_id AND request_id = :chk_request_id AND deadline = :chk_deadline
            )
        ");
        $stmtCompReq->execute([
            ':user_id' => $actualUserId,
            ':request_id' => $compR['requestId'],
            ':rank' => $compR['rank'] ?? 'OldMan',
            ':reward_g' => $rewardG,
            ':deadline' => (int)($compR['deadline'] ?? 0),
            ':delivered_robot_id' => $compR['deliveredRobotId'] ?? null,
            ':request_data' => json_encode($compR['requestData'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_request_id' => $compR['requestId'],
            ':chk_deadline' => (int)($compR['deadline'] ?? 0)
        ]);

        // 2. 依頼完了時のトランザクション内で獲得したGおよび名声(fame)を user_workshop_status テーブルに確実に加算・記録
        $rewardFame = (int)($compR['rewardFame'] ?? ($compR['reward_fame'] ?? 0));
        if ($rewardFame <= 0) {
            $rRank = $compR['rank'] ?? 'OldMan';
            $rewardFame = ($rRank === 'King') ? 50 : (($rRank === 'Noble') ? 25 : 10);
        }

        if ($rewardG > 0 || $rewardFame > 0) {
            $stmtEarnedG = $pdo->prepare("
                INSERT INTO user_workshop_status (user_id, request_earned_gold, fame)
                VALUES (:user_id, :earned_gold, :earned_fame)
                ON DUPLICATE KEY UPDATE 
                    request_earned_gold = request_earned_gold + :up_earned_gold,
                    fame = COALESCE(fame, 0) + :up_earned_fame
            ");
            $stmtEarnedG->execute([
                ':user_id' => $actualUserId,
                ':earned_gold' => $rewardG,
                ':earned_fame' => $rewardFame,
                ':up_earned_gold' => $rewardG,
                ':up_earned_fame' => $rewardFame
            ]);
        }
    }

    if (!empty($gameData['currentRequest']) && !empty($gameData['currentRequest']['id'])) {
        // 進行中の場合は active_requests テーブルを同期
        $r = $gameData['currentRequest'];

        // request_data のうちテーブルの列（request_id, rank, reward_g, deadline）で保持している情報は除外
        $rPayload = is_array($r) ? $r : [];
        unset(
            $rPayload['id'],
            $rPayload['requestId'],
            $rPayload['request_id'],
            $rPayload['rank'],
            $rPayload['rewardG'],
            $rPayload['reward_g'],
            $rPayload['deadline']
        );

        $stmtReq = $pdo->prepare("
            INSERT INTO active_requests (user_id, request_id, rank, reward_g, deadline, request_data)
            VALUES (:user_id, :request_id, :rank, :reward_g, :deadline, :request_data)
            ON DUPLICATE KEY UPDATE
                request_id = VALUES(request_id),
                rank = VALUES(rank),
                reward_g = VALUES(reward_g),
                deadline = VALUES(deadline),
                request_data = VALUES(request_data)
        ");
        $stmtReq->execute([
            ':user_id' => $actualUserId,
            ':request_id' => $r['id'] ?? ($r['requestId'] ?? ''),
            ':rank' => $r['rank'] ?? 'OldMan',
            ':reward_g' => (int)($r['rewardG'] ?? ($r['reward_g'] ?? 0)),
            ':deadline' => (int)($r['deadline'] ?? 0),
            ':request_data' => !empty($rPayload) ? json_encode($rPayload, JSON_UNESCAPED_UNICODE) : null
        ]);
    } else {
        $delReq = $pdo->prepare("DELETE FROM active_requests WHERE user_id = :user_id");
        $delReq->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 10. ロボット解体（Robot Disassemblies）: 完了時は complete_robot_disassemblies に追加、進行中は active_robot_disassemblies に同期
    // =========================================================================
    $compD = $gameData['completeRobotDisassembly'] ?? $gameData['completedRobotDisassembly'] ?? null;
    if (!empty($compD) && !empty($compD['startTime'])) {
        // 1. complete_robot_disassemblies テーブルに完了レコードを追加
        $stmtCompDis = $pdo->prepare("
            INSERT INTO complete_robot_disassemblies (user_id, robot_id, start_time, end_time, result_parts_data)
            SELECT :user_id, :robot_id, :start_time, :end_time, :result_parts_data
            WHERE NOT EXISTS (
                SELECT 1 FROM complete_robot_disassemblies
                WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompDis->execute([
            ':user_id' => $actualUserId,
            ':robot_id' => $compD['robotClone']['id'] ?? '',
            ':start_time' => (int)($compD['startTime'] ?? 0),
            ':end_time' => (int)($compD['endTime'] ?? 0),
            ':result_parts_data' => json_encode($compD['resultParts'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($compD['startTime'] ?? 0),
            ':chk_end_time' => (int)($compD['endTime'] ?? 0)
        ]);
    }

    if (!empty($gameData['activeRobotDisassembly']) && !empty($gameData['activeRobotDisassembly']['startTime'])) {
        // 進行中の場合は active_robot_disassemblies テーブルを同期 (パーツIDを個別カラムで保持)
        $ad = $gameData['activeRobotDisassembly'];
        $robClone = $ad['robotClone'] ?? [];
        $robParts = $robClone['parts'] ?? [];
        $resultParts = $ad['resultParts'] ?? [];

        $headId = $robParts['head']['id'] ?? null;
        $bodyId = $robParts['body']['id'] ?? null;
        $armsId = $robParts['arms']['id'] ?? null;
        $legsId = $robParts['legs']['id'] ?? null;

        // resultParts からのフォールバック
        if (!$headId || !$bodyId || !$armsId || !$legsId) {
            foreach ($resultParts as $rp) {
                if (!is_array($rp)) continue;
                $type = strtolower($rp['type'] ?? '');
                if ($type === 'head' && !$headId) $headId = $rp['id'] ?? null;
                if ($type === 'body' && !$bodyId) $bodyId = $rp['id'] ?? null;
                if (($type === 'arms' || $type === 'arm') && !$armsId) $armsId = $rp['id'] ?? null;
                if (($type === 'legs' || $type === 'leg') && !$legsId) $legsId = $rp['id'] ?? null;
            }
        }

        $stmtDisass = $pdo->prepare("
            INSERT INTO active_robot_disassemblies (
                user_id, robot_id, head_part_id, body_part_id, arms_part_id, legs_part_id, start_time, end_time
            ) VALUES (
                :user_id, :robot_id, :head_part_id, :body_part_id, :arms_part_id, :legs_part_id, :start_time, :end_time
            ) ON DUPLICATE KEY UPDATE
                robot_id = VALUES(robot_id),
                head_part_id = VALUES(head_part_id),
                body_part_id = VALUES(body_part_id),
                arms_part_id = VALUES(arms_part_id),
                legs_part_id = VALUES(legs_part_id),
                start_time = VALUES(start_time),
                end_time = VALUES(end_time)
        ");
        $stmtDisass->execute([
            ':user_id' => $actualUserId,
            ':robot_id' => $robClone['id'] ?? ($ad['robotId'] ?? ''),
            ':head_part_id' => $headId,
            ':body_part_id' => $bodyId,
            ':arms_part_id' => $armsId,
            ':legs_part_id' => $legsId,
            ':start_time' => (int)($ad['startTime'] ?? 0),
            ':end_time' => (int)($ad['endTime'] ?? 0),
        ]);
    } else {
        $delDisass = $pdo->prepare("DELETE FROM active_robot_disassemblies WHERE user_id = :user_id");
        $delDisass->execute([':user_id' => $actualUserId]);
    }

    // =========================================================================
    // 11. パーツリサイクル（Part Recycles）: 完了時は complete_part_recycles に追加、進行中は active_part_recycles に同期
    // =========================================================================
    $compRec = $gameData['completePartRecycle'] ?? $gameData['completedPartRecycle'] ?? null;
    if (!empty($compRec) && !empty($compRec['startTime'])) {
        // 1. complete_part_recycles テーブルに完了レコードを追加
        $stmtCompRec = $pdo->prepare("
            INSERT INTO complete_part_recycles (user_id, part_id, start_time, end_time, result_materials_data)
            SELECT :user_id, :part_id, :start_time, :end_time, :result_materials_data
            WHERE NOT EXISTS (
                SELECT 1 FROM complete_part_recycles
                WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompRec->execute([
            ':user_id' => $actualUserId,
            ':part_id' => $compRec['partClone']['id'] ?? '',
            ':start_time' => (int)($compRec['startTime'] ?? 0),
            ':end_time' => (int)($compRec['endTime'] ?? 0),
            ':result_materials_data' => json_encode($compRec['resultMaterials'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($compRec['startTime'] ?? 0),
            ':chk_end_time' => (int)($compRec['endTime'] ?? 0)
        ]);
    }

    if (!empty($gameData['activePartRecycle']) && !empty($gameData['activePartRecycle']['startTime'])) {
        // 進行中の場合は active_part_recycles テーブルを同期
        $ar = $gameData['activePartRecycle'];
        $stmtRec = $pdo->prepare("
            INSERT INTO active_part_recycles (user_id, part_id, start_time, end_time, result_materials_data)
            VALUES (:user_id, :part_id, :start_time, :end_time, :result_materials_data)
            ON DUPLICATE KEY UPDATE
                part_id = VALUES(part_id),
                start_time = VALUES(start_time),
                end_time = VALUES(end_time),
                result_materials_data = VALUES(result_materials_data)
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

    // 10. user_minigame_status テーブルの同期 (ミニゲーム毎の遊んだ数、勝利数、獲得エレメント数、宝箱獲得数および所持宝箱数)
    $elements = isset($gameData['battleElements']) ? (int)$gameData['battleElements'] : 0;
    $minigameRecords = (isset($gameData['minigameRecords']) && is_array($gameData['minigameRecords'])) ? $gameData['minigameRecords'] : [];

    // もし minigameRecords に combat_training または combat が無ければ初期化
    if (!isset($minigameRecords['combat_training']) && !isset($minigameRecords['combat'])) {
        $minigameRecords['combat_training'] = ['plays' => 0, 'wins' => 0, 'elements' => $elements, 'chests' => 0];
    }

    $stmtMini = $pdo->prepare("
        INSERT INTO user_minigame_status (user_id, minigame_id, play_count, wins, elements_count, chests_count)
        VALUES (:user_id, :minigame_id, :play_count, :wins, :elements_count, :chests_count)
        ON DUPLICATE KEY UPDATE 
            play_count = :play_count_up,
            wins = :wins_up,
            elements_count = :elements_count_up,
            chests_count = :chests_count_up
    ");

    foreach ($minigameRecords as $mId => $mRec) {
        $plays = isset($mRec['plays']) ? (int)$mRec['plays'] : 0;
        $wins = isset($mRec['wins']) ? (int)$mRec['wins'] : 0;
        $elem = isset($mRec['elements']) ? (int)$mRec['elements'] : (($mId === 'combat_training' || $mId === 'combat') ? $elements : 0);
        $chests = isset($mRec['chests']) ? (int)$mRec['chests'] : (isset($mRec['chests_count']) ? (int)$mRec['chests_count'] : 0);

        $stmtMini->execute([
            ':user_id' => $actualUserId,
            ':minigame_id' => (string)$mId,
            ':play_count' => $plays,
            ':wins' => $wins,
            ':elements_count' => $elem,
            ':chests_count' => $chests,
            ':play_count_up' => $plays,
            ':wins_up' => $wins,
            ':elements_count_up' => $elem,
            ':chests_count_up' => $chests
        ]);
    }

    // 未開封宝箱の個数（unopenedChests）も user_minigame_status に保存（minigame_id = 'unopened_chests'）
    $unopenedChests = (isset($gameData['unopenedChests']) && is_array($gameData['unopenedChests'])) ? $gameData['unopenedChests'] : [];
    $totalUnopenedChests = 0;
    foreach ($unopenedChests as $chestTierCount) {
        $totalUnopenedChests += (int)$chestTierCount;
    }
    $stmtMini->execute([
        ':user_id' => $actualUserId,
        ':minigame_id' => 'unopened_chests',
        ':play_count' => count($unopenedChests),
        ':wins' => 0,
        ':elements_count' => 0,
        ':chests_count' => $totalUnopenedChests,
        ':play_count_up' => count($unopenedChests),
        ':wins_up' => 0,
        ':elements_count_up' => 0,
        ':chests_count_up' => $totalUnopenedChests
    ]);

    // 13. completed_daily_minigame テーブルの同期（本日クリア済みミニゲーム/演習の記録）
    if (!empty($gameData['dailyBattleLimits']) && is_array($gameData['dailyBattleLimits'])) {
        $stmtDcm = $pdo->prepare("
            INSERT INTO completed_daily_minigame (user_id, robot_id, minigame_id, level, created_at)
            VALUES (:user_id, :robot_id, :minigame_id, :level, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
        ");
        
        $nowJst = new DateTime('now', new DateTimeZone('Asia/Tokyo'));
        $todayDateKey = $nowJst->format('Y-m-d');
        if ((int)$nowJst->format('H') < 9) {
            $yesterdayJst = clone $nowJst;
            $yesterdayJst->modify('-1 day');
            $todayDateKey = $yesterdayJst->format('Y-m-d');
        }

        foreach ($gameData['dailyBattleLimits'] as $k1 => $v1) {
            // パターン1: 日付キー { "YYYY-MM-DD": ["robotId_categoryId_levelId", ...] }
            if (is_array($v1) && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$k1)) {
                foreach ($v1 as $limitItem) {
                    if (is_string($limitItem)) {
                        $parts = explode('_', $limitItem);
                        if (count($parts) >= 3) {
                            $lvlVal = array_pop($parts);
                            $mId = array_pop($parts);
                            $rId = implode('_', $parts);
                            $stmtDcm->execute([
                                ':user_id' => $actualUserId,
                                ':robot_id' => (string)$rId,
                                ':minigame_id' => (string)$mId,
                                ':level' => (string)$lvlVal
                            ]);
                        }
                    }
                }
            } elseif (is_array($v1)) {
                // パターン2: 機体IDキー { [robotId]: { [minigameId]: { [level]: true } } }
                $rId = (string)$k1;
                foreach ($v1 as $mId => $lvlMap) {
                    if (is_array($lvlMap)) {
                        foreach ($lvlMap as $lvlKey => $isCleared) {
                            if ($isCleared) {
                                $stmtDcm->execute([
                                    ':user_id' => $actualUserId,
                                    ':robot_id' => $rId,
                                    ':minigame_id' => (string)$mId,
                                    ':level' => (string)$lvlKey
                                ]);
                            }
                        }
                    } elseif ($lvlMap) {
                        $stmtDcm->execute([
                            ':user_id' => $actualUserId,
                            ':robot_id' => $rId,
                            ':minigame_id' => (string)$mId,
                            ':level' => '1'
                        ]);
                    }
                }
            }
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "All user data saved to appropriate database tables successfully.",
        "userId" => $actualUserId
    ]);
} catch (Throwable $e) {
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
