import { NextResponse } from 'next/server';
import { getWeatherForecasts } from '@/api/entities';

export async function GET() {
  try {
    const forecasts = await getWeatherForecasts();
    return NextResponse.json({ data: forecasts, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
