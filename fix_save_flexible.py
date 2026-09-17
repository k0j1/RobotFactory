import re

with open('public/api/save.php', 'r', encoding='utf-8') as f:
    content = f.read()

# パターン: WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time
# 置換対象: WHERE のパラメータ名を変更し、execute の配列に追記する

# 1. complete_part_crafts
content = re.sub(
    r'(WHERE user_id = ):user_id( AND start_time = ):start_time( AND end_time = ):end_time(\s*\)\s*"\);\s*\$stmtCompCraft->execute\(\[\s*\':user_id\' => \$actualUserId,.*?)(        \]\);)',
    lambda m: m.group(1) + ":chk_user_id" + m.group(2) + ":chk_start_time" + m.group(3) + ":chk_end_time" + m.group(4) + 
              ",\n            ':chk_user_id' => $actualUserId,\n            ':chk_start_time' => (int)($compC['startTime'] ?? 0),\n            ':chk_end_time' => (int)($compC['endTime'] ?? 0)\n" + m.group(5),
    content, flags=re.DOTALL
)

# 2. complete_requests (これは deadline がキー)
content = re.sub(
    r'(WHERE user_id = ):user_id( AND request_id = ):request_id( AND deadline = ):deadline(\s*\)\s*"\);\s*\$stmtCompReq->execute\(\[\s*\':user_id\' => \$actualUserId,.*?)(        \]\);)',
    lambda m: m.group(1) + ":chk_user_id" + m.group(2) + ":chk_request_id" + m.group(3) + ":chk_deadline" + m.group(4) + 
              ",\n            ':chk_user_id' => $actualUserId,\n            ':chk_request_id' => $compR['requestId'],\n            ':chk_deadline' => (int)($compR['deadline'] ?? 0)\n" + m.group(5),
    content, flags=re.DOTALL
)

# 3. complete_robot_disassemblies
content = re.sub(
    r'(WHERE user_id = ):user_id( AND start_time = ):start_time( AND end_time = ):end_time(\s*\)\s*"\);\s*\$stmtCompDis->execute\(\[\s*\':user_id\' => \$actualUserId,.*?)(        \]\);)',
    lambda m: m.group(1) + ":chk_user_id" + m.group(2) + ":chk_start_time" + m.group(3) + ":chk_end_time" + m.group(4) + 
              ",\n            ':chk_user_id' => $actualUserId,\n            ':chk_start_time' => (int)($compD['startTime'] ?? 0),\n            ':chk_end_time' => (int)($compD['endTime'] ?? 0)\n" + m.group(5),
    content, flags=re.DOTALL
)

# 4. complete_part_recycles
content = re.sub(
    r'(WHERE user_id = ):user_id( AND start_time = ):start_time( AND end_time = ):end_time(\s*\)\s*"\);\s*\$stmtCompRec->execute\(\[\s*\':user_id\' => \$actualUserId,.*?)(        \]\);)',
    lambda m: m.group(1) + ":chk_user_id" + m.group(2) + ":chk_start_time" + m.group(3) + ":chk_end_time" + m.group(4) + 
              ",\n            ':chk_user_id' => $actualUserId,\n            ':chk_start_time' => (int)($compRec['startTime'] ?? 0),\n            ':chk_end_time' => (int)($compRec['endTime'] ?? 0)\n" + m.group(5),
    content, flags=re.DOTALL
)


with open('public/api/save.php', 'w', encoding='utf-8') as f:
    f.write(content)

