import { NextResponse } from 'next/server';
import { getConsultations } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching consultations...');
    const consultations = await getConsultations();
    console.log('[v0] Consultations fetched:', consultations?.length || 0, 'items');
    return NextResponse.json({ data: consultations, error: null });
  } catch (error) {
    console.error('[v0] Consultations API error:', error);
    return NextResponse.json({ data: null, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
