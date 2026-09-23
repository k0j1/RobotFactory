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
    // usersテーブルから該当ユーザーのgoogle_idおよびid、プロフィール情報を特定
    $userStmt = $pdo->prepare("SELECT id, google_id, email, name, picture, created_at, updated_at FROM users WHERE google_id = :u1 OR id = :u2 OR email = :u3 LIMIT 1");
    $userStmt->execute([':u1' => $userId, ':u2' => $userId, ':u3' => $userId]);
    $uRec = $userStmt->fetch(PDO::FETCH_ASSOC);
    $userRecord = $uRec ?: null;
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

        CREATE TABLE IF NOT EXISTS daily_cleared_minigame (
            id INT AUTO_INCREMENT PRIMARY KEY,
            minigame_id VARCHAR(100) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            robot_id VARCHAR(255) NOT NULL,
            level VARCHAR(100) NOT NULL DEFAULT '1',
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
        $pdo->exec("ALTER TABLE daily_cleared_minigame MODIFY COLUMN level VARCHAR(100) NOT NULL DEFAULT '1'");
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
        $delDailyStmt = $pdo->prepare("DELETE FROM daily_cleared_minigame WHERE created_at < :cutoff");
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

    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN request_earned_gold INT DEFAULT 0");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE user_workshop_status ADD COLUMN unlocked_expeditions JSON");
    } catch (PDOException $e) {}

    // 遠征地マスターテーブルと初期データの存在を保証
    ensureMasterExpeditions($pdo);

    // ユーザー識別子の候補リスト（google_id または users.id）
    $candidateUserIds = array_unique(array_filter([$actualUserId, $userId, $numericId]));
    $inPlaceholders = implode(',', array_fill(0, count($candidateUserIds), '?'));

    // 1. user_workshop_status テーブルから工房ステータスを取得
    // 複数レコードが存在する場合は gold や実績が多いレコードを最優先し、同一ユーザーでレコードが分裂して gold がゼロになるのを防ぐ
    $wsStmt = $pdo->prepare("
        SELECT user_id, fame, gold, storage_limit, delivered_count, received_initial_bonus, request_earned_gold, unlocked_expeditions, consumed_gold 
        FROM user_workshop_status 
        WHERE user_id IN ($inPlaceholders) 
        ORDER BY gold DESC, fame DESC, updated_at DESC
    ");
    $wsStmt->execute(array_values($candidateUserIds));
    $wsRows = $wsStmt->fetchAll(PDO::FETCH_ASSOC);
    $wsRow = !empty($wsRows) ? $wsRows[0] : null;

    // もし複数レコードが存在していた場合は、実際のユーザーID (google_id) へ統合して古いゴミレコードを解消
    if (count($wsRows) > 1 && !empty($actualUserId)) {
        try {
            $mergedGold = 0;
            $mergedFame = 0;
            $mergedConsumed = 0;
            $mergedStorage = 5;
            $mergedDelivered = 0;
            $mergedBonus = 0;
            $mergedRequestGold = 0;
            $mergedLocations = ['loc1'];

            foreach ($wsRows as $r) {
                if ((int)$r['gold'] > $mergedGold) $mergedGold = (int)$r['gold'];
                if ((int)$r['fame'] > $mergedFame) $mergedFame = (int)$r['fame'];
                if ((int)$r['consumed_gold'] > $mergedConsumed) $mergedConsumed = (int)$r['consumed_gold'];
                if ((int)$r['storage_limit'] > $mergedStorage) $mergedStorage = (int)$r['storage_limit'];
                if ((int)$r['delivered_count'] > $mergedDelivered) $mergedDelivered = (int)$r['delivered_count'];
                if (!empty($r['received_initial_bonus'])) $mergedBonus = 1;
                if ((int)$r['request_earned_gold'] > $mergedRequestGold) $mergedRequestGold = (int)$r['request_earned_gold'];
                if (!empty($r['unlocked_expeditions'])) {
                    $locs = json_decode($r['unlocked_expeditions'], true);
                    if (is_array($locs)) {
                        $mergedLocations = array_unique(array_merge($mergedLocations, $locs));
                    }
                }
            }

            $updMaster = $pdo->prepare("
                INSERT INTO user_workshop_status 
                    (user_id, fame, gold, storage_limit, delivered_count, received_initial_bonus, request_earned_gold, consumed_gold, unlocked_expeditions)
                VALUES 
                    (:uid, :fame, :gold, :storage, :delivered, :bonus, :req_gold, :consumed, :unlocked)
                ON DUPLICATE KEY UPDATE
                    fame = :up_fame,
                    gold = :up_gold,
                    storage_limit = :up_storage,
                    delivered_count = :up_delivered,
                    received_initial_bonus = :up_bonus,
                    request_earned_gold = :up_req_gold,
                    consumed_gold = :up_consumed,
                    unlocked_expeditions = :up_unlocked
            ");
            $locJson = json_encode(array_values($mergedLocations), JSON_UNESCAPED_UNICODE);
            $updMaster->execute([
                ':uid' => $actualUserId,
                ':fame' => $mergedFame,
                ':gold' => $mergedGold,
                ':storage' => $mergedStorage,
                ':delivered' => $mergedDelivered,
                ':bonus' => $mergedBonus,
                ':req_gold' => $mergedRequestGold,
                ':consumed' => $mergedConsumed,
                ':unlocked' => $locJson,
                ':up_fame' => $mergedFame,
                ':up_gold' => $mergedGold,
                ':up_storage' => $mergedStorage,
                ':up_delivered' => $mergedDelivered,
                ':up_bonus' => $mergedBonus,
                ':up_req_gold' => $mergedRequestGold,
                ':up_consumed' => $mergedConsumed,
                ':up_unlocked' => $locJson,
            ]);

            // actualUserId以外の別IDレコードを削除して統合
            $cleanStmt = $pdo->prepare("DELETE FROM user_workshop_status WHERE user_id IN ($inPlaceholders) AND user_id != :act_uid");
            $params = array_values($candidateUserIds);
            $params[] = $actualUserId;
            $cleanStmt->execute($params);

            $wsRow = [
                'user_id' => $actualUserId,
                'fame' => $mergedFame,
                'gold' => $mergedGold,
                'storage_limit' => $mergedStorage,
                'delivered_count' => $mergedDelivered,
                'received_initial_bonus' => $mergedBonus,
                'request_earned_gold' => $mergedRequestGold,
                'consumed_gold' => $mergedConsumed,
                'unlocked_expeditions' => $locJson,
            ];
        } catch (Exception $e) {
            error_log("[load.php] Record consolidation error: " . $e->getMessage());
        }
    }

    $goldVal = $wsRow ? (int)($wsRow['gold'] ?? 0) : 0;
    $fameVal = $wsRow ? (int)($wsRow['fame'] ?? 0) : 0;
    $storageLimitVal = ($wsRow && !empty($wsRow['storage_limit'])) ? (int)$wsRow['storage_limit'] : 5;
    $deliveredCountVal = $wsRow ? (int)($wsRow['delivered_count'] ?? 0) : 0;
    $receivedBonusVal = ($wsRow && isset($wsRow['received_initial_bonus'])) ? (int)$wsRow['received_initial_bonus'] : 0;
    if ($userRecord) {
        $userRecord['received_initial_bonus'] = $receivedBonusVal;
    }
    $requestEarnedGoldVal = $wsRow ? (int)($wsRow['request_earned_gold'] ?? 0) : 0;
    $unlockedLocationsVal = ['loc1']; // 裏山のスクラップ場は最初から解放状態で設定
    if ($wsRow && !empty($wsRow['unlocked_expeditions'])) {
        $parsedLocs = json_decode($wsRow['unlocked_expeditions'], true);
        if (is_array($parsedLocs) && !empty($parsedLocs)) {
            $unlockedLocationsVal = array_values(array_unique(array_merge(['loc1'], $parsedLocs)));
        }
    }

    // DB側にも loc1 が未保存なら保存しておく
    if ($wsRow && (empty($wsRow['unlocked_expeditions']) || $wsRow['unlocked_expeditions'] === '[]')) {
        try {
            $pdo->prepare("UPDATE user_workshop_status SET unlocked_expeditions = '[\"loc1\"]' WHERE user_id = :uid")
                ->execute([':uid' => $wsRow['user_id']]);
        } catch (PDOException $e) {}
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

    // 5. active_robot_assemblies テーブルから最新のロボット組立進行状態を取得（個別カラム＆user_parts外部キー結合）
    $assStmt = $pdo->prepare("
        SELECT * 
        FROM active_robot_assemblies 
        WHERE user_id IN ($inPlaceholders) 
        LIMIT 1
    ");
    $assStmt->execute(array_values($candidateUserIds));
    $assRow = $assStmt->fetch();
    $activeAssembly = null;
    if ($assRow) {
        $resultRobot = null;
        
        // 個別列データが存在する場合、列情報および user_parts から Robot オブジェクトを再構築
        if (!empty($assRow['robot_id']) || !empty($assRow['robot_name'])) {
            $partMap = [];
            if (!empty($dbParts)) {
                foreach ($dbParts as $dp) {
                    $partMap[$dp['id']] = $dp;
                }
            }

            // まだ $partMap にないパーツがあれば user_parts テーブルから個別取得
            $neededPartIds = array_values(array_filter([
                $assRow['head_part_id'] ?? null,
                $assRow['body_part_id'] ?? null,
                $assRow['arms_part_id'] ?? null,
                $assRow['legs_part_id'] ?? null
            ], function($id) use ($partMap) {
                return !empty($id) && !isset($partMap[$id]);
            }));

            if (!empty($neededPartIds)) {
                $pIn = implode(',', array_fill(0, count($neededPartIds), '?'));
                $fetchPartStmt = $pdo->prepare("SELECT * FROM user_parts WHERE id IN ($pIn)");
                $fetchPartStmt->execute($neededPartIds);
                while ($pRow = $fetchPartStmt->fetch(PDO::FETCH_ASSOC)) {
                    $partMap[$pRow['id']] = [
                        'id' => $pRow['id'],
                        'type' => $pRow['part_type'] ?? 'head',
                        'name' => $pRow['name'] ?? 'パーツ',
                        'attribute' => $pRow['attribute'] ?? 'Fire',
                        'rarity' => (int)($pRow['rarity'] ?? 1),
                        'visualIndex' => (int)($pRow['visual_index'] ?? 0),
                        'isEquipped' => true,
                        'stats' => [
                            'hp' => (int)($pRow['vitality'] ?? 0),
                            'power' => (int)($pRow['power'] ?? 0),
                            'defense' => (int)($pRow['defense'] ?? 0),
                            'agility' => (int)($pRow['agility'] ?? 0),
                            'dexterity' => (int)($pRow['dexterity'] ?? 0),
                            'intelligence' => (int)($pRow['intelligence'] ?? 0)
                        ],
                        'mainMaterialId' => $pRow['main_material_id'] ?? null,
                        'subMaterialId' => $pRow['sub_material_id'] ?? null
                    ];
                }
            }

            $buildPartObj = function($type, $partId) use ($partMap) {
                if (!empty($partId) && isset($partMap[$partId])) {
                    return $partMap[$partId];
                }
                return [
                    'id' => $partId ?: ('dummy_' . $type),
                    'type' => $type,
                    'name' => 'パーツ(' . $type . ')',
                    'attribute' => 'Fire',
                    'rarity' => 1,
                    'visualIndex' => 0,
                    'isEquipped' => true,
                    'stats' => ['hp' => 3, 'power' => 3, 'defense' => 3, 'agility' => 3, 'dexterity' => 3, 'intelligence' => 3]
                ];
            };

            $headPart = $buildPartObj('head', $assRow['head_part_id'] ?? null);
            $bodyPart = $buildPartObj('body', $assRow['body_part_id'] ?? null);
            $armsPart = $buildPartObj('arms', $assRow['arms_part_id'] ?? null);
            $legsPart = $buildPartObj('legs', $assRow['legs_part_id'] ?? null);

            $calcStats = [
                'hp' => 0, 'power' => 0, 'defense' => 0, 'agility' => 0, 'dexterity' => 0, 'intelligence' => 0
            ];
            foreach ([$headPart, $bodyPart, $armsPart, $legsPart] as $pObj) {
                if (!empty($pObj['stats']) && is_array($pObj['stats'])) {
                    foreach ($calcStats as $sKey => $sVal) {
                        $calcStats[$sKey] += (int)($pObj['stats'][$sKey] ?? 0);
                    }
                }
            }

            $resultRobot = [
                'id' => $assRow['robot_id'] ?? ('rob_' . $assRow['start_time']),
                'name' => $assRow['robot_name'] ?? '組立ロボット',
                'parts' => [
                    'head' => $headPart,
                    'body' => $bodyPart,
                    'arms' => $armsPart,
                    'legs' => $legsPart,
                ],
                'stats' => $calcStats,
                'currentHp' => isset($assRow['current_hp']) ? (int)$assRow['current_hp'] : max(12, $calcStats['hp']),
                'maxHp' => isset($assRow['max_hp']) ? (int)$assRow['max_hp'] : max(12, $calcStats['hp']),
                'value' => (int)($assRow['value'] ?? 0),
                'createdAt' => isset($assRow['robot_created_at']) && (int)$assRow['robot_created_at'] > 0
                    ? (int)$assRow['robot_created_at']
                    : (int)$assRow['start_time'],
                'battleStats' => [
                    'wins' => 0,
                    'losses' => 0,
                    'totalBattles' => 0
                ]
            ];
        }

        // 旧データ互換用フォールバック
        if (!$resultRobot && !empty($assRow['result_robot_data'])) {
            $decoded = json_decode($assRow['result_robot_data'], true);
            if (is_array($decoded)) {
                $resultRobot = $decoded;
            }
        }

        $activeAssembly = [
            'startTime' => (int)$assRow['start_time'],
            'endTime' => (int)$assRow['end_time'],
            'durationMs' => isset($assRow['duration_ms']) ? (int)$assRow['duration_ms'] : ((int)$assRow['end_time'] - (int)$assRow['start_time']),
            'resultRobot' => is_array($resultRobot) ? $resultRobot : null
        ];
    }

    // 5-2. active_robot_disassemblies テーブルから最新のロボット解体進行状態を取得（個別カラム＆user_parts外部キー結合）
    $disStmt = $pdo->prepare("
        SELECT * 
        FROM active_robot_disassemblies 
        WHERE user_id IN ($inPlaceholders) 
        LIMIT 1
    ");
    $disStmt->execute(array_values($candidateUserIds));
    $disRow = $disStmt->fetch();
    $activeRobotDisassembly = null;
    if ($disRow && !empty($disRow['start_time'])) {
        $partMap = [];
        if (!empty($dbParts)) {
            foreach ($dbParts as $dp) {
                $partMap[$dp['id']] = $dp;
            }
        }

        $neededDisPartIds = array_values(array_filter([
            $disRow['head_part_id'] ?? null,
            $disRow['body_part_id'] ?? null,
            $disRow['arms_part_id'] ?? null,
            $disRow['legs_part_id'] ?? null
        ], function($id) use ($partMap) {
            return !empty($id) && !isset($partMap[$id]);
        }));

        if (!empty($neededDisPartIds)) {
            $pIn = implode(',', array_fill(0, count($neededDisPartIds), '?'));
            $fetchDisPartStmt = $pdo->prepare("SELECT * FROM user_parts WHERE id IN ($pIn)");
            $fetchDisPartStmt->execute($neededDisPartIds);
            while ($pRow = $fetchDisPartStmt->fetch(PDO::FETCH_ASSOC)) {
                $partMap[$pRow['id']] = [
                    'id' => $pRow['id'],
                    'type' => $pRow['part_type'] ?? 'head',
                    'name' => $pRow['name'] ?? 'パーツ',
                    'attribute' => $pRow['attribute'] ?? 'Fire',
                    'rarity' => (int)($pRow['rarity'] ?? 1),
                    'visualIndex' => (int)($pRow['visual_index'] ?? 0),
                    'isEquipped' => true,
                    'stats' => [
                        'hp' => (int)($pRow['vitality'] ?? 0),
                        'power' => (int)($pRow['power'] ?? 0),
                        'defense' => (int)($pRow['defense'] ?? 0),
                        'agility' => (int)($pRow['agility'] ?? 0),
                        'dexterity' => (int)($pRow['dexterity'] ?? 0),
                        'intelligence' => (int)($pRow['intelligence'] ?? 0)
                    ],
                    'mainMaterialId' => $pRow['main_material_id'] ?? null,
                    'subMaterialId' => $pRow['sub_material_id'] ?? null
                ];
            }
        }

        $buildDisPartObj = function($type, $partId) use ($partMap) {
            if (!empty($partId) && isset($partMap[$partId])) {
                return $partMap[$partId];
            }
            return [
                'id' => $partId ?: ('dummy_' . $type),
                'type' => $type,
                'name' => 'パーツ(' . $type . ')',
                'attribute' => 'Fire',
                'rarity' => 1,
                'visualIndex' => 0,
                'isEquipped' => true,
                'stats' => ['hp' => 3, 'power' => 3, 'defense' => 3, 'agility' => 3, 'dexterity' => 3, 'intelligence' => 3]
            ];
        };

        $disHead = $buildDisPartObj('head', $disRow['head_part_id'] ?? null);
        $disBody = $buildDisPartObj('body', $disRow['body_part_id'] ?? null);
        $disArms = $buildDisPartObj('arms', $disRow['arms_part_id'] ?? null);
        $disLegs = $buildDisPartObj('legs', $disRow['legs_part_id'] ?? null);

        $durationMs = (int)$disRow['end_time'] - (int)$disRow['start_time'];
        $activeRobotDisassembly = [
            'robotClone' => [
                'id' => $disRow['robot_id'] ?? ('rob_' . $disRow['start_time']),
                'name' => '解体中ロボット',
                'parts' => [
                    'head' => $disHead,
                    'body' => $disBody,
                    'arms' => $disArms,
                    'legs' => $disLegs
                ]
            ],
            'startTime' => (int)$disRow['start_time'],
            'endTime' => (int)$disRow['end_time'],
            'durationMs' => $durationMs > 0 ? $durationMs : 30000,
            'resultParts' => array_values(array_filter([$disHead, $disBody, $disArms, $disLegs]))
        ];
    }

    // 6. active_requests テーブルから受注依頼状態を取得 (テーブル列値とrequest_dataの残余データを合成して復元)
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
        $extraData = [];
        if (!empty($reqRow['request_data'])) {
            $rData = is_string($reqRow['request_data']) ? json_decode($reqRow['request_data'], true) : $reqRow['request_data'];
            if (is_array($rData)) {
                $extraData = $rData;
                // 重複していた旧キーを安全に除去
                unset(
                    $extraData['id'],
                    $extraData['requestId'],
                    $extraData['request_id'],
                    $extraData['rank'],
                    $extraData['rewardG'],
                    $extraData['reward_g'],
                    $extraData['deadline']
                );
            }
        }
        // テーブルのカラム値を優先して ClientRequest を再構築
        $currentRequest = array_merge($extraData, [
            'id' => $reqRow['request_id'],
            'rank' => $reqRow['rank'],
            'rewardG' => (int)$reqRow['reward_g'],
            'deadline' => (int)$reqRow['deadline']
        ]);
    }

    // 7. user_minigame_status テーブルからミニゲーム/バトル演習成績・エレメント数・宝箱数を取得
    $miniStmt = $pdo->prepare("
        SELECT minigame_id, play_count, wins, elements_count, chests_count 
        FROM user_minigame_status 
        WHERE user_id IN ($inPlaceholders)
    ");
    $miniStmt->execute(array_values($candidateUserIds));
    $dbMinigameRecords = [];
    $battleElements = 0;
    $dbUnopenedChestsCount = 0;

    while ($mRow = $miniStmt->fetch()) {
        $mId = $mRow['minigame_id'];
        $plays = (int)$mRow['play_count'];
        $wins = (int)$mRow['wins'];
        $elems = (int)$mRow['elements_count'];
        $chests = isset($mRow['chests_count']) ? (int)$mRow['chests_count'] : 0;

        $dbMinigameRecords[$mId] = [
            'plays' => $plays,
            'wins' => $wins,
            'losses' => 0,
            'draws' => 0,
            'elements' => $elems,
            'chests' => $chests
        ];

        if ($mId === 'unopened_chests' || $mId === 'chests_inventory') {
            $dbUnopenedChestsCount = max($dbUnopenedChestsCount, $chests);
        }

        if ($elems > $battleElements) {
            $battleElements = $elems;
        }
    }

    // 8. user_item テーブルから所持アイテム（修理キット、各宝箱、エレメント、battle_item、reversi_item）を取得
    $itemStmt = $pdo->prepare("
        SELECT repair_kit, bronze_chest, silver_chest, gold_chest, mythic_chest, element, battle_item, reversi_item
        FROM user_item
        WHERE user_id IN ($inPlaceholders)
        LIMIT 1
    ");
    $itemStmt->execute(array_values($candidateUserIds));
    $userItemRow = $itemStmt->fetch(PDO::FETCH_ASSOC);

    // 8.5 daily_cleared_minigame テーブルから本日のクリア済み記録を取得
    $dailyClearStmt = $pdo->prepare("
        SELECT minigame_id, robot_id, level, created_at 
        FROM daily_cleared_minigame 
        WHERE user_id IN ($inPlaceholders)
    ");
    $dailyClearStmt->execute(array_values($candidateUserIds));
    $dbDailyCleared = [];
    while ($dcRow = $dailyClearStmt->fetch(PDO::FETCH_ASSOC)) {
        $rId = (string)$dcRow['robot_id'];
        $mId = (string)$dcRow['minigame_id'];
        $lvl = (string)$dcRow['level'];
        if (!isset($dbDailyCleared[$rId])) {
            $dbDailyCleared[$rId] = [];
        }
        if (!isset($dbDailyCleared[$rId][$mId])) {
            $dbDailyCleared[$rId][$mId] = [];
        }
        $dbDailyCleared[$rId][$mId][$lvl] = true;
    }

    // 9. user_parts テーブルから所持パーツ一覧を取得（個別カラムからRobotPartオブジェクトを完全復元）
    $partsStmt = $pdo->prepare("
        SELECT * 
        FROM user_parts 
        WHERE user_id IN ($inPlaceholders)
        ORDER BY created_at ASC
    ");
    $partsStmt->execute(array_values($candidateUserIds));
    $dbParts = [];
    while ($pRow = $partsStmt->fetch(PDO::FETCH_ASSOC)) {
        $partId = $pRow['id'];
        $pType = !empty($pRow['part_type']) ? $pRow['part_type'] : 'head';
        $pName = !empty($pRow['name']) ? $pRow['name'] : ($pRow['master_part_id'] ?? $partId);
        $pAttr = !empty($pRow['attribute']) ? $pRow['attribute'] : 'Fire';
        $pRarity = isset($pRow['rarity']) ? (int)$pRow['rarity'] : 1;
        $pVis = isset($pRow['visual_index']) ? (int)$pRow['visual_index'] : 0;
        $isEquipped = !empty($pRow['is_equipped']);

        $stats = [
            'hp' => isset($pRow['vitality']) ? (int)$pRow['vitality'] : (isset($pRow['hp']) ? (int)$pRow['hp'] : 0),
            'power' => isset($pRow['power']) ? (int)$pRow['power'] : 0,
            'defense' => isset($pRow['defense']) ? (int)$pRow['defense'] : 0,
            'agility' => isset($pRow['agility']) ? (int)$pRow['agility'] : 0,
            'dexterity' => isset($pRow['dexterity']) ? (int)$pRow['dexterity'] : 0,
            'intelligence' => isset($pRow['intelligence']) ? (int)$pRow['intelligence'] : 0,
        ];

        $battleStats = [
            'matches' => 0,
            'wins' => 0,
            'losses' => 0,
            'draws' => 0,
        ];

        // 移行期などで万が一 part_data が残っていた場合のフォールバック補完
        if (!empty($pRow['part_data'])) {
            $legacy = json_decode($pRow['part_data'], true);
            if (is_array($legacy)) {
                if (empty($pRow['name']) && !empty($legacy['name'])) $pName = $legacy['name'];
                if (empty($pRow['attribute']) && !empty($legacy['attribute'])) $pAttr = $legacy['attribute'];
                if (empty($pRow['part_type']) && !empty($legacy['type'])) $pType = $legacy['type'];
                if (isset($legacy['stats']) && is_array($legacy['stats'])) {
                    foreach (['hp', 'power', 'defense', 'agility', 'dexterity', 'intelligence'] as $stKey) {
                        if ($stats[$stKey] === 0 && isset($legacy['stats'][$stKey])) {
                            $stats[$stKey] = (int)$legacy['stats'][$stKey];
                        }
                    }
                }
            }
        }

        $reconstructedPart = [
            'id' => $partId,
            'type' => $pType,
            'name' => $pName,
            'attribute' => $pAttr,
            'rarity' => $pRarity,
            'visualIndex' => $pVis,
            'isEquipped' => $isEquipped,
            'stats' => $stats,
            'battleStats' => $battleStats,
        ];

        if (!empty($pRow['main_material_id'])) {
            $reconstructedPart['mainMaterialId'] = $pRow['main_material_id'];
        }
        if (!empty($pRow['sub_material_id'])) {
            $reconstructedPart['subMaterialId'] = $pRow['sub_material_id'];
        }

        $dbParts[] = $reconstructedPart;
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

    // 名声(fame)が0または過小な場合の自己修復・ゼロ防止フェイルセーフ:
    // 過去のセーブスナップショット、納品履歴、ミニゲーム勝利実績から正当な名声を自動復元
    $snapshotFame = 0;
    if ($row && !empty($row['game_data'])) {
        $tempGd = json_decode($row['game_data'], true);
        if (is_array($tempGd) && !empty($tempGd['fame'])) {
            $snapshotFame = (int)$tempGd['fame'];
        }
    }
    $calculatedMinFame = 0;
    if (!empty($dbDeliveredLogs)) {
        $calculatedMinFame += count($dbDeliveredLogs) * 20;
    } elseif ($deliveredCountVal > 0) {
        $calculatedMinFame += $deliveredCountVal * 20;
    }
    if (!empty($dbMinigameRecords)) {
        foreach ($dbMinigameRecords as $mRec) {
            $calculatedMinFame += (int)($mRec['wins'] ?? 0) * 5;
        }
    }
    $effectiveFame = max($fameVal, $snapshotFame, $calculatedMinFame);
    if ($effectiveFame > $fameVal) {
        $fameVal = $effectiveFame;
        // DB側 (user_workshop_status) も最新の名声で自己修復
        try {
            $pdo->prepare("
                INSERT INTO user_workshop_status (user_id, fame, storage_limit, unlocked_expeditions)
                VALUES (:uid, :fame, 5, '[\"loc1\"]')
                ON DUPLICATE KEY UPDATE fame = GREATEST(COALESCE(fame, 0), :up_fame)
            ")->execute([':uid' => $actualUserId, ':fame' => $fameVal, ':up_fame' => $fameVal]);
        } catch (PDOException $e) {}
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
        unset($gameData['minigameRecords']);

        // save_data テーブルに残っているミニゲームクリア制限データを daily_cleared_minigame テーブルへ移行
        $hasSaveDailyBattleLimits = !empty($gameData['dailyBattleLimits']) && is_array($gameData['dailyBattleLimits']);
        if ($hasSaveDailyBattleLimits) {
            try {
                $insDailyMigrate = $pdo->prepare("
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

                foreach ($gameData['dailyBattleLimits'] as $k1 => $v1) {
                    // パターン1: 日付キー { "YYYY-MM-DD": ["robotId_categoryId_levelId", ...] }
                    if (is_array($v1) && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$k1)) {
                        if ((string)$k1 === $todayDateKey) {
                            foreach ($v1 as $limitItem) {
                                if (is_string($limitItem)) {
                                    $parts = explode('_', $limitItem);
                                    if (count($parts) >= 3) {
                                        $lvlVal = array_pop($parts);
                                        $mId = array_pop($parts);
                                        $rId = implode('_', $parts);
                                        $insDailyMigrate->execute([
                                            ':user_id' => $actualUserId,
                                            ':robot_id' => (string)$rId,
                                            ':minigame_id' => (string)$mId,
                                            ':level' => (string)$lvlVal
                                        ]);
                                        if (!isset($dbDailyCleared[(string)$rId])) $dbDailyCleared[(string)$rId] = [];
                                        if (!isset($dbDailyCleared[(string)$rId][(string)$mId])) $dbDailyCleared[(string)$rId][(string)$mId] = [];
                                        $dbDailyCleared[(string)$rId][(string)$mId][(string)$lvlVal] = true;
                                    }
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
                                        $insDailyMigrate->execute([
                                            ':user_id' => $actualUserId,
                                            ':robot_id' => $rId,
                                            ':minigame_id' => (string)$mId,
                                            ':level' => (string)$lvlKey
                                        ]);
                                        if (!isset($dbDailyCleared[$rId])) $dbDailyCleared[$rId] = [];
                                        if (!isset($dbDailyCleared[$rId][(string)$mId])) $dbDailyCleared[$rId][(string)$mId] = [];
                                        $dbDailyCleared[$rId][(string)$mId][(string)$lvlKey] = true;
                                    }
                                }
                            } elseif ($lvlMap) {
                                $insDailyMigrate->execute([
                                    ':user_id' => $actualUserId,
                                    ':robot_id' => $rId,
                                    ':minigame_id' => (string)$mId,
                                    ':level' => '1'
                                ]);
                                if (!isset($dbDailyCleared[$rId])) $dbDailyCleared[$rId] = [];
                                if (!isset($dbDailyCleared[$rId][(string)$mId])) $dbDailyCleared[$rId][(string)$mId] = [];
                                $dbDailyCleared[$rId][(string)$mId]['1'] = true;
                            }
                        }
                    }
                }
            } catch (Throwable $e) {}
        }
        unset($gameData['dailyBattleLimits']);

        // save_data テーブルに残っているアイテム・宝箱・エレメント・戦闘装備・リバーシ戦術メモリ情報を user_item テーブルへ移行し、save_data から削除
        $hasSaveItemData = isset($gameData['repairKits']) || isset($gameData['unopenedChests']) || isset($gameData['battleElements']);
        $hasSaveBattleItem = isset($gameData['combatEquipments']) || isset($gameData['combatEquipmentRanks']) || isset($gameData['activeCombatEquipments']);
        $hasSaveReversiItem = isset($gameData['othelloPurchasedMemories']) || isset($gameData['othelloEquippedMemories']) || isset($gameData['reversiPurchasedMemories']) || isset($gameData['reversiEquippedMemories']);
        $needsSaveDataClean = $hasSaveDailyBattleLimits || $hasSaveItemData || $hasSaveBattleItem || $hasSaveReversiItem;

        // save_data から移行するバトル装備 JSON の構築
        $migratedBattleItemJson = null;
        if ($hasSaveBattleItem) {
            $migratedBattleItemJson = json_encode([
                'beamSaber' => !empty($gameData['combatEquipments']['beamSaber']),
                'beamShield' => !empty($gameData['combatEquipments']['beamShield']),
                'combatEquipments' => $gameData['combatEquipments'] ?? [],
                'combatEquipmentRanks' => $gameData['combatEquipmentRanks'] ?? [],
                'activeCombatEquipments' => $gameData['activeCombatEquipments'] ?? []
            ], JSON_UNESCAPED_UNICODE);
        }

        // save_data から移行するリバーシ戦術メモリ JSON の構築
        $migratedReversiItemJson = null;
        if ($hasSaveReversiItem) {
            $migratedReversiItemJson = json_encode([
                'purchasedMemories' => $gameData['reversiPurchasedMemories'] ?? $gameData['othelloPurchasedMemories'] ?? [],
                'equippedMemories' => $gameData['reversiEquippedMemories'] ?? $gameData['othelloEquippedMemories'] ?? []
            ], JSON_UNESCAPED_UNICODE);
        }

        if (!$userItemRow) {
            // user_item レコード自体が存在しない場合は、save_data から全アイテムを初期保存
            $rKit = isset($gameData['repairKits']) ? (int)$gameData['repairKits'] : 0;
            $rawChests = (isset($gameData['unopenedChests']) && is_array($gameData['unopenedChests'])) ? $gameData['unopenedChests'] : [];
            $bChest = isset($rawChests['bronze']) ? (int)$rawChests['bronze'] : 0;
            $sChest = isset($rawChests['silver']) ? (int)$rawChests['silver'] : 0;
            $gChest = isset($rawChests['gold']) ? (int)$rawChests['gold'] : 0;
            $mChest = isset($rawChests['mythic']) ? (int)$rawChests['mythic'] : 0;
            $elem = isset($gameData['battleElements']) ? (int)$gameData['battleElements'] : 0;

            try {
                $insItem = $pdo->prepare("
                    INSERT INTO user_item (user_id, repair_kit, bronze_chest, silver_chest, gold_chest, mythic_chest, element, battle_item, reversi_item)
                    VALUES (:user_id, :repair_kit, :bronze_chest, :silver_chest, :gold_chest, :mythic_chest, :element, :battle_item, :reversi_item)
                    ON DUPLICATE KEY UPDATE
                        repair_kit = VALUES(repair_kit),
                        bronze_chest = VALUES(bronze_chest),
                        silver_chest = VALUES(silver_chest),
                        gold_chest = VALUES(gold_chest),
                        mythic_chest = VALUES(mythic_chest),
                        element = VALUES(element),
                        battle_item = COALESCE(user_item.battle_item, VALUES(battle_item)),
                        reversi_item = COALESCE(user_item.reversi_item, VALUES(reversi_item))
                ");
                $insItem->execute([
                    ':user_id' => $actualUserId,
                    ':repair_kit' => $rKit,
                    ':bronze_chest' => $bChest,
                    ':silver_chest' => $sChest,
                    ':gold_chest' => $gChest,
                    ':mythic_chest' => $mChest,
                    ':element' => $elem,
                    ':battle_item' => $migratedBattleItemJson,
                    ':reversi_item' => $migratedReversiItemJson
                ]);
                $userItemRow = [
                    'repair_kit' => $rKit,
                    'bronze_chest' => $bChest,
                    'silver_chest' => $sChest,
                    'gold_chest' => $gChest,
                    'mythic_chest' => $mChest,
                    'element' => $elem,
                    'battle_item' => $migratedBattleItemJson,
                    'reversi_item' => $migratedReversiItemJson
                ];
            } catch (PDOException $e) {}
        } else {
            // user_item レコードが既に存在する場合でも、battle_item または reversi_item が未保存で save_data にある場合は補完保存
            $needsItemUpdate = false;
            $newBattleItem = $userItemRow['battle_item'];
            $newReversiItem = $userItemRow['reversi_item'];

            if (empty($userItemRow['battle_item']) && $migratedBattleItemJson !== null) {
                $newBattleItem = $migratedBattleItemJson;
                $needsItemUpdate = true;
            }
            if (empty($userItemRow['reversi_item']) && $migratedReversiItemJson !== null) {
                $newReversiItem = $migratedReversiItemJson;
                $needsItemUpdate = true;
            }

            if ($needsItemUpdate) {
                try {
                    $updItem = $pdo->prepare("
                        UPDATE user_item 
                        SET battle_item = COALESCE(battle_item, :b_item),
                            reversi_item = COALESCE(reversi_item, :r_item)
                        WHERE user_id = :uid
                    ");
                    $updItem->execute([
                        ':b_item' => $newBattleItem,
                        ':r_item' => $newReversiItem,
                        ':uid' => $actualUserId
                    ]);
                    $userItemRow['battle_item'] = $newBattleItem;
                    $userItemRow['reversi_item'] = $newReversiItem;
                } catch (PDOException $e) {}
            }
        }

        // save_data には保持しないため、キーを確実に削除
        unset($gameData['repairKits']);
        unset($gameData['unopenedChests']);
        unset($gameData['battleElements']);
        unset($gameData['combatEquipments']);
        unset($gameData['combatEquipmentRanks']);
        unset($gameData['activeCombatEquipments']);
        unset($gameData['othelloPurchasedMemories']);
        unset($gameData['othelloEquippedMemories']);
        unset($gameData['reversiPurchasedMemories']);
        unset($gameData['reversiEquippedMemories']);

        // save_data テーブル内の JSON をクリーンアップ更新（battle_item, reversi_item などの重複保存を完全に削除）
        if ($needsSaveDataClean) {
            try {
                $cleanSaveStmt = $pdo->prepare("UPDATE save_data SET game_data = :game_data WHERE user_id = :user_id");
                $cleanSaveStmt->execute([
                    ':game_data' => json_encode($gameData, JSON_UNESCAPED_UNICODE),
                    ':user_id' => $actualUserId
                ]);
            } catch (PDOException $e) {}
        }

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

        // battle_item と reversi_item の復元
        if ($userItemRow && !empty($userItemRow['battle_item'])) {
            $bItemData = is_array($userItemRow['battle_item']) ? $userItemRow['battle_item'] : json_decode($userItemRow['battle_item'], true);
            if (is_array($bItemData)) {
                $gameData['combatEquipments'] = $bItemData['combatEquipments'] ?? [
                    'beamSaber' => !empty($bItemData['beamSaber']),
                    'beamShield' => !empty($bItemData['beamShield'])
                ];
                $gameData['combatEquipmentRanks'] = $bItemData['combatEquipmentRanks'] ?? $bItemData['ranks'] ?? [];
                $gameData['activeCombatEquipments'] = $bItemData['activeCombatEquipments'] ?? $bItemData['active'] ?? [];
            }
        }
        if ($userItemRow && !empty($userItemRow['reversi_item'])) {
            $rItemData = is_array($userItemRow['reversi_item']) ? $userItemRow['reversi_item'] : json_decode($userItemRow['reversi_item'], true);
            if (is_array($rItemData)) {
                $purchased = $rItemData['purchasedMemories'] ?? $rItemData['purchased'] ?? [];
                $equipped = $rItemData['equippedMemories'] ?? $rItemData['equipped'] ?? [];
                $gameData['othelloPurchasedMemories'] = $purchased;
                $gameData['othelloEquippedMemories'] = $equipped;
                $gameData['reversiPurchasedMemories'] = $purchased;
                $gameData['reversiEquippedMemories'] = $equipped;
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
        $gameData['activeRobotDisassembly'] = $activeRobotDisassembly;
        $gameData['currentRequest'] = $currentRequest;
        $gameData['battleElements'] = $userItemRow ? (int)$userItemRow['element'] : $battleElements;
        $gameData['minigameRecords'] = $dbMinigameRecords;
        $gameData['dailyBattleLimits'] = $dbDailyCleared;
        $gameData['repairKits'] = $userItemRow ? (int)$userItemRow['repair_kit'] : 0;
        $gameData['unopenedChests'] = [
            'bronze' => $userItemRow ? (int)$userItemRow['bronze_chest'] : 0,
            'silver' => $userItemRow ? (int)$userItemRow['silver_chest'] : 0,
            'gold' => $userItemRow ? (int)$userItemRow['gold_chest'] : 0,
            'mythic' => $userItemRow ? (int)$userItemRow['mythic_chest'] : 0,
        ];

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
            "activeRobotDisassembly" => $activeRobotDisassembly,
            "currentRequest" => $currentRequest,
            "battleElements" => $userItemRow ? (int)$userItemRow['element'] : $battleElements,
            "minigameRecords" => $dbMinigameRecords,
            "dailyBattleLimits" => $dbDailyCleared,
            "repairKits" => $userItemRow ? (int)$userItemRow['repair_kit'] : 0,
            "unopenedChests" => [
                'bronze' => $userItemRow ? (int)$userItemRow['bronze_chest'] : 0,
                'silver' => $userItemRow ? (int)$userItemRow['silver_chest'] : 0,
                'gold' => $userItemRow ? (int)$userItemRow['gold_chest'] : 0,
                'mythic' => $userItemRow ? (int)$userItemRow['mythic_chest'] : 0,
            ],
            "combatEquipments" => ($userItemRow && !empty($userItemRow['battle_item'])) ? (json_decode($userItemRow['battle_item'], true)['combatEquipments'] ?? ['beamSaber' => false, 'beamShield' => false]) : ['beamSaber' => false, 'beamShield' => false],
            "combatEquipmentRanks" => ($userItemRow && !empty($userItemRow['battle_item'])) ? (json_decode($userItemRow['battle_item'], true)['combatEquipmentRanks'] ?? []) : [],
            "activeCombatEquipments" => ($userItemRow && !empty($userItemRow['battle_item'])) ? (json_decode($userItemRow['battle_item'], true)['activeCombatEquipments'] ?? []) : [],
            "othelloPurchasedMemories" => ($userItemRow && !empty($userItemRow['reversi_item'])) ? (json_decode($userItemRow['reversi_item'], true)['purchasedMemories'] ?? []) : [],
            "othelloEquippedMemories" => ($userItemRow && !empty($userItemRow['reversi_item'])) ? (json_decode($userItemRow['reversi_item'], true)['equippedMemories'] ?? []) : [],
            "reversiPurchasedMemories" => ($userItemRow && !empty($userItemRow['reversi_item'])) ? (json_decode($userItemRow['reversi_item'], true)['purchasedMemories'] ?? []) : [],
            "reversiEquippedMemories" => ($userItemRow && !empty($userItemRow['reversi_item'])) ? (json_decode($userItemRow['reversi_item'], true)['equippedMemories'] ?? []) : []
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
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
