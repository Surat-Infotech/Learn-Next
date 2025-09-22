type IGlobalSearchResponseData = {
  _id: string;
  parent_sku: string;
  name: string;
  slug: string;
  product_type: string;
  regular_price: number;
  sale_price: number;
  display_slug: string;
  result_type: string;
  score: number;
};

export type IGlobalSearchResponse = {
  popularSearches: IGlobalSearchResponseData[] | any;
};

