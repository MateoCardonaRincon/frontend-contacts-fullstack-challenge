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
import { SignInScreen } from '../../src/screens/SignInScreen';
import { authenticationSlice } from '../../src/redux/slices/authenticationSlice';

// Mock AuthenticationService
const mockSignIn = jest.fn() as jest.MockedFunction<any>;
jest.mock('../../src/services/auth.service', () => ({
  AuthenticationService: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock store configuration
const createMockStore = () => {
  return configureStore({
    reducer: {
      authentication: authenticationSlice.reducer,
    },
  });
};

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock React Native Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.assign({}, RN, {
    Alert: {
      alert: jest.fn(),
    },
  });
});

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('SignInScreen', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createMockStore();
  });

  const TestWrapper = ({ children }: any) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should render sign in form correctly', () => {
    render(
      <TestWrapper>
        <SignInScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    expect(screen.getByText('¡Regístrate!')).toBeTruthy();
    expect(screen.getByText('Nombre:')).toBeTruthy();
    expect(screen.getByText('Correo electrónico:')).toBeTruthy();
    expect(screen.getByText('Contraseña:')).toBeTruthy();
    expect(screen.getByText('Repite la contraseña:')).toBeTruthy();
    expect(screen.getAllByTestId('custom-input')).toHaveLength(4);
  });

  it('should show alert when passwords do not match', async () => {
    const { Alert } = require('react-native');

    render(
      <TestWrapper>
        <SignInScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    const inputs = screen.getAllByTestId('custom-input');
    const passwordInput = inputs[2];
    const confirmPasswordInput = inputs[3];

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'different');

    const signInButton = screen.getByTestId('signin-button');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
    });
  });

  it('should show alert for invalid email format', async () => {
    const { Alert } = require('react-native');

    render(
      <TestWrapper>
        <SignInScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    const inputs = screen.getAllByTestId('custom-input');
    const emailInput = inputs[1];
    const passwordInput = inputs[2];
    const confirmPasswordInput = inputs[3];

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    const signInButton = screen.getByTestId('signin-button');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El email no tiene un formato válido',
      );
    });
  });

  it('should handle successful sign in', async () => {
    const mockResponse = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@mail.com',
      created_at: '2023-01-01',
    };
    mockSignIn.mockResolvedValueOnce(mockResponse);

    render(
      <TestWrapper>
        <SignInScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    const inputs = screen.getAllByTestId('custom-input');
    const nameInput = inputs[0];
    const emailInput = inputs[1];
    const passwordInput = inputs[2];
    const confirmPasswordInput = inputs[3];

    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@mail.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    const signInButton = screen.getByTestId('signin-button');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@mail.com',
        name: 'Test User',
        pw: 'password123',
      });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MenuScreen');
    });
  });

  it('should handle failed sign in (user already exists)', async () => {
    const { Alert } = require('react-native');
    mockSignIn.mockResolvedValueOnce(null);

    render(
      <TestWrapper>
        <SignInScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    const inputs = screen.getAllByTestId('custom-input');
    const nameInput = inputs[0];
    const emailInput = inputs[1];
    const passwordInput = inputs[2];
    const confirmPasswordInput = inputs[3];

    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'existing@mail.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    const signInButton = screen.getByTestId('signin-button');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Ya existe un usuario registrado con este correo',
      );
    });
  });

  it('should navigate back to login screen', () => {
    render(
      <TestWrapper>
        <SignInScreen navigation={mockNavigation} />
      </TestWrapper>,
    );

    const backButton = screen.getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('LoginScreen');
  });

  afterEach(() => {
    mockConsoleLog.mockClear();
  });
});
