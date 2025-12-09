import { NextResponse } from 'next/server';
import { getWeatherForecasts } from '@/api/entities';

export async function GET() {
  try {
    console.log('[v0] Fetching weather forecasts...');
    const forecasts = await getWeatherForecasts();
    console.log('[v0] Weather forecasts fetched:', forecasts?.length || 0, 'items');
    return NextResponse.json({ data: forecasts, error: null });
  } catch (error: unknown) {
    console.error('[v0] Weather forecasts API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather forecasts';
    return NextResponse.json({ data: null, error: errorMessage }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
