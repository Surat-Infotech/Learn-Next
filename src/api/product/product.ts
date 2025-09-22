import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api } from '..';
import { IProductResponse, IProductFilterRequest, IProductFilterResponse } from './types';

class Product extends Api {
  readonly baseUrl: string = 'v1/product';

  /**
   * Method to the filtered products
   */
  readonly filter = (payload: IProductFilterRequest) =>
    this.http.post<IProductFilterResponse>(this.route('filter'), payload);

  /**
   * Method to get a single product
   */
  readonly get = (id: string) => this._get<IProductResponse>(id);

  /**
   * Method to get all lab-grown-engagement-rings collection product
   */
  readonly getCollectionProduct = (query: string) => this._get<IProductResponse>(`/by-status${query}`);
}

export const productApi = new Product();

export const productsQuery = createQueryKeys('products', {
  /**
   * Query to get a single product
   */
  get: (id: string) => ({
    queryKey: ['get', id],
    queryFn: async () => {
      const { data } = await productApi.get(id);

      return data.data[0];
    },
  }),
});
