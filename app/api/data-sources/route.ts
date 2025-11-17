import { NextResponse } from 'next/server';
import { getDataSources } from '@/api/entities';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[v0] GET /api/data-sources called');
  
  try {
    const dataSources = await getDataSources();
    console.log('[v0] Data sources fetched:', dataSources.length);
    
    return NextResponse.json({ data: dataSources, error: null });
  } catch (error: any) {
    console.error('[v0] Error fetching data sources:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { data: [], error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
