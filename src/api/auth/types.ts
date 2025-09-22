import { IUser } from '@/types/user';

import { IResponse } from '../types';

export type ILoginRequest = {
  email: string;
  password: string;
};

export type IUpdateProfileRequest = {
  email: string;
  name: string;
  user_name: string;
};

export type IUpdatePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confimPassword: string;
};
export type IForgotPasswordRequest = {
  email: string;
};
export type IResetPasswordRequest = {
  newPassword: string;
  confimPassword: string;
};
export type ILoginResponse = IResponse<ILoginData>;

export type ILoginData = {
  accessToken: string;
  data: IUser;
};

export type IProfileResponse = IResponse<IUser>;
export type IUpdateProfileResponse = IResponse<any>;
export type IUpdatePasswordResponse = IResponse<any>;
export type IForgotPasswordResponse = IResponse<any>;
export type IResetPasswordResponse = IResponse<any>;
