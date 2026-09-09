const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/CombatSkillModal.tsx', 'utf-8');

const replacement = `
                  <div className="bg-stone-900/90 p-2 rounded-lg border border-stone-800">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Gi.GiMuscleUp className="text-amber-400" /> 解放条件
                    </div>
                    <div className="text-xs font-bold text-amber-200 mt-0.5 space-y-0.5">
                      {activeInspectSkill.reqStat ? (
                        <div>{activeInspectSkill.reqStat.name} {activeInspectSkill.reqStat.value}+</div>
                      ) : (
                        <div className="text-stone-400">知性のみ</div>
                      )}
                      {activeInspectSkill.reqEquipment === 'beamSaber' && (
                        <div className="text-rose-400 text-[10px]"><Gi.GiBroadsword className="inline" /> Bサーベル装備</div>
                      )}
                      {activeInspectSkill.reqEquipment === 'beamShield' && (
                        <div className="text-cyan-400 text-[10px]"><Gi.GiShield className="inline" /> Bシールド装備</div>
                      )}
                    </div>
                  </div>
`;

// "                  <div className="bg-stone-900/90 p-2 rounded-lg border border-stone-800\">\n                    <div className="text-[10px] text-stone-400 flex items-center gap-1\">\n                      <Gi.GiMuscleUp className=\"text-amber-400\" /> 必要ステータス\n                    </div>\n                    <div className=\"text-xs font-bold text-amber-200 mt-0.5\">\n                      {activeInspectSkill.reqStat ? (\n                        <span>{activeInspectSkill.reqStat.name} {activeInspectSkill.reqStat.value}+</span>\n                      ) : (\n                        <span className=\"text-stone-400\">知性のみで解放</span>\n                      )}\n                    </div>\n                  </div>"
const oldHtml = `                  <div className="bg-stone-900/90 p-2 rounded-lg border border-stone-800">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Gi.GiMuscleUp className="text-amber-400" /> 必要ステータス
                    </div>
                    <div className="text-xs font-bold text-amber-200 mt-0.5">
                      {activeInspectSkill.reqStat ? (
                        <span>{activeInspectSkill.reqStat.name} {activeInspectSkill.reqStat.value}+</span>
                      ) : (
                        <span className="text-stone-400">知性のみで解放</span>
                      )}
                    </div>
                  </div>`;

content = content.replace(oldHtml, replacement.trim());
fs.writeFileSync('src/components/minigames/combat/CombatSkillModal.tsx', content);
