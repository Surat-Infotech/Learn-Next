import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '@/api/product';

import { withSsrProps } from '@/utils/page';

import { DiamondProductView } from '@/sections/product-category/view';

// ----------------------------------------------------------------------

const PinkColorDiamond: NextPage = () => {
    const productSlug = '?slug=old-mine-cut-–-lab-grown-hpht-diamonds';

    const { data: product } = useQuery(productsQuery.get(productSlug));


    const breadcrumbs = [
        { title: 'Home', href: '/' },
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
        const productSlug = '?slug=old-mine-cut-–-lab-grown-hpht-diamonds';

        await q.fetchQuery(productsQuery.get(productSlug));
    },
});

export default PinkColorDiamond;
