const fs = require('fs');
let content = fs.readFileSync('src/core/animations/GSAPRobotAnimator.ts', 'utf-8');

const newAnimations = `
/**
 * 25. バンザイ大歓喜 (Banzai Cheer)
 */
export class BanzaiCheerAnimation extends BaseRobotAnimation {
  id = 'banzai_cheer';
  name = 'バンザイ大歓喜 (Banzai!)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.5;
  loop = true;
  description = '両腕を高く突き上げて「バンザイ！」と全身で喜びを表現。足も元気よくステップします。';
  technicalHighlights = [
    '左右の腕 (ArmLeft/ArmRight) の完全独立バンザイポーズ',
    '左右の足 (LegLeft/LegRight) の独立ステップアニメーション'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, armLeft, armRight, legLeft, legRight, sparkles } = refs;
    
    if (sparkles) tl.to(sparkles, { opacity: 1, duration: 0.3 });

    // バンザイ！
    tl.to(head, { y: -6, rotation: -10, duration: 0.25, ease: 'back.out(2)' }, '<')
      .to(container, { y: -15, duration: 0.25, ease: 'power2.out' }, '<');
    
    if (armLeft) tl.to(armLeft, { rotation: 160, x: -10, y: -20, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (armRight) tl.to(armRight, { rotation: -160, x: 10, y: -20, duration: 0.25, ease: 'back.out(2)' }, '<');
    
    // 足のステップ（右足上げ）
    if (legLeft) tl.to(legLeft, { scaleY: 1.1, duration: 0.25 }, '<');
    if (legRight) tl.to(legRight, { y: -10, rotation: 15, duration: 0.25, ease: 'power2.out' }, '<');

    // 左右に揺れる
    tl.to(head, { rotation: 10, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to(container, { rotation: 5, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<');
      
    if (armLeft) tl.to(armLeft, { rotation: 140, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<');
    if (armRight) tl.to(armRight, { rotation: -140, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<');
    
    // 足のステップ入れ替え
    if (legRight) tl.to(legRight, { y: 0, rotation: 0, duration: 0.2 }, '<0.2');
    if (legLeft) tl.to(legLeft, { y: -10, rotation: -15, duration: 0.2 }, '<0.2');
    if (legLeft) tl.to(legLeft, { y: 0, rotation: 0, duration: 0.2 }, '<0.4');

    // 戻る
    if (sparkles) tl.to(sparkles, { opacity: 0, duration: 0.25 });
    const allTargets = [container, head, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' });
  }
}

/**
 * 26. やった～！大はしゃぎ (Yay Rejoice)
 */
export class YayRejoiceAnimation extends BaseRobotAnimation {
  id = 'yay_rejoice';
  name = 'やった～！大はしゃぎ (Yay!)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.2;
  loop = true;
  description = '腕を前後に振りながらピョンピョン跳ねる、無邪気で可愛らしい喜ぶアクション。';
  technicalHighlights = [
    '左右腕の非対称な前後スイング',
    '左右足の交互ジャンプ (Independent Legs)'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, armLeft, armRight, legLeft, legRight, sparkles } = refs;
    
    if (sparkles) tl.to(sparkles, { opacity: 1, duration: 0.2 });

    tl.to(container, { y: -12, duration: 0.15, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<');
    tl.to(head, { rotation: 10, duration: 0.15, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<');

    if (armLeft) tl.to(armLeft, { rotation: -60, x: -10, y: -10, duration: 0.15, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<');
    if (armRight) tl.to(armRight, { rotation: 60, x: 10, y: -10, duration: 0.15, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<');

    if (legLeft) tl.to(legLeft, { y: -8, rotation: -10, duration: 0.3, yoyo: true, repeat: 2, ease: 'power1.inOut' }, '<');
    if (legRight) tl.to(legRight, { y: -8, rotation: 10, duration: 0.3, yoyo: true, repeat: 2, ease: 'power1.inOut' }, '<0.15');

    if (sparkles) tl.to(sparkles, { opacity: 0, duration: 0.2 });
    const allTargets = [container, head, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, duration: 0.3, ease: 'power2.out' });
  }
}

/**
 * 27. フルバースト・ミサイル (Missile Barrage)
 */
export class MissileBarrageAnimation extends BaseRobotAnimation {
  id = 'missile_barrage';
  name = 'フルバースト・ミサイル (Missile Barrage)';
  category = RobotAnimationCategory.COMBAT;
  duration = 2.2;
  loop = true;
  description = '両腕を大きく広げてハッチを全開にし、全身から無数のミサイルを撃ち放つ大技。';
  technicalHighlights = [
    'ArmLeft/ArmRight の広角展開',
    'LegLeft/LegRight の強固な踏ん張り',
    'コンテナの激しい反動シェイク'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, auraOverlay } = refs;
    
    // 踏ん張り＆展開
    tl.to(container, { y: 5, duration: 0.3, ease: 'power2.out' }, '<')
      .to(head, { y: 2, rotation: -15, duration: 0.3 }, '<');
    
    if (legLeft) tl.to(legLeft, { x: -8, rotation: -15, scaleY: 0.9, duration: 0.3, ease: 'power2.out' }, '<');
    if (legRight) tl.to(legRight, { x: 8, rotation: 15, scaleY: 0.9, duration: 0.3, ease: 'power2.out' }, '<');
    
    if (armLeft) tl.to(armLeft, { rotation: -110, x: -15, y: -5, duration: 0.4, ease: 'back.out(1.5)' }, '<');
    if (armRight) tl.to(armRight, { rotation: 110, x: 15, y: -5, duration: 0.4, ease: 'back.out(1.5)' }, '<');

    if (auraOverlay) tl.to(auraOverlay, { opacity: 0.6, scale: 1.5, duration: 0.4 }, '<');

    // 発射反動（超震動）
    tl.to(container, { x: 'random(-4, 4)', y: 'random(-2, 6)', repeat: 15, duration: 0.05, ease: 'none' }, '+=0.2');
    tl.to(body, { y: 'random(-2, 2)', repeat: 15, duration: 0.05, ease: 'none' }, '<');

    // 撃ち切り後の排熱
    tl.to(container, { x: 0, y: 8, duration: 0.3, ease: 'power2.out' });
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, scale: 2.0, duration: 0.3 }, '<');
    if (head) tl.to(head, { rotation: 20, duration: 0.3 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -130, y: 5, duration: 0.3 }, '<');
    if (armRight) tl.to(armRight, { rotation: 130, y: 5, duration: 0.3 }, '<');

    // 復帰
    const allTargets = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, '+=0.3');
  }
}

/**
 * 28. ツインビーム・シュート (Twin Beam Shoot)
 */
export class TwinBeamShootAnimation extends BaseRobotAnimation {
  id = 'twin_beam_shoot';
  name = 'ツインビーム・シュート (Twin Beam Shoot)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.8;
  loop = true;
  description = '左右の腕を独立して前方に突き出し、時間差で2連装のビームを放つスタイリッシュな射撃。';
  technicalHighlights = [
    '左右腕の非同期射撃アニメーション',
    '射撃ごとの独立したキックバック処理'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, auraOverlay } = refs;
    
    // 構え
    tl.to(container, { y: 2, duration: 0.2 }, '<')
      .to(head, { rotation: 10, duration: 0.2 }, '<');
    
    if (legLeft) tl.to(legLeft, { x: -4, rotation: -5, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { x: 10, rotation: 15, scaleY: 0.9, duration: 0.2 }, '<');
    
    // 左腕で第一射！
    if (armLeft) tl.to(armLeft, { rotation: 80, x: 10, y: -10, duration: 0.15, ease: 'power2.out' });
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0.8, scale: 1.2, duration: 0.1 }, '<');
    tl.to(container, { x: -10, rotation: -5, duration: 0.1, ease: 'power4.out' }); // 反動
    if (armLeft) tl.to(armLeft, { rotation: 100, x: 0, duration: 0.1, ease: 'power2.out' }, '<');
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, scale: 1.5, duration: 0.1 }, '<');
    
    // 右腕で第二射！
    if (armRight) tl.to(armRight, { rotation: 80, x: 10, y: -10, duration: 0.15, ease: 'power2.out' }, '+=0.1');
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0.8, scale: 1.2, duration: 0.1 }, '<');
    tl.to(container, { x: -20, rotation: -10, duration: 0.1, ease: 'power4.out' }); // 反動
    if (armRight) tl.to(armRight, { rotation: 100, x: 0, duration: 0.1, ease: 'power2.out' }, '<');
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, scale: 1.5, duration: 0.1 }, '<');

    // 復帰
    const allTargets = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, '+=0.3');
  }
}
`;

// Insert the new classes before GSAPRobotAnimationRegistry
content = content.replace('export class GSAPRobotAnimationRegistry {', newAnimations + '\nexport class GSAPRobotAnimationRegistry {\n');

// Also register them in GSAPRobotAnimationRegistry
content = content.replace(
  'new NodAgreeAnimation(),',
  'new NodAgreeAnimation(),\n    new BanzaiCheerAnimation(),\n    new YayRejoiceAnimation(),\n    new MissileBarrageAnimation(),\n    new TwinBeamShootAnimation(),'
);

fs.writeFileSync('src/core/animations/GSAPRobotAnimator.ts', content);
