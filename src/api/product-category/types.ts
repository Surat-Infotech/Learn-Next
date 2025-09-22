import { IResponse } from '../types';

export type IProductCategoryResponse = IResponse<IProductCategory[]>;

export type IProductCategory = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  deleted_at: any;
  updated_at: any;
  created_by: string;
  created_at: string;
  slug: string;
  parent_id?: IParentProductCategory;
};

export type IParentProductCategory = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  deleted_at: any;
  updated_at: any;
  created_by: string;
  created_at: string;
  slug: string;
  __v: number;
};

export type ISingleProductCategory = IProductCategory & {
  subCategories: IProductCategory[];
};
