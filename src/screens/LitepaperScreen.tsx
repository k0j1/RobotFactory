import * as Gi from 'react-icons/gi';
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { ScreenHeader } from '../components/ui/ScreenHeader';

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
    <div className="space-y-4 pb-16 max-w-4xl mx-auto">
      <ScreenHeader
        icon={<Gi.GiScrollUnfurled size={16} />}
        title="ポンコツロボット工房 公式仕様書"
        badge={
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold px-1.5 py-0.2 rounded">
            v1.0.328
          </span>
        }
        rightElement={
          <Button size="sm" variant="secondary" onClick={onBack} className="text-xs py-1 px-2.5">
            ← 工房へ戻る
          </Button>
        }
      />

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
                  <li><strong>ピアノ演奏会:</strong> 高難度楽曲完全演奏クリア (+5〜+30 名声)。※弾幕よけは名声の獲得なし（専用宝箱ドロップ）。</li>
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
                    <Gi.GiAnvil className="text-amber-600" /> パラメータ構成と性能
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li><strong>INT (知力):</strong> 探索成功率や頭脳戦演習での思考補正に影響。ヘッドパーツで高くなりやすい。</li>
                    <li><strong>AGI (敏捷性):</strong> 速度や探索時間短縮に影響。レッグパーツで高くなりやすい。</li>
                    <li><strong>DEX (器用さ):</strong> 命中率、クリティカル、採集効率に影響。アームやレッグで高くなりやすい。</li>
                    <li><strong>HP (耐久度) / DEF (防御力):</strong> 機体の生命力と硬さ。ボディパーツで高くなりやすい。</li>
                    <li><strong>POW (攻撃力):</strong> 攻撃力。アームパーツで高くなりやすい。</li>
                    <li><strong>基準値差分グラフ:</strong> 倉庫の各パーツで「基準値比較」ボタンを押すと、素材標準設計値に対する各ステータスの上振れ・下振れを双方向バー＆レーダーで詳細確認できます。</li>
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
                    <li><strong>図鑑登録・パーツ基準値一覧:</strong> 完成した新機体は自動的に図鑑へ記録されます。また、パーツ図鑑タブではすべてのパーツ形状と、耐久力(HP)・攻撃力(POW)・探索力(DEX)などの「基準値ステータス」を便利なテーブル（表）形式で一覧表示し、比較することができます。</li>
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
                  <strong className="text-stone-900">遠征インターフェース＆結果表示ダッシュボード:</strong>
                  <div className="text-stone-600 mt-1">
                    遠征中は同行ロボ選択UIが自動的に格納され、現在進行中の遠征状況・リアルタイム進捗バー・残り時間が整理されたレイアウトで表示されます。遠征完了時の結果表示ダッシュボードは、<strong>「遠征場所」「素材を回収（受取ボタン）」「ロボットの表示（バンザイ大歓喜演出）」</strong>の3要素のみに絞り込まれた極めてシンプルな設計に刷新されており、余計な情報を排除して直感的にワンタップで素材を回収できます。素材受取時には工房風の明るい木製ボードと真鍮銘板の素材受取ダイアログが表示され、獲得した素材を安全に工房倉庫へ格納できます。
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
              <div className="bg-stone-900 text-amber-300 p-2.5 rounded-lg font-mono text-[11px] border border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>[CRT-MONITOR ENGINE] レトロ走査線＆ブラウン管ビジュアル搭載</span>
                <span className="text-stone-300">各カテゴリー勝利数に応じた全10段階階級（G〜SSS）査定</span>
              </div>

              {/* 階級制度表 */}
              <div className="bg-stone-100 p-3 rounded-lg border border-stone-300 space-y-1.5">
                <div className="font-bold text-stone-900 text-xs flex items-center justify-between">
                  <span>🏆 バトル演習 階級基準一覧（カテゴリー別勝利数）</span>
                  <span className="text-[10px] text-stone-500 font-mono">ARENA RANK TIERS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px] font-mono">
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-stone-600">G:</span> 10勝以下 (駆け出し)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-blue-600">F:</span> 30勝以下 (初心)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-cyan-600">E:</span> 50勝以下 (見習い)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-emerald-600">D:</span> 100勝以下 (中堅)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-teal-600">C:</span> 250勝以下 (一人前)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-amber-600">B:</span> 500勝以下 (熟練)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-rose-600">A:</span> 1000勝以下 (達人)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-yellow-600">S:</span> 2000勝以下 (伝説)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-amber-500">SS:</span> 4000勝以下 (覇王至高)</div>
                  <div className="bg-white p-1.5 rounded border border-stone-200"><span className="font-bold text-fuchsia-600">SSS:</span> 4000勝以上 (神話超越)</div>
                </div>
                <p className="text-[10px] text-stone-500 font-sans">
                  ※ 各カテゴリーカードで次ランク昇格までの残り必要勝利数がリアルタイムに表示されます。
                  <br />
                  ※ <strong>挑戦回数・クリア制限ルール:</strong> すべてのバトル（戦闘演習・オセロ・チェス・弾幕よけ・ピアノ演奏）は、<strong>未勝利であれば1日何回でも再挑戦可能</strong>です。勝利（クリア）したバトル・難易度は「本日クリア済」と表示され、翌朝9:00のリセットまで出撃ボタンが無効化されます。防衛戦も同様に当日クリア後は翌朝9:00までボタンが無効化されます。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">⚔️ 戦闘シミュレータ (1on1 Combat)</strong>
                  <p className="text-stone-600">
                    自作機体とAI戦術ボット（Lv.1〜10）によるターン制バトル。バトル画面は工房の温かみを感じる木製・真鍮ダッシュボードと明るい雰囲気に統一され、過度な英単語やテキストを削減して直感的なアイコン（攻・防・速・避・知・耐久、宝箱など）を主体とした見やすいUIへと改善されています。また、機体能力値の詳細仕様や計算式は折りたたみ式アコーディオンとなっており、必要な時だけワンタップで展開して確認可能です。
                    <br />
                    <strong>敵レベル対応・戦術技Tierシステム (全5階層):</strong> 機体の知性(Int)や各主能力値(Pow/Def/Agi/Dex)が敵のレベル別想定ステータスに到達することで、段階的に高位技がアンロックされます。
                    <br />
                    ・<strong>Tier 1 (Lv.1〜2対応 / Int 12+):</strong> ロケットパンチ、ナノバリア、緊急リペア、EMPパルス等の基本戦術
                    <br />
                    ・<strong>Tier 2 (Lv.3〜4対応 / Int 24+):</strong> フライングスマッシュ、最適化プロトコル、プラズマジェット
                    <br />
                    ・<strong>Tier 3 (Lv.5〜6対応 / Int 45+):</strong> 火炎旋風回転斬り、超速ガトリングラッシュ、精密長距離狙撃
                    <br />
                    ・<strong>Tier 4 (Lv.7〜8対応 / Int 80+):</strong> 【必殺奥義】星断オメガクロス、フルバースト・オーバードライブ
                    <br />
                    ・<strong>Tier 5 (Lv.9〜10対応 / Int 130+):</strong> 【終焉奥義】アポカリプス・オメガバースト（高知性機体のみが到達できる究極破壊技）
                    <br />
                    <strong>演習専用武装ランクアップシステム:</strong> ビームサーベルとビームシールドは、バトル勝利などで獲得できるエレメントを消費することで、<strong>初級★1 (初期解放: 100 E) → 中級★2 (500 E) → 上級★3 (1,000 E) → 特級★4 (5,000 E) → 伝説★5 (10,000 E)</strong> の全5段階にランクアップ強化可能！ランクに応じて攻撃力（Power +35〜+320）や防御力（Defense +30〜+270）が大幅に上昇し、専用奥義【星断オメガクロス】やシールド防御が飛躍的に強化されます。
                    <br />
                    演習勝利時には、<strong>宝箱がドロップ</strong>しアイテムとして回収できます（倉庫画面から開封可能）。開封時には★1〜★3素材・ゴールド・バトルエレメント・工房名声を獲得できます。未勝利の場合は1日何回でも再挑戦可能です。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🛡️ 拠点防衛戦 (Base Defense)</strong>
                  <p className="text-stone-600">
                    最大3機のロボットをタレットとして配備するリアルタイム防衛戦。勝利時に<strong>防衛宝箱がドロップ</strong>し、回収可能です（倉庫で開封）。素材・ゴールド・エレメント・工房名声（Lv.3:+5, Lv.4:+10, Lv.5:+15）を獲得。さらにステージ難易度に応じた<strong>防衛リジェネ（3h〜24h）</strong>が出撃機体全員に付与されます（※防衛戦は1日1回挑戦制限）。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🚀 弾幕サバイバル (Danmaku Survival)</strong>
                  <p className="text-stone-600">
                    敵機から放たれる幾何学的な弾幕を回避するアクションシューティング。Easy / Normal / Hard の3段階難易度。名声の獲得はありませんが、生還成功時に<strong>専用のクリア宝箱がドロップ</strong>し、回収できます。倉庫で開封することで、ゴールド・クラフト素材・バトルエレメントなどを獲得できます。未生還時は何度でも再挑戦可能です。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🎹 ピアノ演奏会 (Piano Rhythm)</strong>
                  <p className="text-stone-600">
                    「エリーゼのために」「トルコ行進曲」「ラ・カンパネラ」など名曲を完全演奏する鍵盤リズムゲーム。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200 sm:col-span-2">
                  <strong className="text-stone-900 block font-bold mb-1">♟️ クラシック頭脳対戦 (オセロ / チェス / 五目並べ / 三目並べ)</strong>
                  <p className="text-stone-600">
                    ロボットの知力(INT)や思考ロジックを試すボードゲーム集。<strong>オセロおよびチェスでは勝利時に専用の宝箱がドロップ</strong>し、回収可能！対局相手のレベルに応じた素材・ゴールド・バトルエレメント・工房名声を獲得できます。未勝利時は1日何回でも繰り返し挑戦できます。
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
