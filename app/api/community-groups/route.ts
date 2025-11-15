import { NextResponse } from 'next/server';
import { getCommunityGroups } from '@/api/entities';

export async function GET() {
  try {
    const groups = await getCommunityGroups();
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
