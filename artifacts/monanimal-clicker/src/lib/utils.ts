import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CHARACTERS, ENVIRONMENTS } from "@/assets/index"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "Q";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return Math.floor(n).toString();
}

export interface LevelXpInfo {
  level: number;
  currentXp: number;
  neededXp: number;
  pct: number;
}

/**
 * Level 1 → 2 costs 1 000 XP.
 * Each subsequent level costs +2000 XP more.
 * Level N → N+1 costs: 1000 + (N-1) * 2000
 * XP = totalCoinsEarned (1 coin = 1 XP)
 */
export function getLevelXpInfo(xp: number): LevelXpInfo {
  let level = 1;
  let spent = 0;
  while (level < 999) {
    const cost = 1000 + (level - 1) * 2000;
    if (xp < spent + cost) {
      const current = Math.floor(xp - spent);
      return { level, currentXp: current, neededXp: cost, pct: current / cost };
    }
    spent += cost;
    level++;
  }
  return { level: 999, currentXp: 0, neededXp: 1, pct: 1 };
}

export function calculateCharacterLevel(xp: number): number {
  return getLevelXpInfo(xp).level;
}

export interface CharacterStage {
  stage: number;
  title: string;
  minLevel: number;
  bgKey: keyof typeof ENVIRONMENTS;
  glowColor: string;
  characterKey: keyof typeof CHARACTERS;
}

const CHARACTER_STAGES: CharacterStage[] = [
  { stage: 1, title: "Recruit",   minLevel: 1,   bgKey: "whiteRoom",       glowColor: "#94a3b8", characterKey: "recruit" },
  { stage: 2, title: "Builder",   minLevel: 10,  bgKey: "builderGarage",   glowColor: "#3b82f6", characterKey: "builder" },
  { stage: 3, title: "Engineer",  minLevel: 25,  bgKey: "validatorTemple", glowColor: "#06b6d4", characterKey: "engineer" },
  { stage: 4, title: "Validator", minLevel: 50,  bgKey: "monadCity",       glowColor: "#6E54FF", characterKey: "validator" },
  { stage: 5, title: "Explorer",  minLevel: 75,  bgKey: "hyperlaneNexus",  glowColor: "#FF8EE4", characterKey: "explorer" },
  { stage: 6, title: "Founder",   minLevel: 100, bgKey: "genesisCitadel",  glowColor: "#FFAE45", characterKey: "founder" },
];

export function getCharacterStage(level: number): CharacterStage {
  let stage = CHARACTER_STAGES[0];
  for (const s of CHARACTER_STAGES) {
    if (level >= s.minLevel) stage = s;
  }
  return stage;
}
