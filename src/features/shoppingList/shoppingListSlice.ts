import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // ✅ type-only import

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  notes: string;
  category: string;
  image: string;
  dateAdded: number; // ✅ number for sorting
}

interface ShoppingListState {
  items: ShoppingItem[];
}

const initialState: ShoppingListState = {
  items: [],
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearList: (state) => {
      state.items = [];
    },
    editItem: (
      state,
      action: PayloadAction<{ id: string; updatedData: Partial<ShoppingItem> }>
    ) => {
      const { id, updatedData } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        Object.assign(item, updatedData);
      }
    },
  },
});

export const { addItem, removeItem, clearList, editItem } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
