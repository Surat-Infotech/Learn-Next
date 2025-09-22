import { Api } from '..';
import { IRedirectURLsResponse } from './types';

class FAQ extends Api {
  readonly baseUrl = '/v1/';

  /**
   * Get all redirect url
   */
  readonly getAll = () => this.http.get<IRedirectURLsResponse>(this.route('redirect-url'));
}

export const redirectURLsApi = new FAQ();

export default redirectURLsApi;
