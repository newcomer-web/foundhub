import { Item } from './types';

export interface TelegramRelayMessage {
  id: string;
  itemId: string;
  channel: string;
  photoUrl?: string;
  text: string;
  sentAt: string;
  status: 'SENT' | 'SIMULATED';
}

export function formatTelegramPost(item: Item, baseUrl: string): string {
  const isFound = item.type === 'FOUND';
  const header = isFound ? '📢 <b>NEW FOUND ITEM REPORTED</b>' : '🚨 <b>URGENT: LOST ITEM REPORT</b>';
  const itemUrl = `${baseUrl}/item/${item.id}`;
  
  return `${header}
━━━━━━━━━━━━━━━━━━
<b>Title:</b> ${item.title}
<b>Category:</b> #${item.category}
<b>📍 Incident Spot:</b> ${item.incidentLocation}
<b>🏢 Current Custody:</b> ${item.currentHoldingLocation}
<b>📅 Date:</b> ${new Date(item.eventDate).toLocaleDateString()}
${isFound && item.secretVerificationQuestion ? '🔒 <b>Anti-Fraud:</b> Secret verification question set' : ''}
${item.rewardAmount ? `💰 <b>Reward:</b> $${item.rewardAmount}` : ''}

🔗 <b>Claim or report leads here:</b>
${itemUrl}
#FoundHub #${item.type} #${item.category}`;
}

export function generateTelegramShareUrl(item: Item, baseUrl: string): string {
  const url = `${baseUrl}/item/${item.id}`;
  const text = encodeURIComponent(
    `[${item.type === 'FOUND' ? 'FOUND ITEM' : 'LOST ITEM'}] ${item.title} at ${item.incidentLocation}. Safe custody: ${item.currentHoldingLocation}. Check details: `
  );
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
}

export function generateWhatsAppShareUrl(item: Item, baseUrl: string): string {
  const url = `${baseUrl}/item/${item.id}`;
  const text = encodeURIComponent(
    `*FoundHub ${item.type === 'FOUND' ? 'Found Item' : 'Lost Item'}*: ${item.title}\n📍 Location: ${item.incidentLocation}\n🏢 Current Holding: ${item.currentHoldingLocation}\nCheck or claim here: ${url}`
  );
  return `https://wa.me/?text=${text}`;
}

// In-memory feed of Telegram broadcasts for realistic community channel preview
const TELEGRAM_FEED_KEY = 'foundhub_telegram_feed';

export function getSimulatedTelegramFeed(): TelegramRelayMessage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TELEGRAM_FEED_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [
    {
      id: 'tg-1',
      itemId: 'item-found-1',
      channel: '@FoundHub_Official_Community',
      photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      text: '📢 NEW FOUND ITEM: Space Gray MacBook Pro 14" M3 at University Central Library 2nd Floor. Safely stored at Dean\'s Office. Secret proof verification active.',
      sentAt: '2026-10-21T17:16:00Z',
      status: 'SENT',
    },
    {
      id: 'tg-2',
      itemId: 'item-found-2',
      channel: '@FoundHub_Official_Community',
      photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      text: '📢 NEW FOUND ITEM: Brown Genuine Leather Bi-Fold Wallet at Downtown Metro Station. Holding at Metro Security Depot.',
      sentAt: '2026-10-20T09:31:00Z',
      status: 'SENT',
    },
  ];
}

export function dispatchTelegramBroadcast(item: Item, baseUrl: string): TelegramRelayMessage {
  const feed = getSimulatedTelegramFeed();
  const newMsg: TelegramRelayMessage = {
    id: `tg-${Date.now()}`,
    itemId: item.id,
    channel: '@FoundHub_Official_Community',
    photoUrl: item.imageUrls[0],
    text: formatTelegramPost(item, baseUrl),
    sentAt: new Date().toISOString(),
    status: 'SENT',
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(TELEGRAM_FEED_KEY, JSON.stringify([newMsg, ...feed]));
  }
  return newMsg;
}
