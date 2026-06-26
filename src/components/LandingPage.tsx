import Link from "next/link";
import TrendingPreview from "@/components/TrendingPreview";

const FEATURES = [
  {
    title: "Explore trending",
    body: "Discover the hottest Solana collections ranked by live Magic Eden activity, with floor prices and volume.",
    tone: "from-sky-500/20 to-indigo-500/20 text-sky-300",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "Your portfolio",
    body: "Connect a wallet to see every NFT you own, grouped by collection with a full breakdown and analytics.",
    tone: "from-emerald-500/20 to-teal-500/20 text-emerald-300",
    icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z",
  },
  {
    title: "On-chain provenance",
    body: "Trace any NFT's full history — mints, transfers, sales and bids — pulled straight from the Solana chain.",
    tone: "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Live market data",
    body: "Floor prices, listing status and all-time volume on every asset, so you always know what it's worth.",
    tone: "from-amber-500/20 to-orange-500/20 text-amber-300",
    icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  },
];

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-6 text-center sm:px-8">
        <Link
          href="/explore"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Powered by Helius &amp; Magic Eden
          <span className="text-neutral-500 transition group-hover:translate-x-0.5">→</span>
        </Link>

        <h1 className="mt-7 bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent sm:text-7xl">
          Explore the Solana
          <br />
          NFT universe
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          Browse trending collections, dive into any asset&apos;s on-chain history, and track your
          own portfolio — all in one sleek place.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/explore"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-sky-400 hover:to-indigo-400"
          >
            Explore collections
            <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.75 8.75L14.25 12l-3.5 3.25" />
            </svg>
          </Link>
          <Link
            href="/nfts"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 text-sm font-semibold text-neutral-200 backdrop-blur transition hover:border-white/25 hover:bg-white/[0.07]"
          >
            View my NFTs
          </Link>
        </div>
      </section>

      {/* Live trending */}
      <TrendingPreview />

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-28 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10 ${f.tone}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-neutral-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
