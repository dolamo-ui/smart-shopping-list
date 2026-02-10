import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import shoppingListReducer from './shoppingListSlice';
import profileReducer from './profileSlice';
import registerReducer from './registerSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    shoppingList: shoppingListReducer,
    profile: profileReducer,
    register: registerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;