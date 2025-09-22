import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { useLocalStorage } from 'usehooks-ts';
import { signOut, useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useDisclosure } from '@mantine/hooks';

import { cartApi } from '@/api/cart';
import { IWhiteDiamond } from '@/api/inventory/types';
import { inventoryApi } from '@/api/inventory/inventory';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

import { useDebouncedFn } from '@/hooks/useDebounce';

import { useInventoryContext } from '@/stores/inventory.context';
import { ICartItem, useCartContext } from '@/stores/cart.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import InventoryDiamondModal from '@/components/inventory/InventoryDiamondInquiryModal';
import AddQualityCheckerDiamondToCartModal from '@/components/inventory/QualityCheckModal';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

import InventoryTableRaw from './InventoryTableRaw';
import InventoryTableHeader from './InventoryTableHeader';

// ----------------------------------------------------------------------

export type InventoryTableProps = {};

const InventoryTable: FC<InventoryTableProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { push, query } = useRouter();
  const { ringSetting, setRingDiamond } = useRingBuilderContext();
  const [localCardItems] = useLocalStorage<ICartItem[]>('cart', []);
  const [showQualityCheckModal, setShowQualityCheckModal] = useState<Boolean>(false);
  const [currentDiamondData, setCurrentDiamondData] = useState<
    IWhiteDiamond | IColorDiamond | null
  >(null);

  const {
    searchText,
    totalDiamond,
    appliedFilters,
    isFilterApplied,
    isFilterLoading,
    tableRowId,
    notFetchFilter,
    //
    sort,
    setResetSearchText,
    setTableRowId,
    setTotalDiamond,
    clearFilters,
    setSort,
    setIsFilterLoading,
    setNotFetchFilter,
    handleRemoveTableID,
    getRandomFilterMessage,
  } = useInventoryContext();

  const { setCartItems } = useCartContext();
  const [filterMSG, setFilterMSG] = useState<string>(getRandomFilterMessage());

  const { data: auth, status } = useSession();

  const pageSize = 50;

  const defaultSorted: { price: number; sale: number } = { sale: -1, price: 1 };

  const { data, hasNextPage, isFetching, isError, refetch, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        '_inventories',
        'filter',
        {
          search: searchText,
          filter: appliedFilters,
          page: 1,
          pageSize,
          sort,
        },
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const { data: _data } = await inventoryApi.filter({
          type: query.type === 'ring-builder' ? 'ring_builder' : undefined,
          filter: appliedFilters as any,
          search: searchText,
          page: pageParam,
          pageSize,
          sort: isFilterApplied ? sort : defaultSorted,
        });
        setIsFilterLoading(false);
        return _data.data;
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.page !== lastPage.totalPages ? pages.length + 1 : undefined,
      getPreviousPageParam: (firstPage, pages) =>
        firstPage.page !== 1 ? pages.length - 1 : undefined,
      initialPageParam: 1,
      enabled: false,
    });

  const refetchInventory = useDebouncedFn(refetch);

  useMemo(() => {
    setIsFilterLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (!notFetchFilter) refetchInventory();
  }, [appliedFilters, notFetchFilter, refetchInventory, sort]);

  useEffect(() => {
    if (searchText || query.skuu) {
      setTableRowId(searchText || query.skuu?.toLocaleString().toLocaleLowerCase() || '');
    }
  }, [searchText, appliedFilters, refetchInventory, sort, query.skuu, setTableRowId]);

  const [cartDiamondSKU, setCartDiamondSKU] = useState([]);
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
    const localDiamondSKU = localCardItems
      ?.map((item: any) => item.diamond_schema?.sku)
      .filter((e) => e !== undefined);
    if (localDiamondSKU.length > 0) {
      setCartDiamondSKU(localDiamondSKU as unknown as any);
    }
  }, [localCardItems]);

  useEffect(() => {
    getCartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddToBag = useCallback(
    async (diamond: IWhiteDiamond) => {
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
      try {
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

  const onSelectSetting = useCallback(
    (diamond: IWhiteDiamond) => {
      setRingDiamond({ diamond, diamond_type: 'white' });

      if (ringSetting?.product && query.type === 'ring-builder') {
        push(paths.ringPreview.details(ringSetting?.product?._id));
        return;
      }

      if (query.type === 'diamond-to-ring-builder' && ringSetting?.product) {
        push(
          `${paths.ringPreview.details(ringSetting?.product?._id)}?type=diamond-to-ring-builder`
        );
        return;
      }

      if (query.type === 'diamond-to-ring-builder') {
        push(`${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${diamond?.shape}`);
      }
    },
    [push, query.type, ringSetting?.product, setRingDiamond]
  );

  useEffect(() => {
    if ((data?.pages[0].data.length as number) > 0) {
      setTotalDiamond(data?.pages?.[0].totalCount as number);
    } else {
      setTotalDiamond(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (totalDiamond === 0 && !isFilterLoading) setShowLoader(true);
  }, [totalDiamond, isFilterLoading]);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showLoader]);

  useEffect(() => {
    if (!isFilterLoading && totalDiamond >= 0) {
      setShowLoader(false);
      setIsFilterLoading(false);
    }
  }, [isFilterLoading, setIsFilterLoading, showLoader, totalDiamond]);

  useEffect(() => {
    if (isFilterLoading) {
      setFilterMSG(getRandomFilterMessage());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterLoading]);

  return (
    <div className="container-fluid px_0">
      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped prdctlist mb-0 mb-lg-3">
          <InventoryTableHeader sort={sort} setSort={setSort} />
          <tbody>
            {data?.pages?.map((page) =>
              page.data.map((item, index) => (
                <InventoryTableRaw
                  key={item._id}
                  review={index + 1}
                  setTableRowId={setTableRowId}
                  notFetchFilter={notFetchFilter}
                  setNotFetchFilter={setNotFetchFilter}
                  tableRowId={tableRowId}
                  showMoreId={item.sku === tableRowId ? item._id : ''}
                  cartDiamondSKU={cartDiamondSKU}
                  handleRemoveTableID={handleRemoveTableID}
                  {...item}
                  onAddToBag={() => onAddToBag(item)}
                  onSelectSetting={() => onSelectSetting(item)}
                  setShowQualityCheckModal={setShowQualityCheckModal}
                  setCurrentDiamondData={setCurrentDiamondData}
                />
              ))
            )}
            {(!isFetching || !isLoading) && !showLoader && !isFilterLoading && (
              <>
                {!isError && (data?.pages[0].data.length as number) === 0 && (
                  <tr className="inventory_tr">
                    <td colSpan={7}>
                      <div className="text-center">
                        <p className="mb-2">Zero results 😕</p>
                        <p>
                          {' '}
                          Sometimes it’s because of a filter you forgot to unset.
                          <button
                            type="button"
                            className="clear_btn_zero_result mx-1"
                            onClick={() => {
                              clearFilters();
                              if (query.type) {
                                push(
                                  {
                                    pathname: paths.whiteDiamondInventory.root,
                                    query: { type: query.type },
                                  },
                                  undefined,
                                  { scroll: false, shallow: true }
                                );
                              } else {
                                push(
                                  { pathname: paths.whiteDiamondInventory.root, query: '' },
                                  undefined,
                                  { scroll: false, shallow: true }
                                );
                              }
                            }}
                          >
                            {' '}
                            Reset Filters{' '}
                          </button>
                          can help.
                        </p>
                      </div>
                      <div className="inventory_inquiry_table_raw ">
                        <p>
                          Looking for something specific but can’t find it? Let our team know what
                          you need.{' '}
                        </p>

                        <button
                          type="button"
                          className="ask_error_button common_btn"
                          onClick={open}
                        >
                          Ask us Now
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <InventoryDiamondModal opened={opened} onClose={close} centered size="50%" />
      {/* Error */}
      {/* {isError && (
        <div className="text-center my-5 text-danger">
          <div>Oops! Something went wrong. Please try again.</div>
        </div>
      )} */}

      {/* Load more */}
      <div className="load-more-button text-center">
        <div className="button-mode ls_ldmrsec">
          {(isFetching || showLoader || isFilterLoading) && (
            <>
              <div className="ldmr_loading">
                <Image src={LoadingImage} alt="loader" width={30} height={30} />
              </div>
              <div className="inventory_inquiry_table_raw my-5">
                <span>{filterMSG}</span>
              </div>
            </>
          )}

          {hasNextPage && !isFetching && Number((data as any)?.pages?.[0]?.totalPages) > 0 && (
            <button
              type="button"
              className="lscartbtn ls_add_to_cart"
              onClick={() => {
                fetchNextPage();
                setFilterMSG(getRandomFilterMessage());
              }}
            >
              Load More
            </button>
          )}
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

export default InventoryTable;
