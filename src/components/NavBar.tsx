"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { ClientWalletButton } from "@/components/ClientWalletButton";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/nfts", label: "My NFTs" },
  { href: "/collections", label: "Collections" },
  { href: "/viewNFT", label: "Lookup" },
];

const Logo = () => (
  <Link href="/" className="group flex items-center gap-2.5">
    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 4.5v15a1.5 1.5 0 001.5 1.5z" />
      </svg>
    </span>
    <span className="text-[15px] font-bold tracking-tight text-neutral-100 transition group-hover:text-white">
      NFT<span className="text-neutral-500 group-hover:text-neutral-400"> Library</span>
    </span>
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || mobileOpen
          ? "border-b border-white/10 bg-[#05060a]/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition",
                isActive(link.href)
                  ? "bg-white/[0.06] text-white"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="nav-wallet hidden sm:block">
            <ClientWalletButton />
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 transition hover:bg-white/[0.07] md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#05060a]/95 px-6 pb-6 pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive(link.href)
                    ? "bg-white/[0.06] text-white"
                    : "text-neutral-300 hover:bg-white/[0.04]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="nav-wallet mt-4">
            <ClientWalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
