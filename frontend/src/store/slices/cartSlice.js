import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Validate quantity
      if (item.quantity <= 0) {
        console.error('Quantity must be greater than 0');
        return;
      }

      const existingItem = state.items.find((x) => x.book === item.book);

      if (existingItem) {
        // Update quantity if the item already exists
        existingItem.quantity += item.quantity;
      } else {
        // Add new item to the cart
        state.items.push(item);
      }

      // Update localStorage
      try {
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      } catch (error) {
        console.error('Failed to update localStorage:', error);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((x) => x.book !== action.payload);

      // Update localStorage
      try {
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      } catch (error) {
        console.error('Failed to update localStorage:', error);
      }
    },
    updateQuantity: (state, action) => {
      const { book, quantity } = action.payload;

      // Validate quantity
      if (quantity <= 0) {
        console.error('Quantity must be greater than 0');
        return;
      }

      const item = state.items.find((x) => x.book === book);
      if (item) {
        item.quantity = quantity;

        // Update localStorage
        try {
          localStorage.setItem('cartItems', JSON.stringify(state.items));
        } catch (error) {
          console.error('Failed to update localStorage:', error);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];

      // Remove from localStorage
      try {
        localStorage.removeItem('cartItems');
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;