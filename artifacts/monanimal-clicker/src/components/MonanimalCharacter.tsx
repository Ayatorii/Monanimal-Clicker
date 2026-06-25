import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { getCharacterStage, formatNumber, cn } from "@/lib/utils";

export default function MonanimalCharacter() {
  const { state, handleClick } = useGameState();
  const stageData = getCharacterStage(state.characterLevel);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number; amount: number }[]>([]);

  const onInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setClicks(prev => [...prev, { id: Date.now() + Math.random(), x, y, amount: state.coinsPerClick }]);
    handleClick();
  };

  // Remove old clicks to prevent memory leak
  const handleAnimationComplete = (id: number) => {
    setClicks(prev => prev.filter(c => c.id !== id));
  };

  // Colors based on stage
  const stageColors = {
    1: "from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
    2: "from-blue-400 to-blue-600",
    3: "from-cyan-400 to-cyan-500",
    4: "from-purple-500 to-purple-700",
    5: "from-red-500 to-orange-500",
    6: "from-indigo-500 via-purple-500 to-pink-500"
  };

  const currentGradient = stageColors[stageData.stage as keyof typeof stageColors];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden select-none">
      
      {/* Background Stage Indicator */}
      <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-10 transition-colors duration-1000 pointer-events-none" />
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold tracking-widest text-primary drop-shadow-sm uppercase">LEVEL {state.characterLevel}</h2>
        <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase">{stageData.title}</p>
      </div>

      <motion.div
        className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer touch-manipulation"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onInteraction}
        onTouchStart={onInteraction}
      >
        {/* The Monanimal Character (CSS/SVG shape) */}
        <div className={cn(
          "absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br shadow-2xl transition-all duration-700",
          currentGradient
        )}>
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/4 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-black rounded-full shadow-inner flex items-center justify-center">
            <motion.div 
              className={cn("w-3 h-3 md:w-4 md:h-4 rounded-full", stageData.stage >= 4 ? "bg-primary animate-pulse" : "bg-black dark:bg-white")} 
            />
          </div>
          <div className="absolute top-1/3 right-1/4 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-black rounded-full shadow-inner flex items-center justify-center">
            <motion.div 
              className={cn("w-3 h-3 md:w-4 md:h-4 rounded-full", stageData.stage >= 4 ? "bg-primary animate-pulse" : "bg-black dark:bg-white")} 
            />
          </div>
          {/* Mouth */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-4 md:w-16 md:h-6 border-b-4 border-black/50 dark:border-white/50 rounded-[50%]" />
        </div>

        {/* Floating Numbers */}
        <AnimatePresence>
          {clicks.map(click => (
            <motion.div
              key={click.id}
              initial={{ opacity: 1, y: click.y, x: click.x, scale: 0.5 }}
              animate={{ opacity: 0, y: click.y - 100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={() => handleAnimationComplete(click.id)}
              className="absolute pointer-events-none text-2xl font-bold text-white drop-shadow-md z-50"
              style={{ left: 0, top: 0 }}
            >
              +{formatNumber(click.amount)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
