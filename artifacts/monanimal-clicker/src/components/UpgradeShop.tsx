import React from "react";
import { useGameState } from "@/hooks/useGameState";
import { BUILDINGS, POWER_UPGRADES } from "@/lib/gameData";
import { formatNumber, cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ITEMS } from "@/assets/index";

export default function UpgradeShop() {
  const { state, buyBuilding, buyPower, calculateUpgradeCost } = useGameState();

  return (
    <div className="flex flex-col h-full bg-card border-l border-border w-full md:w-80 lg:w-96">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold font-mono tracking-tight uppercase text-primary">Terminal / Upgrades</h2>
      </div>

      <Tabs defaultValue="buildings" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 p-2 m-2 bg-muted rounded-md h-auto">
          <TabsTrigger value="buildings" className="py-2 text-sm font-bold uppercase tracking-wider">Infrastructure</TabsTrigger>
          <TabsTrigger value="power" className="py-2 text-sm font-bold uppercase tracking-wider">Click Power</TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <ScrollArea className="flex-1 px-4">
            <div className="flex flex-col gap-3 pb-24 md:pb-4">
              {BUILDINGS.map(item => {
                const owned = state.upgrades[item.id] || 0;
                const cost = calculateUpgradeCost(item.baseCost, owned);
                const canAfford = state.coins >= cost;

                return (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "cursor-pointer transition-all hover-elevate",
                      !canAfford ? "opacity-60 grayscale-[0.5]" : "hover:border-primary/50"
                    )}
                    onClick={() => canAfford && buyBuilding(item.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted/50 rounded-md border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.id in ITEMS ? (
                          <img
                            src={ITEMS[item.id as keyof typeof ITEMS]}
                            alt={item.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <span className="text-2xl">{item.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold truncate pr-2">{item.name}</h4>
                          <Badge variant={owned > 0 ? "default" : "outline"} className="font-mono">{owned}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-1">+{formatNumber(item.cps)} CPS</p>
                        <p className={cn("text-sm font-bold font-mono mt-1", canAfford ? "text-accent" : "text-destructive")}>
                          Cost: {formatNumber(cost)}
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
          <ScrollArea className="flex-1 px-4">
            <div className="flex flex-col gap-3 pb-24 md:pb-4">
              {POWER_UPGRADES.map(item => {
                const owned = state.upgrades[item.id] || 0;
                const cost = calculateUpgradeCost(item.baseCost, owned);
                const canAfford = state.coins >= cost;

                return (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "cursor-pointer transition-all hover-elevate",
                      !canAfford ? "opacity-60 grayscale-[0.5]" : "hover:border-primary/50"
                    )}
                    onClick={() => canAfford && buyPower(item.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted/50 rounded-md border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.id in ITEMS ? (
                          <img
                            src={ITEMS[item.id as keyof typeof ITEMS]}
                            alt={item.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <span className="text-2xl">{item.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold truncate pr-2">{item.name}</h4>
                          <Badge variant={owned > 0 ? "secondary" : "outline"} className="font-mono">{owned}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-1">+{formatNumber(item.cpc)} CPC</p>
                        <p className={cn("text-sm font-bold font-mono mt-1", canAfford ? "text-accent" : "text-destructive")}>
                          Cost: {formatNumber(cost)}
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
