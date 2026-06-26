/**
 * Server-only Helius helpers.
 *
 * Both the DAS JSON-RPC endpoint and the Enhanced Transactions REST API share
 * the same API key and the same "quota errors arrive inside a 200 OK body"
 * quirk, so the request plumbing and error normalisation live here instead of
 * being copy-pasted across every route.
 */

const RPC_BASE = 'https://mainnet.helius-rpc.com';
const ENHANCED_BASE = 'https://api.helius.xyz/v0';

function apiKey(): string {
  const key = process.env.HELIUS_API_KEY;
  if (!key) {
    throw new Error('Helius API key is not configured. Set HELIUS_API_KEY.');
  }
  return key;
}

/** Raised when Helius reports its usage/quota limit has been hit. */
export class HeliusQuotaError extends Error {
  constructor(message = 'Helius API quota exceeded. The RPC key has hit its usage limit.') {
    super(message);
    this.name = 'HeliusQuotaError';
  }
}

function isQuotaError(err: { code?: number; message?: string }): boolean {
  return err.code === -32429 || /max usage|rate limit|quota/i.test(err.message ?? '');
}

interface RpcResponse<T> {
  result?: T;
  error?: { code: number; message: string };
}

/**
 * Calls a Helius DAS JSON-RPC method and returns its `result`, translating the
 * various failure modes (HTTP errors, JSON-RPC errors, quota limits) into
 * thrown Errors so callers only deal with the happy path.
 */
export async function heliusRpc<T>(method: string, params: unknown): Promise<T> {
  const res = await fetch(`${RPC_BASE}/?api-key=${apiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'nft-gallery', method, params }),
  });

  if (!res.ok) {
    throw new Error(`Helius ${method} failed: ${await res.text()}`);
  }

  const data = (await res.json()) as RpcResponse<T>;

  if (data.error) {
    if (isQuotaError(data.error)) throw new HeliusQuotaError();
    throw new Error(`Helius ${method} error: ${data.error.message}`);
  }

  if (data.result === undefined) {
    throw new Error(`Helius ${method} returned no result`);
  }

  return data.result;
}

/**
 * Calls the Helius Enhanced Transactions REST API for a given address. Unlike
 * the DAS RPC it returns a bare array on success and a `{ error }` object on
 * failure, so we normalise both here.
 */
export async function heliusEnhancedTransactions<T = unknown>(
  address: string,
  params: Record<string, string | number> = {},
): Promise<T[]> {
  const query = new URLSearchParams({ 'api-key': apiKey() });
  for (const [k, v] of Object.entries(params)) query.set(k, String(v));

  const res = await fetch(`${ENHANCED_BASE}/addresses/${address}/transactions?${query}`);

  if (!res.ok) {
    throw new Error(`Helius transactions failed: ${await res.text()}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    if (data && typeof data === 'object' && isQuotaError(data)) throw new HeliusQuotaError();
    throw new Error(`Helius transactions error: ${JSON.stringify(data).slice(0, 200)}`);
  }

  return data as T[];
}
