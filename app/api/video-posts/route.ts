import { NextResponse } from 'next/server';
import { getVideoPosts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching video posts...');
    const videos = await getVideoPosts();
    console.log('[v0] Video posts fetched:', videos?.length || 0, 'items');
    return NextResponse.json({ data: videos, error: null });
  } catch (error: unknown) {
    console.error('[v0] Video posts API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video posts';
    return NextResponse.json({ data: null, error: errorMessage }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
