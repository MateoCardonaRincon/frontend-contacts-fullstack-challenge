import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact, ContactState } from '../types/contactsTypes';

const initialState: ContactState = {
  contacts: [],
  currentPhone: '',
  currentContactId: '',
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
      return state;
    },
    cleanContacts: state => {
      state = initialState;
      return state;
    },
    setCurrentPhone: (
      state,
      action: PayloadAction<{
        currentPhone: string;
        currentContactId?: string;
      }>,
    ) => {
      state.currentPhone = action.payload.currentPhone;
      state.currentContactId = action.payload.currentContactId ?? '';
      return state;
    },
    addContact: (
      state,
      action: PayloadAction<{ newContact: Contact; currentPhone: string }>,
    ) => {
      state.contacts = [...state.contacts, action.payload.newContact];
      state.currentPhone = action.payload.currentPhone;
      return state;
    },
    deleteContact: (state, action: PayloadAction<{ contactId: string }>) => {
      state.contacts = state.contacts.filter(
        contact => contact.id !== action.payload.contactId,
      );
      return state;
    },
    updateContact: (
      state,
      action: PayloadAction<{ contactToUpdate: Contact }>,
    ) => {
      state.contacts = state.contacts.map(contact => {
        return contact.id !== action.payload.contactToUpdate.id
          ? contact
          : action.payload.contactToUpdate;
      });
      return state;
    },
  },
});

export default contactsSlice.reducer;
export const {
  loadContacts,
  cleanContacts,
  setCurrentPhone,
  addContact,
  deleteContact,
  updateContact,
} = contactsSlice.actions;
