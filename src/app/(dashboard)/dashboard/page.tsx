import React from 'react';
import Link from 'next/link';
import WalletButton from '@/components/WalletButton';

const ActionCard: React.FC<{
  href: string;
  title: string;
  body: string;
  cta: string;
  tone: string;
  ctaTone: string;
  icon: string;
}> = ({ href, title, body, cta, tone, ctaTone, icon }) => (
  <Link href={href} className="group">
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10 ${tone}`}>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-400">{body}</p>
      <span className={`mt-6 inline-flex items-center text-sm font-medium transition group-hover:translate-x-1 ${ctaTone}`}>
        {cta}
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 8.75L14.25 12l-3.5 3.25" />
        </svg>
      </span>
    </div>
  </Link>
);

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
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            href="/explore"
            title="Explore trending"
            body="Discover the hottest Solana collections right now."
            cta="Explore"
            tone="from-sky-500/20 to-indigo-500/20 text-sky-300"
            ctaTone="text-sky-300"
            icon="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
          <ActionCard
            href="/nfts"
            title="My NFTs"
            body="Browse every NFT in your connected wallet."
            cta="Open"
            tone="from-emerald-500/20 to-teal-500/20 text-emerald-300"
            ctaTone="text-emerald-300"
            icon="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z"
          />
          <ActionCard
            href="/collections"
            title="Collections"
            body="See the collections you hold, rolled up."
            cta="Open"
            tone="from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300"
            ctaTone="text-fuchsia-300"
            icon="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
          <ActionCard
            href="/viewNFT"
            title="Lookup"
            body="Find any NFT on Solana by its mint ID."
            cta="Search"
            tone="from-amber-500/20 to-orange-500/20 text-amber-300"
            ctaTone="text-amber-300"
            icon="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </section>
      </div>
    </div>
  );
}
