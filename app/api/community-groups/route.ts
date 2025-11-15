import { NextResponse } from 'next/server';
import { getCommunityGroups } from '@/api/entities';

export async function GET() {
  try {
    const groups = await getCommunityGroups();
    return NextResponse.json({ data: groups, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
