import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { colorinventoriesQuery } from '@/api/lab-created-colored-diamonds/lab-created-colored-diamonds';

import { InventoryProvider } from '@/stores/inventory.context';

import { withSsrProps } from '@/utils/page';

import ColorInventoryListView from '@/sections/lab-created-colored-diamonds/view/colorInventoryListView';

// ----------------------------------------------------------------------

const ColorDiamondInventory: NextPage = () => {
  const { data: rangeDetails } = useQuery(colorinventoriesQuery.range());
  return (
    <InventoryProvider>
      <ColorInventoryListView range={rangeDetails} />
    </InventoryProvider>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q }) => {
    await q.fetchQuery(colorinventoriesQuery.range());
  },
});

export default ColorDiamondInventory;
