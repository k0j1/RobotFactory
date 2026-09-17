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

// 許可テーブル一覧（ホワイトリスト）
$ALLOWED_TABLES = [
    'users',
    'user_workshop_status',
    'user_material',
    'user_robots',
    'save_data',
    'active_expeditions',
    'active_robot_assemblies',
    'active_requests',
    'complete_requests'
];

$action = $_GET['action'] ?? $_POST['action'] ?? 'get_summary';

try {
    switch ($action) {
        // ---------------------------------------------------------------------
        // 1. サマリー概要 & 全テーブル一覧取得
        // ---------------------------------------------------------------------
        case 'get_summary': {
            $tableStats = [];
            foreach ($ALLOWED_TABLES as $tableName) {
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
                    $tableStats[$tableName] = [
                        'name' => $tableName,
                        'count' => 0,
                        'columns' => [],
                        'error' => 'テーブルが存在しないか取得不可'
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
            } catch (Exception $e) {}

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
            $table = $_GET['table'] ?? $_POST['table'] ?? '';
            if (!in_array($table, $ALLOWED_TABLES, true)) {
                echo json_encode(['success' => false, 'error' => "許可されていないテーブル名です: {$table}"], JSON_UNESCAPED_UNICODE);
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
                'robots' => [],
                'save_data' => null,
                'active_expedition' => null,
                'active_assembly' => null,
                'active_request' => null,
                'complete_requests' => []
            ];

            // 1. users
            $uStmt = $pdo->prepare("SELECT * FROM users WHERE google_id = :uid OR id = :uid2 LIMIT 1");
            $uStmt->execute([':uid' => $userId, ':uid2' => $userId]);
            $result['user'] = $uStmt->fetch() ?: null;
            $gId = $result['user']['google_id'] ?? $userId;

            // 2. user_workshop_status
            $wsStmt = $pdo->prepare("SELECT * FROM user_workshop_status WHERE user_id = :uid OR user_id = :gid LIMIT 1");
            $wsStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['workshop_status'] = $wsStmt->fetch() ?: null;

            // 3. user_material
            $mStmt = $pdo->prepare("SELECT * FROM user_material WHERE user_id = :uid OR user_id = :gid ORDER BY count DESC");
            $mStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['materials'] = $mStmt->fetchAll();

            // 4. user_robots
            $rStmt = $pdo->prepare("SELECT * FROM user_robots WHERE user_id = :uid OR user_id = :gid ORDER BY updated_at DESC");
            $rStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['robots'] = $rStmt->fetchAll();

            // 5. save_data
            $sStmt = $pdo->prepare("SELECT id, user_id, updated_at, LENGTH(game_data) as json_size, game_data FROM save_data WHERE user_id = :uid OR user_id = :gid LIMIT 1");
            $sStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['save_data'] = $sStmt->fetch() ?: null;

            // 6. active_expeditions
            $aeStmt = $pdo->prepare("SELECT * FROM active_expeditions WHERE user_id = :uid OR user_id = :gid");
            $aeStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['active_expedition'] = $aeStmt->fetch() ?: null;

            // 7. active_robot_assemblies
            $aaStmt = $pdo->prepare("SELECT * FROM active_robot_assemblies WHERE user_id = :uid OR user_id = :gid");
            $aaStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['active_assembly'] = $aaStmt->fetch() ?: null;

            // 8. active_requests
            $arStmt = $pdo->prepare("SELECT * FROM active_requests WHERE user_id = :uid OR user_id = :gid");
            $arStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['active_request'] = $arStmt->fetch() ?: null;

            // 9. complete_requests
            $crStmt = $pdo->prepare("SELECT * FROM complete_requests WHERE user_id = :uid OR user_id = :gid ORDER BY created_at DESC LIMIT 50");
            $crStmt->execute([':uid' => $userId, ':gid' => $gId]);
            $result['complete_requests'] = $crStmt->fetchAll();

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
