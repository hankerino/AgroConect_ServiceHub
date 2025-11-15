import { NextResponse } from 'next/server';
import { getTechResources } from '@/api/entities';

export async function GET() {
  try {
    const resources = await getTechResources();
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
