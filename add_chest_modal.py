import re

with open('src/screens/StorageScreen.tsx', 'r') as f:
    content = f.read()

modal_ui = """
      {/* Chest Opening Modal */}
      {(openingChest || openedChestResult) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-stone-50 border-4 border-stone-300 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
            {openingChest ? (
              <div className="flex flex-col items-center py-8">
                <Gi.GiChest className="text-6xl text-amber-500 animate-bounce mb-4" />
                <h3 className="text-xl font-bold text-stone-800">宝箱を開封中...</h3>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-transparent opacity-50 pointer-events-none"></div>
                <Gi.GiOpenTreasureChest className="text-7xl text-amber-500 mb-2 drop-shadow-lg" />
                <h3 className="text-2xl font-bold text-amber-700 mb-6 relative z-10 drop-shadow-sm">開封結果</h3>
                <div className="w-full space-y-3 relative z-10 mb-6">
                  {openedChestResult.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center p-3 rounded-xl bg-white border border-stone-200 shadow-sm gap-4 transform transition-all hover:scale-105">
                      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg">
                        {item.type === 'gold' && <Gi.GiCoins className="text-3xl text-yellow-500" />}
                        {item.type === 'element' && <Gi.GiCrystalGrowth className="text-3xl text-cyan-500" />}
                        {item.type === 'material' && <MaterialIcon attribute={item.material?.attribute || 'Earth'} className="text-3xl" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-stone-500">{item.desc}</p>
                        <p className="text-sm font-bold text-stone-800">{item.name}</p>
                      </div>
                      <div className="text-lg font-bold text-amber-600">
                        x{item.count}
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setOpenedChestResult(null)} className="w-full font-bold shadow-md relative z-10">
                  閉じる
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
"""

content = content.replace("      {selectedBaselinePart && (", modal_ui + "\n      {selectedBaselinePart && (")

with open('src/screens/StorageScreen.tsx', 'w') as f:
    f.write(content)
