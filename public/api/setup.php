<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to get database connection. Check DB credentials in GitHub Secrets."]);
    exit;
}

try {
    // 各種テーブルの作成
    $sql = "
    CREATE TABLE IF NOT EXISTS save_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        game_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        google_id VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255),
        name VARCHAR(255),
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS master_parts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        part_type VARCHAR(50) NOT NULL,
        attribute VARCHAR(50) NOT NULL,
        rarity INT NOT NULL,
        visual_index INT DEFAULT 0,
        base_hp INT DEFAULT 0,
        base_power INT DEFAULT 0,
        base_defense INT DEFAULT 0,
        base_agility INT DEFAULT 0,
        base_dexterity INT DEFAULT 0,
        base_int INT DEFAULT 0
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
        unlocked_expeditions JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

    CREATE TABLE IF NOT EXISTS minigame_rankings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        minigame_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        high_score INT NOT NULL,
        achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS daily_cleared_minigame (
        id INT AUTO_INCREMENT PRIMARY KEY,
        minigame_id VARCHAR(100) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        robot_id VARCHAR(255) NOT NULL,
        level INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_daily_clear (user_id, robot_id, minigame_id, level),
        INDEX idx_user_robot (user_id, robot_id),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS master_expeditions (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        unlock_cost INT DEFAULT 0,
        duration_seconds INT DEFAULT 0,
        required_fame INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS user_parts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        master_part_id VARCHAR(255) NOT NULL,
        part_type VARCHAR(50) NOT NULL DEFAULT 'head',
        name VARCHAR(255) NOT NULL DEFAULT '',
        attribute VARCHAR(50) NOT NULL DEFAULT 'Fire',
        rarity INT NOT NULL DEFAULT 1,
        visual_index INT NOT NULL DEFAULT 0,
        is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
        vitality INT NOT NULL DEFAULT 0,
        power INT NOT NULL DEFAULT 0,
        defense INT NOT NULL DEFAULT 0,
        agility INT NOT NULL DEFAULT 0,
        dexterity INT NOT NULL DEFAULT 0,
        intelligence INT NOT NULL DEFAULT 0,
        main_material_id VARCHAR(100) NULL,
        sub_material_id VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_parts_user (user_id),
        INDEX idx_user_parts_type (part_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS user_robots (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        head_part_id VARCHAR(255),
        body_part_id VARCHAR(255),
        arms_part_id VARCHAR(255),
        legs_part_id VARCHAR(255),
        currentHp INT DEFAULT 12,
        maxHP INT DEFAULT 12,
        battleStats JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_head_part FOREIGN KEY (head_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
        CONSTRAINT fk_body_part FOREIGN KEY (body_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
        CONSTRAINT fk_arms_part FOREIGN KEY (arms_part_id) REFERENCES user_parts(id) ON DELETE SET NULL,
        CONSTRAINT fk_legs_part FOREIGN KEY (legs_part_id) REFERENCES user_parts(id) ON DELETE SET NULL
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

    CREATE TABLE IF NOT EXISTS user_material (
        user_id VARCHAR(255) NOT NULL,
        material_id VARCHAR(255) NOT NULL,
        count INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, material_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($sql);

    // completed_robotsの外部キー制約設定 (すでにある場合への対応)
    try {
        $pdo->exec("UPDATE completed_robots SET head_part_id = NULL WHERE head_part_id IS NOT NULL AND head_part_id NOT IN (SELECT id FROM complete_parts)");
        $pdo->exec("UPDATE completed_robots SET body_part_id = NULL WHERE body_part_id IS NOT NULL AND body_part_id NOT IN (SELECT id FROM complete_parts)");
        $pdo->exec("UPDATE completed_robots SET arms_part_id = NULL WHERE arms_part_id IS NOT NULL AND arms_part_id NOT IN (SELECT id FROM complete_parts)");
        $pdo->exec("UPDATE completed_robots SET legs_part_id = NULL WHERE legs_part_id IS NOT NULL AND legs_part_id NOT IN (SELECT id FROM complete_parts)");
    
    // master_expeditions テーブルに初期データを登録
    $expeditions = [
        ['id' => 'loc1', 'name' => '裏山のスクラップ場', 'unlock_cost' => 0, 'duration_seconds' => 1800, 'required_fame' => 0],
        ['id' => 'loc2', 'name' => '灼熱の廃工場', 'unlock_cost' => 200, 'duration_seconds' => 3600, 'required_fame' => 10],
        ['id' => 'loc3', 'name' => '水没した都市遺跡', 'unlock_cost' => 500, 'duration_seconds' => 7200, 'required_fame' => 30],
        ['id' => 'loc4', 'name' => '風の谷の観測所', 'unlock_cost' => 1000, 'duration_seconds' => 10800, 'required_fame' => 50],
        ['id' => 'loc5', 'name' => '光の塔', 'unlock_cost' => 2000, 'duration_seconds' => 14400, 'required_fame' => 100],
        ['id' => 'loc6', 'name' => '最果てのクレーター', 'unlock_cost' => 4000, 'duration_seconds' => 18000, 'required_fame' => 200],
        ['id' => 'loc7', 'name' => '古代文明の中枢', 'unlock_cost' => 10000, 'duration_seconds' => 36000, 'required_fame' => 500],
    ];

    $stmtInsertExp = $pdo->prepare("
        INSERT INTO master_expeditions (id, name, unlock_cost, duration_seconds, required_fame) 
        VALUES (:id, :name, :cost, :duration, :fame)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name), unlock_cost = VALUES(unlock_cost), 
            duration_seconds = VALUES(duration_seconds), required_fame = VALUES(required_fame)
    ");
    foreach ($expeditions as $exp) {
        $stmtInsertExp->execute([
            ':id' => $exp['id'],
            ':name' => $exp['name'],
            ':cost' => $exp['unlock_cost'],
            ':duration' => $exp['duration_seconds'],
            ':fame' => $exp['required_fame']
        ]);
    }

} catch (PDOException $e) {}

    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_head FOREIGN KEY (head_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_body FOREIGN KEY (body_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_arms FOREIGN KEY (arms_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE completed_robots ADD CONSTRAINT fk_comp_legs FOREIGN KEY (legs_part_id) REFERENCES complete_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    
    // --- 追加のマイグレーション（既に存在するテーブルのスキーマ変更） ---
    // CREATE TABLE IF NOT EXISTS では、既存テーブルのカラム追加・削除が行われないための対応

    // users テーブルから received_initial_bonus を削除
    try {
        $pdo->exec("ALTER TABLE users DROP COLUMN received_initial_bonus");
    } catch (PDOException $e) {
        // 既に削除されているか、カラムが存在しない場合は無視
    }

    // user_workshop_status テーブルに received_initial_bonus を追加
    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN received_initial_bonus BOOLEAN DEFAULT FALSE");
    } catch (PDOException $e) {
        // 既に追加されている場合は無視
    }

    // user_workshop_status テーブルに 依頼完了獲得G (request_earned_gold) を追加
    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN request_earned_gold INT DEFAULT 0");
    } catch (PDOException $e) {
        // 既に追加されている場合は無視
    }

    // user_workshop_status テーブルに 解放済み遠征地 (unlocked_expeditions) を追加
    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN unlocked_expeditions JSON");
    } catch (PDOException $e) {
        // 既に追加されている場合は無視
    }

    // 既存ユーザーで unlocked_expeditions が NULL や空の場合に ['loc1'] を初期値として設定
    try {
        $pdo->exec("UPDATE user_workshop_status SET unlocked_expeditions = '[\"loc1\"]' WHERE unlocked_expeditions IS NULL OR unlocked_expeditions = '' OR unlocked_expeditions = '[]'");
    } catch (PDOException $e) {}

    // 遠征地マスターテーブルと初期データの登録を確実に保証
    ensureMasterExpeditions($pdo);

    // active_expeditions テーブルに dispatched_robot_id を追加
    try {
        $pdo->exec("ALTER TABLE active_expeditions ADD COLUMN dispatched_robot_id VARCHAR(255)");
    } catch (PDOException $e) {
        // 既に追加されている場合は無視
    }

    // active_requests テーブルに request_data を追加
    try {
        $pdo->exec("ALTER TABLE active_requests ADD COLUMN request_data JSON");
    } catch (PDOException $e) {
        // 既に追加されている場合は無視
    }

    // 既存の user_item テーブルに battle_item, reversi_item カラムを追加（マイグレーション）
    try {
        $pdo->exec("ALTER TABLE user_item ADD COLUMN battle_item JSON NULL AFTER element");
    } catch (PDOException $e) {}
    try {
        $pdo->exec("ALTER TABLE user_item ADD COLUMN reversi_item JSON NULL AFTER battle_item");
    } catch (PDOException $e) {}

    // active_requests テーブルの request_data からテーブルで保持している重複カラム（id, rank, rewardG, deadline 等）を削除・クリーンアップ
    try {
        $cleanReqStmt = $pdo->query("SELECT user_id, request_data FROM active_requests WHERE request_data IS NOT NULL");
        if ($cleanReqStmt) {
            $updReqStmt = $pdo->prepare("UPDATE active_requests SET request_data = :request_data WHERE user_id = :user_id");
            while ($arRow = $cleanReqStmt->fetch()) {
                if (!empty($arRow['request_data'])) {
                    $decoded = is_string($arRow['request_data']) ? json_decode($arRow['request_data'], true) : $arRow['request_data'];
                    if (is_array($decoded)) {
                        $dirty = false;
                        foreach (['id', 'requestId', 'request_id', 'rank', 'rewardG', 'reward_g', 'deadline'] as $dupKey) {
                            if (array_key_exists($dupKey, $decoded)) {
                                unset($decoded[$dupKey]);
                                $dirty = true;
                            }
                        }
                        if ($dirty) {
                            $newJson = !empty($decoded) ? json_encode($decoded, JSON_UNESCAPED_UNICODE) : null;
                            $updReqStmt->execute([
                                ':request_data' => $newJson,
                                ':user_id' => $arRow['user_id']
                            ]);
                        }
                    }
                }
            }
        }
    } catch (PDOException $e) {
        // テーブルが存在しない場合等は安全にスキップ
    }

    // user_minigame_status テーブルに chests_count を追加
    try {
        $pdo->exec("ALTER TABLE user_minigame_status ADD COLUMN chests_count INT DEFAULT 0");
    } catch (PDOException $e) {
        // 既に追加されている場合は無視
    }

    // usersテーブルのpicture列をTEXTに拡張（GoogleアバターURLの文字数対策）
    try {
        $pdo->exec("ALTER TABLE users MODIFY COLUMN picture TEXT");
    } catch (PDOException $e) {}

    // user_parts テーブルの個別カラム化マイグレーション
    $partCols = [
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

    foreach ($partCols as $colDef) {
        try {
            // MySQLバージョンによって IF NOT EXISTS が使えない場合があるため、単純なADD COLUMNもフォールバック
            $cleanColDef = str_replace('IF NOT EXISTS ', '', $colDef);
            $pdo->exec("ALTER TABLE user_parts " . $cleanColDef);
        } catch (PDOException $e) {}
    }

    // 不要になった battle_matches, battle_wins, battle_losses, battle_draws カラムを安全に削除
    foreach (['battle_matches', 'battle_wins', 'battle_losses', 'battle_draws'] as $delCol) {
        try {
            $checkDelCol = $pdo->query("SHOW COLUMNS FROM user_parts LIKE '{$delCol}'");
            if ($checkDelCol && $checkDelCol->fetch()) {
                $pdo->exec("ALTER TABLE user_parts DROP COLUMN `{$delCol}`");
            }
        } catch (PDOException $e) {}
    }

    // 既存の hp カラムが存在する場合、vitality カラムへリネーム
    try {
        $checkHpCol = $pdo->query("SHOW COLUMNS FROM user_parts LIKE 'hp'");
        if ($checkHpCol && $checkHpCol->fetch()) {
            $pdo->exec("ALTER TABLE user_parts CHANGE COLUMN hp vitality INT NOT NULL DEFAULT 0");
        }
    } catch (PDOException $e) {}

    // 既存の part_data JSON から新個別カラムへのデータ移行
    try {
        $colCheck = $pdo->query("SHOW COLUMNS FROM user_parts LIKE 'part_data'");
        if ($colCheck && $colCheck->fetch()) {
            $stmtParts = $pdo->query("SELECT id, master_part_id, part_data FROM user_parts WHERE part_data IS NOT NULL AND part_data != ''");
            if ($stmtParts) {
                $updPartStmt = $pdo->prepare("
                    UPDATE user_parts SET
                        part_type = :part_type,
                        name = :name,
                        attribute = :attribute,
                        rarity = :rarity,
                        visual_index = :visual_index,
                        vitality = :vitality,
                        power = :power,
                        defense = :defense,
                        agility = :agility,
                        dexterity = :dexterity,
                        intelligence = :intelligence,
                        main_material_id = :main_mat,
                        sub_material_id = :sub_mat
                    WHERE id = :id
                ");
                while ($pRow = $stmtParts->fetch(PDO::FETCH_ASSOC)) {
                    if (empty($pRow['part_data'])) continue;
                    $d = json_decode($pRow['part_data'], true);
                    if (!is_array($d)) continue;
                    
                    $pType = $d['type'] ?? $d['part_type'] ?? 'head';
                    $pName = $d['name'] ?? $pRow['master_part_id'] ?? 'パーツ';
                    $pAttr = $d['attribute'] ?? 'Fire';
                    $pRarity = isset($d['rarity']) ? (int)$d['rarity'] : 1;
                    $pVis = isset($d['visualIndex']) ? (int)$d['visualIndex'] : (isset($d['visual_index']) ? (int)$d['visual_index'] : 0);
                    
                    $stats = $d['stats'] ?? [];
                    $pVit = isset($stats['hp']) ? (int)$stats['hp'] : (isset($d['vitality']) ? (int)$d['vitality'] : (isset($d['hp']) ? (int)$d['hp'] : 0));
                    $pPow = isset($stats['power']) ? (int)$stats['power'] : (isset($d['power']) ? (int)$d['power'] : 0);
                    $pDef = isset($stats['defense']) ? (int)$stats['defense'] : (isset($d['defense']) ? (int)$d['defense'] : 0);
                    $pAgi = isset($stats['agility']) ? (int)$stats['agility'] : (isset($d['agility']) ? (int)$d['agility'] : 0);
                    $pDex = isset($stats['dexterity']) ? (int)$stats['dexterity'] : (isset($d['dexterity']) ? (int)$d['dexterity'] : 0);
                    $pInt = isset($stats['intelligence']) ? (int)$stats['intelligence'] : (isset($stats['int']) ? (int)$stats['int'] : (isset($d['intelligence']) ? (int)$d['intelligence'] : 0));
                    
                    $mainMat = $d['mainMaterialId'] ?? $d['main_material_id'] ?? null;
                    $subMat = $d['subMaterialId'] ?? $d['sub_material_id'] ?? null;
                    
                    $updPartStmt->execute([
                        ':part_type' => $pType,
                        ':name' => $pName,
                        ':attribute' => $pAttr,
                        ':rarity' => $pRarity,
                        ':visual_index' => $pVis,
                        ':vitality' => $pVit,
                        ':power' => $pPow,
                        ':defense' => $pDef,
                        ':agility' => $pAgi,
                        ':dexterity' => $pDex,
                        ':intelligence' => $pInt,
                        ':main_mat' => $mainMat,
                        ':sub_mat' => $subMat,
                        ':id' => $pRow['id']
                    ]);
                }
            }

            // 移行完了後に part_data カラムを削除
            try {
                $pdo->exec("ALTER TABLE user_parts DROP COLUMN `part_data`");
            } catch (PDOException $e) {}
        }
    } catch (PDOException $e) {}

    // user_robots テーブルのスキーマ更新: currentHp, maxHP, battleStats の追加
    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN currentHp INT DEFAULT 12");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN maxHP INT DEFAULT 12");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD COLUMN battleStats JSON");
    } catch (PDOException $e) {}

    // 既存の robot_data カラムが存在する場合、currentHp, maxHP, battleStats を移行
    try {
        $stmtMigrate = $pdo->query("SELECT id, robot_data FROM user_robots WHERE robot_data IS NOT NULL");
        if ($stmtMigrate) {
            $updStmt = $pdo->prepare("UPDATE user_robots SET currentHp = :cHp, maxHP = :mHp, battleStats = :bStats WHERE id = :id");
            while ($r = $stmtMigrate->fetch(PDO::FETCH_ASSOC)) {
                if (empty($r['robot_data'])) continue;
                $d = json_decode($r['robot_data'], true);
                if (is_array($d)) {
                    $cHp = isset($d['currentHp']) ? (int)$d['currentHp'] : 12;
                    $mHp = isset($d['maxHp']) ? (int)$d['maxHp'] : (isset($d['stats']['hp']) ? (int)$d['stats']['hp'] : 12);
                    $bStats = isset($d['battleStats']) && is_array($d['battleStats']) ? json_encode($d['battleStats'], JSON_UNESCAPED_UNICODE) : null;
                    $updStmt->execute([
                        ':cHp' => $cHp,
                        ':mHp' => $mHp,
                        ':bStats' => $bStats,
                        ':id' => $r['id']
                    ]);
                }
            }
        }
    } catch (PDOException $e) {}

    // user_robots テーブルから total_ がついた列をすべて削除
    $totalCols = ['total_hp', 'total_power', 'total_defense', 'total_agility', 'total_dexterity', 'total_int'];
    foreach ($totalCols as $col) {
        try {
            $pdo->exec("ALTER TABLE user_robots DROP COLUMN `{$col}`");
        } catch (PDOException $e) {}
    }

    // user_robots テーブルから robot_data 列を削除
    try {
        $pdo->exec("ALTER TABLE user_robots DROP COLUMN `robot_data`");
    } catch (PDOException $e) {}

    // user_robots テーブルの total ステータスを確認できる View の作成（user_partsの個別ステータスカラムを直接合算）
    try {
        $pdo->exec("
            CREATE OR REPLACE VIEW view_user_robots_total_stats AS
            SELECT 
                ur.id AS robot_id,
                ur.user_id,
                ur.name AS robot_name,
                ur.currentHp,
                ur.maxHP,
                ur.head_part_id,
                ur.body_part_id,
                ur.arms_part_id,
                ur.legs_part_id,
                (
                    COALESCE(hp.vitality, 0) +
                    COALESCE(bp.vitality, 0) +
                    COALESCE(ap.vitality, 0) +
                    COALESCE(lp.vitality, 0)
                ) AS totalvitality,
                (
                    COALESCE(hp.power, 0) +
                    COALESCE(bp.power, 0) +
                    COALESCE(ap.power, 0) +
                    COALESCE(lp.power, 0)
                ) AS total_power,
                (
                    COALESCE(hp.defense, 0) +
                    COALESCE(bp.defense, 0) +
                    COALESCE(ap.defense, 0) +
                    COALESCE(lp.defense, 0)
                ) AS total_defense,
                (
                    COALESCE(hp.agility, 0) +
                    COALESCE(bp.agility, 0) +
                    COALESCE(ap.agility, 0) +
                    COALESCE(lp.agility, 0)
                ) AS total_agility,
                (
                    COALESCE(hp.dexterity, 0) +
                    COALESCE(bp.dexterity, 0) +
                    COALESCE(ap.dexterity, 0) +
                    COALESCE(lp.dexterity, 0)
                ) AS total_dexterity,
                (
                    COALESCE(hp.intelligence, 0) +
                    COALESCE(bp.intelligence, 0) +
                    COALESCE(ap.intelligence, 0) +
                    COALESCE(lp.intelligence, 0)
                ) AS total_int,
                ur.battleStats,
                ur.created_at
            FROM user_robots ur
            LEFT JOIN user_parts hp ON ur.head_part_id = hp.id
            LEFT JOIN user_parts bp ON ur.body_part_id = bp.id
            LEFT JOIN user_parts ap ON ur.arms_part_id = ap.id
            LEFT JOIN user_parts lp ON ur.legs_part_id = lp.id
        ");
    } catch (PDOException $e) {}

    // activeテーブルと対となるcompleteテーブルの互換性用ビュー（completed_*）
    try {
        $pdo->exec("CREATE OR REPLACE VIEW completed_expeditions AS SELECT * FROM complete_expeditions");
        $pdo->exec("CREATE OR REPLACE VIEW completed_part_crafts AS SELECT * FROM complete_part_crafts");
        $pdo->exec("CREATE OR REPLACE VIEW completed_robot_assemblies AS SELECT * FROM complete_robot_assemblies");
        $pdo->exec("CREATE OR REPLACE VIEW completed_requests AS SELECT * FROM complete_requests");
        $pdo->exec("CREATE OR REPLACE VIEW completed_robot_disassemblies AS SELECT * FROM complete_robot_disassemblies");
        $pdo->exec("CREATE OR REPLACE VIEW completed_part_recycles AS SELECT * FROM complete_part_recycles");
    } catch (PDOException $e) {}

    // active_robot_assemblies テーブルの個別カラム化＆外部キー化マイグレーション
    $activeAssemblyCols = [
        "ADD COLUMN duration_ms BIGINT DEFAULT 0",
        "ADD COLUMN robot_id VARCHAR(255) NULL",
        "ADD COLUMN robot_name VARCHAR(255) NULL",
        "ADD COLUMN head_part_id VARCHAR(255) NULL",
        "ADD COLUMN body_part_id VARCHAR(255) NULL",
        "ADD COLUMN arms_part_id VARCHAR(255) NULL",
        "ADD COLUMN legs_part_id VARCHAR(255) NULL",
        "ADD COLUMN current_hp INT DEFAULT 12",
        "ADD COLUMN max_hp INT DEFAULT 12",
        "ADD COLUMN value INT DEFAULT 0",
        "ADD COLUMN robot_created_at BIGINT DEFAULT 0"
    ];

    foreach ($activeAssemblyCols as $colSql) {
        try {
            $pdo->exec("ALTER TABLE active_robot_assemblies $colSql");
        } catch (PDOException $e) {}
    }

    // 既存レコードがあれば result_robot_data JSON から新列へデータ同期（列削除前の安全措置）
    try {
        $checkJsonCol = $pdo->query("SHOW COLUMNS FROM active_robot_assemblies LIKE 'result_robot_data'");
        if ($checkJsonCol && $checkJsonCol->fetch()) {
            $stmtActAss = $pdo->query("SELECT user_id, start_time, result_robot_data FROM active_robot_assemblies WHERE result_robot_data IS NOT NULL AND result_robot_data != ''");
            if ($stmtActAss) {
                $updAssStmt = $pdo->prepare("
                    UPDATE active_robot_assemblies SET
                        robot_id = COALESCE(:robot_id, robot_id),
                        robot_name = COALESCE(:robot_name, robot_name),
                        head_part_id = COALESCE(:head_part_id, head_part_id),
                        body_part_id = COALESCE(:body_part_id, body_part_id),
                        arms_part_id = COALESCE(:arms_part_id, arms_part_id),
                        legs_part_id = COALESCE(:legs_part_id, legs_part_id),
                        current_hp = COALESCE(:current_hp, current_hp),
                        max_hp = COALESCE(:max_hp, max_hp),
                        value = COALESCE(:value, value),
                        robot_created_at = COALESCE(:robot_created_at, robot_created_at)
                    WHERE user_id = :user_id
                ");
                while ($assRow = $stmtActAss->fetch(PDO::FETCH_ASSOC)) {
                    $d = json_decode($assRow['result_robot_data'], true);
                    if (!is_array($d)) continue;
                    $rParts = $d['parts'] ?? [];

                    $updAssStmt->execute([
                        ':robot_id' => $d['id'] ?? ('rob_' . $assRow['start_time']),
                        ':robot_name' => $d['name'] ?? '組立ロボット',
                        ':head_part_id' => $rParts['head']['id'] ?? null,
                        ':body_part_id' => $rParts['body']['id'] ?? null,
                        ':arms_part_id' => $rParts['arms']['id'] ?? null,
                        ':legs_part_id' => $rParts['legs']['id'] ?? null,
                        ':current_hp' => isset($d['currentHp']) ? (int)$d['currentHp'] : 12,
                        ':max_hp' => isset($d['maxHp']) ? (int)$d['maxHp'] : 12,
                        ':value' => isset($d['value']) ? (int)$d['value'] : 0,
                        ':robot_created_at' => isset($d['createdAt']) ? (int)$d['createdAt'] : (int)$assRow['start_time'],
                        ':user_id' => $assRow['user_id']
                    ]);
                }
            }
        }
    } catch (PDOException $e) {}

    // user_parts に存在しない外部キー整合性エラーを予防
    try {
        $pdo->exec("UPDATE active_robot_assemblies SET head_part_id = NULL WHERE head_part_id IS NOT NULL AND head_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE active_robot_assemblies SET body_part_id = NULL WHERE body_part_id IS NOT NULL AND body_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE active_robot_assemblies SET arms_part_id = NULL WHERE arms_part_id IS NOT NULL AND arms_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE active_robot_assemblies SET legs_part_id = NULL WHERE legs_part_id IS NOT NULL AND legs_part_id NOT IN (SELECT id FROM user_parts)");
    } catch (PDOException $e) {}

    // active_robot_assemblies の外部キー制約を設定
    try { $pdo->exec("ALTER TABLE active_robot_assemblies ADD CONSTRAINT fk_act_ass_head FOREIGN KEY (head_part_id) REFERENCES user_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE active_robot_assemblies ADD CONSTRAINT fk_act_ass_body FOREIGN KEY (body_part_id) REFERENCES user_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE active_robot_assemblies ADD CONSTRAINT fk_act_ass_arms FOREIGN KEY (arms_part_id) REFERENCES user_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE active_robot_assemblies ADD CONSTRAINT fk_act_ass_legs FOREIGN KEY (legs_part_id) REFERENCES user_parts(id) ON DELETE SET NULL"); } catch (PDOException $e) {}

    // 冗長なカラム（battle_stats, ステータス列, result_robot_data）を安全に削除 (DB v0.11)
    $dropCols = [
        'battle_stats',
        'hp',
        'power',
        'defense',
        'agility',
        'dexterity',
        'intelligence',
        'result_robot_data'
    ];
    foreach ($dropCols as $colName) {
        try {
            $pdo->exec("ALTER TABLE active_robot_assemblies DROP COLUMN $colName");
        } catch (PDOException $e) {}
    }

    // active_robot_disassemblies テーブルのパーツIDカラム追加＆result_parts_data削除マイグレーション
    $activeDisassemblyCols = [
        "ADD COLUMN head_part_id VARCHAR(255) NULL",
        "ADD COLUMN body_part_id VARCHAR(255) NULL",
        "ADD COLUMN arms_part_id VARCHAR(255) NULL",
        "ADD COLUMN legs_part_id VARCHAR(255) NULL"
    ];
    foreach ($activeDisassemblyCols as $colSql) {
        try {
            $pdo->exec("ALTER TABLE active_robot_disassemblies $colSql");
        } catch (PDOException $e) {}
    }

    // 既存レコードがあれば result_parts_data JSON から新列へデータ移行
    try {
        $checkJsonColDisass = $pdo->query("SHOW COLUMNS FROM active_robot_disassemblies LIKE 'result_parts_data'");
        if ($checkJsonColDisass && $checkJsonColDisass->fetch()) {
            $stmtActDis = $pdo->query("SELECT user_id, result_parts_data FROM active_robot_disassemblies WHERE result_parts_data IS NOT NULL AND result_parts_data != ''");
            if ($stmtActDis) {
                $updDisStmt = $pdo->prepare("
                    UPDATE active_robot_disassemblies SET
                        head_part_id = COALESCE(:head_part_id, head_part_id),
                        body_part_id = COALESCE(:body_part_id, body_part_id),
                        arms_part_id = COALESCE(:arms_part_id, arms_part_id),
                        legs_part_id = COALESCE(:legs_part_id, legs_part_id)
                    WHERE user_id = :user_id
                ");
                while ($disRow = $stmtActDis->fetch(PDO::FETCH_ASSOC)) {
                    $partsList = json_decode($disRow['result_parts_data'], true);
                    if (!is_array($partsList)) continue;
                    $hId = null;
                    $bId = null;
                    $aId = null;
                    $lId = null;
                    foreach ($partsList as $p) {
                        $pType = strtolower($p['type'] ?? '');
                        if ($pType === 'head' && !$hId) $hId = $p['id'] ?? null;
                        if ($pType === 'body' && !$bId) $bId = $p['id'] ?? null;
                        if (($pType === 'arms' || $pType === 'arm') && !$aId) $aId = $p['id'] ?? null;
                        if (($pType === 'legs' || $pType === 'leg') && !$lId) $lId = $p['id'] ?? null;
                    }
                    $updDisStmt->execute([
                        ':head_part_id' => $hId,
                        ':body_part_id' => $bId,
                        ':arms_part_id' => $aId,
                        ':legs_part_id' => $lId,
                        ':user_id' => $disRow['user_id']
                    ]);
                }
            }
            // 移行完了後に result_parts_data カラムを削除
            try {
                $pdo->exec("ALTER TABLE active_robot_disassemblies DROP COLUMN result_parts_data");
            } catch (PDOException $e) {}
        }
    } catch (PDOException $e) {}

    // 外部キー制約の追加
    try {
        $pdo->exec("UPDATE active_robot_disassemblies SET head_part_id = NULL WHERE head_part_id IS NOT NULL AND head_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE active_robot_disassemblies SET body_part_id = NULL WHERE body_part_id IS NOT NULL AND body_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE active_robot_disassemblies SET arms_part_id = NULL WHERE arms_part_id IS NOT NULL AND arms_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE active_robot_disassemblies SET legs_part_id = NULL WHERE legs_part_id IS NOT NULL AND legs_part_id NOT IN (SELECT id FROM user_parts)");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD CONSTRAINT fk_act_disass_head FOREIGN KEY (head_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD CONSTRAINT fk_act_disass_body FOREIGN KEY (body_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD CONSTRAINT fk_act_disass_arms FOREIGN KEY (arms_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
        $pdo->exec("ALTER TABLE active_robot_disassemblies ADD CONSTRAINT fk_act_disass_legs FOREIGN KEY (legs_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
    } catch (PDOException $e) {}

    // m_parts_encyclopedia から master_parts へのテーブル名変更マイグレーション
    try {
        $checkOld = $pdo->query("SHOW TABLES LIKE 'm_parts_encyclopedia'");
        $checkNew = $pdo->query("SHOW TABLES LIKE 'master_parts'");
        $hasOld = $checkOld && $checkOld->fetch();
        $hasNew = $checkNew && $checkNew->fetch();
        if ($hasOld && !$hasNew) {
            $pdo->exec("RENAME TABLE m_parts_encyclopedia TO master_parts");
        }
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE master_parts ADD COLUMN visual_index INT DEFAULT 0");
    } catch (PDOException $e) {}

    // master_parts のマスターデータ挿入・シード
    $catalogParts = [
        // Head: INT特化、他低め
        ['h1_0', 'ベーシックヘッド', 'head', 'neutral', 1, 0, 15, 3, 10, 10, 10, 35],
        ['h1_1', 'ラウンドヘッド', 'head', 'neutral', 1, 1, 16, 2, 11, 11, 10, 38],
        ['h1_2', 'バイザーヘッド', 'head', 'neutral', 1, 2, 14, 4, 9, 12, 12, 36],
        ['h1_3', 'ボックスヘッド', 'head', 'neutral', 1, 3, 18, 3, 12, 9, 8, 40],
        ['h1_4', 'クラウンヘッド', 'head', 'neutral', 1, 4, 12, 5, 8, 14, 14, 42],
        ['h1_5', 'コーンヘッド', 'head', 'neutral', 1, 5, 13, 5, 7, 15, 13, 45],
        ['h1_6', 'シリンダーヘッド', 'head', 'neutral', 1, 6, 15, 3, 10, 10, 11, 39],
        ['h1_7', 'ホーンヘッド', 'head', 'neutral', 1, 7, 14, 6, 9, 11, 12, 41],
        ['h2_0', 'デュアルアイヘッド', 'head', 'neutral', 2, 0, 25, 8, 16, 18, 18, 65],
        ['h2_1', 'センサーヘッド', 'head', 'neutral', 2, 1, 22, 6, 14, 22, 20, 70],
        ['h2_2', 'コマンドヘッド', 'head', 'neutral', 2, 2, 28, 10, 18, 17, 19, 75],
        ['h2_3', 'バトルヘッド', 'head', 'neutral', 2, 3, 26, 11, 15, 20, 18, 72],
        ['h2_4', 'ポッドツインヘッド', 'head', 'neutral', 2, 4, 24, 9, 15, 21, 20, 70],
        ['h2_5', 'フィントライヘッド', 'head', 'neutral', 2, 5, 23, 8, 14, 24, 19, 73],
        ['h2_6', 'デルタイヤーヘッド', 'head', 'neutral', 2, 6, 25, 9, 16, 19, 18, 71],
        ['h2_7', 'ラウンドバイザーヘッド', 'head', 'neutral', 2, 7, 26, 8, 17, 18, 20, 74],
        ['h3_0', 'パラディンヘッド', 'head', 'neutral', 3, 0, 40, 15, 28, 28, 28, 110],
        ['h3_1', 'エンジェルヘッド', 'head', 'neutral', 3, 1, 38, 14, 25, 32, 32, 120],
        ['h3_2', 'ドラゴンヘッド', 'head', 'neutral', 3, 2, 42, 18, 26, 30, 26, 115],
        ['h3_3', 'サイクロプスヘッド', 'head', 'neutral', 3, 3, 41, 17, 25, 29, 27, 118],
        ['h3_4', 'トライアングルヘッド', 'head', 'neutral', 3, 4, 39, 16, 24, 33, 29, 116],
        ['h3_5', 'デルタサイクロプスヘッド', 'head', 'neutral', 3, 5, 42, 17, 27, 30, 28, 119],
        ['h3_6', 'オーブサイクロプスヘッド', 'head', 'neutral', 3, 6, 40, 16, 26, 31, 30, 117],

        // Body: HP(Vit)/Def高、他低め
        ['b1_0', 'ベーシックボディ', 'body', 'neutral', 1, 0, 70, 5, 25, 4, 4, 5],
        ['b1_1', 'ラウンドボディ', 'body', 'neutral', 1, 1, 75, 4, 28, 3, 4, 5],
        ['b1_2', 'ヘビーボディ', 'body', 'neutral', 1, 2, 85, 6, 35, 2, 3, 4],
        ['b1_3', 'バレルボディ', 'body', 'neutral', 1, 3, 80, 5, 32, 3, 3, 4],
        ['b1_4', 'スリムボディ', 'body', 'neutral', 1, 4, 55, 5, 18, 8, 6, 6],
        ['b1_5', 'ファーネスボディ', 'body', 'neutral', 1, 5, 78, 7, 30, 3, 4, 6],
        ['b1_6', 'ダイヤボディ', 'body', 'neutral', 1, 6, 72, 4, 38, 4, 5, 5],
        ['b1_7', 'エンジンボディ', 'body', 'neutral', 1, 7, 76, 8, 28, 5, 5, 5],
        ['b2_0', 'ハイテクコアボディ', 'body', 'neutral', 2, 0, 120, 10, 50, 8, 9, 10],
        ['b2_1', 'バイザーコアボディ', 'body', 'neutral', 2, 1, 115, 9, 48, 10, 10, 11],
        ['b3_0', 'トライアングルコアボディ', 'body', 'neutral', 3, 0, 190, 16, 85, 14, 15, 16],

        // Arms: Pow/Dex高、他低め
        ['a1_0', 'ベーシックアーム', 'arms', 'neutral', 1, 0, 20, 25, 10, 8, 20, 5],
        ['a1_1', 'ラウンドアーム', 'arms', 'neutral', 1, 1, 22, 28, 11, 7, 22, 5],
        ['a1_2', 'ヘビーアーム', 'arms', 'neutral', 1, 2, 28, 35, 14, 5, 18, 4],
        ['a1_3', 'クローアーム', 'arms', 'neutral', 1, 3, 21, 32, 9, 9, 25, 5],
        ['a1_4', 'レンチアーム', 'arms', 'neutral', 1, 4, 24, 30, 12, 6, 22, 6],
        ['a1_5', 'キャノンアーム', 'arms', 'neutral', 1, 5, 25, 38, 8, 4, 28, 7],
        ['a1_6', 'ブレードアーム', 'arms', 'neutral', 1, 6, 19, 36, 9, 10, 30, 5],
        ['a1_7', 'シールドアーム', 'arms', 'neutral', 1, 7, 30, 22, 22, 4, 16, 5],
        ['a2_0', 'ナックルアーム', 'arms', 'neutral', 2, 0, 35, 55, 18, 12, 45, 10],
        ['a2_1', 'サイバーアーム', 'arms', 'neutral', 2, 1, 32, 50, 16, 15, 48, 11],
        ['a2_2', 'ヘビーアーム', 'arms', 'neutral', 2, 2, 42, 62, 24, 8, 40, 8],
        ['a2_3', 'バスターアーム', 'arms', 'neutral', 2, 3, 38, 70, 15, 10, 55, 12],

        // Legs: Agi/Dex高、他低め
        ['l1_0', 'ベーシックレッグ', 'legs', 'neutral', 1, 0, 25, 8, 12, 25, 20, 5],
        ['l1_1', 'ホイールレッグ', 'legs', 'neutral', 1, 1, 20, 6, 10, 32, 22, 5],
        ['l1_2', 'ヘビーレッグ', 'legs', 'neutral', 1, 2, 40, 14, 22, 15, 12, 4],
        ['l1_3', 'ホバーレッグ', 'legs', 'neutral', 1, 3, 18, 5, 9, 36, 26, 6],
        ['l1_4', '一輪ホイール', 'legs', 'neutral', 1, 4, 22, 7, 11, 30, 23, 5],
        ['l1_5', 'トライポッド', 'legs', 'neutral', 1, 5, 32, 10, 18, 22, 18, 5],
        ['l1_6', 'スプリングレッグ', 'legs', 'neutral', 1, 6, 20, 8, 10, 28, 24, 5],
        ['l1_7', 'クアッドレッグ', 'legs', 'neutral', 1, 7, 35, 12, 20, 20, 16, 5],
        ['l2_0', 'サイバーツインレッグ', 'legs', 'neutral', 2, 0, 45, 18, 25, 45, 40, 10],
        ['l2_1', 'サイバーレッグ', 'legs', 'neutral', 2, 1, 40, 16, 22, 52, 44, 11],
        ['l2_2', 'スプリングガード', 'legs', 'neutral', 2, 2, 50, 20, 30, 38, 35, 9],
        ['l2_3', 'シリンダーレッグ', 'legs', 'neutral', 2, 3, 44, 17, 28, 48, 42, 10]
    ];

    $stmtInsert = $pdo->prepare("
        INSERT INTO master_parts (id, name, part_type, attribute, rarity, visual_index, base_hp, base_power, base_defense, base_agility, base_dexterity, base_int)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), part_type=VALUES(part_type), attribute=VALUES(attribute), rarity=VALUES(rarity), visual_index=VALUES(visual_index), base_hp=VALUES(base_hp), base_power=VALUES(base_power), base_defense=VALUES(base_defense), base_agility=VALUES(base_agility), base_dexterity=VALUES(base_dexterity), base_int=VALUES(base_int)
    ");
    foreach ($catalogParts as $p) {
        $stmtInsert->execute($p);
    }

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
        $delDailyStmt = $pdo->prepare("DELETE FROM daily_cleared_minigame WHERE created_at < :cutoff");
        $delDailyStmt->execute([':cutoff' => $cutoffStr]);
    } catch (Throwable $e) {}
    try {
        $pdo->exec("UPDATE user_robots SET head_part_id = NULL WHERE head_part_id IS NOT NULL AND head_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE user_robots SET body_part_id = NULL WHERE body_part_id IS NOT NULL AND body_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE user_robots SET arms_part_id = NULL WHERE arms_part_id IS NOT NULL AND arms_part_id NOT IN (SELECT id FROM user_parts)");
        $pdo->exec("UPDATE user_robots SET legs_part_id = NULL WHERE legs_part_id IS NOT NULL AND legs_part_id NOT IN (SELECT id FROM user_parts)");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_robots ADD CONSTRAINT fk_head_part FOREIGN KEY (head_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
        $pdo->exec("ALTER TABLE user_robots ADD CONSTRAINT fk_body_part FOREIGN KEY (body_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
        $pdo->exec("ALTER TABLE user_robots ADD CONSTRAINT fk_arms_part FOREIGN KEY (arms_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
        $pdo->exec("ALTER TABLE user_robots ADD CONSTRAINT fk_legs_part FOREIGN KEY (legs_part_id) REFERENCES user_parts(id) ON DELETE SET NULL");
    } catch (PDOException $e) {}

    // save_dataテーブルから不要なデータを物理的に削除し、user_itemテーブルへのデータ移行を実施
    try {
        $stmt = $pdo->query("SELECT user_id, game_data FROM save_data");
        $upsertItem = $pdo->prepare("
            INSERT INTO user_item (user_id, repair_kit, bronze_chest, silver_chest, gold_chest, mythic_chest, element, battle_item, reversi_item)
            VALUES (:user_id, :repair_kit, :bronze_chest, :silver_chest, :gold_chest, :mythic_chest, :element, :battle_item, :reversi_item)
            ON DUPLICATE KEY UPDATE
                repair_kit = GREATEST(COALESCE(repair_kit, 0), VALUES(repair_kit)),
                bronze_chest = GREATEST(COALESCE(bronze_chest, 0), VALUES(bronze_chest)),
                silver_chest = GREATEST(COALESCE(silver_chest, 0), VALUES(silver_chest)),
                gold_chest = GREATEST(COALESCE(gold_chest, 0), VALUES(gold_chest)),
                mythic_chest = GREATEST(COALESCE(mythic_chest, 0), VALUES(mythic_chest)),
                element = GREATEST(COALESCE(element, 0), VALUES(element)),
                battle_item = COALESCE(battle_item, VALUES(battle_item)),
                reversi_item = COALESCE(reversi_item, VALUES(reversi_item))
        ");

        while ($row = $stmt->fetch()) {
            if (empty($row['game_data'])) continue;
            $data = json_decode($row['game_data'], true);
            if (is_array($data)) {
                $needsUpdate = false;

                // user_item に該当するデータが存在する場合は移行
                $hasItemData = isset($data['repairKits']) || isset($data['unopenedChests']) || isset($data['battleElements']) || 
                               isset($data['combatEquipments']) || isset($data['combatEquipmentRanks']) || isset($data['activeCombatEquipments']) ||
                               isset($data['othelloPurchasedMemories']) || isset($data['othelloEquippedMemories']) ||
                               isset($data['reversiPurchasedMemories']) || isset($data['reversiEquippedMemories']);
                if ($hasItemData) {
                    $rKit = isset($data['repairKits']) ? (int)$data['repairKits'] : 0;
                    $chests = (isset($data['unopenedChests']) && is_array($data['unopenedChests'])) ? $data['unopenedChests'] : [];
                    $bChest = isset($chests['bronze']) ? (int)$chests['bronze'] : 0;
                    $sChest = isset($chests['silver']) ? (int)$chests['silver'] : 0;
                    $gChest = isset($chests['gold']) ? (int)$chests['gold'] : 0;
                    $mChest = isset($chests['mythic']) ? (int)$chests['mythic'] : 0;
                    $elem = isset($data['battleElements']) ? (int)$data['battleElements'] : 0;

                    $bItem = null;
                    if (isset($data['combatEquipments']) || isset($data['combatEquipmentRanks']) || isset($data['activeCombatEquipments'])) {
                        $bItem = json_encode([
                            'beamSaber' => !empty($data['combatEquipments']['beamSaber']),
                            'beamShield' => !empty($data['combatEquipments']['beamShield']),
                            'combatEquipments' => $data['combatEquipments'] ?? [],
                            'combatEquipmentRanks' => $data['combatEquipmentRanks'] ?? [],
                            'activeCombatEquipments' => $data['activeCombatEquipments'] ?? []
                        ], JSON_UNESCAPED_UNICODE);
                    }

                    $rItem = null;
                    if (isset($data['othelloPurchasedMemories']) || isset($data['othelloEquippedMemories']) || isset($data['reversiPurchasedMemories']) || isset($data['reversiEquippedMemories'])) {
                        $rItem = json_encode([
                            'purchasedMemories' => $data['reversiPurchasedMemories'] ?? $data['othelloPurchasedMemories'] ?? [],
                            'equippedMemories' => $data['reversiEquippedMemories'] ?? $data['othelloEquippedMemories'] ?? []
                        ], JSON_UNESCAPED_UNICODE);
                    }

                    $upsertItem->execute([
                        ':user_id' => $row['user_id'],
                        ':repair_kit' => $rKit,
                        ':bronze_chest' => $bChest,
                        ':silver_chest' => $sChest,
                        ':gold_chest' => $gChest,
                        ':mythic_chest' => $mChest,
                        ':element' => $elem,
                        ':battle_item' => $bItem,
                        ':reversi_item' => $rItem
                    ]);
                }

                // dailyBattleLimits が save_data 内に存在する場合、daily_cleared_minigame テーブルへ移行
                if (!empty($data['dailyBattleLimits']) && is_array($data['dailyBattleLimits'])) {
                    $insertDailyStmt = $pdo->prepare("
                        INSERT INTO daily_cleared_minigame (user_id, robot_id, minigame_id, level, created_at)
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

                    foreach ($data['dailyBattleLimits'] as $k1 => $v1) {
                        if (is_array($v1) && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$k1)) {
                            if ((string)$k1 === $todayDateKey) {
                                foreach ($v1 as $limitItem) {
                                    if (is_string($limitItem)) {
                                        $parts = explode('_', $limitItem);
                                        if (count($parts) >= 3) {
                                            $rId = $parts[0];
                                            $mId = $parts[1];
                                            $lvlNum = is_numeric($parts[2]) ? (int)$parts[2] : 1;
                                            $insertDailyStmt->execute([
                                                ':user_id' => $row['user_id'],
                                                ':robot_id' => (string)$rId,
                                                ':minigame_id' => (string)$mId,
                                                ':level' => $lvlNum
                                            ]);
                                        }
                                    }
                                }
                            }
                        } elseif (is_array($v1)) {
                            $rId = (string)$k1;
                            foreach ($v1 as $mId => $lvlMap) {
                                if (is_array($lvlMap)) {
                                    foreach ($lvlMap as $lvlKey => $isCleared) {
                                        if ($isCleared) {
                                            $lvlNum = is_numeric($lvlKey) ? (int)$lvlKey : 1;
                                            $insertDailyStmt->execute([
                                                ':user_id' => $row['user_id'],
                                                ':robot_id' => $rId,
                                                ':minigame_id' => (string)$mId,
                                                ':level' => $lvlNum
                                            ]);
                                        }
                                    }
                                } elseif ($lvlMap) {
                                    $insertDailyStmt->execute([
                                        ':user_id' => $row['user_id'],
                                        ':robot_id' => $rId,
                                        ':minigame_id' => (string)$mId,
                                        ':level' => 1
                                    ]);
                                }
                            }
                        }
                    }
                    unset($data['dailyBattleLimits']);
                    $needsUpdate = true;
                }

                $keysToRemove = [
                    'parts', 'robots', 'materials', 'gold', 'fame', 'storageSize', 
                    'deliveredRobotsCount', 'starterBonusClaimed', 'repairKits', 
                    'unopenedChests', 'battleElements', 'minigameRecords', 'dailyBattleLimits',
                    'combatEquipments', 'combatEquipmentRanks', 'activeCombatEquipments',
                    'othelloPurchasedMemories', 'othelloEquippedMemories',
                    'reversiPurchasedMemories', 'reversiEquippedMemories'
                ];
                foreach ($keysToRemove as $k) {
                    if (isset($data[$k])) {
                        unset($data[$k]);
                        $needsUpdate = true;
                    }
                }
                if ($needsUpdate) {
                    $updateStmt = $pdo->prepare("UPDATE save_data SET game_data = :game_data WHERE user_id = :user_id");
                    $updateStmt->execute([
                        ':game_data' => json_encode($data, JSON_UNESCAPED_UNICODE),
                        ':user_id' => $row['user_id']
                    ]);
                }
            }
        }
    } catch (Throwable $e) {
        error_log("save_data cleanup error: " . $e->getMessage());
    }

    echo json_encode([
        "success" => true, 
        "message" => "Database tables setup successfully"
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ], JSON_UNESCAPED_UNICODE);
}
