import re

with open('src/screens/MinigameScreen.tsx', 'r') as f:
    content = f.read()

# Modify the BattleChestAnimation or the section where it maps items
# Let's find where items are mapped
items_mapping = """                          {currentChestDrop.items.map((item, idx) => (
                            <div key={idx} className="flex items-center p-3 sm:p-4 rounded-xl bg-white border border-amber-200/50 shadow-sm gap-3 sm:gap-4 transform transition-all hover:scale-105">
                              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg">
                                {item.type === 'repairKit' && <Gi.GiSpanner className="text-3xl text-stone-600" />}
                                {item.type === 'gold' && <Gi.GiCoins className="text-3xl text-yellow-500" />}
                                {item.type === 'element' && <Gi.GiCrystalGrowth className="text-3xl text-cyan-500" />}
                                {item.type === 'material' && <MaterialIcon attribute={item.material?.attribute || 'Earth'} className="text-3xl" />}
                                {item.type === 'fame' && <Gi.GiStarMedal className="text-3xl text-amber-500" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-stone-500 leading-tight mb-0.5">{item.desc}</p>
                                <p className="text-sm font-bold text-stone-800">{item.name}</p>
                              </div>
                              <div className="text-lg sm:text-xl font-bold text-amber-600">
                                x{item.count}
                              </div>
                            </div>
                          ))}"""

chest_item_display = """                          <div className="flex items-center p-3 sm:p-4 rounded-xl bg-white border border-amber-200/50 shadow-sm gap-3 sm:gap-4 transform transition-all hover:scale-105">
                              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg">
                                <Gi.GiChest className="text-3xl text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-stone-500 leading-tight mb-0.5">未開封の宝箱 (倉庫から開封可能)</p>
                                <p className="text-sm font-bold text-stone-800">{currentChestDrop.chestTitle}</p>
                              </div>
                              <div className="text-lg sm:text-xl font-bold text-amber-600">
                                x1
                              </div>
                            </div>"""

content = content.replace(items_mapping, chest_item_display)

# Remove the "Open Chest again" button
open_again_button = """                        <div className="flex justify-center mt-4">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => setIsChestModalOpen(true)}
                            className="text-xs font-bold border-amber-300 text-amber-900 bg-amber-100/80 hover:bg-amber-200 shadow-2xs"
                          >
                            <Gi.GiChest className="inline text-amber-700 mr-1 text-sm" />
                            宝箱の開封演出をもう一度見る
                          </Button>
                        </div>"""

content = content.replace(open_again_button, '')

with open('src/screens/MinigameScreen.tsx', 'w') as f:
    f.write(content)
