import { IResponse } from '../types';

export type IWishlistAddRequest = {
  inventory_id?: string;
  product_id?: string;
  is_ring?: boolean;
  variation_id?: string;
  bracelet_size?: string | number;
  back_setting?: string;
  ring_size?: string | number;
};

export type IWishlistAddResponse = IResponse<any>;
export type IWishlistResponse = IResponse<any>;

