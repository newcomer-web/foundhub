import { Item, User, Comment, ItemClaim, ItemType, ItemCategory, ItemStatus } from './types';

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
