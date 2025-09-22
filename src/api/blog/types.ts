import { IResponse, IResponseFilter } from '../types';

export type IBlogResponse = IResponseFilter<IBlog>;
export type ISingleBlogResponse = IResponse<ISingleBlog>;

export interface IBlog {
  _id: string;
  author_id: IAuthor;
  title: string;
  slug: string;
  content: string;
  category_id: {
    name: string;
    slug: string;
  } | any;
  cover_image: string;
  cover_image_alt?: string;
  tags: string[];
  status: boolean;
  date: string | null;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  __v: number;
  updated_by: string;
}

export interface IAuthor {
  _id: string;
  role_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  status: boolean;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  avatar: string;
}

export interface ISingleBlog {
  _id: string;
  author_id: IAuthor;
  title: string;
  content: string;
  related_blogs: object[];
  meta_keywords?: string[];
  meta_data?: string;
  meta_description?: string;

  category_id: CategoryId;
  tags: Tag[];
  status: boolean;
  date: string | null;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  __v: number;
  updated_by: string;
  comments: any[];
}

export interface CategoryId {
  _id: string;
  description: string;
  name: string;
  deleted_at: any;
  created_by: string;
  created_at: string;
  updated_at: string;
  slug: string;
  __v: number;
}

export interface Tag {
  _id: string;
  name: string;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  __v: number;
}
