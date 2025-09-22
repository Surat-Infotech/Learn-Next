import constate from 'constate';
import { useLocalStorage } from 'usehooks-ts';

import { IProduct, IVariation } from '@/api/product';
import { IWhiteDiamond } from '@/api/inventory/types';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

// ----------------------------------------------------------------------

export type ICartAttribute = {
  Metal?: string;
  'Carat Weight'?: string;
  'Ring Size'?: string;
  'Back Setting'?: string;
  'Braclete Size'?: string;
  'Setting Size'?: string;
  Size?: string;
  'Available Colors'?: string;
  Purity?: string;
};

export type ICartItem = {
  [x: string]: any;
  quantity: number;
  variation_schema: any;
  diamond_schema: any;
  product_schema: any;
  type: 'product' | 'diamond';
  product?: IProduct | null | undefined;
  variant?: IVariation | null | undefined;
  attribute?: ICartAttribute;
  diamond?: IWhiteDiamond | IColorDiamond | null | undefined;
  diamond_type?: 'white' | 'color' | null | undefined;
  size?: string | null | undefined;
  back_setting?: string | null | undefined;
  bracelet_size?: string | null | undefined;
  qty?: number;
  _id?: string | null | any;
  ring_size?: string | null | any;
};

const useCart = () => {
  const [, setCartItems] = useLocalStorage<ICartItem[]>('cart', []);

  return {
    setCartItems,
  };
};

const [CartProvider, useCartContext] = constate(useCart);

export { CartProvider, useCartContext };
