"use client";

import { useWalletContext } from "@/context/WalletContext";

const shorten = (addr: string) =>
  addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-6)}` : addr;

/**
 * Shows the address currently in view and how it's sourced (a connected wallet
 * vs. a manually-pasted address), with a one-click way to disconnect either —
 * so a manual viewer can always get back to the connect screen.
 */
const WalletStatusChip: React.FC = () => {
  const { address, connected, disconnect, clearManualWallet } = useWalletContext();
  if (!address) return null;

  const isManual = !connected;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-3 pr-1.5 font-mono text-xs text-neutral-400">
      <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-sky-400"}`} />
      <span className="not-italic">{isManual ? "Viewing" : "Connected"}</span>
      <span className="text-neutral-300">{shorten(address)}</span>
      <button
        onClick={() => (isManual ? clearManualWallet() : disconnect())}
        title={isManual ? "Stop viewing this address" : "Disconnect wallet"}
        className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full text-neutral-500 transition hover:bg-white/10 hover:text-red-300"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
};

export default WalletStatusChip;
