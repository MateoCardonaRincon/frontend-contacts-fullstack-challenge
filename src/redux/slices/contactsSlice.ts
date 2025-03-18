import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact, ContactState } from '../types/contactsTypes';
import { contactsData } from '../data';

const initialState: ContactState = {
  contacts: contactsData,
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts: state => {
      state.contacts = contactsData;
    },
    addContact: (state, action: PayloadAction<{ newContact: Contact }>) => {
      state.contacts = [...state.contacts, action.payload.newContact];
    },
    deleteContact: (state, action: PayloadAction<{ contactId: number }>) => {
      state.contacts = state.contacts.filter(
        contact => contact.id !== action.payload.contactId,
      );
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
    },
  },
});

export default contactsSlice.reducer;
export const { loadContacts, addContact, deleteContact, updateContact } =
  contactsSlice.actions;
