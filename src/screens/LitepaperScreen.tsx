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
        <h3 className={`${theme.typography.h3} mb-4 text-stone-700`}>ポンコツロボット工房 v1.0.49 仕様まとめ</h3>
        
        <div className="space-y-6 text-sm text-stone-800">
          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">1. ゲームの目的</h4>
            <p>
              プレイヤーはロボット工房の職人となり、「遠征」で全48種類の素材を集め、「製造」でパーツとロボットを組み立てます。<br/>
              完成したロボットを「依頼」で納品することでG（ゴールド）を稼ぎ、倉庫の拡張や新たな工房内装の獲得を行いながら工房を発展させます。
            </p>
          </section>

          <section>
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">2. 遠征（素材収集）</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>リアルタイムの時間経過によって遠征が完了し、ランダムな種類の素材をまとまった数（スタック）で獲得できます。</li>
              <li><strong>成功率:</strong> 失敗はありません。常に100%成功し、素材を持ち帰ります。</li>
              <li><strong>ロボット派遣ボーナス:</strong> 任意のロボットを派遣すると、獲得できる素材の「抽選回数（ドロップ枠）」が基本値から大幅に増加します。</li>
              <li><strong>ステータス補正:</strong> 派遣するロボットの<strong>「パワー」</strong>が高いほど、さらにドロップ枠が追加されます。<strong>「敏捷」</strong>が高いほど、遠征にかかる時間が最大で半減します。</li>
              <li><strong>属性相性:</strong> 派遣先と有利な属性を持つロボット（例：火の地域に水属性）を派遣すると、さらにドロップ枠が追加されます。</li>
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
            <h4 className="font-bold text-lg text-amber-700 border-b border-stone-300 mb-2">5. 倉庫・商店・図鑑</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>倉庫:</strong> 製造したロボットと所持パーツ・素材を管理します。ロボットの所持上限はGを消費して拡張できます。</li>
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
