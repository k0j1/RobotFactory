import { useEffect, useState, useRef } from 'react';
import { GameEngine } from '../core/GameEngine';
import { GameState } from '../core/models';

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    engineRef.current = new GameEngine((newState) => {
      setState(newState);
    });
    setState(engineRef.current.getState());
    engineRef.current.generateRequestsIfNeeded();

    // Loop to trigger re-renders for timers
    const interval = setInterval(() => {
       // Just force an update to keep timers moving
       setState(s => s ? {...s} : null);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { state, engine: engineRef.current };
}
