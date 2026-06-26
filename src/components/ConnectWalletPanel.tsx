"use client";

import { useState } from "react";
import { ClientWalletButton } from "@/components/ClientWalletButton";
import { isValidSolanaAddress, useWalletContext } from "@/context/WalletContext";

/**
 * The "no wallet yet" panel: connect a real wallet, or view any address by
 * pasting it. Shared by the My NFTs / Collections empty states and the
 * dashboard so the manual-address flow is reachable everywhere, not just on
 * one page.
 */
const ConnectWalletPanel: React.FC<{ className?: string }> = ({ className }) => {
  const { setManualWallet } = useWalletContext();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const addr = value.trim();
    if (!addr) return;
    if (!isValidSolanaAddress(addr)) {
      setError("That doesn't look like a valid Solana address.");
      return;
    }
    setError(null);
    setManualWallet(addr);
  };

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="nav-wallet">
        <ClientWalletButton />
      </div>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-neutral-500">or view any address</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Paste a Solana wallet address"
          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
        />
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          View wallet
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default ConnectWalletPanel;
