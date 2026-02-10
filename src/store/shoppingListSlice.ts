import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingItem, Category } from '../../types';

interface ShoppingListState {
  items: ShoppingItem[];
}

const initialState: ShoppingListState = {
  items: []
};

// ✅ Helper function to ensure quantity is always a number
const normalizeQuantity = (quantity: string | number | undefined): number => {
  if (quantity === undefined) return 1;
  return typeof quantity === 'string' ? parseInt(quantity) || 1 : quantity;
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    // ✅ Add new item - ensures quantity is a number
    addItem: (state, action: PayloadAction<any>) => {
      const newItem: ShoppingItem = {
        id: action.payload.id,
        name: action.payload.name,
        quantity: normalizeQuantity(action.payload.quantity), // ✅ Convert to number
        category: action.payload.category as Category,
        notes: action.payload.notes || '',
        attachmentUrl: action.payload.attachmentUrl,
        attachmentName: action.payload.attachmentName,
        userId: action.payload.userId || '',
        createdAt: action.payload.createdAt || Date.now()
      };
      state.items.push(newItem);
    },
    
    // ✅ Edit existing item - ensures quantity is a number
    editItem: (state, action: PayloadAction<{ id: string; updatedData: any }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        const updates = action.payload.updatedData;
        state.items[index] = {
          ...state.items[index],
          name: updates.name !== undefined ? updates.name : state.items[index].name,
          quantity: updates.quantity !== undefined 
            ? normalizeQuantity(updates.quantity) // ✅ Convert to number
            : state.items[index].quantity,
          category: updates.category !== undefined ? updates.category : state.items[index].category,
          notes: updates.notes !== undefined ? updates.notes : state.items[index].notes,
          attachmentUrl: updates.attachmentUrl !== undefined ? updates.attachmentUrl : state.items[index].attachmentUrl,
          attachmentName: updates.attachmentName !== undefined ? updates.attachmentName : state.items[index].attachmentName,
          userId: updates.userId !== undefined ? updates.userId : state.items[index].userId
        };
      }
    },
    
    // Remove item by id
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    // Optional: Clear all items
    clearItems: (state) => {
      state.items = [];
    },
    
    // Optional: Load items (useful for persistence)
    loadItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      // ✅ Normalize all quantities when loading
      state.items = action.payload.map(item => ({
        ...item,
        quantity: normalizeQuantity(item.quantity)
      }));
    }
  }
});

export const { addItem, editItem, removeItem, clearItems, loadItems } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;