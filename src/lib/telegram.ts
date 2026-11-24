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
  const header = isFound ? '<b>TOPILGAN BUYUM</b>' : '<b>YO\'QOLGAN BUYUM</b>';
  const itemUrl = `${baseUrl}/item/${item.id}`;
  
  return `${header}
━━━━━━━━━━━━━━━━━━
<b>Nomi:</b> ${item.title}
<b>Toifasi:</b> #${item.category}
<b>Manzil:</b> ${item.incidentLocation}
<b>Saqlanayotgan joy:</b> ${item.currentHoldingLocation}
<b>Sana:</b> ${new Date(item.eventDate).toLocaleDateString()}
${isFound && item.secretVerificationQuestion ? '<b>Egalik tekshiruvi:</b> Sirli savol o\'rnatilgan' : ''}
${item.rewardAmount ? `<b>Mukofot:</b> ${item.rewardAmount} so'm` : ''}

<b>E'lonni ko'rish va da'vo qilish:</b>
${itemUrl}
#FoundHub #${item.type} #${item.category}`;
}

export function generateTelegramShareUrl(item: Item, baseUrl: string): string {
  const url = `${baseUrl}/item/${item.id}`;
  const text = encodeURIComponent(
    `[${item.type === 'FOUND' ? 'Topilgan' : 'Yo\'qolgan'}] ${item.title} - Manzil: ${item.incidentLocation}. Saqlash joyi: ${item.currentHoldingLocation}. E'lon: `
  );
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
}

export function generateWhatsAppShareUrl(item: Item, baseUrl: string): string {
  const url = `${baseUrl}/item/${item.id}`;
  const text = encodeURIComponent(
    `*FoundHub ${item.type === 'FOUND' ? 'Topilgan buyum' : 'Yo\'qolgan buyum'}*: ${item.title}\nManzil: ${item.incidentLocation}\nSaqlash joyi: ${item.currentHoldingLocation}\nKo'rish: ${url}`
  );
  return `https://wa.me/?text=${text}`;
}

// Telegram post layout preview feed stored locally
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
    channel: '@FoundHub_Uz',
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
