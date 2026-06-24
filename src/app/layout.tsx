// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/NavBar';
import AppBackground from '@/components/AppBackground';
import Providers from '@/app/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The NFT Library — Solana NFT Gallery',
  description:
    'Browse, search, and explore Solana NFTs. Connect a wallet to view your collection or look up any asset by its mint ID.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
      <AppBackground />
      <Navbar />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
