"use client";
import React, { useEffect, useState } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import useFetchNFTs from '@/app/hooks/useFetchNFTs';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import LoadingSpinner from '@/components/LoadingSpinner';

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
        <header className="mb-10 text-center">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            Your NFT Collection
          </h1>
          <p className="mx-auto mt-4 max-w-xl break-all text-sm text-neutral-500">
            Owned by {address}
          </p>
        </header>

        {loading && <LoadingSpinner />}
        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-red-400">
            {error}
          </p>
        )}
        {nfts.length > 0 ? (
          <HoverEffect
            items={nfts.map((nft: NFT) => ({
              title: nft.title,
              description: nft.description || 'No description available',
              imageUrl: nft.imageUrl,
              link: `/nfts/${nft.id}`,
            }))}
            className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          />
        ) : (
          !loading && (
            <p className="mt-10 text-center text-neutral-400">No NFTs found for this address.</p>
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
