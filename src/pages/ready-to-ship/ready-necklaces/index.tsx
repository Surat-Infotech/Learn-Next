import Head from 'next/head';

import { useQuery } from '@tanstack/react-query';
import { NextPage, InferGetServerSidePropsType } from 'next';

import { productApi } from '@/api/product';
import { productCategoriesQuery } from '@/api/product-category';

import { withSsrProps } from '@/utils/page';

import { ProductSubCategoryView } from '@/sections/product-category/view';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const ReadyNecklaces: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
    const categorySlug = 'ready-necklaces';

    const { data: category } = useQuery(productCategoriesQuery.get(categorySlug));

    const breadcrumbs = [
        { title: 'Home', href: '/' },
        { title: 'Ready To Ship', href: paths.readyToShip.root },
        { title: category?.name ?? '', isActive: true },
    ];

    const productSubURL = `${paths.readyToShip.root}/ready-necklaces`

    if (!category) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{`${category?.name}`}</title>
                <meta name="" content="" />
            </Head>
            <div className='min-h-454'>
                <ProductSubCategoryView
                    heading={category.name}
                    content={category.description}
                    breadcrumbs={breadcrumbs}
                    categorySlug={categorySlug}
                    enableFilter
                    //
                    productUrl={(slug) => `${productSubURL}${paths.product.details(slug)}`}
                />
            </div>
        </>
    );
};

export const getServerSideProps = withSsrProps({
    isProtected: false,
    prefetch: async ({ q, ctx }) => {
        const categorySlug = 'ready-necklaces' as string;

        const data = await q.fetchQuery(productCategoriesQuery.get(categorySlug));

        if (data?.subCategories.length === 0) {
            const filter = { slug: categorySlug };
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
        }
    },
});

export default ReadyNecklaces;
