import { useEffect } from "react";
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
