import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthenticationState } from '../types/authTypes';

const initialState: AuthenticationState = {
  userId: '',
  name: '',
  email: '',
  createdAt: '',
  isAuth: false,
};

export const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<AuthenticationState>) => {
      state = { ...action.payload };
      return state;
    },
    closeSession: state => {
      state = initialState;
      return state;
    },
  },
});

export default authenticationSlice.reducer;
export const { startSession, closeSession } = authenticationSlice.actions;
