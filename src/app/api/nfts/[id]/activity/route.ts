import { NextRequest, NextResponse } from 'next/server';
import { heliusEnhancedTransactions } from '@/lib/helius';

const LAMPORTS_PER_SOL = 1_000_000_000;

interface EnhancedTx {
  signature: string;
  type: string;
  source: string;
  timestamp: number;
  description?: string;
  events?: {
    nft?: {
      type?: string;
      amount?: number;
      buyer?: string;
      seller?: string;
    };
  };
}

/** A normalised on-chain event for the provenance timeline. */
export interface ActivityEvent {
  signature: string;
  type: string;
  source: string;
  timestamp: number;
  description: string;
  /** Price in SOL for sale/bid/list events, when present. */
  amount: number | null;
  buyer: string | null;
  seller: string | null;
}

function normalise(tx: EnhancedTx): ActivityEvent {
  const nft = tx.events?.nft;
  return {
    signature: tx.signature,
    // Prefer the richer NFT-event type ("NFT_SALE") over the generic one.
    type: nft?.type || tx.type || 'UNKNOWN',
    source: tx.source || 'UNKNOWN',
    timestamp: tx.timestamp,
    description: tx.description || '',
    amount: typeof nft?.amount === 'number' ? nft.amount / LAMPORTS_PER_SOL : null,
    buyer: nft?.buyer || null,
    seller: nft?.seller || null,
  };
}

export async function GET(req: NextRequest) {
  // .../api/nfts/<id>/activity -> the id is the second-to-last segment.
  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 2];

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'NFT ID is required' },
      { status: 400 },
    );
  }

  try {
    const txs = await heliusEnhancedTransactions<EnhancedTx>(id, { limit: 50 });
    const events = txs
      .map(normalise)
      // Drop opaque "UNKNOWN" rows that carry no description, price or parties —
      // they add noise without telling the user anything about the asset.
      .filter((e) => e.type !== 'UNKNOWN' || e.description || e.amount != null || e.buyer || e.seller)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 25);

    return NextResponse.json({ success: true, message: 'Activity fetched', events });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching NFT activity:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
