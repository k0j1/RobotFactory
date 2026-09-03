import React from 'react';
import * as Gi from 'react-icons/gi';
import robotsWorkshopBg from '../../assets/images/robots_workshop_bg_1788411232885.jpg';
import { WorkshopParticles } from './WorkshopParticles';

interface TabBackgroundProps {
  activeView: string;
}

/**
 * タブ内画面背景管理コンポーネント (TabBackground)
 * 
 * ユーザー指定仕様：
 * 1. 背景画像は画面を切り替えても全ての画面で統一して常時表示。
 *    （ダッシュボード、遠征、製造、依頼、倉庫、バトル、図鑑、記録、ライトペーパー等の全画面で統一）
 * 2. 透過を抑えて濃く調整：
 *    ロボットたちが作業台や充電ドックに並ぶ温かみある工房イラストがしっかり視認できるよう、
 *    画像の不透明度を最適化（opacity-38）し、オーバーレイの透明度も調整。
 * 3. ダッシュボード（dashboard）およびクラフト（craft/製造）画面に、
 *    微かに漂う浮遊微粒子・光のスパーク（floating dust motes & light sparks）の
 *    控えめで上品なアニメーションパーティクルエフェクトを展開。
 * 4. 画面切り替え時のDOM再マウント・チラつき・遅延が完全にゼロの常駐構造。
 */
export const TabBackground: React.FC<TabBackgroundProps> = ({ activeView }) => {
  // パーティクルエフェクトを表示する画面（dashboard & craft）
  const showParticles = activeView === 'dashboard' || activeView === 'craft';

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* ========================================================
          1. 全画面共通・統一工房背景レイヤー:
             遠征で使用している方の画像（待機ロボットが並ぶ工房アート）を全画面で常時統一表示
         ======================================================== */}
      <div className="absolute inset-0">
        {/* ベースの温かみある下地カラー */}
        <div className="absolute inset-0 bg-[#fbf6ee]" />

        {/* 待機ロボたちが並ぶ工房背景画像（透過を抑えてより濃くしっかり表示） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={robotsWorkshopBg}
            alt=""
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-[center_35%] opacity-38 mix-blend-multiply"
          />
        </div>

        {/* 前面UIのテキスト・カード可読性を守りつつ背景イラストを引き立たせる乳白色グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f5]/65 via-[#fbf6ef]/45 to-[#f8f1e5]/70" />

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

      {/* ========================================================
          2. 工房アニメーションパーティクルエフェクト:
             ダッシュボード（dashboard）およびクラフト（craft）画面で
             生き生きとした浮遊ダスト（dust motes）と光のスパーク（sparks）を演出
         ======================================================== */}
      <WorkshopParticles 
        active={showParticles} 
        particleCount={30}
      />
    </div>
  );
};
