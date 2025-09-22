import { IResponse } from "../types";

export type ICartAddResponse = IResponse<any>;
export type ICartRemoveResponse = IResponse<any>;
export type ICartUpdateResponse = IResponse<any>;
export type ICartGetResponse = IResponse<any>;


export type ICartAddRequest = {
  product_id?: string,
  variation_id?: string,
  diamond_id?: string,
  ring_size?: string,
  bracelet_size?: string,
  back_setting?: string,
  quantity?: number,
}

export type ICartUpdateRequest = {
  quantity?: number
  text?: string
  font?: string
}
