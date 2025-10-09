/**
 * @format
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AuthenticationService } from '../../src/services/auth.service';
import { LoginRequest, SignInRequest, AuthResponse } from '../../src/services/dtos/authentication.dto';

// Mock de fetch global
(global as any).fetch = jest.fn();

// Mock de app-config
jest.mock('../../src/config/app-config', () => ({
  appConfig: {
    api: {
      url: 'https://test-api.com',
      apiKey: 'test-api-key',
    },
  },
}));

// Mock de console.error para evitar ruido en las pruebas
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('AuthenticationService', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  let authService: ReturnType<typeof AuthenticationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = AuthenticationService();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
  });

  const mockAuthResponse: AuthResponse = {
    id: 'user-1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
    name: 'Usuario Test',
    email: 'usuario@mail.com',
    pw: 'hashedPassword123',
    created_at: '2023-01-01',
  };

  describe('signIn', () => {
    it('should create user successfully', async () => {
      const signInRequest: SignInRequest = {
        name: 'Usuario Test',
        email: 'usuario@mail.com',
        pw: 'password123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockAuthResponse]),
      } as Response);

      const result = await authService.signIn(signInRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/users',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(signInRequest),
        }
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle signIn error', async () => {
      const signInRequest: SignInRequest = {
        name: 'Usuario Test',
        email: 'usuario@mail.com',
        pw: 'password123',
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.signIn(signInRequest);

      expect(result).toBeUndefined();
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error at AuthenticationService.signIn:')
      );
    });

    it('should handle empty response', async () => {
      const signInRequest: SignInRequest = {
        name: 'Usuario Test',
        email: 'usuario@mail.com',
        pw: 'password123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      const result = await authService.signIn(signInRequest);

      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginRequest: LoginRequest = {
        email: 'usuario@mail.com',
        pw: 'password123',
      };

      const mockResponse = [mockAuthResponse];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await authService.login(loginRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/users?email=eq.usuario@mail.com&pw=eq.password123',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return empty array for invalid credentials', async () => {
      const loginRequest: LoginRequest = {
        email: 'wrong@mail.com',
        pw: 'wrongpassword',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      const result = await authService.login(loginRequest);

      expect(result).toEqual([]);
    });

    it('should handle login error', async () => {
      const loginRequest: LoginRequest = {
        email: 'usuario@mail.com',
        pw: 'password123',
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.login(loginRequest);

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error at AuthenticationService.login:')
      );
    });

    it('should handle special characters in email and password', async () => {
      const loginRequest: LoginRequest = {
        email: 'test+user@mail.com',
        pw: 'pass@word#123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockAuthResponse]),
      } as Response);

      const result = await authService.login(loginRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/users?email=eq.test+user@mail.com&pw=eq.pass@word#123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual([mockAuthResponse]);
    });
  });
});
