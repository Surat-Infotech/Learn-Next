import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { inventoriesQuery } from '@/api/inventory/inventory';

import { InventoryProvider } from '@/stores/inventory.context';

import { withSsrProps } from '@/utils/page';

import { InvenrotyListView } from '@/sections/inventory/view';

// ----------------------------------------------------------------------

const Inventory: NextPage = () => {
  const { data: rangeDetails } = useQuery(inventoriesQuery.range());

  return (
    <InventoryProvider>
      <InvenrotyListView range={rangeDetails} />
      {/* <InvenrotyListView /> */}
    </InventoryProvider>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q }) => {
    await q.fetchQuery(inventoriesQuery.range());
  },
});

export default Inventory;
