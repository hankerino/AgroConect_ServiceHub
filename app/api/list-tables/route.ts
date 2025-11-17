import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    console.log('[v0] Listing known Base44 tables from entities.js');
    
    const knownTables = [
      'Consultation',
      'ForumPost',
      'MarketPrice',
      'Product',
      'Resource',
      'Expert',
      'DataSource',
      'WeatherForecast',
      'Sensor',
      'TechResource',
      'CommunityProfile',
      'VideoPost',
      'CommunityGroup'
    ];
    
    return NextResponse.json({ 
      tables: knownTables,
      note: 'These are the known Base44 tables. User and SoilAnalysis tables do not exist in Base44 schema.'
    });
  } catch (error) {
    console.error('[v0] Error listing tables:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Failed to list tables' },
      { status: 500 }
    );
  }
}
