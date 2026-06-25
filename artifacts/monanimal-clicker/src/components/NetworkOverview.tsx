import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { getCharacterStage, formatNumber, getLevelXpInfo } from "@/lib/utils";

const HISTORY_SIZE = 30;

interface Metric {
  label: string;
  value: string;
  sub: string;
  color: string;
  history: number[];
}

function MiniChart({ history, color }: { history: number[]; color: string }) {
  const w = 100;
  const h = 36;
  const pad = 2;

  if (history.length < 2) return <div className="w-full h-9" />;

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const points = history.map((v, i) => {
    const x = pad + (i / (history.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPoints = `${pad},${h} ${polyline} ${w - pad},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1].split(",")[0]}
        cy={points[points.length - 1].split(",")[1]}
        r="2"
        fill={color}
      />
    </svg>
  );
}

export default function NetworkOverview() {
  const { state } = useGameState();
  const stage = getCharacterStage(state.characterLevel);

  const tpsHistoryRef = useRef<number[]>([]);
  const blocksHistoryRef = useRef<number[]>([]);
  const nodesHistoryRef = useRef<number[]>([]);
  const [, forceRender] = useState(0);

  const totalUpgrades = Object.values(state.upgrades).reduce((a, b) => a + (b as number), 0);
  const tps = Math.max(state.coinsPerSecond * 100, state.totalClicks > 0 ? 1000 : 0);
  const blocks = state.totalClicks + Math.floor(state.totalCoinsEarned / 100);
  const nodes = Math.max(totalUpgrades, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      const push = (arr: number[], val: number) => {
        arr.push(val);
        if (arr.length > HISTORY_SIZE) arr.shift();
      };
      push(tpsHistoryRef.current, tps);
      push(blocksHistoryRef.current, blocks);
      push(nodesHistoryRef.current, nodes);
      forceRender(n => n + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [tps, blocks, nodes]);

  const xpInfo = getLevelXpInfo(state.totalCoinsEarned);
  const rankLabel = stage.title.toUpperCase();

  const metrics: Metric[] = [
    {
      label: "TPS",
      value: tps >= 1e6 ? (tps / 1e6).toFixed(2) + "M" : tps >= 1000 ? (tps / 1000).toFixed(1) + "K" : Math.floor(tps).toString(),
      sub: "Transactions / sec",
      color: "#6E54FF",
      history: [...tpsHistoryRef.current],
    },
    {
      label: "BLOCKS",
      value: formatNumber(blocks),
      sub: "Blocks confirmed",
      color: "#85E6FF",
      history: [...blocksHistoryRef.current],
    },
    {
      label: "NODES",
      value: nodes.toString(),
      sub: "Active nodes",
      color: "#FF8EE4",
      history: [...nodesHistoryRef.current],
    },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-52 xl:w-60 flex-shrink-0 bg-black/40 backdrop-blur-md border-r border-white/5 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6E54FF] animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white/50">
            Network Overview
          </span>
        </div>
      </div>

      {/* Rank card */}
      <div className="mx-3 mt-3 mb-1 rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col gap-1">
        <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-bold">Current Rank</span>
        <motion.span
          key={rankLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-black tracking-widest"
          style={{ color: stage.glowColor, textShadow: `0 0 12px ${stage.glowColor}60` }}
        >
          {rankLabel}
        </motion.span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: stage.glowColor }}
              animate={{ width: `${Math.min(xpInfo.pct * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-[9px] font-mono text-white/30">LV {state.characterLevel}</span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="flex flex-col gap-2 px-3 py-2 flex-1">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-white/8 bg-white/[0.03] p-3 flex flex-col gap-1"
            style={{ borderColor: `${m.color}20` }}
          >
            <div className="flex items-end justify-between">
              <span className="text-[9px] tracking-[0.18em] uppercase font-bold text-white/40">{m.label}</span>
              <motion.span
                key={m.value}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-base font-black font-mono leading-none"
                style={{ color: m.color, textShadow: `0 0 8px ${m.color}50` }}
              >
                {m.value}
              </motion.span>
            </div>
            <MiniChart history={m.history} color={m.color} />
            <span className="text-[9px] text-white/25 font-mono">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Network status footer */}
      <div className="px-3 pb-3">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex flex-col gap-1.5">
          <span className="text-[9px] tracking-[0.18em] uppercase font-bold text-white/30">Network Status</span>
          {[
            { dot: "#4ade80", label: "Monad Mainnet", val: "LIVE" },
            { dot: "#6E54FF", label: "Consensus", val: "BFT" },
            { dot: "#85E6FF", label: "Finality", val: "<1s" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: row.dot }} />
                <span className="text-[9px] text-white/35 font-mono">{row.label}</span>
              </div>
              <span className="text-[9px] font-black font-mono" style={{ color: row.dot }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
