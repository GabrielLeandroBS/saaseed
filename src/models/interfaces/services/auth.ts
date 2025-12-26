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

export interface AuthSignInRequest {
  email: string;
  password: string;
}

export interface AuthSignUpRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface AuthForgotPasswordRequest {
  email: string;
}

export interface AuthResetPasswordRequest {
  token: string;
  password: string;
}

export type AuthSignInResponse = AuthResponse;
export type AuthSignUpResponse = {
  access_token: string;
  expires_in: number;
  data: {
    data: User;
  };
};
export type AuthForgotPasswordResponse = AuthResponse;
export type AuthResetPasswordResponse = AuthResponse;
