import React from 'react';
import { LayoutGrid, Leaf, Beef, Milk, Croissant, ShoppingBasket } from 'lucide-react';

interface CategoryConfig {
  bg: string;
  text: string;
  icon: React.ReactNode;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  'All': {
    bg:   '#f1f5f9',
    text: '#334155',
    icon: React.createElement(LayoutGrid,     { size: 12 }),
  },
  'Fresh Produce': {
    bg:   '#d1fae5',
    text: '#065f46',
    icon: React.createElement(Leaf,           { size: 12 }),
  },
  'Meat & Protein': {
    bg:   '#fee2e2',
    text: '#991b1b',
    icon: React.createElement(Beef,           { size: 12 }),
  },
  'Dairy': {
    bg:   '#dbeafe',
    text: '#1e40af',
    icon: React.createElement(Milk,           { size: 12 }),
  },
  'Bakery': {
    bg:   '#fef3c7',
    text: '#92400e',
    icon: React.createElement(Croissant,      { size: 12 }),
  },
  'Pantry': {
    bg:   '#ede9fe',
    text: '#4c1d95',
    icon: React.createElement(ShoppingBasket, { size: 12 }),
  },
};

// Safe fallback for any unknown/stale category value
export const FALLBACK_CATEGORY_CONFIG: CategoryConfig = {
  bg:   '#f1f5f9',
  text: '#334155',
  icon: React.createElement(ShoppingBasket, { size: 12 }),
};