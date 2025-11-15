import { NextResponse } from 'next/server';
import { getProducts } from '@/api/entities';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
