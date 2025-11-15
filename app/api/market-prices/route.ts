import { NextResponse } from 'next/server';
import { getMarketPrices } from '@/api/entities.js';

export async function GET() {
  try {
    console.log('[v0] Fetching market prices...');
    const marketPrices = await getMarketPrices();
    console.log('[v0] Market prices fetched:', marketPrices?.length || 0, 'items');
    return NextResponse.json({ data: marketPrices, error: null });
  } catch (error) {
    console.error('[v0] Market prices API error:', error);
    console.error('[v0] Error details:', error.message, error.stack);
    return NextResponse.json(
      { data: null, error: error.message || 'Failed to fetch market prices' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 30;
