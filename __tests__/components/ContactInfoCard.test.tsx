/**
 * @format
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { ContactInfoCard } from '../../src/components/atoms/ContactInfoCard';
import { contactsSlice } from '../../src/redux/slices/contactsSlice';
import { Contact } from '../../src/redux/types/contactsTypes';
import { ContactsService } from '../../src/services/contacts.service';

jest.spyOn(Alert, 'alert');

jest.mock('../../src/services/contacts.service', () => ({
  ContactsService: jest.fn(),
}));

const mockDeleteContact = jest.fn() as jest.MockedFunction<any>;
const mockContactsService = {
  deleteContact: mockDeleteContact,
};

jest.mock('../../src/components/atoms/buttons/RegularButtom', () => {
  return {
    RegularButtom: ({ text, action }: { text: string; action: () => void }) => {
      const { TouchableOpacity, Text } = require('react-native');
      const mockReact = require('react');
      return mockReact.createElement(
        TouchableOpacity,
        {
          testID: `button-${text}`,
          onPress: action,
        },
        mockReact.createElement(Text, {}, text),
      );
    },
  };
});

const createMockStore = (contacts: Contact[] = []) => {
  return configureStore({
    reducer: {
      contacts: contactsSlice.reducer,
    },
    preloadedState: {
      contacts: {
        contacts: contacts,
        currentPhone: '',
        currentContactId: '',
      },
    },
  });
};

const TestWrapper = ({
  children,
  contacts = [],
}: {
  children: React.ReactNode;
  contacts?: Contact[];
}) => {
  const store = createMockStore(contacts);
  return <Provider store={store}>{children}</Provider>;
};

const mockContact: Contact = {
  id: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890',
  name: 'María García',
  cellphone: '3001234567',
  email: 'maria.garcia@email.com',
  created_at: '2025-01-18T10:00:00.000000',
  is_favorite: false,
  user_id: 'user123',
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  setParams: jest.fn(),
};

describe('ContactInfoCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ContactsService as jest.Mock).mockReturnValue(mockContactsService);
  });

  it('should render contact information correctly', () => {
    render(
      <TestWrapper contacts={[mockContact]}>
        <ContactInfoCard contact={mockContact} navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Nombre: María García')).toBeTruthy();
    expect(screen.getByText('Teléfono: 3001234567')).toBeTruthy();
    expect(
      screen.getByText('Correo electrónico: maria.garcia@email.com'),
    ).toBeTruthy();
    expect(screen.getByTestId('button-Eliminar')).toBeTruthy();
    expect(screen.getByTestId('button-Actualizar')).toBeTruthy();
  });

  it('should handle contact without email', () => {
    const contactWithoutEmail: Contact = {
      ...mockContact,
      email: '',
    };

    render(
      <TestWrapper contacts={[contactWithoutEmail]}>
        <ContactInfoCard
          contact={contactWithoutEmail}
          navigation={mockNavigation}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Nombre: María García')).toBeTruthy();
    expect(screen.getByText('Teléfono: 3001234567')).toBeTruthy();
    expect(screen.queryByText('Correo electrónico:')).toBeNull();
  });

  it('should delete contact successfully', async () => {
    mockDeleteContact.mockResolvedValue({ id: mockContact.id });

    render(
      <TestWrapper contacts={[mockContact]}>
        <ContactInfoCard contact={mockContact} navigation={mockNavigation} />
      </TestWrapper>,
    );

    const deleteButton = screen.getByTestId('button-Eliminar');

    await act(async () => {
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(mockDeleteContact).toHaveBeenCalledWith(mockContact.id);
      expect(Alert.alert).toHaveBeenCalledWith('¡Contacto eliminado!');
    });
  });

  it('should show error when delete contact fails', async () => {
    mockDeleteContact.mockResolvedValue(null);

    render(
      <TestWrapper contacts={[mockContact]}>
        <ContactInfoCard contact={mockContact} navigation={mockNavigation} />
      </TestWrapper>,
    );

    const deleteButton = screen.getByTestId('button-Eliminar');

    await act(async () => {
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(mockDeleteContact).toHaveBeenCalledWith(mockContact.id);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Ocurrió un error eliminando el contacto',
      );
    });
  });

  it('should navigate to update screen when update button is pressed', async () => {
    render(
      <TestWrapper contacts={[mockContact]}>
        <ContactInfoCard contact={mockContact} navigation={mockNavigation} />
      </TestWrapper>,
    );

    const updateButton = screen.getByTestId('button-Actualizar');

    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'UpdateContactScreen',
      );
    });
  });

  it('should render with empty Redux store', () => {
    render(
      <TestWrapper>
        <ContactInfoCard contact={mockContact} navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Nombre: María García')).toBeTruthy();
  });
});
