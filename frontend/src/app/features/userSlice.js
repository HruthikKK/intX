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
  }
});

export const { signInSuccess} = userSlice.actions;

export default userSlice.reducer;
