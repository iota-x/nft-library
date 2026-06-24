"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button, Input, Text } from "@chakra-ui/react";
import Image from 'next/image';

export interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  attributes: Array<{ trait_type: string; value: string }>;
  collection: {
    name: string;
    address: string;
  };
  royalty: {
    model: string;
    percent: number;
    primarySaleHappened: boolean;
    locked: boolean;
  };
  owner: string;
  mutable: boolean;
  burnt: boolean;
  externalUrl?: string;
  symbol: string;
  tokenStandard: string;
  compression: {
    eligible: boolean;
    compressed: boolean;
  };
}

// Custom loader for Next.js image optimization
const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const SearchNFTPage = () => {
  const [nftId, setNftId] = useState<string>('');
  const [manualAddress, setManualAddress] = useState<string | null>(null);
  const [nft, setNFT] = useState<NFT | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    const idToSearch = nftId || manualAddress;

    if (!idToSearch) {
      setError("Please enter a valid NFT ID or wallet address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nfts/${idToSearch}`);
      const data = await response.json();

      if (data.success) {
        setNFT(data.nft);
        if (!manualAddress) setNftId('');
      } else {
        setError(data.message || "Failed to fetch NFT data.");
      }
    } catch (err) {
      console.error("Error fetching NFT:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [nftId, manualAddress]);

  // Detect manual wallet on mount
  useEffect(() => {
    const storedManualAddress = localStorage.getItem('manualWalletAddress');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 pb-24 pt-36 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            Browse NFTs
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-400">
            Look up any NFT on Solana by its ID or a wallet address.
          </p>
        </header>

        {/* Search UI */}
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Enter NFT ID or wallet address"
            value={nftId}
            onChange={(e) => setNftId(e.target.value)}
            bg="blackAlpha.500"
            borderColor="whiteAlpha.200"
            color="white"
            _hover={{ borderColor: "whiteAlpha.300" }}
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
            _placeholder={{ color: "gray.500" }}
            size="lg"
            flex="1"
          />
          <Button
            onClick={handleSearch}
            colorScheme="blue"
            size="lg"
            variant="solid"
            px={8}
          >
            View NFT
          </Button>
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Error Message */}
        {error && (
          <motion.div
            className="mt-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize="lg" color="red.400" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
              {error}
            </Text>
          </motion.div>
        )}

        {/* NFT Display */}
        {nft && !loading && (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
          {/* Image */}
          <div className="flex justify-center md:justify-start">
            {nft.imageUrl && (
              <Image
                loader={customLoader}
                src={nft.imageUrl}
                alt={nft.title}
                width={500}
                height={500}
                className="rounded-lg shadow-lg object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div>
            <Card className="mb-4">
              <CardTitle>{nft.title}</CardTitle>
              <CardDescription>{nft.description}</CardDescription>

              {/* Attributes */}
              <CardTitle className="mt-6">Attributes</CardTitle>
              {nft.attributes.length > 0 ? (
                <ul className="list-disc list-inside pl-5">
                  {nft.attributes.map((attr, index) => (
                    <li key={index} className="text-zinc-100">
                      <span className="font-medium">{attr.trait_type}:</span> {attr.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <CardDescription>No attributes available.</CardDescription>
              )}

              {/* Collection */}
              <CardTitle className="mt-6">Collection</CardTitle>
              <CardDescription>
                <span className="font-medium text-zinc-100">Name:</span> {nft.collection.name}
                <br />
                <span className="font-medium text-zinc-100">Address:</span> {nft.collection.address}
              </CardDescription>

              {/* Royalty */}
              <CardTitle className="mt-6">Royalty Information</CardTitle>
              <CardDescription>
                <span className="font-medium text-zinc-100">Model:</span> {nft.royalty.model}
                <br />
                <span className="font-medium text-zinc-100">Percent:</span> {nft.royalty.percent}%
                <br />
                <span className="font-medium text-zinc-100">Primary Sale Happened:</span> {nft.royalty.primarySaleHappened ? "Yes" : "No"}
                <br />
                <span className="font-medium text-zinc-100">Locked:</span> {nft.royalty.locked ? "Yes" : "No"}
              </CardDescription>

              {/* Ownership */}
              <CardTitle className="mt-6">Ownership</CardTitle>
              <CardDescription>
                <span className="font-medium text-zinc-100">Owner Address:</span> {nft.owner}
                <br />
                <span className="font-medium text-zinc-100">Mutable:</span> {nft.mutable ? "Yes" : "No"}
                <br />
                <span className="font-medium text-zinc-100">Burnt:</span> {nft.burnt ? "Yes" : "No"}
              </CardDescription>

              {/* Extra */}
              <CardTitle className="mt-6">Additional Information</CardTitle>
              <CardDescription>
                <span className="font-medium text-zinc-100">Symbol:</span> {nft.symbol}
                <br />
                <span className="font-medium text-zinc-100">Token Standard:</span> {nft.tokenStandard}
                <br />
                <span className="font-medium text-zinc-100">Compression Eligible:</span> {nft.compression.eligible ? "Yes" : "No"}
                <br />
                <span className="font-medium text-zinc-100">Compressed:</span> {nft.compression.compressed ? "Yes" : "No"}
                {nft.externalUrl && (
                  <>
                    <br />
                    <span className="font-medium text-zinc-100">External URL:</span>{" "}
                    <a href={nft.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {nft.externalUrl}
                    </a>
                  </>
                )}
              </CardDescription>
            </Card>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchNFTPage;
