import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api, IApiOptions } from '..';
import {
  ILoginRequest,
  ILoginResponse,
  IProfileResponse,
  IUpdateProfileRequest,
  IResetPasswordRequest,
  IUpdateProfileResponse,
  IUpdatePasswordRequest,
  IForgotPasswordRequest,
  IResetPasswordResponse,
  IUpdatePasswordResponse,
  IForgotPasswordResponse,
} from './types';

class Auth extends Api {
  readonly baseUrl = 'v1/auth';

  /**
   * Method to login user
   */
  readonly login = (payload: ILoginRequest) =>
    this.http.post<ILoginResponse>(this.route('login'), payload);

  /**
   * Method to Update  Profile
   */
  readonly updateProfile = (payload: IUpdateProfileRequest) =>
    this.http.put<IUpdateProfileResponse>(this.route('update-profile'), payload);

  /**
   * Method to Update  Password
   */
  readonly updatePassword = (payload: IUpdatePasswordRequest) =>
    this.http.patch<IUpdatePasswordResponse>(this.route('reset-password'), payload);

  /**
   * Method to Update  Password
   */
  readonly sendLink = (payload: IForgotPasswordRequest) =>
    this.http.patch<IForgotPasswordResponse>(this.route('send-link'), payload);

  /**
   * Method to Update  Password
   */
  readonly resetPassword = (
    payload: IResetPasswordRequest,
    header: string | string[] | undefined
  ) =>
    this.http.patch<IResetPasswordResponse>(this.route('verify-link'), payload, {
      headers: {
        Authorization: `Bearer ${header}`,
      },
    });

  /**
   * Method to get current user
   */
  readonly getCurrentUser = (config: IApiOptions) =>
    this.http.get<IProfileResponse>(this.route('profile'), {
      headers: {
        Authorization: `Bearer ${config?.accessToken}`,
      },
    });
}

export const authApi = new Auth();

export const authQuery = createQueryKeys('auth', {
  // Get current user
  getCurrentUser: (config: IApiOptions) => ({
    queryKey: ['profile'],
    queryFn: async () => {
      if (config?.accessToken) {
        const { data } = await authApi.getCurrentUser(config);
        return data;
      }
      return null;
    },
  }),
});
