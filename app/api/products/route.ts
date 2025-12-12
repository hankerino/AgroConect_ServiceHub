import { NextResponse } from 'next/server';
import { getProducts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching products...');
    const products = await getProducts();
    console.log('[v0] Products fetched:', products?.length || 0, 'items');
    return NextResponse.json({ data: products, error: null });
  } catch (error: unknown) {
    console.error('[v0] Products API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ data: null, error: errorMessage }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
