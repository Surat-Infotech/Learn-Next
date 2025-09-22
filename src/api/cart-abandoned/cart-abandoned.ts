
import { Api } from '..';
import { ICreateCartAbandonmentRequest, ICreateCartAbandonmentResponse } from './types';

class CartAbandoned extends Api {
  readonly baseUrl: string = 'v1/cart-abandonment';

  /**
   * Method to create a cart abandonment
   */
  readonly create = (payload: ICreateCartAbandonmentRequest) =>
    this._create<ICreateCartAbandonmentResponse>(payload);
}

export const cartAbandonedApi = new CartAbandoned();

