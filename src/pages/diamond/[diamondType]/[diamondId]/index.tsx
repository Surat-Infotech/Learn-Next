/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/media-has-caption */

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Swal from 'sweetalert2';
import { useLocalStorage } from 'usehooks-ts';
import { Carousel } from 'react-responsive-carousel';
import { signOut, useSession } from 'next-auth/react';

import { cartApi } from '@/api/cart';
import { wishlistApi } from '@/api/wishlist';
import { IWhiteDiamond } from '@/api/inventory/types';
import { inventoryApi } from '@/api/inventory/inventory';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';
import { colorInventoryApi } from '@/api/lab-created-colored-diamonds/lab-created-colored-diamonds';

import { useProduct } from '@/hooks/useProduct';
import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { ICartItem, useCartContext } from '@/stores/cart.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductHeaderWrapper } from '@/components/product';
import AddQualityCheckerDiamondToCartModal from '@/components/inventory/QualityCheckModal';

import RingBuilderBar from '@/sections/product-category/RingBuilderBar';
import RingBuilderBarForDiamondToRing from '@/sections/product-category/RingBuilderBarForDiamondToRing';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';
import frame1Img from '@/assets/image/icon/frame_1.svg';
import frame2Img from '@/assets/image/icon/frame_2.svg';
import frame3Img from '@/assets/image/icon/frame_3.svg';
import frame4Img from '@/assets/image/icon/frame_4.svg';
import frame5Img from '@/assets/image/icon/frame_5.svg';
import videoCarouselImg from '@/assets/image/Mask_Group.png';
import IGICertificateImage from '@/assets/image/Certified-IGI.jpg';
import GIACertificateImage from '@/assets/image/Certified-GIA.jpg';
import GCALCertificateImage from '@/assets/image/Certified-GICL.jpg';

// ----------------------------------------------------------------------

const DiamondDetail = () => {
  const { query, push, pathname } = useRouter();
  const { diamondType, diamondId } = query;
  const { data: auth, status } = useSession();
  const {
    colorFilters,
    clarityFilters,
    REAL_COLOR_OPTIONS,
    cutFilters,
    intensityFilters,
    methodFilters,
    certificateFilters,
  } = useInventoryFilter();

  const { ringSetting, setRingDiamond, setRingSetting, ringDiamond } = useRingBuilderContext();
  const { setCartItems } = useCartContext();
  const { shapeFilters } = useProduct();
  const [localCardItems] = useLocalStorage<ICartItem[]>('cart', []);
  const [diamondDetails, setDiamondDetails] = useState<any>(null);
  const [addToSettingLoader, setAddToSettingLoader] = useState<boolean>(false);
  const [addToBagLoader, setAddToBagLoader] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewCarouselBtn, setViewCarouselBtn] = useState(false);
  const [isCheckRingQuery, setIsCheckRingQuery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWishListIcon, setShowWishListIcon] = useState<boolean>(false);
  const [showQualityCheckModal, setShowQualityCheckModal] = useState<Boolean>(false);

  const isRingBuilderProps = () => pathname.startsWith('/ring-preview');
  const AllowRingShapes = useMemo(() => shapeFilters.map((filter) => filter.value), [shapeFilters]);

  const carouselRef = useRef<Carousel>(null);

  const certificate_type = certificateFilters.find(
    (_c) => _c.value === Number(diamondDetails?.certificate_type)
  )?.label;

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    {
      title: 'Lab Grown Diamond',
      isActive: true,
    },
  ].filter((b) => b !== null) as any;

  const [cartDiamondSKU, setCartDiamondSKU] = useState<any[]>([]);
  const dataFetchedRef = useRef(false);

  async function getCartData() {
    try {
      if (!auth && status === 'unauthenticated') return;
      if (dataFetchedRef.current) return; // Prevent further fetches
      dataFetchedRef.current = true; // Mark data as fetched
      const res = await cartApi.get();
      if (res.data.data && auth?.user) {
        const id = res.data.data
          .map((item: any) => item.diamond_schema?.sku)
          ?.filter((e: undefined) => e !== undefined);
        setCartDiamondSKU(id);
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

  useEffect(() => {
    const localDiamondSKU = localCardItems
      ?.map((item: any) => item.diamond_schema?.sku)
      .filter((e) => e !== undefined);
    if (localDiamondSKU.length > 0) {
      setCartDiamondSKU(localDiamondSKU as unknown as any);
    }
  }, [localCardItems]);

  const getDiamondTitle = useCallback(
    (diamond: IWhiteDiamond | IColorDiamond, diamond_type: string, needIcons?: boolean) => (
      <p className="text-capitalize text-start m-0">{`${diamond?.shape?.replaceAll('_', ' ')} Shape ${
        cutFilters.find((_c) => _c.value === Number(diamond?.cut))?.label_view
      } Cut ${diamond?.carat} Carat ${
        ((diamond as any)?.intensity ? REAL_COLOR_OPTIONS : colorFilters).find(
          (_c) => _c.value === Number(diamond?.color)
        )?.label_view
      } Color ${
        clarityFilters.find((_c) => _c.value === Number(diamond?.clarity))?.label_view
      } Clarity Lab Grown Diamond`}</p>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getDiamondImageSrc = (diamondDetail: any) => {
    if (!diamondDetail) return '';

    const shape = diamondDetail.shape?.toLowerCase();
    if (diamondDetail.intensity) {
      const color = REAL_COLOR_OPTIONS.find(
        (_c) => _c.value === Number(diamondDetail.color)
      )?.label_view?.toLowerCase();
      return `/assets/images/colorDiamond/${shape}/${color}.png`;
    }
    return `/assets/images/whiteDiamond/${shape}.png`;
  };

  useEffect(() => {
    const getDiamondDetails = async () => {
      if (!diamondType || !diamondId) return;
      try {
        setIsLoading(true);
        const api = diamondType === 'white' ? inventoryApi : colorInventoryApi;
        const { data, status: _status } = await api.get(diamondId as string);
        if (_status === 200) {
          setDiamondDetails(data.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        console.error('Error fetching diamond details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getDiamondDetails();
  }, [diamondType, diamondId]);

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    if (!query.c_type) return true;
    if (query.c_type && _selected_shape === diamondDetails?.shape) return true;
    return false;
  }, [_selected_shape, diamondDetails, query.c_type]);

  const onSelectSetting = useCallback(
    (diamond: IWhiteDiamond) => {
      setRingDiamond({ diamond, diamond_type: diamondType as 'white' | 'color' });

      if (query.c_type === 'diamond' && !isShowChooseRing) {
        setRingSetting(null);
        push(`${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${diamond?.shape}`);
        return;
      }

      if (query.c_type === 'setting' && !isShowChooseRing) {
        setRingSetting(null);
        push(`${paths.buildRing.root}?type=ring-builder&shape=${diamond?.shape}`);
        return;
      }

      if (
        (query.type === 'diamond-to-ring-builder' || query.c_type === 'diamond') &&
        ringSetting?.product
      ) {
        push(
          `${paths.ringPreview.details(ringSetting?.product?._id)}?type=diamond-to-ring-builder`
        );
        return;
      }

      if (
        (query.type === 'diamond-to-ring-builder' || query.c_type === 'diamond') &&
        !ringSetting?.product
      ) {
        push(`${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${diamond?.shape}`);
        return;
      }

      if (ringSetting?.product && (query.type === 'ring-builder' || query.c_type === 'setting')) {
        push(paths.ringPreview.details(ringSetting?.product?._id));
        return;
      }

      if (!ringSetting?.product && (query.type === 'ring-builder' || query.c_type === 'setting')) {
        push(`${paths.buildRing.root}?type=ring-builder&shape=${diamond?.shape}`);
      }
    },
    [
      setRingDiamond,
      diamondType,
      query.c_type,
      query.type,
      isShowChooseRing,
      ringSetting?.product,
      setRingSetting,
      push,
    ]
  );

  const onAddToBag = useCallback(
    async (diamond: IWhiteDiamond) => {
      try {
        if (!auth && status === 'unauthenticated') {
          setCartItems((prev) => [
            ...prev,
            { diamond_schema: diamond, type: 'diamond', diamond_type: 'white', quantity: 1 } as
              | ICartItem[]
              | any,
          ]);
          push(paths.cart.root);
          return;
        }
        const payload = {
          diamond_id: diamond._id,
        };
        await cartApi.add(payload);
        push(paths.cart.root);
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        console.error(error);
      }
    },
    [auth, push, setCartItems, status]
  );

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current?.increment();
    }
  };
  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current?.decrement();
    }
  };

  const getCertificateImageSrc = (certificateLink: string) => {
    if (certificateLink.includes('www.igi')) return IGICertificateImage;
    if (certificateLink.includes('www.gcal')) return GCALCertificateImage;
    if (certificateLink.includes('www.gia')) return GIACertificateImage;
    return IGICertificateImage;
  };

  // eslint-disable-next-line consistent-return
  const handleWishlist = async (type: String) => {
    try {
      if (!auth && status === 'unauthenticated') {
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
        is_ring: !!query.type,
        inventory_id: diamondDetails._id,
      };
      if (type === 'add') {
        setShowWishListIcon(true);
        setDiamondDetails((prev: any) => ({
          ...prev,
          wishlistDetails: {
            _id: 'temp_id',
          },
        }));
        await wishlistApi.addWishlist(payloadWishlist).then((res: any) => {
          setDiamondDetails((prev: any) => ({
            ...prev,
            wishlistDetails: res.data?.data,
          }));
        });
      } else if (type === 'remove') {
        setShowWishListIcon(false);
        setDiamondDetails((prev: any) => ({
          ...prev,
          wishlistDetails: undefined,
        }));
        if ((diamondDetails as any)?.wishlistDetails?._id !== 'temp_id')
          await wishlistApi.removeWishlist({ wishlists: [diamondDetails?.wishlistDetails?._id] });
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };

  return (
    <>
      <ProductHeaderWrapper>
        <TBreadcrumbs items={breadcrumbs} />
      </ProductHeaderWrapper>
      <div className="my-4">
        {(query.type === 'ring-builder' || query.c_type === 'setting') && (
          <RingBuilderBar currentStep={isRingBuilderProps() ? 'choose-size' : 'choose-diamond'} />
        )}
        {(query.type === 'diamond-to-ring-builder' || query.c_type === 'diamond') && (
          <RingBuilderBarForDiamondToRing
            currentStep={isRingBuilderProps() ? 'choose-diamond' : 'choose-setting'}
            currentShape={diamondDetails?.shape}
          />
        )}
      </div>
      {isLoading ? (
        <div className="ldmr_loading min-h-454 flex align-items-center justify-content-center">
          <Image src={LoadingImage} alt="loader" width={30} height={30} />
        </div>
      ) : (
        <div className="container-fluid mt-0 mt-md-5">
          <div className="d-flex flex-wrap flex-lg-nowrap">
            <div
              className="product_slider_image position-relative bg-img-diamond position-relative"
              onMouseEnter={() => setViewCarouselBtn(true)}
              onMouseLeave={() => setViewCarouselBtn(false)}
            >
              <div className="ring_slick_slider_for me-3 d-block">
                <Image
                  key={diamondDetails?.shape}
                  src={getDiamondImageSrc(diamondDetails)}
                  alt={`${diamondDetails?.shape} diamond`}
                  className={currentIndex === 0 ? 'product_image_active img-fluid' : 'img-fluid'}
                  width={300}
                  onClick={() => setCurrentIndex(0)}
                  height={300}
                  style={{ height: 'auto', width: '30px' }}
                  priority
                />
                {diamondDetails?.video_url && (
                  <Image
                    src={videoCarouselImg.src}
                    alt="product-image"
                    height={videoCarouselImg.height}
                    width={videoCarouselImg.width}
                    onClick={() => setCurrentIndex(1)}
                    className={currentIndex === 1 ? 'product_image_active' : ''}
                  />
                )}
                {diamondDetails?.certificate && (
                  <Link
                    href={diamondDetails?.certificate}
                    target="_blank"
                    className="certilink text-decoration-none"
                  >
                    <Image
                      src={getCertificateImageSrc(diamondDetails?.certificate).src}
                      alt="product-image"
                      height={getCertificateImageSrc(diamondDetails?.certificate).height}
                      width={getCertificateImageSrc(diamondDetails?.certificate).width}
                      style={{ marginTop: '-15px' }}
                      onClick={() => setCurrentIndex(1)}
                    />
                  </Link>
                )}
              </div>
              <div className="ring_slick_slider">
                <Carousel
                  ref={carouselRef}
                  selectedItem={currentIndex}
                  infiniteLoop
                  showThumbs={false}
                  showStatus={false}
                  showIndicators={false}
                  showArrows={false}
                  className="custom-indicators custom-indicators1"
                  onChange={(index) => {
                    setCurrentIndex(index);
                  }}
                >
                  {[
                    <div className=" d-flex justify-content-center align-items-center h-100">
                      <Image
                        key={diamondDetails?.shape}
                        src={getDiamondImageSrc(diamondDetails)}
                        alt={`${diamondDetails?.shape} diamond`}
                        className="img-fluid"
                        width={300}
                        height={300}
                        style={{ height: 'auto', width: '300px' }}
                        priority
                      />
                    </div>,
                    diamondDetails?.video_url ? (
                      <div key="video">
                        <iframe
                          src={diamondDetails?.video_url}
                          width="560"
                          height="315"
                          frameBorder="0"
                          allow="fullscreen"
                          style={{ border: 'none', height: '50vh' }}
                        />
                      </div>
                    ) : (
                      <div key="video" style={{ border: 'none', height: '50vh' }} />
                    ),
                  ]}
                </Carousel>
                {viewCarouselBtn === true && diamondDetails?.video_url && (
                  <div className="positionBtn align-items-center gap-2 d-none d-lg-flex">
                    <i className="fa-solid fa-less-than carouselButton" onClick={handlePrevClick} />
                    <i
                      className="fa-solid fa-greater-than carouselButton"
                      onClick={handleNextClick}
                    />
                  </div>
                )}
                {diamondDetails?.video_url && (
                  <div className="positionBtn d-flex align-items-center gap-2 d-lg-none">
                    <i className="fa-solid fa-less-than carouselButton" onClick={handlePrevClick} />
                    <i
                      className="fa-solid fa-greater-than carouselButton"
                      onClick={handleNextClick}
                    />
                  </div>
                )}
              </div>
              {(auth?.user.id === (diamondDetails as any)?.wishlistDetails?.customer_id ||
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
                <i
                  className="fa-regular fa-heart"
                  style={{ fontSize: '20px', position: 'absolute', top: 18, right: 18 }}
                  onClick={() => handleWishlist('add')}
                />
              )}
            </div>
            {/* pdp detail */}
            <div className="col-12 col-md-5">
              <div className="pdp_information">
                <h3 className="text-capitalize">
                  {getDiamondTitle(diamondDetails, diamondType as string, true)?.props?.children ||
                    getDiamondTitle(diamondDetails, diamondType as string, true)?.props
                      ?.children?.[0]}
                </h3>
                {diamondDetails?.certificate_no && (
                  <span>Certificate Number#: {diamondDetails?.certificate_no}</span>
                )}
                <ul className="pdp_list_detail">
                  <li>
                    {cutFilters.find((_c) => _c.value === Number(diamondDetails?.cut))?.label_view}{' '}
                    Cut
                  </li>
                  <li>
                    {
                      (diamondDetails?.intensity ? REAL_COLOR_OPTIONS : colorFilters).find(
                        (_c) => _c.value === Number(diamondDetails?.color)
                      )?.label_view
                    }{' '}
                    Color
                  </li>
                  <li>
                    {
                      clarityFilters.find((_c) => _c.value === Number(diamondDetails?.clarity))
                        ?.label_view
                    }{' '}
                    Clarity
                  </li>
                </ul>
                <div className="d-flex align-items-end gap_10 mb_10">
                  <h4 className="text_black_secondary mb-0">${diamondDetails?.price}</h4>
                  <del className="font_size_14 fw-500 text-light-gray-secondary">
                    was ${diamondDetails?.regular_price}
                  </del>
                </div>
                {/* <p className='font_size_12 text-black mb_25'>Estimated date of delivery: <span className='d-inline'>Tuesday, May 07 2024</span></p> */}
                <div className="d-flex flex-column gap_10">
                  {!cartDiamondSKU?.includes(diamondDetails?.sku) &&
                    AllowRingShapes.includes(diamondDetails?.shape) && (
                      <button
                        type="button"
                        className="btn common_black_btn w-100"
                        onClick={() => {
                          if (
                            diamondDetails?.certificate?.length === 0 &&
                            [4, 5].includes(diamondDetails?.certificate_type)
                          ) {
                            setShowQualityCheckModal(true);
                            setAddToBagLoader(false);
                            setIsCheckRingQuery(true);
                            setAddToSettingLoader(false);
                          } else {
                            setAddToSettingLoader(true);
                            onSelectSetting(diamondDetails);
                          }
                        }}
                      >
                        {addToSettingLoader ? (
                          <div className="spinner-border inventory_loader" role="status">
                            <span className="visually-hidden ">Loading...</span>
                          </div>
                        ) : (
                          'Add To Ring'
                        )}
                      </button>
                    )}
                  {(!cartDiamondSKU?.includes(diamondDetails?.sku) || addToBagLoader) && (
                    <button
                      type="button"
                      className="btn common_black_btn w-100"
                      onClick={() => {
                        // localStorage.removeItem('coupon');
                        // localStorage.removeItem('couponName');
                        if (
                          diamondDetails?.certificate?.length === 0 &&
                          [4, 5].includes(diamondDetails?.certificate_type)
                        ) {
                          setShowQualityCheckModal(true);
                          setIsCheckRingQuery(false);
                          setAddToBagLoader(false);
                          setAddToSettingLoader(false);
                        } else {
                          onAddToBag(diamondDetails);
                          setAddToBagLoader(true);
                        }
                      }}
                    >
                      {addToBagLoader ? (
                        <div className="spinner-border inventory_loader" role="status">
                          <span className="visually-hidden ">Loading...</span>
                        </div>
                      ) : (
                        'Add To Bag'
                      )}
                    </button>
                  )}
                  {!addToBagLoader &&
                    !addToSettingLoader &&
                    cartDiamondSKU &&
                    cartDiamondSKU?.includes(diamondDetails?.sku) && (
                      <button
                        type="button"
                        className="btn common_black_btn w-100"
                        onClick={() => [push(paths.cart.root)]}
                      >
                        Go to Cart
                      </button>
                    )}
                </div>
                <ul className="ls_iconcnt border-0 p-0 m-0 mt-3">
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
                    Price Match
                  </li>
                  <li>
                    <Image
                      src={frame5Img.src}
                      alt="complimentary-wrapping"
                      width={30}
                      height={30}
                    />
                    Complimentary jewelry box & bag wrapping
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="section pb-0">
            <div className="container-fluid">
              <div className="diamond_bg_color bg_light_gray">
                <h3 className="font_size_22 text_black_secondary fw-600 mb-3 mb-sm-4">
                  DIAMOND DETAILS
                </h3>
                <div className="d-flex align-items-start gap_60">
                  <table className="diamond_detail_table table mb-0">
                    {diamondDetails?.carat ? (
                      <tr>
                        <th>CARAT</th>
                        <td>{diamondDetails?.carat}</td>
                      </tr>
                    ) : null}
                    {diamondDetails?.measurerment ? (
                      <tr>
                        <th>SIZE (MM)</th>
                        <td>{diamondDetails?.measurerment}</td>
                      </tr>
                    ) : null}
                    {diamondDetails?.cut ? (
                      <tr>
                        <th>CUT</th>
                        <td>
                          {
                            cutFilters.find((_c) => _c.value === Number(diamondDetails?.cut))
                              ?.label_view
                          }
                          <p className="mb-0">
                            {
                              cutFilters.find((_c) => _c.value === Number(diamondDetails?.cut))
                                ?.description
                            }
                          </p>
                        </td>
                      </tr>
                    ) : null}
                    {diamondType !== 'color' &&
                    (diamondDetails?.color || diamondDetails?.intensity) ? (
                      <tr>
                        <th>COLOR</th>
                        <td>
                          {
                            colorFilters.find((_c) => _c.value === Number(diamondDetails?.color))
                              ?.label_view
                          }
                          <p className="mb-0">
                            {
                              colorFilters.find((_c) => _c.value === Number(diamondDetails?.color))
                                ?.description
                            }
                          </p>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <th>INTENSITY</th>
                        <td>
                          {
                            intensityFilters.find(
                              (_c) => _c.defaultValue === Number(diamondDetails?.intensity)
                            )?.label
                          }
                          <p className="mb-0">
                            {
                              intensityFilters.find(
                                (_c) => _c.defaultValue === Number(diamondDetails?.intensity)
                              )?.description
                            }
                          </p>
                        </td>
                      </tr>
                    )}
                    {diamondDetails?.clarity ? (
                      <tr>
                        <th>CLARITY</th>
                        <td>
                          {
                            clarityFilters.find(
                              (_c) => _c.value === Number(diamondDetails?.clarity)
                            )?.label_view
                          }
                          <p className="mb-0">
                            {
                              clarityFilters.find(
                                (_c) => _c.value === Number(diamondDetails?.clarity)
                              )?.description
                            }
                          </p>
                        </td>
                      </tr>
                    ) : null}
                  </table>

                  <table className="diamond_detail_table table mb-0">
                    {Number(diamondDetails?.table) !== 0 || Number(diamondDetails?.depth) !== 0 ? (
                      <tr>
                        <th>TABLE & DEPTH</th>
                        <td>
                          {Number(diamondDetails?.table) === 0
                            ? ' - '
                            : `${diamondDetails?.table}%`}
                          ,{' '}
                          {Number(diamondDetails?.depth) === 0
                            ? ' - '
                            : `${diamondDetails?.depth}%`}
                        </td>
                      </tr>
                    ) : null}
                    {diamondDetails?.lw_ratio ? (
                      <tr>
                        <th>L/W RATIO</th>
                        <td>{diamondDetails?.lw_ratio}</td>
                      </tr>
                    ) : null}
                    {Number(diamondDetails?.d_type) > 0 ? (
                      <tr>
                        <th>GROWTH TYPE</th>
                        <td>
                          {
                            methodFilters.find((_c) => _c.value === Number(diamondDetails?.d_type))
                              ?.label
                          }
                          <p className="description-text mb-0" />
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <th>SKU</th>
                      <td>
                        {diamondDetails?.sku}
                        <p className="description-text mb-0" />
                      </td>
                    </tr>
                    {diamondDetails?.certificate_type ? (
                      <tr>
                        <th>IN THE BOX</th>
                        <td className="text-capitalize">
                          {diamondDetails?.certificate_type === 4
                            ? 'Diamond (Non Certified)'
                            : `Diamond, ${certificate_type === 'MATCHING PAIR' ? 'Matching Pair' : certificate_type} ${diamondDetails?.certificate ? 'Certificate' : '(Non Certified)'}`}
                        </td>
                      </tr>
                    ) : null}
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            {/* <div className='container-fluid px-3'>
                            <h2 className='pdp_heading_text text-center mb_40'>Similar Diamonds</h2>
                            <div className='row gy-3 gy-sm-4 gy-xl-5'>
                                <div className='col-lg-3 col-md-4 col-6 px-8'>
                                    <div className="product_image_wrapper">
                                        <div>
                                            <Link href='/'>
                                                <div className='position-relative'>
                                                    <Carousel
                                                        className="custom-indicators custom-indicators1"
                                                        infiniteLoop
                                                        showThumbs={false}
                                                        showStatus={false}
                                                        showArrows={false}
                                                        interval={1200}
                                                        transitionTime={500}
                                                    >
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                    </Carousel>
                                                    <div className='sale_badge'>SALE</div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="product_details">
                                            <Link href='/' className='d-block mb-3'>4.02 Carat Round Cut Diamond</Link>
                                            <p className='diamond_price mb-0'>$597.00 <span>$497.00</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-3 col-md-4 col-6 px-8'>
                                    <div className="product_image_wrapper">
                                        <div>
                                            <Link href='/'>
                                                <div className='position-relative'>
                                                    <Carousel
                                                        className="custom-indicators custom-indicators1"
                                                        infiniteLoop
                                                        showThumbs={false}
                                                        showStatus={false}
                                                        showArrows={false}
                                                        interval={1200}
                                                        transitionTime={500}
                                                    >
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                    </Carousel>
                                                    <div className='sale_badge'>SALE</div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="product_details">
                                            <Link href='/' className='d-block mb-3'>4.02 Carat Round Cut Diamond</Link>
                                            <p className='diamond_price mb-0'>$597.00 <span>$497.00</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-3 col-md-4 col-6 px-8'>
                                    <div className="product_image_wrapper">
                                        <div>
                                            <Link href='/'>
                                                <div className='position-relative'>
                                                    <Carousel
                                                        className="custom-indicators custom-indicators1"
                                                        infiniteLoop
                                                        showThumbs={false}
                                                        showStatus={false}
                                                        showArrows={false}
                                                        interval={1200}
                                                        transitionTime={500}
                                                    >
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                    </Carousel>
                                                    <div className='sale_badge'>SALE</div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="product_details">
                                            <Link href='/' className='d-block mb-3'>4.02 Carat Round Cut Diamond</Link>
                                            <p className='diamond_price mb-0'>$597.00 <span>$497.00</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-3 col-md-4 col-6 px-8'>
                                    <div className="product_image_wrapper">
                                        <div>
                                            <Link href='/'>
                                                <div className='position-relative'>
                                                    <Carousel
                                                        className="custom-indicators custom-indicators1"
                                                        infiniteLoop
                                                        showThumbs={false}
                                                        showStatus={false}
                                                        showArrows={false}
                                                        interval={1200}
                                                        transitionTime={500}
                                                    >
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                        <Image src={frame5Img.src} alt="complimentary-wrapping" width={30} height={30} />
                                                    </Carousel>
                                                    <div className='sale_badge'>SALE</div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="product_details">
                                            <Link href='/' className='d-block mb-3'>4.02 Carat Round Cut Diamond</Link>
                                            <p className='diamond_price mb-0'>$597.00 <span>$497.00</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
          </div>
          <AddQualityCheckerDiamondToCartModal
            isOpen={Boolean(showQualityCheckModal)}
            setShowQualityCheckModal={setShowQualityCheckModal}
            currentDiamondData={diamondDetails}
            isCheckRingQuery={isCheckRingQuery}
          />
        </div>
      )}
    </>
  );
};

export default DiamondDetail;
