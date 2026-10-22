import { NextResponse } from 'next/server';
import { dataStore, CURRENT_USER } from '@/lib/store';
import { CommentType } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, content, commentType, taggedOwnerInfo, userId, user } = body;

    if (!itemId || !content) {
      return NextResponse.json({ error: 'Missing itemId or content' }, { status: 400 });
    }

    const comment = dataStore.addComment(itemId, {
      itemId,
      userId: userId || CURRENT_USER.id,
      user: user || CURRENT_USER,
      content,
      commentType: (commentType as CommentType) || 'GENERAL',
      taggedOwnerInfo: taggedOwnerInfo || null,
    });

    if (!comment) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
