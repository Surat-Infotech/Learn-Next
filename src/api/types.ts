export interface IApiOptions {
  accessToken?: string | undefined | null;
}

export interface IResponse<T> {
  product_details(product_details: any): unknown;
  isSuccess: boolean;
  status: number;
  message: string;
  data: T;
}

export interface IResponseFilter<T> {
  isSuccess: boolean;
  status: number;
  message: string;
  data: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    data: T[];
  };
}
