
import { Api } from '..';
import { ICartAddRequest, ICartAddResponse, ICartGetResponse, ICartRemoveResponse, ICartUpdateRequest, ICartUpdateResponse } from './types';

class Cart extends Api {
  readonly baseUrl: string = 'v1/cart';

  /**
   * Method to add a cart
   */
  readonly add = (payload: ICartAddRequest) =>
    this._create<ICartAddResponse>(payload);

  /**
   * Method to remove a cart
   */
  readonly remove = (id: string) =>
    this._delete<ICartRemoveResponse>(id, '' as any);

  /**
   * Method to update a cart
   */
  readonly update = (id: string, payload: ICartUpdateRequest) =>
    this._patch<ICartUpdateResponse>(id, payload);

  /**
* Method to update or remove a cart engraving
*/
  readonly updateEngraving = (id: string, payload: ICartUpdateRequest) =>
    this._update<ICartUpdateResponse>(`/updateengraving/${id}`, payload);

  /**
   * Method to get a cart
   */
  readonly get = () =>
    this._all<ICartGetResponse>();
}

export const cartApi = new Cart();

