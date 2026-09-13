import re

with open('src/core/animations/GSAPRobotAnimator.ts', 'r') as f:
    content = f.read()

# I will find the class declarations by matching "export class " and searching for their names, then deleting until the next "export class " or end of file.
names_to_delete = [
    'AnimSlashCombo',
    'AnimFlameSword',
    'AnimParryRiposte',
    'AnimIaido',
    'AnimSniperShot',
    'AnimVictoryCheer',
    'AnimApplause',
    'AnimDespairSlump',
    'AnimAngryStomp',
    'AnimFumingPout',
    'AnimSobbingTears',
    'AnimTantrumCry',
    'AnimBouncingHop',
]

for name in names_to_delete:
    pattern = fr'(\/\*\*?[^\/]*?\*\/[\s\n]*)?export class {name} extends GSAPAnimationBase.*?((?=\n\/\*\*?[^\/]*?\*\/[\s\n]*export class |\nexport class )|$)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)

for name in names_to_delete:
    content = re.sub(fr'\s*registry\.register\(new {name}\(\)\);', '', content)

with open('src/core/animations/GSAPRobotAnimator.ts', 'w') as f:
    f.write(content)
