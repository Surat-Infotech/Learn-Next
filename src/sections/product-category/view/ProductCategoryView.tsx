import { FC } from 'react';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';
import { IBreadcrumbItem } from '@/components/ui/breadcrumbs/TBreadcrumbs';
import { IProductCategoryCardItem } from '@/components/product/ProductCategoryCard';
import {
  ProductHeader,
  ProductCategoryCard,
  ProductHeaderWrapper,
  ProductCategoryWrapper,
} from '@/components/product';

// ----------------------------------------------------------------------

export type IPorductCategoryViewProps = {
  heading: string;
  content: string;
  breadcrumbs: IBreadcrumbItem[];
  categories: IProductCategoryCardItem[];
};

const ProductCategoryView: FC<IPorductCategoryViewProps> = (props) => {
  const { heading, content, breadcrumbs, categories } = props;

  return (
    <>
      <ProductHeaderWrapper>
        <TBreadcrumbs items={breadcrumbs} />

        <ProductHeader heading={heading} content={content} />
      </ProductHeaderWrapper>

      <ProductCategoryWrapper>
        {categories.map((category, idx) => (
          <ProductCategoryCard key={idx} {...category} />
        ))}
      </ProductCategoryWrapper>
    </>
  );
};

export default ProductCategoryView;
