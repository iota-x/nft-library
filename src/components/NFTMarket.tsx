"use client";

import { useEffect, useState } from "react";

interface MarketData {
  symbol: string;
  collectionName: string | null;
  listed: boolean;
  listPrice: number | null;
  floorPrice: number | null;
  listedCount: number | null;
  volumeAll: number | null;
  url: string;
}

const fmt = (n: number) =>
  n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : String(n);

const Metric: React.FC<{ label: string; value: React.ReactNode; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{label}</p>
    <p className={`mt-1 text-lg font-bold ${accent ? "text-emerald-300" : "text-neutral-100"}`}>
      {value}
    </p>
  </div>
);

const NFTMarket: React.FC<{ id: string }> = ({ id }) => {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/nfts/${id}/market`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success) setMarket(data.market as MarketData | null);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="mt-8">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Market</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-xl bg-white/[0.04]" />
          ))}
        </div>
      </section>
    );
  }

  // Not indexed / not on Magic Eden — hide the section rather than show emptiness.
  if (!market || (market.floorPrice == null && !market.listed)) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Market</h3>
        <a
          href={market.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-sky-300 transition hover:text-sky-200"
        >
          Magic Eden ↗
        </a>
      </div>

      {market.listed && market.listPrice != null && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Listed for <span className="font-semibold">{market.listPrice} SOL</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {market.floorPrice != null && (
          <Metric label="Floor" value={`${market.floorPrice} SOL`} accent />
        )}
        {market.listedCount != null && <Metric label="Listed" value={fmt(market.listedCount)} />}
        {market.volumeAll != null && (
          <Metric label="Volume (all)" value={`${fmt(Math.round(market.volumeAll))} SOL`} />
        )}
      </div>
    </section>
  );
};

export default NFTMarket;
