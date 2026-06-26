import { NextRequest, NextResponse } from 'next/server';
import { heliusRpc } from '@/lib/helius';
import { assetImage, DasAsset } from '@/lib/nft';

/** Full DAS asset slice the detail page renders. */
interface DasAssetFull extends DasAsset {
  content?: DasAsset['content'] & { links?: { image?: string; external_url?: string } };
  royalty?: {
    royalty_model?: string;
    percent?: number;
    primary_sale_happened?: boolean;
    locked?: boolean;
  };
  ownership?: { owner?: string };
  compression?: { compressed?: boolean; eligible?: boolean };
  mutable?: boolean;
  burnt?: boolean;
}

interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  attributes: Array<{ trait_type: string; value: string }>;
  collection: { name: string; address: string };
  royalty: { model: string; percent: number; primarySaleHappened: boolean; locked: boolean };
  owner: string;
  mutable: boolean;
  burnt: boolean;
  externalUrl?: string;
  symbol: string;
  tokenStandard: string;
  compression: { eligible: boolean; compressed: boolean };
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { success: false, message: 'NFT ID is required and must be a string' },
      { status: 400 },
    );
  }

  try {
    const result = await heliusRpc<DasAssetFull>('getAsset', {
      id,
      displayOptions: { showCollectionMetadata: true },
    });
    const meta = result.content?.metadata ?? {};
    const collectionGroup = result.grouping?.find((g) => g.group_key === 'collection');
    const collectionMeta = collectionGroup?.collection_metadata;

    const nft: NFT = {
      id: result.id,
      title: meta.name || 'Untitled',
      description: meta.description || 'No description available.',
      imageUrl: assetImage(result),
      attributes: meta.attributes ?? [],
      collection: {
        name: collectionMeta?.name || meta.symbol || 'Unknown Collection',
        address: collectionGroup?.group_value || '',
      },
      royalty: {
        model: result.royalty?.royalty_model || 'Unknown',
        percent: result.royalty?.percent || 0,
        primarySaleHappened: result.royalty?.primary_sale_happened || false,
        locked: result.royalty?.locked || false,
      },
      owner: result.ownership?.owner || 'Unknown Owner',
      mutable: result.mutable ?? false,
      burnt: result.burnt ?? false,
      externalUrl: result.content?.links?.external_url || '',
      symbol: meta.symbol || '',
      tokenStandard: meta.token_standard || '',
      compression: {
        eligible: result.compression?.eligible ?? false,
        compressed: result.compression?.compressed ?? false,
      },
    };

    return NextResponse.json({ success: true, message: 'NFT fetched successfully', nft });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching NFT:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
