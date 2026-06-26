"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NftImage from "@/components/NftImage";
import { NFTCollectionSkeleton } from "@/components/NFTCollection";

interface CollectionMarket {
  symbol: string;
  name: string;
  description: string;
  image: string;
  floorPrice: number | null;
  listedCount: number | null;
  volumeAll: number | null;
}

interface Listing {
  mint: string;
  price: number | null;
  name: string;
  image: string;
  rarityRank: number | null;
}

const compact = (n: number) =>
  Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{label}</p>
    <p className="mt-1 text-lg font-bold text-neutral-100">{value}</p>
  </div>
);

const ExploreCollectionPage = () => {
  const params = useParams();
  const symbol = Array.isArray(params.symbol) ? params.symbol[0] : params.symbol;

  const [collection, setCollection] = useState<CollectionMarket | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/explore/${symbol}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setCollection(data.collection);
          setListings(data.listings);
        } else setError(data.message || "Failed to load collection");
      })
      .catch(() => !cancelled && setError("Failed to load collection"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32 sm:px-8">
        <Link
          href="/explore"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to trending
        </Link>

        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:h-28 sm:w-28">
            {loading && !collection ? (
              <div className="h-full w-full animate-pulse bg-white/[0.05]" />
            ) : (
              <NftImage src={collection?.image} alt={collection?.name ?? "Collection"} sizes="112px" iconClassName="h-9 w-9" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-neutral-400">
              Collection
            </span>
            <h1 className="mt-3 truncate text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">
              {collection?.name ?? (loading ? "Loading…" : symbol)}
            </h1>
            {collection?.description && (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
                {collection.description}
              </p>
            )}
          </div>
        </header>

        {error && !loading && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {collection && (
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Floor" value={collection.floorPrice != null ? `${collection.floorPrice} ◎` : "—"} />
            <Stat label="Listed" value={collection.listedCount != null ? compact(collection.listedCount) : "—"} />
            <Stat label="Volume (all)" value={collection.volumeAll != null ? `${compact(Math.round(collection.volumeAll))} ◎` : "—"} />
            <a
              href={`https://magiceden.io/marketplace/${collection.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Trade</p>
              <p className="mt-1 text-lg font-bold text-sky-300">Magic Eden ↗</p>
            </a>
          </div>
        )}

        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Listed now {listings.length > 0 && <span className="text-neutral-600">· cheapest first</span>}
        </h2>

        {loading && <NFTCollectionSkeleton />}

        {!loading && !error && listings.length === 0 && (
          <p className="mt-10 text-center text-sm text-neutral-400">No active listings right now.</p>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listings.map((l) => (
              <Link key={l.mint} href={`/nfts/${l.mint}`} className="group relative block">
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 opacity-0 blur transition duration-500 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-500 group-hover:-translate-y-1.5 group-hover:border-white/20">
                  <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                    <NftImage src={l.image} alt={l.name} sizes="(max-width:640px) 50vw, 20vw" imgClassName="group-hover:scale-110" />
                    {l.rarityRank != null && (
                      <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-neutral-200 backdrop-blur">
                        #{l.rarityRank}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <h3 className="truncate text-sm font-medium text-neutral-100" title={l.name}>
                      {l.name}
                    </h3>
                    {l.price != null && (
                      <span className="shrink-0 text-sm font-semibold text-neutral-100">{l.price} ◎</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCollectionPage;
