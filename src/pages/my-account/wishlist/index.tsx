'use client';

/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import clsx from 'clsx';
import { signOut } from 'next-auth/react';

import { cartApi } from '@/api/cart';
import { IProduct } from '@/api/product';
import { wishlistApi } from '@/api/wishlist';
import { IWhiteDiamond } from '@/api/inventory/types';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useProductContext } from '@/stores/product.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { withSsrProps } from '@/utils/page';

import ProfileSidebar from '@/components/profile/profileSideBar';
import { getURLForProduct } from '@/components/common-functions';
import AddQualityCheckerDiamondToCartModal from '@/components/inventory/QualityCheckModal';

import { paths } from '@/routes/paths';
import xIconSVG from '@/assets/image/x-symbol.svg';
import LoadingImage from '@/assets/image/Loading.gif';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';
import emptyWishlistImg from '@/assets/image/empty-wishlist.png';

// ----------------------------------------------------------------------

const WishlistPage = () => {
  const { colorFilters, clarityFilters, REAL_COLOR_OPTIONS, cutFilters } = useInventoryFilter();
  const [wishlist, setWishlist] = useState([]);
  const [status, setStatus] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [wishListEmptyBtnLoader, setWishListEmptyBtnLoader] = useState<boolean>(false);
  const router = useRouter();
  const { setRingSetting, setRingDiamond, resetRingBuilder } = useRingBuilderContext();

  const { category } = useProductContext();

  const [showQualityCheckModal, setShowQualityCheckModal] = useState<Boolean>(false);
  const [currentDiamondData, setCurrentDiamondData] = useState<
    IWhiteDiamond | IColorDiamond | null
  >(null);

  useEffect(() => {
    const getWishlist = async () => {
      try {
        if (status) return;
        await wishlistApi.getWishlist().then((response) => {
          setWishlist(response.data?.data || []);
          setStatus(true);
        });
      } catch (error) {
        if (error?.response?.data?.status === 401) {
          signOut({ callbackUrl: paths.order.root });
          localStorage.clear();
        }
        console.error('Error fetching wishlist:', error);
      }
    };

    getWishlist();
  }, [status]);

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

  const handleRebuildRing = async (
    item: IColorDiamond | IWhiteDiamond | IProduct,
    v: any,
    id: string,
    index: number,
    type: string
  ) => {
    try {
      resetRingBuilder();
      if (type === 'product') {
        setLoadingIndex(index);
        setRingSetting({ product: item, variant: v });
        const path = `/engagement-rings/${(item as any)?.display_slug}?view=true`;
        router.push(path);
        // await wishlistApi.removeWishlist({ wishlists: [id] });
      } else if (['white-diamond', 'color-diamond'].includes(type)) {
        setLoadingIndex(index);
        setRingDiamond({
          diamond: item as any,
          diamond_type: type.includes('white') ? 'white' : 'color',
        });
        const path = `/${paths.buildRing.root}?type=ring-builder&shape=${(item as any)?.shape as string}`;
        router.push(path);
        // await wishlistApi.removeWishlist({ wishlists: [id] });
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      console.error('Error rebuilding ring:', error);
    }
  };

  const handleAddToCart = async (
    p: any,
    v: any,
    id: string,
    index: number,
    type: string,
    bracelet_size: string,
    back_setting: string,
    ring_size: string
  ) => {
    try {
      if (type === 'diamond') {
        if (p?.certificate?.length === 0 && [4, 5].includes(p?.certificate_type)) {
          setCurrentDiamondData(p);
          setShowQualityCheckModal(true);
        } else {
          const payload = {
            diamond_id: p._id,
          };
          setLoadingIndex(index);
          await cartApi.add(payload).then(async (res) => {
            if (res.status === 201) {
              router.push(paths.cart.root);
              // await wishlistApi.removeWishlist({ wishlists: [id] });
            }
          });
        }
      } else if (type === 'product') {
        setLoadingIndex(index);
        const payload = {
          product_id: p?._id ? p._id : undefined,
          variation_id: v?._id ? v._id : undefined,
          ring_size: ring_size || undefined,
          back_setting: back_setting || undefined,
          bracelet_size: bracelet_size || undefined,
          quantity: 1,
        };
        await cartApi.add(payload).then(async (res) => {
          if (res.status === 201) {
            router.push(paths.cart.root);
            // await wishlistApi.removeWishlist({ wishlists: [id] });
          }
        });
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      console.error('Error rebuilding ring:', error);
    }
  };

  const handleSimilarProduct = (isRing: boolean, type: string, p: any, index: number) => {
    if (!p) return;
    setLoadingIndex(index);
    if (type === 'diamond') {
      const diamondName = getDiamondTitle(
        p,
        p?.intensity ? 'color' : 'white',
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

      const path = p?.intensity
        ? `${paths.colorDiamondInventory.root}?${params.toString()}`
        : `${paths.whiteDiamondInventory.root}?${params.toString()}`;

      router.push(path);
    } else if (type === 'product') {
      const params = new URLSearchParams();

      const shape = p?.diamond_type?.[0]?.slug || p?.diamond_type?.slug || '';
      const price = `${p?.sale_price || p?.regular_price},${Number(p?.sale_price || p?.regular_price) + 500}`;

      if (shape) params.set('shape', shape);
      if (price) params.set('price', price);

      if (p?.product_type === 'custom') {
        router.push(`/custom`);
      } else if (p?.product_type === 'ring_setting') {
        router.push(paths.buildRing.root);
      } else if (
        ['wedding_ring', 'bracelet', 'earring', 'necklace', 'pendant', 'chain'].includes(
          p?.product_type
        )
      ) {
        router.push(
          `/${getURLForProduct(p.category_details as any[], '', category as any[])}?${params.toString()}`
        );
      } else if (p?.category_details) {
        router.push(`/${getURLForProduct(p.category_details as any[], '', category as any[])}`);
      } else {
        router.push(paths.fineJewelry.root);
      }
    }
  };

  const handleRemoveWishlist = async (id: string, index: number) => {
    try {
      setWishlist((prev) => prev.filter((_, i) => i !== index));
      await wishlistApi.removeWishlist({ wishlists: [id] });
    } catch (error) {
      if (error?.response?.data?.status === 401) {
        signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
      }
      console.error('Error rebuilding ring:', error);
    }
  };

  const showViewBtn = (p: any, _bracelet_size?: string, _ring_size?: string) => {
    if (['wedding_ring', 'ring_setting'].includes(p?.product_type) && !_ring_size) return true;
    if (p?.product_type === 'bracelet' && !_bracelet_size) return true;
    return false;
  };

  const handleViewProduct = (p: any) => {
    router.push(
      `/${getURLForProduct((p.category_details as any) || (p?.category as any[]), p?.display_slug, category as any[])}`
    );
  };

  return (
    <div className="min-h-454 account-form">
      <div className="container-fluid ">
        <h1 className="h4 text-center fw-600 text_black_secondary mb_30">My Account</h1>
        <div className="row gy-4 gy-md-5">
          <div className="col-lg-3">
            <ProfileSidebar />
          </div>
          <div className="col-lg-9">
            {wishlist.length > 0 && status && (
              <h3 className="fw-600 text_black_secondary mb-30">Wishlist</h3>
            )}
            <div className="table-responsive">
              {wishlist.length === 0 && !status ? (
                <div className="py_40">
                  <div className="text-center">
                    <Image src={LoadingImage} alt="loader" width={30} height={30} />
                  </div>
                </div>
              ) : wishlist.length > 0 ? (
                <div className="container-fluid">
                  <div className="row g-4">
                    {wishlist.map(
                      (
                        {
                          whiteDetails,
                          colorDetails,
                          variationDetails,
                          productDetails,
                          is_ring,
                          _id,
                          bracelet_size,
                          back_setting,
                          ring_size,
                        },
                        index
                      ) => {
                        const dName = getDiamondTitle(
                          whiteDetails || colorDetails,
                          ((whiteDetails || colorDetails) as any)?.intensity ? 'color' : 'white'
                        );
                        const diamondName = dName.props.children?.[0] ?? dName.props.children;

                        return whiteDetails || colorDetails ? (
                          <div key={index} className="col-12 col-sm-6 col-xl-4">
                            <div className="wishlist-card">
                              <div
                                className="wishlist-img position-relative"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src={findDiamodImg(
                                    whiteDetails || colorDetails,
                                    ((whiteDetails || colorDetails) as any)?.shape
                                  )}
                                  alt="diamond"
                                  className={clsx('img-fluid mx-auto d-block', {
                                    'out-of-stock': !((whiteDetails || colorDetails) as any)
                                      .stock_status,
                                  })}
                                  style={{ width: '70%' }}
                                />
                                <div
                                  className="position-absolute p-1 "
                                  style={{
                                    cursor: 'pointer',
                                    top: 10,
                                    right: 10,
                                    // background: 'black',
                                    // color: 'white',
                                    // borderRadius: '50%',
                                    // width: 25,
                                    // height: 25,
                                    // display: 'flex',
                                    // alignItems: 'center',
                                    // justifyContent: 'center',
                                  }}
                                >
                                  {/* <i className="fa-solid fa-xmark fs-6" /> */}
                                  <Image
                                    src={xIconSVG.src}
                                    onClick={() => handleRemoveWishlist(_id, index)}
                                    alt="X"
                                    height={16}
                                    width={16}
                                  />
                                </div>
                                {!((whiteDetails || colorDetails) as any).stock_status && (
                                  <p
                                    className="position-absolute translate-middle"
                                    style={{
                                      color: '#fff',
                                      background: '#ff0000',
                                      padding: '1px 10px',
                                      fontSize: '12px',
                                      top: '92%',
                                      left: '50%',
                                    }}
                                  >
                                    OUT OF STOCK
                                  </p>
                                )}
                              </div>
                              <div
                                className={clsx('wishlist-body', {
                                  'out-of-stock': !((whiteDetails || colorDetails) as any)
                                    .stock_status,
                                })}
                              >
                                <p className="product-name">{diamondName.toUpperCase()}</p>
                                <div className="d-flex align-items-center gap-2 justify-center">
                                  <p className="product-price">
                                    $
                                    {((whiteDetails || colorDetails) as any)?.price?.toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </p>
                                  <del className="product-price ">
                                    $
                                    {(
                                      (whiteDetails || colorDetails) as any
                                    ).regular_price?.toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </del>
                                </div>
                              </div>
                              {((whiteDetails || colorDetails) as any).stock_status && is_ring ? (
                                <button
                                  type="button"
                                  className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                  style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                  onClick={() =>
                                    handleRebuildRing(
                                      whiteDetails || colorDetails,
                                      variationDetails,
                                      _id,
                                      index,
                                      whiteDetails
                                        ? 'white-diamond'
                                        : colorDetails && 'color-diamond'
                                    )
                                  }
                                  disabled={!((whiteDetails || colorDetails) as any).stock_status}
                                >
                                  {loadingIndex === index ? (
                                    <div className="spinner-border inventory_loader" role="status">
                                      <span className="visually-hidden ">Loading...</span>
                                    </div>
                                  ) : (
                                    'SELECT THIS DIAMOND'
                                  )}
                                </button>
                              ) : ((whiteDetails || colorDetails) as any).stock_status &&
                                !is_ring ? (
                                <button
                                  type="button"
                                  className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                  onClick={() =>
                                    handleAddToCart(
                                      whiteDetails || colorDetails,
                                      variationDetails,
                                      _id,
                                      index,
                                      'diamond',
                                      bracelet_size,
                                      back_setting,
                                      ring_size
                                    )
                                  }
                                  disabled={!((whiteDetails || colorDetails) as any).stock_status}
                                  style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                >
                                  {loadingIndex === index ? (
                                    <div className="spinner-border inventory_loader" role="status">
                                      <span className="visually-hidden ">Loading...</span>
                                    </div>
                                  ) : (
                                    'MOVE TO CART'
                                  )}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                  disabled={((whiteDetails || colorDetails) as any).stock_status}
                                  style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                  onClick={() =>
                                    handleSimilarProduct(
                                      is_ring,
                                      'diamond',
                                      whiteDetails || colorDetails,
                                      index
                                    )
                                  }
                                >
                                  {loadingIndex === index ? (
                                    <div className="spinner-border inventory_loader" role="status">
                                      <span className="visually-hidden ">Loading...</span>
                                    </div>
                                  ) : (
                                    'SIMILAR PRODUCTS'
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          productDetails && (
                            <div className="col-12 col-sm-6 col-xl-4">
                              <div className="wishlist-card">
                                <div className="wishlist-img position-relative">
                                  <img
                                    src={
                                      (productDetails as any).default_image ||
                                      (productDetails as any).images?.[0]
                                    }
                                    className={clsx('img-fluid', {
                                      'out-of-stock':
                                        (productDetails as any).stock_status !== 'in_stock',
                                    })}
                                    alt="diamond"
                                  />
                                  <div
                                    className="position-absolute p-1 "
                                    style={{
                                      cursor: 'pointer',
                                      top: 10,
                                      right: 10,
                                      // background: 'black',
                                      // color: 'white',
                                      // borderRadius: '50%',
                                      // width: 25,
                                      // height: 25,
                                      // display: 'flex',
                                      // alignItems: 'center',
                                      // justifyContent: 'center',
                                    }}
                                  >
                                    <Image
                                      src={xIconSVG.src}
                                      alt="X"
                                      onClick={() => handleRemoveWishlist(_id, index)}
                                      height={16}
                                      width={16}
                                    />
                                  </div>
                                  {(productDetails as any).stock_status !== 'in_stock' && (
                                    <p
                                      className="position-absolute translate-middle"
                                      style={{
                                        color: '#fff',
                                        background: '#ff0000',
                                        padding: '1px 10px',
                                        fontSize: '12px',
                                        top: '92%',
                                        left: '50%',
                                      }}
                                    >
                                      OUT OF STOCK
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={clsx('wishlist-body', {
                                    'out-of-stock':
                                      (productDetails as any).stock_status !== 'in_stock',
                                  })}
                                >
                                  <p className="product-name">
                                    {(productDetails as any).name.toUpperCase()} -{' '}
                                    {(productDetails as any).parent_sku}
                                  </p>
                                  <div className="d-flex align-items-center gap-2 justify-center">
                                    <p className="product-price">
                                      $
                                      {(variationDetails as any)?.sale_price?.toLocaleString(
                                        'en-US',
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                      ) ||
                                        (productDetails as any).sale_price?.toLocaleString(
                                          'en-US',
                                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                        )}
                                    </p>
                                    <del className="product-price ">
                                      $
                                      {(variationDetails as any)?.regular_price?.toLocaleString(
                                        'en-US',
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                      ) ||
                                        (productDetails as any).regular_price?.toLocaleString(
                                          'en-US',
                                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                        )}
                                    </del>
                                  </div>
                                </div>
                                {showViewBtn(productDetails, bracelet_size, ring_size) ? (
                                  <button
                                    type="button"
                                    className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                    onClick={() => {
                                      handleViewProduct(productDetails);
                                      setLoadingIndex(index);
                                    }}
                                    disabled={(productDetails as any).stock_status !== 'in_stock'}
                                  >
                                    {loadingIndex === index ? (
                                      <div
                                        className="spinner-border inventory_loader"
                                        role="status"
                                      >
                                        <span className="visually-hidden ">Loading...</span>
                                      </div>
                                    ) : (
                                      'VIEW'
                                    )}
                                  </button>
                                ) : (productDetails as any).stock_status === 'in_stock' &&
                                  is_ring ? (
                                  <button
                                    type="button"
                                    className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                    onClick={() =>
                                      handleRebuildRing(
                                        productDetails as any,
                                        variationDetails,
                                        _id,
                                        index,
                                        'product'
                                      )
                                    }
                                    disabled={(productDetails as any).stock_status !== 'in_stock'}
                                  >
                                    {loadingIndex === index ? (
                                      <div
                                        className="spinner-border inventory_loader"
                                        role="status"
                                      >
                                        <span className="visually-hidden ">Loading...</span>
                                      </div>
                                    ) : (
                                      'SELECT THIS SETTING'
                                    )}
                                  </button>
                                ) : (productDetails as any).stock_status === 'in_stock' &&
                                  !is_ring ? (
                                  <button
                                    type="button"
                                    className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                    onClick={() =>
                                      handleAddToCart(
                                        productDetails as any,
                                        variationDetails,
                                        _id,
                                        index,
                                        'product',
                                        bracelet_size,
                                        back_setting,
                                        ring_size
                                      )
                                    }
                                    disabled={(productDetails as any).stock_status !== 'in_stock'}
                                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                  >
                                    {loadingIndex === index ? (
                                      <div
                                        className="spinner-border inventory_loader"
                                        role="status"
                                      >
                                        <span className="visually-hidden ">Loading...</span>
                                      </div>
                                    ) : (
                                      'MOVE TO CART'
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                                    disabled={(productDetails as any).stock_status === 'in_stock'}
                                    onClick={() =>
                                      handleSimilarProduct(
                                        is_ring,
                                        'product',
                                        productDetails,
                                        index
                                      )
                                    }
                                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                                  >
                                    {loadingIndex === index ? (
                                      <div
                                        className="spinner-border inventory_loader"
                                        role="status"
                                      >
                                        <span className="visually-hidden ">Loading...</span>
                                      </div>
                                    ) : (
                                      'SIMILAR PRODUCTS'
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        );
                      }
                    )}
                  </div>
                </div>
              ) : (
                wishlist.length === 0 && (
                  <div className="container-fluid d-flex flex-column align-items-center mt-4">
                    <h4 className="text-uppercase fw-700">Your wishlist is empty.</h4>
                    <p className="text-center">
                      Add items that you like to your wishlist. Review them anytime and easily move
                      them to the bag
                    </p>
                    <Image
                      src={emptyWishlistImg.src}
                      alt="empty_wishlist"
                      className="img-fluid"
                      width={300}
                      height={300}
                    />
                    <button
                      type="button"
                      className="btn common_black_btn outline-btn py-2 px-4 fw-400 text-uppercase "
                      style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                      onClick={() => {
                        setWishListEmptyBtnLoader(true);
                        router.push(paths.whiteDiamondInventory.root);
                      }}
                    >
                      {wishListEmptyBtnLoader ? (
                        <div className="spinner-border inventory_loader" role="status">
                          <span className="visually-hidden ">Loading...</span>
                        </div>
                      ) : (
                        'CONTINUE SHOPPING'
                      )}
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <AddQualityCheckerDiamondToCartModal
        isOpen={Boolean(showQualityCheckModal)}
        setShowQualityCheckModal={setShowQualityCheckModal}
        currentDiamondData={currentDiamondData}
      />
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: true,
});

export default WishlistPage;
