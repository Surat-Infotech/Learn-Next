import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useInventoryContext } from '@/stores/inventory.context';

import RingBuilderBar from '@/sections/product-category/RingBuilderBar';
import RingBuilderBarForDiamondToRing from '@/sections/product-category/RingBuilderBarForDiamondToRing';

import { IRangeProperties } from '@/types';

import InventoryTable from '../InventoryTable';
import InventoryFilter from '../InventoryFilter';

const InventoryListView = ({ range }: IRangeProperties) => {
  const { query } = useRouter();
  const { setRange, setIsFilterLoading } = useInventoryContext();

  if (range) {
    setRange(range);
  }

  useEffect(() => {
    setIsFilterLoading(true);
  }, [setIsFilterLoading]);

  return (
    <div className="ls_inventorypg">
      <div className="banner_section mt_40">
        {query.type === 'ring-builder' && <RingBuilderBar currentStep="choose-diamond" />}
        {query.type === 'diamond-to-ring-builder' && (
          <RingBuilderBarForDiamondToRing currentStep="choose-setting" />
        )}

        <InventoryFilter />
      </div>

      <InventoryTable />
    </div>
  );
};

export default InventoryListView;
