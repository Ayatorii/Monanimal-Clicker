import React from "react";
import { useGameState } from "@/hooks/useGameState";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";

export default function TopBar() {
  const { state, dispatch } = useGameState();

  return (
    <div className="w-full flex items-center justify-between p-4 bg-card/80 backdrop-blur-md border-b border-border z-10 shadow-sm relative">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(110,84,255,0.5)]">M</div>
        <h1 className="font-black text-lg md:text-xl tracking-tighter uppercase hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Monanimal</h1>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-2 md:top-4">
        <div className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-foreground drop-shadow-md">
          {formatNumber(Math.floor(state.coins))}
        </div>
        <div className="flex gap-4 text-[10px] md:text-sm font-mono text-muted-foreground mt-0 md:mt-1 font-semibold uppercase tracking-wider">
          <span className="text-accent">{formatNumber(state.coinsPerSecond)} CPS</span>
          <span>•</span>
          <span className="text-primary">{formatNumber(state.coinsPerClick)} CPC</span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 pr-12 md:pr-16">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => dispatch(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}>
          {state.soundEnabled ? <Volume2 className="h-4 w-4 md:h-5 md:w-5" /> : <VolumeX className="h-4 w-4 md:h-5 md:w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => dispatch(prev => ({ ...prev, darkMode: !prev.darkMode }))}>
          {state.darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
        </Button>
      </div>
    </div>
  );
}
