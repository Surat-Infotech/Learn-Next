/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
/* eslint-disable no-nested-ternary */

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, Key, useMemo, useState, useEffect, useCallback } from 'react';

import clsx from 'clsx';
import * as Yup from 'yup';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import { signOut, useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { couponApi } from '@/api/coupon';
import { IWhiteDiamond } from '@/api/inventory/types';
import { cartAbandonedApi } from '@/api/cart-abandoned';
import { cartApi, ICartUpdateRequest } from '@/api/cart';
import { orderApi, IOrderValidateStockRequest } from '@/api/order';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { ICartItem } from '@/stores/cart.context';
import { useProductContext } from '@/stores/product.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import HtmlContent from '@/utils/html-content';

import { getURLForProduct, findAttributesLabelValueObj } from '@/components/common-functions';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';

import AddEngravingModal from '../add-engraving-modal';

const fields = {
  coupon_code: 'Coupon',
};

// ----------------------------------------------------------------------

const CartView: FC = () => {
  const { push } = useRouter();
  const router = useRouter();
  const { category } = useProductContext();
  const { colorFilters, clarityFilters, REAL_COLOR_OPTIONS, cutFilters } = useInventoryFilter();

  const Schema = Yup.object({
    coupon_code: Yup.string().trim().required().label(fields.coupon_code),
  });
  const { register, watch, reset, handleSubmit } = useForm({
    resolver: yupResolver(Schema),
  });

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

  const [_cartItems, setClientCartItems] = useState<ICartItem[] | any>([]);
  const [localCardItems, setLocalCardItems] = useLocalStorage<ICartItem[]>('cart', []);
  const [_cartItemsLoader, setClientCartItemsLoader] = useState<boolean>(true);
  const [couponLocal, setCouponLocal] = useLocalStorage<number>('coupon', 0);
  const [couponName, setCouponName] = useLocalStorage<string>('couponName', '');
  const [, setCartTotalPrice] = useLocalStorage<number>('cartTotal', 0);
  const [removeItemMessage, setRemoveItemMessage] = useState<string>('');
  const [applyCodeShow, setApplyCodeShow] = useState<boolean>(false);
  const { setRingDiamond, setRingSetting, setRingSize, ringDiamond, ringSetting } =
    useRingBuilderContext();
  const { resetRingBuilder } = useRingBuilderContext();
  const [cartAbandonedProducts, setCartAbandonedProducts] = useState([]);
  const [couponError, setCouponError] = useState('');
  const [shipping_cost, setShipping_cost] = useState(35);
  const [_shipping_cost, _setShipping_cost] = useLocalStorage<number>('shippingCost', 35);
  const [, _setShippingType] = useLocalStorage<string>('shippingType', 'PAID');
  const [, setLocalCardLength] = useLocalStorage<number | any>('cartLength', 0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [cartItemError, setCartItemError] = useState('');
  const [rebuildLoader, setRebuildLoader] = useState(false);
  const [secureCheckoutLoader, setSecureCheckoutLoader] = useState(false);
  const [cartItemSKU, setCartItemSKU] = useState<string[]>([]);
  const [changeLoader, setChangeLoader] = useState<number | null>(null);

  const { data: auth, status } = useSession();

  // Set the cart items from local storage
  useEffect(() => {
    if (!auth && status === 'unauthenticated') setClientCartItems(localCardItems);
  }, [auth, localCardItems, status]);

  useEffect(() => {
    if (shipping_cost === 0) return _setShippingType('FREE');
    return _setShippingType('PAID');
  }, [_setShippingType, shipping_cost]);

  useEffect(() => {
    const handleBeforePopState = ({ url }: any) => {
      if (url.startsWith('/ring-preview') && (!ringDiamond?.diamond || !ringSetting?.product)) {
        router.replace(paths.home.root); // Redirect to home
        return false; // Prevent navigation
      }
      return true; // Allow navigation
    };
    router.beforePopState(handleBeforePopState);
    return () => {
      router.beforePopState(() => true); // Reset to default behavior
    };
  }, [ringDiamond?.diamond, ringSetting?.product, router]);

  async function getCartData() {
    try {
      if (!auth && status === 'unauthenticated') {
        setClientCartItems(localCardItems);
        setClientCartItemsLoader(false);
        setLocalCardLength(localCardItems?.length);
      } else {
        setClientCartItemsLoader(true);
        const { data } = await cartApi.get();
        if (data.data) {
          setClientCartItems(data.data);
          setClientCartItemsLoader(false);
          localStorage.removeItem('cart');
          localStorage.removeItem('cartLength');
          localStorage.removeItem('cartItems');
        }
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      setClientCartItemsLoader(false);
      console.error(error);
    }
  }

  useEffect(() => {
    getCartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setCouponError('');
      setCartItemError('');
      setCouponLoading(true);
      const couponValidate = _cartItems
        .map(
          (item: {
            quantity: any;
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
        .filter((item: undefined) => item !== undefined);

      const payload = {
        product_ids: couponValidate,
        shipping_cost,
        coupon_code: data.coupon_code,
      };

      const CouponData = await couponApi.apply(payload as any);
      const discount = await CouponData.data.data.discount;
      const shippingCost = await CouponData.data.data.shipping_cost;

      setShipping_cost(Number(shippingCost));
      _setShipping_cost(Number(shippingCost));
      setCouponLocal(Number(discount));
      setCouponName(data.coupon_code);
      setCouponLoading(false);
      reset();
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      setCouponLoading(false);
      if (error?.response?.data?.message) {
        reset();
        setCouponError(error.response?.data?.message);
      } else {
        reset();
        setCouponError(error?.message);
      }
    }
  };

  const totalPrice = useMemo(
    () =>
      _cartItems.reduce(
        (
          acc: number,
          product: {
            diamond_schema: { price: any; regular_price: any; sku: string | any[] };
            variation_schema: { sale_price: any; regular_price: any; sku: string | any[] };
            product_schema: { sale_price: any; regular_price: any; parent_sku: string | any[] };
            quantity: any;
            qty: any;
          }
        ) => {
          const salePrice =
            (product?.diamond_schema?.price ?? 0) +
            (product?.variation_schema?.sale_price ?? product?.product_schema?.sale_price ?? 0);
          const regularPrice =
            (product?.diamond_schema?.regular_price ?? 0) +
            (product?.variation_schema?.regular_price ??
              product?.product_schema?.regular_price ??
              0);

          const price =
            (salePrice || regularPrice) *
            (product.diamond_schema?.sku.length > 0 &&
            (product.product_schema?.parent_sku.length > 0 ||
              product.variation_schema?.sku.length > 0)
              ? 1
              : product?.quantity ?? product?.qty ?? 1);
          setCartTotalPrice(acc + price);
          return acc + price;
        },
        0
      ),
    [_cartItems, setCartTotalPrice]
  );

  useEffect(() => {
    _setShipping_cost(_shipping_cost === 0 ? 0 : _shipping_cost || 35);
    setShipping_cost(_shipping_cost === 0 ? 0 : _shipping_cost || 35);
    setApplyCodeShow(false);
    // setCouponName('');
    // setCouponLocal(0);
    setCouponError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice]);

  useEffect(() => {
    if (totalPrice > 500) {
      setShipping_cost(0);
      _setShipping_cost(0);
    } else {
      setShipping_cost(35);
      _setShipping_cost(35);
    }
  }, [_setShipping_cost, totalPrice, localCardItems, _cartItems]);

  const totalQTY = useMemo(() => {
    if (Array.isArray(_cartItems)) {
      return _cartItems.reduce((acc, item) => acc + (item.quantity || item.qty || 0), 0);
    }
    return 0;
  }, [_cartItems]);

  useEffect(() => {
    if (_cartItems.length > 0) {
      setLocalCardLength(totalQTY);
    }
  }, [_cartItems, totalQTY, setLocalCardLength]);

  useEffect(() => {
    const skus = _cartItems.map((product: any) => {
      if (product.diamond_schema && product.product_schema) {
        return [
          product.diamond_schema?.sku,
          product?.variation_schema?.sku ?? product?.product_schema?.parent_sku,
        ];
      }
      return (
        product.diamond_schema?.sku ??
        product?.variation_schema?.sku ??
        product?.product_schema?.parent_sku
      );
    });
    setCartItemSKU(skus);
  }, [_cartItems, setCartItemSKU]);

  useMemo(() => {
    const products =
      _cartItems.length > 0 &&
      _cartItems.flatMap((item: any) => {
        const diamondName = getDiamondTitle(
          item.diamond_schema,
          item.diamond_schema?.intensity ? 'color' : 'white'
        );
        if (item.product_schema && item.diamond_schema) {
          return [
            {
              name: `${item?.product_schema?.name} ${item?.product_schema?.parent_sku ? `- ${item?.product_schema?.parent_sku}` : ''}`,
              image:
                item?.variation_schema?.image ??
                item?.variation_schema?.gallery_img?.[0] ??
                item?.product_schema?.images?.[0] ??
                '',
              price: item?.variation_schema?.sale_price ?? item?.product_schema?.sale_price,
              quantity: 1,
              ...findAttributesLabelValueObj(
                item?.variation_schema?.name,
                item?.product_schema?.product_type
              ),
              back_setting: item.back_setting || undefined,
              bracelet_length: item.bracelet_size || undefined,
              ring_size: item.ring_size || undefined,
              product_id: item?.product_schema._id,
              variation_id: item?.variation_schema?._id,
              engraving_details: {
                text: item?.engraving_details?.text || '',
                font: item?.engraving_details?.font || '',
              },
            },
            {
              name: diamondName.props.children?.[0] ?? diamondName.props.children,
              image: item.diamond_schema?.shape ?? '',
              price: item.diamond_schema?.price,
              quantity: 1,
              diamond_id: item.diamond_schema?._id,
            },
          ];
        }
        if (item.product_schema) {
          return {
            name: `${item?.product_schema?.name} ${item?.product_schema?.parent_sku ? `- ${item?.product_schema?.parent_sku}` : ''}`,
            image:
              item?.variation_schema?.image ??
              item?.variation_schema?.gallery_img?.[0] ??
              item?.product_schema?.images?.[0] ??
              '',
            price: item?.variation_schema?.sale_price ?? item?.product_schema?.sale_price,
            quantity: item.qty || item.quantity || item.stock_qty || 1,
            ...findAttributesLabelValueObj(
              item?.variation_schema?.name,
              item?.product_schema?.product_type
            ),
            back_setting: item.back_setting || undefined,
            bracelet_length: item.bracelet_size || undefined,
            ring_size: item.ring_size || undefined,
            product_id: item?.product_schema._id,
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
            image: item.diamond_schema?.shape ?? '',
            price: item.diamond_schema?.price,
            quantity: item.qty || item.quantity || item.stock_qty || 1,
            diamond_id: item.diamond_schema?._id,
          };
        }
        return [];
      });
    setCartAbandonedProducts(products as any);
  }, [_cartItems, getDiamondTitle]);

  const diamondUrl = (intensity: string) =>
    !intensity ? paths.whiteDiamondInventory.root : paths.colorDiamondInventory.root;

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

  const allCustom = _cartItems?.every(
    (e: { product_schema: { product_type: string } }) =>
      e?.product_schema?.product_type === 'custom'
  );

  const shippingCost = useMemo(() => (allCustom ? 0 : shipping_cost), [shipping_cost, allCustom]);

  const removeItem = async (index: number | any, title: string, id: string) => {
    try {
      // setCouponName('');
      // setCouponLocal(0);
      if (!auth && status === 'unauthenticated') {
        const newCartItems = _cartItems.filter((_: any, idx: number) => idx !== index);
        setClientCartItems(newCartItems);
        setLocalCardItems(newCartItems);
        setLocalCardLength(newCartItems.length);
        // setRemoveItemMessage(title);
        // setTimeout(() => {
        //   setRemoveItemMessage('');
        // }, 1500);
        return;
      }
      const { status: SS } = await cartApi.remove(id);
      if (SS === 200) {
        const newCartItems = _cartItems.filter((_: any, idx: number) => idx !== index);
        setClientCartItems(newCartItems);
        setLocalCardLength(newCartItems.length);
        // setRemoveItemMessage(title);
        // setTimeout(() => {
        //   setRemoveItemMessage('');
        // }, 1500);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };

  const rebuildRing = async (index: number | any, id: string) => {
    const item = _cartItems[index];
    // setCouponName('');
    // setCouponLocal(0);
    setRingDiamond({
      diamond: item.diamond_schema,
      diamond_type: item.diamond_schema.intensity ? 'color' : 'white',
    });
    setRingSetting({
      product: item.product_schema,
      variant: item.variation_schema,
    });
    setRingSize({
      size: item.ring_size,
    });

    push(`${paths.ringPreview.details(item?.product_schema?._id)}`);
    setLocalCardLength(_cartItems.length - 1);
    try {
      if (!auth && status === 'unauthenticated') {
        const newCartItems = _cartItems.filter((_: any, idx: number) => idx !== index);
        setClientCartItems(newCartItems);
        setLocalCardItems(newCartItems);
        setLocalCardLength(newCartItems.length);
        setTimeout(() => {
          setRemoveItemMessage('');
        }, 1500);
        return;
      }
      if (auth && status === 'authenticated') {
        await cartApi.remove(item._id as any);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
    setRebuildLoader(false);
  };

  const debouncedUpdate = debounce((itemId: string, quantity: ICartUpdateRequest) => {
    try {
      cartApi.update(itemId, quantity);
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  }, 1500);

  const updateQty = (index: number | any, val: string) => {
    const value = Number(val);

    if (value < 1 || value > 300) return;

    const newCartItems = _cartItems.map((item: { _id: any }, i: number) => {
      if (i === index) {
        if (auth && status === 'authenticated') {
          debouncedUpdate(item._id as any, { quantity: value });
        }
        return {
          ...item,
          quantity: Number(val),
        };
      }
      return item;
    });

    // setCouponName('');
    // setCouponLocal(0);

    if (auth && status === 'authenticated') {
      setClientCartItems(newCartItems);
    } else {
      setLocalCardItems(newCartItems);
    }
  };

  const cartValidationLocalUpdate = (updatedCartValidateArr: any[]) => {
    if (!auth?.user) {
      setLocalCardItems((prev: any) =>
        prev.map((item: any) => {
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
                data.sku === (item?.product_schema?.sku || item?.product_schema?.parent_sku)
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

  const handleSecureCheckout = async () => {
    setCartItemError('');
    setSecureCheckoutLoader(true);
    const stockValidatePayload = _cartItems
      .map(
        (item: {
          quantity: any;
          product_schema: {
            _id: any;
          };
          variation_schema: {
            _id: any;
          };
          diamond_schema: { _id: any };
        }) => {
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
        }
      )
      .filter((item: undefined) => item !== undefined);

    const couponValidate = _cartItems
      .map(
        (item: {
          quantity: any;
          product_schema: { _id: any };
          variation_schema: { _id: any };
          diamond_schema: { _id: any };
        }) => {
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
        }
      )
      .filter((item: undefined) => item !== undefined);

    const coupon_payload = {
      product_ids: couponValidate,
      shipping_cost: 35,
      coupon_code: couponName,
    };

    try {
      if (couponName) {
        const CouponData = await couponApi.apply(coupon_payload as any);
        _setShipping_cost(Number(CouponData.data.data.shipping_cost));
        setShipping_cost(Number(CouponData.data.data.shipping_cost));
        setCouponLocal(Number(CouponData.data.data.discount));

        const { status: SSS, data: cartValidatedData } = await orderApi.validateStock('validate', {
          product_ids: stockValidatePayload,
        } as IOrderValidateStockRequest);
        const payload: any = {
          cart_amount: totalPrice,
          products: cartAbandonedProducts,
          shipping: String(shippingCost),
          coupon_name: String(couponName),
          discount: String(couponLocal),
          other: '0',
        };
        if (auth && status === 'authenticated') {
          await cartAbandonedApi.create(payload);
        }
        setSecureCheckoutLoader(false);
        if (SSS === 200) {
          await cartValidationLocalUpdate(cartValidatedData?.data);
          push(paths.checkout.root);
        }
      } else {
        const { status: SSS, data: cartValidatedData } = await orderApi.validateStock('validate', {
          product_ids: stockValidatePayload,
        } as IOrderValidateStockRequest);
        const payload: any = {
          cart_amount: totalPrice,
          products: cartAbandonedProducts,
          shipping: String(shippingCost),
          coupon_name: String(couponName),
          discount: String(couponLocal),
          other: '0',
        };
        if (auth && status === 'authenticated') {
          await cartAbandonedApi.create(payload);
        }
        setSecureCheckoutLoader(false);
        if (SSS === 200) {
          await cartValidationLocalUpdate(cartValidatedData?.data);
          push(paths.checkout.root);
        }
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      if (error?.response?.data?.message === 'Validated stock data.') {
        await cartValidationLocalUpdate(error?.response?.data?.data);
      } else if (
        error?.response?.data?.message?.toLowerCase()?.includes('promo') ||
        error?.response?.data?.message?.toLowerCase()?.includes('coupon')
      ) {
        setCouponLocal(0);
        setCouponName('');
        setApplyCodeShow(true);
        setShipping_cost(50);
        _setShipping_cost(50);
        reset({ coupon_code: '' });
        setCouponError(error?.response?.data?.message || error?.message);
        setSecureCheckoutLoader(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      console.error(error);
      setSecureCheckoutLoader(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      // if (error?.response?.data?.message) {
      //   setSecureCheckoutLoader(false);
      //   setCartItemError(error?.response?.data?.message);
      //   window.scrollTo({
      //     top: 0,
      //     behavior: 'smooth'
      //   });
      // } else {
      //   setSecureCheckoutLoader(false);
      //   setCartItemError(error?.message);
      // window.scrollTo({
      //   top: 0,
      //   behavior: 'smooth'
      // });
      // }
    }
  };

  useEffect(() => {
    if (typeof watch('coupon_code') === 'string' && watch('coupon_code') !== '') {
      setCouponError('');
      setCartItemError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('coupon_code')]);

  if (_cartItemsLoader && auth && status === 'authenticated') {
    return (
      <div className="py_40 min-h-454 ">
        <div className="text-center">
          <Image src={LoadingImage} alt="loader" width={30} height={30} />
        </div>
      </div>
    );
  }

  const changeRingBuilder = (index: number) => {
    const diamondSchema = _cartItems[index]?.diamond_schema;
    const productSchema = _cartItems[index]?.product_schema;
    const variationSchema = _cartItems[index]?.variation_schema;
    if (!diamondSchema || !productSchema) return;

    resetRingBuilder();
    const params = new URLSearchParams();
    params.set('type', 'ring-builder');

    const shape = diamondSchema?.shape || productSchema?.diamond_type?.[0]?.slug || '';
    if (shape) params.set('shape', shape);
    if (productSchema?.isDelete || productSchema?.stock_status === 'out_of_stock') {
      const price = `${productSchema?.sale_price || productSchema?.regular_price},${Number(productSchema?.sale_price || productSchema?.regular_price) + 500}`;
      if (price) params.set('price', price);
      setRingDiamond({
        diamond: diamondSchema,
        diamond_type: diamondSchema.intensity ? 'color' : 'white',
      });
      push(`${paths.buildRing.root}?${params.toString()}`);
    } else if (diamondSchema?.isDelete || !diamondSchema?.stock_status) {
      // const price = `${diamondSchema?.sale_price || diamondSchema?.regular_price}-${Number(diamondSchema?.sale_price || diamondSchema?.regular_price) + 500}`
      // if (price) params.set('price', price);
      setRingSetting({
        product: productSchema,
        variant: variationSchema,
      });
      push(`/engagement-rings/${productSchema?.display_slug}?view=true`);
    }
    // removeItem(index, '', _cartItems[index]._id as any);
    setTimeout(() => {
      setChangeLoader(null);
    }, 5000);
  };

  const changeProduct = (index: number) => {
    const productSchema = _cartItems[index]?.product_schema;
    if (!productSchema) return;
    const params = new URLSearchParams();

    const shape = productSchema?.diamond_type?.[0]?.slug || productSchema?.diamond_type?.slug || '';
    const price = `${productSchema?.sale_price || productSchema?.regular_price},${Number(productSchema?.sale_price || productSchema?.regular_price) + 500}`;

    if (shape) params.set('shape', shape);
    if (price) params.set('price', price);

    if (productSchema?.product_type === 'custom') {
      push(`/custom`);
    } else if (productSchema?.product_type === 'ring_setting') {
      push(paths.buildRing.root);
    } else if (
      ['wedding_ring', 'bracelet', 'earring', 'necklace', 'pendant', 'chain'].includes(
        productSchema?.product_type
      )
    ) {
      push(
        `/${getURLForProduct((productSchema.category_details as any[]) || productSchema?.category, '', category as any[])}?${params.toString()}`
      );
    } else if (productSchema?.category_details) {
      push(
        `/${getURLForProduct((productSchema.category_details as any[]) || productSchema?.category, '', category as any[])}`
      );
    } else {
      push(paths.fineJewelry.root);
    }
    // removeItem(index, '', _cartItems[index]._id as any);
    setTimeout(() => {
      setChangeLoader(null);
    }, 5000);
  };

  const changeDiamond = (index: number) => {
    const diamondSchema = _cartItems[index]?.diamond_schema;
    if (!diamondSchema) return;
    const diamondName = getDiamondTitle(
      diamondSchema,
      diamondSchema?.intensity ? 'color' : 'white',
      true
    )?.props?.children?.[0]?.split(' ');

    const params = new URLSearchParams();

    const shape = diamondName[0]?.toLowerCase();
    const cut = diamondName.includes('Very') ? 'veryGood' : diamondName[2]?.toLowerCase();
    const color = diamondName.includes('Very')
      ? diamondName[7]?.toLowerCase()
      : diamondName[6]?.toLowerCase();
    const colored = diamondName.includes('Very')
      ? diamondName[7]?.toLowerCase()
      : diamondName[6]?.toLowerCase();
    const clarity = diamondName.includes('Very')
      ? diamondName[9]?.toLowerCase()
      : diamondName[8]?.toLowerCase();
    const carat = diamondName.includes('Very')
      ? `${Number(diamondName[5])}-${Number(diamondName[5]) + 5}`
      : `${Number(diamondName[4])}-${Number(diamondName[4]) + 5}`;

    if (shape) params.set('shape', shape);
    if (cut) params.set('cut', cut);
    if (color) params.set('color', color);
    if (colored) params.set('colored', colored);
    if (clarity) params.set('clarity', clarity);
    if (carat) params.set('carat', carat);

    const path = diamondSchema?.intensity
      ? `${paths.colorDiamondInventory.root}?${params.toString()}`
      : `${paths.whiteDiamondInventory.root}?${params.toString()}`;

    router.push(path);
    // removeItem(index, '', _cartItems[index]._id as any);
    setTimeout(() => {
      setChangeLoader(null);
    }, 5000);
  };

  function checkProductStatus(
    product_schema: { isDelete: any; stock_status: string },
    diamond_schema: { isDelete: any; stock_status: any }
  ) {
    if (product_schema && diamond_schema) {
      return (
        product_schema?.isDelete ||
        diamond_schema?.isDelete ||
        !diamond_schema?.stock_status ||
        product_schema?.stock_status === 'out_of_stock'
      );
    }
    if (product_schema === null && diamond_schema) {
      return diamond_schema?.isDelete || !diamond_schema?.stock_status;
    }
    if (product_schema && diamond_schema === null) {
      return product_schema?.isDelete || product_schema?.stock_status === 'out_of_stock';
    }
    return false;
  }

  const cartRemoveEngraving = async (index: number, product_schema: any, variation_schema: any) => {
    if (checkProductStatus(product_schema, variation_schema)) return;
    const updatedArr = _cartItems.map((item: any, i: number) => {
      if (i === index) {
        return {
          ...item,
          engraving_details: {
            text: '',
            font: '',
          },
        };
      }
      return item;
    });
    if (!auth && status === 'unauthenticated') {
      setClientCartItems(updatedArr);
    } else {
      const id = _cartItems[index]._id;
      await cartApi
        .updateEngraving(id, { text: '', font: '' })
        .then((res) => {
          if (res.data.isSuccess) {
            setClientCartItems(updatedArr);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <>
      <Head>
        <title>
          {cartItemSKU.length > 0
            ? cartItemSKU.join(', ')
            : 'Your Shopping Cart | Wholesale Loose Grown Diamond'}
        </title>
        <meta
          name="description"
          content="Review and manage your selected wholesale loose ground diamonds, jewelry. Adjust quantities and proceed to checkout with ease."
        />
      </Head>
      <div className="min-h-454">
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
        <div className="py_30">
          <div className="banner_section">
            <div className="container-fluid">
              <div className="row">
                {removeItemMessage && (
                  <div className="p-3 p-md-4">
                    <div
                      className="alert alert-success  d-flex align-items-center"
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
                      <div className="fs-14 text-capitalize"> {removeItemMessage}</div>
                    </div>
                  </div>
                )}
                {cartItemError && (
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
                    <div style={{ lineHeight: '1.2', fontSize: '14px' }}>{cartItemError}</div>
                  </div>
                )}
                <div className={_cartItems.length === 0 ? 'col-lg-12' : 'col-lg-8'}>
                  <div>
                    {_cartItems.length !== 0 && <h3 className="fw-600 mb-2 mb-md-4">Bag</h3>}

                    {_cartItems.length === 0 && (
                      <div className="thankyou-my-65">
                        <div className="text-center">
                          <h1 className="thank-you-title">Your bag is currently empty</h1>
                          <p className="thank-you-email-line">
                            you have not added any items in your shopping bag
                          </p>
                          <Link href={paths.whiteDiamondInventory.root} className="common_btn">
                            RETURN TO SHOP
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="d-none d-lg-block">
                      {_cartItems.map(
                        (
                          {
                            engraving_details,
                            diamond_schema,
                            product_schema,
                            back_setting,
                            bracelet_size,
                            ring_size,
                            variation_schema,
                            quantity,
                            _id,
                          }: any,
                          idx: Key | null | undefined
                        ) => (
                          <div
                            key={idx}
                            className={clsx(
                              'cart_item cart_item1 w-100 d-flex flex-column gap-3',
                              checkProductStatus(product_schema, diamond_schema) && 'disabled'
                            )}
                          >
                            {/* Product */}
                            {product_schema && (
                              <div className="d-flex flex-md-row flex-column">
                                <div className="product_name">
                                  <div
                                    className={clsx('text-center', {
                                      'opacity-box':
                                        product_schema?.isDelete ||
                                        diamond_schema?.isDelete ||
                                        !diamond_schema?.stock_status ||
                                        product_schema?.stock_status === 'out_of_stock',
                                    })}
                                  >
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
                                  <div className={clsx('setting_pttl')}>
                                    <Link
                                      onClick={(e) => {
                                        if (
                                          product_schema?.isDelete ||
                                          product_schema?.stock_status === 'out_of_stock'
                                        ) {
                                          e.preventDefault(); // stop navigation
                                        }
                                      }}
                                      href={
                                        product_schema?.isDelete ||
                                        product_schema?.stock_status === 'out_of_stock'
                                          ? '#'
                                          : getURLForProduct(
                                              (product_schema.category_details as any[]) ||
                                                (product_schema?.category as any[]),
                                              product_schema.display_slug as string,
                                              category as any[]
                                            )
                                      }
                                      className={clsx('d-block', {
                                        'opacity-box':
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock',
                                      })}
                                    >
                                      {product_schema.name}
                                    </Link>
                                    {product_schema.product_type === 'custom' && (
                                      <div
                                        className={clsx('', {
                                          'opacity-box':
                                            product_schema?.isDelete ||
                                            product_schema?.stock_status === 'out_of_stock',
                                        })}
                                      >
                                        <HtmlContent
                                          html={
                                            (product_schema?.long_description as string) ||
                                            (product_schema?.short_description as string)
                                          }
                                        />
                                      </div>
                                    )}
                                    <ul
                                      className={clsx('mb-0', {
                                        'opacity-box':
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock',
                                      })}
                                      style={{ listStyleType: 'none' }}
                                    >
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
                                            {variation_schema?.name.length > 1 && (
                                              <>
                                                <b className="text_black_secondary ">
                                                  Carat Weight:{' '}
                                                </b>
                                                {variation_schema?.name.length > 1 &&
                                                ['14k', '18k', 'platinum'].some((keyword) =>
                                                  variation_schema?.name[1].value?.includes(keyword)
                                                ) ? (
                                                  <span className="text-capitalize">
                                                    {variation_schema?.name[0]?.value?.replace(
                                                      /[-_]/g,
                                                      '.'
                                                    )}
                                                  </span>
                                                ) : (
                                                  <span className="text-capitalize">
                                                    {variation_schema?.name[1]?.value?.replace(
                                                      /[-_]/g,
                                                      '.'
                                                    )}
                                                  </span>
                                                )}
                                              </>
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
                                                className="text-decoration-underline cursor-pointer"
                                                style={{ fontFamily: engraving_details?.font }}
                                              >
                                                <AddEngravingModal
                                                  currentFont={engraving_details?.font}
                                                  currentText={engraving_details?.text}
                                                  _cartItems={_cartItems}
                                                  setClientCartItems={setClientCartItems}
                                                  setLocalCardItems={setLocalCardItems}
                                                  idx={idx as number}
                                                  disabled={checkProductStatus(
                                                    product_schema,
                                                    diamond_schema
                                                  )}
                                                />
                                              </span>
                                              <span
                                                className="ms-2 cursor-pointer text-blue-400"
                                                onClick={() =>
                                                  cartRemoveEngraving(
                                                    idx as number,
                                                    product_schema,
                                                    variation_schema
                                                  )
                                                }
                                              >
                                                X
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
                                    {!engraving_details?.text?.length &&
                                      [
                                        'wedding_ring',
                                        'ring_setting',
                                        'bracelet',
                                        'necklace',
                                        'earring',
                                        'pendant',
                                      ].includes(product_schema?.product_type) && (
                                        <AddEngravingModal
                                          _cartItems={_cartItems}
                                          setClientCartItems={setClientCartItems}
                                          setLocalCardItems={setLocalCardItems}
                                          idx={idx as number}
                                          disabled={checkProductStatus(
                                            product_schema,
                                            diamond_schema
                                          )}
                                        />
                                      )}
                                    {!variation_schema &&
                                    product_schema.stock_status === 'out_of_stock' ? (
                                      <p className="m-0 p-0" style={{ color: 'red' }}>
                                        Item is out of stock.
                                      </p>
                                    ) : (
                                      variation_schema &&
                                      variation_schema.stock_status === 'out_of_stock' && (
                                        <p className=" m-0" style={{ color: 'red' }}>
                                          Item is out of stock.
                                        </p>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div className="product_quantity_total">
                                  {product_schema?.product_type &&
                                  [
                                    'wedding_ring',
                                    'bracelet',
                                    'earring',
                                    'necklace',
                                    'pendant',
                                    'chain',
                                    'diamond',
                                  ].includes(product_schema?.product_type) &&
                                  (window.localStorage.getItem('cart')
                                    ? !(product_schema as any)?.category?.every((c: any) =>
                                        (c.slug?.toString() || '').includes('ready')
                                      )
                                    : !(product_schema as any)?.category_details?.every((c: any) =>
                                        (c.slug?.toString() || '').includes('ready')
                                      )) ? (
                                    <input
                                      type="number"
                                      min="1"
                                      max="300"
                                      disabled={checkProductStatus(product_schema, diamond_schema)}
                                      className={clsx(
                                        'product_quantity_increment px-2 fw-500 mb-0 ',
                                        {
                                          'opacity-box':
                                            product_schema?.isDelete ||
                                            diamond_schema?.isDelete ||
                                            !diamond_schema?.stock_status ||
                                            product_schema?.stock_status === 'out_of_stock',
                                        }
                                      )}
                                      value={quantity}
                                      onFocus={(e) => e.target.select()}
                                      onChange={(e) => updateQty(idx, e.target.value)}
                                    />
                                  ) : (
                                    <p className="product_quantity px-0 px-md-4 fw-500 mb-0">
                                      1 qty.
                                    </p>
                                  )}
                                  <div className="d-flex flex-column align-items-end text-end">
                                    <p
                                      className={clsx('fw-500 mb-1 ', {
                                        'opacity-box':
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock',
                                      })}
                                    >
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
                                      <del
                                        className={clsx('', {
                                          'opacity-box':
                                            product_schema?.isDelete ||
                                            diamond_schema?.isDelete ||
                                            !diamond_schema?.stock_status ||
                                            product_schema?.stock_status === 'out_of_stock',
                                        })}
                                      >
                                        was $
                                        {(
                                          Number(
                                            variation_schema?.regular_price ??
                                              product_schema.regular_price
                                          ) *
                                          (diamond_schema && (variation_schema || product_schema)
                                            ? 1
                                            : quantity ?? 1)
                                        ).toLocaleString('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </del>
                                    )}
                                    {product_schema && diamond_schema ? (
                                      <button
                                        type="button"
                                        className={clsx('d-inline mt-2 mt-md-3 fw-700', {})}
                                        onClick={() => {
                                          resetRingBuilder();
                                          removeItem(idx, product_schema.name, _id);
                                        }}
                                      >
                                        Remove
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className={clsx('d-inline mt-2 mt-md-3 fw-700', {})}
                                        onClick={() => {
                                          removeItem(idx, product_schema.name, _id);
                                        }}
                                      >
                                        Remove
                                      </button>
                                    )}
                                    {product_schema && diamond_schema && (
                                      <button
                                        type="button"
                                        className={clsx('d-block mt-2 mt-md-3 fw-700 btn-dark', {
                                          'opacity-box':
                                            product_schema?.isDelete ||
                                            diamond_schema?.isDelete ||
                                            !diamond_schema?.stock_status ||
                                            product_schema?.stock_status === 'out_of_stock',
                                        })}
                                        style={{ width: '90px' }}
                                        disabled={
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock'
                                        }
                                        onClick={() => {
                                          rebuildRing(idx, _id);
                                          setRebuildLoader(true);
                                        }}
                                      >
                                        {rebuildLoader ? (
                                          <div
                                            className="spinner-border inventory_loader"
                                            role="status"
                                            style={{
                                              fontSize: '12px',
                                              height: '15px',
                                              width: '15px',
                                            }}
                                          >
                                            <span className="visually-hidden ">Loading...</span>
                                          </div>
                                        ) : (
                                          ' Rebuild Ring'
                                        )}
                                      </button>
                                    )}
                                    {checkProductStatus(product_schema, diamond_schema) &&
                                    product_schema &&
                                    !diamond_schema ? (
                                      <button
                                        type="button"
                                        className="d-block mt-2 mt-md-3 fw-700 btn-dark change-btn"
                                        style={{ width: '70px' }}
                                        onClick={() => {
                                          changeProduct(idx as number);
                                          setChangeLoader(idx as number);
                                        }}
                                      >
                                        {changeLoader === idx ? (
                                          <div
                                            className="spinner-border inventory_loader"
                                            role="status"
                                            style={{
                                              fontSize: '12px',
                                              height: '15px',
                                              width: '15px',
                                            }}
                                          >
                                            <span className="visually-hidden ">Loading...</span>
                                          </div>
                                        ) : (
                                          'Change'
                                        )}
                                      </button>
                                    ) : (
                                      checkProductStatus(product_schema, diamond_schema) &&
                                      product_schema &&
                                      diamond_schema && (
                                        <button
                                          type="button"
                                          className="d-block mt-2 mt-md-3 fw-700 btn-dark change-btn"
                                          style={{ width: '70px' }}
                                          onClick={() => {
                                            changeRingBuilder(idx as number);
                                            setChangeLoader(idx as number);
                                          }}
                                        >
                                          {changeLoader === idx ? (
                                            <div
                                              className="spinner-border inventory_loader"
                                              role="status"
                                              style={{
                                                fontSize: '12px',
                                                height: '15px',
                                                width: '15px',
                                              }}
                                            >
                                              <span className="visually-hidden ">Loading...</span>
                                            </div>
                                          ) : (
                                            'Change'
                                          )}
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* diamond */}
                            {diamond_schema && (
                              <div className="d-flex flex-md-row flex-column">
                                <div className="product_name">
                                  <div
                                    className={clsx('text-center', {
                                      'opacity-box':
                                        product_schema?.isDelete ||
                                        diamond_schema?.isDelete ||
                                        !diamond_schema?.stock_status ||
                                        product_schema?.stock_status === 'out_of_stock',
                                    })}
                                  >
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
                                    <p className="ls_img_instruction mb-0 mx-md-0 mx-auto">
                                      Sample Image Only
                                    </p>
                                  </div>
                                  <div className="setting_pttl">
                                    <Link
                                      onClick={(e) => {
                                        if (
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock'
                                        ) {
                                          e.preventDefault(); // stop navigation
                                        }
                                      }}
                                      href={
                                        diamond_schema?.isDelete || !diamond_schema?.stock_status
                                          ? '#'
                                          : product_schema && diamond_schema
                                            ? `${diamondUrl(diamond_schema.intensity) || ''}?type=ring-builder&shape=${diamond_schema.shape}&sku=${diamond_schema.sku}`
                                            : `${diamondUrl(diamond_schema.intensity) || ''}?sku=${diamond_schema.sku}`
                                      }
                                      className={clsx('text-capitalize', {
                                        'opacity-box':
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock',
                                      })}
                                    >
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
                                    </Link>
                                    {(!diamond_schema?.stock_status ||
                                      diamond_schema?.isDelete) && (
                                      <p className=" m-0" style={{ color: 'red' }}>
                                        Item is out of stock.
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="product_quantity_total ">
                                  <p className="product_quantity px-0 px-md-4 fw-500 mb-0">
                                    1 qty.
                                  </p>
                                  <div className="d-flex flex-column align-items-end text-end">
                                    <p
                                      className={clsx('fw-500 mb-1', {
                                        'opacity-box':
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock',
                                      })}
                                    >
                                      $
                                      {Number(diamond_schema.price).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </p>
                                    <del
                                      className={clsx('', {
                                        'opacity-box':
                                          product_schema?.isDelete ||
                                          diamond_schema?.isDelete ||
                                          !diamond_schema?.stock_status ||
                                          product_schema?.stock_status === 'out_of_stock',
                                      })}
                                    >
                                      was $
                                      {Number(diamond_schema.regular_price).toLocaleString(
                                        'en-US',
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                      )}
                                    </del>
                                    {diamond_schema && !product_schema && (
                                      <button
                                        type="button"
                                        className="d-block mt-3 fw-700"
                                        onClick={() =>
                                          removeItem(
                                            idx,
                                            `${diamond_schema.shape} Cut ${diamond_schema.carat} Carat ${diamond_schema.color} Color ${diamond_schema.clarity} Clarity Lab Grown Diamond - ${diamond_schema?.sku}`,
                                            _id
                                          )
                                        }
                                      >
                                        Remove
                                      </button>
                                    )}
                                    {checkProductStatus(product_schema, diamond_schema) &&
                                      !product_schema &&
                                      diamond_schema && (
                                        <button
                                          type="button"
                                          className="d-block mt-2 mt-md-3 fw-700 btn-dark change-btn"
                                          style={{ width: '70px' }}
                                          onClick={() => {
                                            changeDiamond(idx as number);
                                            setChangeLoader(idx as number);
                                          }}
                                        >
                                          {changeLoader === idx ? (
                                            <div
                                              className="spinner-border inventory_loader"
                                              role="status"
                                              style={{
                                                fontSize: '12px',
                                                height: '15px',
                                                width: '15px',
                                              }}
                                            >
                                              <span className="visually-hidden ">Loading...</span>
                                            </div>
                                          ) : (
                                            'Change'
                                          )}
                                        </button>
                                      )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {_cartItems.length !== 0 && (
                  <div className="col-lg-4">
                    <div className="cart_collaterals_sticky">
                      <div className="cart_collaterals">
                        <h6 className="fw-600 mb_30">Order Summary</h6>
                        <div className="d-lg-none">
                          {_cartItems.map(
                            (
                              {
                                engraving_details,
                                diamond_schema,
                                product_schema,
                                back_setting,
                                bracelet_size,
                                ring_size,
                                variation_schema,
                                quantity,
                                _id,
                              }: any,
                              idx: Key | null | undefined
                            ) => (
                              <div
                                key={idx}
                                className={clsx(
                                  'cart_item cart_item1 w-100 d-flex flex-column gap-4 px-0 pt-0 border-top-0 border-start-0 border-end-0',
                                  checkProductStatus(product_schema, diamond_schema) && 'disabled'
                                )}
                              >
                                {/* Product */}
                                {product_schema && (
                                  <div
                                    className={
                                      product_schema && diamond_schema
                                        ? 'cart-ring d-flex flex-md-row flex-column'
                                        : 'cart-product d-flex flex-md-row flex-column'
                                    }
                                  >
                                    {product_schema && diamond_schema && (
                                      <div className="d-flex d-md-none flex-column mb-4">
                                        {product_schema && diamond_schema ? (
                                          <button
                                            type="button"
                                            className="d-inline mt-2 fw-700"
                                            onClick={() => {
                                              resetRingBuilder();
                                              removeItem(idx, product_schema.name, _id);
                                            }}
                                          >
                                            Remove
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            className="d-inline text-end mt-2 fw-700"
                                            onClick={() => {
                                              removeItem(idx, product_schema.name, _id);
                                            }}
                                          >
                                            Remove
                                          </button>
                                        )}
                                        {product_schema && diamond_schema && (
                                          <button
                                            type="button"
                                            className={clsx(
                                              'd-block mx-auto mt-2 fw-700 btn-dark',
                                              {
                                                'opacity-box':
                                                  product_schema?.isDelete ||
                                                  diamond_schema?.isDelete ||
                                                  !diamond_schema?.stock_status ||
                                                  product_schema?.stock_status === 'out_of_stock',
                                              }
                                            )}
                                            style={{ width: '90px' }}
                                            disabled={
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock'
                                            }
                                            onClick={() => {
                                              rebuildRing(idx, _id);
                                              setRebuildLoader(true);
                                            }}
                                          >
                                            {rebuildLoader ? (
                                              <div
                                                className="spinner-border inventory_loader"
                                                role="status"
                                                style={{
                                                  fontSize: '12px',
                                                  height: '15px',
                                                  width: '15px',
                                                }}
                                              >
                                                <span className="visually-hidden ">Loading...</span>
                                              </div>
                                            ) : (
                                              ' Rebuild Ring'
                                            )}
                                          </button>
                                        )}
                                        {checkProductStatus(product_schema, diamond_schema) &&
                                          product_schema &&
                                          diamond_schema && (
                                            <button
                                              type="button"
                                              className="d-block mx-auto mt-2 mt-md-3 fw-700 btn-dark change-btn"
                                              style={{ width: '70px' }}
                                              onClick={() => {
                                                changeRingBuilder(idx as number);
                                                setChangeLoader(idx as number);
                                              }}
                                            >
                                              {changeLoader === idx ? (
                                                <div
                                                  className="spinner-border inventory_loader"
                                                  role="status"
                                                  style={{
                                                    fontSize: '12px',
                                                    height: '15px',
                                                    width: '15px',
                                                  }}
                                                >
                                                  <span className="visually-hidden ">
                                                    Loading...
                                                  </span>
                                                </div>
                                              ) : (
                                                'Change'
                                              )}
                                            </button>
                                          )}
                                        {!engraving_details?.text?.length &&
                                          [
                                            'wedding_ring',
                                            'ring_setting',
                                            'bracelet',
                                            'necklace',
                                            'earring',
                                            'pendant',
                                          ].includes(product_schema?.product_type) && (
                                            <div className="d-flex justify-content-center align-items-center">
                                              <AddEngravingModal
                                                _cartItems={_cartItems}
                                                setLocalCardItems={setLocalCardItems}
                                                setClientCartItems={setClientCartItems}
                                                idx={idx as number}
                                                disabled={checkProductStatus(
                                                  product_schema,
                                                  diamond_schema
                                                )}
                                              />
                                            </div>
                                          )}
                                      </div>
                                    )}
                                    <div className="product_name">
                                      <div
                                        className={clsx('text-center', {
                                          'opacity-box':
                                            product_schema?.isDelete ||
                                            diamond_schema?.isDelete ||
                                            !diamond_schema?.stock_status ||
                                            product_schema?.stock_status === 'out_of_stock',
                                        })}
                                      >
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
                                      <div className="setting_pttl">
                                        <Link
                                          onClick={(e) => {
                                            if (
                                              product_schema?.isDelete ||
                                              product_schema?.stock_status === 'out_of_stock'
                                            ) {
                                              e.preventDefault(); // stop navigation
                                            }
                                          }}
                                          href={
                                            product_schema?.isDelete ||
                                            product_schema?.stock_status === 'out_of_stock'
                                              ? '#'
                                              : getURLForProduct(
                                                  (product_schema.category_details as any[]) ||
                                                    (product_schema?.category as any[]),
                                                  product_schema.display_slug as string,
                                                  category as any[]
                                                )
                                          }
                                          className={clsx('d-block text-start', {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          })}
                                        >
                                          {product_schema.name}
                                        </Link>
                                        {product_schema.product_type === 'custom' && (
                                          <div
                                            className={clsx('', {
                                              'opacity-box':
                                                product_schema?.isDelete ||
                                                product_schema?.stock_status === 'out_of_stock',
                                            })}
                                          >
                                            <HtmlContent
                                              html={
                                                (product_schema?.long_description as string) ||
                                                (product_schema?.short_description as string)
                                              }
                                            />
                                          </div>
                                        )}
                                        <ul
                                          style={{ listStyleType: 'none' }}
                                          className={clsx('mb-0', {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          })}
                                        >
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
                                                {variation_schema?.name.length > 1 && (
                                                  <>
                                                    <b className="text_black_secondary ">
                                                      Carat Weight:{' '}
                                                    </b>
                                                    {variation_schema?.name.length > 1 &&
                                                    ['14k', '18k', 'platinum'].some((keyword) =>
                                                      variation_schema?.name[1].value?.includes(
                                                        keyword
                                                      )
                                                    ) ? (
                                                      <span className="text-capitalize">
                                                        {variation_schema?.name[0]?.value?.replace(
                                                          /[-_]/g,
                                                          '.'
                                                        )}
                                                      </span>
                                                    ) : (
                                                      <span className="text-capitalize">
                                                        {variation_schema?.name[1]?.value?.replace(
                                                          /[-_]/g,
                                                          '.'
                                                        )}
                                                      </span>
                                                    )}
                                                  </>
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
                                                  <b className="text_black_secondary ">
                                                    Ring Size:{' '}
                                                  </b>
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
                                                    className="text-decoration-underline cursor-pointer"
                                                    style={{ fontFamily: engraving_details?.font }}
                                                  >
                                                    <AddEngravingModal
                                                      currentFont={engraving_details?.font}
                                                      currentText={engraving_details?.text}
                                                      _cartItems={_cartItems}
                                                      setLocalCardItems={setLocalCardItems}
                                                      setClientCartItems={setClientCartItems}
                                                      idx={idx as number}
                                                      disabled={checkProductStatus(
                                                        product_schema,
                                                        diamond_schema
                                                      )}
                                                    />
                                                  </span>
                                                  <span
                                                    className="ms-2 cursor-pointer text-blue-400"
                                                    onClick={() =>
                                                      cartRemoveEngraving(
                                                        idx as number,
                                                        product_schema,
                                                        variation_schema
                                                      )
                                                    }
                                                  >
                                                    X
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
                                          {(!variation_schema || product_schema?.isDelete) &&
                                          product_schema.stock_status === 'out_of_stock' ? (
                                            <p className="m-0 p-0" style={{ color: 'red' }}>
                                              Item is out of stock.
                                            </p>
                                          ) : (
                                            (variation_schema || product_schema?.isDelete) &&
                                            variation_schema.stock_status === 'out_of_stock' && (
                                              <p className=" m-0" style={{ color: 'red' }}>
                                                Item is out of stock.
                                              </p>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="product_quantity_total mt-2">
                                      {product_schema?.product_type &&
                                      [
                                        'wedding_ring',
                                        'bracelet',
                                        'earring',
                                        'necklace',
                                        'pendant',
                                        'chain',
                                        'diamond',
                                      ].includes(product_schema?.product_type) ? (
                                        <input
                                          type="number"
                                          min="1"
                                          max="300"
                                          disabled={checkProductStatus(
                                            product_schema,
                                            diamond_schema
                                          )}
                                          className={clsx(
                                            'product_quantity_increment px-2 fw-500 mb-0 ',
                                            {
                                              'opacity-box':
                                                product_schema?.isDelete ||
                                                diamond_schema?.isDelete ||
                                                !diamond_schema?.stock_status ||
                                                product_schema?.stock_status === 'out_of_stock',
                                            }
                                          )}
                                          value={quantity}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) => updateQty(idx, e.target.value)}
                                        />
                                      ) : (
                                        <p
                                          className={clsx(
                                            'product_quantity px-0 px-md-4 fw-500 mb-0 ',
                                            {
                                              'opacity-box':
                                                product_schema?.isDelete ||
                                                diamond_schema?.isDelete ||
                                                !diamond_schema?.stock_status ||
                                                product_schema?.stock_status === 'out_of_stock',
                                            }
                                          )}
                                        >
                                          1 qty.
                                        </p>
                                      )}
                                      <div className="d-block text-end">
                                        <p
                                          className={clsx('fw-500 mb-1 ', {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          })}
                                        >
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
                                          <del
                                            className={clsx('', {
                                              'opacity-box':
                                                product_schema?.isDelete ||
                                                diamond_schema?.isDelete ||
                                                !diamond_schema?.stock_status ||
                                                product_schema?.stock_status === 'out_of_stock',
                                            })}
                                          >
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

                                        <div className="d-flex flex-column remove-btns">
                                          {product_schema && diamond_schema ? (
                                            <button
                                              type="button"
                                              className="d-inline text-end mt-2 fw-700"
                                              onClick={() => {
                                                resetRingBuilder();
                                                removeItem(idx, product_schema.name, _id);
                                              }}
                                            >
                                              Remove
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              className="d-inline text-end mt-2 fw-700"
                                              onClick={() => {
                                                removeItem(idx, product_schema.name, _id);
                                              }}
                                            >
                                              Remove
                                            </button>
                                          )}
                                          {product_schema && diamond_schema && (
                                            <button
                                              type="button"
                                              className={clsx(
                                                'd-block mx-auto mt-2 fw-700 btn-dark',
                                                {
                                                  'opacity-box':
                                                    product_schema?.isDelete ||
                                                    diamond_schema?.isDelete ||
                                                    !diamond_schema?.stock_status ||
                                                    product_schema?.stock_status === 'out_of_stock',
                                                }
                                              )}
                                              style={{ width: '90px' }}
                                              disabled={
                                                product_schema?.isDelete ||
                                                diamond_schema?.isDelete ||
                                                !diamond_schema?.stock_status ||
                                                product_schema?.stock_status === 'out_of_stock'
                                              }
                                              onClick={() => {
                                                rebuildRing(idx, _id);
                                                setRebuildLoader(true);
                                              }}
                                            >
                                              {rebuildLoader ? (
                                                <div
                                                  className="spinner-border inventory_loader"
                                                  role="status"
                                                  style={{
                                                    fontSize: '12px',
                                                    height: '15px',
                                                    width: '15px',
                                                  }}
                                                >
                                                  <span className="visually-hidden ">
                                                    Loading...
                                                  </span>
                                                </div>
                                              ) : (
                                                ' Rebuild Ring'
                                              )}
                                            </button>
                                          )}
                                          {checkProductStatus(product_schema, diamond_schema) &&
                                            product_schema &&
                                            !diamond_schema && (
                                              <button
                                                type="button"
                                                className="d-block mx-auto mt-2 mt-md-3 fw-700 btn-dark change-btn"
                                                style={{ width: '70px' }}
                                                onClick={() => {
                                                  changeProduct(idx as number);
                                                  setChangeLoader(idx as number);
                                                }}
                                              >
                                                {changeLoader === idx ? (
                                                  <div
                                                    className="spinner-border inventory_loader"
                                                    role="status"
                                                    style={{
                                                      fontSize: '12px',
                                                      height: '15px',
                                                      width: '15px',
                                                    }}
                                                  >
                                                    <span className="visually-hidden ">
                                                      Loading...
                                                    </span>
                                                  </div>
                                                ) : (
                                                  'Change'
                                                )}
                                              </button>
                                            )}
                                          {!engraving_details?.text?.length &&
                                            [
                                              'wedding_ring',
                                              'ring_setting',
                                              'bracelet',
                                              'necklace',
                                              'earring',
                                            ].includes(product_schema?.product_type) && (
                                              <div className="d-flex justify-content-center align-items-center">
                                                <AddEngravingModal
                                                  _cartItems={_cartItems}
                                                  setLocalCardItems={setLocalCardItems}
                                                  setClientCartItems={setClientCartItems}
                                                  idx={idx as number}
                                                  disabled={checkProductStatus(
                                                    product_schema,
                                                    diamond_schema
                                                  )}
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* diamond */}
                                {diamond_schema && (
                                  <div className="d-flex flex-md-row flex-column">
                                    <div className="product_name">
                                      <div
                                        className={clsx('text-center', {
                                          'opacity-box':
                                            product_schema?.isDelete ||
                                            diamond_schema?.isDelete ||
                                            !diamond_schema?.stock_status ||
                                            product_schema?.stock_status === 'out_of_stock',
                                        })}
                                      >
                                        {diamond_schema && (
                                          <Image
                                            src={
                                              diamond_schema
                                                ? findDiamodImg(
                                                    diamond_schema,
                                                    diamond_schema?.shape
                                                  )
                                                : variation_schema?.image ??
                                                  variation_schema?.gallery_img?.[0] ??
                                                  product_schema?.images?.[0]
                                            }
                                            alt="loosegrowndiamond_logo"
                                            width={50}
                                            height={50}
                                          />
                                        )}
                                        <p className="ls_img_instruction mb-0 mx-md-0 mx-auto">
                                          Sample Image Only
                                        </p>
                                      </div>
                                      <div className="setting_pttl">
                                        <Link
                                          onClick={(e) => {
                                            if (
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock'
                                            ) {
                                              e.preventDefault(); // stop navigation
                                            }
                                          }}
                                          href={
                                            diamond_schema?.isDelete ||
                                            !diamond_schema?.stock_status
                                              ? '#'
                                              : `${diamondUrl(diamond_schema.intensity) || ''}?sku=${diamond_schema.sku}`
                                          }
                                          className={clsx('text-capitalize', {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          })}
                                        >
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
                                        </Link>
                                        {(!diamond_schema?.stock_status ||
                                          diamond_schema?.isDelete) && (
                                          <p className=" m-0" style={{ color: 'red' }}>
                                            Item is out of stock.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="product_quantity_total mt-2">
                                      <p
                                        className={clsx(
                                          'product_quantity px-0 px-md-4 fw-500 mb-0 ',
                                          {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          }
                                        )}
                                      >
                                        1 qty.
                                      </p>
                                      <div
                                        className={clsx(
                                          'd-flex flex-column align-items-end text-end',
                                          {}
                                        )}
                                      >
                                        <p
                                          className={clsx('fw-500 mb-1 ', {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          })}
                                        >
                                          $
                                          {Number(diamond_schema.price).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </p>
                                        <del
                                          className={clsx('', {
                                            'opacity-box':
                                              product_schema?.isDelete ||
                                              diamond_schema?.isDelete ||
                                              !diamond_schema?.stock_status ||
                                              product_schema?.stock_status === 'out_of_stock',
                                          })}
                                        >
                                          was $
                                          {Number(diamond_schema.regular_price).toLocaleString(
                                            'en-US',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                          )}
                                        </del>
                                        {diamond_schema && !product_schema && (
                                          <button
                                            type="button"
                                            className="d-block mt-3 fw-700"
                                            onClick={() =>
                                              removeItem(
                                                idx,
                                                `${diamond_schema.shape} Cut ${diamond_schema.carat} Carat ${diamond_schema.color} Color ${diamond_schema.clarity} Clarity Lab Grown Diamond - ${diamond_schema?.sku}`,
                                                _id
                                              )
                                            }
                                          >
                                            Remove
                                          </button>
                                        )}
                                        {checkProductStatus(product_schema, diamond_schema) &&
                                          !product_schema &&
                                          diamond_schema && (
                                            <button
                                              type="button"
                                              className="d-block mt-2 mt-md-3 fw-700 btn-dark change-btn"
                                              style={{ width: '70px' }}
                                              onClick={() => {
                                                changeDiamond(idx as number);
                                                setChangeLoader(idx as number);
                                              }}
                                            >
                                              {changeLoader === idx ? (
                                                <div
                                                  className="spinner-border inventory_loader"
                                                  role="status"
                                                  style={{
                                                    fontSize: '12px',
                                                    height: '15px',
                                                    width: '15px',
                                                  }}
                                                >
                                                  <span className="visually-hidden ">
                                                    Loading...
                                                  </span>
                                                </div>
                                              ) : (
                                                'Change'
                                              )}
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                        <div className="d-flex align-items-center justify-content-between pb_15">
                          <p className="fw-400 text-black mb-0">Subtotal</p>
                          <p className="fw-400 text-black mb-0">
                            $
                            {totalPrice.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pb_15">
                          <p className="fw-400 text-black mb-0">Shipping</p>
                          <p className="fw-400 text-black mb-0 text-uppercase">
                            {shippingCost !== 0 && '$'}
                            {shippingCost === 0
                              ? 'FREE'
                              : shippingCost.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                          </p>
                        </div>

                        {couponLocal > 0 && couponLocal !== 0 ? (
                          <div className="d-flex align-items-center justify-content-between">
                            <p className="fw-400 text-black mb-0">
                              Coupon ({couponName})
                              <i
                                className="fa-solid fa-circle-xmark ms-1"
                                onClick={() => {
                                  setCouponLocal(0);
                                  setCouponName('');
                                  setApplyCodeShow(false);
                                  setShipping_cost(totalPrice > 500 ? 0 : 35);
                                  _setShipping_cost(totalPrice > 500 ? 0 : 35);
                                }}
                              />
                            </p>
                            <p className="fw-400 text-black mb-0 text-uppercase">
                              -$
                              {Number(couponLocal).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        ) : (
                          ''
                        )}
                        {!applyCodeShow && couponLocal === 0 && (
                          <button
                            type="button"
                            className="coupon_form fw-500 mt-2 mb-0"
                            onClick={() => setApplyCodeShow(!applyCodeShow)}
                          >
                            Apply promo code +
                          </button>
                        )}

                        {couponLocal === 0 && applyCodeShow && (
                          <form onSubmit={handleSubmit(onSubmit)}>
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
                            {couponError && (
                              <p className="mb-2" style={{ color: 'red' }}>
                                {couponError}
                              </p>
                            )}
                          </form>
                        )}

                        <div className="border_top mt-4" />
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="fw-700 mb-0 text-uppercase text-black">Total</p>
                          <p className="fw-700 mb-0 text-uppercase text-black">
                            $
                            {Number(totalPrice + shippingCost - couponLocal).toLocaleString(
                              'en-US',
                              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSecureCheckout}
                          className="btn common_black_btn w-100"
                        >
                          {secureCheckoutLoader ? (
                            <div className="spinner-border inventory_loader" role="status">
                              <span className="visually-hidden ">Loading...</span>
                            </div>
                          ) : (
                            'Secure Checkout'
                          )}
                        </button>
                        <div className="font_size_12 fw-500 text-center">
                          {totalPrice > 500
                            ? 'Free Shipping and Free Returns'
                            : `Add $${(500 - totalPrice).toFixed(2)} more to your cart to unlock free shipping!`}
                        </div>
                      </div>
                      <div className="ls_needhelp text-center ">
                        <a href="tel:+1 646-288-0810 " className='text-decoration-none"'>
                          Need help? +1 646-288-0810
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartView;
