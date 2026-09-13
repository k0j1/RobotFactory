import re

with open('src/core/animations/GSAPRobotAnimator.ts', 'r') as f:
    content = f.read()

classes_to_remove = [
    r'export class AnimSlashCombo extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimCrimsonBlade extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimSaberParryCounter extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimGodspeedIai extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimTwoHandedSnipe extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimVictoryGuts extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimApplauseClap extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimDespairKneeDrop extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimFuriousStomp extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimPuffPuffArmsCrossed extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimSobbingWipeTears extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimWailingFlailing extends GSAPAnimationBase \{.*?\n\}\n',
    r'export class AnimExcitedBounceHop extends GSAPAnimationBase \{.*?\n\}\n'
]

# We also need to remove them from GSAPRobotAnimationRegistry.registerDefaults
# So we can search for `new AnimSlashCombo()`, etc.

instances_to_remove = [
    'AnimSlashCombo',
    'AnimCrimsonBlade',
    'AnimSaberParryCounter',
    'AnimGodspeedIai',
    'AnimTwoHandedSnipe',
    'AnimVictoryGuts',
    'AnimApplauseClap',
    'AnimDespairKneeDrop',
    'AnimFuriousStomp',
    'AnimPuffPuffArmsCrossed',
    'AnimSobbingWipeTears',
    'AnimWailingFlailing',
    'AnimExcitedBounceHop'
]

for cls_pattern in classes_to_remove:
    content = re.sub(cls_pattern, '', content, flags=re.DOTALL)

for inst in instances_to_remove:
    content = re.sub(fr'\s*registry\.register\(new {inst}\(\)\);', '', content)

with open('src/core/animations/GSAPRobotAnimator.ts', 'w') as f:
    f.write(content)
