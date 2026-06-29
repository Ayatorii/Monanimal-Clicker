import { useEffect, useState } from "react";
import { useGameState } from "./useGameState";
import { calculateCharacterLevel } from "@/lib/utils";

export function useGameLoop() {
  const { state, dispatch } = useGameState();

  // Passive income
  useEffect(() => {
    const tickRate = 100; // 100ms
    const interval = setInterval(() => {
      if (state.coinsPerSecond > 0) {
        const amount = state.coinsPerSecond / (1000 / tickRate);
        dispatch(prev => {
          const newTotal = prev.totalCoinsEarned + amount;
          return {
            ...prev,
            coins: prev.coins + amount,
            totalCoinsEarned: newTotal,
            characterLevel: calculateCharacterLevel(newTotal),
          };
        });
      }
    }, tickRate);

    return () => clearInterval(interval);
  }, [state.coinsPerSecond, dispatch]);

  // Auto save
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(prev => {
        const newState = { ...prev, lastSaveTime: Date.now() };
        localStorage.setItem("monanimal-clicker-save-v2", JSON.stringify(newState));
        return newState;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);
}

export interface OfflineProgressData {
  secs: number;
  earned: number;
}

export function useOfflineProgress(): OfflineProgressData | null {
  const { state, dispatch } = useGameState();
  const [result] = useState<OfflineProgressData | null>(() => {
    const now = Date.now();
    const lastSave = state.lastSaveTime || now;
    const offlineSecs = (now - lastSave) / 1000;
    if (offlineSecs > 60 && state.coinsPerSecond > 0) {
      const maxOfflineSecs = 12 * 60 * 60;
      const effectiveSecs = Math.min(offlineSecs, maxOfflineSecs);
      const earned = state.coinsPerSecond * effectiveSecs * 0.5;
      if (earned > 0) return { secs: effectiveSecs, earned };
    }
    return null;
  });

  useEffect(() => {
    if (result && result.earned > 0) {
      dispatch(prev => ({
        ...prev,
        coins: prev.coins + result.earned,
        totalCoinsEarned: prev.totalCoinsEarned + result.earned,
        lastSaveTime: Date.now(),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return result;
}
