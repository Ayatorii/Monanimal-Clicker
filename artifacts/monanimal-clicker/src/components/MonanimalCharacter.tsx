import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { getCharacterStage, formatNumber, getLevelXpInfo } from "@/lib/utils";
import { CHARACTERS, ENVIRONMENTS, ITEMS } from "@/assets/index";

interface FloatingClick {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export default function MonanimalCharacter() {
  const { state, handleClick } = useGameState();
  const stageData = getCharacterStage(state.characterLevel);
  const [clicks, setClicks] = useState<FloatingClick[]>([]);

  const onInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number, clientY: number;
    if ("touches" in e) {
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

  const handleAnimationComplete = (id: number) => {
    setClicks(prev => prev.filter(c => c.id !== id));
  };

  const ownedItems = Object.entries(state.upgrades)
    .filter(([, qty]) => (qty as number) > 0)
    .map(([id]) => id)
    .filter(id => id in ITEMS);

  const charImg = CHARACTERS[stageData.characterKey];
  const bgImg = ENVIRONMENTS[stageData.bgKey];

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ENVIRONMENT BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stageData.bgKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={bgImg}
            alt={stageData.title + " environment"}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* LEVEL / TITLE BADGE + XP BAR */}
      {(() => {
        const xp = getLevelXpInfo(state.totalCoinsEarned);
        return (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-2 inline-flex flex-col items-center gap-1 min-w-[140px]">
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: stageData.glowColor }}>
                LEVEL {state.characterLevel}
              </span>
              <span className="text-[10px] text-white/60 tracking-widest uppercase font-mono">{stageData.title}</span>
              <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden mt-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stageData.glowColor }}
                  animate={{ width: `${Math.min(xp.pct * 100, 100)}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <span className="text-[8px] font-mono text-white/80">
                {formatNumber(xp.currentXp)} / {formatNumber(xp.neededXp)} XP
              </span>
            </div>
          </div>
        );
      })()}

      {/* LEFT COLUMN: Smartphone, Laptop, GPU */}
      {ownedItems.includes("smartphone") && (
        <motion.img
          src={ITEMS.smartphone}
          alt="Smartphone"
          className="absolute w-[88px] h-[88px] object-contain z-10 pointer-events-none"
          style={{ top: "18%", left: "20%", filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      )}
      {ownedItems.includes("laptop") && (
        <motion.img
          src={ITEMS.laptop}
          alt="Laptop"
          className="absolute w-[88px] h-[88px] object-contain z-10 pointer-events-none"
          style={{ top: "46%", left: "8%", filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4 }}
        />
      )}
      {ownedItems.includes("gpu") && (
        <motion.img
          src={ITEMS.gpu}
          alt="GPU"
          className="absolute w-[88px] h-[88px] object-contain z-10 pointer-events-none"
          style={{ top: "68%", left: "16%", filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }}
        />
      )}

      {/* RIGHT COLUMN: AI Agent, Validator Node, Data Center */}
      {ownedItems.includes("ai_agent") && (
        <motion.img
          src={ITEMS.ai_agent}
          alt="AI Agent"
          className="absolute w-[88px] h-[88px] object-contain z-10 pointer-events-none"
          style={{ top: "18%", right: "20%", filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.2 }}
        />
      )}
      {ownedItems.includes("validator_node") && (
        <motion.img
          src={ITEMS.validator_node}
          alt="Validator Node"
          className="absolute w-[88px] h-[88px] object-contain z-10 pointer-events-none"
          style={{ top: "46%", right: "10%", filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.6 }}
        />
      )}
      {ownedItems.includes("data_center") && (
        <motion.img
          src={ITEMS.data_center}
          alt="Data Center"
          className="absolute w-[88px] h-[88px] object-contain z-10 pointer-events-none"
          style={{ top: "68%", right: "18%", filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
        />
      )}

      {/* CLICKABLE CHARACTER IMAGE */}
      <div className="absolute inset-0 z-20 flex items-center justify-center translate-y-[10%]">
        <motion.div
          className="relative cursor-pointer touch-manipulation"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.93 }}
          onClick={onInteraction}
          onTouchStart={onInteraction}
          data-testid="character-click-area"
          style={{ filter: `drop-shadow(0 0 24px ${stageData.glowColor}60)` }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={stageData.characterKey}
              src={charImg}
              alt={stageData.title + " Monanimal"}
              className="w-[229px] h-[229px] md:w-[317px] md:h-[317px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              draggable={false}
            />
          </AnimatePresence>

          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full opacity-40 blur-xl pointer-events-none"
            style={{ background: stageData.glowColor }}
          />
        </motion.div>
      </div>

      {/* FLOATING +N CLICK NUMBERS */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence>
          {clicks.map(click => (
            <motion.div
              key={click.id}
              initial={{ opacity: 1, y: 0, x: click.x, scale: 0.8 }}
              animate={{ opacity: 0, y: -90, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              onAnimationComplete={() => handleAnimationComplete(click.id)}
              className="absolute font-black text-2xl pointer-events-none"
              style={{
                top: click.y,
                left: 0,
                color: stageData.glowColor,
                textShadow: `0 0 12px ${stageData.glowColor}`,
              }}
            >
              +{formatNumber(click.amount)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EVOLUTION TIMELINE (bottom strip) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-1 pb-2 pointer-events-none">
        {[
          { key: "recruit",  label: "Recruit",   min: 1 },
          { key: "builder",  label: "Builder",   min: 15 },
          { key: "engineer", label: "Engineer",  min: 40 },
          { key: "validator",label: "Validator", min: 60 },
          { key: "explorer", label: "Explorer",  min: 100 },
          { key: "founder",  label: "Founder",   min: 250 },
        ].map((s) => {
          const isActive = stageData.characterKey === s.key;
          const isUnlocked = state.characterLevel >= s.min;
          return (
            <div key={s.key} className="flex flex-col items-center gap-0.5">
              <img
                src={CHARACTERS[s.key as keyof typeof CHARACTERS]}
                alt={s.label}
                className="w-6 h-6 md:w-8 md:h-8 object-contain rounded-full"
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 6px ${stageData.glowColor}) brightness(1.2)`
                    : isUnlocked ? "brightness(0.9)" : "grayscale(1) brightness(0.4)",
                  border: isActive ? `2px solid ${stageData.glowColor}` : "2px solid transparent",
                  borderRadius: "50%",
                }}
              />
              <div
                className="text-[7px] font-bold tracking-widest uppercase hidden md:block"
                style={{ color: isActive ? stageData.glowColor : isUnlocked ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
