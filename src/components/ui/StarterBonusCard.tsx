import React, { useState } from 'react';
import * as Gi from 'react-icons/gi';
import { GameEngine } from '../../core/GameEngine';
import { GameState, AttributeColors, AttributeNames } from '../../core/models';
import { MATERIALS, STARTER_BONUS_MATERIALS } from '../../core/data';
import { theme } from '../../styles/theme';
import { Button, Badge } from './core';
import { MaterialIcon } from './MaterialIcon';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthApiService } from '../../services/AuthApiService';

interface StarterBonusCardProps {
  state: GameState;
  engine: GameEngine;
  onNavigate?: (screen: string) => void;
  compact?: boolean;
}

/**
 * 新人技師応援！初回ロボット組み立て用ボーナス素材（全☆1ランクのみ）受取コンポーネント
 */
export const StarterBonusCard: React.FC<StarterBonusCardProps> = ({
  state,
  engine,
  onNavigate,
  compact = false
}) => {
  const { user, markBonusClaimed } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justClaimed, setJustClaimed] = useState(false);

  // DB上の受取済み判定（received_initial_bonusが1またはtrueなら受取済み）
  const isClaimedInDb = user
    ? (Number(user.received_initial_bonus) === 1 || user.received_initial_bonus === true)
    : false;

  // DB上は未受取（received_initial_bonus == 0）なのに、エンジンのstarterBonusClaimedがtrueになっている不整合を自動解消
  React.useEffect(() => {
    if (user && !isClaimedInDb && state.starterBonusClaimed) {
      console.log('[StarterBonusCard] DB未受取(received_initial_bonus=0)に合わせてengineのstarterBonusClaimedをfalseにリセット');
      engine.setStarterBonusClaimed(false);
    }
  }, [user, isClaimedInDb, state.starterBonusClaimed, engine]);

  // ログインしていない場合、またはすでに受け取り済みの場合は表示しない
  // ※DB上で未受取（received_initial_bonusが0）であれば、過去のキャッシュ状態に関わらず必ず受け取りカードを表示する
  if (!user || (isClaimedInDb && !justClaimed)) {
    return null;
  }

  const triggerBonusConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
        zIndex: 9999,
        disableForReducedMotion: true
      });
    } catch {
      // ignore
    }
  };

  const handleClaim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    setErrorMessage(null);

    try {
      // APIに受取完了を通知（user_workshop_statusテーブルのreceived_initial_bonusを更新）
      const apiService = AuthApiService.getInstance();
      await apiService.claimInitialBonus(user.google_id);

      // 成功時、コンテキストを更新してゲームエンジン側でもアイテムを付与（force=trueで安全・確実に付与）
      markBonusClaimed();
      engine.claimStarterBonus(true);
      setJustClaimed(true);
      triggerBonusConfetti();
    } catch (err: any) {
      console.error('[StarterBonusCard] Error claiming starter bonus:', err);
      // API通信エラー時のフォールバック: ユーザーがボーナスを受け取れるようにエンジンへの付与を行い、次回同期に委ねる
      try {
        markBonusClaimed();
        engine.claimStarterBonus(true);
        setJustClaimed(true);
        triggerBonusConfetti();
      } catch (localErr: any) {
        setErrorMessage(err.message || 'ボーナスの受け取りに失敗しました。');
      }
    } finally {
      setIsClaiming(false);
    }
  };

  // 受取完了後のメッセージ表示
  if (justClaimed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <Gi.GiCheckMark size={24} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">
                初回ボーナス（☆1素材24個）を受け取りました！
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                ヘッド・ボディ・アーム・レッグを作って、さっそく最初のロボットを組み立ててみましょう！
              </p>
            </div>
          </div>
          {onNavigate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('craft')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs shrink-0 shadow-sm"
            >
              <Gi.GiGears className="mr-1" size={14} />
              製造メニューへ行く
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  // コンパクトモード（製造画面上部など）
  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-50 via-amber-100/70 to-yellow-50 border-2 border-amber-400 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 animate-bounce">
            <Gi.GiPresent size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-amber-950">新人技師初回ボーナス</span>
              <span className="text-[10px] bg-amber-200/90 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                すべて☆1・計24個
              </span>
            </div>
            <p className="text-[11px] text-amber-800 truncate">
              ロボット1体を即座に組み立て可能な素材セットが未受取です！
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleClaim}
          disabled={isClaiming}
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 text-xs shrink-0 shadow-xs cursor-pointer"
        >
          <Gi.GiSparkles className="mr-1" size={13} />
          {isClaiming ? '受取中...' : 'ボーナスを受け取る'}
        </Button>
      </div>
    );
  }

  // 通常モード（ダッシュボード等でのリッチ表示）
  return (
    <div className="bg-gradient-to-br from-[#fffbf4] via-[#fbf3e6] to-[#f5e7d3] border-2 border-[#d4a373] rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden">
      {/* 背景装飾 */}
      <Gi.GiRobotGolem className="absolute -right-3 -bottom-4 text-amber-950/5 text-8xl pointer-events-none" />

      {/* ヘッダー部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs border border-amber-400 shrink-0">
            <Gi.GiPresent size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-sm sm:text-base text-amber-950">
                新人技師応援！初回ロボット組み立てボーナス
              </h3>
              <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                全☆1ランク素材・計24個
              </Badge>
              <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.2 rounded font-bold">
                1回限定
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              工房へようこそ！今すぐロボット1体を即座に組み立てられる☆1素材セットをプレゼント！
            </p>
          </div>
        </div>

        {/* 受取ボタン */}
        <div className="sm:shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black px-5 py-2.5 text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Gi.GiSparkles size={16} />
            <span>{isClaiming ? '受取処理中...' : 'ボーナスを受け取る！'}</span>
          </Button>
        </div>
      </div>

      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-800 text-xs rounded-lg font-bold">
          {errorMessage}
        </div>
      )}

      {/* 付与される☆1素材一覧プレビュー */}
      <div className="bg-white/90 border border-[#e2cfbd] rounded-lg p-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 mb-2">
          <span className="flex items-center gap-1">
            <Gi.GiAnvil className="text-amber-700" />
            受け取れる☆1素材セット（各部位の製造に必要な5個×4部位＝計20個を完全網羅）
          </span>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
            合計 24個
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {STARTER_BONUS_MATERIALS.map(item => {
            const mat = MATERIALS.find(m => m.id === item.materialId);
            if (!mat) return null;
            const rStyle = theme.rarity[1]; // すべて☆1
            const attrColor = AttributeColors[mat.attribute];

            return (
              <div
                key={`starter-${mat.id}`}
                className="bg-[#faf7f2] border border-[#d6beaa] rounded-lg p-2 flex items-center gap-2 shadow-2xs relative"
              >
                <div className="shrink-0" style={{ color: attrColor }}>
                  <MaterialIcon materialId={mat.id} size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-bold text-amber-600 leading-none">
                      {rStyle.stars}
                    </span>
                    <Badge className="bg-stone-800 text-white font-mono font-bold text-[9px] px-1 py-0.2 leading-none">
                      x{item.count}
                    </Badge>
                  </div>
                  <div className="text-[10px] font-bold text-stone-800 truncate mt-0.5">
                    {mat.name}
                  </div>
                  <div className="text-[8px] text-stone-500 font-bold">
                    {AttributeNames[mat.attribute]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
