// Replace enum with const object and type
export const Category = {
  Groceries: 'Groceries',
  Household: 'Household',
  Electronics: 'Electronics',
  Pharmacy: 'Pharmacy',
  Fashion: 'Fashion',
  Other: 'Other'
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
  category: Category;
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