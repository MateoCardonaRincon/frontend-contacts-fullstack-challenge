/**
 * @format
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ContactsService } from '../../src/services/contacts.service';
import { Contact } from '../../src/redux/types/contactsTypes';

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

describe('ContactsService', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  let contactsService: ReturnType<typeof ContactsService>;

  beforeEach(() => {
    jest.clearAllMocks();
    contactsService = ContactsService();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
  });

  const mockContact: Contact = {
    id: '1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
    name: 'Contact Test',
    cellphone: '3001234567',
    email: 'contacto@mail.com',
    created_at: '2023-01-01',
    is_favorite: false,
    user_id: 'user1',
  };

  describe('getContacts', () => {
    it('should fetch contacts successfully', async () => {
      const mockResponse = [mockContact];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await contactsService.getContacts('user1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/contacts?user_id=eq.user1',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await contactsService.getContacts('user1');

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('deleteContact', () => {
    it('should delete contact successfully', async () => {
      const mockResponse = { id: '1a85c9a3-446b-4ade-9fef-d7d07db2ca00' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockResponse]), // Array con el objeto, no objeto directo
      } as Response);

      const result = await contactsService.deleteContact('1a85c9a3-446b-4ade-9fef-d7d07db2ca00');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/contacts?id=eq.1a85c9a3-446b-4ade-9fef-d7d07db2ca00',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
            'Prefer': 'return=representation',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle delete error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await contactsService.deleteContact('1a85c9a3-446b-4ade-9fef-d7d07db2ca00');

      expect(result).toBeUndefined();
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('saveContact', () => {
    it('should create contact successfully', async () => {
      const newContact = {
        name: 'Contact Test 2',
        cellphone: '3009876543',
        email: 'contacto2@mail.com',
        is_favorite: false,
        user_id: 'user1',
      };

      const mockResponse = { ...newContact, id: '2b95d8f4-556c-4bce-8fed-e8e18eb3ca11', created_at: '2023-01-02' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockResponse]),
      } as Response);

      const result = await contactsService.saveContact(newContact);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/contacts',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
          }),
          body: JSON.stringify(newContact),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle create contact error', async () => {
      const newContact = {
        name: 'Contact Test 2',
        cellphone: '3009876543',
        email: 'contacto2@mail.com',
        is_favorite: false,
        user_id: 'user1',
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await contactsService.saveContact(newContact);

      expect(result).toBeUndefined();
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('updateContact', () => {
    it('should update contact successfully', async () => {
      const updateData = {
        name: 'María Fernández',
        cellphone: '3112345678',
        email: 'maria.fernandez@email.com',
      };

      const mockResponse = {
        id: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890',
        ...updateData,
        created_at: '2025-01-18T10:00:00.000000',
        is_favorite: false,
        user_id: 'user123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockResponse]),
      } as Response);

      const result = await contactsService.updateContact(updateData, 'a1b2c3d4-5e6f-7890-abcd-ef1234567890');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/contacts?id=eq.a1b2c3d4-5e6f-7890-abcd-ef1234567890',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update contact error', async () => {
      const updateData = {
        name: 'Contact Test Updated',
        cellphone: '3001111111',
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await contactsService.updateContact(updateData, 'a1b2c3d4-5e6f-7890-abcd-ef1234567890');

      expect(result).toBeUndefined();
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should update contact with partial data', async () => {
      const updateData = {
        name: 'Solo Nombre',
      };

      const mockResponse = {
        id: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890',
        name: 'Solo Nombre',
        cellphone: '3001234567',
        email: 'old@email.com',
        created_at: '2025-01-18T10:00:00.000000',
        is_favorite: false,
        user_id: 'user123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockResponse]),
      } as Response);

      const result = await contactsService.updateContact(updateData, 'a1b2c3d4-5e6f-7890-abcd-ef1234567890');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/contacts?id=eq.a1b2c3d4-5e6f-7890-abcd-ef1234567890',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': 'test-api-key',
            'Authorization': 'Bearer test-api-key',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
