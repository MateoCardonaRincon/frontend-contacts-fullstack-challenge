/**
 * @format
 */

import { describe, it, expect } from '@jest/globals';
import { authenticationSlice, startSession, closeSession } from '../../src/redux/slices/authenticationSlice';
import { AuthenticationState } from '../../src/redux/types/authTypes';

describe('authenticationSlice', () => {
  const initialState: AuthenticationState = {
    userId: '',
    name: '',
    email: '',
    createdAt: '',
    isAuth: false,
  };

  const mockUserData: AuthenticationState = {
    userId: 'user-1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
    name: 'Usuario Test',
    email: 'usuario@mail.com',
    createdAt: '2023-01-01',
    isAuth: true,
  };

  describe('startSession', () => {
    it('should set user session data', () => {
      const action = startSession(mockUserData);
      const result = authenticationSlice.reducer(initialState, action);

      expect(result.userId).toBe(mockUserData.userId);
      expect(result.name).toBe(mockUserData.name);
      expect(result.email).toBe(mockUserData.email);
      expect(result.createdAt).toBe(mockUserData.createdAt);
      expect(result.isAuth).toBe(true);
    });

    it('should replace existing session data', () => {
      const currentState: AuthenticationState = {
        userId: 'old-user-id',
        name: 'Old Name',
        email: 'old@email.com',
        createdAt: '2022-01-01',
        isAuth: true,
      };

      const action = startSession(mockUserData);
      const result = authenticationSlice.reducer(currentState, action);

      expect(result).toEqual(mockUserData);
    });

    it('should handle partial user data', () => {
      const partialUserData: AuthenticationState = {
        userId: 'test-user',
        name: 'Test User',
        email: 'test@mail.com',
        createdAt: '',
        isAuth: false,
      };

      const action = startSession(partialUserData);
      const result = authenticationSlice.reducer(initialState, action);

      expect(result).toEqual(partialUserData);
    });
  });

  describe('closeSession', () => {
    it('should reset to initial state', () => {
      const authenticatedState: AuthenticationState = {
        userId: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        isAuth: true,
      };

      const action = closeSession();
      const result = authenticationSlice.reducer(authenticatedState, action);

      expect(result).toEqual(initialState);
      expect(result.userId).toBe('');
      expect(result.name).toBe('');
      expect(result.email).toBe('');
      expect(result.createdAt).toBe('');
      expect(result.isAuth).toBe(false);
    });

    it('should work when already logged out', () => {
      const action = closeSession();
      const result = authenticationSlice.reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
