import re
import glob

replacements = {
    'GiHammer ': 'GiHammerDrop ',
    'GiLightningFlashes ': 'GiLightningTrio ',
    'GiPushpin ': 'GiPin ',
    'GiClipboard ': 'GiChecklist ',
    'GiDash ': 'GiSprint ',
    'GiSwords ': 'GiBroadsword ',
    'GiSkull ': 'GiCrossbone ',
    '<Gi.GiHammer ': '<Gi.GiHammerDrop ',
    '<Gi.GiLightningFlashes ': '<Gi.GiLightningTrio ',
    '<Gi.GiPushpin ': '<Gi.GiPin ',
    '<Gi.GiClipboard ': '<Gi.GiChecklist ',
    '<Gi.GiDash ': '<Gi.GiSprint ',
    '<Gi.GiSwords ': '<Gi.GiBroadsword ',
    '<Gi.GiSkull ': '<Gi.GiCrossbone '
}

files = glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)

    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed bad icons in {file}")

