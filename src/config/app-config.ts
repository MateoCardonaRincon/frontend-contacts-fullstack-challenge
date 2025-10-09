import { SUPABASE_URL, SUPABASE_ANON_KEY, APP_NAME } from '@env';

export const appConfig = {
  api: {
    url: SUPABASE_URL,
    apiKey: SUPABASE_ANON_KEY,
  },
  app: {
    name: APP_NAME,
  },
};
