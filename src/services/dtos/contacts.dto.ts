export interface CreateContactRequest {
  name: string;
  email?: string;
  is_favorite: boolean;
  cellphone: string;
  user_id: string;
}

export interface UpdateContactRequest {
  name: string;
  email: string;
  cellphone: string;
}

export interface ContactRespose {
  id: string;
  name: string;
  email: string;
  is_favorite: boolean;
  cellphone: string;
  user_id: string;
  created_at: string;
}
