import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/core';
import * as Gi from 'react-icons/gi';
import { Database, ShieldCheck, UserCheck } from 'lucide-react';
import robotsWorkshopBg from '../assets/images/robots_workshop_bg_1788411232885.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { AuthApiService } from '../services/AuthApiService';
import { GameEngine } from '../core/GameEngine';

/**
 * Google AI Studio プレビュー実行環境判定
 */
function checkIsAiStudio(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const host = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || params.get('admin') === 'true') return true;
    if (host.includes('run.app') || host.includes('aistudio') || host.includes('googleusercontent')) return true;
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') return true;
    if (document.referrer && (document.referrer.includes('ai.studio') || document.referrer.includes('aistudio.google.com'))) return true;
  } catch {}
  return false;
}

// Viteのimport.meta.globを使用して、src/admin/ディレクトリが存在する場合のみ動的に読み込み
// （GitHub Actionsでsrc/admin/が除外されたリポジトリでもRollupの静的解決エラーを起こさず安全にビルド可能）
const adminModuleMap = import.meta.glob<{ AdminDatabaseModal: React.ComponentType<any> }>('../admin/AdminDatabaseModal.tsx');
const adminLoginModuleMap = import.meta.glob<{ AdminUserLoginModal: React.ComponentType<any> }>('../admin/AdminUserLoginModal.tsx');

const AdminDatabaseModal = React.lazy(async () => {
  const loader = adminModuleMap['../admin/AdminDatabaseModal.tsx'];
  if (loader) {
    try {
      const mod = await loader();
      return { default: mod.AdminDatabaseModal };
    } catch {
      return { default: () => null };
    }
  }
  return { default: () => null };
});

const AdminUserLoginModal = React.lazy(async () => {
  const loader = adminLoginModuleMap['../admin/AdminUserLoginModal.tsx'];
  if (loader) {
    try {
      const mod = await loader();
      return { default: mod.AdminUserLoginModal };
    } catch {
      return { default: () => null };
    }
  }
  return { default: () => null };
});

interface TitleScreenProps {
  onStart: () => void;
  engine?: GameEngine;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, engine }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('読み込み中...');
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showUserLoginModal, setShowUserLoginModal] = useState<boolean>(false);

  const isAiStudio = checkIsAiStudio();

  // AI Studio限定: 任意のユーザーIDによる直接ログイン
  const handleLoginAsUser = async (targetUserId: string, userRecord?: any) => {
    setLoading(true);
    setStatusMessage(`ユーザー (${targetUserId.slice(0, 10)}...) のデータを読み込み中...`);
    try {
      const apiService = AuthApiService.getInstance();
      const res = await apiService.loadUserData(targetUserId);

      const bonusVal = res.received_initial_bonus !== undefined && res.received_initial_bonus !== null
        ? Number(res.received_initial_bonus)
        : (userRecord?.received_initial_bonus !== undefined
            ? Number(userRecord.received_initial_bonus)
            : (res.user?.received_initial_bonus !== undefined ? Number(res.user.received_initial_bonus) : 0));

      let loggedUser: any = userRecord || res.user;
      if (!loggedUser) {
        loggedUser = {
          id: 0,
          google_id: targetUserId,
          email: '',
          name: `ユーザー (${targetUserId.slice(0, 8)})`,
          picture: '',
          received_initial_bonus: bonusVal
        };
      } else {
        loggedUser = { ...res.user, ...loggedUser, received_initial_bonus: bonusVal };
      }
      setUser(loggedUser);

      if (engine) {
        await engine.switchToGoogleUser(targetUserId, res.data);
      }
      onStart();
    } catch (err: any) {
      console.error('[TitleScreen] handleLoginAsUser error:', err);
      alert(`ユーザーログインに失敗しました: ${err.message || '通信エラー'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    
    setLoading(true);
    setStatusMessage('Googleアカウントを認証中...');
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      
      setStatusMessage('usersテーブルにユーザー情報を保存中...');
      console.log('[TitleScreen] Googleログイン成功、usersテーブルへの保存を開始します:', {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name
      });

      // AuthApiServiceを通じてMySQLのusersテーブルへ保存（INSERT / UPDATE）
      const apiService = AuthApiService.getInstance();
      const response = await apiService.saveUserToDatabase({
        google_id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
      
      if (response.success && response.user) {
        console.log('[TitleScreen] usersテーブル保存完了:', response.user);
        setUser(response.user);

        // Googleログイン完了後: 端末のローカルストレージデータは一切使用せず、クラウドDB上のデータのみでエンジンを稼働
        if (engine) {
          setStatusMessage('データベースからユーザー情報をロード中...');
          try {
            const res = await apiService.loadUserData(response.user.google_id);
            const bonusVal = res.received_initial_bonus ?? (res.user?.received_initial_bonus !== undefined ? Number(res.user.received_initial_bonus) : 0);
            if (res.user) {
              setUser({ ...res.user, received_initial_bonus: bonusVal });
            } else {
              setUser(prev => prev ? { ...prev, received_initial_bonus: bonusVal } : null);
            }
            // ローカルストレージは一切使用・保存せず、クラウドDBデータ（新規の場合はクリーンな初期データ）で起動
            await engine.switchToGoogleUser(response.user.google_id, res.data);
          } catch (syncErr) {
            console.warn('[TitleScreen] クラウドデータ取得エラー（初期データで開始）:', syncErr);
            await engine.switchToGoogleUser(response.user.google_id, null);
          }
        }

        onStart();
      } else {
        console.error('Login failed response:', response);
        alert(`usersテーブルへの保存に失敗しました: ${response.error || '不明なエラー'}`);
      }
    } catch (err: any) {
      console.error('Error during login try/catch:', err);
      alert(`ユーザー情報の保存・通信エラーが発生しました:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.secondary} ${theme.colors.textLight} flex flex-col items-center justify-center p-6 relative overflow-hidden font-['DotGothic16',_sans-serif]`}>
      {/* 全画面統一の工房背景画像 */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={robotsWorkshopBg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_35%] opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-stone-900/80" />
      </div>

      <div className="text-center z-10 relative flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-amber-500 drop-shadow-md">ポンコツ<br/>ロボット工房</h1>
        <p className={`${theme.typography.h3} mb-12 text-stone-300`}>ガラクタ集めて、夢をつくる。</p>
        
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Gi.GiGears className="text-4xl text-amber-400 animate-spin" />
            <p className="text-lg text-stone-300 animate-pulse">{statusMessage}</p>
          </div>
        ) : user ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 bg-stone-800/80 p-3 rounded-full border border-stone-600">
              {user.picture && <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full border border-stone-500" referrerPolicy="no-referrer" />}
              <p className="text-stone-300 font-bold pr-2">おかえりなさい、{user.name}さん！</p>
            </div>
            <Button size="lg" onClick={async () => {
              if (user && engine) {
                try {
                  const targetId = user.google_id || String((user as any).id);
                  const res = await AuthApiService.getInstance().loadUserData(targetId);
                  const bonusVal = res.received_initial_bonus ?? (res.user?.received_initial_bonus !== undefined ? Number(res.user.received_initial_bonus) : 0);
                  if (res.user) {
                    setUser({ ...res.user, received_initial_bonus: bonusVal });
                  } else {
                    setUser(prev => prev ? { ...prev, received_initial_bonus: bonusVal } : null);
                  }
                  await engine.switchToGoogleUser(targetId, res.data);
                } catch (e) {
                  console.warn('[TitleScreen] onStart loadUserData error:', e);
                }
              }
              onStart();
            }} className="text-xl px-12 py-4 animate-bounce mt-4">
              工房を開く
            </Button>
            <button 
              onClick={() => {
                setUser(null);
                engine?.switchToGuest();
              }} 
              className="text-stone-500 text-sm underline mt-2 hover:text-stone-300"
            >
              ログアウト（ゲストモードに戻る）
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
                alert('ログインに失敗しました');
              }}
            />
            <Button 
              size="md" 
              onClick={() => {
                engine?.switchToGuest();
                onStart();
              }} 
              variant="secondary" 
              className="px-8 mt-2 opacity-80"
            >
              ログインせずに始める（端末ローカル保存）
            </Button>
          </div>
        )}

        {/* Google AI Studio限定 管理メニュー */}
        {isAiStudio && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-md">
            <button
              onClick={() => setShowAdminModal(true)}
              className="group flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/90 hover:bg-stone-800 text-amber-400 hover:text-amber-300 rounded-full border border-amber-500/50 hover:border-amber-400 text-xs font-mono transition shadow-lg hover:shadow-amber-500/10"
              title="データベースの内容・各テーブルレコードを確認"
            >
              <Database size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">【管理者】DB管理画面</span>
              <span className="bg-amber-950 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-600/40">
                AI Studio限定
              </span>
            </button>
            <button
              onClick={() => setShowUserLoginModal(true)}
              className="group flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 rounded-full border border-emerald-500/60 hover:border-emerald-400 text-xs font-mono transition shadow-lg hover:shadow-emerald-500/10"
              title="任意のユーザーIDを指定してクラウドセーブから直接ログイン"
            >
              <UserCheck size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">ユーザーID指定ログイン</span>
              <span className="bg-emerald-900 text-emerald-200 text-[10px] px-1.5 py-0.5 rounded border border-emerald-600/50">
                AI Studio限定
              </span>
            </button>
          </div>
        )}

        <p className="mt-8 text-stone-400">v0.1.101</p>
      </div>
      
      {/* Decorative background elements */}
      <Gi.GiGears className="absolute top-10 left-10 opacity-20 text-6xl z-0" />
      <Gi.GiSpanner className="absolute bottom-20 right-10 opacity-20 text-6xl z-0" />
      <Gi.GiRobotGolem className="absolute top-1/4 right-1/4 opacity-10 text-8xl z-0" />

      {/* Google AI Studio 専用 DB管理モーダル */}
      {isAiStudio && showAdminModal && (
        <React.Suspense fallback={null}>
          <AdminDatabaseModal
            isOpen={showAdminModal}
            onClose={() => setShowAdminModal(false)}
          />
        </React.Suspense>
      )}

      {/* Google AI Studio 専用 ユーザーID指定ログインモーダル */}
      {isAiStudio && showUserLoginModal && (
        <React.Suspense fallback={null}>
          <AdminUserLoginModal
            isOpen={showUserLoginModal}
            onClose={() => setShowUserLoginModal(false)}
            onLoginAsUser={handleLoginAsUser}
            currentUserId={user?.google_id || (user ? String((user as any).id) : null)}
          />
        </React.Suspense>
      )}
    </div>
  );
};
