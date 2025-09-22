import { FC } from 'react';
import { usePathname } from 'next/navigation';

import { IProduct } from '@/api/product';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';
import ShopByShape from '@/components/product/ShopByShape';
import { ProductHeaderWrapper } from '@/components/product';
import { IBreadcrumbItem } from '@/components/ui/breadcrumbs/TBreadcrumbs';

import ProductFAQ from '../ProductFAQ';
import ProductDetail from '../ProductDetail';
import RingBuilderBar from '../RingBuilderBar';
import RingBuilderBarForDiamondToRing from '../RingBuilderBarForDiamondToRing';

// ----------------------------------------------------------------------

export type IProductDetailViewProps = {
  breadcrumbs: IBreadcrumbItem[];
  product: IProduct;
  //
  enableRingBuilder?: boolean;
  enableRingSize?: boolean;
  enableRingBuilderForDiamondToRing?: boolean;
};

const ProductDetailView: FC<IProductDetailViewProps> = (props) => {
  const {
    product,
    breadcrumbs,
    enableRingBuilder,
    enableRingSize,
    enableRingBuilderForDiamondToRing,
  } = props;
  const pathname = usePathname();
  const isRingBuilderProps = () => pathname.startsWith('/ring-preview');

  const _selected_shape = product?.diamond_type?.slug || (product?.diamond_type as any)?.[0]?.slug;

  return (
    <>
      <ProductHeaderWrapper>
        <TBreadcrumbs items={breadcrumbs} />
      </ProductHeaderWrapper>

      {enableRingBuilder && (
        <RingBuilderBar
          currentStep={isRingBuilderProps() ? 'choose-size' : 'choose-setting'}
          currentShape={_selected_shape}
        />
      )}

      {enableRingBuilderForDiamondToRing && (
        <RingBuilderBarForDiamondToRing
          currentStep={isRingBuilderProps() ? 'choose-size' : 'choose-diamond'}
        />
      )}

      <ProductDetail
        product={product}
        enableRingBuilder={enableRingBuilder}
        enableRingBuilderForDiamondToRing={enableRingBuilderForDiamondToRing}
        enableRingSize={enableRingSize}
      />

      {product.product_type === 'custom' && (
        <div style={{ marginTop: '-50px', marginBottom: '50px' }}>
          <ShopByShape />
        </div>
      )}

      <ProductFAQ faqCategories={product.category_faq} />
    </>
  );
};

export default ProductDetailView;
