import Link from "next/link";
import Image from "next/image";

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#05060a]/60">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row sm:px-8">
      <div className="flex items-center gap-2.5">
        <Image src="/logo.png" alt="NFT Library" width={28} height={28} className="h-7 w-7 rounded-lg" />
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
