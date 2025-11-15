import { NextResponse } from 'next/server';
import { getWeatherForecasts } from '@/api/entities';

export async function GET() {
  try {
    const forecasts = await getWeatherForecasts();
    return NextResponse.json(forecasts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
