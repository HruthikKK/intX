import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openedBlogId: null, // Store the ID of the currently opened blog
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setOpenedBlogId: (state, action) => {
      state.openedBlogId = action.payload; // Set the ID of the currently opened blog
    },
    clearOpenedBlogId: (state) => {
      state.openedBlogId = null; // Clear the currently opened blog ID
    },
  },
});

export const { setOpenedBlogId, clearOpenedBlogId } = blogSlice.actions;

export default blogSlice.reducer;
