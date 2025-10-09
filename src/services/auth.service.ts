import { appConfig } from '../config/app-config';
import {
  LoginRequest,
  SignInRequest,
  AuthResponse,
} from './dtos/authentication.dto';

export const AuthenticationService = () => {
  const BASE_URL = `${appConfig.api.url}/users`;
  return {
    signIn: async (
      signInPayload: SignInRequest,
    ): Promise<AuthResponse | undefined> => {
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
          body: JSON.stringify(signInPayload),
        });

        const response = await httpResponse.json();

        return response[0];
      } catch (error) {
        console.error(
          `Error at AuthenticationService.signIn: ${JSON.stringify(error)}`,
        );
      }
    },
    login: async (loginPayload: LoginRequest): Promise<AuthResponse[]> => {
      try {
        const httpResponse: Response = await fetch(
          `${BASE_URL}?email=eq.${loginPayload.email}&pw=eq.${loginPayload.pw}`,
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
          `Error at AuthenticationService.login: ${JSON.stringify(error)}`,
        );
        return [];
      }
    },
  };
};
