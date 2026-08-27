import React from 'react';
import { Card, Button } from '../components/ui/core';
import { theme } from '../styles/theme';

export const LitepaperScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>ライトペーパー (仕様書)</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>戻る</Button>
      </div>

      <Card className="bg-stone-50 border-2 border-stone-200">
        <h3 className={`${theme.typography.h3} mb-4 text-stone-700`}>ポンコツロボット工房 v1.0.64 仕様まとめ</h3>
        
        <div className="space-y-6 text-sm text-stone-800">
          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">1. ゲームの目的</h4>
            <p>
              プレイヤーはロボット工房の職人となり、「遠征」や「自動探索」で全48種類の素材を集め、「製造」でパーツとロボットを組み立てます。<br/>
              完成したロボットを「依頼」で納品することでG（ゴールド）を稼ぎ、倉庫の拡張や新たな工房内装の獲得を行いながら工房を発展させます。
            </p>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">2. 遠征と自動探索（環境演出・敏捷性短縮・感情アニメーション）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>通常遠征:</strong> リアルタイムの時間経過によって遠征が完了し、ランダムな種類の素材をまとまった数（スタック）で獲得できます。</li>
              <li><strong>成功率:</strong> 失敗はありません。常に100%成功し、素材を持ち帰ります。</li>
              <li><strong>ロボット派遣ボーナス:</strong> 任意のロボットを派遣すると、獲得できる素材の「抽選回数（ドロップ枠）」が基本値から大幅に増加します。</li>
              <li><strong>敏捷性（Agility）による時間短縮:</strong> 派遣するロボットの<strong>「敏捷 (Agility)」</strong>1につき所要時間が1秒短縮されます（最大80%短縮）。自動探索でも<strong>Agility 1につき発見周期が1秒短縮</strong>され、よりハイペースで素材を蓄積できます。</li>
              <li><strong>探索地の環境・天候演出（CSSアニメーション）:</strong> 探索場所に応じて背景グラフィックと天候演出（砂漠の砂塵、火山の熱気と火の粉、廃工場の酸性雨、渓谷の磁気嵐と突風、雪原の猛吹雪、水晶洞窟の星雲粒子、電脳遺跡のデジタルグリッド）がダイナミックに変化します。</li>
              <li><strong>敏捷性による歩行・探索スピードの高速化:</strong> ロボットのAgilityが高いほど、探索中の足踏み歩行や首振り、背景のスクロール速度がキビキビと高速化します。</li>
              <li><strong>ステータス補正（パワー）:</strong> 派遣するロボットの<strong>「パワー」</strong>が高いほど、さらにドロップ枠が追加されます。</li>
              <li><strong>属性相性:</strong> 派遣先と有利な属性を持つロボット（例：火の地域に水属性）を派遣すると、さらにドロップ枠が追加されます。</li>
              <li><strong>自動探索（放置探索）:</strong> ロボットを自動探索へ派遣しておくと、定期的に素材を自動発見・蓄積します（工房画面から随時回収可能）。</li>
              <li><strong>素材発見時の大喜びアニメーション:</strong> 素材を発見したロボットは、目元が笑顔（^ ▽ ^）になり、両手を上に掲げて「やったー！」とバンザイ＆ガッツポーズをしながらぴょんぴょん飛び跳ね、音符やキラキラエフェクトを放ちます。</li>
              <li><strong>探索難航・失敗時の困り顔アニメーション:</strong> 探索中に素材が見つからない時やバトル敗北時には、困り目（&gt; _ &lt;）になり、頭を抱えてオロオロ震えながら冷や汗（💦）を流すアニメーションが再生されます。</li>
              <li><strong>回収演出（紙ふぶき）:</strong> 遠征完了や自動探索の回収時には、お祝いの紙ふぶき（Confetti）が途切れることなく画面いっぱいに舞い散る持続エフェクトが発生します。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">3. 製造（クラフト）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>パーツ製造:</strong> 手持ちの素材から<strong>「メイン素材(3個)」</strong>と<strong>「サブ素材(2個)」</strong>を選んでパーツを合成します。</li>
              <li>メイン素材はパーツの「属性」と「基礎ステータス」を決定し、サブ素材は「追加ステータスボーナス」を付与します。</li>
              <li><strong>レア度:</strong> メインとサブの中で高い方の素材レア度（★1〜★3）がパーツのレア度になり、高いほど珍しい見た目のパーツが生成されやすくなります。</li>
              <li><strong>ロボット組立:</strong> 製造したアタマ・ボディ・ウデ・アシの4つのパーツを組み合わせて1体のロボットを完成させます。各パーツのステータスの合計がロボットの総合ステータスになります。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">4. 依頼掲示板（納品）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>24時間経過、または現在受諾中の依頼がない場合に新しい依頼（王様・貴族・おじさん）が自動生成されます。</li>
              <li>依頼には制限時間（1〜3日）と、指定された<strong>「属性」</strong>や<strong>「要求ステータス値」</strong>があります。</li>
              <li><strong>王様:</strong> 報酬500G。ステータスと属性の要求が厳しい。</li>
              <li><strong>貴族:</strong> 報酬300G。中程度の要求。</li>
              <li><strong>おじさん:</strong> 報酬100G。属性不問で要求が緩い。</li>
              <li>要求を満たしたロボットを納品するとGを獲得し、ロボットはインベントリから失われます。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">5. ミニゲーム（ロボット・バトル）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>自作のロボットを出撃させ、オセロ・五目並べ・チェス・マルバツのボードゲームで各企業のAIとオート対決ができます。</li>
              <li>ロボットの<strong>「賢さ (Int)」</strong>が高いほど、より精度の高い次の一手を選択します。</li>
              <li><strong>勝利演出:</strong> 対戦に勝利すると、使用したロボットが両腕を突き上げて飛び跳ねる<strong>「ガッツポーズアニメーション」</strong>とキラキラエフェクトで勝利を祝います。対戦相手に応じたG報酬も獲得できます。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">6. 倉庫・商店・図鑑</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>倉庫（素材一覧の希少度可視化）:</strong> 製造したロボット、所持パーツ、および素材を管理します。素材一覧ではレアリティ（★1 コモン、★2 レア、★3 Sレア）に応じて背景色・枠線・星バッジが色分けされ、一目で希少度を判別できます。レア度や属性、名前による絞り込み検索も可能です。</li>
              <li><strong>解体とリサイクル:</strong> 不要なロボットは「解体」して4つのパーツに戻すことができます。パーツは「リサイクル」することで、メイン素材2個に還元されます。</li>
              <li><strong>商店:</strong> Gを使って素材を購入したり、特定の素材を消費して「工房の背景（内装）」を獲得・変更することができます。</li>
              <li><strong>図鑑・実績:</strong> これまでに納品したロボットの履歴、獲得G推計を確認できます。「素材・パーツ詳細」タブでは、各素材から出現する可能性があるパーツの見た目を一覧で確認できます。</li>
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
};
