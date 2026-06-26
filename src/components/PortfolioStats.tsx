"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { nftImageLoader } from "@/utils/imageLoader";

interface NFTLike {
  collection: { name: string; address: string; image?: string } | null;
  compressed: boolean;
}

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
    <p className="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">{value}</p>
    <p className="mt-1 text-xs font-medium uppercase tracking-widest text-neutral-500">{label}</p>
  </div>
);

const PortfolioStats: React.FC<{ nfts: NFTLike[] }> = ({ nfts }) => {
  const stats = useMemo(() => {
    const byCollection = new Map<
      string,
      { name: string; address: string; image?: string; count: number }
    >();
    let compressed = 0;

    for (const nft of nfts) {
      if (nft.compressed) compressed++;
      if (nft.collection) {
        const key = nft.collection.address;
        const existing = byCollection.get(key);
        if (existing) existing.count++;
        else byCollection.set(key, { ...nft.collection, count: 1 });
      }
    }

    const top = Array.from(byCollection.values()).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      total: nfts.length,
      collections: byCollection.size,
      compressed,
      standard: nfts.length - compressed,
      top,
    };
  }, [nfts]);

  if (stats.total === 0) return null;

  return (
    <section className="mb-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total NFTs" value={stats.total} />
        <Stat label="Collections" value={stats.collections} />
        <Stat label="Standard" value={stats.standard} />
        <Stat label="Compressed" value={stats.compressed} />
      </div>

      {stats.top.length > 0 && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Top collections
          </h3>
          <ul className="space-y-3">
            {stats.top.map((c) => {
              const pct = Math.round((c.count / stats.total) * 100);
              return (
                <li key={c.address}>
                  <Link
                    href={`/collections/${c.address}`}
                    className="group flex items-center gap-3"
                  >
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                      {c.image ? (
                        <Image
                          loader={nftImageLoader}
                          src={c.image}
                          alt={c.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium text-neutral-200 transition group-hover:text-white">
                          {c.name}
                        </span>
                        <span className="shrink-0 text-xs text-neutral-500">
                          {c.count} · {pct}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};

export default PortfolioStats;
