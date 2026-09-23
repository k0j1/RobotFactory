<?php
// =============================================================================
// admin_db.php - Google AI Studio専用 データベース確認・管理API
// GitHub ActionsのFTPデプロイによりCoreServerの public_html/api/admin_db.php へ自動配信されます
// =============================================================================

require_once __DIR__ . '/db.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$pdo = getDB();
if (!$pdo) {
    echo json_encode([
        'success' => false,
        'error' => 'データベースへの接続に失敗しました。'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// データベース内の全テーブルを取得（BASE TABLEおよびVIEW）
function getAllDatabaseTables(PDO $pdo): array {
    $tables = [];
    try {
        $stmt = $pdo->query("SHOW FULL TABLES");
        if ($stmt) {
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                if (!empty($row[0])) {
                    $tables[] = strtolower(trim($row[0]));
                }
            }
        }
    } catch (Exception $e) {}

    // スキーマ定義の全既知テーブル（SHOW FULL TABLES で万一取得できなかった場合のフォールバック）
    $knownTables = [
        'users',
        'master_expeditions',
        'user_workshop_status',
        'user_material',
        'user_parts',
        'user_robots',
        'view_user_robots_total_stats',
        'user_save_data',
        'user_item',
        'active_expeditions',
        'active_robot_assemblies',
        'active_requests',
        'active_part_crafts',
        'active_robot_disassemblies',
        'active_part_recycles',
        'completed_robots',
        'complete_deliveries',
        'master_parts',
        'user_minigame_status',
        'stats_minigame_rankings',
        'completed_daily_minigame'
    ];

    $merged = array_unique(array_merge(array_map('strtolower', $knownTables), $tables));
    $validTables = [];
    $excludedTables = [
        'complete_parts',
        'completed_parts',
        'complete_expeditions',
        'complete_part_crafts',
        'complete_part_recycles',
        'complete_requests',
        'complete_robot_assemblies',
        'complete_robot_disassemblies'
    ];
    foreach ($merged as $t) {
        $tClean = strtolower(trim($t));
        if (preg_match('/^[a-z0-9_]+$/', $tClean) && !in_array($tClean, $excludedTables, true)) {
            $validTables[] = $tClean;
        }
    }
    sort($validTables);
    return array_unique($validTables);
}

$action = $_GET['action'] ?? $_POST['action'] ?? 'get_summary';

try {
    switch ($action) {
        // ---------------------------------------------------------------------
        // 1. サマリー概要 & 全テーブル一覧取得
        // ---------------------------------------------------------------------
        case 'get_summary': {
            $allTables = getAllDatabaseTables($pdo);
            $tableStats = [];
            foreach ($allTables as $tableName) {
                try {
                    $cntStmt = $pdo->query("SELECT COUNT(*) FROM `{$tableName}`");
                    $cnt = $cntStmt ? (int)$cntStmt->fetchColumn() : 0;
                    
                    $colStmt = $pdo->query("DESCRIBE `{$tableName}`");
                    $columns = $colStmt ? $colStmt->fetchAll(PDO::FETCH_COLUMN) : [];

                    $tableStats[$tableName] = [
                        'name' => $tableName,
                        'count' => $cnt,
                        'columns' => $columns
                    ];
                } catch (PDOException $e) {
                    // テーブルが未作成等の場合は0件として記録
                    $tableStats[$tableName] = [
                        'name' => $tableName,
                        'count' => 0,
                        'columns' => [],
                        'error' => '未作成またはアクセス不可'
                    ];
                }
            }

            // 主要指標
            $totalUsers = $tableStats['users']['count'] ?? 0;
            $activeExpeditions = $tableStats['active_expeditions']['count'] ?? 0;
            $activeAssemblies = $tableStats['active_robot_assemblies']['count'] ?? 0;
            $activeRequests = $tableStats['active_requests']['count'] ?? 0;
            $completeRequests = $tableStats['complete_requests']['count'] ?? 0;

            $statusMetrics = [
                'total_fame' => 0,
                'total_gold' => 0,
                'total_consumed_gold' => 0,
                'total_delivered_robots' => 0,
                'total_request_earned_gold' => 0
            ];
            try {
                $wsStmt = $pdo->query("
                    SELECT 
                        SUM(fame) as total_fame,
                        SUM(gold) as total_gold,
                        SUM(consumed_gold) as total_consumed_gold,
                        SUM(delivered_count) as total_delivered_robots,
                        SUM(request_earned_gold) as total_request_earned_gold
                    FROM user_workshop_status
                ");
                if ($wsStmt && ($wsRow = $wsStmt->fetch())) {
                    $statusMetrics = [
                        'total_fame' => (int)($wsRow['total_fame'] ?? 0),
                        'total_gold' => (int)($wsRow['total_gold'] ?? 0),
                        'total_consumed_gold' => (int)($wsRow['total_consumed_gold'] ?? 0),
                        'total_delivered_robots' => (int)($wsRow['total_delivered_robots'] ?? 0),
                        'total_request_earned_gold' => (int)($wsRow['total_request_earned_gold'] ?? 0)
                    ];
                }
            } catch (PDOException $e) {}

            echo json_encode([
                'success' => true,
                'summary' => [
                    'total_users' => $totalUsers,
                    'active_expeditions' => $activeExpeditions,
                    'active_assemblies' => $activeAssemblies,
                    'active_requests' => $activeRequests,
                    'complete_requests' => $completeRequests,
                    'metrics' => $statusMetrics
                ],
                'tables' => $tableStats
            ], JSON_UNESCAPED_UNICODE);
            break;
        }

        // ---------------------------------------------------------------------
        // 2. 特定テーブルのレコード一覧取得
        // ---------------------------------------------------------------------
        case 'get_table_data': {
            $table = trim((string)($_GET['table'] ?? $_POST['table'] ?? ''));
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $table)) {
                echo json_encode(['success' => false, 'error' => "無効なテーブル名です: {$table}"], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $allTables = getAllDatabaseTables($pdo);
            if (!in_array($table, $allTables, true)) {
                echo json_encode(['success' => false, 'error' => "データベースに存在しないテーブル名です: {$table}"], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $limit = max(1, min(200, (int)($_GET['limit'] ?? $_POST['limit'] ?? 50)));
            $offset = max(0, (int)($_GET['offset'] ?? $_POST['offset'] ?? 0));
            $search = trim((string)($_GET['search'] ?? $_POST['search'] ?? ''));

            // カラム一覧取得
            $colStmt = $pdo->query("DESCRIBE `{$table}`");
            $colInfo = $colStmt ? $colStmt->fetchAll() : [];
            $columns = array_map(function($c) { return $c['Field']; }, $colInfo);

            $whereSql = "";
            $params = [];
            if ($search !== "") {
                $searchClauses = [];
                foreach ($columns as $c) {
                    $searchClauses[] = "`{$c}` LIKE :search_{$c}";
                    $params[":search_{$c}"] = "%{$search}%";
                }
                if (!empty($searchClauses)) {
                    $whereSql = "WHERE (" . implode(" OR ", $searchClauses) . ")";
                }
            }

            // 件数カウント
            $cntQuery = "SELECT COUNT(*) FROM `{$table}` {$whereSql}";
            $cntStmt = $pdo->prepare($cntQuery);
            $cntStmt->execute($params);
            $totalCount = (int)$cntStmt->fetchColumn();

            // ソート
            $orderBy = $_GET['order_by'] ?? $_POST['order_by'] ?? '';
            $orderDir = strtoupper($_GET['order_dir'] ?? $_POST['order_dir'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';
            $orderSql = "";
            if ($orderBy !== "" && in_array($orderBy, $columns, true)) {
                $orderSql = "ORDER BY `{$orderBy}` {$orderDir}";
            } else {
                // デフォルトソート（created_at / updated_at / id があれば優先）
                if (in_array('updated_at', $columns, true)) {
                    $orderSql = "ORDER BY `updated_at` DESC";
                } elseif (in_array('created_at', $columns, true)) {
                    $orderSql = "ORDER BY `created_at` DESC";
                } elseif (in_array('id', $columns, true)) {
                    $orderSql = "ORDER BY `id` DESC";
                }
            }

            // データ取得
            $dataQuery = "SELECT * FROM `{$table}` {$whereSql} {$orderSql} LIMIT {$limit} OFFSET {$offset}";
            $dataStmt = $pdo->prepare($dataQuery);
            $dataStmt->execute($params);
            $rows = $dataStmt->fetchAll();

            echo json_encode([
                'success' => true,
                'table' => $table,
                'columns' => $colInfo,
                'total_count' => $totalCount,
                'limit' => $limit,
                'offset' => $offset,
                'rows' => $rows
            ], JSON_UNESCAPED_UNICODE);
            break;
        }

        // ---------------------------------------------------------------------
        // 3. レコード削除 (プライマリキー基準で安全に1件削除)
        // ---------------------------------------------------------------------
        case 'delete_record': {
            $table = trim((string)($_POST['table'] ?? ''));
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $table)) {
                echo json_encode(['success' => false, 'error' => "無効なテーブル名です: {$table}"], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $allTables = getAllDatabaseTables($pdo);
            if (!in_array($table, $allTables, true)) {
                echo json_encode(['success' => false, 'error' => "存在しないテーブルです: {$table}"], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $rawKeys = $_POST['primary_keys'] ?? $_POST['keys'] ?? '';
            $keys = is_array($rawKeys) ? $rawKeys : json_decode($rawKeys, true);
            if (empty($keys) || !is_array($keys)) {
                echo json_encode(['success' => false, 'error' => '削除対象を指定するプライマリキー情報が提供されていません。'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            // カラム一覧の取得とキーの妥当性検証
            $colStmt = $pdo->query("DESCRIBE `{$table}`");
            $colInfo = $colStmt ? $colStmt->fetchAll() : [];
            $validColumns = array_map(function($c) { return $c['Field']; }, $colInfo);

            $whereClauses = [];
            $params = [];
            $idx = 0;
            foreach ($keys as $k => $v) {
                if (!in_array($k, $validColumns, true)) {
                    echo json_encode(['success' => false, 'error' => "カラム {$k} はテーブル {$table} に存在しません。"], JSON_UNESCAPED_UNICODE);
                    exit;
                }
                $paramKey = ":del_key_" . $idx;
                if ($v === null) {
                    $whereClauses[] = "`{$k}` IS NULL";
                } else {
                    $whereClauses[] = "`{$k}` = {$paramKey}";
                    $params[$paramKey] = $v;
                }
                $idx++;
            }

            if (empty($whereClauses)) {
                echo json_encode(['success' => false, 'error' => 'WHERE条件が空のため削除を中止しました。'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $whereSql = implode(" AND ", $whereClauses);
            $delSql = "DELETE FROM `{$table}` WHERE {$whereSql} LIMIT 1";

            try {
                $delStmt = $pdo->prepare($delSql);
                $delStmt->execute($params);
                $affected = $delStmt->rowCount();

                if ($affected > 0) {
                    echo json_encode([
                        'success' => true,
                        'deleted_count' => $affected,
                        'message' => "テーブル {$table} から対象レコードを正常に削除しました。"
                    ], JSON_UNESCAPED_UNICODE);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => '指定されたレコードが見つからないか、既に削除されています。'
                    ], JSON_UNESCAPED_UNICODE);
                }
            } catch (PDOException $e) {
                $errCode = $e->getCode();
                $errMsg = $e->getMessage();
                // 外部キー制約エラー (23000 / 1451) の親切なエラーメッセージ
                if (strpos($errMsg, 'foreign key constraint') !== false || $errCode === '23000') {
                    echo json_encode([
                        'success' => false,
                        'error' => "外部キー制約により削除できません。このレコードは他のテーブル（user_robots等）から参照されています。\n詳細: {$errMsg}"
                    ], JSON_UNESCAPED_UNICODE);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => "データベース削除エラー: {$errMsg}"
                    ], JSON_UNESCAPED_UNICODE);
                }
            }
            break;
        }

        // ---------------------------------------------------------------------
        // 2-3. complete_robot_assemblies から user_robots へレコード登録
        // ---------------------------------------------------------------------
        case 'register_robot_from_assembly': {
            $assemblyId = isset($_POST['assembly_id']) ? (int)$_POST['assembly_id'] : 0;
            $targetUserId = trim((string)($_POST['target_user_id'] ?? ''));
            $customRobotId = trim((string)($_POST['robot_id'] ?? ''));
            $customRobotName = trim((string)($_POST['robot_name'] ?? ''));
            $autoEnsureParts = !isset($_POST['auto_ensure_parts']) || $_POST['auto_ensure_parts'] === 'true' || $_POST['auto_ensure_parts'] === '1' || $_POST['auto_ensure_parts'] === 1;
            
            $robotDataRaw = $_POST['robot_data'] ?? null;
            $robot = null;

            if ($assemblyId > 0) {
                $stmtAss = $pdo->prepare("SELECT * FROM complete_robot_assemblies WHERE id = :id LIMIT 1");
                $stmtAss->execute([':id' => $assemblyId]);
                $assRow = $stmtAss->fetch();

                if (!$assRow) {
                    echo json_encode([
                        'success' => false,
                        'error' => "complete_robot_assemblies の該当レコード (ID: {$assemblyId}) が見つかりません。"
                    ], JSON_UNESCAPED_UNICODE);
                    exit;
                }

                if ($targetUserId === '') {
                    $targetUserId = $assRow['user_id'];
                }

                if (!empty($assRow['result_robot_data'])) {
                    $robot = is_string($assRow['result_robot_data']) 
                        ? json_decode($assRow['result_robot_data'], true) 
                        : $assRow['result_robot_data'];
                } elseif (!empty($assRow['robot_id']) || !empty($assRow['robot_name'])) {
                    // 個別カラムからロボットデータを復元
                    $robot = [
                        'id' => $assRow['robot_id'] ?? ('rob_' . time()),
                        'name' => $assRow['robot_name'] ?? '組立ロボット',
                        'parts' => [
                            'head' => !empty($assRow['head_part_id']) ? ['id' => $assRow['head_part_id'], 'type' => 'head', 'name' => 'ヘッド'] : null,
                            'body' => !empty($assRow['body_part_id']) ? ['id' => $assRow['body_part_id'], 'type' => 'body', 'name' => 'ボディ'] : null,
                            'arms' => !empty($assRow['arms_part_id']) ? ['id' => $assRow['arms_part_id'], 'type' => 'arms', 'name' => 'アーム'] : null,
                            'legs' => !empty($assRow['legs_part_id']) ? ['id' => $assRow['legs_part_id'], 'type' => 'legs', 'name' => 'レッグ'] : null,
                        ],
                        'stats' => [
                            'hp' => (int)($assRow['hp'] ?? 0),
                            'power' => (int)($assRow['power'] ?? 0),
                            'defense' => (int)($assRow['defense'] ?? 0),
                            'agility' => (int)($assRow['agility'] ?? 0),
                            'dexterity' => (int)($assRow['dexterity'] ?? 0),
                            'intelligence' => (int)($assRow['intelligence'] ?? 0),
                        ],
                        'currentHp' => isset($assRow['current_hp']) ? (int)$assRow['current_hp'] : 12,
                        'maxHp' => isset($assRow['max_hp']) ? (int)$assRow['max_hp'] : 12,
                        'value' => (int)($assRow['value'] ?? 0),
                        'createdAt' => (int)($assRow['robot_created_at'] ?? $assRow['start_time'] ?? time())
                    ];
                }
            }

            // 直接 robot_data が渡された場合のフォールバック
            if (!$robot && !empty($robotDataRaw)) {
                $robot = is_string($robotDataRaw) ? json_decode($robotDataRaw, true) : $robotDataRaw;
            }

            if (!is_array($robot)) {
                echo json_encode([
                    'success' => false,
                    'error' => '有効なロボットデータ (result_robot_data) を取得できませんでした。'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            if ($targetUserId === '') {
                echo json_encode([
                    'success' => false,
                    'error' => '登録先 user_id が指定されていません。'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            // カスタム設定の反映
            if ($customRobotName !== '') {
                $robot['name'] = $customRobotName;
            }
            if ($customRobotId !== '') {
                $robot['id'] = $customRobotId;
            }
            if (empty($robot['id'])) {
                $robot['id'] = 'robot_' . round(microtime(true) * 1000);
            }
            if (empty($robot['name'])) {
                $robot['name'] = '組立完了ロボット';
            }

            try {
                $pdo->beginTransaction();

                // user_parts 登録不要時（autoEnsureParts=false）の検証: 装備パーツが全て user_parts に存在するかチェック
                if (!$autoEnsureParts && !empty($robot['parts']) && is_array($robot['parts'])) {
                    $stmtCheckPart = $pdo->prepare("SELECT id FROM user_parts WHERE id = :pid LIMIT 1");
                    foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                        if (!empty($robot['parts'][$pKey]) && is_array($robot['parts'][$pKey])) {
                            $pId = trim((string)($robot['parts'][$pKey]['id'] ?? ''));
                            if ($pId === '') {
                                echo json_encode([
                                    'success' => false,
                                    'error' => "パーツ({$pKey}) にIDが割り振られておらず、user_parts に未登録です。user_parts テーブルへの登録が必要です。"
                                ], JSON_UNESCAPED_UNICODE);
                                exit;
                            }
                            $stmtCheckPart->execute([':pid' => $pId]);
                            if (!$stmtCheckPart->fetch()) {
                                echo json_encode([
                                    'success' => false,
                                    'error' => "パーツ({$pKey}: ID {$pId}) が user_parts テーブルに存在しません。user_parts への登録が不要な状態にしてから登録してください。"
                                ], JSON_UNESCAPED_UNICODE);
                                exit;
                            }
                        }
                    }
                }

                // 1. 外部キー制約（fk_head_part 等）を満たすため、装備パーツを user_parts に自動補完（個別カラム対応）
                if ($autoEnsureParts && !empty($robot['parts']) && is_array($robot['parts'])) {
                    $stmtEnsurePart = $pdo->prepare("
                        INSERT INTO user_parts (
                            id, user_id, master_part_id, part_type, name, attribute, rarity, visual_index,
                            is_equipped, vitality, power, defense, agility, dexterity, intelligence,
                            main_material_id, sub_material_id
                        ) VALUES (
                            :id, :user_id, :master_id, :part_type, :name, :attribute, :rarity, :visual_index,
                            1, :vitality, :power, :defense, :agility, :dexterity, :intelligence,
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
                            is_equipped = 1,
                            vitality = VALUES(vitality),
                            power = VALUES(power),
                            defense = VALUES(defense),
                            agility = VALUES(agility),
                            dexterity = VALUES(dexterity),
                            intelligence = VALUES(intelligence),
                            main_material_id = VALUES(main_material_id),
                            sub_material_id = VALUES(sub_material_id)
                    ");

                    foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                        if (!empty($robot['parts'][$pKey]) && is_array($robot['parts'][$pKey])) {
                            $partObj = $robot['parts'][$pKey];
                            if (empty($partObj['id'])) {
                                $partObj['id'] = 'part_' . $pKey . '_' . round(microtime(true) * 1000) . '_' . mt_rand(100, 999);
                                $robot['parts'][$pKey]['id'] = $partObj['id'];
                            }
                            $partId = $partObj['id'];
                            $masterId = $partObj['name'] ?? $partObj['master_id'] ?? $partId;
                            $pType = $partObj['type'] ?? $pKey;
                            $rarity = isset($partObj['rarity']) ? (int)$partObj['rarity'] : 1;
                            $visualIndex = isset($partObj['visualIndex']) ? (int)$partObj['visualIndex'] : 0;
                            $stats = $partObj['stats'] ?? [];

                            $resolveId = function($matId, $pt, $r, $vi) {
                                if (empty($matId)) return null;
                                if (preg_match('/^[hbal][1-3]_\d+$/i', $matId)) return $matId;
                                $prefix = ['head' => 'h', 'body' => 'b', 'arms' => 'a', 'legs' => 'l'][$pt] ?? 'h';
                                return "{$prefix}{$r}_{$vi}";
                            };

                            $rawMain = $partObj['mainMaterialId'] ?? $partObj['main_material_id'] ?? null;
                            $rawSub = $partObj['subMaterialId'] ?? $partObj['sub_material_id'] ?? null;

                            $stmtEnsurePart->execute([
                                ':id' => $partId,
                                ':user_id' => $targetUserId,
                                ':master_id' => $masterId,
                                ':part_type' => $pType,
                                ':name' => $partObj['name'] ?? $masterId,
                                ':attribute' => $partObj['attribute'] ?? 'Fire',
                                ':rarity' => $rarity,
                                ':visual_index' => $visualIndex,
                                ':vitality' => isset($stats['hp']) ? (int)$stats['hp'] : (isset($partObj['vitality']) ? (int)$partObj['vitality'] : (isset($partObj['hp']) ? (int)$partObj['hp'] : 0)),
                                ':power' => isset($stats['power']) ? (int)$stats['power'] : (isset($partObj['power']) ? (int)$partObj['power'] : 0),
                                ':defense' => isset($stats['defense']) ? (int)$stats['defense'] : (isset($partObj['defense']) ? (int)$partObj['defense'] : 0),
                                ':agility' => isset($stats['agility']) ? (int)$stats['agility'] : (isset($partObj['agility']) ? (int)$partObj['agility'] : 0),
                                ':dexterity' => isset($stats['dexterity']) ? (int)$stats['dexterity'] : (isset($partObj['dexterity']) ? (int)$partObj['dexterity'] : 0),
                                ':intelligence' => isset($stats['intelligence']) ? (int)$stats['intelligence'] : (isset($stats['int']) ? (int)$stats['int'] : (isset($partObj['intelligence']) ? (int)$partObj['intelligence'] : 0)),
                                ':main_material_id' => $resolveId($rawMain, $pType, $rarity, $visualIndex),
                                ':sub_material_id' => $resolveId($rawSub, $pType, $rarity, $visualIndex)
                            ]);
                        }
                    }
                }

                // 2. user_robots への挿入・更新
                $headId = !empty($robot['parts']['head']['id']) ? $robot['parts']['head']['id'] : null;
                $bodyId = !empty($robot['parts']['body']['id']) ? $robot['parts']['body']['id'] : null;
                $armsId = !empty($robot['parts']['arms']['id']) ? $robot['parts']['arms']['id'] : null;
                $legsId = !empty($robot['parts']['legs']['id']) ? $robot['parts']['legs']['id'] : null;
                $stats = $robot['stats'] ?? [];

                $stmtRobot = $pdo->prepare("
                    INSERT INTO user_robots (
                        id, user_id, name, head_part_id, body_part_id, arms_part_id, legs_part_id,
                        currentHp, maxHP, battleStats
                    ) VALUES (
                        :id, :user_id, :name, :head_id, :body_id, :arms_id, :legs_id,
                        :current_hp, :max_hp, :battle_stats
                    )
                    ON DUPLICATE KEY UPDATE
                        user_id = VALUES(user_id),
                        name = VALUES(name),
                        head_part_id = VALUES(head_part_id),
                        body_part_id = VALUES(body_part_id),
                        arms_part_id = VALUES(arms_part_id),
                        legs_part_id = VALUES(legs_part_id),
                        currentHp = VALUES(currentHp),
                        maxHP = VALUES(maxHP),
                        battleStats = VALUES(battleStats)
                ");

                $currentHp = isset($robot['currentHp']) ? (int)$robot['currentHp'] : 12;
                $maxHp = isset($robot['maxHp']) ? (int)$robot['maxHp'] : (int)($stats['hp'] ?? 12);
                $battleStats = !empty($robot['battleStats']) && is_array($robot['battleStats'])
                    ? json_encode($robot['battleStats'], JSON_UNESCAPED_UNICODE)
                    : null;

                $stmtRobot->execute([
                    ':id' => $robot['id'],
                    ':user_id' => $targetUserId,
                    ':name' => $robot['name'],
                    ':head_id' => $headId,
                    ':body_id' => $bodyId,
                    ':arms_id' => $armsId,
                    ':legs_id' => $legsId,
                    ':current_hp' => $currentHp,
                    ':max_hp' => $maxHp,
                    ':battle_stats' => $battleStats
                ]);

                // 3. user_save_data テーブル内の robots 配列も同期（存在する場合）
                $sdStmt = $pdo->prepare("SELECT game_data FROM user_save_data WHERE user_id = :uid LIMIT 1");
                $sdStmt->execute([':uid' => $targetUserId]);
                $sdRow = $sdStmt->fetch();
                if ($sdRow && !empty($sdRow['game_data'])) {
                    $gData = json_decode($sdRow['game_data'], true);
                    if (is_array($gData)) {
                        if (!isset($gData['robots']) || !is_array($gData['robots'])) {
                            $gData['robots'] = [];
                        }
                        $replaced = false;
                        foreach ($gData['robots'] as &$r) {
                            if (isset($r['id']) && $r['id'] === $robot['id']) {
                                $r = $robot;
                                $replaced = true;
                                break;
                            }
                        }
                        unset($r);
                        if (!$replaced) {
                            $gData['robots'][] = $robot;
                        }
                        $upd = $pdo->prepare("UPDATE user_save_data SET game_data = :gd WHERE user_id = :uid");
                        $upd->execute([
                            ':gd' => json_encode($gData, JSON_UNESCAPED_UNICODE),
                            ':uid' => $targetUserId
                        ]);
                    }
                }

                $pdo->commit();

                echo json_encode([
                    'success' => true,
                    'message' => "complete_robot_assemblies のデータから user_robots テーブルへロボット「{$robot['name']}」(ID: {$robot['id']}) を正常に登録しました。",
                    'target_user_id' => $targetUserId,
                    'robot_id' => $robot['id'],
                    'robot' => $robot
                ], JSON_UNESCAPED_UNICODE);

            } catch (Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                echo json_encode([
                    'success' => false,
                    'error' => 'user_robots への登録処理中にエラーが発生しました: ' . $e->getMessage()
                ], JSON_UNESCAPED_UNICODE);
            }
            break;
        }

        // ---------------------------------------------------------------------
        // 2-4. ロボット構成パーツの user_parts 登録状態の判定 (必要 / 不要)
        // ---------------------------------------------------------------------
        case 'check_robot_parts_status': {
            $targetUserId = trim((string)($_POST['target_user_id'] ?? $_GET['target_user_id'] ?? ''));
            $robotDataRaw = $_POST['robot_data'] ?? $_GET['robot_data'] ?? null;
            $robot = null;

            if (!empty($robotDataRaw)) {
                $robot = is_string($robotDataRaw) ? json_decode($robotDataRaw, true) : $robotDataRaw;
            }

            if (!is_array($robot) || empty($robot['parts'])) {
                echo json_encode([
                    'success' => true,
                    'requires_registration' => false,
                    'missing_parts_count' => 0,
                    'missing_parts' => [],
                    'parts_status' => [
                        'head' => ['equipped' => false, 'exists' => true, 'name' => '未装着'],
                        'body' => ['equipped' => false, 'exists' => true, 'name' => '未装着'],
                        'arms' => ['equipped' => false, 'exists' => true, 'name' => '未装着'],
                        'legs' => ['equipped' => false, 'exists' => true, 'name' => '未装着']
                    ],
                    'message' => 'パーツが装備されていないため、user_partsへの登録は不要です。'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $partsStatus = [];
            $missingParts = [];
            $stmtCheckPart = $pdo->prepare("SELECT id, user_id, master_part_id FROM user_parts WHERE id = :pid LIMIT 1");

            foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                if (!empty($robot['parts'][$pKey]) && is_array($robot['parts'][$pKey])) {
                    $pObj = $robot['parts'][$pKey];
                    $pId = trim((string)($pObj['id'] ?? ''));
                    $pName = trim((string)($pObj['name'] ?? $pId ?? $pKey));

                    $exists = false;
                    $existingRecord = null;
                    if ($pId !== '') {
                        $stmtCheckPart->execute([':pid' => $pId]);
                        $row = $stmtCheckPart->fetch();
                        if ($row) {
                            $exists = true;
                            $existingRecord = $row;
                        }
                    }

                    $partsStatus[$pKey] = [
                        'equipped' => true,
                        'part_id' => $pId,
                        'name' => $pName,
                        'exists' => $exists,
                        'record' => $existingRecord
                    ];

                    if (!$exists) {
                        $missingParts[] = [
                            'slot' => $pKey,
                            'part_id' => $pId,
                            'name' => $pName,
                            'data' => $pObj
                        ];
                    }
                } else {
                    $partsStatus[$pKey] = [
                        'equipped' => false,
                        'part_id' => null,
                        'name' => '未装着',
                        'exists' => true
                    ];
                }
            }

            $requiresRegistration = count($missingParts) > 0;

            echo json_encode([
                'success' => true,
                'target_user_id' => $targetUserId,
                'requires_registration' => $requiresRegistration,
                'missing_parts_count' => count($missingParts),
                'missing_parts' => $missingParts,
                'parts_status' => $partsStatus,
                'message' => $requiresRegistration
                    ? 'user_partsテーブルへの登録が必要です（未登録パーツが存在します）。'
                    : 'すべての装備パーツが登録済みのため、user_partsへの登録は不要です。'
            ], JSON_UNESCAPED_UNICODE);
            break;
        }

        // ---------------------------------------------------------------------
        // 2-5. ロボット構成パーツを user_parts テーブルへ登録
        // ---------------------------------------------------------------------
        case 'register_parts_to_user_parts': {
            $targetUserId = trim((string)($_POST['target_user_id'] ?? ''));
            $robotDataRaw = $_POST['robot_data'] ?? null;
            $robot = null;

            if (!empty($robotDataRaw)) {
                $robot = is_string($robotDataRaw) ? json_decode($robotDataRaw, true) : $robotDataRaw;
            }

            if (!is_array($robot) || empty($robot['parts'])) {
                echo json_encode(['success' => false, 'error' => '有効なロボットパーツデータが見つかりません。'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            if ($targetUserId === '') {
                echo json_encode(['success' => false, 'error' => '登録先 user_id が指定されていません。'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            try {
                $pdo->beginTransaction();

                $stmtEnsurePart = $pdo->prepare("
                    INSERT INTO user_parts (
                        id, user_id, master_part_id, part_type, name, attribute, rarity, visual_index,
                        is_equipped, vitality, power, defense, agility, dexterity, intelligence,
                        main_material_id, sub_material_id
                    ) VALUES (
                        :id, :user_id, :master_id, :part_type, :name, :attribute, :rarity, :visual_index,
                        1, :vitality, :power, :defense, :agility, :dexterity, :intelligence,
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
                        is_equipped = 1,
                        vitality = VALUES(vitality),
                        power = VALUES(power),
                        defense = VALUES(defense),
                        agility = VALUES(agility),
                        dexterity = VALUES(dexterity),
                        intelligence = VALUES(intelligence),
                        main_material_id = VALUES(main_material_id),
                        sub_material_id = VALUES(sub_material_id)
                ");

                $registered = [];

                foreach (['head', 'body', 'arms', 'legs'] as $pKey) {
                    if (!empty($robot['parts'][$pKey]) && is_array($robot['parts'][$pKey])) {
                        $partObj = $robot['parts'][$pKey];
                        if (empty($partObj['id'])) {
                            $partObj['id'] = 'part_' . $pKey . '_' . round(microtime(true) * 1000) . '_' . mt_rand(100, 999);
                        }
                        $partId = $partObj['id'];
                        $masterId = $partObj['name'] ?? $partObj['master_id'] ?? $partId;
                        $stats = $partObj['stats'] ?? [];

                        $pType = $partObj['type'] ?? $pKey;
                        $rarity = isset($partObj['rarity']) ? (int)$partObj['rarity'] : 1;
                        $visualIndex = isset($partObj['visualIndex']) ? (int)$partObj['visualIndex'] : 0;
                        $rawMain = $partObj['mainMaterialId'] ?? $partObj['main_material_id'] ?? null;
                        $rawSub = $partObj['subMaterialId'] ?? $partObj['sub_material_id'] ?? null;

                        $stmtEnsurePart->execute([
                            ':id' => $partId,
                            ':user_id' => $targetUserId,
                            ':master_id' => $masterId,
                            ':part_type' => $pType,
                            ':name' => $partObj['name'] ?? $masterId,
                            ':attribute' => $partObj['attribute'] ?? 'Fire',
                            ':rarity' => $rarity,
                            ':visual_index' => $visualIndex,
                            ':vitality' => isset($stats['hp']) ? (int)$stats['hp'] : (isset($partObj['vitality']) ? (int)$partObj['vitality'] : (isset($partObj['hp']) ? (int)$partObj['hp'] : 0)),
                            ':power' => isset($stats['power']) ? (int)$stats['power'] : (isset($partObj['power']) ? (int)$partObj['power'] : 0),
                            ':defense' => isset($stats['defense']) ? (int)$stats['defense'] : (isset($partObj['defense']) ? (int)$partObj['defense'] : 0),
                            ':agility' => isset($stats['agility']) ? (int)$stats['agility'] : (isset($partObj['agility']) ? (int)$partObj['agility'] : 0),
                            ':dexterity' => isset($stats['dexterity']) ? (int)$stats['dexterity'] : (isset($partObj['dexterity']) ? (int)$partObj['dexterity'] : 0),
                            ':intelligence' => isset($stats['intelligence']) ? (int)$stats['intelligence'] : (isset($stats['int']) ? (int)$stats['int'] : (isset($partObj['intelligence']) ? (int)$partObj['intelligence'] : 0)),
                            ':main_material_id' => $resolveId($rawMain, $pType, $rarity, $visualIndex),
                            ':sub_material_id' => $resolveId($rawSub, $pType, $rarity, $visualIndex)
                        ]);

                        $registered[] = [
                            'slot' => $pKey,
                            'id' => $partId,
                            'name' => $masterId
                        ];
                    }
                }

                $pdo->commit();

                echo json_encode([
                    'success' => true,
                    'message' => 'パーツを user_parts テーブルへ正常に登録しました。',
                    'registered_count' => count($registered),
                    'registered' => $registered
                ], JSON_UNESCAPED_UNICODE);
            } catch (Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                echo json_encode(['success' => false, 'error' => 'user_parts への登録エラー: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
            }
            break;
        }

        // ---------------------------------------------------------------------
        // 3. ユーザー横断照会
        // ---------------------------------------------------------------------
        case 'get_user_full_data': {
            $userId = trim((string)($_GET['user_id'] ?? $_POST['user_id'] ?? ''));
            if ($userId === '') {
                echo json_encode(['success' => false, 'error' => 'user_id が指定されていません。'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $result = [
                'user' => null,
                'workshop_status' => null,
                'materials' => [],
                'parts' => [],
                'robots' => [],
                'user_save_data' => null,
                'active_expedition' => null,
                'active_expeditions' => [],
                'active_assembly' => null,
                'active_disassembly' => null,
                'active_request' => null,
                'complete_requests' => []
            ];

            // 1. users テーブルからユーザープロフィールの特定（google_id, id, email, name すべてでマッチング）
            $uStmt = $pdo->prepare("SELECT id, google_id, email, name, picture, created_at, updated_at FROM users WHERE google_id = :uid OR id = :uid2 OR email = :uid3 OR name = :uid4 LIMIT 1");
            $uStmt->execute([':uid' => $userId, ':uid2' => $userId, ':uid3' => $userId, ':uid4' => $userId]);
            $foundUser = $uStmt->fetch(PDO::FETCH_ASSOC);

            // 直接マッチしなかった場合、他テーブル（workshop_status, user_save_data等）のuser_idからusersテーブルを逆引き
            if (!$foundUser) {
                $revStmt = $pdo->prepare("
                    SELECT u.id, u.google_id, u.email, u.name, u.picture, u.created_at, u.updated_at 
                    FROM users u
                    WHERE u.google_id IN (
                        SELECT user_id FROM user_workshop_status WHERE user_id = :uid1
                        UNION
                        SELECT user_id FROM user_save_data WHERE user_id = :uid2
                    )
                    LIMIT 1
                ");
                $revStmt->execute([':uid1' => $userId, ':uid2' => $userId]);
                $foundUser = $revStmt->fetch(PDO::FETCH_ASSOC);
            }

            $result['user'] = $foundUser ?: null;

            // 照合用IDリスト（google_id, id, 入力値など）を網羅的に収集
            $candidateIds = array_values(array_unique(array_filter([
                $userId,
                $result['user']['google_id'] ?? null,
                isset($result['user']['id']) ? (string)$result['user']['id'] : null
            ])));

            $inPlaceholders = implode(',', array_fill(0, count($candidateIds), '?'));

            // 2. user_workshop_status
            $wsStmt = $pdo->prepare("SELECT * FROM user_workshop_status WHERE user_id IN ($inPlaceholders) LIMIT 1");
            $wsStmt->execute($candidateIds);
            $result['workshop_status'] = $wsStmt->fetch() ?: null;

            // 3. user_material
            $mStmt = $pdo->prepare("SELECT * FROM user_material WHERE user_id IN ($inPlaceholders) ORDER BY count DESC");
            $mStmt->execute($candidateIds);
            $result['materials'] = $mStmt->fetchAll();

            // 4. user_parts (所持パーツ一覧 - 個別カラムを含む全データを取得)
            $pStmt = $pdo->prepare("SELECT * FROM user_parts WHERE user_id IN ($inPlaceholders) ORDER BY is_equipped DESC, created_at DESC");
            $pStmt->execute($candidateIds);
            $result['parts'] = $pStmt->fetchAll();

            // 5. user_robots
            $rStmt = $pdo->prepare("SELECT * FROM user_robots WHERE user_id IN ($inPlaceholders) ORDER BY created_at DESC");
            $rStmt->execute($candidateIds);
            $result['robots'] = $rStmt->fetchAll();

            // 6. user_save_data
            $sStmt = $pdo->prepare("SELECT id, user_id, updated_at, LENGTH(game_data) as json_size, game_data FROM user_save_data WHERE user_id IN ($inPlaceholders) LIMIT 1");
            $sStmt->execute($candidateIds);
            $sData = $sStmt->fetch() ?: null;
            $result['user_save_data'] = $sData;
            $result['save_data'] = $sData; // 後方互換用キー補完

            // 7. active_expeditions
            $aeStmt = $pdo->prepare("SELECT * FROM active_expeditions WHERE user_id IN ($inPlaceholders) ORDER BY id DESC");
            $aeStmt->execute($candidateIds);
            $expList = $aeStmt->fetchAll();
            $result['active_expeditions'] = $expList;
            $result['active_expedition'] = !empty($expList) ? $expList[0] : null;

            // 8. active_robot_assemblies
            $aaStmt = $pdo->prepare("SELECT * FROM active_robot_assemblies WHERE user_id IN ($inPlaceholders) ORDER BY created_at DESC, start_time DESC");
            $aaStmt->execute($candidateIds);
            $assItem = $aaStmt->fetch() ?: null;
            if ($assItem) {
                // UI表示用プロパティの補完
                if (empty($assItem['robot_id']) && !empty($assItem['result_robot_data'])) {
                    $parsed = is_string($assItem['result_robot_data']) ? json_decode($assItem['result_robot_data'], true) : $assItem['result_robot_data'];
                    if (is_array($parsed)) {
                        $assItem['robot_id'] = $parsed['id'] ?? null;
                        $assItem['robot_name'] = $parsed['name'] ?? null;
                    }
                }
            }
            $result['active_assembly'] = $assItem;

            // 8-2. active_robot_disassemblies
            $adStmt = $pdo->prepare("SELECT * FROM active_robot_disassemblies WHERE user_id IN ($inPlaceholders) ORDER BY created_at DESC, start_time DESC LIMIT 1");
            $adStmt->execute($candidateIds);
            $disItem = $adStmt->fetch() ?: null;
            $result['active_disassembly'] = $disItem;

            // 9. active_requests
            $arStmt = $pdo->prepare("SELECT * FROM active_requests WHERE user_id IN ($inPlaceholders) LIMIT 1");
            $arStmt->execute($candidateIds);
            $arRow = $arStmt->fetch();
            if ($arRow) {
                if (!empty($arRow['request_data'])) {
                    $parsed = is_string($arRow['request_data']) ? json_decode($arRow['request_data'], true) : $arRow['request_data'];
                    if (is_array($parsed)) {
                        $arRow['client_name'] = $parsed['clientName'] ?? ($parsed['client_name'] ?? null);
                        $arRow['description'] = $parsed['description'] ?? null;
                        $arRow['requirements'] = $parsed['requirements'] ?? null;
                    }
                }
            }
            $result['active_request'] = $arRow ?: null;

            // 10. complete_requests
            $crStmt = $pdo->prepare("SELECT * FROM complete_requests WHERE user_id IN ($inPlaceholders) ORDER BY created_at DESC LIMIT 50");
            $crStmt->execute($candidateIds);
            $result['complete_requests'] = $crStmt->fetchAll();

            // 11. user_minigame_status
            $msStmt = $pdo->prepare("SELECT * FROM user_minigame_status WHERE user_id IN ($inPlaceholders) ORDER BY minigame_id ASC");
            $msStmt->execute($candidateIds);
            $result['minigame_status'] = $msStmt->fetchAll();

            // 12. user_item
            $uiStmt = $pdo->prepare("SELECT * FROM user_item WHERE user_id IN ($inPlaceholders) LIMIT 1");
            $uiStmt->execute($candidateIds);
            $result['user_item'] = $uiStmt->fetch() ?: null;

            // 13. completed_daily_minigame
            try {
                $dcmStmt = $pdo->prepare("SELECT * FROM completed_daily_minigame WHERE user_id IN ($inPlaceholders) ORDER BY created_at DESC");
                $dcmStmt->execute($candidateIds);
                $dcmList = $dcmStmt->fetchAll();
                $result['completed_daily_minigame'] = $dcmList;
                $result['daily_cleared_minigame'] = $dcmList; // 後方互換用キー補完
            } catch (Throwable $e) {
                $result['completed_daily_minigame'] = [];
                $result['daily_cleared_minigame'] = [];
            }

            echo json_encode([
                'success' => true,
                'target_user_id' => $userId,
                'data' => $result
            ], JSON_UNESCAPED_UNICODE);
            break;
        }

        // ---------------------------------------------------------------------
        // 4. 読取専用クエリ実行 (SELECT文のみ)
        // ---------------------------------------------------------------------
        case 'execute_query': {
            $rawQuery = trim((string)($_POST['query'] ?? $_GET['query'] ?? ''));
            if ($rawQuery === '') {
                echo json_encode(['success' => false, 'error' => 'クエリが入力されていません。'], JSON_UNESCAPED_UNICODE);
                exit;
            }

            // 安全制限: SELECT / SHOW / DESCRIBE のみ許可
            if (!preg_match('/^\s*(SELECT|SHOW|DESCRIBE|EXPLAIN)\s+/i', $rawQuery)) {
                echo json_encode([
                    'success' => false,
                    'error' => '安全のため SELECT, SHOW, DESCRIBE, EXPLAIN 文のみ実行可能です。'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $stmt = $pdo->query($rawQuery);
            $rows = $stmt ? $stmt->fetchAll() : [];
            $colCount = $stmt ? $stmt->columnCount() : 0;

            echo json_encode([
                'success' => true,
                'query' => $rawQuery,
                'column_count' => $colCount,
                'row_count' => count($rows),
                'rows' => $rows
            ], JSON_UNESCAPED_UNICODE);
            break;
        }

        default:
            echo json_encode(['success' => false, 'error' => "未知のアクションです: {$action}"], JSON_UNESCAPED_UNICODE);
            break;
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
