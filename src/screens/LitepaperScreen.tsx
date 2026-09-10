import * as Gi from 'react-icons/gi';
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';

export const LitepaperScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'overview' | 'fame' | 'craft' | 'quest' | 'request' | 'minigame' | 'shop'>('all');

  const categories = [
    { id: 'all', label: '全体を表示', icon: Gi.GiScrollUnfurled },
    { id: 'overview', label: '基本サイクル', icon: Gi.GiGears },
    { id: 'fame', label: '工房名声', icon: Gi.GiTrophyCup },
    { id: 'craft', label: 'クラフト・機体', icon: Gi.GiRobotAntennas },
    { id: 'quest', label: '探索・遠征', icon: Gi.GiCompass },
    { id: 'request', label: '依頼板', icon: Gi.GiWoodenSign },
    { id: 'minigame', label: 'バトル演習', icon: Gi.GiCrossedSwords },
    { id: 'shop', label: '施設・ショップ', icon: Gi.GiAnvil },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* ヘッダーバー */}
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center shadow-xs">
            <Gi.GiScrollUnfurled size={22} />
          </div>
          <div>
            <h2 className={theme.typography.h2}>ポンコツロボット工房 公式仕様書</h2>
            <p className="text-xs text-stone-500 font-medium">現在採用されている最新ゲームシステムの完全ガイド (v1.0.277)</p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={onBack}>
          ← 工房へ戻る
        </Button>
      </div>

      {/* カテゴリ切り替えタブ */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-200/80 rounded-xl border border-stone-300">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-300/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber-200' : 'text-stone-500'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-5 text-stone-800 text-sm">
        {/* 1. 基本ゲームサイクル */}
        {(activeTab === 'all' || activeTab === 'overview') && (
          <Card className="bg-stone-50/90 border-2 border-stone-300 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
              <Gi.GiGears className="text-amber-700 text-xl" />
              <h3 className="font-bold text-base text-stone-900">1. 基本ゲームサイクル</h3>
            </div>
            <div className="space-y-3 leading-relaxed">
              <p className="text-stone-700">
                『ポンコツロボット工房』は、集めたジャンクパーツから個性豊かなロボットを組み立て、遠征や依頼、バトルを通じて工房を発展させていくクラフト＆育成シミュレーションです。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 font-mono text-xs">
                <div className="bg-amber-100/70 border border-amber-300 p-2.5 rounded-lg">
                  <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                    <Gi.GiCompass /> ① 探索・遠征
                  </div>
                  <div className="text-[11px] text-amber-800 font-sans">
                    各地へロボットを派遣し、素材やレアパーツ、ジャンクを収集。
                  </div>
                </div>
                <div className="bg-blue-100/70 border border-blue-300 p-2.5 rounded-lg">
                  <div className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                    <Gi.GiHammerNails /> ② ロボット製作
                  </div>
                  <div className="text-[11px] text-blue-800 font-sans">
                    4部位のパーツを組み合わせ、独自の性能・外見の機体を製造。
                  </div>
                </div>
                <div className="bg-emerald-100/70 border border-emerald-300 p-2.5 rounded-lg">
                  <div className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
                    <Gi.GiWoodenSign /> ③ 依頼・納品
                  </div>
                  <div className="text-[11px] text-emerald-800 font-sans">
                    街の住人や王室の依頼に応え、ゴールドと名声を獲得。
                  </div>
                </div>
                <div className="bg-purple-100/70 border border-purple-300 p-2.5 rounded-lg">
                  <div className="font-bold text-purple-900 flex items-center gap-1 mb-1">
                    <Gi.GiCrossedSwords /> ④ バトル・発展
                  </div>
                  <div className="text-[11px] text-purple-800 font-sans">
                    演習や拠点防衛で名を上げ、工房設備や名声ランクを高める。
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 2. 工房名声システム */}
        {(activeTab === 'all' || activeTab === 'fame') && (
          <Card className="bg-[#fffdf9] border-2 border-amber-300/80 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Gi.GiTrophyCup className="text-amber-600 text-xl" />
                <h3 className="font-bold text-base text-amber-950">2. 工房名声（Fame）＆名声ランクシステム</h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                全6段階の工房称号
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-stone-700">
                工房の認知度と職人としての名誉を表すステータスです。ダッシュボード上部に現在の名声・ランク称号・次のランクまでのプログレスバーが表示されます。
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-stone-200 rounded-lg overflow-hidden">
                  <thead className="bg-stone-100 text-stone-700 font-bold">
                    <tr>
                      <th className="p-2 border-b border-stone-200">ランク</th>
                      <th className="p-2 border-b border-stone-200">工房称号</th>
                      <th className="p-2 border-b border-stone-200">必要名声</th>
                      <th className="p-2 border-b border-stone-200">説明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr className="bg-white">
                      <td className="p-2 font-mono font-bold text-stone-600">Rank 1</td>
                      <td className="p-2 font-bold text-stone-800">路地裏の無名工房</td>
                      <td className="p-2 font-mono">0 〜 49</td>
                      <td className="p-2 text-stone-600">町外れでひっそりと営業する小さな修理小屋。</td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="p-2 font-mono font-bold text-emerald-700">Rank 2</td>
                      <td className="p-2 font-bold text-emerald-900">街の評判工房</td>
                      <td className="p-2 font-mono">50 〜 149</td>
                      <td className="p-2 text-stone-600">近隣住民から信頼され、日常的な依頼が集まる。</td>
                    </tr>
                    <tr className="bg-sky-50/40">
                      <td className="p-2 font-mono font-bold text-sky-700">Rank 3</td>
                      <td className="p-2 font-bold text-sky-900">地方の有名工房</td>
                      <td className="p-2 font-mono">150 〜 349</td>
                      <td className="p-2 text-stone-600">近隣の街や旅人たちにも名が知られた実力派工房。</td>
                    </tr>
                    <tr className="bg-purple-50/40">
                      <td className="p-2 font-mono font-bold text-purple-700">Rank 4</td>
                      <td className="p-2 font-bold text-purple-900">名門メカニック工房</td>
                      <td className="p-2 font-mono">350 〜 699</td>
                      <td className="p-2 text-stone-600">貴族や名士たちが特注機を求めて訪れる一流工房。</td>
                    </tr>
                    <tr className="bg-amber-50/60">
                      <td className="p-2 font-mono font-bold text-amber-800">Rank 5</td>
                      <td className="p-2 font-bold text-amber-950">王国御用達工房</td>
                      <td className="p-2 font-mono">700 〜 1199</td>
                      <td className="p-2 text-stone-600">王室直々の特命依頼を受ける最高峰の工房。</td>
                    </tr>
                    <tr className="bg-amber-100/60">
                      <td className="p-2 font-mono font-bold text-rose-700">Rank 6</td>
                      <td className="p-2 font-bold text-amber-950 flex items-center gap-1">
                        <Gi.GiLaurelCrown className="text-amber-600" /> 伝説の神話工房
                      </td>
                      <td className="p-2 font-mono font-bold">1200+ (MAX)</td>
                      <td className="p-2 text-stone-700 font-medium">歴史に名を刻む至高のポンコツロボット工房！</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-stone-100/80 p-3 rounded-lg border border-stone-300 text-xs space-y-1.5">
                <div className="font-bold text-stone-900">【名声の主な獲得方法】</div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li><strong>依頼掲示板での納品:</strong> 王様の依頼 (+50)、貴族の依頼 (+25)、おじさんの依頼 (+10)。好感度MAX時はさらに追加ボーナス付与。</li>
                  <li><strong>高難度バトル演習勝利:</strong> Lv.3〜10の強敵戦術ボット撃破 (+5〜+70 名声)。</li>
                  <li><strong>拠点防衛戦の制覇:</strong> ウェーブ防衛成功 (+5〜+70 名声)。</li>
                  <li><strong>弾幕サバイバル・ピアノ演奏会:</strong> 高難度クリア (+5〜+30 名声)。</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* 3. クラフト＆機体システム */}
        {(activeTab === 'all' || activeTab === 'craft') && (
          <Card className="bg-stone-50/90 border-2 border-stone-300 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
              <Gi.GiRobotAntennas className="text-amber-700 text-xl" />
              <h3 className="font-bold text-base text-stone-900">3. ロボットクラフト＆パーツ仕様</h3>
            </div>
            <div className="space-y-3">
              <p className="text-stone-700">
                ロボットは<strong>「頭部」「胴体」「腕部」「脚部」</strong>の4つのパーツから構成されます。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Gi.GiAnvil className="text-amber-600" /> パラメータ構成
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li><strong>INT (知力):</strong> 探索成功率や頭脳戦演習での思考補正に影響。</li>
                    <li><strong>AGI (敏捷性):</strong> 回避率や攻撃速度、機動演習での運動性に影響。</li>
                    <li><strong>DEX (器用さ):</strong> 命中率、クリティカル、採集効率に影響。</li>
                    <li><strong>HP (耐久度):</strong> 機体の生命力。0になると稼働停止し修理が必要。</li>
                    <li><strong>ATK / DEF:</strong> 戦闘演習や防衛戦での与ダメージ・被ダメージに直結。</li>
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Gi.GiSpanner className="text-amber-600" /> 機体管理・メンテナンス
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li><strong>修理キット:</strong> 破損した機体を即座に全回復。ミニゲーム勝利等で獲得。</li>
                    <li><strong>機体命名＆愛着度:</strong> 製造したロボットには自由に名前を付けられます。</li>
                    <li><strong>分解リサイクル:</strong> 不要になった機体やパーツを素材へと還元。</li>
                    <li><strong>図鑑登録:</strong> 完成した新機体は自動的に工房図鑑へ記録されます。</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 4. 探索・遠征システム */}
        {(activeTab === 'all' || activeTab === 'quest') && (
          <Card className="bg-stone-50/90 border-2 border-stone-300 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
              <Gi.GiCompass className="text-amber-700 text-xl" />
              <h3 className="font-bold text-base text-stone-900">4. 探索・遠征（クエスト）システム</h3>
            </div>
            <div className="space-y-3">
              <p className="text-stone-700">
                機体を派遣して素材を収集するモードです。エリアごとに必要な時間・推奨能力値・ドロップ素材が異なります。
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900">主要遠征エリア:</strong>
                  <div className="text-stone-600 mt-1">
                    「近所のスクラップ場 (初級)」から「廃墟工場」「電脳樹海」「古代遺跡」「終末の宇宙ステーション (最上級)」まで多彩なロケーションが存在します。
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900">放置自動採集＆まとめて回収機能:</strong>
                  <div className="text-stone-600 mt-1">
                    遠征完了後、保管箱に素材が自動蓄積されます。工房ダッシュボードの「まとめて回収」ボタンで全遠征の成果を一括でインベントリに収納できます。
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 5. 依頼掲示板 */}
        {(activeTab === 'all' || activeTab === 'request') && (
          <Card className="bg-stone-50/90 border-2 border-stone-300 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
              <Gi.GiWoodenSign className="text-amber-700 text-xl" />
              <h3 className="font-bold text-base text-stone-900">5. 依頼掲示板（リクエスト）システム</h3>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-stone-700 text-sm">
                街の住人やVIPクライアントから提示される条件に合うロボットを納品して、報酬ゴールドと名声を獲得します。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <div className="font-bold text-amber-950">👑 王様の特命依頼 (King)</div>
                  <div className="text-stone-600 mt-1">
                    最高難度の要求スペック。成功で大量のゴールドと<strong>名声 +50</strong>を獲得。
                  </div>
                </div>
                <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                  <div className="font-bold text-purple-950">🎩 貴族の注文 (Noble)</div>
                  <div className="text-stone-600 mt-1">
                    高水準の特注機要求。成功で高額ゴールドと<strong>名声 +25</strong>を獲得。
                  </div>
                </div>
                <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-300">
                  <div className="font-bold text-stone-950">🔧 おじさんの依頼 (Common)</div>
                  <div className="text-stone-600 mt-1">
                    日常的な作業機要求。成功で手頃なゴールドと<strong>名声 +10</strong>を獲得。
                  </div>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <strong className="text-stone-900">クライアント好感度システム:</strong>
                <span className="text-stone-600 ml-1">
                  同じクライアントの依頼を納品するごとに好感度が上昇（最大Lv.10）。Lv.10に達すると納品ゴールドが<strong>1.5倍</strong>になり、獲得名声にも追加ボーナスが発生します。
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* 6. バトル演習＆ミニゲーム */}
        {(activeTab === 'all' || activeTab === 'minigame') && (
          <Card className="bg-stone-50/90 border-2 border-stone-300 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
              <Gi.GiCrossedSwords className="text-amber-700 text-xl" />
              <h3 className="font-bold text-base text-stone-900">6. バトル演習＆ミニゲームシステム (全6種)</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-stone-900 text-amber-300 p-2.5 rounded-lg font-mono text-[11px] border border-stone-700 flex items-center justify-between">
                <span>[CRT-MONITOR ENGINE] レトロ走査線＆ブラウン管ビジュアル搭載</span>
                <span className="text-stone-400">遊んだ数＆勝利数で総合階級（S〜G）を査定</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">⚔️ 戦闘シミュレータ (1on1 Combat)</strong>
                  <p className="text-stone-600">
                    自作機体とAI戦術ボット（Lv.1〜10）によるターン制バトル。ビームサーベル（攻撃力+50%）やビームシールド（被ダメ-40%）を武装可能。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🛡️ 拠点防衛戦 (Base Defense)</strong>
                  <p className="text-stone-600">
                    最大3機のロボットをタレットとして配備するリアルタイム防衛戦。勝利で修理キットと<strong>12時間HP自然回復リジェネ</strong>を付与。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🚀 弾幕サバイバル (Danmaku Survival)</strong>
                  <p className="text-stone-600">
                    敵機から放たれる幾何学的な弾幕を回避するアクションシューティング。Easy / Normal / Hard の3段階難易度。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🎹 ピアノ演奏会 (Piano Rhythm)</strong>
                  <p className="text-stone-600">
                    「エリーゼのために」「トルコ行進曲」「ラ・カンパネラ」など名曲を完全演奏する鍵盤リズムゲーム。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200 sm:col-span-2">
                  <strong className="text-stone-900 block font-bold mb-1">♟️ クラシック頭脳対戦 (五目並べ / オセロ / 三目並べ / チェス)</strong>
                  <p className="text-stone-600">
                    ロボットの知力(INT)や思考ロジックを試すボードゲーム集。勝利で修理キットを獲得できます。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 7. 工房施設＆ショップ */}
        {(activeTab === 'all' || activeTab === 'shop') && (
          <Card className="bg-stone-50/90 border-2 border-stone-300 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
              <Gi.GiAnvil className="text-amber-700 text-xl" />
              <h3 className="font-bold text-base text-stone-900">7. 工房施設・保管庫・ショップ仕様</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">📦 倉庫・保管庫拡張</strong>
                  <p className="text-stone-600">
                    ゴールドを消費してロボット所持枠・素材保管枠を拡張。大量の機体運用が可能になります。
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🏪 ジャンクショップ</strong>
                  <p className="text-stone-600">
                    不足している基本素材の購入や、余剰となった素材・パーツの換金売却が行えます。
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🎨 工房内装・設備</strong>
                  <p className="text-stone-600">
                    工房の内装テーマ（町工場、ヴィンテージ、サイバー等）の切り替えや作業台の強化が可能です。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="text-center pt-4 border-t border-stone-300">
        <Button size="md" variant="primary" onClick={onBack}>
          工房へ戻る
        </Button>
      </div>
    </div>
  );
};
