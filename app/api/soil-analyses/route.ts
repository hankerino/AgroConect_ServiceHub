import { NextResponse } from 'next/server';
import { supabase } from '@/src/config/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('soil_analyses')
      .select('*')
      .order('created_at', { ascending: false });
    
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
