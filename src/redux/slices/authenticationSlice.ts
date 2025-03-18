import { createSlice } from '@reduxjs/toolkit';
import { AuthenticationState } from '../types/authTypes';

const initialState: AuthenticationState = {
  isAuth: false,
};

export const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startSession: state => {
      state.isAuth = true;
    },
    closeSession: state => {
      state.isAuth = false;
    },
  },
});

export default authenticationSlice.reducer;
export const { startSession, closeSession } =
authenticationSlice.actions;
