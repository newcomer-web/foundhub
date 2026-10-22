import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { itemId, status } = body as { itemId: string; status: 'ACCEPTED' | 'REJECTED' };

    if (!itemId || !status) {
      return NextResponse.json({ error: 'Missing itemId or status' }, { status: 400 });
    }

    const success = dataStore.resolveClaim(itemId, params.id, status);
    if (!success) {
      return NextResponse.json({ error: 'Failed to resolve claim' }, { status: 404 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
