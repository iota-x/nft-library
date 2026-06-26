"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ConnectionProvider,
  WalletProvider as SWAWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletError } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const MANUAL_KEY = "manualWalletAddress";

/** Solana addresses are base58, 32–44 chars. */
export const isValidSolanaAddress = (addr: string) =>
  /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim());

interface WalletContextProps {
  /** Connected wallet's address, or null. */
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /** A manually-entered address being viewed (no real connection), or null. */
  manualAddress: string | null;
  /** Effective address in use: connected wallet takes precedence over manual. */
  address: string | null;
  setManualWallet: (address: string) => void;
  clearManualWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();
  const [manualAddress, setManualAddressState] = useState<string | null>(null);

  // Hydrate the manual address from localStorage once on mount.
  useEffect(() => {
    const stored = localStorage.getItem(MANUAL_KEY);
    if (stored) setManualAddressState(stored);
  }, []);

  const setManualWallet = useCallback((addr: string) => {
    const trimmed = addr.trim();
    localStorage.setItem(MANUAL_KEY, trimmed);
    setManualAddressState(trimmed);
  }, []);

  const clearManualWallet = useCallback(() => {
    localStorage.removeItem(MANUAL_KEY);
    setManualAddressState(null);
  }, []);

  // Wrap connect/disconnect so a user cancelling or rejecting never throws an
  // unhandled rejection that breaks the UI.
  const safeConnect = useCallback(async () => {
    try {
      await connect();
    } catch (err) {
      console.warn("Wallet connect cancelled or failed:", err);
    }
  }, [connect]);

  const safeDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (err) {
      console.warn("Wallet disconnect failed:", err);
    }
  }, [disconnect]);

  // A real wallet takes precedence over a manually-entered address. Once one
  // connects, drop any stored manual address so the two can't conflict.
  useEffect(() => {
    if (connected) {
      localStorage.removeItem(MANUAL_KEY);
      setManualAddressState(null);
    }
  }, [connected]);

  const pubkey = publicKey?.toBase58() || null;

  return (
    <WalletContext.Provider
      value={{
        publicKey: pubkey,
        connected,
        connecting,
        connect: safeConnect,
        disconnect: safeDisconnect,
        manualAddress,
        address: pubkey || manualAddress,
        setManualWallet,
        clearManualWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  // Swallow expected errors (user rejection, wallet not selected, etc.) so the
  // app doesn't crash or surface a broken state when a connection is cancelled.
  const onError = useCallback((error: WalletError) => {
    console.warn("Wallet error:", error.name, error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SWAWalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </WalletModalProvider>
      </SWAWalletProvider>
    </ConnectionProvider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWalletContext must be used within WalletProvider");
  return context;
};
