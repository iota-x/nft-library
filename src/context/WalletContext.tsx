"use client";

import React, { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
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

interface WalletContextProps {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();

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

  return (
    <WalletContext.Provider
      value={{
        publicKey: publicKey?.toBase58() || null,
        connected,
        connecting,
        connect: safeConnect,
        disconnect: safeDisconnect,
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
