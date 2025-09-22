import { omitBy, isEmpty, isNumber, cloneDeep } from 'lodash';
import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api } from '..';
import {
  IColorRangeResponse,
  IColorInventoryResponse,
  IColorInventoryFilterRequest,
  IColorInventoryFilterResponse,
} from './types';

class LabCreatedColorDiamonds extends Api {
  readonly baseUrl: string = 'v1/color';

  /**
   * Method to get inventory/color
   */
  readonly filter = (_payload: IColorInventoryFilterRequest) => {
    const payload = cloneDeep(_payload);

    // This is a workaround to fix the issue with the API
    if (payload?.filter?.colors) {
      payload.filter.color = payload.filter.colors;
      delete payload.filter.colors;
    }

    return this.http.post<IColorInventoryFilterResponse>(
      this.route('diamonds/filter'),
      omitBy(payload, (value) => isEmpty(value) && !isNumber(value))
    );
  };

  /**
   * Method to get a single inventory/color diamond
   */
  readonly get = (id: string) =>
    this.http.get<IColorInventoryResponse>(this.route(`diamonds/${id}`));

  readonly range = () => this.http.get<IColorRangeResponse>(this.route(`diamonds/range`));

}

export const colorInventoryApi = new LabCreatedColorDiamonds();

export const colorinventoriesQuery = createQueryKeys('colorinventories', {
  /**
   * Query to get inventory/color
   */
  filter: (payload: IColorInventoryFilterRequest) => ({
    queryKey: [payload],
    queryFn: async () => {
      const { data } = await colorInventoryApi.filter(payload);
      return data.data;
    },
  }),
  /**
   * Query to get a single inventory/color diamond
   */
  get: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      const { data } = await colorInventoryApi.get(id);
      return data.data;
    },
  }),

  /**
   * Query to get all filter range
   */
  range: () => ({
    queryKey: [{}],
    queryFn: async () => {
      const { data } = await colorInventoryApi.range();

      return data.data;
    },
  }),
});
