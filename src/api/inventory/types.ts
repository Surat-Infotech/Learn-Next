import { IResponse, IResponseFilter } from '../types';

export type IRangeFilter = {
  min: number;
  max: number;
};

export type IArrayFilter = string[];

export type IInventoryFilterRequest = {
  search?: string;
  type?: string;
  //
  filter?: {
    shape?: IArrayFilter;
    regular_price?: IRangeFilter;
    carat?: IRangeFilter;
    cut?: IArrayFilter;
    color?: IArrayFilter;
    clarity?: IArrayFilter;
    certificate_type?: IArrayFilter;
    d_type?: IArrayFilter; // method
    table?: IRangeFilter;
    depth?: IRangeFilter;
    lw_ratio?: IRangeFilter;
  };
  sort?: {
    [key: number]: 1 | -1;
  };
  //
  page: number;
  pageSize: number;
};

export type IInventoryFilterResponse = IResponseFilter<IWhiteDiamond>;

export type IInventoryResponse = IResponse<IWhiteDiamond>;
export type IInventoryRangeResponse = IResponse<any>;

export interface IWhiteDiamond {
  _id: string;
  sku: string;
  shape: string;
  price: number;
  regular_price: number;
  carat: number;
  cut: number;
  color: number;
  clarity: number;
  video_url: string;
  certificate: string;
  certificate_type: number;
  measurerment: string;
  note: string;
  stock_status: boolean;
  sale: boolean;
  d_type: number;
  table: string;
  depth: string;
  lw_ratio: string;
  express_shipping: boolean;
  is_overnight: boolean;
  hearts_and_arrows: boolean;
  vendor_name: string;
  vendor_city: string;
  vendor_country: string;
  sale_price: number;
  sheet_provider: string;
  stock_no: any;
  rap: string;
  deleted_at: any;
  updated_at: any;
  created_at: string;
  __v: number;
}
