import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { findSmartMatches } from '@/lib/aiMatching';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, category, title, description, latitude, longitude, eventDate } = body;

    const allItems = dataStore.getItems();
    const matches = findSmartMatches(
      {
        type: type || 'FOUND',
        category: category || 'ELECTRONICS',
        title: title || '',
        description: description || '',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        eventDate: eventDate || new Date().toISOString(),
      },
      allItems
    );

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: 'AI Matching failed' }, { status: 500 });
  }
}
