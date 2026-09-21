<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// アプリケーションとデータベースの同期用バージョン
define('API_DB_VERSION', 'V1.0');

echo json_encode([
    'success' => true,
    'version' => API_DB_VERSION
]);
