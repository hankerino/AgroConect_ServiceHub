import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[v0] Users endpoint - Base44 has no User table, returning 0');
    return NextResponse.json({ data: [], count: 0, error: null });
  } catch (error) {
    console.error('[v0] Users API error:', error);
    return NextResponse.json(
      { data: [], count: 0, error: null },
      { status: 200 }
    );
  }
}
