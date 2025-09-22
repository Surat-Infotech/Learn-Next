import { useInventoryContext } from '@/stores/inventory.context';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductHeader, ProductHeaderWrapper } from '@/components/product';

import InventoryFilter from '@/sections/inventory/InventoryFilter';
import RingBuilderBarForDiamondToRing from '@/sections/product-category/RingBuilderBarForDiamondToRing';

import { Ranges } from '@/types';

import DiamondCollectionTable from '../DiamondCollectionTable';

// ----------------------------------------------------------------------

interface DiamondCollectionProps {
  heading: string;
  content: string;
  range: Ranges;
}

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Collections', isActive: true },
];

const DiamondCollection = ({ heading, content, range }: DiamondCollectionProps) => {
  const { setRange } = useInventoryContext();

  if (range) {
    setRange(range);
  }
  return (
    <div className="ls_inventorypg">
      <ProductHeaderWrapper>
        <TBreadcrumbs items={breadcrumbs} />
        {(heading || content) && <ProductHeader heading={heading} content={content} />}
      </ProductHeaderWrapper>
      <div className="banner_section mt_40">
        <RingBuilderBarForDiamondToRing currentStep="choose-setting" />

        <InventoryFilter />
      </div>

      <DiamondCollectionTable />
    </div>
  );
};

export default DiamondCollection;
