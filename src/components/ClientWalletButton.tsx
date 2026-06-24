"use client";

import dynamic from "next/dynamic";

/**
 * The wallet-adapter `WalletMultiButton` reads browser-only state (installed
 * wallets, connection status) and renders different markup on the server vs the
 * client. Rendering it during SSR causes a hydration mismatch that flashes a
 * broken button. Loading it client-side only keeps the UI stable, especially
 * when a user opens the connect modal but doesn't finish connecting.
 */
export const ClientWalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        disabled
        className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-semibold text-neutral-400"
      >
        Loading wallet…
      </button>
    ),
  }
);

export default ClientWalletButton;
