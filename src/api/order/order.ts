import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api, IApiOptions } from '..';
import {
  IOrderResponse,
  ICreateOrderRequest,
  ICreateOrderResponse,
  ISingleOrderResponse,
  IOrderValidateStockRequest,
  IUpdatePaymentStatusRequest,
  IOrderValidateStockResponse,
  IUpdatePaymentStatusResponse,
} from './types';

class Order extends Api {
  readonly baseUrl = 'v1/order';

  /**
   * Method to create an order
   */
  readonly create = (payload: ICreateOrderRequest) => this._create<ICreateOrderResponse>(payload);

  /**
   * Method to get a single order
   */
  readonly get = (id: string) => this.http.get<ISingleOrderResponse>(this.route(`/${id}`));

  /**
   * Method to get all order
   */
  readonly all = (config: IApiOptions) =>
    this.http.get<IOrderResponse>(this.route(''), {
      headers: {
        Authorization: `Bearer ${config?.accessToken}`,
      },
    });

  /**
* Method to uopdate payment
*/
  readonly updatePayment = (id: string, payload: IUpdatePaymentStatusRequest) =>
    this.http.patch<IUpdatePaymentStatusResponse>(this.route(`status/${id}`), payload);

  /**
   *  validate stock
   */
  readonly validateStock = (id: string, payload: IOrderValidateStockRequest) =>
    this.http.post<IOrderValidateStockResponse>(this.route(`${id}`), payload);
}

export const orderApi = new Order();

export const orderQuery = createQueryKeys('order', {
  /**
   * Query to get all order
   */
  all: (config: IApiOptions) => ({
    queryKey: [{}],
    queryFn: async () => {
      const { data } = await orderApi.all(config);

      return data.data;
    },
  }),

  /**
   * Query to get a single order
   */
  get: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      const { data } = await orderApi.get(id);
      return data.data;
    },
  }),
});
