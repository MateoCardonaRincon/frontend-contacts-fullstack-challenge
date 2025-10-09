/**
 * @format
 */

import { describe, it, expect } from '@jest/globals';
import { contactsSlice, loadContacts, cleanContacts, setCurrentPhone, addContact, deleteContact, updateContact } from '../../src/redux/slices/contactsSlice';
import { Contact, ContactState } from '../../src/redux/types/contactsTypes';

describe('contactsSlice', () => {
  const initialState: ContactState = {
    contacts: [],
    currentPhone: '',
    currentContactId: '',
  };

  const mockContact: Contact = {
    id: '1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
    name: 'Contact Test',
    cellphone: '3001234567',
    email: 'contacto@mail.com',
    created_at: '2023-01-01',
    is_favorite: false,
    user_id: 'user1',
  };

  describe('loadContacts', () => {
    it('should load contacts into state', () => {
      const contacts = [mockContact];
      const action = loadContacts(contacts);
      const result = contactsSlice.reducer(initialState, action);

      expect(result.contacts).toEqual(contacts);
      expect(result.contacts).toHaveLength(1);
    });
  });

  describe('cleanContacts', () => {
    it('should reset state to initial state', () => {
      const stateWithContacts: ContactState = {
        contacts: [mockContact],
        currentPhone: '3001234567',
        currentContactId: '1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
      };

      const action = cleanContacts();
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result).toEqual(initialState);
      expect(result.contacts).toHaveLength(0);
      expect(result.currentPhone).toBe('');
      expect(result.currentContactId).toBe('');
    });
  });

  describe('setCurrentPhone', () => {
    it('should set current phone and contact id', () => {
      const payload = {
        currentPhone: '3001234567',
        currentContactId: '1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
      };

      const action = setCurrentPhone(payload);
      const result = contactsSlice.reducer(initialState, action);

      expect(result.currentPhone).toBe('3001234567');
      expect(result.currentContactId).toBe('1a85c9a3-446b-4ade-9fef-d7d07db2ca00');
    });

    it('should set current phone without contact id', () => {
      const payload = {
        currentPhone: '3001234567',
      };

      const action = setCurrentPhone(payload);
      const result = contactsSlice.reducer(initialState, action);

      expect(result.currentPhone).toBe('3001234567');
      expect(result.currentContactId).toBe('');
    });
  });

  describe('addContact', () => {
    it('should add new contact to state', () => {
      const payload = {
        newContact: mockContact,
        currentPhone: '3001234567',
      };

      const action = addContact(payload);
      const result = contactsSlice.reducer(initialState, action);

      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0]).toEqual(mockContact);
      expect(result.currentPhone).toBe('3001234567');
    });

    it('should add contact to existing contacts', () => {
      const existingContact: Contact = {
        id: '2b95d8f4-556c-4bce-8fed-e8e18eb3ca11',
        name: 'Contact Test 2',
        cellphone: '3009876543',
        email: 'contacto2@mail.com',
        created_at: '2023-01-02',
        is_favorite: true,
        user_id: 'user1',
      };

      const stateWithContacts: ContactState = {
        contacts: [existingContact],
        currentPhone: '',
        currentContactId: '',
      };

      const payload = {
        newContact: mockContact,
        currentPhone: '3001234567',
      };

      const action = addContact(payload);
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result.contacts).toHaveLength(2);
      expect(result.contacts[1]).toEqual(mockContact);
    });
  });

  describe('deleteContact', () => {
    it('should remove contact from state', () => {
      const stateWithContacts: ContactState = {
        contacts: [mockContact],
        currentPhone: '',
        currentContactId: '',
      };

      const payload = { contactId: '1a85c9a3-446b-4ade-9fef-d7d07db2ca00' };
      const action = deleteContact(payload);
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result.contacts).toHaveLength(0);
    });

    it('should not affect state if contact not found', () => {
      const stateWithContacts: ContactState = {
        contacts: [mockContact],
        currentPhone: '',
        currentContactId: '',
      };

      const payload = { contactId: 'non-existent' };
      const action = deleteContact(payload);
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0]).toEqual(mockContact);
    });
  });

  describe('updateContact', () => {
    it('should update existing contact in state', () => {
      const stateWithContacts: ContactState = {
        contacts: [mockContact],
        currentPhone: '',
        currentContactId: '',
      };

      const updatedContact: Contact = {
        ...mockContact,
        name: 'Updated Name',
        cellphone: '3111111111',
        email: 'updated@email.com',
      };

      const payload = { contactToUpdate: updatedContact };
      const action = updateContact(payload);
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0]).toEqual(updatedContact);
      expect(result.contacts[0].name).toBe('Updated Name');
      expect(result.contacts[0].cellphone).toBe('3111111111');
      expect(result.contacts[0].email).toBe('updated@email.com');
    });

    it('should not affect other contacts when updating specific contact', () => {
      const secondContact: Contact = {
        id: '2b95d8f4-556c-4bce-8fed-e8e18eb3ca11',
        name: 'Contact Test 2',
        cellphone: '3009876543',
        email: 'contacto2@mail.com',
        created_at: '2023-01-02',
        is_favorite: true,
        user_id: 'user1',
      };

      const stateWithContacts: ContactState = {
        contacts: [mockContact, secondContact],
        currentPhone: '',
        currentContactId: '',
      };

      const updatedContact: Contact = {
        ...mockContact,
        name: 'Updated First Contact',
      };

      const payload = { contactToUpdate: updatedContact };
      const action = updateContact(payload);
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result.contacts).toHaveLength(2);
      expect(result.contacts[0].name).toBe('Updated First Contact');
      expect(result.contacts[1]).toEqual(secondContact); // Second contact unchanged
    });

    it('should not update anything if contact not found', () => {
      const stateWithContacts: ContactState = {
        contacts: [mockContact],
        currentPhone: '',
        currentContactId: '',
      };

      const nonExistentContact: Contact = {
        id: 'non-existent-id',
        name: 'Non Existent',
        cellphone: '3000000000',
        email: 'none@email.com',
        created_at: '2023-01-03',
        is_favorite: false,
        user_id: 'user1',
      };

      const payload = { contactToUpdate: nonExistentContact };
      const action = updateContact(payload);
      const result = contactsSlice.reducer(stateWithContacts, action);

      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0]).toEqual(mockContact); // Original contact unchanged
    });
  });
});
