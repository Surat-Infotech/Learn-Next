import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api, IApiOptions } from '..';
import { IAddressDiaryResponse, IAddressupdateRequest, ISingleAddressDiaryResponse } from './types';

class AddressDiary extends Api {
  readonly baseUrl = 'v1/address-diary';

  /**
   * Method to get a single address
   */
  readonly get = (id: string) => this.http.get<ISingleAddressDiaryResponse>(this.route(`/${id}`));

  /**
   * Method to update a single address
   */
  readonly update = (id: string, payload: IAddressupdateRequest) =>
    this.http.put<IAddressDiaryResponse>(this.route(`/${id}`), payload);

  /**
    
  /**
   * Method to add a single address
   */
  readonly post = (payload: IAddressupdateRequest) =>
    this.http.post<IAddressDiaryResponse>(this.route(``), payload);

  /**
   * Method to get all address diary
   */
  readonly all = (config: IApiOptions) =>
    this.http.get<IAddressDiaryResponse>(this.route(''), {
      headers: {
        Authorization: `Bearer ${config?.accessToken}`,
      },
    });
}

export const addressDiaryApi = new AddressDiary();

export const addressDiarysQuery = createQueryKeys('addressDiarys', {
  /**
   * Query to get all address diary
   */
  all: (config: IApiOptions) => ({
    queryKey: [{}],
    queryFn: async () => {
      const { data } = await addressDiaryApi.all(config);

      return data.data;
    },
  }),

  /**
   * Query to get a single address
   */
  get: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      const { data } = await addressDiaryApi.get(id);
      return data.data;
    },
  }),
});
