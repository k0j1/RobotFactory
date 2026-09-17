import React, { useEffect, useState } from 'react';
import { VersionCheckService } from '../../services/VersionCheckService';
import { theme } from '../../styles/theme';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export function VersionGuard() {
  const [mismatch, setMismatch] = useState(VersionCheckService.isMismatch());
  const [errorMsg, setErrorMsg] = useState(VersionCheckService.getErrorMessage());

  useEffect(() => {
    // 初回チェック
    VersionCheckService.checkVersion();

    // 購読
    const unsubscribe = VersionCheckService.subscribe((isMismatch, msg) => {
      setMismatch(isMismatch);
      setErrorMsg(msg);
    });
    return unsubscribe;
  }, []);

  if (!mismatch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md ${theme.colors.surface} border border-rose-500/50 rounded-xl p-6 shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4 border border-rose-500/30">
            <AlertOctagon className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-rose-400 mb-2">バージョン不一致</h2>
          <p className="text-stone-300 text-sm mb-6 whitespace-pre-wrap">
            {errorMsg || 'データベースのバージョンが想定と異なります。最新の状態にするため、ページをリロードしてください。'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            リロードする
          </button>
        </div>
      </div>
    </div>
  );
}
