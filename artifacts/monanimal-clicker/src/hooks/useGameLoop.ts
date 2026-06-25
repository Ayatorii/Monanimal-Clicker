import { useEffect } from "react";
import { useGameState } from "./useGameState";

export function useGameLoop() {
  const { state, dispatch } = useGameState();

  // Passive income
  useEffect(() => {
    const tickRate = 100; // 100ms
    const interval = setInterval(() => {
      if (state.coinsPerSecond > 0) {
        const amount = state.coinsPerSecond / (1000 / tickRate);
        dispatch(prev => ({
          ...prev,
          coins: prev.coins + amount,
          totalCoinsEarned: prev.totalCoinsEarned + amount,
        }));
      }
    }, tickRate);

    return () => clearInterval(interval);
  }, [state.coinsPerSecond, dispatch]);

  // Auto save
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(prev => {
        const newState = { ...prev, lastSaveTime: Date.now() };
        localStorage.setItem("monanimal-clicker-save", JSON.stringify(newState));
        return newState;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);
}

export function useOfflineProgress() {
  const { state, dispatch } = useGameState();

  useEffect(() => {
    const now = Date.now();
    const lastSave = state.lastSaveTime || now;
    const offlineSecs = (now - lastSave) / 1000;
    
    if (offlineSecs > 60 && state.coinsPerSecond > 0) { // minimum 1 minute to show
      const maxOfflineSecs = 8 * 60 * 60; // 8 hours
      const effectiveSecs = Math.min(offlineSecs, maxOfflineSecs);
      const earned = state.coinsPerSecond * effectiveSecs * 0.5; // 50% rate
      
      if (earned > 0) {
        dispatch(prev => ({
          ...prev,
          coins: prev.coins + earned,
          totalCoinsEarned: prev.totalCoinsEarned + earned,
          lastSaveTime: now
        }));
        
        // Return data for UI to show toast/modal
        return { secs: effectiveSecs, earned };
      }
    }
  }, []); // Run once on mount
}
