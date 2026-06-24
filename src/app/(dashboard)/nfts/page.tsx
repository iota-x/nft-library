"use client";
import React, { useEffect, useState } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import useFetchNFTs from '@/app/hooks/useFetchNFTs';
import NFTCollection, { NFTCollectionSkeleton } from '@/components/NFTCollection';

interface Attribute {
  trait_type: string;
  value: string;
}

interface NFT {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  attributes?: Attribute[];
  isFavorited?: boolean;
}

const NftsPage: React.FC = () => {
  const { publicKey } = useWalletContext();
  const [manualAddress, setManualAddress] = useState<string | null>(null);

  // Fetch manual wallet address from local storage
  useEffect(() => {
    const storedAddress = localStorage.getItem('manualWalletAddress');
    if (storedAddress) {
      setManualAddress(storedAddress);
    }
  }, []);

  // Use the connected wallet, falling back to a manually-entered address
  const address = publicKey || manualAddress || '';

  // Add a check here to prevent API call if the address is invalid
  const shouldFetchNFTs = address && address !== 'null';

  const { nfts, loading, error, refetch } = useFetchNFTs(shouldFetchNFTs ? address : '');

  // Display message if address is invalid
  if (!shouldFetchNFTs) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black px-6 text-center">
        <p className="max-w-md text-lg text-neutral-400">
          Please connect your wallet or enter a manual wallet address to see your NFTs.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black px-6 pb-24 pt-36 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-12 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Collection
          </span>
          <h1 className="mt-6 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Your NFT Collection
          </h1>
          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {address.length > 14 ? `${address.slice(0, 6)}…${address.slice(-6)}` : address}
            </span>
            {!loading && !error && (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
                {nfts.length} {nfts.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </header>

        {loading && <NFTCollectionSkeleton />}

        {error && !loading && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && (
          nfts.length > 0 ? (
            <NFTCollection
              items={nfts.map((nft: NFT) => ({
                title: nft.title,
                description: nft.description || 'No description available',
                imageUrl: nft.imageUrl,
                link: `/nfts/${nft.id}`,
              }))}
            />
          ) : (
            <div className="mt-16 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
              <p className="mt-5 text-sm text-neutral-400">No NFTs found for this address.</p>
            </div>
          )
        )}
        <div className="mt-10 flex justify-center">
      <button
        onClick={refetch}
        className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
          <span>Refetch NFTs</span>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button>
        </div>
      </div>
    </div>
  );
};

export default NftsPage;
