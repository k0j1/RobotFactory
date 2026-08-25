const fs = require('fs');
let code = fs.readFileSync('src/screens/Dashboard.tsx', 'utf-8');

// Add confetti import
code = code.replace(
  "import { motion, AnimatePresence } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';\nimport confetti from 'canvas-confetti';"
);

// Fire confetti on complete
code = code.replace(
  "setQuestResult(result);",
  `setQuestResult(result);\n      confetti({\n        particleCount: 150,\n        spread: 80,\n        origin: { y: 0.6 },\n        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']\n      });`
);

// Make the modal a motion.div with a flashy pop-in
const oldModal = `{questResult && !isAnimating && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-stone-50 text-center shadow-2xl">
            <h2 className={\`\${theme.typography.h2} mb-4 text-emerald-600\`}>
              遠征成功！
            </h2>
            <p className="mb-4 font-bold">以下の素材を獲得しました！</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6 max-h-64 overflow-y-auto p-2">
              {questResult.drops.map((dropId, i) => {
                const mat = MATERIALS.find(m => m.id === dropId);
                return (
                  <Badge key={i} className="bg-amber-100 text-amber-900 border border-amber-300 p-2 text-sm flex items-center gap-1">
                    <MaterialIcon materialId={mat?.id || ''} />
                    {mat?.name}
                  </Badge>
                );
              })}
            </div>
            <Button onClick={handleCloseModal} className="w-full" size="lg" variant="primary">倉庫へ送る</Button>
          </Card>
        </div>
      )}`;

const newModal = `<AnimatePresence>
      {questResult && !isAnimating && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="w-full max-w-md"
          >
            <Card className="w-full bg-stone-50 text-center shadow-2xl border-4 border-emerald-400 overflow-hidden relative">
              
              {/* Shiny background effect */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(52,211,153,0.3)_360deg)] opacity-50 pointer-events-none"
              />

              <div className="relative z-10">
                <motion.h2 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={\`\${theme.typography.h2} mb-4 text-emerald-500 drop-shadow-md text-3xl\`}
                  style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
                >
                  🎉 遠征成功！ 🎉
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 font-bold text-stone-700"
                >
                  以下の素材を獲得しました！
                </motion.p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-6 max-h-64 overflow-y-auto p-4 bg-stone-100 rounded-lg shadow-inner">
                  {questResult.drops.map((dropId, i) => {
                    const mat = MATERIALS.find(m => m.id === dropId);
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + (i * 0.05), type: "spring", stiffness: 300 }}
                      >
                        <Badge className="bg-white text-stone-800 border-2 border-emerald-200 p-2 text-sm flex items-center gap-2 shadow-sm">
                          <MaterialIcon materialId={mat?.id || ''} />
                          <span className="font-bold">{mat?.name}</span>
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <Button onClick={handleCloseModal} className="w-full text-lg shadow-lg hover:shadow-xl transition-shadow" size="lg" variant="success">
                    アイテムを回収する
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>`;

code = code.replace(oldModal, newModal);
fs.writeFileSync('src/screens/Dashboard.tsx', code);
