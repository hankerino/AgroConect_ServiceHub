import { NextResponse } from 'next/server';
import { getExperts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching experts...');
    const experts = await getExperts();
    console.log('[v0] Experts fetched:', experts?.length || 0, 'items');
    return NextResponse.json({ data: experts, error: null });
  } catch (error) {
    console.error('[v0] Experts API error:', error);
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
