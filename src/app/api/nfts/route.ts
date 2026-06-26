import { NextRequest, NextResponse } from 'next/server';
import { heliusRpc } from '@/lib/helius';
import { DasAsset, mapAssetToSummary, NFTSummary } from '@/lib/nft';

interface AssetPage {
  total: number;
  items: DasAsset[];
}

/**
 * Pulls every NFT owned by `address`. Helius caps a page at 1000 assets, so we
 * follow pages until a short page comes back — a wallet with thousands of NFTs
 * would otherwise be silently truncated. Capped at MAX_PAGES so a giant wallet
 * can't hang the request.
 */
async function fetchAllOwnedNFTs(address: string): Promise<NFTSummary[]> {
  const LIMIT = 1000;
  const MAX_PAGES = 10;
  const all: NFTSummary[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await heliusRpc<AssetPage>('getAssetsByOwner', {
      ownerAddress: address,
      page,
      limit: LIMIT,
      displayOptions: { showFungible: false, showCollectionMetadata: true },
    });

    all.push(...(data.items ?? []).map(mapAssetToSummary));

    if (!data.items || data.items.length < LIMIT) break;
  }

  return all;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');

  if (!address || address.trim() === '' || address === 'null') {
    return NextResponse.json(
      { success: false, message: 'Wallet address is required and must be a valid string' },
      { status: 400 },
    );
  }

  try {
    const nfts = await fetchAllOwnedNFTs(address.trim());
    return NextResponse.json({ success: true, message: 'NFTs fetched successfully', nfts });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching NFTs:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
