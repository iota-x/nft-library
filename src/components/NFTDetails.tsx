"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { nftImageLoader } from "@/utils/imageLoader";

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

const shorten = (value: string, lead = 6, tail = 6) =>
  value && value.length > lead + tail + 3
    ? `${value.slice(0, lead)}…${value.slice(-tail)}`
    : value;

/* ---------------------------------- UI bits --------------------------------- */

const Badge: React.FC<{ children: React.ReactNode; tone?: "neutral" | "emerald" | "amber" | "sky" }> = ({
  children,
  tone = "neutral",
}) => {
  const tones = {
    neutral: "border-white/10 bg-white/5 text-neutral-300",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    sky: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

const Copyable: React.FC<{ value: string; mono?: boolean }> = ({ value, mono }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };
  return (
    <button
      onClick={copy}
      title={value}
      className={`group/copy inline-flex items-center gap-1.5 text-neutral-200 transition hover:text-white ${
        mono ? "font-mono" : ""
      }`}
    >
      <span className="break-all text-left">{mono ? shorten(value) : value}</span>
      <svg
        className="h-3.5 w-3.5 shrink-0 text-neutral-500 transition group-hover/copy:text-sky-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
          />
        )}
      </svg>
    </button>
  );
};

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1 border-b border-white/5 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
    <dt className="text-xs font-medium uppercase tracking-widest text-neutral-500">{label}</dt>
    <dd className="text-sm text-neutral-200 sm:max-w-[60%] sm:text-right">{children}</dd>
  </div>
);

/* ------------------------------- main component ----------------------------- */

const NFTDetails: React.FC<{ nft: NFT }> = ({ nft }) => {
  return (
    <motion.div
      className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          {nft.imageUrl ? (
            <Image
              loader={nftImageLoader}
              src={nft.imageUrl}
              alt={nft.title}
              width={500}
              height={500}
              className="h-auto w-full rounded-xl object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-black/40 text-neutral-600">
              No image
            </div>
          )}
        </div>
        {nft.externalUrl && (
          <a
            href={nft.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-neutral-200 transition hover:bg-white/[0.07]"
          >
            View external link
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>

      {/* Details */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {nft.symbol && <Badge tone="sky">{nft.symbol}</Badge>}
          {nft.tokenStandard && <Badge>{nft.tokenStandard}</Badge>}
          {nft.compression.compressed && <Badge tone="amber">Compressed</Badge>}
          {nft.burnt && <Badge tone="amber">Burnt</Badge>}
          <Badge tone={nft.mutable ? "emerald" : "neutral"}>{nft.mutable ? "Mutable" : "Immutable"}</Badge>
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">{nft.title}</h2>
        {nft.description && <p className="mt-3 text-sm leading-relaxed text-neutral-400">{nft.description}</p>}

        {/* Attributes */}
        {nft.attributes.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Attributes</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {nft.attributes.map((attr, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition hover:border-white/20"
                >
                  <p className="truncate text-[11px] uppercase tracking-wider text-sky-300/80" title={attr.trait_type}>
                    {attr.trait_type}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-neutral-100" title={String(attr.value)}>
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2">
          <dl>
            <InfoRow label="Owner">
              <Copyable value={nft.owner} mono />
            </InfoRow>
            <InfoRow label="Collection">{nft.collection.name || "—"}</InfoRow>
            {nft.collection.address && (
              <InfoRow label="Collection address">
                <Copyable value={nft.collection.address} mono />
              </InfoRow>
            )}
            <InfoRow label="Royalty">
              {nft.royalty.percent}% <span className="text-neutral-500">· {nft.royalty.model}</span>
            </InfoRow>
            <InfoRow label="Royalty status">
              <span className="inline-flex flex-wrap justify-end gap-2">
                <Badge tone={nft.royalty.primarySaleHappened ? "emerald" : "neutral"}>
                  {nft.royalty.primarySaleHappened ? "Primary sale done" : "No primary sale"}
                </Badge>
                <Badge tone={nft.royalty.locked ? "amber" : "neutral"}>
                  {nft.royalty.locked ? "Locked" : "Unlocked"}
                </Badge>
              </span>
            </InfoRow>
            <InfoRow label="Token standard">{nft.tokenStandard || "—"}</InfoRow>
            <InfoRow label="Compression eligible">{nft.compression.eligible ? "Yes" : "No"}</InfoRow>
          </dl>
        </section>
      </div>
    </motion.div>
  );
};

export default NFTDetails;
