import { Api } from '../..';
import { IPaymentIntentRequest, IPaymentIntentResponse } from './types';

class Stripe extends Api {
  readonly baseUrl = 'v1/stripe';

  /**
   * Method to create a payment intent
   */
  readonly getPaymentIntent = (payload: IPaymentIntentRequest) =>
    this.http.post<IPaymentIntentResponse>(this.route('create-payment-intent'), payload);
}

export const stripeApi = new Stripe();
