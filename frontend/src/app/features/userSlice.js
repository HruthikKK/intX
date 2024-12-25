import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null, // Store only user details
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Store user details when sign-in is successful
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    deleteSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    editSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  }
});

export const { signInSuccess, signoutSuccess, deleteSuccess, editSuccess} = userSlice.actions;

export default userSlice.reducer;
