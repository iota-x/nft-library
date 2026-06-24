"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import NFTDetails, { NFT } from "@/components/NFTDetails";

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const NFTDetailPage = () => {
  const { id } = useParams();

  const [nft, setNFT] = useState<NFT | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFT = useCallback(
    async (nftId: string) => {
      try {
        const response = await fetch(`/api/nfts/${nftId}`);
        const data = await response.json();

        if (data.success) {
          setNFT(data.nft);
        } else {
          setError(data.message || "Failed to fetch NFT data.");
        }
      } catch (err) {
        console.error("Error fetching NFT:", err);
        setError("An error occurred while fetching the NFT.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedFetchNFT = useMemo(() => debounce(fetchNFT, 300), [fetchNFT]);

  const throttledFetchNFT = useMemo(() => throttle(fetchNFT, 1000), [fetchNFT]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      throttledFetchNFT(id);
    } else {
      setError("No NFT ID provided.");
      setLoading(false);
    }
  }, [id, debouncedFetchNFT, throttledFetchNFT]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !nft) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="mt-5 max-w-md text-sm text-neutral-400">{error || "No NFT found."}</p>
        <Link
          href="/nfts"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-white/[0.07]"
        >
          Back to collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-32 sm:px-8">
        <Link
          href="/nfts"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to collection
        </Link>
        <NFTDetails nft={nft} />
      </div>
    </div>
  );
};

export default NFTDetailPage;
