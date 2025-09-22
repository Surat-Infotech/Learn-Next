
import { Api } from '..';
import { IGlobalSearchResponse } from './types';

class Search extends Api {
  readonly baseUrl: string = 'v1/search';

  /**
 * Method to global search
 */
  readonly globalSearch = (query: string) => this._get<IGlobalSearchResponse>(`?q=${query}`);
}

export const searchApi = new Search();

