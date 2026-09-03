import React from 'react';
import * as Gi from 'react-icons/gi';
import garageRobotBg from '../../assets/images/garage_robot_bg_1788408702466.jpg';

interface GarageAmbienceProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * 工房・ガレージアンビエンス背景
 * ユーザー提示画像のガレージ構図（オープンシャッター、奥の大型金属製スチールシェルフ、
 * ダンボール・パーツ箱、右手の赤い大型ツールチェスト・作業台、壁掛け工具、磨かれたコンクリート床）に基づき、
 * 中央の車の位置を「佇むポンコツロボット」に置き換えたビジュアルを背景として統合。
 * 前面UIのテキスト・ステータス数値の視認性（WCAG AA）を最優先するため、
 * 背景アートは主張しすぎない控えめな透過度（opacity 0.22）と柔らかな乳白色グラデーションオーバーレイで上品に薄く表示。
 * ※炎のアニメーションは排除し、静かで洗練されたガレージ空間を表現。
 */
export const GarageAmbience: React.FC<GarageAmbienceProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}>
      {/* 1. ベースの暖かなガレージ下地カラー（清潔感のある明るいクリームトーン） */}
      <div className="absolute inset-0 bg-[#fcf9f5]" />

      {/* 2. ガレージ＆ロボットのメイン背景アート画像（車の位置にロボットが佇む高精細ガレージイラスト） */}
      {/* 文字がくっきり読めるよう透過度を薄め（opacity-22）に設定 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={garageRobotBg}
          alt="Garage with Robot Workshop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_42%] opacity-22 mix-blend-multiply transition-opacity duration-300"
        />
      </div>

      {/* 3. 前面UIの文字可読性を確保するソフトオーバーレイ（文字の視認性を高める乳白グラデーション） */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f5]/75 via-[#fcf8f3]/55 to-[#f8f1e5]/80" />

      {/* 4. 上部ロールアップシャッター枠とオーバードアレールのデザインアクセント（淡いシャドウに調整） */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#3a322c]/10 to-transparent border-b border-[#5a4838]/10 flex items-center justify-center">
        {/* シャッターの水平スリットライン */}
        <div className="w-full h-[1px] bg-[#6d5a49]/10" />
      </div>

      {/* 左右のガレージ柱の微かなシャドウ（開口部の奥行き感を控えめに表現） */}
      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#2f251d]/08 to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-[#2f251d]/08 to-transparent" />

      {/* 5. 磨かれたコンクリート床の目地（フロアグリッド反射ライン - 控えめな透過度） */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #403429 1px, transparent 1px),
            linear-gradient(to bottom, #403429 1px, transparent 1px)
          `,
          backgroundSize: '80px 40px',
        }}
      />

      {/* 6. ガレージらしさを控えめに添える小道具アクセント（両端下部、文字の邪魔にならない淡い透過度） */}
      <div className="absolute bottom-2 left-3 opacity-15 flex items-center gap-2">
        <span className="text-[#872d20] flex items-center gap-1 text-[11px] font-mono font-bold bg-white/50 px-1.5 py-0.5 rounded border border-stone-400/20">
          <Gi.GiToolbox size={13} className="text-[#9e3323]" />
          <span>TOOL BAY</span>
        </span>
      </div>
      <div className="absolute bottom-2 right-3 opacity-15 flex items-center gap-2">
        <span className="text-[#3b322a] flex items-center gap-1 text-[11px] font-mono font-bold bg-white/50 px-1.5 py-0.5 rounded border border-stone-400/20">
          <Gi.GiGears size={13} className="text-[#594d42]" />
          <span>GEAR RACK</span>
        </span>
      </div>
    </div>
  );
};
