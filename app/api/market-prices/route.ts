import { NextResponse } from 'next/server';
import { getMarketPrices } from '@/api/entities.js';

export async function GET() {
  try {
    const marketPrices = await getMarketPrices();
    return NextResponse.json({ data: marketPrices, error: null });
  } catch (error) {
    console.error('[v0] Market prices API error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch market prices' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 30; // Revalidate every 30 seconds for fresh data
