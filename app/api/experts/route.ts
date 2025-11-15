import { NextResponse } from 'next/server';
import { getExperts } from '@/api/entities';

export async function GET() {
  try {
    const experts = await getExperts();
    return NextResponse.json({ data: experts, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
