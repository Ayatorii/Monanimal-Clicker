import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export default function DailyReward() {
  const { state, claimDailyReward } = useGameState();
  const [open, setOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (state.dailyRewardLastClaimed !== today) {
      setOpen(true);
    }
  }, [state.dailyRewardLastClaimed]);

  const handleClaim = () => {
    const amount = claimDailyReward();
    setRewardAmount(amount);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm sm:max-w-[425px] text-center border-primary/50 shadow-[0_0_30px_rgba(110,84,255,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase tracking-widest text-primary text-center">Daily Reward</DialogTitle>
          <DialogDescription className="text-center font-mono">
            Welcome back to the Monad ecosystem!
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="mb-6 text-primary animate-bounce">
            <Gift className="h-16 w-16" />
          </div>
          <div className="text-xl font-bold font-mono">Current Streak: <span className="text-accent">{state.dailyRewardStreak} Days</span></div>
        </div>

        <Button onClick={handleClaim} className="w-full text-lg font-bold h-12 uppercase tracking-wider">
          Claim Reward
        </Button>
      </DialogContent>
    </Dialog>
  );
}
