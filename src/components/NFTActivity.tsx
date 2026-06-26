"use client";

import { useEffect, useState } from "react";

interface ActivityEvent {
  signature: string;
  type: string;
  source: string;
  timestamp: number;
  description: string;
  amount: number | null;
  buyer: string | null;
  seller: string | null;
}

/* Map raw Helius event types to a human label + colour tone. */
const TYPE_META: Record<string, { label: string; tone: string }> = {
  NFT_SALE: { label: "Sale", tone: "text-emerald-300" },
  NFT_LISTING: { label: "Listed", tone: "text-sky-300" },
  NFT_CANCEL_LISTING: { label: "Listing cancelled", tone: "text-neutral-400" },
  NFT_BID: { label: "Bid", tone: "text-indigo-300" },
  NFT_BID_CANCELLED: { label: "Bid cancelled", tone: "text-neutral-400" },
  NFT_MINT: { label: "Minted", tone: "text-fuchsia-300" },
  TRANSFER: { label: "Transfer", tone: "text-amber-300" },
  COMPRESSED_NFT_MINT: { label: "Minted (compressed)", tone: "text-fuchsia-300" },
  COMPRESSED_NFT_TRANSFER: { label: "Transfer (compressed)", tone: "text-amber-300" },
};

const meta = (type: string) =>
  TYPE_META[type] ?? { label: type.replace(/_/g, " ").toLowerCase(), tone: "text-neutral-300" };

const shorten = (v: string) => (v && v.length > 13 ? `${v.slice(0, 6)}…${v.slice(-4)}` : v);

const timeAgo = (ts: number) => {
  const s = Math.max(0, Math.floor(Date.now() / 1000 - ts));
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) {
    if (s >= secs) return `${Math.floor(s / secs)}${label} ago`;
  }
  return "just now";
};

const NFTActivity: React.FC<{ id: string }> = ({ id }) => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/nfts/${id}/activity`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) setEvents(data.events as ActivityEvent[]);
        else setError(data.message || "Failed to load activity");
      })
      .catch(() => !cancelled && setError("Failed to load activity"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <section className="mt-8">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
        On-chain activity
      </h3>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        {loading && (
          <div className="space-y-2 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="px-4 py-6 text-center text-sm text-neutral-500">{error}</p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-neutral-500">
            No recorded on-chain activity for this asset yet.
          </p>
        )}

        {!loading && !error && events.length > 0 && (
          <ul className="divide-y divide-white/5">
            {events.map((e) => {
              const m = meta(e.type);
              return (
                <li key={e.signature} className="flex items-center gap-3 px-3 py-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full bg-current ${m.tone}`} />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className={`text-sm font-semibold ${m.tone}`}>{m.label}</span>
                      <span className="text-xs text-neutral-500">on {e.source.toLowerCase()}</span>
                    </p>
                    {(e.seller || e.buyer) && (
                      <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">
                        {e.seller && <>from {shorten(e.seller)} </>}
                        {e.buyer && <>to {shorten(e.buyer)}</>}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {e.amount != null && (
                      <p className="text-sm font-semibold text-neutral-100">{e.amount} SOL</p>
                    )}
                    <a
                      href={`https://solscan.io/tx/${e.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 transition hover:text-sky-300"
                    >
                      {timeAgo(e.timestamp)} ↗
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default NFTActivity;
