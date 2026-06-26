"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { nftImageLoader } from "@/utils/imageLoader";

interface NftImageProps {
  src?: string;
  alt: string;
  /** Responsive sizes hint for next/image. */
  sizes?: string;
  /** Extra classes for the <Image> itself (e.g. hover transforms). */
  imgClassName?: string;
  /** Size of the placeholder icon shown when there's no image / it fails. */
  iconClassName?: string;
}

/**
 * Fill-mode NFT artwork with a graceful fallback. NFT images live on flaky,
 * arbitrary hosts (IPFS gateways, dead CDNs), so a URL existing is no guarantee
 * it loads — when it 404s, times out or is blocked we swap in a placeholder
 * instead of letting the browser render a broken-image icon.
 *
 * The parent must be a `relative`, sized container (this fills it).
 */
const NftImage: React.FC<NftImageProps> = ({ src, alt, sizes, imgClassName, iconClassName }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black/40 text-neutral-600">
        <svg
          className={cn("h-10 w-10", iconClassName)}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.04] to-white/[0.08]" />
      )}
      <Image
        loader={nftImageLoader}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={cn(
          "object-cover transition-all duration-700 ease-out",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
          imgClassName,
        )}
      />
    </>
  );
};

export default NftImage;
