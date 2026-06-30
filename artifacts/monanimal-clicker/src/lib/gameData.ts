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
  { id: "smartphone",     name: "Smartphone",     baseCost: 100,    cps: 1,    icon: "📱" },
  { id: "laptop",         name: "Laptop",         baseCost: 300,    cps: 5,    icon: "💻" },
  { id: "gpu",            name: "GPU",            baseCost: 1000,   cps: 15,   icon: "🎮" },
  { id: "ai_agent",       name: "AI Agent",       baseCost: 6000,   cps: 45,   icon: "🤖" },
  { id: "validator_node", name: "Validator Node", baseCost: 15000,  cps: 100,  icon: "⚡" },
  { id: "data_center",    name: "Data Center",    baseCost: 35000,  cps: 400,  icon: "🏢" },
  { id: "monad_chain",    name: "Monad Chain",    baseCost: 300000, cps: 1000, icon: "🔗" },
];

export const POWER_UPGRADES: PowerUpgrade[] = [
  { id: "click_training",  name: "Pulse Core",    baseCost: 10,    cpc: 1,   icon: "⚡" },
  { id: "click_katana",    name: "Sync Core",     baseCost: 400,   cpc: 5,   icon: "🔷" },
  { id: "click_hyperbeam", name: "Parallel Core", baseCost: 1000,  cpc: 25,  icon: "🌀" },
  { id: "click_genesis",   name: "Hyper Core",    baseCost: 3500,  cpc: 50,  icon: "🔮" },
  { id: "validator_core",  name: "Validator Core",baseCost: 10000, cpc: 100, icon: "💎" },
  { id: "genesis_core",    name: "Genesis Core",  baseCost: 30000, cpc: 200, icon: "🌌" },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_click", name: "First Click", description: "Click Monanimal for the first time", icon: "🖱️", check: (s) => s.totalClicks >= 1 },
  { id: "hundred_clicks", name: "Hundred Clicks", description: "Reach 100 total clicks", icon: "💯", check: (s) => s.totalClicks >= 100 },
  { id: "thousandaire", name: "Thousandaire", description: "Earn 1,000 total points", icon: "💰", check: (s) => s.totalCoinsEarned >= 1000 },
  { id: "big_earner", name: "Big Earner", description: "Earn 10,000 total points", icon: "💵", check: (s) => s.totalCoinsEarned >= 10000 },
  { id: "point_master", name: "Point Master", description: "Earn 100,000 total points", icon: "💎", check: (s) => s.totalCoinsEarned >= 100000 },
  { id: "millionaire", name: "Millionaire", description: "Earn 1,000,000 total points", icon: "🏦", check: (s) => s.totalCoinsEarned >= 1000000 },
  { id: "first_upgrade", name: "First Upgrade", description: "Purchase your first upgrade", icon: "⬆️", check: (s) => (Object.values(s.upgrades) as number[]).reduce((a, b) => a + b, 0) >= 1 },
  { id: "upgrade_addict", name: "Upgrade Addict", description: "Own 10 upgrades", icon: "🛒", check: (s) => (Object.values(s.upgrades) as number[]).reduce((a, b) => a + b, 0) >= 10 },
  { id: "upgrade_collector", name: "Upgrade Collector", description: "Own 100 upgrades", icon: "🗂️", check: (s) => (Object.values(s.upgrades) as number[]).reduce((a, b) => a + b, 0) >= 100 },
  { id: "level_builder", name: "Builder", description: "Reach Builder rank (Level 10)", icon: "🏗️", check: (s) => s.characterLevel >= 10 },
  { id: "level_engineer", name: "Engineer", description: "Reach Engineer rank (Level 25)", icon: "🔧", check: (s) => s.characterLevel >= 25 },
  { id: "level_validator", name: "Validator", description: "Reach Validator rank (Level 50)", icon: "⚡", check: (s) => s.characterLevel >= 50 },
  { id: "level_explorer", name: "Explorer", description: "Reach Explorer rank (Level 75)", icon: "🗺️", check: (s) => s.characterLevel >= 75 },
  { id: "level_founder", name: "Founder", description: "Reach Founder rank (Level 100)", icon: "👑", check: (s) => s.characterLevel >= 100 },
  { id: "speed_runner", name: "Speed Runner", description: "Reach 100 points per second", icon: "🏃", check: (s) => s.coinsPerSecond >= 100 },
  { id: "turbo_producer", name: "Turbo Producer", description: "Reach 1,000 points per second", icon: "🚀", check: (s) => s.coinsPerSecond >= 1000 },
  { id: "mega_producer", name: "Mega Producer", description: "Reach 10,000 points per second", icon: "🏭", check: (s) => s.coinsPerSecond >= 10000 },
  { id: "iron_fingers", name: "Iron Fingers", description: "Click for 1 minute without stopping", icon: "🔁", check: (s) => (s.maxComboDuration ?? 0) >= 60 },
  { id: "machine", name: "Machine", description: "Click for 5 minutes without stopping", icon: "🤖", check: (s) => (s.maxComboDuration ?? 0) >= 300 },
];
