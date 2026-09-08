const fs = require('fs');

let content = fs.readFileSync('src/core/animations/GSAPRobotAnimator.ts', 'utf-8');

// 1. Update CuriousTiltAnimation
content = content.replace(
  `const { container, head } = refs;`,
  `const { container, head, armLeft, armRight, legLeft, legRight } = refs;`
).replace(
  `tl.to(head, { rotation: -26, x: -3, y: -2, duration: 0.3, ease: 'back.out(2)' })`,
  `tl.to(head, { rotation: -26, x: -3, y: -2, duration: 0.3, ease: 'back.out(2)' })\n      if (armLeft) tl.to(armLeft, { rotation: -15, y: -2, duration: 0.3 }, '<')\n      if (armRight) tl.to(armRight, { rotation: 10, y: 2, duration: 0.3 }, '<')`
).replace(
  `tl.to(head, { rotation: 26, x: 3, y: -2, duration: 0.35, ease: 'back.out(2)' });`,
  `tl.to(head, { rotation: 26, x: 3, y: -2, duration: 0.35, ease: 'back.out(2)' });\n    if (armLeft) tl.to(armLeft, { rotation: 15, y: 2, duration: 0.35 }, '<');\n    if (armRight) tl.to(armRight, { rotation: -10, y: -2, duration: 0.35 }, '<');`
);

// 2. Update SpinTornadoAnimation
content = content.replace(
  `const { container, head, arms, armLeft, armRight } = refs;`,
  `const { container, head, arms, armLeft, armRight, legLeft, legRight } = refs;`
).replace(
  `if (armRight) tl.to(armRight, { rotation: 85, scaleX: 1.2, duration: 0.25, ease: 'back.out(2)' }, '<');`,
  `if (armRight) tl.to(armRight, { rotation: 85, scaleX: 1.2, duration: 0.25, ease: 'back.out(2)' }, '<');\n    if (legLeft) tl.to(legLeft, { rotation: -15, y: -4, duration: 0.25 }, '<');\n    if (legRight) tl.to(legRight, { rotation: 15, y: -4, duration: 0.25 }, '<');`
);

// 3. FastRechargeAnimation
content = content.replace(
  `const { container, head, body, arms, armLeft, armRight, auraOverlay, sparkles } = refs;`,
  `const { container, head, body, arms, armLeft, armRight, legLeft, legRight, auraOverlay, sparkles } = refs;`
).replace(
  `if (armRight) tl.to(armRight, { rotation: 25, duration: 0.2 }, '<');`,
  `if (armRight) tl.to(armRight, { rotation: 25, duration: 0.2 }, '<');\n    if (legLeft) tl.to(legLeft, { scaleY: 0.9, duration: 0.2 }, '<');\n    if (legRight) tl.to(legRight, { scaleY: 0.9, duration: 0.2 }, '<');`
);

// 4. PanicTroubledAnimation
content = content.replace(
  `const { container, head, arms, armLeft, armRight } = refs;`,
  `const { container, head, arms, armLeft, armRight, legLeft, legRight } = refs;`
).replace(
  `if (armRight) tl.to(armRight, { rotation: -45, x: -8, y: -14, duration: 0.25, ease: 'power2.out' }, '<');`,
  `if (armRight) tl.to(armRight, { rotation: -45, x: -8, y: -14, duration: 0.25, ease: 'power2.out' }, '<');\n    if (legLeft) tl.to(legLeft, { rotation: -20, x: -4, duration: 0.25 }, '<');\n    if (legRight) tl.to(legRight, { rotation: 20, x: 4, duration: 0.25 }, '<');`
);

// 5. PoliteBowAnimation
content = content.replace(
  `const { container, head, body, arms, armLeft, armRight } = refs;`,
  `const { container, head, body, arms, armLeft, armRight, legLeft, legRight } = refs;`
).replace(
  `if (armRight) tl.to(armRight, { rotation: -10, y: 2, duration: 0.2, ease: 'power1.out' }, '<');`,
  `if (armRight) tl.to(armRight, { rotation: -10, y: 2, duration: 0.2, ease: 'power1.out' }, '<');\n    if (legLeft) tl.to(legLeft, { scaleY: 0.95, duration: 0.2 }, '<');\n    if (legRight) tl.to(legRight, { scaleY: 0.95, duration: 0.2 }, '<');`
);

// 6. ApplauseClapAnimation
content = content.replace(
  `const { head, body, arms, armLeft, armRight } = refs;`,
  `const { head, body, arms, armLeft, armRight, legLeft, legRight } = refs;`
).replace(
  `if (armRight) tl.to(armRight, { rotation: -25, x: -6, y: -6, duration: 0.2, ease: 'power2.out' }, '<');`,
  `if (armRight) tl.to(armRight, { rotation: -25, x: -6, y: -6, duration: 0.2, ease: 'power2.out' }, '<');\n    if (legLeft) tl.to(legLeft, { y: -2, duration: 0.2 }, '<');\n    if (legRight) tl.to(legRight, { y: -2, duration: 0.2 }, '<');`
);

// 7. NodAgreeAnimation
content = content.replace(
  `const { head, arms, armLeft, armRight } = refs;`,
  `const { head, arms, armLeft, armRight, legLeft, legRight } = refs;`
).replace(
  `if (armRight) tl.to(armRight, { y: -4, rotation: 12, duration: 0.2 }, '<');`,
  `if (armRight) tl.to(armRight, { y: -4, rotation: 12, duration: 0.2 }, '<');\n    if (legLeft) tl.to(legLeft, { y: 2, scaleY: 0.9, duration: 0.2 }, '<');\n    if (legRight) tl.to(legRight, { y: 2, scaleY: 0.9, duration: 0.2 }, '<');`
);

// We should also replace standard 'if (arms)' to 'if (!armLeft && !armRight && arms)' in these just in case, but they already use it in the files.

fs.writeFileSync('src/core/animations/GSAPRobotAnimator.ts', content);
