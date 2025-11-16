import { NextResponse } from 'next/server';
import { supabase } from '@/src/config/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[v0] Fetching soil analyses...');
    
    const { data, error } = await supabase
      .from('SoilAnalysis')
      .select('*')
      .order('created_date', { ascending: false });
    
    console.log('[v0] Soil analyses result:', { dataLength: data?.length, error: error?.message });
    
    if (error) throw error;
    
    return NextResponse.json({ data: data || [], error: null });
  } catch (error) {
    console.error('[v0] Error fetching soil analyses:', error);
    return NextResponse.json(
      { data: [], error: error instanceof Error ? error.message : 'Failed to fetch soil analyses' },
      { status: 500 }
    );
  }
}
