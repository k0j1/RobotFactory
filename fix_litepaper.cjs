const fs = require('fs');
let data = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf8');

data = data.replace(/・ステータスは「HP」「パワー」「ディフェンス」「アジリティ」「器用さ」の5種類/g, '・ステータスは「HP」「パワー」「ディフェンス」「アジリティ」「器用さ」「賢さ(Int)」の6種類\n            ・賢さ(Int)はオートバトル(オセロ)などでのAIの強さに直結します');
data = data.replace(/<ul>/g, `<ul>
              <li><strong>バトル(オセロ):</strong> 組み立てたロボットのInt値を元に、様々な相手とオートでオセロ対戦が行えます。勝利で報酬を獲得できます。</li>`);

fs.writeFileSync('src/screens/LitepaperScreen.tsx', data);
