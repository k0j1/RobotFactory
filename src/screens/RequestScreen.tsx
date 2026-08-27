import React, { useState, useEffect } from 'react';
import { GameState, RequestRank, AttributeNames, Robot } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { ClientVisual } from '../components/ui/ClientVisual';
import { theme } from '../styles/theme';
import { TutorialPopup } from '../components/ui/TutorialPopup';

const CLIENT_SCHEDULE_INFO: Record<RequestRank, { label: string; interval: string; times: string; tagColor: string }> = {
  King: {
    label: '王様',
    interval: '24時間更新',
    times: '毎日 朝9:00',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  Noble: {
    label: '貴族',
    interval: '12時間更新',
    times: '毎日 9:00 / 21:00',
    tagColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  OldMan: {
    label: 'おじさん',
    interval: '6時間更新',
    times: '毎日 3:00 / 9:00 / 15:00 / 21:00',
    tagColor: 'bg-stone-100 text-stone-900 border-stone-300'
  }
};

const formatTimeRemaining = (ms: number) => {
  if (ms <= 0) return 'まもなく更新';
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSec / (3600 * 24));
  const h = Math.floor((totalSec % (3600 * 24)) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (d > 0) return `${d}日 ${h}時間${m}分`;
  if (h > 0) return `${h}時間${m}分${s.toString().padStart(2, '0')}秒`;
  return `${m}分${s.toString().padStart(2, '0')}秒`;
};

const formatClockTime = (timestamp: number) => {
  const d = new Date(timestamp);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const RequestScreen: React.FC<{ state: GameState; engine: GameEngine }> = ({ state, engine }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeliver = () => {
    if (!selectedRobotId) return;
    try {
      engine.deliverRobot(selectedRobotId);
      alert('納品完了！ 報酬を獲得しました。');
      setSelectedRobotId('');
    } catch (e: any) {
      alert(e.message || '納品に失敗しました');
    }
  };

  const handleCancelRequest = () => {
    if (!state.currentRequest) return;
    const clientName = state.currentRequest.clientName;
    if (window.confirm(`本当に「${clientName}」の依頼を破棄しますか？\n※好感度が1下がります。`)) {
      engine.cancelRequest();
      setSelectedRobotId('');
    }
  };

  const selectedRobot = state.robots.find(r => r.id === selectedRobotId);

  // Validation checker for active request
  const validateRobotForRequest = (robot: Robot) => {
    if (!state.currentRequest) return { valid: false, reason: '' };
    const req = state.currentRequest;

    if (req.requirements.attribute) {
      const robotAttrs = [robot.parts.head.attribute, robot.parts.body.attribute, robot.parts.arms.attribute, robot.parts.legs.attribute];
      if (!robotAttrs.includes(req.requirements.attribute)) {
        return { valid: false, reason: `属性が「${AttributeNames[req.requirements.attribute]}」のパーツが必要です` };
      }
    }

    if (req.requirements.statType && req.requirements.minStatValue) {
      if (robot.stats[req.requirements.statType] < req.requirements.minStatValue) {
        const statLabels: Record<string, string> = { hp: '体力', power: 'パワー', defense: 'ディフェンス', agility: 'アジリティ', dexterity: '器用さ' };
        return { valid: false, reason: `${statLabels[req.requirements.statType]}が${req.requirements.minStatValue}以上必要です` };
      }
    }

    return { valid: true, reason: '条件を満たしています！' };
  };

  const clientRanks: RequestRank[] = ['King', 'Noble', 'OldMan'];

  return (
    <div className="space-y-6">
      <TutorialPopup
        tutorialId="request_first_visit"
        state={state}
        engine={engine}
        title="依頼（納品）について"
        description={
          "ここでは完成したロボットを必要としている人たちに納品して、G（ゴールド）を稼ぐことができます。\n" +
          "・3人の依頼主（王様・貴族・おじさん）はそれぞれ独立した時間で依頼が更新されます。\n" +
          "・王様: 24時間（毎日 朝9:00）\n" +
          "・貴族: 12時間（毎日 9:00 / 21:00）\n" +
          "・おじさん: 6時間（毎日 3:00 / 9:00 / 15:00 / 21:00）\n" +
          "・受諾中の依頼も、その依頼主の次回更新時間を過ぎると自動的に期限切れ（キャンセル）となります。\n" +
          "・依頼達成で好感度が上がり、好感度10(MAX)で納品報酬ゴールドが1.5倍になります！"
        }
      />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-stone-200 pb-2">
        <h2 className={theme.typography.h2}>依頼掲示板</h2>
        <span className="text-xs text-stone-500 font-sans">
          現在時刻: {new Date(now).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Schedule & Rules Explanation Box */}
      <Card className="bg-stone-50 border border-stone-300 p-4">
        <h3 className={`${theme.typography.h4} text-stone-800 mb-2`}>📋 クライアント別の更新ルールと好感度</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-xs">
          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
            <span className="font-bold text-amber-900">👑 王様 (24時間更新)</span>
            <p className="text-amber-800 mt-1">毎日 朝 9:00 更新</p>
          </div>
          <div className="p-2 bg-purple-50 border border-purple-200 rounded">
            <span className="font-bold text-purple-900">🍷 貴族 (12時間更新)</span>
            <p className="text-purple-800 mt-1">毎日 9:00 / 21:00 更新</p>
          </div>
          <div className="p-2 bg-stone-100 border border-stone-200 rounded">
            <span className="font-bold text-stone-900">🔧 おじさん (6時間更新)</span>
            <p className="text-stone-700 mt-1">毎日 3:00 / 9:00 / 15:00 / 21:00 更新</p>
          </div>
        </div>
        <p className="text-xs text-stone-600 font-sans leading-relaxed">
          ※受諾中の依頼も次回更新時間を過ぎると自動キャンセルとなります。納品成功で好感度+1、破棄で好感度-1。好感度10(MAX)で報酬ゴールドが1.5倍！
        </p>
      </Card>

      {/* Active In-Progress Request Section */}
      {state.currentRequest && (
        <Card className="border-2 border-blue-400 bg-blue-50/80 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded">受注中</span>
              <h3 className={`${theme.typography.h3} text-blue-950`}>進行中の依頼</h3>
            </div>
            <Button variant="danger" size="sm" onClick={handleCancelRequest}>
              依頼を破棄する (好感度-1)
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start mb-4 bg-white/80 p-3 rounded-lg border border-blue-200">
            <ClientVisual rank={state.currentRequest.rank} size={68} />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    state.currentRequest.rank === 'King'
                      ? 'bg-amber-200 text-amber-900'
                      : state.currentRequest.rank === 'Noble'
                      ? 'bg-purple-200 text-purple-900'
                      : 'bg-stone-200 text-stone-900'
                  }
                >
                  {state.currentRequest.clientName}
                </Badge>

                {/* Affection Display */}
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  好感度: Lv.{state.clientAffection?.[state.currentRequest.rank] || 1}/10
                  {(state.clientAffection?.[state.currentRequest.rank] || 1) >= 10 && ' ★MAX(1.5倍)'}
                </span>

                <span className="text-xs text-stone-500 font-sans ml-auto">
                  {CLIENT_SCHEDULE_INFO[state.currentRequest.rank].interval} ({CLIENT_SCHEDULE_INFO[state.currentRequest.rank].times})
                </span>
              </div>

              <p className="p-2.5 bg-stone-50 rounded text-sm text-stone-800 border border-stone-200 font-medium">
                「{state.currentRequest.description}」
              </p>

              <div className="flex flex-wrap justify-between items-center text-sm pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600 text-base">
                    報酬: {state.currentRequest.rewardG} G
                  </span>
                  {(state.clientAffection?.[state.currentRequest.rank] || 1) >= 10 && (
                    <span className="text-xs text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                      (納品時 1.5倍: {Math.floor(state.currentRequest.rewardG * 1.5)} G)
                    </span>
                  )}
                </div>
                <span className="text-red-600 font-bold text-xs sm:text-sm font-mono">
                  期限まで: {formatTimeRemaining(state.currentRequest.deadline - now)} ({formatClockTime(state.currentRequest.deadline)}更新)
                </span>
              </div>
            </div>
          </div>

          {/* Robot Selector */}
          <div className="space-y-3 pt-2 border-t border-blue-200">
            <h4 className="font-bold text-sm text-blue-950 flex justify-between items-center">
              <span>納品するロボットを選択</span>
              {selectedRobot && (
                <span
                  className={`text-xs font-bold ${
                    validateRobotForRequest(selectedRobot).valid ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {validateRobotForRequest(selectedRobot).reason}
                </span>
              )}
            </h4>

            {state.robots?.length === 0 ? (
              <p className="text-sm text-stone-500 bg-white p-4 rounded text-center border border-dashed border-stone-300">
                倉庫にロボットがいません。「製造」メニューでロボットを作ってください。
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                {state.robots.map((r, idx) => {
                  const isSelected = selectedRobotId === r.id;
                  const validation = validateRobotForRequest(r);

                  return (
                    <button
                      key={`${r.id}-${idx}`}
                      type="button"
                      onClick={() => setSelectedRobotId(r.id)}
                      className={`p-2 border-2 text-left transition rounded-md flex flex-col items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-100 shadow-sm'
                          : validation.valid
                          ? 'border-stone-200 bg-white hover:border-blue-300'
                          : 'border-stone-200 bg-stone-100/70 opacity-75'
                      }`}
                    >
                      <RobotVisual robot={r} size={52} />
                      <p className="text-xs font-bold mt-1 text-center truncate w-full">{r.name}</p>
                      <div className="flex gap-1 items-center mt-1">
                        {validation.valid ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">適合</span>
                        ) : (
                          <span className="text-[10px] bg-stone-200 text-stone-600 px-1 rounded">不適合</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <Button
              className="w-full mt-2"
              size="lg"
              variant={selectedRobot && validateRobotForRequest(selectedRobot).valid ? 'primary' : 'secondary'}
              disabled={!selectedRobot || !validateRobotForRequest(selectedRobot).valid}
              onClick={handleDeliver}
            >
              {!selectedRobot
                ? '納品するロボットを選択してください'
                : validateRobotForRequest(selectedRobot).valid
                ? 'このロボットを納品して報酬を受け取る'
                : '条件を満たしていません'}
            </Button>
          </div>
        </Card>
      )}

      {/* 3 Clients Board */}
      <div className="space-y-4">
        <h3 className={`${theme.typography.h3} text-stone-800`}>
          クライアント別の依頼状況 (全3名)
        </h3>

        <div className="grid gap-4">
          {clientRanks.map(rank => {
            const schedule = CLIENT_SCHEDULE_INFO[rank];
            const updateTimes = engine.getUpdateTimes(rank, now);
            const isCurrentActive = state.currentRequest?.rank === rank;
            const isCompletedThisSlot = state.completedRequestDeadlines?.[rank] === updateTimes.next;
            const availableReq = state.availableRequests.find(r => r.rank === rank);
            const affection = state.clientAffection?.[rank] || 1;

            return (
              <Card
                key={rank}
                className={`transition ${
                  isCurrentActive
                    ? 'border-2 border-blue-400 bg-blue-50/40'
                    : isCompletedThisSlot
                    ? 'border border-stone-300 bg-stone-100/80 opacity-80'
                    : 'border border-stone-300 bg-white hover:border-stone-400 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center sm:items-start gap-3">
                    <ClientVisual rank={rank} size={72} />
                    <div className="sm:hidden flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base">{schedule.label}</span>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${schedule.tagColor}`}>
                          {schedule.interval}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{schedule.times}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Desktop Header */}
                      <div className="hidden sm:flex justify-between items-center mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            className={`whitespace-nowrap leading-none ${
                              rank === 'King'
                                ? 'bg-amber-200 text-amber-900'
                                : rank === 'Noble'
                                ? 'bg-purple-200 text-purple-900'
                                : 'bg-stone-200 text-stone-900'
                            }`}
                          >
                            {schedule.label}
                          </Badge>

                          <span className={`text-xs px-2 py-0.5 rounded border font-medium whitespace-nowrap leading-none ${schedule.tagColor}`}>
                            {schedule.interval} ({schedule.times})
                          </span>

                          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded whitespace-nowrap leading-none inline-flex items-center">
                            好感度: Lv.{affection}/10
                            {affection >= 10 && ' ★MAX(1.5倍)'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isCurrentActive && <Badge className="bg-blue-500 text-white leading-none whitespace-nowrap">受注中</Badge>}
                          {isCompletedThisSlot && <Badge className="bg-emerald-100 text-emerald-800 leading-none whitespace-nowrap">今期 納品完了</Badge>}
                          {!isCurrentActive && !isCompletedThisSlot && availableReq && (
                            <Badge className="bg-amber-100 text-amber-800 leading-none whitespace-nowrap">募集中</Badge>
                          )}
                        </div>
                      </div>

                      {/* Mobile Badge & Affection */}
                      <div className="flex sm:hidden justify-between items-center mb-2 flex-wrap gap-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge
                            className={`whitespace-nowrap leading-none text-[11px] ${
                              rank === 'King'
                                ? 'bg-amber-200 text-amber-900'
                                : rank === 'Noble'
                                ? 'bg-purple-200 text-purple-900'
                                : 'bg-stone-200 text-stone-900'
                            }`}
                          >
                            {schedule.label}
                          </Badge>
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded whitespace-nowrap leading-none">
                            Lv.{affection} {affection >= 10 ? '★MAX' : ''}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {isCurrentActive && <Badge className="bg-blue-500 text-white text-[10px] leading-none whitespace-nowrap">受注中</Badge>}
                          {isCompletedThisSlot && <Badge className="bg-emerald-100 text-emerald-800 text-[10px] leading-none whitespace-nowrap">今期 納品完了</Badge>}
                          {!isCurrentActive && !isCompletedThisSlot && availableReq && (
                            <Badge className="bg-amber-100 text-amber-800 text-[10px] leading-none whitespace-nowrap">募集中</Badge>
                          )}
                        </div>
                      </div>

                      {/* Request Content / Body */}
                      {isCurrentActive ? (
                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-sm text-blue-900">
                          <p className="font-bold mb-1">【現在受注中です】</p>
                          <p>「{state.currentRequest?.description}」</p>
                          <p className="text-xs text-amber-700 font-bold mt-2">
                            報酬: {state.currentRequest?.rewardG} G
                            {affection >= 10 && ` (MAXボーナス適用時: ${Math.floor((state.currentRequest?.rewardG || 0) * 1.5)} G)`}
                          </p>
                        </div>
                      ) : isCompletedThisSlot ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-900">
                          <p className="font-bold">✨ 今回の依頼は納品完了しました！</p>
                          <p className="text-xs text-emerald-700 mt-1 font-sans">
                            次回の依頼更新（{formatClockTime(updateTimes.next)}）をお待ちください。
                          </p>
                        </div>
                      ) : availableReq ? (
                        <div className="p-3 bg-stone-50 border border-stone-200 rounded text-sm">
                          <p className="font-medium text-stone-800 mb-2">「{availableReq.description}」</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-amber-600 text-sm">
                              報酬: {availableReq.rewardG} G
                              {affection >= 10 && (
                                <span className="text-amber-800 font-bold ml-1">
                                  (好感度MAX時: {Math.floor(availableReq.rewardG * 1.5)} G)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 py-2">依頼の準備中...</p>
                      )}
                    </div>

                    {/* Bottom Action and Countdown */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pt-1 border-t border-stone-200">
                      <div className="text-xs text-stone-500 font-sans">
                        <span>次回更新: {formatClockTime(updateTimes.next)} </span>
                        <span className="font-mono text-stone-700 font-bold">
                          (残り {formatTimeRemaining(updateTimes.next - now)})
                        </span>
                      </div>

                      <div>
                        {isCurrentActive ? (
                          <Button size="sm" variant="secondary" disabled>
                            受注中 (上部で納品)
                          </Button>
                        ) : isCompletedThisSlot ? (
                          <Button size="sm" variant="secondary" disabled>
                            納品済み (更新待ち)
                          </Button>
                        ) : availableReq ? (
                          <Button
                            size="sm"
                            disabled={!!state.currentRequest}
                            onClick={() => engine.acceptRequest(availableReq.id)}
                          >
                            {state.currentRequest ? '他を受注中' : 'この依頼を受ける'}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
