import { Api } from '../..';
import { IKlarnaPaymentIntentRequest, IKlarnaPaymentIntentResponse } from './types';


class Klarna extends Api {
    readonly baseUrl = 'v1/klarna';

    /**
     * Method to create a payment intent
     */
    readonly getPaymentIntentPlanId = (payload: IKlarnaPaymentIntentRequest) =>
        this.http.post<IKlarnaPaymentIntentResponse>(this.route('create-payment-intent'), payload);

    /**
    * Method to create a order
    */
    readonly createPaymentOrder = (token: string, payload: any) =>
        this.http.post<IKlarnaPaymentIntentResponse>(this.route(`create-order/${token}`), payload);
}

export const klarnaApi = new Klarna();