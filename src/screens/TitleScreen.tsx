import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/core';
import * as Gi from 'react-icons/gi';
import robotsWorkshopBg from '../assets/images/robots_workshop_bg_1788411232885.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { AuthApiService } from '../services/AuthApiService';
import { GameEngine } from '../core/GameEngine';

interface TitleScreenProps {
  onStart: () => void;
  engine?: GameEngine;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, engine }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('読み込み中...');

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
            const cloudData = await apiService.loadUserData(response.user.google_id);
            // ローカルストレージは一切使用・保存せず、クラウドDBデータ（新規の場合はクリーンな初期データ）で起動
            await engine.switchToGoogleUser(response.user.google_id, cloudData, response.user.received_initial_bonus);
          } catch (syncErr) {
            console.warn('[TitleScreen] クラウドデータ取得エラー（初期データで開始）:', syncErr);
            await engine.switchToGoogleUser(response.user.google_id, null, response.user.received_initial_bonus);
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
            <Button size="lg" onClick={onStart} className="text-xl px-12 py-4 animate-bounce mt-4">
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
              useOneTap
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

        <p className="mt-12 text-stone-400">v1.0.344</p>
      </div>
      
      {/* Decorative background elements */}
      <Gi.GiGears className="absolute top-10 left-10 opacity-20 text-6xl z-0" />
      <Gi.GiSpanner className="absolute bottom-20 right-10 opacity-20 text-6xl z-0" />
      <Gi.GiRobotGolem className="absolute top-1/4 right-1/4 opacity-10 text-8xl z-0" />
    </div>
  );
};
