import { NextResponse } from 'next/server';
import { getConsultations } from '@/api/entities';

export async function GET() {
  try {
    const consultations = await getConsultations();
    return NextResponse.json({ data: consultations, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
