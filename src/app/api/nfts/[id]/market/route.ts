import { NextRequest, NextResponse } from 'next/server';
import { getMarketData } from '@/lib/magiceden';

export async function GET(req: NextRequest) {
  // .../api/nfts/<id>/market -> id is the second-to-last segment.
  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 2];

  if (!id) {
    return NextResponse.json({ success: false, message: 'NFT ID is required' }, { status: 400 });
  }

  try {
    const market = await getMarketData(id);
    // `market: null` is a valid result — the asset just isn't listed on Magic Eden.
    return NextResponse.json({ success: true, message: 'Market fetched', market });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching market data:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
