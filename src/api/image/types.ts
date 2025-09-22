import { IResponse } from '../types';

export interface IImageCreateRequest {
  file:
    | {
        file: File & {
          preview: string;
          webkitRelativePath: string | null | undefined;
          path: string;
          lastModified: number;
          lastModifiedDate: null | Date;
          name: string;
          size: number;
          type: string;
        };
      }[]
    | { file: unknown }[];
  folder_name?: 'inquiry';
}

export interface IImageCreateResponse extends IResponse<string[]> {}

export interface IImageDeleteRequest {
  urls: string[];
}

export interface IImageDeleteResponse extends IResponse<any> {}
