import { useEffect, useState, useRef } from 'react';
import { GameEngine } from '../core/GameEngine';
import { GameState } from '../core/models';
import { AuthApiService } from '../services/AuthApiService';
import { useAuth } from '../contexts/AuthContext';

export function useGameState(userId?: string | null) {
  const [state, setState] = useState<GameState | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const lastUserIdRef = useRef<string | null | undefined>(userId);
  const { setUser } = useAuth();

  useEffect(() => {
    // 初期インスタンス化（userIdがある場合はローカルストレージのデータを一切読まない）
    const engine = new GameEngine((newState) => {
      setState(newState);
    }, userId);

    engineRef.current = engine;
    setState(engine.getState());

    // 既にGoogleログイン状態の場合は、クラウドDBからデータをロードして適用
    if (userId) {
      AuthApiService.getInstance().loadUserData(userId).then((res) => {
        engine.switchToGoogleUser(userId, res.data);
        engine.generateRequestsIfNeeded();
        const bonusVal = res.received_initial_bonus ?? (res.user?.received_initial_bonus !== undefined ? Number(res.user.received_initial_bonus) : 0);
        if (res.user) {
          setUser({ ...res.user, received_initial_bonus: bonusVal });
        } else {
          setUser(prev => prev ? { ...prev, received_initial_bonus: bonusVal } : null);
        }
      }).catch((err) => {
        console.warn('[useGameState] 初回クラウドデータロード失敗（初期データ使用）:', err);
        engine.switchToGoogleUser(userId, null);
      });
    } else {
      engine.generateRequestsIfNeeded();
    }

    // Loop to trigger re-renders for timers
    const interval = setInterval(() => {
       // Just force an update to keep timers moving
       setState(s => s ? {...s} : null);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ユーザーIDの変更（ログイン・ログアウト）を監視してエンジン側のアカウント状態を切り替え
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (lastUserIdRef.current !== userId) {
      lastUserIdRef.current = userId;
      if (userId) {
        // Googleログイン時: クラウドDBからのみロードし、ローカルストレージは一切使用しない
        AuthApiService.getInstance().loadUserData(userId).then((res) => {
          engine.switchToGoogleUser(userId, res.data);
          const bonusVal = res.received_initial_bonus ?? (res.user?.received_initial_bonus !== undefined ? Number(res.user.received_initial_bonus) : 0);
          if (res.user) {
            setUser({ ...res.user, received_initial_bonus: bonusVal });
          } else {
            setUser(prev => prev ? { ...prev, received_initial_bonus: bonusVal } : null);
          }
        }).catch((err) => {
          console.warn('[useGameState] クラウドデータロード失敗（初期データ使用）:', err);
          engine.switchToGoogleUser(userId, null);
        });
      } else {
        // ログアウト時: ゲスト用のローカルストレージへ切り替え
        engine.switchToGuest();
      }
    }
  }, [userId, setUser]);

  return { state, engine: engineRef.current };
}
