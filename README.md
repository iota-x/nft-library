# NFT Gallery

A Solana NFT explorer built on [Next.js](https://nextjs.org/) and the
[Helius DAS API](https://docs.helius.dev/). Connect a wallet (Phantom, Backpack)
or paste any address to browse, analyse and dig into the on-chain history of NFTs.

**Live:** https://nft-gallery-j2bz.vercel.app/

## Features

- **Your collection** — every NFT owned by a wallet, paginated server-side so
  large wallets aren't truncated.
- **Portfolio analytics** — totals, distinct collections, standard vs. compressed
  breakdown, and a ranked "top collections" bar chart.
- **Search, filter, sort & group** — find NFTs by name, filter by collection,
  sort alphabetically, or group the grid by collection. All client-side, so it
  costs no extra RPC quota.
- **NFT detail** — full metadata: attributes, royalties, owner, token standard,
  mutability and compression status.
- **On-chain provenance** — a per-NFT activity timeline (sales, listings, bids,
  transfers, mints) parsed from the Helius Enhanced Transactions API, each row
  linking to Solscan.
- **Collection explorer** — click any collection to browse its items, with the
  collection's own artwork, description and website.

## API routes

| Route | Helius method | Purpose |
| --- | --- | --- |
| `GET /api/nfts?address=` | `getAssetsByOwner` | NFTs owned by a wallet |
| `GET /api/nfts/[id]` | `getAsset` | Full detail for one NFT |
| `GET /api/nfts/[id]/activity` | Enhanced Transactions | On-chain activity feed |
| `GET /api/collections/[address]` | `getAssetsByGroup` | Items in a collection |

Shared request plumbing and error/quota handling live in `src/lib/helius.ts`;
DAS-asset → view-model mapping lives in `src/lib/nft.ts`.

## Getting started

1. Copy the env template and add a Helius RPC key (free at
   [dashboard.helius.dev](https://dashboard.helius.dev)):

   ```bash
   cp .env.example .env.local
   # then set HELIUS_API_KEY in .env.local
   ```

2. Install and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

`HELIUS_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix) so the key is never
shipped to the browser; all Helius calls go through the API routes above.

## Deploy

Deploy on [Vercel](https://vercel.com/new); set `HELIUS_API_KEY` in the project's
environment variables.
