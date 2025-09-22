import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { debounce } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';
import { signOut, useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Accordion } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { cartApi } from '@/api/cart';
import { collectionApi } from '@/api/collection';
import { IWhiteDiamond } from '@/api/inventory/types';

import { useDebouncedFn } from '@/hooks/useDebounce';

import { useInventoryContext } from '@/stores/inventory.context';
import { ICartItem, useCartContext } from '@/stores/cart.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import HtmlContent from '@/utils/html-content';

import InventoryDiamondModal from '@/components/inventory/InventoryDiamondInquiryModal';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

import InventoryTableRaw from '../inventory/InventoryTableRaw';
import InventoryTableHeader from '../inventory/InventoryTableHeader';

// ----------------------------------------------------------------------

export type DiamondCollectionTableProps = {};

const DiamondCollectionTable: FC<DiamondCollectionTableProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { push, query, replace } = useRouter();
  const { ringSetting, setRingDiamond } = useRingBuilderContext();
  const [localCardItems] = useLocalStorage<ICartItem[]>('cart', []);
  const [isFetchedError, setIsFetchedError] = useState<boolean>(false);
  const [diamondCollectionReset, setDiamondCollectionReset] = useLocalStorage<boolean>(
    'diamondCollectionReset',
    false
  );

  const {
    searchText,
    price,
    totalDiamond,
    appliedFilters,
    isFilterApplied,
    isFilterLoading,
    tableRowId,
    notFetchFilter,
    //
    sort,
    setTableRowId,
    setTotalDiamond,
    clearFilters,
    setSort,
    setIsFilterLoading,
    setCollectionSearchSku,
    //
    handleRemoveTableID,
  } = useInventoryContext();

  const { setCartItems } = useCartContext();

  const { data: auth, status } = useSession();

  const { Slug } = query;

  const pageSize = 50;

  const defaultSorted: { price: number; sale: number } = { sale: -1, price: 1 };

  const [faqs, setFaqs] = useState<any>(null);
  const [collectionDetails, setCollectionDetails] = useState<any>({});

  const queryFilters = useMemo(
    () => ({
      search: searchText,
      filter: appliedFilters,
      pageSize,
      sort,
    }),
    [searchText, appliedFilters, sort]
  );

  const { data, hasNextPage, isFetching, isError, refetch, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['collection', 'filter', { ...queryFilters, page: 1 }],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          if (Slug) {
            const currentSort = isFilterApplied ? sort : defaultSorted;
            if (
              (appliedFilters.carat?.max === 35 &&
                appliedFilters.depth?.max === '78' &&
                appliedFilters.lw_ratio.max === '2.75' &&
                appliedFilters.price?.max === 100000) ||
              Object.keys(currentSort).length === 0
            ) {
              return [];
            }
            const { data: _data } = await collectionApi.filter(Slug as string, {
              type: (query.type as string) || undefined,
              filter: appliedFilters as any,
              search: searchText,
              page: pageParam,
              pageSize,
              sort: isFilterApplied ? sort : defaultSorted,
            });
            if (_data.data) setIsFetchedError(false);
            return _data.data;
          }
          return null;
        } catch (error) {
          if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
          localStorage.clear();
          console.error(error);
          setIsFetchedError(true);
          return null;
        }
      },
      getNextPageParam: (lastPage: any, pages: any) =>
        lastPage?.page !== lastPage?.totalPages ? pages.length + 1 : undefined,
      getPreviousPageParam: (firstPage: any, pages: any) =>
        firstPage?.page !== 1 ? pages.length - 1 : undefined,
      initialPageParam: 1,
      enabled: true,
    });

  const refetchInventory = useDebouncedFn(refetch);

  useEffect(() => {
    if (typeof setIsFilterLoading === 'function' && (isFilterLoading || isFetching)) {
      setIsFilterLoading(isLoading);
    }
  }, [isFetching, isFilterLoading, isLoading, setIsFilterLoading]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!notFetchFilter) {
      const handler = debounce(() => {
        refetchInventory();
      }, 1000);

      handler();

      return () => {
        handler.cancel();
      };
    }
  }, [notFetchFilter, query, appliedFilters, sort, refetch, refetchInventory]);

  useEffect(() => {
    if (searchText || query.skuu) {
      setTableRowId(searchText || query.skuu?.toLocaleString().toLocaleLowerCase() || '');
    }
  }, [searchText, appliedFilters, sort, query.skuu, setTableRowId]);

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

      if (query.type === 'diamond-to-ring-builder' || query.c_type === 'diamond') {
        push(`${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${diamond?.shape}`);
      }
    },
    [push, query.c_type, query.type, ringSetting?.product, setRingDiamond]
  );

  useEffect(() => {
    if (totalDiamond === 0 && !isFilterLoading) setShowLoader(true);
  }, [totalDiamond, isFilterLoading]);

  useEffect(() => {
    if ((data?.pages[0]?.data?.length as number) > 0) {
      setTotalDiamond(data?.pages?.[0]?.totalCount as number);
    } else {
      setTotalDiamond(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    (async () => {
      if (Slug) {
        setCollectionDetails({});
        setFaqs([]);
        const { data: collectionData } = await collectionApi.getSingleCollectionUsingPost(
          Slug as string
        );
        setCollectionDetails(collectionData?.data?.collection);
        setFaqs(collectionData?.data?.Faqs[0].detail_json);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Slug]);

  const [showFooterLoader, setShowFooterLoader] = useState(false);

  useEffect(() => {
    if (!collectionDetails || Object.keys(collectionDetails).length === 0) {
      setShowFooterLoader(true);
    } else {
      setShowFooterLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionDetails, setIsFilterLoading]);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showLoader]);
  return (
    <div className="container-fluid px_0">
      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped prdctlist mb-0 mb-lg-3">
          <InventoryTableHeader sort={sort} setSort={setSort} />
          {!isFilterLoading && (
            <tbody>
              {data?.pages?.map((page: { data: any[] }) =>
                page?.data?.map((item, index) => (
                  <InventoryTableRaw
                    key={item._id}
                    review={index + 1}
                    setTableRowId={setTableRowId}
                    tableRowId={tableRowId}
                    showMoreId={item.sku === tableRowId ? item._id : ''}
                    cartDiamondSKU={cartDiamondSKU}
                    handleRemoveTableID={handleRemoveTableID}
                    {...item}
                    onAddToBag={() => onAddToBag(item)}
                    onSelectSetting={() => onSelectSetting(item)}
                  />
                ))
              )}
              {(!isFetching || !isLoading) && !showLoader && (
                <>
                  {!isError && (data?.pages?.[0]?.data?.length as number) === 0 ? (
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
                                handleRemoveTableID();
                                if (window.location.search.includes('c_type')) {
                                  replace(
                                    { pathname: window.location.pathname, query: 'c_type=diamond' },
                                    undefined,
                                    { scroll: false, shallow: true }
                                  );
                                }
                                setCollectionSearchSku('');
                                if (window.location.search.includes('?sku=')) {
                                  replace({ pathname: window.location.pathname }, undefined, {
                                    scroll: false,
                                    shallow: true,
                                  });
                                }
                                setTimeout(() => {
                                  clearFilters();
                                  handleRemoveTableID();
                                  replace(
                                    {
                                      pathname: window.location.pathname,
                                      // eslint-disable-next-line no-nested-ternary
                                      query: window.location.search.includes('c_type')
                                        ? 'c_type=diamond'
                                        : query.type
                                          ? `type=${query.type}`
                                          : '',
                                    },
                                    undefined,
                                    { scroll: false, shallow: true }
                                  );
                                }, 200);
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
                  ) : (
                    (data?.pages?.[0]?.data?.length as number) !== 1 && (
                      <tr className="inventory_tr">
                        <td colSpan={7}>
                          <div className="text-center">
                            <div className="inventory_inquiry_table_raw">
                              Looking for something specific but can’t find it? Let our team know
                              what you need.{' '}
                              <button type="button" className="ask_button" onClick={open}>
                                {' '}
                                Ask us Now
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </>
              )}
            </tbody>
          )}
        </table>
      </div>
      <InventoryDiamondModal opened={opened} onClose={close} centered size="50%" />
      {/* Load more */}
      <div className="load-more-button text-center">
        <div className="button-mode ls_ldmrsec">
          {(isFilterLoading || isFetching || showFooterLoader) && (
            <div className="ldmr_loading min-h-154 flex align-items-center justify-content-center">
              <Image src={LoadingImage} alt="loader" width={30} height={30} />
            </div>
          )}

          {hasNextPage &&
            !isFilterLoading &&
            !showFooterLoader &&
            Number((data as any)?.pages?.[0]?.totalPages) > 0 && (
              <button
                type="button"
                className="lscartbtn ls_add_to_cart"
                onClick={() => fetchNextPage()}
              >
                Load More
              </button>
            )}
        </div>
      </div>

      {/* Error */}
      {/* {(isError || isFetchedError) && (
        <div className="text-center my-5 text-danger">
          <div>Oops! Something went wrong. Please try again.</div>
        </div>
      )} */}

      {(collectionDetails?.related_search?.length > 0 ||
        collectionDetails?.related_artical?.length > 0 ||
        collectionDetails?.shop_by?.length > 0 ||
        collectionDetails?.description ||
        collectionDetails?.description_two) && (
        <div className="cut-lab-grown-diamonds mb-4">
          <div className="container">
            <h2 className="cut-heading mb-3" style={{ fontSize: '32px' }}>
              {collectionDetails?.title}
            </h2>
            <div className="row">
              {collectionDetails?.description && !collectionDetails?.description_two ? (
                <div className="col-lg-12">
                  <HtmlContent html={collectionDetails?.description} />
                </div>
              ) : (
                <>
                  <div className="col-lg-12">
                    <HtmlContent html={collectionDetails?.description} />
                  </div>
                  <div className="col-lg-12">
                    <HtmlContent html={collectionDetails?.description_two} />
                  </div>
                </>
              )}
            </div>
            {collectionDetails && (
              <>
                <div className="cut-diamond-info">
                  <div className="row row-gap-4">
                    {collectionDetails &&
                      collectionDetails?.shop_by &&
                      collectionDetails?.shop_by?.map((item: any) => (
                        <div className="col-xl-3 col-lg-4 col-md-6">
                          <h3 className="cut-list-heading mb-8">{item.title}</h3>
                          <ul className="mb-0 ps-0 cut-daimond">
                            {item.values.length > 0 &&
                              item.values.map((value: any) => (
                                  <li key={value.slug}>
                                    <Link
                                      className="text-decoration-none text-black"
                                      href={`/collections/${value.slug}?c_type=${value.slug.split('-')[value.slug.split('-').length - 1] === 'diamonds' ? 'diamond' : 'setting'}`}
                                      onClick={() => {
                                        setCollectionSearchSku('');
                                        setDiamondCollectionReset(true);
                                      }}
                                    >
                                      {value.name}
                                    </Link>
                                  </li>
                                ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
                {collectionDetails?.related_search?.length > 0 && (
                  <div className="cut-related-search mb-5">
                    <p className="fw-bold">Related Searches</p>
                    <div className="d-flex flex-wrap search-list">
                      {
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        collectionDetails &&
                          collectionDetails?.related_search &&
                          collectionDetails?.related_search?.map((search: any) => (
                            <Link
                              href={`/collections/${search.slug}?c_type=${search.slug.split('-')[search.slug.split('-').length - 1] === 'diamonds' ? 'diamond' : 'setting'}`}
                              className="text-capitalize"
                              key={search.slug}
                            >
                              {search.slug.replaceAll('-', ' ')}
                            </Link>
                          ))
                      }
                    </div>
                  </div>
                )}
                {collectionDetails?.related_artical?.length > 0 && (
                  <div className="cut-related-search">
                    <p className="fw-bold">Related Articles</p>
                    <div className="d-flex flex-wrap search-list">
                      {collectionDetails &&
                        collectionDetails?.related_artical &&
                        collectionDetails?.related_artical?.map((article: any) => (
                          <Link
                            href={`/blog/engagement-rings/${article.slug}`}
                            className="text-capitalize"
                            key={article._id}
                          >
                            {article.title}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {faqs?.[0]?.question && faqs?.[0]?.answer && (
        // Frequently Asked Questions
        <div className="engagement-faq">
          <div className="container">
            <h2
              className="text_black_secondary fw-600 mb_25 text-center"
              style={{ fontSize: '32px' }}
            >
              Frequently Asked Questions
            </h2>
            <div className="faq_accordion">
              <Accordion multiple variant="contained">
                {faqs?.map(
                  (faq: any) =>
                    faq.question &&
                    faq.answer && (
                      <Accordion.Item key={faq._id} value={faq._id}>
                        <Accordion.Control>
                          <div className="d-flex justify-content-start align-items-center">
                            <span>{faq.question}</span>
                            {faq.answer.startsWith('<iframe') && (
                              <i
                                className="fa-brands fa-youtube ms-2 text-danger"
                                style={{ fontSize: '24px' }}
                              />
                            )}
                          </div>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <HtmlContent html={faq.answer} />
                        </Accordion.Panel>
                      </Accordion.Item>
                    )
                )}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiamondCollectionTable;
