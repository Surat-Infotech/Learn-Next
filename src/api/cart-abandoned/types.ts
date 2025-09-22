export type ICreateCartAbandonmentResponse = {
  isSuccess: boolean;
  status: number;
  message: string;
}

export type ICreateCartAbandonmentRequest = {
  cart_amount: number,
  shipping?: string,
  coupon_name?: string,
  discount?: string,
  other?: string,
  products: [
    {
      name: string,
      image: string,
      price: number,
      quantity: number,
      available_colors?: string,
      purity?: string,
      size?: string,
      ring_size?: string | number,
      bracelet_length?: string | number,
      back_setting?: string,
      carat_weight?: string,
      metal?: string
      label?: string
    }
  ],
  order_note?: string,
  billing_address?: {
    first_name?: string,
    last_name?: string,
    country_code?: string,
    phone?: string | number,
    email?: string,
    address?: string,
    address_second?: string,
    city?: string,
    state?: string,
    country?: string,
    postcode?: string | number,
  },
  shipping_address?: {
    first_name?: string,
    last_name?: string,
    country_code?: string,
    phone?: string | number,
    email?: string,
    address?: string,
    address_second?: string,
    city?: string,
    state?: string,
    country?: string,
    postcode?: string | number,
  },
}
