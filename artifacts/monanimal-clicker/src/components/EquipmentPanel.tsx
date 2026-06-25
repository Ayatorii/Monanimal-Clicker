import React, { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { EQUIPMENT } from "@/lib/gameData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock } from "lucide-react";

const CATEGORIES = ["Head", "Mask", "Armor", "Weapon", "Aura", "Companion"] as const;

export default function EquipmentPanel() {
  const { state, equipItem } = useGameState();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div className="w-full bg-card/90 backdrop-blur border-t border-border p-4 flex gap-4 overflow-x-auto items-center justify-center">
      {CATEGORIES.map(cat => {
        const items = EQUIPMENT.filter(e => e.category === cat);
        const equipped = items.find(e => state.equipment[e.id]);
        
        return (
          <Popover key={cat} open={openCategory === cat} onOpenChange={(open) => setOpenCategory(open ? cat : null)}>
            <PopoverTrigger asChild>
              <div className="flex-shrink-0 w-16 h-16 rounded-md border-2 border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:shadow-[0_0_15px_rgba(110,84,255,0.3)] transition-all relative">
                <span className="text-[10px] uppercase font-bold text-muted-foreground absolute -top-2 bg-card px-1 rounded-sm">{cat}</span>
                {equipped ? (
                  <Sparkles className="h-6 w-6 text-primary" />
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground/30" />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" sideOffset={10} side="top">
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-primary">{cat} Options</h4>
              <div className="flex flex-col gap-2">
                {items.map(item => {
                  const unlocked = state.totalCoinsEarned >= item.unlockCost;
                  const isEquipped = state.equipment[item.id];
                  return (
                    <div 
                      key={item.id}
                      onClick={() => unlocked && equipItem(item.id)}
                      className={cn(
                        "p-2 rounded border flex items-center justify-between transition-colors",
                        unlocked ? "cursor-pointer hover:bg-muted" : "opacity-50 grayscale",
                        isEquipped ? "border-primary bg-primary/10" : "border-border"
                      )}
                    >
                      <div>
                        <div className="font-bold text-sm font-mono">{item.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">+{Math.round(item.multiplier * 100)}% Boost</div>
                      </div>
                      {!unlocked ? (
                        <div className="text-[10px] text-muted-foreground font-mono text-right">
                          Requires<br/>{formatNumber(item.unlockCost)}
                        </div>
                      ) : isEquipped ? (
                        <Badge className="bg-primary hover:bg-primary">Equipped</Badge>
                      ) : (
                        <Badge variant="secondary" className="hover:bg-primary/20">Equip</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
