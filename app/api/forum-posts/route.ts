import { NextResponse } from 'next/server';
import { getForumPosts } from '@/api/entities';

export async function GET() {
  try {
    const posts = await getForumPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
