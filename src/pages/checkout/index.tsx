import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { pick } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';
import { useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

import { cartApi } from '@/api/cart';
import { addressDiarysQuery } from '@/api/address-diary';

import { ICartItem } from '@/stores/cart.context';

import { withSsrProps } from '@/utils/page';

import { CheckoutView } from '@/sections/checkout/view';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const defaultAddressFiles = [
  'first_name',
  'last_name',
  'phone',
  'email',
  'address',
  'city',
  'state',
  'country',
  'postcode',
  'place_type',
];

const CheckoutPage = () => {
  const { data: addressDiary } = useQuery(addressDiarysQuery.all({}));
  const [localCardItems] = useLocalStorage<ICartItem[]>('cart', []);
  const [cartData, setCartData] = useState([]);
  const { replace, query } = useRouter();
  const { data: auth, status: authStatus } = useSession();

  const defaultShippingAddress = pick(
    addressDiary?.find((a) => a.is_default && a.address_type === 'shipping'),
    defaultAddressFiles
  );
  const defaultBillingAddress = pick(
    addressDiary?.find((a) => a.is_default && a.address_type === 'billing'),
    defaultAddressFiles
  );

  async function getCartData() {
    try {
      if (query.order_id) return;
      if (auth && authStatus === 'authenticated') {
        await cartApi.get().then((res) => {
          if (res.data.data?.length === 0) replace(paths.home.root);
          if (res.data.data) {
            setCartData(res.data.data);
          }
        });
      } else {
        if (localCardItems?.length === 0) replace(paths.home.root);
        setCartData(localCardItems as any);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  }

  useEffect(() => {
    getCartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CheckoutView
      defaultShippingAddress={defaultShippingAddress as any}
      defaultBillingAddress={defaultBillingAddress as any}
      cartData={cartData}
    />
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, accessToken }) => {
    if (accessToken) {
      await q.fetchQuery(addressDiarysQuery.all({ accessToken }));
    }
  },
});

export default CheckoutPage;
