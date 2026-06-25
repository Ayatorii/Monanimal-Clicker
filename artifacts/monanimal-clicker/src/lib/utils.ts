import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  bgClass: string;
  glowColor: string;
}

const CHARACTER_STAGES: CharacterStage[] = [
  { stage: 1, title: "Basic Monanimal", minLevel: 1, bgClass: "from-slate-300 to-slate-500", glowColor: "#94a3b8" },
  { stage: 2, title: "Builder", minLevel: 10, bgClass: "from-blue-400 to-blue-700", glowColor: "#3b82f6" },
  { stage: 3, title: "Engineer", minLevel: 25, bgClass: "from-cyan-400 to-cyan-600", glowColor: "#06b6d4" },
  { stage: 4, title: "Validator", minLevel: 50, bgClass: "from-violet-500 to-purple-700", glowColor: "#6E54FF" },
  { stage: 5, title: "Ronin", minLevel: 100, bgClass: "from-orange-400 to-red-600", glowColor: "#f97316" },
  { stage: 6, title: "Shogun", minLevel: 250, bgClass: "from-indigo-500 via-purple-500 to-pink-500", glowColor: "#FF8EE4" },
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
