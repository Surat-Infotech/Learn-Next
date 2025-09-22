import { IResponse } from '../types';
import { IVariation } from '../product';

export type ICreateOrderRequest = {
  product_ids: IProductId[];
  shipping_cost: number;
  //
  billing_address_id?: string;
  billing_address?: IBillingAddress;
  //
  shipping_address_id?: string;
  shipping_address?: IBillingAddress;
  //
  payment_method: string; // stripe | klarna | paypal | splitit | wire | crypto
  // shipping_company: string; // fedex | aramex | usps | ups
  coupon_id?: string;
  //
  tax?: number;
  message?: string;
  extra_charges?: number;
};

export type ICreateOrderResponse = IResponse<any>;
export type IOrderResponse = IResponse<IOrderList[]>;
export type ISingleOrderResponse = IResponse<ISingleOrder>;

export type IProductId = {
  product_id: string;
  variation_id?: string;
  diamond_id?: string;
  ring_size?: number;
};

export type IBillingAddress = {
  first_name: string;
  last_name: string;
  phone?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
};

export interface IOrderList {
  _id: string;
  order_base_price: number;
  shipping_cost: number;
  discount: number;
  tax: number;
  extra_charges: number;
  coupon_amount: number;
  order_status: string;
  payment_status: string;
  shipping_status: string;
  customer_id: string;
  tracking_details: any;
  billing_address_id: string;
  shipping_address_id: string;
  payment_method: string;
  shipping_company: string;
  address_schema: AddressSchema;
  customer_schema: CustomerSchema;
  express_shipping: boolean;
  purchase_note: string;
  order_notes: any[];
  updated_at: string | null;
  deleted_at: string | null;
  order_no: number;
  order_date: string;
  created_at: string;
  __v: number;
  cart_schema: CartSchema;
  products: Product[];
  coupons: Coupon[];
}

export interface AddressSchema {
  shipping: Shipping;
  billing: Shipping;
}

export interface Shipping {
  customer_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  address_second?: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  is_default: boolean;
  address_type: string;
  updated_at: string | null;
  deleted_at: string | null;
  created_by: string;
  _id: string;
  created_at: string;
  __v: number;
}

export interface CustomerSchema {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  mobile_no: string;
  country: string;
  state: string;
  city: string;
  post_code: string;
  preferred_payment_method: string;
  avatar: string;
  gender: string;
  dob: any;
  status: string;
  updated_at: string;
  deleted_at: string | null;
  created_at: string;
  __v: number;
  created_by: string;
  updated_by: string;
}

export interface CartSchema {
  cart_contents: CartContents;
  applied_coupons: AppliedCoupon[];
}

export interface CartContents {
  '0': N0;
}

export interface N0 {
  ls_builder: LsBuilder;
  product_id: string;
  variation_id: string;
  variation: Variation[];
  quantity: number;
  line_tax_data: LineTaxData;
  line_subtotal: number;
  line_subtotal_tax: number;
  line_total: number;
  line_tax: number;
}

export interface LsBuilder {
  ls_rb_type: string;
  sp_size: number;
}

export interface Variation {
  key: string;
  value: string;
}

export interface LineTaxData {
  subtotal: any[];
  total: any[];
}

export interface AppliedCoupon {
  coupon_code: string;
  amount: number;
}

export interface Product {
  _id: string;
  quantity: number;
  product_schema: IProductSchema;
  diamond_schema: IDiamondSchema;
  variation_schema: IVariation;
  ring_size: number | string;
  back_setting: string;
  bracelet_size: string;
}

export interface IDiamondSchema {
  is_overnight: any;
  certificate_no: string | any;
  _id: string;
  sku: string;
  shape: string;
  price: number;
  regular_price: number;
  carat: number;
  cut: string;
  intensity: string;
  color: string;
  clarity: string;
  video_url: string;
  certificate: string;
  certificate_type: string;
  measurerment: string;
  note: string;
  stock_status: boolean;
  sale: boolean;
  d_type: string;
  table: string;
  depth: string;
  lw_ratio: string;
  express_shipping: boolean;
  hearts_and_arrows: boolean;
  vendor_name: string;
  vendor_city: string;
  vendor_country: string;
  sale_price: number;
  sheet_provider: string;
  stock_no: any;
  rap: string;
  deleted_at: any;
  updated_at: any;
  created_at: string;
  __v: number;
}

export interface IProductSchema {
  _id: string;
  name: string;
  short_description: string;
  long_description: string;
  product_type: string;
  diamond_type: string;
  category_id: string[];
  regular_price: number;
  sale_price: number;
  sale_schedule: SaleSchedule;
  stock_qty: number;
  stock_status: string;
  status: string;
  video_provider: string;
  video_link: string;
  images: string[];
  updated_at: string | null;
  deleted_at: string | null;
  created_by: string;
  sku: string;
  created_at: string;
  slug: string;
  __v: number;
}

export interface SaleSchedule {
  start_date: string;
  end_date: string;
}

export interface Name {
  key: string;
  value: string;
}

export interface Schedule {
  start_date: string;
  end_date: string;
}

export interface Coupon {
  _id: string;
  coupon_schema: CouponSchema;
}

export interface CouponSchema {
  image: string;
  _id: string;
  code: string;
  description: string;
  discount_type: string;
  allow_free_shipping: boolean;
  start_date: string;
  min_order_amount: string;
  limit_per_person: number;
  status: boolean;
  excludes_product_category: any[];
  uses_limit_per_coupon: number;
  used_limit_per_coupon: number;
  coupon_amt: number;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  __v: number;
}
export interface ISingleOrder {
  express_shipping: any;
  _id: string;
  order_base_price: number;
  shipping_cost: number;
  discount: number;
  tax: number;
  extra_charges: number;
  coupon_amount: number;
  order_status: string;
  payment_status: string;
  shipping_status: string;
  payment_method: string;
  shipping_company: string;
  address_schema: AddressSchema;
  customer_schema: CustomerSchema;
  purchase_note: string;
  order_notes: any[];
  updated_at: any;
  deleted_at: any;
  order_no: number;
  order_date: string;
  created_at: string;
  product_details: Product[];
  coupon_details: Coupon[];
}

export interface IUpdatePaymentStatusRequest {
  payment_status?: string; // completed | pending | completed | failed | refunded
  payment_method: string; // stripe | klarna | paypal | splitit | wire | crypto
  transaction_id?: string | undefined;
  extra_charges?: number | any;
}

export interface IOrderValidateStockRequest {
  product_ids: {
    product_id?: string;
    variation_id?: string;
    diamond_id?: string;
  }
}

export type IOrderValidateStockResponse = IResponse<any>;


export interface IUpdatePaymentStatusResponse { }
