"use client";
import { useEffect, useState, useCallback } from 'react';

interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheKey = (address: string) => `nfts_${address}`;

interface CacheEntry {
  data: NFT[];
  ts: number;
}

const readCache = (address: string): CacheEntry | null => {
  try {
    const raw = localStorage.getItem(cacheKey(address));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Legacy entries were a bare array with no timestamp — treat them as stale.
    if (Array.isArray(parsed)) return { data: parsed, ts: 0 };
    if (parsed && Array.isArray(parsed.data)) return parsed as CacheEntry;
    return null;
  } catch {
    return null;
  }
};

const useFetchNFTs = (address: string) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // `showSpinner` is false for background revalidation so cached results stay
  // visible without a loading flash.
  const fetchNFTs = useCallback(
    async (showSpinner = true) => {
      if (!address) return;

      if (showSpinner) setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/nfts?address=${address}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch NFTs');
        }

        const list: NFT[] = data.nfts || [];
        setNFTs(list);

        try {
          localStorage.setItem(cacheKey(address), JSON.stringify({ data: list, ts: Date.now() }));
        } catch {
          /* storage full or unavailable — non-fatal */
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching NFTs');
      } finally {
        setLoading(false);
      }
    },
    [address]
  );

  useEffect(() => {
    if (!address) {
      setNFTs([]);
      return;
    }

    const cached = readCache(address);
    if (cached) {
      // Show cached results immediately, then revalidate in the background if stale.
      setNFTs(cached.data);
      if (Date.now() - cached.ts >= CACHE_TTL) {
        fetchNFTs(false);
      }
    } else {
      fetchNFTs(true);
    }
  }, [address, fetchNFTs]);

  const refetch = useCallback(() => fetchNFTs(true), [fetchNFTs]);

  return { nfts, loading, error, refetch };
};

export default useFetchNFTs;
