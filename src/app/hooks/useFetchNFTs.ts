"use client";
import { useEffect, useState, useCallback } from 'react';

interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

const useFetchNFTs = (address: string) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nfts?address=${address}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch NFTs');
      }

      setNFTs(data.nfts || []);

      localStorage.setItem(`nfts_${address}`, JSON.stringify(data.nfts || []));
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching NFTs');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    const cachedNFTs = localStorage.getItem(`nfts_${address}`);
    if (cachedNFTs) {
      setNFTs(JSON.parse(cachedNFTs));
    } else {
      fetchNFTs();
    }
  }, [address, fetchNFTs]);

  return { nfts, loading, error, refetch: fetchNFTs };
};

export default useFetchNFTs;
