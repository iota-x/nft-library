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

/* --------------------------------- Explore -------------------------------- */

export interface TrendingCollection {
  symbol: string;
  name: string;
  image: string;
  description: string;
  floorPrice: number | null;
  volumeAll: number | null;
}

interface MePopular {
  symbol?: string;
  name?: string;
  image?: string;
  description?: string;
  floorPrice?: number;
  volumeAll?: number;
}

/** Trending collections for a time range (Magic Eden's popularity ranking). */
export async function getPopularCollections(
  timeRange: '1h' | '1d' | '7d' | '30d' = '1d',
): Promise<TrendingCollection[]> {
  const data = await meGet<MePopular[]>(
    `/marketplace/popular_collections?timeRange=${timeRange}&limit=50`,
  );
  if (!Array.isArray(data)) return [];
  return data
    .filter((c) => c.symbol)
    .map((c) => ({
      symbol: c.symbol!,
      name: c.name || c.symbol!,
      image: c.image || '',
      description: c.description || '',
      floorPrice: toSol(c.floorPrice),
      volumeAll: toSol(c.volumeAll),
    }));
}

export interface CollectionListing {
  mint: string;
  price: number | null;
  name: string;
  image: string;
  rarityRank: number | null;
}

interface MeListing {
  tokenMint?: string;
  price?: number;
  rarity?: { moonrank?: { rank?: number }; howrare?: { rank?: number } };
  token?: { name?: string; image?: string };
}

interface MeCollectionStats {
  symbol?: string;
  floorPrice?: number;
  listedCount?: number;
  volumeAll?: number;
}

export interface CollectionMarket {
  symbol: string;
  name: string;
  description: string;
  image: string;
  floorPrice: number | null;
  listedCount: number | null;
  volumeAll: number | null;
}

interface MeCollection {
  symbol?: string;
  name?: string;
  description?: string;
  image?: string;
}

function settled<T>(r: PromiseSettledResult<T | null>): T | null {
  return r.status === 'fulfilled' ? r.value : null;
}

/**
 * Collection profile + stats for an Explore detail page, by ME symbol.
 * Tolerates a partial failure (e.g. one endpoint rate-limited) so the page
 * still renders with whatever data came back.
 */
export async function getCollectionMarket(symbol: string): Promise<CollectionMarket | null> {
  const [profileRes, statsRes] = await Promise.allSettled([
    meGet<MeCollection>(`/collections/${symbol}`),
    meGet<MeCollectionStats>(`/collections/${symbol}/stats`),
  ]);
  const profile = settled(profileRes);
  const stats = settled(statsRes);
  if (!profile && !stats) return null;
  return {
    symbol,
    name: profile?.name || symbol,
    description: profile?.description || '',
    image: profile?.image || '',
    floorPrice: toSol(stats?.floorPrice),
    listedCount: stats?.listedCount ?? null,
    volumeAll: toSol(stats?.volumeAll),
  };
}

/** Currently-listed items in a collection (cheapest first), by ME symbol. */
export async function getCollectionListings(
  symbol: string,
  limit = 40,
): Promise<CollectionListing[]> {
  const data = await meGet<MeListing[]>(
    `/collections/${symbol}/listings?offset=0&limit=${limit}`,
  );
  if (!Array.isArray(data)) return [];
  return data
    .filter((l) => l.tokenMint)
    .map((l) => ({
      mint: l.tokenMint!,
      price: typeof l.price === 'number' ? l.price : null,
      name: l.token?.name || 'Unnamed',
      image: l.token?.image || '',
      rarityRank: l.rarity?.moonrank?.rank ?? l.rarity?.howrare?.rank ?? null,
    }));
}

/* ------------------------------- Single asset ----------------------------- */

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
