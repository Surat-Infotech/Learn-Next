import { Api } from '..';
import {
  IImageCreateRequest,
  IImageDeleteRequest,
  IImageCreateResponse,
  IImageDeleteResponse,
} from './types';

class Image extends Api {
  readonly baseUrl = '/v1/image';

  /**
   * Create a Image URL
   */
  readonly create = (payload: IImageCreateRequest) => {
    // Convert data to FormData
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If the value is an array, iterate over the array
        value.forEach((item) => {
          if (item.file instanceof File) {
            formData.append('file', item.file);
          }
        });
      } else {
        formData.append(key, value);
      }
    });

    return this._create<IImageCreateResponse>(formData);
  };

  /**
   * Delete an Image or Images
   * * Will permanently delete the Image
   */
  readonly delete = (payload: IImageDeleteRequest) =>
    this.http.delete<IImageDeleteResponse>(this.route(''), { data: payload });
}

export const imageApi = new Image();

export default imageApi;
