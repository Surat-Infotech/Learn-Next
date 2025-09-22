import { useRouter } from 'next/router';

import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '@/api/product';

import { withSsrProps } from '@/utils/page';

import { ProductDetailView } from '@/sections/product-category/view';

// ----------------------------------------------------------------------

const RingPreviewDetail: NextPage = () => {
  const { query } = useRouter();

  const productId = `?id=${query.productId}` as string;

  const { data: product } = useQuery(productsQuery.get(productId));

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    {
      title: 'Ring preview',
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
      enableRingSize
      enableRingBuilderForDiamondToRing={query.type === 'diamond-to-ring-builder'}
    />
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const productId = `?id=${ctx.params?.productId}` as string;

    await q.fetchQuery(productsQuery.get(productId));
  },
});

export default RingPreviewDetail;
