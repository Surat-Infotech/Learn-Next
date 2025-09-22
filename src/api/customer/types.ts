import { ILoginData } from '../auth';
import { IResponse } from '../types';

export type ICreateCustomerRequest = {
  // first_name: string;
  // last_name: string;
  email: string;
  name: string;
  // user_name: string;
  password: string;
  mobile_no?: string;
  country_code?: string;
  website?: string;
  // country?: string;
  // state?: string;
  // city?: string;
  // post_code?: string;
  //
  is_order?: boolean;
};

export type ICreateCustomerResponse = IResponse<ILoginData>;
