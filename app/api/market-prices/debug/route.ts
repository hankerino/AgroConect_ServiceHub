import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    console.log('[v0] DEBUG: Fetching ONE market price to inspect fields');
    
    // Try both table names
    let { data, error } = await supabaseServer
      .from('MarketPrice')
      .select('*')
      .limit(1);
    
    if (error || !data || data.length === 0) {
      const result = await supabaseServer
        .from('market_prices')
        .select('*')
        .limit(1);
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        fields: null,
        sample: null 
      });
    }
    
    const sample = data && data.length > 0 ? data[0] : null;
    const fields = sample ? Object.keys(sample) : [];
    
    return NextResponse.json({ 
      fields,
      sample,
      tableName: data && data.length > 0 ? 'Found data' : 'No data',
      error: null 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      fields: null,
      sample: null 
    }, { status: 500 });
  }
}
