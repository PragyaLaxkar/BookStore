import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import bookReducer from './slices/bookSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    book: bookReducer,
  },
});
