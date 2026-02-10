import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string; 
  notes?: string;        // ✅ Made optional
  category: string;
  image?: string;        // ✅ Made optional
  dateAdded: number;
  userId?: string;       // ✅ Added userId
  createdAt?: number;    // ✅ Added createdAt
}

interface ShoppingListState {
  items: ShoppingItem[];
}

// Load from localStorage on init
const loadFromLocalStorage = (): ShoppingItem[] => {
  try {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: ShoppingListState = {
  items: loadFromLocalStorage(),
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload);
      localStorage.setItem('shoppingList', JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('shoppingList', JSON.stringify(state.items));
    },
    clearList: (state) => {
      state.items = [];
      localStorage.removeItem('shoppingList');
    },
    editItem: (
      state,
      action: PayloadAction<{ id: string; updatedData: Partial<ShoppingItem> }>
    ) => {
      const { id, updatedData } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        Object.assign(item, updatedData);
        localStorage.setItem('shoppingList', JSON.stringify(state.items));
      }
    },
  },
});

export const { addItem, removeItem, clearList, editItem } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;