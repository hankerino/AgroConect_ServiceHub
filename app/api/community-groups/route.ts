import { NextResponse } from 'next/server';
import { getCommunityGroups } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching community groups...');
    const groups = await getCommunityGroups();
    console.log('[v0] Community groups fetched:', groups?.length || 0, 'items');
    return NextResponse.json({ data: groups, error: null });
  } catch (error) {
    console.error('[v0] Community groups API error:', error);
    return NextResponse.json({ data: null, error: error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Unknown error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
