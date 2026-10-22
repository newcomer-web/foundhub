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

// Initial clean empty items array (ready for real user submissions)
export const INITIAL_ITEMS: Item[] = [];

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
          this.items = JSON.parse(saved);
        } catch {
          this.items = [...INITIAL_ITEMS];
        }
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
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const remoteItems: Item[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          user: row.user_data || DEFAULT_USER,
          type: row.type,
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
          status: row.status,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      claims: [],
    };
    this.items = [newItem, ...this.items];
    this.save();

    if (isSupabaseConfigured) {
      supabase
        .from('items')
        .insert({
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
          current_holding_location: newItem.currentHoldingLocation,
          finder_contact_preference: newItem.finderContactPreference,
          secret_verification_question: newItem.secretVerificationQuestion,
          status: newItem.status,
          reward_amount: newItem.rewardAmount,
        })
        .then();
    }

    return newItem;
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

