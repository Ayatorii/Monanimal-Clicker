import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { getCharacterStage, formatNumber } from "@/lib/utils";
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

  // Which items are owned (quantity > 0)
  const ownedItems = Object.entries(state.upgrades)
    .filter(([, qty]) => (qty as number) > 0)
    .map(([id]) => id)
    .filter(id => id in ITEMS);

  const charImg = CHARACTERS[stageData.characterKey];
  const bgImg = ENVIRONMENTS[stageData.bgKey];

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* === ENVIRONMENT BACKGROUND === */}
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
          {/* Dark overlay so UI is readable */}
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* === LEVEL / TITLE BADGE === */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-5 py-1.5 inline-flex flex-col items-center gap-0.5">
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: stageData.glowColor }}>LEVEL {state.characterLevel}</span>
          <span className="text-[10px] text-white/60 tracking-widest uppercase font-mono">{stageData.title}</span>
        </div>
      </div>

      {/* === PURCHASED ITEM OVERLAYS === */}
      {/* Smartphone — in character's hand area (bottom-left) */}
      {ownedItems.includes("smartphone") && (
        <motion.img
          src={ITEMS.smartphone}
          alt="Smartphone"
          className="absolute bottom-[20%] left-[8%] w-14 h-14 object-contain z-10 pointer-events-none"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${stageData.glowColor})` }}
        />
      )}
      {/* Laptop — beside character (left) */}
      {ownedItems.includes("laptop") && (
        <motion.img
          src={ITEMS.laptop}
          alt="Laptop"
          className="absolute bottom-[18%] left-[18%] w-20 h-20 object-contain z-10 pointer-events-none"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 10px ${stageData.glowColor})` }}
        />
      )}
      {/* GPU — behind character (right side, lower) */}
      {ownedItems.includes("gpu") && (
        <motion.img
          src={ITEMS.gpu}
          alt="GPU"
          className="absolute bottom-[18%] right-[12%] w-20 h-20 object-contain z-10 pointer-events-none"
          animate={{ y: [0, -4, 0], rotate: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 12px ${stageData.glowColor})` }}
        />
      )}
      {/* AI Agent — floats around character (top-right orbit) */}
      {ownedItems.includes("ai_agent") && (
        <motion.img
          src={ITEMS.ai_agent}
          alt="AI Agent"
          className="absolute w-16 h-16 object-contain z-10 pointer-events-none"
          style={{ top: "30%", right: "15%", filter: `drop-shadow(0 0 14px ${stageData.glowColor})` }}
          animate={{ y: [-10, 10, -10], x: [0, 5, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
      )}
      {/* Validator Node — floats above character */}
      {ownedItems.includes("validator_node") && (
        <motion.img
          src={ITEMS.validator_node}
          alt="Validator Node"
          className="absolute w-20 h-20 object-contain z-10 pointer-events-none"
          style={{ top: "10%", left: "50%", transform: "translateX(-50%)", filter: `drop-shadow(0 0 16px ${stageData.glowColor})` }}
          animate={{ y: [-8, 8, -8], rotate: [0, 360] }}
          transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 12, ease: "linear" } }}
        />
      )}
      {/* Data Center — in background (bottom center, behind character) */}
      {ownedItems.includes("data_center") && (
        <motion.img
          src={ITEMS.data_center}
          alt="Data Center"
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-32 h-32 object-contain z-0 pointer-events-none opacity-80"
          style={{ filter: `drop-shadow(0 0 20px ${stageData.glowColor})` }}
          animate={{ opacity: [0.7, 0.9, 0.7] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      )}

      {/* === CLICKABLE CHARACTER IMAGE === */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
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
              className="w-52 h-52 md:w-72 md:h-72 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Glow ring under character */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full opacity-40 blur-xl pointer-events-none"
            style={{ background: stageData.glowColor }}
          />
        </motion.div>
      </div>

      {/* === FLOATING +N CLICK NUMBERS === */}
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

      {/* === EVOLUTION TIMELINE (bottom strip) === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-1 pb-2 pointer-events-none">
        {[
          { key: "recruit", label: "Recruit", min: 1 },
          { key: "builder", label: "Builder", min: 10 },
          { key: "engineer", label: "Engineer", min: 25 },
          { key: "validator", label: "Validator", min: 50 },
          { key: "ronin", label: "Ronin", min: 100 },
          { key: "shogun", label: "Shogun", min: 250 },
        ].map((s, i) => {
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