import { NextResponse } from 'next/server';
import { getVideoPosts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching video posts...');
    const videos = await getVideoPosts();
    console.log('[v0] Video posts fetched:', videos?.length || 0, 'items');
    return NextResponse.json({ data: videos, error: null });
  } catch (error) {
    console.error('[v0] Video posts API error:', error);
    return NextResponse.json({ data: null, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
