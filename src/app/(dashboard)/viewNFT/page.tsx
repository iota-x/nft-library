"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import NFTDetails, { NFT } from "@/components/NFTDetails";

const SearchNFTPage = () => {
  const [nftId, setNftId] = useState<string>("");
  const [manualAddress, setManualAddress] = useState<string | null>(null);
  const [nft, setNFT] = useState<NFT | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    const idToSearch = nftId || manualAddress;

    if (!idToSearch) {
      setError("Please enter a valid NFT ID or wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/nfts/${idToSearch}`);
      const data = await response.json();

      if (data.success) {
        setNFT(data.nft);
        if (!manualAddress) setNftId("");
      } else {
        setNFT(null);
        setError(data.message || "Failed to fetch NFT data.");
      }
    } catch (err) {
      console.error("Error fetching NFT:", err);
      setNFT(null);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [nftId, manualAddress]);

  // Detect manual wallet on mount
  useEffect(() => {
    const storedManualAddress = localStorage.getItem("manualWalletAddress");
    if (storedManualAddress) {
      setManualAddress(storedManualAddress);
      setNftId(storedManualAddress);
    }
  }, []);

  // Trigger search when manual address is loaded
  useEffect(() => {
    if (manualAddress) {
      handleSearch();
    }
  }, [manualAddress, handleSearch]);

  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-36 sm:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Explorer
          </span>
          <h1 className="mt-6 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Browse NFTs
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
            Look up any NFT on Solana by its mint ID or a wallet address.
          </p>
        </header>

        {/* Search bar */}
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-black/40 focus-within:border-sky-500/40">
          <div className="flex flex-1 items-center gap-3 pl-3">
            <svg className="h-5 w-5 shrink-0 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={nftId}
              onChange={(e) => setNftId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter NFT mint ID or wallet address"
              className="w-full bg-transparent py-3 text-sm text-white placeholder:text-neutral-500 outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            className="mx-auto mt-10 max-w-2xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}

        {/* Empty / initial state */}
        {!loading && !error && !nft && (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>
            <p className="mt-5 text-sm text-neutral-500">
              {hasSearched ? "No NFT found. Try a different ID or address." : "Search for an NFT to see its details here."}
            </p>
          </div>
        )}

        {/* NFT detail */}
        {nft && !loading && (
          <div className="mt-14">
            <NFTDetails nft={nft} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchNFTPage;
