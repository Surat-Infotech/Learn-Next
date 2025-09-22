import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api } from '..';
import { IBlogResponse, ISingleBlogResponse } from './types';

class Blog extends Api {
  readonly baseUrl: string = 'v1/';

  /**
   * Method to get a single blog
   */
  readonly get = (id: string) => this.http.get<ISingleBlogResponse>(this.route(`blog/${id}`));

  /**
   * Method to get all blogs
   */
  readonly getAll = (params: number) =>
    this.http.get<IBlogResponse>(this.route(`blog?page=${params}`));
}

export const blogApi = new Blog();

export const blogQuery = createQueryKeys('blogs', {
  /**
   * Query to get a single blog
   */
  get: (slug: string) => ({
    queryKey: [slug],
    queryFn: async () => {
      const { data } = await blogApi.get(slug);
      return data.data;
    },
  }),

  /**
   * Query to get all blogs
   */
  getAll: (params: number) => ({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data: _data } = await blogApi.getAll(params);
      return _data.data;
    },
  }),
});
