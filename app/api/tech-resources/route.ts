import { NextResponse } from 'next/server';
import { getTechResources } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching tech resources...');
    const resources = await getTechResources();
    console.log('[v0] Tech resources fetched:', resources?.length || 0, 'items');
    return NextResponse.json({ data: resources, error: null });
  } catch (error) {
    console.error('[v0] Tech resources API error:', error);
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
