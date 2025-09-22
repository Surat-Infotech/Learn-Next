import { Api } from '..';
import { IFAQsResponse } from './types';

class FAQ extends Api {
  readonly baseUrl = '/v1/';

  /**
    * Get all faqs
    */
  readonly getAll = () =>
    this.http.get<IFAQsResponse>(this.route(`faq`));
}

export const faqsApi = new FAQ();

export default faqsApi;
