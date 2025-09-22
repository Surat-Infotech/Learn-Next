import { useState } from 'react';

import constate from 'constate';

import { ISingleOrder } from '@/api/order';

const useOrder = () => {
  const [orderData, setOrderData] = useState<ISingleOrder | null>(null);

  return {
    orderData,
    setOrderData,
  };
};

const [OrderProvider, useOrderContext] = constate(useOrder);

export { OrderProvider, useOrderContext };
