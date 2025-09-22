import { FC } from 'react';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';
import { IProductUrl } from '@/components/product/ProductCard';
import { IBreadcrumbItem } from '@/components/ui/breadcrumbs/TBreadcrumbs';
import { ProductHeader, ProductHeaderWrapper } from '@/components/product';

import ProductList from '../ProductList';
import RingBuilderBar from '../RingBuilderBar';
import RingBuilderBarForDiamondToRing from '../RingBuilderBarForDiamondToRing';

// ----------------------------------------------------------------------

export type IPorductCategoryViewProps = {
  heading: string;
  content: string;
  breadcrumbs: IBreadcrumbItem[];
  styleFilterHide?: boolean;
  categorySlug: string;
  productUrl: IProductUrl;
  enableFilter: boolean;
  //
  enableRingBuilder?: boolean;
  enableRingBuilderForDiamondToRing?: boolean;
};

const ProductSubCategoryView: FC<IPorductCategoryViewProps> = (props) => {
  const {
    heading,
    content,
    breadcrumbs,
    categorySlug,
    productUrl,
    enableRingBuilder,
    enableRingBuilderForDiamondToRing,
    enableFilter,
    styleFilterHide = false,
  } = props;

  return (
    <>
      <ProductHeaderWrapper>
        <TBreadcrumbs items={breadcrumbs} />

        {(heading || content) && <ProductHeader heading={heading} content={content} />}
      </ProductHeaderWrapper>

      {enableRingBuilder && <RingBuilderBar currentStep="choose-setting" />}
      {enableRingBuilderForDiamondToRing && <RingBuilderBarForDiamondToRing currentStep="choose-diamond" />}

      <ProductList
        categorySlug={categorySlug}
        styleFilterHide={styleFilterHide}
        productUrl={productUrl}
        enableFilter={enableFilter}
      />
    </>
  );
};

export default ProductSubCategoryView;
