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
import { MainMenuButtonsGroup } from '../../src/components/molecules/MainMenuButtonsGroup';
import { contactsSlice } from '../../src/redux/slices/contactsSlice';
import { Contact } from '../../src/redux/types/contactsTypes';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock RegularButtom
jest.mock('../../src/components/atoms/buttons/RegularButtom', () => {
  return {
    RegularButtom: ({ text, action }: { text: string; action: () => void }) => {
      const { TouchableOpacity, Text } = require('react-native');
      const mockReact = require('react');
      return mockReact.createElement(
        TouchableOpacity,
        {
          testID: `regular-button-${text}`,
          onPress: action,
        },
        mockReact.createElement(Text, {}, text),
      );
    },
  };
});

const mockContacts: Contact[] = [
  {
    id: 'contact1',
    name: 'Pedro Jiménez',
    cellphone: '3001234567',
    email: 'pedro.jimenez@email.com',
    created_at: '2025-01-18T10:00:00.000000',
    is_favorite: false,
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

describe('MainMenuButtonsGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render create button correctly', () => {
    render(
      <TestWrapper>
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('Crear')).toBeTruthy();
    expect(screen.getByTestId('regular-button-Crear')).toBeTruthy();
  });

  it('should navigate to create screen when phone is valid and unique', async () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="3009876543">
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    const createButton = screen.getByTestId('regular-button-Crear');

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'CreateContactScreen',
      );
    });
  });

  it('should show error when phone is not numeric', async () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="abc123">
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    const createButton = screen.getByTestId('regular-button-Crear');

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El número de teléfono debe ser numérico',
      );
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('should show error when phone already exists', async () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="3001234567">
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    const createButton = screen.getByTestId('regular-button-Crear');

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El número de teléfono ya está registrado',
      );
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('should handle empty current phone', async () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="">
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    const createButton = screen.getByTestId('regular-button-Crear');

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El número de teléfono debe ser numérico',
      );
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('should work with empty contacts array', async () => {
    render(
      <TestWrapper contacts={[]} currentPhone="3009876543">
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    const createButton = screen.getByTestId('regular-button-Crear');

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'CreateContactScreen',
      );
    });
  });

  it('should handle phone with special characters', async () => {
    render(
      <TestWrapper contacts={mockContacts} currentPhone="300-123-4567">
        <MainMenuButtonsGroup navigation={mockNavigation} />
      </TestWrapper>,
    );

    const createButton = screen.getByTestId('regular-button-Crear');

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El número de teléfono debe ser numérico',
      );
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });
});
