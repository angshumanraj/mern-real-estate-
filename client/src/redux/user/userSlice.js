import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart:(state)=>{
      state.loading=true
    },
    updateUserSuccess:(state,action)=>{
      state.currentUser=action.payload;
      state.loading=false;
      state.error=null;
    },
    updateUserFailure:(state,action)=>{
      state.error=action.payload;
      state.error=false;
      state.loading=false
    }
  },
});

export const { signInStart, signInSuccess, signInFailure,updateUserSuccess,updateUserStart,updateUserFailure } = userSlice.actions;

export default userSlice.reducer;