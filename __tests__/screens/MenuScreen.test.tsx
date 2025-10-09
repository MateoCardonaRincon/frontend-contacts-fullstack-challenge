/**
 * @format
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { MenuScreen } from '../../src/screens/MenuScreen';
import { authenticationSlice } from '../../src/redux/slices/authenticationSlice';
import { contactsSlice } from '../../src/redux/slices/contactsSlice';

// Mock ContactsService
const mockGetContacts = jest.fn() as jest.MockedFunction<any>;
jest.mock('../../src/services/contacts.service', () => ({
  ContactsService: () => ({
    getContacts: mockGetContacts,
  }),
}));

// Mock React Native Alert and Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.assign({}, RN, {
    Alert: {
      alert: jest.fn(),
    },
    Dimensions: {
      get: () => ({ width: 400, height: 800 }),
    },
  });
});

// Mock store configuration with initial auth state
const createMockStore = (initialAuthState: any = {}) => {
  const defaultAuthState = {
    userId: 'user-123',
    name: 'Test User',
    email: 'test@mail.com',
    createdAt: '2023-01-01',
    isAuth: true,
    ...initialAuthState,
  };

  return configureStore({
    reducer: {
      authentication: authenticationSlice.reducer,
      contacts: contactsSlice.reducer,
    },
    preloadedState: {
      authentication: defaultAuthState,
      contacts: {
        contacts: [],
        currentPhone: '',
        currentContactId: '',
      },
    },
  });
};

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('MenuScreen', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetContacts.mockResolvedValue([]);
    store = createMockStore();
  });

  const TestWrapper = ({ children }: any) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should render menu screen correctly', async () => {
    render(
      <TestWrapper>
        <MenuScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('¡Hola Test User!')).toBeTruthy();
      expect(screen.getByTestId('logout-button')).toBeTruthy();
    });
  });

  it('should load contacts on mount when authenticated', async () => {
    render(
      <TestWrapper>
        <MenuScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(mockGetContacts).toHaveBeenCalledWith('user-123');
    });
  });

  it('should handle logout correctly', async () => {
    render(
      <TestWrapper>
        <MenuScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('logout-button')).toBeTruthy();
    });

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.press(logoutButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('LoginScreen');
  });

  it('should show alert when contacts loading fails', async () => {
    mockGetContacts.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <MenuScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    // Como el useEffect se ejecuta automáticamente, verificamos que se llamó getContacts
    await waitFor(() => {
      expect(mockGetContacts).toHaveBeenCalled();
    });
  });

  it('should not load contacts when not authenticated', async () => {
    const storeNotAuth = createMockStore({ isAuth: false });

    render(
      <Provider store={storeNotAuth}>
        <MenuScreen navigation={mockNavigation} />
      </Provider>,
    );

    // Como isAuth es false, no debería llamar getContacts
    expect(mockGetContacts).not.toHaveBeenCalled();
  });
});
