import { NextResponse } from 'next/server';
import { getProducts } from '@/api/entities';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ data: products, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
