import { NextResponse } from 'next/server';
import { getProducts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching products...');
    const products = await getProducts();
    console.log('[v0] Products fetched:', products?.length || 0, 'items');
    return NextResponse.json({ data: products, error: null });
  } catch (error) {
    console.error('[v0] Products API error:', error);
    return NextResponse.json({ data: null, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
