import Head from 'next/head';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

import { isEmpty } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { NextPage, InferGetServerSidePropsType } from 'next';

import { productApi } from '@/api/product';
import { productCategoriesQuery } from '@/api/product-category';

import { withSsrProps } from '@/utils/page';

import { ProductCategoryView, ProductSubCategoryView } from '@/sections/product-category/view';

import { paths } from '@/routes/paths';
import FallbabkImg from '@/assets/image/category_fallback.png';

// ----------------------------------------------------------------------

const ProductCategory: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const { query } = useRouter();

  const categorySlug = query.category as string;
  const pathname = usePathname();
  const { data: category } = useQuery(productCategoriesQuery.get(categorySlug));

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: category?.name ?? '', isActive: true },
  ];

  const subcategories =
    category?.subCategories.map((c) => ({
      heading: c.name,
      backgroundImageSrc: !isEmpty(c.thumbnail) ? c.thumbnail : FallbabkImg.src,
      showMore: { href: paths.productCategory.subCategory.root(categorySlug, c.slug) },
    })) ?? [];

  const productSubURL =
    category?.name.toLowerCase().includes('chains') ||
    category?.slug.toLowerCase().includes('engagement-rings') ||
    category?.name.toLowerCase().includes('custom') ||
    category?.slug.toLocaleLowerCase().includes('ready-to-ship') ||
    category?.name.toLowerCase().includes('uncategorized')
      ? `${category?.slug.toLowerCase()}`
      : '';

  if (!category) {
    return null;
  }

  const getTitle = () => {
    switch (categorySlug) {
      case `engagement-rings`:
        return {
          title: 'Lab Grown Diamond Engagement Rings',
          description:
            'Explore our exquisite engagement ring collection. Find stunning designs, from classic to modern, and create the perfect symbol of your love with expert guidance.',
        };
      case `wedding-rings`:
        return {
          title: 'Lab Grown Diamond Wedding Band | Represent Your Love Forever',
          description:
            'Celebrate your love with our elegant wedding rings, crafted with precision and available in various metals to symbolize your lifelong commitment.',
        };
      case `pendants`:
        return {
          title: 'Lab Grown Diamond Pendants | Shop Unique Sustainable Pendants',
          description:
            'Explore Our collection of exquisite solitaire pendants. Simple yet striking, each pendant showcases a single, dazzling gem, making it an ideal choice for a refined and elegant accessory.',
        };
      case `chains`:
        return {
          title: 'Buy Gold Chain | Box Chain | Curb Platinum Chain | Rope Chain',
          description: `Our chains collection features sleek, durable designs crafted from premium metals, offering a versatile style that's perfect for adding a touch of elegance to any outfit.`,
        };
      case 'necklaces':
        return {
          title: 'Shop Lab Grown Diamond Tennis Necklaces ',
          description:
            'Lab grown diamond tennis necklaces are ideal for any event and supply a touch of beauty. Buy lab diamond necklace designs for women online at wholesale prices.',
        };
      default:
        return { title: '', description: '' };
    }
  };

  if (subcategories.length === 0) {
    return (
      <>
        <Head>
          <title>{getTitle().title || `${category?.name}`}</title>
          <meta name="description" content={getTitle().description || ''} />
        </Head>
        <div className="min-h-454">
          <ProductSubCategoryView
            heading={category.name}
            styleFilterHide
            content={category.description}
            breadcrumbs={breadcrumbs}
            categorySlug={categorySlug}
            enableFilter={!pathname.startsWith('/product-category/melee_diamond')}
            //
            productUrl={(slug) => `${productSubURL}${paths.product.details(slug)}`}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{getTitle().title || `${category?.name}`}</title>
        <meta name="description" content={getTitle().description || ''} />
      </Head>
      <ProductCategoryView
        heading={category.name}
        content={category.description}
        breadcrumbs={breadcrumbs}
        categories={subcategories}
      />
    </>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const categorySlug = ctx.params?.category as string;

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

export default ProductCategory;
