
import React from 'react';
import { ShoppingCart, Home, Smartphone, Pill, Shirt, PlusCircle } from 'lucide-react';
import { Category } from './types';

export const CATEGORY_CONFIG: Record<Category, { icon: React.ReactNode; color: string; bg: string }> = {
  [Category.Groceries]: {
    icon: <ShoppingCart size={16} />,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/30 dark:text-green-400'
  },
  [Category.Household]: {
    icon: <Home size={16} />,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
  },
  [Category.Electronics]: {
    icon: <Smartphone size={16} />,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
  },
  [Category.Pharmacy]: {
    icon: <Pill size={16} />,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/30 dark:text-red-400'
  },
  [Category.Fashion]: {
    icon: <Shirt size={16} />,
    color: 'text-pink-600',
    bg: 'bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400'
  },
  [Category.Other]: {
    icon: <PlusCircle size={16} />,
    color: 'text-slate-600',
    bg: 'bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
  }
};
