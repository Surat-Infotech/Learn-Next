/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { FC, useRef, useState, useEffect, useCallback } from 'react';

import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

import { useDisclosure } from '@mantine/hooks';

import { wishlistApi } from '@/api/wishlist';
import { IWhiteDiamond } from '@/api/inventory/types';
import { inventoriesQuery } from '@/api/inventory/inventory';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useInventoryContext } from '@/stores/inventory.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { TTooltip } from '@/components/ui/tooltip';
import ReviewSection from '@/components/inventory/ReviewSection';
// import ReviewSection from '@/components/inventory/ReviewSection';
import InventoryVideoModal from '@/components/inventory/InventoryVideoInquiryModal';

import { paths } from '@/routes/paths';
import xIconSVG from '@/assets/image/x-symbol.svg';
// import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';

// ----------------------------------------------------------------------

export type InventoryTableRawProps = IWhiteDiamond & {
  onAddToBag: () => void;
  onSelectSetting: () => void;
  tableRowId: string | undefined;
  showMoreId?: string | undefined;
  cartDiamondSKU: string[] | any;
  review: number;
  setTableRowId: (value: string) => void;
  handleRemoveTableID: () => void;
  setNotFetchFilter: (value: boolean) => void;
  notFetchFilter: boolean;
  setShowQualityCheckModal: (value: boolean) => void;
  setCurrentDiamondData: (value: any) => void;
};

const InventoryTableRaw: FC<InventoryTableRawProps> = (props) => {
  const [addToSettingLoader, setAddToSettingLoader] = useState<boolean>(false);
  const [addToBagLoader, setAddToBagLoader] = useState<boolean>(false);
  const { query, pathname } = useRouter();
  const router = useRouter();
  const { diamondSku } = useRingBuilderContext();
  const [opened, { open, close }] = useDisclosure(false);
  const searchParams = useSearchParams();
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  const [inventoryData, setInventoryData] = useState({});
  const { data: auth, status } = useSession();
  const [showWishListIcon, setShowWishListIcon] = useState<boolean>(false);

  const {
    _id,
    sku,
    shape: _shape,
    carat,
    cut: _cut,
    color: _color,
    clarity: _clarity,
    regular_price,
    sale,
    price,
    cartDiamondSKU,
    // sale_price,
    express_shipping,
    is_overnight,
    d_type: _d_type,
    certificate_type: _certificate_type,
    showMoreId,
    tableRowId,
    notFetchFilter,
    review,
    //
    onAddToBag,
    onSelectSetting,
    setNotFetchFilter,
    setTableRowId,
    handleRemoveTableID,
    setShowQualityCheckModal,
    setCurrentDiamondData,
  } = props;

  const {
    shapeFilters,
    cutFilters,
    colorFilters,
    clarityFilters,
    certificateFilters,
    methodFilters,
  } = useInventoryFilter();

  const shape = shapeFilters.find((_s) => _s.defaultValue === _shape.toLocaleLowerCase());
  const cut = cutFilters.find((_c) => _c.value === Number(_cut))?.label_view;
  const cutDescription = cutFilters.find((_c) => _c.value === Number(_cut))?.description;
  const color = colorFilters.find((_c) => _c.value === Number(_color))?.label_view;
  const colorDescription = colorFilters.find((_c) => _c.value === Number(_color))?.description;
  const clarity = clarityFilters.find((_c) => _c.value === Number(_clarity))?.label_view;
  const clarityDescription = clarityFilters.find(
    (_c) => _c.value === Number(_clarity)
  )?.description;
  const certificate_type = certificateFilters.find(
    (_c) => _c.value === Number(_certificate_type)
  )?.label;
  const d_type = methodFilters.find((_c) => _c.value === Number(_d_type))?.label;

  // const [viewMore, setViewMore] = useState(false);
  // const [viewMoreTable, setViewMoreTable] = useState(false);
  const { searchText, appliedFilters } = useInventoryContext();
  let inventoriesQueryGetId: any = _id;
  const {
    data: inventory,
    isLoading,
    refetch: refetchInventory,
  } = useQuery({
    ...inventoriesQuery.get(inventoriesQueryGetId),
    enabled: false,
  });

  useEffect(() => {
    if (inventory) setInventoryData(inventory as any);
  }, [inventory]);

  useEffect(() => {
    if (showMoreId && tableRowId) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      inventoriesQueryGetId = showMoreId;
      refetchInventory();
    }
  }, [showMoreId, tableRowId, refetchInventory]);

  useEffect(() => {
    if (inventory && tableRowId && !query.type) {
      // scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (scrollToRef.current) {
        const offset = 150;
        const elementPosition = scrollToRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [inventory, query.type, tableRowId]);

  useEffect(() => {
    if (searchText) {
      refetchInventory();
    }
  }, [tableRowId, refetchInventory, searchText]);

  useEffect(() => {
    if (Object.keys(appliedFilters).length > 0 && !query.c_type) {
      setTableRowId((query.skuu as string) || '');
      if (!query.type && query.sku) {
        const { sku: SkuSerch, ...restQuery } = query; // Destructure out 'sku,certificate' and keep the rest

        // Remove the 'sku' query parameter but not reset the page
        router.push(
          { pathname, query: restQuery },
          { pathname, query: restQuery },
          { shallow: true }
        );
      }
    }
    if (searchText === '' && !query.skuu) {
      setTableRowId('');
    }
  }, [appliedFilters, pathname, query, router, searchText, setTableRowId]);

  const CheckDiamondexistOrNot = diamondSku?.find((item: { sku: string }) => item.sku === sku)?.sku;

  const handleViewMore = useCallback(
    (id?: string) => {
      if (!notFetchFilter && !query.type && !query.c_type) setNotFetchFilter(true);
      if (
        query.type === 'ring-builder' ||
        query.type === 'diamond-to-ring-builder' ||
        query.c_type === 'diamond' ||
        query.c_type === 'setting'
      ) {
        if (query.type) {
          router.push(`${paths.diamondDetail.details('white', _id as string)}?type=${query.type}`);
        } else {
          router.push(
            `${paths.diamondDetail.details('white', _id as string)}?c_type=${query.c_type}`
          );
        }
      } else {
        // Create a new URLSearchParams object with all current query parameters
        const newParams = new URLSearchParams(router.query as Record<string, string>);

        if (id?.toLowerCase() === tableRowId?.toLowerCase()) {
          setTableRowId('');
          newParams.delete('skuu');
        } else {
          setTableRowId(id?.toLowerCase() as string);
          newParams.set('skuu', id as string);
          refetchInventory();
        }

        // Use the router to update the URL with all query parameters
        router.push(
          {
            pathname: window.location.pathname,
            query: Object.fromEntries(newParams.entries()),
          },
          undefined,
          { shallow: true, scroll: false }
        );
      }
    },
    [
      _id,
      notFetchFilter,
      query.c_type,
      query.type,
      refetchInventory,
      router,
      setNotFetchFilter,
      setTableRowId,
      tableRowId,
    ]
  );

  useEffect(() => {
    const skuuFromUrl = searchParams.get('skuu');
    if (skuuFromUrl && skuuFromUrl !== tableRowId && query.skuu && tableRowId) {
      setTableRowId(skuuFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            router.push(paths.order.root);
          }
        });
      }
      const payloadWishlist = {
        is_ring: false,
        inventory_id: (inventoryData as any)._id,
      };
      if (type === 'add') {
        setShowWishListIcon(true);
        setInventoryData((prev) => ({
          ...prev,
          wishlistDetails: {
            _id: 'temp_id',
          },
        }));
        await wishlistApi.addWishlist(payloadWishlist).then((res: any) => {
          setInventoryData((prev) => ({
            ...prev,
            wishlistDetails: res.data?.data,
          }));
        });
      } else if (type === 'remove') {
        setShowWishListIcon(false);
        setInventoryData((prev) => ({
          ...prev,
          wishlistDetails: undefined,
        }));
        if ((inventoryData as any)?.wishlistDetails?._id !== 'temp_id')
          await wishlistApi.removeWishlist({
            wishlists: [(inventoryData as any)?.wishlistDetails?._id],
          });
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };

  return (
    <>
      <tr onClick={() => handleViewMore(sku)} className="inventory_tr">
        <td className="text-center text-md-start">
          <div className="diamond_shape_flex">
            {shape && <Image src={shape.img.src} alt={shape.img.alt} width={35} height={40} />}
            <span className="lh-1 mb_4">{shape?.label}</span>
            <div className="d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap gap-1 gap-sm-2">
              <span
                className="font_size_10 text-danger lh-1"
                style={{ display: sale ? 'inline-block' : 'none' }}
              >
                SALE
              </span>

              {is_overnight ? (
                <TTooltip label="Ship overnight if ordered by 1 AM (GMT-4). (Only USA) ">
                  <Image
                    src={overNightImage}
                    alt="over night"
                    width={17}
                    height={17}
                    className="ms-0"
                    style={{ display: is_overnight ? 'inline-block' : 'none' }}
                  />
                </TTooltip>
              ) : (
                express_shipping && (
                  <TTooltip label="Ship Within 3 Days.">
                    <Image
                      src={ShippingImg}
                      alt="shipping"
                      width={17}
                      height={17}
                      className="ms-0"
                      style={{ display: express_shipping ? 'inline-block' : 'none' }}
                    />
                  </TTooltip>
                )
              )}
            </div>
          </div>
        </td>
        <td>{carat?.toFixed(2)}</td>
        <td>{cut}</td>
        <td>{color}</td>
        <td>{clarity}</td>
        <td>
          {sale === true ? (
            <>
              <span className="font_size_13 text-light-gray-secondary text-decoration-line-through">
                ${regular_price}
              </span>{' '}
              <span className="text-danger d-block d-lg-inline">${price}</span>
            </>
          ) : (
            <span>${price}</span>
          )}
        </td>
        {/* <td>
          <button
            type="button"
            className="view_btn text-decoration-none"
            onClick={() => handleViewMore(sku)}
          >
            <span className='d-none d-lg-block'>View More</span>
            <span className='d-lg-none'>View</span>
          </button>
        </td> */}
      </tr>

      {isLoading && (
        <tr>
          <td colSpan={7}>
            <div className="py_40 position-relative">
              <div className="text-center">
                <Image src={LoadingImage} alt="loader" width={30} height={30} />
              </div>
            </div>
          </td>
        </tr>
      )}

      {(tableRowId?.replace(/[A-Za-z-]/g, '')?.toLocaleLowerCase() ||
        (query.sku && (query.sku as string).toLocaleLowerCase().replace(/[A-Za-z-]/g, '')) ||
        (searchText && searchText.toLocaleLowerCase())) ===
        sku.replace(/[A-Za-z-]/g, '').toLocaleLowerCase() &&
        inventory && (
          <tr>
            <td colSpan={7} className="view-product position-relative">
              {/* X - icon */}
              <div ref={scrollToRef} className="ls_closedtl">
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                {!query.sku && !searchText && (
                  <Image
                    src={xIconSVG.src}
                    onClick={() => {
                      handleRemoveTableID();
                    }}
                    alt="X"
                    height={16}
                    width={16}
                  />
                )}
              </div>
              <div className="container-fluid">
                <div className="row gy-3 gy-lg-5">
                  {/* Left section */}
                  <div className="col-md-6">
                    <div className="ls_wishlist_dmnd text-center">
                      {/* Image */}
                      <div className="d-flex justify-content-center align-items-center position-relative">
                        <Image
                          src={`/assets/images/whiteDiamond/${_shape}.png`}
                          alt="diamond"
                          width={100}
                          height={100}
                        />
                        <div className="wishlist-heart-icon">
                          {(auth?.user.id ===
                            (inventoryData as any)?.wishlistDetails?.customer_id ||
                            showWishListIcon) &&
                          auth?.user.id ? (
                            <i
                              className="fa-solid fa-heart"
                              style={{ fontSize: '20px', color: 'red' }}
                              onClick={() => handleWishlist('remove')}
                            />
                          ) : (
                            <i
                              className="fa-regular fa-heart"
                              style={{ fontSize: '20px' }}
                              onClick={() => handleWishlist('add')}
                            />
                          )}
                        </div>
                      </div>
                      {/* Price */}
                      <h5 className="price fw-400">
                        ${price}{' '}
                        <del className="text-light-gray-secondary font_size_13">
                          was ${regular_price}
                        </del>
                      </h5>

                      {/* Shape */}
                      <h5 className="fw-600 mb_20">{shape?.label} Cut Diamond</h5>

                      {/* CTA */}
                      <div className="d-flex align-items-center justify-content-center gap_10">
                        {/* Add to cart btn */}
                        {query.type || query.c_type ? (
                          <>
                            {!addToSettingLoader &&
                              cartDiamondSKU &&
                              !cartDiamondSKU?.includes(sku) && (
                                <button
                                  type="button"
                                  className="lscartbtn ls_add_to_cart "
                                  onClick={() => {
                                    // localStorage.removeItem('coupon');
                                    // localStorage.removeItem('couponName');
                                    if (
                                      inventory?.certificate?.length === 0 &&
                                      [4, 5].includes(inventory?.certificate_type)
                                    ) {
                                      setShowQualityCheckModal(true);
                                      setCurrentDiamondData(inventory);
                                    } else {
                                      setAddToBagLoader(true);
                                      onSelectSetting();
                                    }
                                  }}
                                >
                                  Add To Setting
                                </button>
                              )}
                            {addToSettingLoader && (
                              <button type="button" className="lscartbtn ls_add_to_cart ">
                                <div
                                  className="spinner-border text-light inventory_loader"
                                  role="status"
                                >
                                  <span className="visually-hidden ">Loading...</span>
                                </div>
                              </button>
                            )}
                          </>
                        ) : (
                          cartDiamondSKU &&
                          !cartDiamondSKU?.includes(sku) &&
                          !addToBagLoader && (
                            <button
                              type="button"
                              className="lscartbtn ls_add_to_cart "
                              onClick={() => {
                                // localStorage.removeItem('coupon');
                                // localStorage.removeItem('couponName');
                                if (
                                  inventory?.certificate?.length === 0 &&
                                  [4, 5].includes(inventory?.certificate_type)
                                ) {
                                  setShowQualityCheckModal(true);
                                  setCurrentDiamondData(inventory);
                                } else {
                                  setAddToBagLoader(true);
                                  onAddToBag();
                                }
                                // addDiamondSku('diamond', sku),
                              }}
                            >
                              {addToBagLoader ? (
                                <div
                                  className="spinner-border text-light inventory_loader"
                                  role="status"
                                >
                                  <span className="visually-hidden ">Loading...</span>
                                </div>
                              ) : (
                                'Add To Bag'
                              )}
                            </button>
                          )
                        )}
                        {(((query.c_type || query.type) &&
                          cartDiamondSKU &&
                          !cartDiamondSKU?.includes(sku)) ||
                          addToBagLoader) && (
                          <button
                            type="button"
                            className="lscartbtn ls_add_to_cart "
                            onClick={() => {
                              // localStorage.removeItem('coupon');
                              // localStorage.removeItem('couponName');
                              if (
                                inventory?.certificate?.length === 0 &&
                                [4, 5].includes(inventory?.certificate_type)
                              ) {
                                setShowQualityCheckModal(true);
                                setCurrentDiamondData(inventory);
                              } else {
                                setAddToBagLoader(true);
                                onAddToBag();
                              }
                              // addDiamondSku('diamond', sku),
                            }}
                          >
                            {addToBagLoader ? (
                              <div
                                className="spinner-border text-light inventory_loader"
                                role="status"
                              >
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
                          cartDiamondSKU?.includes(sku) && (
                            <Link href={paths.cart.root} className="lscartbtn ls_add_to_cart">
                              {' '}
                              Go to Cart
                            </Link>
                          )}
                      </div>
                      <InventoryVideoModal
                        opened={opened}
                        onClose={close}
                        centered
                        size="md"
                        sku={sku}
                      />
                      {!addToBagLoader &&
                        !addToSettingLoader &&
                        cartDiamondSKU &&
                        cartDiamondSKU?.includes(sku) && (
                          <h6 className="dmnd_msg mb-0 mt-3">
                            This Product Is Already In Your Cart.
                          </h6>
                        )}
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {/* Ask for a video btn */}
                        {inventory?.video_url && (
                          <Link
                            href={inventory?.video_url}
                            target="_blank"
                            className="video-text text-decoration-none"
                          >
                            <i className="fa-solid fa-circle-play me-1" />
                            Play Video
                          </Link>
                        )}

                        {inventory?.video_url && inventory?.certificate && (
                          <span className="mt-3">|</span>
                        )}

                        {/* Certificate */}
                        {inventory?.certificate && (
                          <Link
                            href={inventory?.certificate}
                            target="_blank"
                            className="certilink text-decoration-none"
                          >
                            <i className="fa-solid fa-eye me-1" />
                            View Certificate
                          </Link>
                        )}
                      </div>
                      <h6 className="dmnd_msg mb-0 mt-3">
                        {inventory?.is_overnight &&
                          !inventory.express_shipping &&
                          'This diamond ships overnight. Order before 12 PM EST.'}
                      </h6>
                      <h6 className="dmnd_msg mb-0 mt-3">
                        {!inventory?.is_overnight &&
                          inventory.express_shipping &&
                          'This diamond ships within 3 days. Order before 12 PM EST.'}
                      </h6>
                      <h6 className="dmnd_msg mb-0 mt-3">
                        {inventory?.video_url
                          ? 'Diamond photo is for visual purposes only. Play Video for a real diamond.'
                          : 'Diamond photo is for visual purposes only.'}
                      </h6>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="col-md-6">
                    {/* Carat */}
                    {carat && (
                      <div className="diamond_detail">
                        <div className="row">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">CARAT</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{carat.toFixed(2)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Size */}
                    {inventory.measurerment && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">SIZE (MM)</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{inventory.measurerment}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cut */}
                    {cut && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">CUT</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{cut}</h6>
                              <span>{cutDescription}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Color */}
                    {color && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">COLOR</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{color}</h6>
                              <span>{colorDescription}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Clarity */}
                    {clarity && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">CLARITY</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{clarity}</h6>
                              <span>{clarityDescription}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Certificate */}
                    <div className="diamond_detail">
                      <div className="row ">
                        <div className="col-3 px-8">
                          <div className="dttl">
                            <p className="mb-0">IN THE BOX</p>
                          </div>
                        </div>
                        <div className="col-9 px-8">
                          <div className="odesc">
                            {inventory?.certificate_type === 4 ? (
                              <h6>Diamond (Non Certified)</h6>
                            ) : (
                              <h6 className="text-capitalize">
                                Diamond,{' '}
                                {certificate_type === 'MATCHING PAIR'
                                  ? 'Matching Pair'
                                  : certificate_type}{' '}
                                {inventory?.certificate ? 'Certificate' : '(Non Certified)'}
                              </h6>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table & depth */}
                    {Number(inventory?.table) !== 0 || Number(inventory?.depth) !== 0 ? (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">TABLE & DEPTH</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>
                                {Number(inventory?.table) === 0 ? ' - ' : `${inventory?.table}%`},{' '}
                                {Number(inventory?.depth) === 0 ? ' - ' : `${inventory?.depth}%`}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}

                    {/* L/W RATIO */}
                    {inventory?.lw_ratio && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">L/W RATIO</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{inventory?.lw_ratio}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SKU */}
                    {sku && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">SKU</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{sku}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Diamond Type */}
                    {d_type && (
                      <div className="diamond_detail">
                        <div className="row ">
                          <div className="col-3 px-8">
                            <div className="dttl">
                              <p className="mb-0">GROWTH TYPE</p>
                            </div>
                          </div>
                          <div className="col-9 px-8">
                            <div className="odesc">
                              <h6>{d_type.toUpperCase()}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      {review % 26 === 0 && (
        <tr>
          <td colSpan={7} style={{ padding: '27px' }}>
            <div>
              <ReviewSection />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default InventoryTableRaw;
