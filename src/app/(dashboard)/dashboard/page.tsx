import React from 'react';
import Link from 'next/link';
import WalletButton from '@/components/WalletButton';

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-36 sm:px-8">
        {/* Header */}
        <header className="mb-16 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Dashboard
          </span>
          <h1 className="mt-6 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Welcome to Your NFT Dashboard
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Connect a wallet to explore your collection, or browse any NFT on Solana.
          </p>
        </header>

        {/* Wallet */}
        <section className="mx-auto mb-16 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Wallet
          </h2>
          <WalletButton />
        </section>

        {/* Action cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/nfts" className="group">
            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 text-sky-300 ring-1 ring-white/10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">View owned NFTs</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Browse all your NFTs in one place.
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-sky-300 transition group-hover:translate-x-1">
                Open
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 8.75L14.25 12l-3.5 3.25" />
                </svg>
              </span>
            </div>
          </Link>

          <Link href="/viewNFT" className="group">
            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-300 ring-1 ring-white/10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-100">Browse all NFTs</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                View details of any NFT with a simple quick search.
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-emerald-300 transition group-hover:translate-x-1">
                Search
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 8.75L14.25 12l-3.5 3.25" />
                </svg>
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
