import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#05060a]/60">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row sm:px-8">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500">
          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
          </svg>
        </span>
        <span className="text-sm font-semibold text-neutral-300">NFT Library</span>
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-400">
        <Link href="/explore" className="transition hover:text-white">Explore</Link>
        <Link href="/nfts" className="transition hover:text-white">My NFTs</Link>
        <Link href="/collections" className="transition hover:text-white">Collections</Link>
        <Link href="/viewNFT" className="transition hover:text-white">Lookup</Link>
      </nav>

      <p className="text-xs text-neutral-600">
        Built on Solana · Data by Helius &amp; Magic Eden
      </p>
    </div>
  </footer>
);

export default Footer;
