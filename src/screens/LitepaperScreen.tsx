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
        <h3 className={`${theme.typography.h3} mb-4 text-stone-700`}>ポンコツロボット工房 v1.0.18 仕様まとめ</h3>
        
        <div className="space-y-6 text-sm text-stone-800">
          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">1. ゲームの目的</h4>
            <p>
              プレイヤーはロボット工房の職人となり、「遠征」で素材を集め、「製造」でロボットを組み立てます。<br/>
              完成したロボットを「依頼」で納品することでG（ゴールド）を稼ぎ、倉庫の拡張や素材の購入を行いながら工房を発展させます。
            </p>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">2. 遠征（素材収集）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>リアルタイムの時間経過によって遠征が完了し、ランダムな数の素材を獲得できます。</li>
              <li><strong>成功率:</strong> ロボットを派遣しない場合は50%。任意のロボットを派遣すると80%に上昇します。</li>
              <li><strong>属性相性:</strong> 派遣先と有利な属性を持つロボット（例：火の地域に水属性）を派遣すると、成功率が100%になり確実に素材を持ち帰ります。</li>
              <li><strong>ステータス補正:</strong> 派遣するロボットのパワーか敏捷が30を超えていると、さらに成功率に+10%のボーナスが付きます。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">3. 製造（クラフト）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>手持ちの素材から<strong>2つ</strong>を選んで合成します。</li>
              <li><strong>属性:</strong> 最初に選んだ素材の属性が、そのままロボットの属性および基本カラーになります。</li>
              <li><strong>ステータス:</strong> 「体力・パワー・防御・敏捷・器用」の5つのパラメータは、使用した素材の基礎能力の合計値に、ランダムなボーナス（+0〜4）が加算されて決定します。</li>
              <li><strong>ビジュアル（パーツ）:</strong> 使用した素材の中で最も高い<strong>レア度（★1〜★3）</strong>に応じて、生成されるアタマ・ボディ・ウデ・アシのパーツバリエーションの抽選範囲が広がります。高レアな素材を使うほど珍しい形になりやすいです。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">4. 依頼掲示板（納品）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>時間経過で新しい依頼が届きます（最大5件までストック）。</li>
              <li>依頼には制限時間（8時間、12時間、24時間など）と、指定された<strong>「属性」</strong>や<strong>「要求ステータス値」</strong>があります。</li>
              <li><strong>王様:</strong> 報酬500G。ステータスと属性の要求が厳しい。</li>
              <li><strong>貴族:</strong> 報酬300G。中程度の要求。</li>
              <li><strong>おじさん:</strong> 報酬100G。属性不問で要求が緩い。</li>
              <li>要求を満たしたロボットを納品するとGを獲得し、ロボットはインベントリから失われます。</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">5. 倉庫・商店・図鑑</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>倉庫:</strong> 製造したロボットと所持素材を管理します。ロボットの所持上限はGを消費して拡張できます。</li>
              <li><strong>売却と解体:</strong> 倉庫から不要なロボットを直接「売却」してGに換えるか、「解体」してランダムな素材1〜3個に還元できます。</li>
              <li><strong>商店:</strong> 稼いだGを使って、確実に欲しい素材を直接購入できます。</li>
              <li><strong>図鑑・実績:</strong> これまでに納品したロボットの履歴、獲得G推計を確認できます。「素材・パーツ詳細」タブでは、各素材から出現する可能性があるパーツの見た目とレア度を一覧で確認できます。</li>
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
};
