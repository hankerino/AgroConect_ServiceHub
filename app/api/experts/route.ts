import { NextResponse } from 'next/server';
import { getExperts } from '@/api/entities';

export async function GET() {
  try {
    const experts = await getExperts();
    return NextResponse.json(experts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
