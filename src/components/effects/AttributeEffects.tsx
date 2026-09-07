import React from 'react';
import { motion } from 'motion/react';
import { Attribute } from '../../core/models';

export const AttributeEffects: React.FC<{ attributes: Attribute[] }> = ({ attributes }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md z-0">
      {attributes.includes('Fire') && (
        [...Array(6)].map((_, i) => (
          <motion.div key={`fire-${i}`}
            className="absolute bottom-0 w-3 h-3 rounded-full bg-red-500 blur-[2px]"
            initial={{ opacity: 0, y: 10, x: `${10 + Math.random() * 80}%` }}
            animate={{ opacity: [0, 0.8, 0], y: -80, scale: [1, 2, 0.5] }}
            transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: 'easeOut', delay: Math.random() }}
          />
        ))
      )}
      {attributes.includes('Water') && (
        [...Array(6)].map((_, i) => (
          <motion.div key={`water-${i}`}
            className="absolute bottom-0 w-2 h-2 rounded-full bg-blue-400 border border-blue-200"
            initial={{ opacity: 0, y: 10, x: `${10 + Math.random() * 80}%` }}
            animate={{ opacity: [0, 0.8, 0], y: -100, x: `+=${(Math.random() - 0.5) * 20}` }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'linear', delay: Math.random() }}
          />
        ))
      )}
      {attributes.includes('Wind') && (
        [...Array(5)].map((_, i) => (
          <motion.div key={`wind-${i}`}
            className="absolute top-1/2 w-8 h-1 bg-white/60 blur-[1px] rounded-full"
            initial={{ opacity: 0, x: -50, y: (Math.random() - 0.5) * 100 }}
            animate={{ opacity: [0, 1, 0], x: 200 }}
            transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
          />
        ))
      )}
      {attributes.includes('Earth') && (
        [...Array(6)].map((_, i) => (
          <motion.div key={`earth-${i}`}
            className="absolute top-0 w-2 h-2 bg-amber-700/60 rotate-45"
            initial={{ opacity: 0, y: -10, x: `${10 + Math.random() * 80}%` }}
            animate={{ opacity: [0, 1, 0], y: 100, rotate: 180 + Math.random() * 180 }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
          />
        ))
      )}
      {attributes.includes('Light') && (
        <>
          {/* 眩しさを抑えた穏やかな電気・光の微粒子スパーク */}
          {[...Array(4)].map((_, i) => (
            <motion.div key={`light-spark-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300/60 shadow-[0_0_4px_1px_rgba(250,204,21,0.4)]"
              style={{
                top: `${25 + ((i * 18) % 60)}%`,
                left: `${20 + ((i * 22) % 65)}%`
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.45, 0], scale: [0.6, 1.1, 0.7] }}
              transition={{ duration: 1.8 + (i * 0.4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}
          {/* ごく微かな静電気の瞬きライン */}
          <motion.div
            className="absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-yellow-400/25 pointer-events-none"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1 }}
          />
        </>
      )}
      {attributes.includes('Dark') && (
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/50 to-transparent mix-blend-multiply"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};
