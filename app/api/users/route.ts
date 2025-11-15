import { NextResponse } from 'next/server';
import { getUsers } from '@/api/entities';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[v0] Fetching users...');
    const users = await getUsers();
    console.log('[v0] Users fetched:', users?.length || 0, 'items');
    return NextResponse.json({ data: users, error: null });
  } catch (error) {
    console.error('[v0] Users API error:', error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
