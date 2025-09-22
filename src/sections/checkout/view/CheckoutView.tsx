/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FC, useRef, useMemo, useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import countryData from 'countries.json';
import { useForm } from 'react-hook-form';
import { isEmpty, debounce } from 'lodash';
import 'react-intl-tel-input/dist/main.css';
import { useLocalStorage } from 'usehooks-ts';
import { object, string, boolean } from 'yup';
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Tabs, Radio, Group, Checkbox, Textarea, Accordion } from '@mantine/core';

import { couponApi } from '@/api/coupon';
import { customerApi } from '@/api/customer';
import { klarnaApi } from '@/api/payment/klarna';
import { SplitItApi } from '@/api/payment/splitit';
import { IAddressDiary } from '@/api/address-diary';
import { IWhiteDiamond } from '@/api/inventory/types';
import { cartAbandonedApi } from '@/api/cart-abandoned';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';
import { orderApi, IBillingAddress, IOrderValidateStockRequest } from '@/api/order';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { ICartItem } from '@/stores/cart.context';
import { useOrderContext } from '@/stores/order.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import HtmlContent from '@/utils/html-content';

import Input from '@/components/ui/input/input';
import { TTooltip } from '@/components/ui/tooltip';
import SelectUI from '@/components/ui/select/select';
import { findAttributesLabelValueObj } from '@/components/common-functions';
import GooglePlaceAutocomplete from '@/components/google/GooglePlaceAutocompleteMap';

import { paths } from '@/routes/paths';
import { dialCode } from '@/_mock/dial-code';
import LoadingImage from '@/assets/image/Loading.gif';
import paypalImg from '@/assets/image/logo/paypal.png';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';

import { ICheckoutFormRef } from '../CheckoutForm';

// ----------------------------------------------------------------------

// Only load the Stripe component on the client side
const CheckoutFormWrapper = dynamic(() => import('../CheckoutFormWrapper'), { ssr: false });

// ----------------------------------------------------------------------

const fields = {
  address: {
    first_name: 'First Name',
    last_name: 'Last Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Address Line 1',
    address_second: 'Address Line 2',
    city: 'Town/City',
    state: 'State',
    country: 'Country',
    postcode: 'Zip Code',
  },
  message: 'Order Note',
  coupon_code: 'Coupon',
  shipping_cost: 'Shipping Cost',
  payment_method: 'Payment Method',
};

const defaultValues = {
  billing_address: {} as IBillingAddress,
  shipping_address: {} as IBillingAddress,
  shipping_cost: '0',
  billing_same_as_shipping: true,
  payment_method: 'stripe', // stripe | klarna | paypal | splitit | wire | crypto
  place_type: 'home',
  message: '',
};

export type ICheckoutViewProps = {
  defaultShippingAddress: IAddressDiary | undefined;
  defaultBillingAddress: IAddressDiary | undefined;
  cartData: any;
};

const generatePassword = (length: number) => {
  let password = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password;
};

const CheckoutView: FC<ICheckoutViewProps> = (props) => {
  const { defaultShippingAddress, defaultBillingAddress, cartData } = props;
  const { query, replace } = useRouter();
  const { setOrderData } = useOrderContext();
  const { resetRingBuilder, setDiamondSku } = useRingBuilderContext();

  const { data: auth, status: authStatus } = useSession();

  const [billingVisible, setBillingVisible] = useState<boolean>(false);
  const toggleBillingVisibility = () => {
    const currentValue = watch('billing_same_as_shipping');
    setValue('billing_same_as_shipping', !currentValue);
    setBillingVisible(!billingVisible);
  };
  const { colorFilters, clarityFilters, REAL_COLOR_OPTIONS, cutFilters } = useInventoryFilter();

  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [cartItems, setClientCartItems] = useState<ICartItem[]>([]);

  const [, setCheckOutPreview] = useState<any[]>([]);

  const [totalPrice, setCartTotalPrice] = useState<number>(0);
  const [_cartTotalPrice, _setCartTotalPrice] = useLocalStorage<number>('cartTotal', 0);
  const [localCardItems, setLocalCardItems] = useLocalStorage<ICartItem[]>('cart', []);

  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [_couponDiscount, _setCouponDiscount] = useLocalStorage<number>('coupon', 0);

  const [_couponName, _setCouponName] = useLocalStorage<string>('couponName', '');
  const [, setLocalCardLength] = useLocalStorage<number | any>('cartLength', 0);

  const [applyCodeShow, setApplyCodeShow] = useState<boolean>(false);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [_shipping_cost, _setShipping_cost] = useLocalStorage<number>('shippingCost', 35);
  const [shipping_cost, setShipping_cost] = useState(35);

  const [cartAbandonedProducts, setCartAbandonedProducts] = useState([]);
  const [_klarnaClientToken, setklarnaClientToken] = useState('');

  const refCheckoutForm = useRef<ICheckoutFormRef>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setRePaymentOrderData] = useState<any>(null);
  const [ipCountryCode, setIpCountryCode] = useState('');
  const [mobileAlert, setMobileAlert] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [mobile, setMobile] = useState<string>('');
  const [mobileError, setMobileError] = useState<boolean>(false);

  const [googleShippingAddress, setGoogleShippingAddress] = useState<any[]>([]);
  const [googleBillingAddress, setGoogleBillingAddress] = useState<any[]>([]);
  const rePaymentOrderId = useMemo(() => query.order_id, [query.order_id]);

  const allCustom = useMemo(
    () =>
      (cartItems.length > 0 ? cartItems : localCardItems).every(
        (e: { product_schema: { product_type: string } }) =>
          e?.product_schema?.product_type === 'custom'
      ),
    [localCardItems, cartItems]
  );

  let klarnaClientToken: string = '';
  let InstallmentPlanNumber: string = '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!rePaymentOrderId) return;
        const { data: _orderData } = await orderApi.get(rePaymentOrderId as string);
        setRePaymentOrderData(_orderData.data);
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [rePaymentOrderId]);

  // Set the cart items from local storage
  useEffect(() => {
    setCouponDiscount(_couponDiscount);
    setClientCartItems(cartData);
    setShipping_cost(allCustom ? 0 : _shipping_cost);
    setCartTotalPrice(_cartTotalPrice);
  }, [cartItems, _couponDiscount, _shipping_cost, cartData, _cartTotalPrice, allCustom]);

  const schema = object({
    shipping_address: object({
      first_name: string().required().trim().max(50).label(fields.address.first_name),
      last_name: string().required().trim().max(50).label(fields.address.last_name),
      phone: string()
        .optional()
        .trim()
        .max(16)
        .matches(/^[\d-]+$/, "Phone number can only contain digits and '-'")
        .test('phone-length', 'Phone number must be between 8 and 16 digits.', (value) => {
          if (!value) return true;
          // Count the number of "-" in the string
          const dashCount = (value.match(/-/g) || []).length;
          // Determine the required minimum length
          const requiredMinLength = 8 + dashCount;
          // Validate that the value meets the required minimum length
          return value.length >= requiredMinLength;
        })
        .label(fields.address.phone),
      email: string().email().required().trim().max(100).label(fields.address.email),
      address: string().required().trim().max(500).label(fields.address.address),
      address_second: string().optional().trim().max(500).label(fields.address.address_second),
      city: string().required().trim().max(30).label(fields.address.city),
      state: string()
        .nullable()
        .trim()
        .max(30, 'State must be at most 30 characters')
        .when('shipping_address.country', {
          is: () => {
            // Get the list of states for the selected country
            const stateList =
              countryData.find((item) => item.name === watch('shipping_address.country'))?.states ||
              [];
            return stateList.length > 0;
          },
          // eslint-disable-next-line @typescript-eslint/no-shadow
          then: (schema) => schema.required('This field is required'),
          // eslint-disable-next-line @typescript-eslint/no-shadow
          otherwise: (schema) => schema.optional(),
        }),
      country: string().required().trim().max(30).label(fields.address.country),
      postcode: string().required().trim().max(30).label(fields.address.postcode),
    }).optional(),
    //
    billing_same_as_shipping: boolean().optional(),
    billing_address: object().when('billing_same_as_shipping', {
      is: (val: boolean) => !val,
      then: (_s) =>
        _s.shape({
          first_name: string().trim().required().max(50).label(fields.address.first_name),
          last_name: string().trim().required().max(50).label(fields.address.last_name),
          // phone: string().optional().trim().max(16).min(8).label(fields.address.phone),
          // email: string().email().trim().required().max(100).label(fields.address.email),
          address: string().trim().required().max(500).label(fields.address.address),
          address_second: string().trim().optional().max(500).label(fields.address.address_second),
          city: string().trim().required().max(30).label(fields.address.city),
          state: string()
            .nullable()
            .trim()
            .max(30, 'State must be at most 30 characters')
            .when('billing_address.country', {
              is: () => {
                // Get the list of states for the selected country
                const stateList =
                  countryData.find((item) => item.name === watch('billing_address.country' as any))
                    ?.states || [];
                return stateList.length > 0;
              },
              // eslint-disable-next-line @typescript-eslint/no-shadow
              then: (schema) => schema.required('This field is required'),
              // eslint-disable-next-line @typescript-eslint/no-shadow
              otherwise: (schema) => schema.optional(),
            }),
          country: string().trim().required().max(30).label(fields.address.country),
          postcode: string().trim().required().max(30).label(fields.address.postcode),
        }),
      otherwise: (_s) => _s.shape({}),
    }),
    //
    message: string()
      .optional()
      .trim()
      .max(2500, 'Order Note must be 2500 characters or less')
      .label(fields.message),
    shipping_cost: string().required().label(fields.shipping_cost),
    payment_method: string().required().label(fields.payment_method),
    coupon_code: string().trim().optional().label(fields.coupon_code),
  });

  const {
    control,
    setValue,
    getValues,
    setFocus,
    setError,
    resetField,
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultValues,
      billing_same_as_shipping: isEmpty(defaultBillingAddress),
      shipping_address: defaultShippingAddress ?? defaultValues.shipping_address,
      billing_address: defaultBillingAddress ?? defaultValues.billing_address,
      // shipping_cost: String(shipping_cost),
    },
  });

  const shippingAddressStateList =
    countryData.find((item) => item.name === watch('shipping_address.country'))?.states || [];
  const billingAddressStateList =
    countryData.find((item) => item.name === watch('billing_address.country' as any))?.states || [];

  const handlePhoneNumberChange = (
    isValid: boolean,
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    countryData: any
  ) => {
    const number = value.replace(/[^\d-]/g, '');
    const dashCount = (number.match(/-/g) || []).length;

    // Calculate the required minimum length
    const requiredMinLength = 8 + dashCount;

    if (number.length < requiredMinLength || number.length > 16) {
      setMobileAlert('Phone number must be between 8 and 16 digits.');
    } else {
      setMobileAlert('');
    }
    setMobile(number);
    if (countryData.dialCode !== countryCode) {
      setCountryCode(countryData.dialCode);
    }
  };

  const handleSelectFlag = (_mobile: string, country: any) => {
    setCountryCode(country.dialCode);
  };

  useEffect(() => {
    if (watch('shipping_cost' as any)) {
      _setShipping_cost(Number(watch('shipping_cost' as any)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('shipping_cost' as any)]);

  useEffect(() => {
    if (
      JSON.parse(window.localStorage.getItem('shippingType') as string) === 'PAID' &&
      !allCustom
    ) {
      if (_cartTotalPrice > 500) {
        setValue('shipping_cost', '0');
      } else if (_cartTotalPrice < 500 && watch('shipping_cost') !== '120') {
        setValue('shipping_cost', '35');
      } else if (shipping_cost === 120) {
        setValue('shipping_cost', '120');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_cartTotalPrice, allCustom, setValue, shipping_cost]);

  // Fetch user country code using their IP address
  useEffect(() => {
    const fetchCountryCodeFromIP = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const countryData = response.data;
        setIpCountryCode(countryData.country_code.toLowerCase());
        setMobile(defaultShippingAddress?.phone ?? defaultValues.shipping_address.phone ?? '');
      } catch (err) {
        console.error('Error fetching country from IP', err);
      }
    };

    fetchCountryCodeFromIP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDiamondTitle = useCallback(
    (diamond: IWhiteDiamond | IColorDiamond, diamond_type: string, needIcons?: boolean) => (
      <p className="text-capitalize text-start m-0">
        {`${diamond?.shape?.replaceAll('_', ' ')} Shape ${
          cutFilters.find((_c) => _c.value === Number(diamond?.cut))?.label_view
        } Cut ${diamond?.carat} Carat ${
          ((diamond as any)?.intensity ? REAL_COLOR_OPTIONS : colorFilters).find(
            (_c) => _c.value === Number(diamond?.color)
          )?.label_view
        } Color ${
          clarityFilters.find((_c) => _c.value === Number(diamond?.clarity))?.label_view
        } Clarity Lab Grown Diamond - ${diamond?.sku}`}{' '}
        {needIcons && diamond.is_overnight ? (
          <img
            className="mb-1 ms-1"
            src={overNightImage.src}
            alt="overnight"
            style={{ width: '20px', height: '20px' }}
          />
        ) : (
          needIcons &&
          diamond.express_shipping && (
            <img
              className="mb-1 ms-1"
              src={ShippingImg.src}
              alt="express"
              style={{ width: '20px', height: '20px' }}
            />
          )
        )}
      </p>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const formValues = watch();
  const selectedShippedCountry = watch('shipping_address.country');
  const selectedShippedState = watch('shipping_address.state');

  // for shipping
  useMemo(() => {
    // for reset state when country is onChanging
    if (selectedShippedState) {
      setValue('shipping_address.state', null as any);
    }

    // for reset state when country is null
    if (!selectedShippedCountry && selectedShippedState) {
      setValue('shipping_address.state', null as any);
      setFocus('shipping_address.country');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShippedCountry]);

  useEffect(() => {
    const stateList =
      countryData.find((item) => item.name === watch('shipping_address.country' as any))?.states ||
      [];
    if (
      selectedShippedCountry &&
      !selectedShippedState &&
      stateList?.length > 0 &&
      errors?.shipping_address
    ) {
      setError('shipping_address.state', { type: 'custom', message: 'This Field is Required' });
    }
    if (
      selectedShippedCountry &&
      !selectedShippedState &&
      stateList?.length === 0 &&
      errors?.shipping_address
    ) {
      resetField('shipping_address.state');
    }
  }, [
    errors?.shipping_address,
    resetField,
    selectedShippedCountry,
    selectedShippedState,
    setError,
    watch,
  ]);

  const selectedBilledCountry = watch('billing_address.country' as any);
  const selectedBilledState = watch('billing_address.state' as any);

  useEffect(() => {
    const stateList =
      countryData.find((item) => item.name === watch('billing_address.country' as any))?.states ||
      [];
    if (
      selectedBilledCountry &&
      !selectedBilledState &&
      stateList?.length > 0 &&
      errors?.billing_address
    ) {
      setError('billing_address.state' as any, {
        type: 'custom',
        message: 'This Field is Required',
      });
    }
    if (
      selectedBilledCountry &&
      !selectedBilledState &&
      stateList?.length === 0 &&
      errors?.billing_address
    ) {
      resetField('billing_address.state' as any);
    }
  }, [
    errors?.billing_address,
    resetField,
    selectedBilledCountry,
    selectedBilledState,
    setError,
    watch,
  ]);

  // for billing
  useMemo(() => {
    // for reset state when country is onChanging
    if (selectedBilledState) {
      setValue('billing_address.state' as any, null as any);
    }

    // for reset state when country is null
    if (!selectedBilledCountry && selectedBilledState) {
      setValue('billing_address.state' as any, null as any);
      setFocus('billing_address.country' as any);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBilledCountry]);

  useMemo(() => {
    if (defaultBillingAddress?.state) {
      setValue('billing_address.state' as any, defaultBillingAddress.state);
    }
    if (defaultShippingAddress?.state) {
      setValue('shipping_address.state', defaultShippingAddress.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBillingAddress, defaultShippingAddress]);

  // for set default payment method stripe
  useEffect(() => {
    setValue('payment_method', 'stripe');
    paymentMethodChange('stripe');
  }, []);

  const paymentCharge = useMemo(() => {
    if (rePaymentOrderId && orderData) {
      if (orderData?.order_base_price && formValues.payment_method === 'stripe') {
        const price = Number(orderData?.order_base_price) + Number(orderData?.shipping_cost);
        return Number((5 / 100) * price).toFixed(2);
      }
    }
    if (totalPrice && formValues.payment_method === 'stripe') {
      const price = totalPrice + Number(shipping_cost);
      return Number((5 / 100) * price).toFixed(2);
    }
    return 0;
  }, [
    totalPrice,
    orderData?.order_base_price,
    orderData?.shipping_cost,
    rePaymentOrderId,
    formValues.payment_method,
    shipping_cost,
  ]);

  const orderKlarnaData =
    orderData?.product_details?.length > 0 || cartItems.length > 0
      ? (orderData?.product_details?.length > 0 ? orderData?.product_details : cartItems)
          .map(
            (
              {
                diamond_schema,
                product_schema,
                back_setting,
                bracelet_size,
                ring_size,
                variation_schema,
                quantity,
                _id,
              }: any,
              idx: number
            ) => {
              // Conditional check for product_schema and diamond_schema
              if (product_schema && diamond_schema) {
                return {
                  name: `${product_schema?.name} - ${getDiamondTitle(diamond_schema, diamond_schema?.intensity ? 'color' : 'white')?.props?.children?.[0] || getDiamondTitle(diamond_schema, diamond_schema?.intensity ? 'color' : 'white')?.props?.children}`,
                  quantity: 1,
                  unit_price:
                    Number(variation_schema?.sale_price ?? product_schema?.sale_price) +
                    Number(diamond_schema?.price),
                  tax_rate: 0,
                  total_amount:
                    Number(variation_schema?.sale_price ?? product_schema?.sale_price) +
                    Number(diamond_schema?.price),
                  total_discount_amount: 0,
                  total_tax_amount: 0,
                  image_url:
                    variation_schema?.default_image ??
                    variation_schema?.images?.[0] ??
                    product_schema?.default_image ??
                    product_schema?.images?.[0],
                  reference: '',
                };
              }
              if (product_schema) {
                return {
                  name: product_schema?.name || undefined,
                  quantity: quantity ?? 1,
                  unit_price: variation_schema?.sale_price ?? product_schema?.sale_price,
                  tax_rate: 0,
                  total_amount:
                    (quantity ?? 1) * variation_schema?.sale_price ||
                    (quantity ?? 1) * product_schema?.sale_price,
                  total_discount_amount: 0,
                  total_tax_amount: 0,
                  image_url:
                    variation_schema?.default_image ??
                    variation_schema?.images?.[0] ??
                    product_schema?.default_image ??
                    product_schema?.images?.[0],
                  reference: '',
                };
              }
              if (diamond_schema) {
                return {
                  name:
                    getDiamondTitle(diamond_schema, diamond_schema?.intensity ? 'color' : 'white')
                      ?.props?.children?.[0] ||
                    getDiamondTitle(diamond_schema, diamond_schema?.intensity ? 'color' : 'white')
                      ?.props?.children ||
                    undefined,
                  quantity: quantity ?? 1,
                  unit_price: diamond_schema?.price,
                  tax_rate: 0,
                  total_amount: diamond_schema?.price,
                  total_discount_amount: 0,
                  total_tax_amount: 0,
                  image_url: `${diamond_schema?.shape?.replaceAll('_', ' ')} Shape`,
                  reference: '',
                };
              }
              return null;
            }
          )
          .filter((item: null) => item !== null)
      : [];

  const [isSubmitting, setIsSubmitting] = useState(false);

  useMemo(() => {
    const products = cartItems.flatMap((item: any) => {
      const diamondName = getDiamondTitle(
        item.diamond_schema,
        item.diamond_schema?.intensity ? 'color' : 'white'
      );
      if (item.product_schema && item.diamond_schema) {
        return [
          {
            name: `${item?.product_schema?.name} ${item?.product_schema?.parent_sku ? `- ${item?.product_schema?.parent_sku}` : ''}`,
            image:
              item?.variation_schema?.image ||
              item?.variation_schema?.gallery_img?.[0] ||
              item?.product_schema?.images?.[0] ||
              '',
            price: item?.variation_schema?.sale_price || item?.product_schema?.sale_price,
            quantity: 1,
            ...findAttributesLabelValueObj(
              item?.variation_schema?.name,
              item?.product_schema?.product_type
            ),
            back_setting: item.back_setting || undefined,
            bracelet_length: item.bracelet_size || undefined,
            ring_size: item.ring_size || undefined,
            product_id: item?.product_schema?._id,
            variation_id: item?.variation_schema?._id,
            engraving_details: {
              text: item?.engraving_details?.text || '',
              font: item?.engraving_details?.font || '',
            },
          },
          {
            name: diamondName.props.children?.[0] ?? diamondName.props.children,
            image: item?.diamond_schema?.shape || '',
            price: item?.diamond_schema?.price,
            quantity: 1,
            diamond_id: item?.diamond_schema?._id,
          },
        ];
      }
      if (item.product_schema) {
        return {
          name: `${item?.product_schema?.name} ${item?.product_schema?.parent_sku ? `- ${item?.product_schema?.parent_sku}` : ''}`,
          image:
            item?.variation_schema?.image ||
            item?.variation_schema?.gallery_img?.[0] ||
            item?.product_schema?.images?.[0] ||
            '',
          price: item?.variation_schema?.sale_price || item?.product_schema?.sale_price,
          quantity: item.qty || item.quantity || item.stock_qty || 1,
          ...findAttributesLabelValueObj(
            item?.variation_schema?.name,
            item?.product_schema?.product_type
          ),
          back_setting: item.back_setting || undefined,
          bracelet_length: item.bracelet_size || undefined,
          ring_size: item.ring_size || undefined,
          product_id: item?.product_schema?._id,
          variation_id: item?.variation_schema?._id,
          engraving_details: {
            text: item?.engraving_details?.text || '',
            font: item?.engraving_details?.font || '',
          },
        };
      }
      if (item.diamond_schema) {
        return {
          name: diamondName.props.children?.[0] ?? diamondName.props.children,
          image: item.diamond_schema?.shape || '',
          price: item.diamond_schema?.price,
          quantity: item.qty || item.quantity || item.stock_qty || 1,
          diamond_id: item.diamond_schema?._id,
        };
      }
      return [];
    });
    setCartAbandonedProducts(products as any);
  }, [cartItems, getDiamondTitle]);

  const debouncedCartAbandonmentCreateRef = useRef(
    debounce(
      async (_payload: any) => {
        await cartAbandonedApi.create(_payload);
      },
      20 * 60 * 1000
    ) // 20 minutes
  );

  const handleCartAbandonment = async () => {
    const payload: any = {
      cart_amount: totalPrice,
      products: cartAbandonedProducts,
      order_note: watch('message') || undefined,
      billing_address: {
        first_name: watch('billing_address.first_name' as any) || undefined,
        last_name: watch('billing_address.last_name' as any) || undefined,
        country_code: watch('billing_address.country' as any) || undefined,
        phone: mobile?.replaceAll('-', '') || watch('billing_address.phone' as any) || undefined,
        email: watch('billing_address.email' as any) || undefined,
        address: watch('billing_address.address' as any) || undefined,
        address_second: watch('billing_address.address_second' as any) || undefined,
        city: watch('billing_address.city' as any) || undefined,
        state: shippingAddressStateList?.length > 0 ? watch('billing_address.state' as any) : '',
        country: watch('billing_address.country' as any) || undefined,
        postcode: watch('billing_address.postcode' as any) || undefined,
      },
      shipping_address: {
        first_name: watch('shipping_address.first_name' as any) || undefined,
        last_name: watch('shipping_address.last_name' as any) || undefined,
        country_code: watch('shipping_address.country' as any) || undefined,
        phone: mobile?.replaceAll('-', '') || watch('shipping_address.phone' as any) || undefined,
        email: watch('shipping_address.email' as any) || undefined,
        address: watch('shipping_address.address' as any) || undefined,
        address_second: watch('shipping_address.address_second' as any) || undefined,
        city: watch('shipping_address.city' as any) || undefined,
        state: billingAddressStateList?.length > 0 ? watch('shipping_address.state') : '',
        country: watch('shipping_address.country' as any) || undefined,
        postcode: watch('shipping_address.postcode' as any) || undefined,
      },
      shipping: String(
        orderData?.product_details?.length > 0 ? orderData?.shipping_cost : shipping_cost
      ),
      coupon_name: _couponName,
      discount: String(
        orderData?.product_details?.length > 0 ? orderData?.discount : couponDiscount
      ),
      other: String(paymentCharge),
    };

    try {
      if (cartItems.length === 0) return;

      if (auth && authStatus === 'authenticated') {
        await cartAbandonedApi.create(payload);
      } else {
        debouncedCartAbandonmentCreateRef.current(payload);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cartItems.length === 0) return;
      if (orderCreated) return;
      if (rePaymentOrderId) return;
      handleCartAbandonment();
    }, 2500);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    cartItems,
    couponDiscount,
    paymentCharge,
    shipping_cost,
    defaultBillingAddress,
    defaultShippingAddress,
    defaultValues,
    watch('billing_address' as any),
    watch('billing_address.state' as any),
    watch('billing_address.postcode' as any),
    watch('billing_address.country' as any),
    watch('billing_address.city' as any),
    watch('billing_address.address_second' as any),
    watch('billing_address.address' as any),
    watch('billing_address.first_name' as any),
    watch('billing_address.email' as any),
    watch('billing_address.phone' as any),
    watch('billing_address.country' as any),
    watch('billing_address.last_name' as any),
    watch('shipping_address'),
    watch('message'),
    watch('shipping_address.state' as any),
    watch('shipping_address.postcode' as any),
    watch('shipping_address.country' as any),
    watch('shipping_address.city' as any),
    watch('shipping_address.address_second' as any),
    watch('shipping_address.address' as any),
    watch('shipping_address.first_name' as any),
    watch('shipping_address.email' as any),
    watch('shipping_address.phone' as any),
    watch('shipping_address.country' as any),
    watch('billing_same_as_shipping'),
    watch('shipping_address.last_name' as any),
  ]);

  const onSubmitCoupon = async (data: any) => {
    try {
      if (typeof watch('coupon_code') === 'undefined' || watch('coupon_code') === '') {
        setCouponError('Please enter a valid promo code.');
        return;
      }
      setCouponError('');
      setOrderError('');
      setCouponLoading(true);

      const couponValidate = cartItems
        .map(
          (item: {
            quantity: any | number | undefined;
            product_schema: { _id: any };
            variation_schema: { _id: any };
            diamond_schema: { _id: any };
          }) => {
            if (
              item.product_schema?._id &&
              item.variation_schema?._id &&
              item.diamond_schema?._id
            ) {
              return {
                product_id: item.product_schema._id,
                variation_id: item.variation_schema._id,
                diamond_id: item.diamond_schema._id,
                qty: 1,
              };
            }
            if (item.product_schema?._id && item.variation_schema?._id) {
              return {
                product_id: item.product_schema._id,
                variation_id: item.variation_schema._id,
                qty: item.quantity ?? 1,
              };
            }
            if (item.product_schema?._id && item.diamond_schema?._id) {
              return {
                product_id: item.product_schema._id,
                diamond_id: item.diamond_schema._id,
                qty: item.quantity ?? 1,
              };
            }
            if (item.product_schema?._id) {
              return {
                product_id: item.product_schema._id,
                qty: item.quantity ?? 1,
              };
            }
            if (item.diamond_schema?._id) {
              return {
                diamond_id: item.diamond_schema._id,
              };
            }
            return undefined;
          }
        )
        .filter((item) => item !== undefined);

      const payload = {
        product_ids: couponValidate,
        shipping_cost,
        coupon_code: data.coupon_code?.toLowerCase(),
      };

      const CouponData = await couponApi.apply(payload as any);
      const discount = await CouponData.data.data.discount;
      const _shippingCost = await CouponData.data.data.shipping_cost;
      setShipping_cost(Number(_shippingCost));
      _setShipping_cost(Number(_shippingCost));
      _setCouponDiscount(discount);
      _setCouponName(watch('coupon_code' as any));
      setCouponLoading(false);
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      setCouponLoading(false);
      if (error?.response?.data?.message) {
        setCouponError(error.response?.data?.message);
      } else {
        setCouponError(error?.message);
      }
    }
  };

  const klarnaPaymentIntent = async (payment_method: any) => {
    // static klarna payment intent api call
    if (payment_method === 'klarna') {
      try {
        const { data } = await klarnaApi.getPaymentIntentPlanId({
          locale: 'en-US',
          purchase_country: 'US',
          purchase_currency: 'USD',
          order_amount: Number(
            `${orderData?.product_details?.length > 0 ? Number(orderData?.order_base_price as number).toFixed(2) : Number(totalPrice).toFixed(2)}`
          ),
          order_tax_amount: 0,
          order_lines: orderKlarnaData,
          billing_address:
            watch('billing_same_as_shipping') === true
              ? {
                  given_name:
                    watch('shipping_address.first_name' as any) ??
                    defaultShippingAddress?.first_name ??
                    defaultValues.shipping_address.first_name ??
                    '',
                  family_name:
                    watch('shipping_address.last_name' as any) ??
                    defaultShippingAddress?.last_name ??
                    defaultValues.shipping_address.last_name ??
                    '',
                  email:
                    watch('shipping_address.email' as any) ??
                    defaultShippingAddress?.email ??
                    defaultValues.shipping_address.email ??
                    '',
                  title: '',
                  street_address:
                    watch('shipping_address.address' as any) ??
                    defaultShippingAddress?.address ??
                    defaultValues.shipping_address.address ??
                    '',
                  postal_code:
                    watch('shipping_address.postcode' as any) ??
                    defaultShippingAddress?.postcode ??
                    defaultValues.shipping_address.postcode ??
                    '',
                  city:
                    watch('shipping_address.city' as any) ??
                    defaultShippingAddress?.city ??
                    defaultValues.shipping_address.city ??
                    '',
                  region:
                    watch('shipping_address.state' as any) ??
                    defaultShippingAddress?.state ??
                    defaultValues.shipping_address.state ??
                    '',
                  phone:
                    watch('shipping_address.phone' as any) ??
                    defaultShippingAddress?.phone ??
                    defaultValues.shipping_address.phone ??
                    '',
                  country:
                    dialCode.find(
                      (item) =>
                        item.name?.toLowerCase() ===
                        (
                          watch('shipping_address.country' as any) ??
                          defaultShippingAddress?.country ??
                          defaultValues.shipping_address.country
                        )?.toLowerCase()
                    )?.code ?? '',
                }
              : {
                  given_name:
                    watch('billing_address.first_name' as any) ??
                    defaultBillingAddress?.first_name ??
                    defaultValues.billing_address.first_name ??
                    '',
                  family_name:
                    watch('billing_address.last_name' as any) ??
                    defaultBillingAddress?.last_name ??
                    defaultValues.billing_address.last_name ??
                    '',
                  email:
                    watch('billing_address.email' as any) ??
                    defaultBillingAddress?.email ??
                    defaultValues.billing_address.email ??
                    '',
                  title: '',
                  street_address:
                    watch('billing_address.address' as any) ??
                    defaultBillingAddress?.address ??
                    defaultValues.billing_address.address ??
                    '',
                  postal_code:
                    watch('billing_address.postcode' as any) ??
                    defaultBillingAddress?.postcode ??
                    defaultValues.billing_address.postcode ??
                    '',
                  city:
                    watch('billing_address.city' as any) ??
                    defaultBillingAddress?.city ??
                    defaultValues.billing_address.city ??
                    '',
                  region:
                    watch('billing_address.state' as any) ??
                    defaultBillingAddress?.state ??
                    defaultValues.billing_address.state ??
                    '',
                  phone:
                    watch('billing_address.phone' as any) ??
                    defaultBillingAddress?.phone ??
                    defaultValues.billing_address.phone ??
                    '',
                  country:
                    dialCode.find(
                      (item) =>
                        item.name?.toLowerCase() ===
                        (
                          watch('billing_address.country' as any) ??
                          defaultBillingAddress?.country ??
                          defaultValues.billing_address.country
                        )?.toLowerCase()
                    )?.code ?? '',
                },
          shipping_address: {
            given_name:
              watch('shipping_address.first_name' as any) ??
              defaultShippingAddress?.first_name ??
              defaultValues.shipping_address.first_name ??
              '',
            family_name:
              watch('shipping_address.last_name' as any) ??
              defaultShippingAddress?.last_name ??
              defaultValues.shipping_address.last_name ??
              '',
            email:
              watch('shipping_address.email' as any) ??
              defaultShippingAddress?.email ??
              defaultValues.shipping_address.email ??
              '',
            title: '',
            street_address:
              watch('shipping_address.address' as any) ??
              defaultShippingAddress?.address ??
              defaultValues.shipping_address.address ??
              '',
            postal_code:
              watch('shipping_address.postcode' as any) ??
              defaultShippingAddress?.postcode ??
              defaultValues.shipping_address.postcode ??
              '',
            city:
              watch('shipping_address.city' as any) ??
              defaultShippingAddress?.city ??
              defaultValues.shipping_address.city ??
              '',
            region:
              watch('shipping_address.state' as any) ??
              defaultShippingAddress?.state ??
              defaultValues.shipping_address.state ??
              '',
            phone:
              watch('shipping_address.phone' as any) ??
              defaultShippingAddress?.phone ??
              defaultValues.shipping_address.phone ??
              '',
            country:
              dialCode.find(
                (item) =>
                  item.name?.toLowerCase() ===
                  (
                    watch('shipping_address.country' as any) ??
                    defaultShippingAddress?.country ??
                    defaultValues.shipping_address.country
                  )?.toLowerCase()
              )?.code ?? '',
          },
        });
        if (data.isSuccess === true && data?.data?.client_token) {
          klarnaClientToken = data?.data?.client_token;
          setklarnaClientToken(data?.data?.client_token);
        }
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        if (error?.response?.data?.status === 400 || error.response.status === 400) {
          setOrderError(
            `Klarna: Klarna not supported in ${watch('shipping_address.country') || undefined}` ||
              `Klarna: ${error.response.data.message}`
          );
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const paymentMethodChange = async (value: string) => {
    if (value === 'splitit') {
      try {
        const { data } = await SplitItApi.getPaymentIntentPlanId({
          total_amount: Number(totalPrice) + Number(shipping_cost) + Number(paymentCharge),
          shopper_details: {
            FullName: `${fields.address?.first_name} ${fields.address?.last_name}`,
            Email: fields?.address?.email,
            PhoneNumber: fields?.address?.phone,
            Culture: 'en-us',
          },
          billing_address: {
            AddressLine1: fields?.address?.address,
            AddressLine2: fields?.address?.address_second,
            City: fields?.address?.city,
            Country: fields?.address?.country,
            State: fields?.address?.state,
            Zip: fields?.address?.postcode,
          },
        });
        console.log('🥶data --->', data);
        if (data.isSuccess === true) {
          let hostedFields: any;
          InstallmentPlanNumber = data?.data?.InstallmentPlanNumber;
          console.log(
            '✌️InstallmentPlanNumber --->',
            InstallmentPlanNumber,
            data?.data?.InstallmentPlanNumber
          );
          hostedFields = window.Splitit.FlexForm.setup({
            showOnReady: true,
            container: 'flex-form',
            ipn: InstallmentPlanNumber ?? data?.data?.InstallmentPlanNumber,
            culture: 'en-US',
            nameField: {
              // optional
              hide: true,
            },
            paymentButton: {
              // hides payment button if you are using a custom implementation
              isCustom: false,
            },
            numberOfInstallments: 6, // optional
            billingAddress: {
              // optional
              addressLine: '23543 Farrell Course',
              addressLine2: '',
              city: 'Connshire',
              state: 'Virginia',
              country: 'United States',
              zip: '17526',
            },
            consumerData: {
              // optional
              fullName: 'Kishan Kevadiya',
              email: 'demo@gmail.com',
              phoneNumber: '+1-8125426952',
              cultureName: 'en-us',
            },
            // eslint-disable-next-line @typescript-eslint/no-shadow
            onSuccess(data: any) {
              console.log('data:', data);
            },
            onError(error: React.SetStateAction<string>) {
              setOrderError(error);
            },
          }).ready((manage: any) => {
            console.log('~ READY CALLBACK', manage);
          });
          hostedFields?.pay();
          // window.Splitit?.FlexForm.setup({
          //   showOnReady: true,
          //   container: "flex-form",
          //   ipn: InstallmentPlanNumber ?? data?.data?.InstallmentPlanNumber,
          //   culture: "en-US",
          //   nameField: {
          //     hide: true,
          //   },
          //   paymentButton: {
          //     isCustom: true,
          //   },
          //   numberOfInstallments: 6,
          //   billingAddress: formValues.billing_address,
          //   consumerData: {
          //     fullName: `${formValues?.shipping_address?.first_name} ${formValues?.shipping_address?.last_name}`,
          //     email: formValues?.shipping_address?.email,
          //     phoneNumber: formValues?.shipping_address?.phone,
          //     cultureName: "en-us",
          //   },
          //   onSuccess(datas: any) {
          //     console.log("datas:", datas);
          //   },
          // }).ready((manage: any) => {
          //   console.log("~ READY CALLBACK", manage);
          // });
        }
      } catch (error) {
        // if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        // localStorage.clear();
        console.error(error?.response);
      }
    }
    await klarnaPaymentIntent(value);
  };

  const cartValidationLocalUpdate = (updatedCartValidateArr: any[]) => {
    if (!auth?.user) {
      setLocalCardItems((prev: any) =>
        prev.map((item: any) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const buildRingCart = updatedCartValidateArr?.find(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (item: { build_ring: any }) => item.build_ring
          )?.build_ring;
          if (item.diamond_schema && (item.variation_schema ?? item.product_schema)) {
            const updatedItem = {
              ...item,
              diamond_schema: {
                ...item.diamond_schema,
                price: buildRingCart?.diamond_id?.price,
                regular_price: buildRingCart?.diamond_id?.regular_price,
                stock_status: buildRingCart?.diamond_id?.stock_status,
              },
            };
            if (buildRingCart?.variation_id) {
              updatedItem.variation_schema = {
                ...item.variation_schema,
                sale_price: buildRingCart?.variation_id?.sale_price,
                regular_price: buildRingCart?.variation_id?.regular_price,
                stock_status: buildRingCart?.variation_id?.stock_status
                  ? 'in_stock'
                  : 'out_of_stock',
              };
            }
            if (buildRingCart?.product_id) {
              updatedItem.product_schema = {
                ...item.product_schema,
                sale_price: buildRingCart?.product_id?.sale_price,
                regular_price: buildRingCart?.product_id?.regular_price,
                stock_status: buildRingCart?.product_id?.stock_status ? 'in_stock' : 'out_of_stock',
              };
            }
            return updatedItem;
          }
          if (item.variation_schema && item.product_schema) {
            const validateVariationData = updatedCartValidateArr?.find(
              (data: any) =>
                data.variation_id === item.variation_schema?._id &&
                data.sku === item?.variation_schema?.sku
            );
            return {
              ...item,
              variation_schema: {
                ...item.variation_schema,
                sale_price: validateVariationData?.sale_price,
                regular_price: validateVariationData?.regular_price,
                stock_status: validateVariationData?.stock_status ? 'in_stock' : 'out_of_stock',
              },
            };
          }
          if (item.product_schema) {
            const validateProductData = updatedCartValidateArr?.find(
              (data: any) =>
                data.product_id === item.product_schema?._id &&
                data.sku === item?.product_schema?.sku
            );
            return {
              ...item,
              product_schema: {
                ...item.product_schema,
                sale_price: validateProductData?.sale_price,
                regular_price: validateProductData?.regular_price,
                stock_status: validateProductData?.stock_status ? 'in_stock' : 'out_of_stock',
              },
            };
          }
          if (item.diamond_schema) {
            const validateDiamondData = updatedCartValidateArr?.find(
              (data: any) =>
                data.diamond_id === item.diamond_schema?._id &&
                data.sku === item?.diamond_schema?.sku
            );
            return {
              ...item,
              diamond_schema: {
                ...item.diamond_schema,
                price: validateDiamondData?.price,
                regular_price: validateDiamondData?.regular_price,
                stock_status: validateDiamondData?.stock_status,
              },
            };
          }
          return {
            ...item,
          };
        })
      );
    }
  };

  useEffect(() => {
    const hasShippingAddressErrors =
      errors.shipping_address && Object.keys(errors.shipping_address).length > 0;

    if (!mobileAlert && mobile.length >= 1) {
      setMobileError(false);
      return;
    }
    if (!hasShippingAddressErrors && mobileAlert && mobile.length >= 1) {
      setMobileError(false);
      return;
    }
    if (hasShippingAddressErrors && !mobileAlert && mobile.length >= 0) {
      setMobileError(true);
    }
  }, [mobile, mobileAlert, errors.shipping_address]);

  const mobileValidation = () => {
    if (!mobileAlert && mobile.length <= 0) {
      setMobileError(true);
      return true;
    }
    if (mobileAlert) return true;
    return false;
  };

  const onSubmit = async (fd: any) => {
    setIsSubmitting(true);
    setOrderError('');
    setOrderSuccess(false);
    try {
      // Phone validation
      if (mobileValidation()) return;

      const product_ids: any = cartItems.map((item) => ({
        product_id: item.product_schema?._id,
        variation_id: item.variation_schema?._id,
        diamond_id: item.diamond_schema?._id,
        ring_size: item.ring_size || undefined,
        quantity:
          (item.variation_schema || item.product_schema) && item.diamond_schema
            ? 1
            : item.quantity ?? item.qty ?? 1,
        back_setting: item.back_setting || undefined,
        bracelet_size: item.bracelet_size || undefined,
        engraving_details: {
          text: item?.engraving_details?.text || '',
          font: item?.engraving_details?.font || '',
        },
      }));

      const stockValidatePayload = cartItems
        .map((item) => {
          if (item.product_schema?._id && item.variation_schema?._id && item.diamond_schema?._id) {
            return {
              product_id: item.product_schema._id,
              variation_id: item.variation_schema._id,
              diamond_id: item.diamond_schema._id,
              qty: 1,
            };
          }
          if (item.product_schema?._id && item.variation_schema?._id) {
            return {
              product_id: item.product_schema._id,
              variation_id: item.variation_schema._id,
              qty: item.quantity ?? 1,
            };
          }
          if (item.product_schema?._id && item.diamond_schema?._id) {
            return {
              product_id: item.product_schema._id,
              diamond_id: item.diamond_schema._id,
              qty: item.quantity ?? 1,
            };
          }
          if (item.product_schema?._id) {
            return {
              product_id: item.product_schema._id,
              qty: item.quantity ?? 1,
            };
          }
          if (item.diamond_schema?._id) {
            return {
              diamond_id: item.diamond_schema._id,
            };
          }
          return undefined;
        })
        .filter((item) => item !== undefined);

      if (!rePaymentOrderId && !orderData?.product_details) {
        const { status } = await orderApi.validateStock('validate', {
          product_ids: stockValidatePayload,
        } as IOrderValidateStockRequest);
        if (status === 401) replace(paths.login.root);
      }

      if (!auth?.user) {
        const randomPassword = generatePassword(8);

        const response = await customerApi.create({
          email: fd.shipping_address.email,
          name: `${fd.shipping_address.first_name} ${fd.shipping_address.last_name}`,
          password: randomPassword,
          is_order: true,
        });
        await signIn('credentials', {
          redirect: false,
          accessToken: response.data.data.accessToken,
          userData: JSON.stringify({ ...response.data.data.data, password: randomPassword }),
        });

        // wait for 500 ms
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (fd.payment_method === 'klarna' && response.data.data.accessToken) {
          await klarnaPaymentIntent(fd?.payment_method);
        }
      }

      const payload = {
        shipping_address: {
          ...fd.shipping_address,
          state: shippingAddressStateList?.length > 0 ? fd.shipping_address.state : '',
          // phone: fd.shipping_address.phone?.replaceAll('-', ''),
          phone: mobile?.replaceAll('-', '') || fd?.shipping_address?.phone?.replaceAll('-', ''),
          country_code: ipCountryCode || undefined,
          address_second: fd.shipping_address.address_second || undefined,
        },
        billing_address: fd.billing_same_as_shipping
          ? {
              ...fd.shipping_address,
              // phone: fd.shipping_address.phone?.replaceAll('-', ''),
              phone:
                mobile?.replaceAll('-', '') || fd?.shipping_address?.phone?.replaceAll('-', ''),
              state: shippingAddressStateList?.length > 0 ? fd.shipping_address.state : '',
              country_code: ipCountryCode || undefined,
              address_second: fd.shipping_address.address_second || undefined,
            }
          : {
              ...fd.billing_address,
              // phone: fd.shipping_address.phone?.replaceAll('-', ''),
              email: fd.shipping_address.email,
              phone:
                mobile?.replaceAll('-', '') || fd?.shipping_address?.phone?.replaceAll('-', ''),
              state: billingAddressStateList?.length > 0 ? fd.billing_address.state : '',
              country_code: ipCountryCode || undefined,
              address_second: fd.billing_address.address_second || undefined,
            },
        payment_method: fd.payment_method,
        shipping_cost,
        coupon_code: _couponName?.toLowerCase() || undefined,
        extra_charges: paymentCharge as number,
        // shipping_company: 'fedex',
        product_ids,
        message: fd.message || undefined,
      };

      // If payment method is stripe, then submit the payment
      if (fd.payment_method === 'stripe') {
        // Make the payment with stripe
        if (!rePaymentOrderId && !orderData?.product_details) {
          const { data: orderRes } = await orderApi.create(payload);
          setOrderData(orderRes.data);
          if (orderRes.isSuccess) {
            // Reset the ring builder
            resetRingBuilder();
            setDiamondSku([]);
            setOrderSuccess(true);
            setIsSubmitting(false);
            setOrderCreated(true);
            setClientCartItems([]);
            setCheckOutPreview([]);
            _setCouponDiscount(0);
            _setCouponName('');
            _setShipping_cost(35);
            setLocalCardLength(0);
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cart');
          }
          const order_no = orderRes.data?.order_no as string;
          const order_id = orderRes.data?._id as string;
          const res = await refCheckoutForm?.current?.paymentWithStripe(order_id as string);
          if (res?.status !== 200) {
            await replace(paths.order.root);
            return;
          }
          await replace(paths.orderThankYou.root(order_no as string));
        } else {
          const res = await refCheckoutForm?.current?.paymentWithStripe(rePaymentOrderId as string);
          if (res?.status === 200) {
            // Update an order payment
            await orderApi.updatePayment(rePaymentOrderId as string, {
              payment_method: fd.payment_method,
              extra_charges: paymentCharge as number,
            });
          }
          if (res?.status !== 200) {
            await replace(paths.order.root);
            return;
          }
          await replace(
            paths.orderThankYou.root(
              (orderData?.order_no as string) || (rePaymentOrderId as string)
            )
          );
        }
      } else if (fd.payment_method === 'klarna') {
        if (
          !rePaymentOrderId &&
          !orderData?.product_details &&
          (auth?.user ? _klarnaClientToken : klarnaClientToken)
        ) {
          const { data: orderRes } = await orderApi.create(payload);
          setOrderData(orderRes.data);
          if (orderRes.isSuccess) {
            // Reset the ring builder
            resetRingBuilder();
            setDiamondSku([]);
            setOrderSuccess(true);
            setIsSubmitting(false);
            setOrderCreated(true);
            setClientCartItems([]);
            setCheckOutPreview([]);
            _setCouponDiscount(0);
            _setCouponName('');
            _setShipping_cost(35);
            setLocalCardLength(0);
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cart');
          }
          const order_no = orderRes.data?.order_no as string;
          const order_id = orderRes.data?._id as string;
          window.klarnaAsyncCallback = function () {
            window?.Klarna.Payments.init({
              client_token: auth?.user ? _klarnaClientToken : klarnaClientToken,
            });
            window?.Klarna.Payments.load(
              {
                container: '#klarna_container',
                payment_method_category: 'pay_over_time',
              },
              (res: any) => {
                window?.Klarna.Payments.authorize(
                  {
                    payment_method_category: 'pay_over_time',
                  },
                  {
                    order_amount:
                      Number(
                        `${orderData?.product_details?.length > 0 ? Number(orderData?.order_base_price as number).toFixed(2) : Number(totalPrice).toFixed(2)}`
                      ) * 100,
                    order_tax_amount:
                      Number(
                        `${orderData?.product_details?.length > 0 ? (Number(orderData?.shipping_cost) + Number(paymentCharge) - Number(orderData?.discount)).toFixed(2) : (Number(shipping_cost) + Number(paymentCharge) - Number(couponDiscount)).toFixed(2)}`
                      ) * 100,
                    order_lines: orderKlarnaData,
                    billing_address:
                      watch('billing_same_as_shipping') === true
                        ? {
                            given_name:
                              watch('shipping_address.first_name' as any) ??
                              defaultShippingAddress?.first_name ??
                              defaultValues.shipping_address.first_name ??
                              '',
                            family_name:
                              watch('shipping_address.last_name' as any) ??
                              defaultShippingAddress?.last_name ??
                              defaultValues.shipping_address.last_name ??
                              '',
                            email:
                              watch('shipping_address.email' as any) ??
                              defaultShippingAddress?.email ??
                              defaultValues.shipping_address.email ??
                              '',
                            title: '',
                            street_address:
                              watch('shipping_address.address' as any) ??
                              defaultShippingAddress?.address ??
                              defaultValues.shipping_address.address ??
                              '',
                            postal_code:
                              watch('shipping_address.postcode' as any) ??
                              defaultShippingAddress?.postcode ??
                              defaultValues.shipping_address.postcode ??
                              '',
                            city:
                              watch('shipping_address.city' as any) ??
                              defaultShippingAddress?.city ??
                              defaultValues.shipping_address.city ??
                              '',
                            region:
                              watch('shipping_address.state' as any) ??
                              defaultShippingAddress?.state ??
                              defaultValues.shipping_address.state ??
                              '',
                            phone:
                              watch('shipping_address.phone' as any) ??
                              defaultShippingAddress?.phone ??
                              defaultValues.shipping_address.phone ??
                              '',
                            country:
                              dialCode.find(
                                (item) =>
                                  item.name?.toLowerCase() ===
                                  (
                                    watch('shipping_address.country' as any) ??
                                    defaultShippingAddress?.country ??
                                    defaultValues.shipping_address.country
                                  )?.toLowerCase()
                              )?.code ?? '',
                          }
                        : {
                            given_name:
                              watch('billing_address.first_name' as any) ??
                              defaultBillingAddress?.first_name ??
                              defaultValues.billing_address.first_name ??
                              '',
                            family_name:
                              watch('billing_address.last_name' as any) ??
                              defaultBillingAddress?.last_name ??
                              defaultValues.billing_address.last_name ??
                              '',
                            email:
                              watch('billing_address.email' as any) ??
                              defaultBillingAddress?.email ??
                              defaultValues.billing_address.email ??
                              '',
                            title: '',
                            street_address:
                              watch('billing_address.address' as any) ??
                              defaultBillingAddress?.address ??
                              defaultValues.billing_address.address ??
                              '',
                            postal_code:
                              watch('billing_address.postcode' as any) ??
                              defaultBillingAddress?.postcode ??
                              defaultValues.billing_address.postcode ??
                              '',
                            city:
                              watch('billing_address.city' as any) ??
                              defaultBillingAddress?.city ??
                              defaultValues.billing_address.city ??
                              '',
                            region:
                              watch('billing_address.state' as any) ??
                              defaultBillingAddress?.state ??
                              defaultValues.billing_address.state ??
                              '',
                            phone:
                              watch('billing_address.phone' as any) ??
                              defaultBillingAddress?.phone ??
                              defaultValues.billing_address.phone ??
                              '',
                            country:
                              dialCode.find(
                                (item) =>
                                  item.name?.toLowerCase() ===
                                  (
                                    watch('billing_address.country' as any) ??
                                    defaultBillingAddress?.country ??
                                    defaultValues.billing_address.country
                                  )?.toLowerCase()
                              )?.code ?? '',
                          },
                    shipping_address: {
                      given_name:
                        watch('shipping_address.first_name' as any) ??
                        defaultShippingAddress?.first_name ??
                        defaultValues.shipping_address.first_name ??
                        '',
                      family_name:
                        watch('shipping_address.last_name' as any) ??
                        defaultShippingAddress?.last_name ??
                        defaultValues.shipping_address.last_name ??
                        '',
                      email:
                        watch('shipping_address.email' as any) ??
                        defaultShippingAddress?.email ??
                        defaultValues.shipping_address.email ??
                        '',
                      title: '',
                      street_address:
                        watch('shipping_address.address' as any) ??
                        defaultShippingAddress?.address ??
                        defaultValues.shipping_address.address ??
                        '',
                      postal_code:
                        watch('shipping_address.postcode' as any) ??
                        defaultShippingAddress?.postcode ??
                        defaultValues.shipping_address.postcode ??
                        '',
                      city:
                        watch('shipping_address.city' as any) ??
                        defaultShippingAddress?.city ??
                        defaultValues.shipping_address.city ??
                        '',
                      region:
                        watch('shipping_address.state' as any) ??
                        defaultShippingAddress?.state ??
                        defaultValues.shipping_address.state ??
                        '',
                      phone:
                        watch('shipping_address.phone' as any) ??
                        defaultShippingAddress?.phone ??
                        defaultValues.shipping_address.phone ??
                        '',
                      country:
                        dialCode.find(
                          (item) =>
                            item.name?.toLowerCase() ===
                            (
                              watch('shipping_address.country' as any) ??
                              defaultShippingAddress?.country ??
                              defaultValues.shipping_address.country
                            )?.toLowerCase()
                        )?.code ?? '',
                    },
                  },
                  async (response: any) => {
                    try {
                      const klarnaRes = await klarnaApi.createPaymentOrder(
                        response.authorization_token,
                        {
                          locale: 'en-US',
                          purchase_country: 'US',
                          purchase_currency: 'USD',
                          order_amount:
                            Number(
                              `${orderData?.product_details?.length > 0 ? Number(orderData?.order_base_price as number).toFixed(2) : Number(totalPrice).toFixed(2)}`
                            ) * 100,
                          order_tax_amount:
                            Number(
                              `${orderData?.product_details?.length > 0 ? (Number(orderData?.shipping_cost) + Number(paymentCharge) - Number(orderData?.discount)).toFixed(2) : (Number(shipping_cost) + Number(paymentCharge) - Number(couponDiscount)).toFixed(2)}`
                            ) * 100,
                          order_lines: orderKlarnaData,
                          billing_address:
                            watch('billing_same_as_shipping') === true
                              ? {
                                  given_name:
                                    watch('shipping_address.first_name' as any) ??
                                    defaultShippingAddress?.first_name ??
                                    defaultValues.shipping_address.first_name ??
                                    '',
                                  family_name:
                                    watch('shipping_address.last_name' as any) ??
                                    defaultShippingAddress?.last_name ??
                                    defaultValues.shipping_address.last_name ??
                                    '',
                                  email:
                                    watch('shipping_address.email' as any) ??
                                    defaultShippingAddress?.email ??
                                    defaultValues.shipping_address.email ??
                                    '',
                                  title: '',
                                  street_address:
                                    watch('shipping_address.address' as any) ??
                                    defaultShippingAddress?.address ??
                                    defaultValues.shipping_address.address ??
                                    '',
                                  postal_code:
                                    watch('shipping_address.postcode' as any) ??
                                    defaultShippingAddress?.postcode ??
                                    defaultValues.shipping_address.postcode ??
                                    '',
                                  city:
                                    watch('shipping_address.city' as any) ??
                                    defaultShippingAddress?.city ??
                                    defaultValues.shipping_address.city ??
                                    '',
                                  region:
                                    watch('shipping_address.state' as any) ??
                                    defaultShippingAddress?.state ??
                                    defaultValues.shipping_address.state ??
                                    '',
                                  phone:
                                    watch('shipping_address.phone' as any) ??
                                    defaultShippingAddress?.phone ??
                                    defaultValues.shipping_address.phone ??
                                    '',
                                  country:
                                    dialCode.find(
                                      (item) =>
                                        item.name?.toLowerCase() ===
                                        (
                                          watch('shipping_address.country' as any) ??
                                          defaultShippingAddress?.country ??
                                          defaultValues.shipping_address.country
                                        )?.toLowerCase()
                                    )?.code ?? '',
                                }
                              : {
                                  given_name:
                                    watch('billing_address.first_name' as any) ??
                                    defaultBillingAddress?.first_name ??
                                    defaultValues.billing_address.first_name ??
                                    '',
                                  family_name:
                                    watch('billing_address.last_name' as any) ??
                                    defaultBillingAddress?.last_name ??
                                    defaultValues.billing_address.last_name ??
                                    '',
                                  email:
                                    watch('billing_address.email' as any) ??
                                    defaultBillingAddress?.email ??
                                    defaultValues.billing_address.email ??
                                    '',
                                  title: '',
                                  street_address:
                                    watch('billing_address.address' as any) ??
                                    defaultBillingAddress?.address ??
                                    defaultValues.billing_address.address ??
                                    '',
                                  postal_code:
                                    watch('billing_address.postcode' as any) ??
                                    defaultBillingAddress?.postcode ??
                                    defaultValues.billing_address.postcode ??
                                    '',
                                  city:
                                    watch('billing_address.city' as any) ??
                                    defaultBillingAddress?.city ??
                                    defaultValues.billing_address.city ??
                                    '',
                                  region:
                                    watch('billing_address.state' as any) ??
                                    defaultBillingAddress?.state ??
                                    defaultValues.billing_address.state ??
                                    '',
                                  phone:
                                    watch('billing_address.phone' as any) ??
                                    defaultBillingAddress?.phone ??
                                    defaultValues.billing_address.phone ??
                                    '',
                                  country:
                                    dialCode.find(
                                      (item) =>
                                        item.name?.toLowerCase() ===
                                        (
                                          watch('billing_address.country' as any) ??
                                          defaultBillingAddress?.country ??
                                          defaultValues.billing_address.country
                                        )?.toLowerCase()
                                    )?.code ?? '',
                                },
                          shipping_address: {
                            given_name:
                              watch('shipping_address.first_name' as any) ??
                              defaultShippingAddress?.first_name ??
                              defaultValues.shipping_address.first_name ??
                              '',
                            family_name:
                              watch('shipping_address.last_name' as any) ??
                              defaultShippingAddress?.last_name ??
                              defaultValues.shipping_address.last_name ??
                              '',
                            email:
                              watch('shipping_address.email' as any) ??
                              defaultShippingAddress?.email ??
                              defaultValues.shipping_address.email ??
                              '',
                            title: '',
                            street_address:
                              watch('shipping_address.address' as any) ??
                              defaultShippingAddress?.address ??
                              defaultValues.shipping_address.address ??
                              '',
                            postal_code:
                              watch('shipping_address.postcode' as any) ??
                              defaultShippingAddress?.postcode ??
                              defaultValues.shipping_address.postcode ??
                              '',
                            city:
                              watch('shipping_address.city' as any) ??
                              defaultShippingAddress?.city ??
                              defaultValues.shipping_address.city ??
                              '',
                            region:
                              watch('shipping_address.state' as any) ??
                              defaultShippingAddress?.state ??
                              defaultValues.shipping_address.state ??
                              '',
                            phone:
                              watch('shipping_address.phone' as any) ??
                              defaultShippingAddress?.phone ??
                              defaultValues.shipping_address.phone ??
                              '',
                            country:
                              dialCode.find(
                                (item) =>
                                  item.name?.toLowerCase() ===
                                  (
                                    watch('shipping_address.country' as any) ??
                                    defaultShippingAddress?.country ??
                                    defaultValues.shipping_address.country
                                  )?.toLowerCase()
                              )?.code ?? '',
                          },
                          //   "merchant_urls": {
                          //     "confirmation": "https://kkevadiya.000webhostapp.com/"
                          //   }
                        }
                      );
                      console.log('✌️klarnaRes --->', klarnaRes);
                      if (klarnaRes.status === 200) {
                        await replace(paths.orderThankYou.root(order_no as string));
                      }
                    } catch (error) {
                      if (error?.response?.data?.status === 401)
                        signOut({ callbackUrl: paths.order.root });
                      localStorage.clear();
                      console.error(error);
                      // setOrderError(`Klarna: ${error.response.data.message}`);
                      // window.scrollTo({
                      //   top: 0,
                      //   behavior: 'smooth'
                      // });
                    }
                  }
                );
              }
            );
          };
          window.klarnaAsyncCallback();
        } else if (rePaymentOrderId && orderData?.product_details) {
          window.klarnaAsyncCallback = function () {
            window?.Klarna.Payments.init({
              client_token: auth?.user ? _klarnaClientToken : klarnaClientToken,
            });
            console.log('Payments initialized');
            window?.Klarna.Payments.load(
              {
                container: '#klarna_container',
                payment_method_category: 'pay_over_time',
              },
              (res: any) => {
                window?.Klarna.Payments.authorize(
                  {
                    payment_method_category: 'pay_over_time',
                  },
                  {
                    purchase_currency: 'USD',
                    order_amount:
                      Number(
                        `${orderData?.product_details?.length > 0 ? Number(orderData?.order_base_price as number).toFixed(2) : Number(totalPrice).toFixed(2)}`
                      ) * 100,
                    order_tax_amount:
                      Number(
                        `${orderData?.product_details?.length > 0 ? (Number(orderData?.shipping_cost) + Number(paymentCharge) - Number(orderData?.discount)).toFixed(2) : (Number(shipping_cost) + Number(paymentCharge) - Number(couponDiscount)).toFixed(2)}`
                      ) * 100,
                    order_lines: orderKlarnaData,
                    billing_address:
                      watch('billing_same_as_shipping') === true
                        ? {
                            given_name:
                              watch('shipping_address.first_name' as any) ??
                              defaultShippingAddress?.first_name ??
                              defaultValues.shipping_address.first_name ??
                              '',
                            family_name:
                              watch('shipping_address.last_name' as any) ??
                              defaultShippingAddress?.last_name ??
                              defaultValues.shipping_address.last_name ??
                              '',
                            email:
                              watch('shipping_address.email' as any) ??
                              defaultShippingAddress?.email ??
                              defaultValues.shipping_address.email ??
                              '',
                            title: '',
                            street_address:
                              watch('shipping_address.address' as any) ??
                              defaultShippingAddress?.address ??
                              defaultValues.shipping_address.address ??
                              '',
                            postal_code:
                              watch('shipping_address.postcode' as any) ??
                              defaultShippingAddress?.postcode ??
                              defaultValues.shipping_address.postcode ??
                              '',
                            city:
                              watch('shipping_address.city' as any) ??
                              defaultShippingAddress?.city ??
                              defaultValues.shipping_address.city ??
                              '',
                            region:
                              watch('shipping_address.state' as any) ??
                              defaultShippingAddress?.state ??
                              defaultValues.shipping_address.state ??
                              '',
                            phone:
                              watch('shipping_address.phone' as any) ??
                              defaultShippingAddress?.phone ??
                              defaultValues.shipping_address.phone ??
                              '',
                            country:
                              dialCode.find(
                                (item) =>
                                  item.name?.toLowerCase() ===
                                  (
                                    watch('shipping_address.country' as any) ??
                                    defaultShippingAddress?.country ??
                                    defaultValues.shipping_address.country
                                  )?.toLowerCase()
                              )?.code ?? '',
                          }
                        : {
                            given_name:
                              watch('billing_address.first_name' as any) ??
                              defaultBillingAddress?.first_name ??
                              defaultValues.billing_address.first_name ??
                              '',
                            family_name:
                              watch('billing_address.last_name' as any) ??
                              defaultBillingAddress?.last_name ??
                              defaultValues.billing_address.last_name ??
                              '',
                            email:
                              watch('billing_address.email' as any) ??
                              defaultBillingAddress?.email ??
                              defaultValues.billing_address.email ??
                              '',
                            title: '',
                            street_address:
                              watch('billing_address.address' as any) ??
                              defaultBillingAddress?.address ??
                              defaultValues.billing_address.address ??
                              '',
                            postal_code:
                              watch('billing_address.postcode' as any) ??
                              defaultBillingAddress?.postcode ??
                              defaultValues.billing_address.postcode ??
                              '',
                            city:
                              watch('billing_address.city' as any) ??
                              defaultBillingAddress?.city ??
                              defaultValues.billing_address.city ??
                              '',
                            region:
                              watch('billing_address.state' as any) ??
                              defaultBillingAddress?.state ??
                              defaultValues.billing_address.state ??
                              '',
                            phone:
                              watch('billing_address.phone' as any) ??
                              defaultBillingAddress?.phone ??
                              defaultValues.billing_address.phone ??
                              '',
                            country:
                              dialCode.find(
                                (item) =>
                                  item.name?.toLowerCase() ===
                                  (
                                    watch('billing_address.country' as any) ??
                                    defaultBillingAddress?.country ??
                                    defaultValues.billing_address.country
                                  )?.toLowerCase()
                              )?.code ?? '',
                          },
                    shipping_address: {
                      given_name:
                        watch('shipping_address.first_name' as any) ??
                        defaultShippingAddress?.first_name ??
                        defaultValues.shipping_address.first_name ??
                        '',
                      family_name:
                        watch('shipping_address.last_name' as any) ??
                        defaultShippingAddress?.last_name ??
                        defaultValues.shipping_address.last_name ??
                        '',
                      email:
                        watch('shipping_address.email' as any) ??
                        defaultShippingAddress?.email ??
                        defaultValues.shipping_address.email ??
                        '',
                      title: '',
                      street_address:
                        watch('shipping_address.address' as any) ??
                        defaultShippingAddress?.address ??
                        defaultValues.shipping_address.address ??
                        '',
                      postal_code:
                        watch('shipping_address.postcode' as any) ??
                        defaultShippingAddress?.postcode ??
                        defaultValues.shipping_address.postcode ??
                        '',
                      city:
                        watch('shipping_address.city' as any) ??
                        defaultShippingAddress?.city ??
                        defaultValues.shipping_address.city ??
                        '',
                      region:
                        watch('shipping_address.state' as any) ??
                        defaultShippingAddress?.state ??
                        defaultValues.shipping_address.state ??
                        '',
                      phone:
                        watch('shipping_address.phone' as any) ??
                        defaultShippingAddress?.phone ??
                        defaultValues.shipping_address.phone ??
                        '',
                      country:
                        dialCode.find(
                          (item) =>
                            item.name?.toLowerCase() ===
                            (
                              watch('shipping_address.country' as any) ??
                              defaultShippingAddress?.country ??
                              defaultValues.shipping_address.country
                            )?.toLowerCase()
                        )?.code ?? '',
                    },
                  },
                  async (response: any) => {
                    try {
                      const klarnaRes = await klarnaApi.createPaymentOrder(
                        response.authorization_token,
                        {
                          locale: 'en-US',
                          purchase_country: 'US',
                          purchase_currency: 'USD',
                          order_amount:
                            Number(
                              `${orderData?.product_details?.length > 0 ? Number(orderData?.order_base_price as number).toFixed(2) : Number(totalPrice).toFixed(2)}`
                            ) * 100,
                          order_tax_amount:
                            Number(
                              `${orderData?.product_details?.length > 0 ? (Number(orderData?.shipping_cost) + Number(paymentCharge) - Number(orderData?.discount)).toFixed(2) : (Number(shipping_cost) + Number(paymentCharge) - Number(couponDiscount)).toFixed(2)}`
                            ) * 100,
                          order_lines: orderKlarnaData,
                          billing_address:
                            watch('billing_same_as_shipping') === true
                              ? {
                                  given_name:
                                    watch('shipping_address.first_name' as any) ??
                                    defaultShippingAddress?.first_name ??
                                    defaultValues.shipping_address.first_name ??
                                    '',
                                  family_name:
                                    watch('shipping_address.last_name' as any) ??
                                    defaultShippingAddress?.last_name ??
                                    defaultValues.shipping_address.last_name ??
                                    '',
                                  email:
                                    watch('shipping_address.email' as any) ??
                                    defaultShippingAddress?.email ??
                                    defaultValues.shipping_address.email ??
                                    '',
                                  title: '',
                                  street_address:
                                    watch('shipping_address.address' as any) ??
                                    defaultShippingAddress?.address ??
                                    defaultValues.shipping_address.address ??
                                    '',
                                  postal_code:
                                    watch('shipping_address.postcode' as any) ??
                                    defaultShippingAddress?.postcode ??
                                    defaultValues.shipping_address.postcode ??
                                    '',
                                  city:
                                    watch('shipping_address.city' as any) ??
                                    defaultShippingAddress?.city ??
                                    defaultValues.shipping_address.city ??
                                    '',
                                  region:
                                    watch('shipping_address.state' as any) ??
                                    defaultShippingAddress?.state ??
                                    defaultValues.shipping_address.state ??
                                    '',
                                  phone:
                                    watch('shipping_address.phone' as any) ??
                                    defaultShippingAddress?.phone ??
                                    defaultValues.shipping_address.phone ??
                                    '',
                                  country:
                                    dialCode.find(
                                      (item) =>
                                        item.name?.toLowerCase() ===
                                        (
                                          watch('shipping_address.country' as any) ??
                                          defaultShippingAddress?.country ??
                                          defaultValues.shipping_address.country
                                        )?.toLowerCase()
                                    )?.code ?? '',
                                }
                              : {
                                  given_name:
                                    watch('billing_address.first_name' as any) ??
                                    defaultBillingAddress?.first_name ??
                                    defaultValues.billing_address.first_name ??
                                    '',
                                  family_name:
                                    watch('billing_address.last_name' as any) ??
                                    defaultBillingAddress?.last_name ??
                                    defaultValues.billing_address.last_name ??
                                    '',
                                  email:
                                    watch('billing_address.email' as any) ??
                                    defaultBillingAddress?.email ??
                                    defaultValues.billing_address.email ??
                                    '',
                                  title: '',
                                  street_address:
                                    watch('billing_address.address' as any) ??
                                    defaultBillingAddress?.address ??
                                    defaultValues.billing_address.address ??
                                    '',
                                  postal_code:
                                    watch('billing_address.postcode' as any) ??
                                    defaultBillingAddress?.postcode ??
                                    defaultValues.billing_address.postcode ??
                                    '',
                                  city:
                                    watch('billing_address.city' as any) ??
                                    defaultBillingAddress?.city ??
                                    defaultValues.billing_address.city ??
                                    '',
                                  region:
                                    watch('billing_address.state' as any) ??
                                    defaultBillingAddress?.state ??
                                    defaultValues.billing_address.state ??
                                    '',
                                  phone:
                                    watch('billing_address.phone' as any) ??
                                    defaultBillingAddress?.phone ??
                                    defaultValues.billing_address.phone ??
                                    '',
                                  country:
                                    dialCode.find(
                                      (item) =>
                                        item.name?.toLowerCase() ===
                                        (
                                          watch('billing_address.country' as any) ??
                                          defaultBillingAddress?.country ??
                                          defaultValues.billing_address.country
                                        )?.toLowerCase()
                                    )?.code ?? '',
                                },
                          shipping_address: {
                            given_name:
                              watch('shipping_address.first_name' as any) ??
                              defaultShippingAddress?.first_name ??
                              defaultValues.shipping_address.first_name ??
                              '',
                            family_name:
                              watch('shipping_address.last_name' as any) ??
                              defaultShippingAddress?.last_name ??
                              defaultValues.shipping_address.last_name ??
                              '',
                            email:
                              watch('shipping_address.email' as any) ??
                              defaultShippingAddress?.email ??
                              defaultValues.shipping_address.email ??
                              '',
                            title: '',
                            street_address:
                              watch('shipping_address.address' as any) ??
                              defaultShippingAddress?.address ??
                              defaultValues.shipping_address.address ??
                              '',
                            postal_code:
                              watch('shipping_address.postcode' as any) ??
                              defaultShippingAddress?.postcode ??
                              defaultValues.shipping_address.postcode ??
                              '',
                            city:
                              watch('shipping_address.city' as any) ??
                              defaultShippingAddress?.city ??
                              defaultValues.shipping_address.city ??
                              '',
                            region:
                              watch('shipping_address.state' as any) ??
                              defaultShippingAddress?.state ??
                              defaultValues.shipping_address.state ??
                              '',
                            phone:
                              watch('shipping_address.phone' as any) ??
                              defaultShippingAddress?.phone ??
                              defaultValues.shipping_address.phone ??
                              '',
                            country:
                              dialCode.find(
                                (item) =>
                                  item.name?.toLowerCase() ===
                                  (
                                    watch('shipping_address.country' as any) ??
                                    defaultShippingAddress?.country ??
                                    defaultValues.shipping_address.country
                                  )?.toLowerCase()
                              )?.code ?? '',
                          },
                          //   "merchant_urls": {
                          //     "confirmation": "https://kkevadiya.000webhostapp.com/"
                          //   }
                        }
                      );
                      console.log('✌️klarnaRes --->', klarnaRes);
                      if (klarnaRes.status === 200) {
                        // Update an order payment
                        const { status } = await orderApi.updatePayment(
                          rePaymentOrderId as string,
                          {
                            payment_method: fd.payment_method,
                            extra_charges: paymentCharge as number,
                          }
                        );
                        if (status === 200) {
                          await replace(
                            paths.orderThankYou.root(
                              (orderData?.order_no as string) || (rePaymentOrderId as string)
                            )
                          );
                        } else {
                          await replace(paths.order.root);
                        }
                      }
                    } catch (error) {
                      if (error?.response?.data?.status === 401)
                        signOut({ callbackUrl: paths.order.root });
                      localStorage.clear();
                      console.error(error);
                      // setOrderError(`Klarna: ${error.response.data.message}`);
                      // window.scrollTo({
                      //   top: 0,
                      //   behavior: 'smooth'
                      // });
                    }
                  }
                );
              }
            );
          };
          window.klarnaAsyncCallback();
        }
      } else if (!rePaymentOrderId && !orderData?.product_details) {
        // Create an order
        const response = await orderApi.create(payload);
        setOrderData(response.data.data);
        if (response.data.isSuccess) {
          // Reset the ring builder
          resetRingBuilder();
          setDiamondSku([]);
          setOrderSuccess(true);
          setIsSubmitting(false);

          setClientCartItems([]);
          _setCouponDiscount(0);
          setCheckOutPreview([]);
          _setCouponName('');
          _setShipping_cost(35);
          setLocalCardLength(0);
          localStorage.removeItem('cartItems');
          localStorage.removeItem('cart');
        }
        await replace(paths.orderThankYou.root(response.data?.data.order_no as string));
      } else {
        // Update an order payment
        await orderApi.updatePayment(rePaymentOrderId as string, {
          payment_method: fd.payment_method,
          extra_charges: paymentCharge as number,
        });
        await replace(
          paths.orderThankYou.root((orderData?.order_no as string) || (rePaymentOrderId as string))
        );
      }
    } catch (e) {
      if (e?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      if (e?.response?.data?.message === 'Validated stock data.') {
        let validateErrorMSG = null;

        await cartValidationLocalUpdate(e?.response?.data?.data);

        // eslint-disable-next-line no-restricted-syntax
        for (const item of e?.response?.data?.data) {
          if (item.message) {
            validateErrorMSG = item.message;
            break;
          } else if (item.build_ring?.diamond_id?.message) {
            validateErrorMSG = item.build_ring.diamond_id.message;
            break;
          }
        }
        setOrderError(
          e.response?.data?.data?.errors?.[0]?.message?.replaceAll(/"/g, '') ||
            e.response?.data?.data?.errors?.message?.replaceAll(/"/g, '') ||
            validateErrorMSG ||
            e?.response?.data?.message ||
            e.message
        );
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }
      setOrderError(
        e.response?.data?.data?.errors?.[0]?.message?.replaceAll(/"/g, '') ||
          e.response?.data?.data?.errors?.message?.replaceAll(/"/g, '') ||
          e?.response?.data?.message ||
          e.message
      );
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const findDiamodImg = (diamond_schema: any, shape: string) => {
    const colorName = diamond_schema?.intensity
      ? REAL_COLOR_OPTIONS.find((_c) => _c.value === Number(diamond_schema?.color))?.label_view
      : '';
    let diamondImage;
    if (colorName) {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/colorDiamond/${shape.toLowerCase()}/${colorName?.charAt(0)?.toUpperCase()}${colorName?.slice(1)}.png`;
    } else {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/whiteDiamond/${shape.toLowerCase()}.png`;
    }
    return diamondImage;
  };

  useEffect(() => {
    if (typeof watch('coupon_code') === 'string' && watch('coupon_code') !== '') {
      setCouponError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('coupon_code')]);

  useEffect(() => {
    if (!googleShippingAddress.length) return;

    const getAddressValue = (type: string) =>
      googleShippingAddress.find((address: any) => address.types.includes(type))?.short_name;

    const postcode = getAddressValue('postal_code');
    const country_code = getAddressValue('country');
    const stateCode = getAddressValue('administrative_area_level_1');
    const city = getAddressValue('administrative_area_level_3');
    const sublocality_level_3 = getAddressValue('sublocality_level_3');
    const sublocality_level_2 = getAddressValue('sublocality_level_2');
    const sublocality_level_1 = getAddressValue('sublocality_level_1');
    const route = getAddressValue('route');
    const locality = getAddressValue('locality');

    const _address = [
      route,
      sublocality_level_3,
      sublocality_level_2,
      sublocality_level_1,
      locality,
    ]
      .filter(Boolean)
      .join(', ');

    setValue('shipping_address.postcode', postcode || '');
    setValue('shipping_address.city', city || locality || '');
    setValue('shipping_address.address', _address || '');
    setValue('shipping_address.address_second', '');

    const countryInfo = countryData.find((c) => c.iso2 === country_code);
    setValue('shipping_address.country', countryInfo?.name || '');

    const stateName = countryInfo?.states.find((s) => s.state_code === stateCode)?.name;
    setTimeout(() => setValue('shipping_address.state', stateName || ''), 500);
  }, [googleShippingAddress, setValue]);

  useEffect(() => {
    if (!googleBillingAddress.length) return;

    const getAddressValue = (type: string) =>
      googleBillingAddress.find((address: any) => address.types.includes(type))?.short_name;

    const postcode = getAddressValue('postal_code');
    const country_code = getAddressValue('country');
    const stateCode = getAddressValue('administrative_area_level_1');
    const city = getAddressValue('administrative_area_level_3');
    const sublocality_level_3 = getAddressValue('sublocality_level_3');
    const sublocality_level_2 = getAddressValue('sublocality_level_2');
    const sublocality_level_1 = getAddressValue('sublocality_level_1');
    const route = getAddressValue('route');
    const locality = getAddressValue('locality');

    const _address = [
      route,
      sublocality_level_3,
      sublocality_level_2,
      sublocality_level_1,
      locality,
    ]
      .filter(Boolean)
      .join(', ');

    setValue('billing_address.postcode' as any, postcode || '');
    setValue('billing_address.city' as any, city || locality || '');
    setValue('billing_address.address' as any, _address || '');
    setValue('billing_address.address_second' as any, '');

    const countryInfo = countryData.find((c) => c.iso2 === country_code);
    setValue('billing_address.country' as any, countryInfo?.name || '');

    const stateName = countryInfo?.states.find((s) => s.state_code === stateCode)?.name;
    setTimeout(() => setValue('billing_address.state' as any, stateName || ''), 500);
  }, [googleBillingAddress, setValue]);

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
        <symbol id="check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </symbol>
        <symbol id="info-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </symbol>
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </symbol>
      </svg>

      <section className="checkout-page">
        <div className="container-fluid">
          {orderError && (
            <div
              className="alert alert-danger  d-flex align-items-center mt-3"
              role="alert"
              style={{ height: '60px' }}
            >
              <svg
                className="bi flex-shrink-0 "
                role="img"
                aria-label="Danger:"
                style={{ width: '20px', marginRight: '6px' }}
              >
                <use xlinkHref="#exclamation-triangle-fill" />
              </svg>
              <div style={{ lineHeight: '1.2', fontSize: '14px' }}>{orderError}</div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-8">
              {!rePaymentOrderId ? (
                <h3 className="fw-600 mb-0">Checkout</h3>
              ) : (
                <h3 className="fw-600 mb-4">Repayment</h3>
              )}

              <div className="checkout-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    {!rePaymentOrderId && (
                      <>
                        <div className="col-lg-12">
                          <h5 className="fw-700 mt-4 mb-3">1. Shipping Details</h5>
                        </div>
                        <div className="col-12 mb-2">
                          <GooglePlaceAutocomplete
                            setPlaces={setGoogleShippingAddress}
                            label="Enter & Select Shipping Address"
                          />
                        </div>
                        <div className="col-lg-6">
                          <Input
                            label={fields.address.first_name}
                            name="shipping_address.first_name"
                            control={control}
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <Input
                            label={fields.address.last_name}
                            name="shipping_address.last_name"
                            control={control}
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <Input
                            label={fields.address.address}
                            name="shipping_address.address"
                            control={control}
                            placeholder="House number and street name"
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <label
                            htmlFor="address2"
                            className="fw-500"
                            style={{ fontSize: '14px', color: 'rgb(118,118,118)' }}
                          >
                            Address Line 2
                          </label>
                          <Input
                            name="shipping_address.address_second"
                            control={control}
                            placeholder="Apartment, suite, unit, etc."
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <SelectUI
                            label={fields.address.country}
                            name="shipping_address.country"
                            placeholder="Select a country..."
                            allowDeselect={false}
                            control={control as any}
                            checkIconPosition="right"
                            nothingFoundMessage="Nothing found..."
                            data={countryData?.map((item) => ({
                              value: item.name,
                              label: item.name,
                            }))}
                            clearable
                            searchable
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <SelectUI
                            label={fields.address.state}
                            name="shipping_address.state"
                            placeholder="Select a state..."
                            nothingFoundMessage="Nothing found..."
                            control={control as any}
                            allowDeselect={false}
                            checkIconPosition="right"
                            data={
                              watch('shipping_address.country')
                                ? countryData
                                    .find(
                                      (item) =>
                                        item.name ===
                                        (getValues('shipping_address.country') ||
                                          defaultShippingAddress?.country)
                                    )
                                    ?.states?.map((item: any) => ({
                                      value: item.name,
                                      label: item.name,
                                    }))
                                : []
                            }
                            clearable
                            disabled={
                              // @ts-ignore
                              (watch('shipping_address.country')
                                ? countryData
                                    .find(
                                      (item) =>
                                        item.name ===
                                        // @ts-ignore
                                        (watch('shipping_address.country' as any) ||
                                          defaultBillingAddress?.country)
                                    )
                                    ?.states?.map((item: any) => ({
                                      value: item.name,
                                      label: item.name,
                                    }))
                                : []
                              )?.length === 0
                            }
                            searchable
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <Input
                            label={fields.address.city}
                            name="shipping_address.city"
                            control={control}
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-6">
                          <Input
                            label={fields.address.postcode}
                            name="shipping_address.postcode"
                            control={control}
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-12">
                          <h6 className="my-2">CONTACT DETAILS</h6>
                        </div>
                        <div className="col-lg-6">
                          {/* <Input
                            label={fields.address.phone}
                            name="shipping_address.phone"
                            control={control}
                            withAsterisk
                          /> */}
                          <div className="col-12">
                            <label
                              htmlFor="phone"
                              className="form-label fw-500"
                              style={{ fontSize: '14px' }}
                            >
                              Phone<span className="text-danger ms-1">*</span>
                            </label>
                            <IntlTelInput
                              containerClassName="intl-tel-input"
                              inputClassName="form-control register_input"
                              value={mobile}
                              separateDialCode
                              defaultCountry={ipCountryCode}
                              onPhoneNumberChange={handlePhoneNumberChange}
                              onSelectFlag={handleSelectFlag}
                              style={{ borderRadius: '0px' }}
                            />
                            {mobileAlert && <p className="ErrorInput">{mobileAlert}</p>}
                            {mobileError && !mobileAlert && (
                              <p className="ErrorInput">This field is required</p>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <Input
                            label={fields.address.email}
                            name="shipping_address.email"
                            control={control}
                            withAsterisk
                          />
                        </div>
                        <div className="col-lg-12">
                          <h6 className="my-2">ORDER NOTES</h6>
                        </div>
                        <div className="col-lg-12">
                          <Textarea
                            // name="shipping_address.message"
                            rows={4}
                            {...register('message')}
                            withAsterisk
                            id="custom-textarea"
                            placeholder="Engraving: Alexa, Discreet Packaging, Please make a lower invoice amount for customs fees."
                            error={<span className="ErrorInput">{errors.message?.message}</span>}
                          />
                        </div>
                        <div className="col-lg-12">
                          <h6 className="mt-2">SHIPPING METHOD</h6>
                          <Radio.Group
                            value={watch('shipping_cost')}
                            onChange={(event: string) => setValue('shipping_cost', event)}
                          >
                            <Group mt="xs" className="flex-column align-items-start">
                              {(orderData?.product_details?.length > 0
                                ? Number(orderData?.order_base_price as number)
                                : Number(totalPrice) < 500) &&
                              (shipping_cost === 35 || Number(totalPrice) < 500) ? (
                                <Radio
                                  {...register('shipping_cost')}
                                  color="#000000"
                                  value="35"
                                  label="Shipping $35 (~Free shipping on orders over $500)"
                                  className="custom-radio fw-500"
                                />
                              ) : (
                                (shipping_cost === 0 || Number(totalPrice) > 500) && (
                                  <Radio
                                    {...register('shipping_cost')}
                                    color="#000000"
                                    value="0"
                                    label="Free Shipping (~2 Weeks)"
                                    className="custom-radio fw-500"
                                  />
                                )
                              )}
                              <Radio
                                {...register('shipping_cost')}
                                color="#000000"
                                value="120"
                                label="Express Shipping (~1 Week : $120 )"
                                className="custom-radio fw-500"
                                defaultChecked
                              />
                            </Group>
                          </Radio.Group>
                          {/* <Radio
                            {...register('shipping_cost')}
                            color="#000000"
                            value="50"
                            className="custom-radio fw-500"
                            defaultChecked
                            label="Shipping $50"
                            variant="outline"
                          /> */}
                        </div>

                        <div className="col-lg-12">
                          <hr className="my-2 my-md-4" />
                        </div>
                        <div className="col-lg-12">
                          <h5 className="fw-700 mb-3">2. Billing Details</h5>
                          <Checkbox
                            {...register('billing_same_as_shipping')}
                            color="#000000"
                            size="xs"
                            defaultChecked
                            className="radio-input mb-0 fw-500"
                            label="Same as shipping address"
                            onChange={toggleBillingVisibility}
                          />

                          {watch('billing_same_as_shipping') === false && (
                            <div
                              className={
                                billingVisible ? 'row mt-4 billing-form ' : 'row mt-4 billing-form '
                              }
                            >
                              <div className="col-12 mb-2">
                                <GooglePlaceAutocomplete
                                  setPlaces={setGoogleBillingAddress}
                                  label="Enter & Select Billing Address"
                                />
                              </div>
                              <div className="col-lg-6">
                                <Input
                                  label={fields.address.first_name}
                                  // @ts-ignore
                                  name="billing_address.first_name"
                                  control={control}
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <Input
                                  label={fields.address.last_name}
                                  // @ts-ignore
                                  name="billing_address.last_name"
                                  control={control}
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <Input
                                  label={fields.address.address}
                                  // @ts-ignore
                                  name="billing_address.address"
                                  control={control}
                                  placeholder="House number and street name"
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <label
                                  htmlFor="address2"
                                  className="fw-500"
                                  style={{ fontSize: '14px', color: 'rgb(118,118,118)' }}
                                >
                                  Address Line 2
                                </label>
                                <Input
                                  // @ts-ignore
                                  name="billing_address.address_second"
                                  control={control}
                                  placeholder="Apartment, suite, unit, etc."
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <SelectUI
                                  label={fields.address.country}
                                  name="billing_address.country"
                                  placeholder="Select a country..."
                                  allowDeselect={false}
                                  control={control as any}
                                  checkIconPosition="right"
                                  nothingFoundMessage="Nothing found..."
                                  data={countryData?.map((item) => ({
                                    value: item.name,
                                    label: item.name,
                                  }))}
                                  clearable
                                  searchable
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <SelectUI
                                  label={fields.address.state}
                                  // @ts-ignore
                                  name="billing_address.state"
                                  placeholder="Select a state..."
                                  nothingFoundMessage="Nothing found..."
                                  control={control as any}
                                  allowDeselect={false}
                                  checkIconPosition="right"
                                  data={
                                    // @ts-ignore
                                    watch('billing_address.country')
                                      ? countryData
                                          .find(
                                            (item) =>
                                              item.name ===
                                              // @ts-ignore
                                              (watch('billing_address.country' as any) ||
                                                defaultBillingAddress?.country)
                                          )
                                          ?.states?.map((item: any) => ({
                                            value: item.name,
                                            label: item.name,
                                          }))
                                      : []
                                  }
                                  clearable
                                  disabled={
                                    // @ts-ignore
                                    (watch('billing_address.country')
                                      ? countryData
                                          .find(
                                            (item) =>
                                              item.name ===
                                              // @ts-ignore
                                              (watch('billing_address.country' as any) ||
                                                defaultBillingAddress?.country)
                                          )
                                          ?.states?.map((item: any) => ({
                                            value: item.name,
                                            label: item.name,
                                          }))
                                      : []
                                    )?.length === 0
                                  }
                                  searchable
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <Input
                                  label={fields.address.city}
                                  // @ts-ignore
                                  name="billing_address.city"
                                  control={control}
                                  withAsterisk
                                />
                              </div>
                              <div className="col-lg-6">
                                <Input
                                  label={fields.address.postcode}
                                  // @ts-ignore
                                  name="billing_address.postcode"
                                  control={control}
                                  withAsterisk
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-lg-12">
                          <hr className="my-2 my-md-4" />
                        </div>
                        <div className="col-lg-12">
                          <h5 className="fw-700 mb-3">3. Payment Option</h5>
                        </div>
                      </>
                    )}
                    <div className="col-lg-12">
                      <Accordion
                        variant="contained"
                        defaultValue="stripe"
                        onChange={(value) => {
                          setValue('payment_method', value as string);
                          paymentMethodChange(value as string);
                        }}
                        className="payment-option-accordion"
                      >
                        {/* Stripe  */}
                        <Accordion.Item value="stripe">
                          <Accordion.Control>Stripe</Accordion.Control>
                          <Accordion.Panel className="p-3 p-md-4 pt-0 p-md-4">
                            <CheckoutFormWrapper
                              checkoutRef={refCheckoutForm}
                              total_amount={`${
                                orderData?.product_details?.length > 0
                                  ? (
                                      Number(orderData?.order_base_price as number) +
                                      Number(orderData?.shipping_cost) +
                                      Number(paymentCharge) -
                                      Number(orderData?.discount)
                                    ).toFixed(2)
                                  : (
                                      Number(totalPrice) +
                                      Number(shipping_cost) +
                                      Number(paymentCharge) -
                                      Number(couponDiscount)
                                    ).toFixed(2)
                              }`}
                            />
                          </Accordion.Panel>
                        </Accordion.Item>
                        {/* Slplitit */}
                        <Accordion.Item value="splitit">
                          <Accordion.Control>
                            Monthly credit card payments - no fees
                          </Accordion.Control>
                          <Accordion.Panel className="p-3 p-md-4 pt-0 p-md-4">
                            <div id="flex-form" />
                          </Accordion.Panel>
                        </Accordion.Item>
                        {/* Klarna */}
                        <Accordion.Item value="klarna">
                          <Accordion.Control>Klarna</Accordion.Control>
                          <Accordion.Panel className="p-3 p-md-4 pt-0 p-md-4">
                            <p>
                              {orderSuccess
                                ? 'Click pay to continue'
                                : rePaymentOrderId
                                  ? 'Click pay to continue'
                                  : 'Click place order to continue'}
                            </p>
                            <div id="klarna_container" style={{ width: 500, margin: 'auto' }} />
                          </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="crypto">
                          <Accordion.Control>Crypto (USDT)</Accordion.Control>
                          <Accordion.Panel className="p-3 p-md-4 pt-0 p-md-4">
                            <div className="container">
                              <div className="row">
                                <div className="col-md-8">
                                  <p className="mb-0">TRC20 Address :</p>
                                  <div className="d-flex  mb_20">
                                    {/* <p className="me-2 mb-0">TGHhWnoczXqbj9WttDu4AEUFEVVs2uFNR4</p> */}
                                    <p className="me-2 mb-0 fs-12">
                                      {paths.cryptoUSDTAddress.root}
                                    </p>
                                    <i
                                      className="fa fa-clone "
                                      onClick={() =>
                                        navigator.clipboard.writeText(paths.cryptoUSDTAddress.root)
                                      }
                                    />
                                  </div>
                                  <ul>
                                    <li className="fs-14">
                                      Send only USDT to this deposit address.
                                    </li>
                                    <li className="fs-14">Ensure the network is Tron (TRC20).</li>
                                    <li className="fs-14">Do not send NFTs to this address.</li>
                                  </ul>
                                </div>
                                <div className="col-md-4">
                                  <Image
                                    src="https://cdn.loosegrowndiamond.com/wp-content/plugins/woo-lgd-crypto-gateway/images/USDTCode.png"
                                    alt="qr_code"
                                    className="img-fluid qr_image"
                                    width={160}
                                    height={160}
                                  />
                                </div>
                              </div>
                            </div>
                          </Accordion.Panel>
                        </Accordion.Item>
                        {/* Bank transfer */}
                        <Accordion.Item value="wire">
                          <Accordion.Control>Direct bank transfer</Accordion.Control>
                          <Accordion.Panel className="p-3 p-md-4 pt-0 p-md-4">
                            <p>
                              Once the order is placed, wire transfer instructions will be emailed
                              to you.
                            </p>
                          </Accordion.Panel>
                        </Accordion.Item>
                        {/* PayPal */}
                        <Accordion.Item value="paypal">
                          <Accordion.Control>PayPal</Accordion.Control>
                          <Accordion.Panel className="p-3 p-md-4 pt-0 p-md-4">
                            <p>
                              We are facing a technical issue with PayPal. Please select another
                              payment option to complete your purchase.
                            </p>
                          </Accordion.Panel>
                        </Accordion.Item>
                        {/* <Accordion.Item value="zelle">
                          <Accordion.Control>Zelle</Accordion.Control>
                          <Accordion.Panel className='p-3 p-md-4 pt-0 p-md-4' >
                            <p>
                              After the order is placed, Zelle instructions will be emailed to you.
                              Please share the receipt of the payment at
                              support@loosegrowndiamond.com.
                            </p>
                          </Accordion.Panel>
                        </Accordion.Item> */}
                      </Accordion>

                      <div className="text-end">
                        {/* <button type="submit" className="common_btn" disabled={isSubmitting}>
                        PLACE ORDER
                      </button> */}
                        <button type="submit" className="common_btn" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <div className="spinner-border text-light auth_loader" role="status">
                              <span className="visually-hidden ">Loading...</span>
                            </div>
                          ) : orderSuccess ? (
                            'Pay'
                          ) : rePaymentOrderId ? (
                            'Pay'
                          ) : (
                            'PLACE ORDER'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Future new design */}
                    <div className="col-lg-12 d-none">
                      <Tabs defaultValue="gallery" className="checkout-tab mt-4">
                        <Tabs.List>
                          <Tabs.Tab value="chat">
                            <Image
                              src={paypalImg}
                              alt="paypalImg"
                              width={paypalImg.width}
                              height={paypalImg.height}
                            />
                          </Tabs.Tab>
                          <Tabs.Tab value="gallery">
                            Bank Transfer
                            <br />
                            <small>(2% Discount)</small>
                          </Tabs.Tab>
                          <Tabs.Tab value="account">
                            <div className="d-flex align-items-center">
                              Buy now,
                              <br /> pay later
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="64"
                                height="15"
                                viewBox="0 0 64 15"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_6917_478)">
                                  <path
                                    d="M11.4818 0.380737H8.3938C8.3938 2.91486 7.23059 5.22742 5.20883 6.75067L3.99023 7.66461L8.72614 14.1176H12.6173L8.25532 8.17698C10.3186 6.12752 11.4818 3.35799 11.4818 0.380737Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M3.60258 0.380737H0.445312V14.1176H3.60258V0.380737Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M16.5085 0.380737H13.5312V14.1176H16.5085V0.380737Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M42.6259 4.35503C41.4904 4.35503 40.4102 4.70122 39.6902 5.6844V4.61813H36.8652V14.1176H39.7317V9.13248C39.7317 7.69232 40.701 6.98609 41.8642 6.98609C43.1105 6.98609 43.8306 7.73386 43.8306 9.11863V14.1315H46.6694V8.08005C46.6694 5.86442 44.9107 4.35503 42.6259 4.35503Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M25.5097 4.61813V5.22743C24.7065 4.67352 23.7372 4.35503 22.6847 4.35503C19.9152 4.35503 17.6719 6.59835 17.6719 9.36789C17.6719 12.1374 19.9152 14.3807 22.6847 14.3807C23.7372 14.3807 24.7065 14.0623 25.5097 13.5083V14.1176H28.3484V4.61813H25.5097ZM22.9201 11.8051C21.4938 11.8051 20.3445 10.7111 20.3445 9.36789C20.3445 8.02466 21.4938 6.93069 22.9201 6.93069C24.3465 6.93069 25.4958 8.02466 25.4958 9.36789C25.4958 10.7111 24.3465 11.8051 22.9201 11.8051Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M32.7518 5.85058V4.61813H29.8438V14.1176H32.7656V9.68638C32.7656 8.19083 34.3858 7.38767 35.5074 7.38767C35.5213 7.38767 35.5351 7.38767 35.5351 7.38767V4.61813C34.3858 4.61813 33.3195 5.11665 32.7518 5.85058Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M55.5038 4.61813V5.22743C54.7006 4.67352 53.7313 4.35503 52.6789 4.35503C49.9093 4.35503 47.666 6.59835 47.666 9.36789C47.666 12.1374 49.9093 14.3807 52.6789 14.3807C53.7313 14.3807 54.7006 14.0623 55.5038 13.5083V14.1176H58.3426V4.61813H55.5038ZM52.9143 11.8051C51.488 11.8051 50.3386 10.7111 50.3386 9.36789C50.3386 8.02466 51.488 6.93069 52.9143 6.93069C54.3406 6.93069 55.49 8.02466 55.49 9.36789C55.5038 10.7111 54.3406 11.8051 52.9143 11.8051Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M60.5436 4.89507C60.5436 4.75659 60.4467 4.67351 60.2944 4.67351H60.0312V5.39359H60.1559V5.13048H60.2944L60.4051 5.39359H60.5436L60.419 5.10278C60.5021 5.06124 60.5436 4.992 60.5436 4.89507ZM60.2944 5.00585H60.1559V4.78429H60.2944C60.3774 4.78429 60.419 4.82583 60.419 4.89507C60.419 4.96431 60.3913 5.00585 60.2944 5.00585Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M60.2528 4.36887C59.8789 4.36887 59.5742 4.67351 59.5742 5.0474C59.5881 5.42129 59.8789 5.72594 60.2528 5.72594C60.6266 5.72594 60.9313 5.42129 60.9313 5.0474C60.9313 4.67351 60.6266 4.36887 60.2528 4.36887ZM60.2528 5.60131C59.9481 5.60131 59.7127 5.35205 59.7127 5.0474C59.7127 4.74275 59.962 4.4935 60.2528 4.4935C60.5574 4.4935 60.7928 4.74275 60.7928 5.0474C60.7928 5.35205 60.5436 5.60131 60.2528 5.60131Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M61.3742 10.7527C60.3911 10.7527 59.5879 11.5558 59.5879 12.539C59.5879 13.5222 60.3911 14.3254 61.3742 14.3254C62.3574 14.3254 63.1606 13.5222 63.1606 12.539C63.1606 11.542 62.3574 10.7527 61.3742 10.7527Z"
                                    fill="black"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_6917_478">
                                    <rect
                                      width="62.7161"
                                      height="14"
                                      fill="white"
                                      transform="translate(0.445312 0.380737)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                          </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="chat" pb="xs">
                          Paypal
                        </Tabs.Panel>
                        <Tabs.Panel value="gallery" pb="xs">
                          Bank Transfer
                        </Tabs.Panel>
                        <Tabs.Panel value="account" pb="xs">
                          Pay in 4. Interest-free.
                        </Tabs.Panel>
                      </Tabs>
                    </div>
                  </div>
                </form>
                {/* {orderSuccess && (
                  <div
                    className="alert alert-success justify-content-center d-flex align-items-center mt-3"
                    role="alert"
                    style={{ height: '40px' }}
                  >
                    <svg
                      className="bi flex-shrink-0 me-2"
                      role="img"
                      aria-label="Success:"
                      style={{ width: '20px' }}
                    >
                      <use xlinkHref="#check-circle-fill" />
                    </svg>
                    <div>Order Place Successfully </div>
                  </div>
                )} */}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart_collaterals_sticky">
                <div className="cart_collaterals order_summery_cart_item">
                  <h6 className="fw-600 mb_30">Order Summary</h6>
                  <div>
                    {orderData?.product_details?.length > 0 || cartItems.length > 0 ? (
                      (orderData?.product_details?.length > 0
                        ? orderData?.product_details
                        : cartItems.length > 0 && cartItems
                      ).map(
                        (
                          {
                            diamond_schema,
                            product_schema,
                            back_setting,
                            bracelet_size,
                            ring_size,
                            variation_schema,
                            engraving_details,
                            quantity,
                            _id,
                          }: any,
                          idx: number
                        ) => (
                          <div key={idx} className="cart_item cart_item1 w-100">
                            {/* Product */}
                            {product_schema && (
                              <div className={diamond_schema && product_schema ? 'pb-3' : ''}>
                                <div className="product_name">
                                  <div className="text-center">
                                    <Image
                                      src={
                                        variation_schema?.image ??
                                        variation_schema?.gallery_img?.[0] ??
                                        product_schema?.images?.[0]
                                      }
                                      alt="product-image"
                                      width={80}
                                      height={80}
                                    />
                                  </div>
                                  <div className="w-100">
                                    <div className="setting_pttl">
                                      <p className="d-block mb-0">{product_schema.name}</p>
                                      {product_schema.product_type === 'custom' && (
                                        // <div className='description-cart'>
                                        <div className="">
                                          <HtmlContent
                                            html={
                                              (product_schema?.long_description as string) ||
                                              (product_schema?.short_description as string)
                                            }
                                          />
                                        </div>
                                      )}
                                      <ul style={{ listStyleType: 'none' }}>
                                        {variation_schema &&
                                        product_schema.product_type !== 'diamond' ? (
                                          <>
                                            {variation_schema && (
                                              <p className="m-0">
                                                <b className="me-1">SKU:</b>
                                                <span>{variation_schema.sku}</span>
                                              </p>
                                            )}
                                            <p className="m-0 text-capitalize ">
                                              <b className="text_black_secondary ">Metal: </b>
                                              {variation_schema?.name.length > 1 &&
                                              ['14k', '18k', 'platinum'].some((keyword) =>
                                                variation_schema?.name[1].value?.includes(keyword)
                                              ) ? (
                                                <span className="text-capitalize">
                                                  {variation_schema?.name[1]?.value?.replace(
                                                    /[-_]/g,
                                                    ' '
                                                  )}
                                                </span>
                                              ) : (
                                                <span className="text-capitalize">
                                                  {variation_schema?.name[0]?.value?.replace(
                                                    /[-_]/g,
                                                    ' '
                                                  )}
                                                </span>
                                              )}
                                            </p>
                                            <p className="mb-0">
                                              {variation_schema?.name.length > 1 &&
                                              ['14k', '18k', 'platinum'].some((keyword) =>
                                                variation_schema?.name[1].value?.includes(keyword)
                                              )
                                                ? variation_schema?.name[0]?.value && (
                                                    <span className="text-capitalize">
                                                      <b className="text_black_secondary ">
                                                        Carat Weight:{' '}
                                                      </b>
                                                      {variation_schema?.name[0]?.value?.replace(
                                                        /[-_]/g,
                                                        '.'
                                                      )}
                                                    </span>
                                                  )
                                                : variation_schema?.name[1]?.value && (
                                                    <span className="text-capitalize">
                                                      <b className="text_black_secondary ">
                                                        Carat Weight:{' '}
                                                      </b>
                                                      {variation_schema?.name[1]?.value?.replace(
                                                        /[-_]/g,
                                                        '.'
                                                      )}
                                                    </span>
                                                  )}
                                            </p>
                                            {back_setting && (
                                              <p className="mb-0">
                                                <b className="text_black_secondary ">
                                                  Back Setting:{' '}
                                                </b>
                                                <span>{back_setting}</span>
                                              </p>
                                            )}
                                            {ring_size && (
                                              <p className="mb-0">
                                                <b className="text_black_secondary ">Ring Size: </b>
                                                <span>{ring_size}</span>
                                              </p>
                                            )}
                                            {bracelet_size && (
                                              <p className="mb-0">
                                                <b className="text_black_secondary ">
                                                  Bracelet Length:{' '}
                                                </b>
                                                <span>{bracelet_size}</span>
                                              </p>
                                            )}
                                            {engraving_details?.text?.length > 0 && (
                                              <p className="mb-0">
                                                <b className="text_black_secondary ">
                                                  Engraving Text:{' '}
                                                </b>
                                                <span
                                                  style={{ fontFamily: engraving_details?.font }}
                                                >
                                                  {engraving_details?.text}
                                                </span>
                                              </p>
                                            )}
                                          </>
                                        ) : (
                                          !diamond_schema && (
                                            <>
                                              {variation_schema?.name?.map((ele: any) => (
                                                <div key={ele.value}>
                                                  {/MM/i.test(ele.value)
                                                    ? ele.value && (
                                                        <p className="m-0 text-capitalize">
                                                          <b className="text_black_secondary">
                                                            Size:{' '}
                                                          </b>
                                                          <span>
                                                            {ele.value?.replaceAll('_', ' ')}
                                                          </span>
                                                        </p>
                                                      )
                                                    : ['GHI', 'DEF'].includes(
                                                          ele.value?.toUpperCase()
                                                        )
                                                      ? ele.value && (
                                                          <p className="m-0 text-capitalize">
                                                            <b className="text_black_secondary">
                                                              Available Colors:{' '}
                                                            </b>
                                                            <span className="text-uppercase">
                                                              {ele.value}
                                                            </span>
                                                          </p>
                                                        )
                                                      : ele.value && (
                                                          <p className="m-0 text-capitalize">
                                                            <b className="text_black_secondary">
                                                              Purity:{' '}
                                                            </b>
                                                            <span className="text-uppercase">
                                                              {ele.value}
                                                            </span>
                                                          </p>
                                                        )}
                                                </div>
                                              ))}
                                            </>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                    <div className="product_quantity_total">
                                      <p className="product_quantity fw-500 mb-0">
                                        {product_schema?.product_type === 'ring_setting'
                                          ? '1'
                                          : quantity ?? '1'}{' '}
                                        qty.
                                      </p>
                                      <div className="d-flex flex-column align-items-end text-end">
                                        {/* {product.isSale ? (
                                <>
                                  <p className="fw-500 mb-1">${product.salePrice}</p>
                                  <del>was ${product.regularPrice}</del>
                                </>
                              ) : (
                                <p className="fw-500 mb-1">${product.regularPrice}</p>
                              )} */}
                                        <p className="fw-500 mb-1">
                                          $
                                          {(
                                            Number(
                                              variation_schema?.sale_price ??
                                                product_schema?.sale_price ??
                                                0
                                            ) *
                                            (diamond_schema && (variation_schema || product_schema)
                                              ? 1
                                              : quantity ?? 1)
                                          ).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </p>
                                        {product_schema?.product_type !== 'custom' && (
                                          <del>
                                            was $
                                            {(
                                              Number(
                                                variation_schema?.regular_price ??
                                                  product_schema.regular_price
                                              ) *
                                              (diamond_schema &&
                                              (variation_schema || product_schema)
                                                ? 1
                                                : quantity ?? 1)
                                            ).toLocaleString('en-US', {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </del>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* diamond */}
                            {diamond_schema && (
                              <div>
                                <div className="product_name">
                                  <div className="text-center">
                                    {diamond_schema && (
                                      <Image
                                        src={
                                          diamond_schema
                                            ? findDiamodImg(diamond_schema, diamond_schema?.shape)
                                            : variation_schema?.image ??
                                              variation_schema?.gallery_img?.[0] ??
                                              product_schema?.images?.[0]
                                        }
                                        alt="loosegrowndiamond_logo"
                                        width={50}
                                        height={50}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <div className="setting_pttl">
                                      {getDiamondTitle(
                                        diamond_schema,
                                        diamond_schema?.intensity ? 'color' : 'white',
                                        true
                                      ) ||
                                        getDiamondTitle(
                                          diamond_schema,
                                          diamond_schema?.intensity ? 'color' : 'white',
                                          true
                                        )?.props?.children?.[0] ||
                                        getDiamondTitle(
                                          diamond_schema,
                                          diamond_schema?.intensity ? 'color' : 'white',
                                          true
                                        )?.props?.children}
                                    </div>
                                    <div className="product_quantity_total">
                                      <p className="product_quantity fw-500 mb-0">
                                        {product_schema?.product_type === 'ring_setting'
                                          ? '1'
                                          : quantity ?? '1'}{' '}
                                        qty.
                                      </p>
                                      <div className="d-flex flex-column align-items-end text-end">
                                        <p className="fw-500 mb-1">
                                          $
                                          {diamond_schema.price.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </p>
                                        <del>
                                          was $
                                          {diamond_schema.regular_price.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </del>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className="py_40">
                        <div className="text-center">
                          <Image src={LoadingImage} alt="loader" width={30} height={30} />
                        </div>
                      </div>
                    )}
                  </div>
                  {!rePaymentOrderId && !applyCodeShow && _couponDiscount === 0 && (
                    <button
                      type="button"
                      className="coupon_form fw-500 mb-0"
                      onClick={() => setApplyCodeShow(!applyCodeShow)}
                    >
                      Apply promo code +
                    </button>
                  )}

                  {_couponDiscount === 0 && applyCodeShow && (
                    <>
                      <form onSubmit={handleSubmit(onSubmitCoupon)}>
                        <div className={applyCodeShow ? 'promo_code active' : 'promo_code'}>
                          <input
                            type="text"
                            {...register('coupon_code')}
                            className={couponError?.length > 0 ? 'errorInput' : ''}
                            placeholder="Enter Promo Code"
                            onChange={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                              register('coupon_code').onChange(e);
                            }}
                          />
                          <button
                            type="submit"
                            className="btn apply_btn"
                            onClick={() =>
                              !watch('coupon_code') &&
                              setCouponError('Please enter a valid promo code.')
                            }
                          >
                            {couponLoading ? (
                              <div className="spinner-border inventory_loader" role="status">
                                <span className="visually-hidden ">Loading...</span>
                              </div>
                            ) : (
                              'Apply'
                            )}
                          </button>
                        </div>
                      </form>
                      {couponError && (
                        <p className="mb-2" style={{ color: 'red' }}>
                          {couponError}
                        </p>
                      )}
                    </>
                  )}
                  {Number(couponDiscount) > 0 && Number(couponDiscount) !== 0
                    ? ''
                    : !rePaymentOrderId && <div className="border_top mt-3" />}
                  <div className="d-flex align-items-center justify-content-between pb_15">
                    <span className="mb-0">Subtotal</span>
                    <span className="mb-0">
                      $
                      {orderData
                        ? orderData?.order_base_price.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalPrice.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pb_15">
                    <span className="mb-0">Shipping</span>
                    <span className="mb-0 text-uppercase">
                      {(orderData ? orderData?.shipping_cost : shipping_cost) !== 0 && '$'}
                      {(orderData ? orderData?.shipping_cost : shipping_cost) === 0
                        ? 'FREE'
                        : (orderData ? orderData?.shipping_cost : shipping_cost).toLocaleString(
                            'en-US',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                          )}
                    </span>
                  </div>
                  {(Number(couponDiscount) > 0 && Number(couponDiscount) !== 0) ||
                  orderData?.discount ? (
                    <div className="d-flex align-items-center justify-content-between pb_15">
                      <p className="fw-400 text-black mb-0">
                        Coupon (
                        {(orderData as any)?.coupon_details?.[0]?.coupon_code || _couponName})
                        {!orderData?.discount && (
                          <i
                            className="fa-solid fa-circle-xmark ms-1"
                            onClick={() => {
                              _setCouponDiscount(0);
                              setCouponDiscount(0);
                              _setCouponName('');
                              setApplyCodeShow(false);
                              setShipping_cost(_cartTotalPrice > 500 ? 0 : 35);
                              _setShipping_cost(_cartTotalPrice > 500 ? 0 : 35);
                              setValue('coupon_code', '');
                            }}
                          />
                        )}
                      </p>
                      <p className="fw-400 text-black mb-0 text-uppercase">
                        -$
                        {Number(
                          orderData ? orderData?.discount.toFixed(2) : couponDiscount
                        ).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  ) : (
                    ''
                  )}
                  {formValues.payment_method === 'stripe' && (
                    <div className="d-flex align-items-center justify-content-between pb_15">
                      <span className="mb-0 lineHight">
                        Payment
                        <br /> Processing Charge
                        <TTooltip
                          label="5% Payment Processing Charge For Stripe And Affirm. Please Use Wire/Wise/USDT/Zelle Payments."
                          w={300}
                        >
                          <span
                            className="ms-2"
                            // className="question_icon ms-1"
                            data-bs-toggle="modal"
                            data-bs-target="#youtubeModal"
                          >
                            {/* <i className="fa-solid fa-question" /> */}
                            <i className="fa-solid fa-eye" />
                          </span>
                        </TTooltip>
                      </span>
                      <span className="mb-0">${paymentCharge}</span>
                    </div>
                  )}

                  <div className="border_top" />
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="fw-700 mb-0 text-uppercase text-black">Total</p>
                    <p className="fw-700 mb-0 text-uppercase text-black">
                      $
                      {orderData?.product_details?.length > 0
                        ? (
                            Number(orderData?.order_base_price as number) +
                            Number(orderData?.shipping_cost) +
                            Number(paymentCharge) -
                            Number(orderData?.discount)
                          ).toFixed(2)
                        : (
                            totalPrice +
                            Number(shipping_cost) +
                            Number(paymentCharge) -
                            Number(couponDiscount)
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutView;
