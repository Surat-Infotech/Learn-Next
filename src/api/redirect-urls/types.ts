import { IResponse } from '../types';

export interface IRedirectURLs {
  _id: string;
  from: string;
  to: string;
  updateCount: number;
  __v: number | any;
  created_at: string | any;
  deleted_at?: string | any;
  updated_at?: string | any;
  created_by: string | any;
}

export interface IRedirectURLsResponse extends IResponse<IRedirectURLs[]> { }
