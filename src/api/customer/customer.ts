import { Api } from '..';
import { ICreateCustomerRequest, ICreateCustomerResponse } from './types';

class Customer extends Api {
  readonly baseUrl = 'v1/customers';

  /**
   * Method to create a new customer
   */
  readonly create = (payload: ICreateCustomerRequest) =>
    this._create<ICreateCustomerResponse>(payload);
}

export const customerApi = new Customer();
