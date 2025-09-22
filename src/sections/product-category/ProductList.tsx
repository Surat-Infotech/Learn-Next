/* eslint-disable no-plusplus */
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { FC, useMemo, useState, useEffect } from 'react';

import clsx from 'clsx';
import { useLocalStorage } from 'usehooks-ts';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Group, Select, Popover, Checkbox, Accordion } from '@mantine/core';

import { productApi } from '@/api/product';
import { collectionApi } from '@/api/collection';

import { useProduct } from '@/hooks/useProduct';

import { useRingBuilderContext } from '@/stores/ring-builder.context';

import HtmlContent from '@/utils/html-content';

import { TRangeSlider } from '@/components/ui/range-slider';
import { IProductUrl } from '@/components/product/ProductCard';
import { ProductCard, ProductCustomSettingCard } from '@/components/product';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

// ----------------------------------------------------------------------

export interface IProductListProps {
  categorySlug: string;
  productUrl: IProductUrl;
  enableFilter: boolean;
  styleFilterHide?: boolean;
}

const ProductList: FC<IProductListProps> = (props) => {
  const { categorySlug, productUrl, enableFilter, styleFilterHide = false } = props;
  const { query } = useRouter();
  const router = useRouter();
  const pathname = usePathname();
  const { ringSetting, ringDiamond } = useRingBuilderContext();
  const [faqs, setFaqs] = useState<any>(null);
  const [ringBuilderBarReset, setringBuilderBarReset] = useLocalStorage<boolean>(
    'ringBuilderBarReset',
    false
  );

  const {
    styleFilters,
    shapeFilters,
    priceFilters,
    style,
    setStyle,
    shape,
    setShape,
    price,
    setPrice,
    resetFilters,
  } = useProduct();

  function parseCollectionSlug(slug: string) {
    const shapeMatch = slug.match(
      /(round|princess|radiant|cushion|oval|emerald|pear|asscher|marquise|heart)(?=-shape)/
    );
    const styleMatch = slug.match(
      /(bezel|cluster|dainty|diamond-band|halo|hidden-halo|solitaire|three-stone|unique|vintage-inspired)(?=-style)/
    );

    return {
      shapeMatch: shapeMatch ? shapeMatch[1] : undefined,
      styleMatch: styleMatch ? styleMatch[1] : undefined,
    };
  }

  const { shapeMatch, styleMatch } = parseCollectionSlug((query.Slug as string) || '');

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    // for collection inventory page
    // if (!query.c_type) return true;
    if (query.c_type && _selected_shape === (query.shape || shapeMatch)) return true;
    if (query.c_type && !shapeMatch) return true;

    // default return value
    return false;
  }, [_selected_shape, query.c_type, query.shape, shapeMatch]);

  useEffect(() => {
    if (shapeMatch && shape !== shapeMatch) setShape(shapeMatch);
    if (styleMatch && style !== styleMatch) setStyle(styleMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeMatch, styleMatch]);

  useEffect(() => {
    if (window.location.pathname.startsWith(paths.buildRing.root)) {
      const diamondShape = ringDiamond?.diamond?.shape?.toLowerCase();
      const queryShape = (query.shape as string)?.toLowerCase();

      if (diamondShape && diamondShape !== queryShape) {
        const newQuery = { ...query, shape: diamondShape };
        router.replace({ pathname: window.location.pathname, query: newQuery }, undefined, {
          shallow: true,
        });
      } else if (!diamondShape && queryShape && shape !== queryShape) {
        setShape(queryShape);
      } else if (!diamondShape && !queryShape && shape !== '') {
        setShape('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.shape, ringDiamond?.diamond?.shape]);

  useEffect(() => {
    const desiredShape = ringSetting?.product?.diamond_type?.slug || ringDiamond?.diamond?.shape;
    if (
      desiredShape &&
      window.location.pathname.includes(paths.buildRing.root)
      // (window.location.pathname.includes(paths.buildRing.root) ||
      //   window.location.pathname.includes(paths.collections.root))
    ) {
      if (!shape || shape !== desiredShape) {
        const { Slug, ...restQuery } = query;
        if (query.shape !== desiredShape) {
          router.replace(
            {
              pathname: window.location.pathname,
              query: { ...restQuery, shape: desiredShape },
            },
            undefined,
            { shallow: true }
          );
        }
      }
    }
  }, [query, ringDiamond?.diamond?.shape, ringSetting?.product?.diamond_type?.slug, router, shape]);

  useEffect(() => {
    if (ringBuilderBarReset) {
      window.localStorage.removeItem('ring-builder-diamond');
      window.localStorage.removeItem('ring-builder-setting');
      window.localStorage.removeItem('ring-builder-size');
      setTimeout(() => {
        setringBuilderBarReset(false);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringBuilderBarReset]);

  const filter = useMemo(
    () => ({
      slug: pathname.startsWith(paths.collections.root) ? 'engagement-rings' : categorySlug,
      diamond_shape: shape || query.shape || undefined,
      sale_price:
        price[0] !== priceFilters.min || price[1] !== priceFilters.max
          ? {
              min: price[0],
              max: price[1],
            }
          : undefined,
    }),
    [pathname, categorySlug, shape, query.shape, price, priceFilters.min, priceFilters.max]
  );

  const search = useMemo(() => style.replaceAll(/[-_]/g, ' '), [style]);
  const initialPageParam = 1;
  const pageSize = 18;
  const [sort, setSort] = useState({ sale_price: 1 });
  const [collectionDetails, setCollectionDetails] = useState<any>({});

  const { data, hasNextPage, status, isFetching, isError, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: [
        '_products',
        'filter',
        {
          search,
          filter,
          page: initialPageParam,
          pageSize,
          sort,
        },
      ],
      queryFn: async ({ pageParam: page = 1 }) => {
        if (window.location.pathname.startsWith(paths.collections.root)) {
          const { data: _data } = await collectionApi.filter(query.Slug as string, {
            type: (query.type as string) || undefined,
            search,
            filter: filter as any,
            page,
            pageSize,
            sort,
          });
          if (_data.data) {
            setFilteredData(_data.data);
          }
          return _data.data;
        }
        const { data: _data } = await productApi.filter({
          search,
          filter,
          page,
          pageSize,
          sort,
        });
        return _data.data;
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.page !== lastPage.totalPages ? pages.length + 1 : undefined,
      getPreviousPageParam: (firstPage, pages) =>
        firstPage.page !== 1 ? pages.length - 1 : undefined,
      initialPageParam,
      // enabled: false,
    });

  const totalRecords = useMemo(() => data?.pages?.[0]?.totalCount ?? 0, [data]);

  const [openedStyleFilter, setOpenedStyleFilter] = useState(false);
  const [openedShapeFilter, setOpenedShapeFilter] = useState(false);
  const [openedPriceFilter, setOpenedPriceFilter] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    refetch();
    setFilteredData([]);
  }, [refetch, query.Slug, query.c_type]);

  useEffect(() => {
    (async () => {
      if (query.Slug && window.location.pathname.startsWith(paths.collections.root)) {
        setCollectionDetails({});
        setFaqs([]);
        const { data: collectionData } = await collectionApi.getSingleCollectionUsingPost(
          query.Slug as string
        );
        setCollectionDetails(collectionData?.data?.collection);
        setFaqs(collectionData?.data?.Faqs[0].detail_json);
      }
    })();
  }, [query.Slug]);

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Preparing and shuffling the array
  const numbers = shuffleArray([0, 1, 2]);
  let currentIndex = 0;

  /**
   * Disable the shape filter is diamond is selected
   */
  const disableShapeFilter = useMemo(
    () =>
      !!(ringDiamond?.diamond?.shape || ringSetting?.product?.diamond_type?.slug) ||
      isShowChooseRing,
    [ringDiamond?.diamond?.shape, ringSetting?.product?.diamond_type?.slug, isShowChooseRing]
  );

  /**
   * Reset filters when diamond is selected
   */
  const resetBuilderFilters = () => {
    if (window.location.pathname.startsWith('/collections/')) {
      resetFilters({
        style: !(styleMatch && styleMatch.length > 0),
        shape: !(shapeMatch && shapeMatch.length > 0),
        price: true,
      });

      const urlParams = new URLSearchParams(window.location.search);
      if (styleMatch) {
        setStyle(styleMatch || '');
        urlParams.set('style', styleMatch);
        urlParams.delete('price');
      } else {
        urlParams.delete('style');
      }

      if (shapeMatch) {
        setShape(shapeMatch || '');
        urlParams.set('shape', shapeMatch);
        urlParams.delete('price');
      } else {
        urlParams.delete('shape');
      }

      router.replace(
        {
          pathname: window.location.pathname,
          query: Object.fromEntries(urlParams),
        },
        undefined,
        { shallow: true }
      );
    } else {
      resetFilters({
        style: true,
        shape: window.location.pathname.includes(paths.buildRing.root)
          ? // || window.location.pathname.includes(paths.collections.root)
            !disableShapeFilter
          : true,
        price: true,
      });
    }
  };

  useEffect(() => {
    if (!query.c_type && !query.price && !query.style && !query.shape) {
      resetBuilderFilters();
      if (shapeMatch ?? shape?.length > 2) setShape(shapeMatch ?? shape);
      if (styleMatch ?? style?.length > 2) setStyle(styleMatch ?? style);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.price, query.style, query.shape]);

  useEffect(() => {
    if (query.c_type) {
      if (_selected_shape && !isShowChooseRing && shapeMatch && !shape) setShape(shapeMatch);
      if (isShowChooseRing && !shapeMatch && !shape && _selected_shape) setShape(_selected_shape);
    }
  }, [_selected_shape, isShowChooseRing, query.c_type, setShape, shape, shapeMatch]);

  useEffect(() => {
    if (styleMatch && !style) setStyle(styleMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStyle, shapeMatch, style, styleMatch]);

  useEffect(() => {
    if (styleFilterHide && style) setStyle('');
  }, [setStyle, style, styleFilterHide]);

  return (
    <div className="container-fluid mb-4 mb-md-5">
      {/* Filter */}
      <div className="ls_rbfilter">
        <div className="filters d-flex align-items-center justify-content-between">
          {enableFilter && (
            <>
              <span>Filter By :</span>
              <ul className="nav nav-pills flex-nowrap">
                {!['/chains', '/necklaces/diamond-necklaces'].includes(pathname) && (
                  <>
                    {!styleFilterHide && (
                      <li className="nav-item">
                        <Popover
                          width={200}
                          position="bottom-start"
                          shadow="md"
                          opened={openedStyleFilter}
                          onChange={setOpenedStyleFilter}
                        >
                          <Popover.Target>
                            <button
                              className={clsx('nav-link', openedStyleFilter && 'active')}
                              type="button"
                              onClick={() => setOpenedStyleFilter((o) => !o)}
                            >
                              Style
                              <i className="fa-solid fa-angle-down" />
                            </button>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Group>
                              {styleFilters.map((_filter, index) => (
                                <Checkbox
                                  key={_filter.value}
                                  value={_filter.value}
                                  label={_filter.label}
                                  checked={style === _filter.value}
                                  onChange={(e) => {
                                    setStyle(e.currentTarget.value);
                                    setOpenedStyleFilter((o) => !o);
                                  }}
                                  color="black"
                                  className="col-12"
                                />
                              ))}
                            </Group>
                          </Popover.Dropdown>
                        </Popover>
                      </li>
                    )}
                    <li className="nav-item">
                      <Popover
                        width={200}
                        position="bottom-start"
                        shadow="md"
                        opened={openedShapeFilter}
                        onChange={setOpenedShapeFilter}
                      >
                        <Popover.Target>
                          <button
                            className={clsx('nav-link', openedShapeFilter && 'active')}
                            type="button"
                            onClick={() => setOpenedShapeFilter((o) => !o)}
                          >
                            Diamond Shape
                            <i className="fa-solid fa-angle-down" />
                          </button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Group>
                            {shapeFilters.map((_filter, index) => (
                              <Checkbox
                                key={_filter.value}
                                value={_filter.value}
                                label={_filter.label}
                                checked={
                                  shape === _filter.value ||
                                  _filter.value === ringDiamond?.diamond?.sku
                                }
                                onChange={(e) => {
                                  setShape(e.currentTarget.value);
                                  setOpenedShapeFilter((o) => !o);
                                }}
                                color="black"
                                className="col-12"
                                disabled={
                                  pathname.includes(paths.buildRing.root) || isShowChooseRing
                                    ? // || pathname.includes(paths.collections.root)
                                      disableShapeFilter
                                    : false
                                }
                              />
                            ))}
                          </Group>
                        </Popover.Dropdown>
                      </Popover>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Popover
                    width={300}
                    position="bottom-start"
                    shadow="md"
                    opened={openedPriceFilter}
                    onChange={setOpenedPriceFilter}
                  >
                    <Popover.Target>
                      <button
                        className={clsx('nav-link', openedPriceFilter && 'active')}
                        type="button"
                        onClick={() => setOpenedPriceFilter((o) => !o)}
                      >
                        Price
                        <i className="fa-solid fa-angle-down" />
                      </button>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <div className="slider-box w-100 mt-5 mb-2">
                        <div className="input-box">
                          <input
                            type="number"
                            value={price[0]}
                            min={priceFilters.min}
                            max={priceFilters.max}
                            onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                          />
                          <input
                            type="number"
                            value={price[1]}
                            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                            min={priceFilters.min}
                            max={priceFilters.max}
                          />
                        </div>
                        <TRangeSlider
                          minRange={0}
                          min={priceFilters.min}
                          max={priceFilters.max}
                          step={10}
                          showLabelOnHover={false}
                          label={() => null}
                          value={price as [number, number]}
                          onChangeEnd={setPrice}
                          className="table-slider-handles w-100"
                        />
                      </div>
                    </Popover.Dropdown>
                  </Popover>
                </li>
              </ul>
            </>
          )}
          <span className="ms-auto">Sort by :</span>
          <Select
            className="price-filter-dropdown"
            // placeholder="Pick value"
            defaultValue="1"
            data={[
              { value: '1', label: 'LOW TO HIGH' },
              { value: '-1', label: 'HIGH TO LOW' },
            ]}
            onChange={(value) => setSort({ sale_price: Number(value) })}
          />
        </div>
      </div>

      {/* Results */}
      <div className="filter_item d-flex align-items-center flex-wrap">
        <p className="mb-0">{totalRecords} Results</p>

        {/* Applied filters */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Style */}
          {style && !styleFilterHide && (
            <span className="text-capitalize">
              Style : {style.replaceAll(/[-_]/g, ' ')}
              <a href="#" className="text-decoration-none ms-2" onClick={() => setStyle('')}>
                x
              </a>
            </span>
          )}

          {/* Shape */}
          {shape && (
            <span className="text-capitalize">
              Shape : {shape}
              {!(
                (router.pathname.includes(paths.buildRing.root) || isShowChooseRing)
                // || router.pathname.includes(paths.collections.root)
              ) &&
                disableShapeFilter && (
                  <a href="#" className="text-decoration-none ms-2" onClick={() => setShape('')}>
                    x
                  </a>
                )}
            </span>
          )}

          {/* Price */}
          {price[0] !== priceFilters.min || price[1] !== priceFilters.max ? (
            <span>
              Price : {price[0]} - {price[1]}
              <a
                href="#"
                className="text-decoration-none ms-2"
                onClick={() => setPrice([priceFilters.min, priceFilters.max])}
              >
                x
              </a>
            </span>
          ) : null}

          {/* Reset all */}
          {(style || shape || price[0] !== priceFilters.min || price[1] !== priceFilters.max) && (
            <a
              href="#"
              className="text-decoration-none fw-bold"
              onClick={() => resetBuilderFilters()}
            >
              Clear All
            </a>
          )}
        </div>
      </div>

      {/* No records found */}
      {!isFetching && !data?.pages?.[0]?.data.length && (
        <div className="text-center my-4 mt-md-5">
          <div className="">
            <p>
              <strong>No records found</strong> <br />
              <em>(But you can still get your custom setting. Click below to get started.)</em>
            </p>
          </div>
        </div>
      )}

      {!!data?.pages?.[0]?.data.length && (
        <div className="container custom_container px-12 px-md-0">
          <div className="row gy-3 gy-sm-4 gy-xl-5">
            {data?.pages?.map((page, pageIndex) =>
              page.data.map((item, index) => (
                <>
                  <ProductCard
                    key={`${pageIndex}-${index}`}
                    productUrl={productUrl}
                    {...item}
                    product={item}
                    settingPrice={pathname.startsWith(paths.buildRing.root)}
                    isSelected={ringSetting?.product?._id === item._id}
                  />
                  {(index + 1) % 7 === 0 && (
                    <ProductCustomSettingCard
                      randomNum={numbers[currentIndex++ % numbers.length]}
                    />
                  )}
                </>
              ))
            )}

            {!isFetching &&
              data?.pages[0]?.data.length <= 7 &&
              data?.pages?.[0]?.data.length > 0 && <ProductCustomSettingCard randomNum={1} />}
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center my-5 text-danger">
          <div>Oops! Something went wrong. Please try again.</div>
        </div>
      )}

      {/* Load more */}
      <div className="my-4 my-md-5 text-center">
        <div className="button-mode ls_ldmrsec">
          {isFetching && (
            <div className="ldmr_loading">
              <Image src={LoadingImage} alt="loader" width={30} height={30} />
            </div>
          )}

          {hasNextPage &&
            !isFetching &&
            status === 'success' &&
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
              <div className="col-lg-12">
                <HtmlContent html={collectionDetails?.description} />
              </div>
              <div className="col-lg-12">
                <HtmlContent html={collectionDetails?.description_two} />
              </div>
            </div>
            {collectionDetails && data && (
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
                                      className="text-capitalize text-decoration-none text-black"
                                      href={`/collections/${value.slug}?c_type=${value.slug.split('-')[value.slug.split('-').length - 1] === 'diamonds' ? 'diamond' : 'setting'}`}
                                    >
                                      {value.slug.replaceAll('-', ' ')}
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
                      {collectionDetails &&
                        collectionDetails?.related_search &&
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        collectionDetails?.related_search?.map((search: any) => (
                          <Link
                            href={`/collections/${search.slug}?c_type=${search.slug.split('-')[search.slug.split('-').length - 1] === 'diamonds' ? 'diamond' : 'setting'}`}
                            className="text-capitalize"
                            key={search.slug}
                          >
                            {search.slug.replaceAll('-', ' ')}
                          </Link>
                        ))}
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
                {Array.isArray(faqs) &&
                  faqs.map(
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

export default ProductList;
