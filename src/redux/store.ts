import { configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/authenticationSlice';
import contactsSlice from './slices/contactsSlice';

export const store = configureStore({
  reducer: {
    contacts: contactsSlice,
    authentication: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
