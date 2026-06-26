"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWalletContext } from "@/context/WalletContext";
import useFetchNFTs from "@/app/hooks/useFetchNFTs";
import { nftImageLoader } from "@/utils/imageLoader";
import { NFTCollectionSkeleton } from "@/components/NFTCollection";

const CollectionsIndexPage: React.FC = () => {
  const { publicKey } = useWalletContext();
  const [manualAddress, setManualAddress] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("manualWalletAddress");
    if (stored) setManualAddress(stored);
  }, []);

  const address = publicKey || manualAddress || "";
  const shouldFetch = address && address !== "null";
  const { nfts, loading, error } = useFetchNFTs(shouldFetch ? address : "");

  // Roll the wallet's NFTs up into distinct collections with item counts.
  const collections = useMemo(() => {
    const map = new Map<string, { name: string; address: string; image?: string; count: number }>();
    for (const nft of nfts) {
      if (!nft.collection) continue;
      const existing = map.get(nft.collection.address);
      if (existing) {
        existing.count++;
        if (!existing.image && nft.collection.image) existing.image = nft.collection.image;
      } else {
        map.set(nft.collection.address, { ...nft.collection, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [nfts]);

  if (!shouldFetch) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="max-w-md text-lg text-neutral-400">
          Connect your wallet or enter an address to see the collections you hold.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 pb-24 pt-36 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-12 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Collections
          </span>
          <h1 className="mt-6 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Collections You Hold
          </h1>
          {!loading && !error && (
            <p className="mx-auto mt-5 text-sm text-neutral-400">
              {collections.length} {collections.length === 1 ? "collection" : "collections"}
            </p>
          )}
        </header>

        {loading && <NFTCollectionSkeleton count={6} />}

        {error && !loading && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && collections.length === 0 && (
          <p className="mt-16 text-center text-sm text-neutral-400">
            No grouped collections found for this wallet.
          </p>
        )}

        {!loading && !error && collections.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Link key={c.address} href={`/collections/${c.address}`} className="group relative block">
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 opacity-0 blur transition duration-500 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-500 group-hover:-translate-y-1 group-hover:border-white/20">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    {c.image ? (
                      <Image
                        loader={nftImageLoader}
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="64px"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-neutral-600">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
                        </svg>
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold tracking-tight text-neutral-100" title={c.name}>
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-400">
                      {c.count} {c.count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <svg className="h-5 w-5 shrink-0 text-neutral-600 transition group-hover:translate-x-0.5 group-hover:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 8.75L14.25 12l-3.5 3.25" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsIndexPage;
