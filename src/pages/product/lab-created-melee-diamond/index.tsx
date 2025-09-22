import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '@/api/product';

import { withSsrProps } from '@/utils/page';

import { DiamondProductView } from '@/sections/product-category/view';

// import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const MelleDiamondPage: NextPage = () => {
  const productSlug = '?slug=round-shape-–-lab-grown-melee-diamond';

  const { data: product } = useQuery(productsQuery.get(productSlug));

  // const categorySlug = 'melee_diamond';

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    // categorySlug
    //   ? { title: 'Melee Diamond', href: paths.productCategory.details(categorySlug) }
    //   : null,
    {
      title: product?.name ?? '',
      isActive: true,
    },
  ].filter((b) => b !== null) as any;

  if (!product) {
    return null;
  }

  return <DiamondProductView product={product} breadcrumbs={breadcrumbs} />;
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const productSlug = '?slug=round-shape-–-lab-grown-melee-diamond';

    await q.fetchQuery(productsQuery.get(productSlug));
  },
});

export default MelleDiamondPage;
