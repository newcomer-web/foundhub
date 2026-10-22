import { NextResponse } from 'next/server';
import { dataStore, CURRENT_USER } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { claimantId, claimant, proofMessage } = body;

    if (!proofMessage) {
      return NextResponse.json({ error: 'Proof message is required' }, { status: 400 });
    }

    const claim = dataStore.addClaim(params.id, {
      itemId: params.id,
      claimantId: claimantId || CURRENT_USER.id,
      claimant: claimant || CURRENT_USER,
      proofMessage,
    });

    if (!claim) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
  }
}
