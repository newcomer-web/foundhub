import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { ItemStatus } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = dataStore.getItemById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body as { status: ItemStatus };

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const success = dataStore.updateItemStatus(params.id, status);
    if (!success) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const updatedItem = dataStore.getItemById(params.id);
    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
