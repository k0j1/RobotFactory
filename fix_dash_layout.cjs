const fs = require('fs');
let code = fs.readFileSync('src/screens/Dashboard.tsx', 'utf8');

// 1. Change "DELIVERED" to "納品数"
code = code.replace(
  '<div className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-widest leading-none mb-0.5">DELIVERED</div>',
  '<div className="text-[9px] font-bold text-emerald-600/80 tracking-widest leading-none mb-0.5">納品数</div>'
);

// 2. Change the monolithic header into separated headers.
const oldStructure = `        {/* 出撃・探索ヘッダー */}
        <div className="border-t border-stone-800 pt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-300 text-sm font-mono tracking-wider">
              <span className="text-amber-500"><Gi.GiFactory className="inline" /></span>
              FACTORY STATUS
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {totalAutoPendingDrops > 0 && (
              <Button size="sm" variant="success" onClick={handleClaimAllAutoDispatches} className="animate-pulse text-xs px-2.5 py-1 font-bold shadow-xs border border-emerald-600 bg-emerald-700/80">
                📦 CLAIM ALL ({totalAutoPendingDrops})
              </Button>
            )}
            <Button size="sm" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 font-mono">
              + DEPLOY
            </Button>
          </div>
        </div>

        {/* 出撃中のアクティビティリスト */}
        {!hasActiveMission ? (
          <div className="p-4 bg-stone-50/80 rounded-xl border border-dashed border-stone-300 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🏕️</span>
            <p className="text-xs text-stone-500 font-bold">現在、出撃中のロボットはいません</p>
            <div className="flex gap-2 mt-1">
              <Button size="sm" onClick={() => onNavigate('quest')} className="text-xs px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white">
                🎒 遠征へ出発
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-3 py-1">
                <Gi.GiWalkingScout className="inline mr-1" /> 自動探索へ派遣
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* 通常遠征 (Quest) */}
            {state.activeQuest ? (`;

const newStructure = `        {/* 通常遠征ヘッダー */}
        <div className="border-t border-stone-800 pt-3 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-300 text-sm tracking-wider">
              <Gi.GiWalkingScout className="text-amber-500" size={18} />
              通常遠征
            </div>
          </div>
        </div>

        <div className="mb-4">
          {state.activeQuest ? (`;

code = code.replace(oldStructure, newStructure);

const oldQuestEnd = `            )}

            {/* 自動探索ロボット一覧 (Auto Dispatches) */}`;

const newQuestEnd = `            ) : (
              <div className="p-2.5 bg-stone-50/60 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg"><Gi.GiWalkingScout /></span>
                  <span className="text-xs text-stone-600 font-bold">通常遠征: 未出撃</span>
                </div>
                <Button size="sm" onClick={() => onNavigate('quest')} className="text-xs px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-sm">
                  遠征へ向かう →
                </Button>
              </div>
            )}
        </div>

        {/* 自動探索ヘッダー */}
        <div className="border-t border-stone-800 pt-3 mb-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-300 text-sm tracking-wider">
              <Gi.GiFactory className="text-amber-500" size={16} />
              自動探索
            </div>
            {(state.autoDispatches && state.autoDispatches.length > 0) && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {totalAutoPendingDrops > 0 && (
              <Button size="sm" variant="success" onClick={handleClaimAllAutoDispatches} className="animate-pulse text-xs px-2.5 py-1 font-bold shadow-xs border border-emerald-600 bg-emerald-700/80">
                📦 まとめて回収 ({totalAutoPendingDrops})
              </Button>
            )}
            <Button size="sm" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 font-mono shadow-sm">
              <Gi.GiWalkingScout className="inline mr-1" /> 派遣する
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          {(!state.autoDispatches || state.autoDispatches.length === 0) && (
            <div className="p-4 bg-stone-50/80 rounded-xl border border-dashed border-stone-300 text-center flex flex-col items-center justify-center gap-2">
              <Gi.GiSleepy className="text-3xl text-stone-400" />
              <p className="text-xs text-stone-500 font-bold">現在、自動探索中のロボットはいません</p>
            </div>
          )}
          {/* 自動探索ロボット一覧 (Auto Dispatches) */}`;

code = code.replace(oldQuestEnd, newQuestEnd);

// There is one more closing tag for the `hasActiveMission` ternary at the bottom of the list. We need to find and remove it.
// At the very end of the autoDispatches map, there is `)}`
// Let's replace the ending `)}` before `{/* 工房のアクティビティ（製造・解体等） */}`
const oldListEnd = `            })}
          </div>
        )}

        {/* 工房のアクティビティ（製造・解体等） */}`;

const newListEnd = `            })}
        </div>

        {/* 工房のアクティビティ（製造・解体等） */}`;

code = code.replace(oldListEnd, newListEnd);

fs.writeFileSync('src/screens/Dashboard.tsx', code);
