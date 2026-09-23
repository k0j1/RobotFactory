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
            v0.1.106 (DB v0.18)
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
                  <li><strong>バトル演習・弾幕避け・頭脳対戦:</strong> レベル1〜3は名声獲得なし(0)、レベル4(+1)、レベル5(+3)、レベル6(+6)、レベル7(+10)、レベル8(+20)、レベル9(+50)、レベル10(+100)。※名声が増える演習ではエレメントも同時に獲得できます。</li>
                  <li><strong>拠点防衛戦の制覇:</strong> ウェーブ防衛成功 (ステージレベル×10名声 & 防衛リジェネ付与)。</li>
                  <li><strong>ピアノ演奏会:</strong> 楽曲完全演奏クリア (+5〜+30 名声 & エレメント獲得)。</li>
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
                    <li><strong>分解リサイクル:</strong> 不要になった機体やパーツを素材へと解体。</li>
                    <li><strong>新人技師初回ボーナス:</strong> 初期ユーザー向けに、ロボット1体を即座に組み立てられる☆1素材セット（全24個・すべて☆1ランクのみ）をプレゼント。ヘッド・ボディ・アーム・レッグの4部位（各5個＝計20個必要）を余すことなく組み立て可能です。初回登録時に確実に受取カードが表示され受け取ることができます。</li>
                    <li><strong>図鑑登録・パーツ基準値一覧:</strong> 完成した新機体は自動的に図鑑へ記録されます。また、パーツ図鑑タブではすべてのパーツ形状と、耐久力(HP)・攻撃力(POW)・探索力(DEX)などの「基準値ステータス」を便利なテーブル（表）形式で一覧表示し、比較することができます。</li>
                    <li><strong>Google AdSense リワード広告時短:</strong> パーツ製造およびロボット組立の進行中に動画広告を視聴することで、完了までの所要時間を<strong>1回につき30分短縮</strong>できます。残り時間が30分以内の場合は即座に完成します。</li>
                    <li><strong>Googleアカウント連携 &amp; クラウドデータ同期 (DB v0.18):</strong> Googleアカウントでログインした場合、オンライン上にゲームデータ（工房ステータス、所持機体、パーツ、遠征、ミニゲーム成績・宝箱数等）が自動的に保存・同期されます。<code>users</code>テーブルの<code>google_id</code>を親キーとして、全23テーブル（<code>user_item</code>, <code>user_material</code>, <code>user_minigame_status</code>, <code>user_parts</code>, <code>user_robots</code>, <code>user_workshop_status</code>, <code>save_data</code>, <code>minigame_rankings</code>, <code>daily_cleared_minigame</code>, <code>complete_part_crafts</code>等の各種active/completeテーブル）の<code>user_id</code>に厳格な外部キー制約（CASCADE）が設定され、データの参照整合性と安全性が保証されています（旧<code>complete_parts</code>テーブルは廃止され、パーツ製造履歴は<code>complete_part_crafts</code>へ統合・正規化）。マスターパーツテーブルは<code>master_parts</code>として管理され、所持パーツテーブル（<code>user_parts</code>）は個別カラム（vitality・power・defense・agility・dexterity・intelligence・attribute・rarity・メイン/サブ素材マスターID等）へ構造化。また、ミニゲーム/演習クリア制限テーブル（<code>daily_cleared_minigame</code>）により機体・ゲーム・難易度ごとのクリア状況が記録され、毎朝9:00（JST）のデイリーリセットを迎えるまで同機体の再クリアが制限されます。</li>
                    <li><strong>他プレイヤーのリアルタイム組立状況表示:</strong> active_robot_assembliesテーブルを参照し、現在他のプレイヤーがロボットを組み立てている場合、組立タブや作業ドックに「他の工房で〇〇人組立中」バッジがリアルタイムに表示されます。</li>
                    <li><strong>GSAPモーションスタジオ:</strong> 漆黒のグランドピアノによる華麗なピアノ協奏曲演奏をはじめ、各種戦闘・アクロバット・仕草など、多彩なモーションをロボットで鑑賞・動作検証できます。</li>
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
                  <strong className="text-stone-900">遠征地のマスターデータ管理と解放同期 (master_expeditions):</strong>
                  <div className="text-stone-600 mt-1 space-y-1.5">
                    <p>
                      全遠征地のマスターデータはデータベースの<code>master_expeditions</code>テーブル（遠征地名、解放費用、所要時間(秒)、必要な名声値）にて一元管理されています。
                    </p>
                    <p>
                      初期解放地である「<strong>裏山のスクラップ場</strong>（loc1）」は解放費用0G・必要名声0で最初から解放状態で設定されています。
                    </p>
                    <p>
                      新たな遠征地を解放した際には、<code>user_workshop_status</code>テーブルの解放費用分<strong>goldが減少し、consumed_goldが増加</strong>して永続化されます。
                    </p>
                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-[11px] border border-stone-300 rounded text-left">
                        <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                          <tr>
                            <th className="p-1.5">遠征地名</th>
                            <th className="p-1.5 text-right">解放費用</th>
                            <th className="p-1.5 text-right">所要時間</th>
                            <th className="p-1.5 text-right">必要名声</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 font-mono">
                          <tr>
                            <td className="p-1.5 font-sans font-medium">裏山のスクラップ場</td>
                            <td className="p-1.5 text-right text-emerald-700 font-bold">0 G</td>
                            <td className="p-1.5 text-right">30分 (1,800秒)</td>
                            <td className="p-1.5 text-right">0</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans font-medium">灼熱の廃工場</td>
                            <td className="p-1.5 text-right text-amber-800 font-bold">200 G</td>
                            <td className="p-1.5 text-right">1時間 (3,600秒)</td>
                            <td className="p-1.5 text-right">10</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans font-medium">水没した都市遺跡</td>
                            <td className="p-1.5 text-right text-amber-800 font-bold">500 G</td>
                            <td className="p-1.5 text-right">2時間 (7,200秒)</td>
                            <td className="p-1.5 text-right">30</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans font-medium">風の谷の観測所</td>
                            <td className="p-1.5 text-right text-amber-800 font-bold">1,000 G</td>
                            <td className="p-1.5 text-right">3時間 (10,800秒)</td>
                            <td className="p-1.5 text-right">50</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans font-medium">光の塔</td>
                            <td className="p-1.5 text-right text-amber-800 font-bold">2,000 G</td>
                            <td className="p-1.5 text-right">4時間 (14,400秒)</td>
                            <td className="p-1.5 text-right">100</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans font-medium">最果てのクレーター</td>
                            <td className="p-1.5 text-right text-amber-800 font-bold">4,000 G</td>
                            <td className="p-1.5 text-right">5時間 (18,000秒)</td>
                            <td className="p-1.5 text-right">200</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans font-medium">古代文明の中枢</td>
                            <td className="p-1.5 text-right text-amber-800 font-bold">10,000 G</td>
                            <td className="p-1.5 text-right">10時間 (36,000秒)</td>
                            <td className="p-1.5 text-right">500</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900">他プレイヤーの遠征状況（リアルタイムactive人数）表示:</strong>
                  <div className="text-stone-600 mt-1">
                    サーバーのactive_expeditionsテーブルと同期し、各遠征エリアに他のプレイヤーが派遣されている場合、ロケーションカード上に「他の工房で〇〇人遠征中」のステータスバッジがリアルタイムに点灯・表示されます。
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900">遠征所要時間・短縮システム:</strong>
                  <div className="text-stone-600 mt-1">
                    各エリアの所要時間は「30分」「1時間」のように分秒または時分秒で分かりやすく表示されます。同行させるロボットの敏捷性（AGI）や天候倍率による変動時間もリアルタイムに反映され、どれだけ時間短縮されたかが直感的に把握できます。また、遠征中に<strong>Google AdSense リワード広告</strong>を視聴することで、遠征の帰還完了時間を<strong>30分短縮</strong>することが可能です。
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
                <strong className="text-stone-900">他プレイヤーの依頼受注状況（リアルタイムactive人数）表示:</strong>
                <span className="text-stone-600 ml-1">
                  サーバーのactive_requestsテーブルと同期し、各クライアントの依頼を他のプレイヤーが受注・進行している場合、依頼カード右上に「他の工房で〇〇人依頼中」のインジケーターバッジがリアルタイムに点灯・表示されます。
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <strong className="text-stone-900">依頼達成報酬（G・名声）のアトミック永続化:</strong>
                <span className="text-stone-600 ml-1">
                  依頼納品完了時、獲得したゴールドは<code>user_workshop_status</code>テーブルの<code>request_earned_gold</code>へ、獲得名声は<code>fame</code>カラムへトランザクション内でアトミックに加算・記録されます。また、クライアント未ロード等による誤ったゼロ上書きを防止する安全ロジックおよび自己修復機能が組み込まれています。
                </span>
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
                  ※ <strong>挑戦回数・クリア制限ルール:</strong> すべてのバトル（戦闘演習・リバーシ・チェス・弾幕よけ・ピアノ演奏・拠点防衛戦）は、<strong>未勝利であれば1日何回でも再挑戦可能</strong>です。勝利（クリア）したバトル・項目・レベルはロボットごとに「本日クリア済」として自動記録され、翌朝9:00のリセットまで出撃ボタンが無効化されます。また、全ミニゲーム・演習での<strong>エレメント獲得量は獲得名声量と同一</strong>に設定されており、ミニゲーム選択画面でも獲得可能な名声とエレメントが分かりやすく明記されています。各ミニゲームの成績・宝箱数（<code>chests_count</code>）は<code>user_minigame_status</code>テーブルへ、獲得したエレメントや宝箱の所持実数は<code>user_item</code>テーブルへリアルタイムで自動記録・同期されます。
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
                    ・<strong>Tier 1 (Lv.1〜2対応 / Int 12+):</strong> 紅蓮・突進突き、要塞ナノバリア、ロケットパンチ
                    <br />
                    ・<strong>Tier 2 (Lv.3〜4対応 / Int 30+):</strong> 双剣・幻影乱舞、ビームサーベル・断空斬、緊急リペアプロトコル
                    <br />
                    ・<strong>Tier 3 (Lv.5〜6対応 / Int 52+):</strong> EMPディスラプター、炎刃・旋風回転斬り
                    <br />
                    ・<strong>Tier 4 (Lv.7〜8対応 / Int 85+):</strong> 戦術オプティマイズ、フルバースト・ミサイル、【必殺奥義】星断オメガクロス
                    <br />
                    ・<strong>Tier 5 (Lv.9〜10対応 / Int 170+):</strong> リミッター全面解除（オーバードライブ）、【終焉奥義】アポカリプス・オメガバースト（高知性機体のみが到達できる究極破壊技）
                    <br />
                    <strong>演習専用武装ランクアップシステム:</strong> ビームサーベルとビームシールドは、バトル勝利などで獲得できるエレメントを消費することで、<strong>初級★1 (初期解放: 100 E) → 中級★2 (500 E) → 上級★3 (1,000 E) → 特級★4 (5,000 E) → 伝説★5 (10,000 E)</strong> の全5段階にランクアップ強化可能！ランクに応じて攻撃力（Power +35〜+320）や防御力（Defense +30〜+270）が大幅に上昇し、専用奥義【星断オメガクロス】やシールド防御が飛躍的に強化されます。
                    <br />
                    ・<strong>⏱️ 60秒時間制限＆ダメージ判定システム:</strong> バトルが60秒を経過した場合、時間制限（タイムアップ）により戦闘終了となります。その際、各機体が「与えたダメージ量」と「受けたダメージ量」からスコア（スコア ＝ 与ダメ － 被ダメ）が算出され、スコアが高い側が判定勝利（自機勝利の場合は通常通り宝箱ドロップ・名声報酬等を獲得）となります。HUD中央のVS表示にはリアルタイムで残り秒数がカウントダウンされ、残り10秒以下で緊急パルス発動します。
                    <br />
                    演習勝利時には、<strong>宝箱がドロップ</strong>しアイテムとして回収できます（倉庫画面から開封可能）。また対戦相手のレベルに応じて工房名声（<strong>Lv.1〜3: 0, Lv.4: 1, Lv.5: 3, Lv.6: 6, Lv.7: 10, Lv.8: 20, Lv.9: 50, Lv.10: 100</strong>）を獲得でき、獲得した名声と同数のバトルエレメント（<strong>Lv.4: 1 E, Lv.5: 3 E, Lv.6: 6 E, Lv.7: 10 E, Lv.8: 20 E, Lv.9: 50 E, Lv.10: 100 E</strong>）も直接加算されます。未勝利の場合は1日何回でも再挑戦可能です。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🛡️ 拠点防衛戦 (Base Defense)</strong>
                  <p className="text-stone-600">
                    最大3機のロボットをタレットとして配備するリアルタイム防衛戦。勝利時に<strong>防衛宝箱がドロップ</strong>し、回収可能です（倉庫で開封）。素材・ゴールド・工房名声および同数のバトルエレメント（ステージレベルに応じて名声＆エレメントを獲得）を獲得。さらにステージ難易度に応じた<strong>防衛リジェネ（3h〜24h）</strong>が出撃機体全員に付与されます（※防衛戦は1日1回挑戦制限）。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🚀 弾幕サバイバル (Danmaku Survival)</strong>
                  <p className="text-stone-600">
                    敵機から放たれる幾何学的な弾幕を回避するアクションシューティング。Lv.1〜Lv.10の全10段階難易度。<strong>飛行中はロボットがジェット噴射スラスターとマッハ衝撃波を放ち、左右回避時にはリアルタイムにバンク傾斜する高速ジェット飛行アニメーション</strong>が発動します。生還成功時に<strong>専用のクリア宝箱がドロップ</strong>し、倉庫で開封することでゴールド・クラフト素材を獲得できるほか、クリア難易度に応じた<strong>工房名声（Lv.1〜3: 0, Lv.4: 1, Lv.5: 3, Lv.6: 6, Lv.7: 10, Lv.8: 20, Lv.9: 50, Lv.10: 100）および同数のバトルエレメント（Lv.4: 1 E〜Lv.10: 100 E）</strong>も獲得できます。未生還時は何度でも再挑戦可能です。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">🎹 ピアノ演奏会 (Piano Rhythm)</strong>
                  <p className="text-stone-600">
                    難易度順（Lv.5 エリーゼのために［推奨INT 50前後］ → Lv.8 トルコ行進曲［推奨INT 75前後］ → Lv.10 ラ・カンパネラ［推奨INT 100前後］）に並んだ名曲を完全演奏する鍵盤リズムゲーム。演奏クリア（精度90%以上）時には楽曲難易度に応じた<strong>工房名声（+10〜+35）</strong>を獲得でき（※エレメント獲得はなし）、あわせて低ランクの<strong>古びた鉄の宝箱がドロップ</strong>します。演奏会場のバックグラウンドでは、ロボットが漆黒のグランドピアノを操る『ピアノ協奏曲・超絶技巧演奏』アニメーションを披露します。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200 sm:col-span-2">
                  <strong className="text-stone-900 block font-bold mb-1">♟️ クラシック頭脳対戦 (リバーシ / チェス / 五目並べ / 三目並べ)</strong>
                  <p className="text-stone-600">
                    ロボットの知力(INT)や思考ロジックを試すボードゲーム集。<strong>リバーシおよびチェスでは勝利時に専用の宝箱がドロップ</strong>し、回収可能！対局相手のレベルに応じた素材・ゴールド・工房名声および同数のバトルエレメント（Lv.4以上で名声と同数）を獲得できます。未勝利時は1日何回でも繰り返し挑戦できます。
                    <br />
                    <strong>🧠 リバーシ専用 戦術メモリ（思考ルーチン制御）システム:</strong>
                    リバーシでは、バトル勝利などで集めた<strong>エレメント（各150 E）を消費して「戦術メモリ」を購入・アンロック</strong>し、機体選択画面で<strong>最大3つまで装備</strong>することが可能です。装備したスロット順（優先度1 → 優先度2 → 優先度3）に候補手が段階的にフィルタリングされ、ロボットの着手AIの思考ルーチンを自由にカスタマイズ・最適化できます。
                    <br />
                    ・<strong>最多獲得優先:</strong> 一番石が多く取れる場所へ優先して打つ
                    <br />
                    ・<strong>最少獲得優先:</strong> 一番石が少なく取れる場所へ優先して打つ（相手に手を渡す戦法）
                    <br />
                    ・<strong>角確保優先:</strong> リバーシの要所である四隅の角(Corner)マスを最優先で確保
                    <br />
                    ・<strong>外周・端優先:</strong> 安定した辺・端(Edge)のマスを優先して陣地を固める
                    <br />
                    ・<strong>中央・内側優先:</strong> 外周を避けて内側(Center)マスに打つ手堅い戦法
                    <br />
                    ・<strong>上半分 / 下半分 / 右半分 / 左半分優先:</strong> 盤面の指定エリアを集中的に制圧・展開する偏向戦術
                    <br />
                    ・<strong>🔍 戦術メモリ適用デバッグ表示モード:</strong>
                    対局画面下部のトグルボタンから、いつでも「戦術メモリ思考デバッグモード」を起動可能。盤面上に<strong>各マスの反転可能石数（+N）、スロット合致マーク（#1〜#3）、対象ゾーンの点線枠、および最終着手ターゲット（★ BEST）</strong>がリアルタイムにオーバーレイ表示されます。また、全合法手（STEP 0）からスロット#1 → #2 → #3を経て最終手に絞り込まれるまでの全ステップを詳細に解説するパイプラインパネルも内蔵されています。
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
                  <strong className="text-stone-900 block font-bold mb-1">☁️ クラウド同期と単一トランザクション保護</strong>
                  <p className="text-stone-600">
                    Googleログイン時はサーバーとリアルタイムに自動同期。進行中（active）および完了（complete）テーブルを含む関連全テーブルの更新は完全な単一トランザクションで実行され、万が一更新エラーが発生した場合は即座に全変更がロールバックされ、画面上に通知と再試行案内が表示されます。
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-900 block font-bold mb-1">📦 倉庫・保管庫システム & 宝箱演出</strong>
                  <p className="text-stone-600">
                    「ロボット」「パーツ」「素材」「アイテム」の4分類で管理。アイテムタブでは未開封宝箱の即時開封や、修理キットによる機体HP回復・素材からのキット作成、エレメント・演習武装の保管状況を確認できます。
                    <br />
                    <strong>データベース構造化（user_item テーブル）:</strong> 修理キット所持数（<code>repair_kit</code>）、各ランク宝箱の所持数（<code>bronze_chest</code>, <code>silver_chest</code>, <code>gold_chest</code>, <code>mythic_chest</code>）、およびバトルエレメント数（<code>element</code>）は、専用の <code>user_item</code> テーブルへと独立・正規化されて永続保存されます。従来の巨大JSON（<code>save_data</code> テーブル）からはこれらのデータが物理的に削除され、アイテムデータの整合性と高速な同期が保証されています。
                    <br />
                    <strong>宝箱開封演出:</strong> 倉庫からの宝箱開封時には、開封前の激しい揺れ（CSSランブル）、黄金の光彩脈動（グローパルス）、閃光フラッシュ（ホワイト＆ゴールドバースト）、祝祭の紙吹雪（コンフェッティ）、神聖な放射光線スピン、アイテム出現アニメーション（ポップイン＆シマー光沢）、専用効果音（ガタガタ揺れ音・ロック解除音・開封ファンファーレ・アイテム出現音）による演出が施され、アイテム獲得のワクワク感を高めています。また、同一ティアの宝箱が手元に残っている場合は結果モーダルからそのまま「もう1個開封する」ワンタップ連続開封にも対応しています。
                    <br />
                    ロボットタブの倉庫容量拡張ボタンには誤操作を防ぐ確認ダイアログが導入されており、拡張後の上限や残高を事前に確認できます（工房称号は工房ダッシュボードに統合され常時確認可能）。
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
