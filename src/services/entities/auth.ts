import {
  AuthForgotPasswordRequest,
  AuthForgotPasswordResponse,
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
  AuthSignInRequest,
  AuthSignInResponse,
  AuthSignUpRequest,
  AuthSignUpResponse,
} from "@/models/interfaces/services/auth";

import { ServicesRoutesEnum } from "@/models/enums/services-routes";
import { AxiosApi } from "@/services/api";

export const SignInService = ({
  email,
  password,
}: AuthSignInRequest): Promise<AuthSignInResponse> => {
  return new Promise((resolve, reject) => {
    AxiosApi.post(ServicesRoutesEnum.SIGN_IN, {
      email: email,
      password: password,
    })
      .then((response) => {
        resolve({
          access_token: response.data.access_token,
          expires_in: response.data.expires_in,
          ...response,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const SignUpService = ({
  email,
  name,
  password,
  surname,
}: AuthSignUpRequest): Promise<AuthSignUpResponse> => {
  return new Promise((resolve, reject) => {
    AxiosApi.post(ServicesRoutesEnum.SIGN_UP, {
      email: email,
      name: name,
      password: password,
      surname: surname,
    })
      .then(async (response) => {
        resolve({
          access_token: response.data.access_token,
          expires_in: response.data.expires_in,
          ...response,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const ForgotPasswordService = ({
  email,
}: AuthForgotPasswordRequest): Promise<AuthForgotPasswordResponse> => {
  return new Promise((resolve, reject) => {
    AxiosApi.post(ServicesRoutesEnum.FORGOT_PASSWORD, {
      email: email,
    })
      .then((response) => {
        resolve({
          access_token: response.data.access_token,
          expires_in: response.data.expires_in,
          ...response,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const ResetPasswordService = ({
  password,
  token,
}: AuthResetPasswordRequest): Promise<AuthResetPasswordResponse> => {
  return new Promise((resolve, reject) => {
    AxiosApi.put(`${ServicesRoutesEnum.RESET_PASSWORD}/${token}`, {
      newPassword: password,
    })
      .then((response) => {
        resolve({
          access_token: response.data.access_token,
          expires_in: response.data.expires_in,
          ...response,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
