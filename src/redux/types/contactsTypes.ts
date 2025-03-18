export interface Contact {
  id: number;
  name: string;
  cellphone: string;
  email: string;
  isFavorite: boolean;
}

export type ContactState = {
  contacts: Contact[];
};
