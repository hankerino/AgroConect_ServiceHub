import { NextResponse } from 'next/server';
import { getVideoPosts } from '@/api/entities';

export async function GET() {
  try {
    const videos = await getVideoPosts();
    return NextResponse.json({ data: videos, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
