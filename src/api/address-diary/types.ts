import { IResponse } from '../types';

export type IAddressDiaryResponse = IResponse<IAddressDiary[]>;
export type ISingleAddressDiaryResponse = IResponse<IAddressDiary>;

export type IAddressDiary = {
  _id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  address_second: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  is_default: boolean;
  address_type: 'shipping' | 'billing';
  updated_at: any;
  deleted_at: any;
  country_code?: string;
  created_by: string;
  created_at: string;
  updated_by?: string;
  place_type?: string;
};

export type IAddressupdateRequest = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  is_default: boolean;
  country_code?: string;
  address_type: 'shipping' | 'billing';
};
export type IAddressDiaryUpdateResponse = IResponse<any>;
