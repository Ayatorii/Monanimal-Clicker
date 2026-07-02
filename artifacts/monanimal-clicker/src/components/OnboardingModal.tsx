import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Loader2 } from "lucide-react";
import { getOrCreatePlayerId, getOrCreateRecoveryCode } from "@/hooks/useGameState";

type Screen = "choose" | "generated" | "restore";

export default function OnboardingModal() {
  const [screen, setScreen] = useState<Screen>("choose");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [restoreInput, setRestoreInput] = useState("");
  const [restoreError, setRestoreError] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleGenerate = () => {
    getOrCreatePlayerId();
    const code = getOrCreateRecoveryCode();
    setRecoveryCode(code);
    setScreen("generated");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleContinue = () => {
    window.location.reload();
  };

  const handleRestore = async () => {
    const code = restoreInput.trim().toUpperCase();
    if (!code) return;
    setRestoreLoading(true);
    setRestoreError("");
    try {
      const res = await fetch(`/api/players/recover/${code}`);
      if (!res.ok) {
        setRestoreError("Code not found. Please check and try again.");
        setRestoreLoading(false);
        return;
      }
      const player = await res.json();
      localStorage.setItem("monanimal-player-id", player.id);
      localStorage.setItem("monanimal-recovery-code", player.recoveryCode);
      localStorage.setItem("monanimal-clicker-save-v2", JSON.stringify(player.state));
      window.location.reload();
    } catch {
      setRestoreError("Network error. Please try again.");
      setRestoreLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "backOut" }}
        className="w-full max-w-sm mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-[0_0_15px_rgba(110,84,255,0.5)]">
              M
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-widest text-foreground leading-none">Monanimal</h1>
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider mt-0.5">ALPHA 1.0.0</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {screen === "choose" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">Save Your Progress</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get a recovery code to restore your progress across devices or browsers.
                  Keep it safe — it's the only way to recover your account.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,84,255,0.3)]"
                >
                  Generate Code
                </button>
                <button
                  onClick={() => setScreen("restore")}
                  className="w-full py-3 px-4 rounded-xl border border-border text-foreground font-bold uppercase tracking-widest text-sm hover:bg-muted/50 transition-colors"
                >
                  I Already Have a Code
                </button>
              </div>
            </div>
          )}

          {screen === "generated" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">Your Recovery Code</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Save this code to not lose your progress.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 font-mono text-lg font-bold text-primary tracking-[0.3em] text-center select-all">
                    {recoveryCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 rounded-xl border border-border hover:bg-muted/50 transition-colors flex items-center justify-center min-w-[48px]"
                    title="Copy code"
                  >
                    {copied
                      ? <Check className="h-4 w-4 text-green-400" />
                      : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-400 font-mono text-center">Copied to clipboard!</p>
                )}
              </div>
              <button
                onClick={handleContinue}
                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,84,255,0.3)]"
              >
                Continue
              </button>
            </div>
          )}

          {screen === "restore" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">Restore Progress</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter your recovery code to load your saved progress.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="ENTER YOUR CODE"
                  value={restoreInput}
                  onChange={(e) => { setRestoreInput(e.target.value); setRestoreError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && !restoreLoading && handleRestore()}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-mono text-base font-bold text-foreground tracking-widest text-center uppercase outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40 placeholder:text-sm"
                  autoCapitalize="characters"
                  spellCheck={false}
                />
                {restoreError && (
                  <p className="text-xs text-destructive font-mono text-center">{restoreError}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRestore}
                  disabled={restoreLoading || !restoreInput.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-[0_0_20px_rgba(110,84,255,0.3)] flex items-center justify-center gap-2"
                >
                  {restoreLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit
                </button>
                <button
                  onClick={() => { setScreen("choose"); setRestoreError(""); setRestoreInput(""); }}
                  className="w-full py-2 px-4 rounded-xl border border-border text-muted-foreground font-bold uppercase tracking-widest text-xs hover:bg-muted/50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
