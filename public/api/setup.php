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

    CREATE TABLE IF NOT EXISTS m_parts_encyclopedia (
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

    CREATE TABLE IF NOT EXISTS user_minigame_status (
        user_id VARCHAR(255),
        minigame_id VARCHAR(255),
        play_count INT DEFAULT 0,
        wins INT DEFAULT 0,
        elements_count INT DEFAULT 0,
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
        battle_matches INT NOT NULL DEFAULT 0,
        battle_wins INT NOT NULL DEFAULT 0,
        battle_losses INT NOT NULL DEFAULT 0,
        battle_draws INT NOT NULL DEFAULT 0,
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
        "ADD COLUMN IF NOT EXISTS battle_matches INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS battle_wins INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS battle_losses INT NOT NULL DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS battle_draws INT NOT NULL DEFAULT 0",
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
                        battle_matches = :b_matches,
                        battle_wins = :b_wins,
                        battle_losses = :b_losses,
                        battle_draws = :b_draws,
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
                    
                    $bStats = $d['battleStats'] ?? $d['battle_stats'] ?? [];
                    $bMatches = isset($bStats['matches']) ? (int)$bStats['matches'] : 0;
                    $bWins = isset($bStats['wins']) ? (int)$bStats['wins'] : 0;
                    $bLosses = isset($bStats['losses']) ? (int)$bStats['losses'] : 0;
                    $bDraws = isset($bStats['draws']) ? (int)$bStats['draws'] : 0;
                    
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
                        ':b_matches' => $bMatches,
                        ':b_wins' => $bWins,
                        ':b_losses' => $bLosses,
                        ':b_draws' => $bDraws,
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

    try {
        $pdo->exec("ALTER TABLE m_parts_encyclopedia ADD COLUMN visual_index INT DEFAULT 0");
    } catch (PDOException $e) {}

    // m_parts_encyclopedia のマスターデータ挿入・シード
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
        INSERT INTO m_parts_encyclopedia (id, name, part_type, attribute, rarity, visual_index, base_hp, base_power, base_defense, base_agility, base_dexterity, base_int)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), part_type=VALUES(part_type), attribute=VALUES(attribute), rarity=VALUES(rarity), visual_index=VALUES(visual_index), base_hp=VALUES(base_hp), base_power=VALUES(base_power), base_defense=VALUES(base_defense), base_agility=VALUES(base_agility), base_dexterity=VALUES(base_dexterity), base_int=VALUES(base_int)
    ");
    foreach ($catalogParts as $p) {
        $stmtInsert->execute($p);
    }
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

    // save_dataテーブルのJSONから不要なデータを物理的に削除する
    try {
        $stmt = $pdo->query("SELECT id, game_data FROM save_data");
        while ($row = $stmt->fetch()) {
            if (empty($row['game_data'])) continue;
            $data = json_decode($row['game_data'], true);
            if (is_array($data)) {
                $needsUpdate = false;
                $keysToRemove = ['parts', 'robots', 'materials', 'gold', 'fame', 'storageSize', 'deliveredRobotsCount', 'starterBonusClaimed'];
                foreach ($keysToRemove as $k) {
                    if (isset($data[$k])) {
                        unset($data[$k]);
                        $needsUpdate = true;
                    }
                }
                if ($needsUpdate) {
                    $updateStmt = $pdo->prepare("UPDATE save_data SET game_data = :game_data WHERE id = :id");
                    $updateStmt->execute([
                        ':game_data' => json_encode($data, JSON_UNESCAPED_UNICODE),
                        ':id' => $row['id']
                    ]);
                }
            }
        }
    } catch (PDOException $e) {}

    echo json_encode([
        "success" => true, 
        "message" => "Database tables setup successfully"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
