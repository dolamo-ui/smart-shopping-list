import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingItem, Category } from '../../types';

interface ShoppingListState {
  items: ShoppingItem[];
}

const initialState: ShoppingListState = {
  items: []
};

// ─── LocalStorage helpers (keyed per user) ───────────────────────────────────

export const saveItemsForUser = (userId: string, items: ShoppingItem[]) => {
  try {
    localStorage.setItem(`shopping_items_${userId}`, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to localStorage', e);
  }
};

export const loadItemsForUser = (userId: string): ShoppingItem[] => {
  try {
    const raw = localStorage.getItem(`shopping_items_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load items from localStorage', e);
    return [];
  }
};

// ─── Quantity normalizer ──────────────────────────────────────────────────────

const normalizeQuantity = (quantity: string | number | undefined): number => {
  if (quantity === undefined) return 1;
  return typeof quantity === 'string' ? parseInt(quantity) || 1 : quantity;
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    /** Call this right after login to hydrate the store from localStorage */
    loadItemsFromStorage: (state, action: PayloadAction<string>) => {
      state.items = loadItemsForUser(action.payload);
    },

    /** Call this on logout to clear items from the store (not localStorage) */
    clearItems: (state) => {
      state.items = [];
    },

    addItem: (state, action: PayloadAction<any>) => {
      const newItem: ShoppingItem = {
        id: action.payload.id,
        name: action.payload.name,
        quantity: normalizeQuantity(action.payload.quantity),
        category: action.payload.category as Category,
        notes: action.payload.notes || '',
        attachmentUrl: action.payload.attachmentUrl,
        attachmentName: action.payload.attachmentName,
        userId: action.payload.userId || '',
        createdAt: action.payload.createdAt || Date.now()
      };
      state.items.push(newItem);
      // Persist immediately
      saveItemsForUser(newItem.userId, state.items);
    },

    editItem: (state, action: PayloadAction<{ id: string; updatedData: any }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        const updates = action.payload.updatedData;
        state.items[index] = {
          ...state.items[index],
          name: updates.name ?? state.items[index].name,
          quantity: updates.quantity !== undefined
            ? normalizeQuantity(updates.quantity)
            : state.items[index].quantity,
          category: updates.category ?? state.items[index].category,
          notes: updates.notes ?? state.items[index].notes,
          attachmentUrl: updates.attachmentUrl ?? state.items[index].attachmentUrl,
          attachmentName: updates.attachmentName ?? state.items[index].attachmentName,
          userId: updates.userId ?? state.items[index].userId
        };
        // Persist immediately
        saveItemsForUser(state.items[index].userId, state.items);
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      const userId = item?.userId;
      state.items = state.items.filter(i => i.id !== action.payload);
      if (userId) saveItemsForUser(userId, state.items);
    },

    loadItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload.map(item => ({
        ...item,
        quantity: normalizeQuantity(item.quantity)
      }));
    }
  }
});

export const {
  addItem,
  editItem,
  removeItem,
  clearItems,
  loadItems,
  loadItemsFromStorage
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;