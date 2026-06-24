'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletButton: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [manualAddress, setManualAddress] = useState<string>('');
  const [manualWalletError, setManualWalletError] = useState<string | null>(null);
  const [manualConnected, setManualConnected] = useState<boolean>(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem('manualWalletAddress');
    if (storedAddress) {
      setManualAddress(storedAddress);
      setManualConnected(true);
    }
  }, []);

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setManualAddress(address);
    if (address && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      setManualWalletError('Invalid wallet address.');
    } else {
      setManualWalletError(null);
    }
  };

  const handleAddManualWallet = () => {
    if (manualAddress && !manualWalletError) {
      localStorage.setItem('manualWalletAddress', manualAddress);
      setManualConnected(true);
    }
  };

  const handleDisconnectManual = () => {
    localStorage.removeItem('manualWalletAddress');
    setManualAddress('');
    setManualConnected(false);
  };

  const isManualActive = !connected && manualConnected;

  return (
    <div className="flex flex-col gap-5">
      <WalletMultiButton />

      {!connected && !manualConnected && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-neutral-500">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <input
            type="text"
            value={manualAddress}
            onChange={handleManualAddressChange}
            placeholder="Enter a wallet address"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40"
          />
          {manualWalletError && (
            <p className="text-sm text-red-400">{manualWalletError}</p>
          )}
          <button
            onClick={handleAddManualWallet}
            disabled={!manualAddress || !!manualWalletError}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Manual Wallet
          </button>
        </div>
      )}

      {connected && publicKey && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-emerald-400">Connected</p>
          <p className="mt-1 break-all font-mono text-sm text-neutral-200">{publicKey.toBase58()}</p>
        </div>
      )}

      {isManualActive && (
        <div className="rounded-lg border border-white/10 bg-black/40 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-400">Manual Wallet</p>
          <p className="mt-1 break-all font-mono text-sm text-neutral-200">{manualAddress}</p>
          <button
            onClick={handleDisconnectManual}
            className="mt-3 text-sm font-medium text-red-400 transition hover:text-red-300"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
