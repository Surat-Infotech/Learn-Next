import { useRouter } from 'next/router';

import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '@/api/product';

import { withSsrProps } from '@/utils/page';

import { ProductDetailView } from '@/sections/product-category/view';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const ProductDetail: NextPage = () => {
  const { query } = useRouter();

  const customSlug = `?displaySlug=${query.customSlug}` as string;

  const { data: product } = useQuery(productsQuery.get(customSlug));

  const categorySlug = product?.category?.find((c) => !c.parent_id)?.slug;
  const category = product?.category?.find((c) => c.slug === categorySlug);

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    categorySlug
      ? { title: category?.name ?? '', href: paths.productCategory.details(categorySlug) }
      : null,
    {
      title: product?.name ?? '',
      isActive: true,
    },
  ].filter((b) => b !== null) as any;

  if (!product) {
    return null;
  }

  return (
    <ProductDetailView
      product={product}
      breadcrumbs={breadcrumbs}
      enableRingBuilder={query.type === 'diamond-to-ring-builder' ? false : product.product_type === 'ring_setting'}
      enableRingBuilderForDiamondToRing={query.type === 'diamond-to-ring-builder'}
    />
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const customSlug = `?displaySlug=${ctx.params?.customSlug}` as string;


    await q.fetchQuery(productsQuery.get(customSlug));
  },
});

export default ProductDetail;
