<?php
// =============================================================================
// setup.php - GitHub Actions デプロイ時のデータベース自動マイグレーションAPI
// .github/workflows/deploy.yml から呼び出され、全テーブルの作成・スキーマ更新・
// 外部キー制約（ON DELETE CASCADE ON UPDATE CASCADE）の保証を冪等に実行します。
// =============================================================================

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDB();
if (!$pdo) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 1. 旧テーブルの名称変更・廃止クリーンアップ
    try {
        $existingTables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $existingLower = array_map('strtolower', $existingTables);
        if (in_array('daily_cleared_minigame', $existingLower, true) || in_array('completed_daily_minigame', $existingLower, true)) {
            $pdo->exec("DROP TABLE IF EXISTS completed_daily_minigame, daily_cleared_minigame");
        }
        if (in_array('minigame_rankings', $existingLower, true) && !in_array('stats_minigame_rankings', $existingLower, true)) {
            $pdo->exec("RENAME TABLE minigame_rankings TO stats_minigame_rankings");
        }
        if (in_array('save_data', $existingLower, true) && !in_array('user_save_data', $existingLower, true)) {
            $pdo->exec("RENAME TABLE save_data TO user_save_data");
        }
        $pdo->exec("DROP TABLE IF EXISTS completed_robots, m_parts_encyclopedia");
    } catch (Throwable $e) {}

    // 2. コアテーブル（users, master_parts, user_parts, user_robots 等）の作成保証
    $pdo->exec("
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
            id VARCHAR(50) PRIMARY KEY,
            part_type VARCHAR(50) NOT NULL,
            rarity INT NOT NULL DEFAULT 1,
            visual_index INT NOT NULL DEFAULT 0,
            name VARCHAR(255) NOT NULL,
            vitality INT NOT NULL DEFAULT 0,
            power INT NOT NULL DEFAULT 0,
            defense INT NOT NULL DEFAULT 0,
            agility INT NOT NULL DEFAULT 0,
            dexterity INT NOT NULL DEFAULT 0,
            intelligence INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS user_parts (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            master_part_id VARCHAR(255) NULL,
            part_type VARCHAR(50) NOT NULL DEFAULT 'head',
            name VARCHAR(255) NOT NULL DEFAULT '',
            attribute VARCHAR(50) NOT NULL DEFAULT 'Fire',
            rarity INT NOT NULL DEFAULT 1,
            visual_index INT NOT NULL DEFAULT 0,
            is_equipped TINYINT(1) NOT NULL DEFAULT 0,
            vitality INT NOT NULL DEFAULT 0,
            power INT NOT NULL DEFAULT 0,
            defense INT NOT NULL DEFAULT 0,
            agility INT NOT NULL DEFAULT 0,
            dexterity INT NOT NULL DEFAULT 0,
            intelligence INT NOT NULL DEFAULT 0,
            main_material_id VARCHAR(100) NULL,
            sub_material_id VARCHAR(100) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user_parts_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS user_robots (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            head_part_id VARCHAR(255) NULL,
            body_part_id VARCHAR(255) NULL,
            arms_part_id VARCHAR(255) NULL,
            legs_part_id VARCHAR(255) NULL,
            currentHp INT DEFAULT 12,
            maxHP INT DEFAULT 12,
            battleStats JSON NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user_robots_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
            danmaku_item JSON NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS user_minigame_status (
            user_id VARCHAR(255) NOT NULL,
            minigame_id VARCHAR(255) NOT NULL,
            play_count INT DEFAULT 0,
            wins INT DEFAULT 0,
            elements_count INT DEFAULT 0,
            chests_count INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, minigame_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS stats_minigame_rankings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            minigame_id VARCHAR(100) NOT NULL,
            score INT NOT NULL DEFAULT 0,
            robot_name VARCHAR(255) NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uq_user_minigame (user_id, minigame_id)
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
            head_part_id VARCHAR(255),
            body_part_id VARCHAR(255),
            arms_part_id VARCHAR(255),
            legs_part_id VARCHAR(255),
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
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

        CREATE TABLE IF NOT EXISTS complete_daily_minigame (
            id INT AUTO_INCREMENT PRIMARY KEY,
            minigame_id VARCHAR(32) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            robot_id VARCHAR(255) NOT NULL,
            level VARCHAR(32) NOT NULL DEFAULT '1',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_daily_clear (user_id, robot_id, minigame_id, level),
            INDEX idx_user_robot (user_id, robot_id),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 3. カラム拡張・互換マイグレーション
    $alterStatements = [
        "ALTER TABLE user_item ADD COLUMN battle_item JSON NULL AFTER element",
        "ALTER TABLE user_item ADD COLUMN reversi_item JSON NULL AFTER battle_item",
        "ALTER TABLE user_item ADD COLUMN danmaku_item JSON NULL AFTER reversi_item",
        "ALTER TABLE user_minigame_status ADD COLUMN chests_count INT DEFAULT 0",
        "ALTER TABLE active_expeditions ADD COLUMN dispatched_robot_id VARCHAR(255)",
        "ALTER TABLE active_requests ADD COLUMN request_data JSON",
        "ALTER TABLE active_part_crafts ADD COLUMN result_part_data JSON NULL",
        "ALTER TABLE active_part_crafts ADD COLUMN duration_ms BIGINT DEFAULT 0",
        "ALTER TABLE active_part_crafts MODIFY COLUMN sub_material_id VARCHAR(255) NULL DEFAULT ''",
        "ALTER TABLE complete_part_crafts ADD COLUMN part_type VARCHAR(50) NOT NULL DEFAULT 'head'",
        "ALTER TABLE complete_part_crafts ADD COLUMN main_material_id VARCHAR(255) NOT NULL DEFAULT ''",
        "ALTER TABLE complete_part_crafts ADD COLUMN sub_material_id VARCHAR(255) NULL DEFAULT ''",
        "ALTER TABLE complete_part_crafts ADD COLUMN start_time BIGINT NOT NULL DEFAULT 0",
        "ALTER TABLE complete_part_crafts ADD COLUMN end_time BIGINT NOT NULL DEFAULT 0",
        "ALTER TABLE complete_part_crafts ADD COLUMN result_part_data JSON NULL",
        "ALTER TABLE complete_part_crafts MODIFY COLUMN sub_material_id VARCHAR(255) NULL DEFAULT ''",
        "ALTER TABLE user_robots ADD COLUMN currentHp INT DEFAULT 12",
        "ALTER TABLE user_robots ADD COLUMN maxHP INT DEFAULT 12",
        "ALTER TABLE user_robots ADD COLUMN battleStats JSON",
        "ALTER TABLE user_workshop_status ADD COLUMN request_earned_gold INT DEFAULT 0",
        "ALTER TABLE active_robot_disassemblies ADD COLUMN head_part_id VARCHAR(255) NULL",
        "ALTER TABLE active_robot_disassemblies ADD COLUMN body_part_id VARCHAR(255) NULL",
        "ALTER TABLE active_robot_disassemblies ADD COLUMN arms_part_id VARCHAR(255) NULL",
        "ALTER TABLE active_robot_disassemblies ADD COLUMN legs_part_id VARCHAR(255) NULL"
    ];

    foreach ($alterStatements as $sql) {
        try {
            $pdo->exec($sql);
        } catch (Throwable $e) {}
    }

    // 4. 遠征地マスターテーブルと外部キー制約の保証
    ensureMasterExpeditions($pdo);
    ensureUserForeignKeys($pdo);

    echo json_encode([
        'success' => true,
        'message' => 'Database migration completed successfully.'
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
