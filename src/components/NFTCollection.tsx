"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NftImage from "@/components/NftImage";

export interface NFTCardItem {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
}

const NFTCard: React.FC<{ item: NFTCardItem; index: number }> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
    >
      <Link href={item.link} className="group relative block h-full">
        {/* Glow ring on hover */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 opacity-0 blur transition duration-500 group-hover:opacity-100" />

        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-500 group-hover:-translate-y-1.5 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-sky-500/10">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-black/40">
            <NftImage
              src={item.imageUrl}
              alt={item.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              imgClassName="group-hover:scale-110"
            />

            {/* Bottom gradient for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-80" />

            {/* Sheen sweep on hover */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

            {/* View pill */}
            <div className="absolute right-3 top-3 translate-y-1 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              View
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="truncate font-semibold tracking-tight text-neutral-100" title={item.title}>
              {item.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
              {item.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-300 opacity-0 transition-all duration-300 group-hover:opacity-100">
              View details
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 8.75L14.25 12l-3.5 3.25" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const NFTCollectionSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-white/[0.04] to-white/[0.08]" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-4 w-3/5 animate-pulse rounded bg-white/[0.07]" />
            <div className="h-3 w-full animate-pulse rounded bg-white/[0.05]" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
};

const NFTCollection: React.FC<{ items: NFTCardItem[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <NFTCard key={item.link} item={item} index={index} />
      ))}
    </div>
  );
};

export default NFTCollection;
