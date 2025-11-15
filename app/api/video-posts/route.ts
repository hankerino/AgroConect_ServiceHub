import { NextResponse } from 'next/server';
import { getVideoPosts } from '@/api/entities';

export async function GET() {
  try {
    const videos = await getVideoPosts();
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
