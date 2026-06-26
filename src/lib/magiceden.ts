/**
 * Server-only Magic Eden helpers.
 *
 * Magic Eden's public API is keyed by its own collection "symbol" (e.g.
 * `mad_lads`), not by the on-chain collection address, so floor data is looked
 * up via a token mint: mint -> collection symbol -> collection stats.
 *
 * The public API is unauthenticated but rate-limited; an optional
 * MAGIC_EDEN_API_KEY is sent as a bearer token when present to raise limits.
 */

const BASE = 'https://api-mainnet.magiceden.dev/v2';
const LAMPORTS_PER_SOL = 1_000_000_000;

function headers(): HeadersInit {
  const h: Record<string, string> = { accept: 'application/json' };
  const key = process.env.MAGIC_EDEN_API_KEY;
  if (key) h.Authorization = `Bearer ${key}`;
  return h;
}

async function meGet<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(),
    // Floor prices move slowly; cache briefly to soften ME's rate limits.
    next: { revalidate: 60 },
  });
  // ME returns 404 for tokens/collections it doesn't index — not an error for us.
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Magic Eden ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

interface MeToken {
  collection?: string;
  collectionName?: string;
  listStatus?: string;
  price?: number | null;
}

interface MeStats {
  floorPrice?: number;
  listedCount?: number;
  volumeAll?: number;
}

export interface MarketData {
  /** Magic Eden collection symbol, if the asset is indexed there. */
  symbol: string;
  collectionName: string | null;
  /** Whether this specific NFT is currently listed on Magic Eden. */
  listed: boolean;
  /** This NFT's list price in SOL, when listed. */
  listPrice: number | null;
  /** Collection floor price in SOL. */
  floorPrice: number | null;
  listedCount: number | null;
  /** All-time collection volume in SOL. */
  volumeAll: number | null;
  url: string;
}

const toSol = (lamports: number | undefined | null): number | null =>
  typeof lamports === 'number' ? Math.round((lamports / LAMPORTS_PER_SOL) * 1000) / 1000 : null;

/** Resolves Magic Eden market data for a single NFT mint, or null if not indexed. */
export async function getMarketData(mint: string): Promise<MarketData | null> {
  const token = await meGet<MeToken>(`/tokens/${mint}`);
  if (!token?.collection) return null;

  const stats = await meGet<MeStats>(`/collections/${token.collection}/stats`);

  return {
    symbol: token.collection,
    collectionName: token.collectionName ?? null,
    listed: token.listStatus === 'listed',
    listPrice: typeof token.price === 'number' ? token.price : null,
    floorPrice: toSol(stats?.floorPrice),
    listedCount: stats?.listedCount ?? null,
    volumeAll: toSol(stats?.volumeAll),
    url: `https://magiceden.io/item-details/${mint}`,
  };
}
