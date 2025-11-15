import { NextResponse } from 'next/server';
import { getConsultations } from '@/api/entities';

export async function GET() {
  try {
    const consultations = await getConsultations();
    return NextResponse.json(consultations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
