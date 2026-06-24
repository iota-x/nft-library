"use client";
import React, { useEffect, useState } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ProfilePage: React.FC = () => {
  const { publicKey, connected } = useWalletContext();
  const [manualAddress, setManualAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('manualWalletAddress');
    if (stored) setManualAddress(stored);
  }, []);

  const activeAddress = publicKey || manualAddress;

  const handleCopy = async () => {
    if (!activeAddress) return;
    await navigator.clipboard.writeText(activeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-36 sm:px-8">
        <header className="mb-10 text-center">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            Profile
          </h1>
          <p className="mt-4 text-base text-neutral-400">
            Manage the wallet connected to your gallery.
          </p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Wallet
            </h2>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                activeAddress
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-white/5 text-neutral-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  activeAddress ? 'bg-emerald-400' : 'bg-neutral-500'
                }`}
              />
              {activeAddress ? 'Connected' : 'Not connected'}
            </span>
          </div>

          <WalletMultiButton />

          {activeAddress ? (
            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                {connected ? 'Address' : 'Manual Address'}
              </p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="break-all font-mono text-sm text-neutral-200">{activeAddress}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/5"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-neutral-500">
              Connect a wallet above to view your profile details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
