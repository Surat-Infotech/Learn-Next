import { FC } from 'react';

import { withSsrProps } from '@/utils/page';

import { CartView } from '@/sections/cart/view';

const CartPage: FC = () => <CartView />;

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default CartPage;
