import { FC } from 'react';
import Head from 'next/head';

import { IProduct } from '@/api/product';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductHeaderWrapper } from '@/components/product';
import { IBreadcrumbItem } from '@/components/ui/breadcrumbs/TBreadcrumbs';

import DiamondProduct from '../DiamondLostsProductDetails';

// ----------------------------------------------------------------------

export type IProductDetailViewProps = {
  breadcrumbs: IBreadcrumbItem[];
  product: IProduct;
  //
};

const DiamondProductView: FC<IProductDetailViewProps> = (props) => {
  const { product, breadcrumbs } = props;

  return (
    <>
      <Head>
        <title>{product.meta_data || product.name}</title>
        <meta name="description" content={product.meta_description} />
        <meta name="keywords" content={product.meta_keywords?.join(", ")} />
      </Head>

      <ProductHeaderWrapper>
        <TBreadcrumbs items={breadcrumbs} />
      </ProductHeaderWrapper>

      <DiamondProduct product={product} />
    </>
  );
};

export default DiamondProductView;
