"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NftImage from "@/components/NftImage";

interface TrendingCollection {
  symbol: string;
  name: string;
  image: string;
  floorPrice: number | null;
}

const TrendingPreview = () => {
  const [collections, setCollections] = useState<TrendingCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/explore?range=1d")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success) setCollections((data.collections as TrendingCollection[]).slice(0, 8));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && collections.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">Trending now</h2>
          <p className="mt-1 text-sm text-neutral-400">Hottest Solana collections in the last 24 hours.</p>
        </div>
        <Link href="/explore" className="shrink-0 text-sm font-medium text-sky-300 transition hover:text-sky-200">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {(loading ? Array.from<TrendingCollection | null>({ length: 8 }).fill(null) : collections).map((c, i) =>
          c ? (
            <Link key={c.symbol} href={`/explore/${c.symbol}`} className="group relative block">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 opacity-0 blur transition duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-500 group-hover:-translate-y-1 group-hover:border-white/20">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <NftImage src={c.image} alt={c.name} sizes="(max-width:640px) 50vw, 25vw" imgClassName="group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <h3 className="truncate text-sm font-semibold text-neutral-100" title={c.name}>
                    {c.name}
                  </h3>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {c.floorPrice != null ? `${c.floorPrice} ◎` : "—"}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ),
        )}
      </div>
    </section>
  );
};

export default TrendingPreview;
