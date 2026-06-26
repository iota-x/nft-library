"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useWalletContext } from '@/context/WalletContext';
import useFetchNFTs from '@/app/hooks/useFetchNFTs';
import NFTCollection, { NFTCardItem, NFTCollectionSkeleton } from '@/components/NFTCollection';
import PortfolioStats from '@/components/PortfolioStats';
import ConnectWalletPanel from '@/components/ConnectWalletPanel';
import WalletStatusChip from '@/components/WalletStatusChip';

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
  collection: { name: string; address: string; image?: string } | null;
  compressed: boolean;
  tokenStandard: string | null;
}

type SortKey = 'default' | 'name-asc' | 'name-desc';

const UNCATEGORIZED = '__none__';

const NftsPage: React.FC = () => {
  const { address } = useWalletContext();

  // Filter/sort/group UI state.
  const [search, setSearch] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [grouped, setGrouped] = useState(false);

  const shouldFetchNFTs = Boolean(address && address !== 'null');

  const { nfts, loading, error, refetch } = useFetchNFTs(shouldFetchNFTs ? address! : '');

  // Distinct collections present in the wallet, for the filter dropdown.
  const collectionOptions = useMemo(() => {
    const map = new Map<string, string>();
    let hasUncategorized = false;
    for (const nft of nfts) {
      if (nft.collection) map.set(nft.collection.address, nft.collection.name);
      else hasUncategorized = true;
    }
    const options = Array.from(map.entries())
      .map(([address, name]) => ({ address, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (hasUncategorized) options.push({ address: UNCATEGORIZED, name: 'Uncategorized' });
    return options;
  }, [nfts]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = nfts.filter((nft) => {
      if (q && !nft.title.toLowerCase().includes(q)) return false;
      if (collectionFilter === 'all') return true;
      if (collectionFilter === UNCATEGORIZED) return !nft.collection;
      return nft.collection?.address === collectionFilter;
    });

    if (sort !== 'default') {
      list = [...list].sort((a, b) =>
        sort === 'name-asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title),
      );
    }
    return list;
  }, [nfts, search, collectionFilter, sort]);

  const toCard = (nft: NFT): NFTCardItem => ({
    title: nft.title,
    description: nft.description || 'No description available',
    imageUrl: nft.imageUrl,
    link: `/nfts/${nft.id}`,
  });

  // For grouped view, bucket the visible NFTs by collection.
  const groups = useMemo(() => {
    if (!grouped) return [];
    const map = new Map<string, { name: string; address: string; items: NFT[] }>();
    for (const nft of visible) {
      const key = nft.collection?.address ?? UNCATEGORIZED;
      const name = nft.collection?.name ?? 'Uncategorized';
      const bucket = map.get(key) ?? { name, address: key, items: [] };
      bucket.items.push(nft);
      map.set(key, bucket);
    }
    return Array.from(map.values()).sort((a, b) => b.items.length - a.items.length);
  }, [grouped, visible]);

  if (!shouldFetchNFTs) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-32">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">See your NFT collection</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">
            Connect a wallet to view your NFTs, or paste any Solana address to browse it.
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
            Collection
          </span>
          <h1 className="mt-6 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Your NFT Collection
          </h1>
          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2">
            <WalletStatusChip />
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

        {!loading && !error && nfts.length > 0 && (
          <>
            <PortfolioStats nfts={nfts} />

            {/* Toolbar */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 transition focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/30"
                />
              </div>

              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-neutral-200 transition focus:border-sky-400/40 focus:outline-none"
              >
                <option value="all">All collections</option>
                {collectionOptions.map((c) => (
                  <option key={c.address} value={c.address}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-neutral-200 transition focus:border-sky-400/40 focus:outline-none"
              >
                <option value="default">Sort: Default</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
              </select>

              <button
                onClick={() => setGrouped((g) => !g)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  grouped
                    ? 'border-sky-400/40 bg-sky-500/10 text-sky-200'
                    : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06]'
                }`}
              >
                Group
              </button>
            </div>

            {visible.length === 0 ? (
              <p className="mt-16 text-center text-sm text-neutral-400">
                No NFTs match your filters.
              </p>
            ) : grouped ? (
              <div className="space-y-12">
                {groups.map((g) => (
                  <section key={g.address}>
                    <div className="mb-4 flex items-baseline justify-between gap-3">
                      <h2 className="truncate text-lg font-semibold text-neutral-100">{g.name}</h2>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs text-neutral-500">{g.items.length} items</span>
                        {g.address !== UNCATEGORIZED && (
                          <Link
                            href={`/collections/${g.address}`}
                            className="text-xs font-medium text-sky-300 transition hover:text-sky-200"
                          >
                            Explore →
                          </Link>
                        )}
                      </div>
                    </div>
                    <NFTCollection items={g.items.map(toCard)} />
                  </section>
                ))}
              </div>
            ) : (
              <NFTCollection items={visible.map(toCard)} />
            )}
          </>
        )}

        {!loading && !error && nfts.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>
            <p className="mt-5 text-sm text-neutral-400">No NFTs found for this address.</p>
          </div>
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
              <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.75 8.75L14.25 12L10.75 15.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
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
