/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  ReactPortal,
  ReactElement,
  HTMLAttributes,
  SetStateAction,
  JSXElementConstructor,
} from 'react';

import clsx from 'clsx';
import Swal from 'sweetalert2';
import sanitizeHtml from 'sanitize-html';
import { Carousel } from 'react-responsive-carousel';
import { signOut, useSession } from 'next-auth/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { cartApi } from '@/api/cart';
import { IProduct } from '@/api/product';
import { wishlistApi } from '@/api/wishlist';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useProductContext } from '@/stores/product.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';
import { ICartAttribute, useCartContext } from '@/stores/cart.context';

import ProductCarousel from '@/components/product/ProductCarouselCard';

import { paths } from '@/routes/paths';
import KlarnaImg from '@/assets/image/icon/klarna.svg';
import frame1Img from '@/assets/image/icon/frame_1.svg';
import frame2Img from '@/assets/image/icon/frame_2.svg';
import frame3Img from '@/assets/image/icon/frame_3.svg';
import frame4Img from '@/assets/image/icon/frame_4.svg';
import frame5Img from '@/assets/image/icon/frame_5.svg';
import Img360 from '@/assets/image/360degree/360icon.png';

import TrustPilotReviewSection from '../home/TrustPilotReviewSection';

// ----------------------------------------------------------------------

export type IProductDetailProps = HTMLAttributes<HTMLDivElement> & {
  product: IProduct;
  //
  enableRingBuilder?: boolean;
  enableRingBuilderForDiamondToRing?: boolean;
  enableRingSize?: boolean;
};

const ProductDetail: FC<IProductDetailProps> = (props) => {
  const {
    product,
    className,
    enableRingBuilder,
    enableRingBuilderForDiamondToRing,
    enableRingSize,
    ...other
  } = props;
  const [productDetails, setProductDetails] = useState<IProduct>(product);
  const isHoopsAndDropsCategoryPresent = product?.category?.some(
    (category) => category.slug === 'hoops_and_drops'
  );

  const { push, query } = useRouter();
  const pathname = usePathname();

  const isRingBuilderProps = pathname.startsWith('/ring-preview');
  const ringSizeList = [
    '3.0',
    '3.25',
    '3.5',
    '3.75',
    '4.0',
    '4.25',
    '4.5',
    '4.75',
    '5.0',
    '5.25',
    '5.5',
    '5.75',
    '6.0',
    '6.25',
    '6.5',
    '6.75',
    '7.0',
    '7.25',
    '7.5',
    '7.75',
    '8.0',
    '8.25',
    '8.5',
    '8.75',
    '9.0',
    '9.25',
    '9.5',
    '9.75',
    '10.0',
    '10.25',
    '10.5',
    '10.75',
    '11.0',
    '11.25',
    '11.5',
    '11.75',
    '12.0',
  ];
  const braceletSizeList = [
    '6.00',
    '6.25',
    '6.50',
    '6.75',
    '7.00',
    '7.25',
    '7.50',
    '7.75',
    '8.00',
    '8.25',
    '8.50',
    '8.75',
    '9.00',
  ];
  const backSettingList = ['Push Back', 'Screw Back'];

  const [addToBagLoader, setAddToBagLoader] = useState<boolean>(false);
  const [selectSettingLoader, setselectSettingLoader] = useState<boolean>(false);

  const [viewCarouselBtn, setViewCarouselBtn] = useState(false);

  const isSpinLinkAvailable = product.spin_link !== '';
  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [is360Available, setIs360Available] = useState(false);

  const sanitizedHtml = sanitizeHtml(product.long_description || product.short_description);
  const [ringDiamondError, setRingDiamondError] = useState(false);
  const [showWishListIcon, setShowWishListIcon] = useState<boolean>(false);
  const { setCartItems } = useCartContext();

  const { data: auth, status: authStatus } = useSession();
  const { category } = useProductContext();

  const {
    ringSetting,
    ringDiamond,
    ringSize,
    setRingSetting,
    setRingDiamond,
    // setRingSize,
    diamondSku,
    setDiamondSku,
    // resetRingBuilder
  } = useRingBuilderContext();

  const __shape =
    ringSetting?.product?.diamond_type?.slug || ringSetting?.product?.diamond_type?.[0]?.slug;

  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    // Initialize the CloudImage 360 view
    if (typeof window !== 'undefined' && (window as any).CI360) {
      (window as any).CI360.init();
    }
  }, [isPlaying]);

  // const saleStartDate = product.sale_schedule.start_date
  //   ? new Date(product.sale_schedule.start_date)
  //   : null;
  // const saleEndDate = product.sale_schedule.end_date
  //   ? new Date(product.sale_schedule.end_date)
  //   : null;

  // const isSaleLive =
  //   saleStartDate && saleEndDate && saleStartDate <= new Date() && saleEndDate >= new Date();
  const { cutFilters, colorFilters, clarityFilters, colorDaimondFilters } = useInventoryFilter();
  const cut = cutFilters.find((_c) => _c.value === Number(ringDiamond?.diamond?.cut))?.label_view;
  const color =
    ringDiamond?.diamond_type === 'white'
      ? colorFilters.find((_c) => _c.value === Number(ringDiamond?.diamond?.color))?.label_view
      : colorDaimondFilters.find((_c) => _c.defaultValue === Number(ringDiamond?.diamond?.color))
        ?.color;
  const clarity = clarityFilters.find(
    (_c) => _c.value === Number(ringDiamond?.diamond?.clarity)
  )?.label_view;
  const [attributes, setAttributes] = useState<
    Record<
      string,
      {
        attribute: string | null;
        attribute_value: string;
        attribute_value_name: string;
      }
    >
  >(
    product.attributes?.reduce(
      (acc, attribute) => ({
        ...acc,
        [attribute.attribute.slug]: {
          attribute: attribute.attribute._id,
          attribute_value: query.view
            ? ringSetting?.variant?.name[0].key
            : attribute.attribute_value[0]._id,
          attribute_value_name: query.view
            ? ringSetting?.variant?.name[0].value
            : attribute.attribute_value[0].name,
        },
      }),
      {}
    ) ?? {}
  );

  const [selectedRingSize, setSelectedRingSize] = useState(ringSize?.size ?? '');
  const [ringSizeError, setRingSizeError] = useState(false);
  const [selectedBackSetting, setSelectedBackSetting] = useState(backSettingList[0]);
  const [selectedBraceleteSetting, setSelectedBraceleteSetting] = useState(braceletSizeList[0]);

  const carouselRef = useRef<Carousel>(null);

  const selectedVariant = useMemo(
    () =>
      product.variations.find((variation) =>
        Object.entries(variation.name).every(([, value]) =>
          Object.entries(attributes).some(
            ([, v]) => v.attribute_value === value.key
            // v.attribute_value_name.toLocaleLowerCase().replaceAll(' ', '-') === value.value.replaceAll('-', '.').toLocaleLowerCase() || v.attribute_value_name.toLocaleLowerCase().replaceAll(' ', '-') === value.value.toLocaleLowerCase() || v.attribute_value_name.toLocaleLowerCase().replaceAll(' ', '_') === value.value.replaceAll('-', '.').toLocaleLowerCase() || v.attribute_value_name.toLocaleLowerCase().replaceAll(' ', '_') === value.value.toLocaleLowerCase()
          )
        )
      ),
    [attributes, product.variations]
  );

  const selectedProductVariationImage = useMemo(() => {
    if (ringSetting?.variant) {
      return ringSetting?.variant?.gallery_img;
    }
    return product.images;
  }, [ringSetting, product]);

  // eslint-disable-next-line arrow-body-style
  const productImages = useMemo(() => {
    if (selectedVariant && selectedVariant.gallery_img.length > 0) {
      return selectedVariant.gallery_img;
    }

    return [product.default_image];
  }, [product.default_image, selectedVariant]);

  const productRegularPrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.regular_price;
    }

    return product.regular_price;
  }, [product.regular_price, selectedVariant]);

  const productSalePrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.sale_price;
    }

    return product.sale_price;
  }, [product.sale_price, selectedVariant]);

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    // for collection inventory page
    if (!query.c_type) return true;
    if (query.c_type && _selected_shape === query.shape) return true;
    if (query.c_type && !query.shape) return true;
    return false;
  }, [_selected_shape, query.c_type, query.shape]);

  const onSelectSetting = () => {
    setRingSetting({
      product,
      variant: selectedVariant,
    });
    if (query.c_type === 'setting' && !isShowChooseRing) {
      setRingDiamond(null);
      const path = `${paths.whiteDiamondInventory.root}?type=ring-builder&shape=${product.diamond_type?.slug}`;
      push(path);
      return;
    }
    if (query.type === 'diamond-to-ring-builder') {
      const path = ringDiamond
        ? `${paths.ringPreview.details(product._id)}?type=diamond-to-ring-builder`
        : `${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder&shape=${product.diamond_type?.slug}`;

      push(path);
      return;
    }
    const path = ringDiamond
      ? `${paths.ringPreview.details(product._id)}`
      : `${paths.whiteDiamondInventory.root}?type=ring-builder&shape=${product.diamond_type?.slug}`;

    push(path);
  };

  const addRingDiamondSku = (type: 'diamond' | 'ring', diamond_sku: string) => {
    const existingIndex = diamondSku.findIndex((item) => item.type === type);
    if (existingIndex !== -1) {
      diamondSku[existingIndex].sku = diamond_sku; // Update SKU if object exists
    } else {
      diamondSku.push({ type, sku: diamond_sku }); // Push object if it doesn't exist
    }

    setDiamondSku(diamondSku);
  };

  const cartAttributeValue = useMemo(() => {
    const attributeValue: ICartAttribute = {};

    // Common attribute for all products
    if (ringSetting || selectedVariant) {
      attributeValue.Metal = ringSetting
        ? ringSetting.variant?.name[0].value
        : selectedVariant?.name[0].value;
    }

    if (attributes?.carat_weight?.attribute_value_name) {
      attributeValue['Carat Weight'] = attributes.carat_weight.attribute_value_name;
    }

    // Conditionally add attributes based on product type
    if (product.product_type === 'earring' && !isHoopsAndDropsCategoryPresent) {
      attributeValue['Back Setting'] = selectedBackSetting;
    }

    if (product.product_type === 'wedding_ring') {
      attributeValue['Ring Size'] = selectedRingSize;
    }

    if (product.product_type === 'bracelet') {
      attributeValue['Braclete Size'] = selectedBraceleteSetting;
    }

    if (product.product_type === 'ring_setting') {
      attributeValue['Setting Size'] = selectedRingSize;
    }

    return attributeValue;
  }, [
    ringSetting,
    selectedVariant,
    attributes,
    product,
    selectedRingSize,
    isHoopsAndDropsCategoryPresent,
    selectedBackSetting,
    selectedBraceleteSetting,
  ]);

  const payload = useMemo(
    () => ({
      product_id: product?._id ? product._id : undefined,
      variation_id: selectedVariant && selectedVariant._id ? selectedVariant._id : undefined,
      ring_size: /ring/.test(product.product_type) ? selectedRingSize || undefined : undefined,
      back_setting:
        // eslint-disable-next-line no-nested-ternary
        product.product_type === 'earring' && !isHoopsAndDropsCategoryPresent
          ? pathname.includes('/ready-')
            ? attributes?.back_setting?.attribute_value_name
            : selectedBackSetting || undefined
          : undefined,
      bracelet_size:
        product.product_type === 'bracelet' && !product.category?.[0]?.slug.includes('ready')
          ? selectedBraceleteSetting || undefined
          : undefined,
      quantity: 1,
    }),
    [
      attributes?.back_setting?.attribute_value_name,
      isHoopsAndDropsCategoryPresent,
      pathname,
      product._id,
      product.category,
      product.product_type,
      selectedBackSetting,
      selectedBraceleteSetting,
      selectedRingSize,
      selectedVariant,
    ]
  );

  const onAddToCart = useCallback(async () => {
    // localStorage.removeItem('coupon');
    // localStorage.removeItem('couponName');
    if (
      product.product_type === 'wedding_ring' &&
      !product.category?.[0]?.slug.includes('ready') &&
      selectedRingSize === ''
    ) {
      setRingSizeError(true);
      return;
    }
    if (!auth && authStatus === 'unauthenticated') {
      setAddToBagLoader(true);
      setRingSizeError(false);

      setCartItems((prev: any) => {
        const existingVariantIdx = prev.findIndex(
          (item: {
            product_schema: { _id: string };
            variation_schema: { _id: string | undefined };
            attribute: { [x: string]: string | undefined };
          }) => {
            const isMatch =
              // eslint-disable-next-line no-nested-ternary
              product.product_type === 'wedding_ring'
                ? item?.attribute?.['Ring Size'] === cartAttributeValue['Ring Size']
                : // eslint-disable-next-line no-nested-ternary
                product.product_type === 'earring'
                  ? item?.attribute?.['Back Setting'] === cartAttributeValue['Back Setting']
                  : product.product_type === 'bracelet' &&
                    !product.category?.[0]?.slug.includes('ready')
                    ? item?.attribute?.['Braclete Size'] === cartAttributeValue['Braclete Size']
                    : true; // Default case for other product types

            return (
              item.product_schema?._id?.toString() === product._id?.toString() &&
              item.variation_schema?._id?.toString() === selectedVariant?._id?.toString() &&
              isMatch
            );
          }
        );

        if (existingVariantIdx === -1) {
          const newItem = {
            type: 'product' as 'product' | 'diamond',
            product_schema: product,
            variation_schema: selectedVariant,
            attribute: cartAttributeValue,
            ring_size: product.product_type === 'wedding_ring' ? selectedRingSize : undefined,
            back_setting:
              // eslint-disable-next-line no-nested-ternary
              product.product_type === 'earring' && !isHoopsAndDropsCategoryPresent
                ? pathname.includes('/ready-')
                  ? attributes?.back_setting?.attribute_value_name
                  : selectedBackSetting
                : undefined,
            bracelet_size:
              product.product_type === 'bracelet' && !product.category?.[0]?.slug.includes('ready')
                ? selectedBraceleteSetting
                : undefined,
            quantity: 1,
          };
          return [...prev, newItem];
        }

        return prev.map((item: { qty: any; quantity: any; stock_qty: any }, index: any) =>
          index === existingVariantIdx
            ? {
              ...item,
              qty: (item.qty ?? item.quantity ?? item.stock_qty ?? 1) + 1,
              quantity: (item.quantity ?? item.stock_qty ?? 1) + 1,
            }
            : item
        );
      });

      setSelectedBackSetting('');
      setSelectedRingSize('');
      setSelectedBraceleteSetting('');
      setSelectedRingSize('');
      push(paths.cart.root);
      return;
    }
    setAddToBagLoader(true);
    try {
      if (
        /ring/.test(product.product_type) &&
        !product.category?.[0]?.slug.includes('ready') &&
        !/earring$/.test(product.product_type) &&
        !selectedRingSize
      ) {
        setRingSizeError(true);
        setAddToBagLoader(false);
        return;
      }
      await cartApi.add(payload as any);
      push(paths.cart.root);
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  }, [
    attributes?.back_setting?.attribute_value_name,
    auth,
    authStatus,
    cartAttributeValue,
    isHoopsAndDropsCategoryPresent,
    pathname,
    payload,
    product,
    push,
    selectedBackSetting,
    selectedBraceleteSetting,
    selectedRingSize,
    selectedVariant,
    setCartItems,
  ]);

  const payloadRing = useMemo(
    () => ({
      product_id: ringSetting && ringSetting?.product._id ? ringSetting?.product?._id : undefined,
      variation_id:
        ringSetting && (ringSetting?.variant as any)?._id
          ? (ringSetting?.variant as any)?._id
          : undefined,
      diamond_id:
        ringDiamond && (ringDiamond.diamond as any)?._id
          ? (ringDiamond.diamond as any)?._id
          : undefined,
      ring_size: selectedRingSize || undefined,
      quantity: 2,
    }),
    [ringDiamond, ringSetting, selectedRingSize]
  );

  const onAddToCartRing = useCallback(async () => {
    try {
      // localStorage.removeItem('coupon');
      // localStorage.removeItem('couponName');
      if (ringDiamond && ringSetting) {
        if (
          product.product_type === 'ring_setting' &&
          !product.category?.[0]?.slug.includes('ready') &&
          selectedRingSize === ''
        ) {
          setRingSizeError(true);
          return;
        }
        if (auth && authStatus === 'authenticated') {
          setRingDiamondError(false);
          setAddToBagLoader(true);
          if (
            /ring/.test(product.product_type) &&
            !/earring$/.test(product.product_type) &&
            !selectedRingSize
          ) {
            setRingSizeError(true);
            setAddToBagLoader(false);
            return;
          }
          const { data } = await cartApi.get();
          if (data.data) {
            const ring = await data.data?.filter(
              (i: { product_schema: any; variation_schema: any; diamond_schema: any }) =>
                i.product_schema && i.variation_schema && i.diamond_schema
            );
            if (ring.length > 0) {
              await cartApi.remove(ring?.[0]?._id);
            }
          }
          const { status } = await cartApi.add(payloadRing as any);
          if (status === 404) {
            setRingDiamondError(true);
            setAddToBagLoader(false);
          } else {
            push(paths.cart.root);
          }
        } else {
          setAddToBagLoader(true);
          setRingSizeError(false);
          setCartItems((prev: any) => {
            const existingVariantIdx = prev.findIndex(
              (item: {
                product: { _id: string };
                variant: { _id: string | undefined };
                attribute: { [x: string]: string | undefined };
              }) =>
                item.product?._id === product._id &&
                item.variant?._id === (ringSetting?.variant?._id ?? selectedVariant?._id) &&
                ((product.product_type === 'wedding_ring' &&
                  item?.attribute?.['Ring Size'] === cartAttributeValue['Ring Size']) ||
                  (product.product_type === 'earring' &&
                    item?.attribute?.['Back Setting'] === cartAttributeValue['Back Setting']) ||
                  (product.product_type === 'bracelet' &&
                    !product.category?.[0]?.slug.includes('ready') &&
                    item?.attribute?.['Braclete Size'] === cartAttributeValue['Braclete Size']))
            );

            if (existingVariantIdx === -1) {
              const newItem = {
                type: 'product' as 'product' | 'diamond',
                product_schema: ringSetting?.product ?? product,
                variation_schema: ringSetting?.variant ?? selectedVariant,
                attribute: cartAttributeValue,
                ring_size: product.product_type === 'ring_setting' ? selectedRingSize : undefined,
                back_setting:
                  // eslint-disable-next-line no-nested-ternary
                  product.product_type === 'earring' && !isHoopsAndDropsCategoryPresent
                    ? pathname.includes('/ready-')
                      ? attributes?.back_setting?.attribute_value_name
                      : selectedBackSetting
                    : undefined,
                bracelet_size:
                  product.product_type === 'bracelet' &&
                    !product.category?.[0]?.slug.includes('ready')
                    ? selectedBraceleteSetting
                    : undefined,
                diamond_schema: ringDiamond?.diamond ?? undefined,
                quantity: 2,
              };

              const oldCartItems = prev
                ?.map(
                  (item: { product_schema: any; variation_schema: any; diamond_schema: any }) => {
                    if ((item.product_schema ?? item.variation_schema) && item.diamond_schema) {
                      return undefined;
                    }
                    return item;
                  }
                )
                .filter((i: any) => i !== undefined);

              return [...oldCartItems, newItem];
            }

            return prev.map((item: { qty: any }, index: any) =>
              index === existingVariantIdx
                ? {
                  ...item,
                  qty: (item.qty ?? 1) + 1,
                }
                : item
            );
          });

          setSelectedBackSetting('');
          setSelectedRingSize('');
          setSelectedBraceleteSetting('');
          setSelectedRingSize('');
          push(paths.cart.root);
        }
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  }, [
    attributes?.back_setting?.attribute_value_name,
    auth,
    authStatus,
    cartAttributeValue,
    isHoopsAndDropsCategoryPresent,
    pathname,
    payloadRing,
    product,
    push,
    ringDiamond,
    ringSetting,
    selectedBackSetting,
    selectedBraceleteSetting,
    selectedRingSize,
    selectedVariant,
    setCartItems,
  ]);

  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current?.decrement();
      const index = Number(carouselRef.current?.state?.selectedItem) - 1;
      if (product.spin_link) {
        if (is360Available === false && index === 0) {
          setActiveIndex(() => null as any);
          setIs360Available(true);
        } else if (is360Available === false && index === Number(productImages.length) - 1) {
          setActiveIndex(() => index);
          setIs360Available(false);
        } else if (is360Available === true) {
          setActiveIndex(() => 0);
          setIs360Available(false);
        } else {
          setActiveIndex(() => (index === -1 ? Number(productImages.length) - 1 : index));
        }
      } else {
        setActiveIndex(() => (index === -1 ? Number(productImages.length) - 1 : index));
      }
    }
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current?.increment();
      const index = Number(carouselRef.current?.state?.selectedItem) + 1;
      if (product.spin_link) {
        if (is360Available === false && activeIndex === 0) {
          setActiveIndex(() => null as any);
          setIs360Available(true);
        } else if (is360Available === true) {
          setActiveIndex(() => 1);
          setIs360Available(false);
        } else {
          setActiveIndex(() => (productImages.length === index ? 0 : index));
        }
      } else {
        setActiveIndex(() => (productImages.length === index ? 0 : index));
      }
    }
  };

  const handleRingSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedRingSize(value);
    setRingSizeError(false);
  };

  // eslint-disable-next-line consistent-return
  const handleWishlist = async (type: String) => {
    try {
      if (!auth && authStatus === 'unauthenticated') {
        return await Swal.fire({
          title: 'You need to be logged in!',
          text: "You won't be able to add this product to your wishlist!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Login',
        }).then((result) => {
          if (result.isConfirmed) {
            push(paths.order.root);
          }
        });
      }
      const payloadWishlist = {
        is_ring: productDetails.product_type === 'ring_setting',
        product_id: productDetails._id,
        variation_id: selectedVariant && selectedVariant._id ? selectedVariant._id : undefined,
        bracelet_size: product.product_type === 'bracelet' ? selectedBraceleteSetting : undefined,
        back_setting: product.product_type === 'earring' ? selectedBackSetting : undefined,
        ring_size:
          ['wedding_ring', 'ring_setting'].includes(productDetails.product_type) &&
            !selectedRingSize
            ? '3.0'
            : selectedRingSize || undefined,
      };
      if (type === 'add') {
        setShowWishListIcon(true);
        setProductDetails((prev) => ({
          ...prev,
          wishlistDetails: {
            _id: 'temp_id',
          },
        }));
        await wishlistApi.addWishlist(payloadWishlist).then((res: any) => {
          setProductDetails((prev) => ({
            ...prev,
            wishlistDetails: res.data?.data,
          }));
        });
      } else if (type === 'remove') {
        setShowWishListIcon(false);
        setProductDetails((prev) => ({
          ...prev,
          wishlistDetails: undefined,
        }));
        if ((productDetails as any)?.wishlistDetails?._id !== 'temp_id')
          await wishlistApi.removeWishlist({ wishlists: [productDetails.wishlistDetails?._id] });
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>{product.meta_data || product.name}</title>
        <meta name="description" content={product.meta_description} />
        <meta name="keywords" content={product.meta_keywords?.join(', ')} />
      </Head>
      {/* Product details */}
      <div className={clsx('container-fluid mt-0 mt-md-5', className)} {...other}>
        <div className="d-flex flex-wrap flex-lg-nowrap justify-content-center">
          {/* Images */}
          {product.product_type !== 'custom' && (
            <div
              className={
                (enableRingSize ? (selectedProductVariationImage as []) : productImages).length ===
                  0
                  ? 'silder_loader position-relative'
                  : 'product_slider_image position-relative'
              }
            >
              {(enableRingSize ? (selectedProductVariationImage as []) : productImages).length ===
                0 ? (
                <div className="spinner-border text-light spinner_size" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  {isSpinLinkAvailable && product.image_count ? (
                    <div
                      className={is360Available ? 'imgView360 me-3' : 'ring_slick_slider_for me-3'}
                    >
                      {(enableRingSize ? (selectedProductVariationImage as []) : productImages)
                        .slice(0, 1)
                        ?.map((image: string | StaticImport, idx: SetStateAction<number>) => (
                          <Image
                            src={image}
                            alt="product-image"
                            height={100}
                            width={100}
                            className={activeIndex === idx ? 'product_image_active' : ''}
                            key={`${product._id}-${idx}`}
                            onClick={() => {
                              setActiveIndex(idx);
                              setIs360Available(false);
                            }}
                          />
                        ))}
                      {isSpinLinkAvailable && product.image_count && (
                        <Image
                          className={is360Available ? 'border360' : ''}
                          onClick={() => {
                            setActiveIndex(null as any);
                            setIs360Available(true);
                          }}
                          src={Img360.src}
                          alt="360"
                          width={100}
                          height={100}
                        />
                      )}
                      {(enableRingSize ? (selectedProductVariationImage as []) : productImages)
                        .slice(1)
                        ?.map((image: string | StaticImport, idx: SetStateAction<number>) => (
                          <Image
                            src={image}
                            alt="product-image"
                            height={100}
                            width={100}
                            className={
                              activeIndex === Number(idx) + 1 ? 'product_image_active' : ''
                            }
                            key={`${product._id}-${Number(idx) + 1}`}
                            onClick={() => {
                              setActiveIndex(Number(idx) + 1);
                              setIs360Available(false);
                            }}
                          />
                        ))}
                    </div>
                  ) : (
                    <div
                      className={is360Available ? 'imgView360 me-3' : 'ring_slick_slider_for me-3'}
                    >
                      {(enableRingSize
                        ? (selectedProductVariationImage as [])
                        : productImages
                      )?.map((image: string | StaticImport, idx: SetStateAction<number>) => (
                        <Image
                          src={image}
                          alt="product-image"
                          height={100}
                          width={100}
                          className={activeIndex === idx ? 'product_image_active' : ''}
                          key={`${product._id}-${idx}`}
                          onClick={() => {
                            setActiveIndex(idx);
                            setIs360Available(false);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div
                    className="ring_slick_slider"
                    onMouseEnter={() => setViewCarouselBtn(true)}
                    onMouseLeave={() => setViewCarouselBtn(false)}
                  >
                    {(enableRingSize ? (selectedProductVariationImage as []) : productImages)
                      ?.length > 1 ? (
                      <>
                        <Carousel
                          selectedItem={activeIndex}
                          ref={carouselRef}
                          infiniteLoop
                          showThumbs={false}
                          showStatus={false}
                          showIndicators={false}
                          showArrows={false}
                        >
                          {(enableRingSize
                            ? (selectedProductVariationImage as [])
                            : productImages
                          ).map((image: string | StaticImport, idx: any) => (
                            <>
                              {/* {product.spin_link !== ('' ?? undefined) && is360Available && (
                            <div
                              className="Sirv"
                              data-src={product?.spin_link}
                              data-options=" spin.speed:8000; zoom.ratio:4.0; column.loop:true; spin.autospin.enable:true;"
                            />
                          )} */}
                              {activeIndex === idx && (
                                <Image
                                  src={image}
                                  key={idx}
                                  alt="product-image"
                                  height={is360Available ? 0 : 680}
                                  width={is360Available ? 0 : 680}
                                  style={{ height: 'auto', width: '100%' }}
                                />
                              )}
                            </>
                          ))}
                        </Carousel>
                        <div className="position-relative">
                          {isSpinLinkAvailable && product.image_count && (
                            <div className={is360Available ? '' : 'd-none'}>
                              {isPlaying ? (
                                <div
                                  key="playing"
                                  className="cloudimage-360"
                                  data-folder={product.spin_link}
                                  data-filename-x={`${product.prefix}-{index}.jpg`}
                                  data-amount-x={product.image_count}
                                  data-speed="100"
                                  data-drag-speed="120"
                                  data-autoplay="true"
                                  data-fullscreen="true"
                                  data-spin-reverse="true"
                                  data-hide-360-logo="true"
                                  data-control="true"
                                  data-control-reverse="true"
                                  data-keys="true"
                                />
                              ) : (
                                <div
                                  key="paused"
                                  className="cloudimage-360"
                                  data-folder={product.spin_link}
                                  data-filename-x={`${product.prefix}-{index}.jpg`}
                                  data-amount-x={product.image_count}
                                  data-speed="100"
                                  data-drag-speed="120"
                                  data-autoplay="false"
                                  data-fullscreen="true"
                                  data-spin-reverse="true"
                                  data-hide-360-logo="true"
                                  data-control="true"
                                  data-control-reverse="true"
                                  data-keys="true"
                                />
                              )}
                            </div>
                          )}
                          {activeIndex === null && (
                            <>
                              {viewCarouselBtn && (
                                <div className="pause-play" onClick={handlePlayPause}>
                                  {isPlaying ? (
                                    <i className="fa-solid fa-pause" />
                                  ) : (
                                    <i className="fa-solid fa-play" />
                                  )}
                                </div>
                              )}
                              <Image
                                className="degree-360"
                                src={Img360.src}
                                alt="360"
                                width={60}
                                height={60}
                              />
                            </>
                          )}
                        </div>
                        {viewCarouselBtn === true && (
                          <div className="positionBtn align-items-center gap-2 d-none d-lg-flex">
                            <i
                              className="fa-solid fa-less-than carouselButton"
                              onClick={handlePrevClick}
                            />
                            <i
                              className="fa-solid fa-greater-than carouselButton"
                              onClick={handleNextClick}
                            />
                          </div>
                        )}
                        <div className="positionBtn d-flex align-items-center gap-2 d-lg-none">
                          <i
                            className="fa-solid fa-less-than carouselButton"
                            onClick={handlePrevClick}
                          />
                          <i
                            className="fa-solid fa-greater-than carouselButton"
                            onClick={handleNextClick}
                          />
                        </div>
                      </>
                    ) : (
                      // Single image
                      <Image
                        src={
                          (enableRingSize
                            ? (selectedProductVariationImage as [])
                            : productImages)[0]
                        }
                        alt="product-image"
                        height={680}
                        width={680}
                        style={{ height: 'auto' }}
                      />
                    )}
                  </div>
                </>
              )}
              {!pathname.includes('/preview') &&
                !pathname.includes('/ring-preview') &&
                ((auth?.user.id === (productDetails as any)?.wishlistDetails?.customer_id ||
                  showWishListIcon) &&
                  auth?.user.id ? (
                  <i
                    className="fa-solid fa-heart"
                    style={{
                      fontSize: '20px',
                      color: 'red',
                      position: 'absolute',
                      top: 18,
                      right: 18,
                    }}
                    onClick={() => handleWishlist('remove')}
                  />
                ) : (
                  !pathname.includes('/preview') && (
                    <i
                      className="fa-regular fa-heart"
                      style={{ fontSize: '20px', position: 'absolute', top: 18, right: 18 }}
                      onClick={() => handleWishlist('add')}
                    />
                  )
                ))}
            </div>
          )}

          {product.product_type === 'custom' && (
            <div className="d-flex justify-content-center justify-content-lg-start position-relative">
              <img
                src={product.default_image || product.images?.[0]}
                className="img-fluid"
                alt="custom-image"
              />
              {!pathname.includes('/preview') &&
                !pathname.includes('/ring-preview') &&
                ((auth?.user.id === (productDetails as any)?.wishlistDetails?.customer_id ||
                  showWishListIcon) &&
                  auth?.user.id ? (
                  <i
                    className="fa-solid fa-heart"
                    style={{
                      fontSize: '20px',
                      color: 'red',
                      position: 'absolute',
                      top: 18,
                      right: 18,
                    }}
                    onClick={() => handleWishlist('remove')}
                  />
                ) : (
                  !pathname.includes('/preview') && (
                    <i
                      className="fa-regular fa-heart"
                      style={{ fontSize: '20px', position: 'absolute', top: 18, right: 18 }}
                      onClick={() => handleWishlist('add')}
                    />
                  )
                ))}
            </div>
          )}

          {/* Details */}
          <div className="product_information w-100">
            {/* Title */}
            {ringDiamond &&
              ringSetting?.product?._id === product._id &&
              product.product_type === 'ring_setting' &&
              isRingBuilderProps &&
              ringDiamond &&
              ringSetting ? (
              <h4 className="product_complate_title text-capitalize">
                {product.name} with {ringDiamond?.diamond?.shape} Cut {cut} Carat{' '}
                {ringDiamond?.diamond?.carat} color {color} Clarity {clarity} Lab Grown Diamond
              </h4>
            ) : (
              <h4 className="product_title">{product.name}</h4>
            )}

            {isRingBuilderProps && ringDiamond && ringSetting && (
              <p className="product_details text-capitalize">
                {`${ringSetting?.variant?.name[0].value.replaceAll('-', ' ').replace('k', 'K') || ''} ${ringSetting?.variant?.name[0].value ? ',' : ''} ${ringDiamond?.diamond?.carat} carat ${ringDiamond?.diamond?.shape} Shape, ${color} color, ${clarity} clarity ${cut} cut.`}
              </p>
            )}

            {!enableRingSize ? (
              <>
                {/* Attributes */}
                {product.attributes?.map((attribute, index) => (
                  <div className="common_select_dropdown mb-2" key={index}>
                    <label htmlFor={attribute.attribute.slug}>{attribute.attribute.name} </label>
                    <select
                      id={attribute.attribute.slug}
                      className="form-select text-capitalize"
                      key={attribute.attribute._id}
                      value={attributes[attribute.attribute.slug].attribute_value}
                      onChange={(e) => {
                        setAttributes({
                          ...attributes,
                          [attribute.attribute.slug]: {
                            attribute: attribute.attribute._id,
                            attribute_value: e.target.value,
                            attribute_value_name:
                              attribute.attribute_value.find(
                                (value) => value._id === e.target.value
                              )?.name ?? '',
                          },
                        });
                        // setSelectedBackSetting(attributes?.back_setting?.attribute_value_name);
                      }}
                    >
                      {attribute.attribute_value.map((value) => (
                        <option value={value._id} key={value._id}>
                          {value.name.replace('-', '.')}
                        </option>
                      ))}
                      {/* {sortedAttributeValues(attribute.attribute_value).map((value) => (
                        <option value={value._id} key={value._id}>
                          {value.name}
                        </option>
                      ))} */}
                    </select>
                  </div>
                ))}
                {product.product_type === 'earring' &&
                  !pathname.includes('/ready-') &&
                  !isHoopsAndDropsCategoryPresent && (
                    <div className="common_select_dropdown mb-2">
                      <div className="d-flex me-2">
                        <label htmlFor="backSetting">Back Setting</label>
                      </div>
                      <select
                        id="backSetting"
                        name="backSetting"
                        className="form-select"
                        value={selectedBackSetting}
                        onChange={(e) => setSelectedBackSetting(e.target.value)}
                      >
                        {backSettingList.map((value) => (
                          <option value={value} key={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                {product.product_type === 'wedding_ring' &&
                  !product.category?.[0]?.slug.includes('ready') && (
                    <div className="common_select_dropdown mb-2">
                      <div className="d-flex me-2">
                        <label htmlFor="ringSize">Ring Size (US)</label>{' '}
                        <Link
                          href="https://www.loosegrowndiamond.com/wp-content/uploads/2021/08/LGD-RING-SIZER.pdf"
                          target="_blank"
                          className="text-decoration-none"
                        >
                          <span className="question_icon ms-1">
                            <i className="fa-solid fa-question" />
                          </span>
                        </Link>
                      </div>
                      <select
                        id="ringSize"
                        name="ringSize"
                        className={ringSizeError ? 'form-select red-border' : 'form-select'}
                        value={selectedRingSize}
                        onChange={handleRingSize}
                      >
                        <option value="" disabled>
                          Choose Ring Size
                        </option>
                        {ringSizeList.map((value) => (
                          <option value={value} key={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                {product.product_type === 'bracelet' &&
                  !product.category?.[0]?.slug.includes('ready') && (
                    <div className="common_select_dropdown mb-2">
                      <div className="d-flex me-2">
                        <label htmlFor="brecelet">Length (Inches)</label>
                      </div>
                      <select
                        id="brecelet"
                        name="brecelet"
                        className="form-select"
                        value={selectedBraceleteSetting}
                        onChange={(e) => setSelectedBraceleteSetting(e.target.value)}
                      >
                        {braceletSizeList.map((value) => (
                          <option value={value} key={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                {/* description  */}
                {product?.product_type === 'custom' && (
                  // eslint-disable-next-line react/no-danger
                  <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                )}

                {/* Price */}
                <div className="d-flex align-items-end gap-3 my-4">
                  {/* {isSaleLive ? (
                    <>
                      <h4 className="mb-0">${productSalePrice}</h4>
                      <del className="font_size_13 fw-600 text-light-gray-secondary">
                        was ${productRegularPrice}
                      </del>
                    </>
                  ) : (
                    <h4 className="mb-0">${productRegularPrice}</h4>
                  )} */}
                  <h4 className="mb-0">${productSalePrice}</h4>
                  <del className="font_size_13 fw-600 text-light-gray-secondary">
                    {product.product_type !== 'custom' && `was $${productRegularPrice}`}
                  </del>
                </div>
              </>
            ) : (
              <>
                {Number(
                  (ringSetting?.variant
                    ? ringSetting.variant.sale_price
                    : ringSetting?.product?.sale_price) ?? 0
                ) +
                  Number(ringDiamond?.diamond?.price ?? 0) >
                  0 && (
                    <div className="d-flex align-items-end gap-3 mb_20">
                      <h4 className="mb-0">
                        {' '}
                        $
                        {Number(
                          (ringSetting?.variant
                            ? ringSetting.variant.sale_price
                            : ringSetting?.product?.sale_price) ?? 0
                        ) + Number(ringDiamond?.diamond?.price ?? 0)}
                      </h4>
                      <del className="font_size_13 fw-600 text-light-gray-secondary">
                        was $
                        {Number(
                          (ringSetting?.variant
                            ? ringSetting.variant.regular_price
                            : ringSetting?.product?.regular_price) ?? 0
                        ) + Number(ringDiamond?.diamond?.regular_price ?? 0)}
                      </del>
                    </div>
                  )}

                {!product.category?.[0]?.slug.includes('ready') && (
                  <div className="common_select_dropdown mb_25">
                    <div className="d-flex me-2">
                      <label htmlFor="ringSize">Ring Size (US)</label>{' '}
                      <Link
                        href="https://www.loosegrowndiamond.com/wp-content/uploads/2021/08/LGD-RING-SIZER.pdf"
                        target="_blank"
                        className="text-decoration-none"
                      >
                        <span className="question_icon ms-1">
                          <i className="fa-solid fa-question" />
                        </span>
                      </Link>
                    </div>
                    <select
                      id="ringSize"
                      name="ringSize"
                      className={ringSizeError ? 'form-select red-border' : 'form-select'}
                      value={selectedRingSize}
                      onChange={handleRingSize}
                    >
                      <option value="" disabled>
                        Choose Ring Size
                      </option>
                      {ringSizeList.map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {ringDiamondError && (
              <div
                className="alert alert-danger  d-flex align-items-center mt-3"
                role="alert"
                style={{ height: '35px' }}
              >
                <svg
                  className="bi flex-shrink-0 "
                  role="img"
                  aria-label="Danger:"
                  style={{ width: '20px', marginRight: '6px' }}
                >
                  <use xlinkHref="#exclamation-triangle-fill" />
                </svg>
                <div style={{ lineHeight: '1.2', fontSize: '14px' }}>Diamond Not Found</div>
              </div>
            )}

            {/* {ringSizeError && <p className=" text-danger">Please Select Ring Size</p>} */}
            {/* Add to bag btn */}
            {/* eslint-disable-next-line no-nested-ternary */}
            {enableRingSize ? (
              <div className="d-flex mb_20 gap-2">
                <button
                  type="button"
                  disabled={pathname.includes('/preview') || addToBagLoader}
                  className="common_btn md_common_btn w-100"
                  onClick={() => [
                    onAddToCartRing(),
                    addRingDiamondSku('ring', ringDiamond?.diamond?.sku ?? ''),
                  ]}
                >
                  {addToBagLoader ? (
                    <div className="spinner-border text-light auth_loader" role="status">
                      <span className="visually-hidden ">Loading...</span>
                    </div>
                  ) : (
                    'Add to bag'
                  )}
                </button>
                {product.product_type === 'custom' && (
                  <div
                    className="rounded"
                    style={{
                      background: '#37b456',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <a
                      href="https://api.whatsapp.com/send?phone=16462880810 "
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src="https://www.loosegrowndiamond.com/wp-content/uploads/2019/09/Whatsapp.svg"
                        width={60}
                        height={30}
                        alt="whatsapp-img"
                        style={{ minWidth: '60px' }}
                      />
                    </a>
                  </div>
                )}
                {/* {!selectedRingSize && <p className="text-center">Please Select Ring Size</p>} */}
              </div>
            ) : enableRingBuilder || enableRingBuilderForDiamondToRing ? (
              <button
                type="button"
                className="common_btn md_common_btn mb_20 w-100"
                disabled={
                  pathname.includes('/preview') || query.c_type === 'setting'
                    ? false
                    : selectSettingLoader ||
                    (__shape &&
                      product.diamond_type?.slug &&
                      ringDiamond?.diamond &&
                      __shape !== product.diamond_type?.slug)
                }
                onClick={() => [onSelectSetting(), setselectSettingLoader(true)]}
              >
                {selectSettingLoader ? (
                  <div className="spinner-border text-light auth_loader" role="status">
                    <span className="visually-hidden ">Loading...</span>
                  </div>
                ) : (
                  'Select this setting'
                )}
              </button>
            ) : (
              <div className="d-flex mb_20 gap-2">
                <button
                  type="button"
                  disabled={pathname.includes('/preview') || addToBagLoader}
                  className="common_btn md_common_btn w-100"
                  onClick={() => onAddToCart()}
                >
                  {addToBagLoader ? (
                    <div className="spinner-border text-light auth_loader" role="status">
                      <span className="visually-hidden ">Loading...</span>
                    </div>
                  ) : (
                    'Add to bag'
                  )}
                </button>
                {product.product_type === 'custom' && (
                  <div
                    className="rounded"
                    style={{
                      background: '#37b456',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <a
                      href="https://api.whatsapp.com/send?phone=16462880810 "
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src="https://www.loosegrowndiamond.com/wp-content/uploads/2019/09/Whatsapp.svg"
                        width={60}
                        height={30}
                        alt="whatsapp-img"
                        style={{ minWidth: '60px' }}
                      />
                    </a>
                  </div>
                )}
                {/* {product.product_type ==="wedding-rings" && !selectedRingSize && (
                  <p className="text-center">Please Select Ring Size</p>
                )} */}
              </div>
            )}

            {/* Klarna */}
            {product.product_type !== 'custom' && (
              <p className="text_black_secondary font_size_13 mb-0">
                <Image src={KlarnaImg.src} alt="klarna" width={45} height={25} /> 4 interest-free
                payments.{' '}
                <Link href={paths.klarna.root} className="text_black_secondary">
                  Learn More
                </Link>
              </p>
            )}

            {/* Services */}
            {product.product_type !== 'custom' && (
              <ul className="ls_iconcnt">
                <li>
                  <Image src={frame1Img.src} alt="free-shipping" width={30} height={30} />
                  Insured Shipping Worldwide
                </li>
                <li>
                  <Image src={frame2Img.src} alt="easy-returns" width={30} height={30} />
                  Easy 7 Day Returns
                </li>
                <li>
                  <Image src={frame3Img.src} alt="warranty" width={30} height={30} />
                  Manufacturer Warranty
                </li>
                <li>
                  <Image src={frame4Img.src} alt="price-match" width={30} height={30} />
                  <div>
                    Price Match
                    <span style={{ fontSize: '18px', color: 'rgb(51, 51, 51)', fontWeight: '400' }}>
                      *
                    </span>
                  </div>
                </li>
                <li>
                  <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                  Complimentary jewelry box & bag wrapping
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="container-fluid">
        <div className="row product_section">
          {product.product_type !== 'custom' && (
            <div className="col-lg-7">
              <h3 className="product_information_heading">Product Information</h3>

              <div className="row">
                {/* Setting & Metal */}
                <div className="col-sm-6">
                  <div className="product_information_box">
                    <h6>Setting & Metal</h6>
                    <ul>
                      {enableRingSize
                        ? ringSetting?.variant?.materials_data.map((item: any) =>
                          <li>
                            - {item}
                            {item?.toLowerCase().includes('band width') && '*'}
                          </li>
                        )
                        : selectedVariant?.materials_data.map((item: any) => (
                          <li>
                            - {item}
                            {item?.toLowerCase().includes('band width') && '*'}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Diamond Details */}
                {ringDiamond &&
                  ringSetting &&
                  product.product_type === 'ring_setting' &&
                  isRingBuilderProps && (
                    <div className="col-md-4">
                      <div className="product_information_box">
                        <h6>Diamond</h6>
                        <ul>
                          {/* Diamond Details */}
                          <li className="text-capitalize">
                            - {ringDiamond?.diamond?.shape} cut {ringDiamond?.diamond?.carat} carat{' '}
                            {color} color {clarity} Clarity Lab Grown Diamond{' '}
                          </li>

                          <li>- SKU: {ringDiamond?.diamond?.sku}</li>
                          {ringDiamond?.diamond?.certificate_type !== 4 && (
                            <li>
                              - Certificate:
                              <Link
                                href={(ringDiamond?.diamond?.certificate as string) || ''}
                                className="diamond_setting_certificate text-decoration-none ms-1"
                                target="_blank"
                              >
                                View diamond certificate
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                {/* Made to Order */}
                {!pathname.startsWith(paths.readyToShip.root) && (
                  <div className="col-sm-6">
                    <div className="product_information_box light_yellow_box">
                      <h6>Made to Order</h6>
                      <span>We make your jewelry individually once we receive your order</span>
                    </div>
                  </div>
                )}

                {/* {!pathname.startsWith(paths.readyToShip.root) && !(ringDiamond && isRingBuilderProps && ringSetting?.product?._id === product._id) && (
                  <div className="col-md-0" />
                )} */}

                {/* Diamond Details */}
                {!pathname.startsWith(paths.readyToShip.root) && (
                  <div className="col-sm-6">
                    <div className="product_information_box">
                      <h6>Delivery</h6>
                      <ul>
                        <li>- Express international shipping with insurance</li>
                        <li>- Expected delivery time: 3-4 working weeks</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Why Loose Grown Diamond? */}
                <div className="col-sm-6">
                  <div className="product_information_box">
                    <h6>Why Loose Grown Diamond?</h6>
                    <ul>
                      <li>- Handcrafted</li>
                      <li>- Conflict Free & Eco-Friendly Diamonds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {Array.isArray(product?.matching_products) && product?.matching_products?.length > 0 && (
            <div className="col-lg-5">
              <h3 className="product_information_heading">Matching Bands</h3>
              <p style={{ fontSize: 13 }}>
                Find the perfect engagement ring to pair with your wedding ring.
              </p>
              <div>
                <ProductCarousel
                  matching_product={product?.matching_products}
                  category={category || []}
                  showCart={2}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg_light_gray mb-4 mt-3 my-md-5">
        <TrustPilotReviewSection />
      </div>
    </>
  );
};

export default ProductDetail;
