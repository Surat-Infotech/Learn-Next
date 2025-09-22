import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api } from '..';
import { IProductCategoryResponse } from './types';

class ProductCategory extends Api {
  readonly baseUrl: string = 'v1/product-category';

  /**
   * Method to get all the product categories
   */
  readonly all = () => this._all<IProductCategoryResponse>();

  /**
   * Method to get a single product category
   */
  readonly get = () => this._all<IProductCategoryResponse>();
}

export const productCategoryApi = new ProductCategory();

export const productCategoriesQuery = createQueryKeys('productCategories', {
  /**
   * Query to get all the product categories
   */
  all: () => ({
    queryKey: [{}],
    queryFn: async () => {
      const { data } = await productCategoryApi.all();
      return data.data;
    },
  }),
  /**
   * Query to get a single product category
   */
  get: (slug: string) => ({
    queryKey: [slug],
    queryFn: async () => {
      const { data } = await productCategoryApi.get();

      const category = data.data?.find((item) => item.slug === slug);

      if (!category) {
        return null;
      }

      const subCategories = data.data.filter((item) => item.parent_id?.slug === category?.slug);

      return {
        ...category,
        subCategories,
      };
    },
  }),
});
