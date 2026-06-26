import { NextRequest, NextResponse } from 'next/server';
import { getPopularCollections } from '@/lib/magiceden';

const RANGES = ['1h', '1d', '7d', '30d'] as const;
type Range = (typeof RANGES)[number];

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get('range');
  const range: Range = RANGES.includes(param as Range) ? (param as Range) : '1d';

  try {
    const collections = await getPopularCollections(range);
    return NextResponse.json({ success: true, message: 'Trending fetched', range, collections });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching trending collections:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error', error: error.message },
      { status: 500 },
    );
  }
}
