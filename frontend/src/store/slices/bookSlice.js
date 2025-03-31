import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  featuredBooks: [],
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFeaturedBooks: (state, action) => {
      state.featuredBooks = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setBooks, setFeaturedBooks, setLoading, setError } = bookSlice.actions;
export default bookSlice.reducer;
