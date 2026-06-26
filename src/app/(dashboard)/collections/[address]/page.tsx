"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NftImage from "@/components/NftImage";
import NFTCollection, { NFTCardItem, NFTCollectionSkeleton } from "@/components/NFTCollection";

interface CollectionInfo {
  address: string;
  name: string;
  description: string;
  image: string;
  externalUrl: string;
  total: number;
}

interface SummaryNFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const CollectionPage = () => {
  const params = useParams();
  const address = Array.isArray(params.address) ? params.address[0] : params.address;

  const [info, setInfo] = useState<CollectionInfo | null>(null);
  const [nfts, setNfts] = useState<SummaryNFT[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (pageToLoad: number) => {
      if (!address) return;
      pageToLoad === 1 ? setLoading(true) : setLoadingMore(true);
      setError(null);
      try {
        const res = await fetch(`/api/collections/${address}?page=${pageToLoad}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to load collection");

        setInfo(data.collection as CollectionInfo);
        setNfts((prev) =>
          pageToLoad === 1 ? data.nfts : [...prev, ...(data.nfts as SummaryNFT[])],
        );
        setHasMore(Boolean(data.hasMore));
        setPage(pageToLoad);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load collection");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [address],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const cards: NFTCardItem[] = nfts.map((nft) => ({
    title: nft.title,
    description: nft.description || "No description available",
    imageUrl: nft.imageUrl,
    link: `/nfts/${nft.id}`,
  }));

  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32 sm:px-8">
        <Link
          href="/nfts"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to your collection
        </Link>

        {/* Collection header */}
        <header className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:h-28 sm:w-28">
            {loading && !info ? (
              <div className="h-full w-full animate-pulse bg-white/[0.05]" />
            ) : (
              <NftImage src={info?.image} alt={info?.name ?? "Collection"} sizes="112px" iconClassName="h-9 w-9" />
            )}
          </div>
          <div className="min-w-0">
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-neutral-400">
              Collection
            </span>
            <h1 className="mt-3 truncate text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">
              {info?.name ?? "Loading…"}
            </h1>
            {info?.description && (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
                {info.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-neutral-400">
                {address && address.length > 14 ? `${address.slice(0, 6)}…${address.slice(-6)}` : address}
              </span>
              {!loading && nfts.length > 0 && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-neutral-400">
                  {nfts.length.toLocaleString()}
                  {hasMore ? '+' : ''} items
                </span>
              )}
              {info?.externalUrl && (
                <a
                  href={info.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-sky-300 transition hover:bg-white/[0.06]"
                >
                  Website ↗
                </a>
              )}
            </div>
          </div>
        </header>

        {loading && <NFTCollectionSkeleton />}

        {error && !loading && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && cards.length === 0 && (
          <p className="mt-16 text-center text-sm text-neutral-400">
            No items found for this collection.
          </p>
        )}

        {!loading && !error && cards.length > 0 && (
          <>
            <NFTCollection items={cards} />
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => load(page + 1)}
                  disabled={loadingMore}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-white/[0.07] disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
