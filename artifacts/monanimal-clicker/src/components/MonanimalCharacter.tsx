import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const stageData = getCharacterStage(state.characterLevel);
  const [clicks, setClicks] = useState<FloatingClick[]>([]);
  const [rankFlash, setRankFlash] = useState(false);
  const prevStageRef = useRef(stageData.stage);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStage = stageData;

  useEffect(() => {
    if (stageData.stage !== prevStageRef.current) {
      prevStageRef.current = stageData.stage;
      setRankFlash(true);
      const t = setTimeout(() => setRankFlash(false), 900);
      return () => clearTimeout(t);
    }
  }, [stageData.stage]);

  const onInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : clientX;
    const y = rect ? clientY - rect.top : clientY;
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

  const charImg = CHARACTERS[activeStage.characterKey];
  const bgImg = ENVIRONMENTS[activeStage.bgKey];

  const CHARACTER_Y_OFFSETS: Record<string, number> = {
    recruit:   0,
    builder:   0,
    engineer:  0,
    validator: 15,
    explorer:  10,
    founder:   5,
  };
  const charYOffset = CHARACTER_Y_OFFSETS[activeStage.characterKey] ?? 0;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      {/* ENVIRONMENT BACKGROUND — true crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeStage.bgKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={bgImg}
            alt={activeStage.title + " environment"}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* RANK-UP FLASH */}
      <AnimatePresence>
        {rankFlash && (
          <motion.div
            key="rank-flash"
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ background: `radial-gradient(ellipse at center, ${stageData.glowColor}55 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      {/* LEVEL / TITLE BADGE + XP BAR */}
      {(() => {
        const xp = getLevelXpInfo(state.totalCoinsEarned);
        return (
          <>
            {/* Mobile: full-width rectangular strip at top */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-20 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-sm border-b border-white/10 px-4 py-2 flex flex-row items-center gap-3 w-full">
                <span className="text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap flex-shrink-0" style={{ color: activeStage.glowColor }}>
                  LVL {state.characterLevel}
                </span>
                <span className="text-[10px] text-white/50 uppercase font-mono whitespace-nowrap flex-shrink-0">{activeStage.title}</span>
                <div className="flex-1 h-1.5 rounded-none bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ background: activeStage.glowColor }}
                    animate={{ width: `${Math.min(xp.pct * 100, 100)}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[9px] font-mono text-white/60 whitespace-nowrap flex-shrink-0">
                  {formatNumber(xp.currentXp)}/{formatNumber(xp.neededXp)}
                </span>
              </div>
            </div>

            {/* Desktop: floating pill (unchanged) */}
            <div className="hidden md:block absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-2 inline-flex flex-col items-center gap-1 min-w-[140px]">
                <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: activeStage.glowColor }}>
                  LEVEL {state.characterLevel}
                </span>
                <span className="text-[10px] text-white/60 tracking-widest uppercase font-mono">{activeStage.title}</span>
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden mt-0.5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: activeStage.glowColor }}
                    animate={{ width: `${Math.min(xp.pct * 100, 100)}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[8px] font-mono text-white/80">
                  {formatNumber(xp.currentXp)} / {formatNumber(xp.neededXp)} XP
                </span>
              </div>
            </div>
          </>
        );
      })()}

      {/* LEFT COLUMN: Smartphone, Laptop, GPU */}
      {ownedItems.includes("smartphone") && (
        <motion.div
          className="absolute z-10 pointer-events-none flex items-center justify-center rounded-full w-10 h-10 md:w-[118px] md:h-[118px]"
          style={{
            top: "18%", left: "20%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px 2px ${activeStage.glowColor}30`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <img src={ITEMS.smartphone} alt="Smartphone" className="w-8 h-8 md:w-[100px] md:h-[100px] object-contain" style={{ filter: `drop-shadow(0 0 8px ${activeStage.glowColor})` }} />
        </motion.div>
      )}
      {ownedItems.includes("laptop") && (
        <motion.div
          className="absolute z-10 pointer-events-none flex items-center justify-center rounded-full w-10 h-10 md:w-[118px] md:h-[118px]"
          style={{
            top: "46%", left: "8%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px 2px ${activeStage.glowColor}30`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4 }}
        >
          <img src={ITEMS.laptop} alt="Laptop" className="w-8 h-8 md:w-[100px] md:h-[100px] object-contain" style={{ filter: `drop-shadow(0 0 8px ${activeStage.glowColor})`, transform: isMobile ? undefined : "translateX(-5px) translateY(3px)" }} />
        </motion.div>
      )}
      {ownedItems.includes("gpu") && (
        <motion.div
          className="absolute z-10 pointer-events-none flex items-center justify-center rounded-full w-10 h-10 md:w-[118px] md:h-[118px]"
          style={{
            top: "68%", left: "16%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px 2px ${activeStage.glowColor}30`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }}
        >
          <img src={ITEMS.gpu} alt="GPU" className="w-8 h-8 md:w-[100px] md:h-[100px] object-contain" style={{ filter: `drop-shadow(0 0 8px ${activeStage.glowColor})` }} />
        </motion.div>
      )}

      {/* RIGHT COLUMN: AI Agent, Validator Node, Data Center */}
      {ownedItems.includes("ai_agent") && (
        <motion.div
          className="absolute z-10 pointer-events-none flex items-center justify-center rounded-full w-10 h-10 md:w-[118px] md:h-[118px]"
          style={{
            top: "18%", right: "20%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px 2px ${activeStage.glowColor}30`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.2 }}
        >
          <img src={ITEMS.ai_agent} alt="AI Agent" className="w-8 h-8 md:w-[100px] md:h-[100px] object-contain" style={{ filter: `drop-shadow(0 0 8px ${activeStage.glowColor})`, transform: isMobile ? undefined : "translateY(14px)" }} />
        </motion.div>
      )}
      {ownedItems.includes("validator_node") && (
        <motion.div
          className="absolute z-10 pointer-events-none flex items-center justify-center rounded-full w-10 h-10 md:w-[118px] md:h-[118px]"
          style={{
            top: "46%", right: "10%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px 2px ${activeStage.glowColor}30`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.6 }}
        >
          <img src={ITEMS.validator_node} alt="Validator Node" className="w-8 h-8 md:w-[115px] md:h-[115px] object-contain" style={{ filter: `drop-shadow(0 0 8px ${activeStage.glowColor})` }} />
        </motion.div>
      )}
      {ownedItems.includes("data_center") && (
        <motion.div
          className="absolute z-10 pointer-events-none flex items-center justify-center rounded-full w-10 h-10 md:w-[118px] md:h-[118px]"
          style={{
            top: "68%", right: "18%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: `0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px 2px ${activeStage.glowColor}30`,
            backdropFilter: "blur(2px)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
        >
          <img src={ITEMS.data_center} alt="Data Center" className="w-8 h-8 md:w-[100px] md:h-[100px] object-contain" style={{ filter: `drop-shadow(0 0 8px ${activeStage.glowColor})` }} />
        </motion.div>
      )}

      {/* CLICKABLE CHARACTER IMAGE */}
      <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ paddingTop: charYOffset }}>
        <motion.div
          className="relative cursor-pointer touch-manipulation"
          onClick={onInteraction}
          onTouchStart={onInteraction}
          data-testid="character-click-area"
          style={{ filter: `drop-shadow(0 0 24px ${activeStage.glowColor}60)` }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeStage.characterKey}
              src={charImg}
              alt={activeStage.title + " Monanimal"}
              className="w-[175px] h-[175px] md:w-[355px] md:h-[355px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              whileTap={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              draggable={false}
            />
          </AnimatePresence>

          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full opacity-40 blur-xl pointer-events-none"
            style={{ background: activeStage.glowColor }}
          />
        </motion.div>
      </div>

      {/* FLOATING +N CLICK NUMBERS */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence>
          {clicks.map(click => (
            <motion.div
              key={click.id}
              initial={{ opacity: 1, y: click.y, scale: 0.9 }}
              animate={{ opacity: 0, y: click.y - 80, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              onAnimationComplete={() => handleAnimationComplete(click.id)}
              className="absolute font-black text-2xl pointer-events-none"
              style={{
                top: 0,
                left: click.x,
                transform: "translateX(-50%)",
                color: "#ffffff",
                textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
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
          { key: "builder",  label: "Builder",   min: 10 },
          { key: "engineer", label: "Engineer",  min: 25 },
          { key: "validator",label: "Validator", min: 50 },
          { key: "explorer", label: "Explorer",  min: 75 },
          { key: "founder",  label: "Founder",   min: 100 },
        ].map((s) => {
          const isActive = stageData.characterKey === s.key;
          const isUnlocked = state.characterLevel >= s.min;
          return (
            <div key={s.key} className="flex flex-col items-center gap-0.5">
              <img
                src={CHARACTERS[s.key as keyof typeof CHARACTERS]}
                alt={s.label}
                className="w-[27px] h-[27px] md:w-9 md:h-9 object-contain rounded-full"
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
