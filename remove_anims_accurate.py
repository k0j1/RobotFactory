with open("src/core/animations/GSAPRobotAnimator.ts", "r") as f:
    lines = f.readlines()

target_classes = {
    "SlashComboAnimation",
    "VictoryCheerAnimation",
    "ApplauseClapAnimation",
    "SwordSlashItemAnimation",
    "SaberParryCounterAnimation",
    "IaidoQuickDrawAnimation",
    "DespairKneelAnimation",
    "AngryStompAnimation",
    "FumingCrossArmsAnimation",
    "SobbingTearsAnimation",
    "TantrumWailingAnimation",
    "BouncingHopAnimation",
    "TwoHandedSniperScopeShotAnimation"
}

output_lines = []
skip_class = False
brace_depth = 0
in_target_class = False

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if a target class starts
    is_class_def = False
    for tc in target_classes:
        if f"class {tc} " in line:
            is_class_def = True
            break
            
    if is_class_def:
        in_target_class = True
        brace_depth = line.count("{") - line.count("}")
        # If previous lines in output_lines were comments for this class, remove them
        while output_lines and (output_lines[-1].strip().startswith("/*") or output_lines[-1].strip().startswith("*") or output_lines[-1].strip() == "*/" or output_lines[-1].strip() == "//"):
            output_lines.pop()
        i += 1
        continue

    if in_target_class:
        brace_depth += line.count("{") - line.count("}")
        if brace_depth <= 0:
            in_target_class = False
        i += 1
        continue
        
    # Check if this line is registering any of the target classes
    is_reg = False
    for tc in target_classes:
        if f"new {tc}(" in line or f"register(new {tc}" in line:
            is_reg = True
            break
    if is_reg:
        i += 1
        continue
        
    output_lines.append(line)
    i += 1

with open("src/core/animations/GSAPRobotAnimator.ts", "w") as f:
    f.writelines(output_lines)
print("Removed successfully.")
