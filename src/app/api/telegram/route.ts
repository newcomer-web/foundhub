import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { dispatchTelegramBroadcast, getSimulatedTelegramFeed } from '@/lib/telegram';

export async function GET() {
  const feed = getSimulatedTelegramFeed();
  return NextResponse.json({ feed });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId } = body;

    const item = dataStore.getItemById(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const origin = new URL(request.url).origin;
    const broadcast = dispatchTelegramBroadcast(item, origin);

    return NextResponse.json({ broadcast, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Telegram dispatch failed' }, { status: 500 });
  }
}
