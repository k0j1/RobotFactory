import re

with open('src/screens/StorageScreen.tsx', 'r') as f:
    content = f.read()

chest_ui = """
      {tab === 'materials' && (
        <div className="space-y-4">
          {/* Unopened Chests Section */}
          {state.unopenedChests && Object.keys(state.unopenedChests).some(k => state.unopenedChests![k] > 0) && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                <Gi.GiChest className="mr-2 text-xl" />
                未開封の宝箱
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(state.unopenedChests).filter(([_, count]) => count > 0).map(([tier, count]) => (
                  <Card key={tier} className="p-3 flex flex-col items-center justify-center text-center bg-white">
                    <Gi.GiChest className={`text-4xl mb-2 ${tier === 'mythic' ? 'text-purple-500' : tier === 'gold' ? 'text-yellow-500' : tier === 'silver' ? 'text-gray-400' : 'text-amber-700'}`} />
                    <span className="text-xs font-bold text-stone-700 mb-1">
                      {tier === 'mythic' ? '神話の宝箱' : tier === 'gold' ? '金の宝箱' : tier === 'silver' ? '銀の宝箱' : '銅の宝箱'}
                    </span>
                    <Badge variant="secondary" className="mb-2">所持: {count}</Badge>
                    <Button size="sm" onClick={() => handleOpenChest(tier)} disabled={!!openingChest}>
                      開封する
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
"""

content = content.replace("{tab === 'materials' && (\n        <div className=\"space-y-4\">", chest_ui)

with open('src/screens/StorageScreen.tsx', 'w') as f:
    f.write(content)
