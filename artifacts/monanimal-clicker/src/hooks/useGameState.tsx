import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { BUILDINGS, POWER_UPGRADES, ACHIEVEMENTS } from "@/lib/gameData";
import { calculateCharacterLevel } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface GameState {
  coins: number;
  totalCoinsEarned: number;
  coinsPerClick: number;
  coinsPerSecond: number;
  characterLevel: number;
  totalClicks: number;
  upgrades: Record<string, number>;
  achievements: string[];
  lastSaveTime: number;
  darkMode: boolean;
  soundEnabled: boolean;
}

const DEFAULT_STATE: GameState = {
  coins: 0,
  totalCoinsEarned: 0,
  coinsPerClick: 1,
  coinsPerSecond: 0,
  characterLevel: 1,
  totalClicks: 0,
  upgrades: {},
  achievements: [],
  lastSaveTime: Date.now(),
  darkMode: true,
  soundEnabled: true,
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<React.SetStateAction<GameState>>;
  handleClick: () => void;
  buyBuilding: (id: string) => void;
  buyPower: (id: string) => void;
  calculateUpgradeCost: (baseCost: number, owned: number) => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameState must be used within GameProvider");
  return context;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [state, dispatch] = useState<GameState>(() => {
    const saved = localStorage.getItem("monanimal-clicker-save-v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { equipment, ...rest } = parsed;
        return { ...DEFAULT_STATE, ...rest };
      } catch (e) {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  const recalculateStats = useCallback((currentState: GameState) => {
    let baseCps = 0;
    let baseCpc = 1;

    BUILDINGS.forEach(b => {
      const owned = currentState.upgrades[b.id] || 0;
      baseCps += b.cps * owned;
    });

    POWER_UPGRADES.forEach(p => {
      const owned = currentState.upgrades[p.id] || 0;
      baseCpc += p.cpc * owned;
    });

    return {
      ...currentState,
      coinsPerSecond: baseCps,
      coinsPerClick: baseCpc,
      characterLevel: calculateCharacterLevel(currentState.totalCoinsEarned),
    };
  }, []);

  const handleClick = useCallback(() => {
    dispatch(prev => {
      const newState = {
        ...prev,
        coins: prev.coins + prev.coinsPerClick,
        totalCoinsEarned: prev.totalCoinsEarned + prev.coinsPerClick,
        totalClicks: prev.totalClicks + 1,
      };
      return recalculateStats(newState);
    });
  }, [recalculateStats]);

  const calculateUpgradeCost = (baseCost: number, owned: number) => {
    return Math.floor(baseCost * Math.pow(1.22, owned));
  };

  const MAX_UPGRADE_LEVEL = 100;

  const buyBuilding = useCallback((id: string) => {
    dispatch(prev => {
      const b = BUILDINGS.find(x => x.id === id);
      if (!b) return prev;
      const owned = prev.upgrades[id] || 0;
      if (owned >= MAX_UPGRADE_LEVEL) return prev;
      const cost = calculateUpgradeCost(b.baseCost, owned);
      if (prev.coins < cost) return prev;
      return recalculateStats({
        ...prev,
        coins: prev.coins - cost,
        upgrades: { ...prev.upgrades, [id]: owned + 1 },
      });
    });
  }, [recalculateStats]);

  const buyPower = useCallback((id: string) => {
    dispatch(prev => {
      const p = POWER_UPGRADES.find(x => x.id === id);
      if (!p) return prev;
      const owned = prev.upgrades[id] || 0;
      if (owned >= MAX_UPGRADE_LEVEL) return prev;
      const cost = calculateUpgradeCost(p.baseCost, owned);
      if (prev.coins < cost) return prev;
      return recalculateStats({
        ...prev,
        coins: prev.coins - cost,
        upgrades: { ...prev.upgrades, [id]: owned + 1 },
      });
    });
  }, [recalculateStats]);

  // Achievement checker
  useEffect(() => {
    let changed = false;
    const newAchievements = [...state.achievements];
    const newlyUnlocked: string[] = [];

    ACHIEVEMENTS.forEach(a => {
      if (!newAchievements.includes(a.id) && a.check(state)) {
        newAchievements.push(a.id);
        newlyUnlocked.push(a.name);
        changed = true;
      }
    });

    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(name => {
        toast({ title: "Achievement Unlocked!", description: name, duration: 3000 });
      });
    }

    if (changed) {
      dispatch(prev => ({ ...prev, achievements: newAchievements }));
    }
  }, [state.coins, state.totalClicks, state.characterLevel, state.coinsPerSecond, state.upgrades]);

  return (
    <GameContext.Provider value={{
      state, dispatch, handleClick, buyBuilding, buyPower, calculateUpgradeCost,
    }}>
      {children}
    </GameContext.Provider>
  );
}
