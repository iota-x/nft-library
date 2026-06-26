import { NextRequest, NextResponse } from 'next/server';
import { getCollectionListings, getCollectionMarket } from '@/lib/magiceden';

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.pathname.split('/').pop();

  if (!symbol) {
    return NextResponse.json(
      { success: false, message: 'Collection symbol is required' },
      { status: 400 },
    );
  }

  try {
    // Independent so a rate-limited listings call still lets stats render (and vice versa).
    const [collectionRes, listingsRes] = await Promise.allSettled([
      getCollectionMarket(symbol),
      getCollectionListings(symbol, 40),
    ]);

    const collection = collectionRes.status === 'fulfilled' ? collectionRes.value : null;
    const listings = listingsRes.status === 'fulfilled' ? listingsRes.value : [];

    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Collection not found, or Magic Eden is rate-limiting. Try again shortly.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: 'Collection fetched', collection, listings });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching explore collection:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
