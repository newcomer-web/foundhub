export type ItemType = 'FOUND' | 'LOST';

export type ItemCategory =
  | 'ELECTRONICS'
  | 'DOCUMENTS_AND_IDS'
  | 'WALLETS_AND_BAGS'
  | 'KEYS'
  | 'JEWELRY_AND_WATCHES'
  | 'CLOTHING'
  | 'PETS'
  | 'OTHER';

export type ItemStatus =
  | 'ACTIVE'
  | 'CLAIM_PENDING'
  | 'RETURNED_TO_OWNER'
  | 'ARCHIVED';

export type CommentType =
  | 'GENERAL'
  | 'OWNER_LEAD'
  | 'OFFICIAL_UPDATE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  telegramUsername?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface ItemClaim {
  id: string;
  itemId: string;
  claimantId: string;
  claimant?: User;
  proofMessage: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface Comment {
  id: string;
  itemId: string;
  userId: string;
  user?: User;
  content: string;
  commentType: CommentType;
  taggedOwnerInfo?: string | null;
  createdAt: string;
}

export interface Item {
  id: string;
  userId: string;
  user?: User;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  imageUrls: string[];
  
  // Incident details
  eventDate: string; // ISO date string
  incidentLocation: string;
  latitude?: number | null;
  longitude?: number | null;
  
  // Current Custody & Finder info
  currentHoldingLocation: string;
  finderContactPreference: string;
  
  // Anti-Fraud Verification
  secretVerificationQuestion?: string | null;
  
  status: ItemStatus;
  rewardAmount?: number | null;
  createdAt: string;
  updatedAt: string;
  
  comments?: Comment[];
  claims?: ItemClaim[];
}

export interface CategoryInfo {
  label: string;
  iconName: string;
  colorClass: string;
  badgeClass: string;
  description: string;
}

export const CATEGORY_MAP: Record<ItemCategory, CategoryInfo> = {
  ELECTRONICS: {
    label: 'Electronics',
    iconName: 'Laptop',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Phones, laptops, headphones, chargers, smartwatches',
  },
  DOCUMENTS_AND_IDS: {
    label: 'Documents & IDs',
    iconName: 'FileText',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Passports, national IDs, student cards, driver licenses',
  },
  WALLETS_AND_BAGS: {
    label: 'Wallets & Bags',
    iconName: 'Briefcase',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Wallets, backpacks, purses, luggage, tote bags',
  },
  KEYS: {
    label: 'Keys & Fobs',
    iconName: 'Key',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Car keys, house keys, dorm keys, RFID key fobs',
  },
  JEWELRY_AND_WATCHES: {
    label: 'Jewelry & Watches',
    iconName: 'Watch',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Rings, necklaces, luxury watches, bracelets, earrings',
  },
  CLOTHING: {
    label: 'Clothing & Apparel',
    iconName: 'Shirt',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Jackets, sunglasses, hats, shoes, athletic wear',
  },
  PETS: {
    label: 'Pets & Animals',
    iconName: 'Dog',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Dogs, cats, birds, and other missing or found pets',
  },
  OTHER: {
    label: 'Other Items',
    iconName: 'HelpCircle',
    colorClass: 'text-zinc-300 bg-[#161a24] border-[#262c3e]',
    badgeClass: 'bg-[#161a24] text-zinc-200 border-[#262c3e] font-mono text-[11px]',
    description: 'Books, sports gear, musical instruments, umbrellas',
  },
};
