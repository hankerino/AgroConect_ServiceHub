import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    console.log('[v0] Fetching market prices from Supabase...');
    console.log('[v0] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...');
    
    let { data, error } = await supabaseServer
      .from('market_prices')
      .select('*')
      .order('date', { ascending: false });
    
    if (error || !data || data.length === 0) {
      console.log('[v0] Trying PascalCase table: MarketPrice');
      const result = await supabaseServer
        .from('MarketPrice')
        .select('*')
        .order('date', { ascending: false });
      data = result.data;
      error = result.error;
    }
    
    console.log('[v0] Market prices result:', { count: data?.length, error: error?.message });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('[v0] Market prices API error:', error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : 'Unknown error' || 'Failed to fetch market prices' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
