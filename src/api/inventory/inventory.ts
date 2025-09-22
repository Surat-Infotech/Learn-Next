import { omitBy, isEmpty, isNumber } from 'lodash';
import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api } from '..';
import {
  IInventoryResponse,
  IInventoryFilterRequest,
  IInventoryRangeResponse,
  IInventoryFilterResponse,
} from './types';

class Inventory extends Api {
  readonly baseUrl: string = 'v1/white';

  /**
   * Method to get inventory/white
   */
  readonly filter = (payload: IInventoryFilterRequest) =>
    this.http.post<IInventoryFilterResponse>(
      this.route('diamonds/filter'),
      omitBy(payload, (value) => isEmpty(value) && !isNumber(value))
    );

  /**
   * Method to get a single inventory/white diamond
   */
  readonly get = (id: string) => this.http.get<IInventoryResponse>(this.route(`diamonds/${id}`));

  /**
   * Method to get a Range Details
   */
  readonly range = () => this.http.get<IInventoryRangeResponse>(this.route(`diamonds/range`));
}

export const inventoryApi = new Inventory();

export const inventoriesQuery = createQueryKeys('inventories', {
  /**
   * Query to get inventory/white
   */
  filter: (payload: IInventoryFilterRequest) => ({
    queryKey: [payload],
    queryFn: async () => {
      const { data } = await inventoryApi.filter(payload);
      return data.data;
    },
  }),
  /**
   * Query to get a single inventory/white diamond
   */
  get: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      const { data } = await inventoryApi.get(id);
      return data.data;
    },
  }),
  /**
   * Query to get all filter range
   */
  range: () => ({
    queryKey: [{}],
    queryFn: async () => {
      const { data } = await inventoryApi.range();

      return data.data;
    },
  }),
});
