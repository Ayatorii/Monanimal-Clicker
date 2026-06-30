import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGameState } from "@/hooks/useGameState";
import { ACHIEVEMENTS } from "@/lib/gameData";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";

export default function AchievementsModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { state, unseenAchievements, clearUnseenAchievements } = useGameState();

  const unlockedCount = state.achievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progress = (unlockedCount / totalCount) * 100;

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      clearUnseenAchievements();
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col bg-card/95 backdrop-blur border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-wider text-primary">Achievements</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between text-sm font-mono text-muted-foreground">
            <span>Progress</span>
            <span>{unlockedCount} / {totalCount}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex flex-col gap-3 mt-4 overflow-y-auto pr-2">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = state.achievements.includes(ach.id);
            const isUnseen = unseenAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={cn(
                  "p-3 rounded-md border flex items-center gap-4 transition-all duration-300",
                  unlocked && isUnseen
                    ? "border-red-500 bg-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,0.4)]"
                    : unlocked
                    ? "border-primary bg-primary/5"
                    : "border-border opacity-60 bg-muted/30"
                )}
              >
                <div className="text-3xl bg-background rounded-md p-2 shadow-inner border border-border flex items-center justify-center w-14 h-14 flex-shrink-0">
                  {unlocked ? ach.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-bold text-sm uppercase tracking-wide flex items-center gap-2",
                    unlocked && isUnseen ? "text-red-400"
                    : unlocked ? "text-primary"
                    : "text-muted-foreground"
                  )}>
                    {ach.name}
                    {isUnseen && unlocked && (
                      <span className="text-[9px] font-black tracking-widest text-red-400 border border-red-500/50 rounded px-1 py-0.5 leading-none">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{ach.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
