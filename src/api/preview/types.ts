import { IResponse } from '../types';

export interface IPreview {
  _id: number;
  user_id: string;
  blog_json: Object | any;
  product_json: Object | any;
}
export interface IPreviewResponse extends IResponse<IPreview> { }
