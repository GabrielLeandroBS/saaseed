export interface User {
  id: string;
  name: string;
  email: string;
  surname: string;
  createdAt: string;
  updatedAt: string;
}
export interface AuthResponse {
  access_token: string;
  expires_in: number;
  data: User;
}

// Auth interfaces removed - using Better Auth with magic link and Google OAuth only
// These interfaces are no longer needed as authentication is handled by Better Auth
