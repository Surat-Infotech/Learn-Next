import { IResponse, IResponseFilter } from '../types';

export type IRangeFilter = {
  min: number;
  max: number;
};

export type IArrayFilter = string[];

export type ICollectionMetaDetailsRequest = {
  slugs: string[];
  fields: string[]
};

export type ICollectionFilterRequest = {
  search?: string;
  type?: string;
  //
  filter?: {
    shape?: IArrayFilter;
    regular_price?: IRangeFilter;
    carat?: IRangeFilter;
    cut?: IArrayFilter;
    color?: IArrayFilter;
    clarity?: IArrayFilter;
    certificate_type?: IArrayFilter;
    d_type?: IArrayFilter; // method
    table?: IRangeFilter;
    depth?: IRangeFilter;
    lw_ratio?: IRangeFilter;
  };
  sort?: {
    [key: number]: 1 | -1;
  };
  //
  page: number;
  pageSize: number;
};

export type ICollectionFilterResponse = IResponseFilter<any>;

export type ICollectionResponse = IResponse<any>;

