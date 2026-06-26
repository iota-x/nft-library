"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import NftImage from "@/components/NftImage";

interface TrendingCollection {
  symbol: string;
  name: string;
  image: string;
  description: string;
  floorPrice: number | null;
  volumeAll: number | null;
}

const RANGES = [
  { key: "1h", label: "1H" },
  { key: "1d", label: "24H" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
] as const;

const compact = (n: number) =>
  n >= 1000 ? Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n) : String(n);

const ExplorePage = () => {
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("1d");
  const [collections, setCollections] = useState<TrendingCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (r: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/explore?range=${r}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load");
      setCollections(data.collections as TrendingCollection[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trending collections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-36 sm:px-8">
        <header className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
              Explore
            </span>
            <h1 className="mt-5 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              Trending Collections
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              The most active Solana collections right now, ranked by Magic Eden.
            </p>
          </div>

          {/* Time-range segmented control */}
          <div className="inline-flex shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  range === r.key ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </header>

        {error && !loading && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collections.map((c, i) => (
              <Link key={c.symbol} href={`/explore/${c.symbol}`} className="group relative block">
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 opacity-0 blur transition duration-500 group-hover:opacity-100" />
                <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition duration-500 group-hover:-translate-y-1 group-hover:border-white/20">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-neutral-400">
                    {i + 1}
                  </span>
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <NftImage src={c.image} alt={c.name} sizes="56px" imgClassName="group-hover:scale-110" iconClassName="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold tracking-tight text-neutral-100" title={c.name}>
                      {c.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-400">
                      <span>
                        Floor{" "}
                        <span className="font-semibold text-neutral-200">
                          {c.floorPrice != null ? `${c.floorPrice} ◎` : "—"}
                        </span>
                      </span>
                      {c.volumeAll != null && (
                        <span>
                          Vol <span className="font-semibold text-neutral-200">{compact(Math.round(c.volumeAll))} ◎</span>
                        </span>
                      )}
                    </div>
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

export default ExplorePage;
