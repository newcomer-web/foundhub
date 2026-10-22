import { Item, User, Comment, ItemClaim, ItemType, ItemCategory, ItemStatus } from './types';

// Active user session profile
export const CURRENT_USER: User = {
  id: 'usr-current-1',
  email: 'user@foundhub.app',
  fullName: 'Community Member',
  phone: null,
  telegramUsername: null,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
};

export const MOCK_USERS: Record<string, User> = {
  'usr-current-1': CURRENT_USER,
};

// Initial clean empty items array (ready for real user submissions)
export const INITIAL_ITEMS: Item[] = [];

// Helper to manage state in memory / client-side storage
class StoreManager {
  private items: Item[] = [...INITIAL_ITEMS];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foundhub_items_v3');
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
      localStorage.setItem('foundhub_items_v3', JSON.stringify(this.items));
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
    this.items = [];
    this.save();
  }
}

export const dataStore = new StoreManager();
