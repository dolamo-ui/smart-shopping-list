import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import registerReducer from '../features/register/registerSlice';
import shoppingListReducer from '../features/shoppingList/shoppingListSlice';
import profileReducer from '../features/profile/profileSlice'; 


export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    shoppingList: shoppingListReducer,
    profile: profileReducer,
  },
});

// Types for useDispatch and useSelector (optional but recommended)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
