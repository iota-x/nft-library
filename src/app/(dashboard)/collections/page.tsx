"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useWalletContext } from "@/context/WalletContext";
import useFetchNFTs from "@/app/hooks/useFetchNFTs";
import NftImage from "@/components/NftImage";
import { NFTCollectionSkeleton } from "@/components/NFTCollection";
import ConnectWalletPanel from "@/components/ConnectWalletPanel";
import WalletStatusChip from "@/components/WalletStatusChip";

const CollectionsIndexPage: React.FC = () => {
  const { address } = useWalletContext();

  const shouldFetch = Boolean(address && address !== "null");
  const { nfts, loading, error } = useFetchNFTs(shouldFetch ? address! : "");

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
      <div className="flex min-h-screen items-center justify-center px-6 py-32">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">See your collections</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">
            Connect a wallet or paste any Solana address to see the collections it holds.
          </p>
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
            <ConnectWalletPanel />
          </div>
        </div>
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
          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2">
            <WalletStatusChip />
            {!loading && !error && (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
                {collections.length} {collections.length === 1 ? "collection" : "collections"}
              </span>
            )}
          </div>
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
                    <NftImage
                      src={c.image}
                      alt={c.name}
                      sizes="64px"
                      imgClassName="group-hover:scale-110"
                      iconClassName="h-7 w-7"
                    />
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
