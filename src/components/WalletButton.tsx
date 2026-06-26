'use client';

import React from 'react';
import Link from 'next/link';
import { ClientWalletButton } from '@/components/ClientWalletButton';
import ConnectWalletPanel from '@/components/ConnectWalletPanel';
import { useWalletContext } from '@/context/WalletContext';

const WalletButton: React.FC = () => {
  const { publicKey, connected, manualAddress, clearManualWallet } = useWalletContext();

  // Real wallet connected.
  if (connected && publicKey) {
    return (
      <div className="flex flex-col gap-4">
        <div className="nav-wallet self-start">
          <ClientWalletButton />
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-emerald-400">Connected</p>
          <p className="mt-1 break-all font-mono text-sm text-neutral-200">{publicKey}</p>
        </div>
      </div>
    );
  }

  // Viewing a manually-entered address.
  if (manualAddress) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-sky-300">Viewing address</p>
          <p className="mt-1 break-all font-mono text-sm text-neutral-200">{manualAddress}</p>
          <div className="mt-3 flex items-center gap-4">
            <Link href="/nfts" className="text-sm font-medium text-sky-300 transition hover:text-sky-200">
              View NFTs →
            </Link>
            <button
              onClick={clearManualWallet}
              className="text-sm font-medium text-red-400 transition hover:text-red-300"
            >
              Disconnect
            </button>
          </div>
        </div>
        <div className="nav-wallet self-start">
          <ClientWalletButton />
        </div>
      </div>
    );
  }

  // Nothing connected yet.
  return <ConnectWalletPanel />;
};

export default WalletButton;
