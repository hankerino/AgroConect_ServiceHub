import { NextResponse } from 'next/server';
import { getUsers } from '@/api/entities';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ data: users, error: null });
  } catch (error) {
    console.error('[v0] Error fetching users:', error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
