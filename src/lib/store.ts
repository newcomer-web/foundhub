import { Item, User, Comment, ItemClaim, ItemType, ItemCategory, ItemStatus } from './types';

// Mock active user session for demo
export const CURRENT_USER: User = {
  id: 'usr-current-1',
  email: 'alex.rivera@campus.edu',
  fullName: 'Alex Rivera',
  phone: '+1 (555) 382-9912',
  telegramUsername: 'alex_rivera_sf',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T09:00:00Z',
};

export const MOCK_USERS: Record<string, User> = {
  'usr-current-1': CURRENT_USER,
  'usr-finder-2': {
    id: 'usr-finder-2',
    email: 'marcus.vance@security.org',
    fullName: 'Officer Marcus Vance',
    phone: '+1 (555) 720-4491',
    telegramUsername: 'marcus_vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-20T10:00:00Z',
  },
  'usr-finder-3': {
    id: 'usr-finder-3',
    email: 'elena.rostova@design.edu',
    fullName: 'Elena Rostova',
    phone: '+1 (555) 912-3044',
    telegramUsername: 'elena_design',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T14:30:00Z',
  },
  'usr-claimant-4': {
    id: 'usr-claimant-4',
    email: 'david.kim@tech.io',
    fullName: 'David Kim',
    phone: '+1 (555) 601-2918',
    telegramUsername: 'davidk_code',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T11:00:00Z',
  },
};

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-found-1',
    userId: 'usr-finder-3',
    user: MOCK_USERS['usr-finder-3'],
    type: 'FOUND',
    title: 'Space Gray MacBook Pro 14" M3 in Dark Felt Sleeve',
    category: 'ELECTRONICS',
    description: 'Found left behind on a study desk on the 2nd floor silent reading room. It has a distinctive sticker on the lower right palm rest and comes with a 96W MagSafe charger.',
    imageUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-21T16:30:00Z',
    incidentLocation: 'University Central Library 2nd Floor, Silent Area',
    latitude: 37.7749,
    longitude: -122.4194,
    currentHoldingLocation: "Campus Dean's Office / Lost & Found Desk Room 210",
    finderContactPreference: 'Telegram: @elena_design or Dean Office in person (9 AM - 5 PM)',
    secretVerificationQuestion: 'What specific indie band sticker is applied to the left of the trackpad, and what color is the felt sleeve lining?',
    status: 'ACTIVE',
    rewardAmount: null,
    createdAt: '2026-10-21T17:15:00Z',
    updatedAt: '2026-10-21T17:15:00Z',
    comments: [
      {
        id: 'c-1',
        itemId: 'item-found-1',
        userId: 'usr-finder-2',
        user: MOCK_USERS['usr-finder-2'],
        content: 'Logged in official campus system as inventory #MBP-8841. Laptop is securely locked in Dean Office safe.',
        commentType: 'OFFICIAL_UPDATE',
        taggedOwnerInfo: null,
        createdAt: '2026-10-21T18:00:00Z',
      },
      {
        id: 'c-2',
        itemId: 'item-found-1',
        userId: 'usr-current-1',
        user: CURRENT_USER,
        content: 'Looks like David Kim’s laptop from the senior robotics lab, he was studying there yesterday afternoon!',
        commentType: 'OWNER_LEAD',
        taggedOwnerInfo: '@davidk_code (David Kim)',
        createdAt: '2026-10-21T19:20:00Z',
      },
    ],
    claims: [
      {
        id: 'cl-1',
        itemId: 'item-found-1',
        claimantId: 'usr-claimant-4',
        claimant: MOCK_USERS['usr-claimant-4'],
        proofMessage: 'The sticker is "Radiohead - In Rainbows" hologram sticker. Sleeve inner lining is bright orange fleece. Lock screen wallpaper is Yosemite valley stars.',
        status: 'PENDING',
        createdAt: '2026-10-21T20:05:00Z',
      },
    ],
  },
  {
    id: 'item-found-2',
    userId: 'usr-finder-2',
    user: MOCK_USERS['usr-finder-2'],
    type: 'FOUND',
    title: 'Brown Genuine Leather Bi-Fold Wallet (With Cards & Keys)',
    category: 'WALLETS_AND_BAGS',
    description: 'Found under seat 4B on the Central Metro inbound express car. Contains a public transit pass, gym membership fob, and several bank cards. Cash has been counted and securely held.',
    imageUrls: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-20T08:45:00Z',
    incidentLocation: 'Downtown Metro Station, Platform 3 Inbound',
    latitude: 37.7833,
    longitude: -122.4167,
    currentHoldingLocation: 'Metro Security Station & Central Lost Property Depot',
    finderContactPreference: 'Call Security dispatch at +1 (555) 720-4491 during business hours',
    secretVerificationQuestion: 'What gym facility logo is on the key fob inside, and what are the last 4 digits of the transit pass?',
    status: 'ACTIVE',
    rewardAmount: null,
    createdAt: '2026-10-20T09:30:00Z',
    updatedAt: '2026-10-20T09:30:00Z',
    comments: [
      {
        id: 'c-3',
        itemId: 'item-found-2',
        userId: 'usr-finder-2',
        user: MOCK_USERS['usr-finder-2'],
        content: 'Transit police reference case #TP-2026-904. Custody transfer to main depot completed.',
        commentType: 'OFFICIAL_UPDATE',
        taggedOwnerInfo: null,
        createdAt: '2026-10-20T10:15:00Z',
      },
    ],
    claims: [],
  },
  {
    id: 'item-found-3',
    userId: 'usr-current-1',
    user: CURRENT_USER,
    type: 'FOUND',
    title: 'Official State Driver License & Health Card (Masked)',
    category: 'DOCUMENTS_AND_IDS',
    description: 'Found dropped near the turnstiles at University Station entrance. Personal numbers have been masked in adherence to privacy policy. Name on card starts with "Jonathan H.".',
    imageUrls: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-21T12:15:00Z',
    incidentLocation: 'University Metro Station, South Turnstiles',
    latitude: 37.7785,
    longitude: -122.4215,
    currentHoldingLocation: 'With finder (Alex Rivera) - can hand over at Campus Police or station',
    finderContactPreference: 'In-app message or Telegram @alex_rivera_sf',
    secretVerificationQuestion: 'What is the full middle name and the exact birth date year listed on the license?',
    status: 'ACTIVE',
    rewardAmount: null,
    createdAt: '2026-10-21T13:00:00Z',
    updatedAt: '2026-10-21T13:00:00Z',
    comments: [],
    claims: [],
  },
  {
    id: 'item-found-4',
    userId: 'usr-finder-3',
    user: MOCK_USERS['usr-finder-3'],
    type: 'FOUND',
    title: 'Smart Key Fob with Braided Climbing Rope Keychain',
    category: 'KEYS',
    description: 'Found on grass near the picnic tables outside the Design Building. Key fob has three buttons and a miniature silver carabiner.',
    imageUrls: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-19T17:00:00Z',
    incidentLocation: 'Arts & Design Quad, West Lawn',
    latitude: 37.7712,
    longitude: -122.4289,
    currentHoldingLocation: 'Design Studio Front Reception Desk Room 102',
    finderContactPreference: 'Telegram @elena_design or visit Reception desk',
    secretVerificationQuestion: 'What car brand logo is embedded on the key fob, and what is inscribed on the small metal tag?',
    status: 'CLAIM_PENDING',
    rewardAmount: null,
    createdAt: '2026-10-19T18:00:00Z',
    updatedAt: '2026-10-20T11:00:00Z',
    comments: [],
    claims: [
      {
        id: 'cl-2',
        itemId: 'item-found-4',
        claimantId: 'usr-current-1',
        claimant: CURRENT_USER,
        proofMessage: 'It is a Subaru key with a teal/purple climbing cord loop. The small metal tag has my locker #312.',
        status: 'PENDING',
        createdAt: '2026-10-20T10:45:00Z',
      },
    ],
  },
  {
    id: 'item-lost-1',
    userId: 'usr-claimant-4',
    user: MOCK_USERS['usr-claimant-4'],
    type: 'LOST',
    title: 'Apple MacBook Pro 14" with Radiohead & GitHub Stickers',
    category: 'ELECTRONICS',
    description: 'Urgent: Misplaced my work and thesis laptop at the campus library around 4 PM. In a charcoal dark sleeve. Contains irreplaceable research data. Offering a generous cash reward upon safe recovery!',
    imageUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-21T16:00:00Z',
    incidentLocation: 'University Central Library 2nd or 3rd Floor',
    latitude: 37.7751,
    longitude: -122.4190,
    currentHoldingLocation: 'LOST - Searching actively',
    finderContactPreference: 'Phone / SMS +1 (555) 601-2918 or Telegram @davidk_code',
    secretVerificationQuestion: null,
    status: 'ACTIVE',
    rewardAmount: 200,
    createdAt: '2026-10-21T17:45:00Z',
    updatedAt: '2026-10-21T17:45:00Z',
    comments: [
      {
        id: 'c-4',
        itemId: 'item-lost-1',
        userId: 'usr-finder-3',
        user: MOCK_USERS['usr-finder-3'],
        content: 'Check the Dean’s Office! Officer Vance and I surrendered a matching MacBook found on the 2nd floor silent area.',
        commentType: 'OWNER_LEAD',
        taggedOwnerInfo: '@davidk_code',
        createdAt: '2026-10-21T18:30:00Z',
      },
    ],
    claims: [],
  },
  {
    id: 'item-lost-2',
    userId: 'usr-finder-3',
    user: MOCK_USERS['usr-finder-3'],
    type: 'LOST',
    title: 'Vintage Gold Citizen Chronograph Watch with Leather Strap',
    category: 'JEWELRY_AND_WATCHES',
    description: 'Family heirloom watch slipped off my wrist somewhere between the Engineering Quad and Coffee Shop. Gold bezel with green dial.',
    imageUrls: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-18T14:00:00Z',
    incidentLocation: 'Engineering Quad pathway to Blue Bottle Cafe',
    latitude: 37.7735,
    longitude: -122.4240,
    currentHoldingLocation: 'LOST - Last seen near Cafe walkway',
    finderContactPreference: 'Telegram @elena_design',
    secretVerificationQuestion: null,
    status: 'ACTIVE',
    rewardAmount: 150,
    createdAt: '2026-10-18T16:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z',
    comments: [],
    claims: [],
  },
  {
    id: 'item-found-5',
    userId: 'usr-current-1',
    user: CURRENT_USER,
    type: 'FOUND',
    title: 'Friendly Golden Retriever Mix wearing Red Reflective Collar',
    category: 'PETS',
    description: 'Found wandering near the community garden fountain without owner. Very friendly and healthy. Collar has a bell but the tag phone number is scratched off.',
    imageUrls: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-21T09:00:00Z',
    incidentLocation: 'Maplewood Community Park, Central Fountain',
    latitude: 37.7810,
    longitude: -122.4110,
    currentHoldingLocation: 'Safe at City Vet Clinic Foster Ward (450 Park Blvd)',
    finderContactPreference: 'Contact City Vet clinic front desk or finder in-app',
    secretVerificationQuestion: 'What name is embroidered on the inside of the red collar?',
    status: 'RETURNED_TO_OWNER',
    rewardAmount: null,
    createdAt: '2026-10-21T10:00:00Z',
    updatedAt: '2026-10-21T16:00:00Z',
    comments: [
      {
        id: 'c-5',
        itemId: 'item-found-5',
        userId: 'usr-current-1',
        user: CURRENT_USER,
        content: 'Reunited! The owner saw this post and verified with the clinic microchip record.',
        commentType: 'OFFICIAL_UPDATE',
        taggedOwnerInfo: null,
        createdAt: '2026-10-21T16:00:00Z',
      },
    ],
    claims: [],
  },
];

// Helper to manage state in memory / client-side storage
class StoreManager {
  private items: Item[] = [...INITIAL_ITEMS];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foundhub_items_v2');
      if (saved) {
        try {
          this.items = JSON.parse(saved);
        } catch {
          this.items = [...INITIAL_ITEMS];
        }
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('foundhub_items_v2', JSON.stringify(this.items));
    }
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public getItems(): Item[] {
    return [...this.items];
  }

  public getItemById(id: string): Item | undefined {
    return this.items.find((item) => item.id === id);
  }

  public addItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'claims'>): Item {
    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      claims: [],
    };
    this.items = [newItem, ...this.items];
    this.save();
    return newItem;
  }

  public updateItemStatus(id: string, status: ItemStatus): boolean {
    const item = this.items.find((i) => i.id === id);
    if (!item) return false;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  public addComment(itemId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Comment | null {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return null;
    const newComment: Comment = {
      ...comment,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!item.comments) item.comments = [];
    item.comments = [...item.comments, newComment];
    this.save();
    return newComment;
  }

  public addClaim(itemId: string, claim: Omit<ItemClaim, 'id' | 'createdAt' | 'status'>): ItemClaim | null {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return null;
    const newClaim: ItemClaim = {
      ...claim,
      id: `cl-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    if (!item.claims) item.claims = [];
    item.claims = [...item.claims, newClaim];
    if (item.status === 'ACTIVE') {
      item.status = 'CLAIM_PENDING';
    }
    this.save();
    return newClaim;
  }

  public resolveClaim(itemId: string, claimId: string, status: 'ACCEPTED' | 'REJECTED'): boolean {
    const item = this.items.find((i) => i.id === itemId);
    if (!item || !item.claims) return false;
    const claim = item.claims.find((c) => c.id === claimId);
    if (!claim) return false;
    claim.status = status;
    if (status === 'ACCEPTED') {
      item.status = 'RETURNED_TO_OWNER';
    } else {
      const hasOtherPending = item.claims.some((c) => c.id !== claimId && c.status === 'PENDING');
      if (!hasOtherPending && item.status === 'CLAIM_PENDING') {
        item.status = 'ACTIVE';
      }
    }
    item.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  public resetToDefaults() {
    this.items = [...INITIAL_ITEMS];
    this.save();
  }
}

export const dataStore = new StoreManager();
