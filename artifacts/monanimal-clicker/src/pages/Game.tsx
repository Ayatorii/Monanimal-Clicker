import React, { useState } from "react";
import { useGameState, GameProvider } from "@/hooks/useGameState";
import { useGameLoop } from "@/hooks/useGameLoop";
import TopBar from "@/components/TopBar";
import MonanimalCharacter from "@/components/MonanimalCharacter";
import UpgradeShop from "@/components/UpgradeShop";
import EquipmentPanel from "@/components/EquipmentPanel";
import AchievementsModal from "@/components/AchievementsModal";
import DailyReward from "@/components/DailyReward";
import OfflineProgress from "@/components/OfflineProgress";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

function GameInner() {
  useGameLoop();
  const { state } = useGameState();
  const [showAchievements, setShowAchievements] = useState(false);

  // Toggle dark mode classes
  React.useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden font-sans relative">
      <DailyReward />
      <OfflineProgress />
      <AchievementsModal open={showAchievements} onOpenChange={setShowAchievements} />
      
      {/* Top Header */}
      <div className="relative z-20">
        <TopBar />
        
        {/* Achievements trigger positioned absolutely in TopBar area */}
        <div className="absolute top-3 md:top-4 right-4 z-30 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowAchievements(true)}
            className="rounded-full shadow-sm hover:border-primary hover:text-primary transition-colors h-8 w-8 md:h-10 md:w-10"
          >
            <Trophy className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative z-10">
        {/* Main Stage */}
        <div className="flex-1 relative flex flex-col">
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <MonanimalCharacter />
          </div>
          
          {/* Equipment Panel (Desktop: bottom of stage, Mobile: bottom of screen after shop if stacked or inside drawer) */}
          <div className="hidden md:block w-full">
            <EquipmentPanel />
          </div>
        </div>

        {/* Upgrade Shop (Desktop: right side, Mobile: drawer or bottom half) */}
        <div className="h-[45vh] md:h-full md:w-80 lg:w-96 flex-shrink-0 z-20 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.2)]">
          <UpgradeShop />
        </div>
      </div>

      {/* Equipment Panel on Mobile (stick to bottom) */}
      <div className="md:hidden z-30">
        <EquipmentPanel />
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <GameInner />
    </GameProvider>
  );
}
