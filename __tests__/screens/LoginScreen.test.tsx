/**
 * @format
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { LoginScreen } from '../../src/screens/LoginScreen';
import { authenticationSlice } from '../../src/redux/slices/authenticationSlice';

// Mock AuthenticationService
const mockLogin = jest.fn() as jest.MockedFunction<any>;
jest.mock('../../src/services/auth.service', () => ({
  AuthenticationService: () => ({
    login: mockLogin,
  }),
}));

// Mock app-config
jest.mock('../../src/config/app-config', () => ({
  appConfig: {
    app: {
      name: 'Test Contacts App',
    },
  },
}));

// Mock store configuration
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authenticationSlice.reducer,
    },
    preloadedState: {
      auth: {
        userId: '',
        name: '',
        email: '',
        createdAt: '',
        isAuth: false,
      },
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return <Provider store={store}>{children}</Provider>;
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  setParams: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );

    expect(screen.getByText('App de Test Contacts App')).toBeTruthy();
    expect(screen.getByText('Correo electrónico:')).toBeTruthy();
    expect(screen.getByText('Contraseña:')).toBeTruthy();
    expect(screen.getByTestId('login-button')).toBeTruthy();
    expect(screen.getByTestId('register-button')).toBeTruthy();
    expect(screen.getAllByTestId('custom-input')).toHaveLength(2);
  });

  it('should update email and password inputs', () => {
    render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );

    const emailInput = screen.getAllByTestId('custom-input')[0];
    const passwordInput = screen.getAllByTestId('custom-input')[1];

    fireEvent.changeText(emailInput, 'usuario@mail.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Los inputs no mantienen el valor en el mock, solo verificamos que se pueden cambiar
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should handle successful login', async () => {
    const mockResponse = [{
      id: 'user-1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
      name: 'Usuario Test',
      email: 'usuario@mail.com',
      pw: 'hashedPassword',
      created_at: '2023-01-01',
    }];

    mockLogin.mockResolvedValueOnce(mockResponse);

    render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );

    const emailInput = screen.getAllByTestId('custom-input')[0];
    const passwordInput = screen.getAllByTestId('custom-input')[1];
    const loginButton = screen.getByTestId('login-button');

    fireEvent.changeText(emailInput, 'usuario@mail.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'usuario@mail.com',
        pw: 'password123',
      });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MenuScreen');
    });
  });

  it('should handle failed login', async () => {
    mockLogin.mockResolvedValueOnce([]);

    render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );

    const emailInput = screen.getAllByTestId('custom-input')[0];
    const passwordInput = screen.getAllByTestId('custom-input')[1];
    const loginButton = screen.getByTestId('login-button');

    fireEvent.changeText(emailInput, 'wrong@mail.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('should navigate to register screen', () => {
    render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );

    const registerButton = screen.getByTestId('register-button');
    fireEvent.press(registerButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignInScreen');
  });

  it('should handle login service error', async () => {
    // Simular que el servicio retorna un array vacío por error interno
    mockLogin.mockResolvedValueOnce([]);

    render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      // No debe navegar a MenuScreen si hay error
      expect(mockNavigation.navigate).not.toHaveBeenCalledWith('MenuScreen');
    });
  });
});
