import { Contact } from './../redux/types/contactsTypes';
import { appConfig } from '../config/app-config';
import { CreateContactRequest, ContactRespose } from './dtos/contacts.dto';

export const ContactsService = () => {
  const BASE_URL = `${appConfig.api.url}/contacts`;
  return {
    getContacts: async (userId: string): Promise<Contact[]> => {
      try {
        const httpResponse: Response = await fetch(
          `${BASE_URL}?user_id=eq.${userId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              apikey: `${appConfig.api.apiKey}`,
              Authorization: `Bearer ${appConfig.api.apiKey}`,
            },
          },
        );

        const response = await httpResponse.json();

        return response;
      } catch (error) {
        console.error(
          `Error at ContactsService.getContacts: ${JSON.stringify(error)}`,
        );
        return [];
      }
    },
    saveContact: async (
      body: CreateContactRequest,
    ): Promise<ContactRespose | undefined> => {
      try {
        const httpResponse: Response = await fetch(`${BASE_URL}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            apikey: `${appConfig.api.apiKey}`,
            Authorization: `Bearer ${appConfig.api.apiKey}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(body),
        });

        const response = await httpResponse.json();

        return response[0];
      } catch (error) {
        console.error(
          `Error at ContactsService.saveContact: ${JSON.stringify(error)}`,
        );
      }
    },
    deleteContact: async (
      contactId: string,
    ): Promise<ContactRespose | undefined> => {
      try {
        const httpResponse: Response = await fetch(
          `${BASE_URL}?id=eq.${contactId}`,
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              apikey: `${appConfig.api.apiKey}`,
              Authorization: `Bearer ${appConfig.api.apiKey}`,
              Prefer: 'return=representation',
            },
          },
        );

        const response = await httpResponse.json();

        return response[0];
      } catch (error) {
        console.error(
          `Error at ContactsService.deleteContact: ${JSON.stringify(error)}`,
        );
      }
    },
    updateContact: async (
      body: any,
      contactId: string,
    ): Promise<ContactRespose | undefined> => {
      try {
        const httpResponse: Response = await fetch(
          `${BASE_URL}?id=eq.${contactId}`,
          {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              apikey: `${appConfig.api.apiKey}`,
              Authorization: `Bearer ${appConfig.api.apiKey}`,
              Prefer: 'return=representation',
            },
            body: JSON.stringify(body),
          },
        );

        const response = await httpResponse.json();

        return response[0];
      } catch (error) {
        console.error(
          `Error at ContactsService.deleteContact: ${JSON.stringify(error)}`,
        );
      }
    },
  };
};
