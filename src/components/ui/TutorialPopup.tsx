import React, { useState } from 'react';
import { Card, Button } from './core';
import { theme } from '../../styles/theme';
import { GameEngine } from '../../core/GameEngine';
import { GameState } from '../../core/models';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  tutorialId: string;
  state: GameState;
  engine: GameEngine;
  title: string;
  description: string;
  position?: 'bottom' | 'center';
}

export const TutorialPopup: React.FC<Props> = ({ tutorialId, state, engine, title, description, position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(!state.seenTutorials?.includes(tutorialId));

  const handleClose = () => {
    setIsOpen(false);
    engine.markTutorialSeen(tutorialId);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={`fixed z-50 pointer-events-none ${position === 'bottom' ? 'bottom-20 left-4 right-4' : 'inset-0 flex items-center justify-center p-4'}`}>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="pointer-events-auto"
        >
          <Card className="bg-blue-50 border-2 border-blue-300 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <button onClick={handleClose} className="text-blue-400 hover:text-blue-600 font-bold text-xl leading-none">&times;</button>
            </div>
            <div className="pr-6">
              <h4 className={`${theme.typography.h4} text-blue-800 mb-2 flex items-center gap-2`}>
                <span className="text-xl">💡</span> {title}
              </h4>
              <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" variant="primary" onClick={handleClose}>OK!</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
