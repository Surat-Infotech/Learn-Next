import { IResponse, IResponseFilter } from '../types';

export type IProductFilterResponse = IResponseFilter<IProduct>;

export type IProductResponse = IResponse<IProduct[]>;

export type IMatchingProducts = {
  _id: string;
  name: string;
  slug: string;
  regular_price: number;
  sale_price: number;
  default_image: string;
  category: ICategory[];
  images: string[];
}

export interface IProduct {
  wishlistDetails?: any;
  variation_id?: string;
  wishlist_id?: string;
  isWishlist?: boolean;
  meta_keywords: any;
  meta_description: string | undefined;
  matching_products?: IMatchingProducts[] | undefined;
  meta_data: string;
  prefix: any;
  _id: string;
  name: string;
  short_description: string;
  long_description: string;
  product_type: string;
  diamond_type: IDiamondType;
  regular_price: number;
  sale_price: number;
  sale_schedule: ISaleSchedule;
  stock_qty: number;
  stock_status: string;
  status: string;
  video_provider: string;
  video_link: string;
  images: string[];
  parent_sku: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  sku: string;
  created_at: string;
  image_count?: string | number;
  slug: string;
  updated_by: string;
  variations: IVariation[];
  category: ICategory[];
  default_image: any | string[];
  spin_link?: string;
  attributes?: IAttributeList[];
  category_faq: ICategoryFaq[];
}

export interface ISaleSchedule {
  start_date: string | null;
  end_date: string | null;
}

export type IProductFilterRequest = {
  search?: string;
  //
  filter: {
    slug?: string;
  };
  sort?: {
    [key: string]: number | string;
  };
  //
  page: number;
  pageSize: number;
};

export interface IDiamondType {
  _id: string;
  name: string;
  deleted_at: string | null;
  updated_at: string | null;
  created_by: string;
  created_at: string;
  slug: string;
  __v: number;
}

export interface ICategory {
  _id: string;
  name: string;
  parent_id?: string;
  description: string;
  thumbnail: string;
  deleted_at: string | null;
  updated_at: string | null;
  created_by: string;
  created_at: string;
  slug: string;
  __v: number;
}

export interface IVariation {
  product_type?: string;
  _id: string;
  product_id: string;
  name: IVariationName[];
  image: string;
  gallery_img: string[];
  sku: string;
  is_enable: boolean;
  is_downloadable: boolean;
  is_virtual: boolean;
  is_manage_stock: boolean;
  regular_price: number;
  sale_price: number;
  stock_status: string;
  schedule: ISchedule;
  pieces: number;
  weight: string;
  length: string;
  width: string;
  height: string;
  shipping_class: string;
  description: string;
  materials_label: string;
  materials_data: any[];
  updated_at: string | null;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  __v: number;
}

export interface IVariationName {
  key: string;
  value: string;
}

export interface ISchedule {
  start_date: string;
  end_date: string;
}

export interface IAttributeList {
  attribute: IAttribute;
  attribute_value: IAttributeValue[];
}

export interface IAttribute {
  _id: string;
  name: string;
  type: string;
  deleted_at: string | null;
  updated_at?: string | null;
  created_by: string;
  created_at: string;
  slug: string;
  __v: number;
  updated_by?: string;
}

export interface IAttributeValue {
  _id: string;
  attribute_id: string;
  name: string;
  deleted_at: string | null;
  updated_at: string | null;
  created_by: string;
  created_at: string;
  slug: string;
  __v: number;
}

export interface ICategoryFaq {
  _id: string;
  product_id: string;
  category_id: string;
  updated_at: string | null;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  __v: number;
  category_faq_details: ICategoryFaqDetails;
}

export interface ICategoryFaqDetails {
  _id: string;
  category_id: string;
  name: string;
  detail_json: IDetailJson[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
  __v: number;
}

export interface IDetailJson {
  _id: string;
  question: string;
  answer: string;
  video_url?: string;
}
