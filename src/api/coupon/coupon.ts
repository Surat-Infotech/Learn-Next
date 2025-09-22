import { Api } from '..';
import { ICouponValidateRequest, ICouponValidateResponse } from './types';

class Coupon extends Api {
    readonly baseUrl = 'v1/coupon/validate';

    /**
     * Method to apply promo code
     */
    readonly apply = ( payload: ICouponValidateRequest) =>
        this._post<ICouponValidateResponse>('',payload);
}

export const couponApi = new Coupon();
