import { useEffect } from "react";
import { useGameState } from "./useGameState";
import { calculateCharacterLevel, getCharacterStage } from "@/lib/utils";

export function useGameLoop() {
  const { state, dispatch } = useGameState();

  // Passive income
  useEffect(() => {
    const tickRate = 100; // 100ms
    const interval = setInterval(() => {
      if (state.coinsPerSecond > 0) {
        const amount = Math.floor(state.coinsPerSecond / (1000 / tickRate));
        if (amount <= 0) return;
        dispatch(prev => {
          const newTotal = prev.totalCoinsEarned + amount;
          const newLevel = calculateCharacterLevel(newTotal);
          const newMaxEnergy = 1000 + (newLevel - 1) * 100;
          return {
            ...prev,
            coins: prev.coins + amount,
            totalCoinsEarned: newTotal,
            characterLevel: newLevel,
            maxEnergy: newMaxEnergy,
            energy: Math.min(prev.energy ?? 1000, newMaxEnergy),
          };
        });
      }
    }, tickRate);

    return () => clearInterval(interval);
  }, [state.coinsPerSecond, dispatch]);

  // Energy regen — 1 per second base, +1 per rank (Builder=2, Engineer=3, etc.)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(prev => {
        const maxEnergy = prev.maxEnergy ?? 1000;
        const currentEnergy = prev.energy ?? maxEnergy;
        if (currentEnergy >= maxEnergy) return prev;
        const stage = getCharacterStage(prev.characterLevel);
        const regenRate = stage.stage; // stage 1=Recruit(+1), stage 2=Builder(+2)…
        return {
          ...prev,
          energy: Math.min(currentEnergy + regenRate, maxEnergy),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

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
