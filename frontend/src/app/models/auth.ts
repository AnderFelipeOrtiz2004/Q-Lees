export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  success?: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}