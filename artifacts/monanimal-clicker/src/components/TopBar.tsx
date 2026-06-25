import React from "react";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { formatNumber, getLevelXpInfo, getCharacterStage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";

export default function TopBar() {
  const { state, dispatch } = useGameState();
  const xpInfo = getLevelXpInfo(state.totalCoinsEarned);
  const stage = getCharacterStage(state.characterLevel);

  return (
    <div className="w-full bg-card/80 backdrop-blur-md border-b border-border z-10 shadow-sm relative">
      {/* Main row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-[80px]">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(110,84,255,0.5)]">M</div>
          <h1 className="font-black text-lg md:text-xl tracking-tighter uppercase hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Monanimal</h1>
        </div>

        {/* Center: coins */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-foreground drop-shadow-md">
            {formatNumber(Math.floor(state.coins))}
          </div>
        </div>

        {/* Right: toggles */}
        <div className="flex items-center gap-1 md:gap-2 pr-12 md:pr-16">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => dispatch(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}>
            {state.soundEnabled ? <Volume2 className="h-4 w-4 md:h-5 md:w-5" /> : <VolumeX className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => dispatch(prev => ({ ...prev, darkMode: !prev.darkMode }))}>
            {state.darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
        </div>
      </div>

      {/* XP Progress bar row */}
      <div className="px-4 pb-2 flex items-center gap-3">
        {/* Level badge */}
        <div
          className="flex-shrink-0 text-[10px] font-black font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border"
          style={{ color: stage.glowColor, borderColor: `${stage.glowColor}50`, background: `${stage.glowColor}15` }}
        >
          LV {xpInfo.level}
        </div>

        {/* Bar */}
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: `linear-gradient(90deg, ${stage.glowColor}90, ${stage.glowColor})` }}
              initial={false}
              animate={{ width: `${Math.min(xpInfo.pct * 100, 100)}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/30">
            <span>{formatNumber(xpInfo.currentXp)} XP</span>
            <span>{formatNumber(xpInfo.neededXp)} XP</span>
          </div>
        </div>

        {/* Next level */}
        <div className="flex-shrink-0 text-[10px] font-mono text-white/25 tracking-wider">
          LV {xpInfo.level < 999 ? xpInfo.level + 1 : "MAX"}
        </div>
      </div>
    </div>
  );
}
