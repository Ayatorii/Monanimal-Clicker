import React from "react";
import { useGameState } from "@/hooks/useGameState";
import { BUILDINGS, POWER_UPGRADES } from "@/lib/gameData";
import { formatNumber, cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ITEMS } from "@/assets/index";

const MAX_UPGRADE_LEVEL = 100;

export default function UpgradeShop() {
  const { state, buyBuilding, buyPower, calculateUpgradeCost } = useGameState();

  return (
    <div className="flex flex-col h-full bg-card border-l border-border w-full md:w-80 lg:w-96">
      <div className="p-3 md:p-4 border-b border-border">
        <h2 className="text-base md:text-xl font-bold font-mono tracking-tight uppercase text-primary">Terminal / Upgrades</h2>
      </div>

      <Tabs defaultValue="buildings" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 p-1 m-1.5 md:p-2 md:m-2 bg-muted rounded-md h-auto">
          <TabsTrigger value="buildings" className="py-1.5 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider">Infrastructure</TabsTrigger>
          <TabsTrigger value="power" className="py-1.5 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider">Click Power</TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <ScrollArea className="flex-1 px-3 md:px-4">
            <div className="flex flex-col gap-2 md:gap-3 pb-24 md:pb-4">
              {BUILDINGS.map(item => {
                const owned = state.upgrades[item.id] || 0;
                const isMaxed = owned >= MAX_UPGRADE_LEVEL;
                const cost = calculateUpgradeCost(item.baseCost, owned);
                const canAfford = !isMaxed && state.coins >= cost;

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "transition-all hover-elevate",
                      isMaxed ? "opacity-50 cursor-not-allowed border-primary/30" : canAfford ? "cursor-pointer hover:border-primary/50" : "cursor-pointer opacity-60 grayscale-[0.5]"
                    )}
                    onClick={() => !isMaxed && canAfford && buyBuilding(item.id)}
                  >
                    <CardContent className="p-2 md:p-3 flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-muted/50 rounded-md border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.id in ITEMS ? (
                          <img src={ITEMS[item.id as keyof typeof ITEMS]} alt={item.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                        ) : (
                          <span className="text-xl md:text-2xl">{item.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm md:text-base font-bold truncate pr-2">{item.name}</h4>
                          {isMaxed
                            ? <Badge className="font-mono text-[10px] md:text-xs bg-primary/20 text-primary border border-primary/40">MAX</Badge>
                            : <Badge variant={owned > 0 ? "default" : "outline"} className="font-mono text-[10px] md:text-xs">{owned}</Badge>
                          }
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-mono mt-0.5 md:mt-1">+{formatNumber(item.cps)} PPS</p>
                        <p className={cn("text-xs md:text-sm font-bold font-mono mt-0.5 md:mt-1", isMaxed ? "text-primary/50" : canAfford ? "text-accent" : "text-destructive")}>
                          {isMaxed ? "Max level reached" : `Cost: ${formatNumber(cost)}`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="power" className="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <ScrollArea className="flex-1 px-3 md:px-4">
            <div className="flex flex-col gap-2 md:gap-3 pb-24 md:pb-4">
              {POWER_UPGRADES.map(item => {
                const owned = state.upgrades[item.id] || 0;
                const isMaxed = owned >= MAX_UPGRADE_LEVEL;
                const cost = calculateUpgradeCost(item.baseCost, owned);
                const canAfford = !isMaxed && state.coins >= cost;

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "transition-all hover-elevate",
                      isMaxed ? "opacity-50 cursor-not-allowed border-primary/30" : canAfford ? "cursor-pointer hover:border-primary/50" : "cursor-pointer opacity-60 grayscale-[0.5]"
                    )}
                    onClick={() => !isMaxed && canAfford && buyPower(item.id)}
                  >
                    <CardContent className="p-2 md:p-3 flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-muted/50 rounded-md border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.id in ITEMS ? (
                          <img src={ITEMS[item.id as keyof typeof ITEMS]} alt={item.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                        ) : (
                          <span className="text-xl md:text-2xl">{item.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm md:text-base font-bold truncate pr-2">{item.name}</h4>
                          {isMaxed
                            ? <Badge className="font-mono text-[10px] md:text-xs bg-primary/20 text-primary border border-primary/40">MAX</Badge>
                            : <Badge variant={owned > 0 ? "secondary" : "outline"} className="font-mono text-[10px] md:text-xs">{owned}</Badge>
                          }
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-mono mt-0.5 md:mt-1">+{formatNumber(item.cpc)} PPC</p>
                        <p className={cn("text-xs md:text-sm font-bold font-mono mt-0.5 md:mt-1", isMaxed ? "text-primary/50" : canAfford ? "text-accent" : "text-destructive")}>
                          {isMaxed ? "Max level reached" : `Cost: ${formatNumber(cost)}`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
