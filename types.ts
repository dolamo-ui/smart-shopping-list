export const Category = {
  All:          'All',
  FreshProduce: 'Fresh Produce',
  MeatProtein:  'Meat & Protein',
  Dairy:        'Dairy',
  Bakery:       'Bakery',
  Pantry:       'Pantry',
} as const;

export type Category = typeof Category[keyof typeof Category];

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  joinDate: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  userId: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}