import { useRouter } from 'next/router';

import { omitBy } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { NextPage, InferGetServerSidePropsType } from 'next';

import { productApi } from '@/api/product';
import { productCategoriesQuery } from '@/api/product-category';

import { priceFilters } from '@/hooks/useProduct';

import { withSsrProps } from '@/utils/page';
import { parseNumbersInString } from '@/utils/query-string';

import { ProductSubCategoryView } from '@/sections/product-category/view';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const BuilRingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const categorySlug = 'engagement-rings';
  const { query } = useRouter();
  const { data: category } = useQuery(productCategoriesQuery.get(categorySlug));

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: category?.name ?? '', isActive: true },
  ];

  if (!category) {
    return null;
  }

  return (
    <div className='min-h-454'>
      <ProductSubCategoryView
        heading={category.name}
        content={category.description}
        breadcrumbs={breadcrumbs}
        categorySlug={categorySlug}
        enableFilter
        //
        productUrl={(productId) => `/engagement-rings/${paths.product.details(productId)}`}
        //
        enableRingBuilder={query.type !== 'diamond-to-ring-builder'}
        enableRingBuilderForDiamondToRing={query.type === 'diamond-to-ring-builder'}
      />
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const categorySlug = 'engagement-rings';

    const { query = {} } = ctx;

    const { style, shape, price: _price } = query;
    const price = parseNumbersInString(_price as string);

    await q.fetchQuery(productCategoriesQuery.get(categorySlug));

    const filter = omitBy(
      {
        slug: categorySlug,
        style,
        shape,
        price: price?.length > 0 &&
          (price?.[0] !== priceFilters.min || price?.[1] !== priceFilters.max) && {
          min: price[0],
          max: price[1],
        },
      },
      (v) => v === undefined || v === '' || v === null || v === false
    );

    const initialPageParam = 1;
    const pageSize = 20;
    const sort = { sale_price: -1 };

    await q.fetchInfiniteQuery({
      queryKey: [
        '_products',
        'filter',
        {
          filter,
          page: initialPageParam,
          pageSize,
          sort,
        },
      ],
      queryFn: async ({ pageParam: page = 1 }) => {
        const { data: _data } = await productApi.filter({
          filter,
          page,
          pageSize,
          sort,
        });

        return _data.data;
      },
      initialPageParam,
    });
  },
});

export default BuilRingPage;
