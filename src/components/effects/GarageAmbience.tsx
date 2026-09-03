import React from 'react';
import * as Gi from 'react-icons/gi';

interface GarageAmbienceProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * 工房・ガレージアンビエンス背景
 * 金属製スチールシェルフ、ツールボックス（工具箱）、ペグボード（工具壁掛け）、
 * 作業台（ベンチバイス付き）、梁とレンガ壁を控えめなトーンで配置し、
 * 主張しすぎず背景に美しく溶け込むガレージの雰囲気を演出します。
 * （※不要な炎のアニメーションは排除し、視認性と落ち着きを最優先）
 */
export const GarageAmbience: React.FC<GarageAmbienceProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}>
      {/* 1. 赤レンガ壁のテクスチャ (Warm Brick Texture) */}
      <div 
        className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage: `
            linear-gradient(to right, #7a3524 1px, transparent 1px),
            linear-gradient(to bottom, #7a3524 1px, transparent 1px)
          `,
          backgroundSize: '36px 18px',
        }}
      />

      {/* 2. 温かみのあるアトリエ・ガレージトーン（レンガ×金属×木材）の光グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5ece2]/70 via-[#f8f1ea]/40 to-[#ece0d4]/80" />

      {/* 3. SVGイラストレーション（金属シェルフ、工具箱、ペグボード、木製梁、作業台） */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* レンガパターン */}
          <pattern id="brick-pat" width="40" height="20" patternUnits="userSpaceOnUse">
            <rect width="40" height="20" fill="none" stroke="#943f29" strokeWidth="0.8" opacity="0.3" />
            <line x1="20" y1="0" x2="20" y2="10" stroke="#943f29" strokeWidth="0.8" opacity="0.3" />
            <line x1="0" y1="10" x2="40" y2="10" stroke="#943f29" strokeWidth="0.8" opacity="0.3" />
            <line x1="10" y1="10" x2="10" y2="20" stroke="#943f29" strokeWidth="0.8" opacity="0.3" />
            <line x1="30" y1="10" x2="30" y2="20" stroke="#943f29" strokeWidth="0.8" opacity="0.3" />
          </pattern>

          {/* ペグボード（有孔ボード）穴パターン */}
          <pattern id="pegboard-pat" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1.2" fill="#3d2f26" opacity="0.4" />
          </pattern>

          {/* 木製梁のグラデーション */}
          <linearGradient id="wood-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#573218" />
            <stop offset="50%" stopColor="#6e3e1f" />
            <stop offset="100%" stopColor="#42230f" />
          </linearGradient>

          {/* 金属・スチールシェルフのグラデーション */}
          <linearGradient id="metal-steel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a423d" />
            <stop offset="50%" stopColor="#696058" />
            <stop offset="100%" stopColor="#3d3632" />
          </linearGradient>

          {/* 工具箱（ツールボックス）の落ち着いた工業用レッド */}
          <linearGradient id="tool-box-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9e3a2b" />
            <stop offset="50%" stopColor="#872e20" />
            <stop offset="100%" stopColor="#692015" />
          </linearGradient>

          {/* 石窯・炉（静かな石造り） */}
          <linearGradient id="stone-furnace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cfbeaa" />
            <stop offset="50%" stopColor="#b39f88" />
            <stop offset="100%" stopColor="#8f7b67" />
          </linearGradient>
        </defs>

        {/* 奥壁のレンガ塗り */}
        <rect x="0" y="0" width="800" height="500" fill="url(#brick-pat)" />

        {/* ================================================================= */}
        {/* 左奥: 工業用金属製スチールシェルフ (Industrial Metal Shelf Rack)   */}
        {/* ================================================================= */}
        <g id="metal-shelf" opacity="0.85">
          {/* シェルフの背面筋交い（Xブレース） */}
          <line x1="50" y1="140" x2="190" y2="280" stroke="#5a524c" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="190" y1="140" x2="50" y2="280" stroke="#5a524c" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="50" y1="280" x2="190" y2="440" stroke="#5a524c" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="190" y1="280" x2="50" y2="440" stroke="#5a524c" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* 縦の金属アングル支柱（4本） */}
          <rect x="48" y="110" width="6" height="360" fill="url(#metal-steel)" rx="1" />
          <rect x="186" y="110" width="6" height="360" fill="url(#metal-steel)" rx="1" />

          {/* アングル支柱のスリット穴装飾 */}
          {[130, 160, 190, 220, 250, 280, 310, 340, 370, 400, 430].map(y => (
            <g key={y}>
              <rect x="50" y={y} width="2" height="6" fill="#2d2723" opacity="0.5" />
              <rect x="188" y={y} width="2" height="6" fill="#2d2723" opacity="0.5" />
            </g>
          ))}

          {/* 棚板 1段目 (最上段 y=150) */}
          <rect x="44" y="150" width="152" height="6" fill="url(#metal-steel)" rx="1" />
          {/* 1段目の物品: スペアパーツ缶 & オイル缶 */}
          <rect x="65" y="125" width="18" height="25" rx="2" fill="#595048" />
          <rect x="70" y="121" width="8" height="4" fill="#3b352f" />
          <rect x="95" y="128" width="22" height="22" rx="3" fill="#8c6d46" />
          <path d="M 103,128 L 109,122 L 115,122 L 109,128 Z" fill="#695133" />
          {/* 小型パーツボックス */}
          <rect x="130" y="132" width="45" height="18" rx="2" fill="#474039" />
          <rect x="145" y="137" width="15" height="4" rx="1" fill="#756c63" />

          {/* 棚板 2段目 (中上段 y=230) */}
          <rect x="44" y="230" width="152" height="6" fill="url(#metal-steel)" rx="1" />
          {/* 2段目の物品: ポータブルスチール工具箱 (Classic Metal Toolbox) */}
          <g id="shelf-toolbox">
            {/* 本体 */}
            <rect x="60" y="200" width="65" height="30" rx="3" fill="url(#tool-box-red)" stroke="#4d160f" strokeWidth="1" />
            {/* 上蓋の段差 */}
            <path d="M 60,210 L 125,210" stroke="#b54b3c" strokeWidth="1.5" />
            {/* 留め金ラッチ */}
            <rect x="75" y="208" width="6" height="5" fill="#d4af37" rx="0.5" />
            <rect x="104" y="208" width="6" height="5" fill="#d4af37" rx="0.5" />
            {/* ハンドル */}
            <path d="M 86,200 L 86,195 L 99,195 L 99,200" fill="none" stroke="#2b1f1d" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* スプレー缶と瓶 */}
          <rect x="140" y="202" width="12" height="28" rx="2" fill="#3c5266" />
          <rect x="143" y="197" width="6" height="5" fill="#1e2c38" />
          <rect x="160" y="210" width="16" height="20" rx="2" fill="#7a624d" />

          {/* 棚板 3段目 (中下段 y=310) */}
          <rect x="44" y="310" width="152" height="6" fill="url(#metal-steel)" rx="1" />
          {/* 引き出し式パーツキャビネット (コンポーネント整理ケース) */}
          <g id="parts-cabinet">
            <rect x="60" y="260" width="70" height="50" rx="2" fill="#36322e" stroke="#24211e" strokeWidth="1" />
            {/* 6マスの引き出し */}
            <rect x="64" y="265" width="28" height="11" rx="1" fill="#524d47" />
            <rect x="98" y="265" width="28" height="11" rx="1" fill="#524d47" />
            <rect x="64" y="280" width="28" height="11" rx="1" fill="#524d47" />
            <rect x="98" y="280" width="28" height="11" rx="1" fill="#524d47" />
            <rect x="64" y="295" width="28" height="11" rx="1" fill="#524d47" />
            <rect x="98" y="295" width="28" height="11" rx="1" fill="#524d47" />
          </g>
          {/* スペアギア（歯車）のシルエット */}
          <circle cx="155" cy="285" r="15" fill="none" stroke="#635950" strokeWidth="5" strokeDasharray="6 3" />
          <circle cx="155" cy="285" r="5" fill="#635950" />

          {/* 棚板 4段目 (最下段 y=390) */}
          <rect x="44" y="390" width="152" height="6" fill="url(#metal-steel)" rx="1" />
          {/* 重厚なスチールコンテナ箱 */}
          <rect x="58" y="348" width="60" height="42" rx="2" fill="#423b36" />
          <line x1="58" y1="365" x2="118" y2="365" stroke="#292522" strokeWidth="1.5" />
          <line x1="88" y1="348" x2="88" y2="390" stroke="#292522" strokeWidth="1.5" />
          {/* 積まれた金属パーツ */}
          <rect x="130" y="360" width="48" height="30" rx="2" fill="#544c44" />
        </g>

        {/* ================================================================= */}
        {/* 右奥: 有孔ボード（ペグボード壁面工具掛け） & 大型ツールチェスト    */}
        {/* ================================================================= */}
        <g id="pegboard-and-chest" opacity="0.85">
          {/* ペグボード本体パネル */}
          <rect x="610" y="120" width="140" height="160" rx="4" fill="#decab4" stroke="#876b52" strokeWidth="2" />
          <rect x="610" y="120" width="140" height="160" fill="url(#pegboard-pat)" rx="4" />

          {/* 有孔ボードに掛かった工具シルエット */}
          {/* 1. モンキーレンチ / スパナ */}
          <g id="peg-wrench" transform="translate(628, 140) rotate(-15)">
            <rect x="0" y="5" width="6" height="45" rx="1.5" fill="#423933" />
            <circle cx="3" cy="5" r="7" fill="none" stroke="#423933" strokeWidth="4" />
            <circle cx="3" cy="50" r="5" fill="#423933" />
          </g>

          {/* 2. 金属ハンマー (Machinist Hammer) */}
          <g id="peg-hammer" transform="translate(665, 135)">
            <rect x="4" y="8" width="5" height="52" rx="1" fill="#754728" />
            <rect x="0" y="0" width="22" height="10" rx="2" fill="#47413c" />
          </g>

          {/* 3. プライヤー / ペンチ */}
          <g id="peg-pliers" transform="translate(710, 140)">
            <path d="M 0,20 L 5,0 L 10,0 L 15,20 L 11,55 L 7,22 L 4,55 Z" fill="#8c3325" />
            <circle cx="7" cy="18" r="2.5" fill="#3d3733" />
          </g>

          {/* 4. 丸型ソー / スプロケット */}
          <circle cx="640" cy="235" r="14" fill="none" stroke="#524a43" strokeWidth="4" strokeDasharray="5 2.5" />
          <circle cx="640" cy="235" r="4" fill="#524a43" />

          {/* 5. 水準器 / 定規 */}
          <rect x="670" y="225" width="65" height="9" rx="1" fill="#b08a3e" stroke="#6e5421" strokeWidth="1" />
          <circle cx="702" cy="229.5" r="2.5" fill="#72b8c9" />

          {/* ペグボード下: ガレージ用スチールツールキャビネット (Rollaway Tool Chest) */}
          <g id="tool-cabinet" transform="translate(600, 290)">
            {/* キャビネット本体外枠 */}
            <rect x="0" y="0" width="160" height="150" rx="4" fill="url(#tool-box-red)" stroke="#4a1711" strokeWidth="2" />
            {/* トップトレイ枠 */}
            <rect x="4" y="4" width="152" height="8" rx="1" fill="#2e2725" />

            {/* 引き出し 1段目 (薄型) */}
            <rect x="8" y="20" width="144" height="18" rx="2" fill="#a83a2a" stroke="#521811" strokeWidth="1" />
            <rect x="50" y="26" width="60" height="5" rx="1" fill="#dfd7cf" />

            {/* 引き出し 2段目 (中型) */}
            <rect x="8" y="44" width="144" height="24" rx="2" fill="#a83a2a" stroke="#521811" strokeWidth="1" />
            <rect x="50" y="53" width="60" height="5" rx="1" fill="#dfd7cf" />

            {/* 引き出し 3段目 (中型) */}
            <rect x="8" y="74" width="144" height="26" rx="2" fill="#a83a2a" stroke="#521811" strokeWidth="1" />
            <rect x="50" y="84" width="60" height="5" rx="1" fill="#dfd7cf" />

            {/* 引き出し 4段目 (大型深底) */}
            <rect x="8" y="106" width="144" height="34" rx="2" fill="#a83a2a" stroke="#521811" strokeWidth="1" />
            <rect x="50" y="120" width="60" height="5" rx="1" fill="#dfd7cf" />

            {/* キャスター車輪 */}
            <rect x="14" y="150" width="16" height="12" rx="3" fill="#24201e" />
            <rect x="130" y="150" width="16" height="12" rx="3" fill="#24201e" />
          </g>
        </g>

        {/* ================================================================= */}
        {/* 中央奥: ガレージ石窯・熱処理炉（炎なし・静かで落ち着いた佇まい）  */}
        {/* ================================================================= */}
        <g id="stone-kiln-structure" opacity="0.8">
          {/* 金属製排気ダクト・煙突部 */}
          <path d="M 378,80 L 422,80 L 430,220 L 370,220 Z" fill="url(#metal-steel)" stroke="#3b332d" strokeWidth="2" />
          {/* ダクトのリベット・バンド */}
          <rect x="372" y="120" width="56" height="6" fill="#302a25" rx="1" />
          <rect x="368" y="170" width="64" height="6" fill="#302a25" rx="1" />

          {/* 石造り窯ドーム外殻 */}
          <path 
            d="M 330,440 L 330,310 C 330,210 470,210 470,310 L 470,440 Z" 
            fill="url(#stone-furnace)" 
            stroke="#57483b" 
            strokeWidth="2.5" 
          />
          {/* 石組みのアクセントライン */}
          <path d="M 355,260 Q 375,250 400,265" fill="none" stroke="#57483b" strokeWidth="1.5" />
          <path d="M 415,250 Q 435,260 450,245" fill="none" stroke="#57483b" strokeWidth="1.5" />
          <path d="M 345,310 Q 370,300 385,320" fill="none" stroke="#57483b" strokeWidth="1.5" />
          <path d="M 425,305 Q 445,315 460,295" fill="none" stroke="#57483b" strokeWidth="1.5" />

          {/* 炉の開口部（炎アニメーションはなく、黒い耐火レンガの内奥） */}
          <path 
            d="M 365,370 A 35,35 0 0,1 435,370 L 435,410 L 365,410 Z" 
            fill="#261a14" 
            stroke="#452719" 
            strokeWidth="2.5" 
          />
          {/* 炉内の静かな残り火の気配（微かな温かみのみ、アニメーションなし） */}
          <ellipse cx="400" cy="402" rx="26" ry="6" fill="#692b11" opacity="0.45" />

          {/* 窯の手前に整頓された耐火レンガと薪 */}
          <rect x="365" y="415" width="22" height="10" rx="1" fill="#8f432e" stroke="#542114" strokeWidth="1" />
          <rect x="390" y="415" width="22" height="10" rx="1" fill="#9c4c36" stroke="#542114" strokeWidth="1" />
          <rect x="415" y="415" width="22" height="10" rx="1" fill="#873e2b" stroke="#542114" strokeWidth="1" />
          <rect x="378" y="425" width="22" height="10" rx="1" fill="#9c4c36" stroke="#542114" strokeWidth="1" />
          <rect x="402" y="425" width="22" height="10" rx="1" fill="#8f432e" stroke="#542114" strokeWidth="1" />
        </g>

        {/* ================================================================= */}
        {/* 手前: ヘビーデューティー木製天板＆金属脚の作業台 (Heavy Workbench)*/}
        {/* ================================================================= */}
        <g id="workbench-silhouette" opacity="0.38">
          {/* 天板（厚みのあるタフな木製ワークトップ） */}
          <rect x="235" y="380" width="330" height="16" rx="2" fill="#4d301b" stroke="#361f10" strokeWidth="1.5" />
          <line x1="235" y1="384" x2="565" y2="384" stroke="#694327" strokeWidth="1" />

          {/* 作業台上の卓上万力（ベンチバイス） */}
          <g id="bench-vise" transform="translate(250, 355)">
            <rect x="5" y="15" width="25" height="10" rx="1" fill="#38322e" />
            <rect x="0" y="8" width="10" height="14" rx="1" fill="#292421" />
            <rect x="18" y="8" width="10" height="14" rx="1" fill="#292421" />
            {/* スクリューハンドル */}
            <line x1="23" y1="5" x2="23" y2="25" stroke="#706963" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* 作業台の頑丈な金属脚部 */}
          <rect x="250" y="396" width="10" height="85" fill="#36302c" rx="1" />
          <rect x="280" y="396" width="8" height="85" fill="#36302c" rx="1" />
          <rect x="510" y="396" width="8" height="85" fill="#36302c" rx="1" />
          <rect x="540" y="396" width="10" height="85" fill="#36302c" rx="1" />
          {/* 脚部補強ビーム */}
          <rect x="250" y="445" width="300" height="7" fill="#2b2622" rx="1" />
        </g>

        {/* ================================================================= */}
        {/* 天井: 木製の梁 & 工業用ペンダントライト (Industrial Ceiling)        */}
        {/* ================================================================= */}
        {/* 吊り下げペンダントランプ */}
        <g id="hanging-lamp" opacity="0.75">
          <line x1="320" y1="0" x2="320" y2="90" stroke="#2b231d" strokeWidth="1.8" />
          <path d="M 295,110 L 345,110 L 335,90 L 305,90 Z" fill="#2d2621" stroke="#1c1613" strokeWidth="1.5" />
          <polygon points="320,110 240,290 400,290" fill="#fff5d9" opacity="0.06" />
        </g>

        {/* 天井の木製の梁 1 (左から斜め) */}
        <polygon 
          points="250,0 300,0 410,180 360,180" 
          fill="url(#wood-beam)" 
          stroke="#361a0a" 
          strokeWidth="2" 
          opacity="0.8" 
        />
        {/* 天井の木製の梁 2 (右から斜め) */}
        <polygon 
          points="570,0 620,0 740,160 690,160" 
          fill="url(#wood-beam)" 
          stroke="#361a0a" 
          strokeWidth="2" 
          opacity="0.8" 
        />
        {/* 左上の梁 3 */}
        <polygon 
          points="30,0 70,0 170,130 130,130" 
          fill="url(#wood-beam)" 
          stroke="#361a0a" 
          strokeWidth="2" 
          opacity="0.8" 
        />
      </svg>

      {/* 4. 工房隅のガレージ道具・装飾小道具（控えめに配置し邪魔をしない） */}
      <div className="absolute bottom-2 left-3 opacity-30 flex items-center gap-2">
        <Gi.GiToolbox size={22} className="text-[#8c3328]" title="携帯用スチール工具箱" />
        <Gi.GiOilDrum size={22} className="text-[#4a423d]" title="オイル缶" />
        <Gi.GiWoodPile size={22} className="text-[#5c371d]" title="木材・薪" />
      </div>
      <div className="absolute bottom-2 right-3 opacity-30 flex items-center gap-2">
        <Gi.GiWrench size={20} className="text-[#4a423d]" title="レンチ" />
        <Gi.GiGearHammer size={22} className="text-[#5c371d]" title="ギアとハンマー" />
        <Gi.GiGears size={22} className="text-[#695d52]" title="予備ギア" />
      </div>
    </div>
  );
};
