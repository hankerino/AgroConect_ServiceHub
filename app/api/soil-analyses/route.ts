import { NextResponse } from 'next/server';
import { supabase } from '@/src/config/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[v0] Checking for SoilAnalysis table...');
    
    const { data, error } = await supabase
      .from('SoilAnalysis')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (error) {
      console.log('[v0] SoilAnalysis table does not exist, returning 0');
      return NextResponse.json({ data: [], count: 0, error: null });
    }
    
    console.log('[v0] SoilAnalysis found:', data?.length || 0);
    return NextResponse.json({ data: data || [], count: data?.length || 0, error: null });
  } catch (error) {
    console.error('[v0] Error fetching soil analyses:', error);
    return NextResponse.json(
      { data: [], count: 0, error: null },
      { status: 200 }
    );
  }
}
