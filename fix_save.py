import re

with open('public/api/save.php', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. complete_expeditions
content = re.sub(
    r'WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            \)\n        "\);\n        \$stmtCompExp->execute\(\[\n            \':user_id\' => \$actualUserId,\n            \':location_id\' => \$compQ\[\'locationId\'\],\n            \':start_time\' => \(int\)\(\$compQ\[\'startTime\'\] \?\? 0\),\n            \':end_time\' => \(int\)\(\$compQ\[\'endTime\'\] \?\? 0\),\n            \':dispatched_robot_id\' => \$compQ\[\'dispatchedRobotId\'\] \?\? null,\n            \':reward_data\' => json_encode\(\$compQ\[\'rewardData\'\] \?\? \[\], JSON_UNESCAPED_UNICODE\)\n        \]\);',
    r'''WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
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
        ]);''',
    content
)

# 2. complete_part_crafts
content = re.sub(
    r'WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            \)\n        "\);\n        \$stmtCompCraft->execute\(\[\n            \':user_id\' => \$actualUserId,\n            \':part_type\' => \$c\[\'partType\'\],\n            \':main_id\' => \$c\[\'mainMaterialId\'\] \?\? \'\',\n            \':sub_id\' => \$c\[\'subMaterialId\'\] \?\? \'\',\n            \':start_time\' => \(int\)\(\$c\[\'startTime\'\] \?\? 0\),\n            \':end_time\' => \(int\)\(\$c\[\'endTime\'\] \?\? 0\),\n            \':result_part_data\' => json_encode\(\$c\[\'resultPart\'\] \?\? \[\], JSON_UNESCAPED_UNICODE\)\n        \]\);',
    r'''WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompCraft->execute([
            ':user_id' => $actualUserId,
            ':part_type' => $c['partType'],
            ':main_id' => $c['mainMaterialId'] ?? '',
            ':sub_id' => $c['subMaterialId'] ?? '',
            ':start_time' => (int)($c['startTime'] ?? 0),
            ':end_time' => (int)($c['endTime'] ?? 0),
            ':result_part_data' => json_encode($c['resultPart'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($c['startTime'] ?? 0),
            ':chk_end_time' => (int)($c['endTime'] ?? 0)
        ]);''',
    content
)

# 3. complete_robot_assemblies
content = re.sub(
    r'WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            \)\n        "\);\n        \$stmtCompAss->execute\(\[\n            \':user_id\' => \$actualUserId,\n            \':start_time\' => \(int\)\(\$compA\[\'startTime\'\] \?\? 0\),\n            \':end_time\' => \(int\)\(\$compA\[\'endTime\'\] \?\? 0\),\n            \':result_robot_data\' => json_encode\(\$compA\[\'resultRobot\'\] \?\? \[\], JSON_UNESCAPED_UNICODE\)\n        \]\);',
    r'''WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompAss->execute([
            ':user_id' => $actualUserId,
            ':start_time' => (int)($compA['startTime'] ?? 0),
            ':end_time' => (int)($compA['endTime'] ?? 0),
            ':result_robot_data' => json_encode($compA['resultRobot'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($compA['startTime'] ?? 0),
            ':chk_end_time' => (int)($compA['endTime'] ?? 0)
        ]);''',
    content
)

# 4. complete_requests
content = re.sub(
    r'WHERE user_id = :user_id AND request_id = :request_id AND deadline = :deadline\n            \)\n        "\);\n        \$stmtCompReq->execute\(\[\n            \':user_id\' => \$actualUserId,\n            \':request_id\' => \$req\[\'id\'\],\n            \':rank\' => \$req\[\'rank\'\] \?\? \'Normal\',\n            \':reward_g\' => \(int\)\(\$req\[\'rewardG\'\] \?\? 0\),\n            \':deadline\' => \(int\)\(\$req\[\'deadline\'\] \?\? 0\),\n            \':delivered_robot_id\' => \$req\[\'deliveredRobotId\'\] \?\? null,\n            \':request_data\' => json_encode\(\$req, JSON_UNESCAPED_UNICODE\)\n        \]\);',
    r'''WHERE user_id = :chk_user_id AND request_id = :chk_request_id AND deadline = :chk_deadline
            )
        ");
        $stmtCompReq->execute([
            ':user_id' => $actualUserId,
            ':request_id' => $req['id'],
            ':rank' => $req['rank'] ?? 'Normal',
            ':reward_g' => (int)($req['rewardG'] ?? 0),
            ':deadline' => (int)($req['deadline'] ?? 0),
            ':delivered_robot_id' => $req['deliveredRobotId'] ?? null,
            ':request_data' => json_encode($req, JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_request_id' => $req['id'],
            ':chk_deadline' => (int)($req['deadline'] ?? 0)
        ]);''',
    content
)

# 5. complete_robot_disassemblies
content = re.sub(
    r'WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            \)\n        "\);\n        \$stmtCompDis->execute\(\[\n            \':user_id\' => \$actualUserId,\n            \':robot_id\' => \$d\[\'robotId\'\] \?\? \'\',\n            \':start_time\' => \(int\)\(\$d\[\'startTime\'\] \?\? 0\),\n            \':end_time\' => \(int\)\(\$d\[\'endTime\'\] \?\? 0\),\n            \':result_parts_data\' => json_encode\(\$d\[\'resultParts\'\] \?\? \[\], JSON_UNESCAPED_UNICODE\)\n        \]\);',
    r'''WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompDis->execute([
            ':user_id' => $actualUserId,
            ':robot_id' => $d['robotId'] ?? '',
            ':start_time' => (int)($d['startTime'] ?? 0),
            ':end_time' => (int)($d['endTime'] ?? 0),
            ':result_parts_data' => json_encode($d['resultParts'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($d['startTime'] ?? 0),
            ':chk_end_time' => (int)($d['endTime'] ?? 0)
        ]);''',
    content
)

# 6. complete_part_recycles
content = re.sub(
    r'WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            \)\n        "\);\n        \$stmtCompRec->execute\(\[\n            \':user_id\' => \$actualUserId,\n            \':part_id\' => \$ar\[\'partId\'\] \?\? \'\',\n            \':start_time\' => \(int\)\(\$ar\[\'startTime\'\] \?\? 0\),\n            \':end_time\' => \(int\)\(\$ar\[\'endTime\'\] \?\? 0\),\n            \':result_materials_data\' => json_encode\(\$ar\[\'resultMaterials\'\] \?\? \[\], JSON_UNESCAPED_UNICODE\)\n        \]\);',
    r'''WHERE user_id = :chk_user_id AND start_time = :chk_start_time AND end_time = :chk_end_time
            )
        ");
        $stmtCompRec->execute([
            ':user_id' => $actualUserId,
            ':part_id' => $ar['partId'] ?? '',
            ':start_time' => (int)($ar['startTime'] ?? 0),
            ':end_time' => (int)($ar['endTime'] ?? 0),
            ':result_materials_data' => json_encode($ar['resultMaterials'] ?? [], JSON_UNESCAPED_UNICODE),
            ':chk_user_id' => $actualUserId,
            ':chk_start_time' => (int)($ar['startTime'] ?? 0),
            ':chk_end_time' => (int)($ar['endTime'] ?? 0)
        ]);''',
    content
)

with open('public/api/save.php', 'w', encoding='utf-8') as f:
    f.write(content)

