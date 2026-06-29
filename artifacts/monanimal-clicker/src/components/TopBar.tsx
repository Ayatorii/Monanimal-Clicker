import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Volume2, VolumeX, Trophy, Settings, X } from "lucide-react";

interface TopBarProps {
  onShowAchievements: () => void;
}

export default function TopBar({ onShowAchievements }: TopBarProps) {
  const { state, dispatch } = useGameState();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="w-full bg-card/80 backdrop-blur-md border-b border-border z-10 shadow-sm">
        <div className="flex items-center pt-3 pb-1">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 px-4 flex-shrink-0 lg:w-52 xl:w-60">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(110,84,255,0.5)]">
              M
            </div>
            <h1 className="font-black text-lg md:text-xl tracking-tighter uppercase hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Monanimal
            </h1>
          </div>

          {/* Center: coins */}
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

          {/* Right: desktop controls */}
          <div className="hidden md:flex items-center gap-1 md:gap-2 px-4 flex-shrink-0 justify-end md:w-80 lg:w-96">
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

          {/* Right: mobile gear button */}
          <div className="flex md:hidden items-center px-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile settings bottom sheet */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border rounded-t-2xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <span className="text-sm font-black uppercase tracking-widest text-primary">Settings</span>
                <button onClick={() => setShowSettings(false)} className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Items */}
              <div className="flex flex-col px-5 py-3 pb-10 gap-1">
                {/* Achievements */}
                <button
                  onClick={() => { setShowSettings(false); onShowAchievements(); }}
                  className="flex items-center justify-between w-full py-3 border-b border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-foreground">Achievements</span>
                  </div>
                  <span className="text-muted-foreground text-xs">›</span>
                </button>

                {/* Theme */}
                <button
                  onClick={() => dispatch(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                  className="flex items-center justify-between w-full py-3 border-b border-border/50"
                >
                  <div className="flex items-center gap-3">
                    {state.darkMode
                      ? <Sun className="h-5 w-5 text-yellow-400" />
                      : <Moon className="h-5 w-5 text-primary" />}
                    <span className="text-sm font-bold text-foreground">
                      {state.darkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                  </div>
                  <div
                    className="w-10 h-5 rounded-full flex items-center transition-colors duration-200"
                    style={{ background: state.darkMode ? "#6E54FF" : "rgba(255,255,255,0.15)", justifyContent: state.darkMode ? "flex-end" : "flex-start", padding: "2px" }}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </button>

                {/* Sound */}
                <button
                  onClick={() => dispatch(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  className="flex items-center justify-between w-full py-3"
                >
                  <div className="flex items-center gap-3">
                    {state.soundEnabled
                      ? <Volume2 className="h-5 w-5 text-primary" />
                      : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                    <span className="text-sm font-bold text-foreground">Sound</span>
                  </div>
                  <div
                    className="w-10 h-5 rounded-full flex items-center transition-colors duration-200"
                    style={{ background: state.soundEnabled ? "#6E54FF" : "rgba(255,255,255,0.15)", justifyContent: state.soundEnabled ? "flex-end" : "flex-start", padding: "2px" }}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
