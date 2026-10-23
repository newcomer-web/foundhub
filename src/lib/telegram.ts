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
  const header = isFound ? '<b>NEW FOUND ITEM REPORTED</b>' : '<b>URGENT: LOST ITEM REPORT</b>';
  const itemUrl = `${baseUrl}/item/${item.id}`;
  
  return `${header}
━━━━━━━━━━━━━━━━━━
<b>Title:</b> ${item.title}
<b>Category:</b> #${item.category}
<b>Location:</b> ${item.incidentLocation}
<b>Custody:</b> ${item.currentHoldingLocation}
<b>Date:</b> ${new Date(item.eventDate).toLocaleDateString()}
${isFound && item.secretVerificationQuestion ? '<b>Verification:</b> Anti-fraud proof question set' : ''}
${item.rewardAmount ? `<b>Reward:</b> $${item.rewardAmount}` : ''}

<b>Claim or report leads:</b>
${itemUrl}
#FoundHub #${item.type} #${item.category}`;
}

export function generateTelegramShareUrl(item: Item, baseUrl: string): string {
  const url = `${baseUrl}/item/${item.id}`;
  const text = encodeURIComponent(
    `[${item.type === 'FOUND' ? 'FOUND' : 'LOST'}] ${item.title} - Location: ${item.incidentLocation}. Safe custody: ${item.currentHoldingLocation}. View listing: `
  );
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
}

export function generateWhatsAppShareUrl(item: Item, baseUrl: string): string {
  const url = `${baseUrl}/item/${item.id}`;
  const text = encodeURIComponent(
    `*FoundHub ${item.type === 'FOUND' ? 'Found Item' : 'Lost Item'}*: ${item.title}\nLocation: ${item.incidentLocation}\nCurrent Holding: ${item.currentHoldingLocation}\nCheck or claim here: ${url}`
  );
  return `https://wa.me/?text=${text}`;
}

// In-memory feed of Telegram broadcasts for realistic community channel preview
const TELEGRAM_FEED_KEY = 'foundhub_telegram_feed_v3';

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
  return [];
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
