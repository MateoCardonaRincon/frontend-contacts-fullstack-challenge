import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, jest } from '@jest/globals';
import { ContactCardPanel } from '../../src/components/molecules/ContactCardPanel';
import { contactsSlice } from '../../src/redux/slices/contactsSlice';
import { Contact } from '../../src/redux/types/contactsTypes';

jest.mock('../../src/components/atoms/ContactInfoCard', () => {
  return {
    ContactInfoCard: ({ contact }: { contact: any }) => {
      const { Text } = require('react-native');
      const mockReact = require('react');
      return mockReact.createElement(
        Text,
        { testID: `contact-card-${contact.id}` },
        contact.name,
      );
    },
  };
});

jest.mock('../../src/components/atoms/labels/RegularLabel', () => {
  return {
    RegularLabel: ({ text }: { text: string }) => {
      const { Text } = require('react-native');
      const mockReact = require('react');
      return mockReact.createElement(Text, { testID: 'regular-label' }, text);
    },
  };
});

const mockContacts: Contact[] = [
  {
    id: 'contact1',
    name: 'Ana Martínez',
    cellphone: '3001234567',
    email: 'ana.martinez@email.com',
    created_at: '2025-01-18T10:00:00.000000',
    is_favorite: false,
    user_id: 'user123',
  },
  {
    id: 'contact2',
    name: 'Carlos Rodríguez',
    cellphone: '3009876543',
    email: 'carlos.rodriguez@email.com',
    created_at: '2025-01-18T11:00:00.000000',
    is_favorite: true,
    user_id: 'user123',
  },
];

const createMockStore = (
  contacts: Contact[] = [],
  currentPhone: string = '',
) => {
  return configureStore({
    reducer: {
      contacts: contactsSlice.reducer,
    },
    preloadedState: {
      contacts: {
        contacts,
        currentPhone,
        currentContactId: '',
      },
    },
  });
};

const TestWrapper = ({
  children,
  contacts = [],
  currentPhone = '',
}: {
  children: React.ReactNode;
  contacts?: Contact[];
  currentPhone?: string;
}) => {
  const store = createMockStore(contacts, currentPhone);
  return <Provider store={store}>{children}</Provider>;
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  setParams: jest.fn(),
};

describe('ContactCardPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render contacts list with correct count', () => {
    render(
      <TestWrapper contacts={mockContacts}>
        <ContactCardPanel navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Mis contactos (2)')).toBeTruthy();
    expect(screen.getByTestId('contact-card-contact1')).toBeTruthy();
    expect(screen.getByTestId('contact-card-contact2')).toBeTruthy();
  });

  it('should render empty state when no contacts', () => {
    render(
      <TestWrapper contacts={[]}>
        <ContactCardPanel navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Mis contactos (0)')).toBeTruthy();
    expect(screen.getByText('No hay contactos para mostrar')).toBeTruthy();
  });

  it('should filter contacts by current phone', () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="300123">
        <ContactCardPanel navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Mis contactos (2)')).toBeTruthy();
    expect(screen.getByTestId('contact-card-contact1')).toBeTruthy();
    expect(screen.queryByTestId('contact-card-contact2')).toBeNull();
  });

  it('should show all contacts when current phone is empty', () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="">
        <ContactCardPanel navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Mis contactos (2)')).toBeTruthy();
    expect(screen.getByTestId('contact-card-contact1')).toBeTruthy();
    expect(screen.getByTestId('contact-card-contact2')).toBeTruthy();
  });

  it('should handle single contact', () => {
    const singleContact = [mockContacts[0]];

    render(
      <TestWrapper contacts={singleContact}>
        <ContactCardPanel navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Mis contactos (1)')).toBeTruthy();
    expect(screen.getByTestId('contact-card-contact1')).toBeTruthy();
  });

  it('should filter and show no results when phone filter does not match', () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="555">
        <ContactCardPanel navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Mis contactos (2)')).toBeTruthy();
    expect(screen.queryByTestId('contact-card-contact1')).toBeNull();
    expect(screen.queryByTestId('contact-card-contact2')).toBeNull();
  });
});
