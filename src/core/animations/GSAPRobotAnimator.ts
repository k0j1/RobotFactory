import gsap from 'gsap';

/**
 * ロボットアニメーションのカテゴリ定義
 */
export enum RobotAnimationCategory {
  COMBAT = 'combat',        // バトル・攻撃・防御
  ACROBATIC = 'acrobatic',  // 特殊・アクロバット・変形
  MECHANICAL = 'mechanical',// アイドル・基本動作・診断
  EMOTION = 'emotion',      // 感情表現・コミュニケーション
}

export interface RobotAnimationCategoryMeta {
  id: RobotAnimationCategory;
  name: string;
  description: string;
  iconName: string;
}

export const ROBOT_ANIMATION_CATEGORIES: RobotAnimationCategoryMeta[] = [
  {
    id: RobotAnimationCategory.COMBAT,
    name: '戦闘・攻撃 (Combat)',
    description: 'スラッシュ、キャノン砲、連射、ロケットパンチ等の武装アクション',
    iconName: 'GiBroadsword'
  },
  {
    id: RobotAnimationCategory.ACROBATIC,
    name: '特殊・機能 (Acrobatics)',
    description: '分解展開図、ジャンプ、オーバードライブ、ブレイクダンス等の特殊技能',
    iconName: 'GiAcrobatic'
  },
  {
    id: RobotAnimationCategory.MECHANICAL,
    name: '点検・動作 (Mechanical)',
    description: 'スキャン診断、ホバー浮遊、急速充電、キャリブレーション等の駆動ルーチン',
    iconName: 'GiGears'
  },
  {
    id: RobotAnimationCategory.EMOTION,
    name: '感情・仕草 (Emotions)',
    description: '歓喜のポーズ、パニック、敬礼おじぎ、手拍子等のエモーショナルな表現',
    iconName: 'GiHeartPlus'
  }
];

/**
 * アニメーション対象のDOM参照インターフェース
 */
export interface RobotDOMRefs {
  container: HTMLElement | SVGSVGElement | null;
  head: HTMLElement | SVGGElement | null;
  body: HTMLElement | SVGGElement | null;
  arms: HTMLElement | SVGGElement | null;
  legs: HTMLElement | SVGGElement | null;
  armLeft?: HTMLElement | SVGGElement | null;   // 左腕 (向かって左)
  armRight?: HTMLElement | SVGGElement | null;  // 右腕 (向かって右)
  legLeft?: HTMLElement | SVGGElement | null;   // 左脚 (向かって左)
  legRight?: HTMLElement | SVGGElement | null;  // 右脚 (向かって右)
  fxContainer?: HTMLElement | null;
  scanLine?: HTMLElement | null;
  auraOverlay?: HTMLElement | null;
  sparkles?: HTMLElement | null;
}

/**
 * アニメーションパターンのインターフェース
 */
export interface IRobotAnimationPattern {
  id: string;
  name: string;
  category: RobotAnimationCategory;
  duration: number; // 標準所要秒数
  loop: boolean;
  description: string;
  technicalHighlights: string[]; // GSAP技術ハイライト（イージング、タイムライン設計など）
  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void;
}

/**
 * アニメーションパターンの基底クラス (OOP)
 */
export abstract class BaseRobotAnimation implements IRobotAnimationPattern {
  abstract id: string;
  abstract name: string;
  abstract category: RobotAnimationCategory;
  abstract duration: number;
  abstract loop: boolean;
  abstract description: string;
  abstract technicalHighlights: string[];

  abstract build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void;

  /**
   * 安全な初期値リセット処理
   */
  protected resetElements(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    const targets = [
      refs.container,
      refs.head,
      refs.body,
      refs.arms,
      refs.legs,
      refs.armLeft,
      refs.armRight,
      refs.legLeft,
      refs.legRight,
    ].filter(Boolean);
    if (targets.length > 0) {
      tl.set(targets, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        opacity: 1,
        filter: 'none',
      });
    }
    // 解剖学的に自然な関節回転軸 (Pivot Point) を設定
    if (refs.container) tl.set(refs.container, { transformOrigin: '50% 80%' });
    if (refs.head) tl.set(refs.head, { transformOrigin: '50% 32%' });           // 首・頭部の付け根
    if (refs.body) tl.set(refs.body, { transformOrigin: '50% 55%' });           // 胴体の重心
    if (refs.arms) tl.set(refs.arms, { transformOrigin: '50% 46%' });           // 腕部全体
    if (refs.armLeft) tl.set(refs.armLeft, { transformOrigin: '25% 46%' });     // 左肩 (向かって左)
    if (refs.armRight) tl.set(refs.armRight, { transformOrigin: '75% 46%' });   // 右肩 (向かって右)
    if (refs.legs) tl.set(refs.legs, { transformOrigin: '50% 75%' });           // 脚部全体
    if (refs.legLeft) tl.set(refs.legLeft, { transformOrigin: '38% 72%' });     // 左股関節 (向かって左)
    if (refs.legRight) tl.set(refs.legRight, { transformOrigin: '62% 72%' });   // 右股関節 (向かって右)

    if (refs.scanLine) tl.set(refs.scanLine, { opacity: 0, y: -50 });
    if (refs.auraOverlay) tl.set(refs.auraOverlay, { opacity: 0, scale: 0.8 });
    if (refs.sparkles) tl.set(refs.sparkles, { opacity: 0 });
  }
}

// =========================================================================
// 1. COMBAT ACTIONS (戦闘・攻撃・防御)
// =========================================================================

/**
 * 1. 連撃スラッシュコンボ (Slash Combo)
 */
export class SlashComboAnimation extends BaseRobotAnimation {
  id = 'slash_combo';
  name = '連撃スラッシュ (Slash Combo)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.4;
  loop = true;
  description = '前方へ鋭く踏み込み、右腕・左腕で高速クロススラッシュを叩き込む近接斬撃モーション。左右の腕と脚が独立連動。';
  technicalHighlights = [
    '左右アームの交互クロススラッシュ (Rotation & ScaleX 独立変形)',
    '踏み込み時の左脚軸・右脚前進の歩行スタンス',
    'インパクト瞬間のContainer微振動シェイク & Head衝撃連動'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 構え・ため
    tl.to(container, { x: -8, y: 3, scaleY: 0.95, duration: 0.25, ease: 'power2.in' })
      .to(head, { rotation: -10, duration: 0.25 }, '<');

    if (armRight) tl.to(armRight, { rotation: -45, y: -6, duration: 0.25, ease: 'power2.out' }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 25, y: -2, duration: 0.25, ease: 'power2.out' }, '<');
    if (!armRight && !armLeft && arms) tl.to(arms, { rotation: -30, y: -6, duration: 0.25 }, '<');

    if (legLeft) tl.to(legLeft, { skewX: 8, scaleY: 0.92, duration: 0.25 }, '<');
    if (legRight) tl.to(legRight, { skewX: -8, scaleY: 0.96, duration: 0.25 }, '<');

    // 踏み込み1段目（右アーム渾身のスラッシュ、左腕は防御ガード）
    tl.to(container, { x: 18, y: -4, scaleY: 1.05, duration: 0.18, ease: 'back.out(2)' })
      .to(head, { rotation: 12, duration: 0.14 }, '<');

    if (armRight) tl.to(armRight, { rotation: 65, x: 14, y: -10, duration: 0.14, ease: 'power4.in' }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -20, x: -4, duration: 0.14 }, '<');
    if (!armRight && !armLeft && arms) tl.to(arms, { rotation: 45, y: -12, duration: 0.14 }, '<');

    if (legLeft) tl.to(legLeft, { skewX: -14, duration: 0.18 }, '<');
    if (legRight) tl.to(legRight, { skewX: 10, scaleY: 1.05, duration: 0.18 }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { skewX: -12, duration: 0.18 }, '<');

    // 2段目（左アームの返しの高速クロススラッシュ、右腕引き戻し）
    tl.to(container, { x: 24, y: 0, duration: 0.15, ease: 'power2.out' })
      .to(head, { rotation: -15, y: -2, duration: 0.15 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 70, x: 16, y: -8, duration: 0.15, ease: 'power3.inOut' }, '<');
    if (armRight) tl.to(armRight, { rotation: -30, x: -6, duration: 0.15 }, '<');
    if (!armRight && !armLeft && arms) tl.to(arms, { rotation: -50, scaleX: 1.15, duration: 0.15 }, '<');

    // インパクトヒットストップ & 振動
    tl.to(container, { x: '+=2', y: '+=2', duration: 0.04, yoyo: true, repeat: 3, ease: 'rough' });

    // 残心・復帰
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.45,
      ease: 'power2.out'
    });
  }
}

/**
 * 1B. 二刀流・X連撃クロススラッシュ (Dual Wield Cross Slash)
 */
export class DualSlashComboAnimation extends BaseRobotAnimation {
  id = 'dual_slash_combo';
  name = '二刀流クロススラッシュ (Dual Slash)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.7;
  loop = true;
  description = '左右両腕のブレードを同時に構え、左腕の袈裟斬り、右腕の逆袈裟斬り、そして両腕同時X字クロスフィニッシュを叩き込む。';
  technicalHighlights = [
    '左右アームの独立逆位相スイング (ArmLeft: +60deg / ArmRight: -60deg)',
    'フィニッシュ時の同時X字クロス交差 (左右アーム連動)',
    '斬撃ごとの踏み込み足（左脚→右脚→両脚開脚）の独立ステップ'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 構え（左右アームを外側に開いてエネルギー充填）
    tl.to(container, { y: 2, duration: 0.25 });
    if (armLeft) tl.to(armLeft, { rotation: -40, x: -8, y: -4, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (armRight) tl.to(armRight, { rotation: -40, x: 8, y: -4, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -30, duration: 0.25 }, '<');

    // 1撃目：左腕の袈裟斬り（左腕が斜め下へ一閃、左脚踏み込み）
    tl.to(container, { x: 8, duration: 0.12, ease: 'power4.in' });
    if (armLeft) tl.to(armLeft, { rotation: 65, x: 12, y: 6, duration: 0.12, ease: 'power4.in' }, '<');
    if (armRight) tl.to(armRight, { rotation: -60, x: -6, duration: 0.12 }, '<');
    if (legLeft) tl.to(legLeft, { skewX: -10, duration: 0.12 }, '<');

    // 2撃目：右腕の逆袈裟斬り（右腕が斜め上へ一閃、右脚踏み込み）
    tl.to(container, { x: 16, duration: 0.12, ease: 'power4.in' }, '+=0.06');
    if (armRight) tl.to(armRight, { rotation: 70, x: 14, y: -8, duration: 0.12, ease: 'power4.in' }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -20, x: -4, duration: 0.12 }, '<');
    if (legRight) tl.to(legRight, { skewX: 12, duration: 0.12 }, '<');

    // フィニッシュ：両腕同時X字クロススラッシュ！
    tl.to(container, { x: 24, y: -4, duration: 0.15, ease: 'back.out(2)' }, '+=0.08');
    if (armLeft) tl.to(armLeft, { rotation: 55, x: 10, y: -2, duration: 0.12, ease: 'power4.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: 55, x: 10, y: -2, duration: 0.12, ease: 'power4.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 60, duration: 0.12 }, '<');

    // クロスインパクト振動
    tl.to(container, { x: '+=2', y: '+=2', duration: 0.04, yoyo: true, repeat: 3 });

    // 残心復帰
    const allTargets = [container, head, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.45,
      ease: 'power2.out'
    }, '+=0.15');
  }
}

/**
 * 2. 収束メガビームキャノン (Mega Beam Cannon)
 */
export class BeamCannonAnimation extends BaseRobotAnimation {
  id = 'beam_cannon';
  name = '収束ビーム砲撃 (Beam Cannon)';
  category = RobotAnimationCategory.COMBAT;
  duration = 2.0;
  loop = true;
  description = '腰を落として両腕を正面にロック。エネルギーを限界までチャージし、強烈な反動とともにビームを一斉射撃。';
  technicalHighlights = [
    '左右アームの並列前方ロックオン (Rotation: 75deg)',
    'RoughEase風の高周波チャージチャタリング',
    '弾性反動 (Elastic.easeOut) による大口径キャノンの射撃キックバック'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, auraOverlay } = refs;

    // 射撃姿勢ロック
    tl.to(body, { y: 3, duration: 0.3 }, '<')
      .to(head, { y: 2, rotation: 5, duration: 0.3 }, '<');

    if (legLeft) tl.to(legLeft, { scaleY: 0.88, y: 4, skewX: -6, duration: 0.3, ease: 'power2.out' }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.88, y: 4, skewX: 6, duration: 0.3, ease: 'power2.out' }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { scaleY: 0.88, y: 4, skewX: 6, duration: 0.3 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 70, x: 6, y: -8, duration: 0.3, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: 70, x: 8, y: -8, duration: 0.3, ease: 'power2.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 70, x: 8, y: -8, duration: 0.3 }, '<');

    // エネルギーチャージ（高周波ブルブル振動）
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.8, scale: 1.2, duration: 0.7, ease: 'power1.in' }, '<');
    }
    tl.to(container, {
      x: 'random(-2, 2)',
      y: 'random(-2, 2)',
      repeat: 8,
      duration: 0.07,
      ease: 'none'
    }, '-=0.6');

    // 発射！大反動（キックバック）
    tl.to(container, { x: -28, y: -6, rotation: -8, duration: 0.12, ease: 'power4.out' })
      .to(head, { rotation: -12, y: -5, duration: 0.1 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 85, scaleX: 1.2, duration: 0.1, ease: 'power4.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: 85, scaleX: 1.2, duration: 0.1, ease: 'power4.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 85, scaleX: 1.2, duration: 0.1 }, '<');

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, scale: 2.0, duration: 0.3, ease: 'power2.out' }, '<');
    }

    // 揺り戻し・砲身排熱復帰
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(container, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      .to(allTargets, {
        x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '<0.1');
  }
}

/**
 * 3. 超高速ガトリング連射 (Gatling Burst)
 */
export class GatlingBurstAnimation extends BaseRobotAnimation {
  id = 'gatling_burst';
  name = 'ガトリング連射 (Gatling Burst)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.6;
  loop = true;
  description = 'アームのガトリング銃身を高速スピンさせ、左右アームの互い違いリコイルで弾幕を一斉掃射。';
  technicalHighlights = [
    '左右アームの位相差リコイル (Alternating Recoil)',
    'BodyとLegsの微小なカウンターウェイト相殺モーション',
    '掃射終了後のバレルスローダウン余韻'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 照準セット
    tl.to(head, { rotation: 6, duration: 0.25 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 42, x: 4, y: -4, duration: 0.25, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: 48, x: 8, y: -4, duration: 0.25, ease: 'power2.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 45, x: 6, y: -4, duration: 0.25 }, '<');

    // 連続高速連射ループ（左右交互にリコイル）
    const burstTl = gsap.timeline({ repeat: 10 });
    if (armLeft && armRight) {
      burstTl
        .to(armRight, { x: 4, rotation: 52, duration: 0.03, ease: 'power1.in' })
        .to(armLeft, { x: 8, rotation: 38, duration: 0.03, ease: 'power1.out' }, '<')
        .to(armRight, { x: 9, rotation: 44, duration: 0.03, ease: 'power1.out' })
        .to(armLeft, { x: 3, rotation: 46, duration: 0.03, ease: 'power1.in' }, '<')
        .to(container, { x: '-=1.5', duration: 0.03 }, '<')
        .to(container, { x: '+=1.5', duration: 0.03 });
    } else if (arms) {
      burstTl
        .to(arms, { x: 3, rotation: 48, duration: 0.03, ease: 'power1.in' })
        .to(arms, { x: 7, rotation: 43, duration: 0.03, ease: 'power1.out' })
        .to(container, { x: '-=1.5', duration: 0.03 }, '<')
        .to(container, { x: '+=1.5', duration: 0.03 });
    }

    tl.add(burstTl);

    // 掃射完了・バレル停止と復帰
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'back.out(1.5)'
    });
  }
}

/**
 * 4. ロケットパンチ射出 (Rocket Punch)
 */
export class RocketPunchAnimation extends BaseRobotAnimation {
  id = 'rocket_punch';
  name = 'ロケットパンチ (Rocket Punch)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.8;
  loop = true;
  description = '右腕アームのみを猛烈なブーストで標的へ射出！左腕は防御構えを維持し、旋回帰還後にガッチリ再結合。';
  technicalHighlights = [
    '右腕 (ArmRight) の単独分離＆360度ロケットスピン射出 (X: +85px)',
    '左腕 (ArmLeft) の防御ガード保持と体幹ブレ補正',
    'ドッキング時のImpact Bounceとロック衝撃'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 発射準備タメ（右腕を後ろに引き、左腕は構える）
    tl.to(container, { x: -4, duration: 0.25 }, '<');
    if (armRight) tl.to(armRight, { x: -16, rotation: -30, duration: 0.25, ease: 'power2.in' }, '<');
    if (armLeft) tl.to(armLeft, { x: 2, rotation: 20, duration: 0.25, ease: 'power2.out' }, '<');
    if (!armRight && !armLeft && arms) tl.to(arms, { x: -12, rotation: -20, duration: 0.25 }, '<');

    if (legLeft) tl.to(legLeft, { skewX: -6, duration: 0.25 }, '<');
    if (legRight) tl.to(legRight, { skewX: 8, duration: 0.25 }, '<');

    // 射出！（右腕だけが超高速で飛び出す！）
    tl.to(container, { x: -8, duration: 0.15, ease: 'power2.out' }, '<')
      .to(head, { rotation: 10, duration: 0.2 }, '<');

    if (armRight) {
      tl.to(armRight, { x: 88, y: -15, rotation: 360, duration: 0.35, ease: 'power4.out' }, '<');
    } else if (arms) {
      tl.to(arms, { x: 85, y: -15, rotation: 360, duration: 0.35, ease: 'power4.out' }, '<');
    }

    // 標的ヒット＆反転旋回
    if (armRight) {
      tl.to(armRight, { x: 60, y: -45, rotation: 540, duration: 0.3, ease: 'power1.inOut' });
      // 帰還ドッキング（本体へ戻る）
      tl.to(armRight, { x: 0, y: 0, rotation: 720, duration: 0.4, ease: 'back.out(2)' })
        .to(container, { x: 0, duration: 0.4 }, '<');
    } else if (arms) {
      tl.to(arms, { x: 60, y: -45, rotation: 540, duration: 0.3, ease: 'power1.inOut' });
      tl.to(arms, { x: 0, y: 0, rotation: 720, duration: 0.4, ease: 'back.out(2)' })
        .to(container, { x: 0, duration: 0.4 }, '<');
    }

    // ドッキング衝撃
    const allTargets = [container, head, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(container, { y: 3, duration: 0.08, yoyo: true, repeat: 1 })
      .to(allTargets, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.2 }, '<');
  }
}

/**
 * 5. ナノシールド防御展開 (Shield Barrier)
 */
export class ShieldBarrierAnimation extends BaseRobotAnimation {
  id = 'shield_barrier';
  name = 'シールド防御 (Shield Barrier)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.6;
  loop = true;
  description = '左腕のシールドを前面に突き出し、右腕で背後から支えて強固な防御壁を展開。';
  technicalHighlights = [
    '左アーム (シールド側) 前面押し出し & 右アーム (支持側) 補強ガード',
    '両脚のワイドスタンス踏ん張り (LegLeft/LegRight 左右独立傾斜)',
    '被弾インパクト時の剛性サスペンション制御'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, auraOverlay } = refs;

    // ガード姿勢へ瞬時に移行
    tl.to(body, { scale: 0.95, y: 3, duration: 0.2 }, '<')
      .to(head, { y: 6, scale: 0.9, duration: 0.2 }, '<');

    if (legLeft) tl.to(legLeft, { skewX: -12, scaleY: 0.88, y: 4, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { skewX: 12, scaleY: 0.88, y: 4, duration: 0.2 }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { scaleY: 0.85, y: 5, duration: 0.2 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 35, x: 10, y: -6, scale: 1.2, duration: 0.2, ease: 'back.out(2)' }, '<');
    if (armRight) tl.to(armRight, { rotation: -25, x: 4, y: 0, duration: 0.2 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 65, scaleX: 1.25, y: -4, duration: 0.2 }, '<');

    // バリア展開
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.9, scale: 1.15, duration: 0.2, ease: 'back.out(2)' }, '<0.1');
    }

    // 敵弾着弾インパクト（耐えの振動）
    tl.to(container, { x: -6, duration: 0.08, ease: 'power4.out' })
      .to(container, { x: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' });

    // バリア維持パルス
    if (armLeft) tl.to(armLeft, { scale: 1.28, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' });

    // ガード解除
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, scale: 0.8, duration: 0.25 }, '-=0.2');
    }
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'power2.out'
    });
  }
}

/**
 * 6. 精密スナイパー照準 (Sniper Aim)
 */
export class SniperAimAnimation extends BaseRobotAnimation {
  id = 'sniper_aim';
  name = '精密スナイパー照準 (Sniper Aim)';
  category = RobotAnimationCategory.COMBAT;
  duration = 2.0;
  loop = true;
  description = '左腕で銃身を支え、右腕でトリガーを引く本格スナイパースタンス。片膝立ちで精密射撃。';
  technicalHighlights = [
    '左腕 (フォアグリップ支持) と右腕 (グリップ＆トリガー操作) のリアルスタンス',
    '左脚の屈曲 (片膝立ち) と右脚の踏ん張り姿勢',
    '超高速トリガー発射 (Duration 0.06s) と急峻なマズルショック'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 狙撃スタンス（左腕でバレルを持ち上げ、右腕で構える）
    tl.to(head, { rotation: 8, x: 3, duration: 0.35 }, '<');

    if (legLeft) tl.to(legLeft, { scaleY: 0.78, y: 8, skewX: 6, duration: 0.35 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.95, y: 2, skewX: 12, duration: 0.35 }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { skewX: 10, scaleY: 0.9, duration: 0.35 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 45, x: 12, y: -10, duration: 0.35 }, '<');
    if (armRight) tl.to(armRight, { rotation: 65, x: 6, y: -4, duration: 0.35 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 50, x: 10, y: -10, duration: 0.35 }, '<');

    // 照準調整（微小な上下左右の微動ロックオン）
    tl.to(head, { rotation: 9, y: '-=1', duration: 0.4, ease: 'sine.inOut' })
      .to(head, { rotation: 7.5, y: '+=1', duration: 0.4, ease: 'sine.inOut' });

    // 撃ち抜き発射！
    tl.to(container, { x: -18, rotation: -4, duration: 0.06, ease: 'power4.out' });
    if (armRight) tl.to(armRight, { rotation: 78, duration: 0.06 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 52, duration: 0.06 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 65, duration: 0.06 }, '<');

    // 薬莢排気・姿勢復帰
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(container, { x: 0, rotation: 0, duration: 0.5, ease: 'power2.out' })
      .to(allTargets, {
        x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, skewX: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '<0.1');
  }
}

/**
 * 6B. 二丁拳銃・左右独立ガンマンスタイル (Gunslinger Stance)
 */
export class GunslingerStanceAnimation extends BaseRobotAnimation {
  id = 'gunslinger_stance';
  name = '二丁拳銃ガンマン (Gunslinger)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.8;
  loop = true;
  description = '左右の腕でそれぞれ異なる方向の敵を素早くエイム＆射撃！スタイリッシュなガンカタ風アクション。';
  technicalHighlights = [
    '左右アームの独立方向エイミング (Left: -35deg, Right: +55deg)',
    '互い違いのクイックトリガー射撃とマズルリコイル',
    'クールなガンマンの視線移動 (Head Rotation)'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // ガンスリンガーの構え
    tl.to(container, { y: 2, duration: 0.2, ease: 'power2.out' });
    if (armLeft) tl.to(armLeft, { rotation: -35, x: -10, y: -6, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (armRight) tl.to(armRight, { rotation: 60, x: 12, y: -6, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (head) tl.to(head, { rotation: -15, duration: 0.2 }, '<');

    // 左銃発射！
    if (armLeft) tl.to(armLeft, { rotation: -45, x: -14, duration: 0.05, ease: 'power4.out' });
    tl.to(container, { x: 3, duration: 0.05 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -35, x: -10, duration: 0.1, ease: 'power2.out' });

    // 視線を右へ即座にスイッチ
    tl.to(head, { rotation: 20, duration: 0.15, ease: 'power2.inOut' });

    // 右銃連射！
    if (armRight) {
      tl.to(armRight, { rotation: 72, x: 16, duration: 0.05, ease: 'power4.out' })
        .to(armRight, { rotation: 60, x: 12, duration: 0.08 });
    }

    // クロスファイア（両腕を交差させて正面一斉射）
    if (armLeft) tl.to(armLeft, { rotation: 40, x: 8, y: -10, duration: 0.2, ease: 'power3.out' });
    if (armRight) tl.to(armRight, { rotation: 40, x: 10, y: -10, duration: 0.2, ease: 'power3.out' }, '<');
    tl.to(head, { rotation: 0, duration: 0.2 }, '<');

    // 発射反動
    tl.to(container, { y: -4, duration: 0.06, yoyo: true, repeat: 1 });

    // 銃身スピン収納・復帰
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, duration: 0.35, ease: 'power2.out'
    }, '+=0.2');
  }
}

// =========================================================================
// 2. ACROBATICS & SPECIALS (特殊・アクロバット・変形)
// =========================================================================

/**
 * 7. スプリング高高度ジャンプ (Spring Jump)
 */
export class SpringJumpAnimation extends BaseRobotAnimation {
  id = 'spring_jump';
  name = 'スプリング大跳躍 (Spring Jump)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 1.6;
  loop = true;
  description = '脚部サスペンションを限界まで圧縮し、空高く跳躍！頂点で左右の脚をダイナミックに曲げ伸ばしして着地。';
  technicalHighlights = [
    '左右脚部 (LegLeft/LegRight) の独立サスペンション圧縮＆空中屈伸',
    '空中での360度フリップ回転 (Rotation: 360)',
    'Bounce.easeOut による重厚な接地サスペンション衝撃吸収'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // しゃがみこみタメ
    tl.to(body, { y: 10, scaleY: 0.85, duration: 0.25 }, '<')
      .to(head, { y: 12, duration: 0.25 }, '<');

    if (legLeft) tl.to(legLeft, { scaleY: 0.65, y: 12, duration: 0.25, ease: 'power2.in' }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.65, y: 12, duration: 0.25, ease: 'power2.in' }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { scaleY: 0.65, y: 12, duration: 0.25, ease: 'power2.in' }, '<');

    if (armLeft) tl.to(armLeft, { y: 10, rotation: 30, duration: 0.25 }, '<');
    if (armRight) tl.to(armRight, { y: 10, rotation: 30, duration: 0.25 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { y: 10, rotation: 30, duration: 0.25 }, '<');

    // 空へ急上昇！
    tl.to(container, { y: -65, duration: 0.4, ease: 'power3.out' });
    if (armLeft) tl.to(armLeft, { rotation: -60, duration: 0.3 }, '<');
    if (armRight) tl.to(armRight, { rotation: -60, duration: 0.3 }, '<');
    if (legLeft) tl.to(legLeft, { scaleY: 1.25, rotation: -15, y: -5, duration: 0.2, ease: 'power2.out' }, '<');
    if (legRight) tl.to(legRight, { scaleY: 1.1, rotation: 20, y: -2, duration: 0.2, ease: 'power2.out' }, '<');
    tl.to(container, { rotation: 360, duration: 0.5, ease: 'power1.inOut' }, '<0.1');

    // 落下着地
    tl.to(container, { y: 0, duration: 0.35, ease: 'power2.in' });
    if (legLeft) tl.to(legLeft, { scaleY: 0.75, rotation: 0, y: 6, duration: 0.1, ease: 'power4.out' });
    if (legRight) tl.to(legRight, { scaleY: 0.75, rotation: 0, y: 6, duration: 0.1, ease: 'power4.out' }, '<');
    tl.to(container, { y: 0, duration: 0.35, ease: 'bounce.out' });

    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

/**
 * 8. ロボットブレイクダンス (Robot Breakdance)
 */
export class BreakdanceAnimation extends BaseRobotAnimation {
  id = 'breakdance';
  name = 'ブレイクダンス (Breakdance)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 2.2;
  loop = true;
  description = '左右の脚を互い違いに蹴り出すウィンドミル＆ポッピング！左右手足の独立フリーズポーズ。';
  technicalHighlights = [
    '左右脚部 (LegLeft/LegRight) の対向開脚キック (Rotation: ±55deg)',
    '左右アームのグラウンド支持＆タッティングポーズ',
    '決めポーズでのアイソレーション固定'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // ポッピング（カクカクヒット）
    tl.to(head, { rotation: 15, duration: 0.12 }, '<')
      .to(body, { skewX: 8, duration: 0.12 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -40, x: -6, duration: 0.12, ease: 'steps(3)' }, '<');
    if (armRight) tl.to(armRight, { rotation: 30, x: 4, duration: 0.12, ease: 'steps(3)' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -40, x: -6, duration: 0.12, ease: 'steps(3)' }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 40, x: 6, duration: 0.12, ease: 'steps(3)' });
    if (armRight) tl.to(armRight, { rotation: -30, x: -4, duration: 0.12, ease: 'steps(3)' }, '<');
    tl.to(head, { rotation: -15, duration: 0.12 }, '<');
    if (legLeft) tl.to(legLeft, { skewX: -15, duration: 0.12 }, '<');
    if (legRight) tl.to(legRight, { skewX: 15, duration: 0.12 }, '<');

    // スピン＆ステップ（左右脚の開脚ウィンドミル）
    tl.to(container, { rotation: 180, scaleX: -1, y: -15, duration: 0.3, ease: 'power2.inOut' });
    if (armLeft) tl.to(armLeft, { rotation: -90, duration: 0.3 }, '<');
    if (armRight) tl.to(armRight, { rotation: 90, duration: 0.3 }, '<');
    if (legLeft) tl.to(legLeft, { rotation: 55, duration: 0.3 }, '<');
    if (legRight) tl.to(legRight, { rotation: -55, duration: 0.3 }, '<');

    tl.to(container, { rotation: 360, scaleX: 1, y: 0, duration: 0.3, ease: 'power2.out' });

    // スタイリッシュフリーズポーズ！
    if (armLeft) tl.to(armLeft, { rotation: 75, x: 12, y: -10, duration: 0.08, ease: 'power4.out' });
    if (armRight) tl.to(armRight, { rotation: -60, x: -8, y: -6, duration: 0.08, ease: 'power4.out' }, '<');
    tl.to(head, { rotation: -20, y: -4, duration: 0.08 }, '<');
    if (legLeft) tl.to(legLeft, { skewX: 20, scaleY: 0.85, duration: 0.08 }, '<');
    if (legRight) tl.to(legRight, { skewX: -10, scaleY: 1.05, duration: 0.08 }, '<');

    // キープ（静止）
    tl.to({}, { duration: 0.4 });

    // ポーズ解除復帰
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'back.out(2)'
    });
  }
}

/**
 * 9. メカニカル分解展開図 (Exploded View)
 */
export class ExplodedViewAnimation extends BaseRobotAnimation {
  id = 'exploded_view';
  name = 'パーツ分解展開図 (Exploded View)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 2.4;
  loop = true;
  description = '頭部・胴体・左腕・右腕・左脚・右脚が6方向に完全分離して空中に浮遊し、瞬時に再結合。';
  technicalHighlights = [
    '6パーツ (Head, Body, ArmLeft, ArmRight, LegLeft, LegRight) の放射状完全分離',
    'Sine波による部位ごとの無重力ホバー位相差',
    '結合時の磁力スナップイージング (Back.out(3))'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 6方向に分解展開！
    tl.to(head, { y: -40, scale: 1.08, duration: 0.5, ease: 'back.out(1.8)' })
      .to(body, { scale: 0.92, duration: 0.5, ease: 'power2.out' }, '<');

    if (armLeft) tl.to(armLeft, { x: -38, y: -10, rotation: -15, scale: 1.05, duration: 0.5, ease: 'back.out(1.8)' }, '<');
    if (armRight) tl.to(armRight, { x: 38, y: -10, rotation: 15, scale: 1.05, duration: 0.5, ease: 'back.out(1.8)' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { x: 34, scale: 1.05, duration: 0.5, ease: 'back.out(1.8)' }, '<');

    if (legLeft) tl.to(legLeft, { x: -20, y: 38, rotation: 12, scale: 1.05, duration: 0.5, ease: 'back.out(1.8)' }, '<');
    if (legRight) tl.to(legRight, { x: 20, y: 38, rotation: -12, scale: 1.05, duration: 0.5, ease: 'back.out(1.8)' }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { y: 35, scale: 1.05, duration: 0.5, ease: 'back.out(1.8)' }, '<');

    // 空中浮遊（パーツごとに周期をずらした無重力ホバー）
    tl.to(head, { y: -44, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      .to(body, { scale: 0.96, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<');

    if (armLeft) tl.to(armLeft, { x: -42, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05');
    if (armRight) tl.to(armRight, { x: 42, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05');

    if (legLeft) tl.to(legLeft, { y: 42, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.1');
    if (legRight) tl.to(legRight, { y: 42, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.1');

    // 磁力スナップ再合体！
    const allTargets = [head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: 0.35,
      ease: 'back.out(2.5)'
    });
  }
}

/**
 * 10. オーバードライブ極限覚醒 (Overdrive Super)
 */
export class OverdriveAnimation extends BaseRobotAnimation {
  id = 'overdrive';
  name = 'オーバードライブ覚醒 (Overdrive)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 2.0;
  loop = true;
  description = '出力リミッターを解除！全身が高周波共振し、金色のオーラを噴出させながら戦闘モード突入。';
  technicalHighlights = [
    '高周波振動 (Rough / Jitter Shake) によるリミッター解除表現',
    'AuraOverlayの急膨張パルスとSparklesの明滅',
    '全身の脈動スケール (Scale: 1.12)'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, auraOverlay, sparkles } = refs;

    // タメ・圧縮
    tl.to(container, { scale: 0.9, y: 5, duration: 0.3, ease: 'power2.in' });

    // リミッター解除！爆発的オーラ解放
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 1, scale: 1.4, duration: 0.2, ease: 'power4.out' }, '<0.2');
    }
    if (sparkles) {
      tl.to(sparkles, { opacity: 1, duration: 0.2 }, '<');
    }

    tl.to(container, { scale: 1.15, y: -8, duration: 0.25, ease: 'elastic.out(1, 0.3)' })
      .to(head, { rotation: 10, y: -3, duration: 0.25 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: -40, y: -10, duration: 0.25 }, '<');
    if (armRight) tl.to(armRight, { rotation: -40, y: -10, duration: 0.25 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -40, y: -10, duration: 0.25 }, '<');

    // 高出力駆動パルス
    tl.to(container, {
      x: 'random(-3, 3)',
      y: 'random(-10, -6)',
      repeat: 8,
      duration: 0.06,
      ease: 'none'
    });

    // クールダウン
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, scale: 0.8, duration: 0.4 }, '-=0.2');
    if (sparkles) tl.to(sparkles, { opacity: 0, duration: 0.3 }, '<');

    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: 0.45,
      ease: 'power2.out'
    });
  }
}

/**
 * 11. ジェットブースター超加速 (Jet Dash)
 */
export class JetDashAnimation extends BaseRobotAnimation {
  id = 'jet_dash';
  name = 'ジェット超加速ダッシュ (Jet Dash)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 1.6;
  loop = true;
  description = '前傾姿勢で背部バーニアをフル点火！左右の手足を連動させて音速ダッシュし、急制動ターン。';
  technicalHighlights = [
    '大幅な前傾SkewX (-18deg) と水平超加速 (X: +70px)',
    '左腕/右脚 vs 右腕/左脚のリアルなダッシュ歩行スイング',
    'サスペンション復帰のダンパー挙動'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 前傾姿勢セット
    tl.to(container, { x: -15, skewX: 18, y: 4, duration: 0.25, ease: 'power2.in' })
      .to(head, { rotation: 15, x: 4, duration: 0.25 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: -55, x: -10, duration: 0.25 }, '<');
    if (armRight) tl.to(armRight, { rotation: 40, x: 8, duration: 0.25 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -55, x: -10, duration: 0.25 }, '<');

    // ブースト点火！前方に猛ダッシュ
    tl.to(container, { x: 65, skewX: -22, duration: 0.35, ease: 'power4.inOut' });
    if (legLeft) tl.to(legLeft, { rotation: -30, scaleY: 0.9, duration: 0.35 }, '<');
    if (legRight) tl.to(legRight, { rotation: 35, scaleY: 0.9, duration: 0.35 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 60, x: 10, duration: 0.35 }, '<');
    if (armRight) tl.to(armRight, { rotation: -60, x: -10, duration: 0.35 }, '<');

    // 急制動ブレーキ！
    tl.to(container, { x: 50, skewX: 25, duration: 0.2, ease: 'power2.out' })
      .to(head, { rotation: -18, duration: 0.2 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 40, x: 12, duration: 0.2 }, '<');
    if (armRight) tl.to(armRight, { rotation: -30, duration: 0.2 }, '<');

    // 姿勢リセット
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, skewX: 0,
      duration: 0.45,
      ease: 'back.out(1.8)'
    });
  }
}

/**
 * 12. 跳び回し蹴り＆ダイナミックキック (Flying Kick)
 */
export class FlyingKickAnimation extends BaseRobotAnimation {
  id = 'flying_kick';
  name = '跳び回し蹴り (Flying Kick)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 1.6;
  loop = true;
  description = '左脚を軸にして踏み込み、右脚を真横に振り抜く鋭い跳び回し蹴り！アームでバランスを制御。';
  technicalHighlights = [
    '右脚 (LegRight) の独立ハイキック (Rotation: 85deg, X: +24px)',
    '左脚 (LegLeft) の軸足サスペンション屈伸',
    '腕部カウンターウェイト旋回'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // タメ・踏み込み
    tl.to(container, { x: -10, y: 4, duration: 0.2, ease: 'power2.in' });
    if (legLeft) tl.to(legLeft, { scaleY: 0.8, skewX: 10, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.9, y: 2, duration: 0.2 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 30, duration: 0.2 }, '<');
    if (armRight) tl.to(armRight, { rotation: -40, duration: 0.2 }, '<');

    // 跳躍＆右脚回し蹴り一閃！
    tl.to(container, { x: 22, y: -16, rotation: -12, duration: 0.18, ease: 'back.out(2)' })
      .to(head, { rotation: 12, duration: 0.18 }, '<');

    if (legRight) tl.to(legRight, { rotation: 80, x: 28, y: -12, scaleX: 1.15, duration: 0.15, ease: 'power4.out' }, '<');
    if (legLeft) tl.to(legLeft, { rotation: -25, scaleY: 0.85, duration: 0.18 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -60, x: -10, duration: 0.15 }, '<');
    if (armRight) tl.to(armRight, { rotation: 50, x: 12, duration: 0.15 }, '<');

    // キックヒットストップ
    tl.to(container, { x: '+=2', duration: 0.04, yoyo: true, repeat: 2 });

    // 着地復帰
    tl.to(container, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'bounce.out' });
    const allTargets = [head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '<0.1');
  }
}

/**
 * 12B. ダイナミック手足交互疾走 (Dynamic March & Sprint)
 */
export class DynamicMarchSprintAnimation extends BaseRobotAnimation {
  id = 'march_sprint';
  name = '手足交互疾走 (Sprint Run)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 1.6;
  loop = true;
  description = '左腕と右脚、右腕と左脚が完全に逆位相で大きく振れる本格的なダイナミック走行ループ。';
  technicalHighlights = [
    '対角手足の完全逆位相サイン波駆動 (Phased Alternating Limbs)',
    '走行時の上下ボビングバウンス (Container Y-Bounce: 6Hz)',
    'スピード感あふれる頭部・体幹の微小ロール'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    const runCycle = gsap.timeline({ repeat: 2 });

    // ステップ1: 左腕前・右腕後 / 右脚前・左脚後
    runCycle
      .to(container, { y: -6, duration: 0.15, ease: 'power1.out' })
      .to(head, { rotation: 4, duration: 0.15 }, '<');

    if (armLeft) runCycle.to(armLeft, { rotation: 55, x: 8, duration: 0.15, ease: 'sine.inOut' }, '<');
    if (armRight) runCycle.to(armRight, { rotation: -50, x: -8, duration: 0.15, ease: 'sine.inOut' }, '<');
    if (legLeft) runCycle.to(legLeft, { rotation: -35, y: -2, duration: 0.15, ease: 'sine.inOut' }, '<');
    if (legRight) runCycle.to(legRight, { rotation: 40, y: 3, duration: 0.15, ease: 'sine.inOut' }, '<');

    // ステップ2: 着地＆沈み込み
    runCycle
      .to(container, { y: 0, duration: 0.1, ease: 'power1.in' });

    // ステップ3: 右腕前・左腕後 / 左脚前・右脚後
    runCycle
      .to(container, { y: -6, duration: 0.15, ease: 'power1.out' })
      .to(head, { rotation: -4, duration: 0.15 }, '<');

    if (armLeft) runCycle.to(armLeft, { rotation: -50, x: -8, duration: 0.15, ease: 'sine.inOut' }, '<');
    if (armRight) runCycle.to(armRight, { rotation: 55, x: 8, duration: 0.15, ease: 'sine.inOut' }, '<');
    if (legLeft) runCycle.to(legLeft, { rotation: 40, y: 3, duration: 0.15, ease: 'sine.inOut' }, '<');
    if (legRight) runCycle.to(legRight, { rotation: -35, y: -2, duration: 0.15, ease: 'sine.inOut' }, '<');

    // ステップ4: 着地
    runCycle
      .to(container, { y: 0, duration: 0.1, ease: 'power1.in' });

    tl.add(runCycle);

    // 減速・通常立ち姿勢へ
    const allTargets = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, duration: 0.3, ease: 'power2.out'
    });
  }
}

/**
 * 12C. サイクロン回転アタック (Spin Tornado)
 */
export class SpinTornadoAnimation extends BaseRobotAnimation {
  id = 'spin_tornado';
  name = 'サイクロン回転 (Spin Tornado)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 1.8;
  loop = true;
  description = '左右の腕を大きく水平に広げて超高速スピン！回転竜巻を発生させて周囲の全方位を攻撃。';
  technicalHighlights = [
    '左右アームの水平T字展開 (Left: -85deg, Right: +85deg)',
    'ScaleX: -1 と 1 の高速フリップによる擬似3D 360°回転スピン',
    'スピン停止時のめまい微振動'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, arms, armLeft, armRight, legLeft, legRight } = refs;

    // 腕を水平に展開
    if (armLeft) tl.to(armLeft, { rotation: -85, scaleX: 1.2, duration: 0.25, ease: 'back.out(2)' });
    if (armRight) tl.to(armRight, { rotation: 85, scaleX: 1.2, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (legLeft) tl.to(legLeft, { rotation: -15, y: -4, duration: 0.25 }, '<');
    if (legRight) tl.to(legRight, { rotation: 15, y: -4, duration: 0.25 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 90, scaleX: 1.3, duration: 0.25, ease: 'back.out(2)' });

    // スピン加速（ScaleXの反転による3D回転演出）
    const spinTl = gsap.timeline();
    for (let i = 0; i < 4; i++) {
      spinTl
        .to(container, { scaleX: -1, y: -6, duration: 0.08, ease: 'none' })
        .to(container, { scaleX: 1, y: 0, duration: 0.08, ease: 'none' });
    }
    tl.add(spinTl);

    // ピタッと停止（少し遠心力でふらつく）
    tl.to(container, { rotation: -10, duration: 0.15, ease: 'power2.out' })
      .to(head, { rotation: -15, duration: 0.15 }, '<');

    const allTargets = [container, head, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, {
      rotation: 0, scale: 1, scaleX: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)'
    });
  }
}

// =========================================================================
// 3. MECHANICAL & IDLE (点検・動作・基本ルーチン)
// =========================================================================

/**
 * 13. 360°精密センサー診断スキャン (Precision Scan)
 */
export class PrecisionScanAnimation extends BaseRobotAnimation {
  id = 'precision_scan';
  name = '精密センサー診断 (Precision Scan)';
  category = RobotAnimationCategory.MECHANICAL;
  duration = 2.4;
  loop = true;
  description = '頭部センサーが左右をスキャン。左腕・右腕・左脚・右脚の各サーボモーターを順番に自己診断。';
  technicalHighlights = [
    'ScanLine要素の上下リニア走査とクリッピング演出',
    '左右アームおよび左右レッグの個別サーボ可動域テスト (Staggered Servo Test)',
    '診断完了時の緑色LEDパルス'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, arms, armLeft, armRight, legs, legLeft, legRight, scanLine } = refs;

    // 頭部左右スキャン
    tl.to(head, { rotation: -25, x: -4, duration: 0.4, ease: 'power2.inOut' })
      .to(head, { rotation: 25, x: 4, duration: 0.6, ease: 'power2.inOut' })
      .to(head, { rotation: 0, x: 0, duration: 0.3, ease: 'power1.out' });

    // スキャンレーザーラインの上下走査
    if (scanLine) {
      tl.to(scanLine, { opacity: 0.9, y: -40, duration: 0.1 }, '<-0.5')
        .to(scanLine, { y: 40, duration: 0.8, ease: 'power1.inOut' })
        .to(scanLine, { opacity: 0, duration: 0.2 });
    }

    // 左アーム診断
    if (armLeft) {
      tl.to(armLeft, { rotation: -30, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.3');
    }
    // 右アーム診断
    if (armRight) {
      tl.to(armRight, { rotation: 30, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.15');
    }
    if (!armLeft && !armRight && arms) {
      tl.to(arms, { y: -6, rotation: 15, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.3');
    }

    // 左脚・右脚ステップ診断
    if (legLeft) tl.to(legLeft, { scaleY: 0.88, y: 2, duration: 0.12, yoyo: true, repeat: 1 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.88, y: 2, duration: 0.12, yoyo: true, repeat: 1 }, '+=0.05');

    // 診断完了・正常復帰
    tl.to(head, { y: -2, duration: 0.15, yoyo: true, repeat: 1 });
  }
}

/**
 * 14. 生体同調アイドル呼吸 (Bio Breathing)
 */
export class BioBreathingAnimation extends BaseRobotAnimation {
  id = 'bio_breathing';
  name = '生体同調アイドル (Bio Breathing)';
  category = RobotAnimationCategory.MECHANICAL;
  duration = 2.0;
  loop = true;
  description = 'まるで生きているかのように滑らかな関節の呼吸サイクル。左腕・右腕・脚部が優しく連動。';
  technicalHighlights = [
    'Sine.easeInOut による極めて滑らかな微小脈動ループ',
    '左右の腕にわずかな位相差をつけたオーガニックな連動',
    'CPU負荷を最小限に抑えた最適化カーブ'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    tl.to(body, { y: -3, scaleY: 1.03, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      .to(head, { y: -4, rotation: 2, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.1');

    if (armLeft) tl.to(armLeft, { y: -2, rotation: -3, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.15');
    if (armRight) tl.to(armRight, { y: -2, rotation: 3, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.2');
    if (!armLeft && !armRight && arms) tl.to(arms, { y: -2, rotation: -4, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.15');

    if (legLeft) tl.to(legLeft, { scaleY: 0.97, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05');
    if (legRight) tl.to(legRight, { scaleY: 0.97, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05');
    if (!legLeft && !legRight && legs) tl.to(legs, { scaleY: 0.97, duration: 1.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05');
  }
}

/**
 * 15. 反重力ホバー浮遊 (Hover Flight)
 */
export class HoverFlightAnimation extends BaseRobotAnimation {
  id = 'hover_flight';
  name = '反重力ホバー浮遊 (Hover Flight)';
  category = RobotAnimationCategory.MECHANICAL;
  duration = 2.2;
  loop = true;
  description = '足裏のリパルサー推進器で宙に浮上。左右の腕と脚が空気抵抗で自然に揺らめく。';
  technicalHighlights = [
    '浮遊オフセット (Y: -16px) 上での多重サイン波合成',
    '左右脚部 (LegLeft/LegRight) の独立スイングホバー',
    '姿勢制御スラスターを模した微小なロール回転'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 離陸浮上
    tl.to(container, { y: -16, duration: 0.5, ease: 'power2.out' });
    if (legLeft) tl.to(legLeft, { scaleY: 1.1, rotation: 6, duration: 0.5 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 1.1, rotation: -4, duration: 0.5 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -22, y: 4, duration: 0.5 }, '<');
    if (armRight) tl.to(armRight, { rotation: 18, y: 4, duration: 0.5 }, '<');

    // 空中ホバリングループ
    tl.to(container, { y: -22, rotation: 3, duration: 0.6, ease: 'sine.inOut' })
      .to(container, { y: -14, rotation: -3, duration: 0.6, ease: 'sine.inOut' })
      .to(head, { rotation: -4, duration: 0.6, ease: 'sine.inOut' }, '<-0.6')
      .to(head, { rotation: 4, duration: 0.6, ease: 'sine.inOut' }, '<');

    if (armLeft) tl.to(armLeft, { rotation: -12, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<-0.6');
    if (armRight) tl.to(armRight, { rotation: 12, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<-0.6');

    // 姿勢復帰
    tl.to(container, { y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' });
    const allTargets = [legs, legLeft, legRight, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, { scaleY: 1, rotation: 0, y: 0, duration: 0.4 }, '<');
  }
}

/**
 * 16. 急速エネルギー充電 (Fast Recharge)
 */
export class FastRechargeAnimation extends BaseRobotAnimation {
  id = 'fast_recharge';
  name = '急速エネルギー充電 (Fast Recharge)';
  category = RobotAnimationCategory.MECHANICAL;
  duration = 1.8;
  loop = true;
  description = '充電ドックに接続！大地から大電流を吸い上げ、バッテリーゲージを満タンまでチャージ。';
  technicalHighlights = [
    '段階的パルス充電 (Step Charge) による蓄電シミュレーション',
    'AuraOverlayの蓄積発光とSparkles放電',
    'フルチャージ完了時の起動サージ'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legLeft, legRight, auraOverlay, sparkles } = refs;

    // 充電姿勢（少し腰を落とす）
    tl.to(container, { y: 4, scaleY: 0.95, duration: 0.25, ease: 'power1.out' });

    // 電流流入パルス（3段階で発光と振動が強まる）
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.4, scale: 0.95, duration: 0.25 })
        .to(auraOverlay, { opacity: 0.7, scale: 1.1, duration: 0.25 })
        .to(auraOverlay, { opacity: 1.0, scale: 1.25, duration: 0.25 });
    }
    if (sparkles) {
      tl.to(sparkles, { opacity: 0.8, duration: 0.4 }, '<-0.3');
    }

    tl.to(body, { scale: 1.08, duration: 0.3, ease: 'power2.out' }, '<')
      .to(head, { y: -3, duration: 0.2 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: -25, duration: 0.2 }, '<');
    if (armRight) tl.to(armRight, { rotation: 25, duration: 0.2 }, '<');
    if (legLeft) tl.to(legLeft, { scaleY: 0.9, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.9, duration: 0.2 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -25, duration: 0.2 }, '<');

    // チャージ完了バースト！
    tl.to(container, { y: -6, scale: 1.08, duration: 0.15, ease: 'back.out(2)' });

    // 起動・通常待機へ復帰
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, duration: 0.3 }, '<');
    if (sparkles) tl.to(sparkles, { opacity: 0, duration: 0.2 }, '<');

    const allTargets = [container, head, body, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
  }
}

/**
 * 17. 省電力スリープモード (Sleep Standby)
 */
export class SleepStandbyAnimation extends BaseRobotAnimation {
  id = 'sleep_standby';
  name = '省電力スリープ (Sleep Standby)';
  category = RobotAnimationCategory.MECHANICAL;
  duration = 2.6;
  loop = true;
  description = '首を傾げてシステムをスリープへ移行。超低周波のスタンバイモードでゆっくりと呼吸。';
  technicalHighlights = [
    'Power2.in による電源シャットダウン風の重力脱力沈み込み',
    '超低速 (0.2Hz) スリープ微動',
    '再起動時の起動パルス'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, body, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 脱力シャットダウン
    tl.to(head, { y: 7, rotation: 18, duration: 0.7, ease: 'power2.inOut' })
      .to(body, { y: 4, scaleY: 0.96, duration: 0.7, ease: 'power2.inOut' }, '<');

    if (armLeft) tl.to(armLeft, { y: 6, rotation: 12, duration: 0.7, ease: 'power2.inOut' }, '<');
    if (armRight) tl.to(armRight, { y: 6, rotation: 18, duration: 0.7, ease: 'power2.inOut' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { y: 6, rotation: 15, duration: 0.7, ease: 'power2.inOut' }, '<');

    if (legLeft) tl.to(legLeft, { scaleY: 0.94, duration: 0.7 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.94, duration: 0.7 }, '<');

    // スリープ中の深い呼吸
    tl.to(body, { y: 2, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      .to(head, { y: 5, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<');

    // システム再起動！
    tl.to(head, { y: 0, rotation: 0, duration: 0.4, ease: 'back.out(2)' });
    const allTargets = [body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '<0.05');
  }
}

/**
 * 18. 各部関節キャリブレーション (Calibration)
 */
export class CalibrationAnimation extends BaseRobotAnimation {
  id = 'calibration';
  name = '関節キャリブレーション (Calibration)';
  category = RobotAnimationCategory.MECHANICAL;
  duration = 2.0;
  loop = true;
  description = '左腕・右腕・頭部・脚部を順番に動かして可動範囲とトルクをチェックする初期化シーケンス。';
  technicalHighlights = [
    '左腕 (ArmLeft) と右腕 (ArmRight) の独立可動角チェック',
    'メカニカルな段階角度チェック (Angle Stepping)',
    '全関節シンクロ動作確認'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, arms, armLeft, armRight, legs, legLeft, legRight } = refs;

    // 1. 左アーム可動域テスト
    if (armLeft) {
      tl.to(armLeft, { rotation: -60, duration: 0.25, ease: 'power2.inOut' })
        .to(armLeft, { rotation: 40, duration: 0.25, ease: 'power2.inOut' })
        .to(armLeft, { rotation: 0, duration: 0.15 });
    }

    // 2. 右アーム可動域テスト
    if (armRight) {
      tl.to(armRight, { rotation: 60, duration: 0.25, ease: 'power2.inOut' })
        .to(armRight, { rotation: -40, duration: 0.25, ease: 'power2.inOut' })
        .to(armRight, { rotation: 0, duration: 0.15 });
    }

    if (!armLeft && !armRight && arms) {
      tl.to(arms, { rotation: -60, duration: 0.3, ease: 'power2.inOut' })
        .to(arms, { rotation: 60, duration: 0.3, ease: 'power2.inOut' })
        .to(arms, { rotation: 0, duration: 0.2 });
    }

    // 3. 首振り可動域テスト
    tl.to(head, { rotation: -30, duration: 0.2, ease: 'power2.inOut' })
      .to(head, { rotation: 30, duration: 0.2, ease: 'power2.inOut' })
      .to(head, { rotation: 0, duration: 0.15 });

    // 4. 脚部サスペンションテスト
    if (legLeft) tl.to(legLeft, { scaleY: 0.8, y: 4, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' });
    if (legRight) tl.to(legRight, { scaleY: 0.8, y: 4, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<0.05');

    // 5. 全身OKサイン
    tl.to(head, { y: -3, duration: 0.15, yoyo: true, repeat: 1 });
    if (armLeft) tl.to(armLeft, { y: -4, duration: 0.15, yoyo: true, repeat: 1 }, '<');
    if (armRight) tl.to(armRight, { y: -4, duration: 0.15, yoyo: true, repeat: 1 }, '<');
  }
}

// =========================================================================
// 4. EMOTIONS & SOCIAL (感情表現・コミュニケーション)
// =========================================================================

/**
 * 19. 勝利の歓喜ガッツポーズ (Victory Cheer)
 */
export class VictoryCheerAnimation extends BaseRobotAnimation {
  id = 'victory_cheer';
  name = '勝利のガッツポーズ (Victory Cheer)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.6;
  loop = true;
  description = '右腕を高く突き上げてガッツポーズ！ピョンピョン跳ねながらキラキラ星を振りまいて大喜び。';
  technicalHighlights = [
    '右腕 (ArmRight) の力強いハイパンチガッツポーズ (Rotation: -85deg)',
    '左腕 (ArmLeft) の腰部安定ポーズ',
    '連続バウンスジャンプ＆Sparklesパーティクルの祝賀明滅'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, arms, armLeft, armRight, legs, legLeft, legRight, sparkles } = refs;

    if (sparkles) {
      tl.to(sparkles, { opacity: 1, duration: 0.3 });
    }

    // 右手を上げてジャンプ！
    tl.to(head, { y: -4, rotation: -8, duration: 0.25 }, '<')
      .to(container, { y: -18, duration: 0.25, ease: 'power2.out' }, '<');

    if (armRight) tl.to(armRight, { rotation: 80, y: -18, scaleY: 1.15, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -30, y: -4, duration: 0.25, ease: 'power2.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -65, y: -16, scaleY: 1.15, duration: 0.25, ease: 'back.out(2)' }, '<');

    if (legLeft) tl.to(legLeft, { scaleY: 1.1, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 1.1, duration: 0.2 }, '<');

    // 連続ホップ
    tl.to(container, { y: 0, duration: 0.2, ease: 'bounce.out' })
      .to(container, { y: -12, duration: 0.18, ease: 'power2.out' })
      .to(head, { rotation: 8, duration: 0.18 }, '<')
      .to(container, { y: 0, duration: 0.2, ease: 'bounce.out' });

    // ガッツポーズ決め
    if (armRight) tl.to(armRight, { rotation: 90, scale: 1.15, duration: 0.2, ease: 'back.out(2)' });
    if (armLeft) tl.to(armLeft, { rotation: -40, duration: 0.2 }, '<');
    tl.to(head, { y: -2, rotation: 0, duration: 0.2 }, '<');

    tl.to({}, { duration: 0.3 });

    if (sparkles) tl.to(sparkles, { opacity: 0, duration: 0.25 }, '<');

    const allTargets = [container, head, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

/**
 * 20. パニック・オーバーヒート (Panic Troubled)
 */
export class PanicTroubledAnimation extends BaseRobotAnimation {
  id = 'panic_troubled';
  name = 'パニック・オーバーヒート (Panic)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.6;
  loop = true;
  description = '両手で頭を抱えて右往左往！冷却が追いつかずオーバーヒート気味にオロオロ激しく震える。';
  technicalHighlights = [
    '左右腕 (ArmLeft/ArmRight) の独立頭部抱え込みポジション',
    '高周波左右ジッターシェイク (X: ±6px, Freq: 20Hz)',
    'Bodyの温度上昇風のパルス'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, arms, armLeft, armRight, legLeft, legRight } = refs;

    // 頭を抱える
    tl.to(head, { y: 4, scale: 0.95, duration: 0.25 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 45, x: 8, y: -14, duration: 0.25, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: -45, x: -8, y: -14, duration: 0.25, ease: 'power2.out' }, '<');
    if (legLeft) tl.to(legLeft, { rotation: -20, x: -4, duration: 0.25 }, '<');
    if (legRight) tl.to(legRight, { rotation: 20, x: 4, duration: 0.25 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -110, y: -18, scaleX: 0.9, duration: 0.25, ease: 'power2.out' }, '<');

    // パニックオロオロ振動
    tl.to(container, {
      x: 'random(-6, 6)',
      y: 'random(-2, 2)',
      rotation: 'random(-5, 5)',
      repeat: 12,
      duration: 0.06,
      ease: 'none'
    });

    // ため息・脱力復帰
    tl.to(head, { y: 6, rotation: 10, duration: 0.3, ease: 'power2.out' });
    const allTargets = [container, head, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1,
      duration: 0.35,
      ease: 'power2.out'
    }, '<0.15');
  }
}

/**
 * 21. 礼儀正しい一礼・おじぎ (Polite Bow)
 */
export class PoliteBowAnimation extends BaseRobotAnimation {
  id = 'polite_bow';
  name = '職人への一礼・敬礼 (Polite Bow)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.8;
  loop = true;
  description = '背筋をまっすぐに伸ばし、職人へ感謝を込めて丁寧なおじぎをして敬礼。';
  technicalHighlights = [
    'クリーンな多関節連動による美しい90度おじぎ',
    'おじぎ最深部での静止時間（マナー表現）',
    '復帰時のスマートな背筋伸長'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legLeft, legRight } = refs;

    // 気をつけ姿勢
    if (armLeft) tl.to(armLeft, { rotation: 10, y: 2, duration: 0.2, ease: 'power1.out' });
    if (armRight) tl.to(armRight, { rotation: -10, y: 2, duration: 0.2, ease: 'power1.out' }, '<');
    if (legLeft) tl.to(legLeft, { scaleY: 0.95, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.95, duration: 0.2 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 10, y: 2, duration: 0.2, ease: 'power1.out' });

    // 丁寧におじぎ
    tl.to(container, { y: 6, duration: 0.4, ease: 'power2.inOut' })
      .to(body, { rotation: 18, duration: 0.4, ease: 'power2.inOut' }, '<')
      .to(head, { rotation: 28, y: 8, duration: 0.4, ease: 'power2.inOut' }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 20, y: 6, duration: 0.4, ease: 'power2.inOut' }, '<');
    if (armRight) tl.to(armRight, { rotation: 20, y: 6, duration: 0.4, ease: 'power2.inOut' }, '<');

    // 最深部で静止
    tl.to({}, { duration: 0.4 });

    // スッと起き上がる
    const allTargets = [container, body, head, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
}

/**
 * 22. 拍手喝采・ハンドクラップ (Applause Clap)
 */
export class ApplauseClapAnimation extends BaseRobotAnimation {
  id = 'applause_clap';
  name = '拍手喝采・クラップ (Applause Clap)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.6;
  loop = true;
  description = '左右のアームを正面でパチパチと打ち合わせ、仲間を称える拍手喝采。';
  technicalHighlights = [
    '左腕 (ArmLeft) と右腕 (ArmRight) の正面対向クラップスイング (Freq: 8Hz)',
    'Bodyの拍手リズムに合わせた微小なノリ',
    'Headの笑顔風アップ'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, body, arms, armLeft, armRight, legLeft, legRight } = refs;

    // 手を前に構える
    tl.to(head, { y: -2, duration: 0.2 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 25, x: 6, y: -6, duration: 0.2, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: -25, x: -6, y: -6, duration: 0.2, ease: 'power2.out' }, '<');
    if (legLeft) tl.to(legLeft, { y: -2, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { y: -2, duration: 0.2 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 35, y: -8, duration: 0.2, ease: 'power2.out' }, '<');

    // 連続拍手クラップ
    const clapTl = gsap.timeline({ repeat: 5 });
    if (armLeft && armRight) {
      clapTl
        .to(armLeft, { rotation: 45, x: 12, duration: 0.08, ease: 'power2.in' })
        .to(armRight, { rotation: -45, x: -12, duration: 0.08, ease: 'power2.in' }, '<')
        .to(armLeft, { rotation: 20, x: 4, duration: 0.08, ease: 'power2.out' })
        .to(armRight, { rotation: -20, x: -4, duration: 0.08, ease: 'power2.out' }, '<')
        .to(body, { y: -2, duration: 0.08, yoyo: true }, '<');
    } else if (arms) {
      clapTl
        .to(arms, { scaleX: 0.8, duration: 0.08, ease: 'power2.in' })
        .to(arms, { scaleX: 1.15, duration: 0.08, ease: 'power2.out' })
        .to(body, { y: -2, duration: 0.08, yoyo: true }, '<');
    }

    tl.add(clapTl);

    // 復帰
    const allTargets = [head, body, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

/**
 * 23. 好奇心旺盛な首かしげ (Curious Tilt)
 */
export class CuriousTiltAnimation extends BaseRobotAnimation {
  id = 'curious_tilt';
  name = '好奇心の首かしげ (Curious Tilt)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.8;
  loop = true;
  description = '興味深そうに首をピクッと左右に傾げ、未知の素材やマスターの手元をじっと観察。';
  technicalHighlights = [
    'Back.out によるキレのある首傾げ動作 (Rotation: -28 / +28deg)',
    '目の焦点合わせを意識したBodyの寄り',
    'ピコッと反応するアンテナ表現'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, armLeft, armRight, legLeft, legRight } = refs;

    // 左に首をかしげる
    tl.to(head, { rotation: -26, x: -3, y: -2, duration: 0.3, ease: 'back.out(2)' })
      if (armLeft) tl.to(armLeft, { rotation: -15, y: -2, duration: 0.3 }, '<')
      if (armRight) tl.to(armRight, { rotation: 10, y: 2, duration: 0.3 }, '<')
      .to(container, { x: 2, duration: 0.3 }, '<');

    tl.to({}, { duration: 0.35 });

    // 右に首をかしげ直す
    tl.to(head, { rotation: 26, x: 3, y: -2, duration: 0.35, ease: 'back.out(2)' });
    if (armLeft) tl.to(armLeft, { rotation: 15, y: 2, duration: 0.35 }, '<');
    if (armRight) tl.to(armRight, { rotation: -10, y: -2, duration: 0.35 }, '<');

    tl.to({}, { duration: 0.35 });

    // 正面に戻る
    tl.to([container, head], {
      x: 0, y: 0, rotation: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

/**
 * 24. 力強い納得の頷き (Nod Agree)
 */
export class NodAgreeAnimation extends BaseRobotAnimation {
  id = 'nod_agree';
  name = '納得の力強い頷き (Nod Agree)';
  category = RobotAnimationCategory.EMOTION;
  duration = 1.6;
  loop = true;
  description = '「了解！」「任せて！」と力強くコクコクと2回頷き、頼もしく合図を送る。';
  technicalHighlights = [
    '2段の力強い垂直Nodイージング (Power3.inOut)',
    '左右腕の力強いサムズアップ風ガッツ連動',
    'キリッとした姿勢保持'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { head, arms, armLeft, armRight, legLeft, legRight } = refs;

    // 1回目の頷き
    tl.to(head, { y: 8, rotation: 12, duration: 0.2, ease: 'power2.in' });
    if (armLeft) tl.to(armLeft, { y: -4, rotation: -12, duration: 0.2 }, '<');
    if (armRight) tl.to(armRight, { y: -4, rotation: 12, duration: 0.2 }, '<');
    if (legLeft) tl.to(legLeft, { y: 2, scaleY: 0.9, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { y: 2, scaleY: 0.9, duration: 0.2 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { y: -4, rotation: -15, duration: 0.2 }, '<');
    tl.to(head, { y: -2, rotation: 0, duration: 0.2, ease: 'power2.out' });

    // 2回目の力強い頷き
    tl.to(head, { y: 10, rotation: 15, duration: 0.18, ease: 'power2.in' });
    if (armLeft) tl.to(armLeft, { y: -6, rotation: -20, scale: 1.05, duration: 0.18 }, '<');
    if (armRight) tl.to(armRight, { y: -6, rotation: 20, scale: 1.05, duration: 0.18 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { y: -6, rotation: -25, scale: 1.05, duration: 0.18 }, '<');
    tl.to(head, { y: 0, rotation: 0, duration: 0.25, ease: 'back.out(2)' });

    // 復帰
    const allTargets = [head, arms, armLeft, armRight].filter(Boolean);
    tl.to(allTargets, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

// =========================================================================
// REGISTRY & CONTROLLER (OOP管理クラス)
// =========================================================================

/**
 * GSAPロボットアニメーションの登録・管理レジストリ (Singleton)
 */

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

export class GSAPRobotAnimationRegistry {

  private static instance: GSAPRobotAnimationRegistry;
  private patterns: Map<string, IRobotAnimationPattern> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): GSAPRobotAnimationRegistry {
    if (!GSAPRobotAnimationRegistry.instance) {
      GSAPRobotAnimationRegistry.instance = new GSAPRobotAnimationRegistry();
    }
    return GSAPRobotAnimationRegistry.instance;
  }

  private registerDefaults(): void {
    const defaultPatterns: IRobotAnimationPattern[] = [
      // 1. COMBAT
      new SlashComboAnimation(),
      new DualSlashComboAnimation(),
      new BeamCannonAnimation(),
      new GatlingBurstAnimation(),
      new RocketPunchAnimation(),
      new ShieldBarrierAnimation(),
      new GunslingerStanceAnimation(),
      new SniperAimAnimation(),

      // 2. ACROBATICS & SPECIALS
      new SpringJumpAnimation(),
      new BreakdanceAnimation(),
      new ExplodedViewAnimation(),
      new OverdriveAnimation(),
      new JetDashAnimation(),
      new FlyingKickAnimation(),
      new DynamicMarchSprintAnimation(),
      new SpinTornadoAnimation(),

      // 3. MECHANICAL
      new PrecisionScanAnimation(),
      new BioBreathingAnimation(),
      new HoverFlightAnimation(),
      new FastRechargeAnimation(),
      new SleepStandbyAnimation(),
      new CalibrationAnimation(),

      // 4. EMOTIONS
      new VictoryCheerAnimation(),
      new PanicTroubledAnimation(),
      new PoliteBowAnimation(),
      new ApplauseClapAnimation(),
      new CuriousTiltAnimation(),
      new NodAgreeAnimation(),
    new BanzaiCheerAnimation(),
    new YayRejoiceAnimation(),
    new MissileBarrageAnimation(),
    new TwinBeamShootAnimation(),
    ];

    defaultPatterns.forEach(pattern => this.patterns.set(pattern.id, pattern));
  }

  public getPattern(id: string): IRobotAnimationPattern | undefined {
    return this.patterns.get(id);
  }

  public getAllPatterns(): IRobotAnimationPattern[] {
    return Array.from(this.patterns.values());
  }

  public getPatternsByCategory(category: RobotAnimationCategory): IRobotAnimationPattern[] {
    return this.getAllPatterns().filter(p => p.category === category);
  }
}

/**
 * GSAPアニメーションの実行・再生・速度制御を担うコントローラークラス
 */
export class GSAPRobotAnimationController {
  private timeline: gsap.core.Timeline | null = null;
  private currentPattern: IRobotAnimationPattern | null = null;
  private refs: RobotDOMRefs | null = null;
  private timeScale: number = 1.0;
  private isLooping: boolean = true;
  private onProgressCallback?: (progress: number) => void;
  private onCompleteCallback?: () => void;

  constructor() {}

  /**
   * DOM参照とアニメーションパターンをバインドして再生を開始
   */
  public playPattern(
    pattern: IRobotAnimationPattern,
    refs: RobotDOMRefs,
    options: {
      timeScale?: number;
      loop?: boolean;
      onProgress?: (progress: number) => void;
      onComplete?: () => void;
    } = {}
  ): void {
    try {
      this.kill();

      this.currentPattern = pattern;
      this.refs = refs;
      this.timeScale = options.timeScale ?? this.timeScale;
      this.isLooping = options.loop ?? pattern.loop;
      this.onProgressCallback = options.onProgress;
      this.onCompleteCallback = options.onComplete;

      // タイムライン構築
      this.timeline = gsap.timeline({
        repeat: this.isLooping ? -1 : 0,
        repeatDelay: 0.15,
        onUpdate: () => {
          if (this.timeline && this.onProgressCallback) {
            this.onProgressCallback(this.timeline.progress());
          }
        },
        onComplete: () => {
          if (this.onCompleteCallback) {
            this.onCompleteCallback();
          }
        }
      });

      this.timeline.timeScale(this.timeScale);
      pattern.build(refs, this.timeline);
    } catch (err) {
      console.error(`[GSAPRobotAnimationController] Failed to play pattern '${pattern?.id}':`, err);
    }
  }

  public setTimeScale(scale: number): void {
    this.timeScale = scale;
    if (this.timeline) {
      this.timeline.timeScale(scale);
    }
  }

  public setLoop(loop: boolean): void {
    this.isLooping = loop;
    if (this.timeline) {
      this.timeline.repeat(loop ? -1 : 0);
    }
  }

  public pause(): void {
    if (this.timeline) {
      this.timeline.pause();
    }
  }

  public resume(): void {
    if (this.timeline) {
      this.timeline.resume();
    }
  }

  public restart(): void {
    if (this.timeline) {
      this.timeline.restart();
    }
  }

  public seek(progress: number): void {
    if (this.timeline) {
      const clamped = Math.max(0, Math.min(1, progress));
      this.timeline.progress(clamped);
      if (this.onProgressCallback) {
        this.onProgressCallback(clamped);
      }
    }
  }

  public stepForward(step: number = 0.05): void {
    if (this.timeline) {
      this.timeline.pause();
      const nextProgress = Math.min(1, this.timeline.progress() + step);
      this.seek(nextProgress);
    }
  }

  public stepBackward(step: number = 0.05): void {
    if (this.timeline) {
      this.timeline.pause();
      const prevProgress = Math.max(0, this.timeline.progress() - step);
      this.seek(prevProgress);
    }
  }

  public isPaused(): boolean {
    return this.timeline ? this.timeline.paused() : false;
  }

  public getCurrentPattern(): IRobotAnimationPattern | null {
    return this.currentPattern;
  }

  public getTimeline(): gsap.core.Timeline | null {
    return this.timeline;
  }

  public kill(): void {
    try {
      if (this.timeline) {
        this.timeline.kill();
        this.timeline = null;
      }
      if (this.refs) {
        const targets = [
          this.refs.container,
          this.refs.head,
          this.refs.body,
          this.refs.arms,
          this.refs.legs,
          this.refs.armLeft,
          this.refs.armRight,
          this.refs.legLeft,
          this.refs.legRight,
          this.refs.scanLine,
          this.refs.auraOverlay,
          this.refs.sparkles
        ].filter(Boolean);
        if (targets.length > 0) {
          gsap.killTweensOf(targets);
          gsap.set(targets, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            opacity: 1,
            clearProps: 'transform,opacity,filter'
          });
        }
      }
    } catch (err) {
      console.error('[GSAPRobotAnimationController] Error during kill cleanup:', err);
    }
  }
}
