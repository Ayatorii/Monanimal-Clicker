import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useOfflineProgress } from "@/hooks/useGameLoop";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function OfflineProgress() {
  const offlineData = useOfflineProgress();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (offlineData && offlineData.earned > 0) {
      setOpen(true);
    }
  }, [offlineData]);

  if (!offlineData) return null;

  const hours = Math.floor(offlineData.secs / 3600);
  const minutes = Math.floor((offlineData.secs % 3600) / 60);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm text-center border-secondary/50 shadow-[0_0_30px_rgba(133,230,255,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-widest text-secondary text-center">Offline Progress</DialogTitle>
          <DialogDescription className="text-center font-mono">
            Your infrastructure was working while you were away.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="mb-4 text-secondary">
            <Clock className="h-12 w-12" />
          </div>
          <div className="text-lg font-mono text-muted-foreground mb-2">
            Time offline: {hours}h {minutes}m
          </div>
          <div className="text-3xl font-black font-mono text-accent">
            +{formatNumber(offlineData.earned)} Coins
          </div>
        </div>

        <Button onClick={() => setOpen(false)} variant="secondary" className="w-full font-bold h-12 uppercase tracking-wider">
          Collect
        </Button>
      </DialogContent>
    </Dialog>
  );
}
