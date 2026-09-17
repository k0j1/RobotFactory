import re

with open('public/api/save.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Section 6: complete_expeditions
content = re.sub(
    r'INSERT INTO complete_expeditions \((.*?)\)\s*VALUES \((.*?)\)',
    r'INSERT INTO complete_expeditions (\1)\n            SELECT \2\n            WHERE NOT EXISTS (\n                SELECT 1 FROM complete_expeditions\n                WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            )',
    content
)

# Fix Section 7: complete_part_crafts
content = re.sub(
    r'INSERT INTO complete_part_crafts \((.*?)\)\s*VALUES \((.*?)\)',
    r'INSERT INTO complete_part_crafts (\1)\n            SELECT \2\n            WHERE NOT EXISTS (\n                SELECT 1 FROM complete_part_crafts\n                WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            )',
    content
)

# Fix Section 8: complete_robot_assemblies
content = re.sub(
    r'INSERT INTO complete_robot_assemblies \((.*?)\)\s*VALUES \((.*?)\)',
    r'INSERT INTO complete_robot_assemblies (\1)\n            SELECT \2\n            WHERE NOT EXISTS (\n                SELECT 1 FROM complete_robot_assemblies\n                WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            )',
    content
)

# Fix Section 9: complete_requests
content = re.sub(
    r'INSERT INTO complete_requests \((.*?)\)\s*VALUES \((.*?)\)',
    r'INSERT INTO complete_requests (\1)\n            SELECT \2\n            WHERE NOT EXISTS (\n                SELECT 1 FROM complete_requests\n                WHERE user_id = :user_id AND request_id = :request_id AND deadline = :deadline\n            )',
    content
)

# Fix Section 10: complete_robot_disassemblies
content = re.sub(
    r'INSERT INTO complete_robot_disassemblies \((.*?)\)\s*VALUES \((.*?)\)',
    r'INSERT INTO complete_robot_disassemblies (\1)\n            SELECT \2\n            WHERE NOT EXISTS (\n                SELECT 1 FROM complete_robot_disassemblies\n                WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            )',
    content
)

# Fix Section 11: complete_part_recycles
content = re.sub(
    r'INSERT INTO complete_part_recycles \((.*?)\)\s*VALUES \((.*?)\)',
    r'INSERT INTO complete_part_recycles (\1)\n            SELECT \2\n            WHERE NOT EXISTS (\n                SELECT 1 FROM complete_part_recycles\n                WHERE user_id = :user_id AND start_time = :start_time AND end_time = :end_time\n            )',
    content
)

with open('public/api/save.php', 'w', encoding='utf-8') as f:
    f.write(content)

