export interface BuildingUpgrade {
  id: string;
  name: string;
  baseCost: number;
  cps: number;
  icon: string;
}

export interface PowerUpgrade {
  id: string;
  name: string;
  baseCost: number;
  cpc: number;
  icon: string;
}

export const BUILDINGS: BuildingUpgrade[] = [
  { id: "smartphone", name: "Smartphone", baseCost: 15, cps: 1, icon: "📱" },
  { id: "laptop", name: "Laptop", baseCost: 100, cps: 2, icon: "💻" },
  { id: "gpu", name: "GPU", baseCost: 1100, cps: 4, icon: "🎮" },
  { id: "ai_agent", name: "AI Agent", baseCost: 12000, cps: 20, icon: "🤖" },
  { id: "validator_node", name: "Validator Node", baseCost: 130000, cps: 100, icon: "⚡" },
  { id: "data_center", name: "Data Center", baseCost: 1400000, cps: 500, icon: "🏢" },
  { id: "monad_chain", name: "Monad Chain", baseCost: 20000000, cps: 4000, icon: "🔗" },
];

export const POWER_UPGRADES: PowerUpgrade[] = [
  { id: "click_training", name: "Click Training", baseCost: 50, cpc: 1, icon: "💪" },
  { id: "click_katana", name: "Click Katana", baseCost: 500, cpc: 5, icon: "🗡️" },
  { id: "click_hyperbeam", name: "Hyperbeam", baseCost: 8000, cpc: 20, icon: "✨" },
  { id: "click_genesis", name: "Genesis Strike", baseCost: 200000, cpc: 200, icon: "🌌" },
];

export interface Equipment {
  id: string;
  category: "Head" | "Mask" | "Armor" | "Weapon" | "Aura" | "Companion";
  name: string;
  unlockCost: number;
  multiplier: number;
}

export const EQUIPMENT: Equipment[] = [
  // Head
  { id: "head_cap", category: "Head", name: "Cap", unlockCost: 1000, multiplier: 0.01 },
  { id: "head_cyber", category: "Head", name: "Cyber Helm", unlockCost: 100000, multiplier: 0.05 },
  { id: "head_shogun", category: "Head", name: "Shogun Helm", unlockCost: 10000000, multiplier: 0.25 },
  // Mask
  { id: "mask_tech", category: "Mask", name: "Tech Mask", unlockCost: 5000, multiplier: 0.02 },
  { id: "mask_oni", category: "Mask", name: "Oni Mask", unlockCost: 500000, multiplier: 0.1 },
  { id: "mask_genesis", category: "Mask", name: "Genesis Mask", unlockCost: 50000000, multiplier: 0.5 },
  // Armor
  { id: "armor_jacket", category: "Armor", name: "Jacket", unlockCost: 10000, multiplier: 0.03 },
  { id: "armor_cyber", category: "Armor", name: "Cyber Armor", unlockCost: 1000000, multiplier: 0.15 },
  { id: "armor_shogun", category: "Armor", name: "Shogun Armor", unlockCost: 100000000, multiplier: 0.75 },
  // Weapon
  { id: "weapon_katana", category: "Weapon", name: "Katana", unlockCost: 25000, multiplier: 0.04 },
  { id: "weapon_energy", category: "Weapon", name: "Energy Blade", unlockCost: 2500000, multiplier: 0.2 },
  { id: "weapon_genesis", category: "Weapon", name: "Genesis Sword", unlockCost: 250000000, multiplier: 1.0 },
  // Aura
  { id: "aura_purple", category: "Aura", name: "Purple Glow", unlockCost: 50000, multiplier: 0.05 },
  { id: "aura_neon", category: "Aura", name: "Neon Aura", unlockCost: 5000000, multiplier: 0.3 },
  { id: "aura_cosmic", category: "Aura", name: "Cosmic Aura", unlockCost: 500000000, multiplier: 1.5 },
  // Companion
  { id: "comp_fox", category: "Companion", name: "Digital Fox", unlockCost: 100000, multiplier: 0.1 },
  { id: "comp_dragon", category: "Companion", name: "Cyber Dragon", unlockCost: 10000000, multiplier: 0.5 },
  { id: "comp_spirit", category: "Companion", name: "Genesis Spirit", unlockCost: 1000000000, multiplier: 2.0 },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_click", name: "First Click", description: "Click Monanimal once", icon: "🖱️", check: (s) => s.totalClicks >= 1 },
  { id: "hundred_clicks", name: "Hundred Clicks", description: "100 total clicks", icon: "💯", check: (s) => s.totalClicks >= 100 },
  { id: "thousandaire", name: "Thousandaire", description: "Earn 1,000 coins", icon: "💰", check: (s) => s.totalCoinsEarned >= 1000 },
  { id: "millionaire", name: "Millionaire", description: "Earn 1,000,000 total coins", icon: "🏦", check: (s) => s.totalCoinsEarned >= 1000000 },
  { id: "first_upgrade", name: "First Upgrade", description: "Buy first upgrade", icon: "⬆️", check: (s) => (Object.values(s.upgrades) as number[]).reduce((a, b) => a + b, 0) >= 1 },
  { id: "upgrade_addict", name: "Upgrade Addict", description: "Own 10 upgrades", icon: "🛒", check: (s) => (Object.values(s.upgrades) as number[]).reduce((a, b) => a + b, 0) >= 10 },
  { id: "level_10", name: "Level 10 Reached", description: "Reach Builder level", icon: "🏗️", check: (s) => s.characterLevel >= 10 },
  { id: "level_25", name: "Level 25 Reached", description: "Reach Engineer level", icon: "🔧", check: (s) => s.characterLevel >= 25 },
  { id: "level_50", name: "Level 50 Reached", description: "Reach Validator level", icon: "⚡", check: (s) => s.characterLevel >= 50 },
  { id: "speed_runner", name: "Speed Runner", description: "Earn 100 coins per second", icon: "🏃", check: (s) => s.coinsPerSecond >= 100 },
  { id: "mega_producer", name: "Mega Producer", description: "Earn 10,000 coins per second", icon: "🏭", check: (s) => s.coinsPerSecond >= 10000 },
];
