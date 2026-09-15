<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to get database connection."]);
    exit;
}

try {
    // パーツ基準値マスタデータの定義
    // 各パーツタイプ (head, body, arms, legs) とレアリティ (1〜5) に応じた標準基準値
    $partsMaster = [
        // Head
        ['id' => 'head_r1_standard', 'name' => '標準アイアンヘッド', 'part_type' => 'head', 'attribute' => 'Normal', 'rarity' => 1, 'base_hp' => 25, 'base_power' => 10, 'base_defense' => 20, 'base_agility' => 15, 'base_dexterity' => 20, 'base_int' => 30],
        ['id' => 'head_r2_reinforced', 'name' => '強化ヘッド', 'part_type' => 'head', 'attribute' => 'Normal', 'rarity' => 2, 'base_hp' => 50, 'base_power' => 20, 'base_defense' => 40, 'base_agility' => 30, 'base_dexterity' => 40, 'base_int' => 60],
        ['id' => 'head_r3_rare', 'name' => 'バトルヘッド', 'part_type' => 'head', 'attribute' => 'Normal', 'rarity' => 3, 'base_hp' => 90, 'base_power' => 35, 'base_defense' => 70, 'base_agility' => 55, 'base_dexterity' => 70, 'base_int' => 110],
        ['id' => 'head_r4_epic', 'name' => '重装ヘッド', 'part_type' => 'head', 'attribute' => 'Normal', 'rarity' => 4, 'base_hp' => 150, 'base_power' => 60, 'base_defense' => 120, 'base_agility' => 90, 'base_dexterity' => 110, 'base_int' => 180],
        ['id' => 'head_r5_legendary', 'name' => '神威ヘッド', 'part_type' => 'head', 'attribute' => 'Normal', 'rarity' => 5, 'base_hp' => 250, 'base_power' => 100, 'base_defense' => 200, 'base_agility' => 150, 'base_dexterity' => 180, 'base_int' => 300],

        // Body
        ['id' => 'body_r1_standard', 'name' => '標準アイアンボディ', 'part_type' => 'body', 'attribute' => 'Normal', 'rarity' => 1, 'base_hp' => 80, 'base_power' => 15, 'base_defense' => 40, 'base_agility' => 10, 'base_dexterity' => 15, 'base_int' => 10],
        ['id' => 'body_r2_reinforced', 'name' => '強化ボディ', 'part_type' => 'body', 'attribute' => 'Normal', 'rarity' => 2, 'base_hp' => 160, 'base_power' => 30, 'base_defense' => 80, 'base_agility' => 20, 'base_dexterity' => 30, 'base_int' => 20],
        ['id' => 'body_r3_rare', 'name' => 'バトルボディ', 'part_type' => 'body', 'attribute' => 'Normal', 'rarity' => 3, 'base_hp' => 280, 'base_power' => 55, 'base_defense' => 140, 'base_agility' => 35, 'base_dexterity' => 55, 'base_int' => 35],
        ['id' => 'body_r4_epic', 'name' => '重装ボディ', 'part_type' => 'body', 'attribute' => 'Normal', 'rarity' => 4, 'base_hp' => 450, 'base_power' => 90, 'base_defense' => 230, 'base_agility' => 60, 'base_dexterity' => 90, 'base_int' => 60],
        ['id' => 'body_r5_legendary', 'name' => '神威ボディ', 'part_type' => 'body', 'attribute' => 'Normal', 'rarity' => 5, 'base_hp' => 750, 'base_power' => 150, 'base_defense' => 380, 'base_agility' => 100, 'base_dexterity' => 150, 'base_int' => 100],

        // Arms
        ['id' => 'arms_r1_standard', 'name' => '標準アイアンアーム', 'part_type' => 'arms', 'attribute' => 'Normal', 'rarity' => 1, 'base_hp' => 30, 'base_power' => 30, 'base_defense' => 15, 'base_agility' => 20, 'base_dexterity' => 25, 'base_int' => 10],
        ['id' => 'arms_r2_reinforced', 'name' => '強化アーム', 'part_type' => 'arms', 'attribute' => 'Normal', 'rarity' => 2, 'base_hp' => 60, 'base_power' => 60, 'base_defense' => 30, 'base_agility' => 40, 'base_dexterity' => 50, 'base_int' => 20],
        ['id' => 'arms_r3_rare', 'name' => 'バトルアーム', 'part_type' => 'arms', 'attribute' => 'Normal', 'rarity' => 3, 'base_hp' => 110, 'base_power' => 110, 'base_defense' => 55, 'base_agility' => 70, 'base_dexterity' => 90, 'base_int' => 35],
        ['id' => 'arms_r4_epic', 'name' => '重装アーム', 'part_type' => 'arms', 'attribute' => 'Normal', 'rarity' => 4, 'base_hp' => 180, 'base_power' => 180, 'base_defense' => 90, 'base_agility' => 115, 'base_dexterity' => 145, 'base_int' => 60],
        ['id' => 'arms_r5_legendary', 'name' => '神威アーム', 'part_type' => 'arms', 'attribute' => 'Normal', 'rarity' => 5, 'base_hp' => 300, 'base_power' => 300, 'base_defense' => 150, 'base_agility' => 190, 'base_dexterity' => 240, 'base_int' => 100],

        // Legs
        ['id' => 'legs_r1_standard', 'name' => '標準アイアンレッグ', 'part_type' => 'legs', 'attribute' => 'Normal', 'rarity' => 1, 'base_hp' => 40, 'base_power' => 20, 'base_defense' => 20, 'base_agility' => 40, 'base_dexterity' => 20, 'base_int' => 10],
        ['id' => 'legs_r2_reinforced', 'name' => '強化レッグ', 'part_type' => 'legs', 'attribute' => 'Normal', 'rarity' => 2, 'base_hp' => 80, 'base_power' => 40, 'base_defense' => 40, 'base_agility' => 80, 'base_dexterity' => 40, 'base_int' => 20],
        ['id' => 'legs_r3_rare', 'name' => 'バトルレッグ', 'part_type' => 'legs', 'attribute' => 'Normal', 'rarity' => 3, 'base_hp' => 140, 'base_power' => 70, 'base_defense' => 70, 'base_agility' => 140, 'base_dexterity' => 70, 'base_int' => 35],
        ['id' => 'legs_r4_epic', 'name' => '重装レッグ', 'part_type' => 'legs', 'attribute' => 'Normal', 'rarity' => 4, 'base_hp' => 230, 'base_power' => 115, 'base_defense' => 115, 'base_agility' => 230, 'base_dexterity' => 115, 'base_int' => 60],
        ['id' => 'legs_r5_legendary', 'name' => '神威レッグ', 'part_type' => 'legs', 'attribute' => 'Normal', 'rarity' => 5, 'base_hp' => 380, 'base_power' => 190, 'base_defense' => 190, 'base_agility' => 380, 'base_dexterity' => 190, 'base_int' => 100],
    ];

    $stmt = $pdo->prepare("
        INSERT INTO m_parts_encyclopedia (id, name, part_type, attribute, rarity, base_hp, base_power, base_defense, base_agility, base_dexterity, base_int)
        VALUES (:id, :name, :part_type, :attribute, :rarity, :base_hp, :base_power, :base_defense, :base_agility, :base_dexterity, :base_int)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            part_type = VALUES(part_type),
            attribute = VALUES(attribute),
            rarity = VALUES(rarity),
            base_hp = VALUES(base_hp),
            base_power = VALUES(base_power),
            base_defense = VALUES(base_defense),
            base_agility = VALUES(base_agility),
            base_dexterity = VALUES(base_dexterity),
            base_int = VALUES(base_int)
    ");

    $count = 0;
    foreach ($partsMaster as $part) {
        $stmt->execute([
            ':id' => $part['id'],
            ':name' => $part['name'],
            ':part_type' => $part['part_type'],
            ':attribute' => $part['attribute'],
            ':rarity' => $part['rarity'],
            ':base_hp' => $part['base_hp'],
            ':base_power' => $part['base_power'],
            ':base_defense' => $part['base_defense'],
            ':base_agility' => $part['base_agility'],
            ':base_dexterity' => $part['base_dexterity'],
            ':base_int' => $part['base_int']
        ]);
        $count++;
    }

    echo json_encode([
        "success" => true,
        "message" => "Successfully seeded {$count} parts into m_parts_encyclopedia."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
