import { NextRequest, NextResponse } from 'next/server';
import { heliusRpc } from '@/lib/helius';
import { assetImage, DasAsset, mapAssetToSummary, NFTSummary } from '@/lib/nft';

interface AssetPage {
  total: number;
  items: DasAsset[];
}

export interface CollectionInfo {
  address: string;
  name: string;
  description: string;
  image: string;
  externalUrl: string;
  /** Number of items returned on this page (Helius omits a reliable grand total). */
  total: number;
}

/**
 * Fetches the collection's own on-chain metadata (the collection NFT is itself
 * an asset addressed by the collection address). Best-effort: if it isn't a
 * resolvable asset we fall back to a placeholder so the page still renders.
 */
async function fetchCollectionInfo(address: string, fallbackName: string): Promise<CollectionInfo> {
  try {
    const asset = await heliusRpc<DasAsset & { content?: { links?: { external_url?: string } } }>(
      'getAsset',
      { id: address },
    );
    const meta = asset.content?.metadata ?? {};
    return {
      address,
      name: meta.name || fallbackName,
      description: meta.description || '',
      image: assetImage(asset),
      externalUrl: asset.content?.links?.external_url || '',
      total: 0,
    };
  } catch {
    return { address, name: fallbackName, description: '', image: '', externalUrl: '', total: 0 };
  }
}

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  const address = segments[segments.length - 1];
  const page = Number(req.nextUrl.searchParams.get('page') ?? '1') || 1;
  const LIMIT = 60;

  if (!address) {
    return NextResponse.json(
      { success: false, message: 'Collection address is required' },
      { status: 400 },
    );
  }

  try {
    const assetPage = await heliusRpc<AssetPage>('getAssetsByGroup', {
      groupKey: 'collection',
      groupValue: address,
      page,
      limit: LIMIT,
      displayOptions: { showCollectionMetadata: true },
    });

    const nfts: NFTSummary[] = (assetPage.items ?? []).map(mapAssetToSummary);

    // Label the collection from the assets' embedded metadata when available, so
    // we can skip the extra getAsset call for well-tagged collections.
    const fallbackName = nfts[0]?.collection?.name || 'Collection';
    const info = await fetchCollectionInfo(address, fallbackName);
    info.total = assetPage.total ?? nfts.length;
    if (!info.image) info.image = nfts[0]?.collection?.image || '';

    return NextResponse.json({
      success: true,
      message: 'Collection fetched',
      collection: info,
      nfts,
      page,
      hasMore: nfts.length === LIMIT,
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching collection:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
