import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/core';
import * as Gi from 'react-icons/gi';
import robotsWorkshopBg from '../assets/images/robots_workshop_bg_1788411232885.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';

export const TitleScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    
    setLoading(true);
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      
      let data;
      
      // 開発環境（AI Studioのプレビューなど、PHPが動かない環境）向けのモック処理
      if (import.meta.env.DEV) {
        console.log('[Dev Mode] Mocking login.php response');
        data = {
          success: true,
          user: {
            id: 1,
            google_id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
            received_initial_bonus: false
          }
        };
        // モックの遅延をシミュレート
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log('[Prod Mode] Fetching /api/login.php...');
        const res = await fetch('/api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            google_id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
          })
        });
        
        console.log('[Prod Mode] Response status:', res.status);
        const text = await res.text();
        console.log('[Prod Mode] Response text:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        
        if (text.startsWith('<?php')) {
          throw new Error('PHP is not running on this server.');
        }
        data = JSON.parse(text);
      }
      
      if (data.success && data.user) {
        setUser(data.user);
        onStart();
      } else {
        console.error('Login failed data:', data);
        alert(`ログイン処理に失敗しました: ${data.error || '不明なエラー'}`);
      }
    } catch (err: any) {
      console.error('Error during login try/catch:', err);
      alert(`サーバー通信エラーが発生しました:\n${err.message}`);
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
          <p className="text-xl text-stone-300 animate-pulse">読み込み中...</p>
        ) : user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-stone-300">ようこそ、{user.name}さん！</p>
            <Button size="lg" onClick={onStart} className="text-xl px-12 py-4 animate-bounce">
              工房を開く
            </Button>
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
            <p className="text-sm text-stone-400 mt-2">※ ゲストプレイをご希望の場合はログインせずに進めます</p>
            <Button size="md" onClick={onStart} variant="secondary" className="px-8 mt-2 opacity-80">
              ログインせずに始める
            </Button>
          </div>
        )}

        <p className="mt-12 text-stone-400">v1.0.336</p>
      </div>
      
      {/* Decorative background elements */}
      <Gi.GiGears className="absolute top-10 left-10 opacity-20 text-6xl z-0" />
      <Gi.GiSpanner className="absolute bottom-20 right-10 opacity-20 text-6xl z-0" />
      <Gi.GiRobotGolem className="absolute top-1/4 right-1/4 opacity-10 text-8xl z-0" />
    </div>
  );
};
