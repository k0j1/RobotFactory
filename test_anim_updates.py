with open('src/core/animations/GSAPRobotAnimator.ts', 'r') as f:
    content = f.read()

print("File length:", len(content))
print("Contains ShieldBarrierAnimation:", "ShieldBarrierAnimation" in content)
print("Contains MissileBarrageAnimation:", "MissileBarrageAnimation" in content)
print("Contains FlameBladeThrustAnimation:", "FlameBladeThrustAnimation" in content)
print("Contains BeamSaberJudgementAnimation:", "BeamSaberJudgementAnimation" in content)
