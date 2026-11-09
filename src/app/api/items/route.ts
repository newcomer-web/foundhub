import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { ItemType, ItemCategory, ItemStatus } from '@/lib/types';
import { dispatchTelegramBroadcast } from '@/lib/telegram';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const type = searchParams.get('type') as ItemType | null;
  const category = searchParams.get('category') as ItemCategory | null;
  const status = searchParams.get('status') as ItemStatus | null;

  // 1. QUERY LOGIC: Fetch all public posts from all users.
  // Note: We do NOT apply any filter by user_id or current_user_id on the global feed.
  let items = dataStore.getItems().filter(
    (item) => item.visibility !== 'private' && item.isPrivate !== true
  );

  if (q) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.incidentLocation.toLowerCase().includes(q) ||
        item.currentHoldingLocation.toLowerCase().includes(q)
    );
  }

  if (type) {
    items = items.filter((item) => item.type === type);
  }

  if (category) {
    items = items.filter((item) => item.category === category);
  }

  if (status) {
    items = items.filter((item) => item.status === status);
  }

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      user,
      type,
      title,
      category,
      description,
      imageUrls,
      eventDate,
      incidentLocation,
      latitude,
      longitude,
      currentHoldingLocation,
      finderContactPreference,
      secretVerificationQuestion,
      rewardAmount,
      status,
      visibility,
      is_private,
      isPrivate,
      relayToTelegram,
    } = body;

    if (!title || !category || !incidentLocation) {
      return NextResponse.json(
        { error: 'Missing required item details' },
        { status: 400 }
      );
    }

    // 2. POST STATUS: Ensure default status is automatically set to 'ACTIVE' (or 'published'), never 'draft' or 'pending'
    const finalStatus: ItemStatus =
      status === 'ACTIVE' || status === 'CLAIM_PENDING' || status === 'RETURNED_TO_OWNER' || status === 'ARCHIVED'
        ? status
        : 'ACTIVE';

    // 3. PRIVACY / VISIBILITY: Ensure default visibility is set to public (is_private: false, visibility: 'public')
    const finalVisibility: 'public' | 'private' = visibility === 'private' ? 'private' : 'public';
    const finalIsPrivate: boolean =
      is_private !== undefined ? Boolean(is_private) : (isPrivate !== undefined ? Boolean(isPrivate) : false);

    const newItem = dataStore.addItem({
      userId: userId || 'usr-current-1',
      user: user || undefined,
      type: type || 'FOUND',
      title,
      category,
      description: description || '',
      imageUrls: imageUrls || [],
      eventDate: eventDate || new Date().toISOString(),
      incidentLocation,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      currentHoldingLocation: currentHoldingLocation || 'With finder',
      finderContactPreference: finderContactPreference || 'In-app message',
      secretVerificationQuestion: secretVerificationQuestion || null,
      status: finalStatus,
      visibility: finalVisibility,
      isPrivate: finalIsPrivate,
      rewardAmount: rewardAmount ? parseFloat(rewardAmount) : null,
    });

    // If relayToTelegram is enabled or type is FOUND, trigger community Telegram broadcast
    if (relayToTelegram || type === 'FOUND') {
      try {
        const origin = new URL(request.url).origin;
        dispatchTelegramBroadcast(newItem, origin);
      } catch (err) {
        console.error('Telegram dispatch error:', err);
      }
    }

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
