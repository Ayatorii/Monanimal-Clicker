import React from "react";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Volume2, VolumeX, Trophy } from "lucide-react";

interface TopBarProps {
  onShowAchievements: () => void;
}

export default function TopBar({ onShowAchievements }: TopBarProps) {
  const { state, dispatch } = useGameState();

  return (
    <div className="w-full bg-card/80 backdrop-blur-md border-b border-border z-10 shadow-sm">
      <div className="flex items-center pt-3 pb-1">
        {/* Left: Logo — width mirrors NetworkOverview (hidden below lg) */}
        <div className="flex items-center gap-2 px-4 flex-shrink-0 lg:w-52 xl:w-60">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(110,84,255,0.5)]">
            M
          </div>
          <h1 className="font-black text-lg md:text-xl tracking-tighter uppercase hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Monanimal
          </h1>
        </div>

        {/* Center: coins — flex-1 centers over the character stage */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={Math.floor(state.coins / 100)}
            className="text-2xl md:text-3xl lg:text-5xl font-black font-mono tracking-tighter text-foreground drop-shadow-md"
          >
            {formatNumber(Math.floor(state.coins))}
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-0.5">
            Points
          </span>
        </div>

        {/* Right: controls — width mirrors UpgradeShop */}
        <div className="flex items-center gap-1 md:gap-2 px-4 flex-shrink-0 justify-end md:w-80 lg:w-96">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => dispatch(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
          >
            {state.soundEnabled ? <Volume2 className="h-4 w-4 md:h-5 md:w-5" /> : <VolumeX className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => dispatch(prev => ({ ...prev, darkMode: !prev.darkMode }))}
          >
            {state.darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onShowAchievements}
            className="rounded-full shadow-sm hover:border-primary hover:text-primary transition-colors h-8 w-8 md:h-10 md:w-10"
          >
            <Trophy className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
