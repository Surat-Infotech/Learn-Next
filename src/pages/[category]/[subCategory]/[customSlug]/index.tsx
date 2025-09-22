import { useRouter } from 'next/router';

import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '@/api/product';
import { productCategoriesQuery } from '@/api/product-category';

import { withSsrProps } from '@/utils/page';

import { ProductDetailView } from '@/sections/product-category/view';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const ProductDetail: NextPage = () => {
  const { query } = useRouter();

  const categorySlug = query.category as string;
  const subCategorySlug = query.subCategory as string;
  const customSlug = `?displaySlug=${query.customSlug}` as string;

  const { data: category } = useQuery(productCategoriesQuery.get(categorySlug));
  const { data: product } = useQuery(productsQuery.get(customSlug));

  const subCategory = category?.subCategories.find((c) => c.slug === subCategorySlug);

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: category?.name ?? '', href: paths.productCategory.details(categorySlug) },
    {
      title: subCategory?.name ?? '',
      href: paths.productCategory.subCategory.root(categorySlug, subCategorySlug),
    },
    {
      title: product?.name ?? '',
      isActive: true,
    },
  ];

  if (!product) {
    return null;
  }

  return <ProductDetailView product={product} breadcrumbs={breadcrumbs} />;
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const categorySlug = ctx.params?.category as string;
    const customSlug = `?displaySlug=${ctx.params?.customSlug}` as string;

    await q.fetchQuery(productCategoriesQuery.get(categorySlug));
    await q.fetchQuery(productsQuery.get(customSlug));
  },
});

export default ProductDetail;
