import { Item, User, Comment, ItemClaim, ItemType, ItemCategory, ItemStatus } from './types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Default user avatar uploaded by user
export const DEFAULT_AVATAR = '/default-avatar.png';

// Active user session initial state
export const DEFAULT_USER: User = {
  id: 'usr-current-1',
  email: 'user@foundhub.app',
  fullName: 'Community Member',
  phone: '',
  telegramUsername: '',
  avatarUrl: DEFAULT_AVATAR,
  createdAt: '2026-01-01T00:00:00Z',
};

// Mutable active reference for backward compatibility
export const CURRENT_USER: User = { ...DEFAULT_USER };

export const MOCK_USERS: Record<string, User> = {
  'usr-current-1': CURRENT_USER,
};

// Initial seed items demonstrating dual listings, smart AI matching, custody status, and anti-fraud verification
export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-found-1',
    userId: 'usr-finder-1',
    user: {
      id: 'usr-finder-1',
      fullName: 'Muhammadaziz Abdullayev',
      email: 'muhammadaziz09092009@gmail.com',
      phone: '+1 (555) 234-5678',
      telegramUsername: 'alex_campus_guard',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-10T10:00:00Z',
    },
    type: 'FOUND',
    title: 'Space Gray MacBook Pro 14" M2',
    category: 'ELECTRONICS',
    description: 'Found inside Study Pod B on a desk next to an orange water bottle. Laptop is in sleep mode, space gray chassis with several tech stickers.',
    imageUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-28T14:30:00Z',
    incidentLocation: 'University Central Library 2nd Floor',
    latitude: 37.7749,
    longitude: -122.4194,
    currentHoldingLocation: "Central Campus Police & Lost Property Station, Room 102",
    finderContactPreference: 'Telegram: @alex_campus_guard (In custody desk)',
    secretVerificationQuestion: 'What specific indie developer sticker is affixed beside the trackpad?',
    status: 'ACTIVE',
    rewardAmount: null,
    createdAt: '2026-10-28T15:00:00Z',
    updatedAt: '2026-10-28T15:00:00Z',
    comments: [
      {
        id: 'c-1',
        itemId: 'item-found-1',
        userId: 'usr-current-1',
        user: DEFAULT_USER,
        content: 'I think I saw a student looking frantically for their MacBook around 3 PM today!',
        commentType: 'GENERAL',
        createdAt: '2026-10-28T16:15:00Z',
      },
    ],
    claims: [],
  },
  {
    id: 'item-lost-1',
    userId: 'usr-owner-1',
    user: {
      id: 'usr-owner-1',
      fullName: 'Muhammadaziz Abdullayev',
      email: 'elena.r@design.org',
      phone: '+1 (555) 876-5432',
      telegramUsername: 'elena_designer',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T09:00:00Z',
    },
    type: 'LOST',
    title: 'Lost MacBook Pro 14 (Space Gray with Dev Stickers)',
    category: 'ELECTRONICS',
    description: 'Left my work laptop in the Library 2nd floor study area while taking a phone call. Contains crucial thesis files. Generous reward offered!',
    imageUrls: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-28T14:15:00Z',
    incidentLocation: 'University Central Library 2nd Floor',
    latitude: 37.7749,
    longitude: -122.4194,
    currentHoldingLocation: 'Lost by owner',
    finderContactPreference: 'Telegram @elena_designer or phone immediately',
    secretVerificationQuestion: null,
    status: 'ACTIVE',
    rewardAmount: 150,
    createdAt: '2026-10-28T15:30:00Z',
    updatedAt: '2026-10-28T15:30:00Z',
    comments: [],
    claims: [],
  },
  {
    id: 'item-found-2',
    userId: 'usr-finder-2',
    user: {
      id: 'usr-finder-2',
      fullName: 'Marcus Brody',
      email: 'm.brody@transit.city',
      phone: '+1 (555) 432-1098',
      telegramUsername: 'metro_m_brody',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-01T11:00:00Z',
    },
    type: 'FOUND',
    title: 'Brown Leather Bifold Wallet with ID Cards',
    category: 'WALLETS_AND_BAGS',
    description: 'Recovered on a passenger bench near the ticketing turnstile. Contains credit cards and driver license (PII protected). Handed to depot.',
    imageUrls: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-27T18:00:00Z',
    incidentLocation: 'Downtown Metro Station, Platform 3',
    latitude: 37.7833,
    longitude: -122.4167,
    currentHoldingLocation: "Metro Security Lost & Found Depot, Turnstile Booth 4",
    finderContactPreference: 'Metro Lost & Found Desk (Mon-Fri 8 AM - 6 PM)',
    secretVerificationQuestion: 'What is the color and brand of the fitness gym membership card inside?',
    status: 'ACTIVE',
    rewardAmount: null,
    createdAt: '2026-10-27T19:00:00Z',
    updatedAt: '2026-10-27T19:00:00Z',
    comments: [],
    claims: [],
  },
  {
    id: 'item-lost-2',
    userId: 'usr-owner-2',
    user: {
      id: 'usr-owner-2',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      phone: '+1 (555) 678-9012',
      telegramUsername: 'sarah_jenkins_p',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-14T12:00:00Z',
    },
    type: 'LOST',
    title: 'Lost Golden Retriever ("Max" with Blue Harness)',
    category: 'PETS',
    description: 'Our friendly 2-year-old Golden Retriever slipped his leash near the park fountain. Microchipped, wearing reflective blue harness and tag with "Max".',
    imageUrls: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-28T09:00:00Z',
    incidentLocation: 'Maplewood Community Park Fountain',
    latitude: 37.7810,
    longitude: -122.4110,
    currentHoldingLocation: 'Family searching the neighborhood',
    finderContactPreference: 'Phone calls any time: +1 (555) 678-9012',
    secretVerificationQuestion: null,
    status: 'ACTIVE',
    rewardAmount: 200,
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-28T10:00:00Z',
    comments: [],
    claims: [],
  },
  {
    id: 'item-found-3',
    userId: 'usr-finder-3',
    user: {
      id: 'usr-finder-3',
      fullName: 'David Chen',
      email: 'david.chen@eng.univ.edu',
      phone: '+1 (555) 345-6789',
      telegramUsername: 'david_eng',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-20T14:00:00Z',
    },
    type: 'FOUND',
    title: 'Toyota Smart Car Key with Leather Fob',
    category: 'KEYS',
    description: 'Found dropped along the brick pathway next to the cafe patio. Has 3 keys and a key fob.',
    imageUrls: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    ],
    eventDate: '2026-10-28T11:20:00Z',
    incidentLocation: 'Engineering Quad Cafe Pathway',
    latitude: 37.7735,
    longitude: -122.4240,
    currentHoldingLocation: "Campus Dean's Office / Room 102 Safe",
    finderContactPreference: "Dean's office reception desk",
    secretVerificationQuestion: 'What miniature figurine or token is attached to the metal split ring?',
    status: 'ACTIVE',
    rewardAmount: null,
    createdAt: '2026-10-28T12:00:00Z',
    updatedAt: '2026-10-28T12:00:00Z',
    comments: [],
    claims: [],
  },
];

// Helper to manage state in memory / client-side storage
class StoreManager {
  private items: Item[] = [...INITIAL_ITEMS];
  private currentUser: User = { ...DEFAULT_USER };
  private isAuthenticated: boolean = false;
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Load items
      const saved = localStorage.getItem('foundhub_items_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.items = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_ITEMS];
        } catch {
          this.items = [...INITIAL_ITEMS];
        }
      } else {
        this.items = [...INITIAL_ITEMS];
      }

      // Load user profile & auth status
      const savedUser = localStorage.getItem('foundhub_current_user_v2');
      const savedAuth = localStorage.getItem('foundhub_is_authenticated_v2');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          this.currentUser = {
            ...parsed,
            avatarUrl: parsed.avatarUrl || DEFAULT_AVATAR,
          };
          Object.assign(CURRENT_USER, this.currentUser);
        } catch {
          this.currentUser = { ...DEFAULT_USER };
        }
      }
      this.isAuthenticated = savedAuth === 'true';

      if (isSupabaseConfigured) {
        this.loadFromSupabase();
      }
    }
  }

  private async loadFromSupabase() {
    try {
      let { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const postsRes = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!postsRes.error && postsRes.data && postsRes.data.length > 0) {
          data = postsRes.data;
          error = null;
        }
      }

      if (!error && data && data.length > 0) {
        // Query logic: Fetch all public posts from all users (without restricting to user_id)
        const remoteItems: Item[] = data
          .filter((row: any) => row.visibility !== 'private' && row.is_private !== true)
          .map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            user: row.user_data || DEFAULT_USER,
            type: row.type || 'FOUND',
            title: row.title,
            category: row.category,
            description: row.description || '',
            imageUrls: row.image_urls || [],
            eventDate: row.event_date,
            incidentLocation: row.incident_location,
            latitude: row.latitude,
            longitude: row.longitude,
            currentHoldingLocation: row.current_holding_location,
            finderContactPreference: row.finder_contact_preference || '',
            secretVerificationQuestion: row.secret_verification_question || null,
            status: row.status || 'ACTIVE',
            visibility: row.visibility || 'public',
            isPrivate: row.is_private ?? false,
            rewardAmount: row.reward_amount ? Number(row.reward_amount) : null,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            comments: [],
            claims: [],
          }));
        this.items = remoteItems;
        this.save();
      }
    } catch {
      // ignore
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('foundhub_items_v3', JSON.stringify(this.items));
    }
    this.notify();
  }

  private saveUser() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('foundhub_current_user_v2', JSON.stringify(this.currentUser));
      localStorage.setItem('foundhub_is_authenticated_v2', this.isAuthenticated ? 'true' : 'false');
    }
    Object.assign(CURRENT_USER, this.currentUser);
    this.notify();
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  // --- Auth & User Profile Methods ---
  public getCurrentUser(): User {
    return { ...this.currentUser };
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public login(email: string, fullName?: string): User {
    this.currentUser = {
      ...this.currentUser,
      email: email.trim(),
      fullName: fullName?.trim() || this.currentUser.fullName || 'Community Member',
      avatarUrl: this.currentUser.avatarUrl || DEFAULT_AVATAR,
    };
    this.isAuthenticated = true;
    this.saveUser();
    return { ...this.currentUser };
  }

  public register(data: {
    fullName: string;
    email: string;
    phone?: string;
    telegramUsername?: string;
    avatarUrl?: string;
  }): User {
    this.currentUser = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName.trim() || 'Community Member',
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      telegramUsername: data.telegramUsername?.trim().replace(/^@/, '') || '',
      avatarUrl: data.avatarUrl || DEFAULT_AVATAR,
      createdAt: new Date().toISOString(),
    };
    this.isAuthenticated = true;
    this.saveUser();
    return { ...this.currentUser };
  }

  public updateUserProfile(data: Partial<User>): User {
    this.currentUser = {
      ...this.currentUser,
      ...data,
      avatarUrl: data.avatarUrl || this.currentUser.avatarUrl || DEFAULT_AVATAR,
    };
    this.saveUser();
    return { ...this.currentUser };
  }

  public logout(): void {
    this.isAuthenticated = false;
    this.currentUser = { ...DEFAULT_USER };
    if (typeof window !== 'undefined') {
      localStorage.removeItem('foundhub_current_user_v2');
      localStorage.setItem('foundhub_is_authenticated_v2', 'false');
    }
    Object.assign(CURRENT_USER, this.currentUser);
    this.notify();
  }

  // --- Item Methods ---
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
      // 2. Post Status: default to ACTIVE / published, never draft / pending
      status: item.status || 'ACTIVE',
      // 3. Privacy/Visibility: default to public, isPrivate false
      visibility: item.visibility || 'public',
      isPrivate: item.isPrivate ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      claims: [],
    };
    this.items = [newItem, ...this.items];
    this.save();

    if (isSupabaseConfigured) {
      (async () => {
        try {
          const payload = {
            id: newItem.id,
            user_id: newItem.userId,
            user_data: newItem.user,
            type: newItem.type,
            title: newItem.title,
            category: newItem.category,
            description: newItem.description,
            image_urls: newItem.imageUrls,
            event_date: newItem.eventDate,
            incident_location: newItem.incidentLocation,
            latitude: newItem.latitude,
            longitude: newItem.longitude,
            currentHoldingLocation: newItem.currentHoldingLocation,
            finder_contact_preference: newItem.finderContactPreference,
            secret_verification_question: newItem.secretVerificationQuestion,
            status: newItem.status,
            visibility: newItem.visibility || 'public',
            is_private: newItem.isPrivate ?? false,
            reward_amount: newItem.rewardAmount,
          };
          const { error } = await supabase.from('items').insert(payload);
          if (error) {
            console.warn('Supabase items sync warning:', error.message);
            try {
              await supabase.from('posts').insert(payload);
            } catch {
              // fallback ignore
            }
          }
        } catch (err) {
          console.warn('Supabase items sync exception:', err);
        }
      })();
    }

    return newItem;
  }

  public updateItem(id: string, updates: Partial<Item>): boolean {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();

    if (isSupabaseConfigured) {
      (async () => {
        try {
          const payload: Record<string, any> = {};
          if (updates.title !== undefined) payload.title = updates.title;
          if (updates.category !== undefined) payload.category = updates.category;
          if (updates.description !== undefined) payload.description = updates.description;
          if (updates.incidentLocation !== undefined) payload.incident_location = updates.incidentLocation;
          if (updates.currentHoldingLocation !== undefined) payload.current_holding_location = updates.currentHoldingLocation;
          if (updates.finderContactPreference !== undefined) payload.finder_contact_preference = updates.finderContactPreference;
          if (updates.secretVerificationQuestion !== undefined) payload.secret_verification_question = updates.secretVerificationQuestion;
          if (updates.rewardAmount !== undefined) payload.reward_amount = updates.rewardAmount;
          if (updates.status !== undefined) payload.status = updates.status;
          if (updates.imageUrls !== undefined) payload.image_urls = updates.imageUrls;

          const { error } = await supabase.from('items').update(payload).eq('id', id);
          if (error) console.warn('Supabase update item error:', error.message);
        } catch (err) {
          console.warn('Supabase update item exception:', err);
        }
      })();
    }

    return true;
  }

  public deleteItem(id: string): boolean {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    this.save();

    if (isSupabaseConfigured) {
      (async () => {
        try {
          const { error } = await supabase.from('items').delete().eq('id', id);
          if (error) console.warn('Supabase delete item error:', error.message);
        } catch (err) {
          console.warn('Supabase delete item exception:', err);
        }
      })();
    }

    return true;
  }

  public updateItemStatus(id: string, status: ItemStatus): boolean {
    const item = this.items.find((i) => i.id === id);
    if (!item) return false;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.save();

    if (isSupabaseConfigured) {
      supabase.from('items').update({ status }).eq('id', id).then();
    }

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

    if (isSupabaseConfigured) {
      supabase
        .from('comments')
        .insert({
          id: newComment.id,
          item_id: itemId,
          user_id: newComment.userId,
          user_data: newComment.user,
          content: newComment.content,
          comment_type: newComment.commentType,
          tagged_owner_info: newComment.taggedOwnerInfo,
        })
        .then();
    }

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

    if (isSupabaseConfigured) {
      supabase
        .from('claims')
        .insert({
          id: newClaim.id,
          item_id: itemId,
          claimant_id: newClaim.claimantId,
          claimant_data: newClaim.claimant,
          proof_message: newClaim.proofMessage,
          status: newClaim.status,
        })
        .then();
    }

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

    if (isSupabaseConfigured) {
      supabase.from('claims').update({ status }).eq('id', claimId).then();
      if (status === 'ACCEPTED') {
        supabase.from('items').update({ status: 'RETURNED_TO_OWNER' }).eq('id', itemId).then();
      }
    }

    return true;
  }

  public resetToDefaults() {
    this.items = [];
    this.save();
  }
}

export const dataStore = new StoreManager();

export function openAuthModal(options?: { mode?: 'login' | 'register'; reason?: string }) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('foundhub:open-auth', { detail: options || {} }));
  }
}

export function openEditProfileModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('foundhub:open-edit-profile'));
  }
}

