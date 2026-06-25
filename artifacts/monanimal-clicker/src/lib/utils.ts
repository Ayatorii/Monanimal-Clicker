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
  { stage: 5, title: "Ronin",     minLevel: 100, bgKey: "hyperlaneNexus",  glowColor: "#FF8EE4", characterKey: "ronin" },
  { stage: 6, title: "Shogun",    minLevel: 250, bgKey: "genesisCitadel",  glowColor: "#FFAE45", characterKey: "shogun" },
];

export function getCharacterStage(level: number): CharacterStage {
  let stage = CHARACTER_STAGES[0];
  for (const s of CHARACTER_STAGES) {
    if (level >= s.minLevel) stage = s;
  }
  return stage;
}

export function calculateCharacterLevel(totalCoinsEarned: number): number {
  if (totalCoinsEarned <= 0) return 1;
  // Logarithmic level scale: level = floor(log10(totalCoins) * 10) + 1, capped at 999
  const level = Math.floor(Math.log10(totalCoinsEarned + 1) * 10) + 1;
  return Math.min(Math.max(level, 1), 999);
}