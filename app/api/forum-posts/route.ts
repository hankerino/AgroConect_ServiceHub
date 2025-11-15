import { NextResponse } from 'next/server';
import { getForumPosts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching forum posts...');
    const posts = await getForumPosts();
    console.log('[v0] Forum posts fetched:', posts?.length || 0, 'items');
    return NextResponse.json({ data: posts, error: null });
  } catch (error) {
    console.error('[v0] Forum posts API error:', error);
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
