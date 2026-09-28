import React from 'react';
import * as Gi from 'react-icons/gi';
import robotsWorkshopBg from '../../assets/images/robots_workshop_bg_1788411232885.jpg';

interface TabBackgroundProps {
  activeView: string;
}

/**
 * タブ内画面背景管理コンポーネント (TabBackground)
 * 
 * ユーザー指定仕様：
 * 1. 背景画像は画面を切り替えても全ての画面で統一して常時表示。
 *    （ダッシュボード、遠征、製造、依頼、倉庫、バトル、図鑑、記録、ライトペーパー等の全画面で統一）
 * 2. 動作軽量化対応（常時パーティクルアニメーションの排除＆ブレンド計算最適化）：
 *    全画面背後での毎フレームCanvasアニメーション（requestAnimationFrame描画ループ）を完全撤去し、
 *    GPU/CPU負荷・バッテリー消費を0%へと徹底軽量化。
 *    さらにCSS mix-blend-multiplyを排除して静的テクスチャ合成へと最適化し、
 *    スマートフォンやモバイル環境でも一切カクつかず軽快にスクロール・操作できるようにチューニング。
 * 3. 前面UIのテキスト・カード可読性を守りつつ、温かみある工房アートを上品に美しく表現。
 */
export const TabBackground: React.FC<TabBackgroundProps> = ({ activeView }) => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* ========================================================
          1. 全画面共通・静的軽量工房背景レイヤー:
             待機ロボットが並ぶ工房アートを全画面で常時統一表示（アニメーションなし・負荷ゼロ）
         ======================================================== */}
      <div className="absolute inset-0">
        {/* ベースの温かみある下地カラー */}
        <div className="absolute inset-0 bg-[#fbf6ee]" />

        {/* 待機ロボたちが並ぶ工房背景画像（軽量静的レンダリング） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={robotsWorkshopBg}
            alt=""
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-[center_35%] opacity-30"
          />
        </div>

        {/* 前面UIのテキスト・カード可読性を守りつつ背景イラストを引き立たせる乳白色グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f5]/60 via-[#fbf6ef]/40 to-[#f8f1e5]/65" />

        {/* 工房上部の穏やかな陰影ライン */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#8a5b28]/12 to-transparent border-b border-[#a8743a]/15" />

        {/* 左右の奥行きシャドウ（控えめ） */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#5c3e1e]/10 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-[#5c3e1e]/10 to-transparent" />

        {/* タブに応じた控えめなアンビエント小道具バッジ */}
        <div className="absolute bottom-20 left-4 opacity-20 hidden sm:flex items-center gap-2">
          <span className="text-[#7c4d12] flex items-center gap-1 text-[11px] font-mono font-bold bg-white/60 px-1.5 py-0.5 rounded border border-amber-400/30">
            {activeView === 'quest' ? (
              <>
                <Gi.GiRobotAntennas size={13} className="text-[#92400e]" />
                <span>EXPEDITION DOCK</span>
              </>
            ) : activeView === 'craft' ? (
              <>
                <Gi.GiAnvil size={13} className="text-[#92400e]" />
                <span>ASSEMBLY BENCH</span>
              </>
            ) : activeView === 'requests' ? (
              <>
                <Gi.GiScrollUnfurled size={13} className="text-[#92400e]" />
                <span>COMMISSION BOARD</span>
              </>
            ) : activeView === 'storage' ? (
              <>
                <Gi.GiCardboardBox size={13} className="text-[#92400e]" />
                <span>STORAGE BAY</span>
              </>
            ) : activeView === 'minigame' ? (
              <>
                <Gi.GiCrossedSwords size={13} className="text-[#92400e]" />
                <span>TEST ARENA</span>
              </>
            ) : (
              <>
                <Gi.GiGears size={13} className="text-[#92400e]" />
                <span>WORKSHOP BAY</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
