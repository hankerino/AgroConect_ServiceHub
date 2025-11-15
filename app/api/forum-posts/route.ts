import { NextResponse } from 'next/server';
import { getForumPosts } from '@/api/entities';

export async function GET() {
  try {
    const posts = await getForumPosts();
    return NextResponse.json({ data: posts, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
