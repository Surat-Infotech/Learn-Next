import { IResponse } from '../types';

export type ICouponValidateRequest = {
    product_ids: [
        {
            product_id?: string;
            variation_id?: string;
            diamond_id?: string;
        },
    ],
    shipping_cost: number;
    coupon_code: string;
};

export type ICouponValidateResponse = IResponse<any>;
