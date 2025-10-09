export interface Contact {
  id: string;
  name: string;
  cellphone: string;
  email?: string;
  created_at: string;
  is_favorite: boolean;
  user_id: string;
}

export type ContactState = {
  contacts: Contact[];
  currentPhone: string;
  currentContactId: string;
};
