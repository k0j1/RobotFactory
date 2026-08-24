import React, { useState } from 'react';
import { GameState, AttributeColors } from '../core/models';
import { Card, Button, Badge } from '../components/ui/core';
import { theme } from '../styles/theme';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { SVG_HEADS, SVG_BODIES, SVG_ARMS, SVG_LEGS } from '../components/robot/RobotSVGs';
import { MATERIALS } from '../core/data';
import { FaRobot, FaBox, FaWrench, FaShoePrints, FaStar } from 'react-icons/fa';
import { MaterialIcon } from '../components/ui/MaterialIcon';

const SinglePart: React.FC<{ Comp: React.FC<{color: string, viewBox?: string}>, color: string, type: 'head'|'body'|'arms'|'legs', rarityLabel?: number }> = ({ Comp, color, type, rarityLabel }) => {
  const viewBox = type === 'head' ? '20 0 60 45' :
                  type === 'body' ? '25 32 50 48' :
                  type === 'arms' ? '5 38 90 42' :
                  '20 68 60 32';

  return (
    <div className="bg-stone-100 rounded p-1 flex flex-col items-center border border-stone-200 overflow-hidden w-full aspect-square justify-center">
      {rarityLabel !== undefined && (
        <span className="text-[10px] flex items-center gap-0.5 mb-1 text-amber-600 font-bold">
          <FaStar size={10} />{rarityLabel}
        </span>
      )}
      <div className="flex-1 w-full flex items-center justify-center p-1">
        <Comp color={color} viewBox={viewBox} />
      </div>
    </div>
  );
};

export const EncyclopediaScreen: React.FC<{ state: GameState, onBack: () => void }> = ({ state, onBack }) => {
  const [tab, setTab] = useState<'history'|'parts'>('history');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>図鑑・実績</h2>
        <Button size="sm" variant="secondary" onClick={onBack}>戻る</Button>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={tab === 'history' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('history')}
        >
          納品履歴
        </Button>
        <Button 
          variant={tab === 'parts' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('parts')}
        >
          素材・パーツ詳細
        </Button>
      </div>

      {tab === 'history' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <p className="text-xs text-stone-500">総納品数</p>
              <p className={`${theme.typography.h2} text-amber-600`}>{state.deliveredRobotsCount}</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs text-stone-500">獲得総額推計</p>
              <p className={`${theme.typography.h2} text-amber-600`}>{state.deliveredLogs.reduce((acc, log) => acc + log.stats.hp, 0)} G</p> 
            </Card>
          </div>

          <h3 className={theme.typography.h3}>納品済みロボット履歴</h3>
          {state.deliveredLogs.length === 0 ? (
            <p className="text-stone-500 text-center py-8">まだ納品されたロボットはありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.deliveredLogs.slice().reverse().map(log => (
                <Card key={`${log.id}-${log.deliveredAt}`} className="flex items-center gap-4">
                  <div className="bg-stone-100 rounded p-2">
                    <RobotVisual robot={{ parts: log.parts } as any} size={64} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{log.name}</p>
                    <p className="text-xs text-stone-500">
                      {new Date(log.deliveredAt).toLocaleDateString()} に納品
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'parts' && (
        <div className="space-y-4">
          <p className="text-sm text-stone-600 mb-4 bg-stone-100 p-4 rounded-md">
            クラフトに使用した素材の<strong>レア度（★）</strong>と<strong>属性</strong>によって、完成するパーツの見た目が変化します。高レアな素材を使うほど、珍しいパーツが選ばれる可能性が高くなります。
          </p>

          {MATERIALS.map(mat => {
            const color = AttributeColors[mat.attribute];
            return (
              <Card key={mat.id} className="border-2" style={{ borderColor: color + '40' }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <MaterialIcon materialId={mat.id} size={20} color={color} />
                    {mat.name}
                  </h4>
                  <div className="flex gap-2">
                    <Badge style={{ backgroundColor: color, color: '#fff' }}>{mat.attribute}</Badge>
                    <Badge className="bg-stone-800 text-stone-100 flex items-center gap-1">
                      <FaStar size={12} color="#fbbf24" /> {mat.rarity}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-stone-500 mb-3 border-b border-stone-200 pb-2">
                  この素材を使うと、以下の形状パーツが出現する可能性があります。
                </p>
                
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-stone-600">
                  <div className="flex flex-col items-center">
                    <p className="mb-2 flex items-center justify-center gap-1"><FaRobot size={14} />アタマ</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SVG_HEADS.map((Comp, idx) => <SinglePart key={idx} Comp={Comp} color={color} type="head" rarityLabel={1} />)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="mb-2 flex items-center justify-center gap-1"><FaBox size={14} />ボディ</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SVG_BODIES.map((Comp, idx) => <SinglePart key={idx} Comp={Comp} color={color} type="body" rarityLabel={1} />)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="mb-2 flex items-center justify-center gap-1"><FaWrench size={14} />ウデ</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SVG_ARMS.map((Comp, idx) => <SinglePart key={idx} Comp={Comp} color={color} type="arms" rarityLabel={1} />)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="mb-2 flex items-center justify-center gap-1"><FaShoePrints size={14} />アシ</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SVG_LEGS.map((Comp, idx) => <SinglePart key={idx} Comp={Comp} color={color} type="legs" rarityLabel={1} />)}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
