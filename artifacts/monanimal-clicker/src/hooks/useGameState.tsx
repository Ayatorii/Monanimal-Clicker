import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { BUILDINGS, POWER_UPGRADES, EQUIPMENT, ACHIEVEMENTS } from "@/lib/gameData";
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
  equipment: Record<string, boolean>;
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
  equipment: {},
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
  equipItem: (id: string) => void;
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
        return { ...DEFAULT_STATE, ...parsed };
      } catch (e) {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  const recalculateStats = useCallback((currentState: GameState) => {
    let baseCps = 0;
    let baseCpc = 1;
    let multiplier = 1;

    BUILDINGS.forEach(b => {
      const owned = currentState.upgrades[b.id] || 0;
      baseCps += b.cps * owned;
    });

    POWER_UPGRADES.forEach(p => {
      const owned = currentState.upgrades[p.id] || 0;
      baseCpc += p.cpc * owned;
    });

    EQUIPMENT.forEach(e => {
      if (currentState.equipment[e.id]) {
        multiplier += e.multiplier;
      }
    });

    return {
      ...currentState,
      coinsPerSecond: baseCps * multiplier,
      coinsPerClick: baseCpc * multiplier,
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
    return Math.floor(baseCost * Math.pow(1.15, owned));
  };

  const buyBuilding = useCallback((id: string) => {
    dispatch(prev => {
      const b = BUILDINGS.find(x => x.id === id);
      if (!b) return prev;
      const owned = prev.upgrades[id] || 0;
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
      const cost = calculateUpgradeCost(p.baseCost, owned);
      if (prev.coins < cost) return prev;
      return recalculateStats({
        ...prev,
        coins: prev.coins - cost,
        upgrades: { ...prev.upgrades, [id]: owned + 1 },
      });
    });
  }, [recalculateStats]);

  const equipItem = useCallback((id: string) => {
    dispatch(prev => {
      const item = EQUIPMENT.find(x => x.id === id);
      if (!item) return prev;
      const newEquipment = { ...prev.equipment };
      EQUIPMENT.filter(x => x.category === item.category).forEach(x => {
        newEquipment[x.id] = false;
      });
      newEquipment[id] = true;
      return recalculateStats({ ...prev, equipment: newEquipment });
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
      state, dispatch, handleClick, buyBuilding, buyPower, equipItem, calculateUpgradeCost,
    }}>
      {children}
    </GameContext.Provider>
  );
}
