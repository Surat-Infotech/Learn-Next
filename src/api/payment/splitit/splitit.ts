import { Api } from '../..';
import { ISplititPaymentIntentRequest, ISplitItPaymentIntentResponse } from './types';

class SplitIt extends Api {
    readonly baseUrl = 'v1/splitit';

    /**
     * Method to create a payment intent
     */
    readonly getPaymentIntentPlanId = (payload: ISplititPaymentIntentRequest) =>
        this.http.post<ISplitItPaymentIntentResponse>(this.route('initiate'), payload);
}

export const SplitItApi = new SplitIt();