import { NextResponse } from 'next/server';
import { supabase } from '@/src/api/supabaseClient.js';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    },
    tables: {},
  };

  // Test each table
  const tablesToTest = [
    'market_prices',
    'MarketPrice',
    'products',
    'Product',
    'consultations',
    'Consultation',
    'users',
  ];

  for (const table of tablesToTest) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(1);
      
      results.tables[table] = {
        exists: !error,
        count: count || 0,
        hasData: (data?.length || 0) > 0,
        error: error?.message || null,
        sampleData: data?.[0] || null,
      };
    } catch (err) {
      results.tables[table] = {
        exists: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  return NextResponse.json(results, { status: 200 });
}

export const dynamic = 'force-dynamic';
