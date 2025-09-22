import { Api } from '..';
import {
  IPreviewResponse,
} from './types';

class Preview extends Api {
  readonly baseUrl = '/v1/preview';

  /**
   * Get a preview
   */
  readonly get = (id: string) => this._get<IPreviewResponse>(id);
}

export const previewApi = new Preview();

export default previewApi;
