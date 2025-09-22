import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useInventoryContext } from '@/stores/inventory.context';

import RingBuilderBar from '@/sections/product-category/RingBuilderBar';
import RingBuilderBarForDiamondToRing from '@/sections/product-category/RingBuilderBarForDiamondToRing';

import { IRangeProperties } from '@/types';

import ColorInventoryTable from '../ColorInventoryTable';
import ColorInventoryFilter from '../ColorInventoryFilter';
// import ColorInventoryHeading from '../ColorInventoryHeading';

const ColorInventoryListView: FC<IRangeProperties> = ({ range }) => {
  const { query } = useRouter();

  const { setRange, setIsFilterLoading } = useInventoryContext();

  useEffect(() => {
    setIsFilterLoading(true);
  }, [setIsFilterLoading]);

  if (range) {
    setRange(range);
  }

  return (
    <div className="ls_inventorypg">
      <div className="banner_section mt_40">
        {/* <ColorInventoryHeading /> */}

        {query.type === 'ring-builder' && <RingBuilderBar currentStep="choose-diamond" />}
        {query.type === 'diamond-to-ring-builder' && (
          <RingBuilderBarForDiamondToRing currentStep="choose-setting" />
        )}

        <ColorInventoryFilter />
      </div>

      <ColorInventoryTable />
    </div>
  );
};

export default ColorInventoryListView;
