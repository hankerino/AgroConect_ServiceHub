import { NextResponse } from 'next/server';
import { getTechResources } from '@/api/entities';

export async function GET() {
  try {
    const resources = await getTechResources();
    return NextResponse.json({ data: resources, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
