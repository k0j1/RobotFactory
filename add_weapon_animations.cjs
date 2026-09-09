const fs = require('fs');

let content = fs.readFileSync('src/core/animations/GSAPRobotAnimator.ts', 'utf-8');

const newAnimations = `
/**
 * 29. 武器使用：ブレード・スラッシュ (Sword Slash)
 */
export class SwordSlashAnimation extends BaseRobotAnimation {
  id = 'sword_slash_item';
  name = 'ブレード・スラッシュ (Sword Equip)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.4;
  loop = true;
  description = 'プラズマブレードを取り出し、強烈な袈裟斬りを放つ武器アニメーション。';
  technicalHighlights = [
    'fxContainer への動的SVG（プラズマブレード）の生成と破棄',
    '腕の動きに同期させたブレードの回転と軌跡エフェクト'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, fxContainer, auraOverlay } = refs;
    
    // 動的に剣(SVG)を生成
    let swordEl: HTMLDivElement | null = null;
    let slashEffect: HTMLDivElement | null = null;

    if (fxContainer && typeof document !== 'undefined') {
      swordEl = document.createElement('div');
      swordEl.className = 'absolute w-32 h-32 pointer-events-none drop-shadow-[0_0_8px_#3b82f6]';
      swordEl.style.top = '10%'; // Adjust to arm height
      swordEl.style.left = '65%';
      swordEl.style.transformOrigin = '10% 90%'; // Handle at bottom-left
      swordEl.innerHTML = \`<svg viewBox="0 0 100 100" class="w-full h-full text-blue-400 fill-current"><path d="M10,90 L20,95 L90,20 L95,10 L80,10 L10,80 Z"/></svg>\`;
      swordEl.style.opacity = '0';
      fxContainer.appendChild(swordEl);

      slashEffect = document.createElement('div');
      slashEffect.className = 'absolute w-48 h-48 pointer-events-none blur-sm opacity-0';
      slashEffect.style.top = '-20%';
      slashEffect.style.left = '20%';
      slashEffect.innerHTML = \`<svg viewBox="0 0 100 100" class="w-full h-full text-blue-200 fill-current"><path d="M10,90 Q50,0 90,90 Q50,40 10,90 Z"/></svg>\`;
      fxContainer.appendChild(slashEffect);
    }

    // クリーンアップ用コールバック
    tl.eventCallback('onComplete', () => {
      if (swordEl && swordEl.parentNode) swordEl.parentNode.removeChild(swordEl);
      if (slashEffect && slashEffect.parentNode) slashEffect.parentNode.removeChild(slashEffect);
    });

    // 初期ポーズ・剣を構える
    tl.to(container, { y: 2, duration: 0.2 }, '<')
      .to(head, { rotation: 10, x: 2, duration: 0.2 }, '<');
    
    if (legLeft) tl.to(legLeft, { x: -4, rotation: -10, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { x: 4, rotation: 10, duration: 0.2 }, '<');
    
    if (armLeft) tl.to(armLeft, { rotation: -30, x: -5, duration: 0.2 }, '<');
    if (armRight) tl.to(armRight, { rotation: -40, x: -10, y: -10, duration: 0.3, ease: 'power2.out' }, '<');
    
    if (swordEl) {
      tl.to(swordEl, { opacity: 1, rotation: -45, duration: 0.3, ease: 'power2.out' }, '<');
    }

    // 斬撃タメ
    tl.to(body, { rotation: -10, duration: 0.2 }, '+=0.1');
    if (armRight) tl.to(armRight, { rotation: -60, x: -15, y: -15, duration: 0.2 }, '<');
    if (swordEl) tl.to(swordEl, { rotation: -60, x: -5, duration: 0.2 }, '<');

    // 斬撃一閃！
    if (armRight) tl.to(armRight, { rotation: 90, x: 20, y: 10, duration: 0.15, ease: 'power4.out' });
    if (swordEl) tl.to(swordEl, { rotation: 90, x: 20, y: 10, duration: 0.15, ease: 'power4.out' }, '<');
    
    if (slashEffect) {
      tl.to(slashEffect, { opacity: 0.8, scale: 1.2, rotation: 15, duration: 0.1 }, '<');
      tl.to(slashEffect, { opacity: 0, scale: 1.5, duration: 0.2 }, '>');
    }
    
    tl.to(container, { x: 15, rotation: 5, duration: 0.15, ease: 'power2.out' }, '<'); // 踏み込み
    if (head) tl.to(head, { rotation: -10, duration: 0.15 }, '<');

    // 残心と武器収納
    tl.to({}, { duration: 0.3 }); // pause
    if (swordEl) tl.to(swordEl, { opacity: 0, duration: 0.2 }, '>');
    
    // 復帰
    const allTargets = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' });
  }
}

/**
 * 30. 武器使用：エネルギーシールド (Energy Shield)
 */
export class ShieldBlockAnimation extends BaseRobotAnimation {
  id = 'shield_block_item';
  name = 'エネルギーシールド防御 (Shield Block)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.5;
  loop = true;
  description = '左腕から硬質光のエネルギーシールドを展開し、敵の強烈な攻撃をガード。';
  technicalHighlights = [
    '動的SVGによる六角形ハニカムシールドの生成',
    '被弾時の弾性反動と衝撃波エフェクト'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, fxContainer } = refs;
    
    let shieldEl: HTMLDivElement | null = null;
    let impactEl: HTMLDivElement | null = null;

    if (fxContainer && typeof document !== 'undefined') {
      shieldEl = document.createElement('div');
      shieldEl.className = 'absolute w-32 h-40 pointer-events-none drop-shadow-[0_0_12px_#2dd4bf]';
      shieldEl.style.top = '30%'; 
      shieldEl.style.left = '-10%';
      shieldEl.style.transformOrigin = 'center';
      shieldEl.innerHTML = \`<svg viewBox="0 0 100 120" class="w-full h-full text-teal-400/80 fill-current"><polygon points="50,5 95,25 95,85 50,115 5,85 5,25" stroke="currentColor" stroke-width="4"/></svg>\`;
      shieldEl.style.opacity = '0';
      shieldEl.style.transform = 'scale(0.5)';
      fxContainer.appendChild(shieldEl);

      impactEl = document.createElement('div');
      impactEl.className = 'absolute w-32 h-32 pointer-events-none rounded-full border-4 border-yellow-300 opacity-0';
      impactEl.style.top = '35%';
      impactEl.style.left = '-15%';
      fxContainer.appendChild(impactEl);
    }

    tl.eventCallback('onComplete', () => {
      if (shieldEl && shieldEl.parentNode) shieldEl.parentNode.removeChild(shieldEl);
      if (impactEl && impactEl.parentNode) impactEl.parentNode.removeChild(impactEl);
    });

    // 防御構え
    tl.to(container, { y: 4, duration: 0.2 }, '<')
      .to(body, { rotation: 10, duration: 0.2 }, '<')
      .to(head, { rotation: -15, x: -2, duration: 0.2 }, '<');
    
    if (legLeft) tl.to(legLeft, { x: -8, rotation: -10, scaleY: 0.9, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { x: 10, rotation: 15, scaleY: 0.9, duration: 0.2 }, '<');
    
    if (armLeft) tl.to(armLeft, { rotation: -50, x: -10, y: -10, duration: 0.2, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: -20, x: -5, duration: 0.2 }, '<');

    // シールド展開
    if (shieldEl) {
      tl.to(shieldEl, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, '-=0.1');
    }

    // 被弾！
    tl.to(container, { x: 10, rotation: 5, duration: 0.05, ease: 'power4.out' }, '+=0.3');
    if (impactEl) {
      tl.to(impactEl, { opacity: 0.8, scale: 1.5, duration: 0.1 }, '<');
      tl.to(impactEl, { opacity: 0, scale: 2.0, duration: 0.15 }, '>');
    }
    
    // ガード踏ん張り（揺り戻し）
    tl.to(container, { x: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' }, '+=0.05');

    // シールド解除
    if (shieldEl) {
      tl.to(shieldEl, { opacity: 0, scale: 0.5, duration: 0.2 }, '+=0.1');
    }
    
    // 復帰
    const allTargets = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.3, ease: 'power2.inOut' }, '>');
  }
}

/**
 * 31. 武器使用：ミサイル発射 (Missile Fire)
 */
export class MissileFireAnimation extends BaseRobotAnimation {
  id = 'missile_fire_item';
  name = 'スマートミサイル発射 (Missile Launch)';
  category = RobotAnimationCategory.COMBAT;
  duration = 2.0;
  loop = true;
  description = '背中または肩からスマートミサイルを射出！ミサイルが弧を描いて飛んでいきます。';
  technicalHighlights = [
    '動的SVGによるミサイルオブジェクトの生成',
    'GSAPモーションパス風の曲線軌道アニメーション'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, fxContainer } = refs;
    
    let missileEl: HTMLDivElement | null = null;
    let smokeEl: HTMLDivElement | null = null;

    if (fxContainer && typeof document !== 'undefined') {
      missileEl = document.createElement('div');
      missileEl.className = 'absolute w-12 h-6 pointer-events-none drop-shadow-[0_0_6px_#ef4444]';
      missileEl.style.top = '10%'; 
      missileEl.style.left = '40%';
      missileEl.style.opacity = '0';
      missileEl.innerHTML = \`<svg viewBox="0 0 100 40" class="w-full h-full text-red-500 fill-current"><path d="M0,15 L20,10 L80,10 L100,20 L80,30 L20,30 L0,25 Z"/></svg>\`;
      fxContainer.appendChild(missileEl);

      smokeEl = document.createElement('div');
      smokeEl.className = 'absolute w-16 h-16 pointer-events-none rounded-full bg-stone-300 blur-md opacity-0';
      smokeEl.style.top = '5%';
      smokeEl.style.left = '35%';
      fxContainer.appendChild(smokeEl);
    }

    tl.eventCallback('onComplete', () => {
      if (missileEl && missileEl.parentNode) missileEl.parentNode.removeChild(missileEl);
      if (smokeEl && smokeEl.parentNode) smokeEl.parentNode.removeChild(smokeEl);
    });

    // 発射体勢
    tl.to(body, { y: 4, duration: 0.3, ease: 'power2.inOut' })
      .to(head, { rotation: -10, duration: 0.3 }, '<')
      .to(container, { rotation: 5, duration: 0.3 }, '<');
      
    if (legLeft) tl.to(legLeft, { scaleY: 0.9, x: -5, duration: 0.3 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.9, x: 5, duration: 0.3 }, '<');
    
    if (armLeft) tl.to(armLeft, { rotation: 20, x: -5, duration: 0.3 }, '<');
    if (armRight) tl.to(armRight, { rotation: 20, x: 5, duration: 0.3 }, '<');

    // ミサイル発射！
    tl.to(container, { y: 8, duration: 0.1, ease: 'power4.out' }, '+=0.2');
    
    if (missileEl) {
      tl.to(missileEl, { opacity: 1, duration: 0.05 }, '<');
      // 曲線軌道をシミュレート: xは一定速度、yは上に上がってから下がる、rotationはそれに合わせる
      tl.to(missileEl, { x: 300, duration: 0.6, ease: 'power1.in' }, '<');
      tl.to(missileEl, { y: -100, duration: 0.3, ease: 'power2.out' }, '<');
      tl.to(missileEl, { rotation: -15, duration: 0.3, ease: 'power2.out' }, '<');
      tl.to(missileEl, { y: 20, duration: 0.3, ease: 'power2.in' }, '<0.3');
      tl.to(missileEl, { rotation: 25, duration: 0.3, ease: 'power2.in' }, '<');
    }
    
    if (smokeEl) {
      tl.to(smokeEl, { opacity: 0.8, scale: 1.5, duration: 0.2 }, '<');
      tl.to(smokeEl, { opacity: 0, scale: 3, duration: 0.4 }, '>');
    }

    // 姿勢復帰
    const allTargets = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, '+=0.2');
  }
}
`;

// Replace export class GSAPRobotAnimationRegistry
content = content.replace('export class GSAPRobotAnimationRegistry {', newAnimations + '\nexport class GSAPRobotAnimationRegistry {\n');

content = content.replace(
  'new TwinBeamShootAnimation(),',
  'new TwinBeamShootAnimation(),\n    new SwordSlashAnimation(),\n    new ShieldBlockAnimation(),\n    new MissileFireAnimation(),'
);

fs.writeFileSync('src/core/animations/GSAPRobotAnimator.ts', content);
