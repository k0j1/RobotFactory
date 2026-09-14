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
        picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS m_parts_encyclopedia (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        part_type VARCHAR(50) NOT NULL,
        attribute VARCHAR(50) NOT NULL,
        rarity INT NOT NULL,
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

    CREATE TABLE IF NOT EXISTS user_parts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        master_part_id VARCHAR(255) NOT NULL,
        is_equipped BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS user_robots (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    CREATE TABLE IF NOT EXISTS user_material (
        user_id VARCHAR(255) NOT NULL,
        material_id VARCHAR(255) NOT NULL,
        count INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, material_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($sql);
    
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

    echo json_encode([
        "success" => true, 
        "message" => "Database tables setup successfully"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
