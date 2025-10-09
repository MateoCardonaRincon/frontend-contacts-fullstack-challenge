export interface SignInRequest {
  pw: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  pw: string;
  email: string;
}

export interface AuthResponse {
  id: string;
  pw: string;
  name: string;
  email: string;
  created_at: string;
}
